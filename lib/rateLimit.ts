// הגנת קצב בסיסית (per-IP) ל-routes שמפעילים את ה-API האמיתי של Claude.
// המטרה: לעצור לולאת בקשות / ניצול גס שיבזבז את מכסת המפתח - לא חיוב מדויק.
//
// מימוש בזיכרון, ללא תלות חיצונית. מגבלה מודעת: הזיכרון הוא per-instance, כך
// שבפריסה serverless (כמה מופעים / cold starts) הספירה מתפצלת ומתאפסת. זו רשת
// ביטחון, לא ארנק. לאכיפה חוצת-מופעים צריך מאגר משותף (Redis/Upstash וכו').
//
// שלושת ה-routes (chat-reply, word-engine, scenario) חולקים דלי אחד לכל IP, כדי
// שלולאה לא תעקוף את התקרה דרך route אחר.

import { NextResponse } from 'next/server';

const WINDOW_MS = 60_000;
// 100/דקה הוא הרבה מעל כל דפוס אנושי (גם הקלדה חיה ב-debounce בפרק 4), אבל
// חוסם סקריפט בלולאה. ניתן להקשיח דרך הפרמטרים של rateLimit().
const MAX_HITS = 100;

const hits = new Map<string, number[]>();
let lastSweep = 0;

function clientIp(req: Request): string {
    const h = req.headers;
    const xff = h.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return h.get('x-real-ip') ?? 'unknown';
}

/** ניקוי מזדמן של מפתחות ישנים כדי שה-Map לא יגדל ללא גבול. */
function sweep(now: number): void {
    if (now - lastSweep < WINDOW_MS) return;
    lastSweep = now;
    for (const [k, arr] of hits) {
        const fresh = arr.filter((t) => now - t < WINDOW_MS);
        if (fresh.length === 0) hits.delete(k);
        else hits.set(k, fresh);
    }
}

/**
 * בודק ומעדכן את מונה הבקשות עבור ה-IP. מחזיר NextResponse 429 (עם Retry-After)
 * אם חרג מהתקרה, אחרת null - והקריאה ממשיכה כרגיל.
 */
export function rateLimit(req: Request, max = MAX_HITS, windowMs = WINDOW_MS): NextResponse | null {
    const now = Date.now();
    sweep(now);

    const key = clientIp(req);
    const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (arr.length >= max) {
        const retryAfter = Math.max(1, Math.ceil((windowMs - (now - arr[0])) / 1000));
        return NextResponse.json(
            { error: 'rate_limited', message: 'יותר מדי בקשות בזמן קצר. נסו שוב בעוד רגע.' },
            { status: 429, headers: { 'Retry-After': String(retryAfter) } },
        );
    }

    arr.push(now);
    hits.set(key, arr);
    return null;
}
