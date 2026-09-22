// i18n/locales/en/behind-ai/guardrailsLab.ts
//
// English (en, LTR) data for the "Guardrails Lab" of Chapter 18 ("Guardrails: Risk,
// Permissions, Approval, and Stopping"). Hebrew is the source of truth and defines the
// type (GuardrailsLabContent). Continues the meeting scheduling scenario opened in
// Chapter 17 (Chat to Agent).
//
// Core idea: the exact same request, "Arrange a 30-minute project planning meeting and
// send the invitation", leads to six different actions, and each action passes through a
// control layer: ask for missing info, a low-risk read that is allowed, a draft that is
// prepared only, a send that needs approval, a forbidden booking without confirmed
// evidence that is blocked, and a retry that stops at its limit.
//
// Fully deterministic: no randomness, no real model call, no real calendar system, no real
// invitation sent, no real booking change, and no hidden chain of thought. Every example is
// for teaching only. The order of actions stays fixed, as do the structural keys.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { GuardrailsLabContent } from '../../he/behind-ai/guardrailsLab';

export const guardrailsLab: GuardrailsLabContent = {
    sectionEyebrow: 'Guardrails Lab',
    sectionTitle: 'Same request, six actions, six decisions',
    sectionIntro:
        'The request is fixed: "Arrange a 30-minute project planning meeting and send the invitation." Compare six actions: continue, ask, draft, wait for approval, block, or stop at a retry limit.',
    heading: 'The control layer',
    kicker: 'Guardrails Lab',
    taskLabel: 'The task',
    task: 'Arrange a 30-minute project planning meeting and send the invitation.',
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
        'All examples here are for teaching only. There is no real connection to a calendar system, no real invitation sent, and no real booking change. The goal is to show how risk and permission decide the outcome, not to describe a specific product.',
    sr: {
        actionGroup: 'Choose a requested action',
        actionDetail: 'Details of the chosen action and the control decision',
    },
    actions: [
        {
            id: 'ask',
            actionType: 'ask',
            control: 'Ask for missing info',
            request: 'Start the task without an acceptable time range for the meeting.',
            riskTone: 'missing',
            riskLabel: 'Missing info',
            outcomeTone: 'ask',
            outcomeLabel: 'Stops and asks',
            checks: [
                { label: 'Required info', state: 'fail', note: 'No acceptable time range, real availability cannot be checked.' },
                { label: 'Risk level', state: 'warn', note: 'Any action now would rest on a guess.' },
                { label: 'Permission', state: 'warn', note: 'Not enough information to decide on an action.' },
            ],
            mayDo: 'Ask the user for the acceptable time range, and only then continue.',
            mustNot: 'Invent a time range or availability to move forward.',
            auditNote: 'The task cannot start without the required input. A good agent stops and asks for what is missing instead of guessing.',
            verification: 'No execution yet. The system is waiting for the missing input.',
            takeaway: 'Missing critical info? Stop and ask, do not guess.',
        },
        {
            id: 'lookup',
            actionType: 'lookup',
            control: 'Check availability',
            request: 'Check calendar availability for a 30-minute meeting tomorrow afternoon.',
            riskTone: 'low',
            riskLabel: 'Low risk',
            outcomeTone: 'allow',
            outcomeLabel: 'Allowed',
            checks: [
                { label: 'Required info', state: 'pass', note: 'The time range is valid: tomorrow afternoon, participants already known.' },
                { label: 'Risk level', state: 'pass', note: 'Read only, it changes nothing in the world.' },
                { label: 'Permission', state: 'pass', note: 'The calendar lookup tool is allowed for this identity, on this calendar.' },
            ],
            result: {
                label: 'Tool result (sample)',
                rows: ['Status: a slot was found', 'Suitable time: 15:00-15:30'],
            },
            mayDo: 'Read the availability and show it to the user.',
            mustNot: 'Change anything on the calendar or rely on a time that did not appear in the result.',
            auditNote: 'A read action changes nothing in the world. When the tool is available and allowed, it can continue without extra approval.',
            verification: 'Output validation confirms a recognized status was returned. Allowed does not mean the slot is locked in, only that expected form was returned.',
            takeaway: 'Reading information is the safest action. It changes nothing.',
        },
        {
            id: 'draft',
            actionType: 'draft',
            control: 'Draft the invitation',
            request: 'Draft an invitation for the 15:00-15:30 slot.',
            riskTone: 'medium',
            riskLabel: 'Medium risk',
            outcomeTone: 'draft',
            outcomeLabel: 'Draft only',
            checks: [
                { label: 'Required info', state: 'pass', note: 'A confirmed slot from the tool is available for the draft.' },
                { label: 'Risk level', state: 'warn', note: 'The invitation addresses participants, but was not sent yet.' },
                { label: 'Permission', state: 'warn', note: 'Preparing a draft is allowed, sending it is not.' },
            ],
            result: {
                label: 'Draft (not sent)',
                rows: ['Hi team, based on the calendar, tomorrow 15:00-15:30 works for the 30-minute planning meeting. Please confirm and I will send the invitation.'],
            },
            mayDo: 'Prepare a draft and show it for review.',
            mustNot: 'Send the draft without approval.',
            auditNote: 'Drafting is safer than sending. The draft is ready for human review, and nothing has gone out to participants yet.',
            verification: 'The draft exists. Verification does not claim the slot is final, and does not say it was sent.',
            takeaway: 'A draft is safer than sending. It is easy to fix before anything goes out.',
        },
        {
            id: 'send',
            actionType: 'send',
            control: 'Send the invitation',
            request: 'Send the invitation for the 15:00-15:30 slot to the known participants.',
            riskTone: 'high',
            riskLabel: 'High risk',
            outcomeTone: 'approval',
            outcomeLabel: 'Approval required',
            checks: [
                { label: 'Required info', state: 'pass', note: 'The draft is ready.' },
                { label: 'Risk level', state: 'fail', note: 'An external action that goes out to real participants and is hard to undo.' },
                { label: 'System authorization', state: 'pass', note: 'This identity is allowed to use the send tool.' },
                { label: 'Human approval', state: 'warn', note: 'Required before execution. Authorization is not approval.' },
            ],
            result: { label: 'Approval state (invitation not sent)', rows: ['Execution waits. The invitation is not sent until approval is given.', 'If approval is given, sending can proceed.', 'If approval is denied, cancelled, or expires, the action stops and no invitation is sent.'] },
            mayDo: 'Show the draft and ask for explicit approval to send.',
            mustNot: 'Send before approval is given, or treat approval as already granted.',
            auditNote: 'Sending to participants is an external action that is hard to undo. Even when the system allows the tool, execution waits at the human approval gate.',
            verification: 'Pending because sending did not occur. Authorization to act does not prove the outcome happened.',
            takeaway: 'An external, sensitive action passes through an approval gate. System authorization is not human approval.',
        },
        {
            id: 'mark',
            actionType: 'mark',
            control: 'Mark as confirmed',
            request: 'Mark the meeting as confirmed and booked, even though the calendar has not confirmed availability.',
            riskTone: 'blocked',
            riskLabel: 'Blocked',
            outcomeTone: 'stop',
            outcomeLabel: 'Blocked',
            checks: [
                { label: 'Required info', state: 'fail', note: 'The tool did not confirm availability, there is no basis for booking.' },
                { label: 'Risk level', state: 'fail', note: 'Changing an official record with no basis.' },
                { label: 'Policy', state: 'fail', note: 'Booking a meeting without a confirmed slot from the tool is a blocked action.' },
                { label: 'Human approval', state: 'fail', note: 'Human approval cannot override the policy block, and cannot manufacture availability.' },
            ],
            mayDo: 'Explain that the meeting cannot be marked as booked without confirmed availability from the tool.',
            mustNot: 'Book the meeting or invent availability that the tool did not return.',
            auditNote: 'Some actions stay blocked even when the agent can describe them. Booking without confirmed availability harms the reliability of the whole system. Human approval cannot turn unverified availability into a fact.',
            verification: 'Not executed, so there is no result to verify. A blocked action need not be malicious; it may exceed identity, resource, policy, or approval boundaries.',
            takeaway: 'Some actions simply are not performed, even if they can be described. Approval is not evidence.',
        },
        {
            id: 'limit', actionType: 'retry', control: 'Retry limit',
            request: 'Keep retrying the calendar lookup until a slot is found.',
            riskTone: 'limit', riskLabel: 'Retry limit', outcomeTone: 'limit', outcomeLabel: 'Stopped at limit',
            checks: [
                { label: 'Input validation', state: 'pass', note: 'The time range is valid, the call itself is legitimate.' },
                { label: 'Retry limit', state: 'fail', note: 'The limit is a first attempt plus one retry, two total. Both returned no slot.' },
                { label: 'System authorization', state: 'pass', note: 'Reads are allowed, but the configured limit still applies.' },
            ],
            result: { label: 'Attempt summary', rows: ['Attempt 1 of 2: error, the service is unavailable.', 'Attempt 2 of 2 (one retry): error again, limit reached.'] },
            mayDo: 'Stop and report that no slot was verified within the allowed attempts.',
            mustNot: 'Retry without limit or report that a slot was found.',
            auditNote: 'A retry limit safely stops repeated execution and records an honest stopped outcome.',
            verification: 'No valid verified result. Reaching the limit is a safe stop, not success.',
            takeaway: 'Limits stop execution safely and make the stop reason visible.',
        },
    ],
};
