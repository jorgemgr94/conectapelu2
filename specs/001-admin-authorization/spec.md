# Feature Specification: Enforce Admin Route Authorization

**Feature Branch**: `001-admin-authorization`

**Created**: 2026-07-24

**Status**: Planned

**Input**: Only an active application administrator may render `/admin`; establish the first
shared server-only identity and role primitives without expanding into action authorization or
tenant policy.

## User Scenarios & Testing

### User Story 1 - Active administrator enters the admin area (Priority: P1)

As an active application administrator, I can render `/admin` and its descendants so that I can
perform platform administration.

**Why this priority**: This is the only role intended to use the admin shell.

**Independent Test**: An authenticated Supabase user whose matching database row is active and has
the `app_admin` role reaches the admin shell.

**Acceptance Scenarios**:

1. **Given** a valid Auth session and an active `app_admin` database row, **When** `/admin` is
   requested, **Then** the admin shell renders with that database user.

---

### User Story 2 - Unauthorized identities are rejected (Priority: P1)

As a non-administrator or inactive identity, I cannot render the admin area even if I know its URL.

**Why this priority**: The current layout accepts any authenticated user with a database row.

**Independent Test**: Anonymous, missing-database-user, inactive, `user`, and
`organization_admin` scenarios all terminate before the admin shell renders.

**Acceptance Scenarios**:

1. **Given** no Auth session, **When** `/admin` is requested, **Then** the caller is redirected to
   login.
2. **Given** an Auth identity without a matching application user, **When** `/admin` is requested,
   **Then** the caller is redirected with a non-sensitive missing-user reason.
3. **Given** an inactive application user, **When** `/admin` is requested, **Then** the caller is
   redirected and cannot render the shell.
4. **Given** an active `user` or `organization_admin`, **When** `/admin` is requested, **Then** the
   caller is redirected to the safe non-admin area.

---

### User Story 3 - Later boundaries reuse one identity contract (Priority: P2)

As a maintainer, I can reuse tested server-only `requireUser()` and `requireAppAdmin()` primitives
so later action hardening does not repeat session and database-user resolution.

**Why this priority**: Later action-authorization features depend on a consistent identity and
role contract.

**Independent Test**: Unit tests exercise the primitives without rendering the layout, and the
layout delegates to `requireAppAdmin()` rather than querying Auth and Drizzle itself.

**Acceptance Scenarios**:

1. **Given** a supported identity state, **When** `requireUser()` runs, **Then** it either returns
   the narrow active application user or terminates through the documented redirect.
2. **Given** an active non-admin user, **When** `requireAppAdmin()` runs, **Then** it terminates
   before returning privileged context.

### Edge Cases

- A Supabase identity may exist while its application row does not.
- A database user may be inactive even though the Auth session remains valid.
- A database role may be changed while an older browser session remains active.
- Authorization redirects must not loop back into `/admin`.
- Helpers must not expose tokens, provider metadata, or unrestricted Auth objects.

## Requirements

### Functional Requirements

- **FR-001**: The implementation MUST provide a server-only current-user resolution primitive.
- **FR-002**: `requireUser()` MUST verify a live Supabase user through the server client.
- **FR-003**: `requireUser()` MUST load the matching Drizzle user by Auth ID.
- **FR-004**: Missing Auth, missing database user, and inactive user states MUST terminate before
  protected content executes.
- **FR-005**: `requireAppAdmin()` MUST accept only an active user with role `app_admin`.
- **FR-006**: Active `user` and `organization_admin` callers MUST NOT render the admin shell.
- **FR-007**: `src/app/admin/layout.tsx` MUST delegate authorization to `requireAppAdmin()`.
- **FR-008**: The helper return value MUST contain only application-user data required by callers.
- **FR-009**: Tests MUST cover anonymous, missing database row, inactive, regular user,
  organization administrator, and application administrator cases.
- **FR-010**: Redirect destinations MUST be explicit, internal, and incapable of creating an admin
  redirect loop.
- **FR-011**: The change MUST NOT authorize User or Organization actions; those require separate
  future feature specifications.
- **FR-012**: The change MUST NOT introduce organization membership policy or modify database
  schema, migrations, environment variables, or UI design.

### Key Entities

- **Auth identity**: Supabase's verified current user, used only to establish identity.
- **Application user**: Drizzle user row containing application role and active status.
- **Authorization primitive**: Server-only function that either returns permitted application
  context or terminates the request.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All five unauthorized identity/role categories fail before `AdminShell` renders.
- **SC-002**: An active `app_admin` remains able to render the admin area.
- **SC-003**: The admin layout contains no direct Supabase or Drizzle identity query.
- **SC-004**: Focused authorization tests pass for every role/status branch.
- **SC-005**: Existing lint, type, test, and build checks remain green.

## Assumptions

- `/user` is the safe fallback for authenticated non-admin callers in this bounded feature;
  organization-specific destination selection remains separate.
- Redirects improve navigation but are not the underlying authorization proof.
- Database role and status are authoritative for application access.
- Action-level admin authorization follows in separate future feature specifications.
