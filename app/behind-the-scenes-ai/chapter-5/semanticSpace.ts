// נתוני פרק 5: "Semantic Space: מפת המשמעות של המודל".
// מרחב סמנטי לימודי דטרמיניסטי לחלוטין. אין כאן embeddings אמיתיים, מודל או רשת.
// כל משפט מעולם החבילות והמשלוחים הוא נקודה קבועה (x, y) במישור, כדי שאפשר יהיה
// לצייר אותו ולמדוד קרבה בעיניים.
//
// שתי הבחנות מנחות:
//   1. קרבה במרחב = קרבה במשמעות. משפטים שהמודל רואה כקשורים יושבים קרוב זה לזה,
//      גם כשהמילים שונות ("החבילה לא הגיעה" קרוב ל"המשלוח מתעכב"). משפטים לא קשורים
//      רחוקים (מתכון, מזג אוויר).
//   2. קרבה אינה אמת. שני משפטים יכולים לחלוק כמעט את אותן מילים ולשבת קרוב, אבל
//      להיות הפוכים במשמעות בגלל שלילה ("החבילה הגיעה" מול "החבילה לא הגיעה").
//
// חלוקת אחריות i18n: כאן חי רק המבנה (מזהים, קואורדינטות, אשכולות, צבעי hex). טקסט
// המשפטים ושמות האשכולות מגיעים מהמילון לפי מזהה (semanticSpaceLab), כדי שיתורגם.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   להוסיף משפט: מזהה ב-PhraseId, רשומה ב-PHRASES עם x, y ו-cluster קיים, וטקסט
//   תואם במילון semanticSpaceLab.phrases[id] בכל השפות.
//   להוסיף אשכול: מפתח ב-ClusterKey, צבע ב-CLUSTER_HEX ומחלקות ב-CLUSTER_STYLE,
//   ושם תצוגה במילון semanticSpaceLab.clusters[key].

/* ════════════════════════════ טיפוסי בסיס ════════════════════════════════ */

export interface Vec {
    x: number;
    y: number;
}

/** מזהי המשפטים במרחב. מפתחות פנימיים יציבים, לא מתורגמים. */
export type PhraseId =
    | 'not-arrived'
    | 'customer-waiting'
    | 'not-received'
    | 'delayed'
    | 'status-not-updated'
    | 'courier-on-way'
    | 'arrived'
    | 'center-checking'
    | 'agent-contacted'
    | 'draft-update'
    | 'recipe'
    | 'weather';

/** ארבעה אזורי משמעות במרחב. */
export type ClusterKey = 'complaint' | 'status' | 'action' | 'unrelated';

export interface Phrase extends Vec {
    id: PhraseId;
    cluster: ClusterKey;
}

/* ════════════════════════════ מרחב המשפטים ════════════════════════════════ */
// אזור התלונה (שמאל-מעלה), אזור הסטטוס נוגע בו (כי "מתעכב" קרוב במשמעות ל"לא הגיעה"),
// אזור הפעולה למטה-ימין, והלא-קשורים מבודדים רחוק למטה-שמאל.
// "המשלוח מתעכב" הוא השכן הקרוב ביותר ל"החבילה לא הגיעה": משמעות דומה, מילים שונות.
// "החבילה הגיעה" יושב במרחק בינוני, לא צמוד: הוא חולק מילים אך מהפך את המשמעות, ולכן
// אינו יושב באזור התלונה. מלכודת השלילה (מילים כמעט זהות, משמעות הפוכה) מודגמת בנפרד
// בניסוי השלילה, ולא במפה הראשית, כדי שרשימת השכנים הראשית תלמד רק את הכלל הבסיסי.

export const PHRASES: Phrase[] = [
    // תלונה / לקוח מחכה
    { id: 'not-arrived', x: -4, y: 6, cluster: 'complaint' },
    { id: 'customer-waiting', x: -5.5, y: 7.5, cluster: 'complaint' },
    { id: 'not-received', x: -3, y: 7.5, cluster: 'complaint' },
    // סטטוס משלוח. "מתעכב" צמוד לעוגן התלונה (השכן הקרוב ביותר); "הגיעה" מרוחק ממנו,
    // סמוך יותר לסטטוסים הנייטרליים (לא עודכן, בדרך אליכם) כי משמעותו הפוכה מהתלונה.
    { id: 'delayed', x: -2.7, y: 5.2, cluster: 'status' },
    { id: 'status-not-updated', x: 0, y: 6, cluster: 'status' },
    { id: 'courier-on-way', x: 2.5, y: 6.5, cluster: 'status' },
    { id: 'arrived', x: 0, y: 3, cluster: 'status' },
    // פעולת שירות
    { id: 'center-checking', x: 4, y: -3, cluster: 'action' },
    { id: 'agent-contacted', x: 5.5, y: -1.5, cluster: 'action' },
    { id: 'draft-update', x: 6, y: -4, cluster: 'action' },
    // לא קשור
    { id: 'recipe', x: -8, y: -7, cluster: 'unrelated' },
    { id: 'weather', x: -9, y: -4.5, cluster: 'unrelated' },
];

/** המשפט העוגן של הפרק, שממנו יוצא ניחוש הפתיחה והמעבדה. */
export const ANCHOR_ID: PhraseId = 'not-arrived';

/** זוג השלילה: אותן מילים כמעט, משמעות הפוכה. משמש בניסוי "קרבה אינה אמת". */
export const NEGATION_PAIR: { base: PhraseId; opposite: PhraseId } = {
    base: 'not-arrived',
    opposite: 'arrived',
};

/* ════════════════════════════ עיצוב אשכולות ══════════════════════════════ */
// hex ל-SVG (לא תלוי ב-Tailwind JIT בתוך אטריביוטים). מחלקות literal ל-HTML.

export const CLUSTER_HEX: Record<ClusterKey, string> = {
    complaint: '#fb7185',
    status: '#22d3ee',
    action: '#a78bfa',
    unrelated: '#64748b',
};

export interface ClusterStyle {
    hex: string;
    text: string;
    chip: string;
    dot: string;
}

export const CLUSTER_STYLE: Record<ClusterKey, ClusterStyle> = {
    complaint: { hex: '#fb7185', text: 'text-rose-300', chip: 'border-rose-500/40 bg-rose-900/15', dot: 'bg-rose-400' },
    status: { hex: '#22d3ee', text: 'text-cyan-300', chip: 'border-cyan-500/40 bg-cyan-900/15', dot: 'bg-cyan-400' },
    action: { hex: '#a78bfa', text: 'text-violet-300', chip: 'border-violet-500/40 bg-violet-900/15', dot: 'bg-violet-400' },
    unrelated: { hex: '#94a3b8', text: 'text-slate-400', chip: 'border-slate-600/50 bg-slate-800/40', dot: 'bg-slate-500' },
};

/* ═══════════════════════ פונקציות עזר טהורות (מרחק) ═══════════════════════ */

/** מרחק אוקלידי בין שתי נקודות. במרחב הזה, קטן יותר = קרוב יותר במשמעות. */
export function distance(a: Vec, b: Vec): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

/** אורך אלכסון ייחוס לנרמול מרחק לערך קרבה 0..1 (המישור נע בערך ב-[-10,10]). */
const REF_SPAN = 15;

/** ממיר מרחק לערך קרבה 0..1 (1 = חופפים, 0 = רחוקים מאוד). לתצוגת מד/בר בלבד. */
export function closeness(dist: number): number {
    return Math.max(0, Math.min(1, 1 - dist / REF_SPAN));
}

export type ClosenessTone = 'near' | 'mid' | 'far';

/** תרגום מרחק לתווית גוון, לטובת אינטואיציה בלי מספרים. */
export function closenessTone(dist: number): ClosenessTone {
    if (dist <= 3) return 'near';
    if (dist <= 7) return 'mid';
    return 'far';
}

export const TONE_STYLE: Record<ClosenessTone, { text: string; bar: string; chip: string }> = {
    near: { text: 'text-emerald-300', bar: 'bg-gradient-to-l from-emerald-400 to-teal-500', chip: 'border-emerald-500/40 bg-emerald-900/15' },
    mid: { text: 'text-amber-300', bar: 'bg-gradient-to-l from-amber-400 to-orange-500', chip: 'border-amber-500/40 bg-amber-900/15' },
    far: { text: 'text-slate-400', bar: 'bg-gradient-to-l from-slate-500 to-slate-600', chip: 'border-slate-600/50 bg-slate-800/40' },
};

/** מאתר משפט לפי מזהה. */
export function findPhrase(id: PhraseId): Phrase | undefined {
    return PHRASES.find((p) => p.id === id);
}

/**
 * ממיר מרחק לציון תצוגה שלם 0..100 (100 = חופפים, 0 = רחוקים מאוד).
 * נגזר מאותו מרחק ששימש למיון, ולכן ציון, דירוג ומרחק לעולם אינם סותרים זה את זה.
 * דטרמיניסטי, מונוטוני, חסום ל-0..100, ואינו תלוי בגודל המסך או בכיווניות: הוא פועל
 * על קואורדינטות לוגיות בלבד.
 */
export function proximityScore(dist: number): number {
    return Math.round(closeness(dist) * 100);
}

/**
 * מדרג את שאר המשפטים לפי קרבה למשפט הפעיל, מהקרוב לרחוק, על סמך הקואורדינטות הקבועות
 * של המשפטים (PHRASES).
 *
 * הנקודות אינן ניתנות להזזה, ולכן לפונקציה אין פרמטר קואורדינטות ואי אפשר להזין מיקום
 * שנקבע ע"י המשתמש: רק הבחירה (activeId) משנה את המשפט הפעיל, לא את מיקומו. כך הדירוג
 * תמיד נגזר מהמרחקים הלימודיים המקוריים בלבד, ואינטראקציה לא יכולה לזייף קרבה.
 *
 * שובר שוויון יציב לפי מזהה: כששני מרחקים זהים, הסדר נקבע לפי המזהה ולא לפי יציבות
 * המיון של המנוע, כדי שהתוצאה תהיה דטרמיניסטית לחלוטין.
 */
export function rankNeighbors(activeId: PhraseId): { phrase: Phrase; dist: number }[] {
    const from = findPhrase(activeId);
    if (!from) return [];
    return PHRASES.filter((p) => p.id !== activeId)
        .map((p) => ({ phrase: p, dist: distance(from, p) }))
        .sort((a, b) => a.dist - b.dist || (a.phrase.id < b.phrase.id ? -1 : 1));
}
