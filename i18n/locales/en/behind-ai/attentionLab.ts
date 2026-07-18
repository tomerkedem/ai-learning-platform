// i18n/locales/en/behind-ai/attentionLab.ts
//
// English sentence-lab data for Chapter 6 (Attention). Hebrew is the source of truth.
//
// The tokens, weights and pair indices are language dependent, because they follow
// the word order of the English sentence. English reads left to right (LTR), so the
// variants are defined here for English on their own. The tension -> color mapping
// stays in the component.
//
// No em dash (U+2014), no en dash (U+2013).

import type { AttentionLabContent } from '../../he/behind-ai/attentionLab';

export const attentionLab: AttentionLabContent = {
    sectionEyebrow: 'Attention Lab',
    sectionTitle: 'Change the sentence, and see who matters now',
    sectionIntro:
        'A good answer starts with the model weighing the relationships between the parts of the sentence correctly. Change something small: remove "but", swap the status, or flip the negation, and watch how the focus of attention and the link between the parts shift right away.',
    heading: 'Change something in the sentence, and see where attention moves',
    kicker: 'Attention sentence lab',
    pickHint: 'Pick an edit to the sentence. We will see how attention and the link between the parts change.',
    nowLabel: 'The sentence now',
    relationLabel: 'The link being weighed:',
    disclaimer:
        'This is a simplified teaching illustration, not a full picture of the Attention mechanism in a real model. The numbers here are meant to show the idea: a small change in the sentence moves the focus of attention and the strength of the link between the parts. The percentage next to each word is a weight at this moment, not a fixed importance score for the word.',
    tensionLabels: {
        high: 'strong link',
        medium: 'medium link',
        low: 'weak link',
        shifted: 'focus moved',
    },
    sr: {
        attention: 'attention strength',
        percent: 'percent',
        inPair: 'part of the main link',
        strength: 'link strength',
        group: 'choose an edit to the sentence',
    },
    variants: [
        {
            id: 'base',
            control: 'Original',
            sentence: 'The package was marked delivered, but the customer never received it.',
            tokens: ['The', 'package', 'was', 'marked', 'delivered', 'but', 'the', 'customer', 'never', 'received', 'it'],
            weights: [0.35, 0.5, 0.3, 0.4, 0.95, 0.6, 0.3, 0.3, 0.85, 0.9, 0.35],
            pair: [4, 9],
            pairStrength: 0.9,
            tension: 'high',
            caption:
                'The main tension is between "delivered" and "received". That is where attention has to be strong, because this is the contradiction the answer needs to handle, not just the fact that a package is missing.',
        },
        {
            id: 'no-abal',
            control: 'Without "but"',
            sentence: 'The package was marked delivered. The customer never received it.',
            tokens: ['The', 'package', 'was', 'marked', 'delivered', 'The', 'customer', 'never', 'received', 'it'],
            weights: [0.35, 0.5, 0.3, 0.4, 0.75, 0.3, 0.3, 0.6, 0.7, 0.35],
            pair: [4, 8],
            pairStrength: 0.5,
            tension: 'medium',
            caption:
                'We removed "but". Both parts are still here, but now they just sit side by side. "But" is the signal that tells the model there is a contrast worth weighing more strongly. Without it, the link is less marked.',
        },
        {
            id: 'status',
            control: '"delivered" becomes "in transit"',
            sentence: 'The package is still in transit, but the customer never received it.',
            tokens: ['The', 'package', 'is', 'still', 'in', 'transit', 'but', 'the', 'customer', 'never', 'received', 'it'],
            weights: [0.4, 0.5, 0.3, 0.35, 0.3, 0.45, 0.35, 0.3, 0.3, 0.4, 0.45, 0.3],
            pair: [5, 10],
            pairStrength: 0.2,
            tension: 'low',
            caption:
                'We changed the status to "in transit", and now there is no contradiction. It is obvious that a package still on the way has not been received yet. There is no special tension to weigh, so attention spreads out more flatly.',
        },
        {
            id: 'received-late',
            control: '"never received" becomes "received late"',
            sentence: 'The package was marked delivered, but the customer received it late.',
            tokens: ['The', 'package', 'was', 'marked', 'delivered', 'but', 'the', 'customer', 'received', 'it', 'late'],
            weights: [0.35, 0.5, 0.3, 0.4, 0.6, 0.4, 0.3, 0.3, 0.55, 0.3, 0.9],
            pair: [4, 10],
            pairStrength: 0.4,
            tension: 'shifted',
            caption:
                'We flipped the negation. Now the customer did receive it, just late. The contradiction is gone, and the weight moves to "late", the new detail that shapes the answer. One small word changed the whole focus.',
        },
        {
            id: 'pronoun',
            control: 'The pronoun "it"',
            sentence: 'The package was marked delivered, but the customer never received it.',
            tokens: ['The', 'package', 'was', 'marked', 'delivered', 'but', 'the', 'customer', 'never', 'received', 'it'],
            weights: [0.85, 0.9, 0.3, 0.4, 0.5, 0.35, 0.3, 0.35, 0.4, 0.45, 0.9],
            pair: [10, 1],
            pairStrength: 0.85,
            tension: 'high',
            caption:
                'The word "it" does not stand alone. The model has to link it back to "package", otherwise it is not clear what the customer is talking about. This is attention too: the link between a word and what it stands for.',
        },
    ],
    focus: {
        title: 'Same sentence, different focus',
        intro:
            'Until now we changed the sentence. But attention also shifts without changing a single word. It all depends on what the model is processing at this moment. Same exact sentence: pick what it is processing now, and see where attention moves.',
        axisChangedLabel: 'Change the sentence ⟶ different attention',
        axisSameLabel: 'Same sentence, different focus ⟶ different attention',
        prompt: 'What is the model processing right now?',
        nowFocusLabel: 'The model is now processing:',
        sentence: 'The package was marked delivered, but the customer never received it.',
        tokens: ['The', 'package', 'was', 'marked', 'delivered', 'but', 'the', 'customer', 'never', 'received', 'it'],
        srGroup: 'choose the current processing focus',
        states: [
            {
                id: 'contradiction',
                label: 'the contradiction',
                weights: [0.35, 0.5, 0.3, 0.4, 0.95, 0.6, 0.3, 0.3, 0.85, 0.9, 0.35],
                pair: [4, 9],
                pairStrength: 0.9,
                tension: 'high',
                caption:
                    'We did not change a single word. Right now the model is processing the contradiction at the heart of the sentence, so the strong link is between "delivered" and "received" with the negation.',
            },
            {
                id: 'pronoun',
                label: 'the word "it"',
                weights: [0.85, 0.9, 0.3, 0.4, 0.5, 0.35, 0.3, 0.35, 0.4, 0.45, 0.9],
                pair: [10, 1],
                pairStrength: 0.85,
                tension: 'shifted',
                caption:
                    'The exact same sentence. Now the model is processing the word "it" and needs to know what it refers to, so the strong link moves to "package". The words did not move, only the processing focus did.',
            },
        ],
    },
};
