'use server';

import { revalidatePath } from 'next/cache';
import type { PaginatedResult, QueryOptions } from '@/domain/common';
import type {
  CreateOrganizationData,
  Organization,
  OrganizationFilters,
  UpdateOrganizationData,
} from '@/domain/organizations';
import { getOrganizationRepository } from '@/infrastructure/persistence';
import { createClient } from '@/lib/supabase/server';

const repo = getOrganizationRepository();

/**
 * Get paginated organizations with optional filters.
 * All queries are bounded by default (max 100 per page).
 */
export async function getOrganizations(
  options?: QueryOptions<OrganizationFilters>,
): Promise<PaginatedResult<Organization>> {
  return repo.find(options);
}

export async function getOrganization(id: string) {
  return repo.findById(id);
}

export async function getOrganizationBySlug(slug: string) {
  return repo.findBySlug(slug);
}

export async function createOrganization(data: CreateOrganizationData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Check slug uniqueness
  const existing = await repo.findBySlug(data.slug);
  if (existing) {
    throw new Error(`Organization with slug "${data.slug}" already exists`);
  }

  const organization = await repo.create({
    ...data,
    createdBy: user.id,
    updatedBy: user.id,
  });

  revalidatePath('/admin/organizations');
  return organization;
}

export async function updateOrganization(id: string, data: UpdateOrganizationData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const organization = await repo.update(id, {
    ...data,
    updatedBy: user.id,
  });

  revalidatePath('/admin/organizations');
  revalidatePath(`/admin/organizations/${id}`);
  return organization;
}

export async function deleteOrganization(id: string) {
  await repo.delete(id);
  revalidatePath('/admin/organizations');
}
