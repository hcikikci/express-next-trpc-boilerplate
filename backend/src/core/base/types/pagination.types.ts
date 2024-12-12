export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationOptions {
  maxPageSize?: number;
  defaultPageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  metadata: {
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
