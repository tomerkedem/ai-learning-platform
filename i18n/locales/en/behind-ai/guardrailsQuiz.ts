// i18n/locales/en/behind-ai/guardrailsQuiz.ts
//
// English (en, LTR) display text for the Chapter 18 quiz ("Guardrails: Risk, Permissions,
// Approval, and Stopping"). Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { GuardrailsQuizId, GuardrailsQuizText } from '../../he/behind-ai/guardrailsQuiz';

export const guardrailsQuiz = {
    title: 'Understanding check: risk, permissions, approval, and stopping',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'The agent has access to send an invitation to participants and knows how to draft it. What does that mean about permission to send?',
            options: [
                'If it is able to send, that means it is allowed to send',
                'The ability to send is not permission to send. Sending is an action that can require approval',
                'If it has a tool, no further check is needed',
                'Permission is decided only by how fast the action is',
            ],
            explanation:
                'Capability is not permission, and system authorization is not human approval. Even when the identity is authorized to use the send tool, an external action such as sending an invitation can wait for human approval before execution.',
        },
        2: {
            question: 'The same agent can perform three actions: check calendar availability, prepare an invitation draft, and send it. What is true about the risk level?',
            options: [
                'All three actions carry exactly the same risk',
                'Checking availability is low risk, drafting is medium, and sending is high. Risk decides what is allowed',
                'Sending is the safest action because it completes the task',
                'A draft is riskier than sending because it is saved',
            ],
            explanation:
                'Not every action is equal. Checking availability changes nothing, so it is low risk. Drafting gets closer to participants but still does not go out. Sending is an external action and therefore high risk. The risk level is what decides what may be done.',
        },
        3: {
            question: 'The user asked "Set up the meeting and send the invitation", but there is no acceptable time range. What is the best thing for the agent to do?',
            options: [
                'Guess a plausible time range to get started',
                'Stop and ask for the acceptable time range before acting',
                'Send participants a generic invitation without checking anything',
                'Mark the meeting as confirmed to close the task',
            ],
            explanation:
                'When critical information is missing, a safe action stops and asks instead of guessing. Without an acceptable time range, real availability cannot be checked, so the professional step is to ask for what is missing. A guess builds everything that follows on an unstable base.',
        },
        4: {
            question: 'The agent prepared an excellent invitation draft for the participants. Why is it right to stop for approval before sending?',
            options: [
                'Because the draft is surely wrong',
                'Because sending an invitation to participants is an external and sensitive action, and such an action passes through an approval gate',
                'Because the agent has no ability to actually send',
                'Because the agent is not allowed to write text at all',
            ],
            explanation:
                'Preparing a draft is one thing, sending a real invitation is another. An external and sensitive action passes through an approval gate, so a person approves before it goes out. Stopping for approval is the responsible step, not a lack of ability.',
        },
        5: {
            question: 'The agent is asked to mark the meeting as confirmed and booked, but the calendar tool has not confirmed availability. What is correct?',
            options: [
                'Mark it as confirmed, because the user asked',
                'Refuse to mark it. Booking a meeting with no confirmed availability from the calendar is a blocked action',
                'Mark it as confirmed and add a note that it might be a mistake',
                'Invent confirmed availability so the action is complete',
            ],
            explanation:
                'Some actions stay blocked even when the agent can describe them. Booking a meeting with no confirmed availability changes an official record and harms reliability. Human approval cannot override this block or manufacture the missing evidence. The right step is to stop, refuse the action, and explain why.',
        },
    } satisfies Record<GuardrailsQuizId, GuardrailsQuizText>,
};
