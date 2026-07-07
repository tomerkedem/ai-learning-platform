// i18n/locales/en/behind-ai/doesAiLearn.ts
//
// English (en, LTR) strings for the Does AI Learn From Me chapter (Chapter 16) of the
// "Behind the Scenes of AI" course. Hebrew is the source of truth and defines the type
// (DoesAiLearnDict).
//
// The idea: when you correct the model in a chat, it can use the correction because it is in
// context. That does not mean the base model learned from you permanently. Context, memory
// (a product feature), logs and feedback, and training are different layers. The chapter
// stays general and conceptual: no claim about the policy, privacy, or training of a specific
// product, and no claim that AI "always remembers" or "never remembers".
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { doesAiLearnLab } from './doesAiLearnLab';
import { doesAiLearnQuiz } from './doesAiLearnQuiz';

export const doesAiLearn = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 16 · Does AI Learn From Me',
        titleLead: 'You corrected the model.',
        titleHighlight: 'Did it really learn from you?',
        lede: 'In the previous chapter we tested whether real improvement happened. Now we ask the question from your point of view: when you correct the model in a chat, did it really learn from you, or did it just use what you wrote now? We separate context, memory, and training.',
        hook: 'The model said "The package will arrive tomorrow", and you answered "No, according to tracking there is no confirmed date". What happens the next time you open a new chat?',
        chipTry: 'Move between four learning layers',
        chipCompare: 'See when the correction helps and when it disappears',
    },

    mentor: {
        hero: 'Correcting now is not necessarily learning forever',
        labExplain: 'Move between the layers and see what changes',
        misconception: 'It worked, but it was not necessarily learned',
        lock: 'A new chat starts from a clean page',
        practical: 'Provide the rule or the source again',
    },

    primer: {
        eyebrow: 'Context, memory, and training are not the same',
        title: 'Before the lab: what does it mean that the model "learns from me"?',
        subtitle: 'Context, memory, and training are not the same.',
        lead:
            'When you correct the model and it corrects itself, it is easy to feel that it learned. But usually something simpler happened: the correction entered the context the model sees now. Let us separate a few layers that are easy to confuse.',
        points: [
            {
                title: 'Current context',
                body: 'What you write in the current conversation is part of the context. The model can use it while it phrases answers later in the same chat.',
            },
            {
                title: 'New conversation',
                body: 'A new chat does not necessarily include the old correction, unless the product keeps memory or you provide the context again.',
            },
            {
                title: 'Product memory',
                body: 'Some products offer memory or saved preferences. That is a product feature, not the same thing as changing the base model.',
            },
            {
                title: 'Logs and feedback',
                body: 'Sometimes feedback can be logged or reviewed, depending on the product and settings. No claim is made here about a specific product.',
            },
            {
                title: 'Training and update',
                body: 'Changing the model itself requires a separate process of training or an update. It does not happen instantly from one correction in one chat.',
            },
            {
                title: 'The safe assumption',
                body: 'Do not rely on invisible learning. If a fact matters, provide the context again or use a trusted source.',
            },
        ],
    },

    see: {
        title: 'From the correction to lasting improvement',
        steps: [
            'A correction in the current chat',
            'The current context changes',
            'The answer improves now',
            'A new chat may not include it',
            'Lasting improvement needs memory or training',
        ],
        caption:
            'There are several different layers here: context, memory, logs and feedback, and training. Your correction lives in the context layer, and does not necessarily reach the deeper layers.',
    },

    guess: {
        eyebrow: 'Quick guess · before we open it',
        title: 'You corrected the model, and in the same chat it corrected itself. What happens in a new chat?',
        subtitle: 'Choose the safest assumption. There is no score here, there is one direction that describes what really happens.',
        invite: 'Before we check it in the lab, try to guess what happens to the correction in the next chat.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What it gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The correction can help within the current conversation, because it is in context. But that does not mean the base model changed, and in a new chat you should not assume the correction is still there. Lasting improvement requires a product memory or a separate training process.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can also pick another option and see how it sounds.',

        cards: {
            contextNotPermanent: {
                title: 'It can use this now, but the model did not necessarily change',
                desc: 'The correction helps in the current chat because it is in context, not because the model learned forever.',
                statusLabel: 'You chose correctly',
                getsRight: 'Exactly. The correction lives in the conversation context, so it helps now without changing the base model.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see what happens in a new chat, and the difference between a product memory and training.',
                bridge: 'Helps in context, not necessarily learned forever.',
            },
            alwaysRemembers: {
                title: 'It will always remember this from now on',
                desc: 'The correction entered the model, so it will remember it in every chat.',
                statusLabel: 'Common mistake',
                getsRight: 'It makes sense to feel this way, because within the chat the correction really did work.',
                missesLabel: 'What it misses',
                misses: 'The base model did not change from the correction. In a new chat, do not assume it remembers it.',
                bridge: 'Worked now, but was not kept forever.',
            },
            cantUseAtAll: {
                title: 'It cannot use the correction at all',
                desc: 'A correction in a chat does not affect anything.',
                statusLabel: 'Another layer',
                getsRight: 'It is true that the correction does not change the base model.',
                missesLabel: 'What it misses',
                misses: 'But within the same chat the correction does help, because it is in the context the model sees now.',
                bridge: 'In the current context the correction does work.',
            },
            everyoneGetsIt: {
                title: 'All users will now get the corrected answer',
                desc: 'Your correction updates the model for everyone.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that feedback can sometimes feed a future improvement.',
                missesLabel: 'What it misses',
                misses: 'But that is a separate process, slow and product dependent. One correction does not update the model for all users instantly.',
                bridge: 'Improvement for everyone is a separate process, not instant.',
            },
        },
    },

    insight: {
        title: 'The key point of the chapter',
        lead: 'The confusing part is that the correction really does work within the chat.',
        body: 'The model answers better, and it feels as if it learned. But in most cases what happened is simpler: the correction entered the context the model sees now. That does not necessarily mean the model itself changed.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"I corrected it once, so now it already knows."',
        rightLabel: 'How it really works',
        rightBody: 'The correction helps as long as it is in the conversation context. In a new chat, do not assume it is there, unless the product keeps memory or you provide the information again. A lasting change to the model requires a separate training or update process, not a single message in a chat.',
    },

    lock: {
        title: 'Lock in the understanding',
        question: 'You corrected the model in one chat: "do not write an arrival date if there is no source". Then you opened a new chat. What is the safest assumption?',
        options: [
            'The base model learned your rule forever.',
            'The new chat may not include the correction, unless memory or context provides it.',
            'All users now get the corrected behavior.',
            'The correction never helped at all.',
        ],
        success:
            'Context, memory, and training are separate layers. A new chat starts without the previous context, so if the rule matters, provide it again or use the product memory. Do not rely on invisible learning.',
    },

    practical: {
        title: 'Practical insight',
        lead:
            'When accuracy matters, do not rely on "the model already knows". Instead, aim like this:',
        uses: [
            'Provide the important rule or source again in each new chat, instead of assuming the model remembers.',
            'Phrase the rule explicitly, for example: "Do not invent an arrival date if there is no source. If there is no date in tracking, write that there is no confirmed date."',
            'If the product offers memory or saved preferences, use them for what needs to repeat.',
            'For teams building systems: define the rule, add it to the system instructions, ground it in a source, build test cases, and collect repeated failures for a controlled improvement.',
            'After every change, check again that the behavior really improved.',
        ],
        caveat:
            'Different products handle data differently. If a fact matters, provide the source, the rule, or the saved context explicitly, and do not rely on the model "remembering".',
    },

    finalExamCta: {
        title: 'Ready for the course final exam?',
        body: 'A summary exam that goes over everything we have seen so far, from input to the responsible decision. You can return to it any time, and your progress is saved.',
        button: 'Go to the course final exam',
    },

    lab: doesAiLearnLab,
    quiz: doesAiLearnQuiz,
};
