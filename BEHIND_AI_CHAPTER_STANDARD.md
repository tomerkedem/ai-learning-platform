# Behind-the-Scenes-AI Chapter Standard

The required chapter model for the learning module "מאחורי הקלעים של AI". This is a standard for future implementation, not a learner-facing summary. It is distilled from the two reference chapters that work:

- Chapter 2: "מה באמת נכנס למודל"
- Chapter 8: "Attention, מי חשוב עכשיו"

Reusable building blocks already in the codebase: `DiscoveryGuess` (the 4-card quick guess), `Mentor` (pose-driven character), `StickyContextBar`, `InsightBox`, `AssessmentEngine` (shared quiz/result), `ChapterLayout`. Chapter-specific labs (for example `AttentionMomentLab`, `InputComparisonLab`) are built per chapter.

Note on the dashes in this file: use a regular hyphen only. Do not use the Em dash (U+2014) or En dash (U+2013) anywhere, including in this document.

---

## 1. Core chapter philosophy

Every chapter is a discovery experience, not a static content page. A chapter guides the learner through a deliberate arc:

1. Curiosity - a question that exposes a gap in the learner's intuition.
2. Prediction - the learner commits to a guess before any explanation.
3. Interaction - a central lab where the learner manipulates and observes.
4. Realization - a clear "wow" insight that resolves the curiosity.
5. Misconception correction - name the tempting wrong model and replace it.
6. Understanding lock (נעילת הבנה) - an active check that the mental model changed.
7. Assessment - a short, honest, scenario-based quiz.

If a section does not move the learner along this arc, it does not belong in the chapter.

## 2. Required chapter structure

Recommended top-to-bottom order (both reference chapters follow this):

1. Hero with a strong intuitive question (not a definition).
2. Quick guess before explanation (4 cards via `DiscoveryGuess`).
3. One clearly correct mental model among the cards.
4. Tempting but incomplete alternatives for the other cards.
5. Tailored feedback per choice (gets-right / misses / bridge).
6. Mentor used only when it has a teaching role.
7. Reveal panel that resolves the guess and bridges into the lab.
8. Central interactive lab.
9. Wow moment / central insight (often an `InsightBox`).
10. Everyday analogy where it genuinely helps (kept bounded).
11. Common misconception correction (mistake vs how it really works).
12. Professional but simple explanation (short, principle-level).
13. נעילת הבנה (active, not a summary).
14. 5-question assessment via `AssessmentEngine`.

Not every chapter needs all 14, but it should not drop curiosity, prediction, interaction, realization, the understanding lock, or assessment.

## 3. Quick guess standard (`DiscoveryGuess`)

Use the shared, content-driven `DiscoveryGuess` component. Do not copy-paste a per-chapter guess.

- Exactly one clearly correct mental model, three tempting alternatives.
- Status labels reflect the type of thinking, not a grade:
  - "בחרת נכון" (the precise model)
  - "נכון חלקית" (a true intuition that misses the full picture)
  - "טעות נפוצה" (tempting and understandable, but misleading)
  - "לא השלב הזה" or "חשוב, אבל לא X" (an important thought that belongs elsewhere)
- Do not use harsh wording such as "טעית".
- Feedback per card must include three parts:
  - what it gets right ("מה זה תופס נכון")
  - what it misses ("מה זה מפספס", or for the correct card "מה נשאר לראות")
  - one bridge sentence into the core insight
- Selected-card color communicates type of thinking, not pass/fail:
  - emerald for correct (precise)
  - sky/cyan for partial
  - amber for misconception (keep it amber, never red or orange-red)
  - indigo/slate for different-layer
- Only the selected card receives the status tint. Non-selected cards stay neutral/dim after a choice. Idle and hover stay neutral.
- Keep the tint subtle and transparent (roughly 15-20% card background, 10-12% feedback-panel background). No opaque fills, no aggressive glow.
- Color is reinforcement only. The status chip text is the primary signal, so the experience works without relying on hue.
- Staged reveal: per-card feedback first, then a button reveals the larger insight, then a CTA that can scroll to the lab.
- A secondary "בחרו מחדש" reset returns to the pre-choice state.

## 4. Mentor standard

- Mentors must have a clear teaching role. Never place a mentor as decoration.
- Use different mentor poses for different feedback states when the meaning differs. Do not reuse one pose for everything.
- Match the pose to the meaning:
  - correct answer: positive and confident (for example `correct`)
  - partial: thoughtful / weighing (for example `think`)
  - misconception: calm, gentle correction, not scolding (for example `reassure`)
  - boundary / not-this-step: gentle heads-up that signals a distinction (for example `headsup`)
  - pre-choice invite: inviting and curious (for example `guessThinking`)
  - reveal / move-to-lab: guides forward (for example `pointdown`)
- The mentor must never overlap text or answer cards. Prefer placing it outside the content grid, or in-flow above the heading. It supports the learner, it does not compete with the content.
- In feedback panels keep the mentor small (around 64-72px) and facing the text, not away from it. Do not flip an asset whose pose or baked-in text would break.
- Reduced-motion must be respected (no float, instant transitions).

## 5. Lab standard

The central lab shows the concept changing or being revealed through interaction. A static table is acceptable only when the interaction makes the comparison meaningful.

The lab should let the learner do at least one of: choose, manipulate, compare, pause, or reveal. It should make the invisible mechanism visible (for example, weight shifting per moment in ch8, or what the input contains per phrasing in ch2).

- Plain Hebrew. Avoid stacking many technical terms at once.
- Include a short honesty note whenever the lab simplifies real model behavior (for example "זו המחשה לימודית מפושטת, לא שיקוף מלא של המנגנון במודל אמיתי").
- A `StickyContextBar` can pin the active prompt/state while the learner scrolls the read-out.
- Watch density. If a lab read-out has many fields, confirm it stays readable on mobile before freezing. Do not over-teach a future chapter's mechanism inside the lab.

## 6. נעילת הבנה standard

This must not be a passive summary. It must actively confirm the mental model changed. Include one or more of:

- truth vs mistake (a clear correct statement next to the tempting wrong one)
- a diagnosis question
- scenario classification
- choose the correct relation
- identify what the model should not assume
- a short applied check

Keep it interactive (a real choice with tailored feedback), and tie it back to the chapter's central insight.

## 7. Assessment standard

Use the shared `AssessmentEngine` with the chapter's quiz data.

- 5 questions per chapter.
- Test understanding, not memorization. Use scenarios whenever possible.
- Each question carries a `concept` tag used for weak-concept review links.
- Feedback is honest and direct: do not flatter, do not punish.
- Result tone (defined once in `AssessmentEngine`, inherited by all chapters):
  - low score label is "לא עברת עדיין"
  - the 50-69 band is "כמעט עברת", never "עבר", because the pass threshold is 70
  - never tell a learner they passed when they are below the threshold
  - supporting line for a non-pass: "ההבנה עדיין לא מספיקה כדי להתקדם בביטחון. חזרו על הנקודות החלשות ונסו שוב."
  - the not-passed mentor line is direct and action-oriented: "עוד לא עברתם. חזרו על הנקודות החלשות ונסו שוב."
- Always recommend what to review (weak-concept chips plus focused chapter links).
- Wrong answers stay clearly distinguishable, in professional rose (not aggressive red), with a clear mark. Correct answers in emerald.
- The score is always shown, never hidden, never styled as celebratory for a non-pass and never as "game over".

## 8. Hebrew style standard

- Natural Hebrew, not translated English.
- Use "לומדה", never "ספר" or "ספרון".
- No Em dash (U+2014) and no En dash (U+2013) in user-facing text.
- No semicolons in Hebrew user-facing text.
- Avoid awkward sentence openings with "כאן".
- Prefer clear, mature, direct language. Not childish, not academic or dry.
- Quotation marks inside JSX text must be escaped (`&quot;`) or written as JS string literals; do not leave raw quotes in JSX text.
- In self-learning contexts the singular voice is acceptable and often preferred, but keep voice consistent within each component.

## 9. Modern AI accuracy standard

The module must feel accurate for modern AI systems in 2026 and stay as timeless as possible. Do not describe AI as a weak old autocomplete.

Modern systems may include strong reasoning behavior, long context, tool use, Agent workflows, memory-like features, multimodal input, and external retrieval or system integrations. Acknowledge these capabilities without mystifying them.

Avoid details that age badly:
- no dependence on a specific model version
- no specific context-window numbers unless truly necessary
- no "models cannot do X" claims unless conceptually stable
- no shallow "just predicts the next word" framing as the whole explanation

Explain stable principles. Preferred framings:

- Instead of "המודל רק משלים מילים." use "המודל מייצר תשובה צעד אחר צעד על בסיס הקלט, ההקשר, הדפוסים שלמד, ולעיתים גם כלים או מידע חיצוני שזמינים למערכת."
- Instead of "המודל לא מבין כוונה." use "המודל לא מקבל את הכוונה שלכם כקלט ישיר. הוא מסיק אותה מתוך מה שכתבתם, ההקשר הזמין, ולעיתים גם מידע נוסף או כלים שמחוברים למערכת."
- Instead of "המודל לא יודע לבדוק דברים בעולם." use "המודל עצמו אינו מקור אמת לעולם החיצוני. במערכת שמחוברת לכלים, הוא יכול לבקש בדיקה ממקור חיצוני, לקבל תצפית, ואז להמשיך לענות על בסיס המידע שהוחזר."

## 10. Conceptual guardrails

- Do not teach future concepts too deeply before their chapter. Foreshadow with a single light sentence, do not overload.
- Do not imply Agent is an internal Transformer stage. Agent is a system layer around the model.
- Do not imply a conversation correction changes model training. It updates the current conversation context only.
- Do not imply the model receives raw intention directly. It infers intention from the text and available context.
- Do not imply a tracking number (or any identifier) magically checks status. An external tool or source is required, and the model uses the returned result.
- Respect the capability of modern models, but do not mystify them.

## 11. Cleanup standard

- No dead code and no duplicate live content.
- When a rewrite replaces a concept that may be reused later, archive the old copy, quiz, and behavior in a migration note (for example `CH2_MIGRATION_NOTES.md`, `CH8_MIGRATION_NOTES.md`).
- Delete unused chapter-specific files after verifying nothing imports them.
- Never delete shared infrastructure blindly. Verify imports across all courses first (types and lab components are often shared).
- Every major chapter rewrite that removes reusable material should include a migration note before deletion.
- After cleanup, confirm: no leftover references, typecheck passes, and changed files lint clean.

## 12. Chapter 3 status (done) and the 5 to 3 rotation

Chapter 3 is now "Tokenization, הטקסט מתפרק", built to this standard. It was implemented by
moving the existing Tokenization chapter from slot 5 up to slot 3, directly after Chapter 2
("מה באמת נכנס למודל"), and shifting the two displaced chapters down:

- Chapter 3: טוקניזציה (Tokenization) - rebuilt with DiscoveryGuess, extended lab, נעילת הבנה.
- Chapter 4: הלב ההסתברותי (probability) - relocated from old chapter 3.
- Chapter 5: מילה אחר מילה (word by word) - relocated from old chapter 4.

The full record (file moves, quizData and courseData changes, cross-reference fixes, archived
old copy) is in `CH3_MIGRATION_NOTES.md`. Note that `CHAPTER_ARCHITECTURE_PLAN.md` and the
`Doc/behind-the-scenes-ai-canonical-audit.md` map are now stale on the numbering of chapters 3
to 5; `CH3_MIGRATION_NOTES.md` is the current source of truth for the rotation.

The chapter continues naturally from Chapter 2: Chapter 2 established that the model starts from
what the learner actually wrote, and Chapter 3 shows that this written text is broken into tokens
before any deeper processing.
