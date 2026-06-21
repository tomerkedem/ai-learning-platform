"use client";

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SearchX, CheckCircle2 } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';

interface MissingInfoSpotlightProps {
    /** המושג האנגלי של המידע החסר (למשל "Barcode"). כאשר undefined - אין מידע חסר. */
    item?: string;
    /** כותרת עברית למידע החסר (למשל "חסר ברקוד"). ברירת מחדל: item. */
    label?: string;
    /** הסבר עברי קצר למה המידע חסר. */
    note?: string;
    /** טקסט הסבר לימודי קצר שמופיע מתחת לכרטיס כשחסר מידע. */
    helper?: string;
    /** גוון ההדגשה כשחסר מידע. */
    accent?: Accent;
}

/** זרקור מידע חסר: מודגש ופועם כשחסר משהו, רגוע ושקט כשהכול קיים. */
export const MissingInfoSpotlight: React.FC<MissingInfoSpotlightProps> = ({ item, label, note, helper, accent = 'amber' }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const missing = Boolean(item);

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 leading-tight">
                <div className="text-sm font-bold text-slate-200">מידע חסר</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Missing Info</div>
            </div>

            <AnimatePresence mode="wait">
                {missing ? (
                    <motion.div
                        key="missing"
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center gap-3 rounded-xl border ${a.border} ${a.bgSoft} p-4 ${a.glow}`}
                    >
                        <span className="relative flex h-9 w-9 items-center justify-center">
                            {!reduce && (
                                <span className={`absolute inline-flex h-full w-full rounded-full ${a.dot} opacity-30 animate-ping`} />
                            )}
                            <span className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-950/50 ${a.text}`}>
                                <SearchX size={18} />
                            </span>
                        </span>
                        <div>
                            <div className={`font-bold ${a.text}`}>{label ?? item}</div>
                            <div className="text-xs text-slate-300">{note ?? 'חסר כדי להמשיך - המנוע יבקש את המידע הזה.'}</div>
                            {item && (
                                <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500" dir="ltr">
                                    Missing information: {item}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="complete"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 text-slate-400"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-950/50 text-slate-500">
                            <CheckCircle2 size={18} />
                        </span>
                        <div className="text-sm">אין מידע חסר - יש מספיק כדי לנתב את הבקשה.</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {missing && helper && (
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{helper}</p>
            )}
        </div>
    );
};
