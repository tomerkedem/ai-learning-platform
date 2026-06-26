# CH3 Migration Notes - Tokenization moves to Chapter 3 (5 to 3 rotation)

Migration record for the "מאחורי הקלעים של AI" learning module. Documents the chapter
re-sequence that brought Tokenization from chapter 5 to chapter 3, the relocation of the two
displaced chapters, and the rebuild of the new chapter 3 to the chapter standard
(`BEHIND_AI_CHAPTER_STANDARD.md`).

Note on dashes: regular hyphen only. No Em dash (U+2014) and no En dash (U+2013) anywhere.

---

## 1. Why

Chapter 2 ("מה באמת נכנס למודל") ends with the idea that the model starts from the text the
learner actually wrote. The natural next step is to show that this written text is broken into
tokens before any deeper processing. Tokenization therefore moved up to chapter 3, directly
after chapter 2. Probability and word-by-word shifted down. Probability stays before
word-by-word because word-by-word depends on the probability idea.

This supersedes the older `CHAPTER_ARCHITECTURE_PLAN.md` decision (and the
`Doc/behind-the-scenes-ai-canonical-audit.md` map), both of which kept Tokenization at chapter 5.
Those two documents are now stale on the numbering of chapters 3 to 5.

## 2. The rotation (3 to 5)

| Slot | Before | After |
|---|---|---|
| Chapter 3 | הלב ההסתברותי (probability) | טוקניזציה (Tokenization) - rebuilt to standard |
| Chapter 4 | מילה אחר מילה (word by word) | הלב ההסתברותי (probability) - relocated as-is |
| Chapter 5 | טוקניזציה (Tokenization) | מילה אחר מילה (word by word) - relocated, bridge fixed |

Chapters 1, 2, and 6 to 16 are unchanged in topic and numbering.

## 3. Files moved (git mv, history preserved)

- `chapter-5/tokenizer.ts` -> `chapter-3/tokenizer.ts`
- `chapter-5/tokenRoles.ts` -> `chapter-3/tokenRoles.ts`
- `chapter-5/hebrewSplitRules.ts` -> `chapter-3/hebrewSplitRules.ts`
- `chapter-3/probabilityScenarios.ts` -> `chapter-4/probabilityScenarios.ts`
- `chapter-4/wordEngine.ts` -> `chapter-5/wordEngine.ts`

Header comments in each moved file were updated to the new chapter number.

## 4. Pages

- `chapter-3/page.tsx`: rewritten as the new Tokenization chapter (see section 7).
- `chapter-4/page.tsx`: the probability page, relocated. Only `currentChapterId`, the hero badge
  (`· 04`), the quiz index (`behindAiChapterQuizzes[4]`), the component name, and a stray En dash
  in the summary (now a hyphen) changed. Content is otherwise identical.
- `chapter-5/page.tsx`: the word-by-word page, relocated. `currentChapterId`, badge (`· 05`),
  quiz index (`[5]`), and component name updated. The closing bridge that promised "ובפרק הבא
  נפתח את עולם ה-Tokenization" was removed, because Tokenization is now behind it (chapter 3) and
  the next chapter is chapter 6. The bridge line was replaced with a non-directional clarifying
  note.

## 5. Engine and lab decisions (reuse and extend)

The deterministic educational tokenizer and the `TokenizationLab` family were reused, not
rebuilt. The engine now lives under `chapter-3/`. All 8 importing components were repointed from
`@/app/behind-the-scenes-ai/chapter-5/*` to `chapter-3/*`:
`TokenChip`, `HebrewTokenLab`, `TokenizationLab`, `TokenRoleCard`, `TokenColorLegend`,
`TokenStream`, `TokenizationRoadmap`, `TokenSplitterInput`.

Extensions added for the chapter brief:
- New `number` token role (`tokenRoles.ts`: union, `ROLE_STYLE` lime, `ROLE_INFO`, `ROLE_ORDER`).
- Digit detection in `tokenizer.ts` (`coreRole`: a pure-digit core becomes a `number` token).
- New helpers in `tokenizer.ts`: `hasNumber`, `looksLikeNoSpaceClump`.
- New scenario examples (chat scenario): emphasis (`!!!`), tracking number (`12345`), no-spaces,
  English, and an in-conversation correction. The hyphen example was dropped.
- `TokenizationLab` now shows a "Number token" signal chip, and an honesty note for the no-spaces
  case clarifying that a real tokenizer would still split it into sub-word pieces.

The educational-tokenizer honesty note was kept and the no-spaces caption was added, so the lab
is never presented as the exact tokenizer of a specific model.

## 6. Data and wiring changes

- `quizData.ts`:
  - `CHAPTER_LABELS`: 3 = "טוקניזציה", 4 = "הלב ההסתברותי", 5 = "מילה אחר מילה".
  - Quiz blocks swapped so the const matches the chapter: `chapter3Quiz` is now the (refreshed)
    Tokenization assessment, `chapter4Quiz` is probability, `chapter5Quiz` is word-by-word.
    `CHAPTER_QUIZZES` and `behindAiChapterQuizzes` are unchanged in shape; `nextHref` is
    auto-generated and stays valid.
  - `FINAL_CONCEPT_TO_CHAPTER`: "למה טוקניזציה" 5->3, "הסתברות אינה אמת" 3->4,
    "הסבר לא טכני" 3->4, "ניסוח משנה ביטחון" 4->5, "כל מילה מזיזה" 4->5.
- `lib/courseData.ts`: the id 3/4/5 entries swapped topics (label, title, description, readTime,
  colors). `id`, `href`, and `num` stay per slot.
- `chapter-14/scenarioLibrary.ts` and `chapter-14/traces.ts`: the Tokens node explanation changed
  from "(פרק 5)" to "(פרק 3)".

## 7. New Chapter 3 (Tokenization) structure

Built to `BEHIND_AI_CHAPTER_STANDARD.md`:
- Hero: "המשפט לא נכנס כמקשה אחת. הוא מתפרק ליחידות." (token mentor pose).
- `DiscoveryGuess` quick guess (4 cards, one precise, three tempting), staged reveal to the lab.
- Wow `InsightBox`: "בעיניים שלנו זה משפט אחד. למודל זו שרשרת של יחידות."
- `TokenizationLab` (reused and extended) plus `TokenizationRoadmap`.
- Bounded everyday analogy (sticker strip cut before handling), not a forced postal metaphor.
- Misconception two-card (mistake vs how it really works).
- Short professional explanation (5 bullets).
- נעילת הבנה: truth vs mistake cards plus an active classification question
  ("which change affects tokenization" -> all of the above) with tailored feedback.
- 5-question assessment via `AssessmentEngine`.

Modern-AI framing kept: tokenization is the first input-representation step, explicitly not
understanding, and the split depends on the tokenizer and can differ between models. No deep
teaching of Token IDs, Embeddings, Attention, Softmax, or Decoding.

## 8. Archived material

### 8a. Old Chapter 3 (probability)
Not lost. The full probability chapter and its `probabilityScenarios.ts` and `chapter3Quiz`
(probability) content were relocated to chapter 4 verbatim, only the chapter number wiring
changed. See `chapter-4/page.tsx` and the `chapter4Quiz` block in `quizData.ts`.

### 8b. Old Chapter 5 (Tokenization) page copy that was rewritten or dropped
The old tokenization page hero and the inline formula panel were replaced by the new
standard-compliant page. Archived here for reference:

- Old hero (replaced): "AI לא מתחיל בלהבין. הוא מתחיל בלפרק." with subtitle
  "לפני שהמנוע מחשב משמעות, הוא הופך את הטקסט ליחידות עבודה שנקראות Tokens. מה שנראה לנו כמו
  משפט, נראה למנוע כמו רצף יחידות. הקלידו משפט, וראו אותו נשבר לכרטיסים חיים שנכנסים למנוע בזה
  אחר זה."
- Old inline formula panel (dropped from the page; the engine still exposes the same idea):
  `tokenize(text) = [token1, token2, token3, ...]` and
  `tokenize("החבילה לא הגיעה") = ["החבילה", "לא", "הגיעה"]`
- Old closing InsightBox bridge (replaced): it bridged to Token ID and vectors as the next step.
  The new chapter avoids an explicit "next chapter" bridge, per the module preference against
  connector sentences. The engine and roadmap still foreshadow Token IDs and vectors lightly.

The old tokenization quiz (`chapter5Quiz`) was refreshed into the new `chapter3Quiz`: questions
1, 2 kept in spirit (split-before-meaning, token-not-word), question 3 broadened to
punctuation/numbers/spaces, question 4 rewritten to "tokenization is not understanding", and a
new question 5 added on different tokenizers producing different token counts.

## 9. Cleanup status

- No duplicate live Tokenization content: chapter 5 no longer renders the tokenization lab; it is
  the word-by-word chapter.
- No stale references calling Tokenization "chapter 5" in app code.
- No `chapter-5/tokenizer` (or tokenRoles/hebrewSplitRules) imports remain.
- Shared infrastructure (`ModeToggle`, `accents`, `types`, `InsightBox`, `ChapterLayout`,
  `AssessmentEngine`, `DiscoveryGuess`, `Mentor`) untouched.
- Mastery progress is keyed by chapter number in localStorage, so an existing learner's saved
  chapter 3 to 5 results now attach to the moved topics. Minor and accepted.
- Planning docs `CHAPTER_ARCHITECTURE_PLAN.md` and `Doc/behind-the-scenes-ai-canonical-audit.md`
  are stale on chapter 3 to 5 numbering and were left as historical records (this note is the
  current source of truth for the rotation).

## 10. Mentor assets wired (chapter 2 and 3)

- Chapter 3 lab guide mentor: new pose `tokenRibbon` (`/assets/mentor-token-ribbon-alpha.png`),
  registered in `Mentor.tsx`, used only at the `TokenizationLab` slot in `chapter-3/page.tsx`
  (replaced the `inspect` magnifier pose). Copy and layout unchanged.
- Chapter 2 hero mentor: new pose `inputClarity` (`/assets/mentor-input-clarity-alpha.png`),
  registered in `Mentor.tsx`, used only at the chapter 2 hero (replaced `inspect`). Copy and
  layout unchanged. `explain-opposite` remains a registered pose but is now unused.

## 11. Future shared UI polish (deferred, NOT fixed in the Chapter 3 task)

These are pre-existing, shared (coursewide) UI items, intentionally left untouched so Chapter 3
stays consistent with the already-frozen chapters. They should be handled later as a single
coursewide pass, each with its own review.

- **Reduce-motion hydration mismatch on chapter heroes.** Every chapter hero `motion.section`
  uses `initial={reduce ? false : { opacity: 0, y: 18 }}` (`reduce = useReducedMotion()`).
  `useReducedMotion()` returns false during SSR but can be true on the client, so when a user has
  prefers-reduced-motion enabled the server/client inline style differs and React logs a
  hydration mismatch (it self-heals; no functional or visual break with reduce-motion off).
  Confirmed present identically on chapters 1, 2 (frozen), 3, 4. Proposed coursewide fix: keep
  `initial` static and gate only `transition` on `reduce`
  (`transition={reduce ? { duration: 0 } : {...}}`). Not done here to avoid diverging ch3 from
  the frozen pattern.
- **Mobile sticky-header crowding.** At ~390px the `ChapterLayout` sticky header crowds the
  chapter title against the progress badge. Shared `ChapterLayout` behavior, not ch3-specific.
