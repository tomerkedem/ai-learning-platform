// i18n/locales/ar/behind-ai/introRoadmap.ts
// Arabic (MSA) "map of the main stations" of the Introduction. Shape source: ../../he/behind-ai/introRoadmap.
// Only user-facing text is translated. Structure (station id, zone, viz kind) lives in the view layer.
// `term` keeps the conventional English technical term. No em dash (U+2014), no en dash (U+2013).

export const introRoadmap = {
    // ── أربع مناطق تعلّم، من النص إلى الإجابة (حسب معرّف المنطقة) ──
    zones: {
        A: {
            title: 'من النص إلى وحدات عمل',
            caption: 'يدخل الطلب ويتفكّك إلى وحدات يستطيع النموذج معالجتها.',
        },
        B: {
            title: 'من التوكنات إلى التمثيلات',
            caption: 'يتحوّل كل توكن إلى أرقام ويأخذ مكانه داخل السياق.',
        },
        C: {
            title: 'حساب السياق',
            caption: 'تؤثّر التوكنات بعضها في بعض حتى يتشكّل تمثيل داخلي محدَّث.',
        },
        D: {
            title: 'من التمثيل إلى الإجابة',
            caption: 'يُشتقّ التوكن التالي من التمثيل، وتتكرّر العملية حتى تكتمل الإجابة.',
        },
    },

    // ── المحطات الأربع عشرة الرئيسية (حسب معرّف المحطة) ──
    stations: {
        // المنطقة A - من النص إلى وحدات عمل
        request: {
            title: 'يدخل الطلب',
            explanation: 'يكتب المستخدم طلبًا، فيدخل مع السياق وتعليمات النظام.',
        },
        tokenize: {
            title: 'التقسيم إلى توكنات',
            explanation: 'يتفكّك النص إلى وحدات عمل يستطيع النموذج معالجتها.',
        },
        ids: {
            title: 'معرّف لكل توكن',
            term: 'Token IDs',
            explanation: 'يحصل كل توكن على معرّف رقمي من مفردات النموذج.',
        },
        // المنطقة B - من التوكنات إلى التمثيلات
        embedding: {
            title: 'تمثيل رقمي',
            term: 'Embedding',
            explanation: 'يتحوّل المعرّف إلى متجه رقمي يستطيع النموذج الحساب عليه.',
        },
        position: {
            title: 'الموضع والترتيب',
            explanation: 'يحتاج النموذج إلى معرفة موضع كل توكن بالنسبة إلى البقية.',
        },
        context: {
            title: 'نافذة السياق',
            explanation: 'يأخذ النموذج في حسبانه المحادثة والتعليمات والتوكنات التي أُنشئت بالفعل.',
        },
        // المنطقة C - حساب السياق
        attention: {
            title: 'الانتباه إلى السياق',
            term: 'Attention',
            explanation: 'تفحص التوكنات أيّ أجزاء السياق مهمة الآن.',
        },
        mix: {
            title: 'مزج المعلومات',
            explanation: 'تمتزج المعلومات من السياق وتحدّث التمثيلات.',
        },
        layers: {
            title: 'طبقات العمق',
            term: 'Transformer',
            explanation: 'تتكرّر المعالجة عبر طبقات كثيرة، وكل طبقة تصقل التمثيل.',
        },
        state: {
            title: 'تمثيل داخلي محدَّث',
            explanation: 'يتشكّل حالة داخلية تلخّص السياق في اللحظة الراهنة.',
        },
        // المنطقة D - من التمثيل إلى الإجابة
        logits: {
            title: 'درجات خام',
            term: 'Logits',
            explanation: 'يمنح النموذج درجات خام للتوكنات التالية الممكنة.',
        },
        softmax: {
            title: 'من الدرجة إلى الاحتمال',
            term: 'Softmax',
            explanation: 'تتحوّل الدرجات إلى توزيع احتمالي.',
        },
        decoding: {
            title: 'اختيار التوكن التالي',
            term: 'Decoding',
            explanation: 'تحدّد قواعد فكّ الترميز أيّ توكن تالٍ يُختار فعليًا.',
        },
        loop: {
            title: 'حلقة حتى الإجابة',
            explanation: 'ينضمّ التوكن المختار إلى الإجابة، ثم يعمل كل شيء من جديد.',
        },
    },
};
