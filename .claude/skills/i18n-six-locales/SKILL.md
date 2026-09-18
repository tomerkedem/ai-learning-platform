\---

name: i18n-six-locales

description: Apply and validate learner-facing copy changes across the six supported locales: Hebrew, English, Spanish, Russian, Arabic, and Japanese. Use whenever learner-visible text, labels, messages, captions, assessment copy, or localized UI changes.

\---



\# Six-Locale i18n



\## Supported locales



Every learner-facing localized feature supports:



\- he - Hebrew

\- en - English

\- es - Spanish

\- ru - Russian

\- ar - Arabic

\- ja - Japanese



A localized copy change is incomplete until all six locales are aligned.



\## Core rule



When learner-visible text changes:



1\. identify the exact dictionary key or keys

2\. update all six locales

3\. preserve semantic meaning

4\. preserve pedagogical intent

5\. preserve the level of certainty

6\. verify dictionary parity

7\. validate relevant RTL/LTR rendering



Do not leave a Hebrew or English fallback unless the architecture

explicitly requires one.



\## Scope discipline



When asked to change one string:



change that string only across the six locales.



Do not:



\- rewrite surrounding copy

\- improve unrelated wording

\- rename unrelated keys

\- reorganize dictionaries

\- reformat locale files

\- change learning content

\- introduce new concepts



A localization task is not permission for a content-editing pass.



\## Translation quality



Translate naturally for each language.



Do not mechanically preserve source-language sentence structure when it

produces unnatural wording.



Preserve:



\- meaning

\- teaching purpose

\- terminology

\- tone

\- emphasis

\- uncertainty

\- logical relationships



If the source says:



\- may

\- can

\- might

\- often

\- typically

\- sometimes



preserve that uncertainty.



Never strengthen the claim during translation.



\## Technical terminology



Preserve established technical terminology consistently.



Terms such as:



\- token

\- embedding

\- attention

\- context

\- logits

\- softmax

\- decoding

\- agent

\- model



must follow the terminology already established in each locale.



Before inventing a new translation for an established technical term,

inspect its existing usage in that locale.



Consistency is more important than literal translation.



\## Hebrew source



When the repository uses Hebrew as the structural source dictionary:



\- preserve its key structure

\- preserve type inference

\- ensure all other locales match

\- do not use Hebrew learner-facing copy as fallback for another locale



Structural source does not mean other languages should sound translated

from Hebrew.



Each locale should read naturally.



\## Dictionary parity



After changing dictionary structure:



verify all six locales contain the same required keys.



Do not:



\- add a key to only one locale

\- silently omit a translation

\- leave placeholder copy

\- copy Hebrew into another locale

\- copy English into another locale as a temporary fallback



If TypeScript derives locale shape from the Hebrew dictionary, use that

type checking as one parity check, but do not rely on it as the only

quality check.



\## contentLocale



Preserve the correct content locale.



Expected values:



\- he -> he-IL

\- en -> en-US unless the existing module establishes another English locale

\- es -> existing Spanish contentLocale

\- ru -> existing Russian contentLocale

\- ar -> existing Arabic contentLocale

\- ja -> existing Japanese contentLocale



Follow the repository's established values.



Do not invent or normalize locale identifiers without a requirement.



Never leave another language using the Hebrew contentLocale.



\## RTL / LTR



RTL:



\- he

\- ar



LTR:



\- en

\- es

\- ru

\- ja



When copy changes materially affect rendering, validate:



\- direction

\- alignment

\- punctuation

\- wrapping

\- icon placement

\- inline controls

\- badges

\- labels

\- numbers mixed with text



Do not assume Hebrew rendering proves Arabic rendering.



\## Length-sensitive languages



Pay additional attention to:



ES

RU



because translated copy may become substantially longer.



Check:



\- wrapping

\- button width

\- cards

\- labels

\- segmented controls

\- captions



Do not shorten a correct translation merely to make the layout work.



Fix responsive layout when layout is the real problem.



\## Japanese



Check Japanese independently for:



\- wrapping

\- punctuation

\- compact labels

\- line breaks

\- technical terminology



Do not assume LTR Latin-language behavior predicts Japanese layout.



\## Arabic



Check Arabic independently for:



\- RTL direction

\- punctuation

\- mixed Latin technical terms

\- numbers

\- controls

\- alignment



Do not use Hebrew as the only RTL validation.



\## Learner-facing precision



For educational content, translation must preserve the exact strength of

the underlying claim.



Especially protect distinctions such as:



\- representation vs meaning

\- probability vs decision

\- score vs probability

\- token vs word

\- model input vs user message

\- similarity vs equality

\- can vs always



If a translation changes the technical claim, it is incorrect even if it

sounds fluent.



\## Redundancy



Do not introduce repetition through translation.



If a caption is intentionally a takeaway rather than a restatement in

the source language, preserve that role in every locale.



Do not translate two differently purposed sentences into effectively the

same sentence.



\## UI labels



For utility controls such as:



\- theme

\- focus mode

\- read aloud

\- navigation



prefer short, natural labels.



Do not expose internal identifiers such as:



system

light

dark



as untranslated learner-facing text unless that is the established

product wording.



Internal keys remain stable and untranslated.



Visible labels are localized.



\## Visual validation



For a small copy change:



Primary:

\- HE

\- EN



Also inspect another locale only when the change creates a known risk.



For substantial copy/UI changes:



\- HE

\- EN

\- AR

\- ES or RU

\- JA



Do not generate a six-language screenshot matrix for every one-line

change.



Use evidence-based coverage.



\## Browser validation



When rendering could be affected:



use the real application.



Check the actual component rather than reasoning only from string length.



Look for:



\- overflow

\- clipping

\- awkward wrapping

\- broken RTL

\- control resizing

\- unexpected height changes



\## Testing



Do not create unit tests solely for localization copy changes unless

explicitly requested.



Prefer:



\- TypeScript type checking

\- lint on changed files

\- git diff --check

\- production build

\- targeted browser validation



\## Diff discipline



Localization changes should produce a surgical diff.



For a one-key change across six locales, expect approximately one

learner-facing change per locale.



Investigate unexpected formatting or unrelated changes.



Do not run automatic formatters across locale files unless required.



\## Reporting



For a small localization change, report concisely:



\- key changed

\- six final strings

\- parity result

\- validation result



For larger localization work:



\- keys changed

\- locales changed

\- semantic/terminology decisions

\- RTL/LTR result

\- overflow result

\- validation



Do not produce a large localization audit unless explicitly requested.

