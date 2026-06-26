# CH8 Migration Notes - from "Similarity, Scores & Probabilities" to "Attention"

Date: 2026-06-25
Scope: Chapter 8 of the "מאחורי הקלעים של AI" course only.

## Why this file exists

Chapter 8 used to teach the calculation chain (Cosine Similarity → Raw Scores → Softmax → Probabilities → Decision), plus an Agent Mode demo. The course is moving chapter 8 to its real role in the planned 22-chapter structure: **Attention, מי חשוב עכשיו**.

The old content is good and should not be lost. It is the natural source material for future chapters that do not exist yet:

- **Chapter 10 - Logits** (raw scores, similarity ranking)
- **Chapter 11 - Softmax** (scores → probabilities)
- **Chapter 12 - Decoding** (choosing the next token / the "decision" step)
- **Chapters 19-20 - Agent** (only the Agent Mode material, if still relevant)

This file preserves the useful thinking and copy so nothing stays live-but-obsolete inside chapter 8.

---

## Files: what stays, what moves, what was removed

### Kept on disk - shared infrastructure (DO NOT DELETE)

- `app/behind-the-scenes-ai/chapter-8/pipelineData.ts`
- `app/behind-the-scenes-ai/chapter-8/scoringEngine.ts`

These are imported by **chapter-9** (`gateData.ts`), **chapter-14** (`traces.ts`), and `components/ai-internals/ConfidenceGateLab.tsx`
(`analyzeSentence`, `analyzeAgent`, `softmax`, `confidenceFromMargin`, `DIMS`, `DIM_INFO`, `ConfidenceLevel`, etc.).
They live under the chapter-8 folder for historical reasons but serve other chapters. When chapters 10/11 are built, they are the natural new home for this engine.

### Kept on disk - tracked future-use component (currently NOT imported anywhere)

- `components/ai-internals/PipelineCascadeLab.tsx`

This is the full cascade lab (Meaning Vector → Similarity Ranking → Raw Scores → Softmax → Probabilities → Decision, with a depth layer and Agent Mode). After this migration it is no longer imported by chapter 8. It is intentionally preserved as the ready-made lab for:
- **Chapter 10 - Logits** (the Similarity Ranking → Raw Scores portion)
- **Chapter 11 - Softmax** (the Softmax → Probabilities portion, plus the step-by-step Softmax machine in its depth layer)
- **Chapter 12 - Decoding** (the Decision portion)
- **Chapters 19-20 - Agent** (its Agent Mode tab)

It is referenced here so it is tracked and not orphaned. Do not delete without first porting it into the Logits/Softmax chapters.

### Removed (superseded, deleted to avoid dead/duplicate content)

- `components/ai-internals/AttentionContextDemo.tsx`

The small focus-word Attention demo. Its idea (context updates a word's meaning) is fully absorbed and expanded by the new
`components/ai-internals/AttentionMomentLab.tsx`, which is moment-based instead of focus-word-based. Removed so the course does not carry two Attention demos.

### Rewritten

- `app/behind-the-scenes-ai/chapter-8/page.tsx` - now the Attention discovery experience.
- `app/behind-the-scenes-ai/quizData.ts` - `chapter8Quiz` replaced with the Attention quiz. `CHAPTER_LABELS[8]` updated. A direct-dependency fix was added (see below).
- `lib/courseData.ts` - chapter 8 metadata (label/title/description) updated to Attention.

### Direct-dependency fix in quizData.ts

The final exam keeps a question (id 6) with `concept: "דמיון מול הסתברות"`. The concept→chapter map is auto-built from chapter quizzes, so when chapter 8 stopped teaching that concept, the review link for that final-exam question would have broken. Fixed by adding an explicit entry to `FINAL_CONCEPT_TO_CHAPTER`: `"דמיון מול הסתברות": 7` (chapter 7 teaches Cosine Similarity). Revisit this when chapter 11 (Softmax) exists.

### Known temporary curriculum gap

No live chapter currently teaches Similarity / Raw Scores / Softmax / Probabilities after this migration. This is expected and accepted: that content is preserved below and will return when chapters 10-12 are built. The engine files and `PipelineCascadeLab` above are kept precisely so rebuilding those chapters is cheap.

---

## Archived copy from the old chapter-8 page

### Old hero  →  future Chapter 11 (Softmax) framing

- Badge: `Behind the Scenes · 08`
- Title: "האחוזים אינם קסם. הם השלב האחרון בשרשרת"
- Body: "בפרק הזה נראה איך משפט אחד הופך בהדרגה להחלטה. המנוע לא קופץ מהטקסט לתשובה, אלא עובר שרשרת שלבים: וקטור משמעות, דמיון, ציונים גולמיים, Softmax, ואז הסתברויות. המטרה היא להבין שדמיון אינו הסתברות וציון גולמי אינו אחוז. רק בסוף השרשרת מתקבלת התפלגות שאפשר להחליט לפיה."

### Old chain strip / cascade layers  →  Chapters 10/11/12

Order: וקטור משמעות (Meaning Vector) → דמיון (Similarity) → ציונים גולמיים (Raw Scores) → Softmax → הסתברויות (Probabilities) → החלטה (Decision).

### Old "reading path" (6 steps)  →  Chapters 10/11

1. וקטור משמעות (Meaning Vector) - הפרופיל המספרי של המשפט, נקודת הפתיחה
2. דמיון (Similarity) - בודק למה המשפט הכי קרוב   → ch10 Logits
3. ציון גולמי (Score) - נותן לכל אפשרות ציון אחד   → ch10 Logits
4. Softmax - הופך ציונים להסתברויות שמסתכמות ל-100%   → ch11 Softmax
5. הסתברויות (Probabilities) - ההתפלגות הסופית שעליה מחליטים   → ch11 Softmax
6. החלטה (Decision) - בוחר לפי ההתפלגות   → ch12 Decoding

Intro paragraph (→ ch10/ch11): "עד עכשיו ראינו איך משפט הופך לפרופיל מספרי. בפרק הזה נראה מה המנוע עושה עם הפרופיל. הוא לא קופץ ממנו ישר לתשובה, אלא עובר שרשרת ממוספרת... כל מספר שתראו הוא תוצאה של חישוב, לא ניחוש."

### Old "before quiz" points  →  split

1. "ההקשר משנה משמעות" (Attention) - reworked and kept in the new Attention chapter.
2. "דמיון אינו הסתברות" - הדמיון (Cosine Similarity) מודד קרבת כיוון בין שני וקטורים... הוא רק השלב הראשון בשרשרת.   → ch10/ch11
3. "ציון גולמי אינו אחוז" - הציונים הגולמיים לא מסתכמים ל-100%. רק Softmax הופך אותם להסתברויות.   → ch11 Softmax
4. "שרשרת, לא קפיצה" - המנוע עובר דמיון, ציון, הסתברות, החלטה. שינוי מילה אחת שולח גל שינוי במורד כל השכבות.   → ch10/ch11

### Old insight box (→ ch11 Softmax)

"המערכת לא קופצת ממשפט לתשובה. היא הופכת משמעות לדמיון, דמיון לציון, ציון להסתברות, והסתברות להחלטה. האחוזים הם השלב האחרון בשרשרת חישובים, לא קסם."
Plus the integrity note: "דירוג הכוונות הוא ההפשטה הלימודית שלנו. מודל אמיתי מדרג בכל צעד את ה-token הבא, לא כוונות שלמות, אבל העיקרון זהה: השוואה, ציון, Softmax, החלטה."

### Old Agent Mode demo  →  Chapters 19-20 (Agent), if relevant

The `analyzeAgent` path in `pipelineData.ts` (steps: לבקש ברקוד / להשתמש בכלי מעקב / לתת הסבר כללי / לעצור לאישור; gated by `hasBarcode`) shows the same softmax machine ranking actions by state. Prompt: "בדוק למה החבילה לא הגיעה". This belongs with the Agent chapters, not with Attention.

---

## Archived quiz - old chapter-8 questions (5)

Tagged target chapter for each. Preserved verbatim for reuse.

**Q1 (→ ch10/ch11) concept: "שרשרת ולא קפיצה"**
"לפי הפרק, איך המנוע מגיע מפרופיל המשמעות אל ההחלטה?"
Correct: "הוא עובר שרשרת של שלבים: דמיון, ציון, הסתברות, החלטה"
Explanation: "המערכת לא קופצת ממשפט לתשובה. היא עוברת שרשרת: דמיון, ציון גולמי, הסתברות (אחרי Softmax), ורק אז החלטה. שום מספר לא מופיע משום מקום, כל אחד הוא תוצאה של השלב שלפניו."

**Q2 (→ ch11 Softmax) concept: "Softmax"**
"מה תפקיד ה-Softmax בשרשרת?"
Correct: "הופך ציונים גולמיים להסתברויות שמסתכמות ל-100%"
Explanation: "Softmax הוא השלב שהופך את הציונים הגולמיים להסתברויות שמסתכמות ל-100%. לפניו הציונים לא מסתכמים ל-100%, ורק אחריו מתקבלות הסתברויות אמיתיות שאפשר לבחור לפיהן."

**Q3 (→ ch10 Logits) concept: "ציונים גולמיים"**
"מה נכון לגבי הציונים הגולמיים (Raw Scores) לפני Softmax?"
Correct: "הם ציון אחד לכל אפשרות, ולא מסתכמים ל-100%"
Explanation: "הציונים הגולמיים נותנים ציון אחד לכל אפשרות, אבל הם לא מסתכמים ל-100% ואינם הסתברויות. רק Softmax הופך אותם להסתברויות אמיתיות. לכן אסור לקרוא ציון גולמי כאילו הוא אחוז."

**Q4 (→ ch10/ch11) concept: "גל שינוי בשרשרת"**
"מה קרה כששינו מילה אחת במשפט במעבדת המפל?"
Correct: "גל שינוי התפשט במורד כל השכבות והפך את ההחלטה"
Explanation: "שינוי מילה אחת שלח גל שינוי במורד כל השרשרת, מהדמיון ועד ההסתברויות, והפך את המוביל. זה מראה שהשלבים מחוברים: כל שכבה מזינה את הבאה אחריה."

**Q5 (→ ch10/ch11) concept: "דמיון מול הסתברות"**
"מישהו אומר: 'הדמיון (Cosine Similarity) הוא בעצם ההסתברות שהמנוע יבחר באפשרות'. מה הטעות?"
Correct: "דמיון הוא קרבת כיוון, לא הסתברות. ההסתברות מתקבלת רק בסוף השרשרת אחרי Softmax"
Explanation: "דמיון (Cosine Similarity) הוא קרבת כיוון, לא הסתברות. הוא רק השלב הראשון בשרשרת. ההסתברות מתקבלת רק בסוף, אחרי שהציונים הגולמיים עוברים Softmax. לערבב ביניהם זה לדלג על מחצית מהשרשרת."
