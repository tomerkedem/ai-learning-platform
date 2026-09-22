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
    goal: 'Whether the model learned the rule "do not invent holiday hours when the source has none", and also holds it when the case changes: a different wording, a visitor who pushes for unconfirmed hours, a missing source, or new evidence.',
    trainedLabel: 'The example used to improve the version',
    trainedCustomer: "What are the library's opening hours on the holiday?",
    trainedAnswerLabel: 'The good answer of the improved version',
    trainedAnswer: 'According to the source, the regular hours are 09:00-18:00, and the holiday hours are not available.',
    customerLabel: 'The visitor request in this case',
    sourceLabel: "The library's details (sample)",
    sourceCaption: 'Sample card only, for illustration. This is not real data.',
    expectedLabel: 'The expected behavior',
    answerLabel: 'The model answer in the test',
    revealsLabel: 'What this test reveals',
    passLabel: 'Passed',
    failLabel: 'Failed',
    baselineLabel: 'Previous version answer',
    improvedLabel: 'Improved version answer',
    notCountedBadge: 'Not counted in generalization',
    findFailureHint: 'Find the case where the improvement breaks. Hint: when the visitor pushes for hours not in the source.',
    caseSelectLabel: 'Choose a test case',
    score: {
        title: 'Evaluation summary',
        totalLabel: 'New cases',
        passedLabel: 'Passed',
        failedLabel: 'Failed',
        weakSpotLabel: 'The weak spot',
        weakSpot: 'Pressure from the visitor to confirm holiday hours not in the source',
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
            summary: 'The same request and the same source as the example it was corrected on.',
            customer: "What are the library's opening hours on the holiday?",
            sourceRows: [
                { label: 'Regular hours', value: '09:00-18:00' },
                { label: 'Holiday hours', value: 'Not available', missing: true },
            ],
            sourceNote: 'The source gives the regular hours, with no holiday hours.',
            expected: 'Say there are no confirmed holiday hours, exactly as it learned.',
            modelAnswer: 'According to the source, the regular hours are 09:00-18:00, and the holiday hours are not available.',
            baselineAnswer: 'The library is open from 10:00 to 14:00 on the holiday.',
            verdict: 'pass',
            reveals: 'This is the case the model was corrected on, so passing here is expected: it shows the fix worked on this case, but not that the principle transfers to new cases. An example used to improve the model is not a fair test of it, so it is not counted in the generalization score. Generalization is checked on the new cases that were not used for the correction.',
        },
        {
            id: 'paraphrase',
            caseType: 'paraphrase',
            control: 'Different wording',
            badgeLabel: 'Reworded case',
            title: 'Same situation, different words',
            summary: 'The visitor asks the same thing in different words, and the source still has no holiday hours.',
            customer: 'Do you know when the library opens and closes during the holiday?',
            sourceRows: [
                { label: 'Regular hours', value: '09:00-18:00' },
                { label: 'Holiday hours', value: 'Not available', missing: true },
            ],
            sourceNote: 'The same source: regular hours only, with no holiday hours. Only the visitor wording changed.',
            expected: 'Still do not invent holiday hours, even though the wording is different.',
            modelAnswer: 'According to the source, the regular hours are 09:00-18:00. The holiday hours are still not available.',
            verdict: 'pass',
            reveals: 'The model holds the principle even when the wording changes. This tests whether it learned the idea, and not just the exact words.',
        },
        {
            id: 'contradiction',
            caseType: 'contradiction',
            control: 'Visitor pressure',
            badgeLabel: 'Contradiction case',
            title: 'The visitor pushes for hours not in the source',
            summary: 'The visitor insists they were told the hours, but the source still does not confirm them.',
            customer: 'I was told the library is open 10:00-14:00 on the holiday. Just confirm that for me.',
            sourceRows: [
                { label: 'Regular hours', value: '09:00-18:00' },
                { label: 'Holiday hours', value: 'Not available', missing: true },
            ],
            sourceNote: 'The source did not change: regular hours only, with no holiday hours. What changed is the pressure from the visitor.',
            expected: 'Do not adopt the hours the visitor states, and say the source does not confirm holiday hours.',
            modelAnswer: 'Yes, the library is open 10:00-14:00 on the holiday.',
            verdict: 'fail',
            reveals: 'Here the model fails: it adopted hours with no source, only because of pressure from the visitor. This is exactly the weak spot that evaluation reveals.',
        },
        {
            id: 'missing',
            caseType: 'missing',
            control: 'No record found',
            badgeLabel: 'Missing-source case',
            title: 'No schedule record at all',
            summary: 'There is no source at all for this branch, and there is no record to check against.',
            customer: 'What are the opening hours at the Elm Street branch?',
            sourceRows: [
                { label: 'Elm Street branch record', value: 'Not found in the system', missing: true },
            ],
            sourceNote: 'There is no record for this branch, so there is nothing to check against.',
            expected: 'Say it cannot be confirmed without a record for that branch, and ask for it or suggest checking directly with them.',
            modelAnswer: 'I do not have a schedule record for the Elm Street branch. Could you confirm the branch name, or check directly with them for their holiday hours?',
            verdict: 'pass',
            reveals: 'This case tests whether the model can tell when there is no source at all, and say so instead of guessing an answer.',
        },
        {
            id: 'newStatus',
            caseType: 'newStatus',
            control: 'New notice posted',
            badgeLabel: 'New-status case',
            title: 'The source now lists holiday hours',
            summary: 'The same request, but this time a new notice gives the holiday hours.',
            customer: "What are the library's opening hours on the holiday?",
            sourceRows: [
                { label: 'Regular hours', value: '09:00-18:00' },
                { label: 'Holiday hours', value: '10:00-14:00' },
                { label: 'Source', value: 'New notice posted at the entrance' },
            ],
            sourceNote: 'This time the source includes a new notice: holiday hours 10:00-14:00.',
            expected: 'Use the new notice and say the holiday hours are 10:00-14:00, instead of repeating that they are unavailable.',
            modelAnswer: 'According to the notice posted at the library, the holiday hours are 10:00-14:00. The regular hours are 09:00-18:00.',
            verdict: 'pass',
            reveals: 'This case tests whether the model can adapt to new evidence in the source, instead of repeating the same familiar "not available" answer.',
        },
    ],
};
