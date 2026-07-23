'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { organizationMembersTable, organizationsTable, usersTable } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';

/**
 * Determines the redirect path after login based on user role and memberships
 */
export async function getLoginRedirectPath(): Promise<string> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[Auth] No user found in session');
      return '/login';
    }

    console.log('[Auth] User authenticated:', user.id);

    // Get user from our database
    const dbUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, user.id),
    });

    if (!dbUser) {
      // User exists in auth but not in our users table
      console.log('[Auth] User not found in database:', user.id);
      return '/login?error=user_not_found';
    }

    console.log('[Auth] User role:', dbUser.role);

    // If user is app_admin, redirect to admin dashboard
    if (dbUser.role === 'app_admin') {
      return '/admin/dashboard';
    }

    // Check if user has organization memberships
    const memberships = await db.query.organizationMembersTable.findMany({
      where: eq(organizationMembersTable.userId, user.id),
      limit: 1,
    });

    console.log('[Auth] User memberships:', memberships.length);

    if (memberships.length > 0) {
      // Get the first organization
      const org = await db.query.organizationsTable.findFirst({
        where: eq(organizationsTable.id, memberships[0].organizationId),
      });
      if (org) {
        return `/org/${org.slug}/dashboard`;
      }
    }

    // Regular user with no organization - redirect to user dashboard
    return '/user';
  } catch (error) {
    console.error('[Auth] Error getting redirect path:', error);
    // En caso de error, redirigir al dashboard de admin como fallback
    // (asumiendo que el usuario ya está autenticado)
    return '/admin/dashboard';
  }
}
