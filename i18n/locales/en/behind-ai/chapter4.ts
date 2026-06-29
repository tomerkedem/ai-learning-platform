// i18n/locales/en/behind-ai/chapter4.ts
// English Chapter 4 ("Embeddings: from a meaningless number to meaning").
// Shape source: ../../he/behind-ai/chapter4 (Hebrew is canonical).
//
// Real translation, natural English (not literal). Phone-first and TTS-ready: short
// sentences, no dense paragraphs. The package and delivery anchor is preserved. Fixed
// terms kept: Embedding, Token ID, RAG, Agent, model. No em dash (U+2014) and no en
// dash (U+2013). Mentor bubble text carries no emoji.
//
// The lab strings (UniversalMeaningDemo, EmbeddingExperienceLab) come from chapter4Lab
// via the lab content registry, so they are not repeated here. The quiz numeric
// skeleton stays in quizData.ts; here only the display text (quiz.byId).

import type { Locale } from '@/i18n/config';
import { chapter4Quiz } from './chapter4Quiz';

export const chapter4 = {
    contentLocale: 'en' as Locale,

    // Hero
    hero: {
        badge: 'Behind the Scenes · 04',
        titleLead: 'How does AI know',
        titleHighlight: 'that two different sentences mean the same thing?',
        lede: 'Two sentences can use completely different words and still mean almost the same thing. To catch that, the model needs a way to compare meaning, not just match words. An Embedding is the numeric representation that lets it measure how close two sentences are in meaning.',
        chipObject: 'Pick an object or a sentence and see what is closest to it',
        chipMeaning: 'Different words can still be close in meaning',
    },

    // Mentor speech bubbles (text only; pose and placement are structural in the page)
    mentor: {
        hero: 'The engine sees numbers, not words',
        lock: 'Closeness is not truth',
        practical: 'Close in meaning, not necessarily true',
    },

    // Quick guess: text only; the icon, correct answer, and poses are structural
    guess: {
        eyebrow: 'Quick guess',
        title: 'Different words, same intent. Are they close in meaning?',
        subtitle: 'Two support messages without a single shared word. Guess by the meaning, not the words.',
        prompt: '"The package did not arrive" vs "The delivery was not handed over"',
        invite: 'Think about the meaning, not the words, then choose.',
        // Guess options by stable id (close is correct, far/letters are wrong with a why)
        options: {
            close: {
                title: 'Yes, close',
                desc: 'Same intent, even without shared words',
            },
            far: {
                title: 'No, far apart',
                desc: 'Different words, so different meaning',
                why: 'It makes sense to think so, since they share no word at all. But an Embedding does not compare words, it compares meaning, and the same intent stays close even in other words.',
            },
            letters: {
                title: 'Depends on shared words',
                desc: 'You need identical words to be close',
                why: 'That is the intuition of literal search. But closeness in meaning is not measured by shared words, it is measured by the meaning itself.',
            },
        },
        successTitle: 'Exactly right!',
        successExplain:
            'The two messages use different words, but they describe almost the same problem: a package that did not arrive or was not handed over. So an Embedding measures them as close in meaning.',
        successInsight: 'The model is not only looking for identical words. It is looking for similar meaning.',
        continueCta: 'Continue to the view',
        retryLink: 'Guess again',
        wrongTitle: 'Try again',
        retryButton: 'Try again',
    },

    // Plain-words explanation: what an Embedding actually does (after the guess, before the demo)
    plain: {
        eyebrow: 'In plain words',
        title: 'So what does an Embedding actually do?',
        lines: [
            'An Embedding takes each word or sentence and turns its meaning into a position on a map.',
            'Things that mean the same land close together, even when they are written in completely different words.',
            'That is all it does: it measures how close two meanings are. It does not check whether something is true, and it does not understand like a person.',
        ],
    },

    // Bridge from objects to sentences
    bridge: 'Now we use the same idea on sentences: even when the words differ, the meaning can still be close.',

    // Lock in the idea: closeness is not truth
    lock: {
        title: 'Lock in the idea',
        question: 'Two sentences came out very close in meaning. What does that mean?',
        options: ['That their meaning is close', 'That both are true in reality', 'That they are really the same sentence'],
        explanationCorrect:
            'Exactly. Closeness here means the meaning is similar, not that something is true. An Embedding compares meaning, it does not check what happened in the world.',
        explanationWrong:
            'Almost. Closeness only says the meaning is similar. It does not verify that something is true, and it does not turn two sentences into one.',
    },

    // Practical takeaway
    practical: {
        title: 'When Embeddings help, and what they do not do',
        lead: 'Closeness in meaning is a powerful tool, and it is exactly what drives a lot of what you already use.',
        uses: [
            'Semantic search and source retrieval, the basis of RAG',
            'Text classification and intent detection',
            'Grouping similar messages in a support center',
            'Agent decisions based on closeness in meaning',
        ],
        caveat:
            'But closeness is not truth. An Embedding compares meaning, it does not check whether something is true and it does not understand like a person. So a sensitive action needs a source or a check, not closeness alone.',
        mathLink:
            'Want the math behind this closeness in depth? The chapter Vectors, the heart of every model, in the Intuitive Math course',
    },

    // Under the hood (secondary)
    hood: {
        eyebrow: 'Under the hood',
        title: 'Under the hood: from words to numbers',
        helper: 'Open the labs to see how text becomes tokens, numbers, and meaning.',
        labsCount: '3 interactive labs inside',
        intro: 'Want to see the technical step beneath the closeness? Every word gets a Token ID, and from the sequence of IDs a meaning vector is built. That is the numeric profile that decides how close two sentences are in meaning.',
    },

    // The knowledge check (display text; the numeric skeleton stays in quizData)
    quiz: chapter4Quiz,
};
