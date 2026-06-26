// i18n/locales/ar/catalog.ts
// Arabic (Modern Standard Arabic) catalog strings. Source shape: ../he/catalog.
import { catalog as heCatalog } from '../he/catalog';

export const catalog: typeof heCatalog = {
    badge: 'Core Foundations v1.0',
    heroTitle: 'النواة الهندسية لـ AI',
    tagline: 'الحدس أولًا، ثم المعادلات.',
    builtBy: 'من إعداد',
    authorName: 'تومر كيدم',
    startLearning: 'ابدأ التعلّم',
    chaptersCount: (n: number) => `${n} فصل`,

    cards: {
        python: {
            title: 'بايثون العملية للمطوّرين',
            description: 'من كتابة السكربتات إلى هندسة أنظمة ذكاء اصطناعي مستقرّة وجاهزة للإنتاج.',
        },
        mathIntuitive: {
            title: 'الرياضيات الحدسية لـ AI',
            description: 'ابْنِ الحدس اللازم لفهم «الصندوق الأسود» لتمثيلات Embeddings.',
        },
        mathProbabilistic: {
            title: 'التفكير الاحتمالي لـ AI',
            description: 'أتقِن المنطق الذي يقود التحسين والانحدار التدرّجي.',
        },
        'behind-the-scenes-ai': {
            title: 'ما وراء كواليس AI',
            description: 'ما الذي يحدث فعلًا عندما تكتب إلى محادثة أو وكيل: من النص إلى الاحتمال والقرار والفعل.',
        },
    },
};
