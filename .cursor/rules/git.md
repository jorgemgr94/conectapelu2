# Git & Branching Strategy

## Conventional Commits
All commits must follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvement
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (deps, config, etc.)

### Scopes (optional)
- `auth` - Authentication
- `users` - User management
- `orgs` - Organizations
- `pets` - Pets/animals
- `ui` - UI components
- `db` - Database/migrations
- `api` - Server actions

### Examples
```bash
feat(pets): add pet photo gallery component
fix(auth): handle expired session redirect
docs: update README with setup instructions
refactor(users): extract validation to shared schema
chore(deps): update drizzle-orm to 0.45.1
```

## Branch Naming
```
<type>/<ticket-or-description>
```

Examples:
- `feat/pet-medical-records`
- `fix/login-redirect-loop`
- `chore/update-dependencies`

## Workflow
1. Create branch from `main`
2. Make changes with conventional commits
3. Push and create PR
4. Squash merge to `main`

## Protected Branch
- `main` is protected
- Requires PR review before merge
- No direct pushes
