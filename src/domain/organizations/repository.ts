import type { CrudRepository } from '@/domain/common';
import type {
  CreateOrganizationData,
  Organization,
  OrganizationFilters,
  UpdateOrganizationData,
} from './entity';


/**
 * Organization Repository interface.
 * Extends base CRUD with organization-specific methods.
 */
export interface OrganizationRepository
  extends CrudRepository<
    Organization,
    CreateOrganizationData,
    UpdateOrganizationData,
    OrganizationFilters
  > {
  /** Find organization by slug */
  findBySlug(slug: string): Promise<Organization | null>;
}
