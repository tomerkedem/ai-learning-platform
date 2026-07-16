// i18n/locales/en/behind-ai/semanticSpace.ts
// English Chapter 5 ("Semantic Space").
// Narrow localization: the "in simple words" explanatory card (plain) is fully translated
// to English. Every other field still falls back to the Hebrew source until Chapter 5 is
// translated in full, so we spread `he` and override only `plain`.
import { semanticSpace as he } from '../../he/behind-ai/semanticSpace';

export const semanticSpace = {
    ...he,
    plain: {
        eyebrow: 'In simple terms',
        title: 'What a meaning space is',
        paragraphs: [
            'Once every sentence has become a list of numbers, we can compare sentences by their numbers instead of by their words. The model measures how alike two such lists are and places the sentences so that ones sharing patterns it has learned end up closer together. That is what lets it rank sentences and find the closest ones in meaning, even when they share no words at all.',
            'Close means the model learned a relation between the sentences, and far means that relation is weak. But closeness is only evidence of a learned relation, not proof that the two meanings are the same. And the map you see here is just a simplified two-dimensional picture of a space with far more axes, drawn so we can take it in with our eyes.',
        ],
    },
};
