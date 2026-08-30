// i18n/locales/en/behind-ai/chapter1.ts
// English Chapter 1 ("What really happens between the question and the answer").
// Shape source: ../../he/behind-ai/chapter1. contentLocale = 'en' (real translation).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.
// "Claude" and "ANTHROPIC_API_KEY" are kept literal. seed inputs are coupled to the
// English detection vocabulary (EN_VOCAB) in chapter-1/mockEngine.ts.

import type { Locale } from '@/i18n/config';
import { chapter1Visuals } from './chapter1Visuals';
import { chapter1Quiz } from './chapter1Quiz';

export const chapter1 = {
    contentLocale: 'en' as Locale,
    redesign: {
        summary: { title: 'Two layers to remember', points: ['Model path: text becomes tokens and numeric representations.', 'Representations become next-token scores, and Softmax turns them into probabilities.', 'Decoding selects a token, the token is appended, and generation repeats.', 'Product wrapper: the product may assemble input and handle output around the model.'] },
    },

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'What really happens between',
        titleHighlight: 'the question and the answer',
        ledeLead: 'Write one sentence. The Chat panel looks familiar, like any app. Beside it,',
        ledeHighlight: ' the Engine panel opens the path behind the answer',
        ledeRest: ': it presents an educational illustration of the route from text to the next token. For now, observe; we will open each mechanism later, step by step.',
        chips: [
            'Chat panel: the visible request and response',
            'Engine panel: an illustration of the internal path',
            'Later: we open every step in depth',
        ],
    },

    // Standalone mentor guidance before the Transparent Chat
    mentorGuide: {
        title: 'You see one answer. Behind it is a whole journey.',
        body: 'In the Transparent Chat, you will see how the same request changes step by step on its way to an answer. You do not need to remember every number or term yet. At each station, ask: what went in, what changed, and what came out?',
    },

    // M10: chapter 1 has no guess and no verdict moment, so it carries no F3 RESPOND and no
    // mentor portrait at all. What remains is the quiz response layer only, as text, on both outcomes.
    mentorRespond: {
        quizPass:
            'The answer you see is the end of a route, and you already know to ask what happened along the way. That is the same question that returns in every chapter from here, only with a different name for each station.',
        quizFail:
            'This chapter does not ask you to memorize terms. It asks you to see that there is a route between question and answer. Go back to the Transparent Chat, send one sentence, and follow a single station: what went into it, and what came out.',
    },

    // Transparent Chat Lab
    lab: {
        title: 'The Transparent Chat',
        eyebrow: 'Transparent Chat Lab',
        intro: 'The Chat panel shows the request and response. The Engine panel opens an illustration of the path between them.',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map (package anchor): same stations, now live.
        mapBridge: 'The same 14 stations from the map now operate on the request you submitted.',
        chatSubtitle: 'Chat Mode · conversation',
        agentSubtitle: 'Agent Mode · task',
        observationInstruction: 'Do not try to remember every number. At each station, ask: what entered, what changed, and what came out?',
        simulationDisclosure: 'This is a deterministic educational illustration of common language-model ideas, not a direct recording of a model\'s hidden computation.',
        inputAriaLabel: 'Message to analyze',
        sendAriaLabel: 'Submit request',
        activeRequestLabel: 'Selected request',
        visibleResponseLabel: 'Visible response',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Task System Preview',
        chatEngineSubtitle: 'Choosing a reply · key stations',
        agentEngineSubtitle: 'System around the model · conditional preview',
    },

    // Chapter insight
    insightIdea: {
        title: 'The idea of the chapter',
        body: 'The answer visible in chat is only the end of a path in which the product assembles input and the model turns tokens and representations into a response, one step at a time.',
    },
    // Chat seed inputs (default input + quick suggestions)
    // Note: these are demo inputs fed to the learning engine, coupled to the English
    // detection vocabulary (EN_VOCAB) in chapter-1/mockEngine.ts.
    seed: {
        defaultInput: "My package didn't arrive",
        suggestions: [
            "My package didn't arrive",
            'Where is my package?',
            'Check package 123456789',
            'Tell the customer the package was lost',
            'Just handle it',
        ],
    },

    quiz: chapter1Quiz,

    // Visuals sub-namespace
    visuals: chapter1Visuals,
};
