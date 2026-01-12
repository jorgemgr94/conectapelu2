# UI/UX

## Stack
- **shadcn/ui** como base de componentes
- **Tailwind CSS** para estilos
- **Lucide React** para iconos

## Theme
Tema oscuro con gradientes púrpura:
- Fondo: `#0f0a1a`
- Primary: `#9280ff` (púrpura)
- Gradiente: `bg-gradient-brand`
- Border radius: `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-lg shadow-[#4a25aa]/25`

## Componentes
- Server Components por defecto
- Client Components (`'use client'`) solo para interactividad
- Separar por feature: `components/users/`, `components/organizations/`

## Patrones
- Cards con hover (`card-hover`)
- Badges para estados (active/inactive)
- Empty states con iconos y CTAs
- Toast con Sonner para notificaciones

## Accesibilidad
- SVGs decorativos con `aria-hidden="true"`
- Buttons con `type="button"` o `type="submit"`
- Labels con `htmlFor`
