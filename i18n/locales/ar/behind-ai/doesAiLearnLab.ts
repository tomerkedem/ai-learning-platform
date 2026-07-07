// i18n/locales/ar/behind-ai/doesAiLearnLab.ts
//
// Arabiyya (ar, RTL) bayanat "Does AI Learn Lab" lil-fasl 16 (Does AI Learn From Me).
// Al-ibriyya hiya masdar al-haqiqa wa tuhaddid an-naw (DoesAiLearnLabContent).
//
// Al-fikra al-markaziyya: qal an-namuthaj "sa tasil at-tard ghadan", wa sahhahahu al-mustakhdim:
// "la. wafqan lil-tatabbu la yujad maw'id wusul mu'akkad." al-mukhtabar yuzhir arba'a tabaqat
// yatasarraf fiha at-tashih bi-shakl mukhtalif: nafs al-muhadatha (as-siyaq al-hali), muhadatha
// jadida (as-siyaq yabda farighan), khasiyyat dhakira (mithal muntaj), wa tadrib aw tahdith
// (amaliyya munfasila).
//
// Tarjama awwaliyya bi-hajat ila muraja'a min mutahaddith asli.
//
// Bidun sharta tawila (U+2014) wa la sharta mutawassita (U+2013).

import type { DoesAiLearnLabContent } from '../../he/behind-ai/doesAiLearnLab';

export const doesAiLearnLab: DoesAiLearnLabContent = {
    sectionEyebrow: 'Does AI Learn Lab',
    sectionTitle: 'التصحيح نفسه، أربع طبقات',
    sectionIntro:
        'قال النموذج "سيصل الطرد غدًا"، وقمت بتصحيحه. تنقّل بين الطبقات الأربع وشاهد متى يساعد التصحيح، ومتى يختفي، والفرق بين السياق والذاكرة والتدريب.',
    heading: 'خلف التعلّم',
    kicker: 'Does AI Learn Lab',
    scenario: {
        label: 'السيناريو',
        aiSaidLabel: 'قال النموذج',
        aiSaid: 'سيصل الطرد غدًا.',
        userCorrectionLabel: 'أنت تصحّح',
        userCorrection: 'لا. وفقًا للتتبّع لا يوجد موعد وصول مؤكّد.',
        aiRevisedLabel: 'في المحادثة نفسها يصحّح النموذج',
        aiRevised: 'صحيح. وفقًا للتتبّع لا يوجد موعد وصول مؤكّد.',
    },
    layerSelectLabel: 'اختر طبقة',
    seesLabel: 'ما يراه النموذج الآن',
    answerLabel: 'إجابة النموذج',
    changedLabel: 'ما الذي تغيّر',
    unchangedLabel: 'ما الذي لم يتغيّر',
    takeawayLabel: 'الخلاصة',
    disclaimer:
        'كل الأمثلة هنا لأغراض تعليمية فقط. المنتجات المختلفة تعالج البيانات بطرق مختلفة، ولا يوجد هنا أي ادعاء حول سياسة أو خصوصية أو تدريب منتج معيّن. الهدف هو إظهار الفرق بين السياق والذاكرة والتدريب، لا وصف منتج معيّن.',
    sr: {
        layerGroup: 'اختيار طبقة تعلّم',
        layerDetail: 'تفاصيل الطبقة المختارة',
    },
    layers: [
        {
            id: 'sameChat',
            layerType: 'sameChat',
            control: 'المحادثة نفسها',
            badgeLabel: 'السياق الحالي',
            title: 'صحّحته، والنموذج يتبع التصحيح',
            summary: 'في المحادثة نفسها سألت سؤالًا مشابهًا مرة أخرى. التصحيح ما زال في السياق، لذا يمكن للنموذج الاعتماد عليه.',
            sees: [
                'رسالة النموذج الأولى: سيصل الطرد غدًا.',
                'تصحيحك: لا. وفقًا للتتبّع لا يوجد موعد وصول مؤكّد.',
                'سؤالك المتابع، في المحادثة نفسها.',
            ],
            answer: 'وفقًا للتتبّع لا يوجد موعد وصول مؤكّد. سأحدّثك فور توفّره.',
            changed: 'الإجابة الآن تتبع التصحيح، لأنه في سياق المحادثة.',
            unchanged: 'النموذج الأساسي لم يتغيّر. التصحيح يعيش في هذه المحادثة فقط.',
            takeaway: 'ما هو مكتوب في المحادثة الحالية يمكن أن يؤثّر في الإجابة الحالية.',
        },
        {
            id: 'newChat',
            layerType: 'newChat',
            control: 'محادثة جديدة',
            badgeLabel: 'محادثة جديدة',
            title: 'المحادثة الجديدة تبدأ بلا التصحيح',
            summary: 'فتحت محادثة جديدة وسألت مرة أخرى، دون تقديم التصحيح أو المصدر من جديد.',
            sees: [
                'محادثة جديدة، والسياق يبدأ فارغًا.',
                'سؤالك الآن.',
                'التصحيح من المحادثة السابقة ليس هنا.',
            ],
            answer: 'وفقًا للتقدير المعتاد، من المفترض أن يصل الطرد غدًا.',
            changed: 'بلا التصحيح في السياق، قد يعود النموذج إلى الإجابة الأصلية. لا تفترض أنه يتذكّر التصحيح.',
            unchanged: 'النموذج لم ينسَ عمدًا. المحادثة الجديدة ببساطة لا تحتوي على ما كتبته سابقًا.',
            takeaway: 'المحادثة الجديدة لا تتضمّن التصحيحات السابقة تلقائيًا، إلا إذا كان المنتج يحفظ ذاكرة أو قدّمت السياق من جديد.',
        },
        {
            id: 'memory',
            layerType: 'memory',
            control: 'خاصية الذاكرة',
            badgeLabel: 'خاصية الذاكرة',
            title: 'تفضيل محفوظ يمكن أن يعود إلى السياق',
            summary: 'بعض المنتجات تتيح حفظ تفضيل. هذا مثال على خاصية منتج، لا قاعدة تسري دائمًا.',
            sees: [
                'تفضيل محفوظ (مثال على خاصية منتج): لا تختلق موعد وصول بلا مصدر.',
                'سؤالك الآن.',
                'يُحمّل التفضيل إلى السياق مع السؤال.',
            ],
            answer: 'وفقًا للتفضيل المحفوظ، لن أختلق موعدًا. وفقًا للتتبّع لا يوجد موعد وصول مؤكّد.',
            changed: 'عندما يوفّر المنتج ذاكرة، يعود التفضيل إلى السياق، لذا يمكن للإجابات أن تتبعه حتى في محادثة جديدة.',
            unchanged: 'وهنا أيضًا لم يتغيّر النموذج الأساسي. الذاكرة طبقة تعيد المعلومات إلى السياق، لا تدريب.',
            takeaway: 'الذاكرة خاصية منتج تحفظ المعلومات وتعيدها. وهي تختلف عن تدريب النموذج نفسه.',
        },
        {
            id: 'training',
            layerType: 'training',
            control: 'تدريب أو تحديث',
            badgeLabel: 'تدريب أو تحديث',
            title: 'التحسّن الدائم يتطلّب عملية منفصلة',
            summary: 'لتغيير سلوك النموذج مع الوقت تحتاج إلى عملية منفصلة، لا رسالة واحدة في محادثة.',
            sees: [
                'أمثلة كثيرة وملاحظات على مدى الوقت.',
                'مراجعة من الفريق الذي يبني النظام.',
                'تدريب أو تحديث للنظام.',
                'تقييم يفحص إن كان التحسّن حقيقيًا.',
                'سلوك مستقبلي قد يتحسّن.',
            ],
            answer: 'إن وصل تحديث وحين يصل، قد يتحسّن السلوك المستقبلي. هذا لا يحدث فورًا من تصحيح واحد.',
            changed: 'بعد عملية كهذه، قد تتصرّف نسخة مستقبلية من النظام بشكل مختلف.',
            unchanged: 'العملية بطيئة ومنفصلة عن محادثتك، وتعتمد على المنتج والسياسة. تصحيح واحد لا يشغّلها تلقائيًا.',
            takeaway: 'التحسّن الدائم للنموذج هو عملية تدريب أو تحديث بحد ذاتها، لا تعلّم حيّ من المحادثة.',
        },
    ],
};
