# ConectaPelu2 agent guidance

## Start here

- Read [README.md](README.md) for setup and the product overview.
- Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing code or preparing a pull request.
- Treat `package.json` scripts, `.env.example`, and `src/db/schema/` as the current executable sources of truth.
- Read [.specify/memory/constitution.md](.specify/memory/constitution.md) before planning or
  implementing a material change.
- Use the Spec Kit core workflow to create or select one numbered feature directory under `specs/`.
- Treat the selected feature's `spec.md`, `plan.md`, and `tasks.md` as the source of truth for
  requirements, implementation decisions, and progress.
- Do not add parallel planning systems such as `activeContext.md`, `progress.md`, Memory Bank,
  Backlog.md, or an external issue board.

## Repository map

- `src/app/`: Next.js App Router pages, layouts, and server actions.
- `src/components/`: shared and area-specific UI.
- `src/db/`: Drizzle schema, migrations, seeds, and database utilities.
- `src/env/`: validated client and server environment variables.
- `src/lib/supabase/`: Supabase browser and server clients.
- `docs/`: durable, shared documentation only.
- `specs/`: Spec Kit feature specifications, plans, research, and tasks.
- `.specify/`: pinned Spec Kit configuration, constitution, templates, scripts, and workflow.
- `.agents/skills/`: generated Spec Kit skills for the Codex integration.
- `.github/`: CI, issue forms, ownership, and pull request conventions.

## Architecture constraints

- Keep the application a Next.js monolith until a demonstrated deployment boundary requires otherwise.
- Use Drizzle for application CRUD.
- Use Supabase for Auth, Storage, and selected Realtime features.
- Treat every exported server action as a public server entry point.
- Authenticate, authorize, and validate input at the server boundary.
- Constrain tenant-owned queries by organization in SQL.
- Prefer Server Components; use Client Components only for browser-side interaction.
- Infer persisted types from Drizzle and use narrow runtime schemas for mutation inputs.
- Prefer status or archive behavior for business records unless the domain explicitly permits deletion.

## Development workflow

For material product, architecture, security, database, or operational changes:

1. Create or select one numbered feature directory with the Spec Kit core workflow.
3. Resolve meaningful ambiguity before implementation.
4. Complete the Constitution Check in `plan.md`.
5. Implement only the selected feature's `tasks.md`.
6. Run convergence and the checks relevant to the change before opening a pull request.

GitHub Issues are not required for project state. Pull requests remain the review and delivery
boundary. Community Spec Kit presets and extensions require explicit review before adoption.

Use Node 24 and the package-manager version declared in `package.json`:

```bash
nvm use
corepack enable
corepack install
pnpm install --frozen-lockfile
```

Run the checks relevant to the change:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm db:check
pnpm build
```

Run `pnpm db:migrate` against a disposable database when a migration changes. Never reset a shared database, and reserve `pnpm db:push` for local experimentation.

## Code and documentation

- Internationalize user-facing UI copy instead of hardcoding it in components or actions.
- Support only `es-MX` and `en-US` for now, with `es-MX` as the preferred and default locale.
- Follow Biome formatting and lint rules instead of hand-formatting around them.
- Keep secrets, tokens, service keys, private user data, and production database content out of the repository and logs.
- Document the architecture that exists, not a speculative future abstraction.
- Update implementation-specific documentation in the same PR as the behavior it describes.
- Remove documentation that describes components or flows that no longer exist.

## Pull requests

- Use Conventional Commits for commits and PR titles.
- Link the feature directory in the PR description.
- Keep each PR focused on one independently reviewable outcome.
- Do not mix templates, workflows, environment changes, mechanical formatting, refactors, and product behavior when they can be reviewed separately.
- Include tests and documentation required to explain and validate the changed behavior.
- Record actual automated and manual validation in the PR description.
