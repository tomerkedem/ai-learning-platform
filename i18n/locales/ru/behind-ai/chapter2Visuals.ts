// i18n/locales/ru/behind-ai/chapter2Visuals.ts
// Russian Chapter 2 visuals: Input Comparison Lab chrome and the five input
// variations. Shape source: ../../he/behind-ai/chapter2Visuals (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Structural fields
// (id, ambiguity) are kept literal; only visible text is translated.

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'ru' as Locale,

    // Input Comparison Lab chrome
    inputLab: {
        tokenizationHint: 'Заметка на потом: здесь мы только смотрим, что содержит вход. Разбиение текста на токены будет в отдельной главе позже.',
        pickerHint: 'Выберите хотя бы две формулировки и сравните их. Посмотрите, что сказано явно, чего не хватает и что изменилось в просьбе, которую получила модель.',
        pickerAria: 'Выбор формулировки для сравнения',
        ambiguityPrefix: 'Неоднозначность',
        outro: 'Та же потребность, разные формулировки. С каждой из них модель получает другой материал для работы, ещё до того, как начинается более глубокая обработка.',
        // Field titles in the reading panel
        fields: {
            explicit: 'Что текст говорит явно',
            missing: 'Чего не хватает',
            changed: 'Что изменилось по сравнению с базой',
            ambiguity: 'Уровень неоднозначности',
            expectation: 'Что просьба требует от модели',
        },
        baseComparison: 'Это базовая точка для сравнения.',
        noticeLabel: 'Стоит отметить',
        // Ambiguity level labels (the chip and color are structural in the component)
        ambiguityLabels: {
            low: 'Низкая',
            medium: 'Средняя',
            high: 'Высокая',
        },
    },

    // The five input variations. Structural fields (id, ambiguity)
    // mirror inputVariations.ts; only the visible text is translated, in the same order.
    inputVariations: [
        {
            id: 'base',
            label: 'Базовый запрос',
            prompt: 'Мой принтер не работает. Что делать?',
            explicit: ['Есть проблема: принтер не работает', 'Просьба о подсказке: что делать'],
            missing: ['Код ошибки', 'Какая модель принтера', 'Когда началась проблема'],
            changed: '',
            ambiguity: 'medium',
            expectation: 'Дать общую подсказку или спросить, чего не хватает, чтобы действительно помочь',
        },
        {
            id: 'question',
            label: 'Только вопрос',
            prompt: 'Мой принтер не работает?',
            explicit: ['Принтер не работает, сформулировано как недоумение'],
            missing: ['Что пользователь хочет, чтобы произошло', 'Явная просьба о действии или подсказке'],
            changed: 'Убрано "что делать" и добавлен знак вопроса. Осталось недоумение без чёткой просьбы.',
            ambiguity: 'high',
            expectation: 'Выяснить, что на самом деле требуется, прежде чем составлять ответ',
        },
        {
            id: 'contradiction',
            label: 'Противоречие',
            prompt: 'Мой принтер не работает, но приложение говорит, что он подключён.',
            explicit: ['Проблема: принтер не работает', 'Встречное утверждение: приложение сообщает, что он подключён'],
            missing: ['Явная просьба', 'Код ошибки для проверки'],
            changed: 'Добавлено противоречие между тем, что пережил пользователь, и тем, что сообщает приложение.',
            ambiguity: 'medium',
            expectation: 'Заметить противоречие и, возможно, предложить проверить подключение',
        },
        {
            id: 'tracking',
            label: 'С кодом ошибки',
            prompt: 'Мой принтер не работает. Код ошибки 12345.',
            explicit: ['Проблема: принтер не работает', 'Идентификатор: код ошибки 12345'],
            missing: ['Какое именно действие желательно'],
            changed: 'Добавлен код ошибки. Теперь достаточно, чтобы проверить настоящий статус.',
            ambiguity: 'low',
            expectation: 'Неполадку можно проверить по идентификатору',
        },
        {
            id: 'correction',
            label: 'Исправление в разговоре',
            prompt: 'Не принтер, я имел в виду сканер.',
            explicit: ['Исправление: не принтер, а сканер'],
            missing: ['Предыдущий контекст разговора, без которого непонятно, что именно исправляют'],
            changed: 'Это не описание проблемы, а исправление того, что было сказано раньше в разговоре.',
            ambiguity: 'high',
            expectation: 'Обновить текущий контекст разговора согласно исправлению',
            note: 'Исправление меняет текущий контекст разговора, а не то, что модель усвоила при обучении.',
        },
    ] as InputVariation[],
};
