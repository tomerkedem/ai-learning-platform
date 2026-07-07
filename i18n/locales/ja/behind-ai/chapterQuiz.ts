// i18n/locales/ja/behind-ai/chapterQuiz.ts
// Japanese chapter-quiz chrome. Shape source: ../../he/behind-ai/chapterQuiz.
//
// Display text only. Quiz behavior stays in quizData.ts. Question content is out of
// scope here. "AI" and other Latin terms (Attention, Tool Call, Tokenization, prompt)
// are kept on purpose. No em dash (U+2014) and no en dash (U+2013).

export const chapterQuiz = {
    subtitle: 'この章で学んだことを確かめる5つの問題',
    startLabel: 'テストを始める',
    submitLabel: 'テストを終える',
    completedTitle: 'テスト完了',

    title: (chapterName: string) => `理解度テスト: ${chapterName}`,
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `第${chapterNumber}章に戻る: ${chapterName}`,

    chapterNames: {
        1: '透明なチャット',
        2: 'Model Input',
        3: 'Tokenization',
        4: 'Embeddings',
        5: 'Semantic Space: 意味のマップ',
        6: 'Attention：いま何が重要か',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Generation Loop',
        11: 'Hallucinations',
        12: 'RAG & Grounding',
        13: 'Self-Check',
        14: 'Learning from Mistakes',
        15: '評価と一般化',
        16: 'AI は私から学ぶのか',
        17: 'Chat to Agent',
    } as Record<number, string>,
};
