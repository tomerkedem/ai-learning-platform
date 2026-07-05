// i18n/locales/en/behind-ai/hallucinationsLab.ts
//
// English (en, LTR) data for the "Hallucination Lab" of Chapter 11 (Hallucinations: Why a
// Confident Answer Can Be Wrong). Hebrew is the source of truth and defines the type
// (HallucinationsLabContent).
//
// Core idea: the exact same customer question, and four answer styles. The learner picks a
// style and sees what is behind each answer: risk level, fact check, what is missing, and a
// bottom line. A fluent, confident answer can invent a date, while a careful or a
// source-grounded answer is far safer.
//
// Fully deterministic: no randomness, no real model call, and no claim that the trace comes
// from a real model. Every example here is a teaching example only.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { HallucinationsLabContent } from '../../he/behind-ai/hallucinationsLab';

export const hallucinationsLab: HallucinationsLabContent = {
    sectionEyebrow: 'Hallucination Lab',
    sectionTitle: 'Same question, four answer styles: which is grounded and which guesses?',
    sectionIntro:
        'A customer asks where their package is. Pick an answer style, and see what is behind each answer: whether a source was checked, which claims are backed, and the risk of sending it as is. The exact same question can get a confident answer that invents a date, or a careful answer that says what is missing.',
    heading: 'Behind the answer',
    kicker: 'Hallucination Lab',
    questionLabel: 'Customer question',
    question: 'My package was supposed to arrive yesterday. Where is it?',
    modeLabel: 'Choose an answer style',
    answerLabel: 'The answer given',
    riskLabel: 'Risk level',
    factCheckLabel: 'Fact check',
    missingLabel: 'What is missing?',
    takeawayLabel: 'Bottom line',
    source: {
        label: 'Tracking status (sample data)',
        caption: 'A sample card for illustration only. This is not real data.',
        rows: [
            { label: 'Barcode', value: 'RR123456789IL' },
            { label: 'Last scan', value: 'Sorting center' },
            { label: 'Status', value: 'Delayed' },
            { label: 'Estimated delivery', value: 'Not available' },
        ],
        note: 'Note: the source itself gives no delivery date. A good answer will not invent one.',
    },
    disclaimer:
        'All the answers, checks and the source here are a teaching example, not real model output. They are meant to show the difference between a fluent answer and a grounded one. An answer that sounds confident is not evidence that the fact was checked.',
    sr: {
        modeGroup: 'Choosing the answer style',
        checks: 'Fact check of the selected answer',
    },
    modes: [
        {
            id: 'confident',
            control: 'Confident but ungrounded',
            risk: 'high',
            riskLabel: 'High risk',
            riskNote: 'The answer states a factual claim, a delivery date, that was not checked against any source.',
            answer: 'The package is delayed and will arrive tomorrow.',
            answerSummary: 'Sounds helpful, short and confident, and gives an exact date.',
            checks: [
                { id: 'source', state: 'fail', label: 'Source checked?', note: 'No tracking system was checked before answering.' },
                { id: 'claim', state: 'warn', label: 'Is there a precise claim?', note: "Yes, 'tomorrow'. But where did that date come from?" },
                { id: 'backed', state: 'fail', label: 'Is the claim backed?', note: "Nothing supports 'tomorrow'. It is a plausible fill-in, not a fact." },
            ],
            missing: "The real status is missing. 'Tomorrow' is a linguistically plausible continuation, not a checked detail. The safe step is to check tracking or to say the date cannot be confirmed.",
            takeaway: 'An answer can sound confident and precise and still invent the most important detail.',
        },
        {
            id: 'careful',
            control: 'Careful answer',
            risk: 'low',
            riskLabel: 'Low risk',
            riskNote: 'The answer makes no claim that could turn out wrong. It asks to check.',
            answer: 'I cannot confirm when the package will arrive without checking its status. Do you have a tracking number I can check?',
            answerSummary: 'Less dramatic, but clearly separates what is known from what is not.',
            checks: [
                { id: 'source', state: 'warn', label: 'Source checked?', note: 'Not yet, but the answer does not pretend to know without checking.' },
                { id: 'separates', state: 'pass', label: 'Separates known from unknown?', note: 'Yes. It says explicitly that a date cannot be confirmed without checking.' },
                { id: 'invents', state: 'pass', label: 'Invents a date?', note: 'No. No unchecked date is given to the customer.' },
            ],
            missing: 'The status itself is still missing, but the answer asks for it instead of inventing. That is already far safer than guessing.',
            takeaway: 'A careful answer that says "I am not sure, let us check" beats a confident answer that guesses.',
        },
        {
            id: 'grounded',
            control: 'Grounded in a source',
            risk: 'low',
            riskLabel: 'Low risk',
            riskNote: 'Every claim in the answer rests on a value that appears in the source shown here.',
            showSource: true,
            answer: 'According to the tracking status shown here, the package is delayed at the sorting center. There is no confirmed delivery date right now, so I cannot commit to a date.',
            answerSummary: 'Every claim rests on a value in the source. No invented date.',
            checks: [
                { id: 'source', state: 'pass', label: 'Source checked?', note: 'Yes, the answer rests on the status card shown above.' },
                { id: 'backed', state: 'pass', label: 'Is every claim backed?', note: 'The delay and the location are taken directly from the source.' },
                { id: 'invents', state: 'pass', label: 'Invents a date?', note: "No. The source says 'not available', and the answer leaves it open." },
            ],
            missing: 'The source itself gives no delivery date, and the answer reflects that honestly instead of filling the gap. Uncertainty stays exactly where the source is silent.',
            takeaway: 'An answer tied to a source is stronger than a nicely worded one. The strength is in grounding, not phrasing.',
        },
        {
            id: 'missing',
            control: 'Missing information',
            risk: 'medium',
            riskLabel: 'Medium risk',
            riskNote: 'The step is right, but this is exactly where it is easy to invent. The risk lives in the temptation to fill in.',
            answer: 'I do not have a tracking number for this package, and without it I cannot check where it is. Could you send the tracking number, and I will check the status?',
            answerSummary: 'When the basic information is missing, the right step is to ask for it, not invent a status.',
            checks: [
                { id: 'identifier', state: 'fail', label: 'Is there an identifier to check?', note: 'There is no tracking number, so there is nothing to check right now.' },
                { id: 'invents', state: 'pass', label: 'Invents a status?', note: 'No. The answer stops and asks for the missing detail.' },
                { id: 'explains', state: 'pass', label: 'Explains why it stops?', note: 'Yes. It says exactly what is missing and how to proceed.' },
            ],
            missing: 'The tracking number is missing, and it is the key to any check. Instead of guessing, the answer asks for it. Sometimes the best answer is a question.',
            takeaway: 'When critical information is missing, stopping to ask beats filling it in with a good-sounding guess.',
        },
    ],
};
