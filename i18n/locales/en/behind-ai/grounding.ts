// i18n/locales/en/behind-ai/grounding.ts
//
// English (en, LTR) strings for the RAG & Grounding chapter (Chapter 12, "How AI Connects
// to Sources") of the "Behind the Scenes of AI" course. Hebrew is the source of truth and
// defines the type (GroundingDict).
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { groundingLab } from './groundingLab';
import { groundingQuiz } from './groundingQuiz';

export const grounding = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 12 · RAG & Grounding',
        titleLead: 'A better answer',
        titleHighlight: 'starts with a source',
        lede: 'In the previous chapter we saw that an answer can sound confident and still be wrong. The way to lower that risk is to connect the answer to a source: a status card, a document, or the result of a check. Instead of resting only on language continuation, the model rests on information it was given.',
        hook: 'What happens to the answer when we add real tracking data to the model?',
        chipTry: 'Move between the source states',
        chipCompare: 'Compare an answer with no source and with a source',
    },

    mentor: {
        hero: 'Give the model something to rest on',
        labExplain: 'Same question, the source changes everything',
        misconception: 'A source is not magic',
        lock: 'Keep the answer tied to the source',
        practical: 'Ask for an answer from a source',
    },

    primer: {
        eyebrow: 'A better answer starts with a clear source',
        title: 'Before the lab: what is RAG and what is Grounding?',
        subtitle: 'Grounding means the answer rests on information, not only on wording',
        lead:
            'Before we see this in the lab, let us get the idea. Instead of letting the model write an answer from memory alone, we bring it a source: a status card, a document, or the result of a check, and ask it to answer based on what the source says. That way the answer stays tied to real information.',
        points: [
            {
                title: 'What Grounding means',
                body: 'Grounding means the answer is anchored to information that was provided or retrieved, not just to what sounds plausible. It is the same idea the previous chapter called being grounded: connecting an answer to a source. If the source says something, the answer rests on it. If the source is silent, the answer does not invent.',
            },
            {
                title: 'What RAG means',
                body: 'RAG is, in short, three steps. First a retrieval system, not the model itself, searches the available collection of sources and returns several candidate passages. Then the relevant one is chosen from the candidates and added to the current context of the model. Finally the model composes an answer based on the question and the selected evidence. Retrieve, add, grounded generation. Web search is only one possible retrieval method, not a requirement.',
            },
            {
                title: 'Why this matters after hallucinations',
                body: 'We saw that when a fact is missing, the model may complete it with a plausible continuation. A source gives it something concrete to lean on, so there is less room to guess. Note the distinction: a hallucination is when the answer itself invents unsupported content, while a retrieval failure is when the system did not supply the right evidence in the first place. A failed retrieval increases the risk of hallucination, but they are not the same failure.',
            },
            {
                title: 'What a source grounded answer can do',
                body: 'Quote or summarize information found in the source, answer from a status card or a document, avoid inventing missing details, and say clearly when the source is not complete.',
            },
            {
                title: 'What it does not do on its own',
                body: 'It does not guarantee truth if the source itself is wrong, does not answer beyond the source, does not replace human judgment, and does not check a live status unless it is truly connected to the system.',
            },
            {
                title: 'The retrieved source is not always the right one',
                body: 'Retrieval may return several candidate passages, and the top-ranked passage is not necessarily the correct one. Sometimes a source is retrieved that exists but refers to a different package or an unrelated event. So you have to choose the evidence that truly fits the question, and not assume that every retrieved source fits.',
            },
        ],
    },

    see: {
        title: 'How a source enters the answer, step by step',
        steps: ['User question', 'Retrieve candidates', 'Select the relevant one', 'Add to context', 'Compose from the source', 'Answer with limits'],
        caption:
            'The retrieval system, not the model itself, may return several candidate passages, and the system selects the relevant one. The top-ranked passage is not necessarily the correct one. The selected evidence enters the context, and a good answer stays within the bounds of the source. This is a teaching illustration, not a real retrieval from a system.',
    },

    guess: {
        eyebrow: 'Quick guess · adding a source',
        title: 'We added real tracking data to the model. What changes in the answer?',
        subtitle: 'Pick the mental model that feels closest. There is no score here, there is one direction that describes what really happens.',
        invite: 'Before we open this up, try to guess what a source does to the model answer.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the core idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The model can answer based on the information we provided, but only within what the source actually says. A source gives it something to rest on, so the answer guesses less. It does not make the model all knowing, and it does not guarantee that every answer is correct.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can pick another option too and see how it sounds.',

        cards: {
            grounded: {
                title: 'The model can answer based on the information we provided',
                desc: 'When there is a source in context, the answer rests on it instead of guessing.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. A source gives the model something to rest on, and the answer stays tied to what it says.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see the answer stay within the limits of the source, and not invent what the source does not say.',
                bridge: 'An answer rests on a source, not on a guess.',
            },
            smarter: {
                title: 'The model becomes smarter for good',
                desc: 'Adding a source teaches the model and upgrades it for every future question.',
                statusLabel: 'Common mistake',
                getsRight: 'It is understandable to think so, because adding information feels like learning.',
                missesLabel: 'What it misses',
                misses: 'The source enters the context of this conversation only. It does not retrain the model and is not kept for the next question.',
                bridge: 'A source helps now, not for good.',
            },
            knowsAll: {
                title: 'The model already knows every postal system',
                desc: 'The model already has all the statuses, so a source is unnecessary.',
                statusLabel: 'A different layer',
                getsRight: 'It is true that the model has seen a lot of text about shipping and mail.',
                missesLabel: 'What it misses',
                misses: 'General knowledge about mail is not the live status of a specific package. That needs a source or a real system, not memory from training.',
                bridge: 'General knowledge is not a current status.',
            },
            autoTrue: {
                title: 'If there is a source, every answer is automatically correct',
                desc: 'Once there is a source, you can trust the answer without checking.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that a source reduces guessing and strengthens the answer.',
                missesLabel: 'What it misses',
                misses: 'But if the source itself is wrong or out of date, even a grounded answer will be wrong. A source reduces risk, it is not magic.',
                bridge: 'A source helps, but you have to check it too.',
            },
        },
    },

    insight: {
        title: 'The key thing to understand here',
        lead: 'The source does not turn the model into a magician.',
        body: 'It simply gives it something to rest on. If the source says little, the answer should say little too. If the source gives no arrival date, the answer should not invent one.',
    },

    analogy: {
        title: 'A moment from real life',
        body: 'A good service rep does not make up where your package is. They open the tracking screen, read what is there, and tell you exactly that. If the screen has no arrival date, they will not invent one. A source works for the model just like that screen works for the rep.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"If I connected a source, every answer that comes out will be correct."',
        rightLabel: 'How it really works',
        rightBody: 'A source reduces guessing and gives the answer something to rest on, but it does not check itself. The mere presence of a source is not enough: the source has to support exactly the claim in the answer, and sometimes it supports only part of it. If the source itself is wrong, out of date, or irrelevant, even a grounded answer will be wrong. Grounding strengthens the answer, it does not guarantee truth.',
    },

    lock: {
        title: 'Check Your Understanding',
        question: 'The source says: status delayed, estimated delivery not available. Which answer is best grounded in the source?',
        options: [
            'The package will arrive tomorrow.',
            'The package is delayed, and there is no confirmed arrival date in the source provided.',
            'The package is lost.',
            'The package has already been delivered.',
        ],
        success:
            'A grounded answer uses what the source says, and also marks what the source does not say. The source says delayed and gives no date, so the answer says exactly that without inventing a date.',
    },

    practical: {
        title: 'Practical takeaway',
        lead:
            'When accuracy matters, do not just ask for an answer. Ask for an answer from a source, and ask the model to show the limits of that source. Instead of "tell me where the package is", aim like this:',
        uses: [
            'Ground it in a source: "Based only on the following tracking data, write an answer for the customer."',
            'Ask it to flag gaps: "If there is no confirmed arrival date, say so explicitly and do not invent a date."',
            'Separate known from unknown: "Write what is known from the source, what is not known, and what needs to be checked now."',
            'Do not go beyond the source: "Do not add information that does not appear in the data provided."',
            'Remember the source is checked too: for a real status, make sure the source itself is current and reliable.',
        ],
        caveat:
            'This is a chapter that presents the idea, not a full engineering guide to RAG. The simple message: retrieve, add to context, grounded generation, with honesty about what the source does not say. And remember that a reference to a source is useful only if it points to a real source that actually supports the claim; not every mention is proof by itself.',
    },

    lab: groundingLab,
    quiz: groundingQuiz,
};
