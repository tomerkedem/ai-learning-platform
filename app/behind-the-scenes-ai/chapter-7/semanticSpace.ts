// נתוני פרק 7: "הגיאומטריה של המשמעות".
// מרחב סמנטי לימודי דטרמיניסטי לחלוטין - אין כאן embeddings אמיתיים, מודל או רשת.
// כל מילה היא וקטור דו-ממדי קבוע (x, y), כדי שאפשר יהיה לצייר אותה במרחב.
//
// שתי הבחנות מנחות שמופיעות בכל התצוגות:
//   1. כיוון חשוב יותר ממרחק. הקרבה הסמנטית נמדדת בזווית בין הווקטורים
//      (Cosine Similarity), לא במרחק ביניהם. שתי מילים על אותו קו דרך הראשית
//      קרובות במשמעות גם אם אחת רחוקה מהראשית והשנייה קרובה.
//   2. במרחב אמיתי יש מאות או אלפי ממדים, וכאן בחרנו שניים בלבד כדי לצייר.
//      הצירים אינם "תכונות" אנושיות, הם רק במה לימודית.
//
// ── איך להרחיב ────────────────────────────────────────────────────────────
//   להוסיף מילה למפה: ערך ב-SPACE_WORDS עם x, y ו-cluster קיים.
//   להוסיף אשכול: מפתח ב-ClusterKey ועיצוב תואם ב-CLUSTER_STYLE.
//   לשנות את האנלוגיה: ערכי ANALOGY (king - man + woman = queen מחושב מהם).

/* ════════════════════════════ טיפוסי בסיס ════════════════════════════════ */

export interface Vec {
    x: number;
    y: number;
}

export type ClusterKey = 'animals' | 'vehicles' | 'food';

export interface SpaceWord extends Vec {
    he: string;
    en: string;
    cluster: ClusterKey;
}

export interface ClusterStyle {
    he: string;
    en: string;
    /** צבע ל-SVG (stroke / fill) - hex כדי לא להיות תלוי ב-Tailwind JIT בתוך אטריביוטים. */
    hex: string;
    /** מחלקות Tailwind ל-HTML (literal בלבד). */
    text: string;
    chip: string;
    dot: string;
}

/* ════════════════════════════ מרחב המילים ════════════════════════════════ */
// שלושה אשכולות, כל אחד בכיוון אחר מהראשית.
// בעלי חיים מצביעים למעלה, כלי תחבורה ימינה, מאכלים שמאלה-למעלה.
// "אריה" יושב בדיוק על הכיוון של "חתול" אבל קרוב יותר לראשית - כדי להראות
// שמרחק קצר מהראשית לא הופך מילה לרחוקה במשמעות. הכיוון הוא מה שקובע.

export const SPACE_WORDS: SpaceWord[] = [
    { he: 'חתול', en: 'Cat', x: 2, y: 8, cluster: 'animals' },
    { he: 'כלב', en: 'Dog', x: 3, y: 9, cluster: 'animals' },
    { he: 'אריה', en: 'Lion', x: 1, y: 4, cluster: 'animals' },
    { he: 'מכונית', en: 'Car', x: 9, y: -1, cluster: 'vehicles' },
    { he: 'אוטובוס', en: 'Bus', x: 8, y: 1, cluster: 'vehicles' },
    { he: 'אופניים', en: 'Bicycle', x: 9, y: -3, cluster: 'vehicles' },
    { he: 'תפוח', en: 'Apple', x: -7, y: 5, cluster: 'food' },
    { he: 'בננה', en: 'Banana', x: -8, y: 4, cluster: 'food' },
];

export const CLUSTER_STYLE: Record<ClusterKey, ClusterStyle> = {
    animals: { he: 'בעלי חיים', en: 'Animals', hex: '#34d399', text: 'text-emerald-300', chip: 'border-emerald-500/40 bg-emerald-900/15', dot: 'bg-emerald-400' },
    vehicles: { he: 'כלי תחבורה', en: 'Vehicles', hex: '#22d3ee', text: 'text-cyan-300', chip: 'border-cyan-500/40 bg-cyan-900/15', dot: 'bg-cyan-400' },
    food: { he: 'מאכלים', en: 'Food', hex: '#fb7185', text: 'text-rose-300', chip: 'border-rose-500/40 bg-rose-900/15', dot: 'bg-rose-400' },
};

/** מאתר מילה לפי הטקסט העברי. */
export function findWord(he: string): SpaceWord | undefined {
    return SPACE_WORDS.find((w) => w.he === he);
}

/* ════════════════════════════ אנלוגיית וקטורים ═══════════════════════════ */
// מלך − גבר + אישה ≈ מלכה. הקואורדינטות נבחרו כך שהמשוואה מדויקת:
// ציר אופקי = מעמד (גבר/אישה נמוך, מלך/מלכה גבוה), ציר אנכי = מגדר.
// (8,2) − (2,2) + (2,6) = (8,6), וזו בדיוק "מלכה".

export interface AnalogyWord extends Vec {
    he: string;
    en: string;
}

export const ANALOGY: Record<'man' | 'woman' | 'king' | 'queen', AnalogyWord> = {
    man: { he: 'גבר', en: 'Man', x: 2, y: 2 },
    woman: { he: 'אישה', en: 'Woman', x: 2, y: 6 },
    king: { he: 'מלך', en: 'King', x: 8, y: 2 },
    queen: { he: 'מלכה', en: 'Queen', x: 8, y: 6 },
};

/** וקטור ההפרש אישה − גבר. זהו "כיוון המגדר" שמוסיפים למלך. */
export const GENDER_SHIFT: Vec = {
    x: ANALOGY.woman.x - ANALOGY.man.x,
    y: ANALOGY.woman.y - ANALOGY.man.y,
};

/** תוצאת החישוב מלך − גבר + אישה. אמורה לנחות על "מלכה". */
export const ANALOGY_RESULT: Vec = {
    x: ANALOGY.king.x - ANALOGY.man.x + ANALOGY.woman.x,
    y: ANALOGY.king.y - ANALOGY.man.y + ANALOGY.woman.y,
};

/* ═══════════════════════ פונקציות עזר טהורות (וקטורים) ════════════════════ */

export function dot(a: Vec, b: Vec): number {
    return a.x * b.x + a.y * b.y;
}

export function magnitude(a: Vec): number {
    return Math.hypot(a.x, a.y);
}

/** Cosine Similarity: קרבת כיוון בין שני וקטורים. 1 = אותו כיוון, 0 = ניצב, -1 = הפוך. */
export function cosineSim(a: Vec, b: Vec): number {
    const m = magnitude(a) * magnitude(b);
    return m === 0 ? 0 : dot(a, b) / m;
}

/** הזווית בין שני וקטורים במעלות (0 = אותו כיוון, 180 = מנוגד). */
export function angleBetweenDeg(a: Vec, b: Vec): number {
    const c = Math.max(-1, Math.min(1, cosineSim(a, b)));
    return (Math.acos(c) * 180) / Math.PI;
}

export type ClosenessTone = 'near' | 'mid' | 'far' | 'opposite';

export interface ClosenessLabel {
    he: string;
    tone: ClosenessTone;
}

/** תרגום ערך Cosine לתווית מילולית, לטובת אינטואיציה בלי נוסחאות. */
export function closenessLabel(cos: number): ClosenessLabel {
    if (cos >= 0.85) return { he: 'אותו כיוון, קרוב מאוד', tone: 'near' };
    if (cos >= 0.5) return { he: 'כיוון דומה', tone: 'mid' };
    if (cos >= 0) return { he: 'כיוון שונה, רחוק', tone: 'far' };
    return { he: 'כיוונים מנוגדים', tone: 'opposite' };
}

export const TONE_STYLE: Record<ClosenessTone, { text: string; bar: string; chip: string }> = {
    near: { text: 'text-emerald-300', bar: 'bg-gradient-to-l from-emerald-400 to-teal-500', chip: 'border-emerald-500/40 bg-emerald-900/15' },
    mid: { text: 'text-amber-300', bar: 'bg-gradient-to-l from-amber-400 to-orange-500', chip: 'border-amber-500/40 bg-amber-900/15' },
    far: { text: 'text-slate-400', bar: 'bg-gradient-to-l from-slate-500 to-slate-600', chip: 'border-slate-600/50 bg-slate-800/40' },
    opposite: { text: 'text-rose-300', bar: 'bg-gradient-to-l from-rose-400 to-pink-500', chip: 'border-rose-500/40 bg-rose-900/15' },
};

/** מילים אחרות מדורגות לפי קרבת כיוון למילה נתונה (מהקרוב לרחוק). */
export function rankByCloseness(word: SpaceWord): { word: SpaceWord; cos: number }[] {
    return SPACE_WORDS
        .filter((w) => w.he !== word.he)
        .map((w) => ({ word: w, cos: cosineSim(word, w) }))
        .sort((a, b) => b.cos - a.cos);
}
