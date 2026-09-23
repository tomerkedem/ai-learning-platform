// i18n/locales/en/chrome.ts
// English chrome strings. Source shape: ../he/chrome.
import { chrome as heChrome } from '../he/chrome';

export const chrome: typeof heChrome = {
    backToCatalog: 'Back to course catalog',
    tableOfContents: 'Contents',
    courseProgress: 'Course progress',
    authorName: 'Tomer Kedem',
    authorRole: 'Course author',
    intro: 'Intro',

    header: {
        readTime: 'Read time',
        progress: 'Progress',
    },

    nav: {


        menu: 'Course menu',



        closeMenu: 'Close menu',
        next: 'Next',
        prev: 'Previous',
        finishedTitle: 'You finished every chapter!',
        finishedSub: 'Well done - you made it all the way through.',
        moreComingTitle: 'You have reached the end of the currently available chapters',
        moreComingSub: 'The next chapters will continue the course',
    },

    focus: {
        toggleTitle: 'Hide navigation and widen the learning area',
        enter: 'Focus mode',
        exit: 'Exit focus mode',
        activeBadge: 'Focus mode on',
        press: 'Press',
        toExit: 'to exit',
    },

    theme: {
        label: 'Theme',
        system: 'System',
        light: 'Light',
        dark: 'Dark',
    },

    footer: {
        defaultLabel: 'Interactive courses for AI developers',
        copyright: '© 2026 Tomer Kedem. All rights reserved.',
    },

    assessment: {
        // Screen-reader announcement: the verdict is otherwise conveyed by icon and colour only.
        verdictCorrect: 'Correct answer.',
        verdictWrong: 'Wrong answer.',
        start: 'Start the quiz',
        mentorStart: 'Ready? Let us see what stuck',
        questionsLabel: 'Questions',
        recommendedTimeLabel: 'Recommended time',
        recommendedTime: (min) => `${min} min`,
        submit: 'Finish the quiz',
        completed: 'Quiz complete!',
        next: 'Continue to the next chapter',
        review: 'Back to a quick review',
        mentorPassHigh: 'Excellent, full mastery!',
        mentorPass: 'Nice, you passed!',
        mentorFail: 'Not yet. Review the weak points and try again.',
        failNote: 'Your understanding is not yet enough to move on with confidence. Review the weak points and try again.',
        correctSummary: (correct, total) => `${correct} of ${total} answers correct`,
        timeLabel: 'Time',
        strongConcepts: 'Strong for you',
        weakConcepts: 'Worth reinforcing',
        recommendedReview: 'Recommended review',
        reviewAnswers: 'Review answers',
        retry: 'Try again',
        tiers: [
            { label: 'Excellent!', sub: 'Full command of the material' },
            { label: 'Very good', sub: 'Very good understanding' },
            { label: 'Almost there', sub: 'Close to the passing mark' },
            { label: 'Not passing yet', sub: 'Below the passing mark' },
        ],
        questionCounter: (current, total) => `Question ${current} of ${total}`,
        streak: (n) => `${n} streak`,
        mute: 'Mute sounds',
        unmute: 'Unmute sounds',
        prev: 'Previous',
        continue: 'Continue',
    },

    progress: {
        title: 'Your progress in the course',
        sidebarTitle: 'Quiz mastery',
        emptyTitle: 'Your progress',
        emptyBody: 'Complete the short understanding check at the end of each chapter, and here you will see which concepts are already strong for you and which are worth reinforcing. Your progress is saved on your device.',
        completed: 'Completed',
        passed: 'Passed',
        average: 'Average',
        finalExam: 'Final exam',
        strongHeader: 'Strong for you',
        weakHeader: 'Concepts worth reinforcing',
        weakHeaderShort: 'Worth reinforcing',
        finalExamCta: 'Go to the course final exam',
        status: {
            passed: 'Passed',
            needsReview: 'Needs review',
            notTaken: 'Not taken',
        },
    },
};
