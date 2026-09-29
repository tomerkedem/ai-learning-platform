// דפי המידע של הלומדה: סדר, כתובת ואייקון. מקור יחיד לסרגל הצד, לפוטר ולדפים עצמם.
// התוויות מגיעות מהמילון (t.behindAi.infoPages.pages[key].navTitle).

import { Info, CircleHelp, MessageCircle, ScrollText, Fingerprint, Accessibility, Receipt, type LucideIcon } from 'lucide-react';
import type { InfoPageKey } from '@/i18n/locales/he/behind-ai/infoPages';

export const INFO_PAGES: readonly { key: InfoPageKey; href: string; Icon: LucideIcon }[] = [
    { key: 'about', href: '/behind-the-scenes-ai/about', Icon: Info },
    { key: 'faq', href: '/behind-the-scenes-ai/faq', Icon: CircleHelp },
    { key: 'betaTerms', href: '/behind-the-scenes-ai/beta-terms', Icon: ScrollText },
    { key: 'privacy', href: '/behind-the-scenes-ai/privacy', Icon: Fingerprint },
    { key: 'accessibility', href: '/behind-the-scenes-ai/accessibility', Icon: Accessibility },
    { key: 'contact', href: '/behind-the-scenes-ai/contact', Icon: MessageCircle },
];

// טיוטת תנאי המכירה מקושרת רק מתוך דפי המידע ("עוד מידע"), לא מהסרגל ומהפוטר, עד שהנוסח יאושר.
export const INFO_PAGE_LINKS: typeof INFO_PAGES = [
    ...INFO_PAGES,
    { key: 'salesTerms', href: '/behind-the-scenes-ai/sales-terms', Icon: Receipt },
];
