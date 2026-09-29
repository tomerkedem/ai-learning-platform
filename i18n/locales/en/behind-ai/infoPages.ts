// i18n/locales/en/behind-ai/infoPages.ts
// English course information pages. Source shape and content rules: ../../he/behind-ai/infoPages.
import type { InfoPagesDict } from '../../he/behind-ai/infoPages';

export const infoPages: InfoPagesDict = {
    navLabel: 'Course information',
    skipToContent: 'Skip to content',
    backToCourse: 'Back to the course',
    continueTitle: 'Back to learning',
    continueBody: 'Open the intro, or pick any chapter from the course menu.',
    morePages: 'More information',
    placeholderLabel: 'Draft: decision needed before publication',

    pages: {
        about: {
            navTitle: 'About',
            summary: 'What you learn here and how the course is built.',
            title: 'About the course',
            lead: 'Behind the Scenes of AI is an interactive self-learning course that shows, step by step, what happens from the moment you write to a chat or an agent until the answer appears.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'At a glance',
                    items: [
                        { icon: 'layers', title: 'Intro, 19 chapters and a final exam', body: 'Each chapter ends with a short understanding check, and the final exam brings everything together.' },
                        { icon: 'languages', title: 'Six languages', body: 'Hebrew, English, Spanish, Russian, Arabic and Japanese. You can switch language at any time from the course menu.' },
                        { icon: 'device', title: 'At your own pace', body: 'Designed for phones as well as larger screens, and your progress is saved in your browser.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'How the course works',
                    items: [
                        'Each chapter explains one idea through interactive labs you can try yourself.',
                        'The understanding check at the end of each chapter shows which concepts are already strong for you and which are worth reinforcing.',
                        'Every chapter has a read-aloud option that uses your browser\'s speech voices when they are available.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Who wrote the course',
                    paragraphs: ['The course was written by Tomer Kedem.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Course operator',
                    decision: 'Confirm the legal name of the person or organization that operates the course and offers beta access, and whether it is also the course author.',
                },
            ],
        },

        faq: {
            navTitle: 'FAQ',
            summary: 'Access, the beta, paid access and your progress.',
            title: 'Frequently asked questions',
            lead: 'Short answers about free beta access, paid access planned for the future, and what happens to your progress.',
            blocks: [
                {
                    kind: 'faq',
                    heading: 'Access and the beta',
                    items: [
                        { q: 'Does registering give me access to the full course?', a: 'No. Registration alone does not grant access to the full course. Full access is given to beta testers who are individually approved.' },
                        { q: 'How long does the free access last?', a: 'An approved tester receives free access to the full course for up to one month from approval, not from the day you register. Access may end earlier.' },
                        { q: 'Will I be asked for a card or charged automatically?', a: 'No. Beta access does not require a payment card, and there is no automatic charge.' },
                        { q: 'Can my access stop before the month is over?', a: 'Yes. Access may end before the month is over. It may be suspended immediately, without prior notice, for security reasons, misuse or urgent technical reasons. In other cases, we aim to notify the tester in advance.' },
                        { q: 'What happens to my progress when the month ends?', a: 'Your progress and quiz results remain after the access period ends.' },
                    ],
                },
                {
                    kind: 'faq',
                    heading: 'Beta access and paid access',
                    items: [
                        { q: 'Is free beta access the same as buying the course?', a: 'No. Beta access is free, granted by individual approval, and lasts up to one month. Paid access is planned for the future as a separate purchase, and beta access does not turn into a purchase automatically.' },
                        { q: 'What paid options are planned?', a: 'Two products are planned, both as one-time purchases with no automatic renewal: Behind the Scenes of AI, with six months of access, and AI Engineering Foundations, with 12 months of access, which includes this course, Mathematics Foundations, Python Foundations and two books read on the dedicated books site. AI Engineering Foundations is not available for purchase yet. Prices and availability dates have not been published.' },
                        { q: 'What if the course is unavailable during paid access?', a: 'A problem with your own device or internet connection does not by itself entitle you to a refund. If there is a significant platform outage, extending your access will be considered. Prolonged unavailability will be reviewed individually under applicable law. These principles come from the draft sales terms and are not final yet.' },
                        { q: 'Where can I read the sales terms?', a: 'The sales terms are still a draft. You can read the draft on the "Sales terms (draft)" page, and it may change before publication.' },
                    ],
                },
                {
                    kind: 'faq',
                    heading: 'Using the course',
                    items: [
                        { q: 'Where is my progress saved right now?', a: 'In the current version, progress and quiz results are saved only in the browser on your device. Clearing the site\'s data in your browser deletes them, and they do not carry over to another device or browser.' },
                        { q: 'Can I change the language or the theme?', a: 'Yes. In the course menu you can switch between the six languages and choose a light, dark or system theme. Your choice is remembered in your browser.' },
                    ],
                },
                {
                    kind: 'placeholder',
                    heading: 'Questions still open',
                    decision: 'Decide how people apply to join the beta, how testers are approved, what is available before approval, and what access remains after the access period ends beyond the saved progress. For paid access: prices, the seller, the payment provider, launch dates, and cancellation and refund rules.',
                },
            ],
        },

        contact: {
            navTitle: 'Contact',
            summary: 'How to reach the course team.',
            title: 'Contact',
            lead: 'Official contact details for the course have not been published yet. Until then, the answer may already be in the FAQ.',
            blocks: [
                {
                    kind: 'placeholder',
                    heading: 'Contact channel',
                    decision: 'Set the official contact channel (for example an email address or a form), who answers, the expected response time, and whether accessibility and privacy requests have a separate channel.',
                },
            ],
        },

        betaTerms: {
            navTitle: 'Beta terms and license',
            summary: 'How beta access works and rights in the content.',
            title: 'Beta terms and license',
            lead: 'These are the principles of access to the full course during the beta, as confirmed so far.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'Access principles',
                    items: [
                        { icon: 'key', title: 'Individual approval', body: 'Registration alone does not grant access to the full course. Full access is given to beta testers who are individually approved.' },
                        { icon: 'clock', title: 'Up to one free month', body: 'An approved tester receives free access to the full course for up to one month from approval. Access may end earlier.' },
                        { icon: 'card', title: 'No card, no automatic charge', body: 'Beta access does not require a payment card, and you will not be charged automatically.' },
                        { icon: 'save', title: 'Your progress stays', body: 'Your progress and quiz results remain after the access period ends.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Suspension and early end',
                    items: [
                        'Access may end before the month is over.',
                        'Access may be suspended immediately, without prior notice, for security reasons, misuse or urgent technical reasons.',
                        'In other cases, we aim to notify the tester in advance.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Beta access is not a purchase',
                    paragraphs: ['Free beta access is separate from paid access planned for the future, and it does not turn into a purchase automatically. The planned products are described in the draft sales terms.'],
                },
                {
                    kind: 'text',
                    heading: 'Rights in the course content',
                    paragraphs: ['© 2026 Tomer Kedem. All rights reserved.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Tester license',
                    decision: 'Define what testers may and may not do with the content (personal use, sharing, screenshots, quoting), who owns the feedback testers send, and how the terms are accepted.',
                },
                {
                    kind: 'placeholder',
                    heading: 'Legal terms',
                    decision: 'Requires legal review: the operator named as the party to the terms, how either side can end access, the binding wording for suspension and early end, changes to the terms, limitation of liability and governing law. Paid access is covered separately in the draft sales terms.',
                },
            ],
        },

        privacy: {
            navTitle: 'Privacy',
            summary: 'What is stored on your device and what is not.',
            title: 'Privacy',
            lead: 'This page describes what the current version of the course stores and what it does not. Registration and beta access are not part of this version yet.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'What is stored on your device',
                    items: [
                        { icon: 'save', title: 'Progress and quiz results', body: 'Saved in your browser\'s local storage so you can see what is strong and what is worth reinforcing. The course does not send them to a server.' },
                        { icon: 'cookie', title: 'Language choice', body: 'If you choose a language, it is saved in a functional cookie for up to one year. Your browser sends it with requests to the course so pages load in the language you chose.' },
                        { icon: 'sliders', title: 'Display preferences', body: 'Your theme and the scroll position of the course menu are saved in your browser.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'What the course does not do',
                    items: [
                        'The course has no analytics or advertising trackers.',
                        'The current version does not require an account and does not ask for your name or email address.',
                        'Progress is not synced between devices.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Choosing your starting language',
                    paragraphs: ['To pick a language on your first visit, the course reads your browser\'s language setting and, depending on the hosting setup, may also use an approximate country indication supplied by the hosting platform. The course does not store this information.'],
                },
                {
                    kind: 'text',
                    heading: 'How to delete it',
                    paragraphs: ['You can delete everything the course stores by clearing this site\'s data in your browser settings.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Full privacy policy',
                    decision: 'Requires legal review: the identity and contact details of the party responsible for the data, what the hosting provider logs (such as IP addresses and request logs) and for how long, what data registration and tester approval will collect, why, where and for how long it will be kept, third parties and processors, users\' rights and how to exercise them, and applicable law.',
                },
            ],
        },

        accessibility: {
            navTitle: 'Accessibility',
            summary: 'What is in place today and what still needs work.',
            title: 'Accessibility',
            lead: 'This page describes the accessibility features in the course today and the limitations we know about.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'In place today',
                    items: [
                        { icon: 'direction', title: 'Language and direction', body: 'Every page declares its language and reading direction, right to left for Hebrew and Arabic and left to right for the others, so screen readers and browsers present the text correctly.' },
                        { icon: 'keyboard', title: 'Keyboard', body: 'The course menu and chapter navigation work from the keyboard, with a visible focus indicator. In chapters, the arrow keys move to the next or previous chapter, and Esc closes the menu on phones.' },
                        { icon: 'motion', title: 'Reduced motion', body: 'Some decorative animations, such as the background glow, stop when your system asks for reduced motion.' },
                        { icon: 'theme', title: 'Light and dark themes', body: 'Choose a light or dark theme, or follow your system, from the course menu.' },
                        { icon: 'speaker', title: 'Read aloud', body: 'Every chapter has a read-aloud option that uses your browser\'s speech voices when they are available.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Known limitations',
                    items: [
                        'No formal accessibility review against a recognized standard (such as WCAG) has been published yet.',
                        'Some small captions and secondary text may not have enough color contrast. This has not been measured yet.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'No accessibility overlay',
                    paragraphs: ['The course does not use an external accessibility overlay or widget. Accessibility is handled within the course itself.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Accessibility statement',
                    decision: 'Decide the conformance target (for example WCAG 2.2 level AA), the results and date of an accessibility review, any legal statement required where the course is offered, and a channel for reporting accessibility barriers. No such channel will be shown here until it is confirmed.',
                },
            ],
        },

        salesTerms: {
            navTitle: 'Sales terms (draft)',
            summary: 'Draft: the planned paid products and their principles.',
            title: 'Sales terms: draft',
            lead: 'This is a draft, not final sales terms. It describes the planned paid products and the principles set so far. This page is not an offer to buy, and the details may change before publication.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'Planned products',
                    items: [
                        { icon: 'layers', title: 'Behind the Scenes of AI', body: 'Six months of access to this course. A one-time purchase with no automatic renewal.' },
                        { icon: 'book', title: 'AI Engineering Foundations', body: '12 months of access to a package that includes Behind the Scenes of AI, Mathematics Foundations, Python Foundations and two books read on the dedicated books site. A one-time purchase with no automatic renewal. Not available for purchase yet.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Beta access is not a purchase',
                    paragraphs: ['Free beta access is separate from these products. It is granted by individual approval for up to one month, and it does not turn into a purchase automatically.'],
                },
                {
                    kind: 'text',
                    heading: 'When the course is unavailable',
                    items: [
                        'A problem with the learner\'s own device or internet connection does not by itself entitle them to a refund.',
                        'If there is a significant platform outage, extending access will be considered.',
                        'Prolonged unavailability will be reviewed individually under applicable law.',
                    ],
                },
                {
                    kind: 'placeholder',
                    heading: 'Details not decided yet',
                    decision: 'Decide before publication: prices and currency, the seller\'s legal identity and contact details, the payment provider, when each product becomes available for purchase, when the access period starts, cancellation and refund rules, what counts as a significant outage or prolonged unavailability and how much access is extended, how the two books are accessed, and what happens when the access period ends.',
                },
                {
                    kind: 'placeholder',
                    heading: 'Legal review',
                    decision: 'Requires legal review before publication: the full wording of the sales terms, consumer cancellation and refund rights wherever the products are sold, invoices and taxes, limitation of liability, changes to the terms and governing law. This draft does not claim compliance with any law.',
                },
            ],
        },
    },
};
