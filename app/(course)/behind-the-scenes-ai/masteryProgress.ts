// ════════════════════════════════════════════════════════════════════════
// שכבת התמדה קלה (localStorage) ל"מאחורי הקלעים של AI".
// ────────────────────────────────────────────────────────────────────────
// שומרת תוצאות מבדקי הפרקים ומבחן הסיום, מחשבת מושגים חזקים וחלשים, ומאפשרת
// אבחון ממוקד וחזרה ממוקדת. הכל JSON קליל, נכשל בעדינות אם אין localStorage,
// ומוגן מפני בעיות hydration (כל קריאה/כתיבה עוברת דרך בדיקת window).
// אין שימוש בתו "מקף ארוך" (em dash) בקובץ הזה.
// ════════════════════════════════════════════════════════════════════════

import type { AssessmentResult } from "@/components/content/AssessmentEngine";
import { queueAccountResult, signedInUserId } from "./account";
import {
    legacyMasteryEarned, masterySummary, mergeAttempt,
    type FinalExamStatus, type MasterySummary, type QuizRecord,
} from "./learningProgress";

export { mergeAttempt, type QuizRecord };

export const MASTERY_STORAGE_KEY = "behindAiMasteryProgress";
export const MASTERY_UPDATED_EVENT = "behindai:mastery-updated";
export const TOTAL_CHAPTER_QUIZZES = 19;
export const FINAL_EXAM_QUIZ_ID = "behind-ai-final";

interface MasteryStore {
    version: 1;
    records: Record<string, QuizRecord>;
}

const EMPTY_STORE: MasteryStore = { version: 1, records: {} };

function isBrowser(): boolean {
    // גישה ל-window.localStorage עלולה לזרוק (אחסון חסום), ולכן בתוך try.
    try {
        return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
    } catch {
        return false;
    }
}

const isStringArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every(x => typeof x === "string");
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * מחזיר רשומה רק אם כל השדות שהקוד קורא קיימים ותקינים.
 * רשומה חלקית או ישנה נזרקת (לא משלימים ערכים ולא ממציאים תוצאה).
 */
function parseRecord(quizId: string, v: unknown): QuizRecord | null {
    if (!v || typeof v !== "object") return null;
    const r = v as Record<string, unknown>;
    if (
        r.quizId !== quizId ||
        !(r.chapterId === null || isNum(r.chapterId)) ||
        !isNum(r.scorePercent) || !isNum(r.correctCount) || !isNum(r.totalQuestions) ||
        typeof r.passed !== "boolean" ||
        !isNum(r.attempts) || !isNum(r.bestScorePercent) || !isNum(r.lastCompletedAt) ||
        !isStringArray(r.weakConcepts) || !isStringArray(r.strongConcepts)
    ) return null;
    // רשומה מלפני השליטה הקבועה: נגזרת פעם אחת מהנתונים הישנים (ראו legacyMasteryEarned).
    const masteryEarned = typeof r.masteryEarned === "boolean" ? r.masteryEarned : legacyMasteryEarned(r as unknown as QuizRecord);
    return { ...(r as unknown as QuizRecord), masteryEarned };
}

function loadStore(): MasteryStore {
    const empty = (): MasteryStore => ({ ...EMPTY_STORE, records: {} });
    if (!isBrowser()) return empty();
    try {
        const raw = window.localStorage.getItem(MASTERY_STORAGE_KEY);
        if (!raw) return empty();
        const parsed: unknown = JSON.parse(raw);
        // גרסה לא מוכרת (עתידית או חסרה) או צורה לא תקינה: מתחילים נקי.
        if (
            !parsed || typeof parsed !== "object" || Array.isArray(parsed) ||
            (parsed as { version?: unknown }).version !== 1
        ) return empty();
        const rawRecords = (parsed as { records?: unknown }).records;
        if (!rawRecords || typeof rawRecords !== "object" || Array.isArray(rawRecords)) return empty();
        const records: Record<string, QuizRecord> = {};
        for (const [id, v] of Object.entries(rawRecords)) {
            const rec = parseRecord(id, v);
            if (rec) records[id] = rec;
        }
        return { version: 1, records };
    } catch {
        // נתונים פגומים או localStorage חסום: מתחילים נקי בלי לזרוק שגיאה.
        return empty();
    }
}

function saveStore(store: MasteryStore): void {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(store));
        window.dispatchEvent(new CustomEvent(MASTERY_UPDATED_EVENT));
    } catch {
        // אין מקום אחסון או שהוא חסום: מתעלמים בשקט, האפליקציה ממשיכה לעבוד.
    }
}

export interface RecordResultInput extends AssessmentResult {
    quizId: string;
    chapterId: number | null;
}

/**
 * שומר תוצאה של ניסיון שהושלם.
 * מחובר: הניסיון נכנס לתור של המשתמש ונשלח לחשבון (account.ts), בלי לגעת באחסון הכללי,
 * כדי שנתונים של חשבונות שונים במכשיר משותף לא יתערבבו. לא מחובר: אחסון מקומי כרגיל.
 */
export function recordResult(input: RecordResultInput): void {
    const userId = signedInUserId();
    if (userId) return queueAccountResult(userId, input);
    const store = loadStore();
    store.records[input.quizId] = mergeAttempt(store.records[input.quizId], input, Date.now());
    saveStore(store);
}

/** מחזיר מזהה מבדק יציב עבור פרק נתון. */
export function chapterQuizId(chapterId: number): string {
    return `behind-ai-chapter-${chapterId}`;
}

export function getRecord(quizId: string): QuizRecord | undefined {
    return loadStore().records[quizId];
}

export function getAllRecords(): QuizRecord[] {
    return Object.values(loadStore().records);
}

export type { FinalExamStatus, MasterySummary };

/**
 * הסיכום ללוח ההתקדמות, מהגזירה הטהורה (masterySummary ב-learningProgress.ts): ציונים אחרונים,
 * שליטה לפי זהות הפרק, ורק רשומות של מבדקי פרקים 1-19 ושל מבחן הסיום.
 */
export function getMasterySummary(records: QuizRecord[] = getAllRecords()): MasterySummary {
    return masterySummary(records);
}
