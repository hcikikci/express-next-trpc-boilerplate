import { FilterOperator, FilterCondition, SortOrder, SortOptions } from '../types/filter.types';

export function parseOperatorValue(operator: FilterOperator, value: string) {
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
}

export function parseFilterExpression(expression: string): FilterCondition | null {
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
}

export function buildWhereClause(condition: FilterCondition): Record<string, any> {
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
}

export function parseSortParams(
  sortBy: string | undefined,
  sortOrder: string | undefined,
  options: SortOptions = {},
): { [key: string]: SortOrder } {
  const { defaultField = 'createdAt', defaultOrder = 'desc' } = options;
  const field = sortBy || defaultField;
  const order = (sortOrder === 'asc' ? 'asc' : defaultOrder) as SortOrder;

  return { [field]: order };
}

export function parseDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  dateField: string = 'createdAt',
): Record<string, any> | null {
  if (!startDate && !endDate) return null;

  const dateCondition: Record<string, any> = {};

  if (startDate) {
    dateCondition.gte = new Date(startDate);
  }
  if (endDate) {
    dateCondition.lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
  }

  return { [dateField]: dateCondition };
}
