# Tasks: Enforce Admin Route Authorization

**Input**: [spec.md](spec.md), [research.md](research.md), [plan.md](plan.md), and
[quickstart.md](quickstart.md)

## Phase 1: Shared identity primitive

- [ ] T001 Create the server-only authorization module at
  `src/lib/auth/authorization.ts`.
- [ ] T002 Add the narrow internal dependency seam for Auth identity and application-user lookup.
- [ ] T003 Implement anonymous and missing-database-user termination in `requireUser()`.
- [ ] T004 Implement active-status enforcement in `requireUser()`.

## Phase 2: Application administrator policy

- [ ] T005 Implement `requireAppAdmin()` on top of the active-user contract.
- [ ] T006 Add explicit safe redirects for regular and organization-administrator callers.
- [ ] T007 Ensure helper return values contain application-user context without Auth tokens or
  provider metadata.

## Phase 3: Admin route integration

- [ ] T008 Replace direct Supabase and Drizzle identity queries in
  `src/app/admin/layout.tsx`.
- [ ] T009 Pass the authorized application user returned by `requireAppAdmin()` to `AdminShell`.
- [ ] T010 Confirm no unauthorized branch can reach admin child rendering.

## Phase 4: Tests

- [ ] T011 Add the anonymous caller test in `src/lib/auth/authorization.test.ts`.
- [ ] T012 Add the missing application-user test.
- [ ] T013 Add the inactive application-user test.
- [ ] T014 Add active `user` and `organization_admin` rejection tests.
- [ ] T015 Add the active `app_admin` success test.
- [ ] T016 Test that non-admin redirect destinations cannot loop into `/admin`.

## Phase 5: Validation

- [ ] T017 Run focused authorization tests.
- [ ] T018 Run `pnpm lint`, `pnpm typecheck`, `pnpm test:coverage`, and `pnpm build`.
- [ ] T019 Execute the available role walkthrough scenarios from `quickstart.md`.
- [ ] T020 Record actual automated and manual validation in the pull request.

## Dependencies and execution order

- Phase 2 depends on the active-user contract from Phase 1.
- Phase 3 depends on `requireAppAdmin()`.
- Test cases may be written alongside each policy branch but must all pass before validation.
- Manual validation follows successful automated checks.

## Deferred work

- User administration action authorization in a future feature specification.
- Organization administration action authorization in a future feature specification.
- TENANT-01: organization membership roles and app-admin override.
- Role-aware organization landing-page selection.
- Typed action errors for non-route authorization callers.
