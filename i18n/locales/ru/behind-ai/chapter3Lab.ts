// i18n/locales/ru/behind-ai/chapter3Lab.ts
// Russian content for the chapter 3 tokenization lab (Chapter3LabContent).
// Shape source: app/behind-the-scenes-ai/chapter-3/labContent (HE_LAB_CONTENT is canonical).
//
// Plain data module (type-only imports). Wired through the client labContent registry,
// not the i18n dictionary. Structural keys (scenario ids, modes, accents, role keys,
// roadmap active flags) are NOT translated. English secondary captions stay English.
// No em dash (U+2014) and no en dash (U+2013): the Russian dash (тире) is avoided.

import type { Chapter3LabContent } from '@/app/behind-the-scenes-ai/chapter-3/labContent';

export const chapter3Lab: Chapter3LabContent = {
    modeLabel: 'Режим:',

    splitter: {
        hint: 'Введите фразу, и она разделится на токены в реальном времени.',
        placeholder: 'Например: Бельё не высохло',
        aria: 'Поле ввода для разбиения на токены',
        quickLabel: 'Быстрые эксперименты:',
        resetLabel: 'Сброс',
    },

    stream: {
        title: 'Поток токенов',
        titleEn: 'Token Stream',
        empty: 'Введите текст, и он разделится здесь на токены.',
        hint: 'Нажмите на токен, чтобы увидеть его роль.',
        rail: {
            input: { label: 'Входной текст', en: 'Input Text' },
            tokenizer: { label: 'Токенизатор', en: 'Tokenizer' },
            stream: { label: 'Поток токенов', en: 'Token Stream' },
        },
    },

    legend: {
        title: 'Карта цветов токенов',
        titleEn: 'Token Color Map',
    },

    count: {
        title: 'Счётчик токенов',
        titleEn: 'Token Count',
        note: 'Это число позже свяжется с окном контекста: сколько токенов модель может удержать одновременно. Здесь мы только закладываем идею.',
    },

    roleCard: {
        closeAria: 'Закрыть карточку роли',
    },

    signals: {
        number: { label: 'Числовой токен', en: 'Number token' },
        action: { label: 'Сигнал действия', en: 'Action signal' },
        deliveryFailure: { label: 'Сигнал отрицания', en: 'Negation signal' },
        sortingCenter: { label: 'Чашка кофе', en: 'Coffee cup phrase' },
    },

    noSpaceNote:
        'Без пробелов этот учебный токенизатор видит одну длинную единицу. Настоящий токенизатор всё равно разделил бы её на подслова, ведь он опирается не только на пробелы. Именно поэтому токен не обязательно слово.',

    educational: {
        badge: 'Educational',
        note: 'Это учебный токенизатор, а не коммерческая модель. Этот шаг только подготовка: система ещё не вычисляет полную вероятность и не отвечает, она лишь делит текст на рабочие единицы. Раскраска ролей это учебная подсказка, ведь настоящие модели делят по статистике, а не по языковой роли.',
    },

    subword: {
        title: 'Лаборатория подслов',
        titleEn: 'Sub-word Lab',
        badge: 'Учебное разбиение',
        hint: 'Нажмите на слово, чтобы разделить его: приставка отделяется от основы. Обратите внимание, как с каждым разделением растёт число токенов.',
        wordsLabel: 'Слова:',
        tokensLabel: 'Токены:',
        splitAll: 'Разделить всё',
        mergeAll: 'Объединить всё',
        splitHint: 'нажмите, чтобы разделить',
        mergeHint: 'нажмите, чтобы объединить',
        ariaWhole: 'целое, нажмите, чтобы разделить',
        ariaSplit: 'разделено, нажмите, чтобы объединить',
        note: 'Это лишь учебное разбиение. Настоящий токенизатор делит не по приставкам, а по статистике подслов, выученной из большого объёма текста. Здесь мы показываем идею, что одно слово может разделиться на несколько единиц.',
        splits: [
            { word: 'перечитать', whole: ['перечитать'], units: ['пере', 'читать'], roleLabel: 'Приставка', roleEn: 'Prefix', note: 'Приставка «пере», означающая заново, может отделиться от основы «читать».' },
            { word: 'переписать', whole: ['переписать'], units: ['пере', 'писать'], roleLabel: 'Приставка', roleEn: 'Prefix', note: 'Приставка «пере» может отделиться от основы «писать».' },
            { word: 'безопасный', whole: ['безопасный'], units: ['без', 'опасный'], roleLabel: 'Приставка', roleEn: 'Prefix', note: 'Приставка «без» может отделиться от основы «опасный».' },
            { word: 'подписать', whole: ['подписать'], units: ['под', 'писать'], roleLabel: 'Приставка', roleEn: 'Prefix', note: 'Приставка «под» может отделиться от основы «писать».' },
            { word: 'подогреть', whole: ['подогреть'], units: ['подо', 'греть'], roleLabel: 'Приставка', roleEn: 'Prefix', note: 'Приставка «подо» может отделиться от основы «греть».' },
        ],
    },

    roadmap: {
        title: 'Карта движка',
        titleEn: 'From Text to Probabilities',
        note: 'Сейчас мы только на первом шаге: текст становится токенами. Следующие шаги (ID токенов, векторы) это место, где настоящие модели делают статистический расчёт. Без этого разбиения у маршрута нет начала.',
        steps: [
            { he: 'Текст', en: 'Text', active: true },
            { he: 'Токены', en: 'Tokens', active: true },
            { he: 'ID токенов', en: 'Token IDs', active: false },
            { he: 'Векторы', en: 'Vectors', active: false },
            { he: 'Сходство', en: 'Similarity', active: false },
            { he: 'Оценки', en: 'Scores', active: false },
            { he: 'Вероятности', en: 'Probabilities', active: false },
        ],
    },

    scenarios: [
        {
            id: 'chat-basics',
            mode: 'chat',
            labelHe: 'Режим Chat',
            labelEn: 'Chat mode',
            prompt: 'Бельё не высохло',
            accent: 'emerald',
            routeHe: 'Построить ответ',
            routeEn: 'Build answer',
            examples: [
                { labelHe: 'Базовый', labelEn: 'Base', text: 'Бельё не высохло' },
                { labelHe: 'С вопросом', labelEn: 'With question', text: 'Бельё не высохло?' },
                { labelHe: 'С нажимом', labelEn: 'With emphasis', text: 'Моё бельё не высохло!!!' },
                { labelHe: 'Количество в рецепте', labelEn: 'Recipe quantity', text: 'По рецепту нужно 250 грамм муки' },
                { labelHe: 'Без пробелов', labelEn: 'No spaces', text: 'Бельёневысохло' },
                { labelHe: 'На английском', labelEn: 'In English', text: 'The laundry did not dry' },
                { labelHe: 'Исправление', labelEn: 'Correction', text: 'Не печенье, я испекла пирог' },
            ],
        },
        {
            id: 'agent-check',
            mode: 'agent',
            labelHe: 'Режим Agent',
            labelEn: 'Agent mode',
            prompt: 'Проверь почему кот не вернулся',
            accent: 'purple',
            routeHe: 'Понять задачу',
            routeEn: 'Understand task',
            examples: [
                { labelHe: 'Проверка', labelEn: 'Investigation', text: 'Проверь почему кот не вернулся' },
                { labelHe: 'Для ребёнка', labelEn: 'To recipient', text: 'Проверь почему кот не вернулся к ребёнку' },
            ],
        },
    ],

    roleWords: {
        бельё: 'object',
        Бельё: 'object',
        laundry: 'object',
        кот: 'object',
        не: 'negation',
        Не: 'negation',
        not: 'negation',
        высохло: 'action',
        вернулся: 'action',
        dry: 'action',
        Проверь: 'action-signal',
        проверь: 'action-signal',
        чашка: 'context',
        Чашка: 'context',
        кофе: 'context',
        ребёнку: 'recipient',
        ребёнок: 'recipient',
    },

    roleInfo: {
        object: { label: 'Объект', en: 'Object', why: 'Это то, о чём говорит фраза. Метка отмечает предмет, ещё до обработки остальной части фразы.' },
        negation: { label: 'Отрицание', en: 'Negation', why: 'Это слово может перевернуть направление фразы. Без него смысл противоположный.' },
        action: { label: 'Действие', en: 'Action', why: 'Что произошло с объектом. Глагол задаёт реальное состояние дел.' },
        'action-signal': { label: 'Сигнал действия', en: 'Action signal', why: 'Это слово превращает ввод из описания в просьбу о действии. Оно меняет весь маршрут.' },
        context: { label: 'Контекст', en: 'Context / Location', why: 'Добавляет место или контекст, который уточняет картину, например где вы пили кофе.' },
        system: { label: 'Система', en: 'System', why: 'Указывает на более широкую систему, а не на сам объект. Та же область, но другое направление.' },
        recipient: { label: 'Получатель', en: 'Recipient', why: 'Кто получает действие. Особенно важно, когда речь о реальном человеке.' },
        'question-signal': { label: 'Сигнал вопроса', en: 'Question signal', why: 'Знак вопроса это отдельный токен. Он меняет форму фразы с утверждения на вопрос.' },
        'statement-signal': { label: 'Сигнал утверждения', en: 'Statement signal', why: 'Точка это отдельный токен, который отмечает конец утверждения. Знаки препинания тоже считаются рабочей единицей.' },
        number: { label: 'Число', en: 'Number', why: 'Последовательность цифр это самостоятельная единица. Количество в рецепте, например, превращает общий запрос в точное и измеримое.' },
        noise: { label: 'Шум', en: 'Noise', why: 'Общее слово, которое добавляет очень мало информации. Оно всё равно становится токеном, пусть и с малым весом.' },
        other: { label: 'Общее', en: 'Token', why: 'Слово, не отнесённое к особой роли в этом учебном токенизаторе. Оно всё равно считается рабочей единицей.' },
    },

    sortingCenter: { leads: ['чашка', 'Чашка'], follow: 'кофе' },
    deliveryFailure: { first: 'не', second: 'есть' },
};
