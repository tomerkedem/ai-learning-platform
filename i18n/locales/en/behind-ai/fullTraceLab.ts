// i18n/locales/en/behind-ai/fullTraceLab.ts
//
// English (en, LTR) data for the "Full Trace Lab" of Chapter 19 ("Full Trace: One Prompt,
// All Stations"), the capstone chapter. Hebrew is the source of truth and defines the type
// (FullTraceLabContent).
//
// Core idea: one deterministic prompt, "Check what is happening with package 123456789,
// draft an update for the customer, and do not send without my approval", passes through
// five grouped stages, from input to a controlled outcome.
//
// Fully deterministic: no randomness, no real model call, no real tracking system, no real
// message sending, no real status change, and no hidden chain of thought. Full Trace is a
// teaching record of visible stages, not a peek into private reasoning. Every example is
// for teaching only. The order of stages stays fixed, as do the structural keys.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { FullTraceLabContent } from '../../he/behind-ai/fullTraceLab';

export const fullTraceLab: FullTraceLabContent = {
    sectionEyebrow: 'Full Trace Lab',
    sectionTitle: 'One prompt, five stages, a controlled outcome',
    sectionIntro:
        'The prompt is fixed: "Check what is happening with package 123456789, draft an update for the customer, and do not send without my approval." Step through it stage by stage, from input to decision, and see how the same request becomes signals, a model path, grounding in a source, a draft, and finally a controlled decision.',
    heading: 'The full route',
    kicker: 'Full Trace Lab',
    promptLabel: 'The prompt',
    prompt: 'Check what is happening with package 123456789, draft an update for the customer, and do not send without my approval.',
    stageWord: 'Stage',
    teachingLabel: 'What this stage teaches',
    prevLabel: 'Previous stage',
    nextLabel: 'Next stage',
    disclaimer:
        'Every example here is for teaching only. There is no real tracking system, no real message sending, and no real status change. Full Trace is a teaching record of visible stages, not a peek into the model private chain of thought.',
    sr: {
        stageGroup: 'Pick a stage in the route',
        stageDetail: 'Details of the selected stage in the full route',
        prevBtn: 'Go to the previous stage',
        nextBtn: 'Go to the next stage',
    },
    stages: [
        {
            id: 'input',
            tone: 'input',
            tab: 'Input and meaning',
            groupLabel: 'Input and meaning',
            title: 'What comes in, and what the system detects',
            summary: 'One request breaks into several signals the system can work with.',
            panels: [
                { kind: 'prompt', label: 'The prompt', text: 'Check what is happening with package 123456789, draft an update for the customer, and do not send without my approval.' },
                {
                    kind: 'signals',
                    label: 'Detected signals',
                    items: [
                        { k: 'Package id', v: '123456789' },
                        { k: 'Task', v: 'Check status' },
                        { k: 'Requested output', v: 'Draft customer update' },
                        { k: 'Boundary', v: 'Do not send without approval' },
                    ],
                },
            ],
            teaching: 'A good prompt gives the system more usable structure: a goal, data, an output, and a boundary.',
        },
        {
            id: 'model',
            tone: 'model',
            tab: 'Model path',
            groupLabel: 'Model path',
            title: 'How the model organizes the request',
            summary: 'The model splits into tokens, builds meaning, sees what to focus on, and estimates the likely next step.',
            panels: [
                { kind: 'chips', label: 'Tokens (parts)', items: ['Check', 'what', 'is', 'happening', 'with', 'package', '123456789', 'draft', 'an', 'update', 'for', 'the', 'customer', 'do', 'not', 'send', 'without', 'approval'] },
                { kind: 'chips', label: 'Meaning summary (not numbers)', items: ['package status', 'customer update', 'approval boundary'] },
                { kind: 'chips', label: 'Attention focus', items: ['the package id', 'update customer', 'do not send'] },
                { kind: 'note', label: 'Likely next step', text: 'The task needs a current status, so it is reasonable to reach for a lookup tool.', tone: 'neutral' },
            ],
            teaching: 'The model organizes the prompt into signals and a likely next step. This is still not fact checking.',
        },
        {
            id: 'grounding',
            tone: 'grounding',
            tab: 'Grounding',
            groupLabel: 'Grounding and source',
            title: 'Where real information comes from',
            summary: 'The system reaches for a tracking tool and separates what is grounded in the source from what is not.',
            panels: [
                { kind: 'note', label: 'Selected tool', text: 'Tracking lookup via MCP', tone: 'neutral' },
                { kind: 'result', label: 'Tool result (example)', rows: ['Status: delayed', 'Estimated delivery: unavailable'] },
                {
                    kind: 'split',
                    label: 'What is grounded and what is not',
                    posLabel: 'Grounded in the source',
                    pos: ['The package is delayed'],
                    negLabel: 'Not grounded',
                    neg: ['The exact arrival date'],
                },
            ],
            teaching: 'The system should not invent an arrival date that is missing from the source. Source before conclusion.',
        },
        {
            id: 'draft',
            tone: 'draft',
            tab: 'Draft',
            groupLabel: 'The agent draft',
            title: 'Prepare an output, without an external action',
            summary: 'The agent drafts a message based on the result, but does not send it yet.',
            panels: [
                { kind: 'result', label: 'Draft to the customer (not sent)', rows: ['Hello, we checked package 123456789. According to tracking it is delayed, and there is still no confirmed arrival date. We will update as soon as we have new information.'] },
                { kind: 'note', label: 'Draft source', text: 'Based on the tool result, with no invented date.', tone: 'good' },
                { kind: 'note', label: 'Send status', text: 'Not sent yet.', tone: 'warn' },
            ],
            teaching: 'The agent can prepare a useful output without performing the external action.',
        },
        {
            id: 'guardrails',
            tone: 'guardrails',
            tab: 'Control',
            groupLabel: 'Control and decision',
            title: 'What is allowed to run, and what the final output is',
            summary: 'The control layer sees that sending is an external action, so it stops for approval and returns a draft.',
            panels: [
                {
                    kind: 'signals',
                    label: 'Control check',
                    items: [
                        { k: 'Requested action', v: 'Send an update to the customer' },
                        { k: 'Risk', v: 'External customer communication' },
                        { k: 'Boundary from the prompt', v: 'Do not send without approval' },
                        { k: 'Decision', v: 'Draft only, waiting for approval' },
                    ],
                },
                { kind: 'note', label: 'Final output', text: 'A ready draft, with a note: not sent to the customer. Waiting for approval.', tone: 'warn' },
            ],
            teaching: 'The correct output is not just a nice message. It is a controlled outcome: an answer, a draft, an action, or a stop.',
        },
    ],
};
