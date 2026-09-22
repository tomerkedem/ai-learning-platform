// i18n/locales/en/behind-ai/mistakeLearningQuiz.ts
//
// English (en, LTR) display text for the Chapter 14 quiz ("Learning from Mistakes: how a
// model improves from a mistake"). Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { MistakeLearningQuizId, MistakeLearningQuizText } from '../../he/behind-ai/mistakeLearningQuiz';

export const mistakeLearningQuiz = {
    title: 'Understanding check: how a model learns from a mistake',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'The same mistake keeps recurring for many users. What turns it into a real improvement?',
            options: [
                'The correction in the conversation already improved the model for all users by itself',
                'Collect the mistake as an example, review it, test a candidate fix, and release it only if the evaluation shows it helps',
                'Wait for the model to learn it on its own after enough times',
                'Ask users to phrase the question differently',
            ],
            explanation:
                'A single correction is a signal, not a model update. Real improvement is a controlled process: collect the mistake as an example, review it, test a candidate fix in the system or in training, and measure in an evaluation whether the change really helped before releasing it.',
        },
        2: {
            question: 'Why does a single correction in Chat not automatically change the base model?',
            options: [
                'Because using a correction inside the context is not the same as training or changing weights',
                'Because the model does not read the correction at all',
                'Because corrections are only saved after three times',
                'Because the model is always right and there is nothing really to fix',
            ],
            explanation:
                'Using a correction inside a conversation happens in the context. Training or a permanent change to the model is a completely different process, separate and slow, that does not happen on its own from a single message.',
        },
        3: {
            question: 'A team notices the model keeps inventing holiday hours with no source. How can it improve the system without changing the base model?',
            options: [
                'Wait for the model to fix itself on its own',
                'Change the prompt, improve the source, add a rule, and add a check',
                'Delete all the conversations of the users',
                'Ask users to phrase the question differently',
            ],
            explanation:
                'A recurring mistake is a pattern. You can fix it in the system that wraps the model: a better prompt, a more accurate source, a rule that prevents the mistake, and a check that catches it. All of this without changing the base model.',
        },
        4: {
            question: 'A team changed the prompt to fix a mistake. Why is an evaluation still needed before announcing that things improved?',
            options: [
                'Because evaluation slows the system down and is therefore required',
                'To confirm by measurement that the change really helps, and did not break something else',
                'Because without evaluation the model would not answer at all',
                'Because evaluation replaces the need for a correction',
            ],
            explanation:
                'A change can fix one case and break another. Evaluation checks many cases and measures whether we really improved. Without measurement, "we fixed it" is a feeling, not knowledge.',
        },
        5: {
            question: 'You want the model to fix the answer in the most helpful way. Which correction is better?',
            options: [
                '"Not right."',
                '"Not right. The source gives regular hours, but does not state holiday hours. Fix it so it relies only on the source."',
                '"Write a nicer answer."',
                '"Delete everything and start over."',
            ],
            explanation:
                'A helpful correction says what is wrong, what the source actually says, and what to change. That way the model can fix the answer now based on the context, instead of guessing what you meant.',
        },
    } satisfies Record<MistakeLearningQuizId, MistakeLearningQuizText>,
};
