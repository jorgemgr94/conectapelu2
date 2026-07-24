# ConectaPelu2 Delivery Roadmap

This is the spec-of-specs portfolio for ConectaPelu2. IDs are immutable planning identifiers, not
GitHub pull request numbers. A roadmap item receives a numbered feature directory only when it is
selected for specification; completed pre-adoption work is recorded without retroactive specs.

## Status model

- **Backlog**: accepted outcome, not dependency-ready or not yet selected.
- **Ready**: dependencies satisfied; may be specified next.
- **Specifying**: requirements are being refined.
- **Planned**: spec, plan, and tasks are implementation-ready.
- **In progress**: implementation is active.
- **Done**: completion signal was verified and delivery merged.
- **Deferred**: intentionally outside the current delivery path.

## Completed foundations

| ID | Outcome | Status | Spec | Pull request |
| --- | --- | --- | --- | --- |
| BASE-01 | Reproducible toolchain, environment validation, CI, tests, and contribution baseline | Done | Historical | #2 |
| I18N-01 | `es-MX` and `en-US` catalogs and localized application UI | Done | Historical | #12 |
| AUTH-RECOVERY-01 | Password reset request, callback, and update flow | Done | Historical | #13 |
| DESIGN-01 | Approved Warm Plum product direction and staged migration boundary | Done | Historical | #14 |

These items predate Spec Kit adoption. Their merged pull requests remain the truthful execution
record.

## Milestone 1 — Secure server and tenant boundaries

**Outcome**: Authentication, application roles, tenant ownership, and browser-accessible Supabase
resources are enforced at the server and data boundaries.

**Completion signal**: Anonymous, inactive, unauthorized, and cross-tenant callers fail in tested
server scenarios while supported roles retain their intended access.

**Deferred**: Runtime command schemas and broad CRUD refactors except where a security change
directly consumes them.

| ID | Deliverable | Depends on | Status | Sub-spec | PR |
| --- | --- | --- | --- | --- | --- |
| SEC-01 | Authorization primitives and enforced admin route boundary | BASE-01 | Planned | [`001-admin-authorization`](../001-admin-authorization/) | — |
| SEC-02 | Authorized User administration actions | SEC-01 | Backlog | — | — |
| SEC-03 | Authorized Organization administration actions | SEC-01 | Backlog | — | — |
| TENANT-01 | Organization role matrix and authorization helpers | SEC-01 | Backlog | — | — |
| TENANT-02 | Tenant-scoped member operations | TENANT-01 | Backlog | — | — |
| TENANT-03 | Tenant-scoped Pet operations | TENANT-01 | Backlog | — | — |
| POLICY-01 | Supabase Storage, Data API, and Realtime policies | TENANT-01 | Backlog | — | — |
| AUTH-01 | Consistent Supabase Auth user provisioning | SEC-02 | Backlog | — | — |

## Milestone 2 — Repeatable CRUD delivery

**Outcome**: One secure, validated, tested Organization reference CRUD exists, and Users and Pets
adopt the same contracts without a generic repository.

**Depends on**: relevant Milestone 1 authorization work.

**Completion signal**: Organization, User, and tenant-owned Pet flows use correct SQL filtering,
narrow commands, stable results, and representative tests.

**Deferred**: Adoption, sponsorship, favorites, payments, and abstractions not consumed by the
reference implementation.

| ID | Deliverable | Depends on | Status | Sub-spec | PR |
| --- | --- | --- | --- | --- | --- |
| CRUD-01 | Validated Organization list and read contract | SEC-03 | Backlog | — | — |
| CRUD-02 | Validated Organization mutation contract and guide | CRUD-01 | Backlog | — | — |
| CRUD-03 | Users migrated to the reference read contract | AUTH-01, CRUD-02 | Backlog | — | — |
| CRUD-04 | Users migrated to the reference mutation contract | CRUD-03 | Backlog | — | — |
| CRUD-05 | Real organization Pet list | TENANT-03, CRUD-02 | Backlog | — | — |
| CRUD-06 | Pet create and edit lifecycle | CRUD-05 | Backlog | — | — |
| CRUD-07 | Pet status lifecycle and end-to-end reference | CRUD-06 | Backlog | — | — |
| DB-01 | Database type-source consistency | CRUD-02 | Backlog | — | — |

## Milestone 3 — Production foundation

**Outcome**: Database evolution, lifecycle behavior, privileged audit, diagnosis, deployment, and
recovery are explicit and exercised.

**Depends on**: the implemented reference CRUDs.

**Completion signal**: Common queries have evidence-backed indexes, sensitive changes are
traceable, failures are diagnosable, and a release owner can deploy and recover from written
procedures.

**Deferred**: Distributed services and infrastructure not required by the monolith.

| ID | Deliverable | Depends on | Status | Sub-spec | PR |
| --- | --- | --- | --- | --- | --- |
| DB-02 | Query indexes and migration validation | CRUD-04, CRUD-07 | Backlog | — | — |
| LIFE-01 | Lifecycle rules and optimistic concurrency | CRUD-04, CRUD-07 | Backlog | — | — |
| AUDIT-01 | Privileged-operation audit events | LIFE-01 | Backlog | — | — |
| OPS-01 | Structured errors, logging, and route failure states | DB-02, AUDIT-01 | Backlog | — | — |
| OPS-02 | Deployment, recovery, and smoke runbook | OPS-01 | Backlog | — | — |

## Milestone 4 — Controlled learning experiments

**Outcome**: Modern React, Next.js, and Supabase capabilities are evaluated in bounded slices and
retained only when evidence supports them.

**Depends on**: the secure CRUD surface used by each experiment.

**Completion signal**: Every experiment records a baseline, result, and explicit keep/remove
decision without blocking the core delivery path.

**Deferred**: Repository-wide adoption based on novelty alone.

| ID | Deliverable | Depends on | Status | Sub-spec | PR |
| --- | --- | --- | --- | --- | --- |
| LAB-01 | Modern form and action pilot | CRUD-02 | Deferred | — | — |
| LAB-02 | Cache and streaming pilot | CRUD-07, DB-02 | Deferred | — | — |
| LAB-03 | Tenant-scoped Realtime pilot | TENANT-03, CRUD-07 | Deferred | — | — |

## Parallel product UI track

**Outcome**: The approved Warm Plum direction reaches representative public, authentication, and
backoffice surfaces without delaying security work.

**Completion signal**: Each UI slice preserves behavior and localization and includes desktop and
mobile evidence.

| ID | Deliverable | Depends on | Status | Sub-spec | PR |
| --- | --- | --- | --- | --- | --- |
| UI-01 | Implement the Warm Plum homepage reference screen | DESIGN-01 | Ready | — | — |
| UI-02 | Extend the direction to public Pet catalog and detail | UI-01 | Backlog | — | — |
| UI-03 | Adapt authentication surfaces | UI-01 | Backlog | — | — |
| UI-04 | Adapt organization and admin surfaces | UI-01, CRUD-02 | Backlog | — | — |

## Selection rule

Choose one dependency-ready row, run it through the Spec Kit core flow, and keep its implementation
inside one independently reviewable pull request. Security remains the primary track; UI-01 may
proceed independently when it does not delay SEC-01.
