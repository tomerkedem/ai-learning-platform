// i18n/locales/en/behind-ai/fullTrace.ts
//
// English (en, LTR) strings for the Full Trace chapter (Chapter 19, "Full Trace: One
// Prompt, All Stations") of the "Behind the Scenes of AI" course. Hebrew is the source of
// truth and defines the type (FullTraceDict).
//
// This is the capstone chapter. It connects all the course stations into one visible route:
// one prompt that passes from input, through meaning, generation, reliability, and the agent
// layer, to the controlled decision. The idea: a real AI experience is not one magical
// answer, but a sequence of transformations and checks.
//
// The chapter does not claim that AI is dangerous, that an agent must never act, that it
// always acts alone, or that Full Trace is a peek into private reasoning. Full Trace is a
// teaching record of visible stages, not a chain of thought.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { fullTraceLab } from './fullTraceLab';
import { fullTraceQuiz } from './fullTraceQuiz';

export const fullTrace = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 19 · Full Trace',
        titleLead: 'One prompt,',
        titleHighlight: 'all stations',
        lede: 'Across the course we opened the engine layer by layer. Now we connect it all: one prompt that passes through every station, from input to the responsible decision. Not just the answer at the end, but the whole path to it.',
        hook: 'You wrote one request about a package. What really happens behind the scenes, from the first word to the decision?',
        chipTry: 'Step through one complete route, stage by stage',
        chipCompare: 'See where information enters, where an error could enter, and where control is added',
    },

    mentor: {
        hero: 'Not just the answer, the whole path to it',
        labExplain: 'Step through it and see the route',
        misconception: 'The answer is the end, the route is the point',
        lock: 'Source before conclusion, approval before sending',
        practical: 'Define goal, source, boundary, and output',
    },

    primer: {
        eyebrow: 'One prompt travels a whole route, not one magic step.',
        title: 'Right before the lab: why does Full Trace matter?',
        subtitle: 'Because now you see the whole path, not just the answer.',
        lead:
            'Across the course we saw each station on its own. Full Trace connects them: one prompt that passes through understanding, generation, grounding, a task loop, and control, all the way to an output. This is not a peek into the model private reasoning, it is a visible map of the path.',
        points: [
            {
                title: 'Full Trace is not chain of thought',
                body: 'This is not hidden private reasoning. It is a teaching record of visible stages: input, context, a tool or source result, checks, permission state, and output.',
            },
            {
                title: 'It connects model and product',
                body: 'The model produces text and scores. The product around it can add tools, retrieval, validation, permissions, approval gates, and UI decisions. Full Trace shows both together.',
            },
            {
                title: 'Why two prompts behave differently',
                body: 'A prompt with a tracking number and a clear approval boundary is safer and easier to run than "take care of it". Same world, different route.',
            },
            {
                title: 'Where an error can enter',
                body: 'Missing information, weak grounding, a wrong assumption, a bad tool result, or a missing approval boundary. The route shows where each one hides.',
            },
            {
                title: 'Where control can be added',
                body: 'Sources, self-check, evaluation, tool permissions, approval gates, and stop conditions. Every point of risk has a point of control facing it.',
            },
            {
                title: 'It closes the course',
                body: 'By the end of this chapter you can explain the whole path: from a user prompt to a controlled response, and from a response to a controlled agent action.',
            },
        ],
    },

    see: {
        title: 'Station by station: the whole course in one route',
        intro: 'We will not repeat each chapter in full. We will see the whole route in five groups, so you can follow the path at a glance.',
        groups: [
            { title: 'Input and meaning', stations: ['Input', 'Tokens', 'Embeddings', 'Semantic Space', 'Context'] },
            { title: 'Generating the answer', stations: ['Attention', 'Logits & Softmax', 'Decoding', 'Generation Loop'] },
            { title: 'Reliability', stations: ['Hallucination risk', 'RAG / Grounding', 'Self-Check', 'Evaluation'] },
            { title: 'The agent layer', stations: ['Task detection', 'Tracking lookup', 'Observation', 'Draft / action plan'] },
            { title: 'Control and output', stations: ['Risk check', 'Approval gate', 'Answer / draft / stop'] },
        ],
        caption:
            'One route: from input, through generating the answer, reliability, and the agent layer, to the controlled decision. In the lab we will run it on one real request.',
    },

    guess: {
        eyebrow: 'Quick guess · before we open this up',
        title: 'You wrote: "Check what is happening with package 123456789, draft an update for the customer, and do not send without my approval." What happens behind the scenes?',
        subtitle: 'Choose the most accurate description. There is no grade here, there is one direction that describes what really happens.',
        invite: 'Before we run the route in the lab, try to guess how this request is handled behind the scenes.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'One prompt can travel a whole route: understanding, generation, grounding in a source, a task loop, control gates, and finally an output that can be an answer, a draft, an action, or a controlled stop. This is not one magic step, it is a path you can follow.',
        cta: 'Let us run the route in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can also choose another option and see how it sounds.',

        cards: {
            fullRoute: {
                title: 'The system passes through input, meaning, checks, tools, permissions, and output',
                desc: 'The request is not one instant answer, but a whole route of stages and checks.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. One prompt passes through understanding, generation, grounding, a task loop, and control, and only then an output is produced.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will run the five stages on a real request, and see where information enters and where the decision is made.',
                bridge: 'Not one answer, a whole route.',
            },
            oneAnswer: {
                title: 'The model just returns one answer',
                desc: 'You send a request, you get a ready answer, with no stages in between.',
                statusLabel: 'Common mistake',
                getsRight: 'It is true that from the outside you only see the answer at the end.',
                missesLabel: 'What it misses',
                misses: 'But between the request and the output runs a whole route: splitting, meaning, grounding in a source, checks, and control gates. The answer is only the end of the path.',
                bridge: 'The answer is the end, not the whole story.',
            },
            agentSends: {
                title: 'An agent always sends the message on its own',
                desc: 'Once there is a draft, the agent sends it to the customer by itself.',
                statusLabel: 'Not accurate',
                getsRight: 'It is understandable to think an agent just runs everything to the end.',
                missesLabel: 'What it misses',
                misses: 'But an external send passes through an approval gate. The prompt said "do not send without approval", so the route stops on a draft and waits.',
                bridge: 'An external send stops for approval.',
            },
            noChecks: {
                title: 'If there is a tracking number, no further checks are needed',
                desc: 'The id is enough, you can skip grounding and control.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that a tracking number opens the option of a real check against a source.',
                missesLabel: 'What it misses',
                misses: 'But even with an id, you still need to ground the answer in the source, not invent what is missing, and pass through an approval gate before an external action.',
                bridge: 'An id opens a check, it does not remove control.',
            },
        },
    },

    insight: {
        title: 'The key point of this chapter',
        lead: 'The answer is only the end. What matters is the route.',
        body: 'What came in, what was missing, what we used as a source, what was checked, and what was allowed to run. When you see the whole path, you can explain not only what AI answered, but why, and what it chose not to do.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"The output I got is all that happened. AI just answered."',
        rightLabel: 'How it really works',
        rightBody: 'The output is the end of a whole route. The same request passed through splitting, meaning, grounding in a source, checks, and an approval gate. Full Trace makes that path visible, without claiming to expose the model private reasoning.',
    },

    lock: {
        title: 'Check Your Understanding',
        question: 'The tool result: status delayed, estimated delivery unavailable. The user asked to "draft an update for the customer, and do not send without my approval." What should the system output?',
        options: [
            '"The package will arrive tomorrow", and send it to the customer.',
            'A draft that explains the package is delayed, with no invented date, and wait for approval before sending.',
            'Delete the package status so no error appears.',
            'Ignore the instruction and send anyway.',
        ],
        success:
            'The route shows both grounding and control: use the source, do not invent a missing arrival date, and respect the approval boundary. So the output is a grounded draft waiting for approval, not an immediate send.',
    },

    practical: {
        title: 'Practical takeaway',
        lead:
            'When you want AI work that is easy to trace, do not write "take care of it". Define the route:',
        uses: [
            'Goal: what exactly should happen.',
            'Data: the id or the critical detail, for example a tracking number.',
            'Source: which tool or source to work from.',
            'What not to assume: "If there is no arrival date in the source, do not guess."',
            'Approval boundary: "Do not send without my approval."',
            'Expected output: a short message, a draft, or an answer.',
            'Status note: "At the end, write what you checked, what you found, and what you did not do."',
        ],
        caveat:
            'Full Trace does not claim that AI is dangerous or that it must not act. It gives you a map: to see the path from a prompt to a controlled response, and to know where to ask for a source, a check, or approval.',
    },

    finalCta: {
        eyebrow: 'End of the route',
        title: 'You finished every station',
        body: 'Now you can explain the whole path: from a prompt to a controlled output, and from a response to a controlled agent action. The final exam sums up the whole course, from input to the responsible decision.',
        button: 'Continue to the final exam',
        note: 'Test your understanding across the full course.',
    },

    lab: fullTraceLab,
    quiz: fullTraceQuiz,
};
