// i18n/locales/en/behind-ai/semanticSpaceLab.ts
//
// English strings for the Chapter 5 "Semantic Space" laboratory.
//
// Structural keys (phrase ids, cluster keys) stay stable and are never translated; only
// the values are. Coordinates and cluster membership live in the structural file
// app/behind-the-scenes-ai/chapter-5/semanticSpace.ts.
//
// The negation pair is base='not-arrived' vs opposite='arrived'. The two English phrases
// are kept lexically as close as English allows ("has not arrived" vs "has arrived") so
// that exactly one token, "not", is unique to the base sentence and gets highlighted as
// the negation pivot.
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
        subtitle: 'Select or drag a sentence',
        legendTitle: 'Meaning regions',
        reset: 'Reset',
        neighborsTitle: 'Nearest neighbours',
        neighborsSubtitle: 'By closeness in the space',
        closenessTo: 'Closeness to',
        closest: 'Closest',
        toneNear: 'Close, related meaning',
        toneMid: 'Moderately close',
        toneFar: 'Far, different meaning',
        closestNow: 'The closest sentence now is:',
        selectHint: 'Pick a sentence on the map, or drag it to another region, and watch the list of nearest neighbours update straight away.',
        dragHint: 'Drag me',
        draggedHint: 'Notice that? The closer you move a sentence to another region, the more its nearest neighbours change. Close in the space means close in meaning.',
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
        explanation: 'The two sentences share almost every word, so they look close. But one word, "not", flips the meaning end to end. One says the package arrived, the other says it did not. Closeness in words is no guarantee of the same meaning.',
        bridge: 'That is why it is not enough to look at the words alone. You need to understand how each word changes the meaning of the rest, not just which words appeared.',
    },

    clusters: {
        complaint: 'Customer complaint',
        status: 'Delivery status',
        action: 'Service action',
        unrelated: 'Unrelated',
    },

    phrases: {
        'not-arrived': 'The package has not arrived',
        'customer-waiting': 'The customer has been waiting a week',
        'not-received': 'I never received my order',
        'delayed': 'The delivery is running late',
        'status-not-updated': 'The status was not updated',
        'courier-on-way': 'The courier is on the way to you',
        'arrived': 'The package has arrived',
        'center-checking': 'Support is reviewing the case',
        'agent-contacted': 'An agent contacted the customer',
        'draft-update': 'Draft an update note for the customer',
        'recipe': 'A recipe for chocolate cake',
        'weather': 'Tomorrow weather forecast',
    },

    disclaimer: 'A teaching map in two dimensions only. It illustrates the idea of closeness, but the distances drawn here are not an exact copy of the real space.',
};
