// i18n/locales/en/behind-ai/introVisuals.ts
// English introduction visual/UI strings. Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices) stay in the
// components, and the attention token order is fixed (index 0 = noun, index 3 =
// pronoun, index 4 = state) so the coreference arcs land correctly.
// No em dash (U+2014) and no en dash (U+2013). No Hebrew characters.

export const introVisuals = {
    roadmap: {
        peek: 'Peek',
        zone: 'Zone',
        loopBadge: 'Loops back to the start',
    },

    systems: {
        act: 'Act',
        chapter: 'Chapter',
    },

    guess: {
        tokenCue: ['to', 'ken'] as string[],
    },

    viz: {
        sharedNote: 'Numbers are for illustration only, not real model output.',
        tokenize: {
            sentence: 'My package did not arrive',
            tokens: ['My', 'package', 'did not', 'arrive'] as string[],
            caption: 'The text is split into units. In a real model the split sometimes lands inside a word.',
        },
        embedding: {
            token: 'package',
            caption: (note: string) =>
                `The token becomes an ID in the vocabulary, then a vector of numbers that encodes meaning. ${note}`,
        },
        attention: {
            tokens: ['The dog', 'ran', 'because', 'it', 'was happy'] as string[],
            strongLabel: 'Strong link',
            weakLabel: 'Weak',
            caption: 'The model links "it" to "the dog" from context, with a weaker link to the other tokens.',
        },
        scores: {
            rowLabels: ['Sun', 'Rain', 'Cloud'] as string[],
            caption: (note: string) =>
                `The raw scores (gray) turn into probabilities that add up to 100%. ${note}`,
        },
        loop: {
            steps: ['Today', 'Today is', 'Today is sunny'] as string[],
            caption: 'And so on, token after token, until a stop signal.',
        },
    },
};
