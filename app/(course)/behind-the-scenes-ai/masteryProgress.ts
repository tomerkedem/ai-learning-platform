// ════════════════════════════════════════════════════════════════════════
// שכבת התמדה קלה (localStorage) ל"מאחורי הקלעים של AI".
// ────────────────────────────────────────────────────────────────────────
// שומרת תוצאות מבדקי הפרקים ומבחן הסיום, מחשבת מושגים חזקים וחלשים, ומאפשרת
// אבחון ממוקד וחזרה ממוקדת. הכל JSON קליל, נכשל בעדינות אם אין localStorage,
// ומוגן מפני בעיות hydration (כל קריאה/כתיבה עוברת דרך בדיקת window).
// אין שימוש בתו "מקף ארוך" (em dash) בקובץ הזה.
// ════════════════════════════════════════════════════════════════════════

import type { AssessmentResult } from "@/components/content/AssessmentEngine";

export const MASTERY_STORAGE_KEY = "behindAiMasteryProgress";
export const MASTERY_UPDATED_EVENT = "behindai:mastery-updated";
export const TOTAL_CHAPTER_QUIZZES = 19;
export const FINAL_EXAM_QUIZ_ID = "behind-ai-final";

export interface QuizRecord {
    quizId: string;
    /** מספר הפרק עבור מבדק פרק, או null עבור מבחן הסיום. */
    chapterId: number | null;
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    attempts: number;
    bestScorePercent: number;
    lastCompletedAt: number;
    weakConcepts: string[];
    strongConcepts: string[];
}

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
    return r as unknown as QuizRecord;
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
 * שומר תוצאה של ניסיון שהושלם וממזג אותה עם מה שכבר נשמר.
 * לעולם לא דורס bestScorePercent בציון נמוך יותר, ומגדיל attempts בכל ניסיון.
 */
export function recordResult(input: RecordResultInput): QuizRecord {
    const store = loadStore();
    const prev = store.records[input.quizId];
    const attempts = (prev?.attempts ?? 0) + 1;
    const bestScorePercent = Math.max(prev?.bestScorePercent ?? 0, input.scorePercent);

    const record: QuizRecord = {
        quizId: input.quizId,
        chapterId: input.chapterId,
        scorePercent: input.scorePercent,
        correctCount: input.correctCount,
        totalQuestions: input.totalQuestions,
        passed: input.passed,
        attempts,
        bestScorePercent,
        lastCompletedAt: Date.now(),
        weakConcepts: input.weakConcepts,
        strongConcepts: input.strongConcepts,
    };

    store.records[input.quizId] = record;
    saveStore(store);
    return record;
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

export type FinalExamStatus = "not-taken" | "passed" | "needs-review";

export interface MasterySummary {
    completedChapters: number;
    passedChapters: number;
    totalChapters: number;
    averageScore: number | null;
    finalExam: FinalExamStatus;
    finalExamScore: number | null;
    weakConcepts: string[];
    strongConcepts: string[];
    hasAnyData: boolean;
}

/**
 * מאגד את כל הרשומות לסיכום אחד עבור לוח ההתקדמות.
 * "מושגים שכדאי לחזק" מקבצים מושג חלש שלא מופיע כחזק בשום מבדק אחר.
 */
export function getMasterySummary(): MasterySummary {
    const records = getAllRecords();
    const chapterRecords = records.filter(r => r.chapterId !== null);
    const final = records.find(r => r.quizId === FINAL_EXAM_QUIZ_ID);

    const completedChapters = chapterRecords.length;
    const passedChapters = chapterRecords.filter(r => r.passed).length;
    const averageScore = chapterRecords.length
        ? Math.round(chapterRecords.reduce((acc, r) => acc + r.bestScorePercent, 0) / chapterRecords.length)
        : null;

    let finalExam: FinalExamStatus = "not-taken";
    if (final) finalExam = final.passed ? "passed" : "needs-review";

    // מושגים חזקים: כל מה שסומן חזק באיזשהו מבדק (לפי הציון הטוב ביותר שנשמר).
    const strongSet = new Set<string>();
    for (const r of records) for (const c of r.strongConcepts) strongSet.add(c);
    // מושגים חלשים: סומנו חלש ועדיין לא שולטים בהם (לא מופיעים כחזקים בשום מקום).
    const weakSet = new Set<string>();
    for (const r of records) for (const c of r.weakConcepts) if (!strongSet.has(c)) weakSet.add(c);

    return {
        completedChapters,
        passedChapters,
        totalChapters: TOTAL_CHAPTER_QUIZZES,
        averageScore,
        finalExam,
        finalExamScore: final?.bestScorePercent ?? null,
        weakConcepts: [...weakSet],
        strongConcepts: [...strongSet],
        hasAnyData: records.length > 0,
    };
}
