"use client";

// ════════════════════════════════════════════════════════════════════════
// חשבון לומד (Supabase) ל"מאחורי הקלעים של AI".
// ────────────────────────────────────────────────────────────────────────
// הדפדפן מדבר ישירות עם Supabase עם המפתח הציבורי; RLS מבטיח שכל משתמש קורא
// וכותב רק את הרשומות שלו. אם משתני הסביבה חסרים, החשבון פשוט לא מוצג.
// חשבון (הרשמה או אימות מייל) אינו מעניק גישת בטא או גישה בתשלום.
//
// הפרדת נתונים במכשיר משותף:
//   - תרגול בלי חשבון נשמר באחסון המקומי הכללי (masteryProgress).
//   - ניסיון של משתמש מחובר נכנס ל"תיבת יוצאים" מקומית של אותו משתמש בלבד, ונמחק
//     ממנה רק אחרי שהשרת אישר אותו. כשל רשת משאיר אותו בתור לניסיון חוזר (טעינה
//     מחדש, חיבור מחדש לרשת, כניסה חוזרת). אין סימון "סונכרן" בלי אישור מהשרת.
// ════════════════════════════════════════════════════════════════════════

import { useSyncExternalStore } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { isLocale, type Locale } from "@/i18n/config";
import { mergeAttempt, MASTERY_UPDATED_EVENT, type QuizRecord, type RecordResultInput } from "./masteryProgress";
import { ACCESS_TOKEN_COOKIE } from "./_access/access";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && key ? createClient(url, key) : null;

// ── מצב ההתחברות: מנוי יחיד ברמת המודול, נצרך ברכיבים דרך useAuthState ──
interface AuthState {
    session: Session | null;
    /** הגענו מקישור איפוס סיסמה, וצריך לבחור סיסמה חדשה. */
    recovering: boolean;
    /** Supabase כבר דיווח על המצב ההתחלתי (עד אז "לא מחובר" אינו ודאי). */
    ready: boolean;
}

const SIGNED_OUT: AuthState = { session: null, recovering: false, ready: false };
let authState = SIGNED_OUT;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

/**
 * משקף את ה-access token לעוגייה, כדי שהשרת יוכל לזהות את הלומד ולבדוק הרשאה בכל בקשה.
 * זו רק זהות: ההרשאה עצמה נבדקת במסד. העוגייה פגה יחד עם הטוקן ומתעדכנת בכל רענון שלו.
 */
function mirrorAccessToken(session: Session | null) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    const maxAge = session ? Math.max(0, (session.expires_at ?? 0) - Math.floor(Date.now() / 1000)) : 0;
    const value = session && maxAge > 0 ? session.access_token : "";
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${value}; Path=/; Max-Age=${value ? maxAge : 0}; SameSite=Lax${secure}`;
}

if (supabase && typeof window !== "undefined") {
    // נרשם מיד עם יצירת הלקוח, כדי לא לפספס את PASSWORD_RECOVERY שנורה בזמן קריאת הקישור.
    supabase.auth.onAuthStateChange((event, session) => {
        mirrorAccessToken(session);
        authState = {
            session,
            recovering: !!session && (event === "PASSWORD_RECOVERY" || authState.recovering),
            ready: true,
        };
        notify();
    });
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

export function useAuthState(): AuthState {
    return useSyncExternalStore(subscribe, () => authState, () => SIGNED_OUT);
}

export function signedInUserId(): string | null {
    return authState.session?.user.id ?? null;
}

export function endPasswordRecovery(): void {
    authState = { ...authState, recovering: false };
    notify();
}

// ── קריאה מהחשבון ──
interface QuizRow {
    quiz_id: string;
    chapter_id: number | null;
    score_percent: number;
    correct_count: number;
    total_questions: number;
    passed: boolean;
    attempts: number;
    best_score_percent: number;
    last_completed_at: string;
    weak_concepts: string[];
    strong_concepts: string[];
}

const toRecord = (r: QuizRow): QuizRecord => ({
    quizId: r.quiz_id,
    chapterId: r.chapter_id,
    scorePercent: r.score_percent,
    correctCount: r.correct_count,
    totalQuestions: r.total_questions,
    passed: r.passed,
    attempts: r.attempts,
    bestScorePercent: r.best_score_percent,
    lastCompletedAt: Date.parse(r.last_completed_at),
    weakConcepts: r.weak_concepts,
    strongConcepts: r.strong_concepts,
});

/** כל רשומות המבדקים של המשתמש המחובר (RLS מסנן למשתמש עצמו). */
export async function fetchAccountRecords(): Promise<QuizRecord[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from("quiz_results").select("*");
    if (error) throw error;
    return (data as QuizRow[]).map(toRecord);
}

// עותק אחרון שנטען בהצלחה מהחשבון, לכל משתמש, להצגה כשאין רשת. נמחק ביציאה מפורשת.
const cacheKey = (userId: string) => `behindAiAccountCache:${userId}`;

export interface AccountSnapshot {
    records: QuizRecord[];
    /** מתי הרשומות נטענו מהשרת. */
    loadedAt: number | null;
    /** true = הטעינה נכשלה וזה העותק האחרון שנשמר (או כלום). */
    offline: boolean;
}

export async function loadAccountSnapshot(userId: string): Promise<AccountSnapshot> {
    try {
        const records = await fetchAccountRecords();
        const loadedAt = Date.now();
        try {
            window.localStorage.setItem(cacheKey(userId), JSON.stringify({ records, loadedAt }));
        } catch {
            // אין אחסון: פשוט אין עותק לזמן ניתוק.
        }
        return { records, loadedAt, offline: false };
    } catch {
        try {
            const cached = JSON.parse(window.localStorage.getItem(cacheKey(userId)) ?? "null") as { records?: unknown; loadedAt?: unknown } | null;
            if (cached && Array.isArray(cached.records) && typeof cached.loadedAt === "number") {
                return { records: cached.records as QuizRecord[], loadedAt: cached.loadedAt, offline: true };
            }
        } catch {
            // עותק פגום: כמו שאין עותק.
        }
        return { records: [], loadedAt: null, offline: true };
    }
}

export async function signOutAndForget(userId: string): Promise<void> {
    try {
        window.localStorage.removeItem(cacheKey(userId));
    } catch {
        // התעלמות בשקט.
    }
    await supabase?.auth.signOut();
}

// ── תיבת יוצאים לכל משתמש ──
export interface PendingAttempt extends RecordResultInput {
    /** מזהה ניסיון: ניסיון חוזר אחרי תשובה שאבדה לא נספר פעמיים בשרת. */
    attemptId: string;
    completedAt: number;
    /** קוד השגיאה כשהשרת דחה את הנתון עצמו. לא נשלח שוב עד "נסו שוב", ולא נמחק בלי בקשה. */
    rejected?: string;
}

const outboxKey = (userId: string) => `behindAiAccountOutbox:${userId}`;
// גיבוי בזיכרון כשהאחסון חסום: התור מחזיק לפחות עד סוף הביקור.
const memoryOutbox = new Map<string, PendingAttempt[]>();

const isPending = (v: unknown): v is PendingAttempt => {
    const p = v as PendingAttempt;
    return !!p && typeof p.attemptId === "string" && typeof p.quizId === "string" &&
        typeof p.completedAt === "number" && typeof p.scorePercent === "number";
};

export function getPendingAttempts(userId: string): PendingAttempt[] {
    try {
        const parsed: unknown = JSON.parse(window.localStorage.getItem(outboxKey(userId)) ?? "[]");
        return Array.isArray(parsed) ? parsed.filter(isPending) : [];
    } catch {
        return memoryOutbox.get(userId) ?? [];
    }
}

function setPendingAttempts(userId: string, items: PendingAttempt[]): void {
    memoryOutbox.set(userId, items);
    try {
        if (items.length) window.localStorage.setItem(outboxKey(userId), JSON.stringify(items));
        else window.localStorage.removeItem(outboxKey(userId));
    } catch {
        // אחסון חסום: נשאר הגיבוי בזיכרון.
    }
    window.dispatchEvent(new CustomEvent(MASTERY_UPDATED_EVENT));
}

// crypto.randomUUID קיים רק בהקשר מאובטח (https/localhost). בבדיקה בטלפון דרך http ברשת
// המקומית בונים UUID v4 מ-getRandomValues.
function newAttemptId(): string {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map(x => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** ניסיון של משתמש מחובר: נכנס לתור שלו ונשלח מיד. */
export function queueAccountResult(userId: string, input: RecordResultInput): void {
    const item: PendingAttempt = {
        attemptId: newAttemptId(),
        completedAt: Date.now(),
        quizId: input.quizId,
        chapterId: input.chapterId,
        scorePercent: input.scorePercent,
        correctCount: input.correctCount,
        totalQuestions: input.totalQuestions,
        passed: input.passed,
        weakConcepts: input.weakConcepts,
        strongConcepts: input.strongConcepts,
    };
    setPendingAttempts(userId, [...getPendingAttempts(userId), item]);
    void flushPendingAttempts(userId);
}

/**
 * שולח את התור לפי הסדר, אחד אחד. פריט נמחק רק אחרי אישור השרת. שגיאת רשת עוצרת
 * (ננסה שוב בטעינה, בחזרת הרשת או בכניסה). נעילת Web Locks מונעת משתי לשוניות לשלוח
 * את אותו תור במקביל.
 */
export async function flushPendingAttempts(userId: string): Promise<void> {
    const client = supabase;
    if (!client) return;
    const run = async () => {
        let sent = false;
        for (const item of getPendingAttempts(userId)) {
            if (signedInUserId() !== userId) break; // המשתמש התחלף: התור נשאר לבעליו.
            if (item.rejected) continue;
            let error: { code?: string } | null;
            try {
                ({ error } = await client.rpc("record_quiz_result", {
                    p_attempt_id: item.attemptId,
                    p_quiz_id: item.quizId,
                    p_chapter_id: item.chapterId,
                    p_score_percent: item.scorePercent,
                    p_correct_count: item.correctCount,
                    p_total_questions: item.totalQuestions,
                    p_passed: item.passed,
                    p_weak_concepts: item.weakConcepts,
                    p_strong_concepts: item.strongConcepts,
                    p_completed_at: new Date(item.completedAt).toISOString(),
                }));
            } catch {
                break;
            }
            if (error) {
                // נתון שהשרת דוחה (22xxx/23xxx) לא יצליח בניסיון חוזר: מסומן כנדחה ומוצג ללומד,
                // בלי לחסום את השאר. כל שגיאה אחרת (רשת, טוקן) עוצרת עד ההזדמנות הבאה.
                const code = error.code ?? "";
                if (!/^2[23]/.test(code)) break;
                setPendingAttempts(userId, getPendingAttempts(userId).map(p =>
                    p.attemptId === item.attemptId ? { ...p, rejected: code } : p));
                continue;
            }
            setPendingAttempts(userId, getPendingAttempts(userId).filter(p => p.attemptId !== item.attemptId));
            sent = true;
        }
        if (sent) window.dispatchEvent(new CustomEvent(MASTERY_UPDATED_EVENT));
    };
    if (typeof navigator !== "undefined" && navigator.locks) {
        await navigator.locks.request(`behindAiAccountOutbox:${userId}`, run);
    } else {
        await run();
    }
}

/** פעולה מפורשת של הלומד על פריט שנדחה: לשלוח שוב, או להסיר מהמכשיר. */
export function retryRejected(userId: string, attemptId: string): void {
    setPendingAttempts(userId, getPendingAttempts(userId).map(p =>
        p.attemptId === attemptId ? { ...p, rejected: undefined } : p));
    void flushPendingAttempts(userId);
}

export function removeRejected(userId: string, attemptId: string): void {
    setPendingAttempts(userId, getPendingAttempts(userId).filter(p => !(p.attemptId === attemptId && p.rejected)));
}

/** רשומות החשבון בתוספת ניסיונות שעוד ממתינים בתור (לא נדחים), כדי שהלוח יציג גם אותם. */
export function withPending(records: QuizRecord[], pending: PendingAttempt[]): QuizRecord[] {
    const byId = new Map(records.map(r => [r.quizId, r]));
    for (const p of pending) {
        if (!p.rejected) byId.set(p.quizId, mergeAttempt(byId.get(p.quizId), p, p.completedAt));
    }
    return [...byId.values()];
}

/**
 * ייבוא מפורש של תרגול שנשמר בלי חשבון. מוסיף רק מבדקים שעדיין אין לחשבון
 * (ON CONFLICT DO NOTHING), כך שרשומה קיימת בשרת לעולם לא נדרסת.
 */
export async function importLocalRecords(userId: string, records: QuizRecord[]): Promise<{ added: number; kept: number }> {
    if (!supabase) throw new Error("Supabase is not configured");
    const rows = records.map(r => ({
        user_id: userId,
        quiz_id: r.quizId,
        chapter_id: r.chapterId,
        score_percent: r.scorePercent,
        correct_count: r.correctCount,
        total_questions: r.totalQuestions,
        passed: r.passed,
        attempts: r.attempts,
        best_score_percent: r.bestScorePercent,
        last_completed_at: new Date(r.lastCompletedAt).toISOString(),
        weak_concepts: r.weakConcepts,
        strong_concepts: r.strongConcepts,
    }));
    const { data, error } = await supabase
        .from("quiz_results")
        .upsert(rows, { onConflict: "user_id,quiz_id", ignoreDuplicates: true })
        .select("quiz_id");
    if (error) throw error;
    return { added: data.length, kept: rows.length - data.length };
}

// ── שפה מועדפת ──
/** undefined = אין העדפה שמורה. זורק בשגיאת רשת כדי שלא נדרוס העדפה קיימת. */
export async function loadPreferredLocale(userId: string): Promise<Locale | undefined> {
    if (!supabase) return undefined;
    const { data, error } = await supabase
        .from("profiles").select("preferred_locale").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return isLocale(data?.preferred_locale) ? data.preferred_locale : undefined;
}

export async function savePreferredLocale(userId: string, locale: Locale): Promise<void> {
    if (!supabase) return;
    await supabase.from("profiles").upsert({ user_id: userId, preferred_locale: locale });
}

// הצעת הייבוא מוצגת פעם אחת לכל משתמש בכל מכשיר (ייבוא או ויתור מסמנים אותה).
const importKey = (userId: string) => `behindAiImportHandled:${userId}`;

export function isImportHandled(userId: string): boolean {
    try {
        return window.localStorage.getItem(importKey(userId)) === "1";
    } catch {
        return true; // אין אחסון: לא מציעים שוב ושוב.
    }
}

export function markImportHandled(userId: string): void {
    try {
        window.localStorage.setItem(importKey(userId), "1");
    } catch {
        // התעלמות בשקט.
    }
}
