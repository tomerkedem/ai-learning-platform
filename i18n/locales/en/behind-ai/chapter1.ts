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
        hero: { badge: 'Behind the Scenes · 01', title: 'The transparent chat: the path behind the answer', lede: 'A chat shows a request and a response. Between them is a hidden product and model path, and a failure can begin in more than one place.' },
        mentor: 'We see the answer. To understand it, inspect the path. Product and model are different layers, and you do not need every mechanism yet.',
        interaction: { title: 'What to watch in this experiment', instruction: 'Change the request and watch what may change: the input assembled by the product, the model output, or the product decision.', examplesLabel: 'Request examples', selectedLabel: 'Selected request', resultLabel: 'Visible result', visibleLabel: 'What the chat shows', evidenceLabel: 'What the evidence supports' },
        examples: [{ request: 'Where is my package?', response: 'I need an order number to check.', evidence: 'The request is partly clear, but required information is missing before the model can give a specific answer.' }, { request: 'Check order 123456', response: 'I could not retrieve the delivery status right now.', evidence: 'The same visible result could come from missing external data, a failed tool, or missing permission. The result alone does not prove the cause.' }, { request: 'Handle it', response: 'What would you like me to handle?', evidence: 'Ambiguity in the request is a possible input problem, not necessarily a model generation error.' }],
        path: { title: 'The high level path', explanation: 'Select a layer to read its role. Text labels, not only colors and arrows, describe the order.', semanticLabel: 'User request, product input assembly, model, product output handling, visible response', requestTitle: '1. User request', requestBody: 'This is the text the user sees and sends.', productInputTitle: '2. Product assembles input', productInputBody: 'The product may add instructions or selected context. The visible message is not necessarily the full model input.', modelTitle: '3. Model', modelBody: 'The model processes the current input and generates output. It is part of the product, not the whole product.', productOutputTitle: '4. Product handles output', productOutputBody: 'The product may format, check, retrieve, use a tool, or apply policy. These capabilities are optional.', responseTitle: '5. Visible response', responseBody: 'This is the endpoint the learner sees in the chat.', envelope: 'We can see that the product assembles something before the model receives it. Chapter 2 will open that envelope.' },
        failures: { title: 'One result, several possible failure sources', intro: 'A weak answer does not immediately mean the model hallucinated. Select a possible layer in the package example.', groupLabel: 'Possible failure sources', conclusion: 'The final response alone may not reveal the exact source. Inspect the path, not only its endpoint.', items: [{ title: 'Unclear request', body: 'The problem may already be in the user wording.' }, { title: 'Missing input', body: 'A needed detail was not written or attached.' }, { title: 'Wrong product instruction', body: 'The product supplied an incomplete or unsuitable instruction.' }, { title: 'Wrong context selection', body: 'The system attached the wrong context or omitted important context.' }, { title: 'Model generation error', body: 'The model generated incorrect or unsupported output.' }, { title: 'Missing or stale external data', body: 'An external source is unavailable or out of date.' }, { title: 'Retrieval or tool failure', body: 'Search, a tool, or an integration failed.' }, { title: 'Policy or permission block', body: 'A rule or permission blocked an action.' }, { title: 'Formatting or display', body: 'The output was damaged after the model on its way to the screen.' }] },
        summary: { title: 'Three things to remember', points: ['The visible response is the end of a hidden system path.', 'The product and the model are different layers.', 'A failure can begin in different places, so inspect the path instead of judging only the answer.'] },
        bridge: { title: 'The natural next question', question: 'We now know that the product assembles something before the model responds. What exactly enters the model?', body: 'The next chapter opens the input envelope without assuming the visible message is everything the model received.', cta: 'Model input: what really enters the model' },
    },

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
        understandBody: 'The demo ranks candidates and shows their score margin. A larger margin means more separation inside this synthetic demo, not factual truth, reliability, or permission to act. Decoding may choose or sample from a distribution according to its rules.',
        ruleTitle: 'The practical rule',
        ruleBody: 'Use the demo margin as one signal about candidate separation only. Evidence is required for factual trust, and permissions or approval govern sensitive actions regardless of the margin.',
    },

    // "Before the quiz" card: anchoring the three core ideas in the main flow
    beforeQuiz: {
        title: 'Before the quiz: three points worth remembering',
        point1Lead: 'A path, not magic.',
        point1Body: ' Behind every answer a path runs through tokens, representations, scores and decoding. The progressive-input view compares separate runs with increasingly complete input; it is not a literal human-like reading head.',
        point2Lead: 'Two different questions.',
        point2BeforeChat: ' In ',
        point2AfterChat: ' the engine asks "What is the answer?". In ',
        point2AfterAgent: ' it asks "What is the right next step?" - answer, use a tool, or stop and ask for information.',
        point3Lead: 'Confidence meets responsibility.',
        point3Body: ' The displayed margin is a synthetic demo metric, not a probability of truth or authorization. Sensitive actions still require the product permissions and approval rules defined for them.',
        footnoteLead: 'Want to see this path live? Open the ',
        footnoteHighlight: 'full engine',
        footnoteTail: ' above and play with the read head and the "which word decided" lab.',
    },

    lock: {
        eyebrow: 'Check Your Understanding',
        question: 'The engine shows a small gap between the top option and the next. What is the right move?',
        answerLabel: 'Answer confidently',
        askLabel: 'Stop and ask',
        correctBody: 'You got it. A small gap means uncertainty, and the responsible move is to stop and ask, not to guess.',
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
