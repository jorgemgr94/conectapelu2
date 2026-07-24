# Research: ConectaPelu2 Project Baseline

**Review date**: 2026-07-23

**Initial reviewed commit**: `270bc89`

**Refreshed against**: `origin/main` at `02db3a2`

## Objective and assessment

ConectaPelu2 is a pragmatic Next.js and Supabase monolith intended to support many CRUD and
backoffice operations while providing a place to learn current full-stack web technologies.

The repository is a good modern prototype foundation, but it is not yet a safe reusable
backoffice foundation. The stack and deployment shape fit the goal. The primary gap is the lack
of one consistently enforced security and CRUD contract across authentication, authorization,
tenant isolation, runtime validation, error handling, and tests.

| Dimension | Score | Assessment |
| --- | ---: | --- |
| Modern technology learning | 8/10 | Current dependencies and useful full-stack concepts. |
| Speed for the next few CRUDs | 7/10 | Direct Drizzle queries and shared UI keep delivery fast. |
| Speed after many CRUDs | 5/10 | Repeated query, action, and form conventions will drift. |
| Fit as a monolith | 8/10 | The domains share identity, data, UI, and deployment concerns. |
| Security and tenant safety | 3/10 | Important boundaries lack role and ownership enforcement. |
| Production readiness | 5/10 | Quality gates now exist, but domain and operational safeguards remain incomplete. |

## Current architecture

The application is one Next.js App Router deployment with:

- React Server Components for most page-level reads;
- Client Components for interactive forms, shells, dialogs, and uploads;
- exported server actions in `src/app/actions/`;
- Drizzle ORM over PostgreSQL for application data;
- Supabase Auth for sessions and privileged user provisioning;
- Supabase Storage for avatars and an unused generic Realtime hook;
- modular Drizzle schemas and committed SQL migrations;
- route areas for public pages, `/admin`, `/org/[slug]`, and `/user`;
- `next-intl` catalogs for `es-MX` and `en-US`;
- Biome, TypeScript, Vitest, migration checks, builds, and GitHub Actions.

This is an appropriate modular-monolith shape. Browser UI, server composition, domain behavior,
database access, and authentication share one codebase and deployment boundary.

## Strong points to preserve

### Modern, coherent stack

`package.json` declares Next.js 16, React 19, TypeScript, Tailwind CSS 4, Biome, Drizzle, Supabase
SSR, Vitest, Node 24, and a pinned pnpm release. The tools solve distinct problems without
requiring a separate backend.

### Correct monolith optimization

Users, organizations, organization members, cities, and pets share transactions and identity.
Direct server-side reads, one migration flow, and one deployment reduce coordination overhead.
There is no demonstrated service boundary.

### Productive server-first rendering

Page components perform server reads and pass deliberate data into UI components. URL-driven
filters and pagination fit backoffice screens because they remain linkable and refresh-safe.

### Drizzle as the database source of truth

The schema includes PostgreSQL enums, keys, defaults, timestamps, uniqueness constraints,
inferred types, and committed migrations. This is stronger than parallel handwritten persistence
types.

### Focused use of Supabase

Supabase provides managed Auth, SSR sessions, privileged user creation, Storage, and an optional
Realtime path. These capabilities add leverage when their authorization boundary remains
explicit.

### Role-shaped route structure

The `/admin`, `/org/[slug]`, `/user`, and public route areas make the product model easy to
understand. Organization layouts already resolve a slug and membership, which is a useful start
for tenant-aware navigation.

### Reusable UI and localization foundations

Buttons, forms, dialogs, tables, pagination, cards, shells, empty states, and localized message
catalogs give future CRUD work a stable vocabulary. The Warm Plum design direction provides
product-specific visual constraints without forcing an immediate redesign.

### Reproducible delivery baseline

PR #2 established Node/pnpm contracts, environment validation, automated checks, contribution
conventions, and a pull-request baseline. These controls make later security and CRUD work safer
to review.

## Middle points requiring a convention

### Direct Drizzle calls are becoming repetitive

Users, organizations, and pets independently implement list queries, pagination, filters,
counts, inserts, updates, revalidation, and result shapes. Direct SQL remains useful, but
repeated policy should move into cohesive domain modules with schemas, authorization, queries,
mutations, DTOs, and thin action adapters.

### Runtime validation is not connected end to end

Drizzle TypeBox schemas and form libraries exist, but exported actions still accept raw or broad
inputs. Generated insert types expose fields that callers should never control. Every mutation
needs a purpose-built command schema parsed again on the server.

### Supabase and Drizzle create two access contexts

Drizzle database calls do not inherit a browser user's Supabase JWT or Data API policies.
Browser Storage and Realtime access still require Supabase policies. Developers need one explicit
rule: Drizzle owns application CRUD; Supabase owns Auth, Storage, and selected Realtime.

### Pagination and filtering are inconsistent

Organizations apply filters in SQL, while Users loads a page and applies some filters in memory.
This produces incorrect matches, totals, and status counts when relevant users are outside the
loaded page. Filters must run before count and pagination.

### Realtime is an experiment rather than a product requirement

`useRealtimeCollection` exists but no screen depends on it. Broad subscriptions that refetch
whole pages can add cost and complexity. Realtime should remain optional until a bounded
concurrent-update scenario demonstrates value.

### New framework capabilities are available but unproven

The project uses App Router, server actions, asynchronous request APIs, and Server Components.
Cache Components, explicit tags, `useActionState`, optimistic updates, streaming, and compiler
behavior have not been evaluated systematically. Each should begin as a measurable feature
slice.

### Schema constraints precede query indexes

Likely tenant and list paths will eventually need indexes for memberships, organization-owned
pets, status, and deterministic ordering. Indexes should follow real query shapes and plans,
not a speculative global pass.

### Production-shaped UI masks placeholder domains

Admin organizations use real data, but some organization pet and user-adoption surfaces remain
hard-coded or empty. Planning must distinguish visual completeness from implemented domain
behavior.

## Weak points and material risks

### Critical: authorization is not enforced at every server boundary

`src/app/admin/layout.tsx` verifies an Auth user and database row but does not require
`app_admin` or an active status. Exported User and Organization actions can be called directly;
layout checks and hidden navigation are not authorization controls.

**Direction**: introduce tested server-only identity and role primitives, consume them at route
and action boundaries, and harden each domain in small specs.

### Critical: tenant isolation lacks defense in depth

Organization-owned operations are not uniformly constrained by authorized organization in both
policy logic and SQL. Knowledge of a row ID must never be enough to cross tenants.

**Direction**: define a role/capability matrix, require membership or role, and include tenant
predicates in every read and mutation.

### Critical: mutations allow over-posting

Broad insert or partial row types permit callers to attempt changes to role, tenant, audit,
identifier, or lifecycle fields. TypeScript does not validate runtime input.

**Direction**: use narrow create/update commands, reject unknown fields, and set protected values
on the server.

### Auth and application users can diverge

Privileged user creation spans Supabase Auth and PostgreSQL without one atomic transaction.
Partial failures can leave unexplained accounts.

**Direction**: define field ownership, idempotency, compensation, typed provider errors, and a
reconciliation procedure.

### Existing CRUD guidance is not authoritative

Historical CRUD guidance describes patterns that are not consistently implemented.

**Direction**: document a reference pattern only after Organizations proves it end to end.

### Database types can drift across access mechanisms

Manually maintained Supabase table types can disagree with Drizzle schema and enums.

**Direction**: generate browser-facing types from the database or remove unused parallel types.

### Lifecycle and audit semantics are incomplete

Hard delete, archive, deactivate, allowed transitions, edit conflicts, and privileged audit
events are not consistently defined.

**Direction**: establish semantics per domain after reference CRUDs expose the real needs.

### Query correctness and efficiency have visible defects

In-memory User filtering and repeated aggregate list calls produce incorrect or unnecessarily
expensive results.

**Direction**: normalize list inputs and implement filtered SQL counts and aggregates.

### Operational behavior remains under-documented

Deployment order, migration recovery, Auth reconciliation, Storage policies, structured errors,
and post-deployment smoke checks need written and exercised procedures.

**Direction**: add operational guidance after database and lifecycle contracts stabilize.

## Key decisions

- Preserve one Next.js monolith and one PostgreSQL database.
- Keep Drizzle queries explicit; abstract repeated contracts and policy rather than SQL itself.
- Use Supabase for Auth, Storage, and selected Realtime only.
- Make Server Components and URL state the defaults.
- Establish security and a reference CRUD before multiplying entities.
- Keep controlled learning experiments off the critical delivery path.
- Use Spec Kit core as the sole planning and active-work framework.

## Superseded material

The previous local, Git-ignored `project-analysis.md` contained a detailed historical roadmap
numbered PR-01 through PR-13. It was superseded on 2026-07-23 by stable domain IDs such as SEC-01
and CRUD-01. Its durable findings, decisions, outcomes, dependencies, and completed PR references
were migrated into the foundation artifacts. The obsolete line-by-line task prose was deliberately
not recreated because doing so would imply active planning artifacts that did not exist when the
work was performed.

## References

- [Next.js authentication and authorization](https://nextjs.org/docs/app/guides/authentication)
- [Next.js `use server` security](https://nextjs.org/docs/app/api-reference/directives/use-server)
- [Supabase server-side Auth](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
- [GitHub Spec Kit](https://github.github.io/spec-kit/)
