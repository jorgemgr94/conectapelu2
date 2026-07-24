# Implementation Plan: Enforce Admin Route Authorization

**Branch**: `001-admin-authorization` | **Date**: 2026-07-24 |
**Spec**: [spec.md](spec.md)

**Input**: SEC-01 from the project roadmap.

## Summary

Create a server-only application identity module that verifies the current Supabase user, resolves
the matching Drizzle user, rejects missing/inactive states, and enforces `app_admin`. Replace the
admin layout's direct Auth/database lookup with `requireAppAdmin()` and cover every supported
identity, role, and status branch with focused Vitest tests.

## Technical Context

**Language/Version**: TypeScript 5 on Node.js 24.

**Primary Dependencies**: Next.js 16 navigation, Supabase SSR server client, Drizzle ORM.

**Storage**: Existing PostgreSQL `users` table; no schema changes.

**Testing**: Vitest with dependency fakes for Supabase identity and application-user lookup.

**Target Platform**: Next.js App Router server runtime.

**Project Type**: Next.js monolith.

**Performance Goals**: One Auth verification and one indexed primary-key user lookup per protected
request, matching the current layout cost.

**Constraints**: Server-only module, no token exposure, no middleware, no tenant policy, no action
authorization, and no UI redesign.

**Scale/Scope**: One shared identity module, one protected layout migration, and focused unit tests.

## Constitution Check

- **One Deployable Monolith**: Pass. The helper remains inside the Next.js application.
- **Server-Boundary Security**: Pass. The role/status proof moves to a reusable server boundary.
- **Explicit Data Ownership**: Pass. Supabase proves identity; Drizzle remains role/status truth.
- **Server-First Delivery**: Pass. Authorization executes on the server with no client state.
- **Specification-Driven Change**: Pass. SEC-01 is isolated from action and tenant hardening.

## Project Structure

### Documentation

```text
specs/001-admin-authorization/
├── spec.md
├── research.md
├── plan.md
├── quickstart.md
└── tasks.md
```

### Source code

```text
src/
├── app/
│   └── admin/
│       └── layout.tsx
└── lib/
    └── auth/
        ├── authorization.ts
        └── authorization.test.ts
```

**Structure Decision**: `src/lib/auth/` owns cross-domain server identity and application-role
primitives. Domain-specific organization capabilities remain outside this feature.

## Implementation approach

1. Add a server-only module with a narrow application-user resolver.
2. Separate the identity/status decision logic from real Supabase/Drizzle wiring just enough to
   test all branches deterministically.
3. Implement `requireUser()` for authenticated, existing, active application users.
4. Implement `requireAppAdmin()` on top of `requireUser()`.
5. Use explicit internal redirect destinations for anonymous, missing, inactive, and forbidden
   states.
6. Replace direct identity queries in `AdminLayout` with `requireAppAdmin()`.
7. Pass the returned application user into `AdminShell`.
8. Run focused tests, full coverage, lint, typecheck, and build.

## Complexity Tracking

No constitution violations require justification.
