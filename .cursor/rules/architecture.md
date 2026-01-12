# Arquitectura

## Clean Architecture
Estructura de capas estricta:
- `domain/` → Entidades, DTOs, interfaces de repositorios (sin dependencias externas)
- `infrastructure/` → Implementaciones concretas (Drizzle repositories)
- `app/` → Next.js pages, layouts, server actions

## Data Access
- **Drizzle ORM** para todo CRUD (queries y mutations)
- **Supabase** solo para Auth y Realtime notifications (no para queries)

## Tipos
Inferir de Drizzle schema, nunca duplicar interfaces:

```typescript
// ✅ Correcto
export type User = typeof usersTable.$inferSelect;

// ❌ Incorrecto
export interface User { id: string; email: string; }
```

## Soft Deletes
Nunca hard delete. Usar status `inactive`:

```typescript
async delete(id: string): Promise<boolean> {
  await db.update(table)
    .set({ status: 'inactive', updatedAt: new Date().toISOString() })
    .where(eq(table.id, id));
  return true;
}
```

## Paginación
Todos los `findAll` deben soportar paginación:

```typescript
async findAll(options?: PaginationOptions): Promise<PaginatedResult<T>>
```

Usar `normalizePagination()` y `buildPaginationMeta()` del domain/common.
