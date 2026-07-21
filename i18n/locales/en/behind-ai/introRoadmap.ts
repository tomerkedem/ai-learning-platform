// i18n/locales/en/behind-ai/introRoadmap.ts
// English "map of the main stations" for the Introduction. Shape source: ../../he/behind-ai/introRoadmap.
// Only user-facing text is translated. Structure (station id, zone, viz kind) lives in the view layer.
// `term` keeps the conventional English technical term. No em dash (U+2014), no en dash (U+2013).

export const introRoadmap = {
    // ── Four learning zones, from text to answer (by zone id) ──
    zones: {
        A: {
            title: 'From text to work units',
            caption: 'The request comes in and breaks into units the model can process.',
        },
        B: {
            title: 'From tokens to representations',
            caption: 'Each token becomes numbers and takes its place within the context.',
        },
        C: {
            title: 'Computing the context',
            caption: 'The tokens influence one another until an up-to-date internal representation forms.',
        },
        D: {
            title: 'From representation to answer',
            caption: 'The next token is derived from the representation, and the process repeats until the answer is complete.',
        },
    },

    // ── The 14 main stations (by station id) ──
    stations: {
        // Zone A - from text to work units
        request: {
            title: 'Assembling the input',
            term: 'Prompt',
            explanation: 'The user writes a request, and it enters along with the context and the system instructions.',
            detail: 'The product assembles the current input from the user request, system instructions, and selected context. History, memory, RAG, and tool results are optional, and not all stored information enters the model.',
        },
        tokenize: {
            title: 'Breaking into tokens',
            term: 'Tokenization',
            explanation: 'The text breaks into work units the model can process.',
        },
        ids: {
            title: 'An ID for every token',
            term: 'Token IDs',
            explanation: "Each token gets a numeric ID from the model's vocabulary.",
        },
        // Zone B - from tokens to representations
        embedding: {
            title: 'Numeric representation',
            term: 'Embedding',
            explanation: 'The ID becomes a numeric vector the model can compute on.',
        },
        position: {
            title: 'Position and order',
            term: 'Positional Encoding',
            explanation: 'The model needs to know where each token sits relative to the others.',
        },
        context: {
            title: 'Context window',
            term: 'Context Window',
            detail: 'The context window contains only content available for the current run. It is not necessarily the full stored conversation, saved memory, or retention.',
            explanation: 'The model takes into account the conversation, the instructions, and the tokens already produced.',
        },
        // Zone C - computing the context
        attention: {
            title: 'Attention to context',
            term: 'Attention',
            detail: 'Attention computes dynamic relevance for the current calculation. It can change by layer, position, and generation step; it is not a permanent ranking of words.',
            explanation: 'The tokens check which parts of the context matter right now.',
        },
        mix: {
            title: 'Mixing information',
            term: 'Feed-Forward',
            detail: 'A feed-forward network processes each position in every layer and develops features in its representation.',
            explanation: 'Each token is enriched by a feed-forward network. In large models only a few "experts" out of many run per token.',
        },
        layers: {
            title: 'Depth layers',
            term: 'Transformer',
            explanation: 'The processing repeats across many layers, and each layer sharpens the representation.',
        },
        state: {
            title: 'Up-to-date internal representation',
            term: 'Hidden State',
            detail: 'Each position has an updated internal representation that combines relevant context and continues to change across layers.',
            explanation: 'An internal state forms that summarizes the context at the current moment.',
        },
        // Zone D - from representation to answer
        logits: {
            title: 'Raw scores',
            term: 'Logits',
            detail: 'Logits are raw scores for candidate next tokens. They are not probabilities.',
            explanation: 'The model assigns raw scores to the possible next tokens.',
        },
        softmax: {
            title: 'From score to probability',
            term: 'Softmax',
            detail: 'Softmax converts the scores into a probability distribution. It does not choose the token.',
            explanation: 'The scores turn into a probability distribution.',
        },
        decoding: {
            title: 'Choosing the next token',
            term: 'Decoding',
            detail: 'Decoding chooses or samples a token using the distribution and decoding rules. The highest-probability token is not always selected.',
            explanation: 'The decoding rules shape which next token is actually chosen.',
        },
        loop: {
            title: 'Looping until an answer',
            term: 'Autoregression',
            detail: 'The selected token is appended and the process advances to the next-token step. Practical implementations may reuse previously computed state.',
            explanation: 'The chosen token joins the answer, and then the whole thing runs again.',
        },
    },
};
