# Project Instructions

This is a Next.js App Router project containing interactive learning modules about how AI works.

The main active course is:

**מאחורי הקלעים של AI**

English title:

**Behind the Scenes of AI**

Course type:

**לומדה אינטראקטיבית ללמידה עצמית**

Do not call it a book, booklet, article, or static course.

## Top priorities

Claude must optimize for:

1. Learning clarity
2. Small safe changes
3. Existing project style
4. Phone-first interaction
5. RTL and LTR correctness
6. Natural multilingual content
7. Accessibility and TTS readiness
8. No unnecessary code

When priorities conflict, choose the solution that teaches the concept clearly with the smallest safe implementation.

Premium quality means the clearest learning experience with the smallest safe implementation.

Do not confuse premium experience with more code, more abstractions, more animation, more components, or more visual noise.

## Premium 2026 quality standard

This is a global quality standard. It applies to every chapter in the Behind the Scenes of AI course, not only to one chapter.

We are in 2026, in the AI era. This course must not feel like ordinary e-learning. Every chapter must feel like a premium interactive learning experience that uses AI-era product quality.

Each chapter should include, when relevant:

* live visual explanation
* real learner interaction
* phone-first design
* responsive behavior across mobile, tablet, and desktop
* multilingual content from the start
* RTL and LTR safe layout
* TTS-ready structure
* reduced-motion support
* meaningful animation
* no decorative-only visuals
* no hover-only learning
* a memorable learning moment for difficult concepts
* a clear practical insight at the end

Premium does not mean heavy 3D, complex animation, or more visual layers.

Premium means the learner can clearly see or touch the core idea.

If a visual, animation, mentor, card, or interaction does not teach something, guide the learner, build confidence, or clarify causality, it should not be added.

## Chapter quality gate

Before implementing or redesigning any chapter, Claude must ask and answer:

1. What is the hard idea in this chapter?
2. What will the learner see that makes it obvious?
3. What will the learner touch, change, compare, or decide?
4. What is the memorable learning moment?
5. How does this work on a phone?
6. How does this work in all six locales?
7. What text supports future read-aloud narration?
8. What is the practical insight?
9. What is the smallest safe implementation that achieves this?

Do not propose ordinary pages made mostly of cards, long text, and decorative animation.

If the chapter concept is difficult, the visualization must do real teaching.

## Source of truth

For the Behind the Scenes of AI course, do not rely on old prompts, old planning files, or previous assumptions.

Use the current documentation anchors under:

```text
docs/
```

Read only the docs relevant to the task.

The current source of truth is the `docs/behind-ai-*.md` documentation set.

Ignore deprecated prompts or old planning files if they conflict with the docs under `docs/`.

Do not use removed or deprecated files such as old Master Prompt documents as planning sources.

## Required docs by task type

### Any task in the Behind the Scenes of AI course

Read:

```text
docs/behind-ai-final-chapter-plan.md
docs/behind-ai-chapter-template.md
```

### i18n or localization tasks

Also read:

```text
docs/behind-ai-i18n-rules.md
```

### UI, layout, visual polish, or mentor placement tasks

Also read:

```text
docs/behind-ai-visual-rules.md
docs/behind-ai-mentor-rules.md
```

### Animation or interactive experience tasks

Also read:

```text
docs/behind-ai-animation-rules.md
docs/behind-ai-visual-rules.md
```

### Reordering chapters, routing, progress, quizzes, or implementation sequencing

Also read:

```text
docs/behind-ai-implementation-roadmap.md
docs/behind-ai-claude-workflow.md
```

## Work protocol

Before editing files:

1. Run `git status`.
2. Run `git pull --ff-only`.
3. Run `git log --oneline -10`.
4. Read the relevant docs from `docs/`.
5. Audit the relevant files.
6. Report findings and an exact file-change plan.
7. Wait for approval before editing, unless the user explicitly approved implementation.

After editing:

1. Run `npx tsc --noEmit`.
2. Run eslint on changed files.
3. Run relevant route checks.
4. Report changed files, verification results, risks, and final git status.
5. Do not commit or push unless explicitly instructed.

If a check fails, report the exact failure and the likely cause.

Do not hide verification failures.

## Current course planning rule

The current Behind the Scenes of AI plan is based on 19 chapters and 6 systems.

Do not reintroduce the old 16-chapter framing.

Do not reintroduce the old 5-system framing unless explicitly requested.

The central example anchor is packages and deliveries:

* package did not arrive
* delivery status
* tracking
* delivery contradiction
* customer service response
* Agent action around a shipment

Use the package and delivery anchor naturally.

Do not force it into every sentence.

## i18n rule

The course targets six locales:

```text
he, en, es, ru, ar, ja
```

RTL locales:

```text
he, ar
```

LTR locales:

```text
en, es, ru, ja
```

When working on i18n, follow:

```text
docs/behind-ai-i18n-rules.md
```

Do not translate stable internal keys.

Do not hardcode Hebrew in non-Hebrew routes.

Do not assume that a layout that works in Hebrew automatically works in English, Spanish, Russian, Arabic, or Japanese.

Do not blindly mirror the full layout.

For mentor placement in translated pages, prefer direction-aware placement over image flipping when possible.

## Writing and content rules

Hebrew should be natural, direct, and not translated from English.

English, Spanish, Russian, Arabic, and Japanese should be natural and localized, not literal translations.

The course is for curious regular learners, not programmers.

Prefer active learning:

```text
guess -> see -> touch -> understanding lock -> practical insight -> 5-question quiz
```

Do not over-expand content.

Avoid turning chapters into long articles.

Every chapter should teach one clear central idea.

Every paragraph must earn its place.

Prefer short, clear, spoken-language explanations that can later support read-aloud narration.

Avoid jargon unless the chapter teaches it directly.

When jargon is required, reveal it through the interaction before naming it.

## Never use Em dash or En dash

Never use the Em dash character or En dash character in project text.

Forbidden:

```text
—
–
```

Use a regular hyphen instead:

```text
-
```

Or rewrite the sentence naturally without a dash.

This rule applies to all user-facing and project text, including:

* Hebrew text
* English text
* UI labels
* page content
* component text
* course content
* markdown text
* comments that may be displayed
* visible educational explanations

Do not alter a normal Hebrew maqaf or a regular hyphen.

## Mentor rules

The mentor is not decoration.

Use mentor characters only when they support learning, curiosity, confidence, warning, explanation, or action.

The mentor should never replace the learning interaction.

The mentor should guide attention, reduce confusion, or strengthen the emotional rhythm of the chapter.

For detailed mentor rules, read:

```text
docs/behind-ai-mentor-rules.md
```

## Animation rules

Animation is a thinking tool, not decoration.

Use animation to reveal processes, show causality, compare states, show change over time, or create a clear learning moment.

Do not add animation only to make the page feel busy.

Respect reduced-motion support.

No core learning should depend only on motion.

For detailed animation rules, read:

```text
docs/behind-ai-animation-rules.md
```

## Visual and layout rules

Preserve the existing premium interactive course style.

Respect RTL and LTR behavior.

Use visual polish only when it supports the learning goal.

Do not add decorative cards, icons, gradients, or effects that do not clarify the concept.

No hover-only learning.

Every important interaction must work on touch devices.

Phone-first means the experience must remain clear and useful on a small screen, not merely shrink to fit.

## Accessibility and narration readiness

Structure text so it can support future read-aloud narration.

Do not rely on color alone to explain meaning.

Do not rely on hover alone to reveal learning content.

Use clear labels for interactive controls.

Use reduced-motion safe behavior.

Keep text readable on mobile.

Do not place essential content only inside complex visuals without a textual explanation.

## Implementation discipline

Keep tasks small.

Before writing code, Claude must prefer the smallest safe change that solves the actual problem.

Use the following implementation ladder before adding new code, new abstractions, or new dependencies:

1. Does this change actually need to exist?
2. Can the issue be solved by removing, simplifying, or reusing existing code?
3. Does the standard library already solve it?
4. Does Next.js, React, TypeScript, CSS, HTML, or the browser already provide a native solution?
5. Does an already installed dependency solve it safely?
6. Can the change be expressed as a small local edit?
7. If none of the above is enough, implement the minimum working solution.

Do not add a new dependency unless it is clearly justified.

Do not create a new abstraction for a single use case.

Do not introduce wrappers, helpers, configuration layers, custom hooks, or shared utilities unless there is a proven repeated need.

Do not rewrite working code just to make it look cleaner.

Do not perform broad refactors while fixing a local issue.

Do not mix unrelated changes in one implementation.

Do not combine chapter reordering, i18n, visual redesign, quiz changes, assets, and animations in one task unless explicitly requested.

When proposing a change, Claude must explicitly state why the chosen solution is the smallest safe option.

When uncertain, stop and report the risk before editing.

## Dependency discipline

Do not install a new package unless all of the following are true:

1. The need is real and current.
2. Native browser, React, Next.js, TypeScript, CSS, or existing project code cannot solve it cleanly.
3. An existing installed dependency cannot solve it safely.
4. The package meaningfully reduces complexity.
5. The package does not create unnecessary security, bundle size, maintenance, or i18n risk.

If a dependency is proposed, report:

* why it is needed
* what alternatives were checked
* expected bundle or maintenance impact
* why a native solution is not enough

Do not install dependencies without explicit approval.

## Refactor discipline

Refactoring is allowed only when it directly supports the requested task or removes real risk.

Do not refactor because code could be prettier.

Do not rename, move, or restructure files unless the task requires it.

Do not change public behavior while performing a cleanup unless explicitly requested.

If a refactor is needed, explain the reason and scope before editing.

## Component discipline

Prefer existing components and patterns.

Do not create a new shared component for one usage.

Do not create a new hook unless it clearly removes repeated logic or isolates meaningful state behavior.

Do not create generic utilities before there are repeated cases.

Do not hide simple logic behind unnecessary abstraction.

Prefer local readable code over premature architecture.

## Interaction discipline

Every chapter should include a meaningful learner action.

Good interactions include:

* guess before reveal
* compare two states
* move a slider
* choose between options
* inspect a live process
* step through a sequence
* reveal cause and effect
* test a small misconception
* lock in understanding before continuing

Bad interactions include:

* clicking only to reveal long text
* decorative toggles
* hover-only explanations
* animations that do not change understanding
* cards that only restate content

## Chapter structure preference

Prefer this learning rhythm when suitable:

```text
hook -> guess -> visual reveal -> learner control -> explanation -> understanding lock -> practical insight -> quiz
```

Do not force this structure if a chapter needs a different shape.

But every chapter should still have:

* one central idea
* one strong visual or interactive teaching mechanism
* one practical insight
* one clear learner takeaway

## Practical insight rule

Every chapter must end with a clear practical insight.

The insight should answer:

```text
What should the learner understand or do differently after this chapter?
```

The insight should be concrete, not motivational filler.

## Quiz rule

Each chapter should support a 5-question quiz unless the task explicitly excludes quizzes.

Quiz questions should test understanding, not memory of wording.

Prefer questions that expose misconceptions.

Do not make quizzes feel like school tests.

## Git and delivery discipline

Do not commit unless explicitly instructed.

Do not push unless explicitly instructed.

Before final reporting, check final git status.

Final report must include:

* what changed
* files changed
* checks run
* check results
* known risks
* final git status
* whether commit or push was performed

If no files were changed, say so clearly.

## Security and sensitive project rule

Do not expose secrets.

Do not print environment variables that may contain secrets.

Do not add credentials to code, docs, examples, or logs.

Do not weaken validation, authentication, authorization, error handling, or security boundaries as part of UI or learning-experience work.

If a requested change creates security risk, stop and report the risk.

## Final rule

The goal is not to produce more code.

The goal is to produce a clearer, safer, more memorable learning experience with the smallest responsible implementation.
