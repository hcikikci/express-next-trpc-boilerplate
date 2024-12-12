import { PaginationParams, PaginationOptions } from '../types/pagination.types';

const DEFAULT_OPTIONS: Required<PaginationOptions> = {
  maxPageSize: 100,
  defaultPageSize: 5,
};

export function normalizePaginationParams(
  params: Partial<PaginationParams>,
  options: PaginationOptions = {},
): Required<PaginationParams> {
  const { maxPageSize, defaultPageSize } = { ...DEFAULT_OPTIONS, ...options };

  const page = Math.max(1, Number(params.page) || 1);
  const requestedPageSize = Number(params.pageSize) || defaultPageSize;
  const pageSize = Math.max(1, Math.min(requestedPageSize, maxPageSize));

  return { page, pageSize };
}

export function calculatePagination(total: number, params: Required<PaginationParams>) {
  const { page, pageSize } = params;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const skip = Math.max(0, (currentPage - 1) * pageSize);

  return {
    skip,
    take: pageSize,
    metadata: {
      total,
      currentPage,
      totalPages,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}
