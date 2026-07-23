# Contributing to ConectaPelu

This repository is a Next.js and Supabase modular monolith. Changes should preserve development
speed while keeping authorization, tenant isolation, runtime validation, and database behavior
explicit.

## Prerequisites

- Node.js 24 LTS (use `.nvmrc`)
- Corepack
- PostgreSQL or a Supabase project
- GitHub CLI when publishing a pull request

Enable the package manager declared by `package.json`:

```bash
corepack enable
corepack install
pnpm install --frozen-lockfile
```

Copy `.env.example` to `.env.local` and replace its placeholders. Never commit real credentials.

## Branches

Create branches from `main` and use:

```text
<type>/<ticket-or-description>
```

Examples:

- `feat/pet-medical-records`
- `fix/login-redirect-loop`
- `chore/update-dependencies`

Automated agents may prefix their branch with `agent/` while retaining a meaningful conventional
description.

## Conventional Commits

Commit messages and pull request titles use:

```text
<type>(<optional-scope>): <imperative description>
```

Allowed types are:

- `feat`: user-facing capability
- `fix`: defect correction
- `docs`: documentation only
- `style`: formatting without behavior changes
- `refactor`: internal code change without a feature or fix
- `perf`: performance improvement
- `test`: test-only changes
- `build`: build system or dependency packaging
- `ci`: continuous-integration configuration
- `chore`: maintenance
- `revert`: revert of a prior change

Common scopes are `auth`, `users`, `orgs`, `pets`, `ui`, `db`, and `api`.

Examples:

```text
feat(pets): add pet photo gallery
fix(auth): handle expired session redirect
docs: explain local Supabase setup
ci: validate migrations on pull requests
```

The repository squash-merges pull requests, so the PR title must also follow this format.

## Development rules

- UI copy is Spanish (Mexico); code and technical comments are English.
- Use Drizzle for application CRUD and Supabase for Auth, Storage, and selected Realtime features.
- Treat every exported server action as a public server entry point.
- Authenticate, authorize, and validate input inside the server boundary.
- Constrain tenant-owned queries by organization in SQL.
- Prefer server components; add client components only for interaction.
- Infer row types from Drizzle and use narrow runtime schemas for mutation commands.
- Use status/archive behavior for business records unless the domain explicitly permits deletion.
- Keep the application a monolith unless a demonstrated deployment boundary requires otherwise.

## Tests and quality checks

Unit and integration tests use Vitest and follow the Arrange, Act, Assert pattern. Place
`*.test.ts` files next to their source. End-to-end tests will use Playwright under `tests/e2e/`.
The starting coverage threshold is 60% for code exercised by the test suite and should increase
as reference CRUDs are covered.

Run before opening a pull request:

```bash
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm db:check
pnpm build
```

Run `pnpm db:migrate` against a disposable database when a migration changes.

## Pull requests

Keep a PR independently deployable and focused on one outcome. Complete the repository PR
template, including:

- why the change is needed;
- explicit scope and exclusions;
- commands and manual scenarios actually validated;
- authorization, data, and migration impact;
- rollout or forward-fix plan;
- screenshots for UI changes.

Do not mix unrelated formatting, architecture, dependency, and product changes. Documentation and
tests belong in the same PR as the behavior they describe.

## Database changes

- Update Drizzle schema and commit generated migrations together.
- Use `pnpm db:push` only for local experimentation.
- Use committed migrations for shared and production environments.
- Never reset a shared database.
- Prefer additive, backward-compatible migrations when deployment may overlap application versions.

## Security

Do not include credentials, tokens, service keys, private user data, or production database
content in commits, issues, logs, screenshots, or PR descriptions. Report suspected
vulnerabilities through GitHub Security Advisories instead of a public issue.
