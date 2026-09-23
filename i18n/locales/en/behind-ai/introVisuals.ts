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
            userText: 'What can I make for dinner?',
            systemLabel: 'System instructions',
            systemText: 'You are a cooking assistant. Give practical, concise suggestions.',
            historyLabel: 'The chat so far',
            historyText: 'Earlier I mentioned I have pasta and tomatoes at home.',
            stripLabel: 'Everything goes in as one sequence',
            caption: 'The instructions, the history and your request are glued into one long sequence, so all of them shape the answer.',
        },

        tokenize: {
            sentence: 'The cat is sleeping',
            tokens: ['The', 'cat', 'is', 'sleeping'] as string[],
            caption: 'In a real model the split sometimes lands inside a word, not only between words.',
            altSentence: 'The findings are unbelievable',
            altTokens: ['The', 'find', 'ings', 'are', 'un', 'believ', 'able'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 1, 1, 2, 3, 3, 3] as number[],
            altCaption: 'Pieces in the same color used to be one word. The model also works on word pieces.',
            variantA: 'Simple sentence',
            variantB: 'Long words',
        },

        ids: {
            hint: 'Tap a card to flip it',
            caption: 'The ID is an address in the vocabulary, not a meaning.',
        },

        embedding: {
            token: 'cat',
            caption: (note: string) =>
                `The token becomes an ID in the vocabulary, then a vector of numbers that encodes meaning. ${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 cat, 1 dog, 2 car, 3 bicycle.
            mapWords: ['cat', 'dog', 'car', 'bicycle'] as string[],
            mapHint: 'Tap a word on the map',
            nearLabel: 'Closest pair',
            mapCaption: 'Representations with similar meaning can end up close to each other in the space.',
        },

        position: {
            tokens: ['First', 'rain', 'then', 'sunshine'] as string[],
            swapLabel: 'Swap the order',
            meaningA: 'It rains first, and the sky clears up later.',
            meaningB: 'It is sunny first, and rain comes later.',
            caption: 'The position tag is what separates "before" from "after" here.',
        },

        context: {
            windowLabel: 'Context window',
            outLabel: 'Out of the window',
            addLabel: 'A new message arrives',
            messages: [
                "My friend's birthday is on Saturday",
                'Got it, good to know!',
                'What should I get as a gift?',
                'Maybe a book or a plant',
                "I still haven't decided",
                "Wait, what day was my friend's birthday again?",
            ] as string[],
            caption: 'The window does not grow: every new message that comes in pushes an old one out.',
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
            caption: 'Each word attends to the others with different strength.',
        },

        // Station 8: two different tokens, each routed to different experts.
        mix: {
            tokenA: 'recipe',
            tokenB: 'weather',
            routerLabel: 'Router picks',
            activeNote: (k: number, n: number) => `${k} of ${n} experts run`,
            outLabel: 'enriched',
            hint: 'Switch token and see which experts light up',
            caption: 'After attention, each token passes through a feed-forward network that enriches it. In large models this works as Mixture-of-Experts: huge knowledge, but only a small part runs per token. The "experts" are not human subject-matter experts: the routing is learned in training, purely numerical, and not directly human-readable.',
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
            caption: 'No single layer does the understanding: the same block repeats, and the understanding is built gradually.',
        },

        state: {
            orbLabel: 'One representation of the whole context',
            insideBtn: 'What is packed inside?',
            caption: 'The context itself is not deleted: every generation round looks at it again.',
        },

        logits: {
            prompt: 'Tomorrow will be...',
            words: ['sunny', 'rainy', 'cloudy', 'hot', 'chilly', 'pleasant', 'stormy', 'bright'] as string[],
            note: 'Eight candidates out of tens of thousands checked at once.',
            caption: (note: string) =>
                `A higher score only says "more likely", not "by how much". ${note}`,
        },

        scores: {
            rowLabels: ['Sun', 'Rain', 'Cloud'] as string[],
            rawHeader: 'Raw score',
            probHeader: 'Chance',
            totalLabel: 'Together',
            caption: (note: string) =>
                `Even after the conversion this is still a distribution, not a decision. ${note}`,
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
            caption: 'That is why chat answers build up in front of your eyes, word by word.',
        },
    },
};
