// i18n/locales/ru/behind-ai/introVisuals.ts
// Russian introduction visual/UI strings. Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices) stay in the
// components, and the attention token order is fixed (index 0 = noun, index 3 =
// pronoun, index 4 = state). "AI" is kept in Latin to match the rest of the Russian
// course chrome. No em dash (U+2014), no en dash (U+2013), no Hebrew characters.

export const introVisuals = {
    roadmap: {
        peek: 'Заглянуть',
        zone: 'Зона',
        loopBadge: 'Возврат к началу пути',
    },

    systems: {
        act: 'Акт',
        chapter: 'Глава',
    },

    guess: {
        tokenCue: ['то', 'кен'] as string[],
    },

    viz: {
        sharedNote: 'Числа только для иллюстрации, это не реальный вывод модели.',
        tokenize: {
            sentence: 'Моя посылка не пришла',
            tokens: ['Моя', 'посылка', 'не', 'пришла'] as string[],
            caption: 'Текст разбивается на единицы. В реальной модели разрез иногда попадает внутрь слова.',
        },
        embedding: {
            token: 'посылка',
            caption: (note: string) =>
                `Токен становится ID в словаре, а затем вектором чисел, который кодирует смысл. ${note}`,
        },
        attention: {
            tokens: ['Пёс', 'бежал', 'потому что', 'он', 'был рад'] as string[],
            strongLabel: 'Сильная связь',
            weakLabel: 'Слабая',
            caption: 'Модель связывает «он» с «Пёс» по контексту, а с другими токенами связь слабее.',
        },
        scores: {
            rowLabels: ['Солнце', 'Дождь', 'Облако'] as string[],
            caption: (note: string) =>
                `Сырые оценки (серый) превращаются в вероятности, которые в сумме дают 100%. ${note}`,
        },
        loop: {
            steps: ['Сегодня', 'Сегодня будет', 'Сегодня будет солнечно'] as string[],
            caption: 'И так далее, токен за токеном, до сигнала остановки.',
        },
    },
};
