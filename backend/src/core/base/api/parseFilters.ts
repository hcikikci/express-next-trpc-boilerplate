import { Request } from 'express';
import { FilterOptions, ParsedQuery, FilterCondition } from '../types/filter.types';
import { PaginationOptions } from '../types/pagination.types';
import { normalizePaginationParams } from '../utils/pagination.utils';
import {
  parseFilterExpression,
  buildWhereClause,
  parseSortParams,
  parseDateRange,
} from '../utils/filter.utils';

export interface QueryOptions extends FilterOptions {
  paginationOptions?: PaginationOptions;
}

export function parseQuery(req: Request, options: QueryOptions = {}): ParsedQuery {
  const { searchableFields = [], sortOptions, paginationOptions } = options;

  // Parse filters
  const conditions: Record<string, any>[] = [];

  // Parse filter expressions
  const filterParam = req.query.filter?.toString();
  if (filterParam) {
    const parsedFilters = filterParam
      .split(';')
      .map(parseFilterExpression)
      .filter((filter): filter is FilterCondition => filter !== null)
      .map(buildWhereClause);

    conditions.push(...parsedFilters);
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
  const dateRange = parseDateRange(
    req.query.startDate?.toString(),
    req.query.endDate?.toString(),
    req.query.dateField?.toString(),
  );
  if (dateRange) {
    conditions.push(dateRange);
  }

  // Combine all conditions
  const filters = conditions.length > 0 ? { AND: conditions } : {};

  // Parse sorting
  const sort = parseSortParams(
    req.query.sortBy?.toString(),
    req.query.sortOrder?.toString(),
    sortOptions,
  );

  // Parse pagination
  const { page, pageSize } = normalizePaginationParams(
    {
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
    },
    paginationOptions,
  );

  return {
    filters,
    sort,
    pagination: {
      page,
      pageSize,
      skip: (page - 1) * pageSize,
      take: pageSize,
    },
    ...(searchQuery && searchableFields.length > 0
      ? { search: { query: searchQuery, fields: searchableFields } }
      : {}),
  };
}
