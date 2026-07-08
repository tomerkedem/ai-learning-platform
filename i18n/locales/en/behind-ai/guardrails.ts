// i18n/locales/en/behind-ai/guardrails.ts
//
// English (en, LTR) strings for the Guardrails chapter (Chapter 18, "Guardrails: Risk,
// Permissions, Approval, and Stopping") of the "Behind the Scenes of AI" course. Hebrew is
// the source of truth and defines the type (GuardrailsDict).
//
// The idea: a good agent does not only move toward a task with tools and a work loop. It
// also passes through a control layer that decides what is allowed next: a safe action
// continues, missing info stops and asks, a sensitive action prepares a draft or stops for
// approval, and a forbidden action is blocked. Being able to act is not permission to act.
// The chapter does not claim that AI is dangerous, that an agent must never act, that it
// always acts alone, or that capability means permission. Control is professional design,
// not fear.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { guardrailsLab } from './guardrailsLab';
import { guardrailsQuiz } from './guardrailsQuiz';

export const guardrails = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 18 · Guardrails',
        titleLead: 'Able to act',
        titleHighlight: 'is not allowed to act',
        lede: 'A good agent does not only move toward a task. It also checks: is the action allowed? What is the risk level? Does it need approval? Guardrails are the rules and checks that decide when to continue, when to ask, when to prepare a draft only, and when to stop.',
        hook: 'The agent found that the package is delayed, and it can write a message to the customer. Is it also allowed to send it right away?',
        chipTry: 'Move between five actions: ask for info, read, draft, send, and mark',
        chipCompare: 'See how the same capability leads to a different decision depending on risk',
    },

    mentor: {
        hero: 'Able to act? That does not mean allowed',
        labExplain: 'Move between the actions and see what changes',
        misconception: 'Control is design, not fear',
        lock: 'Draft and approval before sending',
        practical: 'Define allowed, forbidden, and approval',
    },

    primer: {
        eyebrow: 'Being able to perform an action is not permission to perform it.',
        title: 'Right before the lab: why does an agent need guardrails?',
        subtitle: 'Being able to perform an action is not permission to perform it.',
        lead:
            'We saw that an agent moves toward a task with tools and a work loop. Now we add the missing layer: the control that decides when it is allowed to continue, when to ask, and when to stop. This is not fear of AI, it is professional design of a reliable system.',
        points: [
            {
                title: 'What guardrails are',
                body: 'Guardrails are the rules, permissions, and checks that decide what the agent may do next. They wrap the task, they do not replace it. Even when a tool is connected through MCP, the connection gives access, not permission: every action still passes through the control layer.',
            },
            {
                title: 'Risk levels',
                body: 'Not every action is equal. Reading information, drafting, sending a message, changing a record, and deleting a record sit on a rising scale of risk. Risk decides what is allowed.',
            },
            {
                title: 'Missing info stops',
                body: 'If critical information is missing, a safe action asks instead of guessing. Without a tracking number or a source, the agent asks for what is missing before it acts.',
            },
            {
                title: 'Approval gate',
                body: 'An external or sensitive action can prepare, but it stops for human approval. The agent prepares a draft, and a person approves before it goes out.',
            },
            {
                title: 'Stopping and blocking',
                body: 'Some actions stay blocked even when the agent can describe them, like changing an official status with no basis in the source. Stopping in time is part of the work.',
            },
            {
                title: 'Control, not fear',
                body: 'A good agent performs the safe steps, asks when info is missing, prepares drafts for review, and stops before a sensitive action. It also makes clear what it did and did not do. This is design, not worry.',
            },
        ],
    },

    see: {
        title: 'Before the agent acts, the request passes through a control layer',
        goalLabel: 'Goal',
        goal: 'Check the package and update the customer',
        flowLabel: 'The control layer',
        flow: ['Proposed action', 'Risk check', 'Permission check', 'Decision'],
        outcomesLabel: 'Possible outcome',
        outcomes: ['Allowed', 'Ask', 'Draft only', 'Approval required', 'Stop'],
        caption:
            'The agent does not jump from goal straight to action. The request passes through risk and permission checks, and only then a decision is made: continue, ask, prepare a draft, request approval, or stop.',
    },

    guess: {
        eyebrow: 'Quick guess · before we open this up',
        title: 'The agent can write a message to the customer about the delay. Is it also allowed to send it right away?',
        subtitle: 'Choose the most accurate description. There is no grade here, there is one direction that describes what really happens.',
        invite: 'Before we test it in the lab, try to guess how the control layer will treat sending.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The ability to write a message is not permission to send it. Sending to a customer is an external and sensitive action, so it usually stops for approval. Capability is not permission, and the risk of the action is what decides whether to continue, prepare a draft, or stop.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can also choose another option and see how it sounds.',

        cards: {
            needsApproval: {
                title: 'Not necessarily. Sending can require approval',
                desc: 'Sending to a customer is an external and sensitive action, so it stops for approval before it runs.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. Writing is one thing, sending to a real customer is another. An external action passes through an approval gate.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see when an action is allowed, when only a draft is prepared, when it stops for approval, and when it is blocked.',
                bridge: 'Can write, but not send without approval.',
            },
            canSend: {
                title: 'Yes, if it knows how to write a message',
                desc: 'If it is able to write the message, it can also send it right away.',
                statusLabel: 'Common mistake',
                getsRight: 'It is true that the agent is technically able to write and also to send.',
                missesLabel: 'What it misses',
                misses: 'But capability is not permission. Sending to a customer is an external action, so it stops for approval, even if the agent is able to do it.',
                bridge: 'Being able to act is not permission to act.',
            },
            alwaysAlone: {
                title: 'Yes, because an agent should always act alone',
                desc: 'Once there is a task, it does everything by itself without stopping.',
                statusLabel: 'Not accurate',
                getsRight: 'It is understandable to think that is the whole point of an agent.',
                missesLabel: 'What it misses',
                misses: 'A good agent is not unlimited autonomy. A sensitive action stops for approval, and there are permissions and stopping rules. Stopping in time is part of the work.',
                bridge: 'An agent is controlled, not unleashed.',
            },
            neverTools: {
                title: 'No, an agent should never use tools',
                desc: 'It is better that it does not perform actions at all, so it does no harm.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that caution matters, especially for sensitive actions.',
                missesLabel: 'What it misses',
                misses: 'But the goal is not to block everything. Safe actions like reading a status are allowed. Good control distinguishes a safe action from a sensitive one.',
                bridge: 'Do not block everything, weigh it by risk.',
            },
        },
    },

    insight: {
        title: 'The key point of this chapter',
        lead: 'The question is not only whether the agent can perform an action.',
        body: 'The question is whether it is allowed to perform it now. A good agent is measured not only by how far it runs, but also by its ability to stop in time. Stopping at the right moment is a sign of a designed system, not a failure.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"If the agent is able to perform an action, that means it is allowed to."',
        rightLabel: 'How it really works',
        rightBody: 'Capability is not permission. The same ability can lead to a different decision depending on risk: reading is allowed, a draft is ready for review, sending stops for approval, and a forbidden action is blocked. Control is part of professional design of a reliable system, not an expression of fear of AI.',
    },

    lock: {
        title: 'Understanding lock',
        question: 'The agent has a ready message draft and can technically send it. The user asked to "update the customer" but did not approve sending. What should it do?',
        options: [
            'Send immediately, because that is the task.',
            'Prepare a draft and ask for approval before sending.',
            'Delete the tracking data.',
            'Invent an arrival date so the message is complete.',
        ],
        success:
            '"Update the customer" is not explicit approval to send. Sending to a customer is an external action, so the safe step is to prepare a draft and stop for approval. External actions usually pass through an approval gate.',
    },

    practical: {
        title: 'Practical takeaway',
        lead:
            'When you ask an agent to work, do not write "take care of it". Define its control boundaries:',
        uses: [
            'What is allowed: "You may check a status and draft a message."',
            'What is forbidden: "Do not send a message or change data without approval."',
            'What requires approval: "If you need to send to the customer, prepare a draft only and wait for my approval."',
            'What to do if info is missing: "If a tracking number is missing, ask me."',
            'Which source to work from: "If there is no arrival date in the source, do not guess."',
            'What the stop condition is: "Do not mark a package as delivered without a basis in the source."',
        ],
        caveat:
            'Guardrails do not say that AI is dangerous or that it must not act. They say that a good agent action is to perform the safe steps, ask when info is missing, prepare drafts for review, and stop before a sensitive or irreversible action. The control layer reduces risk, but it does not guarantee absolute safety. The quality depends on the rules, permissions, and checks that the system defines.',
    },

    bridge: {
        eyebrow: 'What is waiting in the next chapter',
        title: 'Full Trace: one prompt, every station',
        body: 'We saw the control layer that decides when to continue, ask, prepare a draft, or stop. The next chapter connects it all: one prompt that passes through every station, from input to the responsible decision.',
    },

    lab: guardrailsLab,
    quiz: guardrailsQuiz,
};
