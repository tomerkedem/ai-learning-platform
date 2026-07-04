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
        intro: 'Same task: the model writes a reply to a customer about a delayed package. Change the instruction, and watch how it enters the context and shapes the whole answer built after it.',
        pickLabel: 'Pick an instruction',
        promptLabel: 'The instruction',
        buildsLabel: 'How the answer is built, part by part',
        finalLabel: 'The answer built',
        cautionLabel: 'Note:',
        disclaimer: 'These parts are a simplified educational illustration of step-by-step generation, not a real trace from a model.',
        items: {
            vague: {
                label: 'Vague',
                prompt: 'Just answer him.',
                chunks: ['Sorry for the wait', 'we will look into it', 'and update you soon'],
                finalAnswer: 'Sorry for the wait. We will look into it and update you soon.',
                outcomeLabel: 'Generic',
                outcomeNote: 'The instruction gave no direction, so the loop built a generic, safe answer that does not really help the customer. No structure, no details, and no practical step.',
            },
            confident: {
                label: 'Too confident',
                prompt: 'Tell him the package will arrive tomorrow.',
                chunks: ['Your package is on the way', 'it will arrive tomorrow', 'no need to worry', 'and sorry for the delay'],
                finalAnswer: 'Your package is on the way and will arrive tomorrow. No need to worry, and sorry for the delay.',
                outcomeLabel: 'Unsupported certainty',
                outcomeNote: 'The instruction pushed the loop into a confident opening, and once that was written, the rest was built around certainty. The answer is fluent and convincing, but it promises a time that was never checked.',
                caution: 'No step in the loop checked the package status. Fluency is not truth, and an answer like this can mislead the customer.',
            },
            careful: {
                label: 'Careful',
                prompt: 'Write a short, helpful reply, without guessing a status that was not checked.',
                chunks: ['Sorry for the delay', 'we cannot confirm an arrival time', 'without checking the status', 'and we would be glad to check for you'],
                finalAnswer: 'Sorry for the delay. We cannot confirm an arrival time without checking the status, and we would be glad to check for you.',
                outcomeLabel: 'Careful',
                outcomeNote: 'The instruction explicitly asked not to guess, and that guidance entered the context. So the loop avoided an unsupported promise and built a helpful, accurate reply.',
            },
            structured: {
                label: 'Structured',
                prompt: 'Write the reply in three parts: empathy, what is known, and what needs checking.',
                chunks: ['Empathy: sorry for the delay', 'What is known: the order was received and shipped', 'What to check: the current status with the carrier', 'and we will update you as soon as we know'],
                finalAnswer: 'Sorry for the delay. What is known: the order was received and shipped. What to check: the current status with the carrier. We will update you as soon as we have information.',
                outcomeLabel: 'Structured and stable',
                outcomeNote: 'The instruction set a three-part structure, and each part entered the context and shaped the next step. So the loop built a stable reply that keeps the structure you asked for and separates what is known from what needs checking.',
            },
        },
    },

    scenario: {
        prompt: "My package hasn't arrived. What should I do?",
        firstStepIntro:
            'The exact same prompt, but there are a few plausible ways to open the answer. Pick the first part, and watch how it sets everything that gets built after it.',
        branches: {
            'self-service': {
                label: 'Self-check',
                opener: 'Check the tracking number',
                openerChanged:
                    'The chosen opener sets a self-check direction in the context. From here, the continuations that get high weight are about what to do with the result of that check.',
                summary: 'The answer is built around a self-check of the status, and it turns to support only if there is no update.',
                steps: [
                    {
                        changed:
                            'The context already includes checking the tracking number. So the natural continuation makes the next step depend on the result of the check, instead of jumping straight to action.',
                        candidates: ['If there is no clear update', 'If the status shows delivered', 'If the package is still in transit'],
                    },
                    {
                        changed:
                            'After "If there is no clear update", the context points to a dead end in the self-check. Now contacting support becomes the most plausible part.',
                        candidates: ['contact customer service', 'wait another day and check again', 'check your mailbox and the local branch'],
                    },
                    {
                        changed:
                            'Once the context is about contacting support, the plausible continuation is to equip the request with something that identifies it. The order number rises to the top.',
                        candidates: ['attach the order number', 'mention the order date', 'attach a screenshot of the order'],
                    },
                    {
                        changed:
                            'The whole context is about finding where the package is. So the plausible ending is a request for a status check, not a request for compensation or a new shipment.',
                        candidates: ['and ask for a status check', 'and ask for a refund', 'and ask to send a new package'],
                    },
                ],
            },
            support: {
                label: 'Contacting support',
                opener: 'Contact customer service',
                openerChanged:
                    'The chosen opener sets a direction of reaching a human at support. From here, the plausible continuations are about managing that contact, not a self-check.',
                summary: 'The answer is built around managing a contact with customer service, up to opening an inquiry and saving a case number.',
                steps: [
                    {
                        changed:
                            'The context already includes contacting support. The plausible step is to give the agent what makes handling possible, that is, the order details.',
                        candidates: ['Give them your order details', 'Call the phone line', 'Write a detailed email'],
                    },
                    {
                        changed:
                            'After the order details are given, the context is ready to describe the problem itself. So the plausible continuation is to state clearly that the package never arrived.',
                        candidates: ['say the package never arrived', 'ask to speed up handling', 'ask about the return policy'],
                    },
                    {
                        changed:
                            'The context describes a problem reported to support. The next plausible step is an orderly escalation, that is, asking to open an inquiry with the courier.',
                        candidates: ['ask to open an inquiry with the courier', 'ask to speak with a manager', 'ask for immediate compensation'],
                    },
                    {
                        changed:
                            'Once an inquiry is open, the context points to a process that needs follow-up. So the plausible ending is to save the case number, not to end without a record.',
                        candidates: ['and save the case number for tracking', 'and end the contact', 'and ask for written confirmation'],
                    },
                ],
            },
        },
    },
};
