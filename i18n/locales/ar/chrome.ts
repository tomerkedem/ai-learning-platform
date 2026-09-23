// i18n/locales/ar/chrome.ts
// Arabic (Modern Standard Arabic) chrome strings. Source shape: ../he/chrome.
import { chrome as heChrome } from '../he/chrome';

export const chrome: typeof heChrome = {
    backToCatalog: 'العودة إلى كتالوج الدورات',
    tableOfContents: 'المحتويات',
    courseProgress: 'تقدّم الدورة',
    authorName: 'تومر كيدم',
    authorRole: 'مؤلّف الدورة',
    intro: 'مقدّمة',

    header: {
        readTime: 'وقت القراءة',
        progress: 'التقدّم',
    },

    nav: {


        menu: 'قائمة الدورة',



        closeMenu: 'إغلاق القائمة',
        next: 'التالي',
        prev: 'السابق',
        finishedTitle: 'أكملت جميع الفصول!',
        finishedSub: 'أحسنت - وصلت إلى النهاية.',
        moreComingTitle: 'وصلت إلى نهاية الفصول المتاحة حاليًا',
        moreComingSub: 'ستواصل الفصول التالية الدورة',
    },

    focus: {
        toggleTitle: 'إخفاء التنقّل وتوسيع منطقة التعلّم',
        enter: 'وضع التركيز',
        exit: 'الخروج من وضع التركيز',
        activeBadge: 'وضع التركيز مُفعّل',
        press: 'اضغط',
        toExit: 'للخروج',
    },

    theme: {
        label: 'المظهر',
        system: 'النظام',
        light: 'فاتح',
        dark: 'داكن',
    },
    language: {
        label: 'اللغة',
        change: 'تغيير اللغة',
        dialogTitle: 'اختر لغة',
        close: 'إغلاق',
        imageCredit: 'صورة الأرض: NASA',
    },

    footer: {
        defaultLabel: 'دورات تفاعلية لمطوّري الذكاء الاصطناعي',
        copyright: '© 2026 تومر كيدم. جميع الحقوق محفوظة.',
    },

    assessment: {
        // إعلان لقارئات الشاشة: النتيجة تُنقل بصريًا بالأيقونة واللون فقط.
        verdictCorrect: 'إجابة صحيحة.',
        verdictWrong: 'إجابة خاطئة.',
        start: 'ابدأ الاختبار',
        mentorStart: 'مستعد؟ لنرَ ما الذي ترسّخ',
        questionsLabel: 'الأسئلة',
        recommendedTimeLabel: 'الوقت المقترح',
        recommendedTime: (min) => `${min} دقيقة`,
        submit: 'إنهاء الاختبار',
        completed: 'اكتمل الاختبار!',
        next: 'المتابعة إلى الفصل التالي',
        review: 'العودة إلى مراجعة سريعة',
        mentorPassHigh: 'ممتاز، إتقان كامل!',
        mentorPass: 'أحسنت، نجحت!',
        mentorFail: 'ليس بعد. راجع النقاط الضعيفة وحاول مجددًا.',
        failNote: 'فهمك لا يكفي بعدُ للمتابعة بثقة. راجع النقاط الضعيفة وحاول مجددًا.',
        correctSummary: (correct, total) => `${correct} من ${total} إجابات صحيحة`,
        timeLabel: 'الوقت',
        strongConcepts: 'قوي لديك',
        weakConcepts: 'يستحسن تقويته',
        recommendedReview: 'مراجعة مقترحة',
        reviewAnswers: 'مراجعة الإجابات',
        retry: 'حاول مجددًا',
        tiers: [
            { label: 'ممتاز!', sub: 'إتقان كامل للمادة' },
            { label: 'جيد جدًا', sub: 'فهم جيد جدًا' },
            { label: 'اقتربت', sub: 'قريب من علامة النجاح' },
            { label: 'لم تنجح بعد', sub: 'دون علامة النجاح' },
        ],
        questionCounter: (current, total) => `السؤال ${current} من ${total}`,
        streak: (n) => `${n} متتالية`,
        mute: 'كتم الأصوات',
        unmute: 'تشغيل الأصوات',
        prev: 'السابق',
        continue: 'التالي',
    },

    progress: {
        title: 'تقدّمك في الدورة',
        sidebarTitle: 'إتقان الاختبارات',
        emptyTitle: 'تقدّمك',
        emptyBody: 'أكمل اختبار الفهم القصير في نهاية كل فصل، وستظهر لك هنا المفاهيم التي أتقنتها بالفعل وتلك التي يستحسن تقويتها. يُحفظ تقدّمك على جهازك.',
        completed: 'مكتملة',
        passed: 'ناجحة',
        average: 'المعدّل',
        finalExam: 'الاختبار النهائي',
        strongHeader: 'قوي لديك',
        weakHeader: 'مفاهيم يستحسن تقويتها',
        weakHeaderShort: 'يستحسن تقويته',
        finalExamCta: 'الانتقال إلى الاختبار النهائي للدورة',
        status: {
            passed: 'ناجح',
            needsReview: 'يتطلّب مراجعة',
            notTaken: 'لم يُجرَ',
        },
    },
};
