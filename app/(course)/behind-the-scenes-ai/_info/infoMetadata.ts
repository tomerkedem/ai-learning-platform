import type { Metadata } from 'next';
import { getRequestLocale } from '@/i18n/requestLocale';
import { getDictionary } from '@/i18n/dictionary';
import { courses } from '@/lib/courseData';
import { tField } from '@/lib/localize';
import type { InfoPageKey } from '@/i18n/locales/he/behind-ai/infoPages';

// כותרת ותיאור בשפת הבקשה. דף שעדיין מכיל טיוטה עריכתית (placeholder) מסומן noindex,
// כדי שנוסח לא סופי לא ייכנס למנועי חיפוש. כשכל הטיוטות בדף מוחלפות, האינדוקס חוזר מעצמו.
export async function infoPageMetadata(page: InfoPageKey): Promise<Metadata> {
    const locale = await getRequestLocale();
    const content = getDictionary(locale).behindAi.infoPages.pages[page];
    const hasDraft = content.blocks.some((block) => block.kind === 'placeholder');
    return {
        title: `${content.title} | ${tField(courses['behind-the-scenes-ai'].title, locale)}`,
        description: content.lead,
        ...(hasDraft && { robots: { index: false, follow: true } }),
    };
}
