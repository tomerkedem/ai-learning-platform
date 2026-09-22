// i18n/locales/en/behind-ai/groundingLab.ts
//
// English (en, LTR) data for the "Grounding Lab" of Chapter 12 (RAG & Grounding: How AI
// Connects to Sources). Hebrew is the source of truth and defines the type
// (GroundingLabContent).
//
// Core idea: the exact same visitor question, and five source states. The learner moves
// between them, no source, with a source, an incomplete source, a mismatched source, and a
// conflicting source, and sees how a source changes what the answer can say: what it rests
// on, what it may say, and what it must not invent.
//
// Fully deterministic: no randomness, no real model call, and no claim that the retrieval
// comes from a real schedule. Every example here is a teaching example only.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { GroundingLabContent } from '../../he/behind-ai/groundingLab';

export const groundingLab: GroundingLabContent = {
    sectionEyebrow: 'Grounding Lab',
    sectionTitle: 'Same question, five source states: what can the answer say?',
    sectionIntro:
        'A visitor asks what the library\'s holiday hours are. Move between the source states, no source, with a source, an incomplete source, a mismatched source, and a conflicting source, and see how the same question gets a different answer. A good source keeps the answer tied to what is known, and flags what is not.',
    heading: 'Behind the grounded answer',
    kicker: 'Grounding Lab',
    questionLabel: 'Visitor question',
    question: 'What are the library\'s opening hours on the holiday?',
    modeLabel: 'Choose a source state',
    answerLabel: 'The answer produced',
    groundingCheckLabel: 'Grounding check',
    maySayLabel: 'What the answer may say',
    mustNotInventLabel: 'What it must not invent',
    takeawayLabel: 'Bottom line',
    noSourceLabel: 'No source',
    noSourceNote: 'No source was provided. The answer rests only on language continuation, with no data to check against.',
    disclaimer:
        'All answers and sources here are a teaching example, not a real lookup from a schedule. They are meant to show how a source changes what the answer can say. A grounded answer is stronger, but it is only as good as the source behind it.',
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
            answer: 'The library is probably open from 10:00 to 14:00 on the holiday.',
            answerSummary: 'Fluent and reassuring, but no data supports those hours.',
            checks: [
                { id: 'based', state: 'fail', label: 'Rests on a source?', note: 'No. No schedule was provided, so there is nothing to rest on.' },
                { id: 'invents', state: 'fail', label: 'Invents hours?', note: 'Yes. Those hours are a plausible guess, not a detail checked in a source.' },
                { id: 'limits', state: 'warn', label: 'Flags what is missing?', note: 'No. The answer does not make clear that it has no data at all.' },
            ],
            maySay: 'With no source, the answer can at most say it has no data, and suggest checking the official schedule.',
            mustNotInvent: 'It must not give holiday hours, these or any other, because no data supports them.',
            takeaway: 'With no source, a fluent answer can invent the most important detail.',
        },
        {
            id: 'grounded',
            control: 'With a source',
            badge: 'grounded',
            badgeLabel: 'Grounded',
            summary: 'With an information card in context, every claim rests on real data.',
            source: {
                label: 'Library information (sample data)',
                caption: 'Sample card only, for illustration. This is not real data.',
                rows: [
                    { label: 'Regular hours', value: '09:00-18:00' },
                    { label: 'Holiday hours', value: 'Not available', missing: true },
                ],
                note: 'Note: the source gives regular hours, but no holiday hours. A good answer will not invent any.',
            },
            answer: 'According to the available information, the regular opening hours are 09:00 to 18:00, but the source does not list the holiday opening hours.',
            answerSummary: 'Less dramatic, but every claim in it rests on the source.',
            checks: [
                { id: 'based', state: 'pass', label: 'Rests on a source?', note: 'Yes. The regular hours are taken straight from the information card.' },
                { id: 'invents', state: 'pass', label: 'Invents holiday hours?', note: 'No. The source says "Not available", and the answer leaves it open.' },
                { id: 'limits', state: 'pass', label: 'Flags what is missing?', note: 'Yes. It states clearly that there is no confirmed holiday hours.' },
            ],
            maySay: 'The answer can report the regular hours from the source, and say there is no confirmed holiday hours.',
            mustNotInvent: 'It must not add holiday hours, because the source lists them as "Not available".',
            takeaway: 'A grounded answer is less dramatic, but far more reliable. The power is in the grounding, not the wording.',
        },
        {
            id: 'incomplete',
            control: 'Incomplete source',
            badge: 'incomplete',
            badgeLabel: 'Incomplete source',
            summary: 'The source exists but is nearly empty. Grounding reveals exactly what is missing.',
            source: {
                label: 'Library information (sample data)',
                caption: 'Sample card only, for illustration. This is not real data.',
                rows: [
                    { label: 'Address', value: '5 Library Street' },
                    { label: 'Regular hours', value: 'Not available', missing: true },
                    { label: 'Holiday hours', value: 'Not available', missing: true },
                ],
                note: 'The source is nearly empty. There is an address, but no regular hours and no holiday hours.',
            },
            answer: 'There is not enough data right now to know when the library is open on the holiday. There is an address, but no opening hours. A more up to date source needs to be checked before answering.',
            answerSummary: 'Grounding does not invent missing data, it reveals it.',
            checks: [
                { id: 'based', state: 'warn', label: 'Rests on a source?', note: 'The source exists, but its important fields are empty.' },
                { id: 'invents', state: 'pass', label: 'Invents hours?', note: 'No. The answer says plainly that there is not enough data.' },
                { id: 'limits', state: 'pass', label: 'Flags what is missing?', note: 'Yes. It says what is missing and what needs to be checked.' },
            ],
            maySay: 'The answer can say there is not enough data, and ask for a more up to date source.',
            mustNotInvent: 'It must not invent hours just to sound complete.',
            takeaway: 'Grounding can reveal missing information. Sometimes the right answer is to stop and ask for data.',
        },
        {
            id: 'mismatch',
            control: 'Mismatched source',
            badge: 'ungrounded',
            badgeLabel: 'Mismatched source',
            summary: 'The source was retrieved and looks fine, but it refers to a different library. It does not support the visitor question.',
            source: {
                label: 'Library information, Branch 9 (sample data)',
                caption: 'Sample card only, for illustration. This is not real data.',
                rows: [
                    { label: 'Regular hours', value: '08:00-16:00' },
                    { label: 'Holiday hours', value: 'Closed' },
                ],
                note: 'Note: this is Branch 9, not the visitor\'s neighborhood library (Branch 14). The source was retrieved, but it is for a different library.',
            },
            answer: 'The retrieved source refers to Branch 9, not Branch 14 that you asked about, so it does not answer your question. I need the correct library\'s information before I can answer.',
            answerSummary: 'The source exists but does not fit, so it is not used as a basis for the answer.',
            checks: [
                { id: 'based', state: 'fail', label: 'Is it based on a matching source?', note: 'No. The retrieved source is for a different branch, so it cannot ground an answer to this question.' },
                { id: 'invents', state: 'pass', label: 'Does it invent hours?', note: 'No. The answer does not attribute the other branch\'s hours to the visitor.' },
                { id: 'limits', state: 'pass', label: 'Does it flag that the source does not match?', note: 'Yes. It states explicitly that the retrieved source does not fit, and asks for the correct data.' },
            ],
            maySay: 'The answer can say that the retrieved source belongs to a different branch, and ask for the visitor\'s correct branch information.',
            mustNotInvent: 'It must not use the other branch\'s hours as if they were the branch asked about.',
            takeaway: 'Sometimes retrieval returns a source that exists but does not fit. A retrieved source is not necessarily the correct source.',
        },
        {
            id: 'contradiction',
            control: 'Conflicting source',
            badge: 'contradiction',
            badgeLabel: 'Conflicting source',
            summary: 'The visitor says they heard the library is open on the holiday, but the source marks it as closed.',
            source: {
                label: 'Library information (sample data)',
                caption: 'Sample card only, for illustration. This is not real data.',
                rows: [
                    { label: 'Regular hours', value: '09:00-18:00' },
                    { label: 'Holiday hours', value: 'Closed' },
                ],
                note: 'The visitor claims they heard the library is open on the holiday, but the source marks it "Closed". This is a conflict to handle carefully.',
            },
            answer: 'According to the information provided here, the library is marked as closed on the holiday. If you heard it is open, we will look into it to find out what happened.',
            answerSummary: 'The answer stays faithful to the source, and handles the conflict without blame.',
            checks: [
                { id: 'based', state: 'pass', label: 'Rests on a source?', note: 'Yes. The regular and holiday hours are taken from the source.' },
                { id: 'invents', state: 'pass', label: 'Invents details?', note: 'No. The answer adds no reason or blame that is not in the source.' },
                { id: 'limits', state: 'warn', label: 'Handles the conflict?', note: 'Yes, carefully. It shows what the source says and offers to look into it, without dismissing the visitor.' },
            ],
            maySay: 'The answer can report what the source says, and offer to look into the conflict.',
            mustNotInvent: 'It must not blame the visitor, or invent a reason why the source and what they heard differ.',
            takeaway: 'When the source conflicts with the visitor, show what it says carefully and offer to look into it, without blame.',
        },
    ],
};
