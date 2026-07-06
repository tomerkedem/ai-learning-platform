// i18n/locales/en/behind-ai/groundingQuiz.ts
//
// English (en, LTR) display text for the Chapter 12 quiz ("RAG & Grounding: How AI Connects
// to Sources"). Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { GroundingQuizId, GroundingQuizText } from '../../he/behind-ai/groundingQuiz';

export const groundingQuiz = {
    title: 'Understanding check: how AI connects to sources',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'In this course, what does a grounded answer mean?',
            options: [
                'An answer that sounds confident and professional',
                'An answer that rests on information provided or retrieved, not only on language continuation',
                'A longer, more detailed answer',
                'An answer the model kept in memory from earlier training',
            ],
            explanation:
                'Grounding means the answer is tied to concrete information that was provided or retrieved, such as a status card or a document. It does not rest only on plausible sounding text. Confident wording is not grounding.',
        },
        2: {
            question: 'In short, what does RAG do?',
            options: [
                'It retrains the model so it knows more for good',
                'It retrieves relevant information, adds it to the context, then writes an answer based on it',
                'It deletes everything the model is unsure about',
                'It guarantees that every answer is correct',
            ],
            explanation:
                'RAG is, in short: retrieve relevant information, add it to the context, and write an answer grounded in it. It does not retrain the model and does not make it all knowing. It gives the model a source to rest on at answer time.',
        },
        3: {
            question: 'After the hallucinations chapter, why does connecting a source reduce the risk of an invented answer?',
            options: [
                'Because a source makes the model phrase things more confidently',
                'Because when the fact is in the context, the model has something to rest on instead of filling in a plausible guess',
                'Because a source stops the model from writing long answers',
                'Because a source removes the need for fact checking entirely',
            ],
            explanation:
                'In the previous chapter we saw that when a fact is missing, the model may fill it in with a plausible continuation. A source puts the fact into the context, so the model has something to rest on. That reduces guessing, but it does not remove the need to check that the source itself is correct.',
        },
        4: {
            question: 'The model got a status card and wrote an answer grounded in it. What is still true?',
            options: [
                'The answer is certainly correct, because it is based on a source',
                'If the source itself is wrong or out of date, even a grounded answer can be wrong',
                'The model now always knows the real status',
                'Human judgment is no longer needed',
            ],
            explanation:
                'Grounding ties the answer to a source, but it does not check whether the source is correct. A wrong, out of date, or irrelevant source leads to an answer that is grounded and wrong at the same time. A source is not magic, and it does not replace judgment.',
        },
        5: {
            question: 'The provided source is incomplete, or it conflicts with what the customer said. What is the best answer?',
            options: [
                'Fill in the gap with a guess to give a complete answer',
                'Say what the source does state, note what is missing or conflicting, and offer a step to check',
                'Ignore the source and return a generic answer',
                'Blame the customer for having wrong information',
            ],
            explanation:
                'When the source is incomplete, the answer should say there is not enough information and ask for data. When the source conflicts, the answer should reflect what the source says, flag the conflict carefully, and offer to open an inquiry. Good grounding does not invent, and does not hide what the source leaves out.',
        },
    } satisfies Record<GroundingQuizId, GroundingQuizText>,
};
