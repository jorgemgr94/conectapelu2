'use server';

import { cookies } from 'next/headers';
import { isAppLocale, localeCookieName } from './config';

const oneYearInSeconds = 60 * 60 * 24 * 365;

export async function setLocale(locale: string): Promise<void> {
  if (!isAppLocale(locale)) {
    throw new Error('Unsupported locale');
  }

  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: oneYearInSeconds,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}
