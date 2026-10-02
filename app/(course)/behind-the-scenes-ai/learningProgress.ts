// ════════════════════════════════════════════════════════════════════════
// מצב הלמידה של הלומד בפרקים 1-19: מרשם יחידות הלמידה, התקדמות למידה, שליטה (Mastery)
// וציון אחרון. מודול טהור (בלי דפדפן ובלי Supabase), כדי שהבדיקות ירוצו עליו ישירות.
//
// ארבעה מושגים נפרדים, ואף אחד מהם אינו נגזר מאחר:
//   - התקדמות למידה: הלומד הגיע (ראה בפועל) ליחידות הלמידה האלה. לא קריאה, לא הבנה, לא זמן.
//   - ציון אחרון: הציון (0-100) של הניסיון האחרון במבדק הפרק (score_percent במסד).
//   - שליטה: עבר את מבדק הפרק לפחות פעם אחת. נשארת גם אחרי ניסיון שנכשל.
//   - גישה: הרשאה לתוכן. לא נקראת כאן ולא משנה דבר מהשלושה (ידע שנצבר נשאר כשהגישה נגמרת).
// המבוא ומבחן הסיום אינם חלק מ-19 הפרקים.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

/**
 * מרשם יחידות הלמידה: לכל פרק, הסעיפים העליונים שלפני מבדק הפרק, לפי הסדר בעמוד. כל יחידה
 * מסומנת בעמוד ב-data-learning-unit="<id>" על ה-section שלה (הבדיקה learningProgress.test.ts
 * מוודאת שהמרשם והעמודים תואמים). לא נכללים: ההירו (הוא נראה עם פתיחת העמוד, ופתיחה אינה
 * התקדמות), הגשר לשאלה הבאה, המבדק וכל מה שאחריו.
 *
 * שינוי תוכן בעתיד:
 *   - יחידה חדשה: מוסיפים מזהה חדש. האחוז של מי שכבר עבר על הפרק עשוי לרדת, כי יש בו יותר.
 *   - יחידה שהוסרה: מוחקים אותה מכאן. רשומות שמורות שלה פשוט לא נספרות (חיתוך עם המרשם).
 *   - שינוי סדר: בטוח. ההתקדמות נשמרת לפי מזהה, לא לפי מיקום.
 *   - שינוי שם מזהה = הסרה + הוספה. לעולם לא משתמשים שוב במזהה ישן לתוכן אחר.
 */
export const LEARNING_UNITS: Readonly<Record<number, readonly string[]>> = {
    1: ["guide", "lab", "takeaway", "summary"],
    2: ["guess", "lab", "full-input", "everyday", "takeaway", "lock"],
    3: ["guess", "insight", "lab", "lock", "practical"],
    4: ["guess", "embedding-table", "lookup-lab", "word-lab", "lock", "practical"],
    5: ["plain", "guess", "lab", "explain", "dna", "lock", "practical"],
    6: ["guess", "primer", "lab", "wow", "everyday", "mistake", "qkv", "lock", "practical"],
    7: ["guess", "primer", "lab", "wow", "everyday", "mistake", "how", "lock", "practical"],
    8: ["guess", "primer", "see", "lab", "wow", "everyday", "mistake", "how", "lock", "practical"],
    9: ["guess", "primer", "see", "lab", "wow", "everyday", "mistake", "how", "lock", "practical"],
    10: ["guess", "primer", "see", "lab", "wow", "everyday", "misconception", "lock", "practical"],
    11: ["guess", "primer", "see", "lab", "wow", "everyday", "misconception", "lock", "practical"],
    12: ["guess", "primer", "see", "lab", "wow", "everyday", "misconception", "lock", "practical"],
    13: ["guess", "primer", "see", "lab", "wow", "everyday", "misconception", "lock", "practical"],
    14: ["guess", "primer", "see", "lab", "wow", "misconception", "lock", "practical"],
    15: ["guess", "primer", "see", "lab", "wow", "misconception", "lock", "practical"],
    16: ["guess", "primer", "see", "lab", "wow", "misconception", "lock", "practical"],
    17: ["guess", "primer", "see", "lab", "wow", "misconception", "lock", "practical"],
    18: ["guess", "primer", "see", "lab", "wow", "misconception", "lock", "practical"],
    19: ["guess", "primer", "see", "lab", "wow", "misconception", "lock", "practical"],
};

/** 19 הפרקים, לפי הסדר. */
export const CHAPTER_IDS: readonly number[] = Array.from({ length: 19 }, (_, i) => i + 1);

/** סף המעבר של מבדק פרק (ברירת המחדל של AssessmentEngine). משמש רק לגזירת שליטה מנתונים ישנים. */
export const CHAPTER_PASS_SCORE = 70;

export const isLearningUnit = (chapterId: number, unitId: string): boolean =>
    !!LEARNING_UNITS[chapterId]?.includes(unitId);

/** הגעה אחת ליחידה. reachedAt = הפעם הראשונה (ms). */
export interface ReachedUnit {
    chapterId: number;
    unitId: string;
    reachedAt: number;
}

const unitKey = (u: Pick<ReachedUnit, "chapterId" | "unitId">) => `${u.chapterId}:${u.unitId}`;

/**
 * איחוד של כמה מקורות (שרת, מכשיר, תור): רשומה אחת לכל פרק+יחידה, עם ההגעה הראשונה.
 * אידמפוטנטי: איחוד חוזר של אותם נתונים לא משנה דבר, והגעה לעולם לא נמחקת.
 */
export function mergeReached(...lists: readonly ReachedUnit[][]): ReachedUnit[] {
    const byKey = new Map<string, ReachedUnit>();
    for (const list of lists) {
        for (const u of list) {
            const prev = byKey.get(unitKey(u));
            if (!prev || u.reachedAt < prev.reachedAt) byKey.set(unitKey(u), u);
        }
    }
    return [...byKey.values()];
}

/** תוצאת מבדק שמורה (מקומית או מהחשבון). */
export interface QuizRecord {
    quizId: string;
    /** מספר הפרק עבור מבדק פרק, או null עבור מבחן הסיום. */
    chapterId: number | null;
    /** הציון של הניסיון האחרון (0-100). זה "הציון הנוכחי", לא הטוב ביותר. */
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    /** האם הניסיון האחרון עבר. מבחן הסיום נקרא לפי זה. */
    passed: boolean;
    attempts: number;
    /** הציון הטוב ביותר אי פעם. היסטוריה, לא הציון הנוכחי. */
    bestScorePercent: number;
    lastCompletedAt: number;
    weakConcepts: string[];
    strongConcepts: string[];
    /** מבדק פרק בלבד: עבר לפחות פעם אחת. לא חוזר ל-false. תמיד false במבחן הסיום. */
    masteryEarned: boolean;
}

export type AttemptInput = Pick<QuizRecord,
    "quizId" | "chapterId" | "scorePercent" | "correctCount" | "totalQuestions" | "passed" | "weakConcepts" | "strongConcepts">;

/** ממזג ניסיון אחד לרשומה קיימת: attempts גדל, הציון הטוב ביותר לא יורד, ושליטה לא נעלמת. */
export function mergeAttempt(prev: QuizRecord | undefined, input: AttemptInput, completedAt: number): QuizRecord {
    return {
        quizId: input.quizId,
        chapterId: input.chapterId,
        scorePercent: input.scorePercent,
        correctCount: input.correctCount,
        totalQuestions: input.totalQuestions,
        passed: input.passed,
        attempts: (prev?.attempts ?? 0) + 1,
        bestScorePercent: Math.max(prev?.bestScorePercent ?? 0, input.scorePercent),
        lastCompletedAt: completedAt,
        weakConcepts: input.weakConcepts,
        strongConcepts: input.strongConcepts,
        masteryEarned: input.chapterId !== null && (!!prev?.masteryEarned || input.passed),
    };
}

/**
 * שליטה ברשומה שנשמרה לפני שהיה שדה masteryEarned. כל הנתונים האלה נרשמו כשסף מבדק הפרק
 * היה 70, ולכן "עבר עכשיו או הגיע פעם ל-70" = עבר לפחות פעם אחת. לא לשימוש בנתונים חדשים:
 * אם הסף ישתנה, השדה המפורש הוא המקור.
 */
export const legacyMasteryEarned = (r: Pick<QuizRecord, "chapterId" | "passed" | "bestScorePercent">): boolean =>
    r.chapterId !== null && (r.passed || r.bestScorePercent >= CHAPTER_PASS_SCORE);

/** המצב הנגזר של פרק אחד. כל השדות מתארים את הפרק הזה בדיוק (לא ספירה של "הראשונים"). */
export interface ChapterLearningState {
    chapterId: number;
    unitIds: readonly string[];
    /** יחידות שהלומד הגיע אליהן, לפי סדר המרשם הנוכחי. */
    reachedUnitIds: string[];
    unitCount: number;
    reachedUnitCount: number;
    /** 0..1. */
    learningProgressRatio: number;
    /** 0..100, מעוגל. */
    learningProgressPercent: number;
    attempted: boolean;
    /** הציון של הניסיון האחרון (0-100), או null כשלא נוסה. */
    latestScore: number | null;
    masteryEarned: boolean;
}

/**
 * מצב 19 הפרקים מתוך ההגעות ורשומות המבדקים. ההתקדמות נספרת רק על החיתוך בין המזהים
 * השמורים לבין המרשם הנוכחי, כך שמזהה ישן או לא מוכר לעולם לא מנפח את המונה.
 * התקדמות ושליטה בלתי תלויות: 30% עם שליטה ו-100% בלי שליטה הם מצבים תקינים.
 */
export function chapterLearningStates(reached: readonly ReachedUnit[], records: readonly QuizRecord[]): ChapterLearningState[] {
    return CHAPTER_IDS.map((chapterId) => {
        const unitIds = LEARNING_UNITS[chapterId];
        const got = new Set(reached.filter((u) => u.chapterId === chapterId).map((u) => u.unitId));
        const reachedUnitIds = unitIds.filter((id) => got.has(id));
        const ratio = unitIds.length ? reachedUnitIds.length / unitIds.length : 0;
        const record = records.find((r) => r.chapterId === chapterId && r.quizId === `behind-ai-chapter-${chapterId}`);
        return {
            chapterId,
            unitIds,
            reachedUnitIds,
            unitCount: unitIds.length,
            reachedUnitCount: reachedUnitIds.length,
            learningProgressRatio: ratio,
            learningProgressPercent: Math.round(ratio * 100),
            attempted: !!record,
            latestScore: record ? record.scorePercent : null,
            masteryEarned: !!record?.masteryEarned,
        };
    });
}

/**
 * הבסיס ל"המשך למידה": ההגעה החדשה ביותר ליחידה שעדיין קיימת במרשם. הפעולה העתידית פותחת
 * את הפרק וגוללת אל [data-learning-unit="<unitId>"]. null כשאין הגעה תקפה.
 */
export function latestReachedUnit(reached: readonly ReachedUnit[]): ReachedUnit | null {
    let latest: ReachedUnit | null = null;
    for (const u of reached) {
        if (!isLearningUnit(u.chapterId, u.unitId)) continue;
        if (!latest || u.reachedAt > latest.reachedAt) latest = u;
    }
    return latest;
}
