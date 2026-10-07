// Public introduction preview strings: the hero, the opening chat example and the read-aloud
// labels. This is all introduction text that ships in the public client bundle; the rest
// (introduction.ts) is loaded only on the server for a signed-in, confirmed learner.

export const introPreview = {
    hero: {
        badge: 'المختبر الشفاف · Behind the Scenes',
        titleLead: 'ما الذي يحدث فعلًا بين الرسالة التي ترسلها',
        titleAccent: 'والإجابة التي تتلقّاها؟',
        intro: 'نظرة إلى ما يحدث في اللحظة التي ترسل فيها رسالة إلى دردشة.',
    },

    chat: {
        promptRole: 'طلبك',
        prompt: 'سيأتي أصدقائي لتناول العشاء. ماذا يمكنني أن أحضّر؟',
        inputPlaceholder: 'اكتب رسالة...',
        answerRole: 'الإجابة',
        answer: 'يمكنك تحضير المعكرونة مع سلطة بسيطة. إذا أخبرتني بما يحبونه، يمكنني اقتراح قائمة أكثر تحديدًا.',
        outsideLine: 'من الخارج يبدو الأمر كخطوتين: كتبت طلبًا وتلقّيت إجابة.',
        curiosityLine: 'لكن السؤال الحقيقي هو ما الذي حدث في المنتصف.',
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
        noVoice: 'لا يتوفّر صوت للقراءة الصوتية بهذه اللغة على هذا الجهاز أو المتصفّح. يمكنك إضافة صوت مناسب من إعدادات الكلام في النظام.',
        scope: 'النطاق',
        scopeShort: 'مختصر',
        scopeRegular: 'عادي',
        scopeFull: 'كامل',
        speed: 'السرعة',
    },
};
