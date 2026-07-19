// i18n/locales/ar/behind-ai/logitsSoftmaxLab.ts
//
// بيانات مختبر Logits و Softmax للفصل الثامن (Logits & Softmax)، ترجمة عربية.
// العبرية هي مصدر الحقيقة وهي التي تحدد شكل النوع (LogitsSoftmaxLabContent).
//
// الفكرة المركزية: قبل أن يختار النموذج الاستكمال، يعطي كل احتمال درجة خام (logit).
// يحوّل Softmax هذه الدرجات إلى توزيع احتمالي: كل استكمال ينال نسبة مئوية، ومجموعها
// يبلغ 100. تغيير معلومة السياق يحرّك الدرجات، ولذلك يحرّك النسب أيضا. ويستطيع
// المتعلم أيضا ضبط كل درجة يدويا ومشاهدة الاحتمالات تتغير فورا.
//
// كل الدرجات والنسب هنا توضيح تعليمي فقط، وليست مخرجات حقيقية لنموذج. وتُعرض
// الاستكمالات كعبارات كاملة لتسهيل القراءة، لكنها تمثّل تنافسا على الرمز التالي،
// لا أثرا داخليا دقيقا.
//
// i18n: كل النص والبيانات المرتبطة باللغة (continuations, contexts, labels) تأتي من data
// حسب locale. حساب Softmax وتعيين الألوان والاتجاه (RTL/LTR) يبقى داخل المكوّن.
//
// لا شرطة طويلة (U+2014) ولا شرطة متوسطة (U+2013).

/** استكمال محتمل واحد من بين عدة متنافسين. */
export interface LabContinuation {
    /** معرّف ثابت، لا يُترجم. */
    id: string;
    /** تسمية الاستكمال، مثل "تأخّرت". */
    label: string;
}

/** معلومة سياق يمكن اختيارها. كل معلومة تحدد درجة خام مختلفة لكل استكمال. */
export interface LabContext {
    /** معرّف ثابت، لا يُترجم. */
    id: string;
    /** تسمية الزر. */
    control: string;
    /** الإضافة السياقية التي تدخل البرومبت قبل "الطرد على الأرجح...". فارغة في الوضع المحايد. */
    promptExtra?: string;
    /** شرح قصير: لماذا تحرّك هذه المعلومة الدرجات. */
    note: string;
    /** ربط معرّف الاستكمال بدرجته الخام في هذا الوضع (توضيح تعليمي). */
    scores: Record<string, number>;
}

export interface LogitsSoftmaxLabContent {
    /** عناوين القسم في الصفحة (فوق المكوّن). */
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    /** العنوان الداخلي للمكوّن. */
    heading: string;
    /** عنوان فرعي لاتيني بنيوي (يبقى كما هو في كل اللغات). */
    kicker: string;
    /** بداية الجملة التي يكملها النموذج. */
    promptBase: string;
    promptLabel: string;
    pickContextLabel: string;
    scoreLabel: string;
    probabilityLabel: string;
    topLabel: string;
    adjustTitle: string;
    adjustHint: string;
    resetScores: string;
    softmaxNoteTitle: string;
    softmaxNote: string;
    continuationNote: string;
    disclaimer: string;
    /** تسميات لقارئات الشاشة. */
    sr: { increase: string; decrease: string; contextGroup: string };
    continuations: LabContinuation[];
    contexts: LabContext[];
}

export const logitsSoftmaxLab: LogitsSoftmaxLabContent = {
    sectionEyebrow: 'Logits & Softmax Lab',
    sectionTitle: 'غيّر السياق أو الدرجات، وشاهد الاحتمالات تتحرك',
    sectionIntro:
        'بداية الجملة نفسها، وعدة استكمالات ممكنة. كل استكمال ينال درجة خام، ويحوّل Softmax الدرجات إلى نسب مئوية مجموعها 100. اختر معلومة سياق، أو اضبط الدرجات بنفسك، وشاهد من يتصدّر وبأي فارق.',
    heading: 'من الدرجات الخام إلى الاحتمالات',
    kicker: 'Logits & Softmax Lab',
    promptBase: 'الطرد على الأرجح...',
    promptLabel: 'البرومبت الكامل',
    pickContextLabel: 'اختر معلومة سياق',
    scoreLabel: 'درجة خام',
    probabilityLabel: 'احتمال',
    topLabel: 'المتصدّر الآن',
    adjustTitle: 'اضبط الدرجات بنفسك',
    adjustHint: 'اضغط على زائد أو ناقص لتغيير درجة استكمال. لاحظ كيف تستجيب النسب فورا.',
    resetScores: 'أعِد إلى درجات السياق',
    softmaxNoteTitle: 'كيف تتحول الدرجات إلى نسب',
    softmaxNote:
        'القسمة ليست تناسبا مباشرا للدرجات. الدرجات 4، 3، 2، 1 لا تتحول إلى 40، 30، 20، 10 بالمئة، بل إلى نحو 64، 24، 9، 3. السبب: يمرّر Softmax أولا كل درجة عبر خطوة أُسّية (أُسّ) تحوّلها إلى وزن موجب وتكبّر الفوارق النسبية، ثم يقسم كل وزن على المجموع الكلي. لذلك قد يفتح فارق صغير في الدرجة فارقا ملحوظا في النسب، ويكفي تغيير بسيط في السياق كي تتحرك الصورة.',
    continuationNote:
        'تُعرض الاستكمالات هنا كعبارات كاملة كي تسهل قراءتها. في الواقع يرتّب النموذج الرمز التالي خطوة بعد خطوة. هذا توضيح للتنافس ذاته، لا أثر داخلي دقيق للنموذج. وتذكّر أن هذه ليست سوى بضعة استكمالات ممكنة من بين الكثير. في نموذج حقيقي يجري الحساب على مفردات أكبر بكثير.',
    disclaimer:
        'الدرجات والنسب هنا توضيح تعليمي، لا مخرجات حقيقية لنموذج. هنا حصرنا الدرجة في مدى مريح للمقارنة، لكن الدرجة الحقيقية قد تكون أي رقم، حتى سالبا. الهدف منها إظهار كيف تتحول الدرجات إلى احتمالات، وكيف يحرّكها السياق. الدرجة العالية تعني أن الاستكمال أكثر ترجيحا حسب النص، لا أنه صحيح في العالم.',
    sr: {
        increase: 'ارفع درجة',
        decrease: 'اخفض درجة',
        contextGroup: 'اختيار معلومة السياق',
    },
    continuations: [
        { id: 'delayed', label: 'تأخّرت' },
        { id: 'delivered', label: 'سُلّمت' },
        { id: 'pickup', label: 'بانتظار الاستلام' },
        { id: 'lost', label: 'فُقدت' },
    ],
    contexts: [
        {
            id: 'neutral',
            control: 'دون معلومة إضافية',
            note: 'دون معلومة إضافية، ينال "تأخّرت" الدرجة الأعلى. الدرجات متقاربة، لكن Softmax يفرد الاحتمالات بفارق ملحوظ بالفعل. ما زال الأمر تقديرا، لا معرفة.',
            scores: { delayed: 4, delivered: 3, pickup: 2, lost: 1 },
        },
        {
            id: 'delay',
            control: 'لم يُمسح بعد',
            promptExtra: 'خرج الطرد من المركز أمس ولم يُمسح بعد.',
            note: 'التلميح "لم يُمسح بعد" يعزّز "تأخّرت" ويشحذ التوزيع حوله. الاستكمالات نفسها تماما، بدرجات مختلفة.',
            scores: { delayed: 5, delivered: 2, pickup: 2, lost: 3 },
        },
        {
            id: 'delivered',
            control: 'تأكيد التسليم',
            promptExtra: 'يعرض النظام تأكيد تسليم.',
            note: 'تأكيد التسليم ينقل الصدارة إلى "سُلّمت". لم يتحقق النموذج من الواقع، بل رجّح فقط ما هو مكتوب في السياق.',
            scores: { delayed: 3, delivered: 5, pickup: 2, lost: 2 },
        },
        {
            id: 'pickup',
            control: 'بانتظار الاستلام',
            promptExtra: 'آخر حالة هي "بانتظار الاستلام".',
            note: 'حالة "بانتظار الاستلام" ترفع الاستكمال المناسب إلى الصدارة، دون تغيير مجموعة الاستكمالات. السياق هو من يحدد المتصدّر.',
            scores: { delayed: 2, delivered: 3, pickup: 5, lost: 2 },
        },
    ],
};
