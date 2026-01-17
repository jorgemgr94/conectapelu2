import { and, count as drizzleCount, desc, eq, type SQL } from 'drizzle-orm';

import { db } from '@/db';
import { organizationMembersTable } from '@/db/schema';
import type { PaginatedResult, QueryOptions } from '@/domain/common';
import { buildPaginationMeta, normalizePagination } from '@/domain/common';
import type {
  CreateOrganizationMemberData,
  OrganizationMember,
  OrganizationMemberFilters,
  OrganizationMemberRepository,
  UpdateOrganizationMemberData,
} from '@/domain/organization-members';
import { createDrizzleRepository } from '../drizzle-repository-factory';

// Create base CRUD repository using the factory
const baseRepository = createDrizzleRepository<
  OrganizationMember,
  CreateOrganizationMemberData,
  UpdateOrganizationMemberData
>({
  table: organizationMembersTable,
  orderByColumn: 'createdAt',
  orderDirection: 'desc',
});

/**
 * Build WHERE conditions from OrganizationMemberFilters
 */
function buildWhereConditions(filters?: OrganizationMemberFilters): SQL | undefined {
  if (!filters) return undefined;

  const conditions: SQL[] = [];

  if (filters.organizationId) {
    conditions.push(eq(organizationMembersTable.organizationId, filters.organizationId));
  }

  if (filters.userId) {
    conditions.push(eq(organizationMembersTable.userId, filters.userId));
  }

  if (filters.role) {
    conditions.push(eq(organizationMembersTable.role, filters.role));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

/**
 * Organization Member Repository implementation.
 * Extends base CRUD with organization-member-specific methods.
 */
export const postgresOrganizationMemberRepository: OrganizationMemberRepository = {
  ...baseRepository,

  // Override find to support filters
  async find(
    options?: QueryOptions<OrganizationMemberFilters>,
  ): Promise<PaginatedResult<OrganizationMember>> {
    const { page, limit } = normalizePagination(options);
    const offset = (page - 1) * limit;
    const whereConditions = buildWhereConditions(options?.filters);

    // Get total count with filters
    const countQuery = db.select({ count: drizzleCount() }).from(organizationMembersTable);
    if (whereConditions) {
      countQuery.where(whereConditions);
    }
    const [countResult] = await countQuery;
    const total = countResult?.count ?? 0;

    // Get paginated data with filters
    const dataQuery = db.select().from(organizationMembersTable);
    if (whereConditions) {
      dataQuery.where(whereConditions);
    }
    const data = await dataQuery
      .orderBy(desc(organizationMembersTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: data as OrganizationMember[],
      pagination: buildPaginationMeta(total, { page, limit }),
    };
  },

  // Override count to support filters
  async count(filters?: OrganizationMemberFilters): Promise<number> {
    const whereConditions = buildWhereConditions(filters);
    const countQuery = db.select({ count: drizzleCount() }).from(organizationMembersTable);
    if (whereConditions) {
      countQuery.where(whereConditions);
    }
    const [result] = await countQuery;
    return result?.count ?? 0;
  },
};
