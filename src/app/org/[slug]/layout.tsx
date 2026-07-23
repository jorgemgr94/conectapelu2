import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { getOrganizationBySlug, getUserMembershipForOrg } from '@/app/actions/organization-members';
import { OrgShell } from '@/components/org';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, user.id),
  });
  if (!dbUser) {
    redirect('/login?error=user_not_found');
  }

  // Get the organization by slug
  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    notFound();
  }

  // Check if user is a member of this organization (or app_admin)
  const membership = await getUserMembershipForOrg(user.id, organization.id);

  // TODO: Also check if user is app_admin
  if (!membership) {
    redirect('/login?error=not_authorized');
  }

  return (
    <OrgShell user={dbUser} organizationSlug={slug} organizationName={organization.name}>
      {children}
    </OrgShell>
  );
}
