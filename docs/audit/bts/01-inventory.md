# 01 - Curriculum inventory

Module audited: **"מאחורי הקלעים של AI" / "Behind the Scenes of AI"**, id `behind-the-scenes-ai`.
All paths are repo-relative. Facts below were produced by reading files and by running the
project's own build/test/lint commands (raw output in `docs/audit/bts/raw/`).

## Measurement assumptions

1. **"Chapter"** = one entry in the `chapters` array of `courses["behind-the-scenes-ai"]` in
   `lib/courseData.ts:530-758`. That array has 20 entries: one `id: 0` labelled `מבוא` (intro)
   and `id: 1..19`. The final exam (`/behind-the-scenes-ai/final-exam`) is a route but is **not**
   an entry in that array.
2. **"Instructional text"** = every string leaf reachable from the chapter's i18n namespace(s)
   in the runtime dictionary (`i18n/dictionary.ts`), excluding the namespace's `quiz` sub-object.
   This includes headings, body copy, lab captions, chip labels and aria labels, because the
   dictionary does not separate them; it therefore **over-counts** relative to prose-only.
   Word count = whitespace-separated tokens. Japanese is not whitespace-delimited, so for `ja`
   the character count is the meaningful figure (reported in `05-localization.md`).
   Measurement method: the project's own TypeScript modules were transpiled with the installed
   `typescript` compiler and the real `getDictionary(locale)` object was walked. Raw output:
   `docs/audit/bts/raw/dictwords-he.tsv` (and one file per locale).
3. **"Lab"** = a distinct interactive React component rendered by that chapter's `page.tsx`,
   excluding the shared quiz engine (`AssessmentEngine`), the read-aloud dock
   (`ReadAloudControls` / `FloatingReadAloud` / `SpeakButton`) and the pure layout wrapper
   `ExpandableLab`.
4. **"Stated learning objectives"**: no chapter namespace contains an `objectives`, `goals` or
   equivalent key. See the table column and the note below.

## Chapter table

Word counts are for the source language (Hebrew). `readTime` is the product's own stated figure
from `lib/courseData.ts`; it is stored as a Hebrew string and re-rendered per locale by
`i18n/format.ts:formatReadTime` + `parseReadTimeMinutes`.

| # | slug / route | title (he, source) | title (en) | stated learning objectives | concepts introduced (quiz `concept` tags, `app/behind-the-scenes-ai/quizData.ts`) | instructional words (he) | labs | quiz questions | product-stated reading time |
|---|---|---|---|---|---|---|---|---|---|
| 0 | `/behind-the-scenes-ai/introduction` | מבוא: מה קורה מאחורי הקלעים של AI | Intro: Behind the Scenes of AI | NONE | (no quiz; namespace covers the 14-station roadmap, the Chat/Agent split and the scope statement) | 1,787 | 3 (`IntroRoadmap`, `EngineReveal`, `AgentLoop`) + 1 guess (`HypothesisGuess`) | 0 | 6 דקות |
| 1 | `/behind-the-scenes-ai/chapter-1` | הצ'אט השקוף: הדרך שמאחורי התשובה | The Transparent Chat: The Path Behind the Answer | NONE | הגלוי מול הנסתר; מוצר מול מודל; Token ID מול משמעות; Softmax מול Decoding; קלט המודל שהמוצר מרכיב | 1,513 | 1 (`TransparentLabLayout` = `ChatInterfacePanel` + `GlassEnginePanel`) | 5 | 8 דקות |
| 2 | `/behind-the-scenes-ai/chapter-2` | Model Input: מה באמת נכנס למודל | Model Input: What Really Enters the Model | NONE | הודעה גלויה אינה כל הקלט; מה שחסר משנה; ניסוח משנה משימה; מזהה פותח אפשרות; תיקון משנה הקשר לא אימון | 1,061 | 1 (`InputComparisonLab`) + 1 guess (`OpeningGuess`) | 5 | 8 דקות |
| 3 | `/behind-the-scenes-ai/chapter-3` | Tokenization: כשהטקסט מתפרק לטוקנים | Tokenization: When Text Breaks Into Tokens | NONE | פירוק לטוקנים; טוקן מול מילה; צורה משנה פירוק; פירוק אינו הבנה; טוקנייזרים נבדלים | 738 (+ Hebrew lab strings in `app/behind-the-scenes-ai/chapter-3/labContent.tsx`, `tokenizer.ts`, `tokenRoles.ts`, `hebrewSplitRules.ts`, which sit outside the dictionary; file-literal method gives 1,027 combined) | 2 (`TokenizationLab`, `TokenizationRoadmap`) + 1 guess | 5 | 11 דקות |
| 4 | `/behind-the-scenes-ai/chapter-4` | Embeddings: ממספר חסר משמעות למשמעות | Embeddings: From a Meaningless Number to Meaning | NONE | לכל טוקן שורה משלו; Token ID ככתובת; מכתובת לווקטור; ממדים אינם קריאים; נלמד מול אקראי | 1,154 (+ per-locale lab strings in `app/behind-the-scenes-ai/chapter-4/wordLabContent.ts`) | 3 (`WordToNumberLab`, `EmbeddingLookupLab`, `SentenceBridge`) + 1 guess (`GuessButton`/`GuessVerdict`) | 5 | 13 דקות |
| 5 | `/behind-the-scenes-ai/chapter-5` | Semantic Space: מפת המשמעות של המודל | Semantic Space: The Model's Map of Meaning | NONE | מרחב סמנטי; המפה אינה המרחב; מילים שונות משמעות דומה; שלילה הופכת משמעות; קרבה אינה אמת | 1,310 | 1 (`SemanticSpaceLab`) + 1 guess | 5 | 12 דקות |
| 6 | `/behind-the-scenes-ai/chapter-6` | Attention: מי חשוב עכשיו | Attention: Who Matters Now | NONE | קשב דינמי; יחסים ולא הדגשה; קשב אינו תודעה; מילים שונות ברגעים שונים; הקשר ולא אימות עובדות | 1,749 | 1 (`AttentionSentenceLab`) + 1 guess (`AttentionGuess`) | 5 | 12 דקות |
| 7 | `/behind-the-scenes-ai/chapter-7` | Context Window: מה המודל באמת רואה עכשיו | Context Window: What the Model Really Sees Now | NONE | חלון הקשר; פרטים נופלים מהחלון; חלון אינו זיכרון; פרומפט עצמאי; מה עושים כשנשכח | 1,540 | 1 (`ContextWindowLab`) + 1 guess | 5 | 10 דקות |
| 8 | `/behind-the-scenes-ai/chapter-8` | Logits & Softmax: מציונים להסתברויות | Logits & Softmax: From Scores to Probabilities | NONE | הערכה מול שליפה; מהציון להסתברות; סבירות אינה אמת; הקשר מזיז סבירות; אימות דורש מקור | 1,520 | 1 (`LogitsSoftmaxLab`) + 1 guess | 5 | 9 דקות |
| 9 | `/behind-the-scenes-ai/chapter-9` | Decoding: בחירת הטוקן הבא | Decoding: Choosing the Next Token | NONE | מהי בחירת טוקן; אחרי ההסתברויות; שמרני מול פתוח; למה נבחרת אפשרות נמוכה; בחירה אינה אמת | 1,560 | 1 (`DecodingLab`) + 1 guess | 5 | 10 דקות |
| 10 | `/behind-the-scenes-ai/chapter-10` | Generation Loop: איך תשובה נבנית עד הסוף | Generation Loop: How an Answer Is Built to the End | NONE | בנייה צעד אחר צעד; פלט הופך לקלט; צעד מוקדם מכוון; ייצור אינו אימות; מבנה מייצב פלט | 2,087 | 1 (`GenerationLoopLab`) + 1 guess | 5 | 12 דקות |
| 11 | `/behind-the-scenes-ai/chapter-11` | Hallucinations: למה תשובה בטוחה יכולה להיות שגויה | Hallucinations: Why a Confident Answer Can Be Wrong | NONE | שטף אינו אמת; ביטחון אינו ראיה; מידע חסר גורם להשלמה; מקור מפחית סיכון; תשובה זהירה עדיפה מניחוש | 1,823 | 1 (`HallucinationLab`) + 1 guess | 5 | 11 דקות |
| 12 | `/behind-the-scenes-ai/chapter-12` | RAG & Grounding: איך מחברים AI למקורות | RAG & Grounding: How AI Connects to Sources | NONE | תשובה מעוגנת במקור; אחזור לפני ניסוח; מקור מפחית ניחוש; מקור אינו קסם; חסר מידע צריך להיאמר | 2,125 | 1 (`GroundingLab`) + 1 guess | 5 | 13 דקות |
| 13 | `/behind-the-scenes-ai/chapter-13` | Self-Check: בדיקה עצמית בזמן תשובה | Self-Check: Checking the Answer While It Is Being Built | NONE | בדיקה עצמית היא שלב; בדיקה גם אחרי מקור; טענה לא נתמכת; בדיקה אינה אמת; בקשת בדיקה גלויה | 2,103 | 1 (`SelfCheckLab`) + 1 guess | 5 | 13 דקות |
| 14 | `/behind-the-scenes-ai/chapter-14` | Learning from Mistakes: איך מודל משתפר מטעות | Learning from Mistakes: How a Model Improves from a Mistake | NONE | טעות היא אות; הקשר אינו אימון; שיפור מערכת; בדיקה לפני הכרזה על שיפור; תיקון שימושי | 1,845 | 1 (`MistakeLearningLab`) + 1 guess | 5 | 12 דקות |
| 15 | `/behind-the-scenes-ai/chapter-15` | Evaluation & Generalization: שינן או הבין | Evaluation & Generalization: Memorized or Understood? | NONE | הכללה למקרה חדש; דוגמה אחת אינה מבחן; סט בדיקה מגוון; כישלון חושף חולשה; בדיקה לפני אמון | 2,424 | 2 (`EvaluationLab`, `ScoreBreakdownPanel`) + 1 guess | 5 | 12 דקות |
| 16 | `/behind-the-scenes-ai/chapter-16` | Does AI Learn From Me: האם AI לומד ממני | Does AI Learn From Me? | NONE | הקשר נוכחי; שיחה חדשה אינה זיכרון; זיכרון אינו אימון; אימון דורש תהליך; ספקו כלל או מקור | 1,670 | 1 (`DoesAiLearnLab`) + 1 guess | 5 | 12 דקות |
| 17 | `/behind-the-scenes-ai/chapter-17` | Chat to Agent: כששאלה הופכת למשימה | Chat to Agent: When a Question Becomes a Task | NONE | צ'אט עונה, Agent מתקדם; כלי מרחיב יכולת; מידע חסר עוצר פעולה; אישור לפני פעולה; משימה בטוחה ל-Agent | 1,841 | 1 (`ChatToAgentLab`) + 1 guess | 5 | 11 דקות |
| 18 | `/behind-the-scenes-ai/chapter-18` | Guardrails: סיכון, הרשאות, אישור ועצירה | Guardrails: Risk, Permissions, Approval, and Stopping | NONE | יכולת אינה הרשאה; סיכון קובע פעולה; חסר מידע עוצר; אישור לפעולה רגישה; פעולה חסומה | 2,036 | 1 (`GuardrailsLab`) + 1 guess | 5 | 11 דקות |
| 19 | `/behind-the-scenes-ai/chapter-19` | Full Trace: פרומפט אחד, כל התחנות | Full Trace: One Prompt, All Stations | NONE | הרכבת הקשר; יצירת טוקן; עיגון ובדיקה; Agent ובקרה; שיפור מאוחר | 2,454 | 1 (`FullTraceLab`) + 1 guess | 5 | 12 דקות |
| - | `/behind-the-scenes-ai/final-exam` | מבחן סיום הלומדה | Course final exam | NONE | see `04-assessment.md` | 109 (page chrome only, `finalExam` namespace; the 18 question texts live in `quizData.ts` and are counted with the quiz totals) | 1 (`MasteryDashboard`) | 18 | none stated |

### Stated learning objectives

`NONE` in every row. No namespace in `i18n/dictionary.ts` (`BehindAiDict`, lines 268-295) exposes
an objectives/goals key. Verified by listing every top-level key of every chapter namespace; the
key sets are: `contentLocale, hero, mentorRespond, primer, see, guess, insight, analogy,
misconception, lock, practical, lab, quiz` and per-chapter variants. The nearest equivalents that
exist are:

- `<chapter>.practical` - a "practical insight" block present in chapters 3-19 (17 chapters).
- `<chapter>.lock` - an "understanding lock" true/false pair, present in chapters 2-19.
- `chapter1.insightIdea` and `chapter2.takeaway` - the chapter-1/2 equivalents of `practical`.
- Chapter 0 (introduction) has neither `practical` nor `lock`.

## Totals

| Metric | Value | Source |
|---|---|---|
| Chapters in the product's chapter list | 20 (intro + 19) | `lib/courseData.ts:539-757` |
| Routes that resolve under the module | 21 (20 above + `/final-exam`) | `.next/app-path-routes-manifest.json`, build log `docs/audit/bts/raw/build.txt` |
| Total instructional words (he, page text, excludes quiz text) | **34,340** | `docs/audit/bts/raw/dictwords-he.tsv` |
| Total quiz-text words (he, chapter quizzes only) | 7,827 | same file, `quiz_words` column |
| Total instructional + quiz words (he) | 42,167 | sum |
| Total dictionary string leaves for the module (he) | 5,336 | `docs/audit/bts/raw/i18n-keys.tsv` |
| Total labs (distinct interactive components rendered by module routes) | 22 distinct components; 26 lab instances across chapters | `02-interactions.md` |
| Total chapter-quiz questions | 95 (19 chapters x 5) | `docs/audit/bts/raw/quiz-coverage.tsv` |
| Final-exam questions | 18 | `app/behind-the-scenes-ai/quizData.ts:1772-2029` |
| Total questions in the module | 113 | sum |
| Product-stated total reading time | 218 minutes | sum of `readTime` in `lib/courseData.ts` for the 20 chapters |

## Chapter order and where it is defined

The order the product presents is the array order of
`courses["behind-the-scenes-ai"].chapters` in **`lib/courseData.ts:539-757`**:

```
introduction (id 0) -> chapter-1 -> chapter-2 -> ... -> chapter-19
```

Consumers of that order:
- `components/CourseSidebar.tsx` renders the list.
- `components/ChapterLayout.tsx:244,375,448` derives the current/prev/next chapter and the
  footer navigation from the same array.
- The final exam is not in the array. Its only in-product link from a chapter is
  `app/behind-the-scenes-ai/chapter-19/page.tsx:471` (`href="/behind-the-scenes-ai/final-exam"`),
  plus the sidebar/progress CTA in `app/behind-the-scenes-ai/MasteryDashboard.tsx:139-147`.

A second, independent ordering exists for quiz wiring: `CHAPTER_QUIZZES` in
`app/behind-the-scenes-ai/quizData.ts:2073-2088` maps chapter number -> quiz array. Its keys
match 1..19.

## Prerequisite / dependency declarations

**NONE.** No file declares prerequisites, unlocks, or dependency edges between chapters. Verified:

- `ChapterData` (`lib/courseData.ts:11-25`) has no prerequisite field.
- `components/ChapterLayout.tsx:411-470` renders prev/next links unconditionally; there is no
  condition on quiz state.
- `components/CourseSidebar.tsx` links every chapter unconditionally.
- All 21 routes are statically prerendered (`○ (Static)` in `docs/audit/bts/raw/build.txt`) and
  reachable by direct URL.

The only backward-pointing links that depend on learner state are the **remedial review links**
generated after a failed quiz (`reviewLinksForConcepts`, `app/behind-the-scenes-ai/quizData.ts:2151-2162`),
which map a weak concept to the chapter that teaches it. Those are suggestions, not gates.

## Stubs, placeholders, unresolved routes

- No chapter page is a stub. Every one of the 21 routes prerendered successfully
  (`✓ Generating static pages using 15 workers (68/68)`, `docs/audit/bts/raw/build.txt:16`).
  Page sizes range 348-498 lines (`app/behind-the-scenes-ai/*/page.tsx`).
- **`app/behind-the-scenes-ai/_parked/`** contains 8 further page directories
  (`agent-control`, `chat-to-agent`, `confidence`, `does-ai-learn-from-me`, `full-agent-trace`,
  `prompt-coach-finale`, `tool-call`, `tool-selection`). The `_` prefix makes them Next.js
  private folders, so they produce **no routes**; none appear in
  `.next/app-path-routes-manifest.json`. `_parked/full-agent-trace/BehindScenesLab.tsx:102`
  fetches `/api/scenario`, an endpoint that does not exist in `app/api/`.
- **Dead quiz data in the live module:** `quizData.ts` defines 23 question arrays but
  `CHAPTER_QUIZZES` registers only 19. `chapter4Quiz` (line 274), `chapter9Quiz` (line 892) and
  `chapter10Quiz` (line 967) - 15 questions - are exported and unused.
- **Dead wrapper component:** `app/behind-the-scenes-ai/ChapterQuiz.tsx` is imported only by
  `_parked` pages; all 19 live chapters call `AssessmentEngine` directly.
- **Dead dictionary keys observed** (present in all six locales, referenced by no live component):
  `doesAiLearn.finalExamCta`; `wordLabContent` `typing.placeholder`, `typing.aria`,
  `unrecognizedHint` (`app/behind-the-scenes-ai/chapter-4/wordLabContent.ts:686-694`).
- **Dead API routes:** `app/api/chat-reply/route.ts` (streams a live Claude reply) and
  `app/api/count-tokens/route.ts` are built as dynamic routes but no client file references
  either path. Grep for `chat-reply` / `count-tokens` outside `app/api/` returns only a comment
  in `lib/rateLimit.ts:8`.
- **Dead components:** 33 of the 85 files in `components/ai-internals/` are not reachable from
  any module route. Full list in `docs/audit/bts/raw/reachable-files.txt` (complement).
  They include `PipelineCascadeLab.tsx` (1,164 lines), `ConfidenceGateLab.tsx` (745),
  `TaskUnderstandingLab.tsx` (706), `ObservationLoopLab.tsx` (635), `ToolSelectionLab.tsx` (622),
  `ControlLayerLab.tsx` (535). Also unreachable: `app/behind-the-scenes-ai/chapter-6/scoringEngine.ts`
  and `chapter-6/pipelineData.ts`.
