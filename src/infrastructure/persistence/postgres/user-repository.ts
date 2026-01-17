import { desc, count as drizzleCount, eq } from 'drizzle-orm';

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import {
  buildPaginationMeta,
  normalizePagination,
  type PaginatedResult,
  type QueryOptions,
} from '@/domain/common';
import type { CreateUserData, UpdateUserData, User, UserRepository } from '@/domain/users';

export const postgresUserRepository: UserRepository = {
  async find(options?: QueryOptions): Promise<PaginatedResult<User>> {
    const { page, limit } = normalizePagination(options);
    const offset = (page - 1) * limit;

    const [countResult] = await db.select({ count: drizzleCount() }).from(usersTable);
    const total = countResult?.count ?? 0;

    const data = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: buildPaginationMeta(total, { page, limit }),
    };
  },

  async findById(id: string): Promise<User | null> {
    const results = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return results[0] ?? null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const results = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return results[0] ?? null;
  },

  async create(data: CreateUserData): Promise<User> {
    const results = await db
      .insert(usersTable)
      .values({
        ...data,
        phone: data.phone ?? null,
        address: data.address ?? null,
        avatar: data.avatar ?? null,
        cityId: data.cityId ?? null,
        role: data.role ?? 'user',
        status: data.status ?? 'active',
      })
      .returning();
    return results[0];
  },

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const results = await db
      .update(usersTable)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(usersTable.id, id))
      .returning();
    return results[0] ?? null;
  },

  // Soft delete: set status to inactive
  async delete(id: string): Promise<boolean> {
    const result = await db
      .update(usersTable)
      .set({ status: 'inactive', updatedAt: new Date().toISOString() })
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id });
    return result.length > 0;
  },

  async count(): Promise<number> {
    const [result] = await db.select({ count: drizzleCount() }).from(usersTable);
    return result?.count ?? 0;
  },
};
