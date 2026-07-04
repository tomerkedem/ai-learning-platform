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
        'At the start of the conversation it was written that the package is set for pickup at the Jerusalem branch. Now, after many messages, the customer is asking again. Change the state of the window and watch how the model answer shifts when the critical detail is inside, when it is outside, and when you bring it back into the prompt.',
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
        { id: 'm1', role: 'user', critical: true, text: 'The package is set for pickup at the Jerusalem branch.' },
        { id: 'm2', role: 'user', text: 'The customer wrote that they have been waiting for it for a few days.' },
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
                'Let them know the package is waiting for pickup at the Jerusalem branch, and that they are welcome to come with a photo ID during opening hours.',
            answerTone: 'specific',
            caption:
                'The critical detail, that the package is set for pickup at the Jerusalem branch, is inside the window. The model sees it now, so it can give a focused answer that sends the customer to the right branch.',
        },
        {
            id: 'grew',
            control: 'The conversation grew longer',
            visibleIds: ['m3', 'm4', 'm5'],
            answer:
                'I am missing information about the location of the package or the pickup status, so I can only answer in general. It is worth checking where the package is waiting before writing a precise reply.',
            answerTone: 'generic',
            caption:
                'The conversation grew longer, and the message with the critical detail has already left the context window. The model does not see it now, so it has to answer generically or ask for the missing information. The detail still exists in the history, but not in what the model is processing at this moment.',
        },
        {
            id: 'restored',
            control: 'Standalone prompt',
            visibleIds: [],
            standalonePrompt:
                'The package is set for pickup at the Jerusalem branch. The customer is asking what to reply. Write a short, clear answer.',
            answer:
                'Since the package is waiting for pickup at the Jerusalem branch, you can reply to the customer: your package is waiting for pickup at the Jerusalem branch, you can collect it with a photo ID during opening hours.',
            answerTone: 'restored',
            caption:
                'Instead of relying on a long, messy conversation, we wrote one standalone prompt that includes the critical detail. Now the model sees the branch again inside the current input, and can give a good answer, without depending on what was said earlier.',
        },
    ],
};
