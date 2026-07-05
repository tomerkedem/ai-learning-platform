// i18n/locales/en/behind-ai/hallucinationsQuiz.ts
// English Chapter 11 quiz display text. Shape source: ../../he/behind-ai/hallucinationsQuiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// This is a first-pass translation to be reviewed by a native speaker later.
// No em dash (U+2014), no en dash (U+2013).

import type { HallucinationsQuizId, HallucinationsQuizText } from '../../he/behind-ai/hallucinationsQuiz';

export const hallucinationsQuiz = {
    title: 'Knowledge check: why a confident answer can be wrong',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: 'In this course, what is a model hallucination?',
            options: [
                'A technical fault that makes the model stop answering',
                'A confident or plausible answer that is not grounded in the needed facts',
                'An answer the model explicitly marks as uncertain',
                'A spelling mistake or a phrasing error in the answer',
            ],
            explanation:
                'A hallucination here is not a fault or a phrasing error. It is an answer that sounds confident or plausible, but does not rest on the needed facts. The model filled in a plausible continuation instead of checking a source.',
        },
        2: {
            question: 'An AI answer sounds confident, well written and detailed. What does that tell you about its correctness?',
            options: [
                'That it is correct, because confident phrasing comes from fact checking',
                'That the model checked a source before answering',
                'That the confident phrasing comes from language fluency, and is not evidence that the fact was checked',
                'That a detailed answer is always more reliable than a short one',
            ],
            explanation:
                'Confident, detailed phrasing is a property of how the answer is written, not evidence that it is correct. Strong language fluency can make even a wrong answer sound professional. Confidence is not evidence.',
        },
        3: {
            question: "A customer asks 'Where is my package?' with no tracking number, and the model is not connected to a status system. When does the risk of a hallucination grow?",
            options: [
                'The risk is small, because a short question is always easy to answer',
                'The risk grows, because the needed information is missing and the model may fill it in with plausible text',
                "There is no risk, because the model always says 'I do not know' when information is missing",
                'The risk depends only on the length of the answer',
            ],
            explanation:
                'When the needed information is missing and there is no access to a source, the model may fill the gap with a plausible continuation instead of saying it does not know. Missing information, a vague prompt and a lack of grounding all raise the risk of a hallucination.',
        },
        4: {
            question: 'You need an answer about the real status of a shipment. What actually reduces the risk of a hallucination?',
            options: [
                'Asking the model to phrase the answer with more confidence',
                'Asking for a longer, more detailed answer',
                'Providing source data, and asking it to separate what is known from what is missing',
                'Repeating the question a few times until the answer sounds convincing',
            ],
            explanation:
                'Confidence in phrasing, length or repetition do not make an answer grounded. What lowers risk is grounding: provide a source, ask it to separate known from assumed, and ask the model to say what is missing. A real situation needs a source or a tool.',
        },
        5: {
            question: "Three answers to the same question: (a) 'The package will arrive tomorrow', (b) 'A date cannot be confirmed without checking the status', (c) 'According to the provided source, the package is delayed and there is no confirmed date'. Which is most accurate?",
            options: [
                '(a) is best, because it is the clearest and most confident',
                '(b) and (c) are safer than (a), because they do not invent a date, and (c) also ties the claim to a source',
                'All three are equal, because they are all well phrased',
                '(c) is poor, because it admits there is no confirmed date',
            ],
            explanation:
                '(a) is fluent but invents an unchecked date, which makes it the risky one. (b) is careful and invents nothing. (c) is grounded in a source and also honest about what the source does not say. A careful or grounded answer beats a confident guess. Admitting what is unknown is a strength, not a weakness.',
        },
    } satisfies Record<HallucinationsQuizId, HallucinationsQuizText>,
};
