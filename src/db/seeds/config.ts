/**
 * Seed configuration and shared utilities.
 * Provides database connection and helper functions for all seed files.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../schema';

// =============================================================================
// Environment validation
// =============================================================================

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is required');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is required');
  process.exit(1);
}

// =============================================================================
// Database connection
// =============================================================================

const client = postgres(DATABASE_URL, { max: 1 });
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
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set - skipping Supabase Auth user creation');
    return null;
  }

  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY, {
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
