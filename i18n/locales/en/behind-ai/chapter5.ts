// i18n/locales/en/behind-ai/chapter5.ts
// English Chapter 5 ("How AI builds an answer"). Shape source: ../../he/behind-ai/chapter5.
// contentLocale = 'en' (real translation), so content-dependent formatters (step counter,
// answer punctuation) use English. "AI" is kept as the product term; brand/chrome labels
// (badge, Answer Builder Lab) stay in English by design.

import type { Locale } from '@/i18n/config';
import { chapter5Lab } from './chapter5Lab';
import { chapter5Quiz } from './chapter5Quiz';

export const chapter5 = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 05',
        titleLead: 'Every word the model writes',
        titleHighlight: 'loops back in',
        lede: 'We saw that the model picks a continuation that looks plausible. But it does not stop after a single choice. It repeats that choice again and again, and every part it writes joins the context and shapes the next choice. The answer is not born all at once, it is built in a loop.',
        hook: 'If the model builds an answer step by step, how does one word change everything that comes after it?',
        chipLoop: 'Pick an opener and step through the loop',
        chipContext: 'Watch the context grow at every step',
    },

    mentor: {
        hero: 'Each step builds the next',
        labExplain: 'Every part loops back in',
        misconception: 'No answer waits ready',
        takeaways: 'Building is not verifying',
        lock: 'You locked the idea in',
    },

    sections: {
        labEyebrow: 'Answer Builder Lab',
        labTitle: 'The Answer Builder Lab',
        labIntro:
            'The same prompt, and one loop that builds the answer. Pick the first part, then step forward and watch how each chosen part joins the context, and how the updated context changes the options for the next part. Try both openers, and see that the same prompt leads to two different answers.',
    },

    guess: {
        eyebrow: 'Quick guess · Building the answer',
        title: 'What happens after the model picks the first continuation?',
        subtitle: 'Pick the mental model that feels closest to you. There is no score here, there is one direction that describes what really happens.',
        invite: 'Before we open this up, try to guess what happens between one step and the next while the answer is being built.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the core idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The model does not hold the full answer and then display it. It generates a small part, joins it to what is already written, and looks again at the updated context to choose the next part. So each step shapes the step after it, and the answer is built in a loop.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can also pick another option and see how it sounds.',

        cards: {
            ready: {
                title: 'The whole answer is already finished',
                desc: 'The complete answer exists inside it, and it just displays it out.',
                statusLabel: 'Common mistake',
                getsRight: 'It is understandable to think so, because the answer flows smoothly as if it were planned in advance.',
                missesLabel: 'What it misses',
                misses: 'There is no complete answer stored in advance. The model generates a part, joins it, and only then moves to the next part.',
                bridge: 'That is why the same question can be built a little differently each time.',
            },
            loop: {
                title: 'Each step joins the context and shapes the next step',
                desc: 'Every part that is written becomes part of the context, and the updated context shapes the next choice.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. Generation is a loop. The written part loops back in and becomes part of the question about the next step.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see how swapping the first part changes the rest of the answer.',
                bridge: 'An early step is not just one more word, it is a frame for everything that follows.',
            },
            verify: {
                title: 'At every step the model checks whether the answer is true',
                desc: 'Before each part it verifies against the world that it is correct.',
                statusLabel: 'Not this stage',
                getsRight: 'It is true that sometimes it matters to verify against the world.',
                missesLabel: 'What it misses',
                misses: 'Verification is another layer, of tools and sources. In the generation loop itself the model leans on the context and the patterns it learned, not on a real-world check.',
                bridge: 'Step-by-step building produces a fitting continuation, it does not verify facts.',
            },
            'last-word': {
                title: 'The model continues only from the last word it wrote',
                desc: 'Only the last part decides what comes next, everything else no longer matters.',
                statusLabel: 'Partly right',
                getsRight: 'There is a kernel of truth here, the last part written really does strongly affect what comes after it.',
                missesLabel: 'What it misses',
                misses: 'But not only it. The model looks at the whole accumulated context, not just the last word. Even the far opening still steers.',
                bridge: 'The influence is of the whole context, so early choices stay important until the end.',
            },
        },
    },

    insight: {
        title: 'The surprising point',
        lead: 'Every part the model writes immediately becomes part of the next question.',
        body: 'The answer does not only come out of the engine, it also changes what the engine sees in the next step. So the first words chosen can steer the whole continuation, and the same prompt can be built into two completely different answers depending on the part chosen at the start.',
    },

    analogy: {
        title: 'A moment from life',
        body: 'When you write a sentence, after the first words you already feel what fits to continue. They narrow the natural options. With the model it is similar, only the part that was written immediately becomes part of the question about the next step, and does not stay just a feeling.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"The model knows the whole answer in advance and then displays it."',
        rightLabel: 'How it actually works',
        rightBody: 'The model builds the answer gradually. Each part it creates joins the context and shapes what comes next. There is no complete answer stored and waiting.',
    },

    takeawaysTitle: 'What to take from this chapter',
    takeaways: [
        'Generating the answer is a repeating process, not a single action.',
        'At every step the model estimates the next fitting part, exactly as we saw in the previous chapter.',
        'The part that is created is joined to the context, and the updated context is the input for the next step.',
        'Early choices can steer later choices, and that is where coherence comes from.',
        'Coherence is not truth verification. Step-by-step building does not check whether the content is correct in the world.',
        'A real check requires a tool or an external source, a topic for a later chapter.',
    ],

    lock: {
        title: 'Understanding lock',
        question: 'The model just wrote the part "Check the tracking number...". What changes now, heading into the next step?',
        options: [
            'Nothing changes, the model continues from the same place',
            'This part joins the context and changes the options for the next step',
            'The model just checked the package status in the real world',
            'The model starts over from the original question only',
        ],
        success:
            'The written part joins the context immediately, and the updated context is what changes which continuations get high weight in the next step. This is not a real-world check and not a restart. Step-by-step building assembles a fitting continuation, it does not verify whether it is correct in the world.',
    },

    lab: chapter5Lab,
    quiz: chapter5Quiz,
};
