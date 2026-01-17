import type { organizationMembersTable, organizationsTable } from '@/db/schema';

export type OrganizationMember = typeof organizationMembersTable.$inferSelect;
export type OrganizationMemberRole = OrganizationMember['role'];

type Organization = typeof organizationsTable.$inferSelect;

export interface OrganizationMemberWithOrg extends OrganizationMember {
  organization: Pick<Organization, 'id' | 'name' | 'slug' | 'status'>;
}

export type CreateOrganizationMemberData = Omit<typeof organizationMembersTable.$inferInsert, 'id'>;
export type UpdateOrganizationMemberData = Partial<CreateOrganizationMemberData>;
