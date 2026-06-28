# Project Instructions

This is a Next.js App Router project containing interactive learning modules about how AI works.

The main active course is:

**מאחורי הקלעים של AI**

English title:

**Behind the Scenes of AI**

Course type:

**לומדה אינטראקטיבית ללמידה עצמית**

Do not call it a book or booklet.

## Premium 2026 quality standard

This is a global standard. It applies to every chapter in the Behind the Scenes of AI course, not only chapter 4.

We are in 2026, in the AI era. This course must not feel like ordinary e-learning. Every chapter must feel like a premium interactive learning experience that uses AI-era product quality:

- live visual explanation
- real learner interaction
- phone-first design
- responsive across mobile, tablet, and desktop
- multilingual from the start
- RTL and LTR safe
- TTS-ready structure
- reduced-motion support
- meaningful animation
- no decorative-only visuals
- no hover-only learning
- a memorable "wow" moment for difficult concepts
- a clear practical insight at the end

This does not mean every chapter needs heavy 3D or complex animation. It means every chapter must have a strong learning interaction where the learner can see or touch the core idea.

### Chapter quality gate

Before implementing any chapter, Claude must ask and answer:

1. What is the hard idea in this chapter?
2. What will the learner see that makes it obvious?
3. What will the learner touch or change?
4. What is the "wow" moment?
5. How does this work on a phone?
6. How does this work in all six locales?
7. What text supports future read-aloud narration?
8. What is the practical insight?

### Warning

Do not propose ordinary pages made mostly of cards, long text, and decorative animation.

If the chapter concept is difficult, the visualization must do real teaching.

## Source of truth

For the Behind the Scenes of AI course, do not rely on old prompts or old planning files.

Use the current documentation anchors under:

```text
docs/
```

Read only the docs relevant to the task.

The current source of truth is the `docs/behind-ai-*.md` documentation set.

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

## Current course planning rule

The current Behind the Scenes of AI plan is based on 19 chapters and 6 systems.

Do not reintroduce the old 16-chapter framing.

Do not reintroduce the old 5-system framing unless explicitly requested.

The central example anchor is packages and deliveries:

- package did not arrive
- delivery status
- tracking
- delivery contradiction
- customer service response
- Agent action around a shipment

## i18n rule

The course targets six locales:

```text
he, en, es, ru, ar, ja
```

RTL:

```text
he, ar
```

LTR:

```text
en, es, ru, ja
```

When working on i18n, follow:

```text
docs/behind-ai-i18n-rules.md
```

Do not translate stable internal keys.

Do not hardcode Hebrew in non-Hebrew routes.

## Writing and content rules

Hebrew should be natural, not translated from English.

English, Spanish, Russian, Arabic, and Japanese should be natural and localized, not literal translations.

The course is for curious regular learners, not programmers.

Prefer active learning:

```text
guess -> see -> touch -> understanding lock -> practical insight -> 5-question quiz
```

Do not over-expand content.

Avoid turning chapters into long articles.

Every chapter should teach one clear central idea.

The package and delivery anchor should be used naturally, not forced into every sentence.

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

- Hebrew text
- English text
- UI labels
- Page content
- Component text
- Course content
- Markdown text
- Comments that may be displayed
- Visible educational explanations

Do not alter a normal Hebrew maqaf or a regular hyphen.

## Mentor rules

The mentor is not decoration.

Use mentor characters only when they support learning, curiosity, confidence, warning, or action.

For detailed mentor rules, read:

```text
docs/behind-ai-mentor-rules.md
```

## Animation rules

Animation is a thinking tool, not decoration.

Use animation to reveal processes, show causality, and create clear learning moments.

For detailed animation rules, read:

```text
docs/behind-ai-animation-rules.md
```

## Visual and layout rules

Preserve the existing premium interactive course style.

Respect RTL and LTR behavior.

Do not mirror the full layout blindly.

For mentor placement in translated pages, prefer direction-aware placement over image flipping when possible.

Use visual polish only when it supports the learning goal.

## Safety rule for old files

Ignore deprecated prompts or old planning files if they conflict with the docs under `docs/`.

Do not use removed or deprecated files such as old Master Prompt documents as planning sources.

## Implementation discipline

Keep tasks small.

Do not mix unrelated changes in one implementation.

Do not combine chapter reordering, i18n, visual redesign, quiz changes, assets, and animations in one task unless explicitly requested.

When uncertain, stop and report the risk before editing.
