'use client';

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  PawPrint,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '80px' : '280px');
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const navigation = [
    { name: t('dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
    { name: t('organizations'), href: '/admin/organizations', icon: Building2 },
    { name: t('users'), href: '/admin/users', icon: Users },
    { name: t('pets'), href: '/admin/pets', icon: PawPrint },
    { name: t('settings'), href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-dark-page transition-all duration-300',
        collapsed ? 'w-20' : 'w-[280px]',
      )}
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-primary-highlight/50 to-transparent" />

      <div className="relative flex h-20 items-center justify-between border-b border-white/5 px-6">
        <Logo size="md" showText={!collapsed} tagline={t('adminPortal')} href="/admin/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <div className={cn('mb-4', collapsed ? 'px-2' : 'px-3')}>
          {!collapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              {t('navigation')}
            </span>
          )}
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-linear-to-r from-primary-brand/20 to-primary-highlight/10 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white',
                collapsed && 'justify-center px-3',
              )}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-brand" />
              )}
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive
                    ? 'text-primary-highlight'
                    : 'text-neutral-500 group-hover:text-neutral-300',
                )}
              />
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && (
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
            title={collapsed ? t('signOut') : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t('signOut')}</span>}
          </button>
        </form>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-24 h-6 w-6 rounded-full border border-primary-dark bg-dark-card text-neutral-400 shadow-lg hover:bg-primary-brand hover:text-white"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? t('expandSidebar') : t('collapseSidebar')}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  );
}
