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

    // Hero
    hero: {
        badge: 'Behind the Scenes · 01',
        titleLead: 'What really happens between',
        titleHighlight: 'the question and the answer',
        ledeLead: 'Write one sentence. On the right, the chat looks ordinary, just like any app. On the left,',
        ledeHighlight: ' the path behind the answer',
        ledeRest: ': the engine shows how it reads the sentence and reaches a decision. For now just watch, you do not need to understand every number. We will open up the depth later, step by step.',
        chips: [
            'On the right: the answer you see',
            'On the left: the path behind the answer',
            'Later: we open every step in depth',
        ],
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        peek: 'A first peek inside the engine',
        holographic: 'Here the engine opens from inside',
    },

    // Coach card (first-run guidance toward the lab)
    coach: {
        start: 'Start here: ',
        body: 'Write your own sentence in the lab below, or pick a quick example.',
        closeAria: 'Close the guide',
    },

    // Transparent Chat Lab
    lab: {
        title: 'The Transparent Chat',
        eyebrow: 'Transparent Chat Lab',
        intro: 'Here you see that there is a path behind the answer: on the right the answer as usual, and on the left the path that led to it.',
        panelTitle: 'Transparent Chat Lab',
        // Recognition bridge to the intro map (package anchor): same stations, now live.
        mapBridge: 'These are the exact stations from the map - now live, on your package request.',
        chatSubtitle: 'Chat Mode · conversation',
        agentSubtitle: 'Agent Mode · task',
        focusLead: 'Look first at ',
        focusHighlight: 'the decision',
        focusRest: ', not at every number. The engine on the left shows that there is a whole path between the question and the answer. The full details will open up later in the course.',
        liveNote: 'The chat reply is written by a real model (Claude) in real time, word by word - exactly the autoregressive loop. The board on the right stays an educational illustration: the API does not expose the model internal probabilities.',
        demoNote: 'Demo mode: the chat replies are scripted and fixed. Setting ANTHROPIC_API_KEY on the server activates a real model that writes the reply live, word by word.',
    },

    // Engine panel titles (GlassEnginePanel)
    panels: {
        answerEngineTitle: 'Answer Engine',
        actionEngineTitle: 'Action Decision Engine',
        chatEngineSubtitle: 'Choosing a reply · key stations',
        agentEngineSubtitle: 'Action decision · key stations',
    },

    // Chapter insight
    insightIdea: {
        title: 'The idea of the chapter',
        body: 'A chat answer is only the visible tip of a hidden process. Behind every answer a path runs, and that path can be opened step by step. That is exactly what this course will do: it will teach the path behind the answer, gradually. You do not yet need to understand every mechanism - it is enough to understand that the path exists, and that it can be opened.',
    },

    // Depth-layer gate (progressive disclosure) + layer intro
    deep: {
        toggleOpen: 'Close the depth layer',
        toggleClosed: 'Open the full engine',
        hint: 'Here the advanced tool opens: a live read head that shows how the engine changes its mind as it reads. You can explore at your own pace.',
        intro1: 'See a depth layer: from here it gets more technical. Before you is a live lab that reveals another angle of the same path. Explore it at your own pace.',
        intro2Lead: 'In ',
        intro2Mid: ' the system picks a reply. In ',
        intro2Tail: ' it checks what the right next step is - answer, use a tool, or stop and ask for information. Switch between them with the toggle at the top of the chat.',
    },

    // The four lab headers (eyebrow + title)
    labs: {
        readHead: { eyebrow: 'Live reading', title: 'The engine changes its mind while reading' },
        confidence: { eyebrow: 'When to trust, when to stop', title: 'The Confidence Dial' },
        causality: { eyebrow: 'Causality', title: 'Which word decided' },
        fork: { eyebrow: 'Fork', title: 'Same sentence, two engines' },
    },

    // Summary (two insights inside the depth layer)
    summary: {
        understandTitle: 'What you understand now',
        understandBody: 'The AI engine does not "know" the answer - it ranks options, and decides by the gap between them. When the gap is large it answers with confidence; when the gap is small, the right step is to stop and ask, not to guess. You saw this yourself: the read head showed the leader changing while reading, and a single word can tip the whole decision.',
        ruleTitle: 'The practical rule',
        ruleBody: 'Trust the engine when the gap is large and the risk is low. When the gap is small or the action is sensitive - stopping and asking for clarification are not a failure, they are the responsible step. This is exactly where the link between probability and responsibility begins.',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'Before the quiz: three points worth remembering',
        point1Lead: 'A path, not magic.',
        point1Body: ' Behind every answer a path runs: the engine breaks the sentence into tokens, ranks options by probability, checks how confident it is, and only then decides. The estimate is built while reading, and each extra word can change the leading option.',
        point2Lead: 'Two different questions.',
        point2BeforeChat: ' In ',
        point2AfterChat: ' the engine asks "What is the answer?". In ',
        point2AfterAgent: ' it asks "What is the right next step?" - answer, use a tool, or stop and ask for information.',
        point3Lead: 'Confidence meets responsibility.',
        point3Body: ' Confidence is measured by the gap between the leading option and the next one. A large gap and low risk, you can let the engine answer. A small gap or a sensitive action, the responsible step is to stop and ask, not to guess.',
        footnoteLead: 'Want to see this path live? Open the ',
        footnoteHighlight: 'full engine',
        footnoteTail: ' above and play with the read head and the "which word decided" lab.',
    },

    lock: {
        eyebrow: 'Understanding lock',
        question: 'The engine shows a small gap between the top option and the next. What is the right move?',
        answerLabel: 'Answer confidently',
        askLabel: 'Stop and ask',
        correctBody: 'You locked it in. A small gap means uncertainty, and the responsible move is to stop and ask, not to guess.',
        wrongBody: 'Almost. A small gap actually signals uncertainty. The responsible move here is to stop and ask.',
        retry: 'Try again',
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

    // Visuals and labs sub-namespace
    visuals: chapter1Visuals,
};
