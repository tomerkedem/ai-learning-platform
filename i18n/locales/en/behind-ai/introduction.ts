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
        prompt: "My package didn't arrive. What should I do?",
        inputPlaceholder: 'Type a message...',
        answerRole: 'The answer',
        answer: "I'm sorry to hear that. It's worth checking the shipping status to see if there's an update from the logistics center.",
        outsideLine: 'From the outside it looks like two steps: you wrote a request and got an answer.',
        curiosityLine: 'But the real question is what happened in between.',
        gateLead: "Now let's open up what happened between the request and the answer.",
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
        question: 'Which explanation is closest to what happens in between?',
        hint: 'Pick the explanation that feels closest to reality. There is no score here, just a choice of a mental model.',
        correctTitle: 'The closest explanation',
        correctLead: 'This is the closest learning map, and it is still simplified.',
        correctBody: 'The model works on tokens and numeric representations, computes context, then chooses or samples the next token using the distribution and decoding rules.',
        correctBridge: "That is exactly what we'll open up now, in the station map just below.",
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
        subtitle: 'A learning map of an autoregressive language model, from assembled input to generated response.',
        hint: 'Click a station to peek inside: a short explanation and an example.',
    },

    // ── The honesty note below the map ──
    truthNote:
        'This is a simplified learning map of an autoregressive language model, not a complete trace or a universal architecture for every AI product. Retrieval, memory, tools, self-checks, and guardrails are optional system capabilities, not required inner layers of every answer.',


    // ── Agent separation: the card copy and the live demo (AgentLoop) ──
    agent: {
        // Forward-looking framing (the card now appears before the map) + transition to the map.
        intro: 'A look ahead: what changes when a Chat that answers becomes an Agent that can act?',
        // Card copy, switches with the Chat/Agent toggle. "Agent" stays in English.
        card: {
            chat: {
                eyebrow: 'Basic route',
                title: 'Basic Chat path: request, model, response',
                body: 'In this simplified example, the request goes to the model and it returns a response without taking an external action.',
                closing: 'Some Chat products add retrieval, memory, tools, filtering, or orchestration around the model.',
                note: 'This is a simplified path, not a definition of every Chat product.',
            },
            agent: {
                eyebrow: 'An extra layer',
                title: 'An Agent is not a smarter answer. It is a full action loop',
                body: 'In Agent mode the model does not just answer. It can decide, choose a tool, take an action, check the result, and then return an answer.',
                closing: 'An Agent does not just predict text. It wraps the model in a system that decides whether to act, which tool to use, and what is allowed.',
                note: 'This is not an inner layer of the Transformer, but a system around the model.',
            },
        },
        // The live demo. Mode labels (Chat/Agent/LLM) stay as product terms. Loop stages by id.
        demo: {
            layerLabel: 'Agent layer · a system around the model',
            layerLabelChat: 'Basic path · input, model, answer',
            modeChat: 'Chat',
            modeAgent: 'Agent',
            coreLabel: 'LLM',
            coreText: 'The model produces text and proposed actions',
            idleCore: 'Ready',
            run: 'Run a loop',
            running: 'Running...',
            replay: 'Run again',
            hintPrompt: 'Run a loop to watch the engine work, step by step.',
            input: { label: 'Request', text: 'Summarize the email I pasted and send a reply' },
            output: { label: 'Answer', agent: 'Summary ready, waiting for approval to send', chat: 'Here is the summary. I cannot send it for you.' },
            consoleTitle: 'Decision console',
            consoleLabels: { intent: 'Intent', tool: 'Tool', risk: 'Risk', next: 'Next step' },
            consoleEmpty: 'Waiting',
            chatHint: 'Short route: input, model, answer.',
            agentHint: 'Full loop: interpret, choose, risk, act.',
            agentStages: {
                in: { label: 'Input', hint: 'Your request enters the system, and the round starts here.' },
                task: { label: 'Understands the task', hint: 'What is the real goal of the request?', intent: 'Summarize and send a reply' },
                tool: { label: 'Chooses a tool', hint: 'Which tool can help with the task?', tool: 'Email reader' },
                risk: { label: 'Requests approval', hint: 'An external action pauses for approval when needed.' },
                act: { label: 'Runs the action', hint: 'Runs the tool and gets a result.', next: 'Running the tool' },
                answer: { label: 'Returns an answer', hint: 'Summarizes, and sometimes asks for approval before sending.', next: 'Waiting for approval' },
            },
            chatStages: {
                in: { label: 'Input', hint: 'Your request comes in.' },
                model: { label: 'Model', hint: 'The model produces a text answer.' },
                out: { label: 'Answer', hint: 'One piece of text comes back to you, with no action in the world.' },
            },
        },
    },

    // ── Call to action (the link target href stays in the view layer) ──
    scopeSentence: 'During the course, we will follow the path from the request through response generation to reliability, improvement, and controlled action with tools.',

    cta: {
        eyebrow: 'Next step',
        title: 'Now we begin with the first step',
        body: 'You have seen the big picture. You do not need to remember every station yet. In Chapter 1, we will open the transparent chat together.',
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

    // ── Mentor lines (decorative microcopy; the pose lives in the view layer) ──
    mentor: {
        hero: "Let's lift the lid together",
        roadmap: 'The engine map is opening',
        cta: 'This is where we begin',
    },

    // ── Sub-namespace: the map of main stations ──
    roadmap: introRoadmap,
};
