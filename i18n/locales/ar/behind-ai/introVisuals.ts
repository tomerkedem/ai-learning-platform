// i18n/locales/ar/behind-ai/introVisuals.ts
// Arabic (Modern Standard Arabic) introduction visual/UI strings.
// Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices) stay in the
// components, and the attention token order is fixed (index 0 = noun, index 3 =
// pronoun, index 4 = state). "AI" is kept in Latin to match the catalog. No em dash
// (U+2014), no en dash (U+2013), no Hebrew characters.

export const introVisuals = {
    roadmap: {
        peek: 'نظرة',
        zone: 'منطقة',
        loopBadge: 'يعود إلى بداية المسار',
    },

    systems: {
        act: 'مرحلة',
        chapter: 'فصل',
    },

    guess: {
        tokenCue: ['تو', 'كن'] as string[],
    },

    viz: {
        sharedNote: 'الأرقام للتوضيح فقط، وليست مخرجات حقيقية لنموذج.',
        tokenize: {
            sentence: 'طردي لم يصل بعد',
            tokens: ['طردي', 'لم', 'يصل', 'بعد'] as string[],
            caption: 'يُقسَّم النص إلى وحدات. في نموذج حقيقي قد يقع التقسيم أحيانًا داخل الكلمة.',
        },
        embedding: {
            token: 'طردي',
            caption: (note: string) =>
                `يصبح الرمز معرّفًا في المفردات، ثم متجهًا من الأرقام يرمّز المعنى. ${note}`,
        },
        attention: {
            tokens: ['الكلب', 'ركض', 'لأن', 'هو', 'سعيد'] as string[],
            strongLabel: 'رابط قوي',
            weakLabel: 'ضعيف',
            caption: 'يربط النموذج بين "هو" و"الكلب" حسب السياق، ورابطه بالرموز الأخرى أضعف.',
        },
        scores: {
            rowLabels: ['شمس', 'مطر', 'غيم'] as string[],
            caption: (note: string) =>
                `الدرجات الخام (الرمادي) تتحول إلى احتمالات مجموعها 100%. ${note}`,
        },
        loop: {
            steps: ['اليوم', 'اليوم سيكون', 'اليوم سيكون مشمسًا'] as string[],
            caption: 'وهكذا، رمزًا بعد رمز، حتى إشارة التوقف.',
        },
    },
};
