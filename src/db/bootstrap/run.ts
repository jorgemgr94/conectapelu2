import { randomUUID } from 'node:crypto';
import type { User } from '@supabase/supabase-js';
import { and, eq, inArray } from 'drizzle-orm';
import {
  citiesTable,
  organizationMembersTable,
  organizationsTable,
  petsTable,
  usersTable,
} from '../schema';
import { db, getSupabaseAdmin } from './config';
import {
  type BootstrapAccount,
  bootstrapEnvironmentSchema,
  bootstrapPets,
  buildBootstrapAccounts,
  generateTemporaryPassword,
} from './manifest';

type LocalAccount = Pick<typeof usersTable.$inferSelect, 'email' | 'id' | 'role' | 'status'>;

async function listTargetAuthUsers(targetEmails: Set<string>): Promise<User[]> {
  const supabase = getSupabaseAdmin();
  const matches: User[] = [];
  const perPage = 1000;

  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw error;
    }

    matches.push(...data.users.filter((user) => targetEmails.has(user.email?.toLowerCase() ?? '')));

    if (data.users.length < perPage || matches.length === targetEmails.size) {
      return matches;
    }
  }
}

function assertConsistentAccount(
  account: BootstrapAccount,
  authUser: User | undefined,
  localUser: LocalAccount | undefined,
) {
  if (Boolean(authUser) !== Boolean(localUser)) {
    throw new Error(
      `Bootstrap account for role "${account.role}" exists in only one identity store`,
    );
  }

  if (!authUser || !localUser) {
    return;
  }

  if (authUser.id !== localUser.id) {
    throw new Error(`Bootstrap account IDs do not match for role "${account.role}"`);
  }

  if (!authUser.email_confirmed_at) {
    throw new Error(`Bootstrap Auth account is not confirmed for role "${account.role}"`);
  }

  if (localUser.role !== account.role || localUser.status !== 'active') {
    throw new Error(`Bootstrap account has an unexpected local state for role "${account.role}"`);
  }
}

export async function runBootstrap(environment: NodeJS.ProcessEnv = process.env) {
  const config = bootstrapEnvironmentSchema.parse(environment);
  const accounts = buildBootstrapAccounts(config.BOOTSTRAP_OWNER_EMAIL);
  const targetEmails = new Set(accounts.map(({ email }) => email));
  const supabase = getSupabaseAdmin();

  const [authUsers, localUsers] = await Promise.all([
    listTargetAuthUsers(targetEmails),
    db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
      })
      .from(usersTable)
      .where(inArray(usersTable.email, [...targetEmails])),
  ]);

  const authByEmail = new Map(
    authUsers.map((user) => [user.email?.toLowerCase() ?? '', user] as const),
  );
  const localByEmail = new Map(localUsers.map((user) => [user.email.toLowerCase(), user] as const));

  for (const account of accounts) {
    assertConsistentAccount(
      account,
      authByEmail.get(account.email),
      localByEmail.get(account.email),
    );
  }

  const createdAuthUsers: User[] = [];
  const resolvedAccounts = new Map<string, BootstrapAccount & { id: string }>();

  try {
    for (const account of accounts) {
      const existingAuthUser = authByEmail.get(account.email);

      if (existingAuthUser) {
        resolvedAccounts.set(account.role, { ...account, id: existingAuthUser.id });
        continue;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        email_confirm: true,
        password: generateTemporaryPassword(),
        user_metadata: {
          first_name: account.firstName,
          last_name: account.lastName,
        },
      });

      if (error || !data.user) {
        throw error ?? new Error(`Supabase did not create the "${account.role}" account`);
      }

      createdAuthUsers.push(data.user);
      resolvedAccounts.set(account.role, { ...account, id: data.user.id });
    }

    const appAdmin = resolvedAccounts.get('app_admin');
    const organizationAdmin = resolvedAccounts.get('organization_admin');

    if (!appAdmin || !organizationAdmin) {
      throw new Error('Bootstrap role manifest is incomplete');
    }

    const summary = await db.transaction(async (tx) => {
      for (const account of resolvedAccounts.values()) {
        if (localByEmail.has(account.email)) {
          continue;
        }

        await tx.insert(usersTable).values({
          id: account.id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName,
          role: account.role,
          status: 'active',
          emailVerified: true,
        });
      }

      const [existingOrganization] = await tx
        .select()
        .from(organizationsTable)
        .where(eq(organizationsTable.slug, config.BOOTSTRAP_ORGANIZATION_SLUG))
        .limit(1);

      if (existingOrganization && existingOrganization.status !== 'active') {
        throw new Error('Bootstrap organization exists but is not active');
      }

      const organization =
        existingOrganization ??
        (
          await tx
            .insert(organizationsTable)
            .values({
              id: randomUUID(),
              name: config.BOOTSTRAP_ORGANIZATION_NAME,
              slug: config.BOOTSTRAP_ORGANIZATION_SLUG,
              description: 'Organización inicial para recorrer los flujos de ConectaPelu2.',
              status: 'active',
              createdBy: appAdmin.id,
              updatedBy: appAdmin.id,
            })
            .returning()
        )[0];

      const [existingMembership] = await tx
        .select()
        .from(organizationMembersTable)
        .where(
          and(
            eq(organizationMembersTable.userId, organizationAdmin.id),
            eq(organizationMembersTable.organizationId, organization.id),
          ),
        )
        .limit(1);

      if (existingMembership && existingMembership.role !== 'org_admin') {
        throw new Error('Bootstrap organization membership has an unexpected role');
      }

      if (!existingMembership) {
        await tx.insert(organizationMembersTable).values({
          id: randomUUID(),
          userId: organizationAdmin.id,
          organizationId: organization.id,
          role: 'org_admin',
          createdBy: appAdmin.id,
          updatedBy: appAdmin.id,
        });
      }

      const [existingCity] = await tx
        .select()
        .from(citiesTable)
        .where(and(eq(citiesTable.name, 'Monterrey'), eq(citiesTable.state, 'Nuevo León')))
        .limit(1);

      const city =
        existingCity ??
        (
          await tx
            .insert(citiesTable)
            .values({
              id: randomUUID(),
              name: 'Monterrey',
              state: 'Nuevo León',
            })
            .returning()
        )[0];

      const existingPets = await tx
        .select({
          id: petsTable.id,
          name: petsTable.name,
          organizationId: petsTable.organizationId,
        })
        .from(petsTable)
        .where(
          inArray(
            petsTable.id,
            bootstrapPets.map(({ id }) => id),
          ),
        );

      for (const existingPet of existingPets) {
        const manifestPet = bootstrapPets.find(({ id }) => id === existingPet.id);

        if (
          !manifestPet ||
          existingPet.name !== manifestPet.name ||
          existingPet.organizationId !== organization.id
        ) {
          throw new Error(`Bootstrap pet "${existingPet.id}" conflicts with existing data`);
        }
      }

      const existingPetIds = new Set(existingPets.map(({ id }) => id));
      const missingPets = bootstrapPets.filter(({ id }) => !existingPetIds.has(id));

      if (missingPets.length > 0) {
        await tx.insert(petsTable).values(
          missingPets.map((pet) => ({
            ...pet,
            organizationId: organization.id,
            cityId: city.id,
            createdBy: organizationAdmin.id,
            updatedBy: organizationAdmin.id,
          })),
        );
      }

      return {
        accountsCreated: createdAuthUsers.length,
        accountsReused: accounts.length - createdAuthUsers.length,
        organizationCreated: !existingOrganization,
        membershipCreated: !existingMembership,
        petsCreated: missingPets.length,
        recoveryPath: '/forgot-password',
      };
    });

    return summary;
  } catch (error) {
    const rollbackResults = await Promise.allSettled(
      createdAuthUsers.map(({ id }) => supabase.auth.admin.deleteUser(id)),
    );
    const rollbackFailed = rollbackResults.some(
      (result) => result.status === 'rejected' || result.value.error,
    );

    if (rollbackFailed) {
      throw new AggregateError(
        [error],
        'Bootstrap failed and one or more newly created Auth users could not be removed',
      );
    }

    throw error;
  }
}
