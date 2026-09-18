# 07 - Learner effort facts

## 1. Instructional words and derived reading time

**Assumption stated explicitly: 200 words per minute.** Reading time = `words / 200`, rounded to
one decimal. This is a conversion applied by this audit, not a figure the product publishes.

Word counts are the Hebrew source, measured by walking the runtime dictionary
(`docs/audit/bts/raw/dictwords-he.tsv`). "Page words" excludes quiz text; "quiz words" is the
5-question chapter quiz. Both columns include UI labels that live in the same dictionary
namespaces, so both over-count relative to prose alone.

| Ch | page words | quiz words | total words | reading time @200 wpm | product-stated time |
|---|---|---|---|---|---|
| 0 | 1,787 | 0 | 1,787 | 8.9 min | 6 min |
| 1 | 1,513 | 274 | 1,787 | 8.9 min | 8 min |
| 2 | 1,061 | 459 | 1,520 | 7.6 min | 8 min |
| 3 | 738 | 376 | 1,114 | 5.6 min | 11 min |
| 4 | 1,154 | 539 | 1,693 | 8.5 min | 13 min |
| 5 | 1,310 | 411 | 1,721 | 8.6 min | 12 min |
| 6 | 1,749 | 485 | 2,234 | 11.2 min | 12 min |
| 7 | 1,540 | 403 | 1,943 | 9.7 min | 10 min |
| 8 | 1,520 | 372 | 1,892 | 9.5 min | 9 min |
| 9 | 1,560 | 394 | 1,954 | 9.8 min | 10 min |
| 10 | 2,087 | 481 | 2,568 | 12.8 min | 12 min |
| 11 | 1,823 | 458 | 2,281 | 11.4 min | 11 min |
| 12 | 2,125 | 394 | 2,519 | 12.6 min | 13 min |
| 13 | 2,103 | 386 | 2,489 | 12.4 min | 13 min |
| 14 | 1,845 | 386 | 2,231 | 11.2 min | 12 min |
| 15 | 2,424 | 419 | 2,843 | 14.2 min | 12 min |
| 16 | 1,670 | 452 | 2,122 | 10.6 min | 12 min |
| 17 | 1,841 | 409 | 2,250 | 11.3 min | 11 min |
| 18 | 2,036 | 402 | 2,438 | 12.2 min | 11 min |
| 19 | 2,454 | 327 | 2,781 | 13.9 min | 12 min |
| **Module total** | **34,340** | **7,827** | **42,167** | **210.8 min (3 h 31 min)** | **218 min (3 h 38 min)** |

Plus the final exam, which is not in the table because it is not a chapter: **109** chrome words
(the `finalExam` namespace) + **1,388** words of question text, options and explanations
(measured by loading `finalExamQuestions` from `app/behind-the-scenes-ai/quizData.ts` at runtime
and joining `question + options + explanation` for all 18). Total **1,497 words = 7.5 min** at
200 wpm. In the five non-Hebrew locales, 16 of those 18 questions render in Hebrew (see
`04-assessment.md` section 7).

Module grand total including the final exam: **43,664 words = 218.3 min (3 h 38 min)** at 200 wpm,
which happens to land within a minute of the product's own summed `readTime` figure of 218 minutes.

Chapters 3 and 4 read low because a share of their lab text lives outside the dictionary
(`app/behind-the-scenes-ai/chapter-3/labContent.tsx` + `tokenizer.ts` + `tokenRoles.ts` +
`hebrewSplitRules.ts`; `chapter-4/wordLabContent.ts`). A second, file-literal measurement that
includes those files gives 1,027 (ch 3) and 1,922 (ch 4) content words
(`docs/audit/bts/raw/words-he.tsv`), which would raise the module total by roughly 1,000 words.

Same conversion for the other locales (page + quiz words, whole module):

| Locale | total words | reading time @200 wpm |
|---|---|---|
| he | 42,167 | 210.8 min |
| en | 57,483 | 287.4 min |
| es | 58,159 | 290.8 min |
| ru | 46,491 | 232.5 min |
| ar | 43,314 | 216.6 min |
| ja | 5,974 words / 140,932 non-space chars | not applicable - Japanese has no whitespace word boundaries, so a wpm conversion is meaningless. **UNVERIFIED: Japanese reading time.** |

## 2. Required learner actions per chapter

| Ch | Guess (1 choice) | Lab interactions available | Quiz answers | Total minimum clicks to reach the end of the quiz |
|---|---|---|---|---|
| 0 | 1 (`HypothesisGuess`) | roadmap stations (14), engine reveal, agent loop stages | 0 | 1 |
| 1 | 0 | send/suggestion (>=1), mode toggle, 14 stations | 5 | 5 |
| 2 | 1 | 5 phrasing options | 5 | 6 |
| 3 | 1 | text entry or example chips, mode toggle, token clicks | 5 | 6 |
| 4 | 1 | 3 scenarios, play, token/id clicks | 5 | 6 |
| 5 | 1 | 12 map points, compare, experiment toggle | 5 | 6 |
| 6 | 1 | sentence variants + focus states (2 independent selectors) | 5 | 6 |
| 7 | 1 | 3 window states | 5 | 6 |
| 8 | 1 | context selector + per-score +/- buttons | 5 | 6 |
| 9 | 1 | 3 styles + "try another choice" | 5 | 6 |
| 10 | 1 | prompt variant, mode toggle, per-step fragment picks | 5 | 6 |
| 11 | 1 | 4 answer styles | 5 | 6 |
| 12 | 1 | 4 source modes | 5 | 6 |
| 13 | 1 | 3 drafts | 5 | 6 |
| 14 | 1 | 4 levels | 5 | 6 |
| 15 | 1 | 5 test cases + score-breakdown expansions | 5 | 6 |
| 16 | 1 | 4 layers | 5 | 6 |
| 17 | 1 | 4 modes | 5 | 6 |
| 18 | 1 | 5 actions | 5 | 6 |
| 19 | 1 | 14 stages + tool-error toggle + approval toggle | 5 | 6 |

**Which actions gate progression, in code:**

| Action | Gates what | Evidence |
|---|---|---|
| Answering the current quiz question | Advancing to the next question **within an attempt** | `components/content/AssessmentEngine.tsx:892` - the Next button is `disabled={!isAnswered && !isReviewMode}` |
| Answering all questions | Seeing the result card and having the attempt recorded | `AssessmentEngine.tsx:300-311` - `setIsSubmitted(true)` then `onComplete?.(result)` |
| Choosing a guess card | Revealing that chapter's guess verdict | `OpeningGuess.tsx:108-114` - `revealed` starts `false` and the reveal control only exists once a card is chosen (`preciseCard ? {...} : undefined`, line 221) |

**Which actions are optional (gate nothing):**

- **Every lab interaction.** No lab writes to any store, and no lab result is read by navigation,
  by the quiz, or by the progress dashboard. Labs are entirely self-contained UI state.
- **The guess.** Skipping it does not block the lab, the quiz, or navigation.
- **The quiz itself.** Chapter navigation is unconditional
  (`components/ChapterLayout.tsx:411-470` renders prev/next `<Link>` with no state check), the
  sidebar links every chapter, and all 21 routes are statically prerendered and directly
  addressable.
- **Passing a quiz.** A failing attempt is recorded and the learner may continue.
- **Read-aloud.** Optional throughout.

**Net: nothing in the module gates access to anything else.** The only in-attempt gate is that
you must answer question *n* before the engine lets you move to question *n+1*.

## 3. What the product itself claims about duration or effort

Every duration claim in the product, quoted:

1. **Per-chapter reading time**, from `lib/courseData.ts`, stored as Hebrew strings and
   re-rendered per locale by `formatReadTime` (`i18n/format.ts:41-54`). The 20 stated values:

   > `6 דקות` (intro), `8 דקות`, `8 דקות`, `11 דקות`, `13 דקות`, `12 דקות`, `12 דקות`, `10 דקות`,
   > `9 דקות`, `10 דקות`, `12 דקות`, `11 דקות`, `13 דקות`, `13 דקות`, `12 דקות`, `12 דקות`,
   > `12 דקות`, `11 דקות`, `11 דקות`, `12 דקות`

   Sum: **218 minutes**. The product never displays this sum; it shows one chapter's figure at a
   time, in the chapter header (`components/ChapterLayout.tsx:375`) and on the next-chapter card
   (`ChapterLayout.tsx:448`), under the label `זמן קריאה` ("reading time",
   `chrome.header.readTime`).

2. **Quiz recommended time**, computed, not authored
   (`components/content/AssessmentEngine.tsx:400-401`):

   ```tsx
   <div className="text-slate-500 text-[10px] font-bold uppercase">{a.recommendedTimeLabel}</div>
   <div className="text-white font-black text-lg leading-tight">{a.recommendedTime(Math.ceil(questions.length * 0.5))}</div>
   ```

   with `recommendedTime: (min: number) => \`${min} דק'\`` (`i18n/locales/he/chrome.ts:64`) under
   the label `זמן מומלץ` ("recommended time"). That is **3 min** for a 5-question chapter quiz and
   **9 min** for the 18-question final exam.

3. **A course-level claim of scale, but not of time.** The catalogue card on `/` shows the chapter
   count only (`app/page.tsx:199`: `formatChapterCount(locale, originalCourseData.chapters.length - 1)`),
   which renders as `19 פרקים` / `19 chapters`. The `-1` excludes the introduction.

4. **A claim about where progress lives**, in the final-exam page subtitle
   (`finalExam.pageSubtitle`) and the progress panel (`chrome.progress.emptyBody`):

   > `... אפשר לחזור אליו בכל עת, וההתקדמות נשמרת במכשיר שלכם.`
   > ("... you can return to it at any time, and progress is saved on your device.")

**There is no marketing copy anywhere in the repo** - no landing page beyond the catalogue card,
no pricing page, no "X hours of content" claim, no certificate, no completion badge.

## 4. What "completion" means in code

There is **no chapter-completion concept**. Nothing marks a chapter read, visited, or done.
Scrolling, finishing a lab, and reaching the end of a page are not recorded anywhere. The only
persisted signal is a finished quiz attempt.

### Chapter level

A chapter counts as "completed" **iff a quiz attempt for it has been finished** - passed or not.
`app/behind-the-scenes-ai/masteryProgress.ts:136-142`:

```ts
const records = getAllRecords();
const chapterRecords = records.filter(r => r.chapterId !== null);
const final = records.find(r => r.quizId === FINAL_EXAM_QUIZ_ID);

const completedChapters = chapterRecords.length;
const passedChapters = chapterRecords.filter(r => r.passed).length;
```

The record is written once the last question is answered
(`AssessmentEngine.tsx:300-311` -> `onComplete` -> `chapterOnComplete(n)` in
`quizData.ts:2165-2168` -> `recordResult` in `masteryProgress.ts:76-99`). A learner who opens a
quiz and answers all five questions wrong is counted in `completedChapters` and not in
`passedChapters`.

- `passed === true` requires `scorePercent >= 70` (engine default), i.e. **4 of 5 correct**.
- `completedChapters` is compared against the constant `TOTAL_CHAPTER_QUIZZES = 19`
  (`masteryProgress.ts:14`), so the introduction is excluded from the denominator.

### Module level

There is **no "module complete" state, no certificate, and no completion event.** The closest
thing is the final-exam status enum (`masteryProgress.ts:145-146`):

```ts
let finalExam: FinalExamStatus = "not-taken";
if (final) finalExam = final.passed ? "passed" : "needs-review";
```

with `FinalExamStatus = "not-taken" | "passed" | "needs-review"` (line 116) and
`passed === scorePercent >= 75`, i.e. **14 of 18 correct**.

Passing the final exam:
- flips the dashboard chip to `passed`,
- triggers confetti once, if reduced motion is off (`AssessmentEngine.tsx:307`),
- shows a "next" button pointing at `/` (`final-exam/page.tsx:118`: `nextHref="/"`).

Nothing else changes. No badge is stored, no chapter is unlocked (none was locked), and no
record is created beyond the `behind-ai-final` `QuizRecord`.

### The chapter-19 end-of-course screen

`components/ChapterLayout.tsx:463-469` renders a "finished" card in place of the next-chapter link
when there is no next chapter and `hasUpcomingChapters` is not set. The `behind-the-scenes-ai`
course deliberately omits that flag (`lib/courseData.ts:532-534`, an explicit comment: `"לכן אין דגל hasUpcomingChapters"`), so chapter 19 shows
`t.chrome.nav.finishedTitle` / `finishedSub`. This is a **layout branch driven by the chapter
list, not by learner progress** - it appears for anyone who opens chapter 19, having done nothing.

### Summary of the whole progress model

| Question | Answer in code |
|---|---|
| Is a chapter ever marked read? | No |
| What marks a chapter complete? | Finishing one quiz attempt (pass or fail) |
| What marks a chapter passed? | >= 70% on any attempt (`passed` on the latest attempt; `bestScorePercent` is kept separately and never lowered) |
| What marks the module complete? | Nothing. The final exam has a `passed` flag; there is no module-level completion record |
| Where does it live? | One `localStorage` key, `behindAiMasteryProgress`, on one browser profile |
| Can it be exported, synced or recovered? | No |
