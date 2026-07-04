// i18n/locales/ar/behind-ai/chapterQuiz.ts
// Arabic (Modern Standard Arabic) chapter-quiz chrome.
// Shape source: ../../he/behind-ai/chapterQuiz.
//
// Display text only. Quiz behavior stays in quizData.ts. Question content is out of
// scope here. "AI" is kept in Latin to match the catalog title. No em dash (U+2014)
// and no en dash (U+2013). Latin terms (Attention, Tool Call, Tokenization, prompt) kept.

export const chapterQuiz = {
    subtitle: 'خمسة أسئلة تثبّت ما تعلّمته في هذا الفصل',
    startLabel: 'ابدأ الاختبار',
    submitLabel: 'إنهاء الاختبار',
    completedTitle: 'اكتمل الاختبار',

    title: (chapterName: string) => `اختبار فهم: ${chapterName}`,
    reviewLinkLabel: (chapterNumber: number, chapterName: string) =>
        `العودة إلى الفصل ${chapterNumber}: ${chapterName}`,

    chapterNames: {
        1: 'المحادثة الشفافة',
        2: 'Model Input',
        3: 'Tokenization',
        4: 'Embeddings',
        5: 'Semantic Space: خريطة المعنى',
        6: 'Attention: ما المهم الآن',
        7: 'Context Window',
        8: 'Logits & Softmax',
        9: 'Decoding',
        10: 'Generation Loop',
        11: 'اختيار الأداة',
        12: 'Tool Call وحلقة القرار',
        13: 'التوقّف والموافقة والمسؤولية',
        14: 'المختبر الموحّد',
        15: 'هل يتعلّم AI من الأخطاء',
        16: 'العمل بشكل صحيح مع AI',
    } as Record<number, string>,
};
