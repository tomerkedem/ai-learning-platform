// i18n/locales/en/behind-ai/attention.ts
//
// English strings for Chapter 6 ("Attention: who matters now") of the interactive
// self-learning course "Behind the Scenes of AI". Hebrew is the source of truth and
// defines the type shape (AttentionDict) that this file conforms to.
//
// This file gathers all of the chapter's translatable text: the hero, the "just before
// the lab" primer, the lab heading, the wow moment, an everyday example, a common-mistake
// fix, the gentle Q/K/V explanation, the Check Your Understanding step, the practical insight, the
// mentor lines, the opening guess, and the sentenceLab and quiz sub-spaces.
//
// Structural metadata that is not translated (icons, mentor poses, tints, attention
// weights, element ids) stays in the chapter page or the components, not here.
//
// No em dash (U+2014), no en dash (U+2013).

import type { Locale } from '@/i18n/config';
import { attentionLab } from './attentionLab';
import { attentionQuiz } from './attentionQuiz';

export const attention = {
    // The language the chapter content is actually written in.
    contentLocale: 'en' as Locale,

    // The anchor prompt, shared by the hero, the guess and the Check Your Understanding step.
    prompt: 'The package was marked delivered, but the customer says they never received it.',

    // -- Hero --
    hero: {
        badge: 'Behind the Scenes · 06 · Attention',
        titleLead: 'The same sentence,',
        titleHighlight: 'but not every word matters the same amount',
        lede:
            'The whole sentence is in front of the model at once. So why does it not treat every word with equal force? In this chapter we will discover how the model decides, at every moment, which parts of the context matter to it right now. This mechanism is called Attention.',
        promptEyebrow: 'The chapter prompt',
        chipEdit: 'Change something in the sentence',
        chipSee: 'and see where attention moves',
        mentorAlt: 'The course mentor',
    },

    // -- Just before the lab --
    primer: {
        eyebrow: 'What is Attention',
        title: 'Just before the lab: what is Attention?',
        lead:
            'Before we start playing with the sentence, let us understand what the attention mechanism actually does. When the model reads a sentence, it does not treat every word with equal force. At every moment it weighs which parts of the text are linked to one another right now, and how strongly. That is the whole idea of Attention.',
        points: [
            {
                title: 'Relationships, not one important word',
                body: 'Attention does not pick one winning word and stick to it. For every part it processes, it asks which other parts matter to it right now. So importance is not a fixed property of a word, it comes from the link between the parts.',
            },
            {
                title: 'The tension in our sentence',
                body: 'In the sentence "The package was marked delivered, but the customer says they never received it", the point is not a single word but the tension between "delivered" and "never received". That is where attention needs to be strong, because this is the contradiction the answer has to handle.',
            },
            {
                title: 'Small words that move the link',
                body: 'Words like "but", negation ("not"), conditions ("only if"), exceptions and pronouns ("it") change which links become important. A small change like that can move the focus of attention entirely.',
            },
            {
                title: 'What Attention is not',
                body: 'Attention is not consciousness and not human understanding. The model has no moment of "I get it". And it is not a fact check either: high attention weight on "delivered" does not mean the package really was delivered, only that the word matters for processing the context.',
            },
        ],
    },

    // -- The wow moment --
    wow: {
        title: 'The surprising point',
        lead: 'The same sentence. The same model. But the moment you change a word, a different part of the sentence draws more weight.',
        body:
            'There is no single word that is "the most important". Importance is not a fixed property of a word, it is the result of the links within the sentence. And that is the difference between a fixed list of highlighted words and a mechanism that weighs relationships and changes according to what is written.',
    },

    // -- Everyday example --
    everyday: {
        title: 'A moment from life',
        body:
            'When a person reads "The package was marked delivered, but the customer says they never received it", they pause for a moment at "but". That word changes how the rest is read. It is important to remember: the model does not pause and does not understand like a person. It has no moment of "understanding". The attention mechanism only gives it a mathematical way to weigh which parts of the text are linked to one another more strongly, and to mix the information accordingly.',
    },

    // -- Fixing a common mistake --
    mistake: {
        wrongTitle: 'A common mistake',
        wrong:
            '"Attention is when the model marks the important words, and then answers based on them." By this view, attention is a kind of highlighter that marks once what is important.',
        rightTitle: 'How it really works',
        right:
            'Attention is not a highlighter. It is a mechanism of relationships. At every moment it asks, in effect: as I process this part, which other parts of the context should influence it the most? The answer changes according to what the sentence says.',
    },

    // -- Gentle Q/K/V explanation --
    qkv: {
        title: 'How the relationship mechanism works, without formulas',
        sub: 'Query · Key · Value',
        body:
            'Every word sends a kind of question: what should I be looking at right now? Other words reveal signals: what information do I hold? The model computes which pairs of question and signal match more strongly, and then mixes the information according to the strength of the match. That is how the meaning of each word updates based on the context around it. That is the whole idea, without math.',
    },

    // -- Check Your Understanding --
    lock: {
        title: 'Check Your Understanding',
        trueLabel: 'True',
        trueText: 'Attention does not say that one word is always important. Importance changes according to what the sentence says and the links within it.',
        falseLabel: 'False',
        falseText: '"The model marked the important words and then answered."',
        question: 'Here is the prompt again. When the model prepares a careful answer, which link is especially important?',
        options: [
            'package → marked',
            'delivered → never received',
            'customer → says',
            'marked → customer',
        ],
        explanationLead: 'The strong link is',
        explanationPair: '"delivered" against "never received"',
        explanationRest:
            '. The point is not just that a package is missing, but the contradiction between what the system marks and what the customer reports. That is where attention needs to be strong, so the answer does not assume something that has not been checked yet.',
    },

    // -- Practical insight --
    practical: {
        title: 'Practical insight',
        lead: 'Attention can weigh links inside what you wrote, but only if the links are really there.',
        uses: [
            'If your prompt has a condition, an exception, a contradiction or a negation, write them explicitly. Words like "but", "not" and "only if" are the signals that steer attention toward the right link.',
            'If a link between two things matters to you, put them close together and write clearly what each pronoun refers to. Do not rely on the model to "figure out on its own" what is connected to what.',
        ],
        caveat:
            'And remember: high attention weight on a word does not mean the information is correct. Attention links parts of text to one another, it does not check facts in the world. Verification needs an external source or a tool.',
    },

    // -- Mentor lines --
    mentor: {
        hero: 'The model picks which words to focus on',
        lab: 'Change a word, and the weight moves',
        lock: 'Attention is clear now',
        practical: 'This is how you write a prompt that attention understands',
    },

    // -- Opening guess --
    guess: {
        eyebrow: 'Quick guess · four ideas about Attention',
        title: 'How does the model decide what to focus on right now?',
        subtitle:
            'Pick the explanation that seems closest to what happens when the model processes the sentence. This is not a test. Choose the idea that seems closest to you, and we will soon see what it reveals.',
        invite: 'There are a few tempting ideas here. Just before the explanation, let us pick one and check it.',
        getsRightLabel: 'What it gets right',
        revealButton: 'Reveal the main idea',
        resetButton: 'Choose again',
        revealTitle: 'So what really happens?',
        revealCopy:
            'Attention does not look for one winning word, and it does not check what is true in the world. It weighs the link between the parts of the sentence. When it needs to spot the problem, "delivered" gets weight. When it needs to spot the contradiction, the link between "delivered" and "never received" becomes important. And the moment you change a word in the sentence, like removing "but" or flipping the negation, attention moves right away.',
        cta: 'Let us see how the weight moves',
        cards: {
            'one-word': {
                title: 'One word leads',
                desc: 'The model finds the most important word in the sentence, and sticks to it throughout the answer.',
                statusLabel: 'Partly right',
                getsRight: 'At a certain moment a word like "delivered" or "never received" really can get a lot of weight.',
                missesLabel: 'What it misses',
                misses: 'Attention does not pick one winning word and stick to it throughout the answer.',
                bridge: 'At another moment in the answer, a different link in the sentence can become more important.',
            },
            'highlight': {
                title: 'Marking important words',
                desc: 'The model marks the standout words, and then builds the answer from them.',
                statusLabel: 'A common mistake',
                getsRight: 'From the outside Attention really does sometimes look like highlighting, so the idea is understandable.',
                missesLabel: 'What it misses',
                misses: 'It is not a highlighter that marks words once.',
                bridge: 'It weighs links between parts of the sentence: what influences what, and at which moment.',
            },
            'dynamic': {
                title: 'The weight changes by the moment',
                desc: 'At every step of the answer, a different part of the sentence can influence more what the model is doing now.',
                statusLabel: 'You chose right',
                getsRight: 'You caught the point. The weight moves by the moment, and does not stay on one word.',
                missesLabel: 'What is left to see',
                misses: 'We will see it happen right on our own sentence, moment by moment.',
                bridge: 'At every moment, a different part of the sentence can get more weight according to what the model is processing now.',
            },
            'factcheck': {
                title: 'Fact checking in the world',
                desc: 'The model focuses on the words that will help it check whether the package really was delivered.',
                statusLabel: 'Important, but not Attention',
                getsRight: 'The distinction matters. You really do need to check whether the package was delivered.',
                missesLabel: 'What it misses',
                misses: 'But that is not the work of Attention. It does not check whether something is true in the world.',
                bridge: 'Attention can spot the tension between "delivered" and "never received", but real verification requires an external source of information or a tool.',
            },
        },
    },

    // Sub-spaces
    sentenceLab: attentionLab,
    quiz: attentionQuiz,
};
