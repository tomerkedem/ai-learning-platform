// ════════════════════════════════════════════════════════════════════════
// נתוני המבדקים של הלומדה "מאחורי הקלעים של AI"
// ────────────────────────────────────────────────────────────────────────
// כל פרק מקבל מבדק קצר וממוקד (5 שאלות), ופרק הסיום מארח מבחן מסכם.
// הנתונים נצרכים על ידי הרכיב המשותף AssessmentEngine. כל שאלה כתובה כדי
// לבחון הבנה, נימוק ויישום, לא שינון. ההסברים מלמדים גם אחרי טעות.
// אין שימוש בתו "מקף ארוך" (em dash) בקובץ הזה, בהתאם להנחיות הלומדה.
// ════════════════════════════════════════════════════════════════════════

import type { ScoreTier, ReviewLink, AssessmentResult, QuizQuestionMaterial } from "@/components/content/AssessmentEngine";
import { recordResult, chapterQuizId, FINAL_EXAM_QUIZ_ID } from "./masteryProgress";
import { useLatestQuizRecord } from "./learnerState";
import { useProtectedContent } from "@/i18n/ProtectedContent";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion extends QuizQuestionMaterial {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: Difficulty;
    concept: string;
}

export interface ChapterQuizMeta {
    /**
     * הניסיון האחרון שנשמר (מהמאגר המשותף). undefined: עוד לא ידוע, ולכן אין להציג את מסך הפתיחה;
     * null: לא נוסה; קיים: מוצג מסך התוצאה שלו במקום מסך הפתיחה.
     */
    previousResult: AssessmentResult | null | undefined;
    /** הניסיון השמור עוד לא ידוע: המנוע מציג כרטיס המתנה במקום מסך הפתיחה (נמסר לו דרך ה-spread). */
    resultPending: boolean;
    title: string;
    subtitle: string;
    questions: QuizQuestion[];
    /** קישור לפרק הבא, מוצג בסיום המבדק כאשר עוברים את סף ההצלחה */
    nextHref?: string;
    /** שמירת התוצאה ב-localStorage בסיום ניסיון */
    onComplete?: (result: AssessmentResult) => void;
    /** קישורי חזרה ממוקדים לפי מושגים חלשים */
    getReviewLinks?: (weakConcepts: string[]) => ReviewLink[];
    startLabel?: string;
    submitLabel?: string;
    completedTitle?: string;
    showTimer?: boolean;
    soundEnabled?: boolean;
}

// ===== CHAPTER 2 =====
// שאלות פרקים 2-19 ומבחן הסיום נמצאות ב-quizQuestions.ts (שרת בלבד), כי הן תוכן מוגן.

// ════════════════════════════════════════════════════════════════════════
// דרגות ציון למבחן הסיום (לפי ההמלצה הפדגוגית של הלומדה).
// המערך ממוין מהסף הגבוה לנמוך, כפי ש-AssessmentEngine מצפה.
// ════════════════════════════════════════════════════════════════════════
// מבנה בלבד (min/color). הטקסט (label/sub) מגיע מהמילון המוגן finalExam.tiers בשרת, כי
// מבחן הסיום הוא תוכן מוגן.
export const finalExamTiers: ScoreTier[] = [
    { min: 90, label: "", color: "text-emerald-400", sub: "" },
    { min: 75, label: "", color: "text-blue-400", sub: "" },
    { min: 60, label: "", color: "text-amber-400", sub: "" },
    { min: 0, label: "", color: "text-rose-400", sub: "" }
];

// ════════════════════════════════════════════════════════════════════════
// רישום מרוכז: מפה מ-chapterId אל המבדק של אותו פרק, כולל קישור לפרק הבא.
// כל עמוד פרק צורך את הערך המתאים לו: <AssessmentEngine {...behindAiChapterQuizzes[N]} />
// ════════════════════════════════════════════════════════════════════════
const QUIZ_SUBTITLE = "חמש שאלות שמחדדות את מה שלמדתם בפרק";

// תווית קצרה לכל פרק, לשימוש בקישורי החזרה הממוקדים ובלוח ההתקדמות.
export const CHAPTER_LABELS: Record<number, string> = {
    1: "הצ'אט השקוף",
    2: "Model Input",
    3: "Tokenization",
    4: "ממילים למספרים",
    5: "Semantic Space",
    6: "Attention: מי חשוב עכשיו",
    7: "Context Window",
    8: "Logits & Softmax",
    9: "Decoding",
    10: "Generation Loop",
    11: "Hallucinations",
    12: "RAG & Grounding",
    13: "Self-Check: בדיקה עצמית",
    14: "Learning from Mistakes",
    15: "Evaluation & Generalization",
    16: "האם AI לומד ממני",
    17: "Chat to Agent",
    18: "Guardrails",
    19: "Full Trace",
};

// מיפוי מספר הפרק החדש אל מבדק הפרק, אחרי שינוי סדר Stage 3A. פרק 7 (Context Window),
// פרק 8 (Logits & Softmax) ופרק 9 (Decoding) כבר נבנו במלואם. מבדק הביטחון הישן
// (chapter9Quiz) ומבדק chapter10Quiz (מ-Prompt למשימה) נותקו ושמורים תחת _parked,
// ואינם רשומים כעת.
// מושג -> פרק לקישורי החזרה הממוקדים. שמות המושגים הם תוכן מוגן (גם של פרק 1), ולכן
// המפה נמצאת בשרת (quizQuestions.ts) ומגיעה לעמוד רק אחרי בדיקת גישה (useConceptReviewLinks).
// מחוץ לעמוד כזה אין מפה, ולא נוצרים קישורי חזרה.
const PUBLIC_CONCEPT_TO_CHAPTER: Record<string, number> = {};

/** ממיר מושגים חלשים לקישורי חזרה ממוקדים, פרק אחד לכל מושג, בלי כפילויות. */
export function reviewLinksForConcepts(concepts: string[], conceptToChapter: Record<string, number> = PUBLIC_CONCEPT_TO_CHAPTER): ReviewLink[] {
    const seenChapters = new Set<number>();
    const links: ReviewLink[] = [];
    for (const concept of concepts) {
        const n = conceptToChapter[concept];
        if (!n || seenChapters.has(n)) continue;
        seenChapters.add(n);
        links.push({ href: `/behind-the-scenes-ai/chapter-${n}`, label: `חזרה לפרק ${n}: ${CHAPTER_LABELS[n]}` });
    }
    return links;
}

// onComplete שמתמיד את תוצאת מבדק הפרק ב-localStorage.
function chapterOnComplete(chapterId: number) {
    return (result: AssessmentResult) =>
        recordResult({ quizId: chapterQuizId(chapterId), chapterId, ...result });
}

// רישום מרוכז: מפה מ-chapterId אל המבדק של אותו פרק, מועשר בהתמדה, אבחון וקופי.
// כל עמוד פרק צורך את הערך המתאים לו: <AssessmentEngine {...behindAiChapterQuizzes[N]} />
/** כל מה שמבדק פרק צריך מלבד השאלות עצמן (השאלות של פרקים 2-19 מגיעות מהשרת). */
function chapterQuizBase(n: number): Omit<ChapterQuizMeta, "questions" | "previousResult" | "resultPending"> {
    return {
        title: `מבדק הבנה: ${CHAPTER_LABELS[n]}`,
        subtitle: QUIZ_SUBTITLE,
        nextHref: n < 19 ? `/behind-the-scenes-ai/chapter-${n + 1}` : undefined,
        onComplete: chapterOnComplete(n),
        getReviewLinks: reviewLinksForConcepts,
        startLabel: "התחילו את המבדק",
        submitLabel: "סיום המבדק",
        completedTitle: "סיימתם את המבדק",
        showTimer: true,
        soundEnabled: false,
    };
}

/**
 * מבדק הפרק לעמוד פרק. השאלות (גם של פרק 1) מגיעות מהשרת (quizQuestions.ts) דרך
 * ProtectedContentProvider, רק אחרי בדיקת גישה.
 */
export function useChapterQuiz(n: number): ChapterQuizMeta {
    const content = useProtectedContent();
    const getReviewLinks = useConceptReviewLinks();
    const previousResult = useLatestQuizResult(chapterQuizId(n));
    return { ...chapterQuizBase(n), questions: content?.quiz ?? [], getReviewLinks, previousResult, resultPending: previousResult === undefined };
}

/**
 * תוצאת הניסיון האחרון (לא הטוב ביותר) של מבדק, לשחזור מסך התוצאה. undefined = עוד לא ידוע; null = לא
 * נוסה. השליטה הקבועה אינה משפיעה על מה שמוצג כאן.
 */
export function useLatestQuizResult(quizId: string): AssessmentResult | null | undefined {
    const latest = useLatestQuizRecord(quizId);
    return latest && { scorePercent: latest.scorePercent, correctCount: latest.correctCount, totalQuestions: latest.totalQuestions, passed: latest.passed, weakConcepts: latest.weakConcepts, strongConcepts: latest.strongConcepts };
}

/** קישורי חזרה לפי מושגים, עם המפה המלאה כשהשרת העביר אותה (עמוד מוגן), אחרת רק פרק 1. */
export function useConceptReviewLinks(): (concepts: string[]) => ReviewLink[] {
    const map = useProtectedContent()?.conceptChapters;
    return (concepts) => reviewLinksForConcepts(concepts, map ?? PUBLIC_CONCEPT_TO_CHAPTER);
}

/**
 * מנגנון מבחן הסיום בלבד. השאלות וכל טקסט התצוגה מגיעים מהשרת רק אחרי בדיקת הרשאה
 * (useFinalExamQuestions והמילון finalExam).
 */
export const behindAiFinalExam = {
    passScore: 75,
    scoreTiers: finalExamTiers,
    onComplete: (result: AssessmentResult) =>
        recordResult({ quizId: FINAL_EXAM_QUIZ_ID, chapterId: null, ...result }),
    getReviewLinks: reviewLinksForConcepts,
    soundEnabled: false,
};

export function useFinalExamQuestions(): QuizQuestion[] {
    return useProtectedContent()?.quiz ?? [];
}
