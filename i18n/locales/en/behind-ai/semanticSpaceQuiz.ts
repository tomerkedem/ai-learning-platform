// i18n/locales/en/behind-ai/semanticSpaceQuiz.ts
//
// English display text for the Chapter 5 (Semantic Space) understanding check.
//
// Display text only. The mechanism (correctAnswer, difficulty, concept, onComplete,
// getReviewLinks, nextHref) stays in the shared quizData.ts and is not touched here.
// The option order must stay identical to the shared skeleton, because correctAnswer is
// a numeric index. The concept keys are stable internal keys and stay in Hebrew; only the
// conceptLabels values are translated.
//
// No em dash and no en dash, per project text rules.

import type { semanticSpaceQuiz as HeQuiz } from '../../he/behind-ai/semanticSpaceQuiz';

export const semanticSpaceQuiz: typeof HeQuiz = {
    title: 'Understanding check: Semantic Space',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: 'According to this chapter, what is a semantic space?',
            options: [
                'A list of synonyms for every sentence',
                'A space where every sentence is a point, and sentences close in meaning sit close together',
                'A dictionary that turns every word into a single number',
                'A table that counts how many times each word appeared',
            ],
            explanation:
                'In a semantic space every sentence becomes a point, and its position is set by meaning. Sentences the model treats as related sit close together, and unrelated ones sit far apart. It is not a list of synonyms and not a dictionary of single words.',
        },
        2: {
            question: 'The map in the laboratory showed every sentence as a point in two dimensions. What is it fair to conclude about the model space?',
            options: [
                'The real space is also built from two dimensions with clear meanings.',
                'This is an illustration of a high-dimensional space, and the distances drawn are not an exact measurement.',
                'The model keeps only two dimensions and discards the rest of the representation.',
                'Every dimension in the space has a property a person can read and name.',
            ],
            explanation:
                'The map shows in two dimensions an idea that happens in a space with far more dimensions. The model does not reduce its representation to two dimensions, and a single dimension usually has no simple human meaning. The display helps you grasp the idea of closeness, but the distances drawn in it are not an exact or absolute measurement of the real space.',
        },
        3: {
            question: "'The package has not arrived' and 'The delivery is running late' use different words, yet they sit close together in the space. What does that teach?",
            options: [
                'That the model counts shared letters',
                'That the model recognises similar meaning even when the words differ',
                'That the two sentences are exactly the same sentence',
                'That closeness depends only on identical words',
            ],
            explanation:
                'This is the heart of the chapter. They share almost no words, and still the meaning is close: both are about a package that did not arrive on time. The model works on meaning, not on exact word matching.',
        },
        4: {
            question: "'The package has arrived' and 'The package has not arrived' share almost the same words. Why is it dangerous to conclude that they say the same thing?",
            options: [
                'Because one of the sentences is longer',
                'Because the model always ignores negation',
                'Because they belong to the same coloured region on the map',
                'Because one negation word flips the meaning, and closeness in words is not the same meaning',
            ],
            explanation:
                'One word, "not", flips the meaning end to end. Sharing words makes sentences look close, but that is exactly the trap: closeness in words does not guarantee the same meaning.',
        },
        5: {
            question: 'You want the model to compare meaning between two sentences, not just look for shared words. What helps most?',
            options: [
                'Give context and ask explicitly to compare meaning, not just words',
                'Write the shortest and most general prompt you can',
                'Use as many identical words as possible in both sentences',
                'Assume that if the sentences sound similar, they say the same thing',
            ],
            explanation:
                'Closeness in the space helps the model relate sentences, but it is not proof that the meaning is the same or correct. A clear prompt that gives context and asks to compare meaning gets a more accurate answer than a short, vague one.',
        },
    },

    conceptLabels: {
        'מרחב סמנטי': 'Semantic space',
        'המפה אינה המרחב': 'The map is not the space',
        'מילים שונות משמעות דומה': 'Different words, similar meaning',
        'שלילה הופכת משמעות': 'Negation flips meaning',
        'קרבה אינה אמת': 'Closeness is not truth',
    },
};
