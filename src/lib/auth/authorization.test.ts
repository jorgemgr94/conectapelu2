import { describe, expect, it, vi } from 'vitest';
import type { AuthorizationError, CurrentUser } from './authorization';
import { createAuthorization, resolveCurrentUser } from './authorization';

const activeUser: CurrentUser = {
  id: 'user-1',
  email: 'user@example.com',
  firstName: 'Test',
  lastName: 'User',
  phone: null,
  address: null,
  avatar: null,
  cityId: null,
  role: 'user',
  status: 'active',
  emailVerified: true,
  createdAt: '2026-07-23T00:00:00.000Z',
  updatedAt: '2026-07-23T00:00:00.000Z',
};

function expectAuthorizationError(code: AuthorizationError['code']) {
  return expect.objectContaining({
    name: 'AuthorizationError',
    code,
  });
}

describe('resolveCurrentUser', () => {
  it('does not query the database without an authenticated identity', async () => {
    const findUserById = vi.fn();

    await expect(
      resolveCurrentUser({
        getAuthIdentity: vi.fn().mockResolvedValue(null),
        findUserById,
      }),
    ).resolves.toBeNull();
    expect(findUserById).not.toHaveBeenCalled();
  });

  it('returns null when the authenticated identity has no database user', async () => {
    const findUserById = vi.fn().mockResolvedValue(null);

    await expect(
      resolveCurrentUser({
        getAuthIdentity: vi.fn().mockResolvedValue({ id: activeUser.id }),
        findUserById,
      }),
    ).resolves.toBeNull();
    expect(findUserById).toHaveBeenCalledWith(activeUser.id);
  });
});

describe('authorization requirements', () => {
  it('rejects a missing user', async () => {
    const { requireUser } = createAuthorization(vi.fn().mockResolvedValue(null));

    await expect(requireUser()).rejects.toEqual(expectAuthorizationError('UNAUTHENTICATED'));
  });

  it('rejects an inactive user', async () => {
    const { requireUser } = createAuthorization(
      vi.fn().mockResolvedValue({ ...activeUser, status: 'inactive' }),
    );

    await expect(requireUser()).rejects.toEqual(expectAuthorizationError('INACTIVE'));
  });

  it.each([
    'user',
    'organization_admin',
  ] as const)('rejects the %s role from admin access', async (role) => {
    const { requireAppAdmin } = createAuthorization(
      vi.fn().mockResolvedValue({ ...activeUser, role }),
    );

    await expect(requireAppAdmin()).rejects.toEqual(expectAuthorizationError('FORBIDDEN'));
  });

  it('returns an active app admin', async () => {
    const appAdmin = { ...activeUser, role: 'app_admin' as const };
    const { requireAppAdmin } = createAuthorization(vi.fn().mockResolvedValue(appAdmin));

    await expect(requireAppAdmin()).resolves.toEqual(appAdmin);
  });
});
