# Project accessibility patterns (ai-learning-platform)

Verified patterns in this repo, checked against the code on 2026-09-30. Reuse these before writing new accessibility code. Paths are relative to the repo root. Search by the identifiers listed, because line numbers drift.

## Landmarks and skip link

- **Information pages** have a skip link. `app/(course)/behind-the-scenes-ai/_info/InfoPage.tsx` renders `<a href="#info-main">`, which is visually hidden until focused (`sr-only focus:not-sr-only`, positioned with the logical `focus:start-4`). Its label is `skipToContent` from `i18n/locales/*/behind-ai/infoPages.ts`, in all six locales. The target is `<main id="info-main" tabIndex={-1}>`.
- **Chapters**: `components/ChapterLayout.tsx` has the same skip link, reusing the `infoPages.skipToContent` label, and targets `<main id="chapter-main" tabIndex={-1}>`.
- Other pages with their own `<main>`: `final-exam/FinalExamView.tsx`, `_access/LockedChapter.tsx`, `admin/AdminView.tsx`.
- Root `lang` and `dir`: `components/RootDocument.tsx` sets them from `LOCALES[locale].htmlLang` and `dirOf(locale)`. Do not hardcode `dir`.

## Focus and contrast

- Text tokens meet 4.5:1 on their measured backgrounds (intro, chapter 1, info pages, sidebar, both themes): Dark `--bts-text-faint` is a 70% slate-400 mix, Light `--bts-text-muted` is a 50% slate-600 mix. `--bts-text-subtle` is for decorative marks (arrows, separators) and disabled controls only; readable text uses `--bts-text-faint`. Do not add `opacity-*` on top of muted text. Fixed gray classes inside labs (`text-slate-*`) are not measured.

- Tokens: `--bts-focus-ring` and `--bts-focus-ring-offset`, with values for both Dark and Light, plus a global `:focus-visible` rule in `app/globals.css`. Theme usage rules are in the `bts-theme` skill.

## Dialogs

- **Native `<dialog>` + `showModal()`** is the preferred pattern:
  - `components/language/LanguageGlobe.tsx`: focuses the `[aria-current="true"]` option when it opens and returns focus to the trigger on every close path (Escape, selecting an option, the close button, clicking the backdrop).
  - `app/(course)/behind-the-scenes-ai/AccountPanel.tsx`: the password-reset dialog, with `aria-labelledby="bts-reset-title"`.
  - `components/DisplaySettings.tsx`: the "Accessibility and display" dialog in the sidebar footer.
- The mobile drawer's keydown trap in `CourseSidebar.tsx` returns early while any `dialog[open]` exists. App Router attaches React listeners to `document`, so `stopPropagation()` inside a dialog cannot stop that trap. Rely on this guard; do not add per-dialog workarounds.
- **Manual trap** (`role="dialog"` + `aria-modal="true"`, Escape, Tab loop, restoring focus):
  - `components/ai-internals/ExpandableLab.tsx`: a portal. It also locks body scroll and uses `usePortalTheme`.
  - `components/CourseSidebar.tsx`: the mobile drawer.
  - Keep these as they are. Do not add a third variant.

## Forms

- `AccountPanel.tsx` is the reference form: inputs wrapped in `<label>`, native `required`/`minLength`/`maxLength`, `autoComplete` tokens (`name`, `email`, `current-password`, `new-password`), `dir="ltr"` on email and password, and `aria-live="polite"` for status.
- Gap: errors are not linked to their fields. `aria-invalid`, `aria-describedby` and `htmlFor` are almost unused in the repo. New or changed forms should add them.

## Display preferences

- `components/DisplaySettings.tsx` stores non-default choices in `localStorage` under `bts-display` and mirrors them as `data-text-size`, `data-reading-spacing`, `data-contrast`, `data-reduce-motion` and `data-underline-links` on `<html>`. The pre-paint script in `RootDocument.tsx` applies the same attributes before first paint. The CSS is at the end of `app/globals.css`; with no attribute there is no change.
- Text size zooms only the outermost reading-text elements in `<main>` (`p`, `li`, `blockquote`, `dd`, `figcaption`). Zooming all of `<main>` clipped the chapter 1 lab at 360-390px, so do not reintroduce it.
- Higher contrast overrides only neutral text and border tokens, never pedagogical colors. Hardcoded `text-slate-*` classes in labs are not affected.
- Reduced motion is one decision: the OS setting OR the learner's toggle (`data-reduce-motion` on `<html>`). Use `useReducedMotion()` from `@/components/reducedMotion`, never from `framer-motion`: it is a `useSyncExternalStore` hook, so mounted components update live without remounting, and it returns false during hydration. `reducedMotion()` is the live read for JS/WebGL code. `MotionGlobalConfig.skipAnimations` (Motion's exported global config) follows the same decision.
- The `motion-reduce:` Tailwind variant is redefined in `app/globals.css` to match the OS query or `html[data-reduce-motion]`, and a global CSS block stops CSS animations and transitions for both.

## Reduced motion

- Use `useReducedMotion` from `@/components/reducedMotion`, the `motion-reduce:` Tailwind utilities, and the reduced-motion blocks in `app/globals.css`. The hydration-safe rules are in the `bts-theme` skill.

## Read Aloud

- `components/ai-internals/useReadAloud.ts`: the hook for reading a sequence of segments. It uses the Web Speech API only inside effects and handlers, and has an `unsupported` status. It matches voices by language prefix, preferring an exact match, and remembers the chosen voice per locale in `localStorage` under the key `bts-readaloud-voice:<locale>`.
- `components/ai-internals/readAloudLang.ts`: the `LOCALE_SPEECH_LANG` mapping from locale to speech language code.
- `components/ai-internals/ReadAloudControls.tsx`: the controls. Icon buttons have localized `aria-label`s, icons are `aria-hidden`, and the controls use `aria-expanded`, `aria-pressed` and `aria-current`. Previous/Next icons flip with direction. There is a fallback when speech is unsupported.
- `components/ai-internals/SpeakButton.tsx`: one-off speech. It dispatches `READ_ALOUD_EXCLUSIVE_EVENT` before speaking, and every `useReadAloud` instance stops when it receives it. This is the one-voice-at-a-time mechanism. Any new speech entry point must dispatch this event or use `useReadAloud`.

## Not present (do not assume)

- No `forced-colors` handling anywhere.
- `/behind-the-scenes-ai/accessibility` is an info page (`InfoPage page="accessibility"`). Keep its statements consistent with verified behavior. Do not claim anything that has not been tested.
