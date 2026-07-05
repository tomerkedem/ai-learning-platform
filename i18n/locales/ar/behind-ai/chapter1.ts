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

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'ما الذي يحدث حقًا بين',
        titleHighlight: 'السؤال والجواب',
        ledeLead: 'اكتب جملة واحدة. على اليمين، تبدو المحادثة عادية، تمامًا كأي تطبيق. على اليسار،',
        ledeHighlight: ' المسار الذي يقف خلف الجواب',
        ledeRest: ': يُظهر المحرك كيف يقرأ الجملة ويصل إلى قرار. اكتفِ بالمشاهدة الآن، لا حاجة لفهم كل رقم. سنفتح العمق لاحقًا، خطوةً خطوة.',
        chips: [
            'على اليمين: الجواب الذي تراه',
            'على اليسار: المسار الذي يقف خلف الجواب',
            'لاحقًا: نفتح كل خطوة بعمق',
        ],
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        peek: 'إطلالة أولى داخل المحرك',
        holographic: 'هنا ينفتح المحرك من الداخل',
    },

    // Coach card (first-run guidance toward the lab)
    coach: {
        start: 'ابدأ من هنا: ',
        body: 'اكتب جملتك الخاصة في المختبر أدناه، أو اختر مثالًا سريعًا.',
        closeAria: 'إغلاق الدليل',
    },

    // Transparent Chat Lab
    lab: {
        title: 'المحادثة الشفافة',
        eyebrow: 'Transparent Chat Lab',
        intro: 'هنا ترى أن هناك مسارًا خلف الجواب: على اليمين الجواب كالمعتاد، وعلى اليسار المسار الذي قاد إليه.',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map (package anchor): same stations, now live.
        mapBridge: 'هذه هي محطات الخريطة نفسها - الآن حيّة، على طلبكم بشأن الطرد.',
        chatSubtitle: 'Chat Mode · محادثة',
        agentSubtitle: 'Agent Mode · مهمة',
        focusLead: 'انظر أولًا إلى ',
        focusHighlight: 'القرار',
        focusRest: '، لا إلى كل رقم. المحرك على اليسار يُظهر أن هناك مسارًا كاملًا بين السؤال والجواب. ستنفتح التفاصيل الكاملة لاحقًا في الدورة.',
        liveNote: 'يُكتب رد المحادثة بواسطة نموذج حقيقي (Claude) في الوقت الفعلي، كلمةً كلمة - بالضبط الحلقة الانحدارية الذاتية. تبقى اللوحة على اليمين توضيحًا تعليميًا: الـ API لا يكشف الاحتمالات الداخلية للنموذج.',
        demoNote: 'وضع العرض التجريبي: ردود المحادثة مكتوبة مسبقًا وثابتة. ضبط ANTHROPIC_API_KEY على الخادم يفعّل نموذجًا حقيقيًا يكتب الرد حيًّا، كلمةً كلمة.',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Action Decision Engine',
        chatEngineSubtitle: 'اختيار رد · محطات رئيسية',
        agentEngineSubtitle: 'قرار فعل · محطات رئيسية',
    },

    // Chapter insight
    insightIdea: {
        title: 'فكرة الفصل',
        body: 'جواب المحادثة ليس سوى القمة المرئية لعملية خفية. خلف كل جواب يجري مسار، وهذا المسار يمكن فتحه خطوةً خطوة. هذا تحديدًا ما ستفعله هذه الدورة: ستعلّم المسار الذي يقف خلف الجواب، تدريجيًا. لا حاجة بعدُ لفهم كل آلية - يكفي أن تفهم أن المسار موجود، وأنه يمكن فتحه.',
    },

    // Depth-layer gate (progressive disclosure) + layer intro
    deep: {
        toggleOpen: 'أغلق طبقة العمق',
        toggleClosed: 'افتح المحرك الكامل',
        hint: 'هنا تنفتح الأداة المتقدمة: رأس قراءة حيّ يُظهر كيف يغيّر المحرك رأيه أثناء القراءة. يمكنك الاستكشاف بوتيرتك الخاصة.',
        intro1: 'انظر طبقة عمق: من هنا يصبح الأمر أكثر تقنية. أمامك مختبر حيّ يكشف زاوية أخرى من المسار نفسه. استكشفه بوتيرتك الخاصة.',
        intro2Lead: 'في ',
        intro2Mid: ' يختار النظام ردًا. في ',
        intro2Tail: ' يتحقق من الخطوة الصحيحة التالية - الإجابة، أو استخدام أداة، أو التوقف وطلب معلومات. بدّل بينهما بالمفتاح أعلى المحادثة.',
    },

    // The four lab headers (eyebrow + title)
    labs: {
        readHead: { eyebrow: 'قراءة حية', title: 'المحرك يغيّر رأيه أثناء القراءة' },
        confidence: { eyebrow: 'متى نثق، ومتى نتوقف', title: 'قرص الثقة' },
        causality: { eyebrow: 'السببية', title: 'أي كلمة حسمت' },
        fork: { eyebrow: 'تفرّع', title: 'الجملة نفسها، محركان' },
    },

    // Summary (two insights inside the depth layer)
    summary: {
        understandTitle: 'ما الذي تفهمه الآن',
        understandBody: 'محرك الذكاء الاصطناعي لا "يعرف" الجواب - بل يرتّب الخيارات، ويقرر وفق الفارق بينها. عندما يكون الفارق كبيرًا يجيب بثقة؛ وعندما يكون الفارق صغيرًا، فالخطوة الصحيحة هي التوقف والسؤال، لا التخمين. رأيت هذا بنفسك: أظهر رأس القراءة المتصدّر يتبدّل أثناء القراءة، وكلمة واحدة قد تحسم القرار بأكمله.',
        ruleTitle: 'القاعدة العملية',
        ruleBody: 'ثق بالمحرك عندما يكون الفارق كبيرًا والمخاطرة منخفضة. وعندما يكون الفارق صغيرًا أو الفعل حساسًا - فالتوقف وطلب التوضيح ليسا فشلًا، بل هما الخطوة المسؤولة. هنا تحديدًا يبدأ الرابط بين الاحتمال والمسؤولية.',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'قبل المبحث: ثلاث نقاط تستحق التذكّر',
        point1Lead: 'مسار، لا سحر.',
        point1Body: ' خلف كل جواب يجري مسار: يفكّك المحرك الجملة إلى رموز، ويرتّب الخيارات وفق الاحتمال، ويتحقق من مدى ثقته، وعندها فقط يقرر. يُبنى التقدير أثناء القراءة، وكل كلمة إضافية يمكن أن تغيّر الخيار المتصدّر.',
        point2Lead: 'سؤالان مختلفان.',
        point2BeforeChat: ' في ',
        point2AfterChat: ' يسأل المحرك "ما هو الجواب؟". في ',
        point2AfterAgent: ' يسأل "ما هي الخطوة الصحيحة التالية؟" - الإجابة، أو استخدام أداة، أو التوقف وطلب معلومات.',
        point3Lead: 'الثقة تلتقي بالمسؤولية.',
        point3Body: ' تُقاس الثقة بالفارق بين الخيار المتصدّر والذي يليه. فارق كبير ومخاطرة منخفضة، يمكنك ترك المحرك يجيب. فارق صغير أو فعل حساس، فالخطوة المسؤولة هي التوقف والسؤال، لا التخمين.',
        footnoteLead: 'أتريد أن ترى هذا المسار حيًّا؟ افتح ',
        footnoteHighlight: 'المحرك الكامل',
        footnoteTail: ' في الأعلى والعب برأس القراءة ومختبر "أي كلمة حسمت".',
    },

    lock: {
        eyebrow: 'تثبيت الفهم',
        question: 'يُظهر المحرك فارقًا صغيرًا بين الخيار المتصدّر والذي يليه. ما الخطوة الصحيحة؟',
        answerLabel: 'الإجابة بثقة',
        askLabel: 'التوقف والسؤال',
        correctBody: 'ثبّتّموها. الفارق الصغير يعني عدم اليقين، والخطوة المسؤولة هي التوقف والسؤال، لا التخمين.',
        wrongBody: 'اقتربتم. الفارق الصغير يشير في الواقع إلى عدم اليقين. الخطوة المسؤولة هنا هي التوقف والسؤال.',
        retry: 'حاولوا مجددًا',
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

    // Visuals and labs sub-namespace
    visuals: chapter1Visuals,
};
