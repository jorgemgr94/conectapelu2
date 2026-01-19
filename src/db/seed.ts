
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { v4 as uuidv4 } from 'uuid';

import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('❌ DATABASE_URL is required');
  process.exit(1);
}

// Static Data
const CITIES = [
  'Madrid',
  'Barcelona',
  'Valencia',
  'Sevilla',
  'Zaragoza',
  'Málaga',
  'Murcia',
  'Palma',
  'Las Palmas',
  'Bilbao',
  'Alicante',
  'Córdoba',
];

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

const PET_NAMES = [
  'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Daisy', 'Milo', 'Lola', 'Buddy',
  'Rocky', 'Coco', 'Jack', 'Ruby', 'Toby', 'Chloe', 'Bear', 'Sophie', 'Teddy', 'Lily'
];

const BREEDS = {
  dog: ['Mestizo', 'Labrador', 'Pastor Alemán', 'Golden Retriever', 'Bulldog', 'Beagle'],
  cat: ['Mestizo', 'Siamés', 'Persa', 'Maine Coon', 'Bengala', 'Sphynx']
};

const IMAGES = {
  dog: [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9266?w=800&q=80',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
  ],
  cat: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80',
    'https://images.unsplash.com/photo-1495360019602-e0019216774a?w=800&q=80',
    'https://images.unsplash.com/photo-1529778873920-4da4926a7071?w=800&q=80',
  ]
};

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function seed() {
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('🌱 Starting full seed...');

  try {
    // 1. Create default admin user if not exists
    // Note: In real scenarios, auth users are in Supabase Auth. 
    // Here we insert into our public.users table assuming the Auth ID matches or generating a dummy one for local dev.
    // Since we reset the DB, we need at least one user to link FKs.

    // Check if any user exists or just create a dummy "admin" for data linkage
    const adminId = 'cedd81a1-e968-4bc4-bc14-37ce82ee0b04'; // Dummy ID
    const demoUserEmail = 'jorgemgr94@gmail.com';

    await db.insert(schema.usersTable).values({
      id: adminId,
      email: demoUserEmail,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'app_admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).onConflictDoNothing();

    console.log(`✅ User ensures: ${demoUserEmail}`);

    // 2. Seed Cities
    console.log('\n📦 Seeding cities...');
    const cityIds: string[] = [];

    for (const cityName of CITIES) {
      const existingCity = await db.select().from(schema.citiesTable).where(eq(schema.citiesTable.name, cityName)).limit(1);
      let cId = existingCity[0]?.id;

      if (!cId) {
        cId = uuidv4();
        await db.insert(schema.citiesTable).values({
          id: cId,
          name: cityName,
          state: 'España',
        });
      }
      cityIds.push(cId);
    }
    console.log(`✅ Seeded ${cityIds.length} cities`);

    // 3. Seed Organizations
    console.log('\n📦 Seeding organizations...');
    const orgIds: string[] = [];

    for (const orgName of ORGANIZATION_NAMES) {
      const slug = generateSlug(orgName);
      let orgId = uuidv4();

      const existingOrg = await db.select().from(schema.organizationsTable).where(eq(schema.organizationsTable.slug, slug)).limit(1);

      if (existingOrg.length > 0) {
        orgId = existingOrg[0].id;
      } else {
        await db.insert(schema.organizationsTable).values({
          id: orgId,
          name: orgName,
          slug: slug,
          description: `Una organización dedicada a cuidar animales en ${getRandomElement(CITIES)}.`,
          status: 'active',
          createdBy: adminId,
          updatedBy: adminId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      orgIds.push(orgId);
    }
    console.log(`✅ Seeded ${orgIds.length} organizations`);

    // 4. Seed Pets
    console.log('\n📦 Seeding pets...');

    // Extended lists for unique names/images
    const dogNames = ['Max', 'Buddy', 'Charlie', 'Rocky', 'Bear', 'Duke', 'Toby', 'Jack', 'Tucker', 'Cooper', 'Zeus', 'Bruno', 'Milo', 'Leo', 'Teddy', 'Benny', 'Oscar', 'Lucky', 'Thor', 'Rex', 'Simba', 'Cody', 'Rusty', 'Jasper', 'Shadow'];
    const catNames = ['Luna', 'Bella', 'Lucy', 'Chloe', 'Lily', 'Sophie', 'Coco', 'Mia', 'Zoe', 'Nala', 'Stella', 'Ruby', 'Daisy', 'Olive', 'Willow', 'Pepper', 'Ginger', 'Hazel', 'Ivy', 'Pearl', 'Misty', 'Sasha', 'Mochi', 'Oreo', 'Salem'];

    const dogImages = [
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

    const catImages = [
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

    let dogIndex = 0;
    let catIndex = 0;
    const TOTAL_PETS = 50;

    for (let i = 0; i < TOTAL_PETS; i++) {
      const species = i % 3 !== 0 ? 'dog' : 'cat' as 'dog' | 'cat'; // ~66% dogs
      const sex = i % 2 === 0 ? 'male' : 'female';
      const size = ['small', 'medium', 'large'][i % 3];
      const cityId = cityIds[i % cityIds.length];
      const orgId = orgIds[i % orgIds.length];

      let name: string;
      let image: string;

      if (species === 'dog') {
        name = dogNames[dogIndex % dogNames.length];
        image = dogImages[dogIndex % dogImages.length];
        dogIndex++;
      } else {
        name = catNames[catIndex % catNames.length];
        image = catImages[catIndex % catImages.length];
        catIndex++;
      }

      await db.insert(schema.petsTable).values({
        id: uuidv4(),
        name: name,
        species: species,
        breed: getRandomElement(BREEDS[species]),
        sex: sex as any,
        size: size as any,
        organizationId: orgId,
        cityId: cityId,
        birthDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 10).toISOString(),
        description: `Un ${species === 'dog' ? 'perrito' : 'gatito'} muy cariñoso que busca hogar.`,
        status: 'active',
        image: image,
        createdBy: adminId,
        updatedBy: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    console.log(`✅ Seeded ${TOTAL_PETS} pets`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await client.end();
  }

  console.log('\n🌱 Seed completed successfully!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
