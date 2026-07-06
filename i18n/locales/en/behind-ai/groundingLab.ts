// i18n/locales/en/behind-ai/groundingLab.ts
//
// English (en, LTR) data for the "Grounding Lab" of Chapter 12 (RAG & Grounding: How AI
// Connects to Sources). Hebrew is the source of truth and defines the type
// (GroundingLabContent).
//
// Core idea: the exact same customer question, and four source states. The learner moves
// between them, no source, with a source, an incomplete source, and a conflicting source,
// and sees how a source changes what the answer can say: what it rests on, what it may say,
// and what it must not invent.
//
// Fully deterministic: no randomness, no real model call, and no claim that the retrieval
// comes from a real tracking system. Every example here is a teaching example only.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { GroundingLabContent } from '../../he/behind-ai/groundingLab';

export const groundingLab: GroundingLabContent = {
    sectionEyebrow: 'Grounding Lab',
    sectionTitle: 'Same question, four source states: what can the answer say?',
    sectionIntro:
        'A customer asks where their package is. Move between the source states, no source, with a source, an incomplete source, and a conflicting source, and see how the same question gets a different answer. A good source keeps the answer tied to what is known, and flags what is not.',
    heading: 'Behind the grounded answer',
    kicker: 'Grounding Lab',
    questionLabel: 'Customer question',
    question: 'My package was supposed to arrive yesterday. Where is it?',
    modeLabel: 'Choose a source state',
    answerLabel: 'The answer produced',
    groundingCheckLabel: 'Grounding check',
    maySayLabel: 'What the answer may say',
    mustNotInventLabel: 'What it must not invent',
    takeawayLabel: 'Bottom line',
    noSourceLabel: 'No source',
    noSourceNote: 'No source was provided. The answer rests only on language continuation, with no data to check against.',
    disclaimer:
        'All answers and sources here are a teaching example, not a real lookup from a tracking system. They are meant to show how a source changes what the answer can say. A grounded answer is stronger, but it is only as good as the source behind it.',
    sr: {
        modeGroup: 'Choosing the source state',
        checks: 'Grounding check of the selected answer',
    },
    modes: [
        {
            id: 'none',
            control: 'No source',
            badge: 'ungrounded',
            badgeLabel: 'Not grounded',
            summary: 'With no source, the answer sounds helpful but rests only on language continuation.',
            answer: 'Your package will probably arrive tomorrow.',
            answerSummary: 'Fluent and reassuring, but no data supports "tomorrow".',
            checks: [
                { id: 'based', state: 'fail', label: 'Rests on a source?', note: 'No. No tracking data was provided, so there is nothing to rest on.' },
                { id: 'invents', state: 'fail', label: 'Invents a date?', note: 'Yes. "Tomorrow" is a plausible guess, not a detail checked in a source.' },
                { id: 'limits', state: 'warn', label: 'Flags what is missing?', note: 'No. The answer does not make clear that it has no data at all.' },
            ],
            maySay: 'With no source, the answer can at most say it has no data, and ask for a tracking number.',
            mustNotInvent: 'It must not give an arrival date, "tomorrow" or any other, because no data supports it.',
            takeaway: 'With no source, a fluent answer can invent the most important detail.',
        },
        {
            id: 'grounded',
            control: 'With a source',
            badge: 'grounded',
            badgeLabel: 'Grounded',
            summary: 'With a status card in context, every claim rests on real data.',
            source: {
                label: 'Tracking status (sample data)',
                caption: 'Sample card only, for illustration. This is not real data.',
                rows: [
                    { label: 'Barcode', value: 'RR123456789IL' },
                    { label: 'Last scan', value: 'Sorting center' },
                    { label: 'Status', value: 'Delayed' },
                    { label: 'Estimated delivery', value: 'Not available', missing: true },
                ],
                note: 'Note: the source says "Delayed", but gives no arrival date. A good answer will not invent one.',
            },
            answer: 'According to the tracking data provided here, the package is delayed at the sorting center. There is no confirmed arrival date right now, so I will not commit to a date.',
            answerSummary: 'Less dramatic, but every claim in it rests on the source.',
            checks: [
                { id: 'based', state: 'pass', label: 'Rests on a source?', note: 'Yes. The delay and the location are taken straight from the status card.' },
                { id: 'invents', state: 'pass', label: 'Invents a date?', note: 'No. The source says "Not available", and the answer leaves it open.' },
                { id: 'limits', state: 'pass', label: 'Flags what is missing?', note: 'Yes. It states clearly that there is no confirmed arrival date.' },
            ],
            maySay: 'The answer can report the status and location from the source, and say there is no confirmed arrival date.',
            mustNotInvent: 'It must not add an arrival date, because the source lists it as "Not available".',
            takeaway: 'A grounded answer is less dramatic, but far more reliable. The power is in the grounding, not the wording.',
        },
        {
            id: 'incomplete',
            control: 'Incomplete source',
            badge: 'incomplete',
            badgeLabel: 'Incomplete source',
            summary: 'The source exists but is nearly empty. Grounding reveals exactly what is missing.',
            source: {
                label: 'Tracking status (sample data)',
                caption: 'Sample card only, for illustration. This is not real data.',
                rows: [
                    { label: 'Barcode', value: 'RR123456789IL' },
                    { label: 'Last scan', value: 'Not available', missing: true },
                    { label: 'Status', value: 'Not available', missing: true },
                    { label: 'Estimated delivery', value: 'Not available', missing: true },
                ],
                note: 'The source is nearly empty. There is a barcode, but no status, no scan, and no date.',
            },
            answer: 'There is not enough data right now to know where the package is. There is a barcode, but no current status. A more up to date source needs to be checked before answering.',
            answerSummary: 'Grounding does not invent missing data, it reveals it.',
            checks: [
                { id: 'based', state: 'warn', label: 'Rests on a source?', note: 'The source exists, but its important fields are empty.' },
                { id: 'invents', state: 'pass', label: 'Invents a status?', note: 'No. The answer says plainly that there is not enough data.' },
                { id: 'limits', state: 'pass', label: 'Flags what is missing?', note: 'Yes. It says what is missing and what needs to be checked.' },
            ],
            maySay: 'The answer can say there is not enough data, and ask for a more up to date source.',
            mustNotInvent: 'It must not invent a status or a date just to sound complete.',
            takeaway: 'Grounding can reveal missing information. Sometimes the right answer is to stop and ask for data.',
        },
        {
            id: 'contradiction',
            control: 'Conflicting source',
            badge: 'contradiction',
            badgeLabel: 'Conflicting source',
            summary: 'The customer says the package did not arrive, but the source marks it as delivered.',
            source: {
                label: 'Tracking status (sample data)',
                caption: 'Sample card only, for illustration. This is not real data.',
                rows: [
                    { label: 'Barcode', value: 'RR123456789IL' },
                    { label: 'Status', value: 'Delivered' },
                    { label: 'Delivery time', value: '10:32' },
                    { label: 'Delivery point', value: 'Delivery center' },
                ],
                note: 'The customer says they did not receive it, but the source marks it "Delivered". This is a conflict to handle carefully.',
            },
            answer: 'According to the tracking data provided here, the package is marked as delivered at 10:32 at the delivery center. If you feel you did not receive it, we will open an inquiry to find out what happened.',
            answerSummary: 'The answer stays faithful to the source, and handles the conflict without blame.',
            checks: [
                { id: 'based', state: 'pass', label: 'Rests on a source?', note: 'Yes. The status, time, and place are taken from the source.' },
                { id: 'invents', state: 'pass', label: 'Invents details?', note: 'No. The answer adds no reason or blame that is not in the source.' },
                { id: 'limits', state: 'warn', label: 'Handles the conflict?', note: 'Yes, carefully. It shows what the source says and offers an inquiry, without dismissing the customer.' },
            ],
            maySay: 'The answer can report what the source says, and offer to open an inquiry into the conflict.',
            mustNotInvent: 'It must not blame the customer, or invent a reason why the status and reality differ.',
            takeaway: 'When the source conflicts with the customer, show what it says carefully and open an inquiry, without blame.',
        },
    ],
};
