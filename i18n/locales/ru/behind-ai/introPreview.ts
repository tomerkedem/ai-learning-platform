// Public introduction preview strings: the hero, the opening chat example and the read-aloud
// labels. This is all introduction text that ships in the public client bundle; the rest
// (introduction.ts) is loaded only on the server for a signed-in, confirmed learner.

export const introPreview = {
    hero: {
        badge: 'Прозрачная лаборатория · Behind the Scenes',
        titleLead: 'Что на самом деле происходит между сообщением, которое вы отправляете,',
        titleAccent: 'и ответом, который вы получаете?',
        intro: 'Взгляд на то, что происходит в момент, когда вы отправляете сообщение в чат.',
    },

    chat: {
        promptRole: 'Ваш запрос',
        prompt: 'Ко мне сегодня придут друзья на ужин. Что приготовить?',
        inputPlaceholder: 'Введите сообщение...',
        answerRole: 'Ответ',
        answer: 'Можно приготовить пасту с простым салатом. Если скажете, что они любят, я предложу более конкретное меню.',
        outsideLine: 'Снаружи это выглядит как два шага: вы написали запрос и получили ответ.',
        curiosityLine: 'Но настоящий вопрос в том, что произошло посередине.',
    },

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
        noVoice: 'На этом устройстве или в браузере нет голоса для озвучивания на этом языке. Подходящий голос можно добавить в системных настройках речи.',
        scope: 'Объём',
        scopeShort: 'Кратко',
        scopeRegular: 'Обычно',
        scopeFull: 'Полно',
        speed: 'Скорость',
    },
};
