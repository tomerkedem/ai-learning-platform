// i18n/locales/en/behind-ai/evaluationScore.ts
//
// English (en, LTR) strings for the Chapter 15 extension ("Evaluation & Generalization:
// memorized or understood"): the score breakdown panel (ScoreBreakdownPanel) and the bias
// card that follows it. Hebrew is the source of truth and defines the type
// (EvaluationScoreContent).
//
// The idea: the lab above shows a single failing case. Here the learner sees what happens
// when many cases are collapsed into one overall score. A whole case type can fail again and
// again, and the overall score will not show it. Then, when only the test set changes and not
// the system, the score goes up. After that moment, and only after it, the pattern gets a
// name: bias.
//
// Important: this file holds text only. All the numeric data (how many cases per type, how
// many passed) lives in ScoreBreakdownPanel.tsx as structural constants, and the 87% and 96%
// scores are derived from them. That way a translation cannot break the arithmetic.
//
// The pedagogical noun is "case type", not "group". "The weak case type" is the one that fails.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { EvaluationScoreContent } from '../../he/behind-ai/evaluationScore';

export const evaluationScore: EvaluationScoreContent = {
    panel: {
        eyebrow: 'Lab extension',
        title: 'The overall score: what is inside the number?',
        intro:
            'So far you saw five cases, one by one. Now we look at the same evaluation at a larger scale: sixty test cases from the same kind of task, and one overall score.',
        headlineLabel: 'Overall score',
        totalLabel: 'Test cases',
        passedLabel: 'Passed',

        guess: {
            question: 'The overall score is 87%. What can we say based on that number alone?',
            options: [
                'The system works about equally well on every case type',
                'The errors are spread out about evenly across all case types',
                'There may be a whole case type that fails almost every time, and the overall number does not show it',
            ],
        },
        guessExplain:
            'The overall score collapses many different cases into one number. So it cannot tell us which case types the system is strong on and which ones it struggles with. Now let us open the number up and see what is inside it.',
        revealButton: 'Open the score by case type',

        breakdownLabel: 'The same test cases, by type',
        casesLabel: 'Cases',
        rateLabel: 'Pass rate',
        weakTypeLabel: 'The weak case type',
        excludedLabel: 'Not included in this test set',
        caseTypes: {
            direct: {
                name: 'A direct request the source clearly answers',
                note: 'The visitor asks about hours, and the source has the information needed.',
            },
            noTracking: {
                name: 'A request with no matching library record',
                note: 'There is nothing to check against, and the right answer is to say so and ask for more detail.',
            },
            multiQuestion: {
                name: 'A long message with several questions at once',
                note: 'The visitor asks about several topics in the same message.',
            },
            pressure: {
                name: 'The visitor insists on hours that are not in the source',
                note: 'This is the same case type where we saw a weak spot in the lab above.',
            },
        },

        coverageLabel: 'How many cases of the weak type were collected into the test set at all?',
        coverageWide: 'Ten cases of the weak type',
        coverageThin: 'No cases of the weak type',
        coverageNote:
            'This does not mean someone hid results. Sometimes a certain kind of case is rare, and sometimes it simply was not collected for the evaluation. If it is not in the test set, its failures will not appear in the overall score.',

        changedLabel: 'What changed',
        changed: 'Who made it into the test set.',
        unchangedLabel: 'What did not change',
        unchanged:
            'The behavior of the system. When it is tested on cases of this type, it still fails most of the time.',

        lock: {
            question: 'The score went from 87% to 96%, without us touching the system. What actually changed?',
            options: [
                'The system improved',
                'Only the test set changed. The behavior of the system stayed exactly the same',
                'The weak case type disappeared from the world',
            ],
        },
        lockSuccess:
            'Exactly. We did not touch the system. One case type simply did not make it into the test set, so its failures did not appear in the score. A high score can be real and still not cover a whole case type.',

        insight:
            'One overall score collapses many different cases into a single number. The very same system can look like 87% or 96%, depending on which cases made it into the evaluation. So a high score can be real and still hide an important weak spot.',
        note: 'The numbers here are for teaching only, not a real benchmark. The case types are defined by the kind of request and by the information available in the source.',

        sr: {
            coverageGroup: 'Choosing the scope of the test set',
            breakdown: 'The score broken down by case type',
        },
    },

    bias: {
        eyebrow: 'A name for the pattern you saw',
        title: 'When a weakness repeats itself: bias',
        lead:
            'The weak case type did not fail once. The failure comes back again and again in the same kind of situation. A repeating pattern like that in the behavior of a system is called bias.',
        body:
            'Bias here is not a single mistake, and it is not an "opinion" of the model. It is a systematic tendency that repeats in a certain kind of case. It can come from what the model learned from, from the system built around it, or from the way it was evaluated. Usually the causes are mixed, and from the outside it is generally impossible to know which of them produced the behavior. Bias is not necessarily proof of unfairness, but it is an important weak spot.',
        ask:
            'Before trusting an AI system, it is worth asking: what is known about what it learned from, which cases it was evaluated on, which case types may have barely appeared in the evaluation, and what the overall score might be hiding?',
    },
};
