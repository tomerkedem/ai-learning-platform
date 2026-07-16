// i18n/locales/ru/behind-ai/semanticSpace.ts
// Russian Chapter 5 ("Semantic Space").
// Narrow localization: the "in simple words" explanatory card (plain) is fully translated
// to natural educational Russian. Every other field still falls back to the Hebrew source
// until Chapter 5 is translated in full, so we spread `he` and override only `plain`.
// No em dash or en dash is used, per project text rules.
import { semanticSpace as he } from '../../he/behind-ai/semanticSpace';

export const semanticSpace = {
    ...he,
    plain: {
        eyebrow: 'Простыми словами',
        title: 'Что такое пространство смысла',
        paragraphs: [
            'После того как каждое предложение превратилось в список чисел, предложения можно сравнивать по числам, а не по словам. Модель измеряет, насколько похожи два таких списка, и располагает предложения так, что те, у которых есть общие выученные ею закономерности, оказываются ближе друг к другу. Именно это позволяет ей упорядочивать предложения и находить самые близкие по смыслу, даже когда у них нет ни одного общего слова.',
            'Близко означает, что модель выучила связь между предложениями, а далеко означает, что связь слабая. Но близость служит лишь свидетельством выученной связи, а не доказательством того, что смыслы одинаковы. К тому же карта здесь представляет собой только упрощённое двумерное изображение пространства с гораздо большим числом осей, показанное так, чтобы его можно было увидеть глазами.',
        ],
    },
};
