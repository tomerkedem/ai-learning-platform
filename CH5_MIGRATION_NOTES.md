# CH5 Migration Notes - "איך AI בונה תשובה" rebuild

Record of the Chapter 5 rebuild to the chapter standard (`BEHIND_AI_CHAPTER_STANDARD.md`).
Use a regular hyphen only. No Em dash (U+2014) or En dash (U+2013) anywhere in this file.

## Why the rebuild

The relocated old chapter (from the 3 to 5 resequence, see `CH3_MIGRATION_NOTES.md`) worked
technically but taught the wrong concept for its new canonical purpose. It was an **input-side**
chapter: as the user typed each word, the engine's reading of the input shifted, and the engine
showed a "temporary direction" until the user pressed Send. That overlaps with Chapter 2 and
Chapter 3 (what enters the model) and with the live-reading idea in Chapter 1.

Chapter 5 is now cleanly centered on the **output-side generation loop**: how the model builds
its own answer. The mental shift the chapter drives:

- from "המודל יודע מראש את כל התשובה ואז מציג אותה"
- to "התשובה לא נולדת בבת אחת. כל חלק שהמודל כותב מצטרף להקשר ומשפיע על החלק הבא."

It extends Chapter 4 instead of repeating it. Chapter 4 taught the **single** choice (the model
evaluates candidate continuations and picks the plausible one). Chapter 5 owns the **loop and the
feedback**: that choice repeats, and each produced piece re-enters the context and steers the next
choice (output -> updated context -> next output). Chapter 4 was deliberately left untouched.

## Removed from live Chapter 5 (archived here)

Deleted after confirming Chapter 5-only usage (grep across all courses). None of the following were
imported by any other chapter.

- `components/ai-internals/WordEngineLab.tsx` - the old container lab ("כל מילה מזיזה את המנוע").
  It held typing state (mode, scenario, text, sent) and assembled the panels below.
- `app/behind-the-scenes-ai/chapter-5/wordEngine.ts` - deterministic scenario data and types
  (`CANDIDATES`, `VECTOR_LABELS`, `NEGATION_WORDS`, `WordScenario`, `TypingStep`, `WordFinal`,
  `AgentReasoning`, `WordMode`, `WordConfidence`, `VectorKey`). Each scenario was a fixed table of
  typing steps, one per added word.
- `app/api/word-engine/route.ts` - the **live-Claude analysis mode**. A server route that sent free
  typed text to the Anthropic API (default `claude-haiku-4-5`) and returned a structured `TypingStep`
  so the lab could analyze arbitrary input live. This was the only paid-API surface in the chapter.
  Removing it leaves the new Chapter 5 fully deterministic with no external API dependency.
- Chapter 5-only sub-panels of the lab:
  - `LiveTypingInput.tsx` - the typing field with "הקלידו עבורי" auto-type and a Send button.
  - `CandidateProbabilityPanel.tsx` - probability bars over the five fixed candidates.
  - `NegationAlert.tsx` - **the negation-flip demo**: highlighted when a negation word ("לא", "אין",
    "בלי", "אינו", "לא ניתן") entered and flipped the leading direction.
  - `WordImpactFormula.tsx` - the per-word impact readout behind the mental model
    `new_score = previous_score + word_impact`.
  - `ProbabilityMovementTrail.tsx` - the trail of how the distribution moved across steps.
  - `WordTimeline.tsx` - scrubbable timeline of the typed words.
  - `MeaningVectorPanel.tsx` - the meaning-vector bars (delivery / system / payment / address / urgency).
  - `TokenStreamPanel.tsx` - the token stream view for the typed text.
  - `AgentReasoningPanel.tsx` - the accumulated Agent reasoning view (Agent mode only).
  - `SendOutcomeCard.tsx` - the **"temporary until Send"** card: showed a Temporary direction while
    typing and a Final decision only after Send.

### Concepts archived (in case wanted later elsewhere)

- **Input-side word-by-word reading**: each typed word moves the engine's read of the input. If this
  is ever wanted, it belongs with the input chapters (2/3) or the live-reading idea in Chapter 1, not
  in the answer-construction chapter.
- **The negation-flip demo**: the word "לא" flipping the leading interpretation in real time. A vivid
  demo, but it is about reading input, not building output.
- **"Temporary until Send"**: the engine shows a temporary direction while the user types and locks a
  final decision only on Send. This is an input/commit idea, not part of output generation.
- **Live-Claude analysis mode**: free-text analysis via the Anthropic API with a forced
  structured-output tool call. Removed to keep the chapter deterministic and free of a paid-API
  dependency.
- The page "נוסחה מנטלית" section mapping each word to `new_score = previous_score + word_impact`.

## Shared files kept (not deleted)

- `components/ai-internals/ModeToggle.tsx` - shared by TokenizationLab, Chapter 1, PipelineCascadeLab,
  ChatInterfacePanel, WordToNumberLab, ConfidenceGateLab.
- `components/ai-internals/accents.ts` (`ACCENTS`) - shared across many labs.
- `lib/rateLimit.ts` - shared by the `chat-reply` and `scenario` API routes. Only the `word-engine`
  route was removed; the shared limiter stays.
- `DiscoveryGuess`, `Mentor`, `InsightBox`, `AssessmentEngine`, `ChapterLayout` - shared infrastructure.

## Old quiz (replaced)

The previous `chapter5Quiz` (5 questions) was built around the input-side framing: "a sentence enters
word by word", the "לא" word moving the bars, "temporary direction until Send", and "the first word
changes the process type". All five leaned on the typed-input model that is no longer the subject.

Archived old question subjects (for reference):

1. How a sentence enters the engine -> "word by word, each word moves probability/confidence/decision". (concept: בנייה הדרגתית)
2. The word "לא" moving the bars hard -> a single word can flip the probability direction. (concept: השפעת מילה בודדת)
3. The direction shown while typing, before Send -> it is temporary; Send locks it. (concept: זמני מול סופי)
4. Why the first word ("בדוק") matters -> it can change the whole process type. (concept: כוח המילה הראשונה)
5. Typing "החבילה" then "לא" and the bars jumping -> cumulative update, temporary until Send. (concept: עדכון מצטבר עד השליחה)

The new quiz re-aims all five to the output-side loop (see below).

## New Chapter 5 shape

Hero ("כל חלק שהמודל כותב חוזר פנימה") -> DiscoveryGuess (4 cards) -> reveal -> AnswerBuilderLab
(step through the generation loop on a fixed prompt, with two fixed branches from the first choice) ->
wow InsightBox (each produced piece re-enters the context) -> everyday analogy (continuing your own
sentence) -> misconception card (knows the whole answer in advance vs builds it gradually) ->
professional bullets -> נעילת הבנה (active classification on a generated fragment) -> 5-question quiz.

New files:

- `app/behind-the-scenes-ai/chapter-5/answerBuildSteps.ts` - deterministic branch/step data
  (prompt, two branches, per-step candidate fragments with educational "fit" values, what-changed notes).
- `components/ai-internals/AnswerBuilderLab.tsx` - the new deterministic lab. No live API.

New quiz concepts: בנייה צעד אחר צעד, פלט הופך לקלט, צעד מוקדם מכוון, ייצור אינו אימות, אין תשובה מוכנה.

## Boundaries respected

No logits, softmax, temperature, decoding strategies, attention, training, or agent tool calls are
taught. "Token" appears only as a single light foreshadow in the lab honesty note. Building step by
step is explicitly distinguished from verifying truth (verification needs a tool or source, a later
chapter). Chapter 4 and all English metadata fields were left untouched (English alignment is a later
i18n task).
