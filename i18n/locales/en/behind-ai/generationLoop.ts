// i18n/locales/en/behind-ai/generationLoop.ts
// English Chapter 5 ("How AI builds an answer"). Shape source: ../../he/behind-ai/generationLoop.
// contentLocale = 'en' (real translation), so content-dependent formatters (step counter,
// answer punctuation) use English. "AI" is kept as the product term; brand/chrome labels
// (badge, Answer Builder Lab) stay in English by design.

import type { Locale } from '@/i18n/config';
import { generationLoopLab } from './generationLoopLab';
import { generationLoopQuiz } from './generationLoopQuiz';

export const generationLoop = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 10 · Generation Loop',
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
        lock: 'You locked the idea in',
        practical: 'Steer the loop up front',
    },

    sections: {
        labEyebrow: 'Answer Builder Lab',
        labTitle: 'The Answer Builder Lab',
        labIntro:
            'The same prompt, and one loop that builds the answer. Pick the first part, then step forward and watch how each chosen part joins the context, and how the updated context changes the options for the next part. Try both openers, and see that the same prompt leads to two different answers.',
    },

    primer: {
        eyebrow: 'From a single step to a full loop',
        title: 'Before the lab: what is the Generation Loop?',
        subtitle: 'A full answer is built one step after another',
        lead:
            'Before we watch the answer being built, let us see what is happening here. The model does not write a whole paragraph at once. It chooses a small part, joins it to the text already written, and then chooses the next part based on the updated context. That loop repeats until the answer is complete or a stop signal is reached.',
        points: [
            {
                title: 'What the generation loop is',
                body: 'After the model picks a token or a small chunk, that part joins the text written so far. The context grows, and the model chooses the next part based on the updated text. Choose, join, choose again, and so on.',
            },
            {
                title: 'Why it comes after the previous chapter',
                body: 'The previous chapter showed how one token is chosen from the probabilities. Here that same choice repeats again and again. This chapter is not about a single choice, but about what happens when it occurs dozens of times in a row.',
            },
            {
                title: 'Each chosen part updates the context',
                body: 'The part that is written does not only go out, it also loops back in and becomes part of the input for the next step. So every choice slightly changes what the model weighs when it picks the continuation.',
            },
            {
                title: 'Why the first words matter',
                body: 'The first parts set the tone, the level of caution, and the structure. If the answer opened in an over-confident voice, the rest tends to stay over-confident. A careful opening invites a careful continuation. An early step is a frame for everything that follows.',
            },
            {
                title: 'Why the answer feels continuous',
                body: 'The loop runs very fast, so from the outside it looks like one flowing answer. But under the surface it was assembled part after part, it did not appear ready-made.',
            },
            {
                title: 'Fluency is not truth',
                body: 'A smooth, convincing answer can still be wrong. The loop assembles a continuation that fits the context and the patterns the model learned, it does not check whether the content is true in the world. If the status matters, you need a source or a tool, or you say what is missing.',
            },
            {
                title: 'What you will see in the lab',
                body: 'In a moment you will watch an answer being built step by step, and change the opening and the instruction to see how everything else changes with them.',
            },
        ],
    },

    see: {
        title: 'From prompt to a full answer, step by step',
        steps: ['The prompt', 'The chosen part', 'The answer updates', 'The next choice', 'The full answer'],
        caption:
            'Each chosen part joins the answer, and the growing answer becomes the context for the next choice. That is how the loop moves forward until the answer is complete. This is an educational illustration of step-by-step generation, not a real trace from a model, and the loop builds the continuation, it does not check facts.',
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

    practical: {
        title: 'Practical takeaway',
        lead:
            'If you want a stable, useful answer, it helps to steer the generation loop before it even starts. The opening, the structure, and the wording of your request shape everything that gets built after them. For an important task, ask explicitly for:',
        uses: [
            'A clear structure: "Write the reply in three parts: empathy, what is known, and what needs checking."',
            'Cautious wording: "Do not guess an arrival time that was not checked. If the tracking number is missing, ask for it."',
            'A split between known and assumed: ask it to mark what is fact and what is an assumption.',
            'A source check when status matters: "If the status cannot be confirmed, say so instead of guessing."',
        ],
        caveat:
            'Even so, no wording turns fluency into truth. A good prompt does not only pick a topic, it shapes how the answer will be built. But to verify against the world you still need an external source or a tool.',
    },

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

    lab: generationLoopLab,
    quiz: generationLoopQuiz,
};
