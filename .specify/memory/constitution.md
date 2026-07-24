# ConectaPelu2 Constitution

## Core Principles

### I. One Deployable Monolith

ConectaPelu2 MUST remain one Next.js application backed by one PostgreSQL database until an
observed deployment, scaling, or ownership boundary requires separation. Features MUST prefer
cohesive domain modules inside the monolith over internal network APIs, generic repositories,
event buses, or speculative services. Every exception MUST identify the demonstrated boundary
and the simpler alternative that was rejected.

### II. Server-Boundary Security

Every exported server action and server-side mutation MUST be treated as a public entry point.
It MUST authenticate the caller, authorize the requested operation, validate a narrow runtime
input, and avoid disclosing inaccessible records. Tenant-owned reads and writes MUST constrain
the organization in SQL. UI visibility, layouts, redirects, and Supabase policies MAY improve
defense in depth but MUST NOT replace server-boundary authorization.

### III. Explicit Data Ownership and Lifecycle

Drizzle schema and committed migrations are the source of truth for persisted application data.
Application CRUD MUST use Drizzle. Supabase MUST be limited to Auth, Storage, and selected,
justified Realtime capabilities. Server code MUST assign identifiers, ownership, audit actors,
and timestamps. Business records SHOULD use status, archive, or deactivate behavior unless the
domain explicitly permits deletion. Multi-record invariants MUST use transactions when the
database can enforce them.

### IV. Server-First, Localized Product Delivery

Server Components MUST be the default. Client Components require browser-side interaction.
User-visible copy MUST exist in both `es-MX` and `en-US`; `es-MX` remains the preferred and
default locale. Lists SHOULD keep filters, sort, and pagination in URL state. New framework
features, caching, streaming, optimistic behavior, or Realtime MUST start as a bounded,
measurable vertical slice rather than a repository-wide abstraction.

### V. Specification-Driven, Reviewable Change

Spec Kit artifacts under `specs/` are the source of truth for planned and active work. A material
change MUST begin with a scoped `spec.md`, resolve meaningful ambiguity before implementation,
record its technical approach in `plan.md`, and decompose execution in `tasks.md`. Each spec
SHOULD produce one independently understandable, testable, and revertible pull request.
Unrelated configuration, automation, formatting, refactors, and product behavior MUST be split
when they can be reviewed independently.

## Technology and Quality Constraints

- Runtime: Node.js 24 and the pnpm version declared in `package.json`.
- Application: Next.js App Router, React, TypeScript, Tailwind CSS, and a single deployment.
- Data: PostgreSQL with Drizzle for CRUD and migrations.
- Platform services: Supabase Auth, Storage, and explicitly selected Realtime features.
- Validation: narrow runtime schemas at mutation boundaries; persisted types inferred from Drizzle.
- Quality: Biome, TypeScript, Vitest, migration checks, and production builds as applicable.
- Security: credentials, tokens, private data, and production database content MUST stay out of
  source control, specs, logs, screenshots, and pull requests.
- Documentation MUST describe implemented behavior. Stale descriptions MUST be updated or removed.

## Specification and Delivery Workflow

1. Select the next dependency-ready entry from `specs/000-project-foundation/roadmap.md`.
2. Create or refine its numbered feature directory through the Spec Kit workflow.
3. Keep requirements technology-agnostic in `spec.md`; implementation choices belong in
   `plan.md` and supporting research.
4. Run clarification, checklist, and cross-artifact analysis whenever ambiguity or risk warrants
   the full workflow.
5. Implement only tasks in the selected spec. Newly discovered independent work returns to the
   roadmap or a later spec.
6. Run checks proportional to the change and record actual validation in the pull request.
7. Mark tasks complete only after their observable result is verified. Converge the implementation
   against the spec before considering the work complete.

GitHub Issues and external project boards are not required for project state. Git and pull
requests provide review and delivery history; the roadmap and feature artifacts retain intent,
dependencies, decisions, and execution state.

## Governance

This constitution governs all Spec Kit plans and implementations in this repository. `AGENTS.md`
may provide operational detail but MUST remain consistent with these principles. Amendments require
an explicit rationale, an impact assessment for active specs, and a version change:

- MAJOR for a principle removal or incompatible governance change;
- MINOR for a new principle or materially expanded requirement;
- PATCH for clarification without semantic change.

Every plan MUST complete the Constitution Check before implementation. Unjustified violations block
delivery.

**Version**: 1.0.0 | **Ratified**: 2026-07-24 | **Last Amended**: 2026-07-24
