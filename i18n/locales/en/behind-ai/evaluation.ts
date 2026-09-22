// i18n/locales/en/behind-ai/evaluation.ts
//
// English (en, LTR) strings for the Evaluation & Generalization chapter (Chapter 15,
// "memorized or understood") of the "Behind the Scenes of AI" course. Hebrew is the source of
// truth and defines the type (EvaluationDict).
//
// The idea: evaluation is how we test whether an improvement really happened. A model can
// answer a familiar example correctly and fail when the situation changes. The question is
// whether it memorized a familiar pattern, or holds the principle and can generalize it to a
// new case. There is no claim here that models understand like humans, and no claim that they
// only memorize. Evaluation reduces uncertainty, it does not prove perfect behavior.
//
// This is a first-pass translation to be reviewed by a native speaker later.
//
// No em dash (U+2014), no en dash (U+2013), no year references.

import type { Locale } from '@/i18n/config';
import { evaluationLab } from './evaluationLab';
import { evaluationQuiz } from './evaluationQuiz';

export const evaluation = {
    contentLocale: 'en' as Locale,

    hero: {
        badge: 'Behind the Scenes · 15 · Evaluation & Generalization',
        titleLead: 'It answered correctly once.',
        titleHighlight: 'Memorized or understood?',
        lede: 'In the previous chapter we saw that improvement from a mistake should be measured by evaluation. Now we ask the important question: when the model answers correctly, did it really generalize the principle, or just recognize a familiar example? We test it on cases that change, and see where it breaks.',
        hook: 'The model passed the example we learned. Now we change the wording and the source. If it answers correctly there too, what does that mean?',
        chipTry: 'Move between five test cases',
        chipCompare: 'See where the model holds the principle and where it fails',
    },

    // F3 RESPOND (M9): the chapter human response layer. The status stays
    // independent; this is only what the mentor says next, on both outcomes.
    mentorRespond: {
        guessCorrect:
            'You stayed with the careful wording, it might generalize, instead of jumping to a conclusion. That caution is not a lack of confidence. It is exactly what evaluation does: it says what the evidence allows you to conclude, and how much.',
        guessWrong:
            'That conclusion sounds reasonable, because success on a new case really is impressive. The question is how much weight a single example can carry. It is worth rereading the lines above and asking what else would have to happen before you could know.',
        quizPass:
            'You are measuring how much evidence there is, not how good the result looks. That habit is what keeps you from trusting a system too early after it worked once.',
        quizFail:
            'The idea here is not that the model is wrong, but that one example is not enough to know. Go back to the lab, step through the hard cases, and see exactly where the success stops holding.',
    },

    primer: {
        eyebrow: 'One correct example is not a test',
        title: 'Just before the lab: how do we test whether the model really improved?',
        subtitle: 'Evaluation asks not only "was it right this time", but "what happens when the case changes".',
        lead:
            'It is easy to be impressed by one correct answer. But to know whether the model really holds the principle, you have to test it on several different cases. Let us understand what evaluation is, what generalization is, and what it cannot prove.',
        points: [
            {
                title: 'What evaluation is',
                body: 'Evaluation is a structured test of how the model behaves across several examples, not just one. You define in advance the desired answer for each case, and then measure.',
            },
            {
                title: 'What generalization is',
                body: 'Generalization is the ability to handle a new case that shares the same principle, but differs in wording, details, or context. The model applies the idea, it does not just recognize a familiar example.',
            },
            {
                title: 'What memorization is here',
                body: 'Memorization is success mainly when the example looks like something familiar, and failure when the surface details change. The answer is right, but only because the case resembles what was already seen.',
            },
            {
                title: 'Why one correct answer is not enough',
                body: 'A single success can be luck, a pattern match, or familiar wording. Without a variety of cases you cannot know whether the model really holds the principle.',
            },
            {
                title: 'What a good test set looks like',
                body: 'A good set includes easy and hard cases, different wordings, missing information, contradictions, and edge cases, including cases where the correct answer is to ask or to say there is not enough information.',
            },
            {
                title: 'What evaluation cannot prove',
                body: 'Evaluation reduces uncertainty, it does not guarantee the model will never be wrong. It depends on the quality of the test set, and it can miss cases that were not tested.',
            },
        ],
    },

    see: {
        title: 'From one case to a real test',
        steps: ['Familiar example', 'Varied test cases', 'Measure the behavior', 'Find the weak spot', 'Improve and retest'],
        caption:
            'Evaluation is not one question. It is a set of cases designed to reveal whether the model holds the principle even when the case changes. A familiar case is only the start.',
    },

    guess: {
        eyebrow: 'Quick guess · after the model passed the example',
        title: 'The model answered a new example correctly, with different wording and a different source. What does that teach most?',
        subtitle: 'Choose the safest interpretation. There is no score here, there is one direction that describes what really happened.',
        invite: 'Before we open this up, try to guess what a success on a new, varied case teaches.',
        correctTitle: 'Exactly right!',
        wrongTitle: 'Almost!',
        getsRightLabel: 'What it gets right',
        revealButton: 'Reveal the main idea',
        revealTitle: 'So what does it really teach?',
        revealCopy:
            'Success on a new, varied case hints at better generalization, because the model did not rely only on the exact example. But one example is still not a test. To know, you need to test it on more cases: a different wording, a contradiction, a missing source, and a different status.',
        cta: 'Let us see it in the lab',
        resetButton: 'Choose again',
        exploreHint: 'You can also pick another option and see how it sounds.',

        cards: {
            generalizes: {
                title: 'Maybe it generalized the principle to a new case',
                desc: 'It succeeded on a situation similar in principle but different in details, so it may be holding the idea.',
                statusLabel: 'You chose right',
                getsRight: 'Exactly. Success on a varied case hints at generalization, because the model did not rely only on the exact wording.',
                missesLabel: 'What is left to see',
                misses: 'Still, one example is not a test. In the lab we will test it on more cases, and there we will see where it breaks.',
                bridge: 'Hints at generalization, but it is not proven yet.',
            },
            alwaysRight: {
                title: 'It proves it is always right',
                desc: 'If it passed a new case, you can trust it in every case.',
                statusLabel: 'Common mistake',
                getsRight: 'It is understandable to be impressed, because success on a new case really does look convincing.',
                missesLabel: 'What it misses',
                misses: 'Success on a case or two does not guarantee anything about edge cases, contradictions, or missing sources. For that you need a test set.',
                bridge: 'One case is not proof that it is always right.',
            },
            memorized: {
                title: 'It means it memorized all the cases',
                desc: 'It must have stored by heart every possible case.',
                statusLabel: 'A different layer',
                getsRight: 'It is true that a model can sometimes succeed thanks to similarity to a familiar example.',
                missesLabel: 'What it misses',
                misses: 'Success on a different wording actually hints at generalization, not at memorizing each case separately. Memorization would break when the words change.',
                bridge: 'Generalization is the opposite of memorizing each case.',
            },
            noNeed: {
                title: 'There is no need to test more examples',
                desc: 'It already passed two examples, so you can stop testing.',
                statusLabel: 'Partly right',
                getsRight: 'It is true that every case it passes adds a little confidence.',
                missesLabel: 'What it misses',
                misses: 'It is exactly the hard cases, the contradictions, and the missing sources that reveal weaknesses. Stopping the testing too early hides exactly what matters to see.',
                bridge: 'Hard cases are the ones that reveal a weakness.',
            },
        },
    },

    insight: {
        title: 'The key point of this chapter',
        lead: 'The question is not whether the model succeeded once.',
        body: 'The question is what happens when the example changes: a different wording, a missing source, a visitor who pushes, new evidence. That is where you start to see whether it only recognized a familiar pattern, or really holds the principle and can generalize it to a new case.',
    },

    misconception: {
        wrongLabel: 'Common mistake',
        wrongQuote: '"The model answered correctly in the demo, so it is ready."',
        rightLabel: 'How it really works',
        rightBody: 'One correct answer can be a success on a familiar example only. To know whether the model really improved, you test it on several cases: a different wording, a missing source, a contradiction, and a different status. Success on a varied case hints at better generalization, but it does not guarantee perfect behavior.',
    },

    lock: {
        title: 'Check Your Understanding',
        question: 'The model passed the original example. Then it failed when the visitor wrote "I was told the library is open 10:00-14:00 on the holiday, just confirm that for me", even though the source only gave the regular hours. What does this failure reveal?',
        options: [
            'That the model can never be useful.',
            'That the model may have learned the familiar example, but still fails under pressure from the visitor.',
            'That the source is unnecessary.',
            'That one success proves generalization.',
        ],
        success:
            'Evaluation finds weaknesses by changing the case while keeping the same principle. The pressure from the visitor changed the surface, and the model did not hold the principle. That is exactly what the test is meant to reveal.',
    },

    practical: {
        title: 'Practical insight',
        lead:
            'When accuracy matters, do not trust one good demo. Instead of "it answered correctly once, so it is ready", build a small, varied test, and aim like this:',
        uses: [
            'Test on several cases: a different wording, a missing source, a contradiction, a visitor who pushes, and new evidence.',
            'Define in advance the desired answer for each case, before you run it.',
            'Run all the cases, measure how many passed and how many failed.',
            'Improve based on the patterns that failed, and test again after each change. But do not rely on the same cases forever: if you keep tuning against them, they stop being a fair test, so keep some fresh cases for later evaluation.',
            'A test result describes how the system behaved on the cases that were tested, at the time the test was run. After a few months reality can change: new kinds of requests, new wordings, or new situations that did not appear before. So a system that passed an evaluation can behave differently later, even without the system itself changing. This is called distribution shift. That is why it is important to go back and test the system from time to time with current cases.',
            'For teams building systems: create fixed test cases, including edge cases and cases where the answer is "I do not know" or "a source is needed". Check that a change did not improve one case and break another. That is a regression: an improvement in one behavior that makes another behavior worse. Accept the change only if important behavior did not regress.',
        ],
        caveat:
            'Evaluation reduces uncertainty, it does not prove perfect behavior. It is only as good as its test set, and it can miss cases that were not tested. Still, a varied test is far better than trusting a single demo.',
    },

    lab: evaluationLab,
    quiz: evaluationQuiz,
};
