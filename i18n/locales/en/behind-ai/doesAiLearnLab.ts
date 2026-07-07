// i18n/locales/en/behind-ai/doesAiLearnLab.ts
//
// English (en, LTR) data for the "Does AI Learn Lab" of Chapter 16 (Does AI Learn From Me).
// Hebrew is the source of truth and defines the type (DoesAiLearnLabContent).
//
// Core idea: the model said "The package will arrive tomorrow", and the user corrected it:
// "No. According to tracking, there is no confirmed arrival date." The lab shows four layers
// where the correction behaves differently: the same chat (current context), a new chat (the
// context starts empty), a memory feature (a product example), and training or an update (a
// separate process).
//
// Fully deterministic: no randomness, no real model call, no hidden chain of thought, and no
// claim about the policy, privacy, or training of a specific product. Every example is for
// teaching only. The order of layers stays fixed, as do the structural layerType keys.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { DoesAiLearnLabContent } from '../../he/behind-ai/doesAiLearnLab';

export const doesAiLearnLab: DoesAiLearnLabContent = {
    sectionEyebrow: 'Does AI Learn Lab',
    sectionTitle: 'The same correction, four layers',
    sectionIntro:
        'The model said "The package will arrive tomorrow", and you corrected it. Move between the four layers and see when the correction helps, when it disappears, and the difference between context, memory, and training.',
    heading: 'Behind the learning',
    kicker: 'Does AI Learn Lab',
    scenario: {
        label: 'The scenario',
        aiSaidLabel: 'The model said',
        aiSaid: 'The package will arrive tomorrow.',
        userCorrectionLabel: 'You correct',
        userCorrection: 'No. According to tracking, there is no confirmed arrival date.',
        aiRevisedLabel: 'In the same chat, the model revises',
        aiRevised: 'Right. According to tracking, there is no confirmed arrival date.',
    },
    layerSelectLabel: 'Choose a layer',
    seesLabel: 'What the model sees now',
    answerLabel: 'Model answer',
    changedLabel: 'What changed',
    unchangedLabel: 'What did not change',
    takeawayLabel: 'Bottom line',
    disclaimer:
        'All examples here are for teaching only. Different products handle data differently, and there is no claim here about the policy, privacy, or training of a specific product. The goal is to show the difference between context, memory, and training, not to describe a specific product.',
    sr: {
        layerGroup: 'Choose a learning layer',
        layerDetail: 'Details of the selected layer',
    },
    layers: [
        {
            id: 'sameChat',
            layerType: 'sameChat',
            control: 'Same chat',
            badgeLabel: 'Current context',
            title: 'You corrected it, and the model follows the correction',
            summary: 'In the same chat you asked a similar question again. The correction is still in context, so the model can rely on it.',
            sees: [
                'The model opening message: The package will arrive tomorrow.',
                'Your correction: No. According to tracking, there is no confirmed arrival date.',
                'Your follow-up question, in the same chat.',
            ],
            answer: 'According to tracking, there is no confirmed arrival date. I will update as soon as there is one.',
            changed: 'The answer now follows the correction, because it is in the conversation context.',
            unchanged: 'The base model did not change. The correction lives in this chat only.',
            takeaway: 'What is written in the current conversation can influence the current answer.',
        },
        {
            id: 'newChat',
            layerType: 'newChat',
            control: 'New chat',
            badgeLabel: 'New chat',
            title: 'A new chat starts without the correction',
            summary: 'You opened a new chat and asked again, without providing the correction or the source again.',
            sees: [
                'A new chat, and the context starts empty.',
                'Your question now.',
                'The correction from the previous chat is not here.',
            ],
            answer: 'By the usual estimate, the package should arrive tomorrow.',
            changed: 'Without the correction in context, the model can go back to the original answer. Do not assume it remembers the correction.',
            unchanged: 'The model did not forget on purpose. The new chat simply does not contain what you wrote earlier.',
            takeaway: 'A new chat does not automatically include previous corrections, unless the product keeps memory or you provide the context again.',
        },
        {
            id: 'memory',
            layerType: 'memory',
            control: 'Memory feature',
            badgeLabel: 'Memory feature',
            title: 'A saved preference can return to context',
            summary: 'Some products let you save a preference. This is an example of a product feature, not a rule that always holds.',
            sees: [
                'Saved preference (example of a product feature): do not invent an arrival date without a source.',
                'Your question now.',
                'The preference is loaded into the context together with the question.',
            ],
            answer: 'By the saved preference, I will not invent a date. According to tracking, there is no confirmed arrival date.',
            changed: 'When the product provides memory, the preference returns to the context, so answers can follow it even in a new chat.',
            unchanged: 'Here too the base model did not change. Memory is a layer that returns information to the context, not training.',
            takeaway: 'Memory is a product feature that saves and returns information. It is different from training the model itself.',
        },
        {
            id: 'training',
            layerType: 'training',
            control: 'Training or update',
            badgeLabel: 'Training or update',
            title: 'Lasting improvement requires a separate process',
            summary: 'To change the model behavior over time, you need a separate process, not a single message in a chat.',
            sees: [
                'Many examples and feedback over time.',
                'Review by the team that builds the system.',
                'Training or a system update.',
                'Evaluation that checks whether the improvement is real.',
                'Future behavior that may improve.',
            ],
            answer: 'If and when an update arrives, future behavior may improve. It does not happen immediately from a single correction.',
            changed: 'After such a process, a future version of the system may behave differently.',
            unchanged: 'The process is slow and separate from your conversation, and depends on the product and policy. A single correction does not trigger it automatically.',
            takeaway: 'Lasting improvement of the model is a training or update process in itself, not live learning from the conversation.',
        },
    ],
};
