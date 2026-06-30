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

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'Что на самом деле происходит между',
        titleHighlight: 'вопросом и ответом',
        ledeLead: 'Напишите одну фразу. Справа чат выглядит обычно, как в любом приложении. Слева открывается',
        ledeHighlight: ' путь за ответом',
        ledeRest: ': движок показывает, как он читает фразу и приходит к решению. Пока просто наблюдайте, не нужно понимать каждое число. Глубину мы откроем дальше, шаг за шагом.',
        chips: [
            'Справа: ответ, который вы видите',
            'Слева: путь за ответом',
            'Дальше: разбираем каждый шаг подробно',
        ],
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        peek: 'Первый взгляд внутрь движка',
        holographic: 'Здесь движок раскрывается изнутри',
    },

    // Coach card (first-run guidance toward the lab)
    coach: {
        start: 'Начните здесь: ',
        body: 'Напишите свою фразу в лаборатории ниже или выберите быстрый пример.',
        closeAria: 'Закрыть подсказку',
    },

    // Transparent Chat Lab
    lab: {
        title: 'Прозрачный чат',
        eyebrow: 'Transparent Chat Lab',
        intro: 'Здесь видно, что за ответом стоит путь: справа ответ как обычно, а слева путь, который к нему привёл.',
        panelTitle: 'Transparent Chat Lab',
        chatSubtitle: 'Chat Mode · разговор',
        agentSubtitle: 'Agent Mode · задача',
        focusLead: 'Смотрите сначала на ',
        focusHighlight: 'решение',
        focusRest: ', а не на каждое число. Движок слева показывает, что между вопросом и ответом лежит целый маршрут. Полные подробности откроются дальше в курсе.',
        liveNote: 'Ответ в чате пишет настоящая модель (Claude) в реальном времени, слово за словом - это и есть авторегрессионный цикл. Панель справа остаётся учебной иллюстрацией: API не раскрывает внутренние вероятности модели.',
        demoNote: 'Демо-режим: ответы в чате прописаны заранее и фиксированы. Если задать на сервере ANTHROPIC_API_KEY, включается настоящая модель, которая пишет ответ вживую, слово за словом.',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Action Decision Engine',
        chatEngineSubtitle: 'Выбор ответа · ключевые станции',
        agentEngineSubtitle: 'Решение о действии · ключевые станции',
    },

    // Chapter insight
    insightIdea: {
        title: 'Идея главы',
        body: 'Ответ в чате - это лишь видимая вершина скрытого процесса. За каждым ответом идёт маршрут, и этот маршрут можно раскрывать шаг за шагом. Именно это и сделает курс: научит пути за ответом, постепенно. Пока не нужно понимать каждый механизм - достаточно понять, что путь существует и что его можно открыть.',
    },

    // Depth-layer gate (progressive disclosure) + layer intro
    deep: {
        toggleOpen: 'Закрыть слой глубины',
        toggleClosed: 'Открыть движок целиком',
        hint: 'Здесь открываются продвинутые инструменты: живая голова чтения и проба, показывающая, какое слово решило. Можно исследовать в своём темпе.',
        intro1: 'Перед вами слой глубины: отсюда становится техничнее. Вас ждут две пронумерованные лаборатории, каждая показывает свой угол одного и того же маршрута. Не обязательно проходить всё за один раз.',
        intro2Lead: 'В ',
        intro2Mid: ' система выбирает ответ. В ',
        intro2Tail: ' она проверяет, какой следующий шаг верный - ответить, использовать инструмент или остановиться и запросить информацию. Переключайтесь между ними тумблером в верхней части чата.',
    },

    // The four lab headers (eyebrow + title)
    labs: {
        readHead: { eyebrow: 'Живое чтение', title: 'Движок меняет мнение по ходу чтения' },
        confidence: { eyebrow: 'Когда доверять, когда остановиться', title: 'Шкала уверенности' },
        causality: { eyebrow: 'Причинность', title: 'Какое слово решило' },
        fork: { eyebrow: 'Развилка', title: 'Одна фраза, два движка' },
    },

    // Summary (two insights inside the depth layer)
    summary: {
        understandTitle: 'Что вы понимаете теперь',
        understandBody: 'Движок ИИ не "знает" ответ - он ранжирует варианты и решает по разрыву между ними. Когда разрыв велик, он отвечает уверенно; когда разрыв мал, верный шаг - остановиться и спросить, а не гадать. Вы видели это сами: голова чтения показала, как лидер меняется по ходу чтения, а одно заменённое слово перевернуло целое решение.',
        ruleTitle: 'Практическое правило',
        ruleBody: 'Доверяйте движку, когда разрыв велик, а риск низок. Когда разрыв мал или действие чувствительно, остановиться и попросить уточнение - не провал, а ответственный шаг. Именно здесь начинается связь между вероятностью и ответственностью.',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'Перед тестом: три пункта, которые стоит запомнить',
        point1Lead: 'Маршрут, а не магия.',
        point1Body: ' За каждым ответом идёт маршрут: движок разбивает фразу на токены, ранжирует варианты по вероятности, проверяет, насколько он уверен, и только потом решает. Оценка строится по ходу чтения, и каждое новое слово может изменить ведущий вариант.',
        point2Lead: 'Два разных вопроса.',
        point2BeforeChat: ' В ',
        point2AfterChat: ' движок спрашивает "Каков ответ?". В ',
        point2AfterAgent: ' он спрашивает "Какой верный следующий шаг?" - ответить, использовать инструмент или остановиться и запросить информацию.',
        point3Lead: 'Уверенность встречает ответственность.',
        point3Body: ' Уверенность измеряется по разрыву между ведущим вариантом и следующим за ним. Большой разрыв и низкий риск - можно дать движку ответить. Малый разрыв или чувствительное действие - ответственный шаг остановиться и спросить, а не гадать.',
        footnoteLead: 'Хотите увидеть этот путь вживую? Откройте выше ',
        footnoteHighlight: 'движок целиком',
        footnoteTail: ' и поиграйте с головой чтения и лабораторией «какое слово решило».',
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

    // Visuals and labs sub-namespace
    visuals: chapter1Visuals,
};
