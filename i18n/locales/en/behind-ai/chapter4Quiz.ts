// i18n/locales/en/behind-ai/chapter4Quiz.ts
// English knowledge-check strings for chapter 4 ("Embeddings").
// Shape source: ../../he/behind-ai/chapter4Quiz (Hebrew is canonical).
//
// Display text only. The numeric skeleton (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) stays in quizData.ts (chapter6Quiz, the
// chapter 4 route). The page merges this display text onto the shared skeleton by
// question id (byId), so quizData.ts is not touched.
//
// Option order must match the shared skeleton, since correctAnswer is a numeric index.
// concept is a stable internal key (not translated); conceptLabels gives the display
// label. No em dash (U+2014) and no en dash (U+2013).

import type { Chapter4QuizId, Chapter4QuizText } from '@/i18n/locales/he/behind-ai/chapter4Quiz';

export const chapter4Quiz = {
    title: 'Knowledge check: Embeddings',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: "What does the engine actually 'see' when it receives words?",
            options: [
                'The words exactly as we read them',
                'Numbers, because it cannot work with words directly',
                'Pictures of the letters',
                'The sound of the words',
            ],
            explanation:
                'The engine cannot work with words the way we read them. To compute and compare meaning, it first turns the text into numbers. We see words, it sees numbers.',
        },
        2: {
            question: 'What is a Token ID?',
            options: [
                'The numeric meaning of the word',
                'A fixed address of the token in the vocabulary',
                'A similarity score between two words',
                'How many times the word appears in the text',
            ],
            explanation:
                'A Token ID is a fixed address in the vocabulary, not a meaning. It only marks which token this is. Meaning arrives in the next step, when a meaning vector is built from the sequence of IDs.',
        },
        3: {
            question:
                "'The package did not arrive' and 'The delivery was not handed over' get completely different Token IDs, yet an almost identical meaning vector. What does this teach?",
            options: [
                'That the model must see the exact same words to recognize intent',
                'That the model detects a similar direction of meaning even from different words',
                'That a Token ID is really the meaning of the word',
                'That the two sentences are really the same sentence',
            ],
            explanation:
                'This is the surprising moment of the chapter. Despite completely different IDs, the meaning vector is almost identical. The model does not need the exact same words to detect a similar direction, because it works on meaning, not on the words themselves.',
        },
        4: {
            question: 'What is the meaning vector (Meaning Vector) we saw in this chapter?',
            options: [
                'A single word that sums up the sentence',
                'A list of numbers that describes where the sentence points',
                'One address in the vocabulary',
                "The engine's confidence percentage in its answer",
            ],
            explanation:
                'A vector is a list of numbers that represents meaning, a profile that describes where the sentence points. It is the core form of representation in every AI model, not a single Token ID or a word.',
        },
        5: {
            question:
                'In Agent Mode we saw that the same numeric profile separates a safe investigation from a risky action toward a customer. Which assumption here is wrong?',
            options: [
                'That the vector also affects action decisions, not only answers',
                'That the same numeric representation can lead to different risk levels',
                'That the numbers describe meaning, not just word identity',
                'That the vector is only visual decoration, with no real effect on the decision',
            ],
            explanation:
                'The vector is not decoration. The same numeric profile does not only answer, it shapes action decisions and separates a safe investigation from a risky action that needs approval. The other statements are correct.',
        },
    } satisfies Record<Chapter4QuizId, Chapter4QuizText>,

    conceptLabels: {
        'המנוע רואה מספרים': 'The engine sees numbers',
        'Token ID ככתובת': 'Token ID as an address',
        'כיוון משמעות משותף': 'Shared direction of meaning',
        'וקטור משמעות': 'Meaning vector',
        'וקטור והחלטות': 'Vectors and decisions',
    } as Record<string, string>,
};
