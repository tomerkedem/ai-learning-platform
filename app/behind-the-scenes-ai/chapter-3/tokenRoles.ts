// מפת התפקידים הקבועה של הטוקנייזר הלימודי (Token Color Map) - פרק 3.
// זוהי טבלה דטרמיניסטית: כל מילה ידועה מקבלת תפקיד קבוע, וכל תפקיד מקבל צבע
// קבוע שנשמר בכל התצוגות (Stream, Color Map, Hebrew Lab, Count).
//
// חשוב: זהו טוקנייזר לימודי. מודלים אמיתיים מפרקים לפי סטטיסטיקה ולא לפי
// תפקיד לשוני. הצביעה כאן היא עזר לימודי בלבד.
//
// ── איך להרחיב ──────────────────────────────────────────────────────────
// כדי להוסיף תפקיד: הוסיפו ערך ל-TokenRole, סגנון ב-ROLE_STYLE, ותיאור
// ב-ROLE_INFO. כדי להוסיף מילה: הוסיפו שורה ל-WORD_ROLES (מילה -> תפקיד).
// מילה שלא נמצאת בטבלה מקבלת תפקיד fallback 'other'.

/** תפקידי הטוקנים. קבוצה סגורה כדי לשמור על מחלקות Tailwind סטטיות. */
export type TokenRole =
    | 'object'
    | 'negation'
    | 'action'
    | 'action-signal'
    | 'context'
    | 'system'
    | 'recipient'
    | 'question-signal'
    | 'statement-signal'
    | 'number'
    | 'noise'
    | 'other';

export interface RoleStyle {
    border: string;
    text: string;
    bg: string;
    dot: string;
}

/** פלטה נפרדת אך תואמת לפלטת הפרקים הקודמים. מחלקות literal בלבד. */
export const ROLE_STYLE: Record<TokenRole, RoleStyle> = {
    object: { border: 'border-blue-500/45', text: 'text-blue-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-blue-900)] [--t-l:var(--color-blue-500)]', dot: 'bg-blue-400' },
    negation: { border: 'border-rose-500/45', text: 'text-rose-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-rose-900)] [--t-l:var(--color-rose-500)]', dot: 'bg-rose-400' },
    action: { border: 'border-emerald-500/45', text: 'text-emerald-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)]', dot: 'bg-emerald-400' },
    'action-signal': { border: 'border-violet-500/55', text: 'text-violet-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)]', dot: 'bg-violet-400' },
    context: { border: 'border-cyan-500/45', text: 'text-cyan-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)]', dot: 'bg-cyan-400' },
    system: { border: 'border-indigo-500/45', text: 'text-indigo-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-indigo-900)] [--t-l:var(--color-indigo-500)]', dot: 'bg-indigo-400' },
    recipient: { border: 'border-amber-500/45', text: 'text-amber-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)]', dot: 'bg-amber-400' },
    'question-signal': { border: 'border-fuchsia-500/45', text: 'text-fuchsia-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-fuchsia-900)] [--t-l:var(--color-fuchsia-500)]', dot: 'bg-fuchsia-400' },
    'statement-signal': { border: 'border-teal-500/45', text: 'text-teal-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-teal-900)] [--t-l:var(--color-teal-500)]', dot: 'bg-teal-400' },
    number: { border: 'border-lime-500/45', text: 'text-lime-300', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-lime-900)] [--t-l:var(--color-lime-500)]', dot: 'bg-lime-400' },
    noise: { border: 'border-slate-500/45', text: 'text-[var(--bts-text-secondary)]', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-700))_calc(30%_+_var(--bts-tint-mix)_*_0.7),transparent)]', dot: 'bg-slate-400' },
    other: { border: 'border-slate-600/50', text: 'text-[var(--bts-text-secondary)]', bg: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(40%_+_var(--bts-tint-mix)_*_0.6),transparent)]', dot: 'bg-slate-500' },
};

export interface RoleInfo {
    he: string;
    en: string;
    /** למה התפקיד הזה חשוב (עברית) - מוצג בכרטיס הנפתח. */
    whyHe: string;
}

export const ROLE_INFO: Record<TokenRole, RoleInfo> = {
    object: { he: 'אובייקט', en: 'Object', whyHe: 'זה הדבר שהמשפט מדבר עליו. התווית מסמנת על מה מדובר, עוד לפני שמעבדים את שאר המשפט.' },
    negation: { he: 'שלילה', en: 'Negation', whyHe: 'המילה הזאת יכולה להפוך את כיוון המשפט. בלעדיה המשמעות הפוכה לגמרי.' },
    action: { he: 'פעולה', en: 'Action', whyHe: 'מה קרה לאובייקט. הפועל קובע את מצב הדברים בפועל.' },
    'action-signal': { he: 'אות פעולה', en: 'Action signal', whyHe: 'המילה הזאת מסיטה את הקלט ממשפט תיאורי לבקשת פעולה. היא משנה את כל המסלול.' },
    context: { he: 'הקשר', en: 'Context / Location', whyHe: 'מוסיף מיקום או הקשר שעוזר לדייק את התמונה, למשל לאן החבילה הייתה אמורה להגיע.' },
    system: { he: 'מערכת', en: 'System', whyHe: 'מצביע על המערכת עצמה ולא על החבילה. אותו תחום, אבל כיוון אחר לגמרי.' },
    recipient: { he: 'נמען', en: 'Recipient', whyHe: 'מי מקבל את הפעולה. רלוונטי במיוחד כשמדובר בפעולה כלפי אדם אמיתי.' },
    'question-signal': { he: 'סימן שאלה', en: 'Question signal', whyHe: 'סימן השאלה הוא token בפני עצמו. הוא משנה את הצורה של המשפט משאלה לקביעה.' },
    'statement-signal': { he: 'סימן קביעה', en: 'Statement signal', whyHe: 'הנקודה היא token נפרד שמסמן סוף קביעה. גם הפיסוק נחשב יחידת עבודה.' },
    number: { he: 'מספר', en: 'Number', whyHe: 'רצף ספרות הוא יחידה בפני עצמה. מספר מעקב, למשל, יכול להפוך בקשה כללית למשהו שאפשר לבדוק.' },
    noise: { he: 'רעש', en: 'Noise', whyHe: 'מילה כללית שמוסיפה מעט מאוד מידע. עדיין הופכת ל-token, גם אם משקלה נמוך.' },
    other: { he: 'כללי', en: 'Token', whyHe: 'מילה שלא מופתה לתפקיד מיוחד בטוקנייזר הלימודי הזה. עדיין נספרת כיחידת עבודה.' },
};

/** מפת מילה -> תפקיד. ניתנת להחלפה לפי שפה (locale-aware), עם ברירת מחדל עברית. */
export type RoleWordMap = Record<string, TokenRole>;

/** מילה -> תפקיד. טבלה דטרמיניסטית קבועה (ברירת המחדל העברית). */
export const WORD_ROLES: RoleWordMap = {
    // Object
    'החבילה': 'object', 'חבילה': 'object', 'המשלוח': 'object', 'משלוח': 'object',
    // Negation
    'לא': 'negation', 'אין': 'negation', 'בלי': 'negation', 'אינו': 'negation',
    // Action
    'הגיעה': 'action', 'נמסרה': 'action', 'להגיע': 'action',
    // Action signal
    'בדוק': 'action-signal', 'תבדוק': 'action-signal', 'בדקי': 'action-signal',
    // Context / Location
    'למרכז': 'context', 'במרכז': 'context', 'המיון': 'context', 'מרכז': 'context',
    // System
    'המערכת': 'system', 'מערכת': 'system',
    // Recipient
    'ללקוח': 'recipient', 'לקוח': 'recipient',
    // Noise
    'אולי': 'noise', 'קצת': 'noise', 'משהו': 'noise',
};

/**
 * התפקיד של מילה (ברירת מחדל 'other' אם לא בטבלה).
 * מקבל מפת תפקידים אופציונלית כדי לאפשר זיהוי לפי שפה; ללא ארגומנט נשמרת
 * ההתנהגות העברית הקיימת.
 */
export function roleForWord(word: string, map: RoleWordMap = WORD_ROLES): TokenRole {
    return map[word] ?? 'other';
}

/** רשימת התפקידים להצגה במקרא (Color Map), בסדר לימודי. */
export const ROLE_ORDER: TokenRole[] = [
    'object', 'negation', 'action', 'action-signal', 'context',
    'system', 'recipient', 'question-signal', 'statement-signal', 'number', 'noise',
];
