'use server';

import { createClient } from '@supabase/supabase-js';
import { and, count, desc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';
import type { PaginatedResult, QueryOptions } from '@/lib/types';

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export interface UserFilters {
  search?: string;
  role?: User['role'];
  status?: User['status'];
}

// Admin Supabase client for user management
function getAdminClient() {
  if (!serverEnv.SUPABASE_SECRET_KEY) {
    throw new Error('SUPABASE_SECRET_KEY is required for user administration');
  }

  return createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getUsers(
  options?: QueryOptions<UserFilters>,
): Promise<PaginatedResult<User>> {
  const page = options?.page ?? 1;
  const pageSize = options?.limit ?? 10;
  const { search, role, status } = options?.filters ?? {};

  const whereConditions: SQL[] = [];

  if (role) whereConditions.push(eq(usersTable.role, role));
  if (status) whereConditions.push(eq(usersTable.status, status));

  if (search) {
    const searchLower = `%${search.toLowerCase()}%`;
    whereConditions.push(
      or(
        ilike(usersTable.email, searchLower),
        ilike(usersTable.firstName, searchLower),
        ilike(usersTable.lastName, searchLower),
      ) as SQL,
    );
  }

  const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const [totalResult] = await db.select({ count: count() }).from(usersTable).where(where);
  const total = totalResult?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const data = await db.query.usersTable.findMany({
    where,
    orderBy: [desc(usersTable.createdAt)],
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

export async function getUser(id: string): Promise<User | null> {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
  });
  return user ?? null;
}

export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: 'app_admin' | 'user' | 'organization_admin';
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const supabase = getAdminClient();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm email for admin-created users
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'No se pudo crear el usuario en Auth' };
    }

    // Create user in our database
    const [user] = await db
      .insert(usersTable)
      .values({
        id: authData.user.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        avatar: data.avatar,
        role: data.role ?? 'user',
        status: 'active',
      })
      .returning();

    revalidatePath('/admin/users');

    return { success: true, user };
  } catch (error) {
    console.error('Error creating user:', error);
    // Try to rollback auth user if db creation fails?
    // Ideally yes, but keeping it simple as per original implementation for now.
    return { success: false, error: 'Error interno al crear usuario' };
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const [user] = await db
    .update(usersTable)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(usersTable.id, id))
    .returning();

  if (user) {
    revalidatePath('/admin/users');
  }
  return user ?? null;
}

export async function deactivateUser(id: string): Promise<boolean> {
  const result = await db
    .update(usersTable)
    .set({ status: 'inactive', updatedAt: new Date().toISOString() })
    .where(eq(usersTable.id, id))
    .returning();

  if (result.length > 0) {
    revalidatePath('/admin/users');
    return true;
  }
  return false;
}

export async function reactivateUser(id: string): Promise<User | null> {
  const [user] = await db
    .update(usersTable)
    .set({ status: 'active', updatedAt: new Date().toISOString() })
    .where(eq(usersTable.id, id))
    .returning();

  if (user) {
    revalidatePath('/admin/users');
  }
  return user ?? null;
}
