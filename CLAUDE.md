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

Premium quality means the clearest learning experience with the smallest safe implementation, not more code, abstractions, animation, components, or visual noise.

## Execution modes

Use the lightest workflow that safely fits the task.

### Fast path - small local changes

Use for a clearly scoped change to one page, component, asset, copy block, or local layout.

1. Read only the target file and direct dependencies needed to edit it.
2. Do not read the full documentation set unless the change affects learning structure, shared behavior, i18n rules, or a cross-chapter standard.
3. Do not audit the full repository.
4. If implementation was explicitly approved, edit immediately after a brief targeted inspection.
5. Prefer targeted search over broad scans.
6. Keep progress messages short and do not restate the full task.
7. Do not run Playwright or a production build before implementing.
8. Validate using the smallest relevant subset of the Validation contract below.
9. Run `npm run build`, full locale checks, or broad browser matrices only when shared code changed, routing/build/locale structure changed, the user explicitly requested them, or focused checks reveal risk.
10. Do not expand scope after the requested result is achieved.

### Standard path - broad or high-risk changes

Use the full workflow for chapter redesigns, learning-flow changes, shared components used by multiple chapters, i18n structure or six-locale content changes, quizzes, routing, progress, TTS, accessibility infrastructure, interaction logic, dependencies, security, authentication, data models, broad refactors, or tasks where scope or impact is uncertain.

When unsure, begin with the fast path and escalate only when concrete risk is found.

Use the project's installed Skills (for example `visual-qa`, `i18n-six-locales`) whenever a task matches what they cover, as detailed in the Validation contract.

## Source of truth and required docs by task type

For the Behind the Scenes of AI course, do not rely on old prompts, old planning files, or previous assumptions. The current source of truth is the `docs/behind-ai-*.md` documentation set under `docs/`. Ignore deprecated prompts or old planning files, including old Master Prompt documents, if they conflict with `docs/`.

Read documentation just in time, not by default. Read only the docs relevant to the task, and stop reading once enough context exists to make the change safely.

- Small local UI, copy, asset, or mentor adjustment: `docs/behind-ai-visual-rules.md`, `docs/behind-ai-mentor-rules.md` (only when needed; do not read the chapter plan or template for a local visual tweak that does not change learning structure).
- Chapter content, structure, or learning-flow work: `docs/behind-ai-final-chapter-plan.md`, `docs/behind-ai-chapter-template.md`.
- i18n or localization work: `docs/behind-ai-i18n-rules.md`, and the `i18n-six-locales` skill for locale-copy validation. Six locales: `he, en, es, ru, ar, ja`. RTL: `he, ar`. LTR: `en, es, ru, ja`. Do not hardcode Hebrew in non-Hebrew routes, and do not assume a layout that works in Hebrew automatically works in the other five locales.
- Animation or interactive experience work: `docs/behind-ai-animation-rules.md`, `docs/behind-ai-visual-rules.md`.
- Reordering chapters, routing, progress, quizzes, or implementation sequencing: `docs/behind-ai-implementation-roadmap.md`, `docs/behind-ai-claude-workflow.md`.

Do not load unrelated docs.

## Work protocol

### Before editing

Fast path: run `git status --short`, inspect only the target file and direct dependencies, confirm the smallest safe edit, and edit without a separate audit report if implementation is already approved.

Standard path: run `git status --short`, check the current branch and recent history only when needed, read the relevant docs, audit the affected files and consumers, report a concise file-change plan, and wait for approval unless implementation was explicitly approved.

Do not run `git pull` automatically when the working tree is dirty or the user did not ask to synchronize. Use `git fetch` or a read-only comparison only when ancestry matters.

### After editing

Inspect the diff, then run the checks in the Validation contract below, at the depth appropriate to the path. If a check fails, report the exact failure and likely cause. Do not hide failures. Do not commit or push unless explicitly instructed.

## Engineering discipline

Keep tasks small. Before writing code, prefer the smallest safe change that solves the actual problem. Use this ladder before adding new code, abstractions, or dependencies:

1. Does this change actually need to exist?
2. Can it be solved by removing, simplifying, or reusing existing code?
3. Does the standard library already solve it?
4. Does Next.js, React, TypeScript, CSS, HTML, or the browser already provide it?
5. Does an already installed dependency solve it safely?
6. Can it be expressed as a small local edit?
7. If none of the above is enough, implement the minimum working solution.

Do not create a new abstraction, wrapper, helper, configuration layer, custom hook, or shared utility for a single use case; only introduce one when there is a proven repeated need. Do not create a new shared component for one usage.

Do not refactor because code could be prettier, rename/move/restructure files unless the task requires it, or change public behavior during a cleanup unless explicitly requested. If a refactor is needed, explain the reason and scope before editing.

Do not mix unrelated changes in one implementation. Do not combine chapter reordering, i18n, visual redesign, quiz changes, assets, and animation in one task unless explicitly requested.

When proposing a change, state why the chosen solution is the smallest safe option. When uncertain, stop and report the risk before editing.

## Dependency discipline

Do not install a new package unless all of the following are true: the need is real and current; no native browser, React, Next.js, TypeScript, or CSS solution, and no existing project code, solves it cleanly; no existing installed dependency solves it safely; the package meaningfully reduces complexity; and it does not create unnecessary security, bundle size, maintenance, or i18n risk.

If a dependency is proposed, report why it is needed, what alternatives were checked, expected bundle or maintenance impact, and why a native solution is not enough. Do not install dependencies without explicit approval.

## Em dash / en dash prohibition

Never use the em dash (—) or en dash (–) anywhere in project text or code, in any language (Hebrew, English, or otherwise), including UI labels, content, comments, and documentation. Use a regular hyphen (-) instead, or rewrite the sentence. Do not alter a normal Hebrew maqaf or a regular hyphen.

## Git and delivery discipline

Do not commit unless explicitly instructed. Do not push unless explicitly instructed. Before final reporting, check final git status.

Keep reporting proportional to the task: do not repeat the user's request, do not narrate routine searches, file reads, or successful checks, and use a short summary instead of a numbered audit for small changes. Mention only actionable risks, and do not generate large validation matrices unless requested or justified by shared impact.

Final report must briefly include: what changed and which files, checks run and their results, actionable known risks (if any), final git status, and whether commit or push was performed. If no files were changed, say so clearly.

## Security

Do not expose secrets or print environment variables that may contain secrets. Do not add credentials to code, docs, examples, or logs. Do not weaken validation, authentication, authorization, error handling, or security boundaries as part of UI or learning-experience work. If a requested change creates security risk, stop and report the risk before proceeding.

## Validation contract

This is the only canonical validation checklist. Validate only what is relevant to the change.

Default code validation:

- `npx tsc --noEmit`
- ESLint on changed TS/TSX files
- `git diff --check`
- `npm run build` (only when shared code, routing, build behavior, or locale structure changed, or the user requested it)

Learner-facing UI changes additionally use the `visual-qa` skill and real-browser validation.

Learner-visible copy changes additionally use the `i18n-six-locales` skill.

Do not create, modify, or run unit tests unless the task explicitly requires them. Do not run unrelated validation suites merely for completeness.

Never report a check as passed unless it was actually run and passed. Report failures exactly.

## Session handoff

Do not preserve raw investigation history between sessions. When a task must continue in a new session, preserve only: goal, confirmed findings, decisions already made, files changed, validation completed, known blockers or unresolved questions, and the exact next step.

Do not carry forward raw tool output, abandoned hypotheses, repeated file contents, or exploratory search history. Stable project knowledge belongs in CLAUDE.md, a relevant Skill, or project documentation rather than a task handoff.

## Local dev server

Agents must use `npm run dev:safe` (never `npm run dev` or `next dev`) for local Next.js development servers, and must terminate servers they start after validation.
