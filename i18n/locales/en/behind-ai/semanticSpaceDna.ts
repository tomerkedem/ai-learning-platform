// i18n/locales/en/behind-ai/semanticSpaceDna.ts
//
// English content for Chapter 5's semantic DNA comparison section. This is an
// independent Chapter 5 dataset, not dependent on chapter4Lab or Chapter 4's
// SENTENCE_STRUCTS.
//
// No em dash and no en dash, per project text rules.

import type { semanticSpaceDna as HeDna } from '../../he/behind-ai/semanticSpaceDna';

export const semanticSpaceDna: typeof HeDna = {
    sentences: {
        'window-not-open': { text: 'The window is not open', ttsLine: 'The window is not open. A complaint about the room, high in closedness.' },
        'window-shut': { text: 'The window is shut', ttsLine: 'The window is shut. Different words, same direction of meaning.' },
        'window-is-open': { text: 'The window is open', ttsLine: 'The window is open. Same topic, but no closedness, so the pattern shifted.' },
        'room-is-cold': { text: 'The room is cold', ttsLine: 'The room is cold. Similar discomfort, but not about the window being closed.' },
        'cat-on-couch': { text: 'The cat is sleeping on the couch', ttsLine: 'The cat is sleeping on the couch. A sentence from another world, unrelated to the room.' },
    },

    genes: {
        roomRelevance: 'Room relevance',
        closedness: 'Window closedness',
        discomfort: 'Discomfort',
    },

    dna: {
        title: 'The meaning inside the vector',
        intro: 'The vector is not a single number. It is a profile of meaning components the model learned. Each rung on the ladder is one meaning component, and the node size shows how strong that component is in the sentence.',
        roleActive: 'You picked',
        roleCompare: 'Compared to',
        twistMeaning: 'The closer the meaning of the two sentences, the tighter the strands wind together. When the meaning drifts, they pull apart.',
        leadShared: (names) => `Both sentences are strong on the same meaning components: ${names}. That is why they are close.`,
        leadNone: 'The two sentences light up different components, so they are farther apart.',
        sharedBadge: 'Shared',
        guideSize: 'A bigger node means the component is stronger in that sentence.',
        guideBond: 'A pulsing green bond means a component shared by both sentences, and that is what pulls the meaning closer.',
        stayedClose: 'The meaning stayed close',
        drifted: 'The meaning drifted',
        axesNote: 'The axes here are teaching labels. In a real model the vector holds hundreds or thousands of numeric dimensions that are not readable as human traits.',
    },
};
