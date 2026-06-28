// i18n/locales/en/behind-ai/chapter3Quiz.ts
// English Chapter 3 quiz display text. Shape source: ../../he/behind-ai/chapter3Quiz.
// Mechanics (correctAnswer, difficulty, concept) stay in the shared quizData.ts; the
// page merges this display text by question id. Option order matches the Hebrew source
// so the stored correctAnswer index stays valid. concept keys stay Hebrew (stable);
// conceptLabels provide the translated display label.
//
// No em dash (U+2014), no en dash (U+2013). "Tokenization", "token", and "model"
// are kept as fixed terms.

export const chapter3Quiz = {
    title: 'Knowledge check: Tokenization',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the quiz',
    submitLabel: 'Finish the quiz',
    completedTitle: 'You finished the quiz',

    byId: {
        1: {
            question: 'What happens to your text right after you send it, before the engine computes any meaning?',
            options: [
                'The engine immediately computes the most likely answer',
                'The text is split into working units called tokens',
                'The engine translates the sentence into another language',
                'The engine ranks the words by importance',
            ],
            explanation:
                'Splitting into tokens is the entry point. Before any meaning is computed, the text becomes a sequence of working units. Only after the split can processing begin at all.',
        },
        2: {
            question: 'A single word can split into several tokens. What is the takeaway?',
            options: [
                'The number of tokens always equals the number of words',
                'A token is a working unit, not necessarily a whole word',
                'Some languages cannot be split into tokens at all',
                'Every letter is a separate token',
            ],
            explanation:
                'A token is a working unit, not necessarily a word. One word can split into several units, so you cannot assume that one word always equals one token.',
        },
        3: {
            question:
                "A user takes 'My package did not arrive' and tries a few versions: with three exclamation marks, with a tracking number, and with no spaces at all. What happens to the tokenization?",
            options: [
                'The split stays the same, because the meaning did not change',
                'Only a change in meaning affects the split, not the form',
                'Each of these changes can alter the split and the number of units',
                'Punctuation and numbers are deleted, so they have no effect',
            ],
            explanation:
                'The split is sensitive to how you write. Punctuation and numbers count as units of their own, and removing spaces completely changes how the text is cut. The very same intent can turn into a different number of units.',
        },
        4: {
            question: "A friend says: 'The sentence was already split into tokens, so the model already understood it.' What is inaccurate in that claim?",
            options: [
                'Nothing, splitting into tokens is the understanding itself',
                'The split is only a conversion into working units, and understanding, if it forms, comes in later stages',
                'The mistake is that the sentence was not really split',
                'The mistake is that tokens have nothing to do with meaning at all',
            ],
            explanation:
                'Splitting into tokens is not understanding. It is the first conversion from text into units that can be processed. Whatever is built on top of those units comes in later stages, not at the moment of the split.',
        },
        5: {
            question: 'The exact same sentence is measured in two different models, and the token count comes out different. How is that possible?',
            options: [
                'One of the models surely miscounted',
                'Different models can use different tokenizers, so the same text splits differently',
                'The token count depends only on sentence length and cannot change',
                'The second model translated the sentence before counting',
            ],
            explanation:
                'There is no error here. The split depends on the tokenizer, and different tokenizers cut the same text differently. So you cannot assume the token count is fixed across models, or that one word always equals one token.',
        },
    },

    conceptLabels: {
        'פירוק לטוקנים': 'Splitting into tokens',
        'טוקן מול מילה': 'Token vs word',
        'צורה משנה פירוק': 'Form changes the split',
        'פירוק אינו הבנה': 'Splitting is not understanding',
        'טוקנייזרים נבדלים': 'Tokenizers differ',
    },
};
