import { asc, desc, count as drizzleCount, eq } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import type { BaseEntity, CrudRepository, PaginatedResult, QueryOptions } from '@/domain/common';
import { buildPaginationMeta, normalizePagination } from '@/domain/common';

/**
 * Configuration for creating a Drizzle repository
 */
interface DrizzleRepositoryConfig {
  /** The Drizzle table definition */
  // biome-ignore lint/suspicious/noExplicitAny: Generic table type
  table: PgTable<any>;
  /** Column name to order by for find (defaults to 'createdAt') */
  orderByColumn?: string;
  /** Order direction (defaults to 'desc') */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Creates a generic CRUD repository using Drizzle ORM.
 * All find queries return paginated results.
 *
 * @example
 * ```ts
 * const orgRepo = createDrizzleRepository<Organization, CreateOrgDTO, UpdateOrgDTO>({
 *   table: organizationsTable,
 * });
 *
 * const result = await orgRepo.find({ page: 1, limit: 20 });
 * ```
 */
export function createDrizzleRepository<TEntity extends BaseEntity, TCreateDTO, TUpdateDTO>(
  config: DrizzleRepositoryConfig,
): CrudRepository<TEntity, TCreateDTO, TUpdateDTO> {
  const { table, orderByColumn = 'createdAt', orderDirection = 'desc' } = config;

  // Get columns from table
  // biome-ignore lint/suspicious/noExplicitAny: Drizzle internal types
  const tableAny = table as any;
  const idColumn = tableAny.id;
  const orderColumn = tableAny[orderByColumn];

  return {
    async find(options?: QueryOptions): Promise<PaginatedResult<TEntity>> {
      const { page, limit } = normalizePagination(options);
      const offset = (page - 1) * limit;

      // Get total count
      const [countResult] = await db.select({ count: drizzleCount() }).from(table);
      const total = countResult?.count ?? 0;

      // Get paginated data
      let query = db.select().from(table);

      if (orderColumn) {
        const orderFn = orderDirection === 'desc' ? desc : asc;
        query = query.orderBy(orderFn(orderColumn)) as typeof query;
      }

      const data = await query.limit(limit).offset(offset);

      return {
        data: data as TEntity[],
        pagination: buildPaginationMeta(total, { page, limit }),
      };
    },

    async findById(id: string): Promise<TEntity | null> {
      const results = await db.select().from(table).where(eq(idColumn, id));
      return (results[0] as TEntity) ?? null;
    },

    async create(data: TCreateDTO): Promise<TEntity> {
      const results = await db
        .insert(table)
        .values({
          id: uuidv4(),
          ...(data as object),
        })
        .returning();

      return results[0] as TEntity;
    },

    async update(id: string, data: TUpdateDTO): Promise<TEntity | null> {
      const results = await db
        .update(table)
        .set({
          ...(data as object),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(idColumn, id))
        .returning();

      return (results[0] as TEntity) ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.delete(table).where(eq(idColumn, id)).returning({ id: idColumn });

      return result.length > 0;
    },

    async count(): Promise<number> {
      const [result] = await db.select({ count: drizzleCount() }).from(table);
      return result?.count ?? 0;
    },
  };
}
