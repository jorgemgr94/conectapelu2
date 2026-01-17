'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { organizationMembersTable, organizationsTable, usersTable } from '@/db/schema';
import type { OrganizationMemberWithOrg } from '@/domain/organization-members';
import {
  postgresOrganizationMemberRepository,
  postgresOrganizationRepository,
} from '@/infrastructure/persistence';

const memberRepository = postgresOrganizationMemberRepository;
const orgRepository = postgresOrganizationRepository;

export async function getUserMemberships(userId: string): Promise<OrganizationMemberWithOrg[]> {
  // Get memberships
  const { data: memberships } = await memberRepository.find({ filters: { userId } });
  if (memberships.length === 0) return [];

  // Get organizations for those memberships
  const orgIds = [...new Set(memberships.map((m) => m.organizationId))];
  const orgs = await Promise.all(orgIds.map((id) => orgRepository.findById(id)));
  const orgMap = new Map(orgs.filter(Boolean).map((o) => [o!.id, o!]));

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
  return orgRepository.findBySlug(slug);
}

export async function getOrganizationMembers(organizationId: string) {
  const { data } = await memberRepository.find({ filters: { organizationId } });
  return data;
}

export async function getUserMembershipForOrg(userId: string, organizationId: string) {
  const { data } = await memberRepository.find({
    filters: { userId, organizationId },
    limit: 1,
  });
  return data[0] ?? null;
}

export async function getOrganizationMembersBySlug(slug: string) {
  // First get the organization
  const org = await orgRepository.findBySlug(slug);
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
