// i18n/locales/en/behind-ai/hallucinations.ts
// English Chapter 11 ("Hallucinations: Why a Confident Answer Can Be Wrong").
// Shape source: ../../he/behind-ai/hallucinations. contentLocale = 'en' (real translation).
// "AI" is kept as the product term; brand/chrome labels (badge, Hallucination Lab, RAG,
// Grounding) stay in English by design.
//
// This is a first-pass translation to be reviewed by a native speaker later.
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { hallucinationsLab } from './hallucinationsLab';
import { hallucinationsQuiz } from './hallucinationsQuiz';

export const hallucinations = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 11 · Hallucinations',
        titleLead: 'A confident answer',
        titleHighlight: 'can be wrong',
        lede: 'We saw the model build a fluent answer step by step. But fluency is not fact checking. The model can phrase a plausible, convincing answer even when it does not have the real information, and simply fill the gap with text that sounds right.',
        hook: 'If the answer sounds confident, tidy and helpful, how do we know whether it was actually checked?',
        chipTry: 'Pick an answer style',
        chipCompare: 'Compare confident, careful and grounded',
    },

    mentor: {
        hero: 'Fluency is not a check',
        labExplain: 'Same question, different risk',
        misconception: 'The problem is not the phrasing',
        lock: 'Without a source, it is not grounded',
        practical: 'Know when to verify',
    },

    primer: {
        eyebrow: 'Language fluency is not fact checking',
        title: 'Before the lab: why can a confident answer be wrong?',
        subtitle: 'A hallucination is a convincing answer that was not grounded in the needed facts',
        lead:
            'Before we see this in the lab, let us understand what is happening here. The model continues a language pattern. When the needed fact is in the context, it can lean on it. When it is missing and there is no access to a source, the model can still produce a continuation that sounds right, instead of saying it does not know. That is what we call a hallucination here.',
        points: [
            {
                title: 'What a hallucination means here',
                body: 'A hallucination is a confident or plausible answer that is not grounded in the needed facts. The model is not lying on purpose, it is continuing a language pattern. When the fact is missing, it may produce a continuation that sounds right instead of saying it does not know.',
            },
            {
                title: 'Why it happens',
                body: 'The model continues the patterns in the prompt and context. If the needed detail is not there and there is no access to a source, the most plausible continuation still gets written, even if no one verified it.',
            },
            {
                title: 'Why confidence is misleading',
                body: 'A polished, confident sentence can come from language fluency, not from fact checking. The phrasing measures how well the continuation fits the language, not how true it is in the world.',
            },
            {
                title: 'What raises the risk',
                body: 'Missing information, a vague prompt, a request for a precise answer without a source, pressure to answer instead of saying "I do not know", and no connection to tracking or a live database. All of these pull the model toward filling in details.',
            },
            {
                title: 'What reduces the risk',
                body: 'Providing source data, asking it to separate fact from assumption, asking it to say what is missing, phrasing carefully, and connecting to a tool or source when the real status matters.',
            },
            {
                title: 'The boundary of this chapter',
                body: 'Here we only identify the problem and the need to verify. How to connect AI to sources of truth, known as Grounding or RAG, is the next step. The message is not "never trust", but "know when to verify".',
            },
        ],
    },

    see: {
        title: 'How a fluent answer can be ungrounded, step by step',
        steps: ['The prompt', 'Fluent continuation', 'Missing fact', 'Illusion of confidence', 'Verification needed'],
        caption:
            'The answer can be smooth because the text is plausible, not because the fact was checked. When a fact is missing, the model may fill it in with a continuation that sounds right, and that creates an illusion of confidence. This is a teaching illustration, not a real model trace.',
    },

    guess: {
        eyebrow: 'Quick guess · a confident answer',
        title: 'A customer asks where the package is, and the model immediately answers "it arrives tomorrow". What is the problem?',
        subtitle: 'Pick the mental model that feels closest to you. There is no score here, there is one direction that describes what really happens.',
        invite: 'Before we open this up, try to guess why an answer that sounds confident and helpful can still be wrong.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What it gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what really happens?',
        revealCopy:
            'The model can phrase a plausible, convincing answer without knowing the real status. It continues a language pattern, so "it arrives tomorrow" can be a plausible continuation only, not a detail checked in a system. Confidence in phrasing is not evidence that the fact was verified.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can pick another option too and see how it sounds.',

        cards: {
            plausible: {
                title: 'The model can phrase a plausible answer even without knowing the real status',
                desc: 'It continues a language pattern, so an answer that sounds correct is built even when nothing was checked.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. Language fluency is enough to produce a convincing answer. It does not require that the fact be checked.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see how the same question gets an answer that invents a date, alongside an answer grounded in a source.',
                bridge: 'Confidence in phrasing is not evidence that the information is correct.',
            },
            confidentTrue: {
                title: 'If the answer is confident, it is probably correct',
                desc: 'The more confident the answer sounds, the more reliable it is.',
                statusLabel: 'Common mistake',
                getsRight: 'It is natural to think so, because we are used to a confident person usually knowing what they are talking about.',
                missesLabel: 'What it misses',
                misses: 'For a model, confidence in phrasing comes from language fluency, not from fact checking. A confident answer can be a plausible continuation only.',
                bridge: 'Confidence is not evidence.',
            },
            dateChecked: {
                title: 'If there is a date in the answer, the model must have checked a system',
                desc: 'A precise detail like a date shows the model went to a real source.',
                statusLabel: 'A different layer',
                getsRight: 'It is true that a real date can come from a source or a tool.',
                missesLabel: 'What it misses',
                misses: 'But without a connection to a source, even a precise date can be a plausible fill-in. Checking a source is a separate layer from the phrasing.',
                bridge: 'A precise detail is not necessarily a checked detail.',
            },
            longerBetter: {
                title: 'A longer answer is always more reliable than a short one',
                desc: 'The more detailed the answer, the more you can trust it.',
                statusLabel: 'Partly true',
                getsRight: 'Sometimes detail helps to clarify, and that is true.',
                missesLabel: 'What it misses',
                misses: 'But length and detail are properties of the phrasing, not of the grounding. A long answer can be both detailed and wrong.',
                bridge: 'Length is not reliability.',
            },
        },
    },

    insight: {
        title: 'What is confusing here',
        lead: 'The wrong answer does not look broken.',
        body: 'It can be polite, clear and even sound professional. The problem is not in the phrasing. The problem is that the phrasing does not prove the fact was checked.',
    },

    analogy: {
        title: 'A moment from life',
        body: 'Someone can give you directions with full confidence, in a sure voice and in detail, even when they do not really know the way. Their confident tone does not mean they checked the map. With the model it is similar: confident phrasing does not mean the fact was checked.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"If the answer is detailed, confident and well written, it is probably correct."',
        rightLabel: 'How it really works',
        rightBody: 'Confident phrasing comes from language fluency, not from fact checking. An answer can be full and convincing because the language pattern is strong, not because the information was verified. For important facts you need a source, a tool, or system data.',
    },

    lock: {
        title: 'Lock in the understanding',
        question: 'The model says "the package will arrive tomorrow", but no tracking source was provided. What is the safest interpretation?',
        options: [
            'The model checked the real delivery system',
            'The answer is fluent, but the delivery date is unsupported',
            'The answer is correct because it sounds confident',
            'The model always knows the current package status',
        ],
        success:
            'A generated answer can sound complete even when a key detail is missing. "Tomorrow" here is a plausible continuation, not a checked fact. Without a source, the delivery date is unsupported.',
    },

    practical: {
        title: 'Practical insight',
        lead:
            'AI is very useful, but for factual claims it helps to know whether the answer is grounded. Instead of "tell me where the package is", steer the request so it separates what is known from what is not, and ask for a source when the status matters:',
        uses: [
            'Separate fact from assumption: "State what is known, what is missing, and what needs checking, and do not guess."',
            'Ask it to say what is missing: "If there is no tracking data, do not invent a status, ask for the tracking number."',
            'Provide a source when you can: "Based only on the following tracking status, write an answer for the customer."',
            'Require careful phrasing: "If there is no confirmed delivery date, state that explicitly."',
            'Verify important facts before acting, and use a tool or source for real operational status.',
        ],
        caveat:
            'Connecting to sources of truth, known as Grounding or RAG, is the topic of the next step. Here we only identified the problem and the need to verify. The message is not "never trust AI", but "know when to verify".',
    },

    lab: hallucinationsLab,
    quiz: hallucinationsQuiz,
};
