// i18n/locales/en/behind-ai/attentionQuiz.ts
//
// English quiz display strings for Chapter 6 (Attention). Hebrew is the source of truth.
//
// This is display text only. The shared skeleton (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) stays in the shared quizData.ts and is not
// touched here. The chapter page merges this display text onto the question skeleton by
// question id (byId).
//
// The order of options must stay identical to the shared skeleton, because correctAnswer
// is a numeric index.
//
// No em dash (U+2014), no en dash (U+2013).

import type { AttentionQuizText, AttentionQuizId } from '../../he/behind-ai/attentionQuiz';

export const attentionQuiz = {
    title: 'Understanding check: Attention',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    /** Display text for each question, keyed by question id in the shared skeleton. */
    byId: {
        1: {
            question: 'In the exact same sentence, is there one word that will always be the most important to the model?',
            options: [
                'Yes, every sentence has one key word that the model marks and the answer follows from it',
                'No, the word that draws the most weight changes according to what the model is processing at that moment',
                'Yes, always the first word in the sentence',
                'Yes, always the last word in the sentence',
            ],
            explanation:
                'Importance is not a fixed property of a word. In the lab we saw that when you remove "but" or swap the status, the focus of attention moves. And in the exact same sentence, when we chose what the model is processing now, attention moved from place to place. Same model, but the weight shifts based on what the sentence says and on what the model is processing at that moment.',
        },
        2: {
            question: 'Which description is closest to what Attention actually does?',
            options: [
                'A kind of highlighter that marks the important words once',
                'A mechanism of relationships that decides, for each part being processed, which other parts of the context will influence it',
                'It checks external databases to see whether what was written is true',
                'It translates the sentence into English so it is easier to process',
            ],
            explanation:
                'Attention is not a highlighter that marks words once. It is a mechanism of relationships: at every moment it asks, in effect, which other parts of the context should influence the part being processed now. The answer changes from moment to moment.',
        },
        3: {
            question: 'When we say the model "pays attention" to a certain word, what does that precisely mean?',
            options: [
                'The model is aware of the word and feels that it is important, like a person reading',
                'The model pauses on the word and understands it deeply before moving on',
                'It is a computational weighing of the links between parts of the text, with no awareness and no emotion',
                'The model marks the word so it can remember it for future conversations',
            ],
            explanation:
                '"Pays attention" is a handy metaphor, but there is no awareness, emotion, or pause here like a person has. Attention is a computation that weighs how strongly parts of the text are linked to one another, and mixes the information accordingly. It is a mechanism, not consciousness.',
        },
        4: {
            question: 'In the lab we removed "but", and then swapped the contradicting claim for "broken". What does that teach us about attention?',
            options: [
                'Connectors and negation words are decoration, they do not change what the model weighs',
                'Words like "but" and "not" steer attention toward the right link, and changing them moves the focus of attention',
                'Attention always stays on the same word, no matter what is written',
                'Removing "but" makes the model stop processing the sentence',
            ],
            explanation:
                'Contrast and negation words are signposts. "But" signals that there is tension between two parts. When you remove "but", the link between the parts is less marked, and when you replace the contradicting claim with "broken", the contradiction disappears and the weight moves elsewhere. Small words, a big shift in the focus of attention.',
        },
        5: {
            question: 'The model puts strong weight on "off". A user concludes: "so the model checked reality and the light really is off." What is inaccurate about that conclusion?',
            options: [
                'There is no mistake, high attention weight proves that the information is true',
                'Attention weighs links inside the text, it does not check facts in the world. High weight on "off" only means that this word is important for processing the context',
                'The mistake is that the model did not really put weight on "off"',
                'The mistake is that "off" can never receive high weight',
            ],
            explanation:
                'High attention weight means the word is relevant to processing the internal context, not that it is true in reality. Attention links parts of the text to one another, it does not verify whether the light is in fact off. For that you need an external source or a tool, not the attention mechanism.',
        },
    } satisfies Record<AttentionQuizId, AttentionQuizText>,
};
