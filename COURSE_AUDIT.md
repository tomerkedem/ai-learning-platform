# Course Audit - "מאחורי הקלעים של AI" (Behind the Scenes of AI)

**Audit date:** 2026-06-24
**Scope:** The `behind-the-scenes-ai` course only (introduction + 16 chapters). The repo also contains three other courses (`mathIntuitive`, `python`, `mathProbabilistic`) and a separate `components/demos/*` + `components/content/*` tree that belong to the Python course; those are out of scope and were excluded.
**Mode:** Read-only. No course file was modified. The only file written is this report.

---

## Measurement assumptions (read this first)

1. **What counts as a "unit":** 17 units = `introduction` + `chapter-1` ... `chapter-16`.
2. **Hebrew word count method (MEASURED):** Content for this course lives in three places per chapter: the `page.tsx`, co-located `.ts` data files (e.g. `pipelineData.ts`, `scenarioLibrary.ts`), and one bespoke "Lab" React component under `components/ai-internals/`. A word is counted when a whitespace-separated token contains at least one Hebrew character (Unicode U+0590-U+05FF). This naturally excludes English code identifiers, JSX tags, and class names (all ASCII). Line and block comments were stripped before counting.
   - **Per-chapter total = (all Hebrew words in the chapter folder) + (Hebrew words in that chapter's dedicated Lab component).**
   - This **excludes** shared chrome whose text is small and repeated everywhere: the `Mentor` mascot bubble lines, the `InsightBox` shell, and the shared `EngineTrail`. So the real authored Hebrew volume is slightly higher than reported.
   - A page-only count (ignoring data files and labs) is also given where useful; it is much lower (5,969 words) and is **not** representative, because most teaching text is inside the labs and data files.
3. **Estimated reading/engagement time (DERIVED):** `minutes = (content_words / 130) + (0.5 x top_level_interactive_widgets)`. 130 wpm for new technical content; 30 seconds added per top-level interactive widget. This is a floor: each chapter's single Lab is internally a deep multi-panel experience, so genuine engagement time is higher. The author's own `readTime` values (from `lib/courseData.ts`) are shown alongside for comparison.
4. **"Interactive components" (MEASURED count, OBSERVED typing):** top-level learner-manipulable widgets mounted in the page. The decorative `Mentor` mascot and the static `InsightBox` callout are **not** counted as interactive.
5. **Measured vs Observed:** every number (words, headings, component instances, asset counts) comes from a code scan. Every quality judgment is explicitly marked **(Observed)**.
6. **Density flag thresholds:** mean content words = 1,107, standard deviation = 371. 🔴 OVER = above mean + 0.75 SD (> 1,385). 🟡 UNDER = below mean - 0.75 SD (< 829). 🟢 OK = in between.

---

## A. Executive summary

**Tech stack (MEASURED):** Next.js 16 (App Router) + React 19 + TypeScript, styled with Tailwind CSS v4, animated with framer-motion v12, icons from lucide-react, math via KaTeX, charts via recharts. Optional live AI runs through four API routes (`app/api/chat-reply`, `count-tokens`, `scenario`, `word-engine`) calling the Anthropic SDK with `claude-haiku-4-5-20251001` by default (override via `WORD_ENGINE_MODEL`). Content is **not** stored in Markdown or a CMS - it is authored directly in `.tsx`/`.ts` files: prose in JSX, scenarios in co-located typed data files, and one bespoke interactive "Lab" per chapter under `components/ai-internals/`.

**High-level folder structure (MEASURED):**
- `app/behind-the-scenes-ai/<unit>/page.tsx` - one route per unit; some chapters add co-located data/engine files (e.g. `chapter-8/pipelineData.ts`, `chapter-14/traces.ts`). Chapter 1 is uniquely split into ~9 local sub-components.
- `components/ai-internals/` - ~75 files: 16 bespoke chapter Labs + ~60 reusable sub-panels + the shared `Mentor`, `EngineTrail`, `StickyContextBar`.
- `components/ChapterLayout.tsx`, `CourseHeader`, `CourseSidebar`, `CourseFooter` - shared shell.
- `lib/courseData.ts` - the canonical metadata for all four courses (titles, labels, `readTime`, theme colors).
- `app/globals.css` + `app/layout.tsx` - global theme (Tailwind v4, shadcn oklch tokens) and root `<html lang="he" dir="rtl">`.

**Headline numbers (MEASURED unless noted):**
- **Total Hebrew content words:** ~**18,812** (page + co-located data + dedicated lab). Page-only would be 5,969 and is misleading.
- **Mean per unit:** 1,107 words (SD 371). Densest: chapter-14 (2,042). Thinnest: chapter-3 (548).
- **Total interactive widgets:** ~**28 top-level** (16 bespoke chapter Labs + intro's 3 + chapter-1's ~9), composed from ~60 reusable sub-panels. Every chapter from 2-16 has exactly **one** hero Lab.
- **Estimated engagement time:** ~**159 minutes** by the formula above (floor); author-stated total is ~**208 minutes** (~3.5 h).
- **Media:** 16 mascot PNGs (`/public/assets/mentor-*.png`, all present, no broken refs); dozens of animated SVG/Canvas diagrams; **0 video, 0 audio/TTS**.

**Overall impression (Observed):** This is an unusually polished, visually rich, single-narrative course. Its strongest asset is consistency of metaphor: one customer-support "delayed package" scenario threads from chapter 2 to chapter 16, and one engine pipeline (Tokens -> IDs -> Vectors -> Similarity -> Scores -> Softmax -> Confidence -> Decision -> Tool -> Stop) is opened layer by layer. The interactivity is genuinely "transparent lab" style - learners manipulate inputs and watch the engine's internal state move - and the optional live-Claude integration is a real differentiator. The main weaknesses are pedagogical structure rather than craft: there are almost no graded knowledge checks (3 of 17 units), explicit learning objectives appear only from chapter 8 onward, sub-section titles are frequently styled `<div>`s rather than semantic headings, the Latin webfonts do not include a Hebrew subset, and drag-only interactions lack keyboard alternatives. There is also a cosmetic but pervasive code smell: chapter components 8-16 are named one number too low.

---

## B. Per-chapter breakdown

Words = MEASURED Hebrew content (folder + dedicated lab). Subheadings = MEASURED `<h2>`/`<h3>` in the page (sub-section titles rendered as styled `<div>`s are noted separately and are an a11y concern). Interactive = MEASURED top-level widgets (Mentor/InsightBox excluded). All Yes/No flags are OBSERVED from reading the page + lab.

| # | Title (he) | Words | Est. time (formula / author) | # Subhead­ings | Interactive components (count + types) | # Media | New concepts | Objectives? | Summary? | Knowledge check? | Real-world example? | Visual diagram? | Density |
|---|-----------|------:|------|---:|------|---|------|---|---|---|---|---|---|
| 0 | מבוא: מה קורה מאחורי הקלעים של AI | 1,092 | 11 / 6 | 4 | 6 (EngineTrail x4, GuessRevealGate, LiveTokenizeTaste) | 5 mentor PNG + animated step-trails | The 15-step pipeline; vector as "mother tongue"; Chat vs Agent | No | Narrative (no InsightBox) | **Yes** (GuessRevealGate guess-and-reveal) | Yes (weather / calendar) | Yes | 🟢 OK |
| 1 | לא רק תשובה - הדרך שמאחורי התשובה | 1,439 | 16 / 8 | 6 | ~9 (TransparentLabLayout, GlassEnginePanel, ChatInterfacePanel, ReadHeadLab, ConfidenceDial, CounterfactualDiff, DecisionTrace, ForkView, PredictDecision) | 3 mentor PNG + live engine trace + SVG viz; optional live Claude stream | Transparent chat; read-head; confidence gate; counterfactual; decision trace; Chat/Agent fork | No (hero hints only) | **Yes** (2 InsightBox) | **Yes** (PredictDecision predict-then-reveal) | Yes (package "החבילה לא הגיעה") | Yes | 🔴 OVER |
| 2 | שאלה, בדיקה או פעולה - ההחלטה הראשונה | 673 | 6 / 8 | 1 | 1 (RequestRoutingLab) | 3 mentor PNG + animated routing panels | Intent vs topic; 4 routes; risk; missing info | No | **Yes** (InsightBox) | No (exploratory) | Yes (3 package phrasings) | Yes | 🟡 UNDER |
| 3 | AI כמנוע הסתברותי | 548 | 5 / 9 | 1 | 1 (ProbabilityEngineLab) | 3 mentor PNG + probability bars/shape viz | Distribution over interpretations; confidence margin; ask-vs-answer | No | **Yes** | No | Yes (3 complaint phrasings) | Yes | 🟡 UNDER |
| 4 | כל מילה מזיזה את המנוע | 573 | 5 / 12 | 1 | 1 (WordEngineLab) | 3 mentor PNG + live bars/vector/timeline | Word-by-word build; negation flips; temporary vs final | No | **Yes** | No | Yes (typing scenarios) | Yes | 🟡 UNDER |
| 5 | Tokenization - הטקסט מתפרק לחלקים | 610 | 5 / 11 | 1 | 1 (TokenizationLab; + static TokenizationRoadmap) | 3 mentor PNG + token cards + roadmap strip | Tokens; tokenizer; token roles; punctuation as unit; Token ID | No | **Yes** | No | Yes (delivery sentence split) | Yes | 🟡 UNDER |
| 6 | ממילים למספרים ולמשמעות | 981 | 8 / 13 | 1 | 1 (WordToNumberLab) | 3 mentor PNG + ID-morph + meaning-vector bars | Token ID; meaning vector; two sentences -> same direction | No | **Yes** | No | Yes (two delivery sentences align) | Yes | 🟢 OK |
| 7 | הגיאומטריה של המשמעות | 851 | 7 / 12 | 3 | 1 (SemanticSpaceLab) | 3 mentor PNG + draggable 2D space + angle SVGs | Word as point/arrow; direction>distance; cosine similarity; vector analogy | Partial (3 concept cards) | **Yes** | **Yes** (drag-and-guess analogy) | Yes (RAG, semantic search) | Yes | 🟢 OK |
| 8 | דמיון, ציונים והסתברויות | 1,366 | 11 / 15 | 1 | 1 (PipelineCascadeLab) | 3 mentor PNG + 6-layer animated cascade + softmax anim | Full chain; raw score; Softmax; similarity != probability | Yes (ReadingPath) | **Yes** | No (Try-this only) | Yes (agent re-ranking) | Yes | 🟢 OK |
| 9 | Confidence - מתי לענות ומתי לעצור | 1,232 | 10 / 14 | 1 | 1 (ConfidenceGateLab) | 3 mentor PNG + threshold slider + gate viz | Confidence margin; decision gate; threshold; risk | **Yes** | **Yes** | No | Yes ("תטפל בזה" refusal) | Yes | 🟢 OK |
| 10 | מ-Prompt למשימה | 1,284 | 10 / 14 | 1 | 1 (TaskUnderstandingLab) | 3 mentor PNG + 4-step pipeline + clarity meter | Task vs question; goal detection; missing info; "detect != approve" | **Yes** | **Yes** | No | Yes (question vs task) | Yes | 🟢 OK |
| 11 | בחירת Tool - מתי Agent צריך כלי | 1,411 | 11 / 15 | 1 | 1 (ToolSelectionLab) | 3 mentor PNG + tool board + 4-gate viz | Tool selection; match ranking; 4 gates (match/input/risk/permission) | **Yes** | **Yes** | No | Yes (customer DB, no permission) | Yes | 🔴 OVER |
| 12 | Tool Call, Observation וההחלטה הבאה | 1,084 | 9 / 15 | 1 | 1 (ObservationLoopLab) | 3 mentor PNG + loop diagram + timeline | Tool Call; Observation; Next Decision; the agent loop | **Yes** | **Yes** | No | Yes (conflicting tracking result) | Yes | 🟢 OK |
| 13 | עצירה, אישור ואחריות | 1,237 | 10 / 15 | 1 | 1 (ControlLayerLab) | 3 mentor PNG + control pipeline + boolean chips | Control layer; risk/permission/approval gates; draft-not-send | **Yes** | **Yes** | No | Yes (email draft for approval) | Yes | 🟢 OK |
| 14 | Behind the Scenes Lab - המודל וה-Agent | 2,042 | 16 / 16 | 1 | 1 (BehindScenesLab - capstone) | 3 mentor PNG + full pipeline replay + compare view | Unified lab; Chat vs Agent engines; live softmax; domain switcher | **Yes** | **Yes** | No (replay only) | Yes (multi-domain library) | Yes | 🔴 OVER |
| 15 | האם AI לומד מהטעויות שלך | 1,157 | 9 / 11 | 1 | 1 (LearnsFromMistakesLab) | 3 mentor PNG + weights grid + context-window viz | Frozen weights; in-context vs persistent; 3 learning layers; forgetting | **Yes** | **Yes** | No | Yes (name-correction across sessions) | Yes | 🟢 OK |
| 16 | איך לעבוד נכון עם מודל ו-Agent | 1,232 | 10 / 14 | 1 | 1 (PromptCoachLab) | 3 mentor PNG + quality meter + before/after | Prompt-as-definition; 5-dim quality meter; Chat/Agent selector | **Yes** | **Yes** | No (reveal exercise only) | Yes (improved package prompt) | Yes | 🟢 OK |

**Note on subheadings:** counts are semantic `<h2>`/`<h3>` only. From chapter 2 onward almost every chapter has just one real subheading (the lab title `מעבדת ...`); important sub-section titles such as "מודל מנטלי", "הנוסחה", "מפת הדרכים של המנוע" and the per-widget titles inside labs are styled `<div>`s, not headings. This understates visible structure but is an accessibility gap (see H).

---

## C. Content samples

### Introduction (opening, explanation, interactive, closing)
- **Opening (`introduction/page.tsx:224`):** "מבחוץ זה נראה כמו רגע אחד: כתבנו משפט וקיבלנו תשובה. מבפנים זה מסלול שלם: פירוק, מספרים, הקשר, חישוב, הסתברות והחלטה - שלב אחר שלב."
- **Core explanation (`:230`):** "כשמבינים את המסלול, מפסיקים לנחש מול המודל: יודעים למה הוא בטוח, מתי לחשוד בתשובה, ואיך לנסח טוב יותר. בלי נוסחאות מפחידות - רק אינטואיציה."
- **Interactive (Observed):** `GuessRevealGate` asks the learner to guess how many steps sit between input and answer (2 / 8 / 15 / 25), then reveals 15; `LiveTokenizeTaste` lets the learner type their **own** sentence and watch it tokenize live; `EngineTrail` is a clickable Outside-View (2 steps) vs Behind-the-Scenes (15 steps) comparison.
- **Closing (`:443`):** "בפרק הראשון נתחיל מההתחלה של המסלול - נראה איך טקסט הופך לתשובה, שלב אחר שלב."

### Chapter 8 (mid-course - "דמיון, ציונים והסתברויות")
- **Opening (`chapter-8/page.tsx:152`):** "מווקטור משמעות, דרך דמיון וציונים גולמיים, ועד הסתברויות והחלטה. הקלידו משפט וראו את כל השרשרת רצה כמפל. ואז שנו מילה אחת, וצפו בגל שינוי שמתפשט במורד כל השכבות ומהפך את ההחלטה. כל מספר על המסך מחושב חי."
- **Core explanation (`:65`):** "הוא לא קופץ ממנו ישר לתשובה, אלא עובר שרשרת של ארבעה שלבים: קודם בודק למה המשפט דומה, אחר כך נותן לכל אפשרות ציון גולמי, אחר כך הופך את הציונים להסתברויות שמסתכמות ל-100 אחוז, ורק אז בוחר."
- **Interactive (Observed):** `PipelineCascadeLab` animates a 6-layer cascade top-to-bottom; the learner swaps one word and watches a "wave" propagate down and flip the decision, can toggle a formula view to see the real Softmax math, and switch to Agent Mode where adding a barcode flips the leading step.
- **Closing/summary (`:224`):** "האחוזים הם השלב האחרון בשרשרת חישובים, לא קסם ... כאן נסגרת המחצית הראשונה של הלומדה."

### Chapter 16 (finale - "איך לעבוד נכון עם מודל ו-Agent")
- **Opening (`chapter-16/page.tsx:51`):** "כתיבה טובה ל-AI אינה קסם של מילים, היא הגדרה ברורה של מטרה, הקשר, מידע חסר, תוצאה רצויה וגבולות פעולה. ככל שמגדירים טוב יותר, כך המערכת צריכה לנחש פחות. הכלים כאן הם כלי אימון, לא הצצה למנוע."
- **Core explanation (`:86`):** "נכיר שלושה כלי אימון: מאמן הבקשות שמראה מה חסר ואיך לשפר, מד איכות שבודק חמישה ממדים, ובורר שממליץ בין Chat ל-Agent."
- **Interactive (Observed):** `PromptCoachLab` shows a typed request "through the system's eyes" - detected type/goal/missing data/risk, a live 5-dimension quality meter, a safer/improved prompt suggestion, a Chat-vs-Agent recommendation, and a before/after reveal.
- **Closing (course finale, `:126`):** "התחלנו את הלומדה ברעיון אחד: AI הוא לא רק תשובה, מאחוריה יש תהליך. פתחנו את התהליך שכבה אחר שכבה, מ-Tokens ועד עצירה אחראית ... עכשיו, כשאתם כותבים ל-AI, אתם כבר יודעים מה קורה מאחורי הקלעים."

**Tone/clarity/RTL (Observed):** the writing voice is warm, second-person, and reassuring ("בלי נוסחאות מפחידות", "עצירה אינה כישלון"), with short sentences and frequent contrast pairs ("דמיון אינו הסתברות", "יכולת אינה הרשאה"). RTL flow reads cleanly; Latin technical terms (Tokenization, Softmax, Agent) are deliberately embedded inline to teach vocabulary. The dependence on inline Latin is heavy but consistent and intentional.

---

## D. Interactivity and engagement

**All interactive component types (MEASURED instances / OBSERVED role):**

| Component | Appears | Chapters | Role |
|---|---|---|---|
| `Mentor` (mascot, decorative) | ~50 instances | all 17 | pose + speech bubble; not interactive |
| `InsightBox` (callout) | 1-2 per chapter (18 total) | ch 1-16 | static summary; not interactive |
| `EngineTrail` | 4 | intro | clickable step trail |
| `GuessRevealGate`, `LiveTokenizeTaste` | 1 each | intro | guess-and-reveal; live tokenizer |
| chapter-1 suite (`GlassEnginePanel`, `ReadHeadLab`, `ConfidenceDial`, `CounterfactualDiff`, `DecisionTrace`, `ForkView`, `PredictDecision`, `ChatInterfacePanel`) | ~9 | ch 1 | transparent live engine |
| 15 bespoke chapter Labs (`RequestRoutingLab` ... `PromptCoachLab`) | 1 each | ch 2-16 | the chapter's single hero lab |

**Variety metric (Observed):** very high **across** the course - almost every chapter ships a uniquely named Lab built from its own sub-panels, and no two chapters reuse the same top-level lab. But **within** a chapter the variety is low: chapters 2-16 are each carried by exactly one interactive Lab plus the decorative Mentor and a static InsightBox. So a learner's per-chapter interaction loop is essentially identical in shape (read hero -> manipulate the one lab -> read InsightBox), even though each lab's internals differ.

**Gamification (MEASURED):**
- **Progress bar:** present in `CourseSidebar` but it is **positional only** - `(currentChapterIndex + 1) / totalChapters`. It reflects where you are in the URL, not what you have completed. There is no persistence of completion (only scroll position and focus-mode are saved to `sessionStorage`).
- **Completion reward:** a single `Trophy` "סיימת את כל הפרקים!" card replaces the Next button on chapter 16.
- **Points / badges / streaks / content unlocking:** **none.** (`TokenizationRoadmap` shows "locked" future steps, but that is an illustration inside one lab, not real gating.) `canvas-confetti` is installed but used only by the out-of-scope Python course's `AssessmentEngine`.

**Delight moments (Observed, ~7):**
1. Intro `GuessRevealGate` - commit to a guess, then the 15 steps unfold (emotional payoff before the reveal).
2. Intro `LiveTokenizeTaste` - the engine runs on the learner's **own** words immediately.
3. Chapter 1 read-head scrubbing + "one word flips the whole decision" counterfactual, plus optional **live Claude streaming** with real token counting.
4. Chapter 4 - typing the word "לא" visibly flips the probability bars in real time.
5. Chapter 7 - dragging a word around the semantic space, and the "מלך - גבר + אישה = מלכה" analogy reveal.
6. Chapter 8 - the "wave" that ripples down the 6-layer cascade when you change one word, and the Softmax amplify-then-normalize animation.
7. Chapter 14 - the capstone where the same input drives Chat vs Agent side by side, with a presentation mode.

The live-AI integration (chapters 1, 4, 14, plus token counting) is the most shareable feature: it makes the abstraction concrete on the learner's own text, with a graceful offline fallback when no API key is set.

---

## E. UX/UI and design system

**Design tokens (MEASURED, `app/globals.css`):** Tailwind v4 with a shadcn-style oklch token set (`--primary`, `--card`, `--sidebar-*`, chart colors) defined for both `:root` and `.dark`. **However**, the course does not actually theme through these tokens - `ChapterLayout` hardcodes a dark canvas (`bg-[#050B14]`) and the visual identity comes from per-chapter Tailwind gradient classes defined in `lib/courseData.ts` (`labelColor`, `colorFrom`, `colorTo`, e.g. cyan -> blue for intro, violet family for chapters 7-16). Radius scale `--radius: 0.625rem` with derived sm/md/lg/xl. KaTeX CSS is imported globally.

**Color palette (Observed):** dark slate/navy base (`#050B14`, `#0f172a`) with cyan/blue/indigo/violet accents and per-chapter gradient theming; semantic accent colors inside labs (emerald = safe/answer, amber/rose = risk/stop).

**Typography (MEASURED):** `Geist` (sans) + `Geist_Mono` loaded via `next/font/google` with `subsets: ["latin"]` **only**. There is no Hebrew subset, so all Hebrew body text renders in the browser/OS default font, not in a controlled webfont (see Red Flags).

**Navigation (MEASURED):**
- `CourseSidebar` - full table of contents, active-chapter highlight, author card ("תומר קדם"), positional progress bar. Desktop: collapsible (focus mode). Mobile: hamburger -> slide-in drawer with backdrop.
- `CourseHeader` - sticky title/description/readTime + a scroll-progress bar.
- Footer prev/next cards (with a trophy on the last chapter) and **arrow-key navigation** (RTL-aware: Left = next, Right = prev).
- **Focus mode** - `F` toggles, `Esc` exits; hides the sidebar, widens the column, dims edges with a vignette; preference saved per session.
- Scroll position resets to top on every chapter change.

**RTL correctness (Observed):** strong. Root is `<html lang="he" dir="rtl">`; sections use `dir="rtl"`, and Latin/numeric fragments, formulas, and tool output are wrapped in `dir="ltr"` spans in the structured UI. Mentor speech bubbles force `dir="rtl"`. Residual risk: inline Latin terms inside flowing Hebrew prose (e.g. "ל-token", "Ready for tool selection") rely on the browser's bidi algorithm and can occasionally flip an adjoining hyphen; low severity.

**Responsiveness (Observed):** layouts are mobile-first with `md:`/`lg:`/`xl:` breakpoints; the sidebar collapses to a drawer. **Gap:** the `Mentor` mascots that carry contextual one-liners (e.g. "בואו נפתח את המכסה ביחד") are `hidden xl:block`, so on phones and most laptops both the character **and its guidance text disappear**. Focus-mode and the floating focus button are desktop-only (`hidden md:flex`) - acceptable.

**Animations/transitions (Observed):** framer-motion is used pervasively and consistently - entrance fades/slides (`whileInView`), spring transitions, shimmer sweeps, animated SVG/Canvas diagrams, and `useReducedMotion` is honored across components (mascot float, cascade pulses, etc.). One bespoke CSS effect (`.real-fire-engine` flame text) exists in globals but belongs to the Python course. Consistency is high.

**Audio / TTS:** none.

---

## F. Pedagogy and scaffolding

**Structure consistency (Observed):** from chapter 8 onward the template is very consistent: Hero + lead-in box -> "מה נלמד בפרק הזה / Reading path" objectives -> a roadmap/flow strip -> the narrated Lab (per-widget intro / takeaway / "Try this") -> closing `InsightBox` with an explicit bridge to the next chapter. Chapters 2-7 follow a lighter version (Hero -> hints -> Lab -> InsightBox) **without** an objectives block. The introduction and chapter 1 are bespoke and richer.

**Formative knowledge checks / spaced retrieval (Observed):** this is the weakest pedagogical dimension. Only **3 of 17** units contain a genuine self-test where the learner commits to an answer before seeing the result: intro (`GuessRevealGate`), chapter 1 (`PredictDecision`), and chapter 7 (drag-and-guess analogy, which even scores proximity). Every other chapter offers only exploratory "נסו את זה / Try this" prompts - valuable for discovery, but not retrieval practice, and never graded or revisited. There is no spaced review of earlier concepts as quiz items.

**Cumulative progression (Observed):** excellent and deliberate. The course builds one pipeline in order: tokenization (5) -> numbers/vectors (6) -> geometry of meaning (7) -> similarity/scores/Softmax (8) -> confidence (9) -> agent task understanding (10) -> tool selection (11) -> tool call/observation (12) -> stop/approval (13) -> unified capstone (14) -> does-it-learn (15) -> how-to-prompt (16). Recurring through-lines ("דמיון אינו הסתברות", "זיהוי משימה אינו אישור לפעול", "יכולת אינה הרשאה", "עצירה אינה כישלון") are restated and reinforced, and chapter 14 explicitly reuses "the same engines from chapters 6-12". There is no jumping around.

---

## G. Consistency and canonical data

**Numeric / scenario consistency (Observed - mostly clean):**
- The canonical example scenario (delayed package, barcode `123456789`, the phrases "החבילה לא הגיעה" / "בדוק למה החבילה לא הגיעה" / "תטפל בזה") is used consistently from chapter 1 to 16. This is a strength.
- The pipeline number-story is internally coherent: similarity is repeatedly stated as "not a probability", raw scores as "not summing to 100%", and only post-Softmax values as true probabilities. No contradictory numeric definitions were found across chapters.
- Minor: chapter 4's prose describes confidence as binary (low/high) while its engine data (`wordEngine.ts`) models four levels (low / medium-low / medium / high) - a narrative-vs-engine granularity mismatch, not a user-facing contradiction.

**Term spelling variants (MEASURED):**
- "chat" in Hebrew is spelled **צ'אט** 27 times but **צ'ט** once - the chapter-1 section title "הצ'ט השקוף" (`chapter-1/page.tsx`). Single inconsistency; the rest of the course uses צ'אט.
- Latin term casing is consistent (Token, Tokenization, Agent, Chat, Softmax, Observation, Tool Call).

**Dash usage (MEASURED):**
- **Em dash (U+2014) - forbidden by project rules - was NOT found anywhere** in any page, data, engine, or lab file. The rule is fully respected.
- En dash (U+2013, "–") appears **16 times** across 8 files (intro, ch1, ch2, ch3, ch6, plus data files). It is **not** the forbidden character, but the project guideline prefers a plain hyphen; worth a human pass for visual consistency. Chapter 7 also uses a true minus sign U+2212 in "מלך − גבר + אישה" (correct as a math operator).

---

## H. Accessibility (a11y)

**Strengths (MEASURED/Observed):**
- Root `lang="he" dir="rtl"`; correct `dir` wrapping of LTR fragments.
- SVG diagrams carry `role="img"` + `aria-label` (e.g. chapter 7).
- Buttons/toggles use `aria-pressed`; sliders (chapter 9) and text inputs carry `aria-label`; the chapter-1 tutorial close button has `aria-label="סגירת ההדרכה"`.
- Global CSS sets `cursor: pointer` on all interactive roles; `useReducedMotion` is honored throughout; several animations expose pause/step/replay (chapter 8).
- Full keyboard chapter navigation (arrow keys) and focus-mode shortcuts (F/Esc).

**Concrete failures / gaps (Observed, by location):**
1. **Drag-only interactions have no keyboard alternative** - chapter 7 `SemanticSpaceLab` (drag a word; drag the analogy marker) and chapter 1 `ReadHeadLab` (scrub the read-head) are pointer-only. Keyboard and assistive-tech users cannot perform the core activity.
2. **Sub-section titles are non-semantic** - "מודל מנטלי", "הנוסחה", "מפת הדרכים של המנוע", and most per-widget titles are styled `<div>`s, not `<h2>/<h3>/<h4>`. Screen-reader users get almost no heading outline (often just `<h1>` + one lab `<h3>` per chapter).
3. **Decorative mascot has generic, repeated alt text** - every `Mentor` renders `<img alt="המנטור של הלומדה">` (raw `<img>`, not `next/image`). For a purely decorative element this should be `alt=""`/`aria-hidden`; the repeated alt adds noise for screen readers.
4. **Mascot guidance is visual-only and desktop-only** - the helpful one-liners live in `hidden xl:block` mascots, so they are unavailable to mobile users and (being in `<img>` bubbles) to AT users.
5. **Some click targets are `<div onClick>`** rather than `<button>` (e.g. chapter 8 similarity rows; chapter 16 reveal toggles lack `aria-expanded`), so they are not keyboard-focusable.
6. **Color contrast (Observed, needs measurement):** heavy use of low-opacity slate text (`text-slate-500/400`, `text-[10px]/[11px]`) on dark backgrounds for captions and footnotes is likely below WCAG AA for small text - worth a contrast audit.

No images other than the decorative mascots exist, so missing alt text on content imagery is not an issue.

---

## I. Technical health (lightweight)

- **Component reuse (Observed):** strong. A shared shell (`ChapterLayout`, `CourseHeader`, `CourseSidebar`, `Mentor`, `InsightBox`, `StickyContextBar`) plus ~60 reusable `ai-internals` sub-panels feed the bespoke labs. Duplication is low; chapter 1 is intentionally bespoke.
- **Naming bug (MEASURED):** the page component for chapters **8-16** is named one number too low - `chapter-8/page.tsx` exports `BehindTheScenesChapter7`, chapter-9 exports `...Chapter8`, ... chapter-16 exports `...Chapter15`. The `currentChapterId` props are all correct, so routing and rendering are unaffected, but this is a confusing, repo-wide maintenance smell. (Chapter 8's lab also carries a leftover `ROADMAP_STEPS_7` identifier.)
- **Default metadata (MEASURED):** `app/layout.tsx` still ships `title: "Create Next App"` / `description: "Generated by create next app"` - boilerplate that will surface as the browser tab title and in search/social previews.
- **Sidebar course mismatch (MEASURED):** `CourseSidebar` chooses its icon/color by `switch(courseId)` on `'python'`/`'probability'` only, so `behind-the-scenes-ai` falls through to the math default (`Sigma` icon, sky color). The sidebar footer is hardcoded "v4.6 / AI Math Primer" regardless of course.
- **Broken assets / dead links (MEASURED):** none found - all 16 `mentor-*.png` poses referenced by `Mentor.tsx` exist in `/public/assets/`. Chapter hrefs in `courseData.ts` resolve to existing routes.
- **Performance (Observed):** mascots use raw `<img>` (16 unoptimized PNGs) instead of `next/image`, and many chapters mount heavy framer-motion + Canvas/SVG labs; pyodide, recharts, react-syntax-highlighter, and tsparticles are in the dependency tree (largely for other courses) and risk bloating shared bundles. The optional live-AI routes use `claude-haiku-4-5-20251001` (fast) with graceful fallback - a sensible default.

---

## J. Red flags (most urgent first)

1. **Almost no formative assessment.** 14 of 17 units have no commit-then-check knowledge test; there is no spaced retrieval of earlier concepts. For a course whose goal is durable intuition, this is the biggest pedagogical gap. (Section F)
2. **Hebrew text has no controlled webfont.** Geist is loaded with `subsets: ["latin"]` only, so all Hebrew - the entire body of the course - renders in the user's default font, undermining the otherwise tight visual design and risking inconsistent rendering across devices. (Section E)
3. **Drag-only core interactions are keyboard-inaccessible** (chapters 1 and 7), and most sub-section titles are non-semantic `<div>`s, leaving screen-reader users with no heading outline. (Section H)
4. **Progress tracking is an illusion.** The sidebar bar is positional, not completion-based, and nothing is persisted across sessions; there is no real gamification (no points/badges/streaks/unlocking). (Section D)
5. **Repo-wide component misnaming:** chapters 8-16 export `BehindTheScenesChapter7..15`. Cosmetic but pervasive and confusing for maintainers. (Section I)
6. **Default app metadata** ("Create Next App") still ships - visible in the browser tab and link previews. (Section I)
7. **Front-loaded thinness.** Chapters 2-5 are well below the mean word count while still claiming 8-12 minute read times in `courseData.ts`; the early chapters are thin relative to their stated time and to the dense capstone chapters. (Sections B, K)
8. **Mobile users lose mentor guidance** (mascots and their tip text are `xl`-only). (Section E)
9. **En dash (U+2013) used 16 times** where the project guideline prefers a plain hyphen - not the forbidden em dash, but a consistency nit. (Section G)

---

## K. Quantitative summary

| Metric | Value (MEASURED) |
|---|---|
| Total Hebrew content words (page + data + lab) | 18,812 |
| Page-only word count (for reference, not representative) | 5,969 |
| Mean words per unit | 1,107 |
| Standard deviation | 371 (33% of mean - moderate imbalance) |
| Densest unit | chapter-14 (2,042 words) |
| Thinnest unit | chapter-3 (548 words) |
| Top-level interactive widgets (course total) | ~28 |
| Mean top-level interactive widgets per unit | ~1.6 (intro 6, ch1 ~9, ch2-16 exactly 1 each) |
| Distinct bespoke chapter labs | 16 (one per chapter 1-16) + 3 intro widgets |
| Estimated engagement time (formula) | ~159 min |
| Author-stated total readTime | ~208 min |
| Units with explicit learning objectives | 9 / 17 = **53%** (chapters 8-16; ch7 partial) |
| Units with a summary (InsightBox or narrative) | 17 / 17 = **100%** (16 InsightBox + intro narrative) |
| Units with a genuine knowledge check | 3 / 17 = **18%** (intro, ch1, ch7) |
| Units with a real-world example | 17 / 17 = **100%** |
| Units with a visual diagram | 17 / 17 = **100%** |
| Density flags | OVER: ch1, ch11, ch14 (3) · UNDER: ch2, ch3, ch4, ch5 (4) · OK: 10 |
| Em dash (U+2014) violations | **0** |

---

*End of report. Generated read-only from a direct code scan on 2026-06-24. Numbers are measured; quality judgments are marked (Observed).*
