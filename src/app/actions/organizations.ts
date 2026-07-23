'use server';

import { and, count, desc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/db';
import { organizationsTable } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import type { PaginatedResult, QueryOptions } from '@/lib/types';

export type Organization = typeof organizationsTable.$inferSelect;
export type NewOrganization = typeof organizationsTable.$inferInsert;

export interface OrganizationFilters {
  search?: string;
  status?: Organization['status'];
}

export async function getOrganizations(
  options?: QueryOptions<OrganizationFilters>,
): Promise<PaginatedResult<Organization>> {
  const page = options?.page ?? 1;
  const pageSize = options?.limit ?? 10;
  const { search, status } = options?.filters ?? {};

  // Build where clause
  const whereConditions: SQL[] = [];

  if (status) {
    whereConditions.push(eq(organizationsTable.status, status));
  }

  if (search) {
    const searchLower = `%${search.toLowerCase()}%`;
    whereConditions.push(
      or(
        ilike(organizationsTable.name, searchLower),
        ilike(organizationsTable.slug, searchLower),
        ilike(organizationsTable.description, searchLower),
      ) as SQL,
    );
  }

  const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  // Get total count with filters
  const [totalResult] = await db.select({ count: count() }).from(organizationsTable).where(where);

  const total = totalResult?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // Get data with filters
  const data = await db.query.organizationsTable.findMany({
    where: where,
    orderBy: [desc(organizationsTable.createdAt)],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data,
    pagination: {
      page,
      limit: pageSize,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
  };
}

export async function getOrganization(id: string) {
  return await db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.id, id),
  });
}

export async function getOrganizationBySlug(slug: string) {
  return await db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.slug, slug),
  });
}

export async function createOrganization(
  data: Pick<NewOrganization, 'name' | 'slug' | 'description' | 'logo'>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Check slug uniqueness
  const existing = await db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.slug, data.slug),
  });

  if (existing) {
    throw new Error(`Organization with slug "${data.slug}" already exists`);
  }

  const [organization] = await db
    .insert(organizationsTable)
    .values({
      id: uuidv4(),
      ...data,
      createdBy: user.id,
      updatedBy: user.id,
    })
    .returning();

  revalidatePath('/admin/organizations');
  return organization;
}

export async function updateOrganization(
  id: string,
  data: Partial<Omit<NewOrganization, 'id' | 'createdAt' | 'createdBy'>>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const [organization] = await db
    .update(organizationsTable)
    .set({
      ...data,
      updatedBy: user.id,
      updatedAt: new Date().toISOString(), // Drizzle with mode: 'string' expects ISO string
    })
    .where(eq(organizationsTable.id, id))
    .returning();

  revalidatePath('/admin/organizations');
  revalidatePath(`/admin/organizations/${id}`);
  return organization;
}

export async function deleteOrganization(id: string) {
  await db.delete(organizationsTable).where(eq(organizationsTable.id, id));
  revalidatePath('/admin/organizations');
}
