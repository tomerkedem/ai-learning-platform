// i18n/locales/en/behind-ai/chapter2Quiz.ts
// English Chapter 2 quiz display text. Shape source: ../../he/behind-ai/chapter2Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). "Model Input", "model", and "error
// code" wording is kept consistent with the chapter body.

export const chapter2Quiz = {
    title: 'Knowledge check: Model Input',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: 'Is the message the user sees in the chat always the entire input passed to the model?',
            options: [
                'Yes. Only the visible text can ever be passed to the model, with nothing added.',
                'No. It is part of the input, but the application may also attach instructions, conversation history, or other context.',
                'No. The model automatically knows whatever the user left out too.',
                'Yes. Hidden context exists only after the text is split into tokens.',
            ],
            explanation:
                'The visible message is part of the input, but not necessarily all of it. An AI application may attach instructions, earlier parts of the conversation, or other context, and this varies from one application to another. The model does not automatically receive what was not written and not attached, and whatever is missing stays missing.',
        },
        2: {
            question: "A user writes 'My printer isn't working?' with no other detail. What does this say about what the model can do?",
            options: [
                'The model knows exactly which printer and when it broke, because the intent is clear',
                'The model will ignore the message because it lacks enough information',
                'Details are missing, so the model will likely guess, ask, or answer in general terms',
                'The model will pull the correct answer from a store of replies',
            ],
            explanation:
                'What was not written is part of the story. Without an error code or details, the model has nothing to rely on to check a specific case. So the reasonable behavior is to ask what is missing or answer in general terms, not to invent details.',
        },
        3: {
            question:
                "'My printer isn't working. What should I do?' versus 'My printer isn't working?'. Same intent, but what is the difference from the model's point of view?",
            options: [
                'The first phrasing explicitly asks for guidance, while the second stays a wondering with no clear request',
                'No difference, because both messages are about the same printer',
                'The difference is only in length, and that has no effect',
                'The second is clearer because it has a question mark',
            ],
            explanation:
                "Same topic, but the phrasing decides what the model receives. 'What should I do' is an explicit request for guidance, while a short question with no request leaves ambiguity. A small change in phrasing changes the task the model faces.",
        },
        4: {
            question: "The user adds 'The error code is 12345'. Why does this change what the model can do?",
            options: [
                'Because a long number always gets priority with the model',
                'Because numbers make the model answer faster',
                'Because the number tells the model this is an urgent request',
                'Because now there is an identifier that allows checking a real status, instead of guessing',
            ],
            explanation:
                'The identifier is not just more text. It turns a general request into something that can be checked against an external diagnostic system. The new input opens an option for action that did not exist before, and can shift the behavior toward a real check.',
        },
        5: {
            question: "In the middle of a conversation about a printer, the user writes 'Not the printer, I meant the scanner'. What does this message do?",
            options: [
                'It erases everything said earlier in the conversation',
                'It updates the current context, so from here on the model treats it as the scanner, not the printer',
                'It changes nothing, because the model already understood printer',
                'It changes the model itself for good, in every future conversation',
            ],
            explanation:
                'The correction enters as new input and updates the context of the current conversation, so the next replies work with the scanner. It does not change the model itself, only what sits in front of it in this conversation.',
        },
    },

    conceptLabels: {
        'הודעה גלויה אינה כל הקלט': 'The visible message is not the whole input',
        'מה שחסר משנה': 'What is missing matters',
        'ניסוח משנה משימה': 'Phrasing changes the task',
        'מזהה פותח אפשרות': 'An identifier opens an option',
        'תיקון משנה הקשר לא אימון': 'A correction changes context, not training',
    } as Record<string, string>,
};
