// i18n/locales/en/behind-ai/decoding.ts
//
// English (en, LTR) strings for Chapter 9 ("Decoding: Choosing the Next Token") of the
// interactive self-learning course "Behind the Scenes of AI". Hebrew is the source of
// truth and defines the type shape (DecodingDict) that this file conforms to.
//
// Boundary with Chapter 8: Chapter 8 turned scores into probabilities. Chapter 9 starts
// after the probabilities already exist, and asks how the next token is chosen from them.
// A conservative style leans toward the most likely, an open style can sample a lower one.
// Choosing is not fact-checking, and a chosen token is not necessarily true.
//
// Accuracy: the probabilities, choices and styles are a teaching illustration only. No
// year reference in this file.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { Locale } from '@/i18n/config';
import { decodingLab } from './decodingLab';
import { decodingQuiz } from './decodingQuiz';

export const decoding = {
    // The language the chapter content is actually written in. Setting this to 'en' flips
    // read-aloud to English.
    contentLocale: 'en' as Locale,

    // The start of the sentence the model completes, shared by the hero, the guess and the
    // lab. Deliberately different from Chapter 8 to signal a new step in the process.
    prompt: 'Your package...',

    // -- Hero --
    hero: {
        badge: 'Behind the Scenes · 09 · Decoding',
        titleLead: 'The probabilities are ready. Now the model',
        titleHighlight: 'chooses the next token',
        lede:
            'In the previous chapter we saw how the probabilities are formed. But a distribution is not yet an answer. The model needs a decoding style to pick one token from it. A conservative choice leans toward the most likely option and gives predictable output, and an open choice can also sample a lower option and add variety. Either way, choosing a token is not checking that it is correct.',
        promptEyebrow: 'The sentence being continued',
        chipEdit: 'Pick a decoding style',
        chipSee: 'and see which token is chosen',
    },

    // -- Opening guess --
    guess: {
        eyebrow: 'Quick guess · how the token is chosen',
        title: 'The model has already computed probabilities for "Your package...". Does it always have to choose the option with the highest probability?',
        subtitle:
            'Pick the interpretation that seems right to you. This is not a test, and there is no single perfect answer here. Choose a guess, and in a moment we will see what happens underneath.',
        invite: 'The probabilities already exist. Just before the explanation, guess how the next token is chosen from them.',
        getsRightLabel: 'What it gets right',
        revealButton: 'Reveal the main idea',
        resetButton: 'Choose again',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The model does not always have to choose the highest option. There is a step called Decoding, and the decoding style is what decides. A conservative style leans toward the most likely option, an open style can also sample a lower one and add variety. And most important of all: the chosen token is not automatically the correct one. The choice decides how you pick, not whether it is true.',
        cta: 'Let us see it in the lab',
        cards: {
            alwaysTop: {
                title: 'Always the highest',
                desc: 'The model has to choose the option with the highest probability, every time.',
                statusLabel: 'Close, but too strong',
                getsRight: 'There is a grain of truth in this. In a conservative decoding style the model really does almost always choose the leading option.',
                missesLabel: 'What is left to see',
                misses: 'The word "always" is too strong. A more open decoding style can sometimes choose a different option from the same distribution.',
                bridge: 'In a moment we will see that the choice depends on the style, not only on the highest probability.',
            },
            conservative: {
                title: 'Usually the highest, in a conservative style',
                desc: 'When the choice is conservative, the model leans toward the option with the highest probability.',
                statusLabel: 'An accurate description of one style',
                getsRight: 'An excellent guess. That is exactly how a conservative decoding style behaves: it leans toward the most likely and gives predictable output.',
                missesLabel: 'What is left to see',
                misses: 'This is one style out of several. A more open style can behave differently and also choose a lower option.',
                bridge: 'In the lab we will switch between conservative, balanced and open and see how the choice changes.',
            },
            sampled: {
                title: 'Sometimes another option is sampled',
                desc: 'The model can also choose a continuation that is not the most likely, to add variety.',
                statusLabel: 'Captures the open style',
                getsRight: 'Correct. In a more open decoding style, an option with a lower probability can sometimes be chosen.',
                missesLabel: 'What is left to see',
                misses: 'Note: it is still drawn from the same distribution. Choosing a lower option does not make it correct.',
                bridge: 'In the lab we will see how an open style gives less likely options a chance too.',
            },
            autoTrue: {
                title: 'Whatever is chosen is automatically correct',
                desc: 'Once the model chose a token, that means it checked it is correct.',
                statusLabel: 'A common mistake',
                getsRight: 'It is tempting to think so, because the choice sounds decisive.',
                missesLabel: 'What is left to see',
                misses: 'The choice decides how you pick from the probabilities, it does not check the world. A chosen token can definitely be wrong.',
                bridge: 'Throughout the chapter we will return to this point: choosing is not verifying.',
            },
        },
    },

    // -- Just before the lab --
    primer: {
        eyebrow: 'From probability to choice',
        title: 'Just before the lab: what is decoding?',
        subtitle: 'Not only what is likely, but what actually gets chosen',
        lead:
            'Before we play with the decoding style, let us understand what happens here. The probabilities already exist from the previous step. Now we need to decide how one token is chosen from them. The way to choose is called Decoding, and it has several styles.',
        points: [
            {
                title: 'What decoding is',
                body: 'Decoding is the step where the model chooses the next token from the probability distribution. There are already options with different chances, and here we decide which of them actually gets chosen.',
            },
            {
                title: 'Why it comes after the previous chapter',
                body: 'In the previous chapter the scores turned into probabilities. This chapter starts exactly from that point and asks a different question: now that there is a distribution, how do we choose from it?',
            },
            {
                title: 'A conservative choice',
                body: 'A conservative style leans toward choosing the option with the highest probability. The result is more predictable and stable, so it fits when you want a consistent answer.',
            },
            {
                title: 'An open choice, sampling',
                body: 'An open style can sometimes choose an option with a lower probability too. That adds variety, alternative phrasings and ideas, at the cost of a little stability.',
            },
            {
                title: 'The tradeoff, and how you tune it',
                body: 'More openness can help with ideas, but it fits factual tasks that need stability less well. There are simple ways to tune the openness: temperature, which sharpens or flattens the distribution, and a related idea called top-p, which narrows the choice to the leading options only. These are intensity knobs for the style, not knobs of truth or intelligence.',
            },
            {
                title: 'What decoding is not',
                body: 'Decoding is not fact-checking. It does not prove the chosen token is correct. It only describes how a token is chosen from the probabilities that already exist.',
            },
            {
                title: 'In the lab you will control the style',
                body: 'In a moment you will use this exact distribution, switch the decoding style, and see how the chosen continuation changes. That is how you feel what the decoding style does.',
            },
        ],
    },

    // -- See transition: from distribution to token --
    see: {
        title: 'From distribution to token, in four steps',
        steps: ['Probability distribution', 'Decoding style', 'The chosen token', 'The answer updates'],
        caption:
            'This exact distribution goes into a decoding style, and out of it comes one token that joins the answer. A different style can choose a different token. The choice is made from the probabilities, not from checking the world.',
    },

    // -- The wow moment --
    wow: {
        title: 'The surprising point',
        lead: 'This exact distribution can lead to different tokens, just because of the decoding style.',
        body:
            'The decoding style does not change the probabilities, it only decides how you choose from them. So a less likely token chosen in an open style is not more correct, it was simply chosen. The choice decides style, not truth.',
    },

    // -- Everyday example --
    everyday: {
        title: 'A moment from life',
        body:
            'When you reply to a friend, there are several natural ways to continue a sentence. Sometimes you pick the safe, expected one, and sometimes a more surprising phrasing. In both cases the choice checked no fact, it only decided how the continuation sounds. With the model it is similar: the same distribution, and the decoding style decides what comes out.',
    },

    // -- Fixing a common mistake --
    mistake: {
        wrongTitle: 'A common mistake',
        wrong: '"If the model chose this token, that means it is correct." By this view, the act of choosing proves truth.',
        rightTitle: 'How it really works',
        right:
            'The decoding style only decides how you choose from the existing probabilities. Conservative gives predictable output, open adds variety, but neither one checks the world. A chosen token can be wrong.',
    },

    // -- Conservative vs open, without complicated terms --
    how: {
        title: 'Conservative vs open, without complicated terms',
        sub: 'Decoding',
        body:
            'Think of temperature like a knob that sharpens or flattens the same distribution. Low temperature sharpens: the leading option stands out, and the choice leans toward it. High temperature flattens: lower options get a real chance too, and the choice is more varied. It is a knob of style, not of truth or intelligence.',
    },

    // -- Understanding lock --
    lock: {
        title: 'Lock in the understanding',
        trueLabel: 'True',
        trueText: 'The decoding style decides how you choose from the probabilities. An open style can also choose a less likely option.',
        falseLabel: 'False',
        falseText: '"If a less likely option was chosen, that means the model checked it is correct."',
        question: 'In a more open choosing mode, the model chose a continuation with a relatively low probability. What can you safely conclude?',
        options: [
            'That the less likely continuation became factually correct',
            'That the model checked that this continuation is correct',
            'That the decoding style allowed a less likely option to be chosen',
            'That Softmax stopped working',
        ],
        explanationLead: 'The correct answer is',
        explanationPair: '"The decoding style allowed a less likely option to be chosen."',
        explanationRest:
            '. An open style simply gives lower options in the distribution a chance too. That is not verification and not a promise that the continuation is correct. Decoding decides how you choose, not whether it is true. Verification still needs a source or a tool.',
    },

    // -- Practical insight --
    practical: {
        title: 'Practical insight',
        lead:
            'The decoding style is a tool in your hands, through how you ask. If you want accuracy, stability and a reliable answer, ask for a focused, constrained, source-backed answer. If you want ideas, alternatives or phrasings, you can ask for several options or a more open wording:',
        uses: [
            'For a factual task: "Do not guess. If there is no tracking source, say that the status must be checked."',
            'For wording: "Give me three polite versions of a message to a customer about a delayed package."',
            'For a stable task: ask for one focused answer, not several open alternatives.',
            'For a creative task: ask for several options or a more varied wording.',
        ],
        caveat:
            'And remember: no decoding style verifies facts. Conservative gives stability, open gives variety, but verification against the world needs an external source or a tool.',
    },

    // -- Mentor lines --
    mentor: {
        hero: 'Same distribution, a different choice',
        lab: 'Change the style, and you get a different token',
        lock: 'You locked in the idea',
        practical: 'This is how you pick a style to fit the task',
    },

    // Sub-spaces
    lab: decodingLab,
    quiz: decodingQuiz,
};
