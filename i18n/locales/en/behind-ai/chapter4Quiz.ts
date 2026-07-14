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
            question: 'In the lab you saw bars labelled "Delivery", "Failure" and "Urgency". What does that say about the dimensions in a real vector?',
            options: [
                'The names were chosen for the visualization. A real representation has far more dimensions, and most have no readable name',
                'These are the real dimensions of the model, and they can be read exactly like this',
                'Every dimension has a clear name, but only engineers get to see it',
                'The dimensions are renamed in every conversation, according to the topic',
            ],
            explanation:
                'The names in the visualization were chosen for illustration. A real representation has hundreds of dimensions or more, and most of them have no name a person can read, engineers included. The structure of the representation is learned during training, and it does not get new names in every conversation. The values themselves, on the other hand, can change according to the input and the context.',
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
