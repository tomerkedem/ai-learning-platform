// i18n/locales/en/behind-ai/generationLoopLab.ts
// English Answer Builder Lab strings. Shape source: ../../he/behind-ai/generationLoopLab.
// scenario candidate order matches the skeleton (first candidate = chosen). The first
// step's fragments are capitalized so the assembled answer reads cleanly after the
// opener: "Opener. Fragment, fragment, and fragment."

export const generationLoopLab = {
    loop: {
        contextSoFar: 'Context so far',
        candidates: 'Possible parts',
        chosen: 'The chosen part',
        backToContext: 'Loops back in',
    },

    contextLabel: 'The context so far',
    promptLabel: 'Prompt: ',
    leading: 'Leading',

    howToOpen: 'How do we open the answer?',
    openersNote: 'Both openers are plausible. Notice that the choice here does not just add words, it sets where the rest of the answer will be built.',

    changedPrefix: 'What changed in the context: ',
    candidatesConsidered: 'Parts being considered now',

    builtAnswer: 'The answer that was built',
    builtAnswerNote: 'Each part here was chosen based on what was already written before it. Change the opener, and the whole continuation will be built differently.',
    demoEndNote: 'The demo stopped here because its scripted path is complete. A real loop stops when an end signal arrives, when a maximum length is reached, or when a stop rule or cancellation ends it.',

    nextStep: 'Next step',
    restart: 'Start over and pick a different opener',

    comparisonTitle: 'Same prompt, two openers',

    transparencyNote:
        'This is a simplified educational illustration. Real models generate the answer in smaller units and over a very large vocabulary. We work at the level of sentence parts so the loop is clear. The bars illustrate degree of fit, not a real computation.',

    // ── lab mode toggle ──
    modeToggleLabel: 'Lab mode',
    modeA: 'Watch it build',
    modeB: 'Change the instruction',

    // ── Mode B: change the instruction (prompt variants) ──
    variants: {
        intro: 'Same task: the model gives you a tip to help your pasta turn out better. Change the instruction, and watch how it enters the context and shapes the whole answer built after it. The instruction sits in the context at every step, so it keeps influencing the next choice throughout the build.',
        pickLabel: 'Pick an instruction',
        promptLabel: 'The instruction',
        buildsLabel: 'How the answer is built, part by part',
        finalLabel: 'The answer built',
        cautionLabel: 'Note:',
        disclaimer: 'These parts are a simplified educational illustration of step-by-step generation, not a real trace from a model.',
        items: {
            vague: {
                label: 'Vague',
                prompt: 'Just help me.',
                chunks: ['Sorry it is not working out', "let's figure it out", 'and try again next time'],
                finalAnswer: "Sorry it is not working out. Let's figure it out and try again next time.",
                outcomeLabel: 'Generic',
                outcomeNote: 'The instruction gave no direction, so the loop built a generic, safe answer that does not really help you. No structure, no details, and no practical step.',
            },
            confident: {
                label: 'Too confident',
                prompt: "Tell me it'll turn out perfect this time.",
                chunks: ['This pasta is going to turn out perfect', 'this time for sure', 'no need to worry', 'and great job sticking with it'],
                finalAnswer: 'This pasta is going to turn out perfect this time for sure. No need to worry, and great job sticking with it.',
                outcomeLabel: 'Unsupported certainty',
                outcomeNote: 'The instruction pushed the loop into a confident opening, and once that was written, the rest was built around certainty. The answer is fluent and convincing, but it promises a result that was never checked.',
                caution: 'No step in the loop actually checked your stove, your pot, or your recipe. Fluency is not truth, and an answer like this can mislead you.',
            },
            careful: {
                label: 'Careful',
                prompt: 'Write a short, helpful reply, without guessing a result that was not checked.',
                chunks: ['Sorry it is not turning out the way you want', 'we cannot promise a perfect result', 'without checking your stove and pot', 'but we would be glad to help you check'],
                finalAnswer: 'Sorry it is not turning out the way you want. We cannot promise a perfect result without checking your stove and pot, but we would be glad to help you check.',
                outcomeLabel: 'Careful',
                outcomeNote: 'The instruction explicitly asked not to guess, and that guidance entered the context. So the loop avoided an unsupported promise and built a helpful, accurate reply.',
            },
            structured: {
                label: 'Structured',
                prompt: 'Write the reply in three parts: empathy, what is known, and what needs checking.',
                chunks: ['Empathy: sorry it is not turning out the way you want', 'What is known: pasta needs enough salted, boiling water and precise timing', 'What to check: exactly how long you boiled it and at what heat', 'and we can go from there once you check'],
                finalAnswer: 'Sorry it is not turning out the way you want. What is known: pasta needs enough salted, boiling water and precise timing. What to check: exactly how long you boiled it and at what heat. We can go from there once you check.',
                outcomeLabel: 'Structured and stable',
                outcomeNote: 'The instruction set a three-part structure, and each part entered the context and shaped the next step. So the loop built a stable reply that keeps the structure you asked for and separates what is known from what needs checking.',
            },
        },
    },

    scenario: {
        prompt: "I keep trying to cook pasta, and it never turns out right. What should I do?",
        firstStepIntro:
            'The exact same prompt, but there are a few plausible ways to open the answer. Pick the first part, and watch how it sets everything that gets built after it.',
        branches: {
            'self-service': {
                label: 'Self-check',
                opener: 'Check how long you boiled it',
                openerChanged:
                    'The chosen opener sets a self-check direction in the context. From here, the continuations that get high weight are about what to do with the result of that check.',
                summary: 'The answer is built around a self-check of the cooking, and it turns to asking for help only if that does not fix it.',
                steps: [
                    {
                        changed:
                            'The context already includes checking the cooking time. So the natural continuation makes the next step depend on the result of the check, instead of jumping straight to action.',
                        candidates: ["If it's still not turning out right", "If it turned out perfect", "If it's hard to tell"],
                    },
                    {
                        changed:
                            'After "If it\'s still not turning out right", the context points to a dead end in the self-check. Now asking for help becomes the most plausible part.',
                        candidates: ['ask someone experienced for help', 'try again tomorrow on your own', 'look for a completely different recipe'],
                    },
                    {
                        changed:
                            'Once the context is about asking for help, the plausible continuation is to equip the request with something that identifies what went wrong. The exact problem rises to the top.',
                        candidates: ['mention exactly what went wrong', 'mention how long you cooked it', 'attach a photo of the result'],
                    },
                    {
                        changed:
                            'The whole context is about understanding what went wrong in the cooking. So the plausible ending is a request for focused tips, not a request for a whole new recipe.',
                        candidates: ['and ask for focused tips to fix it', 'and ask for a completely new recipe', 'and ask them to just cook it for you'],
                    },
                ],
            },
            support: {
                label: 'Asking for help',
                opener: 'Ask someone experienced for help',
                openerChanged:
                    'The chosen opener sets a direction of reaching someone for help. From here, the plausible continuations are about managing that request, not a self-check.',
                summary: 'The answer is built around getting help from someone experienced, up to a full walkthrough and saving it for next time.',
                steps: [
                    {
                        changed:
                            'The context already includes asking for help. The plausible step is to give them what makes helping possible, that is, describing the dish.',
                        candidates: ["Describe what pasta you're trying to make", 'Call someone right away', 'Write a long, detailed message'],
                    },
                    {
                        changed:
                            'After the dish is described, the context is ready to describe the problem itself. So the plausible continuation is to state clearly that it always turns out wrong.',
                        candidates: ['mention that it always turns out wrong', 'ask them to hurry and explain fast', 'ask if you should just give up on pasta'],
                    },
                    {
                        changed:
                            'The context describes a problem shared with someone experienced. The next plausible step is an orderly request for guidance, that is, asking to go through it together step by step.',
                        candidates: ['ask to go through it together step by step', 'ask to speak with a professional chef', 'ask them to just make it for you'],
                    },
                    {
                        changed:
                            'Once a walkthrough is given, the context points to something worth keeping for next time. So the plausible ending is to save the steps, not to end without notes.',
                        candidates: ['and save the steps for next time', 'and end the conversation', 'and ask them to write it down for you'],
                    },
                ],
            },
        },
    },
};
