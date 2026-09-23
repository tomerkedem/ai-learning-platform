// i18n/locales/en/behind-ai/semanticSpaceLab.ts
//
// English strings for the Chapter 5 "Semantic Space" laboratory.
//
// Structural keys (phrase ids, cluster keys) stay stable and are never translated; only
// the values are. Coordinates and cluster membership live in the structural file
// app/behind-the-scenes-ai/chapter-5/semanticSpace.ts.
//
// The negation pair is base='not-arrived' vs opposite='arrived'. The two English phrases
// are kept lexically as close as English allows ("is not open" vs "is open") so that
// exactly one token, "not", is unique to the base sentence and gets highlighted as the
// negation pivot.
//
// Phrase ids (not-arrived/delayed/arrived/etc.) are kept as opaque internal keys even
// though the translated meaning behind them changed completely (from the old postal
// domain to an everyday window/room domain). Renaming them added no learner-facing value
// and would have required touching semanticSpace.test.ts, ANCHOR_ID and NEGATION_PAIR.
//
// No em dash and no en dash, per project text rules.

import type { SemanticSpaceLabDict } from '../../he/behind-ai/semanticSpaceLab';

export const semanticSpaceLab: SemanticSpaceLabDict = {
    selector: {
        label: 'Choose an experiment',
        map: 'Neighbours in the space',
        negation: 'The negation trap',
    },

    map: {
        title: 'The meaning map',
        subtitle: 'Select a sentence',
        legendTitle: 'Meaning regions',
        neighborsTitle: 'Nearest neighbours',
        neighborsSubtitle: 'By closeness in the space',
        closenessTo: 'Closeness to',
        closest: 'Closest',
        toneNear: 'Close on the map',
        toneMid: 'Medium distance on the map',
        toneFar: 'Far on the map',
        closestNow: 'The closest sentence now is:',
        selectHint: 'Pick a sentence on the map and watch the list of nearest neighbours update straight away.',
        note: 'Distance on the map is meaning. A close sentence is one the model treats as related, even when the words differ. A far sentence is one with a weak relation.',
    },

    negation: {
        title: 'Close in words, opposite in meaning',
        subtitle: 'Two sentences, almost the same words',
        baseLabel: 'The original sentence',
        oppositeLabel: 'Without the negation word',
        sharedChip: 'Almost the same words',
        oppositeChip: 'Opposite meaning',
        revealButton: 'What this teaches us',
        explanation: 'The two sentences share almost every word, so they look close. But one word, "not", flips the meaning end to end. One says the window is open, the other says it is not. Closeness in words is no guarantee of the same meaning.',
        bridge: 'This is not a contradiction to the map rule. Closeness in the space is a learned, useful signal, but not a perfect one: sometimes almost identical wording hides an opposite meaning. So the model also has to weigh the context and the relations between the words, not just which words appeared.',
    },

    clusters: {
        complaint: 'Discomfort',
        status: 'Room state',
        action: 'Everyday activity',
        unrelated: 'Unrelated',
    },

    phrases: {
        'not-arrived': 'The window is not open',
        'customer-waiting': "I'm feeling too warm",
        'not-received': "It's stuffy in here",
        'delayed': 'They left it closed since morning',
        'status-not-updated': 'The air conditioner is off',
        'courier-on-way': 'The room needs airing out',
        'arrived': 'The window is open',
        'center-checking': 'She is watering the plants',
        'agent-contacted': 'He turned off all the lights',
        'draft-update': 'They are cleaning the kitchen',
        'recipe': 'A recipe for chocolate cake',
        'weather': "Tomorrow's weather forecast",
    },

    disclaimer: 'A teaching map in two dimensions only. It illustrates the idea of closeness, but the distances drawn here are not an exact copy of the real space.',
};
