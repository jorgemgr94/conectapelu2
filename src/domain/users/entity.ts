import type { usersTable } from '@/db/schema';

// Inferred from Drizzle schema - single source of truth
export type User = typeof usersTable.$inferSelect;
export type UserRole = User['role'];
export type UserStatus = User['status'];
export type CreateUserData = typeof usersTable.$inferInsert;
export type UpdateUserData = Partial<CreateUserData>;
