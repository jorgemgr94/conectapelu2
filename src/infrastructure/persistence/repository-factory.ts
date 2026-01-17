import type { OrganizationRepository } from '@/domain/organizations';
import { postgresOrganizationRepository } from './postgres/organization-repository';

// Repository implementation type
export type RepositoryType = 'supabase' | 'drizzle';

// ============================================
// ORGANIZATION REPOSITORY FACTORY
// ============================================

/**
 * Get the organization repository based on the specified type.
 *
 * @param type - 'supabase' for fast queries with realtime support,
 *               'drizzle' for portable SQL (default)
 */
export function getOrganizationRepository(): OrganizationRepository {
  return postgresOrganizationRepository;
}

// Export concrete repositories for direct access when needed
export { postgresOrganizationRepository } from './postgres/organization-repository';
