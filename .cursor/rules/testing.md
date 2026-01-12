# Testing Conventions

## Stack
- **Unit/Integration**: Vitest
- **E2E**: Playwright
- **Coverage target**: 60% minimum

## File Structure
```
src/
├── domain/
│   └── users/
│       ├── entity.ts
│       └── entity.test.ts      # Unit tests next to source
├── infrastructure/
│   └── persistence/
│       └── postgres-user-repository.test.ts
└── app/
    └── actions/
        └── users.test.ts       # Action tests
        
tests/
└── e2e/
    ├── auth.spec.ts            # E2E tests in separate folder
    └── admin/
        └── users.spec.ts
```

## Naming
- Unit/Integration: `*.test.ts`
- E2E: `*.spec.ts`

## Test Structure
Use AAA pattern (Arrange, Act, Assert):

```typescript
describe('UserRepository', () => {
  describe('findById', () => {
    it('returns user when found', async () => {
      // Arrange
      const userId = 'test-id';
      
      // Act
      const result = await repository.findById(userId);
      
      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(userId);
    });

    it('returns null when not found', async () => {
      const result = await repository.findById('non-existent');
      expect(result).toBeNull();
    });
  });
});
```

## What to Test

### Always Test
- Domain logic (entities, helpers)
- Repository methods
- Server actions (with mocked repos)
- Critical user flows (E2E)

### Skip Testing
- UI component styling
- Third-party library behavior
- Simple pass-through functions

## Mocking
- Mock external services (Supabase Auth, external APIs)
- Use real DB for repository tests (test database)
- Mock repositories in action tests

```typescript
// Mocking pattern for actions
vi.mock('@/infrastructure/persistence', () => ({
  postgresUserRepository: {
    findById: vi.fn(),
    create: vi.fn(),
  },
}));
```

## Running Tests
```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage report
pnpm test:e2e       # E2E tests only
```
