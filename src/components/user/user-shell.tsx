'use client';

import type { User } from '@/app/actions/users';
import { UserHeader } from './header';
import { UserSidebar, UserSidebarProvider, useUserSidebar } from './sidebar';

function UserContent({ children, user }: { children: React.ReactNode; user: User }) {
  const { collapsed } = useUserSidebar();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <UserSidebar />
      <div
        className="transition-all duration-300"
        style={{ paddingLeft: collapsed ? '80px' : '280px' }}
      >
        <UserHeader user={user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export function UserShell({ children, user }: { children: React.ReactNode; user: User }) {
  return (
    <UserSidebarProvider>
      <UserContent user={user}>{children}</UserContent>
    </UserSidebarProvider>
  );
}
