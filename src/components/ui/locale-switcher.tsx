'use client';

import { Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { setLocale } from '@/i18n/actions';
import type { AppLocale } from '@/i18n/config';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('LocaleSwitcher');
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: AppLocale) {
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-neutral-500">
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{t('label')}</span>
      <select
        aria-label={t('label')}
        value={locale}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value as AppLocale)}
        className="rounded-lg border border-current/20 bg-transparent px-2 py-1 text-sm text-inherit outline-none transition-opacity disabled:opacity-50"
      >
        <option value="es-MX">{t('spanishMexico')}</option>
        <option value="en-US">{t('englishUS')}</option>
      </select>
    </label>
  );
}
