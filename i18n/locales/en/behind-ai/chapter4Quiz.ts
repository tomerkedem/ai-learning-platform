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
            question: 'What is true about the sentence "the package did not arrive" at the embedding stage?',
            options: [
                'The sentence is split into tokens, and each token has its own Token ID and row in the table',
                'The whole sentence gets one Token ID, and it pulls one row out of the table',
                'Only the first token gets a row in the table, and that row stands for the whole sentence',
                'All the token IDs merge into one fixed ID, and that ID is used to reach the table',
            ],
            explanation:
                'The sentence does not enter the table as a single unit. It is split into tokens, each token has its own Token ID, and each Token ID points to its own row in the embedding table. There is no row for a whole sentence, and no single ID that stands for the whole sentence. What is pulled out at this stage is a sequence of rows, one per token.',
        },
        2: {
            question: 'A word\'s Token ID has the digits 4, 1, 7. Does the model calculate the vector from these digits?',
            options: [
                'No. 417 is an address. The vector is looked up from row 417 in the table, and the digits themselves are not part of the calculation',
                'Yes. The model runs a calculation on the digits 4, 1 and 7 to build the vector',
                'Yes. The size of the number 417 decides how important the word is in the sentence',
                'No. There is no link between the ID and the vector, the model builds a new vector every chat',
            ],
            explanation:
                'A Token ID is an address, not an input to a calculation. The number 417 only selects row 417 in the embedding table, and from there the model looks up the learned vector. The digits 4, 1 and 7 are not part of any calculation, the size of the number says nothing about importance, and the model does not build a new vector every chat, it looks up what was already learned.',
        },
        3: {
            question:
                'A token already has a Token ID. What happens after that?',
            options: [
                'The ID points to a row in the embedding table, which holds the vector learned for the token',
                'The ID itself carries the meaning of the token, and no further step is needed',
                'The model builds a brand new vector for the token in every conversation',
                'The size of the ID decides how important the token is in the sentence',
            ],
            explanation:
                'A Token ID is an address, not meaning. It points to a fixed row in the embedding table, and the contents of that row are the vector learned during training. The model looks that vector up at use time, it does not recompute it in every conversation, and the size of the ID says nothing about how important the token is.',
        },
        4: {
            question: 'In the lab you saw a row of numbers with no name on any dimension. What can you conclude about the vector?',
            options: [
                'The meaning is learned from the whole pattern of values, and usually no single dimension has a fixed human-readable label',
                'Every position in the vector has a clear, fixed concept you could name',
                'The vector is a random list of numbers with no learned meaning',
                'The digits of the Token ID are what set the values of the vector',
            ],
            explanation:
                'The vector holds many learned numbers, and the meaning is spread across the whole pattern, not sitting in any single number. Usually no single dimension has a name a person can read. The values were learned during training to represent meaning, they are not random, and they are not derived from the digits of the Token ID. The ID only selects the row.',
        },
        5: {
            question:
                'In the lab we switched a word\'s row from "learned" to "random". A list of numbers is still shown. What is true?',
            options: [
                'It is a random vector, not an embedding. Its values were never learned in training',
                'It is still an embedding, because any list of numbers standing for a word is an embedding',
                'It is a new embedding that the model trains right now, just for this conversation',
                'It is no longer a vector at all, because only learned values can form a vector',
            ],
            explanation:
                'Both rows are vectors, but only one is an embedding. What makes a vector an embedding is not that it holds numbers, it is that its values were learned during training in order to represent meaning. Random numbers stay a plain list of numbers with no learned meaning. And note: the model does not train a new vector for each chat, it looks up the values it already learned and processes them in context.',
        },
    } satisfies Record<Chapter4QuizId, Chapter4QuizText>,

    conceptLabels: {
        'לכל טוקן שורה משלו': 'Each token has its own row',
        'Token ID ככתובת': 'Token ID as an address',
        'מכתובת לווקטור': 'From address to vector',
        'ממדים אינם קריאים': 'Dimensions are not readable',
        'נלמד מול אקראי': 'Learned vs random',
    } as Record<string, string>,
};
