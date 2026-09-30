// פרק 1 פתוח ללומד מחובר, מאומת ולא מושעה (בלי הרשאת בטא). התוכן והמבדק נטענים בשרת,
// בכל בקשה, רק אחרי בדיקת הגישה. אחרת העמוד מחזיר מסך נעילה בלבד, והתוכן לא נשלח בתשובה.
import { ProtectedContentProvider } from '@/i18n/ProtectedContent';
import { openCourseContent } from '../_access/courseAccess';
import { LockedChapter } from '../_access/LockedChapter';
import ChapterView from './ChapterView';

export default async function Page() {
    const gate = await openCourseContent({ level: 'learner', namespaces: ['chapter1'], quiz: 1 });
    if (!gate.open) return <LockedChapter access={gate.access} chapter={1} />;
    return (
        <ProtectedContentProvider value={gate.content}>
            <ChapterView />
        </ProtectedContentProvider>
    );
}
