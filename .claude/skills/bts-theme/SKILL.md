---
name: bts-theme
description: Apply the established Light, Dark and System theme contract to learner-facing Behind the Scenes of AI UI. Use when creating or modifying BTS components, visualizations, labs, surfaces, motion, colors, portals, or theme-dependent presentation.
---

# BTS Theme Contract

Theme only the requested surface. Smallest change consistent with the existing architecture.

## Workflow

1. Inspect the rendered component and nearby theme patterns.
2. Separate theme colors from pedagogical colors.
3. List meaningful motion/effects.
4. Classify the surface: theme-aware, deliberate Dark instrument, or mixed.
5. Implement the smallest change. Preserve Dark.
6. Validate Light and Dark in the real browser when the change is visual.
7. Check reduced motion and hydration when motion code is involved.
8. Keep the final report concise.

## 1. Architecture

Reuse what exists:

- ThemeProvider is the theme source. Modes: System / Light / Dark.
- Reuse the existing persisted preference.
- Use existing `--bts-*` semantic tokens where appropriate.
- Use `ChapterLayout themeAware` for BTS chapter participation.
- Use the existing portal-theme handling (`usePortalTheme`) where needed.

Never create: another ThemeProvider, theme store, or localStorage key; duplicate Light component trees; chapter-specific theme infrastructure.

## 2. Dark preservation

Approved Dark is the reference. When adding or changing Light, preserve Dark appearance, motion, semantic colors, geometry and interactions. Prefer Light-scoped treatment when Light needs a different value. Never simplify or redesign Dark to make Light easier.

## 3. Light design

Light is a first-class design, not an inversion of Dark: luminous not washed out, layered not flat, technical not corporate, readable, restrained, visually alive.

Avoid: pure-white everything, muddy gray hierarchy, generic dashboard look, excessive glow, neon, flattening meaningful effects.

## 4. Motion and effect parity

If an effect exists in Dark (scan, sweep, pulse, glow, rotating ring, animated border, reveal, trace, bar growth, active-state motion, ambient effect), preserve its purpose in Light: timing, geometry, interaction behavior, pedagogical purpose.

Adapt only theme-dependent treatment: color, opacity, luminance, shadow/glow, blend mode. Do not remove meaningful effects because Light uses a bright surface.

## 5. Reduced motion and hydration

SSR and first client render must stay structurally compatible. Unsafe patterns:

- conditional initial-render DOM based on `useReducedMotion`
- `initial={reduce ? false : ...}`
- `whileHover={reduce ? undefined : ...}`
- `whileTap={reduce ? undefined : ...}`

Prefer stable DOM, stable motion props, neutral values under reduced motion, `duration: 0` where appropriate, `motion-reduce` CSS utilities, static equivalents.

Do not use `suppressHydrationWarning`, mounted-state hacks, or timeout hacks without a separately justified requirement.

## 6. Pedagogical colors

Theme colors (surfaces, neutral text, borders, chrome, decorative ambience) adapt freely.

Pedagogical colors (token roles, semantic clusters, attention strength, probabilities, evaluation states, vector dimensions, agent states, correct/wrong/warning) carry meaning. Preserve their identity. Do not normalize them to generic cyan. For Light, change lightness, saturation, opacity, surrounding surface or border, not the identity.

## 7. Deliberate Dark instruments

A technical visualization may stay Dark when darkness is part of its visual language. Then:

- make the Dark boundary intentional
- theme the surrounding chrome
- preserve internal semantic colors and motion
- keep controls and text readable
- use an explicit Dark scope where required

Never use a Dark wrapper merely to avoid implementing Light correctly.

## 8. Portals

Portals escape ancestor theme scope. When a portal must follow its originating surface, use the existing portal-theme mechanism and preserve the resolved originating theme. Do not duplicate theme state. Do not change portal z-index contracts unnecessarily.

## 9. Accessibility

Verify: readable text contrast, visible focus indicators (including contrast on Light surfaces), states not conveyed by color alone, keyboard operation intact, reduced motion works, RTL/LTR correct.

## 10. RTL / LTR

Use the existing locale/direction infrastructure. Do not hardcode `dir="rtl"` or language checks when the direction helper provides the value. Theme treatment must work in both directions.

## 11. Validation

For meaningful learner-facing theme changes, use the `visual-qa` skill and the project validation contract in CLAUDE.md.

- Dev server: `npm run dev:safe` only. Never unguarded `npm run dev`.
- Normally cover: Light desktop, Dark desktop, one mobile Light sanity check, one meaningful interactive state.
- Add when applicable: motion/effect parity, reduced motion (if motion code changed), RTL/LTR (if layout/direction changed).
- No giant screenshot matrices.

## 12. Scope

Do not: migrate unrelated courses, rewrite learning content, refactor unrelated components, add dependencies, create theme infrastructure, or clean up unrelated patterns exposed by a local theme task.
