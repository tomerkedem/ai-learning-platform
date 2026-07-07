// i18n/locales/en/behind-ai/fullTraceQuiz.ts
//
// English (en, LTR) display text for the Chapter 19 quiz ("Full Trace: One Prompt, All
// Stations"). Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { FullTraceQuizId, FullTraceQuizText } from '../../he/behind-ai/fullTraceQuiz';

export const fullTraceQuiz = {
    title: 'Understanding check: one prompt, all stations',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'What does Full Trace show?',
            options: [
                'One final answer, with no intermediate stages',
                'A visible route of the system stages, from input to a controlled output',
                'A list of every answer the model considered and rejected',
                'Only the external tools the system is connected to',
            ],
            explanation:
                'Full Trace connects all the course stations into one visible route: input, meaning, grounding in a source, checks, a control layer, and an output. It is not just the answer at the end, but the whole path to it.',
        },
        2: {
            question: 'A friend claims: "Full Trace shows us the model private thoughts." Is that accurate?',
            options: [
                'Yes, it is a direct peek into the model hidden chain of thought',
                'No. It is a teaching record of visible system stages, not private thought',
                'Yes, the model writes itself a thinking log that we read',
                'No, because the model has no internal process at all',
            ],
            explanation:
                'Full Trace is not a hidden chain of thought. It shows visible system stages: input, context, tool result, checks, permission state, and output. The goal is to teach the path, not to expose private reasoning.',
        },
        3: {
            question: 'The tool result says: status delayed, estimated delivery unavailable. Why is it right that the system does not invent an arrival date?',
            options: [
                'Because an arrival date is never important to the customer',
                'Because a conclusion should rest on the source, and what is missing from the source is not invented',
                'Because the model is unable to write dates',
                'Because inventing a date is fine if it sounds reasonable',
            ],
            explanation:
                'Source before conclusion. The source confirmed the package is delayed, but gave no arrival date. Filling in a date that did not appear in the source is a guess presented as fact, and that is exactly what grounding is meant to prevent.',
        },
        4: {
            question: 'The prompt said "do not send without my approval", and the system prepared an excellent draft. What is right about the final action?',
            options: [
                'Send immediately, because the draft is ready',
                'Prepare a draft and stop for approval, because an external send passes through the approval boundary',
                'Delete the draft to avoid any risk',
                'Send, and then ask for approval afterward',
            ],
            explanation:
                'The approval boundary from the prompt changes the final action. Sending to a customer is an external and sensitive action, so the system stops: the draft is ready, and the message goes out only after human approval.',
        },
        5: {
            question: 'You want an agent to work in a way that is easy to trace and to trust. Which instruction is best?',
            options: [
                '"Take care of it."',
                '"Check the status of package 123456789. If there is no arrival date in the source, do not guess. Draft a short message to the customer. Do not send without my approval. At the end, write what you checked, what you found, and what you did not do."',
                '"Send the customer whatever seems right to you."',
                '"Keep going until you finish, without asking me anything."',
            ],
            explanation:
                'A traceable prompt defines a goal, data, a source, what not to assume, an approval boundary, and an output with a report of what was and was not done. "Take care of it" is too vague, "send whatever seems right" opens a sensitive action with no control, and "do not ask anything" blocks asking for missing info. A clear instruction produces a controlled output that is easy to trace.',
        },
    } satisfies Record<FullTraceQuizId, FullTraceQuizText>,
};
