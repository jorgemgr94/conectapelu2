# Codebase Analysis - Team Preparation (5 developers)

This document outlines issues and improvements to address before scaling the team.

---

## 🔴 CRITICAL - Resolve before starting

### 1. No Testing Infrastructure

```
Test files found: 0
```

- No unit tests, integration tests, or E2E tests
- **Risk**: Without tests, 5 developers making changes will cause regressions

**Recommendation**:
- Add Vitest for unit tests
- Add Playwright for E2E
- Define minimum coverage (e.g., 60%)

---

### 2. Console.logs in Production Code

```
34 console.log/error/warn found across 5 files
```

- `auth.ts`: 6 debug logs
- `user-form.tsx`: 8 logs
- `login/page.tsx`: 1 log

**Recommendation**:
- Create a logger service (`src/lib/logger.ts`)
- Replace all `console.*` with the logger
- Logger can be silenced in production

---

### 3. Environment Variables Without Validation

```typescript
// users.ts - lines 13-15
process.env.NEXT_PUBLIC_SUPABASE_URL!
process.env.SUPABASE_SERVICE_ROLE_KEY!
```

- Uses `!` (non-null assertion) without validating existence
- If an env var is missing, the app crashes at runtime

**Recommendation**:
- Create `src/lib/env.ts` with Zod validation
- Fail fast at build time if variables are missing

---

### 4. Incomplete DB Schema vs Documentation

```
Documented in ENTITIES.md: 19 entities
Implemented in /db/schema: 4 entities (users, organizations, organization-members, cities)
```

- Missing: pets, pet_photos, adoption_requests, questionnaires, etc.
- Pet entity exists as **manual interface** in domain, not as Drizzle schema

**Recommendation**:
- Decide which entities to implement first
- Create corresponding Drizzle schemas
- Migrate `memory-pet-repository.ts` to Postgres

---

## 🟠 IMPORTANT - Resolve in the first week

### 5. Missing Validation in Server Actions

```typescript
// users.ts - createUser doesn't validate input
export async function createUser(data: {
  email: string;
  password: string;
  // ...
})
```

- Actions accept data without Zod validation
- `updateUserSchema` exists in validations but is not used

**Recommendation**:
- Use validation schemas in each action
- Pattern: `const validated = schema.parse(data)` at the start

---

### 6. Inconsistent Error Handling

```typescript
// users.ts
return { success: false, error: authError.message };

// But in other actions:
return user;  // null if fails
```

- Some actions return `{ success, error }`, others return directly or `null`
- No standard response type

**Recommendation**:
Create a standard type:

```typescript
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

---

### 7. Duplicated Components Across Portals

```
src/components/admin/sidebar.tsx   (~145 lines)
src/components/user/sidebar.tsx    (~145 lines)
src/components/org/sidebar.tsx     (~145 lines)

src/components/admin/header.tsx    (~75 lines)
src/components/user/header.tsx     (~73 lines)
src/components/org/header.tsx      (~68 lines)
```

- 90% of the code is identical
- If there's a bug in the sidebar, it must be fixed 3 times

**Recommendation**:
- Create generic base components
- `<BaseSidebar navigation={[]} theme="admin|user|org" />`

---

### 8. No Branch/Commit Conventions

- No `.github/` with PR or issue templates
- No husky/lint-staged for pre-commit hooks
- No CONTRIBUTING.md

**Recommendation**:
- Add husky + lint-staged
- Define commit convention (conventional commits)
- PR template

---

## 🟡 IMPROVEMENTS - Backlog for later

### 9. Typing Inconsistencies

```typescript
// domain/pets/entity.ts has manual interface
export interface Pet { ... }

// vs domain/users/entity.ts that infers from Drizzle
export type User = typeof usersTable.$inferSelect;
```

- Inconsistency in how entities are defined
- When Pets moves to Drizzle, refactoring will be needed

---

### 10. Missing Real Data Seed

```typescript
// seed.ts - only has basic organizations and users
```

- No seed for pets (uses MemoryRepository with 120 fake pets)
- Hard to debug real data issues

---

### 11. Hardcoded Internationalization

```typescript
// In many components:
<h1>Bienvenido de vuelta</h1>
<p>Gestiona los usuarios y sus roles</p>
```

- All texts are hardcoded in Spanish
- If English is needed in the future, it's a massive refactor

---

### 12. ~~Scattered Cursor Rules~~ ✅ RESOLVED

```
.cursor/rules/
  - architecture.md
  - code-style.md
  - ui.md
  - git.md          ✅ Added
  - testing.md      ✅ Added
```

- Documentation is now complete

---

## 📋 Priority Summary

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 🔴 | Testing setup (Vitest + Playwright) | High | Very High |
| 🔴 | Env vars validation | Low | High |
| 🔴 | Logger service | Low | Medium |
| 🔴 | Pets schema in Drizzle | Medium | High |
| 🟠 | Validation in Server Actions | Medium | High |
| 🟠 | Standard ActionResult type | Low | Medium |
| 🟠 | Base components (sidebar/header) | Medium | Medium |
| 🟠 | Husky + conventional commits | Low | High |
| 🟡 | Complete data seed | Medium | Low |
| 🟡 | Prepare for i18n | High | Low |

---

## ❓ Questions Before Deciding

1. **What is the team's priority?**
   - Stabilize existing features or implement more features?

2. **Should the Pets schema go to Drizzle now?**
   - If 2+ people work on pets, yes

3. **Desired testing level?**
   - Only critical unit tests or full coverage?

4. **Will there be CI/CD?**
   - If yes, testing is even more critical
