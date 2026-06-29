// i18n/locales/ar/behind-ai/chapter4Lab.ts
// محتوى مختبر Embeddings للفصل 4 بالعربية (Chapter4LabDict).
// مصدر الشكل: app/behind-the-scenes-ai/chapter-4/labContent (Chapter4LabDict هو المرجع).
//
// وحدة بيانات فقط (استيراد نوع، يُحذف عند البناء). تُحمَّل عبر سجلّ محتوى المختبر على
// العميل، لا عبر قاموس i18n، للحفاظ على حد نظيف بين الخادم والعميل.
//
// المفاتيح البنيوية لا تُترجم: sentence ids, chip ids, magnet ids و dim keys تبقى
// ثابتة. التوكنز تُكتب يدويًا، وليس بالتقسيم حسب المسافات. بلا شَرطة طويلة (U+2014) ولا
// شَرطة متوسطة (U+2013).

import type { Chapter4LabDict } from '@/app/behind-the-scenes-ai/chapter-4/labContent';

export const chapter4Lab: Chapter4LabDict = {
    sentences: {
        'pkg-not-arrived': {
            text: 'الطرد لم يصل',
            tokens: ['الطرد', 'لم', 'يصل'],
            ttsLine: 'الطرد لم يصل. شكوى عن فشل في التسليم، مرتفع في اتجاه الفشل.',
            swaps: {
                'to-arrived': { label: 'وصل', from: 'لم يصل' },
            },
        },
        'delivery-not-handed': {
            text: 'الشحنة لم تُسلَّم',
            tokens: ['الشحنة', 'لم', 'تُسلَّم'],
            ttsLine: 'الشحنة لم تُسلَّم. كلمات مختلفة تمامًا، لكن اتجاه المعنى نفسه.',
        },
        'pkg-arrived': {
            text: 'الطرد وصل',
            tokens: ['الطرد', 'وصل'],
            ttsLine: 'الطرد وصل. مجال التسليم نفسه، لكن دون فشل، لذلك تتحرّك النقطة.',
        },
        'system-not-showing': {
            text: 'النظام لا يعرض الطرد',
            tokens: ['النظام', 'لا', 'يعرض', 'الطرد'],
            ttsLine: 'النظام لا يعرض الطرد. خلل في النظام، لا مشكلة تسليم.',
        },
        'billing-address-update': {
            text: 'حدّثنا عنوان الفوترة',
            tokens: ['حدّثنا', 'عنوان', 'الفوترة'],
            ttsLine: 'حدّثنا عنوان الفوترة. موضوع بعيد عن التسليم، لذلك يقع بعيدًا على الخريطة.',
        },
        'agent-investigate-delay': {
            text: 'تحقّق لماذا لم يصل الطرد',
            tokens: ['تحقّق', 'لماذا', 'لم', 'يصل', 'الطرد'],
            ttsLine: 'تحقّق لماذا لم يصل الطرد. طلب تحقيق آمن، مخاطرة منخفضة.',
        },
        'agent-notify-lost': {
            text: 'أرسل للعميل رسالة بأن الطرد ضاع',
            tokens: ['أرسل', 'للعميل', 'رسالة', 'بأن', 'الطرد', 'ضاع'],
            ttsLine: 'أرسل للعميل رسالة بأن الطرد ضاع. إجراء تجاه العميل يتطلّب موافقة.',
        },
    },

    map: {
        closestTag: 'الأقرب',
        honest: 'الـ Embedding يساعد على مقارنة المعنى. لا يثبت ما حدث فعلًا.',

        visualTitle: 'أولًا، قرب بسيط',
        visualSubtitle: 'الأشياء ذات المعنى المتشابه تظهر أقرب. اختر كائنًا وانظر ما الأقرب إليه.',
        ruleLine: 'الأشياء ذات المعنى المتشابه تقع أقرب.',
        objects: {
            dog: 'كلب',
            cat: 'قطة',
            apple: 'تفاحة',
            cucumber: 'خيار',
            computer: 'حاسوب',
        },
        objectExplain: {
            dog: 'الكلب والقطة قريبان لأن كليهما حيوان.',
            cat: 'الكلب والقطة قريبان لأن كليهما حيوان.',
            apple: 'التفاحة والخيار قريبان لأن كليهما طعام.',
            cucumber: 'التفاحة والخيار قريبان لأن كليهما طعام.',
            computer: 'الحاسوب أبعد لأنه ينتمي إلى عالم التقنية.',
        },
        objectSelected: 'الكائن المختار',
        objectClosest: 'الأقرب',
        objectNoClose: 'بعيد عن البقية',

        packageTitle: 'القرب في المعنى بين الجمل',
        packageSubtitle: 'جمل مختلفة قد تكون قريبة إذا وصفت فكرة متشابهة.',
        centerLabel: 'الجملة المختارة',
        closestLabel: 'الأقرب في المعنى',
        packageRule: 'النموذج لا يبحث عن الكلمات المتطابقة فقط. يقارن القرب في المعنى.',
        cards: {
            'pkg-not-arrived': { shortLabel: 'لم يصل', chips: ['مشكلة تسليم', 'حالة الطرد'] },
            'delivery-not-handed': { shortLabel: 'لم تُسلَّم', chips: ['مشكلة تسليم', 'حالة الطرد'] },
            'pkg-arrived': { shortLabel: 'وصل', chips: ['حالة الطرد'] },
            'system-not-showing': { shortLabel: 'لا يُعرض', chips: ['حالة الطرد'] },
            'billing-address-update': { shortLabel: 'عنوان الفوترة', chips: ['فوترة'] },
            'agent-investigate-delay': { shortLabel: 'فحص الحالة', chips: ['استعلام', 'حالة الطرد'] },
            'agent-notify-lost': { shortLabel: 'الطرد ضاع', chips: ['إجراء', 'استثناء'] },
        },

        proofTitle: 'إثبات وتفسير',
        proofLead: 'بعد أن رأينا ما القريب من ماذا، يمكن رؤية لماذا: أي مكوّنات معنى مشتركة، وأي قوى شكّلت التمثيل.',

        relationTitle: 'ما القريب من ماذا؟',
        coreRule: 'أقرب يعني أكثر تشابهًا في المعنى. أبعد يعني أقل تشابهًا.',
        relClosest: 'الأقرب',
        relRelated: 'مرتبط لكن مختلف',
        relFar: 'أبعد',
        objectRows: [
            { pair: 'الكلب قريب من القطة', reason: 'لأن كليهما حيوان.' },
            { pair: 'التفاحة قريبة من الخيار', reason: 'لأن كليهما طعام.' },
            { pair: 'الحاسوب بعيد عنهما', reason: 'لأنه ينتمي إلى عالم التقنية.' },
        ],
        relations: {
            'pkg-not-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'كلاهما يصف مشكلة تسليم.',
                reasonRelated: 'لا يزال مرتبطًا بمشكلة الطرد، لكنه إجراء يتبعها.',
                reasonFar: 'يخصّ تفاصيل الفوترة، لا مشكلة تسليم.',
            },
            'delivery-not-handed': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'كلاهما يصف مشكلة تسليم.',
                reasonRelated: 'مرتبط بالمشكلة نفسها، لكنه إجراء تجاه العميل.',
                reasonFar: 'يخصّ تفاصيل الفوترة، لا التسليم.',
            },
            'pkg-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'عالم تسليم الطرود نفسه.',
                reasonRelated: 'المجال نفسه، لكنه طلب فحص، لا وصف لحالة.',
                reasonFar: 'يخصّ الفوترة، موضوع مختلف تمامًا.',
            },
            'system-not-showing': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'كلاهما عن طرد حدث فيه خطأ ما.',
                reasonRelated: 'مرتبط، لكنه طلب إجراء للفحص.',
                reasonFar: 'يخصّ الفوترة، لا مشكلة الطرد.',
            },
            'billing-address-update': {
                closestId: 'system-not-showing',
                relatedId: 'pkg-not-arrived',
                farId: 'agent-notify-lost',
                reasonClosest: 'كلاهما يخصّ تفاصيل في النظام، لا التسليم نفسه.',
                reasonRelated: 'هذا أيضًا عن الشحن، لكنه مشكلة تسليم، لا فوترة.',
                reasonFar: 'هذا إجراء تجاه العميل عن طرد ضاع، بعيد عن الفوترة.',
            },
            'agent-investigate-delay': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'كلاهما عن طرد لم يصل، هنا كطلب فحص.',
                reasonRelated: 'كلاهما إجراء، لكن هذا يبلّغ العميل.',
                reasonFar: 'يخصّ الفوترة، لا فحص التسليم.',
            },
            'agent-notify-lost': {
                closestId: 'agent-investigate-delay',
                relatedId: 'pkg-not-arrived',
                farId: 'billing-address-update',
                reasonClosest: 'كلاهما إجراء حول طرد حدث فيه خطأ.',
                reasonRelated: 'مرتبط بالمشكلة نفسها، لكنه مجرّد وصف للمشكلة، لا إجراء.',
                reasonFar: 'يخصّ الفوترة، موضوع آخر.',
            },
        },
        howto: {
            title: 'كيف نقرأ العرض؟',
            rowPoint: 'بطاقة = جملة',
            rowClose: 'قريب = معنى متشابه',
            rowFar: 'بعيد = أقل تشابهًا',
            rowSwap: 'تبديل كلمة قد يقرّب أو يبعّد',
            legendWhy: 'لماذا هما قريبان أو بعيدان؟ انظر الحمض النووي وقوى المعنى.',
        },
    },

    magnets: {
        delivery: 'تسليم',
        delay: 'تأخير',
        complaint: 'شكوى',
        tracking: 'تتبّع',
        refund: 'استرداد',
        risk: 'مخاطرة',
    },

    genes: {
        delivery: 'تسليم',
        system: 'نظام',
        address: 'عنوان',
        payment: 'دفع',
        urgency: 'إلحاح',
        failure: 'فشل',
        action: 'إجراء',
        risk: 'مخاطرة',
        customer: 'عميل',
        permission: 'موافقة',
    },

    dna: {
        title: 'الحمض النووي للمعنى',
        leadShared: (names) => `الجملتان قويتان في المكوّنات نفسها من المعنى: ${names}. لهذا هما قريبتان.`,
        leadNone: 'الجملتان تُضيئان مكوّنات مختلفة، لذلك هما أبعد.',
        sharedBadge: 'مشترك',
        guideSize: 'العقدة الأكبر تعني أن المكوّن أقوى في تلك الجملة.',
        guideBond: 'الرابط الأخضر النابض يعني مكوّنًا مشتركًا، وهذا ما يقرّب المعنى.',
        stayedClose: 'بقي المعنى قريبًا',
        drifted: 'انزاح المعنى',
    },

    controls: {
        pickSentence: 'اختر جملة',
        swapTitle: 'ماذا يحدث إذا بدّلنا كلمة؟',
        swapHint: 'تغيير صغير في الصياغة قد يقرّب المعنى أو يبعّده.',
        resetSwap: 'العودة إلى الجملة الأصلية',
    },

    fallback: {
        missingSentence: 'محتوى مفقود',
    },

    ui: {
        magnetTitle: 'قوى المعنى',
    },

    explain: {
        title: 'دليل سريع',
        mapShadow: 'الخريطة ظل مسطّح لفضاء معنى أكبر بكثير.',
        close: 'النقاط القريبة تمثّل عادةً معنى متشابهًا.',
        far: 'النقطة البعيدة ليست خاطئة، هي فقط أقل تشابهًا في المعنى.',
        regions: 'الهالات الملوّنة أحياء معنى، لا حدود حادة.',
        forces: 'قوى المعنى تُظهر أي إشارات جذبت الجملة إلى هذا الاتجاه.',
        dna: 'الحمض النووي يثبت لماذا جملتان قريبتان: المكوّنات نفسها من المعنى تضيء بقوة متشابهة.',
        notTruth: 'الـ Embedding يساعد على مقارنة المعنى. لا يثبت ما حدث فعلًا.',
    },
};
