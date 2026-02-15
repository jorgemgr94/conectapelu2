/**
 * Organizations seed module.
 * Seeds organization data for the application.
 */

import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db, generateSlug, getRandomElement, nowISO, schema, type SeedResult } from './config';
import { getAdminUserId } from './users';

// =============================================================================
// Seed data
// =============================================================================

const ORGANIZATION_NAMES = [
  'Refugio Esperanza',
  'Huellas del Sur',
  'Amigos de los Peludos',
  'Santuario Animal',
  'Vida Animal',
  'Patitas Felices',
  'Hogar para Todos',
  'Rescate Canino',
  'Gatos de la Calle',
  'Protectora San Francisco',
];

const CITIES = [
  'Madrid',
  'Barcelona',
  'Valencia',
  'Sevilla',
  'Zaragoza',
  'Málaga',
];

// =============================================================================
// Seed function
// =============================================================================

/**
 * Seed organizations into the database.
 * Idempotent: skips organizations that already exist (by slug).
 *
 * @returns Object containing array of organization IDs and count of orgs seeded
 */
export async function seedOrganizations(): Promise<SeedResult> {
  console.log('\n📦 Seeding organizations...');

  const adminId = await getAdminUserId();
  const orgIds: string[] = [];
  let created = 0;
  let skipped = 0;

  for (const orgName of ORGANIZATION_NAMES) {
    const slug = generateSlug(orgName);

    // Check if organization already exists
    const existing = await db
      .select({ id: schema.organizationsTable.id })
      .from(schema.organizationsTable)
      .where(eq(schema.organizationsTable.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      orgIds.push(existing[0].id);
      skipped++;
      continue;
    }

    // Create new organization
    const id = uuidv4();
    await db.insert(schema.organizationsTable).values({
      id,
      name: orgName,
      slug,
      description: `Una organización dedicada a cuidar animales en ${getRandomElement(CITIES)}.`,
      status: 'active',
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    });

    orgIds.push(id);
    created++;
  }

  console.log(`✅ Organizations: ${created} created, ${skipped} already existed`);

  return { ids: orgIds, count: created };
}
