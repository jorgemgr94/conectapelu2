import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { v4 as uuidv4 } from 'uuid';

import * as schema from './schema';

/**
 * Seed script para crear organizaciones de ejemplo
 *
 * Uso: pnpm db:seed
 *
 * Requisitos:
 * - DATABASE_URL en .env
 * - Al menos un usuario existente en la tabla users (creado via Supabase Auth)
 */

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('❌ DATABASE_URL is required');
  process.exit(1);
}

// Sample organizations data
const organizationNames = [
  'Happy Paws Rescue',
  'Second Chance Shelter',
  'Furry Friends Foundation',
  'Paw Print Sanctuary',
  'New Life Animal Rescue',
  'Guardian Angels Pet Rescue',
  'Forever Home Society',
  'Whiskers & Wagging Tails',
  'Compassionate Critters',
  'Hope for Hounds',
  'Feline Freedom League',
  'Canine Companions Rescue',
  'Precious Pets Haven',
  'Rainbow Bridge Shelter',
  'Loving Hearts Animal Rescue',
  'Safe Haven for Strays',
  'Purrfect Match Adoptions',
  'Tail Waggers United',
  'Rescue Me Foundation',
  'Animal Angels Sanctuary',
  'Best Friends Forever Rescue',
  'Lucky Paws Shelter',
  'Miracle Pet Rescue',
  'Heartland Animal Haven',
  'Coastal Critter Care',
  'Mountain View Pet Rescue',
  'Sunshine Animal Shelter',
  'Northern Lights Rescue',
  'Desert Paws Sanctuary',
  'Valley View Animal Care',
  'Riverside Pet Haven',
  'Golden Gate Rescue',
  'Blue Sky Animal Shelter',
  'Green Meadows Sanctuary',
  'Silver Lake Pet Rescue',
  'Willow Creek Animal Care',
  'Cedar Hills Shelter',
  'Maple Grove Rescue',
  'Pine Forest Pet Haven',
  'Oak Valley Animal Sanctuary',
  'Birch Tree Rescue',
  'Aspen Heights Shelter',
  'Redwood Animal Care',
  'Sequoia Pet Rescue',
  'Evergreen Haven',
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getRandomStatus(): 'pending' | 'active' | 'suspended' {
  // 60% active, 30% pending, 10% suspended
  const rand = Math.random();
  if (rand < 0.6) return 'active';
  if (rand < 0.9) return 'pending';
  return 'suspended';
}

function getRandomDescription(): string {
  const descriptions = [
    'Dedicated to finding loving homes for abandoned and rescued animals.',
    'A no-kill shelter committed to the welfare of all pets in our community.',
    'Providing second chances to animals in need since 2010.',
    'Our mission is to rescue, rehabilitate, and rehome pets in need.',
    'A volunteer-run organization focused on saving lives one paw at a time.',
    'Connecting homeless pets with loving families in our region.',
    'Specializing in senior pet rescue and care.',
    'Focused on rescuing animals from high-kill shelters.',
    'Community-based rescue serving the greater metropolitan area.',
    'Dedicated foster-based rescue for cats and dogs.',
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

async function seed() {
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('🌱 Starting seed...');

  try {
    // Find any existing user to use as creator
    const existingUsers = await db.select().from(schema.usersTable).limit(1);

    if (existingUsers.length === 0) {
      console.error('❌ No users found in database.');
      console.log('\nPara crear organizaciones necesitas al menos un usuario.');
      console.log('Pasos:');
      console.log('1. Ve a Supabase Dashboard → Authentication → Users → Add User');
      console.log('2. Crea un usuario con email/password');
      console.log('3. Inicia sesión en la app (esto crea el usuario en la tabla users)');
      console.log('4. Ejecuta: pnpm db:seed');
      await client.end();
      process.exit(1);
    }

    const adminId = existingUsers[0].id;
    console.log(`✅ Using existing user: ${existingUsers[0].email}`);

    // Check existing organizations count
    const existingOrgs = await db.select().from(schema.organizationsTable);

    if (existingOrgs.length >= 40) {
      console.log(`⚠️  Already have ${existingOrgs.length} organizations, skipping...`);
    } else {
      // Create organizations
      console.log('\n📦 Creating organizations...');

      const orgsToCreate = organizationNames.slice(existingOrgs.length);
      const now = new Date().toISOString();
      let created = 0;

      for (const name of orgsToCreate) {
        const slug = generateSlug(name);

        // Check if slug exists
        const existingSlug = await db
          .select()
          .from(schema.organizationsTable)
          .where(eq(schema.organizationsTable.slug, slug));

        if (existingSlug.length > 0) {
          console.log(`   ⏭️  Skipping "${name}" (slug exists)`);
          continue;
        }

        await db.insert(schema.organizationsTable).values({
          id: uuidv4(),
          name,
          slug,
          description: getRandomDescription(),
          status: getRandomStatus(),
          createdBy: adminId,
          updatedBy: adminId,
          createdAt: now,
          updatedAt: now,
        });

        console.log(`   ✅ Created: ${name}`);
        created++;
      }

      console.log(`\n✅ Created ${created} organizations`);
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await client.end();
  }

  console.log('\n🌱 Seed completed!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
