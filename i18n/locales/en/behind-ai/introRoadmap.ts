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
            title: 'The request comes in',
            explanation: 'The user writes a request, and it enters along with the context and the system instructions.',
            detail: {
                whatHappens: 'Your request joins the system instructions and everything already said in the conversation.',
                whyItMatters: 'The model does not see only the last sentence, but the whole context around it.',
                whatNext: 'Next we will see how all this text becomes work units.',
            },
        },
        tokenize: {
            title: 'Breaking into tokens',
            explanation: 'The text breaks into work units the model can process.',
            detail: {
                whatHappens: 'The text is cut into tokens: sometimes a whole word, sometimes part of a word or a symbol.',
                whyItMatters: 'This is the language the model actually works with, not letters and not necessarily words.',
                whatNext: 'In the chapter on tokenization we will see why a word and a token are not always the same thing.',
            },
        },
        ids: {
            title: 'An ID for every token',
            term: 'Token IDs',
            explanation: "Each token gets a numeric ID from the model's vocabulary.",
            detail: {
                whatHappens: "Each token is mapped to a fixed numeric ID from the model's vocabulary.",
                whyItMatters: 'The number is an address in the vocabulary. It does not carry meaning yet.',
                whatNext: 'Next we will see how the ID becomes a representation that encodes meaning.',
            },
        },
        // Zone B - from tokens to representations
        embedding: {
            title: 'Numeric representation',
            term: 'Embedding',
            explanation: 'The ID becomes a numeric vector the model can compute on.',
            detail: {
                whatHappens: 'The ID becomes a vector: a list of numbers the model can compute on.',
                whyItMatters: 'Tokens with close meanings get numbers that are close to one another.',
                whatNext: 'In the chapter on meaning we will see how the direction of the vector encodes relationships between words.',
            },
        },
        position: {
            title: 'Position and order',
            explanation: 'The model needs to know where each token sits relative to the others.',
            detail: {
                whatHappens: 'For each token, information about its position relative to the other tokens is kept.',
                whyItMatters: '"Dog bites man" is different from "man bites dog", and order changes meaning.',
                whatNext: 'This order stays with the model throughout the entire computation.',
            },
        },
        context: {
            title: 'Context window',
            explanation: 'The model takes into account the conversation, the instructions, and the tokens already produced.',
            detail: {
                whatHappens: 'The model takes into account the conversation, the instructions, and the tokens produced so far.',
                whyItMatters: 'The same word can take on a different meaning depending on what surrounds it.',
                whatNext: 'Next we will see how this context actually enters the computation.',
            },
        },
        // Zone C - computing the context
        attention: {
            title: 'Attention to context',
            term: 'Attention',
            explanation: 'The tokens check which parts of the context matter right now.',
            detail: {
                whatHappens: 'Each token checks which other tokens matter to it right now.',
                whyItMatters: 'This is how understanding is built: a word like "he" knows who it refers to.',
                whatNext: "In the coming chapters we will see how context changes the model's decision.",
            },
        },
        mix: {
            title: 'Mixing information',
            explanation: 'Information from the context mixes in and updates the representations.',
            detail: {
                whatHappens: "Information from the context mixes in and updates each token's representation.",
                whyItMatters: 'The representation stops being "a single word" and becomes "a word within a context".',
                whatNext: 'This processing repeats again and again across layers.',
            },
        },
        layers: {
            title: 'Depth layers',
            term: 'Transformer',
            explanation: 'The processing repeats across many layers, and each layer sharpens the representation.',
            detail: {
                whatHappens: 'The same processing repeats across many layers, one after another.',
                whyItMatters: 'Each layer sharpens the representation and adds understanding.',
                whatNext: 'At the end of the layers, an up-to-date internal representation forms.',
            },
        },
        state: {
            title: 'Up-to-date internal representation',
            explanation: 'An internal state forms that summarizes the context at the current moment.',
            detail: {
                whatHappens: 'An internal state forms that summarizes the entire context at the current moment.',
                whyItMatters: 'The next token will be derived from this state.',
                whatNext: 'Now the model is ready to rank the options.',
            },
        },
        // Zone D - from representation to answer
        logits: {
            title: 'Raw scores',
            term: 'Logits',
            explanation: 'The model assigns raw scores to the possible next tokens.',
            detail: {
                whatHappens: 'The model assigns a raw score to every possible token in the vocabulary.',
                whyItMatters: 'This score is not a percentage yet, just a measure of "how well it fits".',
                whatNext: 'Next the scores will turn into probabilities.',
            },
        },
        softmax: {
            title: 'From score to probability',
            term: 'Softmax',
            explanation: 'The scores turn into a probability distribution.',
            detail: {
                whatHappens: 'The raw scores turn into a distribution that adds up to 100%.',
                whyItMatters: 'Now we can talk about "how likely" each next token is.',
                whatNext: 'The decoding rules will choose from the distribution.',
            },
        },
        decoding: {
            title: 'Choosing the next token',
            term: 'Decoding',
            explanation: 'The decoding rules shape which next token is actually chosen.',
            detail: {
                whatHappens: 'The decoding rules determine how the next token is chosen from the probabilities.',
                whyItMatters: 'The same distribution can lead to a more predictable or a more creative choice.',
                whatNext: 'The chosen token joins the answer.',
            },
        },
        loop: {
            title: 'Looping until an answer',
            explanation: 'The chosen token joins the answer, and then the whole thing runs again.',
            detail: {
                whatHappens: 'The chosen token joins the answer, and then the whole route runs again for the next token.',
                whyItMatters: 'This is how a full answer is built, token after token, until a stop signal.',
                whatNext: 'In the first chapter you will see this loop working on a real request.',
            },
        },
    },
};
