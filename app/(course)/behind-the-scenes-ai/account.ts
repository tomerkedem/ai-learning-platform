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
import { MASTERY_UPDATED_EVENT, type QuizRecord, type RecordResultInput } from "./masteryProgress";
import { isLearningUnit, legacyMasteryEarned, mergeReached, type ReachedUnit } from "./learningProgress";
import { ACCESS_TOKEN_COOKIE } from "./_access/access";
import { readAuthRedirect } from "./authForm";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// detectSessionInUrl כבוי: את החזרה מקישור מייל קוראים כאן (readAuthRedirect), כדי שהטוקנים
// יוסרו מהכתובת מיד ובהחלפה (replaceState), בלי רשומת היסטוריה שמכילה אותם. הניקוי המובנה של
// supabase-js (location.hash = "") יוצר רשומת היסטוריה חדשה, והנתב של Next מחזיר את ה-hash
// לשורת הכתובת בעדכון הבא שלו (למשל router.refresh אחרי כניסה), כי הוא שמר את הכתובת המקורית.
export const supabase = url && key ? createClient(url, key, { auth: { detectSessionInUrl: false } }) : null;

const authRedirect = typeof window !== "undefined" ? readAuthRedirect(window.location.href) : null;
// הניקוי הראשון, לפני שהנתב של Next נטען (אם המודול נטען לפניו, הנתב מתחיל מהכתובת הנקייה).
if (authRedirect) window.history.replaceState(window.history.state, "", authRedirect.cleanUrl);
let recoveryPending = !!authRedirect?.recovery && !!authRedirect.tokens;
let linkErrorPending = !!authRedirect?.linkError;

/**
 * נקרא פעם אחת אחרי שהנתב של Next עלה (AccountSync). replaceState עם state ריק עובר דרך העטיפה
 * של Next, שמעדכנת גם את הכתובת שהנתב שומר, כך שהיא לא תחזור עם הטוקנים בעדכון הבא.
 */
export function syncCleanAuthUrl(): void {
    if (authRedirect) window.history.replaceState(null, "", authRedirect.cleanUrl);
}

/** נשלח כשהטוקנים מהקישור נדחו אחרי שחלון ההודעה כבר עלה. */
export const AUTH_LINK_ERROR_EVENT = "bts-auth-link-error";

/** true פעם אחת, כשהעמוד נטען מקישור מייל שנכשל. */
export function takeAuthLinkError(): boolean {
    const v = linkErrorPending;
    linkErrorPending = false;
    return v;
}

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
        const recovery = event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && recoveryPending);
        if (event === "SIGNED_IN") recoveryPending = false;
        authState = {
            session,
            recovering: !!session && (recovery || authState.recovering),
            ready: true,
        };
        notify();
    });
    // ביסוס ה-session מהטוקנים של הקישור (setSession מאמת אותם מול השרת ושומר כרגיל, כולל רענון).
    // כשל: הלומד פשוט לא מחובר, ומוצגת הודעת קישור לא תקין.
    if (authRedirect?.tokens) {
        void supabase.auth.setSession(authRedirect.tokens).then(({ error }) => {
            if (!error) return;
            recoveryPending = false;
            linkErrorPending = true;
            window.dispatchEvent(new CustomEvent(AUTH_LINK_ERROR_EVENT));
        });
    }
}

/** מנוי לשינויי מצב ההתחברות (גם מחוץ ל-React: מצב הלמידה המשותף משחרר בו את נתוני המשתמש הקודם). */
export function subscribeAuthState(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}
const subscribe = subscribeAuthState;

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
    mastery_earned: boolean;
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
    masteryEarned: r.mastery_earned,
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
        const cached = readCachedRecords(userId);
        return cached ? { ...cached, offline: true } : { records: [], loadedAt: null, offline: true };
    }
}

/** העותק האחרון שנטען בהצלחה מהחשבון במכשיר הזה (בלי רשת), או null כשאין עותק תקין. */
export function readCachedRecords(userId: string): { records: QuizRecord[]; loadedAt: number } | null {
    try {
        const cached = JSON.parse(window.localStorage.getItem(cacheKey(userId)) ?? "null") as { records?: unknown; loadedAt?: unknown } | null;
        if (cached && Array.isArray(cached.records) && typeof cached.loadedAt === "number") {
            // עותק שנשמר לפני השליטה הקבועה: גוזרים אותה כמו ברשומה מקומית ישנה.
            const records = (cached.records as QuizRecord[]).map(r =>
                typeof r.masteryEarned === "boolean" ? r : { ...r, masteryEarned: legacyMasteryEarned(r) });
            return { records, loadedAt: cached.loadedAt };
        }
    } catch {
        // עותק פגום או אחסון חסום: כמו שאין עותק.
    }
    return null;
}

export async function signOutAndForget(userId: string): Promise<void> {
    try {
        window.localStorage.removeItem(cacheKey(userId));
        // רק ההגעות שכבר אושרו בשרת נשכחות מהמכשיר; מה שעוד ממתין נשאר עד שיישלח בכניסה הבאה.
        const { pending } = loadUnitStore(userId);
        saveUnitStore(userId, { reached: pending, pending });
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

/** רשומות החשבון בתוספת ניסיונות שעוד ממתינים בתור (לא נדחים). הוגדר במודול הטהור כדי שייבדק שם. */
export { withPending } from "./learningProgress";

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
        mastery_earned: r.masteryEarned,
    }));
    const { data, error } = await supabase
        .from("quiz_results")
        .upsert(rows, { onConflict: "user_id,quiz_id", ignoreDuplicates: true })
        .select("quiz_id");
    if (error) throw error;
    return { added: data.length, kept: rows.length - data.length };
}

// ── התקדמות למידה: יחידות שהלומד הגיע אליהן (learning_unit_progress) ──
// לכל משתמש מאגר אחד במכשיר: reached = כל מה שידוע (מהשרת ומהמכשיר), להצגה מיידית ובלי רשת;
// pending = הגעות שהשרת עוד לא אישר. כמו תיבת היוצאים של המבדקים: פריט יוצא מ-pending רק
// אחרי אישור, והשליחה חוזרת בטעינה, בחזרת הרשת ובכניסה. כתיבה כפולה בשרת היא no-op.
// אורח: לא נרשם דבר (פרקים 1-19 מוגנים). הנתונים נשמרים לפי פרק+יחידה+זמן, כך שאפשר לייבא
// בעתיד גם הגעות מקומיות, בלי שינוי במבנה.
export const LEARNING_PROGRESS_UPDATED_EVENT = "behindai:learning-progress-updated";

interface UnitStore {
    reached: ReachedUnit[];
    pending: ReachedUnit[];
}

const unitStoreKey = (userId: string) => `behindAiLearningUnits:${userId}`;
const memoryUnitStore = new Map<string, UnitStore>();

const isReachedUnit = (v: unknown): v is ReachedUnit => {
    const u = v as ReachedUnit;
    return !!u && typeof u.chapterId === "number" && typeof u.unitId === "string" && typeof u.reachedAt === "number";
};

function loadUnitStore(userId: string): UnitStore {
    try {
        const parsed = JSON.parse(window.localStorage.getItem(unitStoreKey(userId)) ?? "null") as Partial<UnitStore> | null;
        const list = (v: unknown) => (Array.isArray(v) ? v.filter(isReachedUnit) : []);
        return { reached: list(parsed?.reached), pending: list(parsed?.pending) };
    } catch {
        return memoryUnitStore.get(userId) ?? { reached: [], pending: [] };
    }
}

function saveUnitStore(userId: string, store: UnitStore): void {
    memoryUnitStore.set(userId, store);
    try {
        window.localStorage.setItem(unitStoreKey(userId), JSON.stringify(store));
    } catch {
        // אחסון חסום: נשאר הגיבוי בזיכרון עד סוף הביקור.
    }
    window.dispatchEvent(new CustomEvent(LEARNING_PROGRESS_UPDATED_EVENT));
}

/**
 * הלומד המחובר הגיע ליחידה. אידמפוטנטי: הגעה שכבר ידועה לא נכתבת שוב ולא נשלחת שוב.
 * לא מעניק גישה ואינו בודק אותה: היחידות מסומנות רק בתוכן שהשרת כבר שלח אחרי בדיקת הרשאה.
 */
export function markUnitReached(chapterId: number, unitId: string): void {
    const userId = signedInUserId();
    if (!userId || !isLearningUnit(chapterId, unitId)) return;
    const store = loadUnitStore(userId);
    if (store.reached.some(u => u.chapterId === chapterId && u.unitId === unitId)) return;
    const item: ReachedUnit = { chapterId, unitId, reachedAt: Date.now() };
    saveUnitStore(userId, { reached: [...store.reached, item], pending: [...store.pending, item] });
    void flushLearningUnits(userId);
}

/** שולח את כל ההגעות הממתינות בקריאה אחת. נעילה משותפת לכל הלשוניות, כמו בתור המבדקים. */
export async function flushLearningUnits(userId: string): Promise<void> {
    const client = supabase;
    if (!client) return;
    const run = async () => {
        const batch = loadUnitStore(userId).pending;
        if (!batch.length || signedInUserId() !== userId) return;
        let error: { code?: string } | null;
        try {
            ({ error } = await client.rpc("record_learning_units", {
                p_chapter_ids: batch.map(u => u.chapterId),
                p_unit_ids: batch.map(u => u.unitId),
                p_reached_at: batch.map(u => new Date(u.reachedAt).toISOString()),
            }));
        } catch {
            return;
        }
        // שגיאת רשת או טוקן: נשאר בתור. נתון שהשרת דוחה (22xxx/23xxx) לא יצליח בניסיון חוזר,
        // ונשאר רק במכשיר (המזהים מגיעים מהמרשם, כך שזה לא אמור לקרות).
        if (error && !/^2[23]/.test(error.code ?? "")) return;
        const sent = new Set(batch.map(u => `${u.chapterId}:${u.unitId}`));
        const store = loadUnitStore(userId);
        saveUnitStore(userId, { ...store, pending: store.pending.filter(u => !sent.has(`${u.chapterId}:${u.unitId}`)) });
    };
    if (typeof navigator !== "undefined" && navigator.locks) {
        await navigator.locks.request(`behindAiLearningOutbox:${userId}`, run);
    } else {
        await run();
    }
}

/**
 * כל ההגעות של המשתמש: מהחשבון (RLS: רק שלו), מאוחדות עם מה שבמכשיר ועם מה שממתין.
 * בלי רשת: מה שבמכשיר. את המצב לכל פרק גוזרים מזה ב-chapterLearningStates.
 */
export async function loadReachedUnits(userId: string): Promise<{ reached: ReachedUnit[]; offline: boolean }> {
    try {
        if (!supabase) throw new Error("Supabase is not configured");
        const { data, error } = await supabase.from("learning_unit_progress").select("chapter_id, unit_id, reached_at");
        if (error) throw error;
        const server = (data as { chapter_id: number; unit_id: string; reached_at: string }[])
            .map(r => ({ chapterId: r.chapter_id, unitId: r.unit_id, reachedAt: Date.parse(r.reached_at) }));
        const store = loadUnitStore(userId);
        const reached = mergeReached(server, store.reached, store.pending);
        // שמירה רק כשנוספה הגעה (למשל ממכשיר אחר), כדי שלא ייווצר מעגל עם האירוע.
        if (reached.length !== store.reached.length) saveUnitStore(userId, { ...store, reached });
        return { reached, offline: false };
    } catch {
        const store = loadUnitStore(userId);
        return { reached: mergeReached(store.reached, store.pending), offline: true };
    }
}

/** כל ההגעות שידועות במכשיר (כולל ממתינות), בלי רשת. */
export function localReachedUnits(userId: string): ReachedUnit[] {
    const store = loadUnitStore(userId);
    return mergeReached(store.reached, store.pending);
}

/**
 * לאירוע storage מלשונית אחרת: איזה מאגר של המשתמש הזה השתנה, או null כשהמפתח אינו שלו או אינו
 * נוגע למצב הלמידה (מפתח של משתמש אחר לעולם אינו נחשב).
 */
export function learnerStorageKind(userId: string, key: string | null): "outbox" | "units" | "cache" | null {
    if (key === outboxKey(userId)) return "outbox";
    if (key === unitStoreKey(userId)) return "units";
    if (key === cacheKey(userId)) return "cache";
    return null;
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
    // תבניות המייל של Supabase (supabase/templates) בוחרות שפה לפי user_metadata.locale, ולכן
    // מייל איפוס סיסמה יגיע בשפה הנוכחית של הלומד. full_name במטא-דאטה נעול במסד ואינו משתנה כאן.
    if (authState.session?.user.user_metadata?.locale !== locale) await supabase.auth.updateUser({ data: { locale } });
}

// ── שם מלא ──
// כלל השם בהרשמה: normalizeFullName ב-authForm.ts.
// השם האחרון שנטען, לפי משתמש. פאנל החשבון נטען מחדש בכל ניווט (הוא בתוך הסרגל של כל עמוד),
// ומתחיל מהערך הזה כדי שהשם בסיכום לא ייעלם עד שהטעינה חוזרת. משתמש אחר או יציאה = אין ערך.
let lastFullName: { userId: string; name: string | null } | null = null;

/** השם שנטען לאחרונה למשתמש הזה, או undefined כשעוד לא נטען. */
export function cachedFullName(userId: string | undefined): string | null | undefined {
    return userId && lastFullName?.userId === userId ? lastFullName.name : undefined;
}

/**
 * השם המלא ששמור בפרופיל, או null כשאין (משתמשים ותיקים; מנהל משלים אותו). זורק בשגיאת רשת.
 * הלומד אינו יכול לשנות את השם: רק ההרשמה או מנהל (admin_set_learner_name), והמסד אוכף זאת.
 */
export async function loadFullName(userId: string): Promise<string | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from("profiles").select("full_name").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    const name = (data?.full_name as string | null | undefined) ?? null;
    lastFullName = { userId, name };
    return name;
}

/**
 * מספר בקשות התמיכה עם תשובה מהצוות שעוד לא נקראה (התראה support_reply שלא סומנה כנקראה;
 * יש לכל היותר אחת לבקשה). שינוי סטטוס (support_status) אינו תשובה ואינו נספר. RLS: רק
 * ההתראות של המשתמש עצמו. נקרא בכל טעינה של הפאנל, בלי realtime. זורק בשגיאת רשת.
 */
export async function loadUnreadSupportReplies(userId: string): Promise<number> {
    if (!supabase) return 0;
    const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("type", "support_reply")
        .is("read_at", null);
    if (error) throw error;
    return count ?? 0;
}

/** לתצוגה בלבד (קישור לעמוד הניהול). ההרשאה נבדקת בשרת ובמסד בכל פעולה. */
export async function checkIsCourseAdmin(): Promise<boolean> {
    if (!supabase) return false;
    const { data, error } = await supabase.rpc("is_course_admin");
    return !error && data === true;
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
