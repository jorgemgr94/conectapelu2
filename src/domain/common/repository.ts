/**
 * Generic CRUD Repository interfaces with pagination support.
 * All queries are bounded by default for safety.
 */

// Base entity type - all entities must have an id
export interface BaseEntity {
  id: string;
}

// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Default pagination values
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Paginated response
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Base CRUD Repository interface with pagination.
 * All findAll queries are bounded by default.
 *
 * @template T - The entity type
 * @template CreateDTO - Data required to create an entity
 * @template UpdateDTO - Data that can be updated on an entity
 */
export interface CrudRepository<T extends BaseEntity, CreateDTO, UpdateDTO> {
  /**
   * Find all entities with pagination (bounded query).
   * @param options - Pagination options (defaults: page=1, limit=20)
   */
  findAll(options?: PaginationOptions): Promise<PaginatedResult<T>>;

  findById(id: string): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T | null>;
  delete(id: string): Promise<boolean>;

  /**
   * Count total entities (for pagination).
   */
  count(): Promise<number>;
}

/**
 * Helper to normalize pagination options.
 */
export function normalizePagination(options?: PaginationOptions): Required<PaginationOptions> {
  const page = Math.max(1, options?.page ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, options?.limit ?? DEFAULT_LIMIT));
  return { page, limit };
}

/**
 * Helper to build pagination metadata.
 */
export function buildPaginationMeta(
  total: number,
  options: Required<PaginationOptions>,
): PaginatedResult<never>['pagination'] {
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
