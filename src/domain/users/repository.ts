import type { CrudRepository } from '@/domain/common';
import type { CreateUserData, UpdateUserData, User } from './entity';

/**
 * User Repository interface.
 * Extends base CRUD with user-specific methods.
 */
export interface UserRepository extends CrudRepository<User, CreateUserData, UpdateUserData> {
  /** Find user by email */
  findByEmail(email: string): Promise<User | null>;
}
