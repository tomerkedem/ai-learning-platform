// i18n/locales/en/behind-ai/chatToAgentQuiz.ts
//
// English (en, LTR) display text for the Chapter 17 quiz ("Chat to Agent: When a Question
// Becomes a Task"). Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { ChatToAgentQuizId, ChatToAgentQuizText } from '../../he/behind-ai/chatToAgentQuiz';

export const chatToAgentQuiz = {
    title: 'Understanding check: when a question becomes a task',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'What is the essential difference between a chat and an agent?',
            options: [
                'An agent is faster, and a chat is slower',
                'A chat receives input and returns an answer. An agent receives a goal and works toward it in steps: it chooses a tool, checks a result, and decides what is next',
                'A chat understands English, and an agent understands only Hebrew',
                'An agent does not use tokens, and a chat does',
            ],
            explanation:
                'The difference is not speed or language. A chat is an answer engine, it explains. An agent is a task engine: it spots a goal, may choose a tool, check a result, and decide on the next step. Both can be wrong.',
        },
        2: {
            question: 'What do tools add to an agent?',
            options: [
                'They make the model inherently smarter',
                'They extend what the system can do, but only when they are available and allowed',
                'They guarantee the answer is always correct',
                'They remove the need for information from the user',
            ],
            explanation:
                'A tool such as a calendar lookup or a document search extends what the system can do beyond writing text. But a tool works only when it is available and allowed, it can also fail, and it does not make the model smarter and does not guarantee the answer is correct. A tool call that succeeded is one step, not the end of the task.',
        },
        3: {
            question: 'The agent does not have the acceptable time range needed to check the calendar. What is the right step?',
            options: [
                'Invent a plausible time range to move forward',
                'Ask the user for the acceptable time range before acting',
                'Send everyone a generic invitation anyway',
                'Stop the task and never return to it',
            ],
            explanation:
                'A good agent does not invent missing information and does not use a tool without the required data. When the acceptable time range is missing, the professional step is to ask for it. Asking for missing information is not a failure, it is the correct behavior.',
        },
        4: {
            question: 'The agent has a ready invitation draft and access to send it. Why is it still right to stop before sending?',
            options: [
                'Because it cannot really send an invitation',
                'Because sending an invitation is a real and sensitive action, and such an action requires approval',
                'Because the draft is always wrong',
                'Because it has no permission to write text',
            ],
            explanation:
                'Preparing a draft is one thing, sending it to real participants is another. An action that changes something in the world or reaches other people is sensitive, and the ability to do it is not permission to do it. The full pattern is draft, approval, then execute and verify the result. If approval is denied, the agent stops and does not send.',
        },
        5: {
            question: 'Which instruction is the safest to give an agent handling a meeting invitation?',
            options: [
                '"Take care of it."',
                '"Arrange the meeting with the known participants. If the time range is missing, ask me. If you need to send an invitation, prepare a draft only and wait for approval."',
                '"Send whatever seems most right to you."',
                '"Keep going until you finish, without asking me anything."',
            ],
            explanation:
                'A safe instruction defines a goal, what to do if information is missing, and what requires approval. "Take care of it" is too vague, "send whatever seems right" opens a sensitive action with no control, and "do not ask anything" blocks asking for missing information. A good instruction gives a goal and boundaries.',
        },
    } satisfies Record<ChatToAgentQuizId, ChatToAgentQuizText>,
};
