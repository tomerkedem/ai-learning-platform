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
        titleLead: 'How does text become',
        titleHighlight: 'a number that carries meaning?',
        lede: 'The engine does not see words. Every word becomes a token, every token gets an ID number, and the number points to a row in a big table. That row is a vector, a list of numbers the model learned in order to represent meaning. That is the embedding.',
        chipObject: 'Follow a word as it turns into a number',
        chipMeaning: 'See how the meaning vector is built',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'The engine sees numbers, not words',
        lock: 'Learned in training, looked up in a chat',
        practical: 'Text became a number, now we can compute',
    },

    // Quick guess: text only; the icon, correct answer, and poses are structural.
    // Option ids (address/meaning/importance) are stable page keys, not translated.
    // address = the correct answer, meaning/importance = wrong, with a why.
    guess: {
        eyebrow: 'Quick guess',
        title: 'The word "not" gets the number 17. What is that number?',
        subtitle: 'Guess from what you already know about tokens.',
        prompt: '"not" → 17',
        invite: 'Think for a second: is this number already the meaning, or just an address?',
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

    // Plain words: what an embedding really is (after the guess, before the demo)
    plain: {
        eyebrow: 'In plain words',
        title: 'So what is an embedding, really?',
        lines: [
            'Every token gets an ID number, and the number points to a fixed row in a table.',
            'The row is a vector: a list of numbers, not a single number.',
            'These numbers were learned in training, so the vector represents the meaning of the token. A vector like that is called an embedding.',
            'Every embedding is a vector, but not every vector is an embedding. An embedding is a vector the model learned to represent meaning with.',
        ],
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
        title: 'From a table to a vector',
        body: 'The embedding table is a huge list of rows, one row per token in the vocabulary. The Token ID is the row number. The model goes to that row, and its contents are the vector. That is how one address becomes a list of numbers that represents meaning.',
    },

    // Training vs inference: the values were learned once in training and looked up every chat
    trainingInference: {
        title: 'Learned once, looked up every chat',
        body: 'The values in the vector were learned once, during training. In a chat the model does not train a new vector from scratch. It just looks up the vector it already learned, and then the model layers process it based on the context of the sentence.',
    },

    // Lookup lab: from a word to numbers (Token ID -> table row -> vector). Structure lives in the component.
    embeddingLookup: {
        eyebrow: 'Lab: from a word to numbers',
        title: 'The Embedding machine',
        intro: 'Pick a word and follow it as it turns into an ID number and then into a row of numbers in a table. That is what the engine actually receives.',
        pickWord: 'Pick a word',
        idNote: 'an address, not meaning',
        tableTitle: 'The embedding table',
        tableHint: 'One row per token. The Token ID is the row number.',
        vectorTitle: 'The vector',
        vectorNote: 'A list of numbers. This is the word embedding, and this is what the engine computes on.',
        learnedLabel: 'Learned',
        randomLabel: 'Random',
        learnedNote: 'These values were learned in training. A row like this is an embedding: a vector with learned meaning.',
        randomNote: 'Random numbers are a vector, but not an embedding. Nothing in them was learned. That is why every embedding is a vector, but not every vector is an embedding.',
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

    // Understanding lock: where the vector numbers came from (training vs inference). Correct is index 0.
    lock: {
        title: 'Understanding lock',
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
