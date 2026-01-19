'use client';

import type { User } from '@/app/actions/users';
import { Header } from './header';
import { Sidebar, SidebarProvider, useSidebar } from './sidebar';

function AdminContent({ children, user }: { children: React.ReactNode; user: User }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ paddingLeft: collapsed ? '80px' : '280px' }}
      >
        <Header user={user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminShell({ children, user }: { children: React.ReactNode; user: User }) {
  return (
    <SidebarProvider>
      <AdminContent user={user}>{children}</AdminContent>
    </SidebarProvider>
  );
}
