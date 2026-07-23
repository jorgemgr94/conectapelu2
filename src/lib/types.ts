// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Query options with optional filters
export interface QueryOptions<TFilters = never> extends PaginationOptions {
  filters?: TFilters;
}

// Default pagination values
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated result
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Helper functions for pagination
export function normalizePagination(options?: PaginationOptions): Required<PaginationOptions> {
  const page = Math.max(1, options?.page ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, options?.limit ?? DEFAULT_LIMIT));
  return { page, limit };
}

export function buildPaginationMeta(
  total: number,
  options: Required<PaginationOptions>,
): PaginationMeta {
  const totalPages = Math.ceil(total / options.limit);
  return {
    page: options.page,
    limit: options.limit,
    total,
    totalPages,
    hasNext: options.page < totalPages,
    hasPrev: options.page > 1,
  };
}
