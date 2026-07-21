// i18n/locales/en/behind-ai/guardrailsLab.ts
//
// English (en, LTR) data for the "Guardrails Lab" of Chapter 18 ("Guardrails: Risk,
// Permissions, Approval, and Stopping"). Hebrew is the source of truth and defines the
// type (GuardrailsLabContent).
//
// Core idea: the exact same task, "Check the package and update the customer", leads to
// five different actions, and each action passes through a control layer: ask for missing
// info, a low-risk read that is allowed, a draft that is prepared only, a send that needs
// approval, and a forbidden status change that is blocked.
//
// Fully deterministic: no randomness, no real model call, no real tracking system, no real
// message sending, no real status change, and no hidden chain of thought. Every example is
// for teaching only. The order of actions stays fixed, as do the structural keys.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { GuardrailsLabContent } from '../../he/behind-ai/guardrailsLab';

export const guardrailsLab: GuardrailsLabContent = {
    sectionEyebrow: 'Guardrails Lab',
    sectionTitle: 'Same task, six actions, six decisions',
    sectionIntro:
        'The task is fixed: "Check the package and update the customer." Compare six actions: continue, ask, draft, wait for approval, block, or stop at a retry limit.',
    heading: 'The control layer',
    kicker: 'Guardrails Lab',
    taskLabel: 'The task',
    task: 'Check the package and update the customer.',
    actionSelectLabel: 'Pick an action',
    requestLabel: 'Requested action',
    riskLabel: 'Risk level',
    checksLabel: 'Control check',
    outcomeLabel: 'System decision',
    mayLabel: 'The agent may',
    mustNotLabel: 'The agent must not',
    auditLabel: 'Control note',
    verifyLabel: 'Result verification',
    takeawayLabel: 'The bottom line',
    disclaimer:
        'All examples here are for teaching only. There is no real tracking system, no real message sending, and no real status change. The goal is to show how risk and permission decide the outcome, not to describe a specific product.',
    sr: {
        actionGroup: 'Choose a requested action',
        actionDetail: 'Details of the chosen action and the control decision',
    },
    actions: [
        {
            id: 'ask',
            actionType: 'ask',
            control: 'Ask for missing info',
            request: 'Start the task without a tracking number.',
            riskTone: 'missing',
            riskLabel: 'Missing info',
            outcomeTone: 'ask',
            outcomeLabel: 'Stops and asks',
            checks: [
                { label: 'Required info', state: 'fail', note: 'No tracking number, a real status cannot be checked.' },
                { label: 'Risk level', state: 'warn', note: 'Any action now would rest on a guess.' },
                { label: 'Permission', state: 'warn', note: 'Not enough information to decide on an action.' },
            ],
            mayDo: 'Ask the user for the tracking number, and only then continue.',
            mustNot: 'Invent a tracking number or a status to move forward.',
            auditNote: 'The task cannot start without the required input. A good agent stops and asks for what is missing instead of guessing.',
            verification: 'No execution yet. The system is waiting for the missing input.',
            takeaway: 'Missing critical info? Stop and ask, do not guess.',
        },
        {
            id: 'lookup',
            actionType: 'lookup',
            control: 'Check status',
            request: 'Check the tracking status of the package.',
            riskTone: 'low',
            riskLabel: 'Low risk',
            outcomeTone: 'allow',
            outcomeLabel: 'Allowed',
            checks: [
                { label: 'Required info', state: 'pass', note: 'A tracking number is available.' },
                { label: 'Risk level', state: 'pass', note: 'Read only, it changes nothing in the world.' },
                { label: 'Permission', state: 'pass', note: 'A read tool is available and allowed.' },
            ],
            result: {
                label: 'Tool result (sample)',
                rows: ['Status: delayed', 'Estimated arrival: not available'],
            },
            mayDo: 'Read the status and show it to the user.',
            mustNot: 'Change the status or rely on what did not appear in the result.',
            auditNote: 'A read action changes nothing in the world. When the tool is available and allowed, it can continue without extra approval.',
            verification: 'Output validation confirms a recognized status was returned. Expected form does not guarantee semantic truth.',
            takeaway: 'Reading information is the safest action. It changes nothing.',
        },
        {
            id: 'draft',
            actionType: 'draft',
            control: 'Draft a message',
            request: 'Draft a message to the customer about the delay.',
            riskTone: 'medium',
            riskLabel: 'Medium risk',
            outcomeTone: 'draft',
            outcomeLabel: 'Draft only',
            checks: [
                { label: 'Required info', state: 'pass', note: 'A status from the source is available.' },
                { label: 'Risk level', state: 'warn', note: 'The message addresses the customer, but was not sent yet.' },
                { label: 'Permission', state: 'warn', note: 'Preparing a draft is allowed, sending it is not.' },
            ],
            result: {
                label: 'Draft (not sent)',
                rows: ['Hello, we checked your package. According to tracking it is delayed, and there is still no confirmed arrival date. We will update you as soon as we have new information.'],
            },
            mayDo: 'Prepare a draft and show it for review.',
            mustNot: 'Send the draft without approval.',
            auditNote: 'Drafting is safer than sending. The draft is ready for human review, and nothing has gone out to the customer yet.',
            verification: 'The draft exists. Verification does not claim it is correct or that it was sent.',
            takeaway: 'A draft is safer than sending. It is easy to fix before anything goes out.',
        },
        {
            id: 'send',
            actionType: 'send',
            control: 'Send the message',
            request: 'Send the message to the customer.',
            riskTone: 'high',
            riskLabel: 'High risk',
            outcomeTone: 'approval',
            outcomeLabel: 'Approval required',
            checks: [
                { label: 'Required info', state: 'pass', note: 'The draft is ready.' },
                { label: 'Risk level', state: 'fail', note: 'An external action that goes out to a real customer.' },
                { label: 'System authorization', state: 'pass', note: 'This identity is allowed to use the send tool for this resource.' },
                { label: 'Human approval', state: 'warn', note: 'Required before execution. Authorization is not approval.' },
            ],
            result: { label: 'Approval state (not sent)', rows: ['Execution waits before sending.', 'Denial, cancellation, or expiry stops the action. No message is sent.'] },
            mayDo: 'Show the draft and ask for explicit approval to send.',
            mustNot: 'Send before approval is given.',
            auditNote: 'Sending to a customer is an external action that is hard to undo. Even when the agent can send, it stops at the approval gate.',
            verification: 'Pending because sending did not occur. Authorization alone is not task success.',
            takeaway: 'An external, sensitive action passes through an approval gate. Capability is not permission.',
        },
        {
            id: 'mark',
            actionType: 'mark',
            control: 'Mark as delivered',
            request: 'Mark the package as delivered, even though the source shows a delay.',
            riskTone: 'blocked',
            riskLabel: 'Blocked',
            outcomeTone: 'stop',
            outcomeLabel: 'Blocked',
            checks: [
                { label: 'Required info', state: 'fail', note: 'The source does not support delivery, the status is delayed.' },
                { label: 'Risk level', state: 'fail', note: 'Changing an official record with no basis.' },
                { label: 'Policy', state: 'fail', note: 'The action is blocked by policy.' },
                { label: 'Human approval', state: 'fail', note: 'Human approval cannot override the policy block.' },
            ],
            mayDo: 'Explain that it cannot mark as delivered without a basis in the source.',
            mustNot: 'Change the official status or invent proof of delivery.',
            auditNote: 'Some actions stay blocked even when the agent can describe them. Changing an official status with no basis harms the reliability of the whole system.',
            verification: 'Not executed, so there is no result to verify. A blocked action need not be malicious; it may exceed identity, resource, policy, or approval boundaries.',
            takeaway: 'Some actions simply are not performed, even if they can be described.',
        },
        {
            id: 'limit', actionType: 'retry', control: 'Retry limit',
            request: 'Refresh tracking repeatedly until an arrival date appears.',
            riskTone: 'limit', riskLabel: 'Retry limit', outcomeTone: 'limit', outcomeLabel: 'Stopped at limit',
            checks: [
                { label: 'Input validation', state: 'pass', note: 'The tracking number is required, valid, and in scope.' },
                { label: 'Retry limit', state: 'fail', note: 'Three of three attempts returned no arrival date.' },
                { label: 'System authorization', state: 'pass', note: 'Reads are allowed, but the configured limit still applies.' },
            ],
            result: { label: 'Attempt summary', rows: ['Attempt 1 of 3: no date.', 'Attempt 2 of 3: no date.', 'Attempt 3 of 3: no date, limit reached.'] },
            mayDo: 'Stop and report that no arrival date was verified within the allowed attempts.',
            mustNot: 'Retry without limit or report success.',
            auditNote: 'A retry limit safely stops repeated execution and records an honest stopped outcome.',
            verification: 'No valid verified result. Reaching the limit is a safe stop, not success.',
            takeaway: 'Limits stop execution safely and make the stop reason visible.',
        },
    ],
};
