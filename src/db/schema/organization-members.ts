import { pgEnum, pgTable, text, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';

import { timestamps } from './common';
import { organizationsTable } from './organizations';
import { usersTable } from './users';

export const organizationMemberRoleEnum = pgEnum('organization_member_role', [
  'org_admin',
  'reviewer',
  'member',
]);

export const organizationMembersTable = pgTable(
  'organization_members',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizationsTable.id, { onDelete: 'cascade' }),
    role: organizationMemberRoleEnum('role').notNull().default('member'),
    createdBy: text('created_by')
      .notNull()
      .references(() => usersTable.id),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => usersTable.id),
    ...timestamps,
  },
  (table) => [
    // Prevent duplicate memberships (same user + same org)
    unique('unique_user_organization').on(table.userId, table.organizationId),
  ],
);

export const selectOrganizationMemberSchema = createSelectSchema(organizationMembersTable);
export const insertOrganizationMemberSchema = createInsertSchema(organizationMembersTable);
