// ════════════════════════════════════════════════════════════════════════
// נתוני המבדקים של הלומדה "מאחורי הקלעים של AI"
// ────────────────────────────────────────────────────────────────────────
// כל פרק מקבל מבדק קצר וממוקד (5 שאלות), ופרק הסיום מארח מבחן מסכם.
// הנתונים נצרכים על ידי הרכיב המשותף AssessmentEngine. כל שאלה כתובה כדי
// לבחון הבנה, נימוק ויישום, לא שינון. ההסברים מלמדים גם אחרי טעות.
// אין שימוש בתו "מקף ארוך" (em dash) בקובץ הזה, בהתאם להנחיות הלומדה.
// ════════════════════════════════════════════════════════════════════════

import type { ScoreTier, ReviewLink, AssessmentResult } from "@/components/content/AssessmentEngine";
import { recordResult, chapterQuizId, FINAL_EXAM_QUIZ_ID } from "./masteryProgress";
import { useProtectedContent } from "@/i18n/ProtectedContent";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: Difficulty;
    concept: string;
}

export interface ChapterQuizMeta {
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

// ===== CHAPTER 1 =====
// התשובה הגלויה היא קצה של דרך מוצר ומודל נסתרת. המסלול עובר ממזהי טוקנים
// דרך הסתברויות ובחירת הטוקן הבא; פרק 2 פותח את קלט המודל שהמוצר הרכיב.
export const chapter1Quiz: QuizQuestion[] = [
    {
        id: 1,
        question: "מה הצ׳אט הגלוי מראה לנו?",
        options: [
            "את הבקשה והתשובה החיצוניות, אך לא את כל הדרך שביניהן",
            "את כל ההוראות וההקשר שנכנסו למודל",
            "את המקום המדויק שבו כל תקלה נוצרה",
            "את כל החישובים הפנימיים של המודל"
        ],
        correctAnswer: 0,
        explanation: "הצ׳אט הוא המעטפת הגלויה. הוא מציג את הבקשה ואת התשובה, אך לא את כל מה שהמוצר והמודל עשו ביניהן.",
        difficulty: "easy",
        concept: "הגלוי מול הנסתר"
    },
    {
        id: 2,
        question: "מה הקשר הנכון בין מוצר AI לבין המודל?",
        options: [
            "המודל הוא תמיד המוצר כולו",
            "המוצר עשוי להרכיב קלט ולטפל בפלט סביב המודל",
            "המוצר רק מציג צבעים ואין לו תפקיד בדרך",
            "כל מוצר חייב להשתמש בכלי חיצוני בכל תשובה"
        ],
        correctAnswer: 1,
        explanation: "המודל הוא רכיב בתוך מוצר רחב יותר. המוצר עשוי לצרף הוראות או הקשר לפני המודל, ולעבד את הפלט אחריו.",
        difficulty: "easy",
        concept: "מוצר מול מודל"
    },
    {
        id: 3,
        question: "מה נכון לגבי Token ID?",
        options: [
            "זה הווקטור המלא שמכיל את משמעות הטוקן",
            "מזהים סמוכים מייצגים תמיד משמעויות דומות",
            "זו כתובת מספרית באוצר המילים, לא משמעות בפני עצמה",
            "זו ההסתברות שהטוקן ייבחר"
        ],
        correctAnswer: 2,
        explanation: "Token ID הוא כתובת יציבה באוצר המילים. הייצוג המספרי בעל התכונות נבחר רק בשלב ה-embedding.",
        difficulty: "medium",
        concept: "Token ID מול משמעות"
    },
    {
        id: 4,
        question: "מה ההבדל בין Softmax לבין Decoding?",
        options: [
            "Softmax יוצר התפלגות הסתברויות, ו-Decoding משתמש בה כדי לבחור או לדגום טוקן",
            "Softmax בוחר את התשובה הסופית, ו-Decoding יוצר את ההסתברויות",
            "שניהם בודקים אם הטוקן נכון עובדתית",
            "אין הבדל, אלה שני שמות לאותו חישוב"
        ],
        correctAnswer: 0,
        explanation: "Softmax ממיר logits להתפלגות. Decoding מפעיל אסטרטגיית בחירה על ההתפלגות; אף אחד מהם אינו בדיקת אמת.",
        difficulty: "medium",
        concept: "Softmax מול Decoding"
    },
    {
        id: 5,
        question: "אחרי שראינו שהמוצר עשוי להרכיב קלט עבור המודל, מה השאלה השימושית הבאה?",
        options: [
            "איזה צבע צריך להיות לכפתור השליחה?",
            "מה בדיוק הרכיב המוצר והעביר כקלט למודל?",
            "איך לזכור בעל פה את כל השלבים הפנימיים?",
            "איזה כלי חיצוני משמש בהכרח בכל תשובה?"
        ],
        correctAnswer: 1,
        explanation: "אחרי שהבנו שהמוצר עשוי להרכיב משהו לפני המודל, השאלה הבאה היא מה בדיוק נמצא בקלט הנוכחי שהמודל מקבל.",
        difficulty: "hard",
        concept: "קלט המודל שהמוצר מרכיב"
    }
];

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
// מושג -> פרק לקישורי החזרה הממוקדים. כאן רק מושגי פרק 1 (ציבורי), נגזרים מהמבדק שלו.
// המפה המלאה (מושגי פרקים 2-19 ומבחן הסיום) נמצאת בשרת (quizQuestions.ts) ומגיעה לעמוד
// מוגן רק אחרי בדיקת הרשאה (useConceptReviewLinks).
const PUBLIC_CONCEPT_TO_CHAPTER: Record<string, number> = Object.fromEntries(chapter1Quiz.map((q) => [q.concept, 1]));

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
function chapterQuizBase(n: number): Omit<ChapterQuizMeta, "questions"> {
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

/** פרק 1 ציבורי, ולכן השאלות שלו נשארות בחבילת הלקוח. */
export const behindAiChapterQuizzes: Record<number, ChapterQuizMeta> = {
    1: { ...chapterQuizBase(1), questions: chapter1Quiz },
};

/**
 * מבדק הפרק לעמוד פרק. פרקים 2-19: השאלות מגיעות מהשרת (quizQuestions.ts) דרך
 * ProtectedContentProvider, רק אחרי בדיקת הרשאה.
 */
export function useChapterQuiz(n: number): ChapterQuizMeta {
    const content = useProtectedContent();
    const getReviewLinks = useConceptReviewLinks();
    return behindAiChapterQuizzes[n] ?? { ...chapterQuizBase(n), questions: content?.quiz ?? [], getReviewLinks };
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
