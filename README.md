# ConectaPelu2

ConectaPelu2 is a Next.js and Supabase monolith for connecting rescue organizations, pets, and
adopters. It is also a learning project for current full-stack patterns in Next.js, React,
PostgreSQL, Drizzle, and Supabase.

## Technology

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4 and shadcn-style UI primitives
- PostgreSQL with Drizzle ORM
- Supabase Auth, Storage, and optional Realtime
- `next-intl` with Mexican Spanish and US English
- Biome, Vitest, and GitHub Actions

## Requirements

- Node.js 24 LTS
- Corepack
- PostgreSQL or a Supabase project

## Setup

Use the declared Node and pnpm versions:

```bash
nvm use
corepack enable
corepack install
pnpm install --frozen-lockfile
```

Create local configuration:

```bash
cp .env.example .env.local
```

Replace the placeholders in `.env.local`, then apply migrations:

```bash
pnpm db:migrate
```

Optionally create a compact role walkthrough:

```bash
pnpm db:bootstrap
```

The bootstrap creates or reuses one account for each application role, one active organization,
its organization-admin membership, and six pets across representative lifecycle states. Set
`BOOTSTRAP_OWNER_EMAIL` to a mailbox that supports plus addressing; the command derives `+admin`,
`+org`, and `+user` aliases from it.

Temporary passwords are generated with Node.js cryptography and are never stored or printed. Use
the application's `/forgot-password` flow to choose a password for each account.

Start the application:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Localization

User-facing copy lives in `messages/es-MX.json` and `messages/en-US.json`. Mexican Spanish is the
default locale. The language selector stores the preference in the `conectapelu2_locale` cookie,
so routes remain unchanged when users switch languages.

Add every new message to both catalogs. The test suite checks that their key structures remain
equivalent.

## Environment variables

| Variable | Visibility | Required | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Server only | Yes | Drizzle runtime and migration connection. |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server | Yes | Public Supabase client key; authorization still depends on policies. |
| `SUPABASE_SECRET_KEY` | Server only | For user administration | Current `sb_secret_...` key for privileged Auth operations and role bootstrap. |
| `BOOTSTRAP_OWNER_EMAIL` | Server/CLI only | For `db:bootstrap` | Base mailbox used to derive the three role aliases. |
| `BOOTSTRAP_ORGANIZATION_NAME` | Server/CLI only | No | Initial organization name; defaults to `Refugio Esperanza`. |
| `BOOTSTRAP_ORGANIZATION_SLUG` | Server/CLI only | No | Initial organization slug; defaults to `refugio-esperanza`. |

Use a direct database URL for migrations. A deployment may use a transaction-pooler-compatible
URL for application traffic; keep the distinction explicit in deployment configuration.

### Role bootstrap

`pnpm db:bootstrap` is intended for the first application walkthrough, not for generating bulk
sample data. It is safe to rerun when its Auth and database records remain consistent. It stops
instead of repairing or overwriting partial accounts, changed roles, inactive organizations, or
conflicting pet records.

The resulting walkthrough is:

- `+admin`: platform administration, users, and organizations;
- `+org`: organization dashboard and membership for the configured organization;
- `+user`: regular user dashboard and public pet discovery.

If database provisioning fails after new Auth accounts are created, the command removes only
those newly created Auth accounts. Existing accounts are never deleted.

### Supabase Auth configuration

Add `<app-origin>/auth/callback` to the Supabase Auth redirect allow list for every environment
(for example, `http://localhost:3000/auth/callback`). Password recovery also requires a working
email provider; configure production SMTP in Supabase before relying on it outside local
development.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the development server. |
| `pnpm build` | Create a production build. |
| `pnpm lint` | Run Biome checks. |
| `pnpm typecheck` | Run TypeScript without emitting files. |
| `pnpm test` | Run Vitest once. |
| `pnpm test:watch` | Run Vitest in watch mode. |
| `pnpm test:coverage` | Run tests with the coverage threshold. |
| `pnpm db:check` | Validate Drizzle migration history. |
| `pnpm db:generate` | Generate a migration from schema changes. |
| `pnpm db:migrate` | Apply committed migrations. |
| `pnpm db:bootstrap` | Create the compact, idempotent role walkthrough. |
| `pnpm db:studio` | Open Drizzle Studio. |

`db:push` is reserved for local experimentation. Shared environments use committed migrations.

## Documentation

- [Contribution guide](CONTRIBUTING.md)

## Pull requests

Pull request titles follow Conventional Commits and are squash-merged. CI validates lint,
TypeScript, tests, migrations, and the production build. See [CONTRIBUTING.md](CONTRIBUTING.md)
before submitting changes.
