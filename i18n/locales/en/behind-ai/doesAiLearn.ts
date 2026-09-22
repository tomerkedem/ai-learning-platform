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
        hook: 'The model said "The library is open from 10:00 to 14:00 on the holiday", and you answered "No, the available source does not list the holiday opening hours". What happens the next time you open a new chat?',
        chipTry: 'Move between four learning layers',
        chipCompare: 'See when the correction helps and when it disappears',
    },

    // F3 RESPOND (M10): the chapter human response layer. The status stays
    // independent; this is only what the mentor says next, on both outcomes.
    mentorRespond: {
        guessCorrect:
            'You separated it worked from it was saved, and that separation is hardest to make exactly when the correction succeeded right in front of you. The same separation is worth applying to product memory: whatever comes back in the next conversation comes back because something stored it, not because the model learned.',
        guessWrong:
            'From the inside that feeling is accurate: you corrected it, and the answer really did improve. What is easy to miss is where the correction sat, in the context of the current conversation rather than in the model itself. It is worth going back up and asking which part of the correction could reach a new conversation at all.',
        quizPass:
            'You tell context, product memory and training apart instead of assuming the system simply remembers. That distinction is what stops you relying on something that was never stored.',
        quizFail:
            'The confusion here is normal, because from the outside every layer looks like the model knows. Go back to the lab, move through the four layers, and see exactly where the correction disappears.',
    },

    primer: {
        eyebrow: 'Context, memory, and training are not the same',
        title: 'Before the lab: what does it mean that the model "learns from me"?',
        subtitle: 'Using it now, history, memory, retention, and training are not the same.',
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
                title: 'Retention vs memory vs training',
                body: 'Retention means the service keeps data for some time or purpose. Memory means selected information may return in future conversations. Training means selecting data for a separate process that changes the model. These are separate things, and they depend on the product and settings.',
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
            'There are several different layers here: context, memory, the service keeping data, and training. Your correction lives in the context layer, and does not necessarily reach the deeper ones. Chapter 14 showed how feedback can feed a later improvement process, Chapter 15 showed that any update must be evaluated, and here we saw that none of this means the model learned instantly from one correction.',
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
        title: 'Check Your Understanding',
        question: 'You corrected the model in one chat: "do not state holiday opening hours if there is no source". Then you opened a new chat. What is the safest assumption?',
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
            'Phrase the rule explicitly, for example: "Do not invent holiday opening hours if there is no source. If the source does not list holiday hours, write that there are no confirmed hours."',
            'If the product offers memory or saved preferences, use them for what needs to repeat.',
            'After every change, check again that the behavior really improved.',
        ],
        caveat:
            'If a fact matters, provide the source, the rule, or the saved context explicitly, and do not rely on the model "remembering". Memory, history, and retention are different things, and they depend on the product and settings.',
    },

    finalExamCta: {
        title: 'Ready for the course final exam?',
        body: 'A summary exam that goes over everything we have seen so far, from input to the responsible decision. You can return to it any time, and your progress is saved.',
        button: 'Go to the course final exam',
    },

    lab: doesAiLearnLab,
    quiz: doesAiLearnQuiz,
};
