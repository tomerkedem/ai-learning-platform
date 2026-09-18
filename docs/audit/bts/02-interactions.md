# 02 - Interaction and lab inventory

Scope: components rendered by the 21 routes under `app/behind-the-scenes-ai/`. The reachable-file
set was computed by walking the transitive import graph from the 21 page entry points; the full
list is `docs/audit/bts/raw/reachable-files.txt` (510 files).

**How input methods were established.** By code inspection only. No browser session was run; no
Playwright, Cypress or other browser driver exists in this repo (`package.json` has no test
runner beyond `node --test`). Every statement below about mouse/touch/keyboard is derived from
the DOM elements and handlers in the source. Statements about *rendering* are additionally
supported by the fact that all 21 routes prerender without error
(`docs/audit/bts/raw/build.txt`).

Where a component is described as "mouse + touch + keyboard", the basis is that its controls are
native `<button type="button">` / `<input>` / `<a>` elements with `onClick`, which the browser
activates from pointer, touch and Enter/Space. Where keyboard support is *additionally* explicit,
the `onKeyDown` line is cited. There are exactly 5 `onKeyDown` handlers in the module's reachable
code (`ChatInterfacePanel.tsx:283`, `EngineTrail.tsx:195` (unreachable), `IntroStationViz.tsx:1872`,
`SemanticSpaceLab.tsx:231`, `LiveCodeEditor.tsx:1037` (Python module)).

---

## A. Chapter labs

### 1. `TransparentLabLayout` + `ChatInterfacePanel` + `GlassEnginePanel`
- Files: `components/ai-internals/TransparentLabLayout.tsx`, `components/ai-internals/ChatInterfacePanel.tsx`,
  `app/behind-the-scenes-ai/chapter-1/GlassEnginePanel.tsx`, `app/behind-the-scenes-ai/chapter-1/HoloFrame.tsx`
- Chapter: 1
- **Learner inputs:** free-text message (`<input>` in `ChatInterfacePanel.tsx`, `onKeyDown` at line 283
  for Enter-to-send), a Send button, 3 preset suggestion chips (`chapter1.seed.suggestions`),
  a Chat/Agent mode toggle, station selection in the engine panel (prev/next + direct click),
  replay-station and reset-journey buttons, token hover (mouse) with a reciprocal highlight.
- **Outputs that change:** the assistant reply bubble, the 14-station engine trace
  (each station's input / transformation / output / conclusion / limitation), the token strip,
  and a "pause outcome" tag on suggestions that trigger ask/stop/low-confidence.
- **Computation source: a deterministic scripted engine, not a model.**
  `app/behind-the-scenes-ai/chapter-1/mockEngine.ts:1-9` states:
  > `"מנוע לימודי" דטרמיניסטי לפרק 1 - לא NLP אמיתי ולא מודל. ... פונקציות טהורות בלבד (אין זמן, אקראיות או תופעות לוואי).`

  The chapter page calls `runChatEngine(conversationText)` / `runAgentEngine(conversationText)`
  (`chapter-1/page.tsx:98-99`) and `traceChatEngine` / `traceAgentEngine`
  (`chapter-1/page.tsx:139-142`). Replies are looked up from the dictionary by key:
  `const mockReply = isChat ? viz.mockEngine.chatReplies[chat.replyKey] : viz.mockEngine.agentReplies[agent.replyKey]`
  (`chapter-1/page.tsx:159`). So: keyword rules select a scenario id; the id indexes a fixed reply
  table. Free text that matches no rule falls to a default branch. Verified deterministic by
  `app/behind-the-scenes-ai/chapter-1/canonicalPipeline.test.ts` (8 passing tests).
- **A live-model path exists but is not wired.** `app/api/chat-reply/route.ts` streams a real
  Claude reply (`@anthropic-ai/sdk`, model default `claude-haiku-4-5-20251001`, line 24). No client
  file references `/api/chat-reply`; the lab always uses `mockEngine`.
- **Simplified-model label: present, in-UI.** `chapter1.lab.simulationDisclosure`, rendered at `chapter-1/page.tsx:343`
  (and read aloud as segment `simulation-disclosure`, line 160):
  > `זוהי המחשה לימודית דטרמיניסטית של רעיונות נפוצים במודלי שפה, לא הקלטה ישירה של החישוב הנסתר של מודל.`

  EN (verbatim from `i18n/locales/en/behind-ai/chapter1.ts`): `"This is a deterministic educational illustration of common language-model ideas, not a direct recording of a model's hidden computation."`
  Each station also carries a `limitation` field labelled `גבול ההמחשה` (`chapter1.visuals.enginePanel.limitationLabel`).
- **Input methods:** mouse + touch + keyboard (text entry, Enter to send, native buttons).
  Token *hover* highlight is pointer-only, but it is a redundant cross-highlight, not the only
  path to the information.

### 2. `InputComparisonLab`
- File: `components/ai-internals/InputComparisonLab.tsx` (147 lines)
- Chapter: 2
- **Inputs:** one selector over 5 phrasings of the same need (`useState(BASE_ID)`), from
  `chapter2.visuals.inputVariations` (`InputComparisonLab.tsx:52`).
- **Outputs:** for the selected phrasing - what is explicit, what is missing, what changed, an
  ambiguity level, and what the request asks the model to do.
- **Computation source: lookup table.** Structural ids come from
  `app/behind-the-scenes-ai/chapter-2/inputVariations.ts`; all displayed text comes from the
  dictionary. No computation.
- **Simplified-model label:** none in this chapter's namespace (see the disclosure list below).
- **Input methods:** mouse + touch + keyboard (native buttons).

### 3. `TokenizationLab` (+ `TokenSplitterInput`, `TokenStream`, `TokenColorLegend`, `TokenCountMeter`, `HebrewTokenLab`) and `TokenizationRoadmap`
- Files: `components/ai-internals/TokenizationLab.tsx`, `TokenSplitterInput.tsx`,
  `TokenizationRoadmap.tsx`; engine in `app/behind-the-scenes-ai/chapter-3/tokenizer.ts`,
  `tokenRoles.ts`, `hebrewSplitRules.ts`; per-locale content in
  `app/behind-the-scenes-ai/chapter-3/labContent.tsx`.
- Chapter: 3
- **Inputs:** free text (`<input>` at `TokenSplitterInput.tsx:42-45`), example chips
  (`TokenSplitterInput.tsx:62`), a Chat/Agent mode toggle, a token click to select one token.
- **Outputs:** the token stream with per-token role colouring, a token count meter, a role card
  for the selected token, and a sub-word split panel.
- **Computation source: a real rule-based algorithm over the learner's own text.**
  `app/behind-the-scenes-ai/chapter-3/tokenizer.ts:1-6`:
  > `הטוקנייזר הלימודי הדטרמיניסטי - פרק 3. אין כאן LLM, tokenizer מסחרי, קריאת API או רשת. הפלט זהה בכל הרצה. המנוע מבצע: (1) פיצול לפי רווחים, (2) קילוף פיסוק לטוקנים נפרדים, (3) שיוך תפקיד מתוך WORD_ROLES, (4) ספירה.`

  Token *roles* are a lookup (`roleForWord` against a per-locale word map); the split itself is
  computed. Sub-word splits are a fixed table (`HEBREW_SPLITS` in `hebrewSplitRules.ts`).
- **Simplified-model label:** no `disclaimer` key exists in the `chapter3` namespace. The
  tokenizer's own limits are stated in source comments only, not in the UI.
  **UNVERIFIED: whether any rendered chapter-3 string tells the learner this is not a production
  tokenizer** - no key matching `disclaimer|disclosure|simulat` exists under `chapter3`.
- **Input methods:** mouse + touch + keyboard.

### 4. `WordToNumberLab`, `EmbeddingLookupLab`, `SentenceBridge`
- Files: `components/ai-internals/WordToNumberLab.tsx` (497 lines),
  `app/behind-the-scenes-ai/chapter-4/components/EmbeddingLookupLab.tsx`, `SentenceBridge.tsx`;
  engine `app/behind-the-scenes-ai/chapter-4/embeddingEngine.ts` (722 lines); per-locale strings
  `app/behind-the-scenes-ai/chapter-4/wordLabContent.ts`.
- Chapter: 4
- **Inputs (WordToNumberLab):** scenario chips, a "play and watch" button, a reset button, click a
  word to see its Token ID, click a Token ID to see its word.
  **There is no text input.** The `text` state is written only by `handleAutoType`, a scripted
  typewriter that replays `scenario.prompt` at 75 ms per character
  (`WordToNumberLab.tsx:99-113`); the component contains no `<input>` or `<textarea>`.
  The dictionary nonetheless carries a typing-field placeholder and aria label
  (`wordLabContent.ts:686-687`, `tx.typing.placeholder`, `tx.typing.aria`) and an
  "unrecognized sentence" hint (`unrecognizedHint`); none of the three is referenced by any
  live component.
- **Outputs:** the sentence morphing into a Token-ID sequence, an embedding-table row highlight,
  and per-dimension value bars.
- **Computation source: fixed dictionary + fixed profiles.**
  `app/behind-the-scenes-ai/chapter-4/embeddingEngine.ts:1-4`:
  > `זהו מודל לימודי דטרמיניסטי לחלוטין - אין כאן LLM אמיתי, קריאת API או רשת. הכל מילון Token IDs קבוע פלוס פרופילים מספריים קבועים לפי שלב הקלדה.`

  `TOKEN_DICTIONARY` (line 23) is a hand-written 15-entry map (`'החבילה': 1042`, `'לא': 17`, ...).
- **Simplified-model label: present, in-UI.** `chapter4.embeddingLookup.disclaimer`:
  > `המספרים כאן הם להמחשה בלבד. וקטור אמיתי הוא מאות או אלפי ממדים שאינם קריאים לאדם.`

  and `chapter4.embeddingTable.note` and `chapter4.embeddingLookup.randomNote`
  (`... המצב האקראי כאן הוא השוואה לימודית בלבד, ולא מה שקורה במודל אמיתי.`).
- **Input methods:** mouse + touch + keyboard (all controls are native buttons).

### 5. `SemanticSpaceLab`
- File: `components/ai-internals/SemanticSpaceLab.tsx` (512 lines); data
  `app/behind-the-scenes-ai/chapter-5/semanticSpace.ts` (175 lines)
- Chapter: 5
- **Inputs:** experiment toggle (`map` / other), click any of 12 phrase points on the map, a
  compare-to-second-phrase selection, plus explicit keyboard activation on points
  (`SemanticSpaceLab.tsx:231`, `onKeyDown={onPointKey(p.id)}`).
- **Outputs:** neighbour ranking, a 0-100 proximity score, a near/far tone, and a negation-pair
  comparison.
- **Computation source: real geometry over fixed coordinates.** Every phrase has an immutable
  `(x, y)` in `PHRASES`. Distances are computed live:
  `distance = Math.hypot(a.x-b.x, a.y-b.y)` (`semanticSpace.ts:116-118`),
  `closeness = clamp(1 - dist/REF_SPAN)` (124-126), `proximityScore = round(closeness*100)` (154-156).
  So: coordinates are authored, the ranking/score is computed. Covered by 10 passing tests in
  `app/behind-the-scenes-ai/chapter-5/semanticSpace.test.ts`, including
  `"ranking uses only stored coordinates and cannot receive a moved coordinate"`.
- **Simplified-model label: present, in-UI.** `semanticSpace.lab.disclaimer`:
  > `מפה לימודית בשני ממדים בלבד. היא ממחישה את רעיון הקרבה, אך המרחקים המצוירים אינם העתק מדויק של המרחב האמיתי.`
- **Input methods:** mouse + touch + keyboard (explicit `onKeyDown`).

### 6. `AttentionSentenceLab`
- File: `components/ai-internals/AttentionSentenceLab.tsx` (278 lines)
- Chapter: 6
- **Inputs:** two independent selectors - a sentence-variant selector (`data.variants`) and a
  processing-focus selector (`focus.states`).
- **Outputs:** per-token weight shading, a percentage per token, and a relation meter between a
  marked token pair.
- **Computation source: authored values (lookup).** Weights, the token list and the pair index all
  arrive in `data` from `attentionLab` in the dictionary. The only computation in the component is
  presentational normalisation: `const maxW = Math.max(...weights, 0.0001); intensity = weights[j]/maxW`
  (`AttentionSentenceLab.tsx:52-57`). No attention math is performed.
  Note: the repo does contain a real cosine-similarity + softmax implementation
  (`app/behind-the-scenes-ai/chapter-6/scoringEngine.ts`, which states
  `"כל מספר שמוצג מחושב חי, אף ערך אינו מקודד קשיח"`), but it is **not reachable from any live
  route** - it is imported only by `_parked` pages and by the unreachable `PipelineCascadeLab` and
  `ConfidenceGateLab`.
- **Simplified-model label: present, in-UI.** `attention.sentenceLab.disclaimer`:
  > `זו המחשה לימודית מפושטת, לא שיקוף מלא של מנגנון Attention במודל אמיתי. המספרים כאן נועדו להראות את הרעיון: שינוי קטן במשפט מזיז את מוקד הקשב ואת עוצמת הקשר בין החלקים. האחוז ליד כל מילה הוא משקל ברגע הזה, לא ציון חשיבות קבוע של המילה.`
- **Input methods:** mouse + touch + keyboard.

### 7. `ContextWindowLab`
- File: `components/ai-internals/ContextWindowLab.tsx` (215 lines)
- Chapter: 7
- **Inputs:** one selector over window states (critical detail inside / pushed out / restored by a
  standalone prompt).
- **Outputs:** which messages are inside the window, and the model's answer for that state,
  with a tone colour.
- **Computation source: lookup table** (`data.states`, `data.answers` from `contextWindowLab`).
- **Simplified-model label: present.** `contextWindow.lab.disclaimer`:
  > `זו המחשה לימודית של הרעיון, לא מדידה מדויקת של גבול הטוקנים. מערכות ומודלים שונים מנהלים את החלון אחרת. ...`
- **Input methods:** mouse + touch + keyboard.

### 8. `LogitsSoftmaxLab`
- File: `components/ai-internals/LogitsSoftmaxLab.tsx` (258 lines)
- Chapter: 8
- **Inputs:** (mode A) a context selector that sets the raw scores; (mode B) per-continuation
  plus/minus buttons that move each score inside `SCORE_MIN=0 .. SCORE_MAX=9`
  (`LogitsSoftmaxLab.tsx:31-32`); a reset.
- **Outputs:** live percentages per continuation and a "leader" crown.
- **Computation source: a real Softmax computed from the learner's scores.**
  `softmaxPercents` (`LogitsSoftmaxLab.tsx:34-49`) implements
  `p_i = exp(s_i - max) / Σ exp(s_j - max)`, scaled to 100 with largest-remainder rounding.
  The *inputs* to the softmax (the base scores per context) are authored values from the
  dictionary. This is the only live lab in the module that performs the mathematics of the concept
  it teaches on learner-controlled inputs.
- **Simplified-model label: present.** `logitsSoftmax.lab.disclaimer`:
  > `הציונים והאחוזים כאן הם המחשה לימודית, לא פלט אמיתי של מודל. כאן הגבלנו את הציון לטווח נוח להשוואה, אבל ציון אמיתי יכול להיות כל מספר, גם שלילי. ...`

  plus `logitsSoftmax.lab.continuationNote` explaining that whole phrases stand in for tokens.
- **Input methods:** mouse + touch + keyboard. **There is no slider**: the control is a pair of
  `+`/`-` buttons. No `<input type="range">` exists in any reachable module component; the only
  one in the repo is in the unreachable `ConfidenceGateLab.tsx:421`, and
  `@radix-ui/react-slider` (`components/ui/slider.tsx`) is used only by
  `components/ErrorSimulator.tsx`, which no module route imports.

### 9. `DecodingLab`
- File: `components/ai-internals/DecodingLab.tsx` (220 lines)
- Chapter: 9
- **Inputs:** a decoding-style selector (conservative / balanced / open) and a
  "try another choice" button that advances `pickIndex`.
- **Outputs:** which continuation gets selected from the same fixed distribution.
- **Computation source: a fixed pick sequence, explicitly not random.**
  `selectedId = style.picks[pickIndex % style.picks.length]` (`DecodingLab.tsx:63`). Header comment
  (lines 10-12):
  > `הבחירה אינה אקראית: לכל סגנון יש רצף בחירות קבוע (picks). הלחיצה מתקדמת באינדקס לאורך הרצף ...`

  The probabilities themselves are authored and constant in this chapter by design (`"ההסתברויות כבר קיימות (זה היה פרק 8) והן קבועות כאן"`).
- **Simplified-model label: present.** `decoding.lab.disclaimer`:
  > `ההסתברויות והבחירות כאן הן המחשה לימודית, לא פלט אמיתי של מודל. ... שום סגנון לא בודק אם ההמשך נכון בעולם.`
- **Input methods:** mouse + touch + keyboard.

### 10. `GenerationLoopLab`
- File: `components/ai-internals/GenerationLoopLab.tsx` (455 lines); data
  `app/behind-the-scenes-ai/chapter-10/answerBuildSteps.ts`
- Chapter: 10
- **Inputs:** a prompt-variant selector (`PromptVariantId`, default `'vague'`), a
  watch/instruction mode toggle, per-step fragment selection (the learner picks the next fragment),
  and a reset.
- **Outputs:** the answer assembled fragment by fragment, a branch that changes with the first
  choice, candidate bars per step, and a step counter (`formatStepOnly`, `i18n/format.ts:96-98`).
- **Computation source: an authored branch tree.** `composeScenario`, `getBranch`,
  `chosenFragmentsUpTo`, `totalSteps`, `composeVariants` from `answerBuildSteps.ts`; candidate
  bars are authored values, not computed.
- **Simplified-model label: present, twice.** `generationLoop.lab.transparencyNote`:
  > `זו המחשה לימודית מפושטת. מודלים אמיתיים מייצרים את התשובה ביחידות קטנות יותר ועל אוצר מילים גדול מאוד. אנחנו עובדים ברמת חלקי משפט כדי שהלולאה תהיה ברורה. הברים הם המחשה של מידת התאמה, לא חישוב אמיתי.`

  and `generationLoop.lab.variants.disclaimer`.
- **Input methods:** mouse + touch + keyboard.

### 11-19. The scenario-selector labs (chapters 11-19)

`HallucinationLab` (11), `GroundingLab` (12), `SelfCheckLab` (13), `MistakeLearningLab` (14),
`EvaluationLab` (15), `DoesAiLearnLab` (16), `ChatToAgentLab` (17), `GuardrailsLab` (18),
`FullTraceLab` (19) share one interaction shape: **one selector over an authored set of cases;
every panel below re-renders from that case's record in the dictionary.** None performs a
calculation; all are lookup tables. Each declares determinism in its own header comment
("`דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית ...`").

| Ch | Component | Learner input | What changes | Data source | Simplified-model label (key) |
|---|---|---|---|---|---|
| 11 | `HallucinationLab` (200 ln) | 4 answer-style modes | risk level, fact-check rows, what is missing, bottom line | `hallucinations.lab.modes` | `hallucinations.lab.disclaimer` |
| 12 | `GroundingLab` (215 ln) | 4 source modes (no source / with source / missing / contradicting) | the source card, what the answer may say, check rows | `grounding.lab.modes` | `grounding.lab.disclaimer` + a per-card `כרטיס לדוגמה בלבד, להמחשה. אלה לא נתונים אמיתיים.` on 4 cards |
| 13 | `SelfCheckLab` (249 ln) | 3 draft answers | claim-by-claim support against one fixed source card, checklist verdicts | `selfCheck.lab.modes` | `selfCheck.lab.disclaimer` + `selfCheck.lab.sourceCaption` |
| 14 | `MistakeLearningLab` (261 ln) | 4 improvement levels | what improved vs what did not | `mistakeLearning.lab.modes` | `mistakeLearning.lab.disclaimer` + `sourceCaption` |
| 15 | `EvaluationLab` (284 ln) + `ScoreBreakdownPanel` | 5 test cases; the panel adds a per-criterion expansion | per-case pass/fail, a summary of how many passed and where the weak point is | `evaluation.lab.cases`, `evaluationScore` | `evaluation.lab.disclaimer` + `sourceCaption` |
| 16 | `DoesAiLearnLab` (205 ln) | 4 layers (same chat / new chat / memory feature / training) | what the model sees now, its answer, what changed and what did not | `doesAiLearn.lab.layers` | `doesAiLearn.lab.disclaimer` |
| 17 | `ChatToAgentLab` (254 ln) | 4 modes (chat / missing info / tool use / approval needed) | step path, tool card, output, permission tag | `chatToAgent.lab.modes` | `chatToAgent.lab.disclaimer` |
| 18 | `GuardrailsLab` (271 ln) | 5 requested actions | risk tag, control-check panel, system decision, allowed/forbidden, bottom line | `guardrails.lab.actions` | `guardrails.lab.disclaimer` |
| 19 | `FullTraceLab` (178 ln) | stage index 0-13 (prev/next), a tool-error toggle (`ToolErrorState`), an approval toggle (`ApprovalState`) | per-stage title/refresher/input/process/output/branch reason, and a `facts` panel | `fullTrace.lab.stages` (14 stages) | `fullTrace.lab.disclosure` |

Input methods for all nine: mouse + touch + keyboard (native buttons throughout; no drag, no hover-only content).

---

## B. Guess-before-reveal interactions

| Component | File | Chapters | Input | Output |
|---|---|---|---|---|
| `HypothesisGuess` | `components/ai-internals/HypothesisGuess.tsx` (233 ln) | 0 (intro) | pick 1 of 4 competing explanations | verdict + what each hypothesis gets right / misses |
| `OpeningGuess` | `components/ai-internals/OpeningGuess.tsx` (230 ln) | 2, 3, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 (13 chapters) | pick 1 card | `GuessVerdict` reveal: `getsRight`, `misses`, `bridge`; the correct card is the one with `statusTone === 'precise'` (line 5) |
| `AttentionGuess` | `components/ai-internals/AttentionGuess.tsx` (336 ln) | 6, 7, 8, 9 | pick 1 option | same reveal pattern |
| `GuessButton` + `GuessVerdict` | `components/ai-internals/GuessButton.tsx` (151 ln), `GuessVerdict.tsx` (418 ln) | 4 | pick 1 option | verdict |

Chapter 1 has no guess step; the page comment records this as deliberate
(`chapter-1/page.tsx:~50`: `"לפרק 1 אין ניחוש ואין רגע מחויבות של הלומד"`).
All are lookup-driven: correctness is a field on the authored card, not a computation.
All are native buttons - mouse + touch + keyboard.

## C. Introduction-only interactions

| Component | File | Input | Output | Source |
|---|---|---|---|---|
| `IntroRoadmap` | `components/ai-internals/IntroRoadmap.tsx` (530 ln) | click a station / a zone; a mobile branch at `matchMedia('(max-width: 767px), (pointer: coarse)')` (line 222) | station detail, zone grouping | authored 14-station roadmap in `introduction.roadmap` |
| `IntroStationViz` | `components/ai-internals/IntroStationViz.tsx` (1,877 ln) | per-station animated visual; a sound toggle (`VizSoundToggle`) | the station animations | authored; contains the module's only `Math.random()` outside the quiz engine, at line 1583, in a `sure`/`surprise` decoding demo weighted by `DECODE_PROBS` |
| `EngineReveal` | `components/ai-internals/EngineReveal.tsx` | open/close the engine view | a scripted request/answer pair plus the station list | `introduction.chat.*` |
| `AgentLoop` | `components/ai-internals/AgentLoop.tsx` | chat/agent mode toggle, step through stages | the agent loop stages | `introduction.agent.*` |

Introduction disclosure - `introduction.truthNote`:
> `זו מפת למידה מפושטת של מודל שפה אוטורגרסיבי, לא תיעוד מלא ולא ארכיטקטורה אוניברסלית לכל מוצר AI. יכולות כמו אחזור, זיכרון, כלים, בדיקה עצמית ו-Guardrails הן תוספות מערכת אופציונליות, לא שכבות פנימיות שחייבות לפעול בכל תשובה.`

## D. Cross-cutting interactive chrome (every chapter)

| Component | File | Input | Output |
|---|---|---|---|
| `ExpandableLab` | `components/ai-internals/ExpandableLab.tsx` (190 ln) | expand a lab to a full-screen portal (`z-index 9999`) | full-screen lab; reads `prefers-reduced-motion` at line 67 |
| `ReadAloudControls` + `FloatingReadAloud` + `SpeakButton` | `components/ai-internals/ReadAloudControls.tsx`, `FloatingReadAloud.tsx`, `SpeakButton.tsx`, `useReadAloud.ts` | play / pause / stop / prev / next segment; a voice `<select>`; a rate control; three scope modes (`short` / `regular` / `full`) | browser speech synthesis of the chapter's authored segment list, with per-word karaoke highlighting when the engine emits `boundary` events |
| `AssessmentEngine` | `components/content/AssessmentEngine.tsx` (900 ln) | answer 5 (or 18) multiple-choice questions, navigate, submit, review answers, retry | score, per-question explanation, strong/weak concept chips, targeted review links, confetti on pass |
| `MasteryDashboard` / `SidebarMastery` | `app/behind-the-scenes-ai/MasteryDashboard.tsx` (258 ln) | expand/collapse in the sidebar | chapters completed, chapters passed, average score, final-exam status, weak-concept chips |
| `ChapterLayout` | `components/ChapterLayout.tsx` | focus-mode toggle; prev/next chapter links (with `←`/`→` keyboard hints rendered as `<kbd>`) | layout width, navigation |

## E. Counts

- **Distinct interaction *types*: 7.**
  1. free-text entry (chapters 1, 3)
  2. guess-before-reveal card pick (chapters 0, 2, 3, 4, 5, 6, 7, 8, 9, 10-19)
  3. scenario / mode selector driving a panel re-render (chapters 2, 6, 7, 9, 11-19)
  4. numeric adjustment with live recomputation (chapter 8 only)
  5. step-through / sequence navigation (chapters 1, 10, 19; intro `AgentLoop`)
  6. click-an-element-to-inspect-it (chapters 3, 4, 5, 15)
  7. multiple-choice assessment (all 19 chapters + final exam)

- **Distinct interactive components rendered by module routes: 29**
  (`ChatInterfacePanel`, `GlassEnginePanel`, `TransparentLabLayout`, `InputComparisonLab`,
  `TokenizationLab`, `TokenizationRoadmap`, `WordToNumberLab`, `EmbeddingLookupLab`,
  `SentenceBridge`, `SemanticSpaceLab`, `AttentionSentenceLab`, `ContextWindowLab`,
  `LogitsSoftmaxLab`, `DecodingLab`, `GenerationLoopLab`, `HallucinationLab`, `GroundingLab`,
  `SelfCheckLab`, `MistakeLearningLab`, `EvaluationLab` + `ScoreBreakdownPanel`, `DoesAiLearnLab`,
  `ChatToAgentLab`, `GuardrailsLab`, `FullTraceLab`, `IntroRoadmap`, `IntroStationViz`,
  `EngineReveal`, `AgentLoop`) - counting the four guess components and `AssessmentEngine`
  separately as chrome.

- **Chapters with zero interactions: NONE.** All 20 chapters render at least one interactive
  component; 19 of 20 additionally render a quiz. Chapter 0 (introduction) has interactions but
  no quiz.

- **Computation-source breakdown across the 20 chapter labs:**
  - real algorithm run on learner input: **2** (chapter 3 tokenizer, chapter 8 softmax)
  - real computation over authored fixed data: **1** (chapter 5 distance/proximity)
  - deterministic scripted engine over keyword rules + fixed reply table: **1** (chapter 1)
  - authored branch tree: **1** (chapter 10)
  - pure lookup table: **15** (chapters 2, 4, 6, 7, 9, 11-19, plus the intro visuals)
  - external API call: **0** in the shipped path (`/api/chat-reply` exists but is not called)
