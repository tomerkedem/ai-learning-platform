// i18n/locales/ar/behind-ai/finalExam.ts
// Arabic (Modern Standard Arabic) final-exam chrome.
// Shape source: ../../he/behind-ai/finalExam.
//
// Display text only. Behavior (questions, passScore, onComplete, getReviewLinks)
// and the structural tier data (min/color) stay in quizData.ts. Tier order must
// stay identical to the Hebrew source, since label/sub overlay min/color by index.
// The course name matches the Arabic catalog title ("ما وراء كواليس AI").
//
// No em dash (U+2014) and no en dash (U+2013) in this file.

export const finalExam = {
    questionOverrides: {
        13: { question: 'ماذا تعني فجوة احتمالية كبيرة بين الاستمرار المتصدر والبدائل المعروضة؟', options: ['إنها مجرد زينة', 'يفضل النموذج المتصدر بقوة داخل هذا التوزيع، لا أنه صحيح واقعيا أو مرتكز أو مأذون به', 'إنها تبطئ النموذج', 'إنها تستبدل الإجابة'], explanation: 'تظهر الفجوة الكبيرة تفضيلا قويا داخل التوزيع. ولا تثبت الحقيقة أو الارتكاز أو الإذن بالفعل. تتطلب الثقة الواقعية سياقا ودليلا أو Grounding أو تحققا.' },
        17: { question: 'صححت إجابة في محادثة. ما الوصف الأدق لاستخدام التصحيح الآن ولاحقا؟', options: ['للنموذج ذاكرة قصيرة تمتلئ', 'قد يؤثر في السياق الحالي؛ ولا يظهر تلقائيا في محادثة جديدة إلا إذا حفظه المنتج أو استرجعه، وهذا ليس تدريبا فوريا للنموذج', 'يتعلم النموذج من الآخرين فقط', 'يتعمد تجاهل تصحيحك'], explanation: 'قد يؤثر التصحيح في السياق الحالي. ويمكن للمنتج حفظ معلومات مختارة دون تغيير معاملات النموذج. كما يمكن تحسين prompts أو القواعد أو workflows أو المصادر أو الأدوات؛ أما تدريب النموذج فعملية منفصلة. لا يعيد تصحيح واحد تدريب النموذج العام فورا.' },
    },
    backToChapter: 'العودة إلى الفصل 19',
    pageTitle: 'الاختبار النهائي للدورة',
    pageSubtitle:
        'الاختبار الختامي لدورة "ما وراء كواليس AI". يقيس المسار كاملًا: من المدخل إلى القرار المسؤول، والروابط بين المفاهيم. يمكنك العودة إليه في أي وقت، ويُحفظ تقدّمك على جهازك.',

    examTitle: 'الاختبار النهائي للدورة: ما وراء كواليس AI',
    examSubtitle: 'ثمانية عشر سؤالًا تلخّص الدورة كاملة، من المدخل إلى القرار المسؤول.',
    startLabel: 'ابدأ الاختبار النهائي',
    submitLabel: 'إنهاء الاختبار النهائي',
    completedTitle: 'اكتمل الاختبار النهائي',
    reviewLabel: 'العودة إلى بداية الدورة',
    nextLabel: 'تم: العودة إلى كتالوج الدورات',

    tiers: [
        { label: 'ممتاز', sub: 'تفهم التدفّق الداخلي لـ AI وتستطيع تفسيره' },
        { label: 'قوي جدًا', sub: 'الأفكار الرئيسية واضحة، يجدر تنشيط بعض النقاط' },
        { label: 'فهم جزئي', sub: 'يُنصح بمراجعة الفصول التي أخطأت فيها' },
        { label: 'يُستحسن إعادة الدورة', sub: 'من المفيد مراجعة المادة قبل المتابعة' },
    ],
};
