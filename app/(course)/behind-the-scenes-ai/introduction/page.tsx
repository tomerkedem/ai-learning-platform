// המבוא. רק לומד עם הרשאה פעילה מקבל את המבוא המלא: התוכן נטען בשרת, בכל בקשה, רק אחרי
// בדיקת הגישה. כל אחד אחר (גם חשבון מאומת בלי הרשאה) מקבל רק את התצוגה המקדימה (ההירו
// ודוגמת הצ'אט) והסבר שהמבוא ממשיך; שאר המבוא לא נשלח בתשובה.
import { ProtectedContentProvider } from '@/i18n/ProtectedContent';
import { openCourseContent } from '../_access/courseAccess';
import IntroView from './IntroView';
import { IntroPreview } from './IntroPreview';

export default async function Page() {
    const gate = await openCourseContent({ namespaces: ['introduction', 'introVisuals'] });
    if (!gate.open) return <IntroPreview access={gate.access} />;
    return (
        <ProtectedContentProvider value={gate.content}>
            <IntroView />
        </ProtectedContentProvider>
    );
}
