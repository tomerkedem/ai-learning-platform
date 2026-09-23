// i18n/locales/en/behind-ai/chapter2Visuals.ts
// English Chapter 2 visuals: Input Comparison Lab chrome and the five input
// variations. Shape source: ../../he/behind-ai/chapter2Visuals (Hebrew is canonical).
//
// Real translation. No em dash (U+2014), no en dash (U+2013). Structural fields
// (id, ambiguity) are kept literal; only visible text is translated.

import type { Locale } from '@/i18n/config';
import type { InputVariation } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

export const chapter2Visuals = {
    contentLocale: 'en' as Locale,

    // Input Comparison Lab chrome
    inputLab: {
        tokenizationHint: 'A note for later: here we only look at what the input contains. Breaking the text into tokens comes in a separate chapter later on.',
        pickerHint: 'Pick at least two phrasings and compare them. Check what is stated explicitly, what is left missing, and what changed in the request the model received.',
        pickerAria: 'Choose a phrasing to compare',
        ambiguityPrefix: 'Ambiguity',
        outro: 'Same need, different phrasings. With each one the model gets different material to work with, before any deeper processing begins.',
        // Field titles in the reading panel
        fields: {
            explicit: 'What the text states',
            missing: 'What is missing',
            changed: 'What changed from the base',
            ambiguity: 'Ambiguity level',
            expectation: 'What the request asks the model to do',
        },
        baseComparison: 'This is the baseline for comparison.',
        noticeLabel: 'Worth noting',
        // Ambiguity level labels (the chip and color are structural in the component)
        ambiguityLabels: {
            low: 'Low',
            medium: 'Medium',
            high: 'High',
        },
    },

    // The five input variations. Structural fields (id, ambiguity) mirror
    // inputVariations.ts; only the visible text is translated, in the same order.
    inputVariations: [
        {
            id: 'base',
            label: 'Basic request',
            prompt: "My printer isn't working. What should I do?",
            explicit: ["There is a problem: the printer isn't working", 'A request for guidance: what to do'],
            missing: ['Error code', 'Which printer model', 'When the problem started'],
            changed: '',
            ambiguity: 'medium',
            expectation: 'Offer general guidance, or ask what is missing in order to really help',
        },
        {
            id: 'question',
            label: 'Just a question',
            prompt: "My printer isn't working?",
            explicit: ["The printer isn't working, phrased as an open question"],
            missing: ['What the user wants to happen', 'An explicit request for action or guidance'],
            changed: 'The "what to do" was removed and a question mark was added. It is left as an open question with no clear request.',
            ambiguity: 'high',
            expectation: 'Clarify what is actually needed before drafting an answer',
        },
        {
            id: 'contradiction',
            label: 'Contradiction',
            prompt: "My printer isn't working, but the app says it's connected.",
            explicit: ["Problem: the printer isn't working", "Counterclaim: the app reports it is connected"],
            missing: ['An explicit request', 'An error code to verify'],
            changed: 'A contradiction was added between what the user experienced and what the app reports.',
            ambiguity: 'medium',
            expectation: 'Notice the contradiction, and maybe offer to check the connection',
        },
        {
            id: 'tracking',
            label: 'With an error code',
            prompt: "My printer isn't working. The error code is 12345.",
            explicit: ["Problem: the printer isn't working", 'Identifier: error code 12345'],
            missing: ['What exactly the desired action is'],
            changed: 'An error code was added. Now there is enough to check a real status.',
            ambiguity: 'low',
            expectation: 'The issue can be looked up using the identifier',
        },
        {
            id: 'correction',
            label: 'A correction in the chat',
            prompt: 'Not the printer, I meant the scanner.',
            explicit: ['Correction: not the printer but the scanner'],
            missing: ['The earlier context in the chat, without which it is unclear what is being corrected'],
            changed: 'This is not a description of a problem but a correction of something said earlier in the chat.',
            ambiguity: 'high',
            expectation: 'Update the current context of the chat according to the correction',
            note: 'The correction changes the current context of the chat, not what the model learned in training.',
        },
    ] as InputVariation[],
};
