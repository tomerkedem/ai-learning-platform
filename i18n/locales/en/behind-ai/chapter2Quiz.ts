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
                'The model will ignore the message because it lacks enough information',
                'Details are missing, so the model will likely guess, ask, or answer in general terms',
                'The model will pull the correct answer from a store of replies',
            ],
            explanation:
                'What was not written is part of the story. Without a tracking number or details, the model has nothing to rely on to check a specific case. So the reasonable behavior is to ask what is missing or answer in general terms, not to invent details.',
        },
        3: {
            question:
                "'My package didn't arrive. What should I do?' versus 'My package didn't arrive?'. Same intent, but what is the difference from the model's point of view?",
            options: [
                'The first phrasing explicitly asks for guidance, while the second stays a wondering with no clear request',
                'No difference, because both messages are about the same package',
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
                'Because numbers make the model answer faster',
                'Because the number tells the model this is an urgent request',
                'Because now there is an identifier that allows checking a real status, instead of guessing',
            ],
            explanation:
                'The identifier is not just more text. It turns a general request into something that can be checked against an external tracking system. The new input opens an option for action that did not exist before, and can shift the behavior toward a real check.',
        },
        5: {
            question: "In the middle of a conversation about shoes, the user writes 'Not shoes, I ordered a book'. What does this message do?",
            options: [
                'It erases everything said earlier in the conversation',
                'It updates the current context, so from here on the model treats it as a book, not shoes',
                'It changes nothing, because the model already understood shoes',
                'It changes the model itself for good, in every future conversation',
            ],
            explanation:
                'The correction enters as new input and updates the context of the current conversation, so the next replies work with the book. It does not change the model itself, only what sits in front of it in this conversation.',
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
