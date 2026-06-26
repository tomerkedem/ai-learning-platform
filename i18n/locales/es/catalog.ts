// i18n/locales/es/catalog.ts
// Spanish (neutral international) catalog strings. Source shape: ../he/catalog.
import { catalog as heCatalog } from '../he/catalog';

export const catalog: typeof heCatalog = {
    badge: 'Core Foundations v1.0',
    heroTitle: 'El núcleo de ingeniería de AI',
    tagline: 'Primero la intuición, después las fórmulas.',
    builtBy: 'Creado por',
    authorName: 'Tomer Kedem',
    startLearning: 'Empezar a aprender',
    chaptersCount: (n: number) => `${n} capítulos`,

    cards: {
        python: {
            title: 'Python práctico para desarrolladores',
            description: 'De escribir scripts a diseñar sistemas de IA estables y listos para producción.',
        },
        mathIntuitive: {
            title: 'Matemáticas intuitivas para AI',
            description: 'Desarrolla la intuición necesaria para entender la “caja negra” de los embeddings.',
        },
        mathProbabilistic: {
            title: 'Razonamiento probabilístico para AI',
            description: 'Domina la lógica que impulsa la optimización y el descenso de gradiente.',
        },
        'behind-the-scenes-ai': {
            title: 'Entre bastidores de AI',
            description: 'Qué ocurre realmente cuando escribes a un chat o a un agente: del texto a la probabilidad, la decisión y la acción.',
        },
    },
};
