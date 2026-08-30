// i18n/locales/ru/behind-ai/chapter1.ts
// Russian Chapter 1 ("What really happens between the question and the answer").
// Shape source: ../../he/behind-ai/chapter1. contentLocale = 'ru' (real translation).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.
// "Claude" and "ANTHROPIC_API_KEY" are kept literal. seed inputs are coupled to the
// Russian detection vocabulary in chapter-1/mockEngine.ts.

import type { Locale } from '@/i18n/config';
import { chapter1Visuals } from './chapter1Visuals';
import { chapter1Quiz } from './chapter1Quiz';

export const chapter1 = {
    contentLocale: 'ru' as Locale,
    redesign: {
        summary: { title: 'Два уровня, которые стоит запомнить', points: ['Путь модели: текст превращается в токены и числовые представления.', 'Представления превращаются в оценки следующего токена, а Softmax преобразует их в вероятности.', 'Decoding выбирает токен, он добавляется к тексту, и генерация повторяется.', 'Оболочка продукта: продукт может собирать ввод и обрабатывать вывод вокруг модели.'] },
    },

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'Что на самом деле происходит между',
        titleHighlight: 'вопросом и ответом',
        ledeLead: 'Напишите одну фразу. Панель чата выглядит знакомо, как любое приложение. Рядом',
        ledeHighlight: ' панель движка открывает путь за ответом',
        ledeRest: ': она показывает учебную иллюстрацию пути от текста к следующему токену. Пока просто наблюдайте; каждый механизм мы откроем позже.',
        chips: [
            'Панель чата: видимые запрос и ответ',
            'Панель движка: иллюстрация внутреннего пути',
            'Дальше: разбираем каждый шаг подробно',
        ],
    },

    // Standalone mentor guidance before the Transparent Chat
    mentorGuide: {
        title: 'Вы видите один ответ. За ним скрыт целый путь.',
        body: 'В прозрачном чате вы увидите, как один и тот же запрос шаг за шагом меняется на пути к ответу. Пока не нужно запоминать каждое число или термин. На каждой станции спрашивайте: что вошло, что изменилось и что вышло?',
    },

    // M10: в главе 1 нет догадки и нет момента вердикта, поэтому в ней нет ни F3 RESPOND,
    // ни портрета наставника. Остаётся только текстовый слой ответа теста, при обоих исходах.
    mentorRespond: {
        quizPass:
            'Ответ, который вы видите, это конец маршрута, и вы уже умеете спрашивать, что произошло по пути. Этот же вопрос вернётся в каждой следующей главе, только у каждой станции будет своё название.',
        quizFail:
            'Эта глава не просит запоминать термины. Она просит увидеть, что между вопросом и ответом есть маршрут. Вернитесь в прозрачный чат, отправьте одну фразу и проследите за одной станцией: что в неё вошло и что вышло.',
    },

    // Transparent Chat Lab
    lab: {
        title: 'Прозрачный чат',
        eyebrow: 'Transparent Chat Lab',
        intro: 'Панель чата показывает запрос и ответ. Панель движка открывает иллюстрацию пути между ними.',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map (package anchor): same stations, now live.
        mapBridge: 'Те же 14 станций с карты теперь работают с отправленным запросом.',
        chatSubtitle: 'Chat Mode · разговор',
        agentSubtitle: 'Agent Mode · задача',
        observationInstruction: 'Не пытайтесь запомнить каждое число. На каждой станции спросите: что вошло, что изменилось и что вышло?',
        simulationDisclosure: 'Это детерминированная учебная иллюстрация общих идей языковых моделей, а не прямая запись скрытых вычислений модели.',
        inputAriaLabel: 'Сообщение для анализа',
        sendAriaLabel: 'Отправить запрос',
        activeRequestLabel: 'Выбранный запрос',
        visibleResponseLabel: 'Отображаемый ответ',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Предпросмотр системы задач',
        chatEngineSubtitle: 'Выбор ответа · ключевые станции',
        agentEngineSubtitle: 'Система вокруг модели · условный обзор',
    },

    // Chapter insight
    insightIdea: {
        title: 'Идея главы',
        body: 'Ответ, видимый в чате, лишь завершает путь, на котором продукт собирает входные данные, а модель шаг за шагом превращает токены и представления в ответ.',
    },
    // Chat seed inputs (default input + quick suggestions)
    // Note: these are demo inputs fed to the learning engine, coupled to the Russian
    // detection vocabulary in chapter-1/mockEngine.ts.
    seed: {
        defaultInput: 'Моя посылка не пришла',
        suggestions: [
            'Моя посылка не пришла',
            'Где моя посылка?',
            'Проверь посылку 123456789',
            'Сообщи клиенту, что посылка потеряна',
            'Разберись с этим',
        ],
    },

    quiz: chapter1Quiz,

    // Visuals sub-namespace
    visuals: chapter1Visuals,
};
