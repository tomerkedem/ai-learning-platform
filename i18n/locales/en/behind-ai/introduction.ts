// i18n/locales/en/behind-ai/introduction.ts
// English Introduction ("Behind the Scenes of AI"). Shape source: ../../he/behind-ai/introduction.
// contentLocale = 'en' (real translation). Only user-facing text is translated; ids and structural
// keys are unchanged. "AI" is kept as the product term; technical terms (Token IDs, Embedding,
// Attention, Transformer, Logits, Softmax, Decoding) stay in English by design. The station map
// lives in the sibling file introRoadmap.ts. No em dash (U+2014), no en dash (U+2013).

import type { Locale } from '@/i18n/config';
import { introRoadmap } from './introRoadmap';

export const introduction = {
    contentLocale: 'en' as Locale,

    // The human response layer of the guess verdict card. The status (check or bulb,
    // title, explanation) stays an independent layer; this is only what is said after
    // it, in the same shape on both outcomes. Specific to the introduction by design.
    mentorRespond: {
        guessCorrect:
            'What brought you here is the assumption that the answer is built rather than found. That assumption is not obvious, because from the outside the answer arrives whole and polished, with no sign of the process behind it.',
        guessWrong:
            'That guess did not come from confusion. All four options sound reasonable from the outside, because from the outside you only see a request and an answer. What helps now is not to look for the right explanation but to ask what happens to the text itself in between.',
    },

    // ── Hero ──
    hero: {
        badge: 'The Transparent Lab · Behind the Scenes',
        titleLead: 'What really happens between the message you send',
        titleAccent: 'and the answer you receive?',
        intro: 'A look at what happens the moment you send a message to a chat.',
    },

    // ── The chat example and the gate into the engine (EngineReveal + EngineGate) ──
    chat: {
        promptRole: 'Your request',
        prompt: "I'm having friends over for dinner. What could I make?",
        inputPlaceholder: 'Type a message...',
        answerRole: 'The answer',
        answer: 'You could make pasta with a simple salad. If you tell me what they like, I can suggest a more specific menu.',
        outsideLine: 'From the outside it looks like two steps: you wrote a request and got an answer.',
        curiosityLine: 'But the real question is what happened in between.',
        gateLead: 'Now we open the box and see the route from the inside.',
        revealLabel: 'Open the engine between the question and the answer',
        closeLabel: 'Close the view',
        revealedLabel: 'This is what the engine looks like from the inside',
        bridge: 'Beneath the two steps you see from the outside, a full route is running. These are its main stations.',
        downCue: 'The full map is right below',
    },

    // ── Four abstract super-stations shown when the engine gate opens ──
    engineTeaser: ['Tokens', 'Numbers', 'Context', 'Choice'],

    // ── Quick guess: four competing explanations (HypothesisGuess) ──
    quickGuess: {
        eyebrow: 'Quick guess · Four competing explanations',
        question: 'Back to our chat. What do you think the LLM does between the request and the answer?',
        hint: 'Pick the explanation that feels closest to reality. There is no score here, just a choice of a mental model.',
        correctTitle: 'The closest explanation',
        correctLead: 'This is the closest learning map, and it is still simplified.',
        correctBody: 'The model works on tokens and numeric representations, computes context, then chooses or samples the next token using the distribution and decoding rules.',
        correctBridge: '',
        wrongLead: 'This is a common misconception, but it is not what actually happens.',
        retry: 'Choose again',
        revealCorrect: 'Show the accurate explanation',

        /** Text of the four hypotheses, by id. Structure (cue, correct) lives in the view layer. */
        hypotheses: {
            read: {
                title: 'Direct reading',
                concept: 'The model reads the sentence like a person and assembles an answer.',
                status: 'Tempting metaphor, but incomplete',
                whyTempting: 'That is how we read, so it is natural to assume the model does it too.',
                whyWrong: 'The model does not read letters or words like a person. It works on tokens and numbers.',
            },
            rail: {
                title: 'A fixed track',
                concept: 'The model always goes through the same fixed number of steps, like an assembly line.',
                status: 'Partially correct',
                whyTempting: 'It is appealing to think of the model as a tidy assembly line with a known number of steps.',
                whyWrong: 'The architecture has a repeated computational structure, but the generated content and product flow are not one fixed, prewritten route.',
            },
            tokens: {
                title: 'A token engine',
                concept: 'The model breaks the text into tokens, computes context, and produces an answer token after token.',
                status: 'Closest explanation',
                whyTempting: 'It captures the central idea: the response is generated progressively from tokens and context.',
            },
            archive: {
                title: 'Retrieval from a database',
                concept: 'The model pulls a ready-made answer from a database.',
                status: 'Wrong for the base-model explanation',
                whyTempting: 'The answers sound finished and polished, as if they were pulled from a database.',
                whyWrong: 'The base model generally does not retrieve one complete prepared answer. It generates the response progressively, although products may add external retrieval.',
            },
        },
    },

    // ── Station map heading and the open hint ──
    roadmapHeading: {
        eyebrow: '14 stations inside response generation',
        title: 'A map of the main stations on the way from text to answer',
        subtitle: 'A learning map of an autoregressive language model, from assembled input to generated response. You do not need to remember all 14 stations now. This is the map of the journey we will take together, step by step.',
        hint: 'Click a station to peek inside: a short explanation and an example.',
    },

    // ── The honesty note below the map ──
    truthNote:
        'This is a simplified learning map of an autoregressive language model, not a complete trace or a universal architecture for every AI product. Retrieval, memory, tools, self-checks, and guardrails are optional system capabilities, not required inner layers of every answer.',


    // ── Agent separation: the card copy and the live demo (AgentLoop) ──
    agent: {
        // Forward-looking framing (the card now appears before the map) + transition to the map.
        intro: 'A look ahead: what changes when a Chat that answers becomes an Agent that can act?',
        // Card copy, switches with the Chat/Agent toggle. narration = the spoken story of the mode.
        card: {
            chat: {
                eyebrow: 'Basic route',
                title: 'Chat: suggests options, without checking or booking',
                body: 'The request goes to the model, which returns text. It cannot see what is free tonight.',
                closing: 'Chat can help you think about tonight, but no table is booked yet.',
                narration: 'Same request to Chat: find me a place for dinner tonight for two. Chat can suggest options, but it cannot check live availability or book a table.',
            },
            agent: {
                eyebrow: 'Same request',
                title: 'Same request. This time the system can move it forward.',
                body: 'It checks what is free with tools, and stops for your approval before booking.',
                closing: 'The table was booked only after your approval.',
                narration: 'Same request, but this time the system can move it forward. It understands the goal, uses tools to search and check availability, and finds a free table for two at 7:30 PM. Before booking, it asks for your approval of that one booking. Only after you approve does it book the table and return a confirmation.',
            },
        },
        // The live demo. Mode labels (Chat/Agent/LLM) stay as product terms. Loop stages by id.
        demo: {
            modeChat: 'Chat',
            modeAgent: 'Agent',
            coreLabel: 'LLM',
            idleCore: 'Ready',
            run: 'Run a loop',
            running: 'Running...',
            replay: 'Run again',
            hintPrompt: 'Run a loop to watch the engine work, step by step.',
            input: { label: 'Request', text: 'Find me a place for dinner tonight for two, check availability, and book it only after I approve' },
            output: { label: 'Answer', agent: 'Table for 2 booked for 7:30 PM, after approval', chat: 'I can suggest options, but I cannot check live availability or book a table.' },
            agentStages: {
                in: { label: 'Input', hint: 'Your request enters the system, and the round starts here.' },
                task: { label: 'Understands the goal', hint: 'Dinner tonight for two, and booking only with approval.', intent: 'Dinner for two, tonight' },
                tool: { label: 'Uses tools', hint: 'Search and availability: live information the model alone cannot see.', tool: 'Search + Availability' },
                act: { label: 'Gets a result', hint: 'A free table is found. Everything is ready to book, but nothing is booked yet.', next: 'Free tonight at 7:30 PM' },
                risk: { label: 'Asks approval', hint: 'The external action waits until you approve it.', risk: 'Book a table for 2 at 7:30 PM?' },
                answer: { label: 'Books the table', hint: 'Only after approval, the Booking tool saves the table and returns a confirmation.', next: 'Table booked for 7:30 PM' },
            },
            chatStages: {
                in: { label: 'Input', hint: 'Your request comes in.' },
                model: { label: 'Model', hint: 'The model produces a text answer.' },
                out: { label: 'Answer', hint: 'One piece of text comes back, with no live check and no action in the world.' },
            },
        },
    },

    // ── Call to action (the link target href stays in the view layer) ──
    scopeSentence: 'During the course, we will follow the path from the request through response generation to reliability, improvement, and controlled action with tools.',

    cta: {
        eyebrow: 'Next step',
        title: 'Now we begin with the first step',
        body: 'You have seen the big picture. In Chapter 1, we will open the transparent chat together.',
        button: 'Start Chapter 1',
    },

    // ── Read-aloud control (Web Speech API). Labels only, user-triggered. ──
    readAloud: {
        dock: 'Guided listening',
        play: 'Read aloud',
        pause: 'Pause',
        resume: 'Resume',
        stop: 'Stop',
        prev: 'Previous segment',
        next: 'Next segment',
        voice: 'Voice',
        browserDefault: 'Browser default voice',
        settings: 'Read-aloud options',
        sections: 'Sections',
        nowReading: 'Now reading',
        unsupported: 'Read-aloud is not available in this browser.',
        scope: 'Scope',
        scopeShort: 'Short',
        scopeRegular: 'Regular',
        scopeFull: 'Full',
        speed: 'Speed',
    },

    // ── The AI map: the automatic journey before opening the engine. beats[i] is conceptual moment i (both captions and read-aloud) ──
    landscape: {
        intro: [
            'AI is a broad name for a whole world of technologies and approaches, not a single thing.',
            'Inside it, you will meet terms like Machine Learning, Neural Networks, Deep Learning, Generative AI, and LLM.',
            'Before we open the LLM and see how it works, let us put things in order and see how these terms connect.',
        ],
        readAloud: 'Read aloud',
        eyebrow: 'Before we open the engine: where does the LLM sit?',
        regionLabel: 'A short map of the AI world',
        progressLabel: 'Progress through the AI map',
        navLabel: 'Navigate the AI journey',
        pauseLabel: 'Pause the automatic walkthrough',
        resumeLabel: 'Resume the automatic walkthrough',
        paused: 'Paused',
        next: 'Next in {time}',
        seconds: {
            zero: '{n} seconds', one: '1 second', two: '{n} seconds',
            few: '{n} seconds', many: '{n} seconds', other: '{n} seconds',
        },
        waitingNarration: 'Waiting for the narration to finish',
        nodes: ['AI', 'Machine Learning', 'Neural Networks', 'Deep Learning', 'Generative AI', 'LLM', 'Agent', 'End'],
        beats: [
            { t: 'Artificial Intelligence (AI)', b: 'The broad field: systems that perform tasks that look intelligent to us.' },
            { t: 'Machine Learning', b: 'Just one approach among several: the system learns patterns from examples.' },
            { t: 'Neural Networks', b: 'A family of Machine Learning models that learn patterns through layers of computation.' },
            { t: 'Deep Learning', b: 'This is the same neural network, just with many layers. It is not another stage after it.' },
            { t: 'Now a different question: what does the system do?', b: 'Some systems recognize or predict, and others create.' },
            { t: 'Generative AI', b: 'Systems designed to create new content: text, images, audio, and more. It is not a step above deep learning.' },
            { t: 'Which path is the chat experience?', b: 'You can tap each path and check what kind of content our chat creates.' },
            { t: 'LLM - Large Language Model', b: 'A neural network that learned patterns in language and can work with context and generate text. This is the kind of model at the heart of our chat.' },
            { t: 'An Agent is not a bigger LLM.', b: 'An Agent is a system built around a model: it works toward a goal and sometimes uses tools and their results.' },
            { t: 'Now we know where the LLM sits.', b: 'Before we open it, what do you think happens inside?' },
        ],
        agentNote: 'Agentic AI is a broad term for AI systems that work toward goals with some degree of independence, and not everyone defines it in exactly the same way.',
        textFocus: { t: 'Our chat creates text', b: 'So we continue along the text path, and from there we reach the LLM.' },
        hintImage: 'Images are created here. In the chat, you get words.',
        hintAudio: 'Audio is created here. In the chat, you get words.',
        tileText: 'Text',
        tileImage: 'Image',
        tileAudio: 'Audio',
        llmSub: 'Language model',
        manyLayers: 'Many layers',
        recognize: 'Recognizes or predicts',
        create: 'Creates',
        cat: 'Cat',
        goal: 'Goal',
        tools: 'Tools',
        results: 'Results',
        openLlm: 'Take a quick guess',
        replay: 'Watch again from the start',
    },

    // ── Sub-namespace: the map of main stations ──
    roadmap: introRoadmap,
};
