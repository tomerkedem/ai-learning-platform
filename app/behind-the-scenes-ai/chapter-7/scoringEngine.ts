// מנוע החישוב של פרק 7: "דמיון, ציונים והסתברויות".
// קובץ טהור לחלוטין: אין כאן React, אין נתוני תוכן, אין קריאת רשת. רק
// המתמטיקה של השרשרת, דטרמיניסטית וניתנת לבדיקה:
//   Sentence Vector -> Cosine Similarity -> Raw Score -> Softmax -> Probabilities
//
// כל הפונקציות כאן גנריות ומקבלות את הנתונים (וקטורים, טבלאות, משקלים,
// temperature) מבחוץ. מקור האמת היחיד למספרים שעל המסך הוא הפונקציות האלה.
// כל מספר שמוצג מחושב חי, אף ערך אינו מקודד קשיח.

export type Vector = number[];

export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

/* ─────────────────────────── אלגברה לינארית ─────────────────────────────── */

export function dot(a: Vector, b: Vector): number {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
}

export function norm(a: Vector): number {
    return Math.sqrt(dot(a, a));
}

/**
 * Cosine Similarity אמיתי: dot(a,b) / (|a| * |b|).
 * הערך נע בין -1 ל-1. אורתוגונליות נותנת 0, וקטור אפס נותן 0.
 * זהו מדד כיוון, לא הסתברות.
 */
export function cosineSimilarity(a: Vector, b: Vector): number {
    const na = norm(a);
    const nb = norm(b);
    if (na === 0 || nb === 0) return 0;
    return dot(a, b) / (na * nb);
}

/* ─────────────────────────── טוקניזציה פשוטה ────────────────────────────── */

const PUNCT = /[?.!,;:"'()]/g;

/** מפצל טקסט למילים, מקלף פיסוק. דטרמיניסטי. */
export function tokenize(text: string): string[] {
    return text
        .replace(PUNCT, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

/** האם הטקסט המקורי מכיל סימן שאלה (אות לשאלת מעקב). */
export function hasQuestionMark(text: string): boolean {
    return text.includes('?');
}

/* ─────────────────────── בניית וקטור המשפט ────────────────────────────── */

/**
 * Sentence Vector = clamp01(sum of token contributions).
 * אותו רעיון כמו פרק 6: כל token תורם וקטור חלקי, והמשפט הוא הסכום.
 */
export function buildVector(tokens: string[], tokenVectors: Record<string, Vector>, dimCount: number): Vector {
    const v = new Array(dimCount).fill(0);
    for (const t of tokens) {
        const c = tokenVectors[t];
        if (c) for (let i = 0; i < dimCount; i++) v[i] += c[i];
    }
    return v.map(clamp01);
}

/* ─────────────────────── אותות מילוליים (word_impact / context_bonus) ──── */

/** סכום משקלי המילים הבודדות שתואמות לכוונה (word_impact). מוגבל ל-[0,1]. */
export function unigramSignal(tokens: string[], table: Record<string, number>): number {
    let s = 0;
    for (const t of tokens) if (table[t]) s += table[t];
    return clamp01(s);
}

/** סכום משקלי הצמדים (bigrams) שתואמים לכוונה (context_bonus). מוגבל ל-[0,1]. */
export function bigramSignal(tokens: string[], table: Record<string, number>): number {
    let s = 0;
    for (let i = 0; i < tokens.length - 1; i++) {
        const key = `${tokens[i]} ${tokens[i + 1]}`;
        if (table[key]) s += table[key];
    }
    return clamp01(s);
}

/* ─────────────────────────────── Softmax ────────────────────────────────── */

/**
 * Softmax עם temperature: p_i = exp(score_i / T) / sum_j exp(score_j / T).
 * T גבוה משטח את ההתפלגות, T נמוך מחדד אותה. מחוסר ע"י החסרת המקסימום
 * (יציבות נומרית, לא משנה את התוצאה). מחזיר התפלגות שסכומה 1.
 */
export function softmax(scores: number[], temperature: number): number[] {
    if (scores.length === 0) return [];
    const T = temperature > 0 ? temperature : 1e-6;
    const max = Math.max(...scores);
    const exps = scores.map((s) => Math.exp((s - max) / T));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
}

/* ─────────────────────────── ביטחון מתוך הפער ───────────────────────────── */

export type ConfidenceLevel = 'High' | 'Medium' | 'Medium-low' | 'Low';

/**
 * רמת ביטחון נגזרת מהפער (margin) בין ההסתברות הראשונה לשנייה, באחוזים.
 * פער גדול = החלטה ברורה, פער קטן = שתי אפשרויות קרובות.
 */
export function confidenceFromMargin(marginPct: number): ConfidenceLevel {
    if (marginPct >= 40) return 'High';
    if (marginPct >= 22) return 'Medium';
    if (marginPct >= 10) return 'Medium-low';
    return 'Low';
}

/* ─────────────────────── הרכבת ציון והתפלגות ────────────────────────────── */

/** רכיב בודד בפירוק הציון (עמודה ב-Raw Score Table). */
export interface ScoreTerm {
    key: string;
    value: number;   // הערך הגולמי (0..1)
    weight: number;  // המשקל (w1/w2/w3)
}

/** ציון גולמי = סכום (value * weight) על כל הרכיבים. */
export function rawScore(terms: ScoreTerm[]): number {
    return terms.reduce((s, t) => s + t.value * t.weight, 0);
}

/**
 * מקבל רשימת ציונים גולמיים ו-temperature, ומחזיר הסתברויות (Softmax)
 * יחד עם אינדקס המוביל והפער. נקודת האיחוד של כל השרשרת.
 */
export function toDistribution(scores: number[], temperature: number): {
    probs: number[];
    leaderIndex: number;
    marginPct: number;
} {
    const probs = softmax(scores, temperature);
    let leaderIndex = 0;
    for (let i = 1; i < probs.length; i++) if (probs[i] > probs[leaderIndex]) leaderIndex = i;
    const sorted = [...probs].sort((a, b) => b - a);
    const marginPct = ((sorted[0] ?? 0) - (sorted[1] ?? 0)) * 100;
    return { probs, leaderIndex, marginPct };
}
