import { describe, expect, it } from 'vitest';
import {
  bootstrapEnvironmentSchema,
  bootstrapPets,
  buildBootstrapAccounts,
  generateTemporaryPassword,
} from './manifest';

describe('buildBootstrapAccounts', () => {
  it('creates one deterministic alias for each application role', () => {
    expect(buildBootstrapAccounts('owner@example.com')).toEqual([
      expect.objectContaining({ email: 'owner+admin@example.com', role: 'app_admin' }),
      expect.objectContaining({
        email: 'owner+org@example.com',
        role: 'organization_admin',
      }),
      expect.objectContaining({ email: 'owner+user@example.com', role: 'user' }),
    ]);
  });

  it('normalizes an existing plus alias to its base mailbox', () => {
    const accounts = buildBootstrapAccounts('Owner+staging@Example.com');

    expect(accounts.map(({ email }) => email)).toEqual([
      'owner+admin@example.com',
      'owner+org@example.com',
      'owner+user@example.com',
    ]);
  });
});

describe('generateTemporaryPassword', () => {
  it('generates non-reusable passwords with mixed character classes', () => {
    const first = generateTemporaryPassword();
    const second = generateTemporaryPassword();

    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThanOrEqual(47);
    expect(first).toMatch(/[A-Z]/);
    expect(first).toMatch(/[a-z]/);
    expect(first).toMatch(/[0-9]/);
    expect(first).toMatch(/[^A-Za-z0-9]/);
  });
});

describe('bootstrap manifest', () => {
  it('contains a compact set of pets across visible lifecycle states', () => {
    expect(bootstrapPets).toHaveLength(6);
    expect(new Set(bootstrapPets.map(({ id }) => id)).size).toBe(6);
    expect(new Set(bootstrapPets.map(({ status }) => status))).toEqual(
      new Set(['active', 'in_review', 'adopted']),
    );
  });

  it('applies safe organization defaults', () => {
    const config = bootstrapEnvironmentSchema.parse({
      BOOTSTRAP_OWNER_EMAIL: 'owner@example.com',
    });

    expect(config.BOOTSTRAP_ORGANIZATION_NAME).toBe('Refugio Esperanza');
    expect(config.BOOTSTRAP_ORGANIZATION_SLUG).toBe('refugio-esperanza');
  });
});
