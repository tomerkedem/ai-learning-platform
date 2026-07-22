// i18n/locales/en/behind-ai/chapter1Visuals.ts
// English Chapter 1 visuals. Shape source: ../../he/behind-ai/chapter1Visuals.
// contentLocale = 'en' (real translation).
//
// Demo-input coupling: the demo inputs below (confidenceDial.samples[].input,
// forkView.samples[].input, counterfactual.experiments.*[].variants[].text + .pivot)
// are fed into the learning engine and must match the English detection vocabulary
// (EN_VOCAB) in app/behind-the-scenes-ai/chapter-1/mockEngine.ts. The engine picks the
// vocabulary by the script of the input (Hebrew letters => Hebrew, else English).
//
// No em dash (U+2014) and no en dash (U+2013). Mentor bubble text carries no emoji.

import type { Locale } from '@/i18n/config';

export const chapter1Visuals = {
    contentLocale: 'en' as Locale,

    // GlassEnginePanel: inner labels
    enginePanel: {
        stations: 'Key stations',
        actLabel: 'Act',
        normalizeTrimmed: 'Extra spaces trimmed compared to the original input.',
        inputClean: 'Input is already clean - nothing to fix',
        noTokens: 'No tokens yet.',
        noMatch: '- no match',
        claudeTokens: (n: number) => `Claude (real): ${n} tokens`,
        claudeNote: 'Above, the count is by words. The real number differs because the model splits into sub-words - and it does not reveal the split itself, only the count.',
        illustrationTitle: 'An illustration of the principles',
        illustrationBody: 'Every model has its own method, but they all rest on the same principles. This is exactly the path your sentence travels.',
    },

    // "Sentence Journey" (Chat mode) strings.
    journey: {
        zones: {
            A: 'From text to work units',
            B: 'From tokens to representations',
            C: 'Computing the context',
            D: 'From representation to answer',
        },
        anchorLabel: 'Your sentence, at every station',
        selectedLabel: 'Selected',
        pauseTag: 'Stops and asks',
        pauseNudge: {
            start: 'Try the other side.',
            body: 'You saw a confident answer. Switch to Agent mode and try the marked prompts, and watch the engine stop and ask, or request approval, instead of guessing.',
        },
        stations: {
            s1: { title: 'The request comes in', note: 'The sentence you picked - the starting point of the journey through the engine.' },
            s2: { title: 'Split into tokens', note: 'The same sentence is cut into work units. Now it is tokens.' },
            s3: { title: 'An ID for each token', note: 'Each token gets a number from the vocabulary. From here on, only numbers.' },
            s4: { title: 'Numeric representation', note: 'The sentence tokens fly into the meaning space, and position encodes meaning. The words are labels for you - behind each label is a numeric vector the model compares.' },
            s5: { title: 'Position and order', note: 'Each token carries a position tag. Order is part of the meaning - not a bag of words.' },
            s6: { title: 'Context window', note: 'The engine works only with what is in the window right now. That is all it sees of the sentence.' },
            s7: { title: 'Attention to context', note: 'The engine does not count words - it weighs which tokens matter. Here the highlighted token shapes the meaning of its neighbors.' },
            s8: { title: 'Mixing information', note: 'Each token is transformed by a feed-forward network. In some Mixture-of-Experts models, only a subset of experts is activated.' },
            s9: { title: 'Depth layers', note: 'Attention and feed-forward repeat across dozens of layers, and the sentence understanding sharpens.' },
            s10: { title: 'Up-to-date internal state', note: 'The whole sentence is compressed into one internal representation, before predicting the next token.' },
            s11: { title: 'Raw scores', note: 'The engine gives a score to every next option. It ranks options by probability, it does not count keywords.' },
            s12: { title: 'From score to probability', note: 'The scores turn into probabilities that add up to 100%. The highest one leads.' },
            s13: { title: 'Choosing the next token', note: 'Decoding chooses or samples a token according to the distribution and decoding rules.' },
            s14: { title: 'The answer', note: 'The selected token is appended and the next step is computed. Practical implementations may reuse previously computed state.' },
        },
        agent: {
            zones: {
                understand: 'Understanding the task',
                tools: 'Tools via MCP',
                control: 'Control and approval',
                exec: 'Execution and loop',
                output: 'Output',
            },
            stations: {
                a1: { title: 'The request comes in', note: 'The task you asked for - this is where the agent round begins.' },
                a2: { title: 'Understanding the goal', note: 'The agent grasps the real goal, not just the words.' },
                a3: { title: 'Available tools', note: 'The product may expose permitted tools such as tracking or messaging. MCP is one possible protocol, not a requirement.' },
                a4: { title: 'Tool selection and plan', note: 'The agent picks which tool moves the goal forward right now.' },
                a5: { title: 'Checking for missing info', note: 'Is a detail missing to act on? The agent stops and asks, instead of guessing.' },
                a6: { title: 'Risk and permission', note: 'An action that affects a customer (sending, updating) needs approval - it does not run on its own.' },
                a7: { title: 'Calling the tool', note: 'The product calls a permitted tool, such as the tracking system. Some systems may use MCP for this connection.' },
                a8: { title: 'Result from the tool', note: 'The tool returns an observation: a real status from the world.' },
                a9: { title: 'Reasoning and loop', note: 'With the result in hand: continue, call another tool, ask, or finish.' },
                a10: { title: 'Act or stop', note: 'The agent returns an answer, performs an action, waits for approval, or stops.' },
            },
            toolNames: ['Shipment tracking', 'Send a message to the customer'],
            mcp: 'MCP',
            loopLabel: 'Rethink',
            observation: 'Status: package in sorting',
            missingOn: 'Missing identifier (barcode)',
            missingOff: 'All the details are here',
            riskOn: 'Sensitive action - approval required',
            riskOff: 'Safe action',
            loopNodes: ['Plan', 'Tool call', 'Observation', 'Reason'],
            loopOutcomes: ['Continue', 'Ask', 'Stop', 'Finish'],
            agentNode: 'Agent',
            resultLabel: 'Result',
            gate: {
                safe: 'Safe answer',
                ask: 'Ask for info',
                approve: 'Approval required',
                stop: 'Stop',
            },
        },
    },

    // engineTrace: station names, titles, captions and labels
    trace: {
        unit: 'tokens',
        labels: {
            intent: {
                'Package not delivered': 'Package not delivered',
                'Tracking question': 'Tracking question',
                'System issue': 'System issue',
                'Payment issue': 'Payment issue',
                'Other': 'Other',
            },
            task: {
                'Send / update on customer record': 'Send or update a customer record',
                'Check delivery failure': 'Check a delivery failure',
                'Unclear task': 'Unclear task',
                'General request': 'General request',
            },
            decision: {
                'Stop for approval': 'Stop for approval',
                'Use Tracking API': 'Use the tracking tool',
                'Ask for barcode before action': 'Ask for a barcode before acting',
                'Ask what to handle': 'Ask what to handle',
                'Answer directly': 'Answer directly',
            },
        },
    },

    // mockEngine: demo replies (resolved by the replyKey the engine returns)
    mockEngine: {
        chatReplies: {
            notDelivered: 'This looks like a non-delivery case. It is worth checking the shipment status by barcode.',
            tracking: 'We can check the shipment status by tracking number. What is the tracking number?',
            system: 'This may be a glitch showing the information in the system. It is worth refreshing and trying again.',
            payment: 'This question seems related to a charge or a payment. It is worth checking the invoice details.',
            other: 'I am not sure I understood exactly. Could you describe the problem?',
        },
        agentReplies: {
            sensitive: 'This is an action that affects a customer. I will not perform it without verification and approval - I can prepare a draft for approval.',
            tool: 'There is a barcode. I am checking the shipment status in the tracking system...',
            askBarcode: 'To actually check this, I need the package barcode number.',
            vague: 'I need to understand what this refers to - which task or package should I check?',
            general: 'This sounds like a general request. It can be answered directly, without an external tool.',
        },
    },

    // ReadHeadLab
    readHead: {
        emptyState: 'Write a sentence in the chat so the read head can scan it.',
        title: 'Read Head',
        subtitle: 'The cursor that moves over the sentence word by word',
        introHeadLabel: 'The read head',
        introMid: ' stops after each word. At each stop the same engine recomputes the leading guess from what it has read so far, so you can watch the model ',
        introEmph: 'update its leading guess while reading',
        introTail: '. Pick an example and run the scanner.',
        distinctNote: 'The map above shows the whole pipeline at once. The read head shows what it cannot: how the leading guess shifts as it reads, word by word, at your own pace.',
        examplesLabel: 'Pick an example',
        yourSentence: 'Your sentence',
        play: 'Play',
        pause: 'Pause',
        again: 'Again',
        back: 'Back',
        forward: 'Forward',
        restart: 'Restart',
        wordCountAria: (i: number, n: number) => `Word ${i} of ${n}`,
        scrubberAria: 'Read head position',
        flipMarkerAria: 'The leader changed here',
        leaderNow: 'Leading now:',
        leaderTag: 'leader',
        confidence: 'confidence',
        decisionNow: 'Decision now:',
        streamHint: 'Width = the probability. Time flows with the reading direction.',
        readingNow: 'Still reading... the decision settles at the end of the sentence.',
        insightTitle: 'What happened here',
        insightChanges: (n: number) =>
            n === 0
                ? 'The model never switched leader across the whole sentence - it read without the leading option flipping, only growing more confident.'
                : n === 1
                    ? 'The model switched leader once while reading.'
                    : `The model switched leader ${n} times while reading.`,
        insightPivot: (w: string) => `The word that flipped the final decision: "${w}".`,
        scriptedNote: 'Guided example: each position compares a separate run with a longer input prefix. The synthetic scores are educational, not internal output from a real model or literal human-like reading.',
        liveNote: 'This is your sentence, run through the chapter learning engine. Notice that the probabilities move only when a keyword enters.',
        examples: [],
    },

    // ConfidenceDial (Chat mode)
    confidenceDial: {
        title: 'Confidence Dial',
        ideaLabel: 'The idea:',
        ideaPart1: ' before the engine answers, it weighs several interpretations of the same sentence. The ',
        ideaGap: 'gap',
        ideaPart2: ' between the leading interpretation and the second is its level of confidence. Your question:',
        ideaEmph: ' how much confidence to require',
        ideaPart3: ' before letting it answer on its own, and when it is better for it to stop and ask.',
        howTitle: 'How to use it',
        how1: ' Pick an input (yours or an example). The marker will move to the engine confidence.',
        how2: ' Drag the threshold along the axis, or pick a risk level.',
        how3Lead: ' When the threshold crosses the marker, the decision flips between ',
        how3Mid: ' and ',
        answerAlone: 'answer alone',
        stopAsk: 'stop and ask',
        leadingLabel: 'Leading interpretation',
        gapLabel: 'gap',
        competitorLabel: 'Runner-up',
        tryInput: 'Try an input:',
        yourMessage: 'Your message',
        // Demo input: coupled to EN_VOCAB in mockEngine (see header note).
        samples: [
            { input: "My package didn't arrive", tag: 'Clear input' },
            { input: "Where is my order, it's not in the system", tag: 'Mixed input' },
            { input: 'Where is my payment', tag: 'Ambiguous input' },
        ],
        analyzingLead: 'Analyzing: "',
        analyzingTail: '"',
        dragHint: 'Drag the threshold along the axis',
        engineMarker: (margin: number) => `Engine ${margin}%`,
        thresholdMarker: (threshold: number) => `Threshold ${threshold}%`,
        thresholdAria: 'Required confidence threshold',
        stakesTitle: 'What is the risk if the engine is wrong here?',
        // he/sub/note are display; the field name 'he' is kept for shape parity.
        stakes: {
            low: { he: 'Low risk', sub: 'A simple information question', note: 'A mistake here is cheap. You can require low confidence and let the engine answer on its own.' },
            mid: { he: 'Medium risk', sub: 'Partial information', note: 'A medium threshold is worth it. If the gap the engine computed is smaller than it, better to stop and ask.' },
            high: { he: 'High risk', sub: 'An action that affects a customer', note: 'A mistake here is expensive. Require high confidence, and if there is none, stop and ask for approval.' },
        },
        recommendedThreshold: (rec: number) => `Recommended threshold ${rec}%`,
        passLead: (margin: number) => `The engine confidence (gap ${margin}%) `,
        passBold: 'is above the threshold',
        passTail: (threshold: number) => ` you set (${threshold}%). It will answer on its own.`,
        failLead: (threshold: number) => `The threshold you set (${threshold}%) `,
        failBold: 'is above the confidence',
        failTail: (margin: number) => ` of the engine (gap ${margin}%). The responsible step: stop and ask.`,
        integrityLead: 'Drag the threshold until it crosses the engine marker - that is exactly where the decision flips. No number the engine produced changed, only ',
        integrityBold: 'the policy you choose',
        integrityTail: '. That is how probability becomes responsibility.',
    },

    // ConfidenceDial (Agent mode)
    agentGate: {
        title: 'The decision gate in Agent',
        bodyLead: 'In Agent the gate does not rely on a gap between probabilities but on ',
        bodyEmph: 'risk and missing information',
        bodyTail: ': whether the task is clear, whether an identifier is missing, and whether the action is sensitive. So there is no gap dial here - the decision is set by the factors below.',
        footerLead: 'Switch to ',
        footerTail: ' to drag the confidence dial over the gap. In Agent, stopping for approval is not a failure - it is responsible control before an action that affects a customer.',
    },

    // CounterfactualDiff
    counterfactual: {
        title: 'What if',
        whyLabel: 'Why it matters: ',
        whyLead: 'The engine decision is never random - there is always one word that decides. Here we do two things: first we ',
        whyFind: 'find',
        whyMid: ' the word that caused the decision, and then we ',
        whyProve: 'prove',
        whyTail: ' that it is the one - we change only it and watch the decision flip.',
        howTitle: 'How to use it',
        how1: ' Pick a causal lever - which word to test.',
        how2: ' See below which word decided the current decision.',
        how3: ' Switch between the two phrasings that differ only in that word, and watch the decision flip.',
        tryLever: 'Try a lever:',
        noPivot: 'without the pivot word',
        attrChose: 'The engine chose',
        // 'the ' prefix before the bold "why"; kept in the dictionary so no text is hardcoded.
        attrWhyPrefix: 'the ',
        attrWhy: 'why',
        attrWithPivotMid: ' is the word ',
        attrWithPivotTail: '. Want to make sure it is really the one that decides? Change only it below.',
        attrNoPivotMid1: ' is actually that what is ',
        attrNoPivotMissing: 'missing',
        attrNoPivotMid2: ' here is the word ',
        attrNoPivotTail: '. The absence of a word is also a cause. Put it back below and see.',
        flipped: 'The decision flipped:',
        sameDecision: 'The decision stayed the same, but the word changed the leading intent and the reply that gets generated.',
        barsTitle: 'How much the engine believes each interpretation',
        barsLegend: 'The green or red number next to each bar = how much that interpretation rose or fell because of the word you changed.',
        barReadWith: (word: string, before: number, after: number) => `The word "${word}" jumped the leading interpretation from ${before}% to ${after}%.`,
        barReadWithout: (word: string, after: number) => `Without the word "${word}" no interpretation stands out - the leader reaches only ${after}%.`,
        ghostHint: 'The dashed outline = the previous run (the ghost)',
        replyToCreate: 'The reply that would be created',
        beforeAfter: 'Before / after',
        // Experiments: chip/why are display; variants[].text/pivot are coupled demo input.
        experiments: {
            chat: [
                {
                    key: 'neg',
                    chip: 'Negation word',
                    why: 'One negation word turns "all is well" into "there is a problem". Without it there is nothing to solve, so the leading intent and the decision change.',
                    variants: [
                        { text: "My package didn't arrive", pivot: "didn't" },
                        { text: 'My package arrived', pivot: '' },
                    ],
                },
                {
                    key: 'kw',
                    chip: 'Keyword',
                    why: 'The exact same sentence structure, one different keyword - and the leading intent jumps to a completely different category.',
                    variants: [
                        { text: "There's a problem with the payment", pivot: 'payment' },
                        { text: "There's a problem with the system", pivot: 'system' },
                    ],
                },
            ],
            agent: [
                {
                    key: 'barcode',
                    chip: 'Identifier (barcode)',
                    why: 'Without an identifier the engine cannot act: it stops and asks for the missing information. The moment the barcode comes in, it reaches for the tracking tool.',
                    variants: [
                        { text: 'Check package 123456789', pivot: '123456789' },
                        { text: 'Check the package', pivot: '' },
                    ],
                },
                {
                    key: 'sensitive',
                    chip: 'Sensitive action',
                    why: 'The action word sets the risk: "check" is a safe call, "tell" affects a customer - so the engine stops for approval instead of acting.',
                    variants: [
                        { text: 'Tell the customer the package was lost', pivot: 'Tell' },
                        { text: 'Check whether the package was lost', pivot: 'Check' },
                    ],
                },
            ],
        },
    },

    // ForkView
    forkView: {
        title: 'Fork: same input, two engines',
        ideaLabel: 'The idea:',
        ideaLead: ' the exact same input enters two engines. They do not disagree on the facts, they ',
        ideaEmph: 'ask a different question about it',
        ideaTail: ' - and so they reach different decisions.',
        howTitle: 'How to use it',
        how1: ' Pick an input (yours or an example).',
        how2: ' See the exact same tokens enter both engines.',
        how3: ' Compare: sometimes they agree, sometimes they split. The bar below explains why.',
        tryInput: 'Try an input:',
        yourMessage: 'Your message',
        // Demo input: coupled to EN_VOCAB in mockEngine (see header note).
        samples: [
            { input: "My package didn't arrive", tag: 'Complaint' },
            { input: 'Check package 123456789', tag: 'Task with an ID' },
            { input: 'Tell the customer the package was lost', tag: 'Sensitive action' },
            { input: 'What are your opening hours', tag: 'General question' },
        ],
        analyzingLead: 'Analyzing: "',
        analyzingTail: '"',
        sameTokens: 'The same tokens enter both engines',
        divergeLead: 'Here they split: Chat chose "',
        divergeMid: '", and Agent chose "',
        divergeTail: '".',
        agreeLead: 'Here they agree: both reached "',
        agreeTail: '". Even when the engines ask a different question, sometimes the answer is the same.',
        questionLabel: 'Its question:',
        chatQuestion: 'What is the answer?',
        agentQuestion: 'What is the safe next step?',
        footer: 'The exact same tokens, and sometimes two decisions. The difference is not in the input but in the question each engine asks about it: Chat picks the likely answer, and Agent weighs the safe next step - answer, use a tool, or stop and ask for information.',
    },

    // PredictDecision (next-word guess)
    predict: {
        eyebrow: 'Quick guess · Complete the word',
        question: 'Which word will the engine pick next?',
        subtitle: 'Before you run the read head - guess which word is the most likely next one.',
        sentenceLead: 'My package still hasn\'t ',
        sentenceTail: '',
        words: {
            absurd: 'danced',
            arrived: 'arrived',
            plausible: 'shipped',
        },
        correctTitle: 'Exactly right!',
        correctBody: 'Right. "arrived" is the natural continuation here, so the engine gives it the highest probability.',
        wrongTitle: 'Almost!',
        wrongBody: 'The engine would rank "arrived" much higher - it is by far the most likely continuation here. The other words are simply rare in this context.',
        rankingLabel: 'How the engine ranks the words',
        bridge: 'This is exactly the ranking the read head below shows live',
        guessAgain: 'Guess again',
    },
};
