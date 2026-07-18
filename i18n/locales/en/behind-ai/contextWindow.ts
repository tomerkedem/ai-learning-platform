// i18n/locales/en/behind-ai/contextWindow.ts
//
// English strings for Chapter 7 ("Context Window: what the model really sees right
// now") of the interactive self-learning course "Behind the Scenes of AI". Hebrew is
// the source of truth and defines the type shape (ContextWindowDict) that this file
// conforms to.
//
// This file gathers all of the chapter's translatable text: the hero, the "just before
// the lab" primer, the wow moment, an everyday example, a common-mistake fix, the "how
// the window works" explanation, the understanding lock, the practical insight, the
// mentor lines, the opening guess, and the lab (context window lab) and quiz sub-spaces.
//
// Structural metadata that is not translated (icons, mentor poses, tints, element ids)
// stays in the chapter page or the components, not here.
//
// No em dash (U+2014), no en dash (U+2013).

import type { Locale } from '@/i18n/config';
import { contextWindowLab } from './contextWindowLab';
import { contextWindowQuiz } from './contextWindowQuiz';

export const contextWindow = {
    // The language the chapter content is actually written in. Setting this to 'en'
    // flips read-aloud to English.
    contentLocale: 'en' as Locale,

    // The anchor prompt, shared by the hero, the guess and the understanding lock.
    prompt: 'What should I reply to him?',

    // The critical detail said at the start of the conversation, around which the whole
    // chapter is built.
    criticalFact: 'The package is set for pickup at the Jerusalem branch.',

    // -- Hero --
    hero: {
        badge: 'Behind the Scenes · 07 · Context Window',
        titleLead: 'The model answers based on',
        titleHighlight: 'whatever is in the window right now',
        lede:
            'In a long conversation, important details said at the start can drop out of the picture. In this chapter we will discover what the model really sees when it answers, why that is not the same as memory, and how to keep the critical detail inside what the model is processing right now.',
        promptEyebrow: 'The chapter prompt',
        chipEdit: 'Move the context window',
        chipSee: 'and see what the model still sees',
    },

    // -- Just before the lab --
    primer: {
        eyebrow: 'What is a context window',
        title: 'Just before the lab: what is a context window?',
        lead:
            'Before we play with the conversation, let us understand one idea. At any moment, the model works with a limited amount of text, what is called the context window. It is everything the model sees while it phrases the answer right now. What is in the window has an effect. What has fallen out of it is simply not there.',
        points: [
            {
                title: 'A context window is not memory',
                body: 'The model does not remember you the way a person does. It does not hold everything that was ever said. It works with what is in the current input, and that is all.',
            },
            {
                title: 'A long conversation pushes details out',
                body: 'The longer the conversation gets, the more early details can leave the context window. It depends on the system and on how the conversation is managed, but the idea is constant: there is a limit to what fits in.',
            },
            {
                title: 'Exists in the history, not always in use',
                body: 'Even if a detail was said somewhere earlier, the model will not necessarily rely on it. For it to have an effect, it needs to be present, clear and relevant in the current input.',
            },
            {
                title: 'Product memory is something else',
                body: 'There is a difference between the context window of the conversation and a product memory or saved instructions that the system re-injects. These are different things, and it is easy to confuse them.',
            },
        ],
    },

    // -- The wow moment --
    wow: {
        title: 'The surprising point',
        lead: 'The same model, the same question, but two different answers. The only difference is whether the critical detail is inside the window or outside it.',
        body:
            'The model did not get any dumber and did not forget on purpose. It is simply that once the detail about the Jerusalem branch is no longer in the window, it has nothing to rely on, so it answers in general terms. The information did not vanish from the world, it just left what the model is processing right now.',
    },

    // -- Everyday example --
    everyday: {
        title: 'A moment from life',
        body:
            'It is a bit like asking a friend to continue a conversation that started an hour ago, when they only heard the last five minutes. They are not being mean and they are not forgetful, they simply were not present for the important part. If you want a precise answer, give them the important detail again. With a model it is exactly the same, except the part it "heard" is whatever is in the context window.',
    },

    // -- Fixing a common mistake --
    mistake: {
        wrongTitle: 'A common mistake',
        wrong:
            '"I told it this at the start, so it knows." By this view, anything written once in the conversation stays available to the model forever.',
        rightTitle: 'How it really works',
        right:
            'The model answers based on what is in the context window now. A detail said at the start of a long conversation may no longer be there. If it is critical, it is worth bringing it back into the current prompt, and not assuming the model is still holding it.',
    },

    // -- How the window works, without numbers --
    how: {
        title: 'How the window works, without numbers',
        sub: 'Context Window',
        body:
            'Think of the window like a frame that sees part of the conversation. When new text arrives, the frame moves forward to fit it in, and what is at the far edge can slide out. The model always works with what is inside the frame right now. There is no decision or emotion here, only a limit on how much text fits in at once.',
    },

    // -- Understanding lock --
    lock: {
        title: 'Check Your Understanding',
        trueLabel: 'True',
        trueText: 'The model answers based on what is in the context window now. A detail that left the window no longer has an effect, even if it was said earlier.',
        falseLabel: 'False',
        falseText: '"Anything written once in the conversation stays available to the model forever."',
        question: 'Which prompt is safest for an important task, because it stands on its own and does not depend on what was said earlier?',
        options: [
            'What should I reply to him?',
            'Following up on what I wrote earlier, phrase a reply.',
            'The package is waiting for pickup at the Jerusalem branch. The customer is asking what to do. Write a short, clear answer.',
            'Handle this.',
        ],
        explanationLead: 'The standalone prompt is',
        explanationPair: '"The package is waiting for pickup at the Jerusalem branch. The customer is asking what to do..."',
        explanationRest:
            '. It carries the critical detail and the goal within itself, so it does not depend on what may have already left the context window. The other options rely on an earlier conversation that may no longer be there.',
    },

    // -- Practical insight --
    practical: {
        title: 'Practical insight',
        lead: 'For important tasks, do not count on the model to remember. Bring the critical context back into the prompt.',
        uses: [
            'The goal: what you want to happen in the end.',
            'The critical details: facts like the pickup branch, the status or a tracking number.',
            'What was already decided earlier, and what must not change.',
            'The desired answer format, and a source or status if needed.',
        ],
        caveat:
            'And remember: putting a detail into the prompt does not make it correct. The context window determines what the model sees, not whether it is true. Verification still needs an external source or a tool.',
    },

    // -- Mentor lines --
    mentor: {
        hero: 'What fits in the window is what the model sees',
        lab: 'Move the window, and the answer moves',
        lock: 'The context window is clear now',
        practical: 'This is how you keep the critical detail in the picture',
    },

    // -- Opening guess --
    guess: {
        eyebrow: 'Quick guess · four ideas about the context window',
        title: 'If an important detail is said at the start of a long conversation, will the model still use it?',
        subtitle:
            'Pick the explanation that seems closest to what happens. This is not a test. Choose an idea, and we will check it together in a moment.',
        invite: 'There are a few reasonable ideas here. Just before the explanation, let us pick one.',
        getsRightLabel: 'What it gets right',
        revealButton: 'Reveal the main idea',
        resetButton: 'Choose again',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The model does not remember like a person and does not hold everything that was ever said. It answers based on what is in the context window now. A detail said at the start of a long conversation may already have left the window, and then the model does not rely on it. The fix is simple: if the detail is critical, bring it back into the current prompt.',
        cta: 'Let us see it happen',
        cards: {
            'remembers-all': {
                title: 'The model remembers everything',
                desc: 'Once something is said in the conversation, the model holds it and will use it at every later step.',
                statusLabel: 'A common mistake',
                getsRight: 'It feels that way, because sometimes the model really does carry on a detail said at the start.',
                missesLabel: 'What it misses',
                misses: 'There is no human memory. In a long conversation, early details can leave the context window.',
                bridge: 'What matters is not whether a detail was once said, but whether it is inside the window now.',
            },
            'in-window': {
                title: 'Only what is in the window now',
                desc: 'The model answers based on the information currently in the context window, not on the whole history.',
                statusLabel: 'You chose right',
                getsRight: 'You caught the main point. What matters is what is in the window at the moment of the answer.',
                missesLabel: 'What is left to see',
                misses: 'We will see it right on our own conversation: the same detail, once inside and once outside.',
                bridge: 'When the critical detail leaves the window, the answer becomes more generic.',
            },
            'first-message': {
                title: 'The beginning stays strongest',
                desc: 'Whatever is said first gets a fixed anchor, so the model always weighs it heavily.',
                statusLabel: 'Partly right',
                getsRight: 'Sometimes an opening really does set the tone for the whole conversation, so the idea is understandable.',
                missesLabel: 'What it misses',
                misses: 'There is no guarantee the opening stays. In fact, it is the part most likely to leave the window first.',
                bridge: 'Importance is not set by who was said first, but by what is in the window now.',
            },
            'saved-memory': {
                title: 'There is a saved memory',
                desc: 'The system has a product memory that stores the detail automatically and keeps it always available.',
                statusLabel: 'Important, but not the context window',
                getsRight: 'The distinction matters. Systems with a product memory really do exist.',
                missesLabel: 'What it misses',
                misses: 'A product memory is a separate mechanism. The conversation context window is still limited, and it is easy to confuse the two.',
                bridge: 'Even when there is a memory, what affects the answer now is what is in the window now.',
            },
        },
    },

    // Sub-spaces
    lab: contextWindowLab,
    quiz: contextWindowQuiz,
};
