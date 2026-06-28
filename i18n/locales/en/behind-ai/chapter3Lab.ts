// i18n/locales/en/behind-ai/chapter3Lab.ts
// English content for the chapter 3 tokenization lab (Chapter3LabContent).
// Shape source: app/behind-the-scenes-ai/chapter-3/labContent (HE_LAB_CONTENT is canonical).
//
// This is a plain data module (type-only imports, erased at build). It is wired into
// the lab through the client labContent registry, NOT through the i18n dictionary, to
// keep the server/client boundary clean.
//
// Structural keys are NOT translated: scenario ids, modes, accents, role keys, and the
// roadmap active flags stay identical to Hebrew. English secondary captions (the small
// uppercase labels) stay English on purpose. No em dash (U+2014), no en dash (U+2013).

import type { Chapter3LabContent } from '@/app/behind-the-scenes-ai/chapter-3/labContent';

export const chapter3Lab: Chapter3LabContent = {
    modeLabel: 'Mode:',

    splitter: {
        hint: 'Type a sentence and it splits into tokens in real time.',
        placeholder: 'For example: The package did not arrive',
        aria: 'Text input for token splitting',
        quickLabel: 'Quick experiments:',
        resetLabel: 'Reset',
    },

    stream: {
        title: 'Token stream',
        titleEn: 'Token Stream',
        empty: 'Type some text and it will split into tokens here.',
        hint: 'Tap a token to see its role.',
        rail: {
            input: { label: 'Input text', en: 'Input Text' },
            tokenizer: { label: 'Tokenizer', en: 'Tokenizer' },
            stream: { label: 'Token stream', en: 'Token Stream' },
        },
    },

    legend: {
        title: 'Token color map',
        titleEn: 'Token Color Map',
    },

    count: {
        title: 'Token count',
        titleEn: 'Token Count',
        note: 'This number connects later to the Context Window: how many tokens a model can hold at once. Here we only plant the idea.',
    },

    roleCard: {
        closeAria: 'Close the role card',
    },

    signals: {
        number: { label: 'Number token', en: 'Number token' },
        action: { label: 'Action signal', en: 'Action signal' },
        deliveryFailure: { label: 'Delivery failure signal', en: 'Delivery failure signal' },
        sortingCenter: { label: 'Sorting center', en: 'Sorting center' },
    },

    noSpaceNote:
        'Without spaces, this educational tokenizer sees one long unit. A real tokenizer would still split it into sub-words, because it does not rely on spaces alone. That is exactly why a token is not necessarily a word.',

    educational: {
        badge: 'Educational',
        note: 'This is an educational tokenizer, not a commercial model. This step is only preparation: the system does not yet compute full probability and does not answer, it only splits the text into working units. The role coloring is a learning aid, since real models split by statistics, not by linguistic role.',
    },

    subword: {
        title: 'Sub-word Lab',
        titleEn: 'Sub-word Lab',
        badge: 'Educational split',
        hint: 'Tap a word to split it: an affix separates from the base word. Notice how the token count rises with each split.',
        wordsLabel: 'Words:',
        tokensLabel: 'Tokens:',
        splitAll: 'Split all',
        mergeAll: 'Merge all',
        splitHint: 'tap to split',
        mergeHint: 'tap to merge',
        ariaWhole: 'whole, tap to split',
        ariaSplit: 'split, tap to merge',
        note: 'This is an educational split only. A real tokenizer does not split by affixes but by sub-word statistics learned from a lot of text. Here we show the idea that one word can break into several units.',
        splits: [
            { word: 'unpack', whole: ['unpack'], units: ['un', 'pack'], roleLabel: 'Prefix', roleEn: 'Prefix', note: 'The prefix "un" can split from the base "pack".' },
            { word: 'redeliver', whole: ['redeliver'], units: ['re', 'deliver'], roleLabel: 'Prefix', roleEn: 'Prefix', note: 'The prefix "re", meaning again, can split from the base "deliver".' },
            { word: 'reopen', whole: ['reopen'], units: ['re', 'open'], roleLabel: 'Prefix', roleEn: 'Prefix', note: 'The prefix "re" can split from the base "open".' },
            { word: 'unhappy', whole: ['unhappy'], units: ['un', 'happy'], roleLabel: 'Prefix', roleEn: 'Prefix', note: 'The prefix "un" can split from the base "happy".' },
            { word: 'preorder', whole: ['preorder'], units: ['pre', 'order'], roleLabel: 'Prefix', roleEn: 'Prefix', note: 'The prefix "pre" can split from the base "order".' },
        ],
    },

    roadmap: {
        title: 'The engine roadmap',
        titleEn: 'From Text to Probabilities',
        note: 'Right now we are only at the first step: text becomes tokens. The next steps (token IDs, vectors) are where real models do the statistical computation. Without this split there is no start to the route.',
        steps: [
            { he: 'Text', en: 'Text', active: true },
            { he: 'Tokens', en: 'Tokens', active: true },
            { he: 'Token IDs', en: 'Token IDs', active: false },
            { he: 'Vectors', en: 'Vectors', active: false },
            { he: 'Similarity', en: 'Similarity', active: false },
            { he: 'Scores', en: 'Scores', active: false },
            { he: 'Probabilities', en: 'Probabilities', active: false },
        ],
    },

    scenarios: [
        {
            id: 'chat-delivery',
            mode: 'chat',
            labelHe: 'Chat mode',
            labelEn: 'Chat mode',
            prompt: 'The package did not arrive',
            accent: 'emerald',
            routeHe: 'Build answer',
            routeEn: 'Build answer',
            examples: [
                { labelHe: 'Base', labelEn: 'Base', text: 'The package did not arrive' },
                { labelHe: 'With question', labelEn: 'With question', text: 'The package did not arrive?' },
                { labelHe: 'With emphasis', labelEn: 'With emphasis', text: 'My package did not arrive!!!' },
                { labelHe: 'Tracking number', labelEn: 'Tracking number', text: 'The tracking number is 12345' },
                { labelHe: 'No spaces', labelEn: 'No spaces', text: 'Thepackagedidnotarrive' },
                { labelHe: 'In Spanish', labelEn: 'In Spanish', text: 'El paquete no llego' },
                { labelHe: 'Correction', labelEn: 'Correction', text: 'Not shoes, I ordered a book' },
            ],
        },
        {
            id: 'agent-investigate',
            mode: 'agent',
            labelHe: 'Agent mode',
            labelEn: 'Agent mode',
            prompt: 'Check why the package did not arrive',
            accent: 'purple',
            routeHe: 'Understand task',
            routeEn: 'Understand task',
            examples: [
                { labelHe: 'Investigation', labelEn: 'Investigation', text: 'Check why the package did not arrive' },
                { labelHe: 'To recipient', labelEn: 'To recipient', text: 'Check why the package did not arrive for the customer' },
            ],
        },
    ],

    roleWords: {
        package: 'object',
        paquete: 'object',
        not: 'negation',
        Not: 'negation',
        no: 'negation',
        arrive: 'action',
        arrived: 'action',
        llego: 'action',
        Check: 'action-signal',
        check: 'action-signal',
        tracking: 'context',
        customer: 'recipient',
        maybe: 'noise',
        just: 'noise',
    },

    roleInfo: {
        object: { label: 'Object', en: 'Object', why: 'This is what the sentence is about. The engine needs to know the subject before it can tell what happened to it.' },
        negation: { label: 'Negation', en: 'Negation', why: 'This word can flip the direction of the sentence. Without it the meaning is the opposite.' },
        action: { label: 'Action', en: 'Action', why: 'What happened to the object. The verb sets the actual state of things.' },
        'action-signal': { label: 'Action signal', en: 'Action signal', why: 'This word shifts the input from a description to a request for action. It changes the whole route.' },
        context: { label: 'Context', en: 'Context / Location', why: 'Adds a place or context that sharpens the picture, such as where the package was supposed to arrive.' },
        system: { label: 'System', en: 'System', why: 'Points to the system itself, not the package. Same area, but a different direction.' },
        recipient: { label: 'Recipient', en: 'Recipient', why: 'Who receives the action. Relevant especially when it concerns a real person.' },
        'question-signal': { label: 'Question signal', en: 'Question signal', why: 'A question mark is a token of its own. It changes the shape of the sentence from a statement to a question.' },
        'statement-signal': { label: 'Statement signal', en: 'Statement signal', why: 'A period is a separate token that marks the end of a statement. Punctuation counts as a working unit too.' },
        number: { label: 'Number', en: 'Number', why: 'A run of digits is a unit of its own. A tracking number, for example, can turn a general request into something you can check.' },
        noise: { label: 'Noise', en: 'Noise', why: 'A general word that adds very little information. It still becomes a token, even if its weight is low.' },
        other: { label: 'General', en: 'Token', why: 'A word not mapped to a special role in this educational tokenizer. It still counts as a working unit.' },
    },

    sortingCenter: { leads: ['sorting'], follow: 'center' },
    deliveryFailure: { first: 'not', second: 'arrive' },
};
