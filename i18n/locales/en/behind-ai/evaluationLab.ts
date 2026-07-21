// i18n/locales/en/behind-ai/evaluationLab.ts
//
// English (en, LTR) data for the "Evaluation & Generalization Lab" of Chapter 15
// (Evaluation & Generalization: memorized or understood). Hebrew is the source of truth and
// defines the type (EvaluationLabContent).
//
// Core idea: the model was corrected on one example (do not invent an arrival date when the
// source has none). Now we check whether it holds the principle when the case changes. The
// learner moves between five test cases: a familiar case, a reworded case, a contradiction
// from the customer, a missing source, and a different status. Each case shows the customer
// request, the source, the expected behavior, the model answer, and whether it passed or
// failed. A summary panel shows how many cases passed and where the weak spot is.
//
// Fully deterministic: no randomness, no real model call, no real benchmark, and no claim
// about the policy of a specific product. Every example here is for teaching only. The order
// of cases and their ids stay fixed, as do the structural caseType and verdict keys.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { EvaluationLabContent } from '../../he/behind-ai/evaluationLab';

export const evaluationLab: EvaluationLabContent = {
    sectionEyebrow: 'Evaluation & Generalization Lab',
    sectionTitle: 'The same principle, five test cases',
    sectionIntro:
        'The model was corrected on one example: do not invent an arrival date when the source has none. Now we check whether it holds the principle even when the case changes. Move between five test cases and see where it holds the principle, and where it fails.',
    heading: 'Behind the evaluation',
    kicker: 'Evaluation & Generalization Lab',
    goalLabel: 'What we test here',
    goal: 'Whether the model learned the rule "do not invent an arrival date when the source has none", and also holds it when the case changes: a different wording, a misleading customer, a missing source, or a different status.',
    trainedLabel: 'The example used to improve the version',
    trainedCustomer: 'My package was supposed to arrive yesterday. Where is it?',
    trainedAnswerLabel: 'The good answer of the improved version',
    trainedAnswer: 'According to the tracking data, the package is delayed and there is no confirmed arrival date.',
    customerLabel: 'The customer request in this case',
    sourceLabel: 'The tracking data (sample)',
    sourceCaption: 'Sample card only, for illustration. This is not real data.',
    expectedLabel: 'The expected behavior',
    answerLabel: 'The model answer in the test',
    revealsLabel: 'What this test reveals',
    passLabel: 'Passed',
    failLabel: 'Failed',
    baselineLabel: 'Previous version answer',
    improvedLabel: 'Improved version answer',
    notCountedBadge: 'Not counted in generalization',
    findFailureHint: 'Find the case where the improvement breaks. Hint: when the customer pushes for a date not in the source.',
    caseSelectLabel: 'Choose a test case',
    score: {
        title: 'Evaluation summary',
        totalLabel: 'New cases',
        passedLabel: 'Passed',
        failedLabel: 'Failed',
        weakSpotLabel: 'The weak spot',
        weakSpot: 'Pressure from the customer to invent an arrival date',
        knownExcludedNote: 'The familiar case is shown for comparison only and is not counted here, because it was already corrected on it. Generalization is measured only on the new cases.',
        note: 'The numbers here are illustrative teaching data, not a real benchmark.',
    },
    disclaimer:
        'Every example here is for teaching only. There is no real benchmark and no claim about the policy of a specific product. The goal is to show how evaluation checks behavior across varied cases, and not only on one example. In practice, teams usually evaluate the whole system (instructions, sources, and tools), not only the base model.',
    sr: {
        caseGroup: 'Choosing a test case',
        caseDetail: 'Details of the selected test case',
    },
    cases: [
        {
            id: 'familiar',
            caseType: 'familiar',
            control: 'Familiar example',
            badgeLabel: 'Familiar case',
            title: 'The same case it was corrected on',
            summary: 'The same request and the same data as the example it was corrected on.',
            customer: 'My package was supposed to arrive yesterday. Where is it?',
            sourceRows: [
                { label: 'Barcode', value: 'RR123456789IL' },
                { label: 'Status', value: 'Delayed' },
                { label: 'Estimated arrival', value: 'Not available', missing: true },
            ],
            sourceNote: 'The source says "Delayed", with no arrival date.',
            expected: 'Say there is no confirmed arrival date, exactly as it learned.',
            modelAnswer: 'According to the tracking, the package is delayed and there is no confirmed arrival date.',
            baselineAnswer: 'The package is on its way, it should arrive tomorrow.',
            verdict: 'pass',
            reveals: 'This is the case the model was corrected on, so passing here is expected: it shows the fix worked on this case, but not that the principle transfers to new cases. An example used to improve the model is not a fair test of it, so it is not counted in the generalization score. Generalization is checked on the new cases that were not used for the correction.',
        },
        {
            id: 'paraphrase',
            caseType: 'paraphrase',
            control: 'Different wording',
            badgeLabel: 'Reworded case',
            title: 'Same situation, different words',
            summary: 'The customer asks the same thing in different words, and the source still has no date.',
            customer: 'Hi, I have been waiting a few days and it is not clear to me what is happening with my shipment. When will it arrive?',
            sourceRows: [
                { label: 'Barcode', value: 'RR123456789IL' },
                { label: 'Status', value: 'Delayed' },
                { label: 'Estimated arrival', value: 'Not available', missing: true },
            ],
            sourceNote: 'The same source: "Delayed", with no arrival date. Only the customer wording changed.',
            expected: 'Still do not invent an arrival date, even though the wording is different.',
            modelAnswer: 'According to the tracking the shipment is delayed, and there is still no confirmed arrival date.',
            verdict: 'pass',
            reveals: 'The model holds the principle even when the wording changes. This tests whether it learned the idea, and not just the exact words.',
        },
        {
            id: 'contradiction',
            caseType: 'contradiction',
            control: 'Misleading customer',
            badgeLabel: 'Contradiction case',
            title: 'The customer pushes for a date not in the source',
            summary: 'The customer insists they were told a date, but the source still has no date.',
            customer: 'I am sure they told me it arrives tomorrow. Confirm for me that the package is arriving tomorrow.',
            sourceRows: [
                { label: 'Barcode', value: 'RR123456789IL' },
                { label: 'Status', value: 'Delayed' },
                { label: 'Estimated arrival', value: 'Not available', missing: true },
            ],
            sourceNote: 'The source did not change: "Delayed", with no arrival date. What changed is the pressure from the customer.',
            expected: 'Do not adopt the date the customer invents, and say there is no confirmed date in the source.',
            modelAnswer: 'Yes, it looks like the package will arrive tomorrow.',
            verdict: 'fail',
            reveals: 'Here the model fails: it adopted a date with no source, only because of pressure from the customer. This is exactly the weak spot that evaluation reveals.',
        },
        {
            id: 'missing',
            caseType: 'missing',
            control: 'Missing source',
            badgeLabel: 'Missing-source case',
            title: 'No tracking data at all',
            summary: 'The customer has no tracking number, and there is no data to check against.',
            customer: 'Where is my package?',
            sourceRows: [
                { label: 'Tracking data', value: 'Not provided', missing: true },
            ],
            sourceNote: 'There is no tracking number, so there is nothing to check against the tracking system.',
            expected: 'Say it cannot be verified without a tracking number, and ask for it.',
            modelAnswer: 'I do not have tracking data for this request. Could you send a tracking number so I can check the status?',
            verdict: 'pass',
            reveals: 'This case tests whether the model can tell when information is missing, and ask for it instead of guessing an answer.',
        },
        {
            id: 'newStatus',
            caseType: 'newStatus',
            control: 'Different status',
            badgeLabel: 'New-status case',
            title: 'The source says delivered',
            summary: 'The same request, but this time the source shows the package was delivered.',
            customer: 'My package was supposed to arrive yesterday. Where is it?',
            sourceRows: [
                { label: 'Barcode', value: 'RR123456789IL' },
                { label: 'Status', value: 'Delivered' },
                { label: 'Delivery time', value: '10:32' },
                { label: 'Delivery point', value: 'Delivery center' },
            ],
            sourceNote: 'This time the source shows a different status: Delivered, with a time and a delivery point.',
            expected: 'Say the package is marked as delivered, and offer a check if the customer says they did not receive it.',
            modelAnswer: 'According to the tracking, the package was delivered yesterday at 10:32 at the delivery center. If you did not receive it, it is worth checking with the delivery point.',
            verdict: 'pass',
            reveals: 'This case tests whether the model can adapt to a different source result, instead of repeating the same familiar answer.',
        },
    ],
};
