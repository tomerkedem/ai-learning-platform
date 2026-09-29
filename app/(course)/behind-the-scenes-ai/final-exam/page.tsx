// מבחן הסיום מוגן: התוכן והמבדק נטענים בשרת, בכל בקשה, רק אחרי בדיקת הרשאה.
// בלי הרשאה פעילה העמוד מחזיר מסך נעילה בלבד, והתוכן לא נשלח בתשובה.
import { ProtectedContentProvider } from '@/i18n/ProtectedContent';
import { openCourseContent } from '../_access/courseAccess';
import { LockedChapter } from '../_access/LockedChapter';
import FinalExamView from './FinalExamView';

export default async function Page() {
    const gate = await openCourseContent({ namespaces: ['finalExam'], quiz: 'final' });
    if (!gate.open) return <LockedChapter access={gate.access} chapter="final" />;
    return (
        <ProtectedContentProvider value={gate.content}>
            <FinalExamView />
        </ProtectedContentProvider>
    );
}
