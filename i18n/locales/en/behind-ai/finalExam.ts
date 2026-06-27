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
    backToChapter: 'Back to chapter 16',
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
