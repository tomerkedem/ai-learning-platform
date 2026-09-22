// i18n/locales/en/behind-ai/mistakeLearningLab.ts
//
// English (en, LTR) data for the "Learning from Mistakes Lab" of Chapter 14 (Learning from
// Mistakes: how a model improves from a mistake). Hebrew is the source of truth and defines
// the type (MistakeLearningLabContent).
//
// Core idea: one fixed customer request, one fixed source card, one fixed wrong first answer,
// and one fixed correction, shared across all modes. The learner moves between four levels
// where learning from a mistake can happen:
//   context    = a correction inside the current conversation (helps now, does not change the model).
//   system     = a change to the system around the model (prompt, source, rules, checks).
//   training   = a contribution to training or fine-tuning a future version (a separate, slow process).
//   evaluation = measuring that the improvement really happened, before announcing it.
//
// Fully deterministic: no randomness, no real model call, and no claim about the policy of a
// specific product, about data retention, or about the training of a specific system. Every
// example here is a teaching example only. The mode and step order and their ids stay fixed,
// as do the structural level and tone keys.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { MistakeLearningLabContent } from '../../he/behind-ai/mistakeLearningLab';

export const mistakeLearningLab: MistakeLearningLabContent = {
    sectionEyebrow: 'Learning from Mistakes Lab',
    sectionTitle: 'The same mistake, four levels of improvement',
    sectionIntro:
        'A visitor asks what the library\'s holiday hours are. The model gave a wrong answer, and you corrected it. Move between the four levels and see where the improvement really happens: in the current conversation, in the system around the model, in the training of a future version, or in a check that the improvement is real.',
    heading: 'Behind learning from a mistake',
    kicker: 'Learning from Mistakes Lab',
    scenarioLabel: 'The visitor question',
    scenario: 'What are the library\'s opening hours on the holiday?',
    sourceLabel: 'The library\'s details (sample)',
    sourceCaption: 'Sample card only, for illustration. This is not real data.',
    sourceNote: 'Note: the source gives regular hours, but no holiday hours. A good answer will not invent any.',
    sourceRows: [
        { label: 'Regular hours', value: '09:00-18:00' },
        { label: 'Holiday hours', value: 'Not available', missing: true },
    ],
    initialLabel: 'The model first answer',
    initialAnswer: 'The library is open from 10:00 to 14:00 on the holiday.',
    correctionLabel: 'Your correction',
    correction: 'That is not right. The source does not state holiday opening hours.',
    modeLabel: 'Where can the improvement happen?',
    flowLabel: 'What actually happens',
    improvedLabel: 'What improved',
    notImprovedLabel: 'What did not necessarily improve',
    takeawayLabel: 'Bottom line',
    disclaimer:
        'All the examples here are for teaching only. There is no claim about the policy of a specific product, about data retention, or about the training of a specific system. The goal is to show, in general terms, where learning from a mistake can happen.',
    sr: {
        modeGroup: 'Choosing the improvement level',
        steps: 'The process steps of the selected improvement level',
    },
    modes: [
        {
            id: 'context',
            level: 'context',
            control: 'In the current conversation',
            badgeLabel: 'Correction in context',
            title: 'The model fixes the answer inside the conversation',
            summary: 'The correction enters the context of the conversation, and the model writes a new answer now.',
            steps: [
                { id: 'context-1', label: 'First answer', text: 'The model answers: "The library is open from 10:00 to 14:00 on the holiday." That is a claim with no source.', tone: 'wrong' },
                { id: 'context-2', label: 'Your correction', text: 'You write: "That is not right. The source does not state holiday opening hours."', tone: 'context' },
                { id: 'context-3', label: 'The context updates', text: 'The correction becomes part of the context of this conversation.', tone: 'context' },
                { id: 'context-4', label: 'Revised answer', text: 'The model answers again: "Right. According to the source, the regular hours are 09:00-18:00, and the holiday hours are not available."', tone: 'good' },
            ],
            beforeAfter: {
                beforeLabel: 'Before the correction',
                before: 'The library is open from 10:00 to 14:00 on the holiday.',
                afterLabel: 'After the correction',
                after: 'According to the source, the regular hours are 09:00-18:00. The holiday hours are not available.',
            },
            improved: 'The current conversation. The model used the correction to write a better answer here and now.',
            notImproved: 'The base model. The correction lives in the context of this conversation only, and it does not enter the model automatically.',
            takeaway: 'A correction in a conversation helps right away, because it sits inside the context. That is not the same as a permanent change to the model.',
        },
        {
            id: 'system',
            level: 'system',
            control: 'In the system around the model',
            badgeLabel: 'System improvement',
            title: 'The same mistake keeps recurring, the team changes the system',
            summary: 'When many answers invent an arrival date, you can fix the system that wraps the model.',
            steps: [
                { id: 'system-1', label: 'A recurring pattern', text: 'The system invents holiday hours when the source has none, again and again.', tone: 'wrong' },
                { id: 'system-2', label: 'Improving the prompt', text: 'A rule is added to the prompt: do not invent holiday hours that are not in the source.', tone: 'system' },
                { id: 'system-3', label: 'Improving the source', text: 'The source card is improved so it explicitly marks "holiday hours not available".', tone: 'system' },
                { id: 'system-4', label: 'Adding a check', text: 'A self-check step and a fixed test for this case are added.', tone: 'eval' },
            ],
            improved: 'The product. The prompt, the source, the rules, and the checks around the model improved.',
            notImproved: 'The weights of the base model. They did not change here. What changed is the system around it.',
            takeaway: 'You can improve the product without touching the base model, through prompts, sources, rules, and checks.',
        },
        {
            id: 'training',
            level: 'training',
            control: 'In the training of the model',
            badgeLabel: 'Training improvement',
            title: 'From recurring mistakes to a future version',
            summary: 'Recurring mistakes can become examples for future training, in a separate and slow process.',
            steps: [
                { id: 'training-1', label: 'Collecting examples', text: 'Cases where the answer invented holiday hours are collected.', tone: 'wrong' },
                { id: 'training-2', label: 'Review and correction', text: 'People review the examples, filter out unclear or wrong feedback, and correct the rest into a right answer.', tone: 'training' },
                { id: 'training-3', label: 'A training set', text: 'The corrected examples go into a training or fine-tuning set.', tone: 'training' },
                { id: 'training-4', label: 'Evaluation', text: 'They check whether the new version really improves, without breaking other things.', tone: 'eval' },
                { id: 'training-5', label: 'A new version', text: 'If the evaluation passes, an updated version of the model is released.', tone: 'good' },
            ],
            improved: 'A future version of the model, if this process is actually carried out and passes evaluation.',
            notImproved: 'This conversation and the current model. It does not happen automatically from a single correction in Chat.',
            takeaway: 'Mistakes can contribute to future training, but that is a separate process with people, data, and evaluation. Not immediate and not automatic.',
        },
        {
            id: 'evaluation',
            level: 'evaluation',
            control: 'In checking the improvement',
            badgeLabel: 'Evaluation',
            title: 'Did the system really improve?',
            summary: 'Before saying "we fixed it", both versions are checked on the same cases.',
            steps: [
                { id: 'eval-1', label: 'A test case', text: 'The exact same request is taken and run on both versions.', tone: 'eval' },
                { id: 'eval-2', label: 'Previous version', text: 'Answered "open from 10:00 to 14:00 on the holiday". Failed, because it invented hours that are not in the source.', tone: 'wrong' },
                { id: 'eval-3', label: 'New version', text: 'Answered "the holiday hours are not available in the source". Passed, because it relied on the source.', tone: 'good' },
                { id: 'eval-4', label: 'Many cases', text: 'Dozens of similar cases are checked, not just one, and how many passed is measured.', tone: 'eval' },
            ],
            beforeAfter: {
                beforeLabel: 'Previous version',
                before: 'Invents holiday hours when the source has none.',
                afterLabel: 'New version',
                after: 'Says the holiday hours are not available in the source.',
            },
            improved: 'The confidence that the change really helps. Now there is a measurement, not just a feeling.',
            notImproved: 'Nothing is guaranteed. Evaluation shows whether we improved, it does not make every single case right.',
            takeaway: 'Improvement has to be measured, not taken for granted. Without evaluation, "we fixed it" is just hope.',
        },
    ],
};
