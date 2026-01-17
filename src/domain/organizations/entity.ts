import type { organizationsTable } from '@/db/schema';

export type Organization = typeof organizationsTable.$inferSelect;

export type CreateOrganizationData = Omit<typeof organizationsTable.$inferInsert, 'id'>;
export type UpdateOrganizationData = Partial<CreateOrganizationData>;

export interface OrganizationFilters {
  search?: string;
  status?: Organization['status'];
}
