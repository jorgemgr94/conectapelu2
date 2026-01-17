import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin';
import { postgresUserRepository } from '@/infrastructure/persistence';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const dbUser = await postgresUserRepository.findById(authUser.id);
  if (!dbUser) {
    redirect('/login');
  }

  return <AdminShell user={dbUser}>{children}</AdminShell>;
}
