'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { PaginatedResult, PaginationOptions } from '@/domain/common';
import type { CreateUserData, UpdateUserData, User } from '@/domain/users';
import { postgresUserRepository } from '@/infrastructure/persistence';

const repository = postgresUserRepository;

// Admin Supabase client for user management
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function getUsers(options?: PaginationOptions): Promise<PaginatedResult<User>> {
  return repository.find(options);
}

export async function getUser(id: string): Promise<User | null> {
  return repository.findById(id);
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
    const userData: CreateUserData = {
      id: authData.user.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      avatar: data.avatar,
      role: data.role ?? 'user',
      status: 'active',
    };

    const user = await repository.create(userData);
    revalidatePath('/admin/users');

    return { success: true, user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Error interno al crear usuario' };
  }
}

export async function updateUser(id: string, data: UpdateUserData): Promise<User | null> {
  const user = await repository.update(id, data);
  if (user) {
    revalidatePath('/admin/users');
  }
  return user;
}

export async function deactivateUser(id: string): Promise<boolean> {
  const result = await repository.delete(id); // Soft delete
  if (result) {
    revalidatePath('/admin/users');
  }
  return result;
}

export async function reactivateUser(id: string): Promise<User | null> {
  const user = await repository.update(id, { status: 'active' });
  if (user) {
    revalidatePath('/admin/users');
  }
  return user;
}
