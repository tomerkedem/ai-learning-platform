// פרק 3 מוגן: התוכן והמבדק נטענים בשרת, בכל בקשה, רק אחרי בדיקת הרשאה.
// בלי הרשאה פעילה העמוד מחזיר מסך נעילה בלבד, והתוכן לא נשלח בתשובה.
import { ProtectedContentProvider } from '@/i18n/ProtectedContent';
import { openCourseContent } from '../_access/courseAccess';
import { LockedChapter } from '../_access/LockedChapter';
import { getLabContent } from './labContent.server';
import ChapterView from './ChapterView';

export default async function Page() {
    const gate = await openCourseContent({ namespaces: ['chapter3'], quiz: 3, lab: getLabContent });
    if (!gate.open) return <LockedChapter access={gate.access} chapter={3} />;
    return (
        <ProtectedContentProvider value={gate.content}>
            <ChapterView />
        </ProtectedContentProvider>
    );
}
