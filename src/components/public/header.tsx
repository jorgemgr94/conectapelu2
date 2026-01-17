import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-dark-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo size="md" />
        <div className="flex items-center gap-6">
          <Link
            href="/pets"
            className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            Adopta
          </Link>
          <Link
            href="/login"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:block"
          >
            Organizaciones
          </Link>
          <Button asChild className="bg-gradient-brand text-white hover:opacity-90">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
