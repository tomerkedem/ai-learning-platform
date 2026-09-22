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
        hook: 'You wrote one request to schedule a meeting. What really happens behind the scenes, from the first word to the decision?',
        chipTry: 'Step through one complete route, stage by stage',
        chipCompare: 'See where information enters, where an error could enter, and where control is added',
    },

    // F3 RESPOND (M10): the chapter human response layer. The status stays
    // independent; this is only what the mentor says next, on both outcomes.
    mentorRespond: {
        guessCorrect:
            'You saw a route rather than a single event, and that is exactly what lets you ask where did this go wrong instead of why does AI get things wrong. Every station you studied in this course is one point you can now put your finger on.',
        guessWrong:
            'It is reasonable to think there is one step here, because from the outside you see a request and a result. What is hidden is what happened between them: a source, a check, and an approval boundary. It is worth going back up and asking how many decisions are needed before anything is produced.',
        quizPass:
            'You can explain not only what the system answered, but what it relied on and what it chose not to do. That is the difference between using AI and supervising it.',
        quizFail:
            'The route is long, so it is easy to lose a station. Go back to the lab, walk one route step by step, and watch two points in particular: where the information came from, and what stopped the send.',
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
                body: 'A prompt with a clear time range and a clear approval boundary is safer and easier to run than "take care of it". Same world, different route.',
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
        intro: 'We will not repeat each chapter in full. We will see the whole route in six groups, so you can follow the path at a glance.',
        groups: [
            { title: 'Product assembles input', stations: ['User request', 'System rules', 'Current context', 'Optional memory / RAG', 'Model input'] },
            { title: 'Model processes and generates', stations: ['Tokens and IDs', 'Embeddings', 'Attention and context window', 'Logits', 'Softmax', 'Decoding and loop'] },
            { title: 'Quality and grounding', stations: ['Hallucination risk', 'Optional grounding', 'Source result', 'Fallible self-check'] },
            { title: 'Agent loop', stations: ['Goal and task state', 'Tool selection', 'Authorization and policy', 'Bounded execution', 'State update'] },
            { title: 'Control and outcome', stations: ['Human approval', 'Simulated action', 'Observable verification', 'Honest status'] },
            { title: 'Later and separate', stations: ['Feedback', 'Example selection', 'Possible update', 'Held-out evaluation'] },
        ],
        caption:
            'One route: from input, through generating the answer, reliability, and the agent layer, to the controlled decision. In the lab we will run it on one real request.',
    },

    guess: {
        eyebrow: 'Quick guess · before we open this up',
        title: 'You wrote: "Arrange a 30-minute project planning meeting tomorrow afternoon, and draft an invitation, but do not send it without my approval." What happens behind the scenes?',
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
                title: 'An agent always sends the invitation on its own',
                desc: 'Once there is a draft, the agent sends it to the participants by itself.',
                statusLabel: 'Not accurate',
                getsRight: 'It is understandable to think an agent just runs everything to the end.',
                missesLabel: 'What it misses',
                misses: 'But an external send passes through an approval gate. The prompt said "do not send without approval", so the route stops on a draft and waits.',
                bridge: 'An external send stops for approval.',
            },
            noChecks: {
                title: 'If the participants are already known, no further checks are needed',
                desc: 'The list is enough, you can skip grounding and control.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that a known participant list makes the draft easier to prepare.',
                missesLabel: 'What it misses',
                misses: 'But even with the participants known, you still need to ground the time in the source, not invent what is missing, and pass through an approval gate before an external action.',
                bridge: 'Known information opens a check, it does not remove control.',
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
        question: 'The tool result: a free slot found at 15:00 to 15:30. The user asked to "draft an invitation for the team, and do not send without my approval." What should the system output?',
        options: [
            '"The meeting is scheduled and confirmed", and send the invitation right away.',
            'An invitation draft for 15:00 to 15:30 based on the calendar result, with no invented time, and wait for approval before sending.',
            'Ignore the calendar result and assume a convenient time on its own.',
            'Ignore the instruction and send anyway.',
        ],
        success:
            'The route shows both grounding and control: use the calendar result, do not invent a time, and respect the approval boundary. So the output is a grounded invitation draft waiting for approval, not an immediate send.',
    },

    practical: {
        title: 'Practical takeaway',
        lead:
            'When you want AI work that is easy to trace, do not write "take care of it". Define the route:',
        uses: [
            'Goal: what exactly should happen.',
            'Data: the id or the critical detail, for example the time range and participants.',
            'Source: which tool or source to work from.',
            'What not to assume: "If there is no free slot in the source, do not guess."',
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
