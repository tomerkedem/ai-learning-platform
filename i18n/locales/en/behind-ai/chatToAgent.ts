// i18n/locales/en/behind-ai/chatToAgent.ts
//
// English (en, LTR) strings for the Chat to Agent chapter (Chapter 17, "When a Question
// Becomes a Task") of the "Behind the Scenes of AI" course. Hebrew is the source of truth
// and defines the type (ChatToAgentDict).
//
// The idea: a chat receives input and returns an answer. An agent receives a goal and works
// toward it: it spots what is missing, may choose a tool, checks a result, and decides whether
// to continue, stop, or ask for approval. The same request can be answered as text or handled
// as a controlled task. The chapter does not claim that every chat is an agent, that the agent
// is smarter, that tools are always safe, or that an agent acts alone without limits.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { chatToAgentLab } from './chatToAgentLab';
import { chatToAgentQuiz } from './chatToAgentQuiz';

export const chatToAgent = {
    contentLocale: 'en' as Locale,
    openingRefresher: 'Until now, the model or product mainly returned text. An Agent is a system around the model that manages a goal over several steps and may use tools and task state within defined permissions.',
    mcpEnrichment: 'Optional enrichment: MCP is one possible protocol for exposing tools and context in some systems. Not every Agent uses it, and you do not need it to understand this chapter.',

    hero: {
        badge: 'Behind the Scenes · 17 · Chat to Agent',
        titleLead: 'When a question',
        titleHighlight: 'becomes a task',
        lede: 'A chat receives input and returns an answer. An agent receives a goal and starts to work toward it: it spots what is missing, may choose a tool, checks a result, and decides whether to continue, stop, or ask for approval. The same request can be answered as text, or handled as a task.',
        hook: 'You wrote: "Check what is happening with the package and update the customer." Is that a question for a chat, or a task for an agent?',
        chipTry: 'Move between four modes: answer, ask for info, use a tool, and approval',
        chipCompare: 'See how the same request is answered once as text and once as a task',
    },

    mentor: {
        hero: 'Chat answers. Agent moves toward a task',
        labExplain: 'Move between the modes and see what changes',
        misconception: 'Not smarter. It has a work path',
        lock: 'Ask first, do not invent',
        practical: 'Define goal, boundaries, and approval',
    },

    primer: {
        eyebrow: 'Chat explains. Agent moves toward action.',
        title: 'Right before the lab: when does a question become a task?',
        subtitle: 'Chat explains. Agent moves toward action.',
        lead:
            'The same request can be answered in two very different ways. Before we test it in the lab, we separate what a chat does from what an agent adds, and see why recognizing a task is still not permission to act.',
        points: [
            {
                title: 'What a chat does',
                body: 'A chat receives input and returns an answer. It explains what should be done, but does not act in the world.',
            },
            {
                title: 'What an agent adds',
                body: 'An agent wraps the model in a task loop: goal, plan, choose a tool, act or ask, check the result, and decide on the next step based on what came back. It can change the plan according to the result, not just run a fixed list.',
            },
            {
                title: 'Tools',
            body: 'An Agent can use tools only when they are available and allowed: tracking lookup, document search, drafting, sending a message, and more. A tool has defined input and output, while the application controls access and permissions. A tool can fail, and it extends capability without making the model smarter.',
            },
            {
                title: 'Missing information',
                body: 'A good agent does not pretend it has what is missing. If a tracking number, permission, or source is missing, it asks for them instead of guessing.',
            },
            {
                title: 'Task state',
                body: 'Task state tracks the progress: which steps ran, what tools returned, what is waiting for approval, and what is still open. This is not lasting memory. Task state does not automatically become memory that is kept beyond the current conversation.',
            },
            {
                title: 'Retry and limit',
                body: 'If a tool fails because of a temporary error, you can try again, but with a limit. A good agent stops when the limit is reached, when information or permission is missing, when the tool returns a terminal error, or when the result is already verified. It does not retry forever.',
            },
            {
                title: 'Permission, risk, and limit',
                body: 'Not every action is equal. Checking a status is different from sending a message or deleting data. A high risk action stops for approval, and if approval is denied the agent stops and does not act. Being able to act is not permission to act, and high confidence is not permission either.',
            },
        ],
    },

    see: {
        title: 'Same request, two paths',
        goalLabel: 'The request',
        goal: 'Check what is happening with the package and update the customer',
        chatLabel: 'Chat path',
        chat: 'You should check the tracking status and then write the customer a suitable update.',
        agentLabel: 'Agent path',
        agent: ['Understand the goal', 'Check info and permissions', 'Decide the next step', 'Tool or question', 'Result or error', 'Update task state', 'Verify and report'],
        caption:
            'The steps are not a fixed script. A fixed workflow follows a preset sequence, while an agent can change the next step according to the result, the task state, or the user response: continue, retry within a limit, request approval, or stop. Using a tool alone does not make a system an agent, and a sensitive action still stops for approval.',
    },

    guess: {
        eyebrow: 'Quick guess · before we open this up',
        title: 'You wrote: "Check what is happening with the package and update the customer." Is that a question for a chat, or a task for an agent?',
        subtitle: 'Choose the most accurate description. There is no grade here, there is one direction that describes what really happens.',
        invite: 'Before we test it in the lab, try to guess how the system will treat this request.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The same request can be answered as text in a chat, or handled as a task by an agent. What decides is not how smart the system is, but whether it has tools, permissions, and a task state. And even when a task is recognized, that is still not permission to act.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can also choose another option and see how it sounds.',

        cards: {
            becomesTask: {
                title: 'It starts like a chat, but can become a task',
                desc: 'If there are tools, permissions, and a task state, the system can spot a goal and work toward it.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. The same request is answered as text in a chat, or handled as a task by an agent, depending on what the system has around the model.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see when an agent asks for information, when it uses a tool, and when it stops for approval.',
                bridge: 'Starts as a question, can become a task.',
            },
            alwaysChat: {
                title: 'It is always just a chat, because AI returns text',
                desc: 'The system will simply explain what should be done, without acting.',
                statusLabel: 'Common mistake',
                getsRight: 'It is true that the default of many systems is to return text.',
                missesLabel: 'What it misses',
                misses: 'But when there are tools and permissions, the same request can become a task that performs steps, not just explains.',
                bridge: 'Text is a default, not the limit.',
            },
            justLonger: {
                title: 'An agent simply says a longer answer',
                desc: 'It is the same answer, just with more words.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that an agent can write more.',
                missesLabel: 'What it misses',
                misses: 'But the difference is not the length. An agent works in steps: it chooses a tool, checks a result, and decides what is next.',
                bridge: 'The difference is a work path, not length.',
            },
            alwaysAutonomous: {
                title: 'An agent always acts alone without approval',
                desc: 'Once there is a task, it does everything by itself.',
                statusLabel: 'Not accurate',
                getsRight: 'It is understandable to worry about this.',
                missesLabel: 'What it misses',
                misses: 'A good agent is not unlimited autonomy. A sensitive action stops for approval, and there are permissions and stopping rules.',
                bridge: 'An agent is controlled, not unleashed.',
            },
        },
    },

    insight: {
        title: 'The key point of this chapter',
        lead: 'The difference is not that the agent is smarter.',
        body: 'The difference is that the system around the model gives it a work path: tools, permissions, a task state, and stopping checks. Without that, even a very long answer is still just an answer.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"An agent is simply a smarter model that does everything by itself."',
        rightLabel: 'How it really works',
        rightBody: 'An agent is the same kind of model, with a work path around it: a goal, allowed tools, a check for missing information, and approval gates for a sensitive action. It does not act alone without limits, and the ability to use a tool is not permission to use it.',
    },

    lock: {
        title: 'Check Your Understanding',
        question: 'A user writes: "Check the status and send a message to the customer." The system has no tracking number. What should a good agent do first?',
        options: [
            'Invent a status to move forward.',
            'Ask for the tracking number, or ask for the source.',
            'Immediately send a generic message to the customer.',
            'Explain what an agent is.',
        ],
        success:
            'An agent should move the task forward, but not by inventing missing information. The professional step is to ask for the tracking number or the source. And even once the information is complete, sending a message to the customer is a sensitive action that stops for approval.',
    },

    practical: {
        title: 'Practical takeaway',
        lead:
            'When you ask an agent to work, do not write "take care of it". Define the task like this:',
        uses: [
            'Goal: what exactly should happen in the end. For example: "Check the package status by this tracking number and write the customer an update."',
            'Available information: give the tracking number, the order, or the source, so it does not have to guess.',
            'Allowed tools: make clear what it may do and what it may not.',
            'What to do if information is missing: "If information is missing, ask me. Do not guess an arrival date without a source."',
            'What requires approval: "If you need to send a message to the customer, prepare a draft only and wait for my approval."',
            'Expected output: say in what format you want the result.',
        ],
        caveat:
            'An agent does not act alone without limits. A tool call that succeeded only means one step finished, not that the whole task is done. If the goal includes updating the customer, the task ends only after approval, sending, and verifying that the send succeeded. If approval is denied, the agent stops. A clear definition of goal, boundaries, and approval is what makes a task for an agent safe.',
    },

    bridge: {
        eyebrow: 'What is waiting in the next chapter',
        title: 'Guardrails: risk, permissions, approval, and stopping',
        body: 'We saw that a good agent can stop for approval before a sensitive action. The next chapter focuses on exactly that layer: how you define risk, permissions, and when the system must stop or ask for approval before acting.',
    },

    lab: chatToAgentLab,
    quiz: chatToAgentQuiz,
};
