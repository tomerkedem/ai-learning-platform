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
    },

    // engineTrace: station names, titles, captions and labels
    trace: {
        acts: {
            intake: 'Intake',
            analyze: 'Analysis',
            decide: 'Decision',
            output: 'Output',
            task: 'Task detection',
            risk: 'Risk and responsibility',
            act: 'Decision and output',
        },
        unit: 'tokens',

        chat: {
            c1: { title: 'Raw input', note: 'The text you wrote, exactly as it arrived.' },
            c2: { title: 'Normalize', note: 'Extra spaces are trimmed, the text is aligned for processing.' },
            c3: { title: 'Tokenize', note: 'The text is split into units. The split here is by whole words, for illustration. A real model splits into sub-words (subword), and the split itself varies from model to model, so the same sentence breaks into a different number of tokens in each model.' },
            c4: { title: 'Token count', note: 'How many units there are to process. A first signal of the request size.' },
            c5: { title: 'Keyword scan', note: 'Which words in the input trigger which intent. These are the cues that move the ranking.' },
            c6: { title: 'Negation', note: 'A negation word turns an issue into a complaint, and strengthens the not-delivered intent.' },
            c7: { title: 'Candidate intents', note: 'All possible intents step into the ring, each with its number of matches.' },
            c8: { title: 'Probabilities', note: 'The matches turn into probabilities that sum to 100%. The highest leads.' },
            c9: { title: 'Top selection', note: 'The intent with the highest probability is chosen as the leader.' },
            c10: { title: 'Margin', note: 'The gap between first and second. Not just who leads, but by how much.' },
            c11: { title: 'Confidence', note: 'The gap is translated into a confidence level: high, medium, or low.' },
            c12: { title: 'Meaning', note: 'The leading intent is mapped to the meaning domain that will guide the answer.' },
            c13: { title: 'Decision', note: 'Answer when confidence is enough, otherwise stop and ask for clarification.' },
            c14: { title: 'Output state', note: 'What the engine is about to return in practice following the decision.' },
            c15: { title: 'Reply', note: 'The final wording shown to the user.' },
        },
        negationOn: 'Negation found',
        negationOff: 'No negation',
        negationDetail: 'Strengthens "Package not delivered"',

        agent: {
            a1: { title: 'Raw input', note: 'The request you wrote, the entry point to the action engine.' },
            a2: { title: 'Normalize', note: 'Extra spaces are trimmed, the text is aligned for processing.' },
            a3: { title: 'Tokenize', note: 'The text is split into units. The split here is by whole words, for illustration. A real model splits into sub-words (subword), and the split itself varies from model to model, so the same sentence breaks into a different number of tokens in each model.' },
            a4: { title: 'Token count', note: 'How many units there are to process.' },
            a5: { title: 'Action words', note: 'Words like "check" or "send" signal that this is a task, not a question.' },
            a6: { title: 'Domain scan', note: 'Whether the request touches delivery or a package, the domain the engine knows how to handle.' },
            a7: { title: 'Identifier', note: 'A long digit sequence = a barcode. Without it, real action is impossible.' },
            a8: { title: 'Task detected', note: 'From all the cues, the engine sums up what the task at hand is.' },
            a9: { title: 'Missing info', note: 'What is needed to act, and is not yet in the request.' },
            a10: { title: 'Tool need', note: 'Whether an external source (like a tracking system) is needed to complete it.' },
            a11: { title: 'Sensitivity', note: 'Actions like "send" or "update" affect a customer and require care.' },
            a12: { title: 'Action readiness', note: 'Given the information and the risk: whether it is allowed and possible to act now.' },
            a13: { title: 'Decision', note: 'The right next step: answer, use a tool, ask for information, or stop.' },
            a14: { title: 'Output state', note: 'What will happen in practice following the decision.' },
            a15: { title: 'Reply', note: 'The final wording shown to the user.' },
        },
        actionWordsLabel: 'Action words',
        deliveryDomainLabel: 'Delivery domain',
        sensitiveLabel: 'Sensitive action',
        barcodeOn: 'Barcode found',
        barcodeOff: 'No identifier',
        barcodeOnDetail: 'The Tracking API can be called',
        barcodeOffDetail: 'Information will be missing to act',
        toolNeed: (tool: string) => `Tool needed: ${tool}`,
        noTool: 'No external tool',
        canActNow: 'Can act now',
        cannotActYet: 'Do not act yet',
        riskDetail: (risk: string) => `Risk: ${risk}`,
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
        introMid: ' is the cursor that moves over the sentence word by word, like a finger following the text while reading. At each stop the same engine runs on the words read so far, so you can watch the model ',
        introEmph: 'change its mind while reading',
        introTail: '. Pick an example and run the scanner.',
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
                ? 'The model never switched leader across the whole sentence - it read without changing its mind, only growing more confident.'
                : n === 1
                    ? 'The model changed its mind once while reading.'
                    : `The model changed its mind ${n} times while reading.`,
        insightPivot: (w: string) => `The word that flipped the final decision: "${w}".`,
        scriptedNote: 'Guided example: the probabilities here are a learning illustration of how belief accumulates word by word, not the output of a real model.',
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
