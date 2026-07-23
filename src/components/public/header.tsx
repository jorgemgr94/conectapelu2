import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Logo } from '@/components/ui/logo';

export function PublicHeader() {
  const navigation = useTranslations('Navigation');
  const t = useTranslations('Public');

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-dark-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo size="md" />
        <div className="flex items-center gap-6">
          <LocaleSwitcher />
          <Link
            href="/pets"
            className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            {navigation('adopt')}
          </Link>
          <Link
            href="/login"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:block"
          >
            {navigation('organizations')}
          </Link>
          <Button asChild className="bg-gradient-brand text-white hover:opacity-90">
            <Link href="/login">{t('signIn')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
