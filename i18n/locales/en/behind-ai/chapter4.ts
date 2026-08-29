// i18n/locales/en/behind-ai/chapter4.ts
// English Chapter 4 ("Embeddings: from a meaningless number to meaning").
// Shape source: ../../he/behind-ai/chapter4 (Hebrew is canonical).
//
// Focus: how text becomes a learned numeric representation. Text -> tokens -> Token IDs
// -> a row in the embedding table -> a vector -> processed in context. Values were
// learned in training and looked up at inference. The semantic map (closeness, neighbors)
// belongs to Chapter 5, not here.
//
// Real translation, natural English (not literal). Phone-first and TTS-ready: short
// sentences, no dense paragraphs. The package and delivery anchor is preserved. Fixed
// terms kept: Embedding, Token ID, RAG, Agent, model. No em dash (U+2014) and no en
// dash (U+2013). Mentor bubble text carries no emoji.

import type { Locale } from '@/i18n/config';
import { chapter4Quiz } from './chapter4Quiz';

export const chapter4 = {
    contentLocale: 'en' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 04',
        titleLead: 'Where do the numbers',
        titleHighlight: 'that represent each token come from?',
        lede: 'In the previous chapter we saw how text breaks into tokens, and each token gets a Token ID. But a number like 17 on its own tells the model nothing about what the token means.',
        chipObject: 'From text to tokens to numbers',
        chipMeaning: 'So where does the meaning come from?',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'The engine sees numbers, not words',
        practical: 'Text became a number, now we can compute',
    },

    // F3 RESPOND (M8): the chapter human response layer. The status stays
    // independent; this is only what the mentor says next, on both outcomes.
    mentorRespond: {
        guessCorrect:
            'You separated the thing that points from the thing that holds. That separation is easy to miss, because a number usually does tell us something about quantity or rank. Here it only tells the model where to go.',
        guessWrong:
            'That choice did not come from confusion. It came from a very reasonable assumption: that if the model receives a number, the number itself carries information. It is worth rereading the lines above while asking not what the number says, but where it sends you.',
        quizPass:
            'You are separating the id from the vector it pulls up. That is the distinction that will carry you into the next chapter, when we start talking about closeness between meanings.',
        quizFail:
            'This idea gets clear through action, not through a definition. Go back to the lookup lab, pick one word, and watch what changes in the row that comes back and what stays fixed.',
    },

    // Quick guess: text only; the icon, correct answer, and poses are structural.
    // Option ids (address/meaning/importance) are stable page keys, not translated.
    // address = the correct answer, meaning/importance = wrong, with a why.
    guess: {
        eyebrow: 'Quick guess',
        title: 'The word "not" gets the number 17. What is that number?',
        subtitle: 'Guess from what you already know about tokens.',
        prompt: '"not" → 17',
        invite: 'Pause for a second: what do you think this number represents inside the model?',
        options: {
            address: {
                title: 'An address in the vocabulary',
                desc: 'The number only points to which token this is',
            },
            meaning: {
                title: 'The meaning of "not"',
                desc: 'The number itself already says negation',
                why: 'Tempting, but the number alone carries no meaning. It is a fixed address in the vocabulary. The meaning comes from the row the address points to, and that is the vector we will see next.',
            },
            importance: {
                title: 'How important the word is',
                desc: 'A small number means a less important word',
                why: 'No. The size of the number is arbitrary, it is just an identifier. How important a word is in context is decided in a later stage, in the Attention chapter.',
            },
        },
        successTitle: 'Exactly',
        successExplain:
            'The Token ID is an address, not meaning. The number 17 only says which token this is. The meaning sits in the row the address points to in the embedding table, and that is exactly what opens now.',
        successInsight: 'The token number is an address. The meaning is the vector the address leads to.',
        continueCta: 'Continue to the demo',
        retryLink: 'Guess again',
        wrongTitle: 'Try again',
        retryButton: 'Try again',
    },

    // Bridge to Chapter 5 (Semantic Space): we have a vector per sentence, what happens together
    bridge: 'Now we have a vector for every sentence. In the next chapter we will see what happens when we put many of these vectors together in one space.',

    // Dog/cat intuition: learned vs random vector (See #1). A short example, not a map.
    dogCat: {
        eyebrow: 'Why "learned"',
        title: 'What is the difference between a random vector and a learned one?',
        body: 'The model learned that dog and cat show up in similar contexts, so their vectors can come out similar. A random vector could not do that, it is just numbers with no connection. That is what turns a vector into an embedding: its values were learned, they are not random.',
        labelDog: 'Dog',
        labelCat: 'Cat',
        learnedTag: 'Learned from similar contexts',
        randomTag: 'Random, no connection',
    },

    // From a table to a vector: the explicit bridge from Token ID (address) to the vector (row contents)
    embeddingTable: {
        title: 'How does a Token ID become an Embedding?',
        lines: [
            'In the previous chapter each token got a Token ID. The ID is an address: it only says which token this is, not what it means.',
            'The model holds an embedding table, a large table of number rows learned during training. The Token ID is the row number, and it selects one row from the table.',
            'That row holds an ordered list of numbers, the vector. This is the token\'s initial embedding. The model looks it up from the table, it does not calculate it from the digits of the ID.',
            'Every embedding is a vector, but not every vector is an embedding. An embedding is a vector whose values were learned to represent meaning.',
            'And where were those values learned from? From the training data, the texts the model learned from before your conversation. What appeared there, and in which contexts, shaped what the model could learn. When a subject appeared rarely, or only in narrow contexts, the model had less information from which it could learn about it.',
        ],
        note: 'Most numbers in a row have no name a person can read. The table shown here is a small illustration, with few rows and few values. A real table has far more tokens and far more dimensions.',
    },

    // Training vs inference: the values were learned once in training and looked up every chat
    sequence: {
        eyebrow: 'From tokens to a sentence',
        title: 'So what happens to a whole sentence?',
        intro: 'A sentence is several tokens in a row, and each token goes through the same path on its own.',
        steps: [
            {
                title: 'Every token has its own Token ID',
                body: 'The sentence breaks into tokens, and each token gets its own Token ID.',
            },
            {
                title: 'Every Token ID looks up its own Embedding',
                body: 'Each Token ID points to its own row in the table and looks up a learned vector from it. So the sentence begins as a sequence of embeddings, one per token.',
            },
            {
                title: 'No single row for the sentence',
                body: 'There is no single row in the embedding table that stands for the whole sentence. There is a sequence of rows, one per token.',
            },
        ],
        clarify: 'The Embedding looked up from the table is the starting point. Later the model layers will update the representation based on the context and the words around it.',
    },

    lab2: {
        eyebrow: 'Laboratory 2',
        title: 'From a sentence to a sequence of Embeddings',
        goal: 'The sentence arrives as a sequence of tokens. Here you see that each token gets its own Token ID and looks up its own Embedding, so the sentence begins as a sequence of embeddings, not a single row.',
        stepLabel: 'Step',
        steps: [
            {
                title: 'Pick a sentence and run it',
                hint: 'Choose a scenario and press "Play it". The sentence arrives already split into tokens, ready to inspect.',
            },
            {
                title: 'See the sequence of Token IDs',
                hint: 'Press "Words / IDs" to see all the tokens as a sequence of IDs. Each token gets its own Token ID, and each has its own row in the table. Click a token to see its address.',
            },
        ],
        conclusionLabel: 'Laboratory conclusion',
        waiting: {
            step2: 'Start with Step 1 and press "Play it". Then you will see all the tokens as a sequence, each with its own Token ID.',
        },
    },

    labConclusion: {
        title: 'What did we see?',
        body: 'Every token in the sentence has its own Token ID, and each Token ID looks up its own row from the embedding table. You saw a sequence of Embeddings, not a single Embedding looked up for the whole sentence.',
    },

    trainingInference: {
        title: 'Learned once, looked up every chat',
        body: 'The values in the vector were learned once, during training. In a chat the model does not train a new vector from scratch. It just looks up the vector it already learned, and then the model layers process it based on the context of the sentence.',
    },

    // Lookup lab: from a word to numbers (Token ID -> table row -> vector). Structure lives in the component.
    embeddingLookup: {
        eyebrow: 'Lab: from a word to numbers',
        title: 'The Embedding machine',
        intro: 'Pick a word, look at its Token ID, and follow the row highlighted in the embedding table. That is what the engine actually receives.',
        pickWord: 'Pick a word',
        idNote: 'an address, not meaning',
        tableTitle: 'The embedding table',
        tableHint: 'One row per token. The Token ID is the row number.',
        vectorTitle: 'The vector',
        vectorNote: 'A list of numbers. This is the word embedding, and this is what the engine computes on.',
        rowShown: 'Its learned row is now shown.',
        switchHint: 'Switch between "Learned" and "Random" and see why not every list of numbers is an embedding.',
        learnedLabel: 'Learned',
        randomLabel: 'Random',
        learnedNote: 'These values were learned in training. A row like this is an embedding: a learned numerical representation of the token.',
        randomNote: 'Random numbers are a vector, but not an embedding. Nothing in them was learned. That is why every embedding is a vector, but not every vector is an embedding. The random state here is a teaching contrast only, not what a real model does.',
        viewWords: 'What you see',
        viewNumbers: 'What the engine sees',
        viewNote: 'The engine never sees words. Only these numbers.',
        disclaimer: 'These numbers are illustrative only. A real vector has hundreds or thousands of dimensions that are not human-readable.',
        words: {
            pkg: 'the package',
            not: 'not',
            arrived: 'arrived',
            shipment: 'the shipment',
            lost: 'lost',
            tracking: 'tracking',
        },
    },

    // Check Your Understanding: where the vector numbers came from (training vs inference). Correct is index 0.
    lock: {
        title: 'Check Your Understanding',
        question: 'The word "package" got a Token ID, and a vector was looked up from it. Where did the numbers in the vector come from?',
        options: [
            'They were learned in training, and the model only looks them up now',
            'The model computed them now from scratch, just for this chat',
            'They are the address of the word in the vocabulary',
        ],
        explanationCorrect:
            'Exactly. The vector values were learned in training. During a chat the model looks up the learned vector and processes it in context, it does not train a new vector.',
        explanationWrong:
            'Almost. The numbers are not computed from scratch each chat, and they are not the address. The address is the Token ID. The vector values were learned in training, and the model looks them up and processes them in context.',
    },

    // Practical insight
    practical: {
        title: 'What we gain now that text is a vector',
        lead: 'Once every text is a learned vector, we can compare and compute on it. That powers a lot of what you already know.',
        uses: [
            'Semantic search and source retrieval, the basis of RAG',
            'Text classification and intent detection',
            'Grouping similar tickets in a support center',
            'Agent decisions based on the meaning profile',
        ],
        caveat:
            'But the vector represents meaning, it does not check whether something is true in the world. How we compare vectors, and when closeness is misleading, is exactly the next chapter.',
        mathOptionalLabel: 'Optional math enrichment - not required to continue this course',
        mathLink:
            'Want the math of this closeness in depth? The Vectors chapter, the heart of every model, in the Intuitive Math course',
    },

    // Under the hood (kept for shape; no longer the primary lab wrapper)
    hood: {
        eyebrow: 'Under the hood',
        title: 'Under the hood: from words to numbers',
        helper: 'Open the labs to see how text turns into tokens, numbers, and meaning.',
        labsCount: '3 interactive labs inside',
        intro: 'Want to see the technical step under the meaning? Every word gets a Token ID, and from the sequence of IDs a meaning vector is built. That is the numeric profile that decides how close two sentences are in meaning.',
    },

    // The knowledge check (display text; the numeric skeleton stays in quizData)
    quiz: chapter4Quiz,
};
