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
    nextQuestionLabel: 'The next question',
    transitions: {
        2: 'Now we know what the product assembles. How does the model divide that input into units it can process?', 3: 'A Token ID identifies a token, but the number itself has no meaning. How does it become a useful representation?',
        6: 'Attention can weigh only information available now. What is actually inside the current window?', 7: 'The context is ready. How does the model turn it into scores for possible next tokens?', 8: 'Softmax gives a distribution, but it is not yet a choice. How is the next token selected?', 9: 'One token has been selected. How does that choice become a complete response?',
        10: 'A response can be fluent and still be wrong. Why does that happen?', 11: 'If fluency is not enough, how can the system connect the answer to external evidence?', 12: 'A source improves grounding, but the draft may still misuse it. How can the system check the draft against the evidence?', 13: 'A check can catch one problem. What happens when the failure repeats and the system needs to improve?',
        14: 'A change may improve familiar examples. How do we test whether it also works on new cases?', 15: 'We know how updates are evaluated. But does one correction in my chat change the model itself?', 16: 'So far, the system has mainly returned responses. What changes when it must pursue a goal through several steps and actions?',
    } as Record<number, string>,

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
        15: 'Evaluation & Generalization',
        16: 'Does AI Learn From Me',
        17: 'Chat to Agent',
        18: 'Guardrails',
        19: 'Full Trace',
    } as Record<number, string>,
};
