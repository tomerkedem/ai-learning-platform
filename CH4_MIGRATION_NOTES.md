# CH4 Migration Notes - "הלב ההסתברותי" rebuild

Record of the Chapter 4 rebuild to the chapter standard (`BEHIND_AI_CHAPTER_STANDARD.md`).
Use a regular hyphen only. No Em dash (U+2014) or En dash (U+2013) anywhere in this file.

## Why the rebuild

The relocated old chapter (from the 3 to 5 resequence, see `CH3_MIGRATION_NOTES.md`) worked
technically but was really a confidence/decision-gate chapter. Its lab framed the package message
as an intent disambiguation (אי מסירה / תקלה במערכת / שאלת מעקב), computed
`confidence_margin = top - second`, and routed to a decision gate (answer / ask context / clarify).
That is the explicit subject of Chapter 9 ("ביטחון ושער ההחלטה"), so Chapter 4 duplicated live
Chapter 9 material and drifted from its actual purpose.

Chapter 4 is now cleanly centered on the probabilistic heart of generation:

- the model evaluates several possible continuations
- each continuation gets a relative plausibility weight from the input and context
- context shifts the distribution
- a likely continuation is not the same as a true one
- learned patterns are not copy-paste retrieval
- verifying the world requires tools or sources, not the internal estimate

The confidence-margin / decision-gate idea stays in Chapter 9. Chapter 4 foreshadows it at most
with a single light sentence and does not teach it.

## Removed from live Chapter 4 (archived here)

Deleted after confirming ch4-only usage (grep across all courses):

- `components/ai-internals/DistributionShapePanel.tsx` - sharp / close / flat distribution shape
  with a "answer vs ask" reading. The "flat distribution -> ask a clarifying question" reading is
  Chapter 9 material.
- `components/ai-internals/ConfidenceMarginCard.tsx` - top / second / margin gauge and the
  `confidence_margin = top_probability - second_probability` model. This is the Chapter 9 spine.
- `components/ai-internals/DecisionOutcomeCard.tsx` - the final decision card (answer / ask context
  / clarify) driven by the margin. Decision routing belongs to Chapter 9.
- The page "נוסחה מנטלית" section (mental formula) that mapped distribution shape to a route
  (answer carefully / ask for more context / ask a clarifying question).
- `app/behind-the-scenes-ai/chapter-4/probabilityScenarios.ts` - the old intent-disambiguation
  scenarios (clear / ambiguous / broad), each with `distributionShape`, `topProbability`,
  `secondProbability`, `margin`, `confidence`, `decisionKind`, `decisionHe/En`,
  `decisionExplanation`. Replaced by `continuationScenarios.ts`.

Removed from `components/ai-internals/types.ts` (all ch4-only):

- `ConfidenceLevel` (the `'high' | 'medium' | 'low'` one in types.ts; note Chapter 8/9/14 use a
  different `ConfidenceLevel` defined in `chapter-8/scoringEngine.ts`, which is untouched)
- `DistributionShape`
- `ProbabilityDecisionKind`
- `ProbabilityScenario`

Kept and reused: `ProbabilityCandidate`, `ProbabilitySignal`, `SignalStrength`, `Accent`,
`CandidateRankingPanel`, `ProbabilitySignalsPanel`, `MostLikelyNotTruthCard`,
`PromptScenarioSelector` (retyped to `ContinuationScenario`).

## Old quiz (replaced)

The previous `chapter4Quiz` had 5 questions, 3 of which (Q3 "פער כמדד ביטחון", Q4 "התפלגות מפוזרת",
Q5 "מה באמת העיקר") leaned on the margin / decision-gate framing that now lives in Chapter 9.
The new quiz keeps the spirit of Q1 (הערכה מול ידיעה) and Q2 (ביטחון אינו אמת) and re-aims the rest
to: context changes likelihood, learned patterns are not copy-paste, external verification needs
tools or sources.

Archived old questions (verbatim subjects, for reference if Chapter 9 ever wants them):

1. "AI לא יודע, AI מעריך מה הכי סביר" -> ranking of interpretations, not retrieval. (concept: הערכה מול ידיעה) - spirit kept.
2. Confident, well phrased answer is still an estimate. (concept: ביטחון אינו אמת) - spirit kept.
3. What "הפער בין האפשרות הראשונה לשנייה" measures and why it matters. (concept: פער כמדד ביטחון) - moved out, Chapter 9 territory.
4. Flat distribution with no clear leader -> ask a clarifying question. (concept: התפלגות מפוזרת) - moved out, Chapter 9 territory.
5. "AI always picks the highest number" misconception; the real point is it does not hold absolute truth and sometimes should stop and ask. (concept: מה באמת העיקר) - the "stop and ask" half is Chapter 9; the "not absolute truth" half is kept in spirit.

Note: `FINAL_CONCEPT_TO_CHAPTER` in `quizData.ts` maps the final-exam concepts "הסתברות אינה אמת"
and "הסבר לא טכני" to Chapter 4. Those are final-exam question concepts, independent of the chapter
quiz concept tags, and remain valid after this rebuild.

## New Chapter 4 shape

Hero -> DiscoveryGuess (4 cards) -> reveal -> wow InsightBox (likely is not truth) ->
"מעבדת ההמשכים הסבירים" (continuation lab with context-shift toggles) -> everyday analogy ->
misconception card -> professional bullets -> נעילת הבנה (active classification) -> 5-question quiz.

New files: `app/behind-the-scenes-ai/chapter-4/continuationScenarios.ts`,
`components/ai-internals/ContinuationLab.tsx`. New types in `types.ts`: `ContinuationScenario`,
`ContextToggle`.
