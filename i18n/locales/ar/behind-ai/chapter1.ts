// i18n/locales/ar/behind-ai/chapter1.ts
// Arabic Chapter 1 ("What really happens between the question and the answer").
// Shape source: ../../he/behind-ai/chapter1. contentLocale = 'ar' (real translation, RTL MSA).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.
// "Claude" and "ANTHROPIC_API_KEY" are kept literal. seed inputs are coupled to the
// Arabic detection vocabulary in chapter-1/mockEngine.ts.

import type { Locale } from '@/i18n/config';
import { chapter1Visuals } from './chapter1Visuals';
import { chapter1Quiz } from './chapter1Quiz';

export const chapter1 = {
    contentLocale: 'ar' as Locale,
    redesign: {
        summary: { title: 'طبقتان للتذكر', points: ['مسار النموذج: يتحول النص إلى توكنات وتمثيلات رقمية.', 'تتحول التمثيلات إلى درجات للتوكن التالي، ويحوّلها Softmax إلى احتمالات.', 'يختار Decoding توكنا، ويلحق بالنص، ثم يتكرر التوليد.', 'غلاف المنتج: قد يجمع المنتج المدخل ويعالج الخرج حول النموذج.'] },
    },

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'ما الذي يحدث حقًا بين',
        titleHighlight: 'السؤال والجواب',
        ledeLead: 'اكتب جملة واحدة. تبدو لوحة الدردشة مألوفة مثل أي تطبيق. وبجوارها،',
        ledeHighlight: ' تفتح لوحة المحرك المسار خلف الإجابة',
        ledeRest: ': فهي تعرض توضيحا تعليميا للمسار من النص إلى التوكن التالي. اكتف بالملاحظة الآن؛ وسنفتح كل آلية لاحقا.',
        chips: [
            'لوحة الدردشة: الطلب والإجابة الظاهران',
            'لوحة المحرك: توضيح للمسار الداخلي',
            'لاحقًا: نفتح كل خطوة بعمق',
        ],
    },

    // Standalone mentor guidance before the Transparent Chat
    mentorGuide: {
        title: 'ترى إجابة واحدة. وخلفها رحلة كاملة.',
        body: 'في الدردشة الشفافة سترى كيف يتغير الطلب نفسه خطوة بعد خطوة في طريقه إلى الإجابة. لا تحتاج الآن إلى حفظ كل رقم أو مصطلح. في كل محطة اسأل: ما الذي دخل، وما الذي تغير، وما الذي خرج؟',
    },

    // M10: الفصل 1 بلا تخمين وبلا لحظة حكم، لذلك لا يحمل F3 RESPOND ولا صورة للمرشد.
    // يبقى فقط طبقة رد الاختبار، كنص، في الحالتين.
    mentorRespond: {
        quizPass:
            'الإجابة التي تراها هي نهاية مسار، وأنت الآن تعرف أن تسأل ماذا حدث في الطريق إليها. هذا هو السؤال نفسه الذي سيعود في كل فصل من هنا، مع اسم مختلف لكل محطة.',
        quizFail:
            'هذا الفصل لا يطلب حفظ المصطلحات، بل رؤية أن هناك مسارا بين السؤال والإجابة. عد إلى الدردشة الشفافة، أرسل جملة واحدة، وتابع محطة واحدة فقط: ماذا دخل إليها وماذا خرج منها.',
    },

    // Transparent Chat Lab
    lab: {
        title: 'المحادثة الشفافة',
        eyebrow: 'Transparent Chat Lab',
        intro: 'تعرض لوحة الدردشة الطلب والإجابة. وتفتح لوحة المحرك توضيحا للمسار بينهما.',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map: same stations, now live.
        mapBridge: 'تعمل الآن محطات الخريطة الأربع عشرة على الطلب الذي أرسلته.',
        chatSubtitle: 'Chat Mode · محادثة',
        agentSubtitle: 'Agent Mode · مهمة',
        observationInstruction: 'لا تحاول حفظ كل رقم. في كل محطة اسأل: ما الذي دخل، وما الذي تغير، وما الذي خرج؟',
        simulationDisclosure: 'هذا توضيح تعليمي حتمي لأفكار شائعة في نماذج اللغة، وليس تسجيلا مباشرا لحسابات نموذج خفية.',
        inputAriaLabel: 'رسالة للتحليل',
        sendAriaLabel: 'إرسال الطلب',
        activeRequestLabel: 'الطلب المحدد',
        visibleResponseLabel: 'الإجابة المعروضة',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'معاينة نظام المهام',
        chatEngineSubtitle: 'اختيار رد · محطات رئيسية',
        agentEngineSubtitle: 'نظام حول النموذج · معاينة شرطية',
    },

    // Chapter insight
    insightIdea: {
        title: 'فكرة الفصل',
        body: 'الإجابة الظاهرة في الدردشة ليست سوى نهاية مسار يجمع فيه المنتج المدخلات، ثم يحول النموذج التوكنات والتمثيلات إلى إجابة خطوة بعد خطوة.',
    },
    // Chat seed inputs (default input + quick suggestions)
    // Note: these are demo inputs fed to the learning engine, coupled to the Arabic
    // detection vocabulary in chapter-1/mockEngine.ts.
    seed: {
        defaultInput: 'طردي لم يصل',
        suggestions: [
            'طردي لم يصل',
            'أين طردي؟',
            'تحقق من الطرد 123456789',
            'أبلغ العميل أن الطرد قد فُقد',
            'تولَّ هذا الأمر',
        ],
    },

    quiz: chapter1Quiz,

    // Visuals sub-namespace
    visuals: chapter1Visuals,
};
