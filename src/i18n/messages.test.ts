import { describe, expect, it } from 'vitest';
import english from '../../messages/en-US.json';
import spanish from '../../messages/es-MX.json';
import { defaultLocale, isAppLocale, locales } from './config';

function messageKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    messageKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('i18n configuration', () => {
  it('supports only the product locales and defaults to Mexican Spanish', () => {
    expect(locales).toEqual(['es-MX', 'en-US']);
    expect(defaultLocale).toBe('es-MX');
    expect(isAppLocale('es-MX')).toBe(true);
    expect(isAppLocale('en-US')).toBe(true);
    expect(isAppLocale('es-ES')).toBe(false);
  });

  it('keeps both message catalogs structurally equivalent', () => {
    expect(messageKeys(english).sort()).toEqual(messageKeys(spanish).sort());
  });
});
