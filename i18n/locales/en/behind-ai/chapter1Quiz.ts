// i18n/locales/en/behind-ai/chapter1Quiz.ts
// English Chapter 1 quiz display text. Shape source: ../../he/behind-ai/chapter1Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). "AI", "Chat", "Agent", "token", and
// "model" are kept as fixed terms.

export const chapter1Quiz = {
    title: 'Knowledge check: The Transparent Chat',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: 'When you get an answer from AI, what is the main idea this chapter wants you to grasp about what happened behind it?',
            options: [
                'The answer was pulled ready-made from a store of pre-written replies',
                'A whole path runs behind the answer: tokens, probabilities, confidence, and a decision',
                'The engine took the first answer that came to mind without weighing other options',
                'The answer was set only by the last word in the sentence you wrote',
            ],
            explanation:
                'From the outside you see only the result, but a whole process runs between the question and the answer. The engine splits the text into tokens, computes probabilities, checks how confident it is, and only then decides. The entire chapter is meant to make that path visible.',
        },
        2: {
            question: 'What is the essential difference between Chat Mode and Agent Mode as shown in this chapter?',
            options: [
                'Chat is faster, and Agent is slower but more accurate',
                'Chat understands one language, and Agent understands only another',
                'Chat picks an answer, and Agent checks what the right next step is - to answer, to use a tool, or to stop and ask for information',
                'Chat uses tokens, and Agent does not need them',
            ],
            explanation:
                'The difference is not about speed or language. In Chat the system picks a text answer. In Agent it first asks what the right next step is: maybe answer, maybe use a tool, and maybe stop and ask for missing information.',
        },
        3: {
            question: 'According to the chapter, when should the engine stop and ask instead of answering with confidence?',
            options: [
                'When the gap between the leading option and the next one is small',
                'When the gap between the leading option and the next one is large',
                'Always, because the engine can never be sure',
                'Never, because stopping to ask for clarification counts as a system failure',
            ],
            explanation:
                'The engine ranks options and decides by the gap between them. A large gap means high confidence, so it can answer. A small gap means uncertainty, and then the right step is to stop and ask, not to guess. A stop like that is not a failure but the responsible move.',
        },
        4: {
            question:
                'According to the chapter, the engine builds its estimate while reading the sentence, word by word. What does this teach about how it reaches an answer?',
            options: [
                'The engine waits for the end of the sentence and only then starts computing anything',
                'The engine sets the answer by the first word and does not change it afterward',
                'The engine builds an estimate as it reads, and each added word can change the lead',
                'The engine reads all the words at once, so the order does not matter to it',
            ],
            explanation:
                'The estimate is not fixed; it is built while reading. As more information comes in, the leading guess can switch. The engine does not "know" the answer in advance, it updates an estimate as it reads. In the depth layer you can drag the read head and watch the lead change for yourself.',
        },
        5: {
            question:
                'Given: two users send a sensitive request. For the first, the engine shows a large gap between the leading option and the second; for the second, the gap is very small. By the chapter\'s practical rule, what is most correct?',
            options: [
                'In both cases the engine should answer right away, because it always picks the option with the highest number',
                'For the first you can rely more on the action; for the second, when the gap is small and the action is sensitive, it is better to stop and ask for clarification',
                'For the second you can act with more confidence, because a small gap means all the options are good',
                'In both cases you should always stop, because any sensitive action is forbidden to the engine',
            ],
            explanation:
                'The practical rule combines two factors: the size of the gap and the risk. A large gap and low risk - you can rely on it. A small gap or a sensitive action - stopping and asking for clarification is the responsible move, not a failure. A small gap actually signals uncertainty, not confidence.',
        },
    },

    conceptLabels: {
        'תהליך מול תשובה': 'Process vs answer',
        'Chat מול Agent': 'Chat vs Agent',
        'ביטחון לפי הפער': 'Confidence from the gap',
        'קריאה חיה': 'Live reading',
        'ביטחון פוגש אחריות': 'Confidence meets responsibility',
    } as Record<string, string>,
};
