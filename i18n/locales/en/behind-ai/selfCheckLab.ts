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
// comes from a real library schedule. Every example here is a teaching example only.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { SelfCheckLabContent } from '../../he/behind-ai/selfCheckLab';

export const selfCheckLab: SelfCheckLabContent = {
    sectionEyebrow: 'Self-Check Lab',
    sectionTitle: 'Same question, three drafts: what does the check find?',
    sectionIntro:
        'A visitor asks what the library\'s holiday hours are. There is one source card and three answer drafts. Move between them, and see how the same self-check flags what the source supports, what is invented, and what is missing, before the answer goes out to the visitor.',
    heading: 'Behind the self-check',
    kicker: 'Self-Check Lab',
    questionLabel: 'Visitor question',
    question: 'What are the library\'s opening hours on the holiday?',
    sourceLabel: 'The library\'s details (sample data)',
    sourceCaption: 'Sample card only, for illustration. This is not real data.',
    sourceNote: 'Note: the source gives regular hours, but no holiday hours. A good answer will not invent any.',
    sourceRows: [
        { label: 'Regular hours', value: '09:00-18:00' },
        { label: 'Holiday hours', value: 'Not available', missing: true },
    ],
    draftLabel: 'Choose a draft',
    claimsLabel: 'Claims in the draft',
    checklistLabel: 'Self-check',
    issueLabel: 'What the check found',
    revisedLabel: 'Revised answer',
    takeawayLabel: 'Bottom line',
    disclaimer:
        'All the drafts and the source here are a teaching example, not a check of a real library. The check is visible: a checklist and a comparison of claims against the source, with no exposure of hidden thoughts. A self-check improves the answer, but it does not guarantee truth, and sometimes it flags a problem that cannot be solved without an external source.',
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
            draft: 'The library is open from 09:00 to 18:00 on regular days, and from 10:00 to 14:00 on the holiday.',
            claims: [
                { id: 'regular', text: 'open from 09:00 to 18:00 on regular days', state: 'supported', note: 'Supported. It appears in the source: regular hours 09:00-18:00.' },
                { id: 'holiday', text: 'open from 10:00 to 14:00 on the holiday', state: 'unsupported', note: 'Not supported. The source says holiday hours are not available, so "10:00 to 14:00" is a guess.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: 'Answers the question?', note: 'Yes. The visitor asked about the holiday hours, and the answer addresses that.' },
                { id: 'source', state: 'warn', label: 'Rests on the source?', note: 'Partly. "09:00-18:00" is taken from the source, but "10:00 to 14:00" is not.' },
                { id: 'invents', state: 'fail', label: 'Invents holiday hours?', note: 'Yes. "10:00 to 14:00" is a time the source lists as not available.' },
                { id: 'missing', state: 'fail', label: 'States what is missing?', note: 'No. The answer does not say that the holiday hours are unconfirmed.' },
                { id: 'confidence', state: 'fail', label: 'Confidence level fits?', note: 'No. The wording is too confident relative to what the source actually says.' },
            ],
            issue: 'The check found a claim with no support: the source gives no holiday hours, so "10:00 to 14:00" is a guess that should be removed.',
            revised: 'According to the source provided here, the regular opening hours are 09:00 to 18:00. The holiday opening hours are not available in the source.',
            revisedNote: 'The supported claim (the regular hours) stayed, the invented holiday hours were removed, and the gap is stated explicitly.',
            takeaway: 'An answer can hold a supported claim and an invented claim together. The check separates them.',
        },
        {
            id: 'vague',
            control: 'Too cautious',
            badge: 'overcautious',
            badgeLabel: 'Too cautious',
            summary: 'It invents nothing, but it does not really answer the customer either. You can see this problem even before comparing to the source.',
            draft: 'I do not know what the library\'s opening hours are.',
            claims: [
                { id: 'noanswer', text: 'Does not actually answer the question', state: 'missing', note: 'Internal problem. "I do not know" is a dead end, and that is clear without any source.' },
                { id: 'unused', text: 'Ignores a fact that exists', state: 'missing', note: 'Missed. The source says regular hours 09:00-18:00, and the answer does not pass it on.' },
            ],
            checks: [
                { id: 'question', state: 'fail', label: 'Answers the question?', note: 'No. "I do not know" gives the visitor nothing useful. You can see this without comparing to the source.' },
                { id: 'source', state: 'fail', label: 'Rests on the source?', note: 'No. There is a fact that could have been shared, regular hours 09:00-18:00, and the answer ignores it.' },
                { id: 'invents', state: 'pass', label: 'Invents holiday hours?', note: 'No. And that is good, there is no invention here.' },
                { id: 'missing', state: 'warn', label: 'States what is missing?', note: 'Not really. It says "I do not know" without separating what is known from what is not.' },
                { id: 'confidence', state: 'warn', label: 'Confidence level fits?', note: 'Too low. There is a fact that can be shared with reasonable confidence.' },
            ],
            issue: 'The check found an internal problem: the answer does not actually answer the question. "I do not know" is a dead end you can see even before comparing to the source. On top of that, it missed a fact that does exist: the regular hours.',
            revised: 'According to the source, the regular opening hours are 09:00 to 18:00. The holiday hours are not available in the source, so I will not commit to an exact time.',
            revisedNote: 'Now the answer responds to the customer: it shares what is known instead of a dead end. Self-check does not only delete, sometimes it also completes.',
            takeaway: 'Self-check does not only check against a source. It also asks internal questions: did we answer the question, did we stay clear, did we avoid contradicting ourselves. Here it catches an answer that does not do its job.',
        },
        {
            id: 'grounded',
            control: 'Balanced',
            badge: 'checked',
            badgeLabel: 'Passed the checklist',
            summary: 'Uses the fact from the source, and admits openly what is missing.',
            draft: 'According to the source, the regular opening hours are 09:00 to 18:00. The holiday hours are not available yet.',
            claims: [
                { id: 'regular', text: 'Regular hours 09:00 to 18:00', state: 'supported', note: 'Supported. It appears in the source: regular hours 09:00-18:00.' },
                { id: 'noholiday', text: 'Holiday hours are not available', state: 'supported', note: 'Supported. It appears in the source: holiday hours not available.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: 'Answers the question?', note: 'Yes. It gives what is known about the opening hours.' },
                { id: 'source', state: 'pass', label: 'Rests on the source?', note: 'Yes. Every claim in the answer appears in the source.' },
                { id: 'invents', state: 'pass', label: 'Invents holiday hours?', note: 'No. No hours were added.' },
                { id: 'missing', state: 'pass', label: 'States what is missing?', note: 'Yes. It says explicitly that the holiday hours are not available.' },
                { id: 'confidence', state: 'pass', label: 'Confidence level fits?', note: 'Yes. Confident about the regular hours, careful about the holiday hours.' },
            ],
            issue: 'The check passed with no unsupported claim. There is nothing to delete and nothing to add.',
            revised: 'According to the source, the regular opening hours are 09:00 to 18:00. The holiday hours are not available yet.',
            revisedNote: 'When the draft already rests on the source, the check simply confirms it. Not every check ends in a fix. "Passed the check" means no issue was found in the checklist, not that the information was verified against the world.',
            takeaway: 'A self-check is a control step, not always a rewrite. A grounded draft passes it cleanly.',
        },
        {
            id: 'external',
            control: 'A claim that needs a source',
            badge: 'needsSource',
            badgeLabel: 'Flagged by the check, but cannot verify',
            summary: 'The draft adds an assumption that sounds reasonable, but it is not in the source, and self-check alone cannot know if it is true.',
            draft: 'The library is probably open with reduced hours on the holiday, like most neighborhood libraries.',
            claims: [
                { id: 'shortened', text: 'open with reduced hours on the holiday', state: 'unsupported', note: 'Not supported. The source marks the holiday hours as not available, and does not say there are reduced hours. That is an added generalization.' },
                { id: 'likeothers', text: 'like most neighborhood libraries', state: 'unsupported', note: 'Not supported. There is no comparison to other libraries in the source, so this is an assumption that cannot be verified from it.' },
            ],
            checks: [
                { id: 'question', state: 'pass', label: 'Answers the question?', note: 'Yes. It addresses the holiday hours.' },
                { id: 'source', state: 'fail', label: 'Rests on the source?', note: 'No. "Reduced hours" and "like most libraries" do not appear in the source.' },
                { id: 'invents', state: 'fail', label: 'Invents a detail?', note: 'Yes. It added a generalization and a pattern with no source.' },
                { id: 'missing', state: 'warn', label: 'States what is missing?', note: 'No. It does not say that the generalization cannot be confirmed from this information.' },
                { id: 'confidence', state: 'fail', label: 'Confidence level fits?', note: 'No. It presents an assumption as if it were a fact.' },
            ],
            issue: 'The check flags that "open with reduced hours" is not supported by the source. But notice: it cannot know whether it is true or not. To verify an assumption like this you need an external source, not self-check.',
            revised: 'According to the source provided here, the regular opening hours are 09:00 to 18:00. I cannot confirm from this information whether there are reduced hours on the holiday. To find out the actual holiday hours, you would need to check with the library itself or an official notice.',
            revisedNote: 'The check stopped an unsupported claim, but did not turn it into truth. What requires factual verification moves to an external source, and the gap is stated explicitly.',
            takeaway: 'Self-check catches a claim that has no source, but cannot verify it. Factual verification requires a source, a tool, or a person.',
        },
    ],
};
