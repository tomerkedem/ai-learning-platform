# 06 - Technical state

All commands below were run in this working tree. Raw output is in `docs/audit/bts/raw/`.

## 1. Framework and major dependencies

`package.json` name is `python-ai-course`, version `0.1.0`, `private: true`. The repo holds four
learning modules (`behind-the-scenes-ai`, `python`, `math/mathIntuitive`, `math/mathProbabilistic`)
in one Next.js app; there is no package boundary between them.

`package.json` declares 23 runtime dependencies and 12 devDependencies. **17 of the 23 runtime dependencies are not imported by any file reachable from this module's routes.** Resolved versions from `package-lock.json` (569 packages in the lockfile):

| Package | Declared | Installed | Imported by a reachable module file? |
|---|---|---|---|
| `next` | `^16.2.9` | **16.2.9** | yes (App Router, Turbopack build) |
| `react` / `react-dom` | `19.2.1` | **19.2.1** | yes |
| `typescript` | `^5` | **5.9.3** | build-time |
| `tailwindcss` | `^4` | **4.1.18** | build-time (`@tailwindcss/postcss`) |
| `framer-motion` | `^12.23.26` | **12.31.0** | yes - **69** reachable files |
| `lucide-react` | `^0.561.0` | **0.561.0** | yes - **66** reachable files |
| `canvas-confetti` | `^1.9.4` | **1.9.4** | yes - 1 file (`AssessmentEngine.tsx`) |
| `eslint` | `^9` | **9.39.2** | lint-time |
| `@anthropic-ai/sdk` | `^0.105.0` | **0.105.0** | **no** - server route only, and that route has no caller |
| `pyodide` | `^0.29.0` | **0.29.3** | **no** |
| `recharts` | `^3.5.1` | **3.7.0** | **no** |
| `katex` / `react-katex` | `^0.16.27` / `^3.1.0` | **0.16.28** / **3.1.0** | **no** |
| `prismjs` / `react-syntax-highlighter` | `^1.30.0` / `^16.1.0` | **1.30.0** / **16.1.0** | **no** |
| `react-tsparticles` / `tsparticles-slim` | `^2.12.2` / `^2.12.0` | **2.12.2** / **2.12.0** | **no** |
| `react-intersection-observer` | `^10.0.0` | **10.0.2** | **no** |
| `@radix-ui/react-slider` | `^1.3.6` | **1.3.6** | **no** (only `components/ErrorSimulator.tsx`, unreachable from this module) |
| `@radix-ui/react-scroll-area` | `^1.2.10` | **1.2.10** | **no** |
| `@radix-ui/react-slot` | `^1.2.4` | **1.2.4** | **no** |
| `clsx` / `tailwind-merge` / `class-variance-authority` | - | 2.1.1 / 3.4.0 / 0.7.1 | **no** direct import from a reachable file |

"Reachable" = present in the transitive import closure of the module's 21 page entry points
(`docs/audit/bts/raw/reachable-files.txt`, 510 files).

None of the unused libraries is in the chunks the module's routes load (verified by grepping
`.next/static/chunks/14x1u7gxoklfu.js` for `pyodide`, `recharts`, `katex`, `prismjs`,
`tsparticles`: 0 matches each). They are a repo-level dependency cost, not a runtime cost for
this module.

`next.config.ts` is empty apart from the type annotation - no image config, no headers, no
redirects, no `output` mode, no bundle analysis.

## 2. Build output size

Command: `npm run build` -> `docs/audit/bts/raw/build.txt`, **exit 0**, `✓ Compiled successfully in 9.6s`,
68 static pages generated in 743 ms. Next.js 16.2.9 with Turbopack does not print per-route size
columns, so sizes were measured directly from the build artefacts:

**Method.** For each prerendered route HTML in `.next/server/app/behind-the-scenes-ai/`, every
`static/chunks/*.js` path referenced in that HTML (script tags and RSC flight payload) was
collected, then the on-disk byte size, `gzip -9` size and Brotli size of those files were summed.
Script and per-route table: `docs/audit/bts/raw/route-sizes.tsv`.

### Module main route

There is **no `/behind-the-scenes-ai` index route**. The module has no landing page of its own;
entry is from the site home page `/`. Sizes for `/` are given for reference.

| Route | chunks | JS uncompressed | JS gzip -9 | JS brotli | prerendered HTML |
|---|---|---|---|---|---|
| `/` (site home, module entry) | 12 | 3,784,755 B (3.61 MB) | 1,014,677 B (991 KB) | - | 26,765 B |
| `/behind-the-scenes-ai/introduction` | 16 | 3,942,559 B | 1,063,140 B | - | 121,638 B |
| `/behind-the-scenes-ai/final-exam` | 16 | 3,940,033 B | 1,063,839 B | - | 43,382 B |

### Heaviest chapter route

| Route | chunks | JS uncompressed | JS gzip -9 | JS brotli | prerendered HTML |
|---|---|---|---|---|---|
| **`/behind-the-scenes-ai/chapter-1`** (heaviest) | 18 | **4,108,065 B (3.92 MB)** | **1,108,925 B (1.06 MB)** | **851,458 B (831 KB)** | 99,839 B |
| `/behind-the-scenes-ai/chapter-5` | 17 | 4,089,483 B | 1,105,678 B | - | 118,446 B |
| `/behind-the-scenes-ai/chapter-3` | 17 | 4,084,357 B | 1,104,733 B | - | 120,569 B |
| `/behind-the-scenes-ai/chapter-2` (lightest chapter) | 16 | 4,005,858 B | 1,080,307 B | - | 91,412 B |

The spread between the heaviest and lightest chapter route is 102 KB uncompressed / 29 KB gzip.
Per-route variation is small because **one 2.98 MB chunk dominates every route**.

### The dominant chunk

`.next/static/chunks/14x1u7gxoklfu.js` - **2,982,422 B raw / 775,914 B gzip / 561,587 B brotli**.
It is referenced by every module route **and by the site home page**. Content probe (string
counts inside the chunk):

```
"Behind the Scenes"  120     "Softmax"  307     "Tokenization"  33
"מאחורי הקלעים"        8     "Entre bastidores"  4   "AI за кулисами"  4
"ما وراء كواليس"        4     "舞台裏"  9            "Hallucinations"  24
```

This is consistent with the design of `i18n/dictionary.ts`, which statically imports **all six
locales of all 26 namespaces at module scope** (lines 9-235) and builds one `DICTS` record
(lines 300-307). There is no dynamic import and no per-locale code splitting, so every visitor
downloads all six languages of the whole module regardless of the locale they read.

### Static asset totals

| Set | Files | Total bytes |
|---|---|---|
| `.next/static/` (all build output) | 219 | 10,749,094 B (10.25 MB) |
| `public/` | 36 | 37,593,153 B (35.85 MB) |

Ten largest files in `.next/static/`:

| Bytes | File |
|---|---|
| 2,982,422 | `.next/static/chunks/14x1u7gxoklfu.js` |
| 425,790 | `.next/static/chunks/0gwenwnmv-o8f.css` |
| 290,509 | `.next/static/chunks/01qskcv7sbeuw.js` |
| 227,314 | `.next/static/chunks/21hs64eoob1f-.js` |
| 147,938 | `.next/static/chunks/41g3b93n6u3ye.js` |
| 137,449 | `.next/static/chunks/3qbrq7k9r1xkn.js` |
| 119,414 | `.next/static/chunks/3oz-p-lh2c0mg.js` |
| 119,414 | `.next/static/chunks/0tgkm3siwo79o.js` |
| 119,414 | `.next/static/chunks/0g1g36zz9dx7o.js` |
| 112,594 | `.next/static/chunks/0cz1d0mv5g_q7.js` |

Ten largest files in `public/` - all are mentor-character PNGs (see the note below on whether this module fetches any of them):

| Bytes | File |
|---|---|
| 2,437,994 | `public/assets/mentor-roadmap.png` |
| 2,166,854 | `public/assets/Data_as_the_Control_Layer.png` |
| 1,887,077 | `public/assets/mentor-hello.png` |
| 1,850,966 | `public/assets/mentor-celebrate.png` |
| 1,850,714 | `public/assets/mentor-hero.png` |
| 1,832,646 | `public/assets/mentor-ready.png` |
| 1,815,258 | `public/assets/mentor-headsup.png` |
| 1,793,782 | `public/assets/mentor-happy.png` |
| 1,719,534 | `public/assets/mentor-think.png` |
| 1,656,741 | `public/assets/mentor-explain-opposite.png` |

**None of those ten files is fetched by a Behind the Scenes of AI route.** Tracing every
`/assets/...` string in `app/`, `components/`, `lib/` and `i18n/`:

- All 16 `mentor-*.png` references come from a single file, `components/ai-internals/Mentor.tsx`.
  `Mentor` is imported by `components/content/AssessmentEngine.tsx:16`, but it renders only when
  `legacyMentorPortraits` is true (`AssessmentEngine.tsx:88-101`, whose doc comment states
  `"מאחורי הקלעים של AI" לעולם אינה מעבירה את ה-prop הזה`). The only file in the repo that passes
  it is `app/math/mathProbabilistic/chapter-1/page.tsx:334`. The other 18 `Mentor` importers are
  all `app/python/*` pages. So the ~28 MB of mentor PNGs belongs to the other modules.
- The module's own image use is `semantic-object-{apple,cat,computer,cucumber,dog}.png`, referenced
  by `app/behind-the-scenes-ai/chapter-4/components/UniversalMeaningDemo.tsx` - which is **not**
  in the reachable set, so those five are not fetched either.
- 7 files in `public/` are referenced from nowhere in `app/`, `components/`, `lib/` or `i18n/`:
  `assets/Data_as_the_Control_Layer.png` (2.17 MB), `assets/predict-correct.png`,
  `assets/predict-wrong.png`, `python-hero.png`, and three UUID-named PNGs
  (`01dbd09c-…`, `0a0f6cf1-…`, `1fdbcd9f-…`).
- `public/audio/` holds `code.mp3`, `hero.mp3`, `roadmap.mp3`.

`public/` assets are not part of the JS bundle and are fetched only when referenced, so the
35.85 MB is a repository/deploy weight figure, not a page weight figure for this module.

## 3. Progress / state model

Everything is `window.localStorage` and `sessionStorage`. No server persistence.

| Key | Store | Written by | Value |
|---|---|---|---|
| `behindAiMasteryProgress` | localStorage | `app/behind-the-scenes-ai/masteryProgress.ts:12,62` | `{ version: 1, records: Record<quizId, QuizRecord> }` |
| `behindAiMasterySidebarOpen` | localStorage | `app/behind-the-scenes-ai/MasteryDashboard.tsx:152,178` | `"1"` / `"0"` |
| `bts-readaloud-voice:<locale>` | localStorage | `components/ai-internals/useReadAloud.ts:86-94`, `SpeakButton.tsx:105` | speech-synthesis voice URI |
| `lesson-focus-mode` | sessionStorage | `components/ChapterLayout.tsx:108,115` | `"1"` / `"0"` |
| `sidebar-scroll-pos` | sessionStorage | `components/CourseSidebar.tsx:23,31` | scroll offset |

**Schema version: declared, not enforced. No migration path.**
`masteryProgress.ts:32` declares `interface MasteryStore { version: 1; records: ... }`, but
`loadStore` (lines 41-57) discards whatever version it reads:

```ts
const parsed = JSON.parse(raw) as Partial<MasteryStore>;
if (!parsed || typeof parsed !== "object" || !parsed.records) {
    return { ...EMPTY_STORE, records: {} };
}
return { version: 1, records: parsed.records };
```

There is no `if (parsed.version === 0) migrate(...)` branch anywhere in the file. A future shape
change would reinterpret old records rather than migrate them. Corrupt or blocked storage falls
back to an empty store silently (`catch { return { ...EMPTY_STORE, records: {} }; }`), and writes
are wrapped in `try/catch` with an empty handler (lines 63-66).

State updates are broadcast in-page via a custom event `behindai:mastery-updated`
(`masteryProgress.ts:13,63`).

## 4. Authentication, entitlement, payment

**ABSENT.** All three.

A repository-wide grep for `next-auth|clerk|stripe|paddle|lemonsqueezy|auth0|supabase|firebase|entitlement|subscription|paywall` over `.ts`/`.tsx`
(excluding `node_modules`, `.next`, `docs`) returns no match that is an auth/payment integration;
the only hits are the word `session` used for React state and for Python `pytest` output strings
in the unrelated Python module.

There is no login route, no user model, no `middleware.ts`, no protected route, and no server
that could enforce access. All 21 module routes are statically prerendered public HTML.

## 5. Analytics and error reporting

**ABSENT.** A grep for `analytics|gtag|posthog|mixpanel|sentry|plausible|segment|amplitude|datadog|bugsnag`
over `.ts`/`.tsx`/`.json`/`.mjs` (excluding `node_modules`, `.next`, `docs`, lockfile) returns no
provider. The only hits are the English word "plausible" used inside course content
(`i18n/locales/en/behind-ai/generationLoop.ts:18` and similar) and an id string
`{ id: 'plausible', ... }` in `app/behind-the-scenes-ai/chapter-11/page.tsx:28`.

No telemetry of any kind is collected. Learner progress never leaves the device.

## 6. Error handling

Files that **do not exist** anywhere under `app/`:

- `error.tsx` (route error boundary) - none, at any level
- `global-error.tsx` - none
- `not-found.tsx` - none
- `loading.tsx` - none

Verified with `find app -name "error.tsx" -o -name "global-error.tsx" -o -name "not-found.tsx" -o -name "loading.tsx"` (no output).

React error boundaries: **none**. Grep for `ErrorBoundary|componentDidCatch|getDerivedStateFromError`
over `app/` and `components/` returns no match.

Files that **do** exist:

- `app/layout.tsx` - the single root layout.
- Next.js's built-in 404 handler, which appears in the build output as `○ /_not-found`
  (`docs/audit/bts/raw/build.txt:21`). It is the framework default, not an authored page.

Localised failure handling that does exist:

- `components/ChapterLayout.tsx:224-232` renders a hardcoded Hebrew `"פרק לא נמצא"` object when a
  chapter id is not in `courseData`.
- `components/content/AssessmentEngine.tsx:305-317` wraps the quiz's finish side-effects
  (confetti, persistence) in `try/catch` and logs to `console.error`, so a storage failure cannot
  freeze the submit button.
- `app/behind-the-scenes-ai/masteryProgress.ts:41-66` - silent fallback on unreadable/unwritable storage.
- `components/ai-internals/useReadAloud.ts` - an explicit `'unsupported'` status when
  `speechSynthesis` is missing.

Consequence: an uncaught render error in any lab component has no boundary between it and the
root, so it takes down the page.

## 7. Tests

Test runner: Node's built-in `node --test`. There is no Jest, Vitest, Playwright, Cypress or
Testing Library in `package.json`.

Test files in the repo: **2**, both in this module.

| File | Tests | Run by `npm test`? | Result |
|---|---|---|---|
| `app/behind-the-scenes-ai/chapter-5/semanticSpace.test.ts` | 10 | **yes** | 10 pass, 0 fail (`docs/audit/bts/raw/test.txt`, exit 0) |
| `app/behind-the-scenes-ai/chapter-1/canonicalPipeline.test.ts` | 8 | **no** | 8 pass, 0 fail when run directly (`docs/audit/bts/raw/test-canonicalPipeline.txt`, exit 0) |

`package.json` `"test"` script is pinned to one file:

```json
"test": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test app/behind-the-scenes-ai/chapter-5/semanticSpace.test.ts"
```

so `npm test` reports `tests 10 / pass 10 / fail 0` and silently omits the other 8 tests.

**Totals: 18 tests, 18 passing, 0 failing. 10 of 18 run under `npm test`.**

What is covered: the chapter-5 semantic-space data and ranking functions (fixed points,
deterministic ordering, clamped proximity score, immutability of coordinates), and the chapter-1
scripted pipeline (14 unique stations, the five-question contract in all six locales, tokenizer
punctuation behaviour, normalised attention/softmax, greedy vs sampling selection, and that the
Agent ask/stop/denied-approval branches never execute a tool).

What is not covered: every other chapter, the quiz engine, `masteryProgress`, i18n completeness
beyond chapter 1's contract check, rendering, and accessibility.

There are **0 component tests, 0 integration tests, 0 end-to-end tests, 0 visual-regression tests,
and no CI configuration** (no `.github/workflows`, no other CI file in the repo root).

## 8. Lint

Command: `npx eslint .` -> `docs/audit/bts/raw/lint.txt`, exit 1.

**Repo-wide: 128 problems - 4 errors, 124 warnings.**

The 4 errors are all `react/no-unescaped-entities` in the **math** module:
`app/math/mathProbabilistic/chapter-2/page.tsx:280` (x2) and
`app/math/mathProbabilistic/chapter-4/page.tsx:382` (x2).

**Scoped to this module** (`npx eslint app/behind-the-scenes-ai components/ai-internals components/content i18n lib/courseData.ts`)
-> `docs/audit/bts/raw/lint-bts.txt`:

**1 problem - 0 errors, 1 warning.** The single warning is
`react-hooks/exhaustive-deps` in `components/content/LiveCodeEditor.tsx:873`, a Python-module
component that lives in the shared `components/content/` folder and is not used by this module.

So: **the Behind the Scenes of AI module's own source lints clean.** The remaining 124 repo-wide
warnings are unused imports/variables in `app/python/*` and `app/math/*` pages plus
`components/mentor/FloatingMentor.tsx`.

## 9. Accessibility patterns found in the code

Counts over `components/ai-internals/`, `app/behind-the-scenes-ai/` (excluding `_parked`),
`components/content/`, `components/ChapterLayout.tsx`, `components/CourseSidebar.tsx`:

| Pattern | Occurrences |
|---|---|
| `aria-hidden` | 312 |
| `useReducedMotion` (framer-motion) | 177 |
| `focus-visible:` | 155 |
| `aria-label` | 98 |
| `aria-pressed` | 71 |
| `role=` | 60 |
| `aria-live` | 24 |
| `sr-only` | 16 |
| `aria-expanded` | 11 |
| `tabIndex` | 6 |
| `aria-atomic` | 6 |
| `onKeyDown` | 5 |
| `aria-controls` | 5 |
| `aria-current` | 4 |
| `aria-labelledby` | 3 |
| `aria-selected` | 1 |
| `aria-modal` | 1 |
| `aria-describedby` | 1 |

Specific mechanisms, with files:

- **Reduced motion.** `useReducedMotion()` in 177 places, plus two direct media queries:
  `components/ai-internals/ExpandableLab.tsx:67` and `components/ai-internals/EdgePeek.tsx:80`
  (`window.matchMedia('(prefers-reduced-motion: reduce)')`). Confetti is skipped when reduced
  motion is on (`components/content/AssessmentEngine.tsx:307`: `if (result.passed && !reduce)`).
  In `WordToNumberLab.tsx:104`, reduced motion replaces the character-by-character typewriter
  with an instant set.
- **Explicit keyboard handlers** (beyond native button/input activation), 3 in reachable module code:
  `components/ai-internals/ChatInterfacePanel.tsx:283` (Enter to send),
  `components/ai-internals/SemanticSpaceLab.tsx:231` (activate a map point),
  `components/ai-internals/IntroStationViz.tsx:1872` (`onKeyDownCapture` stops an autoplay loop).
- **Live regions.** 24 `aria-live` with 6 `aria-atomic`, used for lab state announcements.
- **Screen-reader-only text.** 16 `sr-only` spans, e.g. the ordinal in chapter 1's summary list
  (`chapter-1/page.tsx`: `<span className="sr-only">{index + 1}. </span>`).
- **Focus management.** 155 `focus-visible:` ring utilities; 1 `aria-modal` on the
  `ExpandableLab` full-screen portal.
- **Read-aloud.** A full text-to-speech layer over the chapter text (see `05-localization.md`
  section 4), with per-word highlighting when the engine emits `boundary` events.
- **Non-colour encoding.** The result card swaps the icon, not only the colour, on pass vs fail
  (`AssessmentEngine.tsx:527-531`: `Check` when passed, `ListChecks` when not), with an explicit
  comment saying the neutral icon avoids signalling success below the threshold.
- **Document language.** `lang` and `dir` on `<html>` are set from the locale registry after mount
  (`i18n/LocaleProvider.tsx:45-50`); the prerendered HTML is `lang="he" dir="rtl"` for every route.

Not scored. No automated a11y audit (axe, Lighthouse) was run, and none exists in the repo.

## 10. Mobile / viewport-specific code

Tailwind breakpoint prefixes across `components/ai-internals/`, `app/behind-the-scenes-ai/` and
`components/ChapterLayout.tsx`:

| Breakpoint | Occurrences |
|---|---|
| `sm:` | 151 |
| `md:` | 240 |
| `lg:` | 55 |
| `xl:` | 25 |
| `2xl:` | 24 |

Total: 495 responsive utility applications.

JavaScript viewport branching (3 sites in the module's reachable code):

- `components/ai-internals/IntroRoadmap.tsx:222` -
  `window.matchMedia('(max-width: 767px), (pointer: coarse)')` - a separate branch for phones and
  touch devices.
- `components/ai-internals/ExpandableLab.tsx:67` and `EdgePeek.tsx:80` - `prefers-reduced-motion`
  (motion, not viewport).

No `window.innerWidth` reads. No user-agent sniffing.

**There is no `viewport` export and no `<meta name="viewport">` authored in the app.**
`app/layout.tsx` exports only `metadata` (lines 26-29). Next.js injects a default viewport meta
tag when none is exported.

## 11. Other buyer-relevant technical facts

- **Page metadata is the create-next-app default.** `app/layout.tsx:26-29`:
  ```ts
  export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
  };
  ```
  No route exports its own `metadata` or `generateMetadata` (grep over `app/` returns only this
  one). Confirmed in the built output: `.next/server/app/behind-the-scenes-ai/chapter-1.html`
  contains `<title>Create Next App</title>`. Every one of the 68 pages ships that title and
  description. There is no Open Graph data, no canonical URL, no `robots`, no `sitemap.xml`.
- **All chapter pages are `"use client"`**, so nothing is server-rendered per request; the static
  HTML is generated once at build time from the Hebrew dictionary.
- **Secrets.** `.env.local` (368 bytes) and `.env.local.example` (867 bytes) exist in the working
  tree. `.gitignore:34` ignores `.env*` with an exception for `.env.local.example` (line 36).
  Contents were not read or printed. `app/api/chat-reply/route.ts:27-30` guards on the key being
  present and not a placeholder, and the file states the key is server-only.
- **Rate limiting** exists for the API routes (`lib/rateLimit.ts`), shared per IP. Since no client
  calls those routes, it is unexercised.
- **No CI, no Dockerfile, no deployment config.** None of `.github/`, `.gitlab-ci.yml`, `.circleci/`, `Dockerfile`, `vercel.json`, `netlify.toml` exists.
- **Repo hygiene:** the root holds 13 markdown files, 11 of which are loose planning/migration
  notes (`BEHIND_AI_CHAPTER_STANDARD.md`, `CH2_`/`CH3_`/`CH4_`/`CH5_`/`CH8_MIGRATION_NOTES.md`,
  `CHAPTER_ARCHITECTURE_PLAN.md`, `COURSE_ARCHITECTURE_RECOMMENDATION.md`, `COURSE_AUDIT.md`,
  `IMPL_PLAN_CH1_CH8.md`, `INTRO_ROADMAP_AUDIT.md`) alongside `CLAUDE.md` and `README.md`, plus a
  stray `update_codeblocks.py` and an untracked `tsconfig.tsbuildinfo`. `CLAUDE.md` designates
  `docs/behind-ai-*.md` as the current source of truth and instructs that conflicting older
  planning files be ignored.
