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
        correctTitle: 'Exactly right!',
        correctLead: 'This is the more accurate picture.',
        correctBody: 'The model works on tokens, computes context, chooses the next token, and then repeats the process.',
        correctBridge: "That is exactly what we'll open up now, in the station map just below.",
        wrongLead: 'This is a common misconception, but it is not what actually happens.',
        retry: 'Choose again',
        revealCorrect: 'Show the accurate explanation',

        /** Text of the four hypotheses, by id. Structure (cue, correct) lives in the view layer. */
        hypotheses: {
            read: {
                title: 'Direct reading',
                concept: 'The model reads the sentence like a person and assembles an answer.',
                whyTempting: 'That is how we read, so it is natural to assume the model does it too.',
                whyWrong: 'The model does not read letters or words like a person. It works on tokens and numbers.',
            },
            rail: {
                title: 'A fixed track',
                concept: 'The model always goes through the same fixed number of steps, like an assembly line.',
                whyTempting: 'It is appealing to think of the model as a tidy assembly line with a known number of steps.',
                whyWrong: 'There is no fixed number of steps. Each pass runs a huge number of computations, and it varies with the model and the context.',
            },
            tokens: {
                title: 'A token engine',
                concept: 'The model breaks the text into tokens, computes context, and produces an answer token after token.',
            },
            archive: {
                title: 'Retrieval from a database',
                concept: 'The model pulls a ready-made answer from a database.',
                whyTempting: 'The answers sound finished and polished, as if they were pulled from a database.',
                whyWrong: 'There is no database of ready-made answers. The model produces the answer token after token in real time.',
            },
        },
    },

    // ── Station map heading and the open hint ──
    roadmapHeading: {
        eyebrow: 'Opening the engine',
        title: 'A map of the main stations on the way from text to answer',
        subtitle: 'Beneath the two steps you see from the outside, a full route is running. These are its main stations, from request to answer.',
        hint: 'Click a station to peek inside: a short explanation and an example.',
    },

    // ── The honesty note below the map ──
    truthNote:
        'This is a learning map, not a full snapshot of every computation. In a real model, many operations happen in parallel inside each station, and the exact number varies with the model, the context length, and how it is run.',

    // ── The fixed labels for the three questions in a station expansion ──
    stationDetailLabels: {
        whatHappens: 'What happens here?',
        whyItMatters: 'Why does it matter?',
        whatNext: 'What will we see next?',
    },

    // ── Agent separation: the card copy and the live demo (AgentLoop) ──
    agent: {
        // Forward-looking framing (the card now appears before the map) + transition to the map.
        intro: 'Before we open the model in depth, let us take a moment to see the difference between Chat and Agent.',
        transition: 'Now we open the middle box: what really happens inside the model.',
        // Card copy, switches with the Chat/Agent toggle. "Agent" stays in English.
        card: {
            chat: {
                eyebrow: 'Basic route',
                title: 'Chat is input, model, and one answer',
                body: 'In Chat mode the model receives a request and returns one answer. No tools, no action in the world - just input, model, and answer.',
                closing: 'Chat stops the moment the answer is ready. It does not run tools and does not change anything outside the conversation.',
                note: 'This is exactly the Transformer layer: text in, text out.',
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
            hintPrompt: 'Hover or pick a station to see what happens there, or run a loop.',
            input: { label: 'Request', text: 'Summarize the email and send a reply' },
            output: { label: 'Answer', agent: 'Summary ready, waiting for approval to send', chat: 'Here is the summary you asked for' },
            consoleTitle: 'Decision console',
            consoleLabels: { intent: 'Intent', tool: 'Tool', risk: 'Risk', next: 'Next step' },
            consoleEmpty: 'Waiting',
            chatHint: 'Short route: input, model, answer.',
            agentHint: 'Full loop: interpret, choose, risk, act.',
            agentStages: {
                in: { label: 'Input', hint: 'Your request enters the system, and the round starts here.' },
                task: { label: 'Understands the task', hint: 'What is the real goal of the request?', intent: 'Summarize and send a reply' },
                tool: { label: 'Chooses a tool', hint: 'Which tool can help with the task?', tool: 'Email reader' },
                risk: { label: 'Checks risk', hint: 'Is the action sensitive or does it need approval?', risk: 'Medium: sending outside the system' },
                act: { label: 'Runs the action', hint: 'Runs the tool and gets a result (Observation).', next: 'Running the tool' },
                answer: { label: 'Returns an answer', hint: 'Summarizes, and sometimes asks for approval before sending.', next: 'Waiting for approval' },
            },
            chatStages: {
                in: { label: 'Input', hint: 'Your request comes in.' },
                model: { label: 'Model', hint: 'The model produces a text answer.' },
                out: { label: 'Answer', hint: 'One piece of text comes back to you, with no action in the world.' },
            },
        },
    },

    // ── Course structure: 19 chapters, 6 systems (CourseSystems) ──
    systems: {
        heading: {
            eyebrow: 'The journey ahead',
            title: '19 chapters that open the engine, step by step',
            summary: '19 chapters, 6 systems, one engine that opens up gradually',
            subtitle: 'This is not a chapter catalog. It is a journey: each act opens a different part of the engine, until the picture comes together.',
        },
        labels: {
            purpose: 'What will you discover?',
            stations: 'Related stations on the map',
            chapters: 'Which chapters does this lead to?',
            open: 'Open the gate',
            startHere: 'Start here',
        },
        // The six systems, by id. Chapter numbers (n) and display order stay in the view layer,
        // and chapter names (chapters) are a list of labels in the system's fixed order.
        items: {
            outside: {
                title: 'The outside view: transparent chat and input',
                range: 'Chapters 1-2',
                teaser: 'Behind "request and answer" hides a full route. This is where you start to see it.',
                purpose: 'To break the illusion that chat is just request and answer, and to see what really goes into the model.',
                stationChips: ['The request comes in', 'Context window'],
                chapters: ['The Transparent Chat: The Path Behind the Answer', 'Model Input: What Really Enters the Model'],
            },
            representations: {
                title: 'From text to tokens and representations',
                range: 'Chapters 3-7',
                teaser: 'How does text become something you can compute on, and turn into meaning? This is where it happens.',
                purpose: 'To understand how text becomes tokens, numeric representations, meaning, and the context the model works with.',
                stationChips: ['Breaking into tokens', 'Embedding', 'Attention'],
                chapters: ['Tokenization: When Text Breaks Into Tokens', 'Embeddings: From a Meaningless Number to Meaning', 'Semantic Space: The Model\'s Map of Meaning', 'Attention: Who Matters Now', 'Context Window: What the Model Really Sees Now'],
            },
            generation: {
                title: 'How an answer is built',
                range: 'Chapters 8-10',
                teaser: 'Once there is a representation, how is each word of the answer chosen? This is where it happens.',
                purpose: 'To understand how scores turn into probabilities, how the next token is chosen, and how a full answer is built in a loop.',
                stationChips: ['Logits', 'Softmax', 'Decoding', 'Looping until an answer'],
                chapters: ['Logits & Softmax: From Scores to Probabilities', 'Decoding: Choosing the Next Token', 'Generation Loop: How an Answer Is Built to the End'],
            },
            reliability: {
                title: 'Reliability, sources, and checking',
                range: 'Chapters 11-13',
                teaser: 'Why can an answer sound confident and still be wrong, and what helps ground it?',
                purpose: 'To understand why confidence is not correctness, when an external source is needed, and how a self-check improves an answer.',
                stationChips: ['A grounded answer', 'RAG', 'Self-check'],
                chapters: ['Hallucinations: Why a Confident Answer Can Be Wrong', 'RAG & Grounding: How to Connect AI to Sources', 'Self-Check: Checking While Answering'],
            },
            learning: {
                title: 'How a model learns and improves',
                range: 'Chapters 14-16',
                teaser: 'How does a model improve from a mistake, and what does it really remember about you?',
                purpose: 'To understand how a model learns from a mistake, the difference between memorizing and understanding, and what really changes when you correct it.',
                stationChips: ['Learning from a mistake', 'Memorizing vs generalizing'],
                chapters: ['Learning from Mistakes: How a Model Improves from an Error', 'Evaluation & Generalization: Memorized or Understood', 'Does AI Learn From Me: Does It Learn From You?'],
            },
            agent: {
                title: 'From Chat to Agent',
                range: 'Chapters 17-19',
                teaser: 'What happens when the model not only answers, but also acts?',
                purpose: 'To understand what changes when a system around the model chooses a tool, checks risk, asks for approval, or stops.',
                stationChips: ['A layer around the engine', 'Guardrails'],
                chapters: ['Chat to Agent: When a Question Becomes a Task', 'Guardrails: Risk, Permissions, Approval, and Stopping', 'Full Trace: One Prompt, Every Station'],
            },
        },
    },

    // ── Call to action (the link target href stays in the view layer) ──
    cta: {
        eyebrow: 'Next step',
        title: 'Next step: the transparent chat',
        body: 'Write a simple request, and watch how the engine begins to interpret, rank, and decide.',
        button: 'Start the transparent chat',
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
