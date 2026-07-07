// i18n/locales/en/behind-ai/chapterQuiz.ts
// English chapter-quiz chrome. Shape source: ../../he/behind-ai/chapterQuiz.
//
// Display text only. Quiz behavior stays in quizData.ts. Chapter quiz question
// content is out of scope here. No em dash (U+2014) and no en dash (U+2013).
// Latin AI terms (AI, Attention, Tool Call, Tokenization, prompt) are kept on purpose.

export const chapterQuiz = {
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'Quiz complete',

    title: (chapterName: string) => `Comprehension quiz: ${chapterName}`,
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `Back to chapter ${chapterNumber}: ${chapterName}`,

    chapterNames: {
        1: 'The Transparent Chat',
        2: 'Model Input',
        3: 'Tokenization',
        4: 'Embeddings',
        5: 'Semantic Space: The Map of Meaning',
        6: 'Attention: Who Matters Now',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Generation Loop',
        11: 'Hallucinations',
        12: 'RAG & Grounding',
        13: 'Self-Check',
        14: 'Learning from Mistakes',
        15: 'Does AI Learn From Mistakes',
        16: 'Working Well With AI',
    } as Record<number, string>,
};
