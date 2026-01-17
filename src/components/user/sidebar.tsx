'use client';

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LogOut,
  PawPrint,
  ScrollText,
  Sparkles,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Inicio', href: '/user', icon: Home },
  { name: 'Mis Mascotas', href: '/user/pets', icon: PawPrint },
  { name: 'Apadrinamientos', href: '/user/sponsorships', icon: Sparkles },
  { name: 'Favoritos', href: '/user/favorites', icon: Heart },
  { name: 'Solicitudes', href: '/user/requests', icon: ScrollText },
  { name: 'Mi Perfil', href: '/user/profile', icon: User },
];

const UserSidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}>({
  collapsed: true,
  setCollapsed: () => {},
});

export function useUserSidebar() {
  return useContext(UserSidebarContext);
}

export function UserSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--user-sidebar-width',
      collapsed ? '80px' : '280px',
    );
  }, [collapsed]);

  return (
    <UserSidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </UserSidebarContext.Provider>
  );
}

export function UserSidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useUserSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-dark-page transition-all duration-300',
        collapsed ? 'w-20' : 'w-[280px]',
      )}
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-primary-highlight/50 to-transparent" />

      <div className="relative flex h-20 items-center justify-between border-b border-white/5 px-6">
        <Logo size="md" showText={!collapsed} href="/" />
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <div className={cn('mb-4', collapsed ? 'px-2' : 'px-3')}>
          {!collapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Mi Cuenta
            </span>
          )}
        </div>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/user' && pathname.startsWith(`${item.href}/`));
          const isExactMatch = pathname === item.href;
          const shouldHighlight = item.href === '/user' ? isExactMatch : isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                shouldHighlight
                  ? 'bg-linear-to-r from-primary-brand/20 to-primary-highlight/10 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white',
                collapsed && 'justify-center px-3',
              )}
              title={collapsed ? item.name : undefined}
            >
              {shouldHighlight && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-brand" />
              )}
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  shouldHighlight
                    ? 'text-primary-highlight'
                    : 'text-neutral-500 group-hover:text-neutral-300',
                )}
              />
              {!collapsed && <span>{item.name}</span>}
              {shouldHighlight && !collapsed && (
                <PawPrint className="ml-auto h-4 w-4 text-primary-highlight/50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-400 transition-all hover:bg-error/10 hover:text-error',
              collapsed && 'justify-center px-3',
            )}
            title={collapsed ? 'Cerrar Sesión' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </form>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-24 h-6 w-6 rounded-full border border-primary-dark bg-dark-card text-neutral-400 shadow-lg hover:bg-primary-brand hover:text-white"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  );
}
