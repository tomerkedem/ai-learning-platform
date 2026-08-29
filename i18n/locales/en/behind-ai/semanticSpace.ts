// i18n/locales/en/behind-ai/semanticSpace.ts
//
// English Chapter 5 ("Semantic Space"). Fully translated: no Hebrew fallback for any
// learner-facing field, and contentLocale is 'en', so the chapter is both displayed and
// read aloud in English.
//
// Two fields are inherited from the Hebrew source on purpose:
//   hero.badge        - the brand line "Behind the Scenes · 05", identical in all locales.
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

    // F3 RESPOND (M6 pilot): the chapter's human response layer. The status stays
    // independent; this is only what the mentor says next, on both outcomes.
    mentorRespond: {
        guessCorrect:
            'What you just did is the hard part: you ignored the resemblance that jumped out at you. That is worth carrying forward, because plenty of answers sound like a fit without actually being close.',
        guessWrong:
            'Almost everyone reads the words first, and that is not an embarrassing mistake. It is how we are used to comparing. The moment it shifts is the moment you stop asking how the sentence sounds and start asking what it says.',
        quizPass:
            'You are reading the map by distance now, not by words. Keep the caveat too: closeness in the space means the representations are similar, not that the meaning is identical or that the content is true.',
        quizFail:
            'It is easy to leave this chapter feeling you have it before the understanding is complete. What is worth returning to is not the definition but the measurement: what exactly the model compares. Try one sentence with a negation in the lab.',
    },

    hero: {
        badge: he.hero.badge,
        titleLead: 'Every meaning',
        titleHighlight: 'has a place on the map',
        lede: '"The package has not arrived" and "The delivery is running late" share almost no words, and yet the model understands that they say nearly the same thing. How does it bring two sentences worded so differently close together? To answer that, we need to see where each sentence sits, and in what space it is measured.',
        chipMap: 'Select a sentence and see who is close to it',
        chipNeighbors: 'Find out why one negation changes everything',
    },

    mentor: {
        ...he.mentor,
        lab: 'Watch the distance, not the words.',
        lock: 'One answer here is tempting. Take a moment before you choose.',
    },

    plain: {
        eyebrow: 'In simple terms',
        title: 'From an embedding to semantic space',
        paragraphs: [
            'In the previous chapter, every sentence became an embedding: the list of numbers the model learned for it. You can think of that list as an address. Each number in it is one coordinate, and together they decide which point the sentence points to.',
            'Semantic space is the shared space where all of those addresses live together. There you can compare the embeddings of different sentences and check who is close to whom. When the model places two embeddings close together, it usually means their representations are similar.',
            'On screen we draw every sentence as a single point on a flat map, and that is only a teaching simplification: a real embedding has far more than two dimensions. The map helps you see the idea of closeness, but it is not the space the model actually works in.',
        ],
    },

    guess: {
        eyebrow: 'Quick guess · closeness in meaning',
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
            'The model does not count shared words. It places every sentence in a space according to meaning, and measures who is close. "The delivery is running late" sits closest to "The package has not arrived", even though they share almost no words, because the meaning is similar. "The package has arrived" shares almost the same words, but it reverses the meaning, so it is not the closest.',
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
            'This is not just watching, it is doing. In the first experiment, select a sentence and see which neighbours are closest to it in meaning. In the second we will expose the negation trap: two sentences that share almost the same words, but say exactly the opposite.',
        dnaTitle: 'Comparing the semantic DNA of two sentences',
        dnaStripTitle: 'The value pattern of each sentence',
        dnaIntro:
            'We saw where each sentence sits, but why do two sentences worded so differently appear close at all? Here we open up the embedding of each sentence and compare its pattern of values with another one. When the overall patterns are similar, the two embeddings are given nearby positions in the space, and that is the semantic closeness we saw on the map. The strips here are an illustration of the pattern, not a list of features with a fixed name for each dimension.',
        dnaSelectorHint: 'Pick one sentence on each side and see how much of the value pattern they share, and how that matches their closeness on the map.',
        dnaStrandNote:
            'Each strand shows the value pattern of one sentence\'s embedding. The more alike the value patterns, the closer the two sentences\' embeddings tend to appear in semantic space.',
        dnaDisclaimer:
            'The DNA here is only a visual metaphor. In a real model it is a pattern of numeric values inside a vector, not a biological strand.',
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
        title: 'Check Your Understanding',
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
