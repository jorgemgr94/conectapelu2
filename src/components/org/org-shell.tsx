'use client';

import type { User } from '@/app/actions/users';
import { OrgHeader } from './header';
import { OrgSidebar, OrgSidebarProvider, useOrgSidebar } from './sidebar';

function OrgContent({
  children,
  user,
  organizationName,
}: {
  children: React.ReactNode;
  user: User | null;
  organizationName: string;
}) {
  const { collapsed } = useOrgSidebar();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <OrgSidebar />
      <div
        className="transition-all duration-300"
        style={{ paddingLeft: collapsed ? '80px' : '280px' }}
      >
        <OrgHeader user={user} organizationName={organizationName} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export function OrgShell({
  children,
  user,
  organizationSlug,
  organizationName,
}: {
  children: React.ReactNode;
  user: User | null;
  organizationSlug: string;
  organizationName: string;
}) {
  return (
    <OrgSidebarProvider organizationSlug={organizationSlug} organizationName={organizationName}>
      <OrgContent user={user} organizationName={organizationName}>
        {children}
      </OrgContent>
    </OrgSidebarProvider>
  );
}
