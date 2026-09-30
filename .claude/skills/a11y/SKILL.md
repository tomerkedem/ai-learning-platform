---
name: a11y
description: Apply WCAG 2.2 AA accessibility rules to a requested learner-facing change - semantics, keyboard and focus, dialogs, form errors, localized accessible names, contrast, reduced motion, zoom/reflow, forced colors, drag and visualization alternatives, and Read Aloud. Use when creating or modifying interactive UI, dialogs, forms, labs, visualizations, motion, or speech features.
---

# Accessibility

Engineering target: **WCAG 2.2 Level AA**. Apply these rules only to the requested change. This is not a full-repo audit.

Framework-neutral rules live here. The components and conventions this repo already has are in [references/project-patterns.md](references/project-patterns.md). Read that file before adding any new accessibility code, and reuse what it lists.

## Related skills (link, do not duplicate)

- `bts-theme`: theme tokens, focus-ring tokens, contrast on Light and Dark, reduced-motion and hydration rules.
- `i18n-six-locales`: all learner-visible and assistive text, including `aria-label`, alt text, status messages and Read Aloud labels.
- `visual-qa`: browser verification workflow.

## Workflow

1. Identify what the change touches: structure, controls, dialog, form, motion, visualization, speech.
2. Apply only the matching sections below.
3. Reuse an existing pattern from `references/project-patterns.md` before writing new code. Prefer native HTML over ARIA and over custom JavaScript.
4. Verify only the changed behavior (see Verification).
5. Report what was tested, and name what was not.

## 1. Semantics and landmarks

- Use native elements: `<button>` for actions, `<a href>` for navigation, `<label>` for inputs, and real `<ul>`, `<table>` and heading elements. (1.3.1, 4.1.2)
- One `<main>` per page. Headings should form a logical outline with no skipped levels.
- Pages with repeated navigation before the content need a bypass mechanism: a skip link whose target is the `<main>`, with `tabIndex={-1}` on the target. (2.4.1)
- DOM order must match reading order. Do not reorder content visually with CSS in a way that changes its meaning. (1.3.2)
- Put `lang` and `dir` on the root element. When a passage is in a different language from the page, give that part its own `lang` (and `dir` if the direction differs). (3.1.1, 3.1.2)
- Hide decorative icons and backgrounds with `aria-hidden`. Informative images need a text alternative. (1.1.1)

## 2. Keyboard and focus

- Everything that works with a pointer also works with the keyboard, and the keyboard never gets trapped. (2.1.1, 2.1.2)
- Focus order follows the meaning of the content in both RTL and LTR. Do not use a positive `tabIndex`. (2.4.3)
- Focus is always visible. Use the project's focus-ring tokens and never remove the outline without a replacement. (2.4.7)
- Sticky headers, docks and toasts must not completely cover the focused element. Use `scroll-padding` or `scroll-margin` where needed. (2.4.11)
- Pointer targets are at least 24x24 CSS px, unless a 2.5.8 exception applies (spacing, equivalent control, inline, user agent control, essential). (2.5.8)
- A control's visible label text appears inside its accessible name. (2.5.3)

## 3. Dialogs and overlays

- Default: native `<dialog>` with `showModal()`. The browser provides the modal behavior, makes the rest of the page inert, and closes on Escape.
- Every dialog: gets an accessible name (`aria-labelledby`), moves focus to a sensible first target when it opens, and returns focus to the element that opened it when it closes.
- Use a manual `role="dialog"` with `aria-modal="true"` only when the existing code already follows that pattern or there is a stated reason. It must then handle Escape, loop Tab inside the dialog, lock background scroll and restore focus. See the [APG modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
- Content shown on hover or focus can be dismissed, stays visible while the pointer is over it, and persists until dismissed. (1.4.13)

## 4. Forms and errors

- Every field has a visible label tied to it programmatically: a wrapping `<label>` or `htmlFor`. (3.3.2)
- An invalid field gets `aria-invalid="true"`, and its error message is linked with `aria-describedby`. The error text says what is wrong and, where possible, how to fix it. (3.3.1, 3.3.3)
- Announce async results (saving, sent, failed) through an existing `aria-live="polite"` or `role="status"` region, without moving focus. (4.1.3)
- Use `autoComplete` tokens. Do not block paste or password managers in login forms. (3.3.8)
- Email, password and URL fields use `dir="ltr"` inside RTL pages.

## 5. Localized accessible names

- Accessible names, alt text, live-region messages and dialog titles come from the locale files, the same as visible copy. Never hardcode one language in shared components.
- Directional labels (Previous and Next, arrow icons) follow the reading direction, not the screen side.
- Use the `i18n-six-locales` skill for all of this copy.

## 6. Contrast and non-color cues

- Text contrast is at least 4.5:1, or 3:1 for large text. UI component boundaries, focus indicators and meaningful graphics are at least 3:1. Check both themes. (1.4.3, 1.4.11)
- State (correct or wrong, active, selected, risk level) is never shown by color alone. Add text, an icon, a pattern or a shape. (1.4.1)

## 7. Motion

- Honor `prefers-reduced-motion`: keep the DOM identical, and set duration to 0 or show the static final state. Follow the `bts-theme` hydration rules.
- Motion that starts automatically, lasts more than 5 seconds and runs alongside other content needs a pause control or must stop. (2.2.2)
- Animation triggered by interaction should be possible to disable. This is AAA (2.3.3). Treat it as best practice here, not as the AA target.

## 8. Zoom, reflow and text spacing

- Content works at 320 CSS px wide (equivalent to 400% zoom) without two-dimensional scrolling. Maps, tables and code blocks are allowed to scroll inside their own container. (1.4.10)
- Text scales to 200% without losing content. Do not use fixed heights that clip text. (1.4.4)
- The layout survives user text-spacing overrides. (1.4.12)

## 9. Forced colors (Windows High Contrast)

WCAG has no criterion for this, but it is best practice ([CSS Color Adjust](https://www.w3.org/TR/css-color-adjust-1/)).
- Do not convey meaning only through background images, gradients or `box-shadow`, because forced-colors mode removes them.
- Keep a real `outline` or `border` on focus and on control boundaries. Use `@media (forced-colors: active)` only for a proven problem.

## 10. Drag interactions and visualizations

- Anything that works by dragging also works with a single click or tap without dragging (for example tap-to-select then tap-to-place, or step buttons), and with the keyboard. (2.5.7, 2.1.1)
- Sliders use a native range input or an accessible slider primitive with a name and a value text.
- Every chart, map or lab result that carries meaning has a text equivalent: a caption, a summary or a data list. Its important state changes are announced through a status region. (1.1.1, 1.3.1, 4.1.3)
- Canvas, WebGL and SVG content that is only decoration gets `aria-hidden`.

## 11. Read Aloud (TTS)

- Speech starts only when the user starts it. Never autoplay. The user can pause and stop it. (1.4.2)
- Speak using the locale's language code, and pick a voice matching that language. If no matching voice exists, say so instead of reading with the wrong voice.
- Only one voice at a time: starting any speech stops all other speech first.
- If the browser has no speech support, show a graceful fallback message rather than a broken control.
- Only call speech APIs in effects or event handlers, never during render.
- **TTS is not screen-reader support.** It does not replace semantics, names, focus management or live regions. Test with a screen reader separately, and make sure Read Aloud does not talk over a screen reader in a way that blocks it.

## Verification

Check only the changed behavior, in the smallest set of states that covers it:
- Keyboard-only walkthrough of the changed control or flow: Tab, Shift+Tab, Enter, Space, Escape, arrow keys where applicable.
- Focus: visible, never hidden, and returned correctly after a dialog closes.
- Browser accessibility tree: every control has a name, a role and a state.
- Check RTL and LTR, Light and Dark, and reduced motion, only where the change touches them.
- For layout changes: a 320 px width or 400% zoom check.

Use the `visual-qa` skill for the browser workflow.

## Reporting

- List the checks that actually ran and their results.
- Name what was not tested, for example: "Not tested: NVDA/VoiceOver, forced colors, Japanese voice availability."
- Never claim "accessible" or "WCAG compliant" for the whole product based on a focused check.

## Legal applicability

WCAG 2.2 AA is the engineering target, not a legal claim. Which laws apply, and which standard version they reference, is a separate question that needs current official sources for each market. Starting points to verify, not conclusions:
- Israel: the service-accessibility regulations and IS 5568.
- EU: the European Accessibility Act and EN 301 549.
- Japan: JIS X 8341-3.

Never state universal legal compliance.

## Sources (W3C)

- WCAG 2.2, W3C Recommendation (12 Dec 2024): https://www.w3.org/TR/WCAG22/
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/
- WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- Criteria cited (level): 1.1.1 A, 1.3.1 A, 1.3.2 A, 1.4.1 A, 1.4.2 A, 1.4.3 AA, 1.4.4 AA, 1.4.10 AA, 1.4.11 AA, 1.4.12 AA, 1.4.13 AA, 2.1.1 A, 2.1.2 A, 2.2.2 A, 2.3.3 AAA, 2.4.1 A, 2.4.3 A, 2.4.7 AA, 2.4.11 AA, 2.5.3 A, 2.5.7 AA, 2.5.8 AA, 3.1.1 A, 3.1.2 AA, 3.3.1 A, 3.3.2 A, 3.3.3 AA, 3.3.8 AA, 4.1.2 A, 4.1.3 AA. (4.1.1 Parsing is obsolete in 2.2.)
