# 04 - Assessment system

## 1. Question types supported by the engine

The module uses one engine: **`components/content/AssessmentEngine.tsx`** (900 lines).

Its question interface (`AssessmentEngine.tsx:28-35`):

```ts
interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    /** תגית מושג אופציונלית, משמשת לאבחון מושגים חזקים וחלשים. */
    concept?: string;
}
```

`correctAnswer` is a single integer index into `options`. There is no field for multiple correct
answers, free text, numeric input, ordering, matching, drag-and-drop, code entry, or file upload,
and no branch in the component that handles any of those.

**Supported question types: 1 - single-answer multiple choice.**

A second, unrelated quiz engine exists at `components/content/Quiz.tsx`, with the same
single-index `correctAnswer` shape. It is imported only by `app/python/*` pages
(e.g. `app/python/chapter-1/page.tsx:16`) and by no file in this module.

Presentation detail: option order is shuffled per attempt for display only.
`buildOptionOrder` (`AssessmentEngine.tsx:112-124`) runs Fisher-Yates over option indices and
is called from user actions, never during render; `options` and `correctAnswer` are untouched.

## 2. Distribution of question types actually used

| Type | Count | Share |
|---|---|---|
| Single-answer multiple choice, 4 options | 113 | 100% |
| Any other type | 0 | 0% |

113 = 19 chapter quizzes x 5 + 18 final-exam questions.
Every question in `app/behind-the-scenes-ai/quizData.ts` has exactly 4 entries in `options`.

Difficulty is tagged but does not affect scoring (`Difficulty = "easy" | "medium" | "hard"`,
`quizData.ts:13`). Distribution across the 113 questions:

| Difficulty | Chapter quizzes (95) | Final exam (18) | Total |
|---|---|---|---|
| easy | 29 | 3 | 32 |
| medium | 46 | 11 | 57 |
| hard | 20 | 4 | 24 |

(Counted by loading the real `behindAiChapterQuizzes` and `finalExamQuestions` objects at runtime. Also verified in the same pass: every one of the 113 questions has exactly 4 options; no `correctAnswer` is out of range; the 95 chapter concept tags are all distinct, as are the 18 final-exam tags, and exactly one tag (`יכולת אינה הרשאה`) appears in both sets, giving 112 distinct tags in the module.)

## 3. Per chapter: question count and concept tags

Every one of the 19 chapters has exactly 5 questions and 5 distinct concept tags (one per
question). The introduction (chapter 0) has none.

| Ch | Q | Concept tags (`concept` field, stable internal keys, not translated) |
|---|---|---|
| 1 | 5 | הגלוי מול הנסתר; מוצר מול מודל; Token ID מול משמעות; Softmax מול Decoding; קלט המודל שהמוצר מרכיב |
| 2 | 5 | הודעה גלויה אינה כל הקלט; מה שחסר משנה; ניסוח משנה משימה; מזהה פותח אפשרות; תיקון משנה הקשר לא אימון |
| 3 | 5 | פירוק לטוקנים; טוקן מול מילה; צורה משנה פירוק; פירוק אינו הבנה; טוקנייזרים נבדלים |
| 4 | 5 | לכל טוקן שורה משלו; Token ID ככתובת; מכתובת לווקטור; ממדים אינם קריאים; נלמד מול אקראי |
| 5 | 5 | מרחב סמנטי; המפה אינה המרחב; מילים שונות משמעות דומה; שלילה הופכת משמעות; קרבה אינה אמת |
| 6 | 5 | קשב דינמי; יחסים ולא הדגשה; קשב אינו תודעה; מילים שונות ברגעים שונים; הקשר ולא אימות עובדות |
| 7 | 5 | חלון הקשר; פרטים נופלים מהחלון; חלון אינו זיכרון; פרומפט עצמאי; מה עושים כשנשכח |
| 8 | 5 | הערכה מול שליפה; מהציון להסתברות; סבירות אינה אמת; הקשר מזיז סבירות; אימות דורש מקור |
| 9 | 5 | מהי בחירת טוקן; אחרי ההסתברויות; שמרני מול פתוח; למה נבחרת אפשרות נמוכה; בחירה אינה אמת |
| 10 | 5 | בנייה צעד אחר צעד; פלט הופך לקלט; צעד מוקדם מכוון; ייצור אינו אימות; מבנה מייצב פלט |
| 11 | 5 | שטף אינו אמת; ביטחון אינו ראיה; מידע חסר גורם להשלמה; מקור מפחית סיכון; תשובה זהירה עדיפה מניחוש |
| 12 | 5 | תשובה מעוגנת במקור; אחזור לפני ניסוח; מקור מפחית ניחוש; מקור אינו קסם; חסר מידע צריך להיאמר |
| 13 | 5 | בדיקה עצמית היא שלב; בדיקה גם אחרי מקור; טענה לא נתמכת; בדיקה אינה אמת; בקשת בדיקה גלויה |
| 14 | 5 | טעות היא אות; הקשר אינו אימון; שיפור מערכת; בדיקה לפני הכרזה על שיפור; תיקון שימושי |
| 15 | 5 | הכללה למקרה חדש; דוגמה אחת אינה מבחן; סט בדיקה מגוון; כישלון חושף חולשה; בדיקה לפני אמון |
| 16 | 5 | הקשר נוכחי; שיחה חדשה אינה זיכרון; זיכרון אינו אימון; אימון דורש תהליך; ספקו כלל או מקור |
| 17 | 5 | צ'אט עונה, Agent מתקדם; כלי מרחיב יכולת; מידע חסר עוצר פעולה; אישור לפני פעולה; משימה בטוחה ל-Agent |
| 18 | 5 | יכולת אינה הרשאה; סיכון קובע פעולה; חסר מידע עוצר; אישור לפעולה רגישה; פעולה חסומה |
| 19 | 5 | הרכבת הקשר; יצירת טוקן; עיגון ובדיקה; Agent ובקרה; שיפור מאוחר |

Concept tags are Hebrew strings used as stable keys. Display labels per locale come from
`i18n/locales/<locale>/behind-ai/conceptLabels.ts` (142 entries in every locale) and from each
chapter quiz module's `conceptLabels` map, passed to the engine as `conceptDisplayMap`.

## 4. Final exam

- Route: `/behind-the-scenes-ai/final-exam`, page `app/behind-the-scenes-ai/final-exam/page.tsx` (125 lines).
- **Questions: 18**, ids 1-18 (`app/behind-the-scenes-ai/quizData.ts:1772-2029`).
- **Question types: 18 x single-answer multiple choice, 4 options each.**
- Concept tags (one per question): המסלול המלא, למה טוקניזציה, מרכזיות המספרים, הסתברות אינה אמת,
  ניסוח משנה ביטחון, דמיון מול הסתברות, Chat מול Agent, יכולת אינה הרשאה, סיכון בשימוש בכלי,
  למה צריך בקרה, זיהוי עמימות, הסבר לא טכני, UX חושף תהליך, כל מילה מזיזה, זיהוי אינו אישור,
  לולאת ה-Agent, למידה וזיכרון, ביטחון פוגש סיכון.

### Pass criteria, as implemented

`app/behind-the-scenes-ai/quizData.ts:2186-2200`:

```ts
export const behindAiFinalExam = {
    title: "מבחן סיום הלומדה: מאחורי הקלעים של AI",
    subtitle: "שמונה עשרה שאלות שמסכמות את כל הלומדה, מהקלט ועד ההחלטה האחראית",
    questions: finalExamQuestions,
    passScore: 75,
    ...
};
```

`components/content/AssessmentEngine.tsx:217-246`:

```ts
const buildResult = useCallback((): AssessmentResult => {
    const correctCount = questions.reduce((acc, q) => answers[q.id] === q.correctAnswer ? acc + 1 : acc, 0);
    const totalQuestions = questions.length;
    const scorePercent = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
    ...
    return {
        scorePercent,
        correctCount,
        totalQuestions,
        passed: scorePercent >= passScore,
        weakConcepts,
        strongConcepts,
    };
}, [questions, answers, passScore]);
```

So: pass = `round(correct/18 * 100) >= 75`, i.e. **14 of 18 correct** (14/18 = 77.8%; 13/18 = 72.2%).

Chapter quizzes do not pass a `passScore`, so they use the engine default
(`AssessmentEngine.tsx:139`: `passScore = 70`), i.e. **4 of 5 correct** (4/5 = 80%; 3/5 = 60%).

Score tiers for the final exam (`quizData.ts:2031-2036`), structural `min` values:
90 / 75 / 60 / 0. Labels and sub-labels are merged in per locale from `finalExam.tiers`.

### Time limit

**None.** The timer counts **up** and is never compared to a limit
(`AssessmentEngine.tsx:254-261`):

```ts
useEffect(() => {
    if (isActive && !isSubmitted) {
        timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
}, [isActive, isSubmitted]);
```

The elapsed time is displayed on the result card and is **not persisted**
(`QuizRecord` in `masteryProgress.ts:17-30` has no time field).

Chapter quizzes set `showTimer: true` (`quizData.ts:2181`). The final exam does not pass
`showTimer`, so it defaults to `true` (`AssessmentEngine.tsx:150`).

### Retry policy, as implemented

**Unlimited retries, no cooldown, no attempt cap.** The retry button
(`AssessmentEngine.tsx:654-659`) resets local state in place:

```tsx
<GuessButton
    onClick={() => { setAnswers({}); setCurrentIndex(0); setIsSubmitted(false); setIsReviewMode(false); setStreak(0); setSeconds(0); setIsActive(true); setDirection(0); setOptionOrder(buildOptionOrder(questions)); }}
    variant="ghost"
>
    {a.retry}
</GuessButton>
```

Every completed attempt increments `attempts` and never lowers the stored best
(`app/behind-the-scenes-ai/masteryProgress.ts:76-99`):

```ts
const attempts = (prev?.attempts ?? 0) + 1;
const bestScorePercent = Math.max(prev?.bestScorePercent ?? 0, input.scorePercent);
```

A "review answers" mode (`setIsReviewMode(true)`, line 651) lets the learner page back through
every question with the correct answer and explanation shown, before or instead of retrying.

## 5. Where answer keys live, and where scoring runs

- **Answer keys: in the client bundle.** `correctAnswer` and `explanation` are plain fields in
  `app/behind-the-scenes-ai/quizData.ts`, imported by every chapter page
  (e.g. `chapter-1/page.tsx:9`: `import { behindAiChapterQuizzes } from '../quizData';`).
  Confirmed in the built output: the string
  `"Token ID הוא כתובת יציבה באוצר המילים"` (the explanation for chapter 1 question 3) is present
  in `.next/static/chunks/14x1u7gxoklfu.js` and `.next/static/chunks/3kczzn7xqk-72.js`;
  `correctAnswer` appears in the shipped chunks. Any learner can read the key from devtools.
- **Scoring runs entirely on the client**, in `buildResult` (`AssessmentEngine.tsx:217-246`),
  quoted above. There is no server call. No API route validates or records an answer;
  `app/api/` contains only `chat-reply` and `count-tokens`, neither of which is called by any
  client file.
- No server-side answer store, no static answer JSON: the keys exist only inside `quizData.ts`
  and, per locale, the localized display text overrides in
  `i18n/locales/<locale>/behind-ai/*Quiz.ts` (which carry question/options/explanation text but
  not the index).

## 6. What is persisted after an attempt, and where

Storage: **`window.localStorage` only.** No server, no cookie, no IndexedDB.

| Key | Written by | Contents |
|---|---|---|
| `behindAiMasteryProgress` | `app/behind-the-scenes-ai/masteryProgress.ts:12,62` | `{ version: 1, records: Record<quizId, QuizRecord> }` |
| `behindAiMasterySidebarOpen` | `app/behind-the-scenes-ai/MasteryDashboard.tsx:152,178` | `"1"` / `"0"` - sidebar panel expanded |
| `bts-readaloud-voice:<locale>` | `components/ai-internals/useReadAloud.ts:86-94`, `SpeakButton.tsx:105` | selected speech-synthesis voice URI per locale |
| `lesson-focus-mode` (sessionStorage) | `components/ChapterLayout.tsx:108,115` | focus-mode preference |
| `sidebar-scroll-pos` (sessionStorage) | `components/CourseSidebar.tsx:23,31` | sidebar scroll offset |

`QuizRecord` shape (`masteryProgress.ts:17-30`):

```ts
export interface QuizRecord {
    quizId: string;
    chapterId: number | null;   // null for the final exam
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    attempts: number;
    bestScorePercent: number;
    lastCompletedAt: number;
    weakConcepts: string[];
    strongConcepts: string[];
}
```

Quiz ids: `behind-ai-chapter-<n>` (`chapterQuizId`, line 102) and `behind-ai-final`
(`FINAL_EXAM_QUIZ_ID`, line 15).

Individual answers are **not** persisted - only the aggregate record above. Elapsed time is not
persisted. Writes are wrapped in `try/catch` and fail silently if storage is unavailable
(lines 60-66).

## 7. Final-exam translation coverage per locale

**This is the module's largest assessment localization gap.**

The final-exam page merges localized text over the Hebrew question skeleton
(`app/behind-the-scenes-ai/final-exam/page.tsx:29-32`):

```ts
const { questions: baseQuestions, passScore, onComplete, getReviewLinks, soundEnabled } = behindAiFinalExam;
const questions = baseQuestions.map((question) => ({
    ...question,
    ...(fx.questionOverrides[question.id as 13 | 17] ?? {}),
}));
```

The override map is typed `Record<13 | 17, ...>`
(`i18n/locales/he/behind-ai/finalExam.ts:16`), so **only questions 13 and 17 can ever be
overridden**. Every other question falls through to the Hebrew text in `quizData.ts`.

Measured override counts (`docs/audit/bts/raw/quiz-coverage.tsv`, produced by counting
`<id>: { question:` entries in each locale's `finalExam.ts`):

| Locale | Questions with localized text | Questions falling back to Hebrew | % localized |
|---|---|---|---|
| he (source) | 18 / 18 (native) | 0 | 100% |
| en | 2 (ids 13, 17) | **16** | 11.1% |
| es | 2 (ids 13, 17) | **16** | 11.1% |
| ru | 2 (ids 13, 17) | **16** | 11.1% |
| ar | 2 (ids 13, 17) | **16** | 11.1% |
| ja | 2 (ids 13, 17) | **16** | 11.1% |

The exam *chrome* (page title, subtitle, start/submit labels, score-tier labels, review link
labels, back link) **is** fully localized in all six locales - `finalExam.ts` has 30 leaves in
each non-Hebrew locale vs 18 in Hebrew (`docs/audit/bts/raw/i18n-keys.tsv`), the extra 12 being
the two override objects.

By contrast, **chapter quizzes are fully localized**: all 19 chapters x 5 questions have
`byId` overrides in all six locales (19 x 5 = 95 in every locale). See
`docs/audit/bts/raw/quiz-coverage.tsv`.

## 8. Mastery / weak-concept feedback

Two surfaces consume the stored records.

### a) End-of-attempt feedback (`AssessmentEngine.tsx:548-600`)

Data used: the `weakConcepts` / `strongConcepts` arrays computed in `buildResult`.
Rule (`AssessmentEngine.tsx:231-236`):

```ts
byConcept.forEach((stat, concept) => {
    if (stat.correct === stat.total) strongConcepts.push(concept);
    else weakConcepts.push(concept);
});
```

Because each chapter quiz has 5 questions with 5 distinct concept tags, each concept has exactly
one question, so at chapter level "strong" == answered correctly and "weak" == answered wrong.

Displayed: green chips for strong concepts, amber chips for weak ones, plus up to 3
targeted review links (`getReviewLinks(weakConcepts).slice(0, 3)`, line 427). Link generation
(`quizData.ts:2151-2162`):

```ts
export function reviewLinksForConcepts(concepts: string[]): ReviewLink[] {
    const seenChapters = new Set<number>();
    const links: ReviewLink[] = [];
    for (const concept of concepts) {
        const n = CONCEPT_TO_CHAPTER[concept];
        if (!n || seenChapters.has(n)) continue;
        seenChapters.add(n);
        links.push({ href: `/behind-the-scenes-ai/chapter-${n}`, label: `חזרה לפרק ${n}: ${CHAPTER_LABELS[n]}` });
    }
    return links;
}
```

`CONCEPT_TO_CHAPTER` is built automatically from the 19 chapter quizzes
(`quizData.ts:2093-2100`) and then extended by hand with 16 final-exam-only concepts
(`FINAL_CONCEPT_TO_CHAPTER`, lines 2104-2148). A concept absent from both maps yields no link.
Labels are re-translated per locale in the chapter page by rewriting only the label and keeping
the `href` (`chapter-1/page.tsx:59-68`, `final-exam/page.tsx:44-54`).

### b) Progress dashboard (`app/behind-the-scenes-ai/MasteryDashboard.tsx`)

Rendered in the sidebar (`SidebarMastery`, imported by `components/CourseSidebar.tsx:9`) and
above the final exam (`final-exam/page.tsx:98`).

Data used: `getMasterySummary()` (`masteryProgress.ts:130-166`), which reads all records and
returns:

- `completedChapters` = number of chapter records that exist (any attempt, pass or fail)
- `passedChapters` = records where `passed === true`
- `totalChapters` = the constant `TOTAL_CHAPTER_QUIZZES = 19` (`masteryProgress.ts:14`)
- `averageScore` = mean of `bestScorePercent` across chapter records, rounded
- `finalExam` = `"not-taken" | "passed" | "needs-review"`
- `weakConcepts` = concepts marked weak in some record **and not marked strong in any other**
  (lines 156-160), so mastering a concept anywhere clears it from the weak list
- `strongConcepts` = union of every record's strong concepts

The dashboard shows at most 6 weak-concept chips (`MasteryDashboard.tsx:129`) and a CTA to the
final exam.

## 9. Facts a buyer may want stated plainly

- No proctoring, no question banking or randomised selection from a pool (the same 5 / 18
  questions every attempt), no per-question timing, no partial credit, no adaptive difficulty.
- Option order is randomised per attempt; question order is fixed.
- Answer keys and explanations ship to the browser.
- All progress is per-browser-profile. Clearing site data erases it. There is no account, no
  sync across devices, and no export.
- Store versioning: `MasteryStore` declares `version: 1`, but `loadStore` discards whatever
  version it reads and rewrites it as 1 (`masteryProgress.ts:41-56`):
  `return { version: 1, records: parsed.records };`. **There is no migration path**; a future
  shape change would silently reinterpret or drop old records.
- 15 questions in `quizData.ts` (`chapter4Quiz`, `chapter9Quiz`, `chapter10Quiz`) are defined,
  exported, and not registered in `CHAPTER_QUIZZES`; they ship in the bundle but are never shown.
