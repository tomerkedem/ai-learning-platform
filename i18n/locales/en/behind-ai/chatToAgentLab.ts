// i18n/locales/en/behind-ai/chatToAgentLab.ts
//
// English (en, LTR) data for the "Chat to Agent Lab" of Chapter 17 (Chat to Agent).
// Hebrew is the source of truth and defines the type (ChatToAgentLabContent).
//
// Core idea: the exact same request, "Arrange a 30-minute project planning meeting and send
// the invitation", is answered in five modes. The participants are already known to the system
// and are not the missing information:
// a chat (answer only), an agent that is missing info (it asks instead of guessing), an agent
// that uses a tool (it grounds on the result), an agent that needs approval (it prepares a
// draft and stops), and an agent whose tool fails (it reports the failure instead of inventing).
//
// Fully deterministic: no randomness, no real model call, no real calendar system, no real
// invitation sent, and no hidden chain of thought. Every example is for teaching only. The
// order of modes stays fixed, as do the structural modeType keys.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { ChatToAgentLabContent } from '../../he/behind-ai/chatToAgentLab';

export const chatToAgentLab: ChatToAgentLabContent = {
    sectionEyebrow: 'Chat to Agent Lab',
    sectionTitle: 'Same request, five modes',
    sectionIntro:
        'The request is fixed: "Arrange a 30-minute project planning meeting and send the invitation." Move between the five modes and see how the same request is answered once as text, once as a request for information, once with a tool, once as a draft that stops for approval, and once as a tool that fails where the agent reports instead of inventing.',
    heading: 'From chat to agent',
    kicker: 'Chat to Agent Lab',
    requestLabel: 'The request',
    request: 'Arrange a 30-minute project planning meeting and send the invitation.',
    modeSelectLabel: 'Pick a mode',
    stepsLabel: 'Step path',
    permissionLabel: 'Permission',
    takeawayLabel: 'The bottom line',
    verificationLabel: 'Verification',
    verificationStatusLabels: { passed: 'Confirmed', pending: 'Pending', failed: 'Failed' },
    disclaimer:
        'Every example here is for teaching only. There is no real connection to a calendar system, no real invitation sent, and no hidden chain of thought shown. The goal is to show the difference between an answer and a controlled task path, not to describe a specific product.',
    sr: {
        modeGroup: 'Choose a response mode',
        modeDetail: 'Details of the selected mode',
    },
    modes: [
        {
            id: 'chat',
            modeType: 'chat',
            control: 'Chat',
            badgeLabel: 'Answer only',
            title: 'Chat can draft what needs no real data',
            summary: 'Chat receives the request and can help with the parts that do not depend on real calendar data, such as a short agenda. It cannot check real availability or send anything.',
            steps: ['Read the request', 'Draft what needs no real data'],
            outputLabel: 'The answer',
            output: 'I cannot check real calendar availability or send anything myself. Here is a short agenda for the meeting: review milestones, confirm owners, agree on next steps. For the actual time and the invitation, you will need an agent with calendar access.',
            takeaway: 'Chat can produce useful text, but it cannot determine a real time or send anything on its own.',
        },
        {
            id: 'askInfo',
            modeType: 'askInfo',
            control: 'Agent · missing info',
            badgeLabel: 'Needs info',
            title: 'The agent spots what is missing and asks',
            summary: 'The participants are already known, but the agent does not know when the meeting may take place. Instead of guessing, it stops and asks for the acceptable time range.',
            steps: ['Understand the goal', 'Check for missing info', 'Ask for the acceptable time range'],
            outputLabel: 'The agent asks',
            output: 'The project team is already set. When can the meeting take place, so I can check calendar availability for a 30-minute slot?',
            takeaway: 'A good agent does not invent a time range. It asks for it before acting.',
        },
        {
            id: 'toolLookup',
            modeType: 'toolLookup',
            control: 'Agent · tool',
            badgeLabel: 'Tool call',
            title: 'The agent uses a tool and grounds on the result',
            summary: 'Now there is an acceptable time range: tomorrow afternoon. The agent picks a calendar lookup tool, reads the result, and writes based on it.',
            steps: ['Understand the goal', 'Choose a calendar tool', 'Read the result', 'Write from the data'],
            tool: {
                name: 'Calendar availability lookup',
                inputLabel: 'Input',
                input: 'Project team, 30 minutes, tomorrow afternoon',
                resultLabel: 'Result (example)',
                result: ['Status: a slot was found', 'Suitable time: 15:00-15:30'],
            },
            outputLabel: 'The agent writes',
            output: 'According to the calendar, 15:00-15:30 tomorrow works for the project team.',
            verification: {
                status: 'passed',
                text: 'A valid calendar result was returned, so the wording can be grounded on it.',
            },
            takeaway: 'The tool call succeeded, but that is only one step. The task also includes sending the invitation, so it is not complete yet.',
        },
        {
            id: 'approval',
            modeType: 'approval',
            control: 'Agent · approval',
            badgeLabel: 'Approval required before sending',
            title: 'The agent prepares a draft and stops for approval',
            summary: 'The next step is to send the invitation for 15:00-15:30 tomorrow. That is a sensitive action, so the agent prepares a draft only and stops.',
            steps: ['Draft the invitation', 'Detect a sensitive action', 'Stop for approval'],
            outputLabel: 'Invitation draft (not sent)',
            output: 'Hi team, based on the calendar, tomorrow 15:00-15:30 works for the 30-minute planning meeting. Please confirm and I will send the invitation.',
            note: 'The draft is ready, but it was not sent. The full pattern is draft, request approval, execute only after approval, and then verify the result. If approval is denied, the agent stops and does not send.',
            verification: {
                status: 'pending',
                text: 'There is no result to verify yet, because the invitation was not sent. Verification waits until after approval and sending.',
            },
            takeaway: 'An agent can prepare an action, but a real and sensitive action stops for approval. Capability is not permission.',
        },
        {
            id: 'toolError',
            modeType: 'toolError',
            control: 'Agent · tool failure',
            badgeLabel: 'Tool failed, not verified',
            title: 'The tool fails, and the agent does not invent',
            summary: 'The calendar tool returns a temporary error. A good agent does not present availability it never received.',
            steps: ['Choose a calendar tool', 'Read an error', 'One bounded retry', 'Stop and report'],
            tool: {
                name: 'Calendar availability lookup',
                inputLabel: 'Input',
                input: 'Project team, 30 minutes, tomorrow afternoon',
                resultLabel: 'Result',
                result: ['Error: the calendar service is not available right now'],
            },
            retry: {
                attemptsLabel: 'Retry and limit',
                attempts: ['First attempt: error, the service is unavailable.', 'One retry: error again.'],
                limitNote: 'Limit: one retry only, not endless attempts.',
                stopReason: 'The limit was reached and the error persists, so the agent stops instead of retrying further.',
            },
            outputLabel: 'The agent reports',
            output: 'I could not check calendar availability right now, because the calendar tool is returning an error. I will not invent a time. You can try again later, or confirm the acceptable time range.',
            note: 'This is a tool failure, the planning decision is to stop, and the final outcome is that the task is not complete. The agent does not pretend otherwise.',
            verification: {
                status: 'failed',
                text: 'No valid calendar result was returned after the retry, so a time cannot be verified.',
            },
            takeaway: 'A tool failure is not the agent failing, but it is certainly not success. A good agent reports that nothing was verified instead of inventing.',
        },
    ],
};
