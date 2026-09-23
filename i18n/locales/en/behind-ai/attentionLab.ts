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
        'A good answer starts with the model weighing the relationships between the parts of the sentence correctly. Change something small: remove "but", swap the status, or swap the contradicting claim, and watch how the focus of attention and the link between the parts shift right away.',
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
            sentence: 'The light is off, but she says it is on.',
            tokens: ['The', 'light', 'is', 'off', 'but', 'she', 'says', 'it', 'is', 'on'],
            weights: [0.3, 0.5, 0.25, 0.95, 0.6, 0.3, 0.25, 0.35, 0.25, 0.9],
            pair: [3, 9],
            pairStrength: 0.9,
            tension: 'high',
            caption:
                'The main tension is between "off" and "on". That is where attention has to be strong, because this is the contradiction the answer needs to handle.',
        },
        {
            id: 'no-abal',
            control: 'Without "but"',
            sentence: 'The light is off. She says it is on.',
            tokens: ['The', 'light', 'is', 'off', 'She', 'says', 'it', 'is', 'on'],
            weights: [0.3, 0.5, 0.25, 0.75, 0.3, 0.25, 0.35, 0.25, 0.7],
            pair: [3, 8],
            pairStrength: 0.5,
            tension: 'medium',
            caption:
                'We removed "but". Both claims are still here, but now they just sit side by side. "But" is the signal that tells the model there is a contrast worth weighing more strongly. Without it, the link is less marked.',
        },
        {
            id: 'status',
            control: '"off" becomes "flickering"',
            sentence: 'The light is flickering, but she says it is on.',
            tokens: ['The', 'light', 'is', 'flickering', 'but', 'she', 'says', 'it', 'is', 'on'],
            weights: [0.35, 0.5, 0.3, 0.45, 0.35, 0.3, 0.25, 0.4, 0.3, 0.45],
            pair: [3, 9],
            pairStrength: 0.2,
            tension: 'low',
            caption:
                'We changed the state to "flickering", and now there is no real contradiction. A light that is flickering can reasonably be called on. There is no special tension to weigh, so attention spreads out more flatly.',
        },
        {
            id: 'broken',
            control: '"on" becomes "broken"',
            sentence: 'The light is off, but she says it is broken.',
            tokens: ['The', 'light', 'is', 'off', 'but', 'she', 'says', 'it', 'is', 'broken'],
            weights: [0.3, 0.5, 0.25, 0.6, 0.4, 0.25, 0.25, 0.35, 0.25, 0.9],
            pair: [3, 9],
            pairStrength: 0.4,
            tension: 'shifted',
            caption:
                'We swapped the contradicting claim for a new detail that actually fits "off". The contradiction is gone, and the weight moves to "broken", the new detail that shapes the answer. One word changed the whole focus.',
        },
        {
            id: 'pronoun',
            control: 'The pronoun "it"',
            sentence: 'The light is off, but she says it is on.',
            tokens: ['The', 'light', 'is', 'off', 'but', 'she', 'says', 'it', 'is', 'on'],
            weights: [0.3, 0.9, 0.25, 0.5, 0.3, 0.3, 0.25, 0.9, 0.25, 0.45],
            pair: [7, 1],
            pairStrength: 0.85,
            tension: 'high',
            caption:
                'The word "it" does not stand alone. The model has to link it back to "light", otherwise it is not clear what she is talking about. This is attention too: the link between a word and what it stands for.',
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
        sentence: 'The light is off, but she says it is on.',
        tokens: ['The', 'light', 'is', 'off', 'but', 'she', 'says', 'it', 'is', 'on'],
        srGroup: 'choose the current processing focus',
        states: [
            {
                id: 'contradiction',
                label: 'the contradiction',
                weights: [0.3, 0.5, 0.25, 0.95, 0.6, 0.3, 0.25, 0.35, 0.25, 0.9],
                pair: [3, 9],
                pairStrength: 0.9,
                tension: 'high',
                caption:
                    'We did not change a single word. Right now the model is processing the contradiction at the heart of the sentence, so the strong link is between "off" and "on".',
            },
            {
                id: 'pronoun',
                label: 'the word "it"',
                weights: [0.3, 0.9, 0.25, 0.5, 0.3, 0.3, 0.25, 0.9, 0.25, 0.45],
                pair: [7, 1],
                pairStrength: 0.85,
                tension: 'shifted',
                caption:
                    'The exact same sentence. Now the model is processing the word "it" and needs to know what it refers to, so the strong link moves to "light". The words did not move, only the processing focus did.',
            },
        ],
    },
};
