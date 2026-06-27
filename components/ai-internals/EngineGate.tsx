"use client";

// components/ai-internals/EngineGate.tsx
//
// שער המנוע: הרגע הדרמטי שבו פותחים את מה שקרה בין הבקשה לתשובה. מופיע *אחרי*
// ניחוש ההשערות (כדי לא להדליף את התשובה), ומוביל ישירות אל מפת 14 התחנות שמתחתיו.
//
// כשהשער נפתח מוצגת תצוגה מקדימה מופשטת של מסע המנוע (טוקנים -> מספרים -> הקשר ->
// בחירה), משפט גשר, ורמז שמכוון אל המפה המלאה שבדיוק למטה. זה שער, לא תחליף למפה.
//
// הרכיב ניטרלי לתוכן: כל הטקסט מגיע ב-props (מוכן ל-i18n).
// reduced-motion: הפתיחה עובדת בלי תנועת גובה וסריקה מונפשת.

import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, ChevronDown, ArrowDown } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import type { Direction } from '@/i18n/config';

interface EngineGateProps {
    reduce: boolean;
    /** כיוון הכתיבה הפעיל. נקבע בעמוד מ-useT, לא מקובע ב-rtl. */
    dir: Direction;
    lead: string;
    revealLabel: string;
    closeLabel: string;
    revealedLabel: string;
    bridge: string;
    downCue: string;
    teaser: string[];
}

// גוון לכל שלב בתצוגה המקדימה: מהדהד את צבעי האזורים במפה.
const TEASER_ACCENTS: Accent[] = ['cyan', 'blue', 'indigo', 'purple'];

export const EngineGate: React.FC<EngineGateProps> = ({
    reduce, dir, lead, revealLabel, closeLabel, revealedLabel, bridge, downCue, teaser,
}) => {
    const [open, setOpen] = useState(false);
    const panelId = useId();

    return (
        <div
            dir={dir}
            className="relative overflow-hidden rounded-[2rem] border border-cyan-500/30 bg-slate-900/60 p-6 text-center backdrop-blur-xl md:p-8"
        >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative flex flex-col items-center gap-4">
                <p className="max-w-xl text-base font-bold leading-relaxed text-slate-200 md:text-lg">{lead}</p>

                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/50 bg-cyan-500/15 px-5 py-2.5 text-sm font-bold text-cyan-100 transition-colors hover:bg-cyan-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                    <ScanLine size={16} aria-hidden />
                    {open ? closeLabel : revealLabel}
                    <motion.span
                        aria-hidden
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className="inline-flex"
                    >
                        <ChevronDown size={16} />
                    </motion.span>
                </button>

                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div
                            key="teaser"
                            id={panelId}
                            role="region"
                            aria-label={revealedLabel}
                            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full overflow-hidden"
                        >
                            <div className="flex flex-col items-center gap-3 pt-2">
                                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">{revealedLabel}</div>

                                {/* זרימת תחנות-על מופשטת */}
                                <div className="flex flex-wrap items-center justify-center gap-1.5" dir={dir}>
                                    {teaser.map((label, i) => {
                                        const a = ACCENTS[TEASER_ACCENTS[i % TEASER_ACCENTS.length]];
                                        return (
                                            <React.Fragment key={label}>
                                                <motion.span
                                                    initial={reduce ? false : { opacity: 0, x: 16, scale: 0.9 }}
                                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                                    transition={reduce ? { duration: 0 } : { delay: 0.15 + i * 0.18, type: 'spring', stiffness: 320, damping: 22 }}
                                                    className={`rounded-full border ${a.border} ${a.bgSoft} px-3 py-1 text-xs font-bold ${a.text}`}
                                                >
                                                    {label}
                                                </motion.span>
                                                {i < teaser.length - 1 && (
                                                    <motion.span
                                                        aria-hidden
                                                        className="h-px w-5 bg-gradient-to-l from-cyan-400/50 to-indigo-400/50"
                                                        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                                                        animate={{ scaleX: 1, opacity: 1 }}
                                                        transition={reduce ? { duration: 0 } : { delay: 0.24 + i * 0.18, duration: 0.25 }}
                                                    />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>

                                <p className="max-w-md text-sm leading-relaxed text-slate-300">{bridge}</p>

                                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300/90">
                                    {!reduce ? (
                                        <motion.span
                                            animate={{ y: [0, 3, 0] }}
                                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                                            className="inline-flex"
                                            aria-hidden
                                        >
                                            <ArrowDown size={13} />
                                        </motion.span>
                                    ) : (
                                        <ArrowDown size={13} aria-hidden />
                                    )}
                                    {downCue}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
