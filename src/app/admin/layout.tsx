import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const dbUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, authUser.id),
  });
  if (!dbUser) {
    redirect('/login');
  }

  return <AdminShell user={dbUser}>{children}</AdminShell>;
}
