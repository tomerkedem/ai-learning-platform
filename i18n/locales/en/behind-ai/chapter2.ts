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
        titleLead: 'The same need, two different phrasings.',
        titleHighlight: 'Does the model receive them the same way?',
        lede: 'When we type into a chat, we know exactly what we want. But the same need can be phrased in more than one way. In this chapter we will compare a few phrasings of the same request and check whether the model receives all of them in exactly the same way.',
        question: 'Try to guess before we check: what actually reaches the model when you send a message?',
        chipGuess: 'Guess what goes in first',
        chipCompare: 'Compare phrasings and see what changes',
    },

    // F3 RESPOND (M10): the chapter human response layer. The status stays
    // independent; this is only what the mentor says next, on both outcomes.
    mentorRespond: {
        guessCorrect:
            'You noticed that the model receives one thing: what was actually written. That is also why a small addition like an error code changes so much. It goes in, while your intention stays with you.',
        guessWrong:
            'That assumption is natural, because with a person a hint is enough and the other side fills in the rest. Here one thing is different: what was not written simply did not arrive. It is worth rereading the lines above and asking which part of what you had in mind was actually typed.',
        quizPass:
            'You read a request and see what is missing from it, not only what it says. That habit is what turns a vague request into one that can actually be answered.',
        quizFail:
            'The idea here is not to remember which parts an input has, but to separate what you wrote from what you meant. Go back to the comparison lab, change one phrasing only, and see what the model gains and what disappears.',
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
        revealCopy: 'The model does not receive your intent or the answer in advance. The starting point is the text you wrote: the words, the order, and the punctuation. What you did not write stays missing. From the text and the conversation context, the model infers the intent. So the same need, in two phrasings, can give the model different material to work with.',
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

    // Input Comparison Lab section header (the component itself lives in chapter2Visuals)
    inputLab: {
        eyebrow: 'Input Comparison Lab',
        title: 'Comparing what reaches the model',
        intro: 'The same request, a few different phrasings. Each one gives the model different material to work with.',
    },

    // Visible message versus the full input (post-lab card, closes the chapter-title promise)
    fullInput: {
        title: 'Your message is part of the input, not necessarily all of it',
        body: 'The message you wrote is part of the input, but not always all of it. An AI application may also attach instructions, earlier parts of the conversation, or other context. Whatever was not written and not attached stays missing.',
        seen: 'What the user sees',
        added: 'What the application may attach',
        total: 'The input passed to the model',
        caveat: 'This varies from one application to another. It is not a fixed formula.',
    },

    // Everyday example
    everyday: {
        title: 'A moment from real life',
        body: 'When you text a friend "it did not arrive," they already know what you mean, from the conversation, the tone, and your history together. The model starts from what is actually written to it and from the context it has in the conversation. It can infer quite a lot, but it does not receive what is in your head.',
    },

    // What to take from the chapter
    takeaway: {
        title: 'What to take from this chapter',
        points: [
            'The input is the text that was actually written, not the intent.',
            'Phrasing, order, and context change what the model has to work with.',
            'Missing details can force the model to guess, to ask, or to answer in general terms.',
            'Adding an error code turns the request into something that can be checked.',
            'The message you see is part of the input, and the application may attach more.',
            'A correction mid conversation changes the current context, not what the model learned in training.',
        ],
    },

    // Check Your Understanding (true vs false) + the diagnosis question
    lock: {
        title: 'Check Your Understanding',
        truthLabel: 'True',
        truthText: 'The model starts from what was actually written.',
        mistakeLabel: 'False',
        mistakeText: 'The model receives my intent as is.',
    },

    // In-page diagnosis question (not part of the chapter quiz / quizData)
    diagnosis: {
        prompt: "My printer isn't working?",
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
