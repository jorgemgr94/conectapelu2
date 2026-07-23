# Project analysis: modern learning monolith for CRUD/backoffice work

**Review date:** 2026-07-23

**Reviewed scope:** the current repository at commit `270bc89`

**Intended use:** a pragmatic Next.js + Supabase monolith that supports many CRUD
operations, remains fast to develop, and provides a place to learn current web technologies.

## Executive assessment

This is a **good modern prototype foundation, but not yet a safe reusable backoffice
foundation**.

The technology choices are well aligned with the goal: Next.js 16, React 19, TypeScript,
Tailwind CSS 4, Supabase, Drizzle ORM, server actions, and server components provide a current
full-stack learning environment without requiring separate frontend and backend deployments.
The monolith is the right choice at this stage.

The most important gap is not the age of the stack or a missing abstraction. It is the lack of a
consistent security and CRUD contract. Authentication is present, but authorization, tenant
isolation, input validation, error handling, and tests are inconsistent or absent. Adding more
entities by copying the current actions would multiply those risks and the existing duplication.

### Scorecard for the stated purpose

| Dimension | Score | Assessment |
| --- | ---: | --- |
| Modern technology learning | **8/10** | Very current dependencies and useful full-stack concepts, although several newer capabilities are installed but not yet exercised deeply. |
| Speed for the next few CRUDs | **7/10** | Direct Drizzle queries, server actions, shared UI primitives, pagination, and seeds make development quick. |
| Speed after many CRUDs | **5/10** | Repeated query/action/form code and inconsistent conventions will increasingly slow changes. |
| Fit as a monolith | **8/10** | Strong fit. There is no current reason to introduce services, queues, or a separate API application. |
| Security and tenant safety | **3/10** | Authentication exists, but role checks and organization ownership checks are missing at important boundaries. |
| Production readiness | **4/10** | Missing automated tests/CI, incomplete features, stale generated types/docs, limited operational safeguards, and unresolved data consistency cases. |

**Overall verdict:** continue with this stack and with a monolith. Before adding many more
entities, establish one secure, validated, tested CRUD pattern and migrate Organizations, Users,
and Pets to it.

## Current architecture

The application is a single Next.js App Router deployment with:

- React server components for most page-level reads.
- Client components for interactive shells, forms, dialogs, and Supabase Storage uploads.
- Server actions in `src/app/actions/` for reads and mutations.
- Drizzle ORM over a direct Postgres connection for application data.
- Supabase Auth for sessions and admin user provisioning.
- Supabase Storage for avatars and an unused generic Realtime hook.
- Drizzle schemas and committed SQL migrations.
- Route groups for public pages and separate `/admin`, `/org/[slug]`, and `/user` areas.

This is a sensible modular-monolith shape. The browser, server UI, domain logic, database access,
and authentication all live in one codebase and one deployment boundary. That minimizes
coordination overhead and is ideal for a normal backoffice application.

## Strong points

### 1. The stack is modern and coherent

`package.json` declares Next.js 16.1, React 19.2, TypeScript 5, Tailwind CSS 4, Biome 2, Drizzle
ORM, and the Supabase SSR package. Next.js 16 uses Turbopack by default and includes the React
19.2 generation of App Router features. The code also follows Next.js 16 conventions such as
asynchronous `params`, `searchParams`, and `cookies()`.

This gives the project high learning value while keeping the number of core technologies small.
The selected tools solve different problems and do not require a separate backend framework.

### 2. A monolith is the correct optimization

The project currently has only a few closely related domains: users, organizations, organization
members, cities, and pets. They share identity, transactions, UI, and deployment concerns.
Keeping them together enables:

- type inference from the database to server code;
- direct server-side reads without an internal HTTP hop;
- one authentication/session model;
- one migration flow;
- simple local development and deployment;
- inexpensive cross-domain queries and transactions.

Splitting this into microservices would reduce delivery speed and learning focus without solving
a current scaling problem. The better next step is a **more disciplined modular monolith**, not a
distributed system.

### 3. Server-first rendering is a good backoffice default

Page components call server-side data functions and pass the result to UI components. This avoids
shipping a general client data-fetching framework, keeps credentials server-side, and reduces the
amount of client state needed for list screens. URL-driven filters and pagination are also a good
fit for backoffice screens because they are linkable and refresh-safe.

The Organizations list is the clearest example: it converts URL parameters into database filters
and paginates on the server.

### 4. Drizzle provides a useful database source of truth

The database model has:

- explicit PostgreSQL enums;
- primary keys, foreign keys, defaults, and timestamps;
- a uniqueness constraint for organization membership;
- a unique organization slug and user email;
- inferred select/insert TypeScript types;
- committed migration metadata and SQL;
- modular, repeatable seed scripts.

This is much stronger than maintaining unrelated handwritten API and database types. Drizzle is
also appropriately lightweight for a CRUD-oriented monolith.

### 5. Supabase is used where it adds leverage

Supabase supplies managed authentication, SSR-compatible sessions, admin user creation, public
Storage URLs, and a path to Realtime. These are expensive capabilities to build from scratch.
Using Supabase Auth while retaining direct Drizzle access is a reasonable speed-oriented design
for a server-controlled monolith, provided authorization is centralized in the application.

### 6. The route structure expresses the product's roles

The separation between `/admin`, `/org/[slug]`, `/user`, and public routes makes the product model
easy to understand. Organization layouts already resolve a slug and require a membership, which
is the start of tenant-aware navigation.

### 7. The UI foundation is productive

Reusable primitives exist for buttons, forms, inputs, dialogs, tables, pagination, cards, labels,
and notifications. The application has consistent shells, sidebars, headers, responsive layouts,
empty states, and visual feedback. For internal tools, a stable component vocabulary makes future
CRUD pages much faster to produce.

### 8. There is useful seed data and enough domain complexity to learn from

The modular seeds cover users, cities, organizations, and pets and optionally synchronize users
with Supabase Auth. The domain includes roles, memberships, lifecycle statuses, filtering,
pagination, joins, file uploads, and audit fields. That is a realistic learning surface rather
than a trivial todo application.

## Middle points

These are not inherently wrong, but they need a deliberate convention before the project grows.

### 1. Direct Drizzle calls in server actions are fast now but becoming repetitive

Users, Organizations, and Pets each independently implement pagination, filters, counts, inserts,
updates, revalidation, and response shapes. This is easy to understand with three entities but
will create drift with twenty.

The answer is not necessarily a generic repository for every table. A repository layer that only
renames Drizzle methods adds ceremony and hides useful SQL. Prefer small domain modules with:

- validated input schemas;
- authorization helpers;
- query functions;
- mutation functions;
- explicit DTOs;
- shared pagination and action-result utilities.

Keep direct Drizzle access inside those modules when the query is domain-specific.

### 2. The project has validation technology, but it is not connected end to end

Drizzle TypeBox schemas are generated for several tables, and React Hook Form plus resolver
packages are installed. However, the schemas are not used by the current server actions, and the
forms mostly read raw `FormData` values manually.

The generated insert schema also exposes database-managed and audit fields unless it is narrowed.
Each mutation needs a purpose-built command schema such as `CreateOrganizationInput` or
`UpdatePetInput`. Server-side parsing is mandatory even when the same schema is used in the
browser.

### 3. Supabase and Drizzle form a useful but dual data-access model

Supabase is used for Auth, Storage, and Realtime while Drizzle performs table queries. This can be
a strong combination, but developers must understand that:

- a Drizzle query made through `DATABASE_URL` does not automatically carry the signed-in user's
  Supabase JWT;
- Supabase Data API RLS policies do not automatically authorize those Drizzle calls;
- browser Storage and Realtime access still need their own Supabase policies;
- schema types can drift if Drizzle and manually maintained Supabase types are updated separately.

For this monolith, keep Drizzle as the only application-data access path and Supabase as the
platform for Auth, Storage, and optional Realtime. Make the boundary explicit in documentation
and code.

### 4. Pagination and filtering exist but are inconsistent

Shared pagination normalization helpers exist in `src/lib/types.ts`, but the actions do not use
them. Users and Organizations reimplement pagination, and the Users page fetches one page first
and then applies search/role/status filters in memory. That produces incorrect totals, counts,
and results whenever matching users are outside the current page. Organizations filter correctly
in SQL, but calculate status counts using four list queries.

A single list-input schema and pagination helper should normalize page and limit before every
query. Filters must be applied in SQL before counting and pagination.

### 5. Realtime is an interesting learning feature but not yet a product feature

`useRealtimeCollection` is a clean generic experiment, but no current screen uses it. Broad
`postgres_changes` subscriptions that refetch whole pages may also create unnecessary work on busy
tables.

Keep Realtime optional. Backoffice CRUD usually works well with server actions plus targeted
revalidation. Introduce subscriptions only for screens with a real concurrent-update
requirement, and scope channels to the current tenant.

### 6. New Next.js features are available but not yet explored deeply

The project benefits from App Router, server components, server actions, async request APIs,
Turbopack, and React 19 indirectly. It does not yet exercise Cache Components, explicit cache
tags, React Compiler, `useActionState`, optimistic mutations, or streaming in a systematic way.

That is acceptable for a backoffice: novelty should not be added without a use case. A useful
learning strategy is to introduce one modern feature in a measured vertical slice and compare its
complexity and performance with the existing approach.

### 7. The stack is modern, but runtime and upgrade policy are not explicit

The repository does not declare a Node.js engine or a `packageManager` version, and it has no
visible dependency-update automation. Next.js 16 requires Node.js 20.9 or newer. The locked
`@supabase/ssr` version is 0.8.0, while Supabase still describes this package as beta and warns
that its API can change.

Add Node and pnpm versions to the project contract, use Corepack in development/CI, and schedule
small dependency upgrades with build and authentication smoke tests. The learning goal is better
served by regular controlled upgrades than by periodically replacing many packages at once.

### 8. The schema is a good start but is optimized for correctness more than scale

Constraints exist, but common filters and joins lack explicit indexes. Likely candidates include:

- `organization_members.user_id`;
- `organization_members.organization_id`;
- `pets.organization_id`;
- `pets.city_id`;
- `pets.status`;
- combinations used by tenant lists, such as `(organization_id, status, created_at)`;
- `organizations.status` and list ordering columns if data volume warrants them.

Indexes should be chosen from measured query patterns, but organization-scoped CRUD queries will
need them well before the database is large.

### 9. Some UI is production-shaped while the underlying feature is still a prototype

The admin Organization flow is backed by real queries. In contrast, the organization Pets page
uses hard-coded placeholder data, and user adoption/sponsorship/favorites/requests are empty,
random, or hard-coded. This is fine during product exploration, but visual completeness can hide
domain incompleteness during planning.

Label placeholder modules clearly or finish one full vertical slice before multiplying screens.

## Weak points and risks

### 1. Critical: authorization is not enforced at every server boundary

This is the first issue to fix.

- `src/app/admin/layout.tsx` checks that a Supabase user and database user exist, but does not
  require `dbUser.role === 'app_admin'`.
- User read and mutation actions do not authenticate or authorize the caller, even though user
  creation uses the Supabase service-role key.
- Organization creation and update require authentication but not an admin role; deletion has no
  authentication check.
- Pet creation and update require authentication but do not verify membership or permission for
  the supplied organization; deletion has no authentication check.
- Organization member reads accept arbitrary IDs without checking whether the caller may inspect
  that organization.
- The organization layout checks membership for rendering, but a layout is not a security
  boundary for independently callable server actions.

Next.js documents exported server actions as public-facing mutation endpoints and recommends
authorization inside each action. Hiding a button or protecting a layout is insufficient.

Create cached helpers such as:

```ts
requireUser()
requireAppAdmin()
requireOrganizationMember(organizationId)
requireOrganizationRole(organizationId, ['org_admin'])
```

Every query and mutation should call the narrowest applicable helper. Organization-owned
updates/deletes must include the organization constraint in the database `WHERE`, not merely check
an object in the UI.

### 2. Critical: there is no database defense-in-depth for tenant data

The committed migration contains no RLS enablement or policies. More importantly, direct Drizzle
connections generally execute as the configured database role, without the browser user's
Supabase Auth context.

For the recommended Drizzle-first monolith:

- application authorization is the primary control;
- use a least-privileged database role for the application connection;
- revoke unnecessary grants;
- add RLS for any tables exposed through Supabase's Data API;
- add Storage policies for avatars and future pet images;
- do not expose the service-role key to client code;
- add tenant IDs to all tenant-owned records and always constrain by them.

RLS is valuable defense-in-depth, but it must not be assumed to protect direct database queries
unless the connection and transaction explicitly establish the required role and claims.

### 3. Critical: mutation inputs allow over-posting and are not runtime validated

Examples include `updateUser(id, data: Partial<User>)` and
`updatePet(id, data: Partial<NewPet>)`. These types allow callers to submit fields that the form
does not show, including identifiers, roles, audit fields, timestamps, organization ownership, or
status transitions. TypeScript types disappear at runtime and cannot validate an action request.

Each action should:

1. parse unknown input with a narrow runtime schema;
2. reject unknown fields;
3. authorize the requested operation and target row;
4. apply server-owned values such as actor ID and timestamps;
5. return a typed success/error union.

Do not pass `$inferInsert` or an entire row type directly across a mutation boundary.

### 4. User creation can leave Supabase Auth and the application database inconsistent

`createUser` creates a Supabase Auth user and then inserts the local user. If the database insert
fails, the Auth user remains. The code comments acknowledge the missing compensation.

Because the two systems cannot share a normal database transaction, make this operation
idempotent and add a compensating delete or a repair/reconciliation process. Also decide which
system owns email, verification state, deactivation, and deletion, then synchronize those
operations explicitly.

### 5. The CRUD convention document is stale

`docs/crud-scaffolding.md` says the code uses `CrudRepository`,
`createDrizzleRepository`, repository factories, and an in-memory Pets repository. Those
abstractions no longer exist, and Pets now has a Postgres table and direct Drizzle actions.

This is especially risky in a learning repository because a developer following the guide would
reintroduce an architecture that recent commits removed. Rewrite the guide after selecting the
new secure action/domain-module convention.

### 6. Supabase database types are manually maintained and already incorrect

`src/types/supabase.ts` says it was generated manually. It omits the Pets table and differs from
the Drizzle schema:

- organization member roles are `owner | admin | member` in the Supabase type but
  `org_admin | reviewer | member` in Drizzle;
- user fields do not fully match the current users table;
- audit fields are missing from organization memberships.

Generate these types from the live/local Supabase schema in CI or remove table definitions that
are not needed by browser code. Two competing schema sources undermine the type-safety benefit.

### 7. Automated quality gates are missing

No unit, integration, or end-to-end tests are present. There is no test script, explicit
type-check script, visible CI workflow, environment example, or documented setup for Supabase
Storage policies/buckets. `next build` no longer runs linting in Next.js 16, so lint and type
checking need explicit CI steps.

The minimum gate should run:

- frozen dependency installation;
- Biome check;
- `tsc --noEmit`;
- Next.js production build;
- database migration validation;
- unit tests for validation/authorization;
- integration tests for tenant-scoped mutations;
- a small Playwright smoke suite for login and one CRUD.

The local review could not execute the existing lint or type-check commands because `pnpm` was not
installed in the review environment. This does not prove that the checks fail; it means their
current passing state was not verified.

### 8. Delete and audit behavior is not defined

Organizations and Pets are hard-deleted, while users are deactivated. Pet code contains comments
questioning the intended behavior. Audit columns record only the latest actor and timestamp; there
is no history of changes.

Define per-entity lifecycle rules:

- reference/catalog data may be hard-deleted when unused;
- business records should usually use status/archive fields;
- destructive actions should check dependencies and show impact;
- sensitive backoffice changes may need an append-only audit event.

Avoid a universal soft-delete mechanism, but make each domain decision explicit and test it.

### 9. Query correctness and efficiency have visible defects

- The Users page filters only the already-paginated result in memory.
- User role/status counts represent the current page, not the full filtered dataset.
- Organization status counts execute four list queries and fetch an unnecessary row each time.
- Random Pets uses `ORDER BY RANDOM()`, which becomes expensive as the table grows.
- Shared pagination normalization and metadata helpers are unused.
- There are no explicit indexes for the primary join/filter paths.

These are manageable now but will make backoffice lists misleading or slow as CRUD volume grows.

### 10. Configuration and operational behavior are under-documented

There is no `.env.example` describing required values, no clear distinction between pooled and
direct database URLs, no deployment notes for migrations, and no documented Supabase bucket,
Storage, RLS, or Realtime setup. Environment variables are asserted with `!`, so configuration
errors appear late at runtime.

Validate environment variables at startup and document which values are server-only. In
particular, `SUPABASE_SERVICE_ROLE_KEY` must remain server-only.

## Recommended target architecture

Keep one Next.js application and one Postgres database. Organize it as a modular monolith with a
small shared kernel:

```text
src/
  app/
    (routes and page composition)
  features/
    organizations/
      schemas.ts       # narrow runtime command/query schemas
      authorization.ts # domain-specific permission checks
      queries.ts       # server-only reads and DTO mapping
      mutations.ts     # transactions and domain rules
      actions.ts       # thin exported server-action adapters
      components/
    pets/
    users/
  lib/
    auth/              # requireUser/role/membership helpers
    action-result.ts   # standard success/error contract
    pagination.ts
    env.ts
  db/
    schema/
    migrations/
    index.ts
```

The exact folders matter less than enforcing these boundaries:

1. Pages compose features; they do not define access policy.
2. Exported server actions validate and authorize every request.
3. Domain mutations own invariants and transactions.
4. Queries return deliberate DTOs, not unrestricted database rows.
5. Drizzle is the application-data access mechanism.
6. Supabase provides Auth, Storage, and selected Realtime capabilities.
7. Cross-tenant access is constrained both in authorization logic and SQL.

Do not add a separate REST/GraphQL API until a real external client needs it. Do not add
microservices until deployment or scaling characteristics clearly differ by domain.

## A reusable CRUD contract

Before adding another entity, implement one reference CRUD with the following behavior.

### List

- Parse `page`, `limit`, sort, and filters.
- Enforce read scope before querying.
- Apply filters before count and pagination.
- Select only list DTO fields.
- Use deterministic ordering with a unique tie-breaker.
- Return normalized pagination metadata.

### Detail

- Validate the identifier.
- Apply tenant/ownership constraints in the query.
- Return `not found` for missing or inaccessible records when disclosure matters.
- Return a detail DTO rather than the raw row.

### Create

- Parse a narrow create schema.
- Authorize the target scope.
- Enforce uniqueness through database constraints, with friendly error mapping.
- Set IDs, tenant ownership, audit actor, and timestamps on the server.
- Use a transaction for local multi-table changes.
- Revalidate the smallest relevant cache paths/tags.

### Update

- Parse a narrow update schema and reject unknown fields.
- Load/check the current row or use a constrained update.
- Enforce allowed status transitions and role-dependent fields.
- Prevent tenant/owner/audit-field reassignment.
- Handle concurrent editing where it matters, for example with `updatedAt` optimistic locking.

### Delete/archive

- Authorize the exact destructive operation.
- Check dependencies.
- Prefer archive/status transitions for historical business data.
- Record an audit event when the operation is sensitive.
- Return an idempotent, typed result.

### Action result

Use one serializable result shape, for example:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: 'VALIDATION' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT';
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
```

Expected domain errors should not rely on parsing arbitrary thrown error messages.

## Delivery roadmap as coherent PRs

The roadmap should be delivered as small, sequential pull requests. Each PR must leave the
application deployable, have one primary outcome, and include the tests needed to protect that
outcome. Refactors that only prepare a later PR should be kept inside the PR that consumes them.

### Milestone overview

| PR | Deliverable | Depends on | Milestone result |
| --- | --- | --- | --- |
| **PR-01** | Reproducible toolchain and CI gate | — | Every later PR has an automated quality gate. |
| **PR-02** | Central authorization layer and secured admin boundary | PR-01 | Non-admin users cannot access or invoke admin operations. |
| **PR-03** | Organization tenant isolation and Supabase policies | PR-02 | Organization data cannot cross tenant boundaries. |
| **PR-04** | Consistent Supabase Auth user provisioning | PR-02 | Auth and application users recover safely from partial failures. |
| **PR-05** | Organizations as the reference CRUD | PR-02, PR-03 | One documented, validated, tested CRUD pattern exists. |
| **PR-06** | Users migrated to the reference CRUD | PR-04, PR-05 | User administration has correct filtering and safe updates. |
| **PR-07** | Pets migrated and organization Pets made real | PR-03, PR-05 | A complete tenant-owned CRUD replaces the placeholder workspace. |
| **PR-08** | Database contract and performance hardening | PR-05–PR-07 | Schema types, indexes, migrations, and access assumptions are reliable. |
| **PR-09** | Lifecycle rules, concurrency, and audit trail | PR-06–PR-08 | Destructive and sensitive backoffice changes are traceable and consistent. |
| **PR-10** | Deployment, observability, and recovery runbook | PR-08, PR-09 | The monolith is operable beyond a developer machine. |
| **PR-11** | Modern form/action pilot | PR-05 | One current React/Next form pattern is evaluated with real evidence. |
| **PR-12** | Cache and streaming pilot | PR-07, PR-08 | Modern rendering is introduced only where it improves measured behavior. |
| **PR-13** | Tenant-scoped Realtime pilot | PR-03, PR-07 | Realtime has one bounded use case and a measured operating cost. |

PR-01 through PR-10 are the delivery path. PR-11 through PR-13 are independent learning
experiments after their dependencies and must not block normal CRUD delivery.

### Milestone 1: safe to extend

#### PR-01 — Reproducible toolchain and CI gate

**Outcome:** a fresh checkout and every pull request run the same deterministic checks.

**Scope:**

- declare supported Node.js and pnpm versions with `engines` and `packageManager`;
- add `.env.example` with server-only/public variable descriptions and startup validation;
- add explicit `lint`, `typecheck`, `test`, and production `build` scripts;
- establish the test runner and one smoke test;
- add CI for frozen installation, Biome, TypeScript, tests, build, and migration validation;
- document local setup, Corepack usage, and the distinction between direct and pooled database
  URLs.

**Acceptance criteria:**

- a clean checkout can follow the documented setup without undocumented variables;
- CI fails independently for lint, type, test, build, or migration errors;
- logs and build output never print secrets;
- no product behavior or application architecture changes in this PR.

#### PR-02 — Central authorization layer and secured admin boundary

**Outcome:** authentication and application roles are verified at the server boundary rather than
only in layouts or UI.

**Scope:**

- add server-only `requireUser()` and `requireAppAdmin()` helpers that load the current database
  user;
- add the missing `app_admin` check to `/admin`;
- apply admin authorization inside all User and admin Organization reads/mutations;
- isolate service-role Supabase client creation in a server-only module;
- replace the insecure admin fallback in `getLoginRedirectPath`;
- add authorization tests for anonymous, regular, inactive, organization, and app-admin users.

**Acceptance criteria:**

- a regular authenticated user cannot render an admin route or directly invoke an admin action;
- an inactive user cannot acquire privileged access;
- every service-role operation first proves the caller is an app admin;
- redirects improve navigation but are not relied on as the security control.

**Out of scope:** organization tenant roles, input-schema refactoring, and visual redesign.

#### PR-03 — Organization tenant isolation and Supabase policies

**Outcome:** every organization-owned operation is constrained to an authorized organization.

**Scope:**

- add `requireOrganizationMember()` and `requireOrganizationRole()` using the database membership;
- define the intended app-admin override explicitly;
- authorize Organization Member and Pet reads/mutations inside their server entry points;
- include `organizationId` in update/delete SQL predicates to prevent cross-tenant object access;
- add Storage policies for avatars and future pet images;
- add or verify RLS policies for tables exposed through Supabase's Data API and Realtime;
- document that direct Drizzle queries do not inherit the browser user's Supabase Auth context;
- add a role/operation authorization matrix and integration tests for two separate organizations.

**Acceptance criteria:**

- knowing a row ID from organization B never lets a member of organization A read or mutate it;
- member, reviewer, org-admin, and app-admin behavior matches the documented matrix;
- browser Storage/Data API access is denied unless a policy explicitly allows it;
- server-side authorization remains required even when RLS is enabled.

**Out of scope:** generic repositories and new product entities.

#### PR-04 — Consistent Supabase Auth user provisioning

**Outcome:** user administration cannot silently leave Supabase Auth and the application database
in conflicting states.

**Scope:**

- define ownership of email, verification, status, deactivation, and deletion fields;
- make user creation idempotent;
- compensate by removing or marking the Auth user when the database insert fails;
- synchronize supported email/status operations between the two stores;
- map expected duplicate and provider errors to typed application errors;
- add tests that inject a failure before and after each external operation;
- document a small reconciliation procedure for existing inconsistent users.

**Acceptance criteria:**

- retrying the same create request does not create duplicate users;
- simulated database failure does not leave an unexplained active Auth user;
- partial failures produce an actionable result and can be reconciled;
- the service-role key remains server-only.

### Milestone 2: repeatable CRUD delivery

#### PR-05 — Organizations as the reference CRUD

**Outcome:** Organizations becomes the canonical example for adding future entities.

**Scope:**

- create a cohesive Organization domain module with command schemas, authorization, queries,
  mutations, DTOs, and thin action adapters;
- use narrow TypeBox create/update/list schemas and reject unknown fields at runtime;
- introduce the shared `ActionResult`, pagination normalization, and database-error mapping;
- apply search/status filters before count and pagination;
- replace four list calls for status totals with a dedicated aggregate query;
- constrain editable fields and set audit fields on the server;
- add tests for list, detail, create, update, conflict, authorization, and archive/delete behavior;
- rewrite `docs/crud-scaffolding.md` from the implemented pattern.

**Acceptance criteria:**

- invalid and over-posted fields never reach Drizzle;
- pagination totals and status counts are correct for every filter combination;
- expected failures use stable result codes rather than arbitrary thrown messages;
- the CRUD guide points to real current files and can be followed for the next entity.

**Out of scope:** a generic repository, global state, and a separate API layer.

#### PR-06 — Users migrated to the reference CRUD

**Outcome:** User administration uses the same contracts and produces correct results at any data
volume.

**Scope:**

- split User command schemas, queries, mutations, DTOs, and actions using the PR-05 convention;
- apply search, role, and status filters in SQL before pagination;
- replace current-page role/status counts with a database aggregate;
- replace `Partial<User>` with separate admin-edit and self-edit allowlists;
- prevent identifier, timestamp, verification, and unauthorized role changes;
- connect forms to the shared validation and action-result contract;
- add authorization, filtering, role-transition, and Auth synchronization tests.

**Acceptance criteria:**

- matching users are returned even when they were outside the previously loaded page;
- counts represent the complete filtered dataset;
- only explicitly allowed fields can be changed;
- user creation/edit/deactivation passes the PR-04 consistency cases.

#### PR-07 — Pets migrated and organization Pets made real

**Outcome:** the hard-coded organization Pets screen becomes a complete tenant-owned CRUD.

**Scope:**

- create the Pet domain module following the reference CRUD;
- replace the organization Pets placeholder array with database list/filter/pagination queries;
- add real create, detail, edit, status-transition, and approved delete/archive flows;
- validate organization, city, species, size, sex, origin, date, and status inputs;
- enforce organization role checks and tenant-constrained SQL for every mutation;
- replace `ORDER BY RANDOM()` where it becomes a measurable issue with a bounded selection
  strategy;
- add integration tests using two organizations and end-to-end coverage for one complete Pet
  lifecycle.

**Acceptance criteria:**

- no hard-coded Pet records remain in the organization workspace;
- an authorized organization operator can complete the supported lifecycle through the UI;
- another organization's operator cannot inspect or mutate the Pet by guessing its ID;
- list filters, pagination, empty states, and revalidation remain correct.

**Out of scope:** adoption, sponsorship, favorites, and payment workflows. Each is a later domain,
not part of Pet CRUD.

### Milestone 3: production foundation

#### PR-08 — Database contract and performance hardening

**Outcome:** database schema evolution and common backoffice queries are safe and predictable.

**Scope:**

- generate Supabase types from the schema or remove unused manual table types;
- eliminate current Drizzle/Supabase enum and column drift;
- add indexes for verified membership, organization, Pet, status, and ordering query paths;
- inspect query plans for the main Organization, User, and Pet lists;
- document least-privileged application database access and Data API exposure;
- validate committed migrations from an empty database and from the previous schema;
- document when `db:push` is allowed and require migrations for shared/production environments.

**Acceptance criteria:**

- there is one automated source for browser-facing database types;
- the stale membership roles and missing Pets type cannot recur unnoticed;
- each added index maps to an observed query or authorization policy;
- CI proves that a clean database can reach the current schema using committed migrations.

#### PR-09 — Lifecycle rules, concurrency, and audit trail

**Outcome:** destructive and sensitive backoffice operations have explicit, traceable semantics.

**Scope:**

- document per-entity hard-delete, archive, deactivate, and retention rules;
- enforce allowed status transitions for Users, Organizations, and Pets;
- add optimistic concurrency for edit conflicts where overwrites matter;
- introduce an append-only audit event for privileged changes;
- show dependency impact and require confirmation for destructive operations;
- ensure archived records are handled consistently by default list queries.

**Acceptance criteria:**

- two operators cannot unknowingly overwrite a protected edit;
- invalid lifecycle transitions fail with a domain error;
- privileged role/status/delete/archive changes record actor, target, time, and safe metadata;
- tests prove archived records and dependencies behave according to the documented policy.

#### PR-10 — Deployment, observability, and recovery runbook

**Outcome:** a deployment can be diagnosed, migrated, and recovered without relying on unwritten
knowledge.

**Scope:**

- add structured, redacted server logging with request/operation correlation;
- connect the selected error-monitoring provider or expose a replaceable monitoring boundary;
- add error boundaries and actionable failure states for critical backoffice routes;
- document migration order, deployment checks, rollback/forward-fix strategy, and seed restrictions;
- document backup/restore, Auth-user reconciliation, Storage policies, and incident checks;
- add a post-deployment smoke workflow for login, authorization, and one CRUD.

**Acceptance criteria:**

- an expected application error is distinguishable from an infrastructure failure;
- logs contain no password, token, service key, or unnecessary personal data;
- a release owner can deploy and run the smoke checks from the documentation alone;
- the recovery procedure is exercised in a non-production environment.

### Milestone 4: controlled modern-technology learning

Each experiment is a separate PR so it can be measured, reviewed, or reverted without destabilizing
the CRUD foundation. Its PR description must record the baseline, result, decision, and follow-up.

#### PR-11 — Modern form/action pilot

Use one Organization form to compare the established client submission with `useActionState` and
progressive-enhancement server actions. Add pending/error states and, only for a reversible
low-risk field, evaluate optimistic UI. Keep the new approach only if validation, accessibility,
testability, and user experience are at least as clear as the reference pattern.

#### PR-12 — Cache and streaming pilot

Use one dashboard with independent panels to evaluate Suspense/streaming and targeted cache tags.
Measure request count and render timing, prove authenticated data cannot leak across users, and
retain the change only when it improves a real bottleneck. This PR may also evaluate React
Compiler separately, but must not mix compiler-related rewrites with cache behavior.

#### PR-13 — Tenant-scoped Realtime pilot

Use the organization Pets list as the only initial Realtime screen. Filter events to the current
organization, coalesce bursts rather than refetch on every event, and measure channel/query cost.
The acceptance decision is explicit: keep it for demonstrated concurrent-work value or remove the
subscription and retain server-action revalidation.

### Definition of done for every PR

- the PR description states the user-visible or operational outcome;
- scope, exclusions, migration impact, and rollback/forward-fix path are explicit;
- authorization is tested at the server boundary, not inferred from the UI;
- new inputs have runtime validation and typed expected errors;
- lint, type-check, tests, build, and applicable migration checks pass;
- documentation changes land with the code they describe;
- no unrelated architecture, formatting, or design-system rewrite is included;
- the application remains deployable after merge.

This sequence first makes the current application safe, then makes CRUD repeatable, then hardens
operations. Newer React, Next.js, and Supabase capabilities remain deliberate learning increments
instead of becoming project-wide experiments.

## What should deliberately remain simple

- Keep a single Next.js deployment.
- Keep one Postgres database.
- Keep Drizzle queries explicit; abstract repeated policy and contracts, not SQL itself.
- Keep server rendering as the default for lists and detail pages.
- Keep URL state for search, filters, sort, and pagination.
- Keep Realtime optional.
- Avoid global state unless multiple client-only features truly share it.
- Avoid event buses, CQRS, generic repositories, and service boundaries until the domain requires
  them.

## Final conclusion

The project already succeeds as a modern learning prototype and has the right major technologies
for a fast CRUD monolith. Its strongest quality is the coherent, server-first stack. Its weakest
quality is that security and mutation contracts are not yet systematic.

The highest-value improvement is therefore not another framework or a more generic abstraction.
It is one secure reference CRUD that centralizes authorization, validates runtime input, scopes
tenant queries, returns consistent results, and is covered by tests. Once that pattern exists, the
current stack can support a large regular backoffice efficiently while remaining a useful place
to learn current Next.js, React, Supabase, and PostgreSQL practices.

## Official references

- [Next.js 16 release](https://nextjs.org/blog/next-16)
- [Next.js authentication and authorization guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js `use server` security considerations](https://nextjs.org/docs/app/api-reference/directives/use-server)
- [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase client setup for Next.js SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&queryGroups=framework)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
