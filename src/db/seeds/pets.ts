/**
 * Pets seed module.
 * Seeds pet data for the application.
 */

import { v4 as uuidv4 } from 'uuid';

import { db, getRandomElement, nowISO, type SeedResult, schema } from './config';
import { getAdminUserId } from './users';

// =============================================================================
// Seed data
// =============================================================================

const DOG_NAMES = [
  'Max',
  'Buddy',
  'Charlie',
  'Rocky',
  'Bear',
  'Duke',
  'Toby',
  'Jack',
  'Tucker',
  'Cooper',
  'Zeus',
  'Bruno',
  'Milo',
  'Leo',
  'Teddy',
  'Benny',
  'Oscar',
  'Lucky',
  'Thor',
  'Rex',
  'Simba',
  'Cody',
  'Rusty',
  'Jasper',
  'Shadow',
];

const CAT_NAMES = [
  'Luna',
  'Lucy',
  'Chloe',
  'Lily',
  'Sophie',
  'Coco',
  'Mia',
  'Zoe',
  'Nala',
  'Stella',
  'Bella',
  'Ruby',
  'Daisy',
  'Olive',
  'Willow',
  'Pepper',
  'Ginger',
  'Hazel',
  'Ivy',
  'Pearl',
  'Misty',
  'Sasha',
  'Mochi',
  'Oreo',
  'Salem',
];

const BREEDS = {
  dog: ['Mestizo', 'Labrador', 'Pastor Alemán', 'Golden Retriever', 'Bulldog', 'Beagle'],
  cat: ['Mestizo', 'Siamés', 'Persa', 'Maine Coon', 'Bengala', 'Sphynx'],
};

const DOG_IMAGES = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9266?w=800&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80',
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&q=80',
  'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800&q=80',
  'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=800&q=80',
  'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
  'https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=800&q=80',
  'https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=800&q=80',
  'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=800&q=80',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&q=80',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
  'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80',
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80',
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
];

const CAT_IMAGES = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80',
  'https://images.unsplash.com/photo-1495360019602-e0019216774a?w=800&q=80',
  'https://images.unsplash.com/photo-1529778873920-4da4926a7071?w=800&q=80',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
  'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80',
  'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&q=80',
  'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=800&q=80',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80',
  'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800&q=80',
  'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=80',
  'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&q=80',
  'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800&q=80',
  'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&q=80',
  'https://images.unsplash.com/photo-1596921879005-28de41e28fca?w=800&q=80',
  'https://images.unsplash.com/photo-1548366086-7f1b76106622?w=800&q=80',
  'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=800&q=80',
  'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&q=80',
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=80',
  'https://images.unsplash.com/photo-1568043210943-584374f76c61?w=800&q=80',
  'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=800&q=80',
  'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&q=80',
];

const SIZES = ['small', 'medium', 'large'] as const;
const SEXES = ['male', 'female'] as const;

// =============================================================================
// Helper functions
// =============================================================================

function generateRandomBirthDate(): string {
  // Random date between 2 months and 10 years ago
  const now = Date.now();
  const minAge = 1000 * 60 * 60 * 24 * 60; // 2 months in ms
  const maxAge = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years in ms
  const randomAge = Math.random() * (maxAge - minAge) + minAge;
  return new Date(now - randomAge).toISOString();
}

// =============================================================================
// Seed function
// =============================================================================

interface SeedPetsOptions {
  /** Organization IDs to distribute pets across */
  organizationIds: string[];
  /** City IDs to distribute pets across */
  cityIds: string[];
  /** Total number of pets to seed (default: 50) */
  count?: number;
}

/**
 * Seed pets into the database.
 * Idempotent: checks existing pet count and only seeds if below target.
 *
 * @param options - Configuration for pet seeding
 * @returns Object containing array of pet IDs and count of pets seeded
 */
export async function seedPets(options: SeedPetsOptions): Promise<SeedResult> {
  console.log('\n📦 Seeding pets...');

  const { organizationIds, cityIds, count = 50 } = options;

  if (organizationIds.length === 0) {
    console.warn('⚠️  No organizations provided, skipping pet seeding');
    return { ids: [], count: 0 };
  }

  if (cityIds.length === 0) {
    console.warn('⚠️  No cities provided, skipping pet seeding');
    return { ids: [], count: 0 };
  }

  const adminId = await getAdminUserId();

  // Check existing pet count
  const existingPets = await db.select({ id: schema.petsTable.id }).from(schema.petsTable);

  const existingCount = existingPets.length;

  if (existingCount >= count) {
    console.log(`✅ Pets: ${existingCount} already exist (target: ${count}), skipping`);
    return { ids: existingPets.map((p) => p.id), count: 0 };
  }

  const toCreate = count - existingCount;
  const petIds: string[] = existingPets.map((p) => p.id);

  let dogIndex = 0;
  let catIndex = 0;

  for (let i = 0; i < toCreate; i++) {
    const species: 'dog' | 'cat' = i % 3 !== 0 ? 'dog' : 'cat'; // ~66% dogs
    const sex = getRandomElement(SEXES);
    const size = getRandomElement(SIZES);
    const cityId = cityIds[i % cityIds.length];
    const orgId = organizationIds[i % organizationIds.length];

    let name: string;
    let image: string;

    if (species === 'dog') {
      name = DOG_NAMES[dogIndex % DOG_NAMES.length];
      image = DOG_IMAGES[dogIndex % DOG_IMAGES.length];
      dogIndex++;
    } else {
      name = CAT_NAMES[catIndex % CAT_NAMES.length];
      image = CAT_IMAGES[catIndex % CAT_IMAGES.length];
      catIndex++;
    }

    const id = uuidv4();

    await db.insert(schema.petsTable).values({
      id,
      name,
      species,
      breed: getRandomElement(BREEDS[species]),
      sex,
      size,
      organizationId: orgId,
      cityId,
      birthDate: generateRandomBirthDate(),
      description: `Un ${species === 'dog' ? 'perrito' : 'gatito'} muy cariñoso que busca hogar.`,
      status: 'active',
      origin: 'rescue',
      image,
      createdBy: adminId,
      updatedBy: adminId,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    });

    petIds.push(id);
  }

  console.log(`✅ Pets: ${toCreate} created (${existingCount} already existed)`);

  return { ids: petIds, count: toCreate };
}
