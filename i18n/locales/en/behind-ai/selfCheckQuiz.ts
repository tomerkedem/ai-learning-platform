// i18n/locales/en/behind-ai/selfCheckQuiz.ts
//
// English (en, LTR) display text for the Chapter 13 quiz ("Self-Check: checking the answer
// while answering"). Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { SelfCheckQuizId, SelfCheckQuizText } from '../../he/behind-ai/selfCheckQuiz';

export const selfCheckQuiz = {
    title: 'Understanding check: self-check while answering',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'In this course, what is a self-check?',
            options: [
                'Asking the model to expose its hidden thoughts',
                'A step where the draft is checked against the question and the source before it is sent',
                'An external tool that verifies facts on the internet',
                'Asking the model for a new answer, hoping it comes out better',
            ],
            explanation:
                'A self-check is a visible step after the draft: each claim is compared to the question and the source, whatever is unsupported or missing is flagged, and it is fixed before the answer goes out. It is not an exposure of hidden thoughts and not an external verification, and it is also not asking for a new answer: self-check reviews the existing draft against criteria, it does not produce a different phrasing.',
        },
        2: {
            question: 'After we connected the answer to a source, why is a self-check still needed?',
            options: [
                'Because a source is always wrong',
                'Because even with a source in context, the answer produced can go beyond what the source says',
                'Because a self-check replaces the source',
                'Because without a check the model would not answer at all',
            ],
            explanation:
                'A source reduces guessing, but the answer is still written by the model and can add a detail that does not appear in the source. A self-check compares the draft to the source and catches exactly that drift.',
        },
        3: {
            question: 'The source says: status delayed, estimated delivery not available. The draft: "The package is delayed and will arrive tomorrow." Which claim should the check flag?',
            options: [
                '"The package is delayed", because it appears in the source',
                '"Will arrive tomorrow", because the source gives no arrival date',
                'The whole answer, because AI should never answer',
                'No claim, because the answer sounds confident',
            ],
            explanation:
                '"Delayed" is supported by the source, so it stays. "Will arrive tomorrow" is a date the source lists as not available, so it is an unsupported claim that should be removed or softened. A self-check separates a supported claim from an invented one.',
        },
        4: {
            question: 'What can a self-check not guarantee?',
            options: [
                'That a claim with no support in the source can be flagged',
                'That the answer is absolute truth, even when the source itself is wrong or incomplete',
                'That the answer stays within what the source says',
                'That the answer states what is missing',
            ],
            explanation:
                'A self-check checks the answer against the source and the request, not against the world. If the source is wrong or incomplete, the check cannot invent the truth. It is a useful control step, not an absolute fact checker.',
        },
        5: {
            question: 'You want an answer for the customer that can be trusted. What is the best way to ask the model for a visible check?',
            options: [
                '"Answer the customer confidently and write a convincing reply."',
                '"Write a draft, check each claim against the source provided, and return a revised answer that states what is not known."',
                '"Describe your hidden thoughts to me before you answer."',
                '"Give an answer that is as long and detailed as possible."',
            ],
            explanation:
                'A useful check is visible and practical: a draft, a comparison of each claim to the source, and a revised answer that says what is not known. You do not ask for hidden thoughts, and not for length for its own sake.',
        },
    } satisfies Record<SelfCheckQuizId, SelfCheckQuizText>,
};
