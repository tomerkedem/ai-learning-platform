// i18n/locales/en/behind-ai/chapter5Quiz.ts
// English Chapter 5 quiz display text. Shape source: ../../he/behind-ai/chapter5Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label (not wired yet).

export const chapter5Quiz = {
    title: 'Knowledge check: how AI builds an answer',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: 'How does the model arrive at a long answer?',
            options: [
                'It pulls a complete, pre-stored answer and displays it',
                'It generates it part by part, with each part built on what was already written',
                'It writes the entire answer all at once, in a single moment',
                'It translates an existing answer from another language',
            ],
            explanation:
                'The answer is not born all at once and is not pulled ready-made. The model generates a small part, joins it to the context, and then moves to the next part. It is a loop that repeats until the answer is complete.',
        },
        2: {
            question: "The model just wrote the part 'Check the tracking number'. What is true about this part now?",
            options: [
                'It is set aside and does not affect what gets written after it',
                'It became part of the context and affects which continuations get high weight in the next step',
                'It forced the model to check the package status in the real world',
                'It resets the context and makes the model start over',
            ],
            explanation:
                "Every part that is written loops back in and joins the context. The updated context is what shapes the next choice, so after 'Check the tracking number' the plausible continuations are about what to do with the result of the check.",
        },
        3: {
            question:
                "The exact same prompt, 'My package hasn't arrived. What should I do?', is built once from the opener 'Check the tracking number' and once from 'Contact customer service'. Why do the answers come out completely different?",
            options: [
                'Because the model picks a random answer each time',
                'Because the first part chosen changed the context, so the whole continuation was built differently',
                'Because the second prompt was actually different',
                'Because in one case the model checked the facts and in the other it did not',
            ],
            explanation:
                'An early choice is not just one more word, it is a frame for everything that follows. The opener enters the context and steers it, so the exact same prompt can be built into two different answers depending on the part chosen at the start.',
        },
        4: {
            question:
                "The model built a smooth, confident answer claiming a certain package was delivered. In reality it was not. Where is the flaw in the reasoning 'if it built the answer step by step, then surely it checked it was right'?",
            options: [
                'There is no flaw, step-by-step building always checks the facts',
                'Step-by-step building assembles a continuation that fits the context, it does not check the world. Verification needs a tool or an external source',
                'The flaw is that the model should not build long answers',
                'The flaw is that the model built the answer too fast',
            ],
            explanation:
                'The loop produces a coherent continuation based on the context and the patterns it learned, but coherence is not verification. Step-by-step building does not turn to any external source, so to know whether the package was really delivered you need a tracking tool or a verified source.',
        },
        5: {
            question:
                "A friend says: 'The model already holds the full answer in its head, and it just types it out'. What is inaccurate about that statement?",
            options: [
                'There is no mistake, the full answer really is stored and shown as is',
                'There is no complete answer stored in advance. It is built gradually, and each part depends on what was written before it',
                'The mistake is that the model does not type but speaks',
                'The mistake is that the model holds several complete answers and picks one',
            ],
            explanation:
                'There is no complete answer waiting ready. The model builds it part by part, and each part is created based on the context already written. That is why the same question can be built a little differently each time, instead of repeating as a fixed quote.',
        },
    },

    conceptLabels: {
        'בנייה צעד אחר צעד': 'Step-by-step building',
        'פלט הופך לקלט': 'Output becomes input',
        'צעד מוקדם מכוון': 'An early step sets direction',
        'ייצור אינו אימות': 'Generation is not verification',
        'אין תשובה מוכנה': 'No ready-made answer',
    },
};
