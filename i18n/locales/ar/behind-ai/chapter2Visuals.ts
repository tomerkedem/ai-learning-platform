// i18n/locales/ar/behind-ai/chapter2Visuals.ts
// الفصل الثاني بالعربية: عناصر مختبر مقارنة المدخلات وصيغ الإدخال الخمس.
// مصدر البنية: ../../he/behind-ai/chapter2Visuals (العبرية هي المرجع الأساسي).
//
// ترجمة فعلية. بدون شرطة طويلة (U+2014) وبدون شرطة متوسطة (U+2013). الحقول البنيوية
// (id, ambiguity, tendency, externalData) تبقى حرفية؛ يُترجم النص الظاهر فقط.

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'ar' as Locale,

    // عناصر مختبر مقارنة المدخلات (InputComparisonLab)
    inputLab: {
        tokenizationHint: 'لاحقًا في الدورة سيُقسَّم النص إلى رموز. الآن ننظر فقط إلى ما يحتويه الإدخال، قبل أي تقسيم.',
        pickerHint: 'اختر صياغة، وانظر ما الذي يصل إلى النموذج فعليًا.',
        pickerAria: 'اختيار صياغة للمقارنة',
        ambiguityPrefix: 'الغموض',
        outro: 'الحاجة نفسها، صياغات مختلفة. مع كل صياغة يحصل النموذج على مادة مختلفة ليعمل عليها، قبل أن تبدأ أي معالجة أعمق.',
        // عناوين الحقول في لوحة القراءة
        fields: {
            explicit: 'ما يصرّح به النص',
            missing: 'ما هو ناقص',
            changed: 'ما الذي تغيّر عن الأساس',
            ambiguity: 'مستوى الغموض',
            expectation: 'ما المتوقع من النموذج',
            external: 'يلزم بيانات خارجية',
            tendency: 'إلى أين يميل',
        },
        baseComparison: 'هذه هي نقطة الأساس للمقارنة.',
        externalYes: 'نعم.',
        externalNo: 'غير مطلوب في هذه المرحلة.',
        noticeLabel: 'جدير بالملاحظة',
        // تسميات مستوى الغموض (الشارة واللون بنيويان في المكوّن)
        ambiguityLabels: {
            low: 'منخفض',
            medium: 'متوسط',
            high: 'مرتفع',
        },
        // تسميات الميل (الشارة واللون بنيويان في المكوّن)
        tendencyLabels: {
            chat: 'يميل إلى Chat',
            'chat-agent': 'بين Chat و Agent',
            agent: 'يميل إلى Agent',
        },
    },

    // صيغ الإدخال الخمس. الحقول البنيوية (id, ambiguity, tendency, externalData)
    // تطابق inputVariations.ts؛ يُترجم النص الظاهر فقط، بالترتيب نفسه.
    inputVariations: [
        {
            id: 'base',
            label: 'طلب أساسي',
            prompt: 'طردي لم يصل. ماذا أفعل؟',
            explicit: ['هناك مشكلة: الطرد لم يصل', 'طلب توجيه: ماذا أفعل'],
            missing: ['رقم التتبع', 'متى تم تقديم الطلب', 'أي شركة شحن'],
            changed: '',
            ambiguity: 'medium',
            expectation: 'تقديم توجيه عام، أو السؤال عما هو ناقص كي تكون المساعدة فعلية',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'question',
            label: 'مجرد سؤال',
            prompt: 'طردي لم يصل؟',
            explicit: ['الطرد لم يصل، مصاغًا كسؤال مفتوح'],
            missing: ['ما الذي يريد المستخدم أن يحدث', 'طلب صريح لاتخاذ إجراء أو للتوجيه'],
            changed: 'حُذفت عبارة "ماذا أفعل" وأُضيفت علامة استفهام. بقي سؤال مفتوح بلا طلب واضح.',
            ambiguity: 'high',
            expectation: 'توضيح ما المطلوب فعلًا قبل صياغة إجابة',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'contradiction',
            label: 'تناقض',
            prompt: 'طردي لم يصل، لكنني تلقيت إشعارًا بأنه سُلّم.',
            explicit: ['مشكلة: الطرد لم يصل', 'ادعاء مضاد: ورد إشعار تسليم'],
            missing: ['طلب صريح', 'رقم تتبع للتحقق'],
            changed: 'أُضيف تناقض بين ما عاشه المستخدم وإشعار التسليم.',
            ambiguity: 'medium',
            expectation: 'ملاحظة التناقض، وربما اقتراح التحقق من الحالة',
            externalData: true,
            externalNote: 'حلّ التناقض يستدعي التحقق من بيانات تتبع حقيقية.',
            tendency: 'chat-agent',
        },
        {
            id: 'tracking',
            label: 'مع رقم تتبع',
            prompt: 'طردي لم يصل. رقم التتبع هو 12345.',
            explicit: ['مشكلة: الطرد لم يصل', 'معرّف: رقم التتبع 12345'],
            missing: ['ما هو الإجراء المطلوب بالضبط'],
            changed: 'أُضيف معرّف تتبع. الآن يوجد ما يكفي للتحقق من حالة حقيقية.',
            ambiguity: 'low',
            expectation: 'يمكن التحقق من حالة الشحنة باستخدام المعرّف',
            externalData: true,
            externalNote: 'المعرّف يتيح الاستعلام من نظام تتبع خارجي.',
            tendency: 'agent',
        },
        {
            id: 'correction',
            label: 'تصحيح في المحادثة',
            prompt: 'ليس حذاءً، طلبت كتابًا.',
            explicit: ['تصحيح: ليس حذاءً بل كتابًا'],
            missing: ['السياق السابق في المحادثة، الذي بدونه لا يتضح ما الذي يُصحَّح'],
            changed: 'هذا ليس وصفًا لمشكلة بل تصحيح لشيء قيل سابقًا في المحادثة.',
            ambiguity: 'high',
            expectation: 'تحديث السياق الحالي للمحادثة وفقًا للتصحيح',
            externalData: false,
            tendency: 'chat',
            note: 'التصحيح يغيّر السياق الحالي للمحادثة، لا ما تعلّمه النموذج أثناء التدريب.',
        },
    ] as InputVariation[],
};
