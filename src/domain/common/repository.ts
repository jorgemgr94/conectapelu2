/**
 * Generic CRUD Repository interfaces with pagination support.
 * All queries are bounded by default for safety.
 */

// Base entity type - all entities must have an id
export interface BaseEntity {
  id: string;
}

// ============================================================================
// Query Options & Results
// ============================================================================

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

// ============================================================================
// Base CRUD Repository
// ============================================================================

/**
 * Base CRUD Repository interface with pagination support.
 *
 * @template T - The entity type
 * @template CreateDTO - Data required to create an entity
 * @template UpdateDTO - Data that can be updated on an entity
 * @template TFilters - Optional filter type for queries (defaults to never = no filters)
 */
export interface CrudRepository<T extends BaseEntity, CreateDTO, UpdateDTO, TFilters = never> {
  /**
   * Find entities with pagination and optional filters.
   * @param options - Pagination and filter options
   */
  find(options?: QueryOptions<TFilters>): Promise<PaginatedResult<T>>;

  findById(id: string): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T | null>;
  delete(id: string): Promise<boolean>;

  /**
   * Count total entities (optionally with filters).
   */
  count(filters?: TFilters): Promise<number>;
}

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Normalize pagination options with defaults and bounds.
 */
export function normalizePagination(options?: PaginationOptions): Required<PaginationOptions> {
  const page = Math.max(1, options?.page ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, options?.limit ?? DEFAULT_LIMIT));
  return { page, limit };
}

/**
 * Build pagination metadata from total count and normalized options.
 */
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
