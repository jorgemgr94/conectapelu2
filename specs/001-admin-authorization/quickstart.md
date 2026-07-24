# Quickstart: Validate Admin Route Authorization

## Automated validation

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
```

The focused test suite must cover:

| Auth identity | Database user | Status | Role | Expected result |
| --- | --- | --- | --- | --- |
| Missing | — | — | — | Redirect to login |
| Present | Missing | — | — | Redirect with missing-user reason |
| Present | Present | Inactive | Any | Redirect with inactive-user reason |
| Present | Present | Active | `user` | Redirect to `/user` |
| Present | Present | Active | `organization_admin` | Redirect to `/user` |
| Present | Present | Active | `app_admin` | Return application user |

## Manual validation

Use only explicitly selected development or disposable accounts. Do not record account addresses,
passwords, tokens, or production data.

1. Start the application with valid local configuration.
2. Visit `/admin/dashboard` without a session and confirm login redirection.
3. Sign in as an active regular user, request `/admin/dashboard`, and confirm redirection to
   `/user`.
4. Sign in as an active organization administrator, request `/admin/dashboard`, and confirm the
   same safe non-admin redirection.
5. Sign in as an active application administrator and confirm the admin dashboard renders.
6. If a disposable inactive user is available, confirm it cannot render the admin area.
7. Confirm no redirect loops occur and no sensitive Auth details appear in logs or URLs.

## Completion evidence

Record the exact automated commands and manual scenarios actually performed in the SEC-01 pull
request. Do not mark unavailable manual scenarios as completed.
