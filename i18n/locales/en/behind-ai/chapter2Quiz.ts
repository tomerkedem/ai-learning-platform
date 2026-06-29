// i18n/locales/en/behind-ai/chapter2Quiz.ts
// English Chapter 2 quiz display text. Shape source: ../../he/behind-ai/chapter2Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). "Model Input", "model", and "tracking
// number" wording is kept consistent with the chapter body.

export const chapter2Quiz = {
    title: 'Knowledge check: Model Input',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: 'When you send a message to the chat, what does the model receive first of all?',
            options: [
                'Your intent, even before the words',
                'The text you actually wrote, and from it the model infers',
                'The final answer it needs to return',
                'Only the words the system marked as important',
            ],
            explanation:
                'The model does not receive intent as direct input, nor a ready answer. The starting point is the written text: the words, the order, and the punctuation. From there it infers, and every later stage begins with this input.',
        },
        2: {
            question: "A user writes 'My package didn't arrive?' with no other detail. What does this say about what the model can do?",
            options: [
                'The model knows exactly which package and when, because the intent is clear',
                'Details are missing, so the model will likely guess, ask, or answer in general terms',
                'The model will ignore the message because it lacks enough information',
                'The model will pull the correct answer from a store of replies',
            ],
            explanation:
                'What was not written is part of the story. Without a tracking number or details, the model has nothing to rely on to check a specific case. So the reasonable behavior is to ask what is missing or answer in general terms, not to invent details.',
        },
        3: {
            question:
                "'My package didn't arrive. What should I do?' versus 'My package didn't arrive?'. Same intent, but what is the difference from the model's point of view?",
            options: [
                'No difference, because both messages are about the same package',
                'The first phrasing explicitly asks for guidance, while the second stays a wondering with no clear request',
                'The difference is only in length, and that has no effect',
                'The second is clearer because it has a question mark',
            ],
            explanation:
                "Same topic, but the phrasing decides what the model receives. 'What should I do' is an explicit request for guidance, while a short question with no request leaves ambiguity. A small change in phrasing changes the task the model faces.",
        },
        4: {
            question: "The user adds 'The tracking number is 12345'. Why does this change what the model can do?",
            options: [
                'Because a long number always gets priority with the model',
                'Because now there is an identifier that allows checking a real status, instead of guessing',
                'Because the number tells the model this is an urgent request',
                'Because numbers make the model answer faster',
            ],
            explanation:
                'The identifier is not just more text. It turns a general request into something that can be checked against an external tracking system. The new input opens an option for action that did not exist before, and can shift the behavior toward a real check.',
        },
        5: {
            question: "In the middle of a conversation the user writes 'Not shoes, I ordered a book'. What does this really change?",
            options: [
                'It retrains the model so it remembers this in every future conversation',
                'It updates the current context of the conversation, but does not change what the model learned in training',
                'It changes nothing, because the model already answered',
                'It erases everything said earlier in the conversation',
            ],
            explanation:
                'A correction in the conversation changes the context the model is working with right now, so the next replies in the conversation take it into account. But this is not training: the model\'s weights do not change, and once the conversation ends the correction is not kept. This distinction is opened in depth in the chapter on learning and memory.',
        },
    },

    conceptLabels: {
        'קלט הוא טקסט': 'Input is text',
        'מה שחסר משנה': 'What is missing matters',
        'ניסוח משנה משימה': 'Phrasing changes the task',
        'מזהה פותח אפשרות': 'An identifier opens an option',
        'תיקון משנה הקשר לא אימון': 'A correction changes context, not training',
    } as Record<string, string>,
};
