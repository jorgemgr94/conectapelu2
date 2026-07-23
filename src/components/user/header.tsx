import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@/app/actions/users';
import { Button } from '@/components/ui/button';
import { getUserDisplayName, getUserInitials } from '@/lib/utils';

export function UserHeader({ user }: { user: User }) {
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-neutral-200/50 bg-white/80 px-8 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="group relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-neutral-400 transition-colors group-focus-within:text-primary-brand" />
          </div>
          <input
            type="search"
            placeholder="Buscar mascotas..."
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:border-primary-highlight focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-highlight/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          className="hidden text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 sm:flex"
        >
          <Link href="/pets">Adopta</Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-11 w-11 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-highlight opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-brand" />
          </span>
        </Button>

        <div className="h-8 w-px bg-neutral-200" />

        <Link href="/user/profile" className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-sm font-bold text-white shadow-brand">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-success" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-neutral-900">{displayName}</p>
            <p className="text-xs text-neutral-500">Mi cuenta</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
