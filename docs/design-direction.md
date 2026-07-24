# Product design direction

## Decision

ConectaPelu2 uses the **Warm Plum** direction: a conservative refinement of the current interface
with one dominant plum brand color supported by warm, quiet neutrals.

This is a polish, not a redesign. The first reference implementation should preserve the existing
product identity and homepage structure while improving hierarchy, content truth, spacing, and
component restraint.

## Product thesis

For adoptive families and rescue organizations, ConectaPelu2 should feel humane, trustworthy, and
approachable because adoption is both an emotional and trust-sensitive decision. It should avoid
feeling like a generic technology landing page, an advertising campaign, or a childish pet
product.

## Design principles

1. **Animals come first.** Photography is the strongest visual element; decoration must not compete
   with it.
2. **One brand color.** Plum identifies brand moments, actions, focus, and active states. Supporting
   neutrals create warmth without becoming secondary brand colors.
3. **Use real information.** Prefer pet availability, attributes, location, and rescue attribution
   over invented metrics, testimonials, or decorative social proof.
4. **Hierarchy before effects.** Create emphasis through scale, spacing, weight, and placement before
   adding color or motion.
5. **Warmth through tone and content.** Friendly copy, photography, and warm neutrals should carry the
   emotional character; avoid ornamental pet motifs.
6. **Public expression, application restraint.** Public pages may be more expressive, while catalog,
   authentication, and backoffice screens remain information-first.

## Color system

The following values define the selected direction. Implementation may adjust a value when
contrast testing requires it, but must preserve the single-hue brand model.

| Role | Token suggestion | Value | Usage |
| --- | --- | --- | --- |
| Brand | `--brand` | `#7C3AED` | Primary actions, links, active states, selected text emphasis |
| Brand hover | `--brand-hover` | `#8B5CF6` | Hover on dark surfaces |
| Brand subtle | `--brand-subtle` | `#A78BFA` | Focus rings and restrained tonal emphasis |
| Brand active | `--brand-active` | `#6D28D9` | Pressed and active controls |
| Page | `--page` | `#140F18` | Main public dark background |
| Surface | `--surface` | `#1D1722` | Cards and header |
| Surface raised | `--surface-raised` | `#251D2B` | Menus and intentionally elevated content |
| Border | `--border-warm` | `#33283A` | Quiet boundaries on dark surfaces |
| Text | `--text-warm` | `#F7F0E8` | Primary copy |
| Text muted | `--text-warm-muted` | `#B8ACA5` | Metadata and supporting copy |

Use approximately 70% dark warm neutrals, 20% text and quiet boundaries, and 10% brand plum. Do not
use gradients or glows as default brand treatments.

Semantic colors are exceptions to the single-brand-color rule. Use them only to communicate
status or feedback, never as decoration. Always pair semantic color with text, an icon, or another
non-color signal.

## Typography

- Keep the existing sans-serif family and application typography unless a separate typography
  decision is approved.
- Use a bold but restrained homepage headline. On desktop, reduce its current visual size by
  approximately 25% and constrain it to a deliberate two-line measure.
- Use plum only for the meaningful phrase within the headline; do not add an underline, glow, or
  gradient.
- Keep body and metadata sizes readable at 100% browser zoom. Do not rely on low contrast to create
  hierarchy.
- Allow labels and buttons to grow for both `es-MX` and `en-US`; avoid fixed widths tied to one
  locale.

## Layout and components

### Header

- Preserve the current logo, navigation, and sign-in structure.
- Use a flat page or surface background with a quiet bottom border.
- Use one flat plum fill for the primary button.
- Do not use a gradient, glow, or translucent blur as the primary source of separation.

### Homepage hero

- Preserve the centered headline and sequence of headline, featured pets, filters/action, and
  availability count.
- Remove decorative background glows and the headline underline.
- Let spacing and image scale establish the section hierarchy.
- Keep only truthful, data-backed counts. Remove placeholder organization and adoption totals.

### Pet cards

- Keep the animal image unobstructed. Do not place names or metadata over photography.
- Put the name, breed, and age in a dedicated metadata area below the image.
- If favorites are available, use a restrained outline-heart action aligned with the pet name and
  give it an accessible label.
- Use consistent image crops, approximately `10px` to `12px` card radii, quiet borders, and no
  default shadow.
- Motion should be subtle and causal. A small image-scale or border-color change on hover is enough;
  respect reduced-motion preferences.

### Filters and actions

- Present common filters as quiet text-and-icon actions rather than separate filled pills.
- Use one clearly dominant rectangular **View all** action with approximately `8px` corners.
- Provide visible hover, active, and keyboard-focus states.
- Do not communicate selection with color alone.

## Photography and content

- Prefer authentic, well-lit rescue photography with consistent crops.
- Preserve natural image color; do not tint photographs with the brand color.
- Avoid text embedded in images.
- Prefer real pet and organization data. Clearly identify fixture or placeholder content in
  development rather than presenting it as production evidence.
- UI copy must come from the `es-MX` and `en-US` message catalogs.

## Responsive behavior

- Desktop may show six featured pets in one row when the viewport supports readable cards.
- Tablet should reduce to three columns.
- Mobile should use two columns or a deliberately accessible horizontal collection; choose based on
  content testing rather than visual novelty.
- Metadata must remain outside images at every breakpoint.
- Navigation, filters, and actions must tolerate longer English labels without clipping.

## Accessibility requirements

- Target WCAG AA contrast for text, controls, boundaries needed for comprehension, and focus
  indicators.
- Preserve visible keyboard focus using the plum focus token.
- Give icon-only actions accessible names and adequate target sizes.
- Use semantic controls for filters and favorites.
- Honor `prefers-reduced-motion`.
- Validate text zoom, keyboard navigation, and both supported locales before propagating the
  direction.

## Explicit anti-patterns

- Background glow fields and decorative blur.
- Text gradients and decorative headline underlines.
- Unsupported adoption, organization, or social-proof metrics.
- Text and metadata over pet photographs.
- Floating circular actions on every image.
- Pill-shaped treatment for every filter and action.
- Excessive rounding, glassmorphism, and decorative shadows.
- Introducing another saturated color that competes with plum.
- Reworking the page into an editorial, poster-wall, or dashboard theme.

## Migration boundary

Use the homepage as the first reference screen. Scope the Warm Plum tokens to public surfaces during
the first implementation so the palette does not silently alter authentication or backoffice
screens.

Recommended rollout:

1. Implement and validate the homepage reference screen.
2. Extend the approved rules to the public pet catalog and pet detail.
3. Adapt authentication surfaces.
4. Adapt organization and administration surfaces with higher information density.

Each area should remain an independently reviewable PR. The reference implementation should avoid
behavior changes, new product content, unrelated component refactors, and broad formatting churn.
