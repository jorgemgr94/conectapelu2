/**
 * Seed orchestrator.
 * Runs all seed modules in the correct order.
 *
 * Usage:
 *   pnpm db:seed
 *
 * Environment variables:
 *   DATABASE_URL - PostgreSQL connection string (required)
 *   NEXT_PUBLIC_SUPABASE_URL - Supabase project URL (required)
 *   SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (optional, needed for auth user creation)
 */

import { seedCities } from './cities';
import { closeConnection } from './config';
import { seedOrganizations } from './organizations';
import { seedPets } from './pets';
import { seedUsers } from './users';

// =============================================================================
// Main seed function
// =============================================================================

async function main() {
  console.log('🌱 Starting database seed...\n');
  console.log('='.repeat(50));

  const startTime = Date.now();

  try {
    // 1. Seed users first (needed for createdBy/updatedBy foreign keys)
    const userResult = await seedUsers();

    // 2. Seed cities
    const cityResult = await seedCities();

    // 3. Seed organizations (depends on users for createdBy)
    const orgResult = await seedOrganizations();

    // 4. Seed pets (depends on users, cities, and organizations)
    const petResult = await seedPets({
      organizationIds: orgResult.ids,
      cityIds: cityResult.ids,
      count: 50,
    });

    // Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 Seed Summary:');
    console.log(`   Users:         ${userResult.count} created`);
    console.log(`   Cities:        ${cityResult.count} created`);
    console.log(`   Organizations: ${orgResult.count} created`);
    console.log(`   Pets:          ${petResult.count} created`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Seed completed successfully in ${duration}s`);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    throw error;
  } finally {
    await closeConnection();
  }
}

// =============================================================================
// Run
// =============================================================================

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
