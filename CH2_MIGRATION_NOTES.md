# CH2 Migration Notes - from "ההחלטה הראשונה" (intent routing) to "מה באמת נכנס למודל"

Date: 2026-06-26
Scope: Chapter 2 of the "מאחורי הקלעים של AI" course only.

## Why this file exists

The live Chapter 2 taught **intent routing**: how the same topic, phrased three ways, gets routed to different paths (answer / ask / prepare-tool / stop for approval), based on intent + risk + missing info. In the 22-chapter plan, Chapter 2 becomes **"מה באמת נכנס למודל"** - the discovery that the model starts from the actual written input (text, wording, order, punctuation, ambiguity, context), not from raw intention.

The routing content is good and is preserved here. It is conceptual source material for future chapters, not for Chapter 2:

- **Chapters 19-20 - Agent** (the route-by-intent decision, risk, approval, stop) - primary home.
- **Chapter 10 - מ-Prompt למשימה** (question vs task, missing info before acting) - secondary, where relevant.

This file preserves the copy, the quiz, and the routing-lab behavior so nothing is lost, and so the obsolete Chapter-2-only code can be deleted rather than left as dead future-use code.

---

## Files: disposition decisions

### Rewritten
- `app/behind-the-scenes-ai/chapter-2/page.tsx` - now the "what enters the model" discovery experience.
- `app/behind-the-scenes-ai/quizData.ts` - `chapter2Quiz` replaced; `CHAPTER_LABELS[2]` updated to "מה באמת נכנס למודל".
- `lib/courseData.ts` - chapter 2 metadata updated.

### Deleted (Chapter-2-only, unused after the rewrite)
Verified before deletion that nothing outside Chapter 2 imports these:
- `app/behind-the-scenes-ai/chapter-2/routingExamples.ts`
- `components/ai-internals/RequestRoutingLab.tsx`
- `components/ai-internals/RequestExampleSelector.tsx`
- `RoutingExample` and `RequestType` types in `components/ai-internals/types.ts` (removed only if unused after the above are gone).

Per the cleanup policy, these are not kept as dead future-use code. Their behavior and ideas are documented below so the Agent/task chapters can rebuild them when needed.

### New (Chapter 2 rewrite)
- `components/ai-internals/DiscoveryGuess.tsx` - reusable, content-driven 4-card quick-guess (generalized from the Chapter 8 pattern). Used only by Chapter 2 for now; Chapter 8 is frozen and not retrofitted.
- `components/ai-internals/InputComparisonLab.tsx` - the input-comparison lab.
- `app/behind-the-scenes-ai/chapter-2/inputVariations.ts` - lab data.

### Not touched
- Chapter 8 and all other chapters.
- Shared infra used elsewhere (`Mentor`, `StickyContextBar`, `AssessmentEngine`, `InsightBox`, `ChapterLayout`).

---

## Reusable routing-lab behavior (for future Agent/task chapters)

The old `RequestRoutingLab` was a declarative, no-engine demo. The learner picked one of three phrasings of the same package topic, and the lab showed: a type-score breakdown (general question / specific check / action request), the selected route, intent stage, risk level, missing info, tool need, approval requirement, a decision card, and per-signal "decision signals" (which word triggered which effect, with strength).

The three phrasings and their routes (the core teaching, worth rebuilding):
- "למה חבילות מתעכבות?" → **Answer** (general question, low risk, no missing info).
- "בדוק למה החבילה שלי מתעכבת." → **Ask for info** (specific, barcode missing) → then prepare tool.
- "שלח ללקוח הודעה שהחבילה מתעכבת." → **Stop for approval** (action toward a real customer, high risk).

Mental model shown: `כוונה + סיכון + מידע חסר ← מסלול` (intent + risk + missing info → route).

Reusable ideas: per-signal highlighting of which words drive the decision; the four-route model (answer / ask / tool / stop); the "system that only answers vs Agent that picks the next right step" framing.

---

## Archived copy from the old Chapter 2 page

### Old hero  →  Agent chapters (19-20)
- Badge: `Behind the Scenes · 02`
- Title: "אותו נושא, מסלולים שונים לגמרי"
- Body: "בפרק הזה נראה איך אותה בקשה, מנוסחת בכמה דרכים, מובילה את המנוע למסלולים שונים. הטעות הנפוצה היא לחשוב שהמנוע מגיב לנושא של המשפט. בפועל הוא מגיב לכוונה שמאחורי הניסוח, ומנתב כל בקשה למסלול אחר: לענות, לבקש מידע, להתכונן לכלי, או לעצור לאישור..."

### Old lab intro  →  Agent chapters
"כאן מתחיל ההבדל האמיתי בין צ׳אט רגיל לבין Agent. המנוע לא מסתכל רק על הנושא של המשפט, אלא על הכוונה שמסתתרת בניסוח. שינוי קטן בפרומט יכול להפוך שאלה פשוטה לבקשת בדיקה, ובקשת בדיקה לפעולה שדורשת אישור."

### Old mental-model formula  →  Agent chapters
`כוונה + סיכון + מידע חסר ← מסלול`
- שאלה כללית, סיכון נמוך, אין מידע חסר → לענות (Answer)
- בקשה ספציפית, חסר מידע (ברקוד) → לבקש מידע ואז להכין כלי (Ask for info → Prepare tool use)
- בקשת פעולה, סיכון גבוה, דרוש אישור → לעצור לאישור (Stop for approval)

### Old insight box  →  Agent chapters
"הפרומט לא רק מבקש תשובה. הוא מכוון את המנוע למסלול. אותו נושא יכול להוביל לתשובה, לבדיקה, להכנה לשימוש בכלי או לעצירה לאישור. ההבדל מתחיל בכוונה שהפרומט משדר. זה ההבדל בין מערכת שרק עונה לבין Agent שמנסה לבחור את הצעד הנכון הבא."

---

## Archived quiz - old Chapter 2 questions (5)

Tagged target: Agent chapters 19-20, and chapter 10 (מ-Prompt למשימה) where relevant. Preserved verbatim.

**Q1 (→ ch10 / ch19-20) concept: "ניתוב לפי כוונה"**
"שלושה ניסוחים שונים מדברים על אותה חבילה שמתעכבת, אבל המנוע מנתב כל אחד למסלול אחר. מה קובע את המסלול?"
Correct: "הכוונה שמסתתרת בניסוח, לא רק הנושא של המשפט"
Explanation: "הנושא יכול להיות זהה (חבילה שמתעכבת), אבל הכוונה שמשתמעת מהניסוח היא שמכריעה. 'איפה החבילה?' היא שאלה; 'בדוק חבילה 123' היא בקשת בדיקה; 'שלח ללקוח שהיא אבדה' היא פעולה. המנוע מנתב לפי הכוונה."

**Q2 (→ ch19-20) concept: "כוונה + סיכון + מידע חסר"**
"לפי המודל המנטלי של הפרק, אילו שלושה גורמים יחד קובעים לאיזה מסלול הבקשה נשלחת?"
Correct: "כוונה, סיכון ומידע חסר"
Explanation: "המסלול נולד משילוב של שלושה: מה הכוונה (שאלה, בדיקה או פעולה), מה רמת הסיכון, והאם חסר מידע. למשל בקשה ספציפית שחסר בה ברקוד מובילה ל'בקש מידע ואז הכן כלי', ובקשת פעולה בסיכון גבוה מובילה ל'עצור לאישור'."

**Q3 (→ ch10 / ch19-20) concept: "מידע חסר לפני פעולה"**
"בקשה ספציפית שדורשת ברקוד, אבל הברקוד חסר. מהו המסלול הנכון לפי הפרק?"
Correct: "לבקש את המידע החסר ואז להתכונן לשימוש בכלי"
Explanation: "כשחסר מידע קריטי כמו ברקוד, המנוע לא מנחש ולא פועל בעיוורון. המסלול הנכון הוא לבקש את המידע החסר, ורק אז להתכונן להפעיל את הכלי. חוסר מידע משמעו לברר, לא לנחש."

**Q4 (→ ch19-20) concept: "מערכת עונה מול Agent"**
"מה לפי הפרק ההבדל המרכזי בין מערכת שרק עונה לבין Agent?"
Correct: "Agent מנסה לבחור את הצעד הנכון הבא, ולא רק מפיק תשובה"
Explanation: "מערכת שרק עונה מפיקה תשובה לכל קלט. Agent קודם מנתב: לפי הכוונה, הסיכון והמידע החסר הוא בוחר את הצעד הנכון הבא - אולי לענות, אולי לבדוק, אולי לעצור לאישור. כאן מתחיל ההבדל האמיתי."

**Q5 (→ ch19-20) concept: "כוונת פעולה וסיכון"**
"נתון: לקוח כותב 'שלח ללקוח הודעה שהחבילה אבדה'. למה דווקא הניסוח הזה צריך מסלול שונה מ'איפה החבילה שלי?', גם אם מדובר באותה חבילה?"
Correct: "כי הוא משדר כוונת פעולה בסיכון גבוה כלפי העולם, ולכן דורש עצירה לאישור ולא רק תשובה"
Explanation: "'איפה החבילה?' היא שאלה בסיכון נמוך שאפשר לענות עליה. 'שלח ללקוח שהחבילה אבדה' היא בקשת פעולה שמשנה משהו בעולם ועלולה להזיק אם שגויה. הכוונה והסיכון הגבוה הם שמחייבים מסלול של עצירה לאישור, לא אורך המשפט או צורתו הדקדוקית."

### Concept-map note
The five concepts above are removed from the live concept→chapter map when `chapter2Quiz` is replaced. Verified: no final-exam question uses any of them, so no review link breaks. If a future Agent/task chapter reuses these concepts, wire them in `FINAL_CONCEPT_TO_CHAPTER` at that time.
