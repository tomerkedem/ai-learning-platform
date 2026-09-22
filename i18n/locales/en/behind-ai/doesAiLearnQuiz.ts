// i18n/locales/en/behind-ai/doesAiLearnQuiz.ts
//
// English (en, LTR) display text for the Chapter 16 quiz ("Does AI Learn From Me").
// Hebrew is the source of truth.
//
// This is display text only. The shared mechanism (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) lives in the shared quizData.ts. The chapter page
// merges this display text onto the shared question skeleton by question id (byId), so the
// order of options must stay identical across languages.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013).

import type { DoesAiLearnQuizId, DoesAiLearnQuizText } from '../../he/behind-ai/doesAiLearnQuiz';

export const doesAiLearnQuiz = {
    title: 'Understanding check: does AI learn from me',
    subtitle: 'Five questions that sharpen what you learned in this chapter',
    startLabel: 'Start the check',
    submitLabel: 'Finish the check',
    completedTitle: 'You finished the check',

    byId: {
        1: {
            question: 'You corrected the model mid conversation, and it corrected itself. What is the most accurate thing to say about what happened?',
            options: [
                'The model changed permanently and remembers the correction from now on',
                'The correction entered the conversation context, so the model can use it later in the same chat',
                'The model ignored the correction entirely',
                'All users now get the corrected answer',
            ],
            explanation:
                'What you wrote is now in the conversation context, so the model can rely on it in later answers within the same chat. That does not mean the base model changed, and not that the correction reaches all users.',
        },
        2: {
            question: 'You opened a new chat and asked a similar question again, without providing the correction again. What is the safe assumption?',
            options: [
                'The model certainly remembers the correction from the previous chat',
                'Do not assume the previous correction is there, unless the product keeps memory or you provided the context again',
                'The new chat always continues exactly where the previous one stopped',
                'The model also forgot what it learned in training',
            ],
            explanation:
                'A new chat starts without the context of the previous one. Unless the product has a memory feature, or you provide the information again, do not assume the correction is still there. It does not mean the model "forgot" everything, only that the correction from the previous chat is not in the current context.',
        },
        3: {
            question: 'A certain product saves a preference: "do not state holiday opening hours without a source". How is that different from training the model?',
            options: [
                'There is no difference, memory and training are the same thing',
                'Memory is a product feature that saves information and returns it to the context; training is a separate process that changed the model itself',
                'Memory changes the model weights every time it is used',
                'Training happens immediately every time a preference is saved',
            ],
            explanation:
                'A memory feature saves information and returns it to the context, so answers can follow it. That is different from training, which is a separate process that changes the model itself. Saving a preference does not train the model.',
        },
        4: {
            question: 'Why does one correction of yours in a chat not automatically update the model for all users?',
            options: [
                'Because the model chooses to ignore certain users',
                'Because changing the model itself requires a separate process of training or a system update, testing, and release, not a single message in a chat',
                'Because corrections only work after three times',
                'Because every correction always goes straight into training',
            ],
            explanation:
                'Changing the model behavior for everyone requires a separate process: collecting examples, training or a system update, evaluation, and release. It does not happen from a single correction in one chat, and not automatically for all users. If feedback is used at all, it depends on the product and policy.',
        },
        5: {
            question: 'There is an important rule you want the model to follow every time. What is the safest thing to do?',
            options: [
                'Assume the model already learned the rule from the previous chat and not repeat it',
                'Provide the rule or the source again in the prompt, or use saved context, instead of relying on invisible memory',
                'Write the rule once and then trust that the model will change permanently',
                'Wait for the model to train on the rule by itself',
            ],
            explanation:
                'When accuracy matters, do not rely on "the model already knows". Provide the rule or the source again in the prompt, or use saved context if the product offers it. That way the instruction is in the context the model sees now, and it does not depend on invisible learning.',
        },
    } satisfies Record<DoesAiLearnQuizId, DoesAiLearnQuizText>,
};
