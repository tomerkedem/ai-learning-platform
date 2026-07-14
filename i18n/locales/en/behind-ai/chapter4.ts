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
        lede: 'Every token has a Token ID, and that ID points to a row in the embedding table. That row holds the vector learned during training, and it represents patterns and relationships the model learned from data.',
        chipObject: 'Follow a token from its Token ID to its vector',
        chipMeaning: 'See the learned vector being looked up for a token',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'The engine sees numbers, not words',
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

    // Plain words: what an embedding really is (after the guess, before the demo)
    plain: {
        eyebrow: 'In plain words',
        title: 'So what is an embedding, really?',
        lines: [
            'Every token already has an ID number, and that number points to a fixed row in a table.',
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
        title: 'What is the embedding table?',
        lines: [
            'The embedding table is a large table of number rows that were learned during training. It is not a dictionary: it holds no written definitions, and you cannot read it like text.',
            'The Token ID is the row number, an address and nothing more. It does not carry the meaning itself.',
            'The row that the address leads to holds the token vector: the list of numbers learned for it.',
            'The values were learned once, in training. During use the model looks up the matching row, it does not learn it again.',
        ],
        note: 'Most numbers in a row have no name a person can read. The table shown here is a small illustration, with few rows and few values. A real table has far more tokens and far more dimensions.',
    },

    // Training vs inference: the values were learned once in training and looked up every chat
    sequence: {
        eyebrow: 'From tokens to a sentence',
        title: 'So what happens to a whole sentence?',
        intro: 'Now let us pull the vectors together into a wider picture of the sentence.',
        steps: [
            {
                title: 'Every token gets a vector',
                body: 'Each token points to its own row in the table and takes its vector from there.',
            },
            {
                title: 'The model processes them together',
                body: 'The model looks at the sequence as a whole, and each representation shifts according to the words around it.',
            },
            {
                title: 'At the end you see one teaching representation',
                body: 'It sums up the pattern that forms once all the tokens have been processed together and in context.',
            },
        ],
        clarify: 'A whole sentence has no Token ID of its own, and no extra row in the embedding table. The representation you see at the end is a teaching illustration of the processed sequence.',
    },

    lab2: {
        eyebrow: 'Laboratory 2',
        title: 'From a token to its representation',
        goal: 'The sentence already arrives as a sequence of tokens. Here you follow a single token: from its Token ID to the learned row it points to.',
        stepLabel: 'Step',
        steps: [
            {
                title: 'Pick a sentence and run it',
                hint: 'Choose a scenario and press "Play it". The sentence arrives already split into tokens, ready to inspect.',
            },
            {
                title: 'Pick a token and follow its representation',
                hint: 'Click a token to see its Token ID. The ID is an address, and it points to a row in the embedding table.',
            },
            {
                title: 'Watch the pattern change',
                hint: 'Pick a token and watch the numeric view change. The bars and axis names are a teaching illustration only.',
            },
        ],
        conclusionLabel: 'Laboratory conclusion',
        waiting: {
            step2: 'Start with Step 1 and press "Play it". Then you can pick a token and follow it from its Token ID to its representation.',
            step3: 'This view updates once the sentence has been run and a token is picked.',
        },
    },

    labConclusion: {
        title: 'What did we see?',
        body: 'The sentence already arrived as a sequence of tokens. Every token has a Token ID that points to a row in the embedding table, and that row holds the vector learned for it. What you saw is a teaching visualization of one thing: changing the input changes the numeric representation too. How closeness between representations is measured is the next chapter.',
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
