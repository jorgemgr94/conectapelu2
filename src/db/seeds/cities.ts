/**
 * Cities seed module.
 * Seeds city data for the application.
 */

import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db, type SeedResult, schema } from './config';

// =============================================================================
// Seed data
// =============================================================================

const CITIES = [
  { name: 'Madrid', state: 'España' },
  { name: 'Barcelona', state: 'España' },
  { name: 'Valencia', state: 'España' },
  { name: 'Sevilla', state: 'España' },
  { name: 'Zaragoza', state: 'España' },
  { name: 'Málaga', state: 'España' },
  { name: 'Murcia', state: 'España' },
  { name: 'Palma', state: 'España' },
  { name: 'Las Palmas', state: 'España' },
  { name: 'Bilbao', state: 'España' },
  { name: 'Alicante', state: 'España' },
  { name: 'Córdoba', state: 'España' },
];

// =============================================================================
// Seed function
// =============================================================================

/**
 * Seed cities into the database.
 * Idempotent: skips cities that already exist (by name).
 *
 * @returns Object containing array of city IDs and count of cities seeded
 */
export async function seedCities(): Promise<SeedResult> {
  console.log('\n📦 Seeding cities...');

  const cityIds: string[] = [];
  let created = 0;
  let skipped = 0;

  for (const city of CITIES) {
    // Check if city already exists
    const existing = await db
      .select({ id: schema.citiesTable.id })
      .from(schema.citiesTable)
      .where(eq(schema.citiesTable.name, city.name))
      .limit(1);

    if (existing.length > 0) {
      cityIds.push(existing[0].id);
      skipped++;
      continue;
    }

    // Create new city
    const id = uuidv4();
    await db.insert(schema.citiesTable).values({
      id,
      name: city.name,
      state: city.state,
    });

    cityIds.push(id);
    created++;
  }

  console.log(`✅ Cities: ${created} created, ${skipped} already existed`);

  return { ids: cityIds, count: created };
}
