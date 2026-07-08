// i18n/locales/ar/behind-ai/chapter3Lab.ts
// Arabic content for the chapter 3 tokenization lab (Chapter3LabContent).
// Shape source: app/behind-the-scenes-ai/chapter-3/labContent (HE_LAB_CONTENT is canonical).
//
// Plain data module (type-only imports). Wired through the client labContent registry,
// not the i18n dictionary. Natural RTL Arabic. Structural keys (scenario ids, modes,
// accents, role keys, roadmap active flags) are NOT translated. English secondary
// captions stay English. No em dash (U+2014), no en dash (U+2013).

import type { Chapter3LabContent } from '@/app/behind-the-scenes-ai/chapter-3/labContent';

export const chapter3Lab: Chapter3LabContent = {
    modeLabel: 'الوضع:',

    splitter: {
        hint: 'اكتب جملة وستنقسم إلى توكنز في الوقت الفعلي.',
        placeholder: 'مثال: الطرد لم يصل',
        aria: 'حقل إدخال لتقطيع التوكنز',
        quickLabel: 'تجارب سريعة:',
        resetLabel: 'إعادة تعيين',
    },

    stream: {
        title: 'تدفق التوكنز',
        titleEn: 'Token Stream',
        empty: 'اكتب نصًا وسينقسم هنا إلى توكنز.',
        hint: 'انقر على توكن لرؤية دوره.',
        rail: {
            input: { label: 'نص الإدخال', en: 'Input Text' },
            tokenizer: { label: 'المُجزِّئ', en: 'Tokenizer' },
            stream: { label: 'تدفق التوكنز', en: 'Token Stream' },
        },
    },

    legend: {
        title: 'خريطة ألوان التوكنز',
        titleEn: 'Token Color Map',
    },

    count: {
        title: 'عدّاد التوكنز',
        titleEn: 'Token Count',
        note: 'هذا الرقم يرتبط لاحقًا بنافذة السياق: كم توكن يمكن للنموذج أن يحمل دفعة واحدة. هنا نزرع الفكرة فقط.',
    },

    roleCard: {
        closeAria: 'إغلاق بطاقة الدور',
    },

    signals: {
        number: { label: 'توكن رقمي', en: 'Number token' },
        action: { label: 'إشارة فعل', en: 'Action signal' },
        deliveryFailure: { label: 'إشارة فشل التسليم', en: 'Delivery failure signal' },
        sortingCenter: { label: 'مركز الفرز', en: 'Sorting center' },
    },

    noSpaceNote:
        'بدون مسافات، يرى هذا المُجزِّئ التعليمي وحدة واحدة طويلة. المُجزِّئ الحقيقي كان سيقسّمها رغم ذلك إلى وحدات فرعية، لأنه لا يعتمد على المسافات وحدها. لهذا السبب بالضبط، التوكن ليس بالضرورة كلمة.',

    educational: {
        badge: 'Educational',
        note: 'هذا مُجزِّئ تعليمي، وليس نموذجًا تجاريًا. هذه الخطوة تحضير فقط: النظام لا يحسب بعد الاحتمال الكامل ولا يجيب، إنه فقط يقسّم النص إلى وحدات عمل. تلوين الأدوار مساعدة تعليمية، فالنماذج الحقيقية تقسّم حسب الإحصاء لا حسب الدور اللغوي.',
    },

    subword: {
        title: 'مختبر الوحدات الفرعية',
        titleEn: 'Sub-word Lab',
        badge: 'تقسيم تعليمي',
        hint: 'انقر على كلمة لتقسيمها: تنفصل أداة عن الكلمة الأساسية. لاحظ كيف يرتفع عدد التوكنز مع كل تقسيم.',
        wordsLabel: 'كلمات:',
        tokensLabel: 'توكنز:',
        splitAll: 'قسّم الكل',
        mergeAll: 'ادمج الكل',
        splitHint: 'انقر للتقسيم',
        mergeHint: 'انقر للدمج',
        ariaWhole: 'كاملة، انقر للتقسيم',
        ariaSplit: 'مقسّمة، انقر للدمج',
        note: 'هذا تقسيم تعليمي فقط. المُجزِّئ الحقيقي لا يقسّم حسب الأدوات بل حسب إحصاءات الوحدات الفرعية المتعلمة من نصوص كثيرة. هنا نوضح فكرة أن كلمة واحدة قد تنقسم إلى عدة وحدات.',
        splits: [
            { word: 'الطرد', whole: ['الطرد'], units: ['ال', 'طرد'], roleLabel: 'أداة تعريف', roleEn: 'Article', note: 'أداة التعريف «ال» يمكن أن تنفصل عن الأساس «طرد».' },
            { word: 'بالطرد', whole: ['بالطرد'], units: ['ب', 'الطرد'], roleLabel: 'حرف جر', roleEn: 'Preposition', note: 'حرف الجر «ب» ينفصل، والأساس «الطرد».' },
            { word: 'والعميل', whole: ['والعميل'], units: ['و', 'العميل'], roleLabel: 'حرف عطف', roleEn: 'Conjunction', note: 'حرف العطف «و» ينفصل، والأساس «العميل».' },
            { word: 'كالطرد', whole: ['كالطرد'], units: ['ك', 'الطرد'], roleLabel: 'حرف جر', roleEn: 'Preposition', note: 'حرف الجر «ك» ينفصل، والأساس «الطرد».' },
            { word: 'المركز', whole: ['المركز'], units: ['ال', 'مركز'], roleLabel: 'أداة تعريف', roleEn: 'Article', note: 'أداة التعريف «ال» يمكن أن تنفصل عن الأساس «مركز».' },
        ],
    },

    roadmap: {
        title: 'خريطة المحرك',
        titleEn: 'From Text to Probabilities',
        note: 'الآن نحن فقط في الخطوة الأولى: النص يصبح توكنز. الخطوات التالية (معرّفات التوكن، المتجهات) هي حيث تقوم النماذج الحقيقية بالحساب الإحصائي. بدون هذا التقسيم لا توجد بداية للمسار.',
        steps: [
            { he: 'نص', en: 'Text', active: true },
            { he: 'توكنز', en: 'Tokens', active: true },
            { he: 'معرّفات التوكن', en: 'Token IDs', active: false },
            { he: 'متجهات', en: 'Vectors', active: false },
            { he: 'تشابه', en: 'Similarity', active: false },
            { he: 'درجات', en: 'Scores', active: false },
            { he: 'احتمالات', en: 'Probabilities', active: false },
        ],
    },

    scenarios: [
        {
            id: 'chat-delivery',
            mode: 'chat',
            labelHe: 'وضع Chat',
            labelEn: 'Chat mode',
            prompt: 'الطرد لم يصل',
            accent: 'emerald',
            routeHe: 'بناء الإجابة',
            routeEn: 'Build answer',
            examples: [
                { labelHe: 'أساسي', labelEn: 'Base', text: 'الطرد لم يصل' },
                { labelHe: 'مع سؤال', labelEn: 'With question', text: 'الطرد لم يصل؟' },
                { labelHe: 'مع تشديد', labelEn: 'With emphasis', text: 'طردي لم يصل!!!' },
                { labelHe: 'رقم التتبع', labelEn: 'Tracking number', text: 'رقم التتبع هو 12345' },
                { labelHe: 'بدون مسافات', labelEn: 'No spaces', text: 'الطردلميصل' },
                { labelHe: 'بالإنجليزية', labelEn: 'In English', text: 'The package did not arrive' },
                { labelHe: 'تصحيح', labelEn: 'Correction', text: 'ليست أحذية، طلبت كتابًا' },
            ],
        },
        {
            id: 'agent-investigate',
            mode: 'agent',
            labelHe: 'وضع Agent',
            labelEn: 'Agent mode',
            prompt: 'تحقق لماذا لم يصل الطرد',
            accent: 'purple',
            routeHe: 'فهم المهمة',
            routeEn: 'Understand task',
            examples: [
                { labelHe: 'تحقيق', labelEn: 'Investigation', text: 'تحقق لماذا لم يصل الطرد' },
                { labelHe: 'إلى العميل', labelEn: 'To recipient', text: 'تحقق لماذا لم يصل الطرد إلى العميل' },
            ],
        },
    ],

    roleWords: {
        الطرد: 'object',
        طردي: 'object',
        طرد: 'object',
        package: 'object',
        لم: 'negation',
        لا: 'negation',
        not: 'negation',
        يصل: 'action',
        وصل: 'action',
        arrive: 'action',
        تحقق: 'action-signal',
        التتبع: 'context',
        العميل: 'recipient',
        عميل: 'recipient',
    },

    roleInfo: {
        object: { label: 'كائن', en: 'Object', why: 'هذا ما تتحدث عنه الجملة. التسمية تحدد الموضوع، قبل معالجة بقية الجملة.' },
        negation: { label: 'نفي', en: 'Negation', why: 'هذه الكلمة قد تقلب اتجاه الجملة. بدونها يصبح المعنى عكسيًا.' },
        action: { label: 'فعل', en: 'Action', why: 'ما حدث للكائن. الفعل يحدد الحالة الفعلية للأمور.' },
        'action-signal': { label: 'إشارة فعل', en: 'Action signal', why: 'هذه الكلمة تحوّل المُدخل من وصف إلى طلب تنفيذ. تغيّر المسار كله.' },
        context: { label: 'سياق', en: 'Context / Location', why: 'يضيف مكانًا أو سياقًا يوضّح الصورة، مثل أين كان يُفترض أن يصل الطرد.' },
        system: { label: 'نظام', en: 'System', why: 'يشير إلى النظام نفسه، لا إلى الطرد. المجال نفسه، لكن اتجاه آخر.' },
        recipient: { label: 'مستلم', en: 'Recipient', why: 'من يتلقى الفعل. مهم خصوصًا حين يتعلق الأمر بشخص حقيقي.' },
        'question-signal': { label: 'إشارة سؤال', en: 'Question signal', why: 'علامة الاستفهام توكن بحد ذاته. تغيّر شكل الجملة من خبر إلى سؤال.' },
        'statement-signal': { label: 'إشارة خبر', en: 'Statement signal', why: 'النقطة توكن منفصل يدل على نهاية الجملة الخبرية. علامات الترقيم أيضًا تُعد وحدة عمل.' },
        number: { label: 'رقم', en: 'Number', why: 'سلسلة الأرقام وحدة بحد ذاتها. رقم التتبع مثلًا قد يحوّل طلبًا عامًا إلى شيء يمكن التحقق منه.' },
        noise: { label: 'ضجيج', en: 'Noise', why: 'كلمة عامة تضيف معلومات قليلة جدًا. تظل تتحول إلى توكن، وإن كان وزنها منخفضًا.' },
        other: { label: 'عام', en: 'Token', why: 'كلمة غير مرتبطة بدور خاص في هذا المُجزِّئ التعليمي. تظل تُحسب وحدة عمل.' },
    },

    sortingCenter: { leads: ['مركز'], follow: 'الفرز' },
    deliveryFailure: { first: 'لم', second: 'يصل' },
};
