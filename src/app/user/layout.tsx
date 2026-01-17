import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserShell } from '@/components/user';
import { createClient } from '@/lib/supabase/server';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Get current URL to preserve query params (action, petId) for redirect after login
    const headersList = await headers();
    const fullUrl = headersList.get('x-url') || headersList.get('referer') || '';
    const url = new URL(fullUrl || 'http://localhost/user');
    const action = url.searchParams.get('action');
    const petId = url.searchParams.get('petId');

    // Build redirect URL with preserved params
    let loginUrl = '/login?redirect=/user';
    if (action) loginUrl += `&action=${action}`;
    if (petId) loginUrl += `&petId=${petId}`;

    redirect(loginUrl);
  }

  return <UserShell user={user}>{children}</UserShell>;
}
