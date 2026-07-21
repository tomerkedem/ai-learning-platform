// i18n/locales/en/behind-ai/selfCheckLab.ts
//
// English (en, LTR) data for the "Self-Check Lab" of Chapter 13 (Self-Check: checking the
// answer while answering). Hebrew is the source of truth and defines the type
// (SelfCheckLabContent).
//
// Core idea: one fixed customer question and one fixed source card, with three answer
// drafts. The learner moves between the drafts, too confident, too cautious, and balanced,
// and sees how the same self-check flags what the source supports, what is invented, and
// what is missing, before the answer goes out. The check is visible: a checklist and a
// comparison of claims against the source, with no exposure of hidden thoughts.
//
// Fully deterministic: no randomness, no real model call, and no claim that the source
// comes from a real tracking system. Every example here is a teaching example only.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { SelfCheckLabContent } from '../../he/behind-ai/selfCheckLab';

export const selfCheckLab: SelfCheckLabContent = {
    sectionEyebrow: 'Self-Check Lab',
    sectionTitle: 'Same question, three drafts: what does the check find?',
    sectionIntro:
        'A customer asks where their package is. There is one source card and three answer drafts. Move between them, and see how the same self-check flags what the source supports, what is invented, and what is missing, before the answer goes out to the customer.',
    heading: 'Behind the self-check',
    kicker: 'Self-Check Lab',
    questionLabel: 'Customer question',
    question: 'My package was supposed to arrive yesterday. Where is it?',
    sourceLabel: 'The source provided (sample data)',
    sourceCaption: 'Sample card only, for illustration. This is not real data.',
    sourceNote: 'Note: the source says "Delayed", but gives no arrival date. A good answer will not invent one.',
    sourceRows: [
        { label: 'Barcode', value: 'RR123456789IL' },
        { label: 'Last scan', value: 'Sorting center' },
        { label: 'Status', value: 'Delayed' },
        { label: 'Estimated delivery', value: 'Not available', missing: true },
    ],
    draftLabel: 'Choose a draft',
    claimsLabel: 'Claims in the draft',
    checklistLabel: 'Self-check',
    issueLabel: 'What the check found',
    revisedLabel: 'Revised answer',
    takeawayLabel: 'Bottom line',
    disclaimer:
        'All the drafts and the source here are a teaching example, not a check of a real tracking system. The check is visible: a checklist and a comparison of claims against the source, with no exposure of hidden thoughts. A self-check improves the answer, but it does not guarantee truth, and sometimes it flags a problem that cannot be solved without an external source.',
    sr: {
        draftGroup: 'Choosing the draft',
        checks: 'The self-check checklist of the selected draft',
    },
    modes: [
        {
            id: 'confident',
            control: 'Confident wording',
            badge: 'overclaim',
            badgeLabel: 'Unsupported claim',
            summary: 'Sounds helpful, but part of it does not appear in the source.',
            draft: 'The package is delayed and will arrive tomorrow.',
            claims: [
                { id: 'delay', text: 'The package is delayed', state: 'supported', note: 'Supported. It appears in the source: status delayed.' },
                { id: 'tomorrow', text: 'will arrive tomorrow', state: 'unsupported', note: 'Not supported. The source says estimated delivery not available, so "tomorrow" is a guess.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: 'Answers the question?', note: 'Yes. The customer asked where the package is, and the answer addresses that.' },
                { id: 'source', state: 'warn', label: 'Rests on the source?', note: 'Partly. "Delayed" is taken from the source, but "tomorrow" is not.' },
                { id: 'invents', state: 'fail', label: 'Invents an arrival date?', note: 'Yes. "Will arrive tomorrow" is a date the source lists as not available.' },
                { id: 'missing', state: 'fail', label: 'States what is missing?', note: 'No. The answer does not say that there is no confirmed arrival date.' },
                { id: 'confidence', state: 'fail', label: 'Confidence level fits?', note: 'No. The wording is too confident relative to what the source actually says.' },
            ],
            issue: 'The check found a claim with no support: the source gives no arrival date, so "will arrive tomorrow" is a guess that should be removed.',
            revised: 'According to the tracking data provided here, the package is delayed. There is no confirmed arrival date right now.',
            revisedNote: 'The supported claim (delayed) stayed, the invented date was removed, and the gap is stated explicitly.',
            takeaway: 'An answer can hold a supported claim and an invented claim together. The check separates them.',
        },
        {
            id: 'vague',
            control: 'Too cautious',
            badge: 'overcautious',
            badgeLabel: 'Too cautious',
            summary: 'It invents nothing, but it does not really answer the customer either. You can see this problem even before comparing to the source.',
            draft: 'I do not know where the package is.',
            claims: [
                { id: 'noanswer', text: 'Does not actually answer the question', state: 'missing', note: 'Internal problem. "I do not know" is a dead end, and that is clear without any source.' },
                { id: 'unused', text: 'Ignores a fact that exists', state: 'missing', note: 'Missed. The source says "Delayed", and the answer does not pass it on.' },
            ],
            checks: [
                { id: 'question', state: 'fail', label: 'Answers the question?', note: 'No. "I do not know" gives the customer nothing useful. You can see this without comparing to the source.' },
                { id: 'source', state: 'fail', label: 'Rests on the source?', note: 'No. There is a fact that could have been shared, "Delayed", and the answer ignores it.' },
                { id: 'invents', state: 'pass', label: 'Invents an arrival date?', note: 'No. And that is good, there is no invention here.' },
                { id: 'missing', state: 'warn', label: 'States what is missing?', note: 'Not really. It says "I do not know" without separating what is known from what is not.' },
                { id: 'confidence', state: 'warn', label: 'Confidence level fits?', note: 'Too low. There is a fact that can be shared with reasonable confidence.' },
            ],
            issue: 'The check found an internal problem: the answer does not actually answer the question. "I do not know" is a dead end you can see even before comparing to the source. On top of that, it missed a fact that does exist.',
            revised: 'According to the source, the package is marked as delayed. There is still no confirmed arrival date, so I will not commit to a date.',
            revisedNote: 'Now the answer responds to the customer: it shares what is known instead of a dead end. Self-check does not only delete, sometimes it also completes.',
            takeaway: 'Self-check does not only check against a source. It also asks internal questions: did we answer the question, did we stay clear, did we avoid contradicting ourselves. Here it catches an answer that does not do its job.',
        },
        {
            id: 'grounded',
            control: 'Balanced',
            badge: 'checked',
            badgeLabel: 'Passed the checklist',
            summary: 'Uses the fact from the source, and admits openly what is missing.',
            draft: 'According to the tracking data, the package is delayed. There is no confirmed arrival date yet.',
            claims: [
                { id: 'delay', text: 'The package is delayed', state: 'supported', note: 'Supported. It appears in the source: status delayed.' },
                { id: 'nodate', text: 'There is no confirmed arrival date', state: 'supported', note: 'Supported. It appears in the source: estimated delivery not available.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: 'Answers the question?', note: 'Yes. It gives what is known about the package status.' },
                { id: 'source', state: 'pass', label: 'Rests on the source?', note: 'Yes. Every claim in the answer appears in the source.' },
                { id: 'invents', state: 'pass', label: 'Invents an arrival date?', note: 'No. No date was added.' },
                { id: 'missing', state: 'pass', label: 'States what is missing?', note: 'Yes. It says explicitly that there is no confirmed date.' },
                { id: 'confidence', state: 'pass', label: 'Confidence level fits?', note: 'Yes. Confident about the delay, careful about the date.' },
            ],
            issue: 'The check passed with no unsupported claim. There is nothing to delete and nothing to add.',
            revised: 'According to the tracking data, the package is delayed. There is no confirmed arrival date yet.',
            revisedNote: 'When the draft already rests on the source, the check simply confirms it. Not every check ends in a fix. "Passed the check" means no issue was found in the checklist, not that the information was verified against the world.',
            takeaway: 'A self-check is a control step, not always a rewrite. A grounded draft passes it cleanly.',
        },
        {
            id: 'external',
            control: 'A claim that needs a source',
            badge: 'needsSource',
            badgeLabel: 'Flagged by the check, but cannot verify',
            summary: 'The draft adds a cause that sounds reasonable, but it is not in the source, and self-check alone cannot know if it is true.',
            draft: 'The package is probably stuck at the sorting center and will leave soon.',
            claims: [
                { id: 'stuck', text: 'Stuck at the sorting center', state: 'unsupported', note: 'Not supported. The source says "Sorting center" as the last scan, but does not say it is stuck there. That is an added interpretation.' },
                { id: 'soon', text: 'Will leave soon', state: 'unsupported', note: 'Not supported. There is no time in the source, so "soon" is a guess.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: 'Answers the question?', note: 'Yes. It addresses the package location.' },
                { id: 'source', state: 'fail', label: 'Rests on the source?', note: 'No. "Stuck" and "soon" do not appear in the source.' },
                { id: 'invents', state: 'fail', label: 'Invents a detail?', note: 'Yes. It added a cause and a time with no source.' },
                { id: 'missing', state: 'warn', label: 'States what is missing?', note: 'No. It does not say that the cause cannot be confirmed from this information.' },
                { id: 'confidence', state: 'fail', label: 'Confidence level fits?', note: 'No. It presents a guess as if it were a fact.' },
            ],
            issue: 'The check flags that "stuck at the sorting center" is not supported by the source. But notice: it cannot know whether it is true or not. To verify a cause like this you need an external source, not self-check.',
            revised: 'According to the tracking data provided here, the package is delayed and the last scan was at a sorting center. I cannot confirm from this information why it is delayed or when it will leave. To find out the cause, you would need to check with the shipping system or a representative.',
            revisedNote: 'The check stopped an unsupported claim, but did not turn it into truth. What requires factual verification moves to an external source, and the gap is stated explicitly.',
            takeaway: 'Self-check catches a claim that has no source, but cannot verify it. Factual verification requires a source, a tool, or a person.',
        },
    ],
};
