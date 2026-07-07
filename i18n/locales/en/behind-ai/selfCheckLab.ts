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
        'All the drafts and the source here are a teaching example, not a check of a real tracking system. The check is visible: a checklist and a comparison of claims against the source, with no exposure of hidden thoughts. A self-check improves the answer, but it does not guarantee truth.',
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
            summary: 'Invents nothing, but also does not use the information that is in the source.',
            draft: 'I do not know where the package is.',
            claims: [
                { id: 'unused', text: 'An available fact goes unused', state: 'missing', note: 'Missed. The source says "Delayed", and the answer ignores it.' },
            ],
            checks: [
                { id: 'question', state: 'warn', label: 'Answers the question?', note: 'Partly. It gives the customer no useful information.' },
                { id: 'source', state: 'fail', label: 'Rests on the source?', note: 'No. The source says "Delayed", and the answer does not use it.' },
                { id: 'invents', state: 'pass', label: 'Invents an arrival date?', note: 'No. And that is good, there is nothing invented here.' },
                { id: 'missing', state: 'warn', label: 'States what is missing?', note: 'Not really. It says "I do not know" without separating what is known from what is not.' },
                { id: 'confidence', state: 'warn', label: 'Confidence level fits?', note: 'Too low. There is a fact that could be given with reasonable confidence.' },
            ],
            issue: 'The check found that the answer is safe, but wastes information: the source does say "Delayed", and that can be shared.',
            revised: 'According to the source, the package is marked as delayed. There is still no confirmed arrival date, so I will not commit to a date.',
            revisedNote: 'The check works the other way too: it brought back the supported fact that was missed.',
            takeaway: 'A self-check does not only delete claims. Sometimes it adds supported information that was missed.',
        },
        {
            id: 'grounded',
            control: 'Balanced',
            badge: 'checked',
            badgeLabel: 'Passed the check',
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
            revisedNote: 'When the draft already rests on the source, the check simply confirms it. Not every check ends in a fix.',
            takeaway: 'A self-check is a control step, not always a rewrite. A grounded draft passes it cleanly.',
        },
    ],
};
