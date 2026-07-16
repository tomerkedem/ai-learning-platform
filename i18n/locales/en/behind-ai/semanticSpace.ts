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
            'In the previous chapter, every sentence became a list of numbers that the model learned, its embedding. Each value in the vector describes the sentence position along one dimension, and all the values together decide where it sits in semantic space. In that space we can compare embeddings and check how close two representations are to each other. The map you see here is only a simplified two-dimensional projection, and a real embedding has many more dimensions.',
            'The model arranges the sentences so that ones sharing patterns it has learned end up closer together. That is what lets it rank sentences and find the closest ones in meaning, even when they share no words at all.',
            'Close means the model learned a relation between the sentences, and far means that relation is weak. But closeness is only evidence of a learned relation, not proof that the two meanings are the same.',
        ],
    },
    // Only the two mentor lines that Chapter 5 actually renders: the laboratory bubble
    // and the pre-answer hint in the lock card header. The rest of `mentor` is not shown.
    mentor: {
        ...he.mentor,
        lab: 'Watch the distance, not the words.',
        lock: 'One answer here is tempting. Take a moment before you choose.',
    },
    sections: {
        ...he.sections,
        dnaIntro:
            'So far we have seen where each sentence sits in the space. Now we will look more closely at the vector that represents it and see how its pattern of values differs from one sentence to another, and how that pattern shapes the closeness between them.',
        dnaSelectorHint: 'Pick one sentence on each side and compare how the pattern of values and links changes.',
    },
    lock: {
        title: 'Lock in your understanding',
        question: 'Two sentences sit close to each other in semantic space. What can you carefully conclude from that?',
        options: [
            'That the two sentences have identical meaning.',
            'That their representations are similar according to the measure being used, but not necessarily that their meaning is the same or that the information in them is correct.',
            'That the two sentences use exactly the same words.',
        ],
        explanationCorrect:
            'Closeness in the space points to similarity between the representations according to the comparison measure, but it does not prove that the meaning is the same or that the information is correct. Even a single negation word can change a sentence meaning and still leave the representations close.',
        explanationWrong:
            'Closeness in the space does not guarantee identical meaning and does not require using the same words. It points only to similarity between the representations according to the comparison measure.',
    },
    lab: {
        ...he.lab,
        map: {
            ...he.lab.map,
            closestNow: 'The closest sentence now is:',
        },
        negation: {
            ...he.lab.negation,
            bridge: 'That is why it is not enough to look at the words alone. You need to understand how each word changes the meaning of the rest, not just which words appeared.',
        },
    },
};
