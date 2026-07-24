# Research: Admin Route Authorization

## Current evidence

`src/app/admin/layout.tsx` currently:

1. calls the Supabase server client and `auth.getUser()`;
2. redirects anonymous callers to `/login`;
3. loads `usersTable` directly by Auth ID;
4. redirects only when the database row is missing;
5. renders `AdminShell` without checking `status` or `role`.

Consequently, an active or inactive `user` or `organization_admin` with a database row can render
the admin shell by requesting `/admin` directly.

The same session/database-user lookup is repeated in organization and user layouts. Those layouts
have different domain policy and are not part of SEC-01, but the duplication supports extracting
the identity primitive now.

`src/app/actions/auth.ts` computes post-login destinations and currently catches unexpected errors
by returning `/admin/dashboard`. SEC-01 must not depend on this fallback because an authorization
redirect could loop back to the protected route. Correcting the broader login-routing contract is
independent work unless implementation proves it blocks the bounded helper.

## Decisions

### Use a server-only helper rather than layout-local checks

The layout is only one caller. SEC-02 and SEC-03 will need the same proof inside exported actions.
A shared helper prevents later code from treating a layout check as sufficient authorization.

### Resolve Auth first, application policy second

Supabase proves the current identity. Drizzle provides application status and role. Neither alone
is enough:

- a Supabase user may not have a corresponding application row;
- a valid session may belong to an inactive application user;
- application role changes must take effect without recreating the Auth identity.

### Return application context only

Callers need the application user, not the access token or provider metadata. Keeping the return
value narrow reduces accidental leakage and discourages provider-specific policy.

### Keep redirects at the helper boundary for this first slice

Next.js `redirect()` terminates control flow and matches the existing route behavior. Typed
authorization errors may be appropriate for server actions later, but introducing both redirect
and action-result adapters in SEC-01 would mix route authorization with SEC-02.

### Use `/user` as the safe non-admin destination

Resolving an organization dashboard requires membership and slug policy that belongs to TENANT-01.
`/user` is an existing internal route and cannot loop into `/admin`. A later navigation feature
may provide a richer role-aware destination without changing authorization correctness.

### Add a test seam around external dependencies

Unit tests should prove the state machine without a real Supabase or PostgreSQL connection.
The implementation may use a small internal resolver that accepts Auth/database dependencies,
while the exported server helper wires the real clients. This is not a generic dependency
injection framework.

## Alternatives rejected

### Check the role only in `AdminLayout`

Rejected because exported actions remain independently callable and later specs would repeat the
identity logic.

### Trust Supabase custom metadata for application role

Rejected because Drizzle is the current application-data source of truth and metadata can drift
from database status and role.

### Add middleware authorization

Rejected because middleware cannot replace database-backed server-boundary policy and would add a
second authorization implementation.

### Include User and Organization actions in this change

Rejected because those concerns have distinct callers, validation, service-role risk, and test
surfaces. They remain SEC-02 and SEC-03.
