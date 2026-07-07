// i18n/locales/en/behind-ai/mistakeLearning.ts
//
// English (en, LTR) strings for the Learning from Mistakes chapter (Chapter 14, "how a model
// improves from a mistake") of the "Behind the Scenes of AI" course. Hebrew is the source of
// truth and defines the type (MistakeLearningDict).
//
// The idea: when you correct an AI answer, the improvement does not necessarily happen right
// away and does not necessarily change the model. A correction in a conversation lives in the
// context and helps now. A permanent improvement happens at other levels: changing the system
// around the model, training or fine-tuning a future version, and all of it is measured by
// evaluation. There is no claim here about the policy of a specific product.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { mistakeLearningLab } from './mistakeLearningLab';
import { mistakeLearningQuiz } from './mistakeLearningQuiz';

export const mistakeLearning = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 14 · Learning from Mistakes',
        titleLead: 'You corrected AI.',
        titleHighlight: 'What really improved?',
        lede: 'In the previous chapters we saw that a fluent answer can be wrong, that a source reduces guessing, and that a self-check catches unsupported claims. Now we ask a different question: when you correct AI, what actually improves, and when?',
        hook: 'The model answered "The package will arrive tomorrow", and you corrected it. Did the model learn this forever?',
        chipTry: 'Move between the four levels of improvement',
        chipCompare: 'Compare what improved with what did not',
    },

    mentor: {
        hero: 'One correction is not necessarily a change to the model',
        labExplain: 'Where the improvement really happens',
        misconception: 'A correction in a conversation is not training',
        lock: 'Separate an improvement in a conversation from a change to the model',
        practical: 'Correct in a way that can be acted on',
    },

    primer: {
        eyebrow: 'A correction in a conversation is not always a change to the model',
        title: 'Before the lab: what does it mean to learn from a mistake?',
        subtitle: 'Learning from a mistake can happen at several different levels.',
        lead:
            'When you correct an AI answer, it is easy to think the model "learned" from it. But learning from a mistake can happen in several different places, and in most cases it does not happen right away from a single message. Let us separate the levels.',
        points: [
            {
                title: 'A correction inside the conversation',
                body: 'When you correct, the correction enters the context of the conversation. The model can use it to write a better answer now.',
            },
            {
                title: 'Context is not training',
                body: 'Using a correction in a conversation is not the same as changing the weights of the model. The context helps now, it does not change the model forever.',
            },
            {
                title: 'Improvement at the product level',
                body: 'A system can improve without changing the model: a better prompt, a more accurate source, a new rule, or a check that prevents the mistake.',
            },
            {
                title: 'Improvement at the training level',
                body: 'Mistakes that were reviewed and corrected can go into a training or fine-tuning set, and contribute to a future version. That is a separate and slow process.',
            },
            {
                title: 'Why recurring mistakes matter',
                body: 'A single mistake is fixed in a conversation. A mistake that keeps recurring is a pattern, and it is worth fixing in the system, not just once.',
            },
            {
                title: 'What this chapter does not claim',
                body: 'Not every correction in Chat trains the model, the model does not remember everything, and this is not a description of the policy of a specific product. We stay general and conceptual.',
            },
        ],
    },

    see: {
        title: 'Two speeds of improvement',
        steps: ['A mistake', 'A correction in the conversation', 'A fixed answer now', 'A pattern is collected and checked', 'A future improvement in the system or the model'],
        caption:
            'Two different speeds: on one side an immediate correction inside the context, on the other side a slow improvement through a system change or training. The first helps now, the second needs a process and evaluation. This is a teaching illustration, not a description of a specific product.',
    },

    guess: {
        eyebrow: 'Quick guess · after you corrected it',
        title: 'The model answered "The package will arrive tomorrow", and you corrected it: "There is no arrival date in the source". What really improved now?',
        subtitle: 'Pick the safest interpretation. There is no score here, there is one direction that describes what really happened.',
        invite: 'Before we open this up, try to guess what exactly changed the moment you corrected it.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the core idea',
        revealTitle: 'So what really improved?',
        revealCopy:
            'The correction entered the context of the conversation, so the model can fix the answer now. That does not mean the base model changed forever, and it does not mean every user will get this answer from now on. A change like that needs a separate process.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can pick another option too and see how it sounds.',

        cards: {
            context: {
                title: 'The model can use the correction inside the current conversation',
                desc: 'The correction is now in the context, so the model can write a better answer here.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. The correction is part of the context of the conversation, so it helps the current answer.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see that the correction helps now, but it is not necessarily kept in the base model for other conversations.',
                bridge: 'Helps now, does not change the model forever.',
            },
            permanent: {
                title: 'The model changed itself permanently',
                desc: 'Now the model "knows" the correction and will not get it wrong again.',
                statusLabel: 'Common mistake',
                getsRight: 'It is understandable to think so, because the answer really did improve in front of your eyes.',
                missesLabel: 'What it misses',
                misses: 'The correction lives in the context of this conversation. A permanent change to the model is a separate process, and it does not happen from a single message.',
                bridge: 'An improvement in a conversation is not a change to the model.',
            },
            everyone: {
                title: 'All users will get the correct answer from now on',
                desc: 'From the moment you corrected it, everyone benefits from the correction.',
                statusLabel: 'A different layer',
                getsRight: 'It is true that repeated corrections can eventually improve the system for everyone.',
                missesLabel: 'What it misses',
                misses: 'That only happens if a team collects the mistake, changes the system, or trains a new version. It does not happen automatically from your single correction.',
                bridge: 'An improvement for everyone needs a process, not just one correction.',
            },
            nothing: {
                title: 'The correction is meaningless, because AI cannot improve',
                desc: 'The model is frozen anyway, so there is no point correcting.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that the model does not learn from you live, and the weights do not change from a single message.',
                missesLabel: 'What it misses',
                misses: 'But the correction matters a great deal: it improves the answer in the current conversation, and repeated corrections can improve the system later on.',
                bridge: 'Does not learn live, but the correction still matters.',
            },
        },
    },

    insight: {
        title: 'The key point of this chapter',
        lead: 'Your correction does not necessarily enter the mind of the model.',
        body: 'But it can improve the current conversation, because it sits in the context. And when many corrections point to the same problem, they can help improve the system, the checks, the sources, or a future version of the model. An immediate improvement and a permanent improvement are two different things.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"I corrected AI, so now it knows this forever."',
        rightLabel: 'How it really works',
        rightBody: 'The correction helped the current conversation because it entered the context. But the base model did not necessarily change, and it does not automatically remember the correction in a new conversation. A permanent change needs a separate process: a system change, or training a new version with a check. An improvement in a conversation is real, but it is not training.',
    },

    lock: {
        title: 'Lock in your understanding',
        question: 'You corrected the model inside a conversation: "Do not write that the package will arrive tomorrow. There is no arrival date in the source." What is the safest interpretation?',
        options: [
            'The base model learned this forever, for all users.',
            'The correction can help the current conversation, because it is now part of the context.',
            'The correction has no effect at all.',
            'The answer is now guaranteed to be correct forever.',
        ],
        success:
            'A correction in the context can improve the answer in the current conversation. A permanent improvement to the model needs a separate process: a system change or training a new version, with evaluation.',
    },

    practical: {
        title: 'Practical takeaway',
        lead:
            'A good correction is not only "not right". A helpful correction tells the model exactly what to change, so it can fix the answer now based on the context. Instead of "not right", aim like this:',
        uses: [
            'Say what is wrong: "Not right. There is no confirmed arrival date in the source."',
            'Point to the source: "The source says the package is delayed, but does not state a date."',
            'Ask for the change: "Fix the answer so it relies only on the source, and remove the invented arrival date."',
            'Set a rule for the rest of the conversation: "From now on, do not add an arrival date that is not in the source."',
            'For teams that build systems: a recurring mistake should become a test case, a prompt improvement, a fix to a source or a tool, and a metric in evaluation.',
        ],
        caveat:
            'A correction in the context improves the current conversation, but a permanent improvement to the model needs a separate process. Do not assume that a single correction in Chat changes the model for all users.',
    },

    lab: mistakeLearningLab,
    quiz: mistakeLearningQuiz,
};
