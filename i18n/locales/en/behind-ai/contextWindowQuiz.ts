// i18n/locales/en/behind-ai/contextWindowQuiz.ts
//
// English quiz display strings for Chapter 7 (Context Window). Hebrew is the source
// of truth.
//
// This is display text only. The shared skeleton (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) stays in the shared quizData.ts (contextWindowQuiz,
// chapter 7 route) and is not touched here. The chapter page merges this display text
// onto the question skeleton by question id (byId).
//
// The order of options must stay identical to the shared skeleton, because correctAnswer
// is a numeric index.
//
// No em dash (U+2014), no en dash (U+2013).

import type { ContextWindowQuizText, ContextWindowQuizId } from '../../he/behind-ai/contextWindowQuiz';

export const contextWindowQuiz = {
    title: 'Understanding check: Context Window',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    /** Display text for each question, keyed by question id in the shared skeleton. */
    byId: {
        1: {
            question: 'What is the model context window?',
            options: [
                'Everything the user has ever written, across all conversations',
                'The information that is currently in the input the model is processing, and it answers based only on that',
                'A permanent memory where the model stores facts about the user',
                'The bank of ready made answers the model has',
            ],
            explanation:
                'The context window is the information that is currently in the input the model is processing. The model answers based on what is in the window now, not based on everything that was ever said and not based on a fixed personal memory.',
        },
        2: {
            question: 'In a long conversation, why can a detail said at the start stop influencing the answer?',
            options: [
                'Because the model deliberately decides to ignore earlier details',
                'Because in a long conversation early details can fall out of the context window, and the model no longer sees them',
                'Because earlier details are always less important than newer ones',
                'Because the model gets tired and forgets like a person',
            ],
            explanation:
                'In a long conversation, what was said at the start can fall out of the context window. This is not human forgetting and not a deliberate decision, it is simply that the detail is no longer in what the model is processing right now.',
        },
        3: {
            question:
                'At the start of a long conversation it was written "the package is set for pickup at the Jerusalem branch". After many messages the user asks what to reply, and the model answers generically. What is most accurate?',
            options: [
                'The model remembers the detail but chose deliberately not to use it',
                'The detail probably fell out of the context window, so the model no longer relies on it',
                'The model never read the detail in the first place',
                'The model needs you to remind it angrily so that it remembers',
            ],
            explanation:
                'The context window is not a human memory. The detail was said, but in a long conversation it can fall out of the window. If it is not in what the model is processing now, the model will not rely on it, even if it still exists somewhere in the history.',
        },
        4: {
            question: 'Why is a standalone prompt safer for an important task?',
            options: [
                'Because a long prompt always impresses the model more',
                'Because a standalone prompt carries the critical details within itself, and does not depend on what may have already fallen out of the window',
                'Because the model prefers polite instructions',
                'Because it makes the model remember the conversation forever',
            ],
            explanation:
                'A standalone prompt includes the goal and the critical details within itself. This way the task does not depend on what was said earlier and may have already left the context window. For important tasks this is safer than relying on what may no longer be there.',
        },
        5: {
            question:
                'The model "forgot" an important detail you gave earlier in a long conversation. What is the most useful step?',
            options: [
                'Repeat the exact same question and hope it remembers this time',
                'Assume there is a bug and open a support ticket',
                'Put the critical detail back into the current prompt, explicitly',
                'Tell the model that it must remember everything',
            ],
            explanation:
                'If the model "forgot", the detail likely fell out of the context window. The practical solution is not to argue with the model but to bring the critical detail back into the current prompt, explicitly, together with the goal and what has already been decided. That way the information is once again inside what the model is processing now.',
        },
    } satisfies Record<ContextWindowQuizId, ContextWindowQuizText>,
};
