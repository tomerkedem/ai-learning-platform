import type { Metadata } from 'next';
import { getRequestLocale } from '@/i18n/requestLocale';
import { getDictionary } from '@/i18n/dictionary';
import { courses } from '@/lib/courseData';
import { tField } from '@/lib/localize';

// כותרת בשפת הבקשה. עמודי התמיכה אישיים: לעולם לא באינדקס ולא במפת האתר.
export async function supportMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale();
    return {
        title: `${getDictionary(locale).chrome.support.title} | ${tField(courses['behind-the-scenes-ai'].title, locale)}`,
        robots: { index: false, follow: false },
    };
}
