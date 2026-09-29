// ════════════════════════════════════════════════════════════════════════
// אכיפת גישה בשרת לפרקים המוגנים. שרת בלבד.
// ────────────────────────────────────────────────────────────────────────
// כל עמוד מוגן קורא ל-openCourseContent בכל בקשה (כתובת ישירה, רענון, ניווט בצד הלקוח
// ו-prefetch כולם מגיעים לכאן). הבדיקה קרובה למקור הנתונים, לא ב-layout ולא ב-proxy,
// כי layout אינו מתרנדר מחדש בניווט ואינו עוצר רינדור של העמוד.
//
// הזהות: ה-access token של Supabase מהעוגייה. השרת מעביר אותו כ-Bearer ל-PostgREST, ולכן
// אימות ה-JWT ובדיקת ההרשאה קורים יחד במסד (course_access_status, עם RLS ו-now() של
// המסד). טוקן פג או לא תקף = לא מחובר. תקלה = unavailable. תמיד נכשלים סגור.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { getRequestLocale } from '@/i18n/requestLocale';
import { getProtectedContent } from '@/i18n/chapterContent.server';
import type { ProtectedNamespace } from '@/i18n/dictionary';
import type { ProtectedContent } from '@/i18n/ProtectedContent';
import type { Locale } from '@/i18n/config';
import { CHAPTER_QUIZ_QUESTIONS, CONCEPT_TO_CHAPTER, finalExamQuestions } from '../quizQuestions';
import { ACCESS_TOKEN_COOKIE, type AccessStatus, type CourseAccess } from './access';
import { ANSWER_KEYS } from './answerKeys.server';

const KNOWN: readonly AccessStatus[] = ['no-grant', 'expired', 'revoked', 'active'];

/** מצב הגישה של הבקשה הנוכחית. מחושב פעם אחת לבקשה (layout ועמוד חולקים). */
export const getCourseAccess = cache(async (): Promise<CourseAccess> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
    if (!url || !key || !token) return { status: 'signed-out', expiresAt: null };

    const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: {
            headers: { Authorization: `Bearer ${token}` },
            // אף פעם לא ממטמון: ביטול או פקיעה חלים בבקשה הבאה.
            fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
        },
    });
    try {
        const { data, error, status } = await client.rpc('course_access_status').single<{ status: string; expires_at: string | null }>();
        if (status === 401 || status === 403) return { status: 'signed-out', expiresAt: null };
        if (error || !data || !KNOWN.includes(data.status as AccessStatus)) return { status: 'unavailable', expiresAt: null };
        return { status: data.status as AccessStatus, expiresAt: data.expires_at };
    } catch {
        return { status: 'unavailable', expiresAt: null };
    }
});

interface ContentRequest {
    namespaces: readonly ProtectedNamespace[];
    /** מספר הפרק למבדק, או 'final' למבחן הסיום. */
    quiz?: number | 'final';
    /** תוכן מעבדה שנבנה בשרת לפי שפה (פרק 3). */
    lab?: (locale: Locale) => unknown;
}

export type OpenResult = { open: true; content: ProtectedContent } | { open: false; access: CourseAccess };

/** מחזיר את תוכן העמוד המוגן רק כשיש הרשאה פעילה. אחרת, רק את מצב הגישה. */
export async function openCourseContent(request: ContentRequest): Promise<OpenResult> {
    const access = await getCourseAccess();
    if (access.status !== 'active') return { open: false, access };
    const locale = await getRequestLocale();
    return {
        open: true,
        content: {
            // שמות המושגים ומשפטי הגשר משותפים לכל העמודים המוגנים.
            dict: getProtectedContent(locale, [...request.namespaces, 'conceptLabels', 'chapterBridges']),
            conceptChapters: CONCEPT_TO_CHAPTER,
            quiz: request.quiz === 'final' ? finalExamQuestions
                : request.quiz !== undefined ? CHAPTER_QUIZ_QUESTIONS[request.quiz] : undefined,
            lab: request.lab?.(locale),
            answers: typeof request.quiz === 'number' ? ANSWER_KEYS[request.quiz] : undefined,
        },
    };
}

/**
 * תוכן משותף לכל עמודי הלומדה למשתמש עם הרשאה פעילה (שמות המושגים ללוח ההתקדמות שבסרגל).
 * בלי הרשאה פעילה מוחזר תוכן ריק, ושום תוכן מוגן לא נכלל בתשובה. תמיד מוחזר אובייקט
 * (ולא null) כדי שמבנה העץ יישאר זהה לפני ואחרי כניסה: אחרת הרענון אחרי הכניסה
 * מרכיב מחדש את כל העמוד ומאבד מצב (פאנל פתוח, מבדק באמצע).
 */
export async function sharedCourseContent(access: CourseAccess): Promise<ProtectedContent> {
    if (access.status !== 'active') return { dict: {} };
    return { dict: getProtectedContent(await getRequestLocale(), ['conceptLabels']), conceptChapters: CONCEPT_TO_CHAPTER };
}
