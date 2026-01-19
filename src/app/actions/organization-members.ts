'use server';

import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/db';
import { organizationMembersTable, organizationsTable, usersTable } from '@/db/schema';

export type OrganizationMember = typeof organizationMembersTable.$inferSelect;
export type OrganizationMemberWithOrg = OrganizationMember & {
  organization: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
};

export async function getUserMemberships(userId: string): Promise<OrganizationMemberWithOrg[]> {
  // Get memberships
  const memberships = await db.query.organizationMembersTable.findMany({
    where: eq(organizationMembersTable.userId, userId),
  });

  if (memberships.length === 0) return [];

  // Get organizations for those memberships
  const orgIds = [...new Set(memberships.map((m) => m.organizationId))];
  // Fetch orgs in a single query
  const orgs = await db.query.organizationsTable.findMany({
    where: (t, { inArray }) => inArray(t.id, orgIds)
  });

  const orgMap = new Map(orgs.map((o) => [o.id, o]));

  // Combine
  return memberships.map((m) => ({
    ...m,
    organization: {
      id: orgMap.get(m.organizationId)!.id,
      name: orgMap.get(m.organizationId)!.name,
      slug: orgMap.get(m.organizationId)!.slug,
      status: orgMap.get(m.organizationId)!.status,
    },
  }));
}

export async function getOrganizationBySlug(slug: string) {
  return await db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.slug, slug)
  });
}

export async function getOrganizationMembers(organizationId: string) {
  return await db.query.organizationMembersTable.findMany({
    where: eq(organizationMembersTable.organizationId, organizationId),
    orderBy: [desc(organizationMembersTable.createdAt)],
  });
}

export async function getUserMembershipForOrg(userId: string, organizationId: string) {
  const member = await db.query.organizationMembersTable.findFirst({
    where: and(
      eq(organizationMembersTable.userId, userId),
      eq(organizationMembersTable.organizationId, organizationId)
    ),
  });
  return member ?? null;
}

export async function getOrganizationMembersBySlug(slug: string) {
  // First get the organization
  const org = await db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.slug, slug)
  });
  if (!org) return [];

  // Get members with user details
  const results = await db
    .select({
      id: organizationMembersTable.id,
      userId: organizationMembersTable.userId,
      organizationId: organizationMembersTable.organizationId,
      role: organizationMembersTable.role,
      createdBy: organizationMembersTable.createdBy,
      updatedBy: organizationMembersTable.updatedBy,
      createdAt: organizationMembersTable.createdAt,
      updatedAt: organizationMembersTable.updatedAt,
      user: {
        id: usersTable.id,
        email: usersTable.email,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        role: usersTable.role,
      },
    })
    .from(organizationMembersTable)
    .innerJoin(usersTable, eq(organizationMembersTable.userId, usersTable.id))
    .innerJoin(
      organizationsTable,
      eq(organizationMembersTable.organizationId, organizationsTable.id),
    )
    .where(eq(organizationsTable.slug, slug));

  return results;
}
