// i18n/locales/en/behind-ai/selfCheck.ts
//
// English (en, LTR) strings for the Self-Check chapter (Chapter 13, "Checking the answer
// while answering") of the "Behind the Scenes of AI" course. Hebrew is the source of truth
// and defines the type (SelfCheckDict).
//
// The idea: a good answer is not only written, it is checked. A self-check is a visible step
// after the draft that compares each claim to the question and the source before the answer
// goes out. It helps, but it does not guarantee truth and does not verify facts that are not
// in the source. The check is visible, with no exposure of hidden thoughts.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { selfCheckLab } from './selfCheckLab';
import { selfCheckQuiz } from './selfCheckQuiz';

export const selfCheck = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 13 · Self-Check',
        titleLead: 'A good answer',
        titleHighlight: 'checks itself',
        lede: 'In the previous chapter we connected the answer to a source. But even when there is a source, the model still writes the answer itself, and it can say more than the source says. A self-check is one step before the end: we take the draft and compare it to the question and the source, before it goes out to the customer.',
        hook: 'The model wrote "The library is open from 10:00 to 14:00 on the holiday." What needs to happen before this answer goes out?',
        chipTry: 'Move between the drafts',
        chipCompare: 'Compare a supported claim with an invented claim',
    },

    // F3 RESPOND (M9): the chapter human response layer. The status stays
    // independent; this is only what the mentor says next, on both outcomes.
    mentorRespond: {
        guessCorrect:
            'You chose to check the draft rather than improve how it sounds. That separation is the whole chapter: good phrasing and a supported claim are two entirely different things.',
        guessWrong:
            'The step you picked deals with the quality of the writing, and that is a real consideration. The problem in this draft sits somewhere else. It is worth going back to the source and marking which detail in the answer appears there and which does not.',
        quizPass:
            'You are checking a claim against a source rather than against a feeling. That is exactly the work that separates an answer you can send from an answer that merely sounds right.',
        quizFail:
            'It is easy to read a whole answer and miss the single detail that has no cover. Go back to the lab, take one draft, and mark each claim separately against the source.',
    },

    primer: {
        eyebrow: 'A good answer is not only written, it is checked',
        title: 'Before the lab: what is a self-check?',
        subtitle: 'Writing an answer is not enough. You have to check what went into it.',
        lead:
            'The model does not only produce an answer. You can also ask it to check the answer: take the draft, compare each claim to the question and the source, and fix it before it is sent. This is a visible, practical check, not a peek into hidden thoughts.',
        points: [
            {
                title: 'What a self-check is',
                body: 'A visible step after the draft. Instead of sending right away, the model goes over the answer and asks whether it is faithful to the question and the source. This is different from "asking again": another answer is a new phrasing, not a check of the existing draft.',
            },
            {
                title: 'What it checks',
                body: 'Whether the answer addresses the question, whether it contradicts itself, whether every claim rests on the source, whether it invents missing information, whether the confidence fits, and whether it clearly says what is not known.',
            },
            {
                title: 'Why this matters after a source',
                body: 'Even when there is a source in context, the answer is still written by the model and can go beyond what the source says. The check catches exactly that drift.',
            },
            {
                title: 'What a self-check can do',
                body: 'Flag a claim with no support, point out a date or detail that was invented, spot a contradiction with the source, recommend a fix, and improve the caution and the structure.',
            },
            {
                title: 'What it cannot do',
                body: 'Guarantee truth, verify facts that are not in the source, replace a real check in a system, or prove that a wrong source is right.',
            },
            {
                title: 'The boundary of this chapter',
                body: 'Here we mean a visible check: a checklist, a comparison to the source, and verifying claims. We do not ask the model to expose hidden thoughts or a hidden chain of reasoning.',
            },
        ],
    },

    see: {
        title: 'How a self-check works, step by step',
        steps: ['Draft answer', 'Explicit criteria', 'Spotting weaknesses', 'Internal fix', 'External check when needed'],
        caption:
            'First you write a draft, then you run it against clear criteria: did it answer the question, does it contradict itself, is anything missing, and is every claim supported. What can be fixed is fixed in place. What needs factual evidence and has no source moves to an external check, and the gap is stated explicitly. Not every problem is solved by self-check. This is a teaching illustration, not a check of a real system.',
    },

    guess: {
        eyebrow: 'Quick guess · before the answer goes out',
        title: 'The model wrote: "The library is open from 10:00 to 14:00 on the holiday." What needs to happen now?',
        subtitle: 'The source only says: regular hours 09:00-18:00, holiday hours not available. Pick the right step. There is no score here, there is one direction that describes a good check.',
        invite: 'Before we open this up, try to guess what should happen to the draft before it is sent.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What this gets right',
        revealButton: 'Reveal the core idea',
        revealTitle: 'So what really needs to happen?',
        revealCopy:
            'Before the answer goes out, we check it: which parts are supported by the source and which are not. "09:00 to 18:00" is supported, "10:00 to 14:00" is not, because the source gives no holiday hours. The unsupported claim is removed, and the gap is stated explicitly.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can pick another option too and see how it sounds.',

        cards: {
            check: {
                title: 'Check which parts are supported by the source and which are not',
                desc: 'Go over the draft, and separate a supported claim from a claim with no source.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. A self-check compares each claim to the source, and flags what has no support.',
                missesLabel: 'What is left to see',
                misses: 'In the lab we will see how "10:00 to 14:00" is flagged, removed, and the answer states that the holiday hours are not available in the source.',
                bridge: 'Check before you send.',
            },
            send: {
                title: 'Send it, because the answer sounds helpful',
                desc: 'The wording is confident and pleasant, so it can be passed on as is.',
                statusLabel: 'Common mistake',
                getsRight: 'It is understandable to think so, because the answer really does sound good.',
                missesLabel: 'What it misses',
                misses: '"Sounds good" is not "supported by the source". "10:00 to 14:00" sounds helpful, but no data supports it.',
                bridge: 'Fluency is not support.',
            },
            add: {
                title: 'Add more details so it sounds professional',
                desc: 'More information will make the answer look more serious and complete.',
                statusLabel: 'A different layer',
                getsRight: 'It is true that a fuller answer sometimes helps the customer.',
                missesLabel: 'What it misses',
                misses: 'Adding details that have no source only raises the risk of invention. The problem here is not a lack of details, but a detail that is not supported.',
                bridge: 'More details are not more grounding.',
            },
            replace: {
                title: 'Swap in a short answer without checking',
                desc: 'Just shorten everything, and it will be safer.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that a short, careful answer is better than a confident guess.',
                missesLabel: 'What it misses',
                misses: 'But shortening without checking may throw away "09:00 to 18:00" too, which is supported. The goal is to check, not just to shorten.',
                bridge: 'Check, do not just cut.',
            },
        },
    },

    insight: {
        title: 'The key thing to understand here',
        lead: 'The check does not ask "does the answer sound good".',
        body: 'It asks a different question: which claim here is really supported, which was added with no source, and what needs to be deleted, softened, or noted as missing. A revised answer can be less impressive, and more correct.',
    },

    analogy: {
        title: 'A moment from real life',
        body: 'A good editor does not publish an article just because it is nicely written. They go sentence by sentence and ask where each fact comes from. If a sentence has no source, they flag it before publishing. A self-check does exactly that for the model: it reads the draft again, and flags what has nothing to rest on.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"If the model checks itself, you can trust that the answer is correct."',
        rightLabel: 'How it really works',
        rightBody: 'A self-check compares the answer to the source and the request, not to the world. It catches a claim that has no support in the source, but it cannot verify a fact the source does not contain at all. If the source is wrong or incomplete, even an answer that passed the check can be wrong. And it is important to remember: the check itself is written by the same model, not by an independent party, so it can share the same blind spots and even repeat the same mistake it is supposed to catch. The check is a useful control step, not a guarantee of truth.',
    },

    lock: {
        title: 'Check Your Understanding',
        question: 'The source says: regular hours 09:00-18:00, holiday hours not available. The draft: "The library is open from 09:00 to 18:00 on regular days, and from 10:00 to 14:00 on the holiday." Which part should the check flag?',
        options: [
            '"Open from 09:00 to 18:00 on regular days", because it appears in the source.',
            '"Open from 10:00 to 14:00 on the holiday", because the source gives no holiday hours.',
            'The whole answer, because AI should not answer.',
            'Nothing, because the answer sounds confident.',
        ],
        success:
            'A self-check separates a supported claim from an unsupported one. "09:00 to 18:00" is supported by the source and stays, "10:00 to 14:00" is not in the source and so it is flagged. The revised answer removes the invented holiday hours and states that the holiday hours are not available in the source.',
    },

    practical: {
        title: 'Practical takeaway',
        lead:
            'For an important answer, do not just ask "answer the customer". Ask the model to check the answer against the source before it is final. Instead of "answer the customer", aim like this:',
        uses: [
            'Ask for a check against the source: "Write an answer based only on the source, then check whether it has any claim that does not appear in the source."',
            'Work in three steps: "Write a short draft, check each claim against the source, and return only the revised answer."',
            'Ask it to state gaps: "If information is missing, say so explicitly and do not invent it."',
            'Keep supported claims: "Do not delete a detail that does appear in the source just to be shorter."',
            'Stay visible: "Ask for a checklist and a revised answer, not hidden thoughts."',
        ],
        caveat:
            'A self-check improves the quality of the answer, but it does not guarantee truth and does not verify facts that are not in the source. It is a useful control step: a draft, a comparison to the source, and a revised answer that is honest about what is not known. A simple rule: use self-check for structure, completeness, consistency, and flagging unsupported claims. When factual correctness is critical and the evidence is missing or uncertain, turn to a reliable source, a tool, or a person. The check still helps beforehand, but it does not replace verification.',
    },

    lab: selfCheckLab,
    quiz: selfCheckQuiz,
};
