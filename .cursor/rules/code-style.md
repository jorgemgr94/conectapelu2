# Code Style

## Linting & Formatting
- **Biome** para lint y format
- Correr `pnpm lint` antes de commits
- Auto-fix con `pnpm biome check src/ --write`

## Idioma
- **UI en Español** (México): títulos, labels, mensajes
- **Código en Inglés**: variables, funciones, tipos, comentarios técnicos

```typescript
// ✅ Correcto
<h1>Usuarios</h1>
<p>Gestiona los usuarios y sus roles</p>

const users = await getUsers();
const handleSubmit = () => {};
```

## Server Actions
Ubicar en `src/app/actions/`. Siempre:
1. Usar `'use server'`
2. Llamar `revalidatePath()` después de mutations

```typescript
'use server';

import { revalidatePath } from 'next/cache';

export async function updateUser(id: string, data: UpdateUserData) {
  const result = await repository.update(id, data);
  if (result) {
    revalidatePath('/admin/users');
  }
  return result;
}
```

## Naming
- Files: `kebab-case` (user-form.tsx)
- Components: `PascalCase` (UserForm)
- Functions/Variables: `camelCase` (getUsers)
- Types: `PascalCase` (User, CreateUserData)
