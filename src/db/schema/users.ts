import { Type } from '@sinclair/typebox';
import { boolean, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { citiesTable } from './cities';
import { timestamps } from './common';

export const userRoleEnum = pgEnum('user_role', ['app_admin', 'user', 'organization_admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive']);

export const usersTable = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  avatar: text('avatar'),
  cityId: text('city_id').references(() => citiesTable.id),
  role: userRoleEnum('role').default('user').notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  ...timestamps,
});

export const selectUserSchema = createSelectSchema(usersTable);
export const insertUserSchema = createInsertSchema(usersTable, {
  email: Type.String({ format: 'email' }),
  firstName: Type.String({ minLength: 1 }),
  lastName: Type.String({ minLength: 1 }),
});
