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
    /** האם הניסיון האחרון עבר (מהרשומה), או null כשלא נוסה. בלתי תלוי בשליטה הקבועה. */
    latestPassed: boolean | null;
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
            latestPassed: record ? record.passed : null,
            masteryEarned: !!record?.masteryEarned,
        };
    });
}

/**
 * אבני הדרך של כל פרק 1-19 (לפי המרשם, בסדרו): לכל יחידת למידה רשומה, האם הלומד הגיע אליה.
 * מהגעות אמיתיות בלבד, לא מיחס ההתקדמות, ולכן דפוס עם פערים (הגיע, לא, הגיע) נשמר כפי שהוא.
 * בלי מזהים ובלי שמות: רק סדר ומצב, לציור המסלול בכרטיס הפרק. "הגיע" אינו "קרא" או "הבין".
 */
export function chapterMilestones(reached: readonly ReachedUnit[]): boolean[][] {
    return chapterLearningStates(reached, []).map((s) => {
        const got = new Set(s.reachedUnitIds);
        return s.unitIds.map((id) => got.has(id));
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

// ════════════════════════════════════════════════════════════════════════
// המודל הציבורי של הקורס: מה שממשק הלומד צורך. 19 פרקים בדיוק, לפי זהות הפרק.
// יחידות הלמידה נשארות פנימיות: אין כאן מספר יחידות, מספר יחידות שהגיעו אליהן או מזהי יחידות
// לפרק. "Track ~150, show 19, focus on 1".
// ════════════════════════════════════════════════════════════════════════

/** מזהה מבחן הסיום (זהה ל-FINAL_EXAM_QUIZ_ID ב-masteryProgress.ts, שאי אפשר לייבא כאן כי הוא תלוי בדפדפן). */
const FINAL_EXAM_ID = "behind-ai-final";

/** רשומת מבדק של פרק 1-19 בדיוק (מזהה ומספר פרק תואמים). רשומה אחרת אינה נספרת. */
const isChapterQuizRecord = (r: QuizRecord): boolean =>
    r.chapterId !== null && isChapterId(r.chapterId) && r.quizId === `behind-ai-chapter-${r.chapterId}`;
const isChapterId = (n: number): boolean => Number.isInteger(n) && n >= 1 && n <= CHAPTER_IDS.length;
const isFinalExamRecord = (r: QuizRecord): boolean => r.quizId === FINAL_EXAM_ID && r.chapterId === null;

/** מצב פרק אחד כפי שהממשק רואה אותו. */
export interface ChapterLearning {
    chapterId: number;
    /** 0..1, מתוך יחידות הלמידה של הפרק במרשם הנוכחי. "הגיע", לא "קרא" או "הבין". */
    learningProgressRatio: number;
    /** עבר את מבדק הפרק לפחות פעם אחת (קבוע). */
    masteryEarned: boolean;
    /** ציון הניסיון האחרון (0-100), או null כשלא נוסה. לעולם לא הציון הטוב ביותר. */
    latestScore: number | null;
    /** האם הניסיון האחרון עבר, או null כשלא נוסה. יכול להיות false גם כשיש שליטה (ניסיון חוזר שנכשל). */
    latestPassed: boolean | null;
    attempted: boolean;
}

export interface CourseLearning {
    /** בדיוק 19, לפי הסדר: chapters[n - 1] הוא פרק n. */
    chapters: readonly ChapterLearning[];
    /** מספר הפרקים שבהם הושגה שליטה, לפי זהות הפרקים עצמם. */
    masteredCount: number;
    /**
     * התקדמות הלמידה בקורס (0..1): יחידות רשומות שהלומד הגיע אליהן, מתוך כל היחידות הרשומות בפרקים
     * 1-19 (לא ממוצע של אחוזי פרקים, לא ממבדקים ולא משליטה). "הגיע", לא "השלים" או "הבין".
     */
    learningProgress: number;
    /** מבחן הסיום, מחוץ ל-19 הפרקים. passed = הניסיון האחרון עבר (הסמנטיקה הקיימת). */
    finalExam: { attempted: boolean; passed: boolean; latestScore: number | null };
    /**
     * הפעילות האחרונה בפרקים: ההגעה האחרונה ליחידה או סיום מבדק פרק, המאוחר מביניהם (בתיקו: המבדק).
     * unitId = נקודת ההמשך בפרק הזה: ההגעה האחרונה ליחידה שלו, גם כשהפעילות האחרונה הייתה המבדק;
     * null כשלא הגיע לאף יחידה בו. null כולו = אין הגעה ואין ניסיון במבדק פרק.
     */
    lastActivity: { chapterId: number; unitId: string | null; at: number } | null;
}

function lastActivity(reached: readonly ReachedUnit[], records: readonly QuizRecord[]): CourseLearning["lastActivity"] {
    let chapterId: number | null = null;
    let atTime = -Infinity;
    const unit = latestReachedUnit(reached);
    if (unit) {
        chapterId = unit.chapterId;
        atTime = unit.reachedAt;
    }
    for (const r of records) {
        if (isChapterQuizRecord(r) && r.lastCompletedAt >= atTime) {
            chapterId = r.chapterId;
            atTime = r.lastCompletedAt;
        }
    }
    if (chapterId === null) return null;
    const inChapter = latestReachedUnit(reached.filter((u) => u.chapterId === chapterId));
    return { chapterId, unitId: inChapter?.unitId ?? null, at: atTime };
}

/**
 * מצב הקורס מתוך ההגעות ורשומות המבדקים. ההתקדמות, השליטה והציון של כל פרק נגזרים מהפרק עצמו
 * (chapterLearningStates), ולכן שליטה בפרקים 4 ו-14 היא בדיוק פרקים 4 ו-14 ולא "שני הראשונים".
 * יחידות לא מוכרות ורשומות מבדק שאינן של פרק 1-19 לא נספרות.
 */
export function courseLearning(reached: readonly ReachedUnit[], records: readonly QuizRecord[]): CourseLearning {
    const states = chapterLearningStates(reached, records);
    const totalUnits = states.reduce((sum, s) => sum + s.unitCount, 0);
    const reachedUnits = states.reduce((sum, s) => sum + s.reachedUnitCount, 0);
    const chapters = states.map((s): ChapterLearning => ({
        chapterId: s.chapterId,
        learningProgressRatio: s.learningProgressRatio,
        masteryEarned: s.masteryEarned,
        latestScore: s.latestScore,
        latestPassed: s.latestPassed,
        attempted: s.attempted,
    }));
    const final = records.find(isFinalExamRecord);
    return {
        chapters,
        masteredCount: chapters.filter((c) => c.masteryEarned).length,
        learningProgress: totalUnits ? reachedUnits / totalUnits : 0,
        finalExam: { attempted: !!final, passed: !!final?.passed, latestScore: final ? final.scorePercent : null },
        lastActivity: lastActivity(reached, records),
    };
}

/**
 * תיאור איכותי של התקדמות הלמידה, בלי מספר יחידות ובלי לטעון "קרא" או "הבין".
 * גבולות: 0 = not-started; עד שליש (לא כולל) = started; עד שלושה רבעים (לא כולל) = in-progress;
 * עד 1 (לא כולל) = well-advanced; 1 = all-reached. ערך לא תקין נחשב 0, ומעל 1 נחשב 1.
 */
export type ProgressBand = "not-started" | "started" | "in-progress" | "well-advanced" | "all-reached";

export function progressBand(ratio: number): ProgressBand {
    if (!(ratio > 0)) return "not-started";
    if (ratio >= 1) return "all-reached";
    if (ratio < 1 / 3) return "started";
    if (ratio < 3 / 4) return "in-progress";
    return "well-advanced";
}

/**
 * היעד של "המשך למידה". המלצה על סדר בלבד: אינה מעניקה גישה ואינה תנאי לשום תוכן.
 * start/continue מצביעים על פרק; unitId = נקודת המשך בפרק כשידועה (רק בפרק של הפעילות האחרונה).
 */
export type ContinueTarget =
    | { kind: "start"; chapterId: number }
    | { kind: "continue"; chapterId: number; unitId: string | null }
    | { kind: "quiz"; chapterId: number }
    | { kind: "final-exam" };

/**
 * כלל דטרמיניסטי, מנתונים אמיתיים בלבד:
 *   1. אין גישה פעילה: אין יעד.
 *   2. אין הגעה ואין ניסיון במבדק פרק: התחלת פרק 1.
 *   3. עוגן = פרק הפעילות האחרונה. "סגור" = כל היחידות הגיעו, או שליטה.
 *      לא סגור: המשך העוגן (מנקודת ההמשך). כל היחידות הגיעו בלי שליטה: מבדק העוגן.
 *      שליטה: הפרק הבא אחרי העוגן (במעגל, אחרי 19 בא 1) שאינו סגור.
 *   4. כל 19 סגורים: מבדק הפרק הראשון שהגיעו לכל יחידותיו בלי שליטה; אחרת מבחן הסיום אם
 *      הניסיון האחרון בו לא עבר; אחרת אין יעד.
 * מבחן הסיום נשאר מוגן בגישה בלבד: הכלל רק מציע אותו בסוף, ואינו יוצר תנאי זכאות.
 */
export function continueTarget(course: CourseLearning, accessActive: boolean): ContinueTarget | null {
    if (!accessActive) return null;
    const { chapters, lastActivity: last } = course;
    if (!last) return { kind: "start", chapterId: 1 };
    const fullyReached = (c: ChapterLearning) => c.learningProgressRatio >= 1;
    const closed = (c: ChapterLearning) => fullyReached(c) || c.masteryEarned;

    const anchor = chapters[last.chapterId - 1];
    if (!closed(anchor)) return { kind: "continue", chapterId: anchor.chapterId, unitId: last.unitId };
    if (!anchor.masteryEarned) return { kind: "quiz", chapterId: anchor.chapterId };

    for (let i = 1; i < chapters.length; i++) {
        const c = chapters[(anchor.chapterId - 1 + i) % chapters.length];
        if (closed(c)) continue;
        return c.learningProgressRatio === 0 && !c.attempted
            ? { kind: "start", chapterId: c.chapterId }
            : { kind: "continue", chapterId: c.chapterId, unitId: null };
    }
    const quizLeft = chapters.find((c) => fullyReached(c) && !c.masteryEarned);
    if (quizLeft) return { kind: "quiz", chapterId: quizLeft.chapterId };
    return course.finalExam.passed ? null : { kind: "final-exam" };
}

/**
 * ממוצע הציונים האחרונים (0-100, מעוגל) של מבדקי פרקים 1-19 שנוסו. לא הציון הטוב ביותר, בלי
 * מבחן הסיום ובלי רשומות שאינן של פרק 1-19. null כשלא נוסה אף מבדק פרק.
 */
export function averageLatestChapterScore(records: readonly QuizRecord[]): number | null {
    const scores = records.filter(isChapterQuizRecord).map((r) => r.scorePercent);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
}

/** ניסיון מבדק שעוד ממתין בתור השליחה. rejected = השרת דחה את הנתון, ולכן הוא לא נספר. */
export interface PendingAttemptInput extends AttemptInput {
    completedAt: number;
    rejected?: string;
}

/**
 * הרשומות בתוספת ניסיונות שממתינים בתור (לא נדחים), באותו מיזוג כמו בשרת (mergeAttempt): הציון
 * האחרון מתעדכן ושליטה לא נעלמת. כך הממשק מציג ניסיון שעוד לא נשלח בלי להמציא תוצאה.
 */
export function withPending(records: readonly QuizRecord[], pending: readonly PendingAttemptInput[]): QuizRecord[] {
    const byId = new Map(records.map((r) => [r.quizId, r]));
    for (const p of pending) {
        if (!p.rejected) byId.set(p.quizId, mergeAttempt(byId.get(p.quizId), p, p.completedAt));
    }
    return [...byId.values()];
}

// ── סיכום הקורס ללוח ההתקדמות (MasteryDashboard). אותה גזירה כמו המודל הציבורי, בלי דרך נוספת. ──

export type FinalExamStatus = "not-taken" | "passed" | "needs-review";

export interface MasterySummary {
    /** מבדקי פרקים 1-19 שנוסו לפחות פעם אחת. "נוסה", לא "הושלם". */
    attemptedChapters: number;
    /** פרקים שבהם הושגה שליטה (קבועה), לפי זהות הפרק. זהה ל-courseLearning().masteredCount. */
    passedChapters: number;
    totalChapters: number;
    /** ממוצע הציונים האחרונים של מבדקי הפרקים שנוסו (averageLatestChapterScore). */
    averageScore: number | null;
    /** לפי הניסיון האחרון במבחן הסיום (הסמנטיקה הקיימת). */
    finalExam: FinalExamStatus;
    /** הציון של הניסיון האחרון במבחן הסיום, לעולם לא הציון הטוב ביותר. */
    finalExamScore: number | null;
    weakConcepts: string[];
    strongConcepts: string[];
    hasAnyData: boolean;
}

/**
 * הסיכום מתוך רשומות המבדקים. נספרות רק רשומות של מבדקי פרקים 1-19 (מזהה ומספר תואמים) ושל מבחן
 * הסיום; רשומה אחרת אינה משפיעה על שום ערך. "מושגים שכדאי לחזק" = מושג שסומן חלש ולא מופיע כחזק
 * באף מבדק.
 */
export function masterySummary(records: readonly QuizRecord[]): MasterySummary {
    const course = courseLearning([], records);
    const courseRecords = records.filter((r) => isChapterQuizRecord(r) || isFinalExamRecord(r));
    const strongSet = new Set<string>();
    for (const r of courseRecords) for (const c of r.strongConcepts) strongSet.add(c);
    const weakSet = new Set<string>();
    for (const r of courseRecords) for (const c of r.weakConcepts) if (!strongSet.has(c)) weakSet.add(c);
    const { finalExam } = course;
    return {
        attemptedChapters: course.chapters.filter((c) => c.attempted).length,
        passedChapters: course.masteredCount,
        totalChapters: CHAPTER_IDS.length,
        averageScore: averageLatestChapterScore(records),
        finalExam: !finalExam.attempted ? "not-taken" : finalExam.passed ? "passed" : "needs-review",
        finalExamScore: finalExam.latestScore,
        weakConcepts: [...weakSet],
        strongConcepts: [...strongSet],
        hasAnyData: courseRecords.length > 0,
    };
}
