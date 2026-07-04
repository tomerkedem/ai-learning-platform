// i18n/locales/en/behind-ai/decodingQuiz.ts
//
// English (en) display strings for the Chapter 9 (Decoding) understanding check. Hebrew is
// the source of truth. This is display text only: the shared mechanism (correctAnswer,
// difficulty, concept, onComplete, getReviewLinks, nextHref) lives in quizData.ts. The
// chapter page merges this text onto the shared question skeleton by question id.
//
// The order of options must match the shared skeleton, since correctAnswer is a numeric
// index.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { DecodingQuizId, DecodingQuizText } from '../../he/behind-ai/decodingQuiz';

export const decodingQuiz = {
    title: 'Understanding check: Decoding',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'What is decoding, the token-choosing step?',
            options: [
                'The step where raw scores turn into probabilities',
                'The step where the model chooses the next token from the probability distribution',
                'A check of the facts against an external source',
                'Translating the answer into another language',
            ],
            explanation:
                'Decoding is the choosing step: from the probability distribution that already exists, the model picks the next token. Turning scores into probabilities happened earlier, in Softmax. The choice itself does not check facts and does not translate.',
        },
        2: {
            question: 'Why does the choosing step come after the probabilities already exist?',
            options: [
                'Because you cannot choose a token before there is a distribution to choose from',
                'Because the choice is what creates the probabilities',
                'Because the choice deletes the probabilities',
                'Because the model chooses the entire final answer at once',
            ],
            explanation:
                'First the distribution is formed, and only then can a token be chosen from it. The choice does not create or delete the probabilities, it relies on them. And the model builds an answer token by token, it does not choose the whole answer at once.',
        },
        3: {
            question: 'What is the difference between a conservative choice and an open choice?',
            options: [
                'Conservative chooses completely at random, and open always chooses the highest',
                'Conservative leans toward the most likely option and is more stable, and open can also choose a less likely option and is more varied',
                'Both always choose exactly the same token',
                'Open checks facts, and conservative does not',
            ],
            explanation:
                'A conservative choice leans toward the option with the highest probability, so the output is more predictable and stable. An open choice gives lower options a chance too, so it is more varied but less stable. Neither one checks facts.',
        },
        4: {
            question: 'In an open style a continuation with a relatively low probability was chosen. Why did that happen?',
            options: [
                'Because an open style gives lower options in the distribution a chance too',
                'Because the low option is actually the correct one',
                'Because the model checked and found it preferable',
                'Because the probabilities flipped at the moment of choice',
            ],
            explanation:
                'An open style does not ignore the probabilities, but it gives less likely options a chance too. So sometimes a lower option gets chosen. That adds variety, but it does not mean the model checked it or that the probabilities changed.',
        },
        5: {
            question: 'The model chose a continuation that sounds convincing, but it is actually wrong. Where is the flaw in concluding that "if it was chosen, then it is true"?',
            options: [
                'There is no flaw, whatever is chosen is always true',
                'The decoding style decides how you choose from the probabilities, it does not check the world. Verification needs a source or a tool',
                'The flaw is that the model should not choose tokens at all',
                'The flaw is that the continuation did not get a high enough probability',
            ],
            explanation:
                'The act of choosing verifies nothing. The decoding style only decides how you choose from the existing probabilities, it does not reach out to any external source. To know whether the package really was delayed or delivered you need a tracking tool or a verified source, not the act of choosing.',
        },
    } satisfies Record<DecodingQuizId, DecodingQuizText>,
};
