// i18n/locales/ar/behind-ai/chapter3Lab.ts
// Arabic content for the chapter 3 tokenization lab (Chapter3LabContent).
// Shape source: app/behind-the-scenes-ai/chapter-3/labContent (HE_LAB_CONTENT is canonical).
//
// Plain data module (type-only imports). Wired through the client labContent registry,
// not the i18n dictionary. Natural RTL Arabic. Structural keys (scenario ids, modes,
// accents, role keys, roadmap active flags) are NOT translated. English secondary
// captions stay English. No em dash (U+2014), no en dash (U+2013).

import type { Chapter3LabContent } from '@/app/(course)/behind-the-scenes-ai/chapter-3/labContent';

export const chapter3Lab: Chapter3LabContent = {
    modeLabel: 'الوضع:',

    splitter: {
        hint: 'اكتب جملة وستنقسم إلى توكنز في الوقت الفعلي.',
        placeholder: 'مثال: الغسيل لم يجف',
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
        deliveryFailure: { label: 'إشارة نفي', en: 'Negation signal' },
        sortingCenter: { label: 'كوب قهوة', en: 'Coffee cup phrase' },
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
            { word: 'الكتاب', whole: ['الكتاب'], units: ['ال', 'كتاب'], roleLabel: 'أداة تعريف', roleEn: 'Article', note: 'أداة التعريف «ال» يمكن أن تنفصل عن الأساس «كتاب».' },
            { word: 'بالكتاب', whole: ['بالكتاب'], units: ['ب', 'الكتاب'], roleLabel: 'حرف جر', roleEn: 'Preposition', note: 'حرف الجر «ب» ينفصل، والأساس «الكتاب».' },
            { word: 'والقطة', whole: ['والقطة'], units: ['و', 'القطة'], roleLabel: 'حرف عطف', roleEn: 'Conjunction', note: 'حرف العطف «و» ينفصل، والأساس «القطة».' },
            { word: 'كالكتاب', whole: ['كالكتاب'], units: ['ك', 'الكتاب'], roleLabel: 'حرف جر', roleEn: 'Preposition', note: 'حرف الجر «ك» ينفصل، والأساس «الكتاب».' },
            { word: 'المطبخ', whole: ['المطبخ'], units: ['ال', 'مطبخ'], roleLabel: 'أداة تعريف', roleEn: 'Article', note: 'أداة التعريف «ال» يمكن أن تنفصل عن الأساس «مطبخ».' },
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
            id: 'chat-basics',
            mode: 'chat',
            labelHe: 'وضع Chat',
            labelEn: 'Chat mode',
            prompt: 'الغسيل لم يجف',
            accent: 'emerald',
            routeHe: 'بناء الإجابة',
            routeEn: 'Build answer',
            examples: [
                { labelHe: 'أساسي', labelEn: 'Base', text: 'الغسيل لم يجف' },
                { labelHe: 'مع سؤال', labelEn: 'With question', text: 'الغسيل لم يجف؟' },
                { labelHe: 'مع تشديد', labelEn: 'With emphasis', text: 'غسيلي لم يجف!!!' },
                { labelHe: 'كمية في الوصفة', labelEn: 'Recipe quantity', text: 'الوصفة تحتاج 250 غرامًا من الطحين' },
                { labelHe: 'بدون مسافات', labelEn: 'No spaces', text: 'الغسيللميجف' },
                { labelHe: 'بالإنجليزية', labelEn: 'In English', text: 'The laundry did not dry' },
                { labelHe: 'تصحيح', labelEn: 'Correction', text: 'ليست بسكويت، خبزت كعكة' },
            ],
        },
        {
            id: 'agent-check',
            mode: 'agent',
            labelHe: 'وضع Agent',
            labelEn: 'Agent mode',
            prompt: 'تحقق لماذا لم تعد القطة',
            accent: 'purple',
            routeHe: 'فهم المهمة',
            routeEn: 'Understand task',
            examples: [
                { labelHe: 'تحقيق', labelEn: 'Investigation', text: 'تحقق لماذا لم تعد القطة' },
                { labelHe: 'إلى الطفل', labelEn: 'To recipient', text: 'تحقق لماذا لم تعد القطة إلى الطفل' },
            ],
        },
    ],

    roleWords: {
        الغسيل: 'object',
        غسيلي: 'object',
        غسيل: 'object',
        laundry: 'object',
        القطة: 'object',
        قطة: 'object',
        لم: 'negation',
        لا: 'negation',
        not: 'negation',
        يجف: 'action',
        جف: 'action',
        تعد: 'action',
        عادت: 'action',
        تحقق: 'action-signal',
        كوب: 'context',
        بكوب: 'context',
        قهوة: 'context',
        الطفل: 'recipient',
        طفل: 'recipient',
    },

    roleInfo: {
        object: { label: 'كائن', en: 'Object', why: 'هذا ما تتحدث عنه الجملة. التسمية تحدد الموضوع، قبل معالجة بقية الجملة.' },
        negation: { label: 'نفي', en: 'Negation', why: 'هذه الكلمة قد تقلب اتجاه الجملة. بدونها يصبح المعنى عكسيًا.' },
        action: { label: 'فعل', en: 'Action', why: 'ما حدث للكائن. الفعل يحدد الحالة الفعلية للأمور.' },
        'action-signal': { label: 'إشارة فعل', en: 'Action signal', why: 'هذه الكلمة تحوّل المُدخل من وصف إلى طلب تنفيذ. تغيّر المسار كله.' },
        context: { label: 'سياق', en: 'Context / Location', why: 'يضيف مكانًا أو سياقًا يوضّح الصورة، مثل أين شربت قهوتك.' },
        system: { label: 'نظام', en: 'System', why: 'يشير إلى نظام أوسع، لا إلى الكائن نفسه. المجال نفسه، لكن اتجاه آخر.' },
        recipient: { label: 'مستلم', en: 'Recipient', why: 'من يتلقى الفعل. مهم خصوصًا حين يتعلق الأمر بشخص حقيقي.' },
        'question-signal': { label: 'إشارة سؤال', en: 'Question signal', why: 'علامة الاستفهام توكن بحد ذاته. تغيّر شكل الجملة من خبر إلى سؤال.' },
        'statement-signal': { label: 'إشارة خبر', en: 'Statement signal', why: 'النقطة توكن منفصل يدل على نهاية الجملة الخبرية. علامات الترقيم أيضًا تُعد وحدة عمل.' },
        number: { label: 'رقم', en: 'Number', why: 'سلسلة الأرقام وحدة بحد ذاتها. كمية في وصفة، مثلًا، تحوّل طلبًا عامًا إلى شيء دقيق وقابل للقياس.' },
        noise: { label: 'ضجيج', en: 'Noise', why: 'كلمة عامة تضيف معلومات قليلة جدًا. تظل تتحول إلى توكن، وإن كان وزنها منخفضًا.' },
        other: { label: 'عام', en: 'Token', why: 'كلمة غير مرتبطة بدور خاص في هذا المُجزِّئ التعليمي. تظل تُحسب وحدة عمل.' },
    },

    sortingCenter: { leads: ['كوب', 'بكوب'], follow: 'قهوة' },
    deliveryFailure: { first: 'لا', second: 'آكل' },
};
