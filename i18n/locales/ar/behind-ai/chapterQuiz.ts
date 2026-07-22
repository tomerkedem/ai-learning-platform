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
    nextQuestionLabel: 'السؤال التالي',
    transitions: {
        2: 'أصبحنا نعرف ما الذي يجمعه المنتج. فكيف يقسم النموذج الإدخال إلى وحدات يستطيع معالجتها؟', 3: 'يحدد Token ID التوكن، لكن الرقم نفسه لا يحمل معنى. فكيف يتحول إلى تمثيل مفيد؟',
        6: 'لا يستطيع Attention ترجيح إلا المعلومات المتاحة الآن. فما الموجود في النافذة الحالية؟', 7: 'أصبح السياق جاهزا. فكيف يحوله النموذج إلى درجات للتوكنات التالية؟', 8: 'ينتج Softmax توزيعا، لكنه ليس اختيارا بعد. فكيف يتم اختيار التوكن التالي؟', 9: 'تم اختيار توكن واحد. فكيف يتحول هذا الاختيار إلى إجابة كاملة؟',
        10: 'قد تكون الإجابة سلسة ومع ذلك خاطئة. لماذا يحدث ذلك؟', 11: 'إذا لم تكف السلاسة، فكيف تربط المنظومة الإجابة بدليل خارجي؟', 12: 'يحسن المصدر الارتكاز، لكن المسودة قد تسيء استخدامه. فكيف تقارن بالدليل؟', 13: 'قد يكشف الفحص مشكلة واحدة. ماذا يحدث عندما يتكرر الخلل وتحتاج المنظومة إلى التحسن؟',
        14: 'قد يحسن التغيير الأمثلة المألوفة. فكيف نختبره في حالات جديدة؟', 15: 'نعرف الآن كيف تقيم التحديثات. لكن هل يصحح تعديل واحد في محادثتي النموذج نفسه؟', 16: 'حتى الآن كانت المنظومة تعيد إجابات أساسا. ما الذي يتغير عندما تتابع هدفا عبر عدة خطوات وأفعال؟',
    } as Record<number, string>,

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
        11: 'Hallucinations',
        12: 'RAG & Grounding',
        13: 'Self-Check',
        14: 'Learning from Mistakes',
        15: 'التقييم والتعميم',
        16: 'هل يتعلّم AI مني',
        17: 'Chat to Agent',
        18: 'Guardrails',
        19: 'Full Trace',
    } as Record<number, string>,
};
