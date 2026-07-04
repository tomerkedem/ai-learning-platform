// i18n/locales/en/behind-ai/logitsSoftmaxQuiz.ts
//
// English quiz display strings for Chapter 8 (Logits & Softmax). Hebrew is the source
// of truth.
//
// This is display text only. The shared skeleton (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) stays in the shared quizData.ts (logitsSoftmaxQuiz,
// chapter 8 route) and is not touched here. The chapter page merges this display text
// onto the question skeleton by question id (byId).
//
// The order of options must stay identical to the shared skeleton, because correctAnswer
// is a numeric index.
//
// No em dash (U+2014), no en dash (U+2013).

export interface LogitsSoftmaxQuizText {
    question: string;
    options: string[];
    explanation: string;
}

/** Chapter 8 question ids. byId must include all of them. */
export type LogitsSoftmaxQuizId = 1 | 2 | 3 | 4 | 5;

export const logitsSoftmaxQuiz = {
    title: 'Understanding check: Logits & Softmax',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    /** Display text for each question, keyed by question id in the shared skeleton (logitsSoftmaxQuiz). */
    byId: {
        1: {
            question: 'What are logits, the raw scores of the model?',
            options: [
                'The final answer the model has already chosen',
                'Internal scores the model gives to every possible continuation, before they become probabilities',
                'A list of facts the model verified against the world',
                'The human confidence the model feels in its answer',
            ],
            explanation:
                'Logits are raw scores the model gives to every possible continuation, based on the input and the context. This is a step before the probabilities, not the final answer and not a fact check, and not an emotion or human confidence either.',
        },
        2: {
            question: 'What does Softmax do with the raw scores?',
            options: [
                'It checks online which continuation is correct',
                'It deletes the continuations with the low score',
                'It turns the scores into a probability distribution, so all the continuations together add up to 100 percent',
                'It saves the scores for the next conversations',
            ],
            explanation:
                'Softmax takes the raw scores and turns them into a probability distribution, a percentage per continuation, with everything together adding up to 100. It does not check facts and does not delete options, it only turns scores into percentages you can compare.',
        },
        3: {
            question: 'A certain continuation came out with the highest probability. What does that mean?',
            options: [
                'That the continuation is certainly correct',
                'That the model checked reality and confirmed it',
                'That per the context and the patterns it learned, this is the most likely continuation among the ones shown',
                'That Softmax verified it against an external source',
            ],
            explanation:
                'A high probability means the continuation is the most likely per the input, the context and the patterns the model learned. It is not proof that it is true in the world. Softmax arranges scores into percentages, it does not check whether the continuation is real.',
        },
        4: {
            question: 'You added "delivery confirmation" to the context, and the probability of "was delivered" jumped. Why did that happen?',
            options: [
                'Because the model reached out to the tracking system and checked that the package was delivered',
                'Because the new context changed the raw scores, and so the probabilities moved too',
                'Because "was delivered" always gets the highest score',
                'Because Softmax picks the most positive continuation',
            ],
            explanation:
                'The probabilities are derived from the scores, and the scores depend on the context. When you add "delivery confirmation", the score of "was delivered" rises, and so does its percentage. The model did not check reality, it only reweighed what is written.',
        },
        5: {
            question: 'The model gave "was delivered" a high probability, but the package was in fact not delivered. Where is the flaw in reasoning that "a high probability means it was checked"?',
            options: [
                'There is no flaw, a high probability always means the information was verified',
                'The flaw is that the model should not be giving probabilities at all',
                'A high probability measures the fit to the text and the context, it did not check the world. Verification needs a source or a tool',
                'The flaw is that "was delivered" cannot get a high probability',
            ],
            explanation:
                'A high probability means the continuation fits what was written, not that it is correct. The model did not reach out to any external source. To know whether the package was really delivered you need a tracking tool or a verified source, not the probability on its own.',
        },
    } satisfies Record<LogitsSoftmaxQuizId, LogitsSoftmaxQuizText>,
};
