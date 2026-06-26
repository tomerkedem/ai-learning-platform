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
        next: 'Next',
        prev: 'Previous',
        finishedTitle: 'You finished every chapter!',
        finishedSub: 'Well done - you made it all the way through.',
    },

    focus: {
        toggleTitle: 'Hide navigation and widen the learning area',
        enter: 'Focus mode',
        exit: 'Exit focus mode',
        activeBadge: 'Focus mode on',
        press: 'Press',
        toExit: 'to exit',
    },

    footer: {
        defaultLabel: 'Interactive courses for AI developers',
        copyright: '© 2026 Tomer Kedem. All rights reserved.',
    },
};
