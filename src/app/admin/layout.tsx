import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin';
import { AuthorizationError } from '@/lib/auth/authorization';
import { requireAppAdmin } from '@/lib/auth/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAppAdmin().catch((error: unknown) => {
    if (!(error instanceof AuthorizationError)) {
      throw error;
    }

    redirect(error.code === 'FORBIDDEN' ? '/user' : '/login');
  });

  return <AdminShell user={user}>{children}</AdminShell>;
}
