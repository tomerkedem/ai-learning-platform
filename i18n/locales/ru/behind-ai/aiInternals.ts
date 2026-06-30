// i18n/locales/ru/behind-ai/aiInternals.ts
// Russian shared ai-internals chrome (ChatInterfacePanel, ConfidenceMeter).
// Shape source: ../../he/behind-ai/aiInternals. Real translation (natural technical Russian).
// No em dash (U+2014), no en dash (U+2013). "Claude" kept literal. No emoji.

export const aiInternals = {
    chatInterface: {
        tryExample: 'Попробуйте пример',
        demoBadge: 'Демо',
        aiTyping: 'ИИ печатает',
        inputPlaceholder: 'Введите сообщение...',
        liveTooltip: 'Подключена настоящая модель (Claude)',
        demoTooltip: 'Демо-режим: ответы по сценарию, без живой модели',
    },
    confidenceMeter: {
        levels: {
            high: 'Высокая',
            medium: 'Средняя',
            low: 'Низкая',
        },
    },
    stickyContextBar: {
        currentlyAnalyzed: 'Анализируется',
    },
    // ReadAloudControls: интерфейс озвучивания (Web Speech API), общий для всех глав.
    readAloud: {
        dock: 'Аудиосопровождение',
        play: 'Озвучить',
        pause: 'Пауза',
        resume: 'Продолжить',
        stop: 'Стоп',
        prev: 'Предыдущий фрагмент',
        next: 'Следующий фрагмент',
        voice: 'Голос',
        browserDefault: 'Голос браузера по умолчанию',
        settings: 'Параметры озвучивания',
        sections: 'Разделы',
        nowReading: 'Сейчас читается',
        unsupported: 'Озвучивание недоступно в этом браузере.',
        scope: 'Объём',
        scopeShort: 'Кратко',
        scopeRegular: 'Обычно',
        scopeFull: 'Полно',
        speed: 'Скорость',
    },
};
