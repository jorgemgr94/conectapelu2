import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo size="md" href={undefined} />
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contacto
            </Link>
          </div>
          <p className="text-sm text-neutral-600">© 2026 ConectaPelu2. Hecho con 💜</p>
        </div>
      </div>
    </footer>
  );
}
