## Summary

<!-- What changed? Keep this focused on the outcome. -->

## Why

<!-- What problem or opportunity does this address? -->

## Scope

- <!-- item -->

## Out of scope

- <!-- item -->

## Validation

<!-- List commands and manual scenarios that were actually run. -->

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test:coverage`
- [ ] `pnpm build`
- [ ] Applicable migration checks

## Security and data impact

- Authorization impact:
- Database migration:
- Environment/configuration changes:
- Sensitive data or logging impact:

## Delivery

- Rollout/forward-fix plan:
- Screenshots or recordings, when UI changes:
- Related issue:

## Reviewer checklist

- [ ] The PR has one coherent outcome and names explicit exclusions.
- [ ] Server entry points authenticate, authorize, and validate input.
- [ ] Tenant-owned queries constrain the tenant in SQL.
- [ ] Tests cover the changed behavior and expected failures.
- [ ] Documentation changes are included with the implementation.
