// i18n/locales/en/behind-ai/chapter4Lab.ts
// English content for the chapter 4 Embeddings lab (Chapter4LabDict).
// Shape source: app/behind-the-scenes-ai/chapter-4/labContent (Chapter4LabDict is canonical).
//
// Data module only (type-only import, erased at build). Loaded through the client-side
// lab content registry, not through the i18n dictionary, to keep a clean server/client
// boundary.
//
// Structural keys are not translated: sentence ids, chip ids, magnet ids, and dim keys
// stay stable. Tokens are authored by hand, never split on spaces. No em dash (U+2014)
// and no en dash (U+2013).

import type { Chapter4LabDict } from '@/app/behind-the-scenes-ai/chapter-4/labContent';

export const chapter4Lab: Chapter4LabDict = {
    sentences: {
        'pkg-not-arrived': {
            text: 'The package did not arrive',
            tokens: ['The', 'package', 'did', 'not', 'arrive'],
            ttsLine: 'The package did not arrive. A complaint about a delivery failure, high on the failure direction.',
            swaps: {
                'to-arrived': { label: 'arrived', from: 'did not arrive' },
            },
        },
        'delivery-not-handed': {
            text: 'The delivery was not handed over',
            tokens: ['The', 'delivery', 'was', 'not', 'handed', 'over'],
            ttsLine: 'The delivery was not handed over. Completely different words, but the same direction of meaning.',
        },
        'pkg-arrived': {
            text: 'The package arrived',
            tokens: ['The', 'package', 'arrived'],
            ttsLine: 'The package arrived. The same delivery domain, but without a failure, so the point moves.',
        },
        'system-not-showing': {
            text: 'The system is not showing the package',
            tokens: ['The', 'system', 'is', 'not', 'showing', 'the', 'package'],
            ttsLine: 'The system is not showing the package. A system glitch, not a delivery problem.',
        },
        'billing-address-update': {
            text: 'We updated the billing address',
            tokens: ['We', 'updated', 'the', 'billing', 'address'],
            ttsLine: 'We updated the billing address. A topic far from delivery, so it lands far on the map.',
        },
        'agent-investigate-delay': {
            text: 'Check why the package did not arrive',
            tokens: ['Check', 'why', 'the', 'package', 'did', 'not', 'arrive'],
            ttsLine: 'Check why the package did not arrive. A safe investigation request, low risk.',
        },
        'agent-notify-lost': {
            text: 'Send the customer a message that the package was lost',
            tokens: ['Send', 'the', 'customer', 'a', 'message', 'that', 'the', 'package', 'was', 'lost'],
            ttsLine: 'Send the customer a message that the package was lost. A customer-facing action that needs approval.',
        },
    },

    map: {
        closestTag: 'Closest',
        honest: 'An Embedding helps compare meaning. It does not prove what really happened.',

        visualTitle: 'First, simple closeness',
        visualSubtitle: 'Things with similar meaning appear closer. Pick an object and see what is closest to it.',
        ruleLine: 'Things with similar meaning are located closer together.',
        objects: {
            dog: 'Dog',
            cat: 'Cat',
            apple: 'Apple',
            cucumber: 'Cucumber',
            computer: 'Computer',
        },
        objectExplain: {
            dog: 'Dog and cat are close because both are animals.',
            cat: 'Dog and cat are close because both are animals.',
            apple: 'Apple and cucumber are close because both are food.',
            cucumber: 'Apple and cucumber are close because both are food.',
            computer: 'Computer is farther because it belongs to the world of technology.',
        },
        objectSelected: 'Selected object',
        objectClosest: 'Closest',
        objectNoClose: 'Far from the rest',

        packageTitle: 'Closeness in meaning between sentences',
        packageSubtitle: 'Different sentences can be close if they describe a similar idea.',
        centerLabel: 'Selected sentence',
        closestLabel: 'Closest in meaning',
        packageRule: 'The model is not only looking for identical words. It compares closeness in meaning.',
        cards: {
            'pkg-not-arrived': { shortLabel: 'Did not arrive', chips: ['Delivery issue', 'Package status'] },
            'delivery-not-handed': { shortLabel: 'Not handed over', chips: ['Delivery issue', 'Package status'] },
            'pkg-arrived': { shortLabel: 'Arrived', chips: ['Package status'] },
            'system-not-showing': { shortLabel: 'Not shown', chips: ['Package status'] },
            'billing-address-update': { shortLabel: 'Billing address', chips: ['Billing'] },
            'agent-investigate-delay': { shortLabel: 'Status check', chips: ['Inquiry', 'Package status'] },
            'agent-notify-lost': { shortLabel: 'Package lost', chips: ['Action', 'Exception'] },
        },

        proofTitle: 'Proof and explanation',
        proofLead: 'After seeing what is close to what, we can see why: which meaning components are shared, and which forces shaped the representation.',

        relationTitle: 'What is close to what?',
        coreRule: 'Closer means more similar in meaning. Farther means less similar.',
        relClosest: 'Closest',
        relRelated: 'Related but different',
        relFar: 'Farther',
        objectRows: [
            { pair: 'Dog is close to cat', reason: 'because both are animals.' },
            { pair: 'Apple is close to cucumber', reason: 'because both are food.' },
            { pair: 'Computer is far from them', reason: 'because it belongs to the world of technology.' },
        ],
        relations: {
            'pkg-not-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'Both describe a delivery problem.',
                reasonRelated: 'Still tied to the package problem, but this is already an action that follows it.',
                reasonFar: 'It deals with billing details, not a delivery problem.',
            },
            'delivery-not-handed': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'Both describe a delivery problem.',
                reasonRelated: 'Tied to the same problem, but this is already a customer-facing action.',
                reasonFar: 'It deals with billing details, not delivery.',
            },
            'pkg-arrived': {
                closestId: 'delivery-not-handed',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'The same world of package delivery.',
                reasonRelated: 'The same domain, but this is a request to check, not a description of a state.',
                reasonFar: 'It deals with billing, a completely different topic.',
            },
            'system-not-showing': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-investigate-delay',
                farId: 'billing-address-update',
                reasonClosest: 'Both are about a package where something went wrong.',
                reasonRelated: 'Related, but this is an action request to check.',
                reasonFar: 'It deals with billing, not a package problem.',
            },
            'billing-address-update': {
                closestId: 'system-not-showing',
                relatedId: 'pkg-not-arrived',
                farId: 'agent-notify-lost',
                reasonClosest: 'Both touch details in the system, not the delivery itself.',
                reasonRelated: 'This is shipping too, but it is a delivery problem, not billing.',
                reasonFar: 'This is a customer-facing action about a lost package, far from billing.',
            },
            'agent-investigate-delay': {
                closestId: 'pkg-not-arrived',
                relatedId: 'agent-notify-lost',
                farId: 'billing-address-update',
                reasonClosest: 'Both are about a package that did not arrive, here as a request to check.',
                reasonRelated: 'Both are actions, but this one reports to the customer.',
                reasonFar: 'It deals with billing, not checking a delivery.',
            },
            'agent-notify-lost': {
                closestId: 'agent-investigate-delay',
                relatedId: 'pkg-not-arrived',
                farId: 'billing-address-update',
                reasonClosest: 'Both are actions around a package that went wrong.',
                reasonRelated: 'Tied to the problem itself, but this is only a description of the problem, not an action.',
                reasonFar: 'It deals with billing, a different topic.',
            },
        },
        howto: {
            title: 'How do you read the view?',
            rowPoint: 'Card = sentence',
            rowClose: 'Close = similar meaning',
            rowFar: 'Far = less similar',
            rowSwap: 'Swapping a word can pull closer or push away',
            legendWhy: 'Why are they close or far? See the DNA and the meaning forces.',
        },
    },

    magnets: {
        delivery: 'Delivery',
        delay: 'Delay',
        complaint: 'Complaint',
        tracking: 'Tracking',
        refund: 'Refund',
        risk: 'Risk',
    },

    genes: {
        delivery: 'Delivery',
        system: 'System',
        address: 'Address',
        payment: 'Payment',
        urgency: 'Urgency',
        failure: 'Failure',
        action: 'Action',
        risk: 'Risk',
        customer: 'Customer',
        permission: 'Approval',
    },

    dna: {
        title: 'Meaning DNA',
        sharedGenes: (shared, total) => `${shared} of ${total} shared genes`,
        sharedLabel: 'Shared genes',
        drift: (pct) => `Drift ${pct}%`,
        stayedClose: 'The meaning stayed close',
        drifted: 'The meaning drifted',
    },

    controls: {
        pickSentence: 'Pick a sentence',
        swapTitle: 'What happens if we swap a word?',
        swapHint: 'A small change in wording can pull the meaning closer or push it away.',
        resetSwap: 'Back to the original sentence',
    },

    fallback: {
        missingSentence: 'Missing content',
    },

    ui: {
        magnetTitle: 'Meaning forces',
    },

    explain: {
        title: 'Quick guide',
        mapShadow: 'The map is a flat shadow of a much larger meaning space.',
        close: 'Close points usually represent similar meaning.',
        far: 'A far point is not wrong, it is just less similar in meaning.',
        regions: 'The colored halos are meaning neighborhoods, not sharp borders.',
        forces: 'The meaning forces show which signals pulled the sentence in this direction.',
        dna: 'The DNA proves why two sentences are close: the same meaning components light up at a similar strength.',
        notTruth: 'An Embedding helps compare meaning. It does not prove what really happened.',
    },
};
