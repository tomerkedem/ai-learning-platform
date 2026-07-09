// i18n/locales/en/behind-ai/chapter2.ts
// English Chapter 2 ("The model receives what you wrote, not your intent").
// Shape source: ../../he/behind-ai/chapter2 (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Mentor bubble text
// carries no emoji. "Chat" and "Agent" are kept as fixed product-style terms.

import type { Locale } from '@/i18n/config';
import { chapter2Visuals } from './chapter2Visuals';
import { chapter2Quiz } from './chapter2Quiz';

export const chapter2 = {
    contentLocale: 'en' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 02',
        titleLead: 'The model does not receive your intent.',
        titleHighlight: 'It receives what you wrote.',
        lede: 'When we type into a chat, it is easy to assume the model simply understands what we meant. But before any understanding, what goes in is the text itself: the words, the order, the punctuation, and what went unsaid. In this chapter we will see how the very same intent, phrased differently, gives the model different material to work with.',
        question: 'If my intent is clear to me, why does the phrasing still matter?',
        chipGuess: 'Guess what goes in first',
        chipCompare: 'Compare phrasings and see what changes',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'Let us start from what was actually written',
        lab: 'Same need, different material',
        lock: 'Pause and pick an answer. That is how you will know if you caught the chapter idea.',
    },

    // Opening guess (DiscoveryGuess): text only; poses and target are structural in the page
    guess: {
        eyebrow: 'Quick guess · what goes into the model',
        title: 'What does the model really receive first, the moment you send a message?',
        subtitle: 'Choose the explanation that feels closest. This is not a test, but one direction brings us closer to what really happens.',
        invite: 'Before we open this up, try to guess: what actually reaches the model first?',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the core idea',
        revealTitle: 'So what really goes in?',
        revealCopy: 'The model does not receive your intent or the answer in advance. The starting point is the text you wrote: the words, the order, the punctuation, and what went unsaid. From there it begins to infer. So the same intent, in two phrasings, can give the model different material to work with.',
        cta: 'Let us compare a few phrasings',
        resetButton: 'Choose again',
        exploreHint: 'You can also pick another option and see how it sounds.',
        cards: [
            {
                title: 'My intent',
                desc: 'The model directly understands what I wanted, even before the words.',
                statusLabel: 'Common mistake',
                getsRight: 'That is the natural feeling, because between people we really do guess intent.',
                missesLabel: 'What this misses',
                misses: 'The model does not receive intent as input. It receives the text and tries to infer from it.',
                bridge: 'So the same wish, phrased differently, can lead somewhere else.',
            },
            {
                title: 'The text as written',
                desc: 'The words, the order, and the punctuation I typed, exactly as they are.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. The starting point is the text itself, with everything in it and everything that is not.',
                missesLabel: 'What is left to see',
                misses: 'We will see how a small change in phrasing changes the material the model receives.',
                bridge: 'Everything that happens next starts from this text.',
            },
            {
                title: 'The answer it needs to give',
                desc: 'The model already knows where to land, and just phrases it nicely.',
                statusLabel: 'Not this stage',
                getsRight: 'It is true that an answer comes in the end.',
                missesLabel: 'What this misses',
                misses: 'But the answer is built later, it is not something the model receives at the start.',
                bridge: 'At the start there is only the input, and the answer is built from it step by step.',
            },
            {
                title: 'Only the important words',
                desc: 'The model filters in advance and keeps what matters.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that not every word will weigh the same later on.',
                missesLabel: 'What this misses',
                misses: 'But at the input stage all of the text goes in, not only selected parts. Weighing importance happens later.',
                bridge: 'First everything goes in, and only later is it decided what to focus on.',
            },
        ],
    },

    // The wow moment (InsightBox)
    insight: {
        title: 'What does the model actually get from you?',
        lead: 'The model does not know what you meant. It only gets the text you wrote.',
        body: 'The words you chose, their order, the punctuation, and what you left out - that is all the model has to work with. The very same intent, phrased differently, enters the model as different raw material. So your phrasing is not decoration, it is the input itself.',
    },

    // Input Comparison Lab section header (the component itself lives in chapter2Visuals)
    inputLab: {
        eyebrow: 'Input Comparison Lab',
        title: 'Comparing what reaches the model',
        intro: 'Here is the same request in five phrasings. Pick one, and the panel shows what the model actually receives: what is explicit, what is missing, and what changed.',
    },

    // Everyday example
    everyday: {
        title: 'A moment from real life',
        body: 'When you text a friend "it did not arrive," they already know what you mean, from the conversation, the tone, and your history together. The model starts from what is actually written to it and from the context it has in the conversation. It can infer quite a lot, but it does not receive what is in your head.',
    },

    // Correcting a common mistake (two cards)
    mistake: {
        wrongLabel: 'Common mistake',
        wrongText: '"The model knows what I meant."',
        rightLabel: 'How it really works',
        rightText: 'The model can infer intent from the text and the context, but it does not receive the intent itself as direct input.',
    },

    // What to take from the chapter
    takeaway: {
        title: 'What to take from this chapter',
        points: [
            'The input is the text that was actually written, not the intent.',
            'Phrasing, order, and context change what the model has to work with.',
            'Missing details can force the model to guess, to ask, or to answer in general terms.',
            'Adding a tracking number turns the request into something that can be checked.',
            'An explicit request for action raises the risk and can shift the behavior toward Agent.',
            'A correction mid conversation changes the current context, not what the model learned in training.',
        ],
    },

    // Lock in the idea (true vs false) + the diagnosis question
    lock: {
        title: 'Locking in the idea',
        truthLabel: 'True',
        truthText: 'The model starts from what was actually written.',
        mistakeLabel: 'False',
        mistakeText: 'The model receives my intent as is.',
    },

    // In-page diagnosis question (not part of the chapter quiz / quizData)
    diagnosis: {
        prompt: 'My package has not arrived?',
        question: 'The user wrote this message. What did the model really receive?',
        choosePrompt: 'Choose the answer that seems right to you, and you will get a short explanation.',
        options: [
            'A short text with a question mark, with no explicit request',
            'The full problem, with all the details',
            'The intent to open a support ticket',
            'The answer it should return',
        ],
        explanation: 'The model received exactly this short text: a few words and a question mark. It holds no explicit request and no details. Everything else is what we assume, not what actually went in. The model is better off not assuming that a specific action was already requested.',
    },

    quiz: chapter2Quiz,

    // Visuals and lab sub-namespace
    visuals: chapter2Visuals,
};
