// i18n/locales/en/behind-ai/finalExam.ts
// English final-exam chrome. Shape source: ../../he/behind-ai/finalExam.
//
// Display text only. Behavior (questions, passScore, onComplete, getReviewLinks)
// and the structural tier data (min/color) stay in quizData.ts. Tier order must
// stay identical to the Hebrew source, since label/sub overlay min/color by index.
// The course name matches the English catalog title ("Behind the Scenes of AI").
//
// No em dash (U+2014) and no en dash (U+2013) in this file.

export const finalExam = {
    questionOverrides: {
        13: { question: 'What does a large probability gap between the leading continuation and the shown alternatives tell us?', options: ['It is only decoration with no value', 'The model strongly prefers the leader within this distribution, not that it is factually true, grounded, or authorized', 'It slows the model, so it should be hidden', 'It replaces the answer itself'], explanation: 'A large probability gap shows a strong preference within the displayed distribution. It does not prove truth, grounding, or permission to act. Factual trust requires suitable context, evidence, grounding, or verification.' },
        17: { question: 'You corrected an answer in a chat. What is most accurate about using that correction now and later?', options: ['The model has a short memory that quickly fills up', 'It may affect the current context; a new chat does not contain it automatically unless the product stores or retrieves it, and this is not instant model training', 'The model learns only from other users', 'The model deliberately ignores your correction'], explanation: 'The correction can affect later responses in the current context. A product may save selected information for future use without changing model parameters. Prompts, rules, workflows, sources, or tools may also improve later; model training is a separate process. One correction does not instantly retrain the global model.' },
    },
    backToChapter: 'Back to chapter 19',
    pageTitle: 'Course final exam',
    pageSubtitle:
        'The summary exam for "Behind the Scenes of AI". It tests the whole path: from input to the responsible decision, and the links between the concepts. You can return to it any time, and your progress is saved on your device.',

    examTitle: 'Course final exam: Behind the Scenes of AI',
    examSubtitle: 'Eighteen questions that sum up the whole course, from input to the responsible decision.',
    startLabel: 'Start the final exam',
    submitLabel: 'Finish the final exam',
    completedTitle: 'Final exam complete',
    reviewLabel: 'Back to the start of the course',
    nextLabel: 'Done: back to the course catalog',

    tiers: [
        { label: 'Excellent', sub: 'You understand the inner flow of AI and can explain it' },
        { label: 'Very strong', sub: 'The main ideas are clear, worth refreshing a few points' },
        { label: 'Partial understanding', sub: 'We recommend reviewing the chapters you missed' },
        { label: 'Worth retaking the course', sub: 'It is worth going over the material again before moving on' },
    ],
};
