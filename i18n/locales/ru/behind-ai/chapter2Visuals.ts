// i18n/locales/ru/behind-ai/chapter2Visuals.ts
// Russian Chapter 2 visuals: Input Comparison Lab chrome and the five input
// variations. Shape source: ../../he/behind-ai/chapter2Visuals (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Structural fields
// (id, ambiguity, tendency, externalData) are kept literal; only visible text is translated.

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'ru' as Locale,

    // Input Comparison Lab chrome
    inputLab: {
        tokenizationHint: 'Дальше в курсе текст будет разбит на токены. Сейчас мы смотрим только на то, что содержит вход, ещё до разбиения.',
        pickerHint: 'Выберите формулировку и посмотрите, что на самом деле доходит до модели.',
        pickerAria: 'Выбор формулировки для сравнения',
        ambiguityPrefix: 'Неоднозначность',
        outro: 'Та же потребность, разные формулировки. С каждой из них модель получает другой материал для работы, ещё до того, как начинается более глубокая обработка.',
        // Field titles in the reading panel
        fields: {
            explicit: 'Что текст говорит явно',
            missing: 'Чего не хватает',
            changed: 'Что изменилось по сравнению с базой',
            ambiguity: 'Уровень неоднозначности',
            expectation: 'Что ожидается от модели',
            external: 'Нужны внешние данные',
            tendency: 'Куда это склоняется',
        },
        baseComparison: 'Это базовая точка для сравнения.',
        externalYes: 'Да.',
        externalNo: 'На этом этапе не требуется.',
        noticeLabel: 'Стоит отметить',
        // Ambiguity level labels (the chip and color are structural in the component)
        ambiguityLabels: {
            low: 'Низкая',
            medium: 'Средняя',
            high: 'Высокая',
        },
        // Tendency labels (the chip and color are structural in the component)
        tendencyLabels: {
            chat: 'Склоняется к Chat',
            'chat-agent': 'Между Chat и Agent',
            agent: 'Склоняется к Agent',
        },
    },

    // The five input variations. Structural fields (id, ambiguity, tendency, externalData)
    // mirror inputVariations.ts; only the visible text is translated, in the same order.
    inputVariations: [
        {
            id: 'base',
            label: 'Базовый запрос',
            prompt: 'Моя посылка не пришла. Что делать?',
            explicit: ['Есть проблема: посылка не пришла', 'Просьба о подсказке: что делать'],
            missing: ['Номер отслеживания', 'Когда был сделан заказ', 'Какая служба доставки'],
            changed: '',
            ambiguity: 'medium',
            expectation: 'Дать общую подсказку или спросить, чего не хватает, чтобы действительно помочь',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'question',
            label: 'Только вопрос',
            prompt: 'Моя посылка не пришла?',
            explicit: ['Посылка не пришла, сформулировано как недоумение'],
            missing: ['Что пользователь хочет, чтобы произошло', 'Явная просьба о действии или подсказке'],
            changed: 'Убрано "что делать" и добавлен знак вопроса. Осталось недоумение без чёткой просьбы.',
            ambiguity: 'high',
            expectation: 'Выяснить, что на самом деле требуется, прежде чем составлять ответ',
            externalData: false,
            tendency: 'chat',
        },
        {
            id: 'contradiction',
            label: 'Противоречие',
            prompt: 'Моя посылка не пришла, но я получил уведомление, что она доставлена.',
            explicit: ['Проблема: посылка не пришла', 'Встречное утверждение: получено уведомление о доставке'],
            missing: ['Явная просьба', 'Номер отслеживания для проверки'],
            changed: 'Добавлено противоречие между тем, что пережил пользователь, и уведомлением о доставке.',
            ambiguity: 'medium',
            expectation: 'Заметить противоречие и, возможно, предложить проверить статус',
            externalData: true,
            externalNote: 'Чтобы разрешить противоречие, стоит проверить настоящие данные отслеживания.',
            tendency: 'chat-agent',
        },
        {
            id: 'tracking',
            label: 'С номером отслеживания',
            prompt: 'Моя посылка не пришла. Номер отслеживания 12345.',
            explicit: ['Проблема: посылка не пришла', 'Идентификатор: номер отслеживания 12345'],
            missing: ['Какое именно действие желательно'],
            changed: 'Добавлен идентификатор отслеживания. Теперь достаточно, чтобы проверить настоящий статус.',
            ambiguity: 'low',
            expectation: 'Статус доставки можно проверить по идентификатору',
            externalData: true,
            externalNote: 'Идентификатор позволяет обратиться к внешней системе отслеживания.',
            tendency: 'agent',
        },
        {
            id: 'correction',
            label: 'Исправление в разговоре',
            prompt: 'Не туфли, я заказал книгу.',
            explicit: ['Исправление: не туфли, а книга'],
            missing: ['Предыдущий контекст разговора, без которого непонятно, что именно исправляют'],
            changed: 'Это не описание проблемы, а исправление того, что было сказано раньше в разговоре.',
            ambiguity: 'high',
            expectation: 'Обновить текущий контекст разговора согласно исправлению',
            externalData: false,
            tendency: 'chat',
            note: 'Исправление меняет текущий контекст разговора, а не то, что модель усвоила при обучении.',
        },
    ] as InputVariation[],
};
