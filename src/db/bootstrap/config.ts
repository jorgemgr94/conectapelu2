import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';
import * as schema from '../schema';

const client = postgres(serverEnv.DATABASE_URL, { max: 1 });

export const db = drizzle(client, { schema });

export async function closeConnection() {
  await client.end();
}

export function getSupabaseAdmin() {
  if (!serverEnv.SUPABASE_SECRET_KEY) {
    throw new Error('SUPABASE_SECRET_KEY is required to bootstrap role accounts');
  }

  return createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
