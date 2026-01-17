import { and, count as drizzleCount, desc, eq, ilike, or, type SQL } from 'drizzle-orm';

import { db } from '@/db';
import { organizationsTable } from '@/db/schema';
import type { PaginatedResult, QueryOptions } from '@/domain/common';
import { buildPaginationMeta, normalizePagination } from '@/domain/common';
import type {
  CreateOrganizationData,
  Organization,
  OrganizationFilters,
  OrganizationRepository,
  UpdateOrganizationData,
} from '@/domain/organizations';
import { createDrizzleRepository } from '../drizzle-repository-factory';

// Create base CRUD repository using the factory
const baseRepository = createDrizzleRepository<
  Organization,
  CreateOrganizationData,
  UpdateOrganizationData
>({
  table: organizationsTable,
  orderByColumn: 'createdAt',
  orderDirection: 'desc',
});

/**
 * Build WHERE conditions from OrganizationFilters
 */
function buildWhereConditions(filters?: OrganizationFilters): SQL | undefined {
  if (!filters) return undefined;

  const conditions: SQL[] = [];

  // Text search across name, slug, and description
  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(organizationsTable.name, searchPattern),
        ilike(organizationsTable.slug, searchPattern),
        ilike(organizationsTable.description, searchPattern),
      )!,
    );
  }

  // Status filter
  if (filters.status) {
    conditions.push(eq(organizationsTable.status, filters.status));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

// Extend with organization-specific methods
export const organizationRepository: OrganizationRepository = {
  ...baseRepository,

  // Override find to support filters
  async find(
    options?: QueryOptions<OrganizationFilters>,
  ): Promise<PaginatedResult<Organization>> {
    const { page, limit } = normalizePagination(options);
    const offset = (page - 1) * limit;
    const whereConditions = buildWhereConditions(options?.filters);

    // Get total count with filters
    const countQuery = db.select({ count: drizzleCount() }).from(organizationsTable);
    if (whereConditions) {
      countQuery.where(whereConditions);
    }
    const [countResult] = await countQuery;
    const total = countResult?.count ?? 0;

    // Get paginated data with filters
    const dataQuery = db.select().from(organizationsTable);
    if (whereConditions) {
      dataQuery.where(whereConditions);
    }
    const data = await dataQuery.orderBy(desc(organizationsTable.createdAt)).limit(limit).offset(offset);

    return {
      data: data as Organization[],
      pagination: buildPaginationMeta(total, { page, limit }),
    };
  },

  // Override count to support filters
  async count(filters?: OrganizationFilters): Promise<number> {
    const whereConditions = buildWhereConditions(filters);
    const countQuery = db.select({ count: drizzleCount() }).from(organizationsTable);
    if (whereConditions) {
      countQuery.where(whereConditions);
    }
    const [result] = await countQuery;
    return result?.count ?? 0;
  },

  // Override create to handle optional fields (convert undefined to null)
  async create(data: CreateOrganizationData): Promise<Organization> {
    return baseRepository.create({
      ...data,
      description: data.description ?? null,
      logo: data.logo ?? null,
    } as CreateOrganizationData);
  },

  // Organization-specific: find by slug
  async findBySlug(slug: string): Promise<Organization | null> {
    const results = await db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.slug, slug));
    return results[0] ?? null;
  },
};
