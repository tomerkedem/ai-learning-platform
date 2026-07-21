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
        titleLead: 'The same mistake keeps coming back.',
        titleHighlight: 'How does it become an improvement?',
        lede: 'In the previous chapters we saw that a fluent answer can be wrong, that a source reduces guessing, and that a self-check catches unsupported claims. Now we ask a different question: when the same mistake keeps recurring, how does a team turn it into a real improvement, and how do you know the improvement really worked?',
        hook: 'The model invents an arrival date that has no source, again and again. One correction helps now, but what has to happen for this mistake to really stop?',
        chipTry: 'Move between the four levels of improvement',
        chipCompare: 'Compare what improved with what did not',
    },

    mentor: {
        hero: 'Real improvement is a process, not magic',
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
                title: 'Context and memory are not training',
                body: 'Using a correction in a conversation is not the same as changing the model weights, and it only helps here and now. Saved memory, when a product supports it, keeps selected information for later conversations, but it still does not train the model itself. Saved memory gets its own fuller treatment later in the course.',
            },
            {
                title: 'Improvement at the product level',
                body: 'A system can improve without changing the model: a better prompt, a more accurate source, a new rule, or a check that prevents the mistake.',
            },
            {
                title: 'Improvement at the training level',
                body: 'Mistakes that were reviewed and corrected can go into a training or fine-tuning set and contribute to a future version, in a separate and slow process. Feedback is an input, not guaranteed truth, so the examples are reviewed and unclear or wrong feedback is filtered out before they are used.',
            },
            {
                title: 'What this chapter does not claim',
                body: 'Not every correction in Chat trains the model, the model does not remember everything, and this is not a description of the policy of a specific product. We stay general and conceptual.',
            },
        ],
    },

    see: {
        title: 'Two speeds of improvement',
        steps: ['A mistake is seen', 'A correction is given', 'Improvement can happen at several levels', 'Evaluation shows whether it worked'],
        caption:
            'The correction helps right away, but the real improvement is measured later: the mistake is collected and reviewed, the fix is made at one of the levels, and only an evaluation shows whether it truly worked. This is a teaching illustration, not a description of a specific product.',
    },

    guess: {
        eyebrow: 'Quick guess · a recurring mistake',
        title: 'The model invents an arrival date that has no source, and you correct it. What does that correction really do?',
        subtitle: 'Pick the safest interpretation. There is no score here, there is one direction that describes what really happened.',
        invite: 'Before we open this up, try to guess what exactly one correction like this does.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the core idea',
        revealTitle: 'So what really leads to improvement?',
        revealCopy:
            'One correction helps now, because it enters the context of the conversation. But it is mostly a signal: if the same mistake keeps recurring, you can collect it as an example, review it, fix the system or train a new version, and measure in an evaluation whether the improvement really worked. Real improvement is a process, not the result of a single message.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can pick another option too and see how it sounds.',

        cards: {
            context: {
                title: 'Helps now, and is also a signal for improvement later',
                desc: 'The correction enters the context, so the model fixes the answer here. And if the mistake keeps recurring, the correction is a signal you can act on.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. The correction helps the current conversation, and it is also a sign: a recurring mistake can be turned into a controlled improvement.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see how such a signal becomes an example, a review, a fix in the system or in training, and a check that measures whether the improvement worked.',
                bridge: 'Helps now, and a signal for a controlled improvement later.',
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
        lead: 'A single correction is a signal, not a model update.',
        body: 'It helps the current conversation, but real improvement begins when many corrections point to the same problem. Then you can collect them as examples, review them, change a prompt, a source, a rule, a check or the training, and measure in an evaluation whether things really improved. Improvement is a controlled process, not magic that happens from a single message.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"I corrected AI once, so the system already improved."',
        rightLabel: 'How it really works',
        rightBody: 'A single correction helps the current conversation, and it is a signal worth paying attention to. But improving the system needs a separate process: collect the mistake as an example, review it, change a prompt, a source, a rule, a check or the training, and measure in an evaluation that the change really helped and did not break something else. Without measurement, "we improved" is a hope, not knowledge.',
    },

    lock: {
        title: 'Check Your Understanding',
        question: 'The same mistake ("The package will arrive tomorrow" with no source) keeps recurring for many users. What is the right way to make it really improve?',
        options: [
            'One user\'s correction already changed the model for all users.',
            'Collect the mistake as an example, review it, fix the system or the training, and measure in an evaluation before releasing.',
            'Wait for the model to fix itself over time.',
            'There is nothing to do, because the model is frozen and cannot improve at all.',
        ],
        success:
            'A recurring mistake is a signal. Real improvement is a controlled process: collect examples, review them, fix the system or train a new version, and measure in an evaluation that the change really helped. A correction in a conversation helps now, but it does not replace the process.',
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
