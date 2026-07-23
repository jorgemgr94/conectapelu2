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

Optionally seed development data:

```bash
pnpm db:seed
```

Start the application:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Visibility | Required | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Server only | Yes | Drizzle runtime and migration connection. |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server | Yes | Public Supabase client key; authorization still depends on policies. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | For user administration | Privileged Supabase Auth operations and Auth-aware seeds. |

Use a direct database URL for migrations. A deployment may use a transaction-pooler-compatible
URL for application traffic; keep the distinction explicit in deployment configuration.

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
| `pnpm db:seed` | Seed development data. |
| `pnpm db:studio` | Open Drizzle Studio. |

`db:push` is reserved for local experimentation. Shared environments use committed migrations.

## Documentation

- [Contribution guide](CONTRIBUTING.md)

## Pull requests

Pull request titles follow Conventional Commits and are squash-merged. CI validates lint,
TypeScript, tests, migrations, and the production build. See [CONTRIBUTING.md](CONTRIBUTING.md)
before submitting changes.
