// i18n/locales/ar/behind-ai/aiInternals.ts
// Arabic shared ai-internals chrome (ChatInterfacePanel, ConfidenceMeter).
// Shape source: ../../he/behind-ai/aiInternals. Real translation (Modern Standard Arabic, RTL).
// No em dash (U+2014), no en dash (U+2013). "Claude" kept literal. No emoji.

export const aiInternals = {
    chatInterface: {
        tryExample: 'جرّب مثالًا',
        demoBadge: 'عرض تجريبي',
        aiTyping: 'الذكاء الاصطناعي يكتب',
        inputPlaceholder: 'اكتب رسالة...',
        liveTooltip: 'نموذج حقيقي (Claude) متصل',
        demoTooltip: 'وضع العرض التجريبي: ردود مكتوبة مسبقًا، دون نموذج حي',
    },
    confidenceMeter: {
        levels: {
            high: 'عالٍ',
            medium: 'متوسط',
            low: 'منخفض',
        },
    },
    stickyContextBar: {
        currentlyAnalyzed: 'قيد التحليل الآن',
    },
    // ReadAloudControls: واجهة القراءة الصوتية (Web Speech API)، مشتركة بين الفصول.
    labZoom: {
        expand: 'ملء الشاشة',
        collapse: 'العودة إلى الفصل',
        expandAria: 'تكبير المختبر إلى ملء الشاشة',
        collapseAria: 'العودة إلى العرض العادي داخل الفصل',
    },

    readAloud: {
        dock: 'استماع موجّه',
        play: 'استماع',
        pause: 'إيقاف مؤقت',
        resume: 'متابعة',
        stop: 'إيقاف',
        prev: 'المقطع السابق',
        next: 'المقطع التالي',
        voice: 'الصوت',
        browserDefault: 'الصوت الافتراضي للمتصفّح',
        settings: 'خيارات القراءة',
        sections: 'الأقسام',
        nowReading: 'يقرأ الآن',
        unsupported: 'القراءة الصوتية غير متاحة في هذا المتصفّح.',
        scope: 'النطاق',
        scopeShort: 'مختصر',
        scopeRegular: 'عادي',
        scopeFull: 'كامل',
        speed: 'السرعة',
    },
};
