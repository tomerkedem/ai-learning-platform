// i18n/locales/en/behind-ai/logitsSoftmax.ts
//
// English strings for Chapter 8 ("Logits & Softmax: from scores to probabilities") of
// the interactive self-learning course "Behind the Scenes of AI". Hebrew is the source
// of truth and defines the type shape (LogitsSoftmaxDict) that this file conforms to.
//
// This file gathers all of the chapter's translatable text: the hero, the opening guess,
// the "just before the lab" primer, the "See" transition, the wow moment, an everyday
// example, a common-mistake fix, the "how Softmax works" explanation, the understanding
// lock, the practical insight, the mentor lines, and the lab (Logits and Softmax lab)
// and quiz sub-spaces.
//
// Structural metadata that is not translated (icons, mentor poses, tints, element ids)
// stays in the chapter page or the components, not here.
//
// Accuracy: the scores and probabilities are a teaching illustration only. Softmax does
// not check facts, a high score is not truth, and the model does not pull out a ready
// made answer. No year reference in this file.
//
// No em dash (U+2014), no en dash (U+2013).

import type { Locale } from '@/i18n/config';
import { logitsSoftmaxLab } from './logitsSoftmaxLab';
import { logitsSoftmaxQuiz } from './logitsSoftmaxQuiz';

export const logitsSoftmax = {
    // The language the chapter content is actually written in. Setting this to 'en'
    // flips read-aloud to English.
    contentLocale: 'en' as Locale,

    // The start of the sentence the model completes, shared by the hero, the guess and the lab.
    prompt: 'The package probably...',

    // -- Hero --
    hero: {
        badge: 'Behind the Scenes · 08 · Logits & Softmax',
        titleLead: 'Before the model picks a word, it gives',
        titleHighlight: 'a score to every option',
        lede:
            'The model does not pull out a ready made answer and does not return absolute truth. To every possible continuation it gives an internal score, and then a step called Softmax turns the scores into probabilities. In this chapter we will see how the scores become percentages, and why the continuation with the highest percentage is the likely one, not necessarily the correct one.',
        promptEyebrow: 'The continuation being tested',
        chipEdit: 'Change the context or the scores',
        chipSee: 'and watch the probabilities shift',
    },

    // -- Opening guess --
    guess: {
        eyebrow: 'Quick guess · which continuation leads',
        title: 'Which continuation of "The package probably..." will get the highest chance?',
        subtitle:
            'Pick the continuation that seems to you like the leader. This is not a test, and there is no single continuation here that is correct in the world. Choose a guess, and in a moment we will see what happens underneath.',
        invite: 'A few continuations compete over the same sentence. Just before the explanation, guess who leads.',
        getsRightLabel: 'What it gets right',
        revealButton: 'Reveal the main idea',
        resetButton: 'Choose again',
        revealTitle: 'So what really happens?',
        revealCopy:
            'There is no single "correct" continuation. The model gives every continuation a raw score based on the input and the context, and Softmax turns the scores into probabilities. With no context, "was delayed" usually gets the highest score, but a single context detail can hand the lead to another continuation. A high chance means more likely per the text, not more correct in the world.',
        cta: 'Let us see it in the lab',
        cards: {
            delayed: {
                title: 'was delayed',
                desc: 'The package is on its way, just running late.',
                statusLabel: 'Usually the leader',
                getsRight: 'A good guess. With no context, "was delayed" really does usually get the highest score.',
                missesLabel: 'What is left to see',
                misses: 'This is the default leader, not the truth. The gap between the continuations is not huge, and the model did not check the package.',
                bridge: 'In a moment we will see that a single context detail can hand the lead to another continuation.',
            },
            delivered: {
                title: 'was delivered',
                desc: 'The package has already reached its destination.',
                statusLabel: 'Depends on the context',
                getsRight: 'A perfectly reasonable continuation. If there is a hint of delivery, its score can rise and even lead.',
                missesLabel: 'What is left to see',
                misses: 'Without such a hint, "was delivered" gets a lower score than "was delayed". The context is what decides.',
                bridge: 'In the lab we will add "delivery confirmation" and watch its score jump.',
            },
            pickup: {
                title: 'is awaiting pickup',
                desc: 'The package is at a pickup point, waiting for someone to come collect it.',
                statusLabel: 'Depends on the context',
                getsRight: 'A sensible guess. With the right status, this continuation can get the highest score.',
                missesLabel: 'What is left to see',
                misses: 'Without a pickup status in the context, its score stays relatively low compared to the rest.',
                bridge: 'In the lab we will choose the "awaiting pickup" status and watch it rise to the top.',
            },
            lost: {
                title: 'was lost',
                desc: 'The package disappeared and it is not clear where it is.',
                statusLabel: 'Less likely',
                getsRight: 'An option that comes to mind, because a package that did not arrive raises the worry that it was lost.',
                missesLabel: 'What is left to see',
                misses: 'Usually this is the least likely continuation. It gets a low score unless the context really points that way.',
                bridge: 'Notice how the low score turns into a small percentage, but not into zero.',
            },
        },
    },

    // -- Just before the lab --
    primer: {
        eyebrow: 'Internal scores become probabilities',
        title: 'Just before the lab: what are logits and Softmax?',
        lead:
            'Before we play with the scores, let us understand two ideas. The model does not jump from the text straight to a final answer. At a certain point it compares several possible continuations, gives each one a score, and then turns the scores into probabilities.',
        points: [
            {
                title: 'Logits are raw scores',
                body: 'For every possible continuation the model gives an internal score based on the input, the context and the patterns it learned. This is not a percentage yet, only a raw score that says how well the continuation fits.',
            },
            {
                title: 'Softmax turns scores into probabilities',
                body: 'Softmax takes the raw scores and turns them into a distribution: every continuation gets a percentage, and everything together adds up to 100. Now you can compare the continuations.',
            },
            {
                title: 'There are several likely continuations, not one magic answer',
                body: 'Usually several continuations fit the sentence, and each one gets a share of the probability. The model picks from this distribution, it does not pull out a single ready made answer.',
            },
            {
                title: 'Probability is not truth',
                body: 'A continuation can get a high percentage because it fits the text pattern. "The package probably was delayed" can sound reasonable, but the model did not check the tracking system. Likely is not correct.',
            },
            {
                title: 'In the lab you will control the scores',
                body: 'In a moment you will pick a context detail, or tune the scores yourself, and see how the probabilities shift. That is how you feel a score turning into a percentage.',
            },
        ],
    },

    // -- See transition: from context to percentages --
    see: {
        title: 'From the sentence to percentages, in four steps',
        steps: ['Context', 'Possible continuations', 'Raw scores', 'Probability bars'],
        caption:
            'The context sets a score for each continuation, and Softmax turns the scores into percentage bars that add up to 100. A raw score is not a probability yet, it is only the step that comes before it.',
    },

    // -- The wow moment --
    wow: {
        title: 'The surprising point',
        lead: 'The continuation with the highest percentage is the most likely per the text, not the most correct in the world.',
        body:
            'Softmax only arranges the scores into percentages so you can compare and pick. It does not check whether the package really was delayed or delivered. That is why an answer can sound completely confident and still miss reality.',
    },

    // -- Everyday example --
    everyday: {
        title: 'A moment from life',
        body:
            'When you hear half a sentence, you can guess where it is going. The continuation that comes to mind is the likely one, but not always the correct one. With the model it is similar: it gives a score to every possible continuation, and the continuation with the high score feels natural, even if no one checked whether it is real.',
    },

    // -- Fixing a common mistake --
    mistake: {
        wrongTitle: 'A common mistake',
        wrong: '"The model picks this continuation because it is the correct one." By this view, the high percentage proves the continuation is true.',
        rightTitle: 'How it really works',
        right:
            'The model picks a continuation with a relatively high score based on the input and the context. Softmax turns the score into a percentage, but it does not check the world. A high percentage is not proof of truth.',
    },

    // -- How Softmax works, without heavy math --
    how: {
        title: 'How Softmax works, without heavy math',
        sub: 'Softmax',
        body:
            'Think of Softmax like splitting a pie among the continuations. The higher a continuation score, the bigger the slice it gets out of the 100 percent, but together they always add up to one whole pie. A small gap in score can open a noticeable gap in percentages, which is why even a small change in context already moves the picture.',
    },

    // -- Understanding lock --
    lock: {
        title: 'Check Your Understanding',
        trueLabel: 'True',
        trueText: 'A high probability means the continuation is the most likely per the context, among the ones shown. It is not proof that it is true in the world.',
        falseLabel: 'False',
        falseText: '"The highest percentage proves the continuation is correct or was checked."',
        question: 'In the lab, the continuation "was delayed" got the highest probability. What are you allowed to conclude?',
        options: [
            'That the package was certainly delayed',
            'That the model checked and confirmed the package was delayed',
            'That given the current context, this is the most likely continuation among the ones shown',
            'That Softmax checked the tracking system',
        ],
        explanationLead: 'The correct answer is',
        explanationPair: '"Given the current context, this is the most likely continuation among the ones shown."',
        explanationRest:
            '. A high probability is derived from the scores and the context, it is not a check of reality and not a promise. Softmax arranges scores into percentages, it does not reach out to any external source. Verification still needs a tool or a source.',
    },

    // -- Practical insight --
    practical: {
        title: 'Practical insight',
        lead:
            'The quality of the prompt affects the distribution. A clear phrasing strengthens the direction you want and weakens unwanted continuations, but even a continuation with a high probability is not proof. For important tasks, ask the model to:',
        uses: [
            'Separate an assumption from a fact.',
            'Say what it is missing in order to answer with confidence.',
            'Not state a package status without a source.',
            'State how uncertain it is.',
            'Ask for tracking data or a solid source when you need factual accuracy.',
        ],
        caveat:
            'And remember: even the continuation with the highest probability is not proof. Softmax arranges scores, it does not verify. Verification against the world needs an external source or a tool.',
    },

    // -- Mentor lines --
    mentor: {
        hero: 'Here scores turn into percentages',
        lab: 'Change a detail, and the percentages shift',
        lock: 'The idea is clear now',
        practical: 'This is how you steer the distribution',
    },

    // Sub-spaces
    lab: logitsSoftmaxLab,
    quiz: logitsSoftmaxQuiz,
};
