"use client";

// EmbeddingLookupLab - המעבדה המרכזית של פרק 4: ממילה למספרים.
// ──────────────────────────────────────────────────────────────────────────
// הרעיון המרכזי של הפרק, במספרים אמיתיים ובלי שמות משמעות:
//   מילה -> Token ID (מספר, כתובת) -> שורה בטבלת ה-embedding (רשימת מספרים) = הווקטור.
// הלומד בוחר מילה, ורואה חי איך היא הופכת למזהה מספרי ולשורה של מספרים. שני מתגים:
//   נלמד/אקראי  - למה השורה הנלמדת היא embedding ומספרים אקראיים הם רק וקטור.
//   מילים/מספרים - "מה אתם רואים" מול "מה המנוע רואה".
//
// הערכים דטרמיניסטיים (נגזרים מה-Token ID), כך שאותה מילה נותנת תמיד אותה שורה,
// והרינדור בצד השרת והלקוח זהה. אין Math.random, אין backend, אין קריאת מודל אמיתי.
// המספרים הם המחשה לימודית: וקטור אמיתי הוא מאות ממדים שאינם קריאים לאדם.
// reduced-motion: בלי אנימציות, החלפה מיידית. RTL/LTR בטוח. בלי מקף ארוך או בינוני.

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Hash, Table2, ArrowLeft, ArrowRight, Sparkles, Shuffle, GraduationCap, Eye, MousePointerClick } from 'lucide-react';

import { useT } from '@/i18n/useT';

// מבנה יציב (לא מתורגם): מזהה מילה + Token ID קבוע. הטקסט מגיע מהמילון לפי המזהה.
const WORDS = [
    { id: 'cat', tokenId: 401 },
    { id: 'dog', tokenId: 205 },
    { id: 'rain', tokenId: 618 },
    { id: 'music', tokenId: 732 },
    { id: 'book', tokenId: 94 },
    { id: 'running', tokenId: 350 },
] as const;

type WordId = (typeof WORDS)[number]['id'];

const DIMS = 12;

// ערך תא דטרמיניסטי בטווח [-1, 1], נגזר מזרע ומאינדקס. יציב בין רינדורים ובין שרת/לקוח.
function cell(seed: number, i: number): number {
    const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    return Math.round(((x - Math.floor(x)) * 2 - 1) * 100) / 100;
}

// שורת הווקטור למילה: זרע שונה ל"נלמד" מול "אקראי", כדי שהמספרים באמת יתחלפו.
function vectorFor(tokenId: number, learned: boolean): number[] {
    const seed = learned ? tokenId : tokenId + 8237;
    return Array.from({ length: DIMS }, (_, i) => cell(seed, i));
}

const fmt = (n: number) => (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2));

interface EmbeddingLookupLabProps {
    dir?: 'rtl' | 'ltr';
    /** מספר המעבדה בפרק (מוצג כתג ליד הכותרת). לא מוצג אם לא הועבר. */
    labNumber?: number;
}

export const EmbeddingLookupLab: React.FC<EmbeddingLookupLabProps> = ({ dir = 'rtl', labNumber }) => {
    const { t } = useT();
    const c = t.behindAi.chapter4.embeddingLookup;
    const reduce = useReducedMotion();

    const [wordId, setWordId] = useState<WordId>('cat');
    const [learned, setLearned] = useState(true);

    const active = WORDS.find((w) => w.id === wordId) ?? WORDS[0];
    const vector = vectorFor(active.tokenId, learned);
    const label = (id: WordId) => c.words[id];

    // צבע תא לפי סימן: חיובי ציאן, שלילי סגול. עוצמה לפי גודל. שפה חזותית עדינה, עדיין מספרים.
    // Dark: אותם ערכי rgba כמו קודם. Light: אותם גוונים במדרגה כהה (cyan-600/violet-600), עוצמת המילוי מוגברת,
    // והטקסט כהה (אותו מנגנון של --bts-ink-darken).
    const mix = (dark: string, light: string, pct: number, boost = 0) =>
        `color-mix(in oklab, color-mix(in oklab, ${light} var(--bts-tint-mix), ${dark}) calc(${pct}% + var(--bts-tint-mix) * ${pct * boost}), transparent)`;
    const ink = (hex: string) => `color-mix(in oklab, ${hex} calc(100% - var(--bts-ink-darken)), black)`;
    const cellStyle = (n: number) => {
        const mag = Math.min(1, Math.abs(n));
        const [dark, light, text] = n >= 0 ? ['#22d3ee', '#0891b2', '#a5f3fc'] : ['#a78bfa', '#7c3aed', '#ddd6fe'];
        return {
            border: `1px solid ${mix(dark, light, (0.25 + mag * 0.5) * 100)}`,
            background: mix(dark, light, (0.05 + mag * 0.12) * 100, 0.006),
            color: ink(text),
        };
    };

    return (
        <div dir={dir} className="rounded-[2rem] border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 backdrop-blur-xl sm:p-7 text-start">
            {/* כותרת ומבוא */}
            <div className="mb-5 flex items-start gap-3">
                {labNumber != null && (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_50%,transparent)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(60%_+_var(--bts-tint-mix)_*_0.4),transparent)] font-mono text-sm font-black text-[var(--bts-text-body)]">
                        {labNumber}
                    </span>
                )}
                <div>
                    <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                        <Table2 size={14} /> {c.eyebrow}
                    </span>
                    <h3 className="text-xl font-black text-[var(--bts-text-primary)] md:text-2xl">{c.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--bts-text-muted)]">{c.intro}</p>
                </div>
            </div>

            {/* בורר מילה: הצ'יפים תמיד מילים, כדי שהתווית "בחרו מילה" תהיה תמיד נכונה */}
            <div className="mb-5">
                <div className="mb-2 text-[13px] font-bold uppercase tracking-wide text-[var(--bts-text-muted)]">{c.pickWord}</div>
                <div className="flex flex-wrap gap-2">
                    {WORDS.map((w) => {
                        const isActive = w.id === wordId;
                        return (
                            <button
                                key={w.id}
                                type="button"
                                onClick={() => setWordId(w.id)}
                                aria-pressed={isActive}
                                // יעד מגע מלא (44px) וטקסט קריא. המצב הנבחר מועבר גם במשקל הגופן
                                // ובמסגרת, ולא בצבע בלבד, בנוסף ל-aria-pressed.
                                className={`inline-flex min-h-[44px] items-center rounded-xl border px-3.5 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))] ${
                                    isActive
                                        ? 'border-cyan-400 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)] font-black text-cyan-100'
                                        : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(30%_+_var(--bts-tint-mix)_*_0.7),transparent)] font-medium text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                            >
                                {label(w.id)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* בחירת מילה משנה את ה-Token ID ואת הווקטור. בלי הכרזה, משתמש קורא מסך לוחץ
                ולא שומע דבר. הודעה אחת תמציתית: המילה, הכתובת שלה, ושהשורה הנלמדת מוצגת.
                לא מוקראים ערכי התאים. אין הזזת פוקוס. */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {`${label(active.id)}, Token ID ${active.tokenId}. ${c.rowShown}`}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {/* שמאל: זרימת מילה -> Token ID -> שורה בטבלה */}
                <div className="space-y-4">
                    {/* מילה -> Token ID */}
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4">
                        <div className="text-center">
                            <div className="text-[13px] font-bold uppercase tracking-wide text-[var(--bts-text-faint)]">{c.pickWord}</div>
                            <div className="mt-1 text-lg font-black text-[var(--bts-text-primary)]">{label(active.id)}</div>
                        </div>
                        {dir === 'rtl' ? <ArrowLeft size={20} className="shrink-0 text-[var(--bts-text-faint)]" /> : <ArrowRight size={20} className="shrink-0 text-[var(--bts-text-faint)]" />}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[13px] font-bold uppercase tracking-wide text-cyan-400">
                                <Hash size={11} /> Token ID
                            </div>
                            <div className="mt-1 font-mono text-2xl font-black text-cyan-200" dir="ltr">{active.tokenId}</div>
                            <div className="mt-0.5 text-[13px] text-[var(--bts-text-faint)]">{c.idNote}</div>
                        </div>
                    </div>

                    {/* טבלת ה-embedding: שורה לכל טוקן, הנבחרת זוהרת */}
                    <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4">
                        <div className="mb-1 flex items-center gap-2">
                            <Table2 size={15} className="text-cyan-300" />
                            <span className="text-[13px] font-bold text-[var(--bts-text-bright)]">{c.tableTitle}</span>
                        </div>
                        <p className="mb-3 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{c.tableHint}</p>
                        {/* כותרות עמודות: מבהירות שהמספר הבודד הוא ה-Token ID (כתובת השורה), והשאר הם הווקטור.
                            13px (רצפת הגופן להקרנה) עם tracking צר יותר, כדי ש-Token ID עדיין נכנס בעמודה. */}
                        <div className="mb-2 grid grid-cols-[4.75rem_1fr] items-center gap-3 px-2.5 text-[13px] font-bold uppercase tracking-wide text-[var(--bts-text-faint)]">
                            <span className="inline-flex items-center gap-1" dir="ltr"><Hash size={11} /> Token ID</span>
                            <span>{c.vectorTitle}</span>
                        </div>
                        <div className="space-y-1.5">
                            {WORDS.map((w) => {
                                const isActive = w.id === wordId;
                                const preview = vectorFor(w.tokenId, learned).slice(0, 4);
                                return (
                                    <button
                                        key={w.id}
                                        type="button"
                                        onClick={() => setWordId(w.id)}
                                        // שורות הטבלה הן בורר מילה שני לאותו מצב, ולכן הן חושפות
                                        // גם הן aria-pressed. יעד מגע מלא וטבעת פוקוס נראית.
                                        aria-pressed={isActive}
                                        className={`grid min-h-[44px] w-full grid-cols-[4.75rem_1fr] items-center gap-3 rounded-lg border px-2.5 py-1.5 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))] ${
                                            isActive ? 'border-cyan-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)]' : 'border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-700))_40%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-from)_30%,transparent)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))] opacity-70'
                                        }`}
                                    >
                                        <span className={`inline-flex items-center gap-0.5 font-mono text-sm font-black ${isActive ? 'text-cyan-200' : 'text-[var(--bts-text-muted)]'}`} dir="ltr">
                                            <Hash size={11} className="opacity-60" />{w.tokenId}
                                        </span>
                                        <span className="flex flex-wrap gap-x-1.5 gap-y-0.5 font-mono text-[13px]" dir="ltr">
                                            {preview.map((n, i) => (
                                                <span key={i} className={isActive ? 'text-[var(--bts-text-body)]' : 'text-[var(--bts-text-subtle)]'}>{fmt(n)}</span>
                                            ))}
                                            <span className={isActive ? 'text-[var(--bts-text-faint)]' : 'text-[color-mix(in_oklab,var(--bts-text-subtle)_var(--bts-tint-mix),var(--color-slate-700))]'}>...</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ימין: הווקטור המלא כשורת מספרים + מתג נלמד/אקראי */}
                <div className="flex flex-col rounded-2xl border border-violet-500/30 bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Sparkles size={15} className="text-violet-300" />
                            <span className="text-[13px] font-bold text-[var(--bts-text-bright)]">{c.vectorTitle}</span>
                            <span className="font-mono text-[13px] text-[var(--bts-text-faint)]" dir="ltr">#{active.tokenId}</span>
                        </div>
                        {/* מתג נלמד / אקראי: זה הרגע המרכזי של המעבדה, ולכן יעד מגע מלא (44px)
                            וטקסט בגודל קריא. המצב הפעיל מסומן גם בטקסט (aria-pressed) ולא בצבע בלבד. */}
                        <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_80%,transparent)] p-1">
                            {([['learned', c.learnedLabel, GraduationCap], ['random', c.randomLabel, Shuffle]] as const).map(([key, lbl, Icon]) => {
                                const on = (key === 'learned') === learned;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setLearned(key === 'learned')}
                                        aria-pressed={on}
                                        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))] ${
                                            on ? (key === 'learned' ? 'bg-emerald-500/25 text-emerald-100' : 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-strong)_var(--bts-tint-mix),var(--color-slate-600))_calc(40%_+_var(--bts-tint-mix)_*_0.6),transparent)] text-[var(--bts-text-bright)]') : 'text-[var(--bts-text-muted)] hover:text-[var(--bts-text-body)]'
                                        }`}
                                    >
                                        <Icon size={14} /> {lbl}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ההזמנה להשוות: בלי זה המתג נקרא כתג משני, והלומד עלול לסיים את המעבדה
                        בלי לגעת ברעיון המרכזי שלה. הוראה אחת, צמודה למתג. */}
                    <p className="mb-3 flex items-start gap-1.5 text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">
                        <MousePointerClick size={15} className="mt-0.5 shrink-0 text-violet-300" />
                        {c.switchHint}
                    </p>

                    {/* שורת המספרים: 12 תאים. מתחלפת בהחלפת מילה או מצב. */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${wordId}-${learned}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -6 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.22 }}
                            className="grid grid-cols-4 gap-1.5 sm:grid-cols-6"
                            dir="ltr"
                        >
                            {vector.map((n, i) => (
                                <span
                                    key={i}
                                    className="flex items-center justify-center rounded-lg py-2 font-mono text-[13px] font-bold tabular-nums"
                                    style={cellStyle(n)}
                                >
                                    {fmt(n)}
                                </span>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <p className="mt-3 text-[12px] leading-relaxed text-[var(--bts-text-muted)]">{c.vectorNote}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold leading-relaxed text-violet-200/90">
                        <Eye size={13} className="shrink-0" /> {c.viewNote}
                    </p>

                    {/* הערת נלמד / אקראי: הלב של "כל embedding הוא וקטור, לא כל וקטור הוא embedding".
                        aria-live מכריז את משמעות המצב הפעיל בכל החלפה מכוונת (הודעה אחת, לא כל תא
                        בווקטור). אין הזזת פוקוס ואין אודיו. */}
                    <div
                        aria-live="polite"
                        aria-atomic="true"
                        className={`mt-3 rounded-xl border p-3 text-[15px] font-semibold leading-relaxed ${
                            learned ? 'border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-100' : 'border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] text-amber-100'
                        }`}
                    >
                        {learned ? c.learnedNote : c.randomNote}
                    </div>
                </div>
            </div>

            {/* הבהרה: המספרים להמחשה, וקטור אמיתי הוא מאות ממדים לא קריאים */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{c.disclaimer}</p>
        </div>
    );
};
