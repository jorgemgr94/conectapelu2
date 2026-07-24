import type { usersTable } from '@/db/schema';

export type CurrentUser = typeof usersTable.$inferSelect;

interface AuthIdentity {
  id: string;
}

interface CurrentUserDependencies {
  getAuthIdentity: () => Promise<AuthIdentity | null>;
  findUserById: (id: string) => Promise<CurrentUser | null>;
}

export type AuthorizationErrorCode = 'UNAUTHENTICATED' | 'INACTIVE' | 'FORBIDDEN';

export class AuthorizationError extends Error {
  constructor(readonly code: AuthorizationErrorCode) {
    super(code);
    this.name = 'AuthorizationError';
  }
}

export async function resolveCurrentUser({
  getAuthIdentity,
  findUserById,
}: CurrentUserDependencies): Promise<CurrentUser | null> {
  const identity = await getAuthIdentity();
  if (!identity) {
    return null;
  }

  return findUserById(identity.id);
}

export function createAuthorization(loadCurrentUser: () => Promise<CurrentUser | null>) {
  async function requireUser(): Promise<CurrentUser> {
    const user = await loadCurrentUser();

    if (!user) {
      throw new AuthorizationError('UNAUTHENTICATED');
    }

    if (user.status !== 'active') {
      throw new AuthorizationError('INACTIVE');
    }

    return user;
  }

  async function requireAppAdmin(): Promise<CurrentUser> {
    const user = await requireUser();

    if (user.role !== 'app_admin') {
      throw new AuthorizationError('FORBIDDEN');
    }

    return user;
  }

  return { requireUser, requireAppAdmin };
}
