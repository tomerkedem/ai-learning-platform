# 00 - Headline numbers

Module: **"מאחורי הקלעים של AI" / "Behind the Scenes of AI"** (`behind-the-scenes-ai`).
Every figure below is derived in sections 01-07 with a file citation. One sentence per row.

## Curriculum (section 01)

| # | Metric | Value | One-line note |
|---|---|---|---|
| 1 | Chapters in the product's chapter list | 20 | One intro (`id: 0`) plus chapters 1-19, ordered by the array in `lib/courseData.ts:539-757`. |
| 2 | Routes that resolve under the module | 21 | The 20 chapters plus `/behind-the-scenes-ai/final-exam`; there is no module index route. |
| 3 | Stated learning objectives | 0 | No namespace exposes an objectives key; the nearest equivalents are `practical` (17 chapters) and `lock` (18 chapters). |
| 4 | Declared prerequisites between chapters | 0 | No prerequisite field, no gating condition, all 21 routes directly addressable. |
| 5 | Instructional words, Hebrew source, page text | 34,340 | Measured by walking the runtime dictionary; includes UI labels, so it over-counts prose. |
| 6 | Chapter-quiz words, Hebrew | 7,827 | The 19 five-question quizzes. |
| 7 | Final-exam words, Hebrew | 1,497 | 109 chrome + 1,388 question/option/explanation words. |
| 8 | Total words, Hebrew | 43,664 | Sum of rows 5-7. |
| 9 | Dictionary string leaves for the module, Hebrew | 5,336 | Across 26 i18n namespaces. |
| 10 | Product-stated reading time, summed | 218 min | Sum of the 20 `readTime` values; the product never displays this total. |
| 11 | Chapters that are stubs or fail to resolve | 0 | All 21 routes prerendered successfully; build exit 0. |
| 12 | Unrouted `_parked` page directories | 8 | Next.js private folders; produce no routes and appear in no manifest. |
| 13 | Quiz question arrays defined but never registered | 3 (15 questions) | `chapter4Quiz`, `chapter9Quiz`, `chapter10Quiz` in `quizData.ts`. |
| 14 | `components/ai-internals/` files unreachable from any module route | 33 of 85 | Includes `PipelineCascadeLab.tsx` (1,164 lines) and `ConfidenceGateLab.tsx` (745). |
| 15 | API routes with zero callers | 2 | `/api/chat-reply` (live Claude streaming) and `/api/count-tokens`. |

## Interactions (section 02)

| # | Metric | Value | One-line note |
|---|---|---|---|
| 16 | Distinct interaction types | 7 | Free-text entry, guess-before-reveal, scenario selector, numeric adjustment, step-through, click-to-inspect, multiple-choice quiz. |
| 17 | Distinct interactive components rendered by module routes | 29 | Excludes shared chrome counted separately. |
| 18 | Chapters with zero interactions | 0 | All 20 chapters render at least one interactive component. |
| 19 | Labs whose output is computed by a real algorithm on learner input | 2 | Chapter 3 (rule-based tokenizer) and chapter 8 (true Softmax over learner-set scores). |
| 20 | Labs computing over authored fixed data | 1 | Chapter 5 distance / proximity from immutable coordinates. |
| 21 | Labs driven by a scripted engine or branch tree | 2 | Chapter 1 (keyword rules to a fixed reply table) and chapter 10 (authored branch tree). |
| 22 | Labs that are pure lookup tables | 15 | Chapters 2, 4, 6, 7, 9, 11-19 plus the intro visuals. |
| 23 | Labs calling an external API in the shipped path | 0 | The live-model route exists but nothing calls it. |
| 24 | Chapters carrying an in-UI "this is a simplified model" disclosure | 18 of 20 | Missing only in chapters 2 and 3. |
| 25 | `<input type="range">` sliders in reachable module code | 0 | Chapter 8's score control is a pair of +/- buttons. |
| 26 | Chapters using a guess-before-reveal step | 19 of 20 | Chapter 1 deliberately has none. |
| 27 | Sources of randomness in reachable module code | 2 | Quiz option shuffling and one intro decoding demo; every lab is deterministic. |

## Assessment (section 04)

| # | Metric | Value | One-line note |
|---|---|---|---|
| 28 | Question types supported by the engine | 1 | Single-answer multiple choice; `correctAnswer` is one integer index. |
| 29 | Total questions in the module | 113 | 95 chapter questions plus 18 final-exam questions, all 4-option. |
| 30 | Questions per chapter | 5 | Identical for all 19 chapters; the intro has none. |
| 31 | Difficulty split across 113 questions | 32 easy / 57 medium / 24 hard | Tagged but not used in scoring. |
| 32 | Distinct concept tags | 112 | 95 chapter tags plus 18 final-exam tags, overlapping in exactly one (`יכולת אינה הרשאה`). |
| 33 | Chapter-quiz pass threshold | 70% = 4 of 5 | Engine default; no chapter overrides it. |
| 34 | Final-exam pass threshold | 75% = 14 of 18 | `passScore: 75` in `quizData.ts:2190`. |
| 35 | Time limit | none | The timer counts up and is never compared to a limit. |
| 36 | Retry policy | unlimited | No cap, no cooldown; each finished attempt increments `attempts`. |
| 37 | Where answer keys live | client bundle | `correctAnswer` and explanations ship in `.next/static/chunks/*`. |
| 38 | Where scoring runs | client | `buildResult` in `AssessmentEngine.tsx:217-246`; no server call. |
| 39 | Persistence targets | 1 localStorage key | `behindAiMasteryProgress`; individual answers and elapsed time are not stored. |
| 40 | Progress schema migration path | none | `loadStore` rewrites any read version as 1 without migrating. |
| 41 | Final-exam questions localized per non-Hebrew locale | 2 of 18 (11.1%) | Only ids 13 and 17; the other 16 render Hebrew in en, es, ru, ar and ja. |
| 42 | Chapter-quiz questions localized per locale | 95 of 95 (100%) | All six locales carry full `byId` overrides. |

## Localization (section 05)

| # | Metric | Value | One-line note |
|---|---|---|---|
| 43 | Locales | 6 | he, ar (RTL) and ru, en, es, ja (LTR); Hebrew is source and default. |
| 44 | Dictionary leaves per locale, `behindAi` | he 5,336 / en 5,382 / es 5,381 / ru 5,353 / ar 5,362 / ja 5,369 | Object shape is enforced at compile time; array lengths are not. |
| 45 | Key coverage vs Hebrew | 100.3-100.9% in every locale | All above 100% because non-Hebrew locales carry 12 extra final-exam override leaves. |
| 46 | Namespaces that are byte-for-byte structurally identical across all six locales | 20 of 26 | The six that differ are `attention`, `guardrails`, `fullTrace`, `semanticSpace`, `finalExam`, `introVisuals`. |
| 47 | Namespaces re-exporting Hebrew instead of translating | 0 | All 22 content namespaces declare their own `contentLocale` in every locale. |
| 48 | Hebrew string *values* inside non-Hebrew locale files | 0 | Hebrew appears only as `conceptLabels` map keys (162 lines, 6 files, per locale). |
| 49 | Hebrew leaves still rendered in the English locale | 9 | All in `fullTrace.lab.stages[0].facts`, shown by `FullTraceLab.tsx:135` in chapter 19. |
| 50 | Chapter-19 lab stages that render a `facts` panel | he 5 / en 5 / es 0 / ru 0 / ar 0 / ja 0 | The panel is absent from four locales, so those learners see less content. |
| 51 | Total words per locale (page + quiz) | he 42,167 / en 57,483 / es 58,159 / ru 46,491 / ar 43,314 / ja 5,974 words (140,932 chars) | Japanese word counts are not comparable. |
| 52 | TTS provider | browser Web Speech API | No audio files, no backend, no third-party vendor. |
| 53 | Locales with a configured speech language tag | 6 of 6 | he-IL, en-US, es-ES, ru-RU, `ar` (region-less by design), ja-JP. |
| 54 | Direction handling | per locale, single source | `dirOf(locale)` from `LOCALES`; 427 `dir={dir}` props and 74 explicit RTL branches in module code. |
| 55 | Logical-CSS utilities in module code | 1,800 | `text-start` / `ps-` / `pe-` / `ms-` / `me-` instead of physical properties. |
| 56 | Locale selection mechanism | `?lang=` query param, client-side after mount | No cookie, no localStorage, no `Accept-Language`, no middleware, no `[locale]` route. |
| 57 | Production language switcher | none | `DevLocaleToggle` returns `null` unless `NODE_ENV === 'development'`. |
| 58 | Prerendered HTML language for every route | `lang="he" dir="rtl"` | Static HTML is generated from the default locale; direction is corrected only after hydration. |

## Technical state (section 06)

| # | Metric | Value | One-line note |
|---|---|---|---|
| 59 | Framework | Next.js 16.2.9, React 19.2.1, TypeScript 5.9.3, Tailwind 4.1.18 | App Router with Turbopack; `next.config.ts` is empty. |
| 60 | Build result | exit 0 | Compiled in 9.6 s, 68 static pages in 743 ms. |
| 61 | Runtime dependencies not imported by any reachable module file | 17 of 23 | Includes `pyodide`, `recharts`, `katex`, `prismjs`, `tsparticles`, `@anthropic-ai/sdk`, all Radix packages. |
| 62 | Heaviest module route | `/chapter-1` | 4,108,065 B JS uncompressed, 1,108,925 B gzip, 851,458 B brotli, across 18 chunks. |
| 63 | Lightest chapter route | `/chapter-2` | 4,005,858 B uncompressed, 1,080,307 B gzip; the spread across chapters is only 29 KB gzip. |
| 64 | Single dominant chunk | 2,982,422 B raw / 775,914 B gzip / 561,587 B brotli | Loaded on every module route and on the site home page; holds all six locales of all 26 namespaces. |
| 65 | Total `.next/static/` | 10,749,094 B over 219 files | The dominant chunk is 28% of it. |
| 66 | Total `public/` | 37,593,153 B over 36 files | Dominated by mentor PNGs of 1.4-2.4 MB each. |
| 67 | `public/` files fetched by a module route | 0 | Mentor images render only under `legacyMentorPortraits`, which only the math module passes. |
| 68 | `public/` files referenced from nowhere in the repo | 7 | Including a 2.17 MB PNG and three UUID-named images. |
| 69 | Authentication / entitlement / payment | ABSENT | No provider, no login route, no middleware, no protected route. |
| 70 | Analytics / error reporting | ABSENT | No provider of any kind; no telemetry leaves the device. |
| 71 | `error.tsx` / `global-error.tsx` / `not-found.tsx` / `loading.tsx` | 0 of 4 exist | Only the Next.js default `/_not-found` handler. |
| 72 | React error boundaries | 0 | An uncaught render error in a lab takes down the page. |
| 73 | Test files | 2 | Both in this module; `node --test` is the only runner. |
| 74 | Tests, pass / fail | 18 pass, 0 fail | All 18 pass; only 10 run under `npm test` because the script names one file. |
| 75 | Component, integration, E2E and visual tests | 0 | No browser-driving test tooling exists. |
| 76 | CI configuration | none | No `.github/`, `.gitlab-ci.yml`, `.circleci/`, `Dockerfile`, `vercel.json` or `netlify.toml`. |
| 77 | Lint, repo-wide | 128 problems: 4 errors, 124 warnings | All 4 errors are in `app/math/mathProbabilistic/`. |
| 78 | Lint, this module's source | 1 problem: 0 errors, 1 warning | The single warning is in a Python-module component sharing the `components/content/` folder. |
| 79 | Accessibility patterns counted | 312 `aria-hidden`, 177 `useReducedMotion`, 155 `focus-visible`, 98 `aria-label`, 71 `aria-pressed`, 60 `role=`, 24 `aria-live`, 16 `sr-only` | Not scored; no automated a11y audit exists in the repo. |
| 80 | Responsive utility applications in module code | 495 | 151 `sm:`, 240 `md:`, 55 `lg:`, 25 `xl:`, 24 `2xl:`. |
| 81 | JavaScript viewport branches | 1 | `IntroRoadmap.tsx:222` branches on `(max-width: 767px), (pointer: coarse)`. |
| 82 | Page metadata | create-next-app default | Every one of the 68 built pages ships `<title>Create Next App</title>`; no OG data, no sitemap, no robots. |

## Learner effort and completion (section 07)

| # | Metric | Value | One-line note |
|---|---|---|---|
| 83 | Reading time at 200 wpm, Hebrew, whole module | 218.3 min (3 h 38 min) | Derived by this audit; the assumption is stated, the product publishes no total. |
| 84 | Reading time at 200 wpm, English | 287.4 min (4 h 47 min) | English runs ~36% longer than Hebrew in word count. |
| 85 | Product's own per-chapter time claims | 20 values, 6-13 min each | Rendered under the label `זמן קריאה` ("reading time"). |
| 86 | Product's own quiz time claim | 3 min per chapter quiz, 9 min for the final exam | Computed as `ceil(questions * 0.5)`, not authored. |
| 87 | Minimum required clicks per chapter | 5-6 | One guess plus five quiz answers; chapter 1 has no guess. |
| 88 | Actions that gate progression | 1 | Answering question *n* before advancing to *n+1* inside a quiz attempt. |
| 89 | Actions that gate access to a chapter or the exam | 0 | Navigation is unconditional and every route is directly addressable. |
| 90 | Lab interactions that gate anything | 0 | No lab writes to any store or is read by any other system. |
| 91 | What marks a chapter "completed" | one finished quiz attempt, pass or fail | `completedChapters = chapterRecords.length` in `masteryProgress.ts:140`. |
| 92 | What marks a chapter "passed" | >= 70% on the recorded attempt | `bestScorePercent` is tracked separately and never lowered. |
| 93 | What marks the module complete | nothing | No module-completion record, no certificate, no badge; only a final-exam `passed` flag. |
| 94 | Where progress lives | one browser profile | One localStorage key; no account, no sync, no export, no recovery. |

## UNVERIFIED items

Everything this report could not establish from the repository, listed in full. All five share
one cause: they require running the application in a browser, and this repo contains no browser
test tooling.

| # | Item | Section | Why it could not be determined |
|---|---|---|---|
| U1 | Whether any rendered chapter-3 string tells the learner the tokenizer is a simplified model | 02 | The `chapter3` namespace has no `disclaimer`/`disclosure`/`simulat*` key; the tokenizer's limits appear only in source comments. Confirming nothing else on the page conveys it would need the rendered page. |
| U2 | Which of the 96 Hebrew literals in `app/behind-the-scenes-ai/chapter-4/embeddingEngine.ts` are displayed in a non-Hebrew locale | 05 | `TOKEN_DICTIONARY` is a fixed Hebrew word->id map; `wordLabContent.ts` supplies six locale text packs, but whether the Hebrew scenario *words* still surface needs a rendered page. |
| U3 | Which of the 56 Hebrew literals in `app/behind-the-scenes-ai/chapter-1/mockEngine.ts` are displayed in a non-Hebrew locale | 05 | Reply text is read from the dictionary, but `mockEngine` also builds serialized input envelopes containing Hebrew role markers; same reason as U2. |
| U4 | Whether the selected locale survives client-side navigation between chapters | 05 | Chapter links in `lib/courseData.ts` are bare paths, so `?lang=` is dropped from the URL; `LocaleProvider` sits above the router so React state would persist within a session, but confirming the actual behaviour needs a browser. |
| U5 | Japanese reading time | 07 | Japanese has no whitespace word boundaries, so a words-per-minute conversion is not meaningful; the comparable figure given instead is 140,932 non-space characters. |
