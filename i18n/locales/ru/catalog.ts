// i18n/locales/ru/catalog.ts
// Russian catalog strings. Source shape: ../he/catalog.
import { catalog as heCatalog } from '../he/catalog';

export const catalog: typeof heCatalog = {
    badge: 'Core Foundations v1.0',
    heroTitle: 'Инженерное ядро AI',
    tagline: 'Сначала интуиция, потом формулы.',
    builtBy: 'Создано',
    authorName: 'Томер Кедем',
    startLearning: 'Начать обучение',
    chaptersCount: (n: number) => `${n} глав`,

    cards: {
        python: {
            title: 'Практический Python для разработчиков',
            description: 'От написания скриптов к проектированию стабильных, готовых к продакшену систем ИИ.',
        },
        mathIntuitive: {
            title: 'Интуитивная математика для AI',
            description: 'Разовьёте интуицию, нужную, чтобы понять «чёрный ящик» эмбеддингов.',
        },
        mathProbabilistic: {
            title: 'Вероятностное мышление для AI',
            description: 'Освоите логику, которая управляет оптимизацией и градиентным спуском.',
        },
        'behind-the-scenes-ai': {
            title: 'AI за кулисами',
            description: 'Что на самом деле происходит, когда вы пишете в чат или агенту: от текста к вероятности, решению и действию.',
        },
    },
};
