// i18n/locales/en/catalog.ts
// English catalog strings. Source shape: ../he/catalog.
import { catalog as heCatalog } from '../he/catalog';

export const catalog: typeof heCatalog = {
    badge: 'Core Foundations v1.0',
    heroTitle: 'The Engineering Core of AI',
    tagline: 'Intuition first, formulas later.',
    builtBy: 'Built by',
    authorName: 'Tomer Kedem',
    startLearning: 'Start learning',

    cards: {
        python: {
            title: 'Practical Python for Developers',
            description: 'From writing scripts to engineering stable, production-ready AI systems.',
        },
        mathIntuitive: {
            title: 'Intuitive Math for AI',
            description: 'Build the intuition you need to make sense of the “black box” of embeddings.',
        },
        mathProbabilistic: {
            title: 'Probabilistic Reasoning for AI',
            description: 'Master the logic that drives optimization and gradient descent.',
        },
        'behind-the-scenes-ai': {
            title: 'Behind the Scenes of AI',
            description: 'What really happens when you message a chat or an agent: from text to probability, decision and action.',
        },
    },
};
