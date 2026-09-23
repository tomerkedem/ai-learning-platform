// i18n/locales/en/behind-ai/finalExam.ts
// English final-exam chrome. Shape source: ../../he/behind-ai/finalExam.
//
// Display text only. Behavior (questions, passScore, onComplete, getReviewLinks)
// and the structural tier data (min/color) stay in quizData.ts. Tier order must
// stay identical to the Hebrew source, since label/sub overlay min/color by index.
// The course name matches the English catalog title ("Behind the Scenes of AI").
//
// No em dash (U+2014) and no en dash (U+2013) in this file.

export const finalExam = {
    questionOverrides: {
        1: {
            question: 'From input to answer, what is the correct order of what happens behind the scenes?',
            options: [
                'Answer, then tokens, then numbers, then probabilities',
                'Tokens, then numbers and vectors, then similarity and scores, then probabilities, then a decision',
                'Probabilities, then tokens, then a decision, then numbers',
                'The model jumps straight from the question to the answer with no stages',
            ],
            explanation: 'The path is built layer on layer: first splitting into tokens, then conversion to numbers and meaning vectors, then similarity and scores, then probabilities (after Softmax), and only at the end a decision. No stage jumps in on its own.',
        },
        2: {
            question: 'Why does the engine split text into tokens before it computes meaning?',
            options: [
                'To shorten the text and save memory',
                'Because it needs uniform working units that can be converted to numbers and computed on',
                'To translate the text into English',
                'Because the tokens are already the final answer',
            ],
            explanation: 'AI does not start by understanding, it starts by splitting. Tokens are working units that can become Token IDs and then vectors, which is the condition for every meaning and probability computation that follows.',
        },
        3: {
            question: 'Why are numbers so central to AI?',
            options: [
                'Because numbers sound more professional than words',
                'Because without a numeric representation you cannot compute similarity, rank options, or compare meaning',
                'Because the model cannot read English at all',
                'Because numbers take up less storage than words',
            ],
            explanation: 'The engine works with numbers, not words. Only when meaning becomes a vector of numbers can you measure direction, compute similarity, and turn scores into probabilities. Numbers are the language in which the engine really computes.',
        },
        4: {
            question: 'The model returned an answer with a very high probability. What does that mean?',
            options: [
                'That the answer is certainly correct and can be trusted without checking',
                'That it is the option the model ranked as most likely, but a high probability is not truth',
                'That the model checked the fact in an external source before answering',
                'That there were no other options the model considered',
            ],
            explanation: 'A high probability means this option led the ranking, not that it is true. The engine estimates likelihood, it does not verify facts. A very likely answer can still be wrong.',
        },
        5: {
            question: 'The model has just written the first part of an answer. What happens to that part before the model chooses the next one?',
            options: [
                'It is set aside and has no effect on what follows',
                'It becomes part of the context, and the next choice is computed with it already inside',
                'The model checks it against an external source and only then continues',
                'The model starts the answer over from the original question alone',
            ],
            explanation: 'Generation is a loop: every part that is chosen joins the context, and the updated context sets the probabilities for the next step. There is no check against the world here, and no restart.',
        },
        6: {
            question: 'What is the correct relationship between similarity (Cosine Similarity) and probability?',
            options: [
                'Similarity and probability are two names for the same thing',
                'Probability is computed first, and similarity is derived from it',
                'Similarity is closeness of direction and an early stage only; probability comes at the end, after Softmax',
                'There is no link between them, they belong to separate engines',
            ],
            explanation: 'They are easy to confuse, but they are not the same. Similarity measures how close the direction of two vectors is, which is an early stage. Only at the end of the chain, after the raw scores go through Softmax, do probabilities appear. Reading similarity as if it were probability skips half of the path.',
        },
        7: {
            question: 'What is the essential difference between a Chat and an Agent?',
            options: [
                'An Agent is faster and a Chat is slower',
                'A Chat picks an answer, and an Agent picks the right next step: answer, use a tool, or stop',
                'A Chat does not use tokens at all and an Agent does',
                'An Agent cannot make mistakes and a Chat can',
            ],
            explanation: 'A Chat is an answer engine: it produces a text answer. An Agent is an action engine: it first asks what the right next step is, so it can also check, use a tool, or stop and ask for approval. Both can be wrong.',
        },
        8: {
            question: 'An Agent has an email tool, access to the customer data, and a drafted message. Why is it still right for it to stop for approval before sending?',
            options: [
                'Because it does not really know how to send email',
                'Because ability is not permission, and a real, sensitive action in the world requires approval and control',
                'Because its confidence in the message is always too low',
                'Because it has no access to the data it needs',
            ],
            explanation: 'Being able to do something is not approval to do it. The closer an action is to the real world and the more sensitive it is, the more control, permission, and accountability it needs. Stopping for approval is the professional step, not a lack of ability.',
        },
        9: {
            question: 'When does using a tool become risky or unnecessary?',
            options: [
                'Only when the tool is slow and delays the answer',
                'When the action changes something in the world or exposes sensitive information, or when a correct answer is possible without guessing',
                'Every use of a tool is equally risky',
                'Tools are never risky, they only speed up the answer',
            ],
            explanation: 'A tool is a multi-factor decision, not a button. Unnecessary use wastes resources and can risk privacy, and an action that changes the world needs care. On the other hand, guessing when you could check a source is also a mistake. Balance is the point.',
        },
        10: {
            question: 'Why does an Agent need control gates such as risk, permission, and approval?',
            options: [
                'To deliberately slow the system down and give a feeling of control',
                'Because the closer it gets to a real action in the world, the more control and accountability it needs',
                'Because the model is never sure of anything',
                'To save the engine\'s computing costs',
            ],
            explanation: 'Control gates are not artificial delay. They express a principle: an action that affects the world needs a check on whether it is safe, whether it is allowed, and whether human approval is needed. Closeness to a real action is what raises the bar for control.',
        },
        11: {
            question: 'A user writes to an Agent \'Just handle it\' with no other context. What is the most correct thing for it to do?',
            options: [
                'Guess the most likely interpretation and act on it immediately',
                'Stop and ask what is meant, because the goal is ambiguous and the interpretations are far apart',
                'Carry out every possible interpretation at once to cover everything',
                'Ignore the request because it is not clear enough',
            ],
            explanation: '\'Just handle it\' is an ambiguous request. When interpretations differ widely and confidence is low, the right step before acting is to stop and ask for context. A guess starts an action on an unstable base, and doing everything only multiplies the risk.',
        },
        12: {
            question: 'What is the best way to explain to a non-technical person what AI does when it answers?',
            options: [
                'It pulls the right answer from an organized database of facts',
                'It makes a calculated guess: it ranks options by likelihood and picks the leading one, without holding absolute truth',
                'It thinks like a person and understands exactly what you meant',
                'It searches the internet for the answer every single time',
            ],
            explanation: 'The accurate and accessible explanation is \'a calculated guess\': the model ranks possible continuations by likelihood and picks the leader. It does not pull a certain fact, does not \'understand\' like a person, and does not necessarily search the internet. That distinction is what prevents blind trust.',
        },
        13: {
            question: 'What does a large probability gap between the leading continuation and the shown alternatives tell us?',
            options: [
                'It is only decoration with no value',
                'The model strongly prefers the leader within this distribution, not that it is factually true, grounded, or authorized',
                'It slows the model, so it should be hidden',
                'It replaces the answer itself',
            ],
            explanation: 'A large probability gap shows a strong preference within the displayed distribution. It does not prove truth, grounding, or permission to act. Factual trust requires suitable context, evidence, grounding, or verification.',
        },
        14: {
            question: 'The probabilities for the next token are exactly the same, yet two runs of open-style decoding produce different continuations. What explains this?',
            options: [
                'The probabilities changed between the two runs',
                'Open decoding chooses from the distribution, so a less likely option can sometimes be picked',
                'The model checked in each run which option was more correct',
                'Softmax picked a different option in each run',
            ],
            explanation: 'The probabilities are set before the choice. In an open style the choice samples from the distribution, so lower options get a chance too, and that adds variety. The choice is not a truth check, and it does not change the probabilities.',
        },
        15: {
            question: 'An Agent recognized that the request is a task for action and not a question. What is true about the next step?',
            options: [
                'It can carry it out immediately, because it already recognized it correctly',
                'Recognizing a task is not approval to act; information may be missing or approval may be required',
                'It will return a text answer only, with no action at all',
                'It will ask the user to rephrase the request as a question',
            ],
            explanation: 'Recognizing a task is only the beginning. Even after the system understands it is an action, it checks what is missing and whether the risk requires approval. Recognition is not approval, and this is one of the course\'s central distinctions.',
        },
        16: {
            question: 'What is a Tool Call in the Agent\'s work loop?',
            options: [
                'The final answer the Agent returns to the user',
                'A way to bring in a new Observation, after which the Agent reads the result and decides again',
                'A human approval given for a sensitive action',
                'The end of the process, after which there are no more decisions',
            ],
            explanation: 'A Tool Call is not the end of the story, it is a way to bring in new information. The Agent works in a loop: it decides, runs a tool, reads the Observation, and decides again from it. A clear, partial, or conflicting result each leads to a different decision.',
        },
        17: {
            question: 'You corrected an answer in a chat. What is most accurate about using that correction now and later?',
            options: [
                'The model has a short memory that quickly fills up',
                'It may affect the current context; a new chat does not contain it automatically unless the product stores or retrieves it, and this is not instant model training',
                'The model learns only from other users',
                'The model deliberately ignores your correction',
            ],
            explanation: 'The correction can affect later responses in the current context. A product may save selected information for future use without changing model parameters. Prompts, rules, workflows, sources, or tools may also improve later; model training is a separate process. One correction does not instantly retrain the global model.',
        },
        18: {
            question: 'An Agent reports very high confidence that an action is correct, but the action is high risk. What is most correct?',
            options: [
                'Execute immediately, because high confidence justifies action',
                'Stop for approval, because high confidence does not cancel the risk gate',
                'Cancel the task entirely, because high risk is always forbidden',
                'Ignore the risk, because the model is already sure of itself',
            ],
            explanation: 'Confidence is the model\'s internal estimate, and it does not replace the approval gate. When the action is sensitive, even high confidence does not remove the need for human approval. On the other hand, high risk does not mean \'always forbidden\', it means \'stop and ask for approval\'. That is the heart of combining confidence, risk, and control.',
        },
    },
    backToChapter: 'Back to chapter 19',
    pageTitle: 'Course final exam',
    pageSubtitle:
        'The summary exam for "Behind the Scenes of AI". It tests the whole path: from input to the responsible decision, and the links between the concepts. You can return to it any time, and your progress is saved on your device.',

    examTitle: 'Course final exam: Behind the Scenes of AI',
    examSubtitle: 'Eighteen questions that sum up the whole course, from input to the responsible decision.',
    startLabel: 'Start the final exam',
    submitLabel: 'Finish the final exam',
    completedTitle: 'Final exam complete',
    reviewLabel: 'Back to the start of the course',
    nextLabel: 'Done: back to the course catalog',

    tiers: [
        { label: 'Excellent', sub: 'You understand the inner flow of AI and can explain it' },
        { label: 'Very strong', sub: 'The main ideas are clear, worth refreshing a few points' },
        { label: 'Partial understanding', sub: 'We recommend reviewing the chapters you missed' },
        { label: 'Worth retaking the course', sub: 'It is worth going over the material again before moving on' },
    ],
};
