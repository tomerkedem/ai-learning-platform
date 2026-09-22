// i18n/locales/en/behind-ai/decodingLab.ts
//
// English (en, LTR) data for the "Decoding Lab" of Chapter 9 (Decoding: Choosing the
// Next Token). Hebrew is the source of truth and defines the type (DecodingLabContent).
//
// Core idea: the probabilities already exist (that was Chapter 8) and are fixed here. The
// learner changes only the decoding style (conservative, balanced, open) and presses "Try
// another choice", and sees how the same distribution can lead to different tokens. A
// conservative style stays on the most likely option, an open style gives lower options a
// chance too.
//
// The choices are not random: each style carries a fixed pick sequence, so the learner
// sees variety while tests stay stable. The probabilities and choices are a teaching
// illustration only, not real model output, and no style checks whether a continuation is
// true in the world.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { DecodingLabContent } from '../../he/behind-ai/decodingLab';

export const decodingLab: DecodingLabContent = {
    sectionEyebrow: 'Decoding Lab',
    sectionTitle: 'Same distribution, a different decoding style: who gets chosen?',
    sectionIntro:
        'The probabilities here are fixed and do not change. Change only the decoding style, and press "Try another choice". The main idea: the same distribution, a different selection style, so a different token may be selected. A conservative style stays on the most likely option, an open style gives lower options a chance too.',
    heading: 'Choosing the next token',
    kicker: 'Decoding Lab',
    promptBase: 'The old door...',
    promptLabel: 'The sentence being continued',
    distributionLabel: 'The fixed distribution',
    probabilityLabel: 'Probability',
    styleLabel: 'Pick a decoding style',
    stabilityLabel: 'Stability',
    varietyLabel: 'Variety',
    selectedLabel: 'The chosen token',
    whyLabel: 'Why it was chosen',
    replayButton: 'Try another choice',
    continuationNote:
        'The continuations are shown here as whole phrases so they are easy to read. In practice the model chooses the next token step by step. This is an illustration of the choice, not an exact internal trace of the model.',
    disclaimer:
        'The probabilities and choices here are a teaching illustration, not real model output. They are meant to show how the decoding style decides who gets chosen from the same distribution. No style checks whether the continuation is true in the world.',
    sr: {
        styleGroup: 'Choosing the decoding style',
        replay: 'Show another choice in the same style',
        distribution: 'The probability distribution of the continuations',
    },
    continuations: [
        { id: 'creak', label: 'creaked open', prob: 52 },
        { id: 'locked', label: 'stayed locked', prob: 24 },
        { id: 'fell', label: 'fell off its hinges', prob: 16 },
        { id: 'secretRoom', label: 'led to a hidden room', prob: 8 },
    ],
    styles: [
        {
            id: 'conservative',
            control: 'Conservative',
            summary: 'Stays on the most likely option. Predictable, stable output.',
            stability: 3,
            variety: 1,
            picks: ['creak', 'creak', 'creak', 'creak'],
            whenTop: 'The conservative style almost always stays on the option with the highest probability, so the output is predictable and stable.',
            whenLower: 'Even when there is room for another option, the conservative style tends to fall back to the leading option.',
        },
        {
            id: 'balanced',
            control: 'Balanced',
            summary: 'Usually picks among the likely options, with a little variety.',
            stability: 2,
            variety: 2,
            picks: ['creak', 'locked', 'creak', 'fell'],
            whenTop: 'The balanced style usually picks among the likely options, and here the leader came up.',
            whenLower: 'The balanced style gave a chance to another likely option, not the highest but still close.',
        },
        {
            id: 'creative',
            control: 'Open',
            summary: 'Gives lower options a chance too. More variety, less stability.',
            stability: 1,
            variety: 3,
            picks: ['locked', 'creak', 'fell', 'secretRoom', 'creak'],
            whenTop: 'Even in an open style the leading option is still the most likely, so it gets chosen part of the time.',
            whenLower: 'The open style gave a chance to a less likely option. That adds variety, but it does not make it correct.',
        },
    ],
};
