import { Request } from 'express';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

export type FilterCondition = {
  field: string;
  operator: FilterOperator;
  value: any;
};

export type SortOrder = 'asc' | 'desc';

export type SortCondition = {
  field: string;
  order: SortOrder;
};

export interface ParsedFilters {
  where: Record<string, any>;
  orderBy: { [key: string]: SortOrder };
  skip: number;
  take: number;
  search?: {
    query: string;
    fields: string[];
  };
}

export interface FilterOptions {
  searchableFields?: string[];
  defaultSort?: SortCondition;
  maxPageSize?: number;
  defaultPageSize?: number;
}

const parseOperatorValue = (operator: FilterOperator, value: string) => {
  switch (operator) {
    case 'in':
    case 'nin':
      return value.split(',');
    case 'eq':
    case 'neq':
      if (value.toLowerCase() === 'null') return null;
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
      if (!isNaN(Number(value))) return Number(value);
      return value;
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
      return !isNaN(Number(value)) ? Number(value) : new Date(value);
    default:
      return value;
  }
};

const parseFilterExpression = (expression: string): FilterCondition | null => {
  const match = expression.match(
    /^([a-zA-Z0-9_]+):(eq|neq|gt|gte|lt|lte|in|nin|contains|startsWith|endsWith):(.+)$/,
  );
  if (!match) return null;

  const [, field, operator, value] = match;
  return {
    field,
    operator: operator as FilterOperator,
    value: parseOperatorValue(operator as FilterOperator, value),
  };
};

const buildWhereClause = (condition: FilterCondition): Record<string, any> => {
  const { field, operator, value } = condition;

  switch (operator) {
    case 'eq':
      return { [field]: value };
    case 'neq':
      return { [field]: { not: value } };
    case 'gt':
      return { [field]: { gt: value } };
    case 'gte':
      return { [field]: { gte: value } };
    case 'lt':
      return { [field]: { lt: value } };
    case 'lte':
      return { [field]: { lte: value } };
    case 'in':
      return { [field]: { in: value } };
    case 'nin':
      return { [field]: { notIn: value } };
    case 'contains':
      return { [field]: { contains: value, mode: 'insensitive' } };
    case 'startsWith':
      return { [field]: { startsWith: value } };
    case 'endsWith':
      return { [field]: { endsWith: value } };
    default:
      return {};
  }
};

export const parseFilters = (req: Request, options: FilterOptions = {}): ParsedFilters => {
  const {
    searchableFields = [],
    defaultSort = { field: 'createdAt', order: 'desc' },
    maxPageSize = 100,
    defaultPageSize = 25,
  } = options;

  const where: Record<string, any> = {};
  const conditions: Record<string, any>[] = [];

  // Parse filters
  const filterParam = req.query.filter?.toString();
  if (filterParam) {
    const filters = filterParam.split(';').map(parseFilterExpression).filter(Boolean);
    filters.forEach(filter => {
      if (filter) {
        conditions.push(buildWhereClause(filter));
      }
    });
  }

  // Parse search
  const searchQuery = req.query.search?.toString().trim();
  if (searchQuery && searchableFields.length > 0) {
    conditions.push({
      OR: searchableFields.map(field => ({
        [field]: { contains: searchQuery, mode: 'insensitive' },
      })),
    });
  }

  // Parse date range
  const startDate = req.query.startDate?.toString();
  const endDate = req.query.endDate?.toString();
  const dateField = req.query.dateField?.toString() || 'createdAt';

  if (startDate || endDate) {
    const dateCondition: Record<string, any> = {};
    if (startDate) {
      dateCondition.gte = new Date(startDate);
    }
    if (endDate) {
      dateCondition.lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }
    conditions.push({ [dateField]: dateCondition });
  }

  // Combine all conditions
  if (conditions.length > 0) {
    where.AND = conditions;
  }

  // Parse sorting
  const sortField = req.query.sortBy?.toString() || defaultSort.field;
  const sortOrder = (req.query.sortOrder?.toString() === 'asc' ? 'asc' : 'desc') as SortOrder;

  // Parse pagination
  const page = Math.max(1, parseInt(req.query.page?.toString() || '1', 10));
  const requestedPageSize = parseInt(
    req.query.pageSize?.toString() || defaultPageSize.toString(),
    10,
  );
  const pageSize = Math.min(requestedPageSize, maxPageSize);
  const skip = (page - 1) * pageSize;

  return {
    where,
    orderBy: { [sortField]: sortOrder },
    skip,
    take: pageSize,
    ...(searchQuery && searchableFields.length > 0
      ? { search: { query: searchQuery, fields: searchableFields } }
      : {}),
  };
};
