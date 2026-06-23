"use client";

// components/ai-internals/StickyInputDock.tsx
// dock קלט דביק משותף ללומדה "מאחורי הקלעים של AI".
//
// ── הבעיה שהוא פותר ──────────────────────────────────────────────────────────
// בפרקים שבהם הלומד משנה מילה וצופה במפל מגיב (3, 4, 7, 8), שדה הקלט והתוצאה
// המרכזית מרוחקים אנכית. כדי לראות את ההשפעה צריך לגלול, והקשר הסיבתי בין שינוי
// המילה לתזוזת המנוע נשבר. ה-dock הזה מצמיד את הקלט ואת ה"תוצאה הראשית" יחד,
// נשאר גלוי תוך כדי גלילת המפל המלא, ומחזיק כפתור Replay לאנימציה המרכזית.
//
// ── גבולות אחריות ────────────────────────────────────────────────────────────
// שכבת הצגה ופריסה בלבד. ה-readout *קורא* את ה-state של המנוע (props) ואינו
// משנה לוגיקה, engine, או ערך. הקלט עצמו מגיע כ-children (slot), כך שיש מקור
// קלט אחד בלבד — הפרק מקדם את שדה הקלט הקיים לתוך ה-dock, בלי שדה כפול.
//
// ── שימוש חוזר (פרקים 3, 4, 8) ───────────────────────────────────────────────
// הקומפוננטה גנרית: היא לא יודעת דבר על פרק מסוים. הפרק מחשב readout מתוך ה-state
// הקיים שלו (מוביל, הסתברות, פער, החלטה, ואופציונלית mini-bars), מעביר את שדה
// הקלט הקיים כ-children, ומחווט onReplay לאנימציה המרכזית של אותו פרק.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RotateCcw, ChevronDown, ChevronUp, Gauge } from 'lucide-react';

import { ACCENTS } from './accents';
import { DUR, EASE, SPRING, withReduced } from './motionTokens';
import type { Accent } from './types';

/* ════════════════════════════ טיפוסי ה-readout ═══════════════════════════ */

/** סגמנט בודד ב-mini-bars (אופציונלי). הרוחב הוא pct (0..100). */
export interface DockBar {
    accent: Accent;
    pct: number;       // 0..100
    labelHe?: string;
}

/**
 * ה"תוצאה הראשית" שה-dock מציג. כל השדות נקראים מה-state של המנוע — תצוגה בלבד.
 */
export interface DockReadout {
    hasInput: boolean;
    /** המועמד/הצעד המוביל. */
    leaderHe: string;
    leaderEn: string;
    leaderAccent: Accent;
    /** ההסתברות של המוביל, באחוזים שלמים (0..100). */
    probPct: number;
    /** הפער מהמקום השני, באחוזים שלמים. */
    marginPct: number;
    /** ההחלטה (Answer / Ask / ...), כפי שהמנוע גזר אותה. */
    decisionHe: string;
    decisionEn: string;
    /** משפיע על צבע תג ההחלטה בלבד (אזהרה מול ביטחון). */
    decisionKind: 'answer' | 'answer-careful' | 'clarify' | 'tool' | 'ask' | 'stop' | 'idle' | string;
    /** mini-bars אופציונליים — הסכום אמור להיות ~100%. */
    bars?: DockBar[];
    /** טקסט המתנה כשאין קלט. */
    waitingHe?: string;
}

export interface StickyInputDockProps {
    /** שדה הקלט הקיים של הפרק, מקודם לתוך ה-dock (מקור קלט יחיד). */
    children: React.ReactNode;
    readout: DockReadout;
    /** מריץ מחדש את האנימציה המרכזית של הפרק (למשל Softmax). תצוגה בלבד. */
    onReplay?: () => void;
    replayLabelHe?: string;
    reduce: boolean;
    /**
     * עוקף את ה-offset הדביק. ברירת המחדל מכוונת לכותרת הפרק הדביקה של
     * ChapterLayout במצב מכווץ (~84px). הקלאסים חייבים להיות סטטיים ל-Tailwind JIT.
     */
    stickyClassName?: string;
}

/* ════════════════════════════ עזרי תצוגה ═════════════════════════════════ */

/** צבע תג ההחלטה: צעד בטוח = ירוק, שאלה/עצירה/זהירות = ענבר/ורוד. תצוגה בלבד. */
const decisionAccent = (kind: string): Accent => {
    if (kind === 'answer' || kind === 'tool') return 'emerald';
    if (kind === 'stop') return 'rose';
    if (kind === 'idle') return 'slate';
    return 'amber'; // ask / clarify / answer-careful
};

/* ════════════════════════════ mini-bars ══════════════════════════════════ */

const MiniBars: React.FC<{ bars: DockBar[]; reduce: boolean }> = ({ bars, reduce }) => (
    <div className="relative mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full border border-slate-700/60 bg-slate-950/50" dir="ltr">
        {bars.map((b, i) => {
            const a = ACCENTS[b.accent];
            return (
                <motion.div
                    key={`${b.labelHe ?? 'bar'}-${i}`}
                    animate={{ width: `${Math.max(0, Math.min(100, b.pct))}%` }}
                    transition={withReduced(reduce, SPRING.data)}
                    className={`h-full ${a.barFill} ${i > 0 ? 'border-l border-slate-950/60' : ''}`}
                    title={b.labelHe ? `${b.labelHe}: ${Math.round(b.pct)}%` : undefined}
                />
            );
        })}
    </div>
);

/* ════════════════════════════ ה-dock ═════════════════════════════════════ */

export const StickyInputDock: React.FC<StickyInputDockProps> = ({
    children,
    readout,
    onReplay,
    replayLabelHe = 'הרצה חוזרת',
    reduce,
    stickyClassName = 'sticky top-[88px] z-10',
}) => {
    // מצב מקופל לטובת מובייל: מראה רק הסתברות + החלטה. ברירת מחדל פתוח.
    const [collapsed, setCollapsed] = useState(false);

    const la = ACCENTS[readout.leaderAccent];
    const da = ACCENTS[decisionAccent(readout.decisionKind)];
    const waiting = !readout.hasInput;

    return (
        <div className={stickyClassName}>
            {/* משטח ה-dock: רקע אטום-למחצה + blur כדי שהמפל שנגלל מאחור לא יזלוג. */}
            <div className="space-y-2 rounded-3xl border border-slate-700/50 bg-slate-950/85 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">

                {/* ── מקור הקלט היחיד (מקודם לתוך ה-dock) ── */}
                {children}

                {/* ── ה-readout החי: התוצאה הראשית, צמודה לקלט ── */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-3" dir="rtl">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">

                        {/* ימין (התחלת RTL): התוצאה החיה */}
                        <div className="flex min-w-0 items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                <Activity size={13} className="text-emerald-400/80" />
                                <span className="hidden sm:inline" dir="ltr">Live</span>
                            </span>

                            {waiting ? (
                                <span className="text-sm font-bold text-slate-400">{readout.waitingHe ?? 'ממתין לקלט'}</span>
                            ) : (
                                <>
                                    {/* המוביל — מתחלף בהחלקה רק כשהזהות משתנה (אירוע משמעותי) */}
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                            key={readout.leaderEn}
                                            initial={reduce ? false : { opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
                                            transition={reduce ? { duration: 0 } : { duration: DUR.quick, ease: EASE.out }}
                                            className="flex min-w-0 items-center gap-1.5 leading-tight"
                                        >
                                            <span className={`h-2 w-2 shrink-0 rounded-full ${la.dot}`} />
                                            <span className="min-w-0 leading-tight">
                                                <span className={`block truncate text-sm font-bold ${la.text}`}>{readout.leaderHe}</span>
                                                <span className="block truncate text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{readout.leaderEn}</span>
                                            </span>
                                        </motion.span>
                                    </AnimatePresence>

                                    {/* הסתברות המוביל — תמיד גלויה (גם במצב מקופל) */}
                                    <span className={`shrink-0 font-mono text-xl font-black ${la.text}`} dir="ltr">{readout.probPct}%</span>

                                    {/* פער — מוסתר במצב מקופל */}
                                    {!collapsed && (
                                        <span className="hidden shrink-0 items-center gap-1 rounded-md border border-slate-700/60 bg-slate-950/40 px-2 py-0.5 text-[10px] font-bold text-slate-400 sm:inline-flex" dir="ltr">
                                            <Gauge size={11} /> Δ {Math.round(readout.marginPct)}%
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* שמאל: ההחלטה + פעולות */}
                        <div className="flex shrink-0 items-center gap-2">
                            {!waiting && (
                                <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${da.border} ${da.bgSoft} ${da.text}`}>
                                    <span>{readout.decisionHe}</span>
                                    <span className="hidden text-[9px] font-medium uppercase opacity-70 sm:inline" dir="ltr">{readout.decisionEn}</span>
                                </span>
                            )}

                            {onReplay && (
                                <button
                                    type="button"
                                    onClick={onReplay}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-900/20 px-2.5 py-1 text-xs font-bold text-purple-200 transition-colors hover:bg-purple-900/35"
                                    title="הרצה חוזרת של אנימציית ה-Softmax"
                                >
                                    <RotateCcw size={13} />
                                    <span className="hidden sm:inline">{replayLabelHe}</span>
                                    <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">Replay</span>
                                </button>
                            )}

                            {/* קיפול — שימושי בעיקר במובייל. מראה רק הסתברות + החלטה. */}
                            <button
                                type="button"
                                onClick={() => setCollapsed((c) => !c)}
                                aria-pressed={collapsed}
                                aria-label={collapsed ? 'הרחבת התוצאה' : 'קיפול התוצאה'}
                                className="inline-flex items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/40 p-1.5 text-slate-400 transition-colors hover:text-slate-200 sm:hidden"
                            >
                                {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* mini-bars — מוסתרים במצב מקופל */}
                    {!waiting && !collapsed && readout.bars && readout.bars.length > 0 && (
                        <MiniBars bars={readout.bars} reduce={reduce} />
                    )}
                </div>
            </div>
        </div>
    );
};
