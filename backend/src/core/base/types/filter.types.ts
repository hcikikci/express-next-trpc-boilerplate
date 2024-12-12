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

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  defaultField?: string;
  defaultOrder?: SortOrder;
}

export interface FilterOptions {
  searchableFields?: string[];
  sortOptions?: SortOptions;
}

export interface ParsedQuery {
  filters: Record<string, any>;
  sort: { [key: string]: SortOrder };
  pagination: {
    page: number;
    pageSize: number;
    skip: number;
    take: number;
  };
  search?: {
    query: string;
    fields: string[];
  };
}
