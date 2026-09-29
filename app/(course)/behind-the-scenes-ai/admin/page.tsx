// עמוד ניהול הלומדה: רק למנהל שהוגדר במפורש (public.course_admins). הבדיקה בשרת בכל
// בקשה (כתובת ישירה, רענון, ניווט); כל מי שאינו מנהל מקבל 404, כך שהעמוד אינו נחשף.
// הנתונים והפעולות עצמם מגיעים מפונקציות במסד שבודקות שוב שהקורא מנהל.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isCourseAdminRequest } from '../_access/courseAccess';
import AdminView from './AdminView';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
    if (!(await isCourseAdminRequest())) notFound();
    return <AdminView />;
}
