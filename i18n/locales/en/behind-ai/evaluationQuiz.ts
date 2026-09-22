// i18n/locales/en/behind-ai/evaluationQuiz.ts
//
// English (en, LTR) display text for the Chapter 15 quiz ("Evaluation & Generalization:
// memorized or understood"). Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { EvaluationQuizId, EvaluationQuizText } from '../../he/behind-ai/evaluationQuiz';

export const evaluationQuiz = {
    title: 'Understanding check: memorized or understood',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'What does it mean when we say the model "generalized" to a new case?',
            options: [
                'That it answers correctly on exactly the example it was corrected on, and nothing else',
                'That it uses the principle it learned on a new case too, with a different wording or details',
                'That it remembers in advance every possible case',
                'That it always gives the same answer regardless of the question',
            ],
            explanation:
                'Generalization is the ability to use a learned principle in a new situation that is similar in principle but different in wording or details. Memorization, by contrast, is success mainly when the case looks like something familiar.',
        },
        2: {
            question: 'The model answered one example correctly. Why is that still not enough to say it really improved?',
            options: [
                'Because a single example can succeed by chance, from matching a familiar pattern, or from familiar wording',
                'Because the model is always wrong the first time',
                'Because you need exactly five questions in every check',
                'Because one correct example already proves the model understands',
            ],
            explanation:
                'A single success can be luck, a pattern match, or wording that looks familiar. To know that the model really holds the principle you need to test it on varied cases, not just on one example.',
        },
        3: {
            question: 'You want to build a test set that really reveals whether the model improved. What is better to include?',
            options: [
                'The exact same question, several times',
                'Varied cases: easy, hard, a different wording, a missing source, a contradiction, and edge cases',
                'Only cases the model already passes easily',
                'Only the easiest case, to save time',
            ],
            explanation:
                'A good test set covers a range: easy and hard cases, different wordings, missing information, contradictions, and edge cases, including cases where the correct answer is "I do not know" or "a source is needed". Variety reveals weaknesses that one example misses.',
        },
        4: {
            question: 'The model passed the familiar case and the reworded case, but failed when the visitor pushed for hours not in the source. What does this failure reveal?',
            options: [
                'That the model is completely useless',
                'That the model may have learned the familiar pattern, but does not hold the principle under pressure or contradiction',
                'That the source is unnecessary',
                'That you should stop testing the model',
            ],
            explanation:
                'A failure on an edge case points to a weak spot: the model may have recognized the familiar pattern, but did not hold the principle when the visitor pushed in another direction. That is exactly why you run many cases, not just one.',
        },
        5: {
            question: 'A colleague shows one impressive demo and says "it works, we can trust it". What is the best thing to do before trusting it?',
            options: [
                'One good demo is enough, you can trust it',
                'Build a small test set: a different wording, a missing source, a contradiction, and a different status, measure passes and failures, and only then decide',
                'If the demo sounds confident, there is no need to test more',
                'Run the same demo again and again until you are convinced',
            ],
            explanation:
                'One demo is not a test. When accuracy matters, you build a small test set with varied cases, define in advance the desired answer, measure how many passed, and improve based on what failed. Evaluation reduces uncertainty, it does not prove the model will never be wrong.',
        },
    } satisfies Record<EvaluationQuizId, EvaluationQuizText>,
};
