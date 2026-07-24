import { describe, expect, it } from 'vitest';
import { getSafeRedirectPath } from './auth-redirect';

describe('getSafeRedirectPath', () => {
  it('keeps internal paths and query parameters', () => {
    expect(getSafeRedirectPath('/reset-password?source=email', '/')).toBe(
      '/reset-password?source=email',
    );
  });

  it.each([
    'https://example.com',
    '//example.com',
    '/\\example.com',
    null,
  ])('rejects unsafe redirect value %s', (value) => {
    expect(getSafeRedirectPath(value, '/forgot-password')).toBe('/forgot-password');
  });
});
