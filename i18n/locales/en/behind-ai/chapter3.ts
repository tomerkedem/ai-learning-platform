// i18n/locales/en/behind-ai/chapter3.ts
// English Chapter 3 ("Tokenization: when text breaks into tokens").
// Shape source: ../../he/behind-ai/chapter3 (Hebrew is canonical).
//
// Real translation, natural English (not literal). Phone-first and TTS-ready: short
// sentences, no dense paragraphs. The package and delivery anchor is preserved.
// Fixed terms kept: Tokenization, token, model, context, prompt. No em dash (U+2014)
// and no en dash (U+2013). Mentor bubble text carries no emoji.
//
// The lab strings (TokenizationLab and friends) come from labContent, so they are
// not repeated here.

import type { Locale } from '@/i18n/config';
import { chapter3Quiz } from './chapter3Quiz';

export const chapter3 = {
    contentLocale: 'en' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 03',
        titleLead: 'Your sentence does not go in as one block.',
        titleHighlight: 'It breaks into units.',
        lede: 'What looks to us like a whole sentence enters the model as a sequence of working units. Before any meaning is computed, the text is cut into small pieces called tokens.',
        question: 'If it is one sentence to me, why does the model see several units?',
        chipGuess: 'Guess what happens to the text first',
        chipTouch: 'Type and watch the sentence get cut',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'First we split, then we understand',
        lab: 'Every token is a working unit',
        lock: 'You locked in the idea',
        practical: 'This is how you write smarter prompts',
    },

    // Opening guess (DiscoveryGuess): text only; poses and target are structural
    guess: {
        eyebrow: 'Quick guess · what happens to the text',
        title: 'What happens to the text right after you send it, before any meaning is computed?',
        subtitle: 'Pick the explanation that feels closest. It is not a test, but one direction gets us nearer to what really happens.',
        invite: 'Before we open this up, try to guess: what is the first thing that happens to the text?',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The sentence you wrote does not enter the model as one block. It breaks into working units called tokens. A token can be a word, part of a word, a punctuation mark, or a number, depending on the tokenizer. All processing starts from these units.',
        cta: 'Let us see how a sentence breaks apart',
        resetButton: 'Choose again',
        exploreHint: 'You can pick another option too and see how it sounds.',
        cards: {
            'as-is': {
                title: 'The text goes in as is',
                desc: 'The model gets the whole sentence and starts understanding it right away.',
                statusLabel: 'Common mistake',
                getsRight: 'It is natural to think so, because that is how we read a sentence.',
                missesLabel: 'What this misses',
                misses: 'But before any understanding, the sentence breaks into smaller units. The model does not start from the whole sentence.',
                bridge: 'This split is the entry point to everything that comes next.',
            },
            tokens: {
                title: 'The text breaks into units (tokens)',
                desc: 'The sentence breaks into small pieces, and processing starts only from them.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. The first step is splitting into tokens, before any meaning is computed.',
                missesLabel: 'What is left to see',
                misses: 'We will see that a token is not always a whole word, and that punctuation, numbers, and spaces change the split.',
                bridge: 'Everything that follows is built from these units.',
            },
            meaning: {
                title: 'The model jumps straight to meaning',
                desc: 'The model grasps the intent before doing anything with the words.',
                statusLabel: 'Not this step',
                getsRight: 'It is true that meaning is built in the end.',
                missesLabel: 'What this misses',
                misses: 'But meaning comes after the split, not as the first step. First you need units to work with.',
                bridge: 'Meaning is built on top of the tokens, not in their place.',
            },
            important: {
                title: 'Only the important words are kept',
                desc: 'The model filters in advance and keeps what matters.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that not every unit will matter equally later.',
                missesLabel: 'What this misses',
                misses: 'But at the split stage all the text becomes units, nothing is thrown away. Weighing importance happens much later.',
                bridge: 'First everything becomes units, and only later does the model decide what to focus on.',
            },
        },
    },

    // See: the wow moment (InsightBox)
    insight: {
        title: 'The surprising point',
        lead: 'To our eyes it is one sentence. To the model it is a chain of units.',
        body: 'The same idea can turn into a different number of units. Spaces, punctuation, numbers, and the language we wrote in all change the split. This split is not understanding. It is only the first conversion from text into something that can be processed.',
    },

    // Touch: the tokenization lab (the component itself comes from labContent)
    lab: {
        eyebrow: 'Tokenization Lab',
        title: 'Break a sentence into tokens',
        intro: 'Pick a quick experiment or type your own sentence, for example "My package did not arrive". Notice what changes when you add an exclamation mark, a tracking number, remove the spaces, or switch to another language. Each unit gets a color, and punctuation and numbers count as units of their own.',
    },

    // Lock in the idea: true vs false + an active classification question
    lock: {
        title: 'Lock in the idea',
        truthLabel: 'True',
        truthText: 'The sentence breaks into units before any deep processing.',
        mistakeLabel: 'False',
        mistakeText: 'The sentence enters the model as one block, and the model reads it the way we do.',
        question: 'Which change to the text is likely to affect the tokenization?',
        options: [
            'Adding punctuation, such as exclamation marks',
            'Adding a number, such as a tracking number',
            'Removing the spaces between words',
            'Switching from one language to another',
            'All of the above',
        ],
        explanationCorrect:
            'Correct. Punctuation, numbers, spaces, and the language we wrote in all change how the text is split into tokens. The split is sensitive to how we write, not only to meaning.',
        explanationWrong:
            'That does affect it, but it is not the full answer. Punctuation, numbers, removing spaces, and switching language all change the split. The precise choice is that all of the above are correct.',
    },

    // Practical takeaway for the user
    practical: {
        title: 'Practical takeaway',
        intro: 'Tokenization directly affects how you should write to a model:',
        points: [
            'One word is not always one token, so do not measure length or cost by the number of words.',
            'The same request can become a different number of units depending on punctuation, numbers, spaces, and language. Clean phrasing tends to save units.',
            'When length, cost, or the context window matter, for example in a long thread about a package that did not arrive, think in units, not words.',
            'A clean split does not mean the model understood. It is only the first conversion before any processing.',
        ],
    },

    // The knowledge check (display text; the numeric skeleton stays in quizData)
    quiz: chapter3Quiz,
};
