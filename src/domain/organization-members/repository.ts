import type { CrudRepository } from '@/domain/common';
import type {
  CreateOrganizationMemberData,
  OrganizationMember,
  UpdateOrganizationMemberData,
} from './entity';

export type CreateOrganizationMemberDTO = CreateOrganizationMemberData & {
  createdBy: string;
  updatedBy: string;
};

export type UpdateOrganizationMemberDTO = UpdateOrganizationMemberData & {
  updatedBy: string;
};

export interface OrganizationMemberFilters {
  organizationId?: string;
  userId?: string;
  role?: OrganizationMember['role'];
}

/**
 * Organization Member Repository interface.
 * Pure CRUD - use cases handle specific queries via filters.
 */
export type OrganizationMemberRepository = CrudRepository<
  OrganizationMember,
  CreateOrganizationMemberDTO,
  UpdateOrganizationMemberDTO,
  OrganizationMemberFilters
>;
