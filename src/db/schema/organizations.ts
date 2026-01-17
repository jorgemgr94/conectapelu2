import { Type } from '@sinclair/typebox';
import { pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';

import { timestamps } from './common';
import { usersTable } from './users';

export const organizationStatusEnum = pgEnum('organization_status', [
  'pending',
  'active',
  'suspended',
]);

export const organizationsTable = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  logo: text('logo'),
  status: organizationStatusEnum('status').default('pending').notNull(),
  createdBy: text('created_by')
    .notNull()
    .references(() => usersTable.id),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => usersTable.id),
  ...timestamps,
});

export const selectOrganizationSchema = createSelectSchema(organizationsTable);
export const insertOrganizationSchema = createInsertSchema(organizationsTable, {
  name: Type.String({ minLength: 1 }),
  slug: Type.String({ minLength: 1 }),
});
