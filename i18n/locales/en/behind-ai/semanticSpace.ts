// i18n/locales/en/behind-ai/semanticSpace.ts
//
// English Chapter 5 ("Semantic Space"). Fully translated: no Hebrew fallback for any
// learner-facing field, and contentLocale is 'en', so the chapter is both displayed and
// read aloud in English.
//
// Two fields are inherited from the Hebrew source on purpose:
//   hero.badge        - the brand line "Behind the Scenes . 05", identical in all locales.
//   sections.labEyebrow - the product name of the lab ("Semantic Space Lab"), kept in
//                       English across all locales, including Hebrew.
//   mentor.hero / guess / negation / practical - not rendered by the chapter; only
//                       mentor.lab and mentor.lock are shown. They are inherited rather
//                       than invented so no translated string exists for text no learner
//                       ever sees.
//
// No em dash and no en dash, per project text rules.

import type { Locale } from '@/i18n/config';
import { semanticSpace as he } from '../../he/behind-ai/semanticSpace';
import { semanticSpaceLab } from './semanticSpaceLab';
import { semanticSpaceQuiz } from './semanticSpaceQuiz';

export const semanticSpace: typeof he = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: he.hero.badge,
        titleLead: 'Every meaning',
        titleHighlight: 'has a place on the map',
        lede: 'In the previous chapter we saw how a sentence turns into a meaning vector, a list of numbers. Now we will see where that vector sits in relation to the others. Every sentence is a point in a space, and sentences that are close in meaning sit close together. That is how the model connects "The package has not arrived" to "The delivery is running late", even when the words are different.',
        chipMap: 'Drag a sentence and see who is close to it',
        chipNeighbors: 'Find out why one negation changes everything',
    },

    mentor: {
        ...he.mentor,
        lab: 'Watch the distance, not the words.',
        lock: 'One answer here is tempting. Take a moment before you choose.',
    },

    plain: {
        eyebrow: 'In simple terms',
        title: 'What a meaning space is',
        paragraphs: [
            'In the previous chapter, every sentence became a list of numbers that the model learned, its embedding. Each value in the vector describes the sentence position along one dimension, and all the values together decide where it sits in semantic space. In that space we can compare embeddings and check how close two representations are to each other. The map you see here is only a simplified two-dimensional projection, and a real embedding has many more dimensions.',
            'The model arranges the sentences so that ones sharing patterns it has learned end up closer together. That is what lets it rank sentences and find the closest ones in meaning, even when they share no words at all.',
            'Close means the model learned a relation between the sentences, and far means that relation is weak. But closeness is only evidence of a learned relation, not proof that the two meanings are the same.',
        ],
    },

    guess: {
        eyebrow: 'Quick guess . closeness in meaning',
        title: 'Which sentence is closest in meaning to "The package has not arrived"?',
        subtitle: 'Pick whichever looks closest to you. There is no score, just one direction that shows how the model sees closeness.',
        prompt: '"The package has not arrived"',
        invite: 'Before we open this up, try to guess which sentence the model will see as closest in meaning.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what is really going on?',
        revealCopy:
            'The model does not count shared words. It places every sentence in a space according to meaning, and measures who is close. "The delivery is running late" sits closest to "The package has not arrived", even though they share almost no words, because the meaning is similar. "The package has arrived" is actually far in meaning, even though the words are nearly identical.',
        cta: 'Let us see it in the laboratory',
        resetButton: 'Choose again',
        exploreHint: 'You can pick another option too and read its explanation.',

        cards: {
            delayed: {
                title: 'The delivery is running late',
                desc: 'Completely different words, but the same idea: the package is not here on time.',
                statusLabel: 'Closest in meaning',
                getsRight: 'Exactly. They share almost no words, and still the meaning is nearly the same. Both are about a package that is running late.',
                missesLabel: 'What is left to see',
                misses: 'In the laboratory we will see that this sentence sits closest to the anchor on the meaning map, despite the different words.',
                bridge: 'Closeness in meaning does not depend on identical words.',
            },
            arrived: {
                title: 'The package has arrived',
                desc: 'Almost the same words as the original, just without the "not".',
                statusLabel: 'A common trap',
                getsRight: 'It is tempting to pick this one, because the words are nearly identical and the sentence looks the most similar.',
                missesLabel: 'What this misses',
                misses: 'One word, "not", flips the meaning. This is the exact opposite of "The package has not arrived", not the closest to it.',
                bridge: 'Sharing words is not sharing meaning.',
            },
            checking: {
                title: 'Support is reviewing the case',
                desc: 'From the same world of packages, but it describes a service action.',
                statusLabel: 'Same world, different meaning',
                getsRight: 'True, this is from the same domain of packages and service.',
                missesLabel: 'What this misses',
                misses: 'This is an action by the support team, not a status of the package. Close in topic, but not the closest in meaning to "has not arrived".',
                bridge: 'The same subject area is not necessarily the same meaning.',
            },
            recipe: {
                title: 'A recipe for chocolate cake',
                desc: 'A sentence from a completely different world.',
                statusLabel: 'Unrelated',
                getsRight: 'This one is easy to rule out, and rightly so.',
                missesLabel: 'What this misses',
                misses: 'There is no connection to packages here at all. On the meaning map it sits very far from the anchor.',
                bridge: 'Unrelated sentences sit far apart in the space.',
            },
        },
    },

    sections: {
        labEyebrow: he.sections.labEyebrow,
        labTitle: 'The meaning space laboratory',
        labIntro:
            'This is not just watching, it is doing. In the first experiment, select or drag a sentence and see which neighbours are closest to it in meaning. In the second we will expose the negation trap: two sentences that share almost the same words, but say exactly the opposite.',
        dnaIntro:
            'So far we have seen where each sentence sits in the space. Now we will look more closely at the vector that represents it and see how its pattern of values differs from one sentence to another, and how that pattern shapes the closeness between them.',
        dnaSelectorHint: 'Pick one sentence on each side and compare how the pattern of values and links changes.',
    },

    explain: {
        title: 'What the map teaches',
        paragraphs: [
            'Every sentence got a place in the space according to its meaning. Sentences the model sees as related gathered into regions: customer complaints in one, statuses in another, service actions in a third, and unrelated sentences far off to the side.',
            'Distance is the meaning. "Close" means the model sees a relation, "far" means the relation is weak. That is why "The package has not arrived" and "The delivery is running late" sit side by side, even without shared words.',
            'And a word about the map itself: it is a teaching illustration, not the space the model actually works in. We showed it in two dimensions so the idea would be visible, but the real space has hundreds or thousands of dimensions. Individual dimensions usually have no simple name a person could read as a "property". So the map helps you understand the idea of closeness, but you should not treat the distances drawn in it as an exact or absolute measurement of the real space.',
        ],
    },

    lock: {
        title: 'Lock in your understanding',
        question: 'Two sentences sit close to each other in semantic space. What can you carefully conclude from that?',
        options: [
            'That the two sentences have identical meaning.',
            'That their representations are similar according to the measure being used, but not necessarily that their meaning is the same or that the information in them is correct.',
            'That the two sentences use exactly the same words.',
        ],
        explanationCorrect:
            'Closeness in the space points to similarity between the representations according to the comparison measure, but it does not prove that the meaning is the same or that the information is correct. Even a single negation word can change a sentence meaning and still leave the representations close.',
        explanationWrong:
            'Closeness in the space does not guarantee identical meaning and does not require using the same words. It points only to similarity between the representations according to the comparison measure.',
    },

    practical: {
        title: 'How this helps you write a better prompt',
        lead: 'The model relies on closeness in meaning, so it is worth helping it place your request in the right area.',
        uses: [
            'Give context. A prompt that is too short can land in the wrong region of the map.',
            'Avoid short, vague wording when the meaning depends on the details.',
            'Say explicitly which relation matters to you, for example "compare meaning" and not just "compare".',
            'Ask the model to compare meaning, not just to repeat words.',
        ],
        caveat: 'And remember: closeness in the space helps with relating, but it is not proof that something is correct. A negation, a qualifier or a small detail can flip the meaning.',
        bridge: 'In the next chapter, Attention, we will see how the model decides which words matter right now, and so understands how a small "not" changes the whole sentence.',
    },

    lab: semanticSpaceLab,
    quiz: semanticSpaceQuiz,
};
