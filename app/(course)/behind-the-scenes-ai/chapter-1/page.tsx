// פרק 1 מוגן כמו שאר הפרקים: התוכן והמבדק נטענים בשרת, בכל בקשה, רק עם הרשאה פעילה (הרשמה
// או אימות מייל אינם מספיקים). אחרת העמוד מחזיר מסך נעילה בלבד, והתוכן לא נשלח בתשובה.
import { ProtectedContentProvider } from '@/i18n/ProtectedContent';
import { openCourseContent } from '../_access/courseAccess';
import { LockedChapter } from '../_access/LockedChapter';
import ChapterView from './ChapterView';

export default async function Page() {
    const gate = await openCourseContent({ namespaces: ['chapter1'], quiz: 1 });
    if (!gate.open) return <LockedChapter access={gate.access} chapter={1} />;
    return (
        <ProtectedContentProvider value={gate.content}>
            <ChapterView />
        </ProtectedContentProvider>
    );
}
