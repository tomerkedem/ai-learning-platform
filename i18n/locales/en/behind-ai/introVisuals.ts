// i18n/locales/en/behind-ai/introVisuals.ts
// English introduction visual/UI strings. Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices, map positions)
// stay in the components. Fixed index contracts: attention tokens (0 = noun,
// 3 = pronoun, 4 = state), position tokens (indices 1 and 3 swap), embedding
// mapWords (0+1 close pair, 2+3 close pair), context messages (chronological).
// No em dash (U+2014) and no en dash (U+2013). No Hebrew characters.

export const introVisuals = {
    roadmap: {
        peek: 'Peek',
        zone: 'Zone',
        loopBadge: 'Loops back to the start',
        // Presentation mode for a lecturer: guided station navigation without a mouse.
        demo: {
            start: 'Presentation mode',
            exit: 'Exit presentation',
            prev: 'Previous',
            next: 'Next',
            counter: (n: number, total: number) => `Station ${n} of ${total}`,
        },
    },

    systems: {
        act: 'Act',
        chapter: 'Chapter',
    },

    guess: {
        tokenCue: ['to', 'ken'] as string[],
    },

    viz: {
        sharedNote: 'Numbers are for illustration only, not real model output.',
        replay: 'Replay',
        soundOn: 'Unmute sounds',
        soundOff: 'Mute sounds',

        // A short mentor line per station: an angle that adds to the on-card explanation.
        mentorHints: {
            request: 'Notice: the model never sees just you. Everything comes in together.',
            tokenize: 'Watch the sentence get cut. This is no longer language, just pieces.',
            ids: 'From here on there are no words inside, only numbers.',
            embedding: 'The numbers are not random: similar words get similar numbers.',
            position: 'The same words in another order change everything. That is why order is kept.',
            context: 'Whatever leaves the window is forgotten. That is how a long chat loses its start.',
            attention: 'Every word listens to the others. Tap a word to see what it attends to.',
            mix: 'Each token is sent to experts. Only a few of many light up - that keeps a huge model fast.',
            layers: 'Each layer runs attention and feed-forward again and sharpens a little more. A real model has dozens.',
            state: 'The whole context is squeezed into one point. The next word is born from it.',
            logits: 'The model weighs many words at once and scores each one.',
            softmax: 'The scores turn into percentages that add up to a hundred.',
            decoding: 'Same distribution, different pick. That is why the answer sometimes surprises.',
            loop: 'A token is chosen, and it all runs again. That is how a full answer is built.',
        },

        request: {
            youTab: 'What you see',
            modelTab: 'What the model gets',
            userLabel: 'Your message',
            userText: 'Where is my package?',
            systemLabel: 'System instructions',
            systemText: 'You are a support agent. Check the delivery status before you answer.',
            historyLabel: 'The chat so far',
            historyText: 'I ordered yesterday and got a tracking number.',
            stripLabel: 'Everything goes in as one sequence',
            caption: 'The model never gets just your last message: the instructions, the history and your request are glued into one long sequence.',
        },

        tokenize: {
            sentence: 'My package did not arrive',
            tokens: ['My', 'package', 'did not', 'arrive'] as string[],
            caption: 'The text is split into units. In a real model the split sometimes lands inside a word.',
            altSentence: 'The deliveries are unbelievable',
            altTokens: ['The', 'deliver', 'ies', 'are', 'un', 'believ', 'able'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 1, 1, 2, 3, 3, 3] as number[],
            altCaption: 'Pieces in the same color used to be one word. The model also works on word pieces.',
            variantA: 'Simple sentence',
            variantB: 'Long words',
        },

        ids: {
            hint: 'Tap a card to flip it',
            caption: 'From here on there are no words inside. Only numbers.',
        },

        embedding: {
            token: 'package',
            caption: (note: string) =>
                `The token becomes an ID in the vocabulary, then a vector of numbers that encodes meaning. ${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 package, 1 delivery, 2 cat, 3 dog.
            mapWords: ['package', 'delivery', 'cat', 'dog'] as string[],
            mapHint: 'Tap a word on the map',
            nearLabel: 'Closest pair',
            mapCaption: 'Words with similar meaning get similar numbers, so they land close together.',
        },

        position: {
            tokens: ['First', 'payment', 'then', 'delivery'] as string[],
            swapLabel: 'Swap the order',
            meaningA: 'You pay before the package ships.',
            meaningB: 'You pay only after the package arrives.',
            caption: 'Exactly the same words, different order, different deal. That is why every token gets a position tag.',
        },

        context: {
            windowLabel: 'Context window',
            outLabel: 'Out of the window',
            addLabel: 'A new message arrives',
            messages: [
                'I ordered a cordless vacuum',
                'Order received, thanks!',
                'When does it arrive?',
                'Your delivery ships today',
                'The package is still not here',
                'What exactly did you order again?',
            ] as string[],
            caption: 'Whatever falls out of the window does not exist for the model. That is why a long chat can forget its own beginning.',
        },

        // stories order must match the tokens order (index for index).
        attention: {
            tokens: ['The dog', 'ran', 'because', 'it', 'was happy'] as string[],
            strongLabel: 'Strong link',
            weakLabel: 'Weak',
            stories: [
                '"The dog" links mainly to "ran": who does the action.',
                '"ran" looks for who ran, so it links to "the dog".',
                '"because" connects the reason: it links to "was happy".',
                'Who is "it"? The model links it to "the dog".',
                'Who was happy? "was happy" links to "it", the dog.',
            ] as string[],
            caption: 'Tap a word to change the focus. Each word attends to the others with different strength.',
        },

        // Station 8: one ambiguous word, two contexts, the meaning flips.
        mix: {
            tokenA: 'delivery',
            tokenB: 'payment',
            routerLabel: 'Router picks',
            activeNote: (k: number, n: number) => `${k} of ${n} experts run`,
            outLabel: 'enriched',
            hint: 'Switch token and see which experts light up',
            caption: 'After attention, each token passes through a feed-forward network that enriches it. In large models a router lights up only a few experts out of many - that is Mixture-of-Experts: huge knowledge, but only a small part runs per token. The "experts" are not human subject-matter experts: the routing is learned in training, purely numerical, and not directly human-readable.',
        },

        layers: {
            sentence: 'The dog ran because it was happy',
            floors: ['Words and grammar', 'Who refers to whom', 'Intent and meaning'] as string[],
            notes: [
                'The model spots the structure: who does what.',
                'The model connects: "it" is the dog.',
                'The model gets the reason: happiness explains the running.',
            ] as string[],
            floorLabel: 'Floor',
            blockLabel: 'Each layer: attention + feed-forward',
            hint: 'Tap a floor to jump there',
            caption: 'A real model has dozens of floors like these, and each one polishes the understanding a bit more.',
        },

        state: {
            orbLabel: 'One representation of the whole context',
            insideBtn: 'What is packed inside?',
            caption: 'The whole context is compressed into one point. The next word will be born from it. The context itself is not deleted: every generation round looks at it again.',
        },

        logits: {
            prompt: 'Tomorrow will be...',
            words: ['sunny', 'rainy', 'cloudy', 'hot', 'chilly', 'pleasant', 'stormy', 'bright'] as string[],
            note: 'Eight candidates out of tens of thousands checked at once.',
            caption: (note: string) =>
                `Every candidate gets a raw score, and the list settles by who leads. ${note}`,
        },

        scores: {
            rowLabels: ['Sun', 'Rain', 'Cloud'] as string[],
            rawHeader: 'Raw score',
            probHeader: 'Chance',
            totalLabel: 'Together',
            caption: (note: string) =>
                `The raw scores (gray) turn into probabilities that add up to 100%. ${note}`,
        },

        decoding: {
            prompt: 'Tomorrow will be',
            sure: 'Safe mode',
            surprise: 'Surprise mode',
            roll: 'Pick the next word',
            tally: 'Results so far',
            sureNote: 'In safe mode the top word always wins. Same question, same answer.',
            surpriseNote: 'In surprise mode a less likely word sometimes wins. That is why the same question can get different answers.',
        },

        loop: {
            words: ['Today', 'will', 'be', 'sunny', 'and', 'mild'] as string[],
            play: 'Resume',
            pause: 'Pause',
            tokenLabel: 'Token',
            stopLabel: 'Stop signal',
            caption: 'Each cycle adds one token to the answer. That is why chat answers build up in front of your eyes, word by word.',
        },
    },
};
