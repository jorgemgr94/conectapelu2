import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import enUS from '../../messages/en-US.json';
import esMX from '../../messages/es-MX.json';
import { defaultLocale, isAppLocale, localeCookieName } from './config';

const messagesByLocale = {
  'es-MX': esMX,
  'en-US': enUS,
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isAppLocale(requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
