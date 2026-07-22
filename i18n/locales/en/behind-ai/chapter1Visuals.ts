// i18n/locales/en/behind-ai/chapter1Visuals.ts
// Active visual copy for the canonical Transparent Chat and its conditional task-system preview.
// No em dash (U+2014) and no en dash (U+2013).

import type { Locale } from '@/i18n/config';

export const chapter1Visuals = {
    contentLocale: 'en' as Locale,

    // GlassEnginePanel: inner labels
    enginePanel: {
        stationNavLabel: 'Station navigation',
        previousStation: 'Previous station',
        nextStation: 'Next station',
        replayStation: 'Replay active station',
        resetJourney: 'Reset journey',
        currentStationLabel: 'Current station',
        completedStationLabel: 'Completed station',
        inputLabel: 'Input',
        transformationLabel: 'Transformation',
        outputLabel: 'Output',
        conclusionLabel: 'Teaching conclusion',
        limitationLabel: 'Illustration limit',
        productEnvelope: {
            visibleRequest: 'Visible user request',
            systemInstruction: 'Product-added system instruction',
            selectedContext: 'Selected current context',
            modelInput: 'Current model input',
            insideWindow: 'Inside the current window',
            omitted: 'Not included in the current input',
            systemInstructionExample: 'Answer shipping-tracking questions briefly in English.',
            selectedContextExample: 'Selected context: shipping support; no external tracking data.',
            omittedExample: 'Unselected history, product memory, retrieval, and tools.',
        },
        matrix: {
            token: 'Token', id: 'ID', embedding: 'Embedding excerpt', position: 'Position',
            positionAware: 'Position-aware representation', attention: 'After Attention',
            feedForward: 'After feed-forward', checkpoint: 'Checkpoint',
            predictionPosition: 'Prediction position',
        },
        scores: {
            candidate: 'Candidate token', logit: 'Raw logit',
            total: 'Total', greedy: 'Greedy',
            sampling: 'Sampling', selectedToken: 'Selected token',
        },
        generation: {
            step: 'Generation step', appended: 'Token appended', updatedContext: 'Context updated',
            nextDistribution: 'Next-step distribution', stop: 'Stop condition',
        },
        agent: {
            authorization: 'System authorization', authorized: 'Authorized', unauthorized: 'Unauthorized',
            humanApproval: 'Human approval', approvalRequired: 'Approval required',
            approvalGranted: 'Approval granted', approvalDenied: 'Approval denied',
            toolNotRun: 'No tool call was made', mcpOptional: 'MCP is one possible connection, not a requirement',
        },
    },

    // "Sentence Journey" (Chat mode) strings.
    journey: {
        zones: {
            A: 'From text to work units',
            B: 'From tokens to representations',
            C: 'Computing the context',
            D: 'From representation to answer',
        },
        pauseTag: 'Stops and asks',
        stations: {
            s1: {
                title: 'Product assembles model input', note: 'The visible request enters the product, which adds one system instruction and selected current context.',
                input: 'The visible user request.', transformation: 'The product adds a scripted system instruction and selected current context.',
                output: 'A compact current-model-input envelope.', conclusion: 'What appears in chat is not necessarily everything the model receives.',
                limitation: 'Memory, retrieval, and tools are not part of this default path.',
            },
            s2: {
                title: 'Split into tokens', note: 'The complete model input is split into ordered token units, which are not necessarily words.',
                input: 'The current model input assembled by the product.', transformation: 'A scripted tokenizer example preserves the displayed boundaries, including punctuation or leading spaces where shown.',
                output: 'An ordered token sequence.', conclusion: 'Tokens are model work units, not necessarily words.',
                limitation: 'The boundaries are a scripted educational example, not a live tokenizer trace.',
            },
            s3: {
                title: 'An ID for each token', note: 'Each token maps to one stable integer vocabulary address.',
                input: 'The ordered token sequence.', transformation: 'Each token maps to one Token ID.',
                output: 'A token-to-ID table and ordered ID sequence.', conclusion: 'A Token ID is a vocabulary address, not meaning.',
                limitation: 'Nearby IDs do not imply similar meanings, and the displayed IDs are scripted.',
            },
            s4: {
                title: 'Embedding vectors', note: 'Each Token ID selects one learned-vector row; only short excerpts are shown here.',
                input: 'The ordered Token IDs.', transformation: 'Each ID selects one row from a learned embedding matrix.',
                output: 'Vector excerpts stacked in token order.', conclusion: 'Embeddings are numeric representations associated with vocabulary entries.',
                limitation: 'The excerpts are scripted; any 2D view is a synthetic projection, not the full vector.',
            },
            s5: {
                title: 'Position and order', note: 'Positional information is combined with each embedding so the sequence retains its order.',
                input: 'The embedding-vector sequence.', transformation: 'Position information is combined with each token representation.',
                output: 'A position-aware representation sequence.', conclusion: 'Token order changes the computation.',
                limitation: 'Architectures combine positional information in different ways.',
            },
            s6: {
                title: 'Context window', note: 'The window shows what is available at this step and what is absent from the input.',
                input: 'The assembled model input and its position-aware sequence.', transformation: 'The illustration marks what fits inside the current window and what is omitted.',
                output: 'The context available for the current generation step.', conclusion: 'The context window is the material the model can use now.',
                limitation: 'It is not all stored history and does not imply product memory or retention.',
            },
            s7: {
                title: 'Attention to context', note: 'A synthetic snapshot shows weighted influence for one layer, one head, and one destination position.',
                input: 'The contextual position representations.', transformation: 'Normalized weights combine influence from source positions into the destination position.',
                output: 'An updated contextual representation at the highlighted position.', conclusion: 'Weights vary with context, position, layer, and generation step.',
                limitation: 'Attention weights alone do not fully explain model behavior.',
            },
            s8: {
                title: 'Feed-forward processing', note: 'The same feed-forward network transforms each position vector independently and returns it to the sequence.',
                input: 'The representation sequence after Attention.', transformation: 'A feed-forward network changes numeric features independently at every position.',
                output: 'Updated feature excerpts returned to the sequence.', conclusion: 'The processing changes each position representation; it does not merge the sequence.',
                limitation: 'Only some MoE models route tokens through selected experts; that is optional enrichment, not a universal rule.',
            },
            s9: {
                title: 'Repeated layers', note: 'Attention and feed-forward repeatedly update the representation matrix.',
                input: 'The representation sequence from the previous layer.', transformation: 'The same processing types repeat across layers, updating representations at each checkpoint.',
                output: 'Representation matrices after Layer 1, Layer 2, and the final layer.', conclusion: 'Representations are updated and refined across layers.',
                limitation: 'The checkpoints show selected excerpts, not every layer or feature.',
            },
            s10: {
                title: 'Final contextual representations', note: 'A representation remains for each position; the prediction-position vector goes to the output head.',
                input: 'Final contextual representations for multiple positions.', transformation: 'The prediction position is highlighted and its vector is sent to the output head.',
                output: 'The vector used to score the next token.', conclusion: 'Multiple position representations remain, and one relevant representation feeds next-token scoring.',
                limitation: 'Only a short excerpt of the final vector is shown.',
            },
            s11: {
                title: 'Raw logits', note: 'The output head assigns positive or negative raw scores to candidate tokens.',
                input: 'The final representation at the prediction position.', transformation: 'The output head computes one raw logit for every vocabulary token.',
                output: 'A small next-token candidate sample in fixed order.', conclusion: 'Logits are raw scores, not percentages.',
                limitation: 'They are not truth, factual confidence, or authorization; only a sample of a large vocabulary is shown.',
            },
            s12: {
                title: 'Softmax probabilities', note: 'Softmax converts the same logits into a distribution that totals approximately 1.',
                input: 'The displayed logits in the same candidate order.', transformation: 'Softmax exponentiates and normalizes the scores.',
                output: 'Candidate probabilities that total approximately 1.', conclusion: 'Softmax creates a distribution; it does not select the token.',
                limitation: 'A real model scores a much larger vocabulary; the displayed values are scripted.',
            },
            s13: {
                title: 'Decoding selects a token', note: 'Greedy chooses the highest value; Sampling may draw another candidate from the distribution.',
                input: 'The probability distribution and active Decoding strategy.', transformation: 'Greedy selects the leader, or Sampling uses a scripted deterministic draw.',
                output: 'A selected token that can be appended to the text.', conclusion: 'Decoding determines how to choose from the distribution, not what is factually true.',
                limitation: 'The sample draw is fixed so replay produces the same result.',
            },
            s14: {
                title: 'Generation loop', note: 'A selected token is appended, context updates, and the next-step distribution changes.',
                input: 'The selected token and current context.', transformation: 'The token is appended, context updates, new scores are computed, and another token is selected or a stop condition is reached.',
                output: 'Two visible generation steps and the scripted response fragment shown in Chat.', conclusion: 'A response is built token by token, and scores may change after every append.',
                limitation: 'Practical implementations may reuse computed state instead of starting from zero; this illustration is scripted.',
            },
        },
        agent: {
            zones: {
                understand: 'Understanding the task',
                tools: 'Optional tools',
                control: 'Control and approval',
                exec: 'Execution and loop',
                output: 'Output',
            },
            stations: {
                a1: { title: 'The request comes in', note: 'The task you asked for - this is where the agent round begins.' },
                a2: { title: 'Identifying a possible task', note: 'The system infers a possible task from the current request and context; it does not directly know the user intention.' },
                a3: { title: 'Available tools', note: 'The product may expose permitted tools such as tracking or messaging. MCP is one possible protocol, not a requirement.' },
                a4: { title: 'Conditional plan', note: 'Only when a tool may help and required data exists does the system consider a permitted tool.' },
                a5: { title: 'Checking for missing info', note: 'Is a detail missing to act on? The agent stops and asks, instead of guessing.' },
                a6: { title: 'Authorization and approval', note: 'System authorization controls access; human approval is a separate gate before a sensitive external action.' },
                a7: { title: 'Conditional tool call', note: 'The product calls a tool only after required information, authorization, and approval are present. MCP is only one possible connection.' },
                a8: { title: 'Observation if the tool ran', note: 'An Observation appears only after a real tool call and may be a result or an error. No call means no observation.' },
                a9: { title: 'Conditional loop', note: 'After a real observation, the system may continue, ask, stop, or finish.' },
                a10: { title: 'Respond, act, or stop', note: 'The system returns a response, requests information or approval, performs an authorized action, or stops.' },
            },
            toolNames: ['Shipment tracking', 'Send a message to the customer'],
            mcp: 'MCP (optional)',
            observation: 'Example after a tool call: package in sorting',
            missingOn: 'Missing identifier (barcode)',
            missingOff: 'All the details are here',
            loopNodes: ['Plan', 'Tool call', 'Observation', 'Reason'],
            loopOutcomes: ['Continue', 'Ask', 'Stop', 'Finish'],
            agentNode: 'Agent',
            resultLabel: 'Result',
            gate: {
                safe: 'Safe answer',
                ask: 'Ask for info',
                approve: 'Approval required',
                stop: 'Stop',
            },
        },
    },

    // engineTrace: station names, titles, captions and labels
    trace: {
        labels: {
            task: {
                'Send / update on customer record': 'Send or update a customer record',
                'Check delivery failure': 'Check a delivery failure',
                'Unclear task': 'Unclear task',
                'General request': 'General request',
            },
            decision: {
                'Stop for approval': 'Stop for approval',
                'Use Tracking API': 'Use the tracking tool',
                'Ask for barcode before action': 'Ask for a barcode before acting',
                'Ask what to handle': 'Ask what to handle',
                'Answer directly': 'Answer directly',
            },
        },
    },

    // mockEngine: demo replies (resolved by the replyKey the engine returns)
    mockEngine: {
        chatReplies: {
            notDelivered: 'This looks like a non-delivery case. It is worth checking the shipment status by barcode.',
            tracking: 'We can check the shipment status by tracking number. What is the tracking number?',
            system: 'This may be a glitch showing the information in the system. It is worth refreshing and trying again.',
            payment: 'This question seems related to a charge or a payment. It is worth checking the invoice details.',
            other: 'I am not sure I understood exactly. Could you describe the problem?',
        },
        agentReplies: {
            sensitive: 'This is an action that affects a customer. I will not perform it without verification and approval - I can prepare a draft for approval.',
            tool: 'There is a barcode. I am checking the shipment status in the tracking system...',
            askBarcode: 'To actually check this, I need the package barcode number.',
            vague: 'I need to understand what this refers to - which task or package should I check?',
            general: 'This sounds like a general request. It can be answered directly, without an external tool.',
        },
    },
};
