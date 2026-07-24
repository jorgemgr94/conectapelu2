import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { createAuthorization, resolveCurrentUser } from './authorization';

export const getCurrentUser = cache(() =>
  resolveCurrentUser({
    getAuthIdentity: async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      return user ? { id: user.id } : null;
    },
    findUserById: async (id) => {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
      });

      return user ?? null;
    },
  }),
);

const authorization = createAuthorization(getCurrentUser);

export const requireUser = authorization.requireUser;
export const requireAppAdmin = authorization.requireAppAdmin;
