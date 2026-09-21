// i18n/locales/en/behind-ai/contextWindowLab.ts
//
// English context window lab data for Chapter 7 (Context Window). Hebrew is the
// source of truth.
//
// All of the language dependent text and data of ContextWindowLab lives here. The
// conversation messages, the critical detail, the model answers and the standalone
// prompt depend on the language, because the wording, order and line length differ
// per language, and the reading direction differs (RTL versus LTR). So messages and
// states are defined per language on their own. The tone -> color mapping stays in
// the component.
//
// This is a teaching illustration of the idea, not an exact measurement of the token
// limit.
//
// No em dash (U+2014), no en dash (U+2013).

import type { ContextWindowLabContent } from '../../he/behind-ai/contextWindowLab';

export const contextWindowLab: ContextWindowLabContent = {
    sectionEyebrow: 'Context Window Lab',
    sectionTitle: 'Move the context window, and see what the model still sees',
    sectionIntro:
        'At the start of the conversation it was written that the meeting is on Thursday at 18:00. Now, after many messages, a participant is asking again. Change the state of the window and watch how the model answer shifts when the critical detail is inside, when it is outside, and when you bring it back into the prompt.',
    heading: 'What is inside the context window right now',
    kicker: 'Context window lab',
    pickHint: 'Pick a state. We will see what enters the window and what falls out of it.',
    conversationLabel: 'The conversation so far',
    outsideLabel: 'Outside the context window',
    insideLabel: 'Inside the context window',
    earlierMessages: 'Earlier messages in the conversation',
    modelSeesLabel: 'What the model sees now',
    standaloneLabel: 'The standalone prompt you wrote',
    answerLabel: 'The model answer',
    criticalTag: 'critical detail',
    disclaimer:
        'This is a teaching illustration of the idea, not an exact measurement of the token limit. Different systems and models manage the window differently. The goal here is to show one principle: the model answers based on what is in the context window right now, not based on everything that was ever said.',
    toneLabels: {
        specific: 'focused answer',
        generic: 'generic answer',
        restored: 'good answer again',
    },
    roleLabels: {
        user: 'agent',
        agent: 'the model',
    },
    sr: {
        group: 'choose a context window state',
        inside: 'inside the window',
        outside: 'outside the window',
    },
    messages: [
        { id: 'm1', role: 'user', critical: true, text: 'The meeting is on Thursday at 18:00.' },
        { id: 'm2', role: 'user', text: 'One of the participants wrote that he is planning his week around it.' },
        { id: 'm3', role: 'agent', text: 'Got it. I am looking into the request and will get back to you.' },
        { id: 'm4', role: 'user', text: 'Now they sent another message asking for a reply.' },
        { id: 'm5', role: 'user', text: 'What should I reply to him?' },
    ],
    states: [
        {
            id: 'inside',
            control: 'The detail is inside the window',
            visibleIds: ['m1', 'm2', 'm3', 'm4', 'm5'],
            answer:
                'Let them know the meeting is on Thursday at 18:00, and that they are welcome to join a few minutes early.',
            answerTone: 'specific',
            caption:
                'The critical detail, that the meeting is on Thursday at 18:00, is inside the window. The model sees it now, so it can give a focused answer that tells the participant the right day and time.',
        },
        {
            id: 'grew',
            control: 'The conversation grew longer',
            visibleIds: ['m3', 'm4', 'm5'],
            answer:
                'I am missing information about the day or time of the meeting, so I can only answer in general. It is worth checking when the meeting is set before writing a precise reply.',
            answerTone: 'generic',
            caption:
                'The conversation grew longer, and the message with the critical detail has already left the context window. The old message may still be visible on screen in the chat scroll, but it is not necessarily included in the input sent to the model this turn. The model does not see it now, so it has to answer generically or ask for the missing information. The detail still exists in the history, but not in what the model is processing at this moment.',
        },
        {
            id: 'restored',
            control: 'Standalone prompt',
            visibleIds: [],
            standalonePrompt:
                'The meeting is on Thursday at 18:00. A participant is asking what to reply. Write a short, clear answer.',
            answer:
                'Since the meeting is on Thursday at 18:00, you can reply to the participant: the meeting is on Thursday at 18:00, and you are welcome to join a few minutes early.',
            answerTone: 'restored',
            caption:
                'Instead of relying on a long, messy conversation, we wrote one standalone prompt that includes the critical detail. Now the model sees the day and time again inside the current input, and can give a good answer, without depending on what was said earlier.',
        },
    ],
};
