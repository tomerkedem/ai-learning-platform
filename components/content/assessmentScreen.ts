// איזה מסך המבדק מציג (AssessmentEngine). טהור, כדי שמחזור התוצאה השמורה ייבדק בלי דפדפן.

export type AssessmentScreen = "pending" | "start" | "result" | "questions";

/**
 * pending: הקורא הצהיר שהתוצאה השמורה עוד לא ידועה (resultPending), ולכן לא מוצג מסך פתיחה ואי אפשר
 * להתחיל ניסיון. רק לפני ניסיון: ניסיון שכבר התחיל לעולם אינו מוסתר. קורא שלא מעביר resultPending
 * (מורשת) אינו מגיע לכאן לעולם. תוצאה שמורה מוצגת עד "ניסיון חוזר" מפורש (isStarted).
 */
export function assessmentScreen(s: {
    resultPending?: boolean;
    hasPreviousResult: boolean;
    isStarted: boolean;
    isSubmitted: boolean;
    isReviewMode: boolean;
}): AssessmentScreen {
    const fresh = !s.isStarted && !s.isSubmitted;
    if (fresh && s.resultPending) return "pending";
    const restored = fresh && s.hasPreviousResult;
    if (!s.isStarted && !restored) return "start";
    if ((s.isSubmitted || restored) && !s.isReviewMode) return "result";
    return "questions";
}
