# 05 - Localization state

Six locales are declared in `i18n/config.ts:22-31`:

```ts
export const LOCALES = {
    he: { dir: 'rtl', htmlLang: 'he', label: 'עברית', enabled: true },
    ar: { dir: 'rtl', htmlLang: 'ar', label: 'العربية', enabled: true },
    ru: { dir: 'ltr', htmlLang: 'ru', label: 'Русский', enabled: true },
    en: { dir: 'ltr', htmlLang: 'en', label: 'English', enabled: true },
    es: { dir: 'ltr', htmlLang: 'es', label: 'Español', enabled: true },
    ja: { dir: 'ltr', htmlLang: 'ja', label: '日本語', enabled: true },
} as const satisfies Record<string, LocaleMeta>;
```

`DEFAULT_LOCALE = 'he'` (line 35). Hebrew is the source language.

## How the numbers below were computed

Two independent methods, both reproducible:

1. **Runtime dictionary walk.** The project's TypeScript modules were transpiled with the
   installed `typescript` compiler and `getDictionary(locale)` was called for each locale. Every
   leaf (string, number, boolean, function) reachable under `dictionary.behindAi` was enumerated
   with its full key path. Output: `docs/audit/bts/raw/i18n-keys.tsv` (per namespace),
   `docs/audit/bts/raw/dictwords-<locale>.tsv` (per chapter), `docs/audit/bts/raw/i18n-identical.tsv`.
2. **Source-literal scan.** Every `.ts` file under `i18n/locales/<locale>/behind-ai/` and every
   reachable module source file was tokenised, comments and import paths were dropped, and string
   literals used as object *keys* were excluded. Output: `docs/audit/bts/raw/hebrew-values-nonhe.txt`,
   `docs/audit/bts/raw/hebrew-values-reachable.txt`, `docs/audit/bts/raw/hebrew-leaves-en.tsv`.

## 1. Key coverage per locale

There is a compile-time completeness guarantee: each non-Hebrew namespace is typed against
`typeof he<Namespace>` (`i18n/dictionary.ts:240-266`), so a missing key is a build error.
`npm run build` runs TypeScript and exits 0 (`docs/audit/bts/raw/build.txt:9-10`, `EXIT=0`).
That guarantee covers **object shape**, not array length - arrays are typed `string[]`, so a
locale may hold more or fewer array entries than Hebrew.

Leaf counts across the module's 26 namespaces (`docs/audit/bts/raw/i18n-keys.tsv`):

| Locale | Leaves under `behindAi` | vs Hebrew | % of Hebrew |
|---|---|---|---|
| he | 5,336 | - | 100.0% |
| en | 5,382 | +46 | 100.9% |
| es | 5,381 | +45 | 100.8% |
| ru | 5,353 | +17 | 100.3% |
| ar | 5,362 | +26 | 100.5% |
| ja | 5,369 | +33 | 100.6% |

Computation: `leaves(locale) / leaves(he) * 100`. Every locale is at or above 100% because
(a) `finalExam` carries 12 extra leaves per non-Hebrew locale (the two question overrides, which
Hebrew does not need), and (b) some translated arrays split into a different number of entries.

Namespaces where a locale's leaf count differs from Hebrew:

| Namespace | he | en | es | ru | ar | ja |
|---|---|---|---|---|---|---|
| `attention` | 322 | 350 | 376 | 350 | 361 | 358 |
| `guardrails` | 317 | 319 | 316 | 316 | 316 | 316 |
| `fullTrace` | 418 | 418 | 396 | 396 | 396 | 396 |
| `semanticSpace` | 170 | 170 | 170 | 170 | 170 | 178 |
| `finalExam` | 18 | 30 | 30 | 30 | 30 | 30 |
| `introVisuals` | 159 | 163 | 161 | 159 | 157 | 159 |

All other 20 namespaces are identical across all six locales.

**One of these differences is a content omission that changes what the learner sees.**
`fullTrace.lab.stages[0].facts` is an array of 5 `{label, value}` pairs in `he` and `en`, and is
**absent in `es`, `ru`, `ar`, `ja`**:

```
he stages with facts: 5 / 14
en stages with facts: 5 / 14
es stages with facts: 0 / 14
ru stages with facts: 0 / 14
ar stages with facts: 0 / 14
ja stages with facts: 0 / 14
```

`FullTraceLab.tsx:135` renders that block conditionally (`{active.facts && ...}`), so in
es/ru/ar/ja the fact panel simply does not appear on any of the 14 stages of chapter 19's lab.

## 2. Chapter content: fully / partially / missing per locale

Every namespace in every locale declares its own `contentLocale` (22 occurrences per locale,
one per content namespace). None re-exports Hebrew:

```
he:  22 x contentLocale: 'he'
en:  22 x contentLocale: 'en'
es:  22 x contentLocale: 'es'
ru:  22 x contentLocale: 'ru'
ar:  22 x contentLocale: 'ar'
ja:  22 x contentLocale: 'ja'
```

| Locale | Chapters fully present | Partially present | Missing |
|---|---|---|---|
| he | 20 / 20 | 0 | 0 |
| en | 19 / 20 - chapter 19 partial | 1 (ch 19: 9 leaves still in Hebrew, see below) | 0 |
| es | 19 / 20 | 1 (ch 19: the `facts` panel is absent) | 0 |
| ru | 19 / 20 | 1 (ch 19: `facts` absent) | 0 |
| ar | 19 / 20 | 1 (ch 19: `facts` absent) | 0 |
| ja | 19 / 20 | 1 (ch 19: `facts` absent) | 0 |

Separately, the **final exam** is partial in all five non-Hebrew locales: 16 of 18 questions
render Hebrew text. Full detail in `04-assessment.md` section 7.

Word / character volume per locale (page text, quiz text excluded; from
`docs/audit/bts/raw/dictwords-<locale>.tsv`):

| Locale | page words | page non-space chars | quiz words | quiz non-space chars |
|---|---|---|---|---|
| he | 34,340 | 155,179 | 7,827 | 35,018 |
| en | 46,653 | 221,656 | 10,830 | 51,263 |
| es | 47,179 | 234,723 | 10,980 | 54,029 |
| ru | 37,834 | 227,034 | 8,657 | 51,451 |
| ar | 35,386 | 168,988 | 7,928 | 38,091 |
| ja | 5,162 | 115,666 | 812 | 25,266 |

Japanese word counts are not meaningful (no whitespace between words); the character column is
the comparable figure.

## 3. Hardcoded source-language strings appearing in other locales

### a) Inside the locale files

**Zero.** A scan of every `.ts` file under `i18n/locales/{en,es,ru,ar,ja}/behind-ai/` for string
literals containing Hebrew letters, excluding comments, import paths, and literals used as object
*keys*, returns 0 in every locale (`docs/audit/bts/raw/hebrew-values-nonhe.txt`).

Hebrew *does* appear in those files, but only on the left-hand side of `conceptLabels` maps,
where it is the stable internal key. Example, `i18n/locales/en/behind-ai/chapter2Quiz.ts:78-82`:

```ts
'הודעה גלויה אינה כל הקלט': 'The visible message is not the whole input',
'מה שחסר משנה': 'What is missing matters',
'ניסוח משנה משימה': 'Phrasing changes the task',
```

Counts of such key-side occurrences (identical in every non-Hebrew locale): 162 lines across
6 files - `conceptLabels.ts` (141), `chapter2Quiz.ts` (5), `chapter3Quiz.ts` (5),
`chapter4Quiz.ts` (5), `semanticSpaceQuiz.ts` (5), `chapter1Quiz.ts` (1).

### b) Leaves that are byte-identical to Hebrew and contain Hebrew letters

Comparing every leaf key path against the Hebrew value (`docs/audit/bts/raw/i18n-identical.tsv`):

| Locale | leaves | identical to he | % identical | of those, containing Hebrew letters |
|---|---|---|---|---|
| en | 5,382 | 570 | 10.6% | **9** |
| es | 5,381 | 555 | 10.3% | 0 |
| ru | 5,353 | 570 | 10.6% | 0 |
| ar | 5,362 | 557 | 10.4% | 0 |
| ja | 5,369 | 579 | 10.8% | 0 |

The ~10% identical figure is dominated by intentionally shared values: Latin technical terms
(`Softmax`, `Token ID`, `Chat Mode`, `RAG`), numbers, and the `conceptLabels` key set.

The 9 Hebrew-bearing leaves in **en** (`docs/audit/bts/raw/hebrew-leaves-en.tsv`) are all in
chapter 19's first trace stage, and all are rendered by `FullTraceLab.tsx:135`:

```
fullTrace.lab.stages[0].facts[0].label   בקשה נוכחית
fullTrace.lab.stages[0].facts[0].value   בדיקת חבילה 123456789 וטיוטה בלבד
fullTrace.lab.stages[0].facts[1].label   היסטוריית שיחה
fullTrace.lab.stages[0].facts[1].value   רק ההודעה הנוכחית נדרשת
fullTrace.lab.stages[0].facts[2].label   זיכרון שמור
fullTrace.lab.stages[0].facts[2].value   אופציונלי, לא נשלף
fullTrace.lab.stages[0].facts[3].value   מדיניות שמירה, לא זיכרון שנכנס אוטומטית
fullTrace.lab.stages[0].facts[4].label   RAG / תוצאות קודמות
fullTrace.lab.stages[0].facts[4].value   אופציונלי, עדיין אין
```

So: **an English learner reading chapter 19 sees 5 fact rows in Hebrew.**

### c) Hebrew literals in module source (outside the locale files)

15 reachable files contain Hebrew string values (`docs/audit/bts/raw/hebrew-values-reachable.txt`).
Classified by whether they can reach the screen in a non-Hebrew locale:

| File | Hebrew values | Reaches a non-Hebrew screen? |
|---|---|---|
| `app/behind-the-scenes-ai/quizData.ts` | 920 | **Yes, for the final exam only.** Chapter-quiz text is fully overridden per locale; final-exam questions 1-12, 14-16, 18 are not (see `04-assessment.md`). |
| `lib/courseData.ts` | 216 | No. `num: "פרק 1"` and `readTime: "8 דקות"` are parsed to numbers and re-rendered per locale by `formatChapterLabel` / `parseReadTimeMinutes` + `formatReadTime` (`components/ChapterLayout.tsx:244,375,448`, `components/CourseSidebar.tsx:191`). Titles/labels are `LocalizedText` objects with all six locales. |
| `app/behind-the-scenes-ai/introduction/introContent.ts` | 140 | No. The intro page and all six components that reference this file use `import type` only (`introduction/page.tsx:20-22`, `AgentLoop.tsx:35`, `CourseSystems.tsx:29`, `HypothesisGuess.tsx:23`, `IntroRoadmap.tsx:33`, `IntroStationViz.tsx:37`, `NextTokenGuess.tsx:16`). The Hebrew constants are unused at runtime. |
| `app/behind-the-scenes-ai/chapter-4/embeddingEngine.ts` | 96 | Partly. `TOKEN_DICTIONARY` (line 23) is a fixed Hebrew word -> id map; the chapter-4 lab shows Hebrew scenario words in every locale unless `wordLabContent` supplies a locale dataset. **UNVERIFIED: which of the 96 Hebrew literals in `embeddingEngine.ts` are displayed in a non-Hebrew locale** - resolving this needs a rendered page, which was not run. |
| `app/behind-the-scenes-ai/chapter-1/mockEngine.ts` | 56 | **UNVERIFIED** by the same argument; the page reads reply text from the dictionary (`chapter-1/page.tsx:159`), but `mockEngine` also builds serialized input envelopes containing Hebrew role markers. |
| `chapter-3/tokenizer.ts` (36), `labContent.tsx` (36), `hebrewSplitRules.ts` (30), `tokenRoles.ts` (24) | 126 | No. `labContent.tsx:38-43` imports a `chapter3Lab` content pack for each of en/es/ru/ar/ja and selects by locale via `Chapter3LabProvider` / `getLabContent(locale)` (`chapter-3/page.tsx:23,97,253`); Hebrew is the default pack only. |
| `app/behind-the-scenes-ai/chapter-4/wordLabContent.ts` | 16 | No. Six locale packs exist (`HE_/EN_/ES_/RU_/AR_/JA_WORD_TEXT`, lines 679-889) with a locale selector at lines 884-889. |
| `i18n/format.ts` | 11 | No. All 11 are inside `Record<Locale, ...>` maps that carry all six languages (lines 17-23, 36-39, 62-77, 89-96). |
| `components/ChapterLayout.tsx` | 2 | No. Both are in the "chapter not found" fallback object (`lines 227-230`). |
| `components/CourseHeader.tsx` | 1 | No. Default parameter `readTime = "10 דקות"` (line 28); `ChapterLayout.tsx:375` always passes a formatted value. |
| `components/ai-internals/EngineReveal.tsx` | 1 | No. Default parameter `inputPlaceholder = 'הקלידו הודעה...'` (line 36); the intro page always passes `intro.chat.inputPlaceholder` (`introduction/page.tsx:276`). |
| `i18n/config.ts` | 1 | No. `label: 'עברית'` - the Hebrew language's own name. |
| `components/ai-internals/EngineReveal.tsx`, `chapter-6/scoringEngine.ts` | 1 | Not reachable (scoringEngine is unreachable). |

## 4. TTS configuration per locale

Provider: **the browser's Web Speech API only.** `components/ai-internals/useReadAloud.ts:4-6`:

> `הוק הקראה (Read-aloud) מבוסס דפדפן בלבד: Web Speech API (window.speechSynthesis). אין כאן קבצי שמע, אין backend, אין TTS חיצוני.`

No audio files, no server, no third-party TTS vendor. There is no voice bundled with the product;
what the learner hears depends entirely on the voices their OS/browser has installed.

Language tags (`components/ai-internals/readAloudLang.ts:10-17`):

| Locale | BCP-47 tag passed to `SpeechSynthesisUtterance.lang` | Configured |
|---|---|---|
| he | `he-IL` | yes |
| en | `en-US` | yes |
| es | `es-ES` | yes |
| ru | `ru-RU` | yes |
| ar | `ar` | yes - deliberately region-less; the file comment states `"ערבית נשארת בסיסית (ar) כי זמינות קולות אזוריים אינה עקבית בין דפדפנים"` |
| ja | `ja-JP` | yes |

Behaviour: voices matching the active locale are listed for selection; the chosen voice URI is
persisted per locale under `bts-readaloud-voice:<locale>` in `localStorage`
(`useReadAloud.ts:86-94`). Rate is adjustable. When the engine emits `boundary` events, the
current word is highlighted; when it does not, the code degrades silently
(`useReadAloud.ts` `wordRange` doc comment). Status `'unsupported'` is a first-class state.

Every chapter page builds its own segment list and exposes three scope modes
(`short` / `regular` / `full`) - e.g. `chapter-1/page.tsx:170-174`. Individual `SpeakButton`s sit
next to headings, insight boxes and lab captions throughout.

## 5. RTL / LTR handling

**Direction is per locale, derived from a single registry, never from `locale === 'he'`.**
`i18n/config.ts:4-6` states this as a rule; `dirOf` (lines 51-53) is the only source:

```ts
export function dirOf(locale: Locale): Direction {
    return LOCALES[locale].dir;
}
```

Where direction is applied:

1. **Document level.** `app/layout.tsx:41` hardcodes `<html lang="he" dir="rtl">` for SSR. After
   mount, `LocaleProvider` overwrites it (`i18n/LocaleProvider.tsx:45-50`):
   ```ts
   const el = document.documentElement;
   el.lang = LOCALES[locale].htmlLang;
   el.dir = dirOf(locale);
   el.dataset.locale = locale;
   ```
   Consequence: the prerendered HTML for every route ships as `<html lang="he" dir="rtl">`
   (verified in `.next/server/app/behind-the-scenes-ai/chapter-1.html`), and the correct
   direction is only applied client-side after hydration.
2. **Component level.** `useT()` returns `dir`, and components pass it down. Counted across
   `app/behind-the-scenes-ai/` and `components/ai-internals/`: **427** occurrences of `dir={dir}`
   and **74** explicit `isRtl ? ... : ...` / `isRTL ? ... : ...` branches (present in all 20
   chapter pages). Examples: `isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />`
   (`components/ChapterLayout.tsx:419`), and the mirrored gradient direction in
   `app/behind-the-scenes-ai/chapter-1/page.tsx`.
3. **Logical CSS properties** rather than physical ones: **1,800** occurrences of
   `text-start` / `ps-` / `pe-` / `ms-` / `me-` across the same two trees.
4. Latin-script fragments inside RTL text are wrapped in `dir="ltr"` islands - 3 in
   `app/behind-the-scenes-ai/chapter-6/page.tsx` alone (lines 200, 304, 376).

There is **no image mirroring**; direction is handled by layout and by swapping icon components.

## 6. How locale is selected and persisted

**Selection: a `?lang=` query-string parameter, read once on the client after mount.**
`i18n/LocaleProvider.tsx:29-40`:

```ts
const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (isLocale(param) && param !== locale) {
        setLocaleState(param);
    }
}, []);
```

**Persistence: the URL only.** `setLocale` rewrites `?lang=` with `history.replaceState`
(lines 52-60):

```ts
const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    const url = new URL(window.location.href);
    if (l === DEFAULT_LOCALE) url.searchParams.delete('lang');
    else url.searchParams.set('lang', l);
    window.history.replaceState(null, '', url.toString());
}, []);
```

There is **no cookie, no `localStorage` entry, no `Accept-Language` negotiation, no middleware,
and no `[locale]` route segment**. `middleware.ts` does not exist. The file's own header states:
`"אין שימוש ב-localStorage כמנגנון השפה הראשי, ואין ניתוב [locale] בשלב זה."`

Consequences that follow directly from this code:

- Navigating to `/behind-the-scenes-ai/chapter-2` from a chapter opened with `?lang=en` uses
  `next/link`, which preserves the client router but **not** the query string unless the `href`
  carries it. The chapter links in `lib/courseData.ts` are bare paths
  (`href: "/behind-the-scenes-ai/chapter-2"`), so the `?lang` parameter is dropped on every
  chapter-to-chapter navigation. **UNVERIFIED: whether the React state survives that client-side
  navigation** - `LocaleProvider` sits above the router in `app/layout.tsx`, so the provider is
  not remounted and the state would persist within a session; a full page reload on the new URL
  would return to Hebrew. Confirming which happens needs a running browser, which was not used.
- Every route's first paint is Hebrew/RTL regardless of the requested locale, because the static
  HTML is generated with `DEFAULT_LOCALE`.
- Search engines and link previews see the Hebrew version of every page.

**There is no language switcher in production.** The only switcher is
`i18n/DevLocaleToggle.tsx`, and its first statement is (line 20):

```ts
if (process.env.NODE_ENV !== 'development') return null;
```

Its own header comment: `"בורר שפה לפיתוח/בדיקות בלבד. מוצג רק כש-NODE_ENV === 'development', ולכן אינו קיים בפרודקשן."`
A production learner can reach a non-Hebrew locale only by typing `?lang=en` into the address bar.
