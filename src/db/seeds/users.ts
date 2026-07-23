/**
 * Users seed module.
 * Seeds user data into both Supabase Auth and the public.users table.
 */

import { eq } from 'drizzle-orm';

import { db, getSupabaseAdmin, nowISO, type SeedResult, schema } from './config';

// =============================================================================
// Seed data
// =============================================================================

const SEED_USERS = [
  {
    email: 'jorge+app_admin@gmail.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'Principal',
    phone: '+34600000001',
    role: 'app_admin',
  },
  {
    email: 'jorge+organization_admin@gmail.com',
    password: 'OrgAdmin123!',
    firstName: 'Gestor',
    lastName: 'Organizaciones',
    phone: '+34600000002',
    role: 'organization_admin',
  },
  {
    email: 'jorge+user_1@gmail.com',
    password: 'Usuario123!',
    firstName: 'Usuario',
    lastName: 'Demo',
    phone: '+34600000003',
    role: 'user',
  },
  {
    email: 'jorge+user_2@gmail.com',
    password: 'Usuario123!',
    firstName: 'Usuario',
    lastName: 'Demo 2',
    phone: '+34600000004',
    role: 'user',
  },
] as const;

// =============================================================================
// Seed function
// =============================================================================

/**
 * Seed users into Supabase Auth and the public.users table.
 * Idempotent: skips users that already exist (by email).
 *
 * @returns Object containing array of user IDs and count of users seeded
 */
export async function seedUsers(): Promise<SeedResult> {
  console.log('\n📦 Seeding users...');

  const userIds: string[] = [];
  let created = 0;
  let skipped = 0;

  const supabaseAdmin = getSupabaseAdmin();

  for (const seedUser of SEED_USERS) {
    // Check if user already exists in public.users table
    const existingDbUser = await db
      .select({ id: schema.usersTable.id })
      .from(schema.usersTable)
      .where(eq(schema.usersTable.email, seedUser.email))
      .limit(1);

    if (existingDbUser.length > 0) {
      userIds.push(existingDbUser[0].id);
      skipped++;
      console.log(`  ⏭️  User ${seedUser.email} already exists`);
      continue;
    }

    let authUserId: string | null = null;

    // Try to create user in Supabase Auth if admin client is available
    if (supabaseAdmin) {
      // First check if user exists in Auth
      const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuthUser = existingAuthUsers?.users?.find((u) => u.email === seedUser.email);

      if (existingAuthUser) {
        authUserId = existingAuthUser.id;
        console.log(`  ℹ️  Auth user ${seedUser.email} already exists, using existing ID`);
      } else {
        // Create new auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: seedUser.email,
          password: seedUser.password,
          email_confirm: true, // Auto-confirm email for seed users
          user_metadata: {
            first_name: seedUser.firstName,
            last_name: seedUser.lastName,
          },
        });

        if (authError) {
          console.error(`  ❌ Failed to create auth user ${seedUser.email}:`, authError.message);
          continue;
        }

        authUserId = authData.user.id;
        console.log(`  ✅ Created auth user ${seedUser.email}`);
      }
    } else {
      // Generate a UUID if no Supabase admin client
      authUserId = crypto.randomUUID();
      console.log(`  ⚠️  No Supabase admin - using generated ID for ${seedUser.email}`);
    }

    // Insert into public.users table
    await db.insert(schema.usersTable).values({
      id: authUserId,
      email: seedUser.email,
      firstName: seedUser.firstName,
      lastName: seedUser.lastName,
      phone: seedUser.phone ?? null,
      role: seedUser.role,
      status: 'active',
      emailVerified: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    });

    userIds.push(authUserId);
    created++;
    console.log(`  ✅ Created db user ${seedUser.email}`);
  }

  console.log(`✅ Users: ${created} created, ${skipped} already existed`);

  return { ids: userIds, count: created };
}

/**
 * Get the admin user ID (first user with app_admin role).
 * Useful for setting createdBy/updatedBy on other seeds.
 */
export async function getAdminUserId(): Promise<string> {
  const admin = await db
    .select({ id: schema.usersTable.id })
    .from(schema.usersTable)
    .where(eq(schema.usersTable.role, 'app_admin'))
    .limit(1);

  if (admin.length === 0) {
    throw new Error('No admin user found. Run seedUsers() first.');
  }

  return admin[0].id;
}
