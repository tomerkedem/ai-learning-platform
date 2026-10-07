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

export type OptionVerdictKey = "yourAnswer" | "verdictCorrect" | "verdictWrong";

/**
 * מה קורא המסך שומע על אפשרות, אחרי שם האפשרות, כשהתוצאה מוצגת: "התשובה שלך" לאפשרות שנבחרה, ופסק
 * הדין לאפשרות הנכונה ולבחירה השגויה. חזותית זה עובר בצבע, במסגרת ובאייקון בלבד. לפני מענה: ריק.
 */
export function optionVerdict(s: { showResult: boolean; isSelected: boolean; isCorrect: boolean }): OptionVerdictKey[] {
    if (!s.showResult) return [];
    const keys: OptionVerdictKey[] = s.isSelected ? ["yourAnswer"] : [];
    if (s.isCorrect) keys.push("verdictCorrect");
    else if (s.isSelected) keys.push("verdictWrong");
    return keys;
}
