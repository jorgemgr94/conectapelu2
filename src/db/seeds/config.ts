/**
 * Seed configuration and shared utilities.
 * Provides database connection and helper functions for all seed files.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';

import * as schema from '../schema';

// =============================================================================
// Database connection
// =============================================================================

const client = postgres(serverEnv.DATABASE_URL, { max: 1 });
export const db = drizzle(client, { schema });

/**
 * Close the database connection.
 * Call this when seeding is complete.
 */
export async function closeConnection() {
  await client.end();
}

// =============================================================================
// Supabase Admin client (for creating auth users)
// =============================================================================

/**
 * Get Supabase admin client for auth operations.
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is not configured.
 */
export function getSupabaseAdmin() {
  if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set - skipping Supabase Auth user creation');
    return null;
  }

  return createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// =============================================================================
// Utility functions
// =============================================================================

/**
 * Get a random element from an array.
 */
export function getRandomElement<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a URL-friendly slug from a name.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get current ISO timestamp string.
 */
export function nowISO(): string {
  return new Date().toISOString();
}

// =============================================================================
// Seed result type
// =============================================================================

export interface SeedResult<T = string> {
  ids: T[];
  count: number;
}

// Re-export schema for convenience
export { schema };
