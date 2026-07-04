// i18n/locales/en/behind-ai/logitsSoftmaxLab.ts
//
// English Logits and Softmax lab data for Chapter 8 (Logits & Softmax). Hebrew is
// the source of truth.
//
// The core idea: before the model picks the continuation, it gives every option a raw
// score (a logit). Softmax turns those scores into a probability distribution: every
// continuation gets a percentage, and they add up to 100. Changing a context detail
// moves the scores, and so moves the percentages. The learner can also tune each score
// by hand and watch the probabilities change instantly.
//
// All of the scores and percentages are a teaching illustration, not real model output.
// The continuations are shown as full phrases for easy reading, but they stand in for
// the competition over the next token, not an exact internal trace.
//
// i18n: all of the language dependent text and data (continuations, contexts, labels)
// comes from data per locale. The Softmax computation, the tint mapping and the
// direction (RTL/LTR) stay in the component.
//
// No em dash (U+2014), no en dash (U+2013).

/** A single possible continuation out of several competitors. */
export interface LabContinuation {
    /** Stable id, not translated. */
    id: string;
    /** The continuation label, for example "was delayed". */
    label: string;
}

/** A context detail you can pick. Each detail sets a different raw score per continuation. */
export interface LabContext {
    /** Stable id, not translated. */
    id: string;
    /** The button label. */
    control: string;
    /** The context clue added to the prompt before "The package probably...". Empty in the neutral state. */
    promptExtra?: string;
    /** A short note: why this detail moves the scores. */
    note: string;
    /** Maps a continuation id to its raw score in this state (a teaching illustration). */
    scores: Record<string, number>;
}

export interface LogitsSoftmaxLabContent {
    /** The section headings on the page (above the component). */
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    /** The component's inner heading. */
    heading: string;
    /** A structural Latin subtitle (stays as is in every language). */
    kicker: string;
    /** The start of the sentence the model completes. */
    promptBase: string;
    promptLabel: string;
    pickContextLabel: string;
    scoreLabel: string;
    probabilityLabel: string;
    topLabel: string;
    adjustTitle: string;
    adjustHint: string;
    resetScores: string;
    softmaxNoteTitle: string;
    softmaxNote: string;
    continuationNote: string;
    disclaimer: string;
    /** Labels for screen readers. */
    sr: { increase: string; decrease: string; contextGroup: string };
    continuations: LabContinuation[];
    contexts: LabContext[];
}

export const logitsSoftmaxLab: LogitsSoftmaxLabContent = {
    sectionEyebrow: 'Logits & Softmax Lab',
    sectionTitle: 'Change the context or the scores, and watch the probabilities shift',
    sectionIntro:
        'The same start of a sentence, several possible continuations. Each continuation gets a raw score, and Softmax turns the scores into percentages that add up to 100. Pick a context detail, or tune the scores yourself, and see who is leading and by how much.',
    heading: 'From raw scores to probabilities',
    kicker: 'Logits & Softmax Lab',
    promptBase: 'The package probably...',
    promptLabel: 'The full prompt',
    pickContextLabel: 'Pick a context detail',
    scoreLabel: 'Raw score',
    probabilityLabel: 'Probability',
    topLabel: 'Currently leading',
    adjustTitle: 'Tune the scores yourself',
    adjustHint: 'Press the plus or the minus to change a continuation score. Notice how the percentages respond instantly.',
    resetScores: 'Reset to the context scores',
    softmaxNoteTitle: 'How scores become percentages',
    softmaxNote:
        'Softmax splits 100 percent among the continuations by their scores: a higher score gets a bigger share. A small gap in score can open a noticeable gap in percentages, which is why even a small change in context already moves the picture.',
    continuationNote:
        'The continuations are shown here as full phrases so they are easy to read. In practice the model ranks the next token step by step. This is an illustration of that same competition, not an exact internal trace of the model.',
    disclaimer:
        'The scores and percentages here are a teaching illustration, not real model output. They are meant to show how scores become probabilities, and how the context moves them. A high score means the continuation is more likely per the text, not that it is true in the world.',
    sr: {
        increase: 'Increase the score of',
        decrease: 'Decrease the score of',
        contextGroup: 'Choosing a context detail',
    },
    continuations: [
        { id: 'delayed', label: 'was delayed' },
        { id: 'delivered', label: 'was delivered' },
        { id: 'pickup', label: 'is awaiting pickup' },
        { id: 'lost', label: 'was lost' },
    ],
    contexts: [
        {
            id: 'neutral',
            control: 'No extra detail',
            note: 'With no extra detail, "was delayed" gets the highest score, but the gap between the continuations is not huge. This is still an estimate, not knowledge.',
            scores: { delayed: 4, delivered: 3, pickup: 2, lost: 1 },
        },
        {
            id: 'delay',
            control: 'Not scanned yet',
            promptExtra: 'The package left the hub yesterday and has not been scanned yet.',
            note: 'The clue "has not been scanned yet" strengthens "was delayed" and sharpens the distribution around it. The exact same continuations, different scores.',
            scores: { delayed: 5, delivered: 2, pickup: 2, lost: 3 },
        },
        {
            id: 'delivered',
            control: 'Delivery confirmation',
            promptExtra: 'The system shows a delivery confirmation.',
            note: 'A delivery confirmation hands the lead to "was delivered". The model did not check reality, it only weighed what is written in the context.',
            scores: { delayed: 3, delivered: 5, pickup: 2, lost: 2 },
        },
        {
            id: 'pickup',
            control: 'Awaiting pickup',
            promptExtra: 'The latest status is "awaiting pickup".',
            note: 'A status of "awaiting pickup" jumps the matching continuation to the top, without changing the set of continuations. The context decides who leads.',
            scores: { delayed: 2, delivered: 3, pickup: 5, lost: 2 },
        },
    ],
};
