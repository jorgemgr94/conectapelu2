export const locales = ['es-MX', 'en-US'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'es-MX';
export const localeCookieName = 'conectapelu2_locale';

export function isAppLocale(value: string | undefined): value is AppLocale {
  return locales.some((locale) => locale === value);
}
