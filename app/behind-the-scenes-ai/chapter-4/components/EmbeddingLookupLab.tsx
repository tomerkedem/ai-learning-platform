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
    { id: 'pkg', tokenId: 1042 },
    { id: 'not', tokenId: 17 },
    { id: 'arrived', tokenId: 883 },
    { id: 'shipment', tokenId: 1057 },
    { id: 'lost', tokenId: 770 },
    { id: 'tracking', tokenId: 305 },
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

    const [wordId, setWordId] = useState<WordId>('pkg');
    const [learned, setLearned] = useState(true);

    const active = WORDS.find((w) => w.id === wordId) ?? WORDS[0];
    const vector = vectorFor(active.tokenId, learned);
    const label = (id: WordId) => c.words[id];

    // צבע תא לפי סימן: חיובי ציאן, שלילי סגול. עוצמה לפי גודל. שפה חזותית עדינה, עדיין מספרים.
    const cellStyle = (n: number) => {
        const mag = Math.min(1, Math.abs(n));
        return n >= 0
            ? { border: `1px solid rgba(34,211,238,${0.25 + mag * 0.5})`, background: `rgba(34,211,238,${0.05 + mag * 0.12})`, color: '#a5f3fc' }
            : { border: `1px solid rgba(167,139,250,${0.25 + mag * 0.5})`, background: `rgba(167,139,250,${0.05 + mag * 0.12})`, color: '#ddd6fe' };
    };

    return (
        <div dir={dir} className="rounded-[2rem] border border-slate-700/50 bg-slate-900/50 p-5 backdrop-blur-xl sm:p-7 text-start">
            {/* כותרת ומבוא */}
            <div className="mb-5 flex items-start gap-3">
                {labNumber != null && (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/60 font-mono text-sm font-black text-slate-200">
                        {labNumber}
                    </span>
                )}
                <div>
                    <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                        <Table2 size={14} /> {c.eyebrow}
                    </span>
                    <h3 className="text-xl font-black text-white md:text-2xl">{c.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-slate-400">{c.intro}</p>
                </div>
            </div>

            {/* בורר מילה: הצ'יפים תמיד מילים, כדי שהתווית "בחרו מילה" תהיה תמיד נכונה */}
            <div className="mb-5">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{c.pickWord}</div>
                <div className="flex flex-wrap gap-2">
                    {WORDS.map((w) => {
                        const isActive = w.id === wordId;
                        return (
                            <button
                                key={w.id}
                                type="button"
                                onClick={() => setWordId(w.id)}
                                aria-pressed={isActive}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
                                    isActive ? 'border-cyan-400/60 bg-cyan-900/25 text-cyan-100' : 'border-slate-700/50 bg-slate-800/30 text-slate-300 hover:border-slate-600'
                                }`}
                            >
                                {label(w.id)}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {/* שמאל: זרימת מילה -> Token ID -> שורה בטבלה */}
                <div className="space-y-4">
                    {/* מילה -> Token ID */}
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                        <div className="text-center">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{c.pickWord}</div>
                            <div className="mt-1 text-lg font-black text-white">{label(active.id)}</div>
                        </div>
                        {dir === 'rtl' ? <ArrowLeft size={20} className="shrink-0 text-slate-500" /> : <ArrowRight size={20} className="shrink-0 text-slate-500" />}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                                <Hash size={11} /> Token ID
                            </div>
                            <div className="mt-1 font-mono text-2xl font-black text-cyan-200" dir="ltr">{active.tokenId}</div>
                            <div className="mt-0.5 text-[10px] text-slate-500">{c.idNote}</div>
                        </div>
                    </div>

                    {/* טבלת ה-embedding: שורה לכל טוקן, הנבחרת זוהרת */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                        <div className="mb-1 flex items-center gap-2">
                            <Table2 size={15} className="text-cyan-300" />
                            <span className="text-[13px] font-bold text-slate-100">{c.tableTitle}</span>
                        </div>
                        <p className="mb-3 text-[11px] leading-relaxed text-slate-500">{c.tableHint}</p>
                        {/* כותרות עמודות: מבהירות שהמספר הבודד הוא ה-Token ID (כתובת השורה), והשאר הם הווקטור */}
                        <div className="mb-2 grid grid-cols-[4.25rem_1fr] items-center gap-3 px-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                            <span className="inline-flex items-center gap-1" dir="ltr"><Hash size={10} /> Token ID</span>
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
                                        className={`grid w-full grid-cols-[4.25rem_1fr] items-center gap-3 rounded-lg border px-2.5 py-1.5 text-start transition-colors ${
                                            isActive ? 'border-cyan-400/50 bg-cyan-900/15' : 'border-slate-700/40 bg-slate-900/30 hover:border-slate-600 opacity-70'
                                        }`}
                                    >
                                        <span className={`inline-flex items-center gap-0.5 font-mono text-sm font-black ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} dir="ltr">
                                            <Hash size={11} className="opacity-60" />{w.tokenId}
                                        </span>
                                        <span className="flex flex-wrap gap-1 font-mono text-[10px]" dir="ltr">
                                            {preview.map((n, i) => (
                                                <span key={i} className={isActive ? 'text-slate-200' : 'text-slate-600'}>{fmt(n)}</span>
                                            ))}
                                            <span className={isActive ? 'text-slate-500' : 'text-slate-700'}>...</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ימין: הווקטור המלא כשורת מספרים + מתג נלמד/אקראי */}
                <div className="flex flex-col rounded-2xl border border-violet-500/30 bg-slate-950/40 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Sparkles size={15} className="text-violet-300" />
                            <span className="text-[13px] font-bold text-slate-100">{c.vectorTitle}</span>
                            <span className="font-mono text-[11px] text-slate-500" dir="ltr">#{active.tokenId}</span>
                        </div>
                        {/* מתג נלמד / אקראי: זה הרגע המרכזי של המעבדה, ולכן יעד מגע מלא (44px)
                            וטקסט בגודל קריא. המצב הפעיל מסומן גם בטקסט (aria-pressed) ולא בצבע בלבד. */}
                        <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1">
                            {([['learned', c.learnedLabel, GraduationCap], ['random', c.randomLabel, Shuffle]] as const).map(([key, lbl, Icon]) => {
                                const on = (key === 'learned') === learned;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setLearned(key === 'learned')}
                                        aria-pressed={on}
                                        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                                            on ? (key === 'learned' ? 'bg-emerald-500/25 text-emerald-100' : 'bg-slate-600/40 text-slate-100') : 'text-slate-400 hover:text-slate-200'
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
                    <p className="mb-3 flex items-start gap-1.5 text-[15px] leading-relaxed text-slate-300">
                        <MousePointerClick size={15} className="mt-0.5 shrink-0 text-violet-300" />
                        {c.switchHint}
                    </p>

                    {/* שורת המספרים: 12 תאים. מתחלפת בהחלפת מילה או מצב. */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${wordId}-${learned}`}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
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

                    <p className="mt-3 text-[12px] leading-relaxed text-slate-400">{c.vectorNote}</p>
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
                            learned ? 'border-emerald-500/30 bg-emerald-900/15 text-emerald-100' : 'border-amber-500/30 bg-amber-900/15 text-amber-100'
                        }`}
                    >
                        {learned ? c.learnedNote : c.randomNote}
                    </div>
                </div>
            </div>

            {/* הבהרה: המספרים להמחשה, וקטור אמיתי הוא מאות ממדים לא קריאים */}
            <p className="mt-4 text-[13px] leading-relaxed text-slate-400">{c.disclaimer}</p>
        </div>
    );
};
