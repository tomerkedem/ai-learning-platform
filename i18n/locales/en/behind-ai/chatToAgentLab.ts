// i18n/locales/en/behind-ai/chatToAgentLab.ts
//
// English (en, LTR) data for the "Chat to Agent Lab" of Chapter 17 (Chat to Agent).
// Hebrew is the source of truth and defines the type (ChatToAgentLabContent).
//
// Core idea: the exact same request, "Check what is happening with the package and update
// the customer", is answered in four modes: a chat (answer only), an agent that is missing
// info (it asks instead of guessing), an agent that uses a tool (it grounds on the result),
// and an agent that needs approval (it prepares a draft and stops).
//
// Fully deterministic: no randomness, no real model call, no real tracking system, no real
// message sending, and no hidden chain of thought. Every example is for teaching only. The
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
        'The request is fixed: "Check what is happening with the package and update the customer." Move between the five modes and see how the same request is answered once as text, once as a request for information, once with a tool, once as a draft that stops for approval, and once as a tool that fails where the agent reports instead of inventing.',
    heading: 'From chat to agent',
    kicker: 'Chat to Agent Lab',
    requestLabel: 'The request',
    request: 'Check what is happening with the package and update the customer.',
    modeSelectLabel: 'Pick a mode',
    stepsLabel: 'Step path',
    permissionLabel: 'Permission',
    takeawayLabel: 'The bottom line',
    verificationLabel: 'Verification',
    verificationStatusLabels: { passed: 'Confirmed', pending: 'Pending', failed: 'Failed' },
    disclaimer:
        'Every example here is for teaching only. There is no real connection to a tracking system, no real message sent, and no hidden chain of thought shown. The goal is to show the difference between an answer and a controlled task path, not to describe a specific product.',
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
            title: 'Chat explains what should be done',
            summary: 'Chat receives the request and returns an answer. It does not use a tool and does not act in the world.',
            steps: ['Read the request', 'Write an answer'],
            outputLabel: 'The answer',
            output: 'To update the customer, you need to check the tracking status and then write a suitable message.',
            takeaway: 'Chat explains what should be done. It does not act on its own.',
        },
        {
            id: 'askInfo',
            modeType: 'askInfo',
            control: 'Agent · missing info',
            badgeLabel: 'Needs info',
            title: 'The agent spots what is missing and asks',
            summary: 'The agent has no tracking number. Instead of guessing a status, it stops and asks for what is missing.',
            steps: ['Understand the goal', 'Check for missing info', 'Ask for the tracking number'],
            outputLabel: 'The agent asks',
            output: 'What is the tracking number of the package? Without it I cannot check a real status.',
            takeaway: 'A good agent does not invent missing information. It asks for it before acting.',
        },
        {
            id: 'toolLookup',
            modeType: 'toolLookup',
            control: 'Agent · tool',
            badgeLabel: 'Tool call',
            title: 'The agent uses a tool and grounds on the result',
            summary: 'Now there is a tracking number. The agent picks a tracking lookup tool, reads the result, and writes based on it.',
            steps: ['Understand the goal', 'Choose a tracking tool', 'Read the result', 'Write from the data'],
            tool: {
                name: 'Tracking lookup tool',
                inputLabel: 'Input',
                input: 'Tracking number 123456789',
                resultLabel: 'Result (example)',
                result: ['Status: delayed', 'Estimated arrival: not available'],
            },
            outputLabel: 'The agent writes',
            output: 'According to the tracking data, the package is delayed and there is no confirmed arrival date.',
            verification: {
                status: 'passed',
                text: 'A valid tracking result was returned, so the wording can be grounded on it.',
            },
            takeaway: 'The tool call succeeded, but that is only one step. The task also includes updating the customer, so it is not complete yet.',
        },
        {
            id: 'approval',
            modeType: 'approval',
            control: 'Agent · approval',
            badgeLabel: 'Approval required before sending',
            title: 'The agent prepares a draft and stops for approval',
            summary: 'The next step is to send a message to the customer. That is a sensitive action, so the agent prepares a draft only and stops.',
            steps: ['Draft a message to the customer', 'Detect a sensitive action', 'Stop for approval'],
            outputLabel: 'Draft to the customer (not sent)',
            output: 'Hello, we checked your package. According to tracking it is delayed, and there is still no confirmed arrival date. We will update you as soon as there is new information.',
            note: 'The draft is ready, but it was not sent. The full pattern is draft, request approval, execute only after approval, and then verify the result. If approval is denied, the agent stops and does not send.',
            verification: {
                status: 'pending',
                text: 'There is no result to verify yet, because the message was not sent. Verification waits until after approval and sending.',
            },
            takeaway: 'An agent can prepare an action, but a real and sensitive action stops for approval. Capability is not permission.',
        },
        {
            id: 'toolError',
            modeType: 'toolError',
            control: 'Agent · tool failure',
            badgeLabel: 'Tool failed, not verified',
            title: 'The tool fails, and the agent does not invent',
            summary: 'The tracking tool returns a temporary error. A good agent does not present a status it never received.',
            steps: ['Choose a tracking tool', 'Read an error', 'One bounded retry', 'Stop and report'],
            tool: {
                name: 'Tracking lookup tool',
                inputLabel: 'Input',
                input: 'Tracking number 123456789',
                resultLabel: 'Result',
                result: ['Error: the tracking service is not available right now'],
            },
            retry: {
                attemptsLabel: 'Retry and limit',
                attempts: ['First attempt: error, the service is unavailable.', 'One retry: error again.'],
                limitNote: 'Limit: one retry only, not endless attempts.',
                stopReason: 'The limit was reached and the error persists, so the agent stops instead of retrying further.',
            },
            outputLabel: 'The agent reports',
            output: 'I could not verify the package status right now, because the tracking tool is returning an error. I will not invent a status. You can try again later, or check the tracking number.',
            note: 'This is a tool failure, the planning decision is to stop, and the final outcome is that the task is not complete. The agent does not pretend otherwise.',
            verification: {
                status: 'failed',
                text: 'No valid tracking result was returned after the retry, so the status cannot be verified.',
            },
            takeaway: 'A tool failure is not the agent failing, but it is certainly not success. A good agent reports that nothing was verified instead of inventing.',
        },
    ],
};
