\---

name: visual-qa

description: Validate learner-facing UI changes in a real browser with focused responsive, visual, accessibility, RTL/LTR, and regression checks. Use after meaningful UI, layout, responsive, theme, color, or interaction changes.

\---



\# Visual QA



Use this skill for learner-facing visual changes.



\## Goal



Validate the actual rendered product in a real browser.



Prioritize product quality and real learner experience over exhaustive

test automation.



Do not rely only on:



\- source-code inspection

\- DOM inspection

\- one viewport

\- geometry measurements

\- automated screenshots



Do not generate large screenshot matrices unless explicitly requested.



\## Primary viewports



Prioritize:



\- 1366x768

\- 1440x900

\- 1536x864

\- 390x844

\- 360x740



Use additional sizes only when the component or defect requires them.



1366x768 is a first-class laptop target.



\## Responsive validation



Validate both WIDTH and HEIGHT.



Check:



\- clipping

\- horizontal overflow

\- internal scrolling

\- viewport fit

\- sticky/fixed chrome

\- readable line length

\- touch-target usability

\- control wrapping

\- layout shift

\- open/close transitions

\- dynamic interaction states



Do not declare a component responsive based only on width breakpoints.



\## Open learning units



When an interactive learning unit opens:



\- it should become the current learning focus

\- if it fits in the available learning viewport, show it completely

\- center it vertically when appropriate

\- account for persistent header/chrome

\- if it cannot fit without harming readability, use natural page scrolling

\- avoid internal scrollbars

\- never shrink typography merely to claim that it fits



\## Visual quality



Evaluate whether the experience feels:



\- mature

\- calm

\- premium

\- professional

\- educational

\- technically sophisticated



Flag visual treatment that feels:



\- neon

\- gamer-like

\- dashboard-like

\- demo-like

\- excessively saturated

\- unnecessarily decorative

\- visually exhausting



Strong color should communicate:



\- identity

\- state

\- interaction

\- semantic meaning

\- pedagogical relationships



Decoration alone is not sufficient justification for strong color.



\## Color discipline



Prefer hierarchy through:



1\. layout

2\. typography

3\. whitespace

4\. surface hierarchy

5\. borders

6\. accent color

7\. glow



Do not use glow to compensate for weak hierarchy.



Pedagogical colors must retain their learning meaning.



Do not normalize pedagogical data colors into generic brand colors.



\## Theme validation



When theme-related code changes:



\### Dark



The approved Dark experience is the baseline.



Do not accept visible Dark regressions unless explicitly requested.



\### Light



Do not treat Light as inverted Dark.



Check:



\- comfortable page luminance

\- no pure-white glare

\- readable secondary text

\- restrained borders

\- appropriate elevation

\- station identity

\- pedagogical colors

\- semantic states

\- focus visibility



Dark-only glow should normally not be reproduced on Light.



\### System



Verify:



\- prefers-color-scheme resolution

\- explicit Light override

\- explicit Dark override

\- persistence

\- live OS-theme changes while System is active

\- first-paint behavior

\- no theme flash

\- no hydration regression



\## Dark parity



When migrating approved Dark styling to tokens or theme infrastructure:



Dark parity is a hard gate.



Compare representative before/after states.



Any visible difference that is not required by the task is a regression.



Do not call a visible difference acceptable merely because the new

architecture is cleaner.



Use a small representative comparison set rather than hundreds of

screenshots.



\## Languages



For substantial visual changes:



Primary:

\- HE

\- EN



RTL smoke:

\- AR



Long-copy smoke:

\- ES

\- RU



Wrapping smoke:

\- JA



Do not run a full six-language screenshot matrix unless evidence

requires it.



\## Accessibility



Check where relevant:



\- visible focus

\- keyboard operation

\- text contrast

\- meaningful non-text contrast

\- state not communicated only by color

\- accessible names

\- reduced motion

\- no invisible focusable elements



Use WCAG AA as the minimum text-contrast target.



\## Dynamic geometry



For interactive content that changes after opening:



\- inspect the final geometry

\- detect layout shift

\- ensure delayed reveals do not break viewport fit

\- reserve geometry only when justified

\- do not duplicate learning logic merely to reserve space



\## Regression discipline



Before fixing a visual problem:



1\. reproduce it

2\. identify the owning component/state

3\. identify the root cause

4\. make the smallest correct change

5\. validate the affected state

6\. verify representative unaffected states



Do not fix unrelated findings.



\## Browser validation



Use a real browser for learner-facing UI changes.



Exercise the actual interaction when relevant:



\- open

\- close

\- toggle

\- selection

\- action

\- reveal

\- replay

\- result change



Do not infer runtime quality solely from code.



\## Artifacts



Screenshots and temporary measurements belong in scratch/temp space.



Do not write large QA artifacts into the repository unless explicitly

requested.



Do not create large audit directories as a side effect of normal

development.



\## Testing



Do not create or modify unit tests for visual-only work unless explicitly

requested.



Prefer lean validation:



\- TypeScript compile

\- lint on changed files

\- git diff --check

\- production build

\- real-browser validation



Do not run large test suites unless they materially validate the task or

the user explicitly requests them.



\## Scope



Stay within the requested visual scope.



If an unrelated issue is discovered:



report it briefly if important.



Do not fix it.



Do not turn a focused UI task into a general audit.



\## Final report



Keep reports concise and decision-oriented.



Include:



\- what changed

\- what was validated

\- important viewports

\- important states

\- regressions found

\- regressions fixed

\- remaining limitations

\- whether product-owner review is required



Do not produce a large audit report unless explicitly requested.

