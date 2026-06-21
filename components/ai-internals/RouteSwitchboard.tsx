"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, HelpCircle, Wrench, Hand, Inbox } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent, RouteKind } from './types';

interface RouteSwitchboardProps {
    /** המסלול הפעיל שנבחר עבור הניסוח הנוכחי. */
    activeRoute: RouteKind;
    /** מסלול אפשרי הבא (תצוגה בלבד - לא קריאת כלי אמיתית). */
    nextRoute?: RouteKind;
    /** טקסט הסבר קצר מתחת לכותרת. */
    helper?: string;
}

// ארבעת מסלולי הניתוב. תווית עברית ראשית, מושג אנגלי משני, גוון ואייקון.
const ROUTES: { id: RouteKind; he: string; en: string; accent: Accent; icon: React.ReactNode }[] = [
    { id: 'answer', he: 'לענות', en: 'Answer', accent: 'cyan', icon: <CheckCircle2 size={18} /> },
    { id: 'ask', he: 'לבקש מידע', en: 'Ask for info', accent: 'indigo', icon: <HelpCircle size={18} /> },
    { id: 'tool', he: 'להכין שימוש בכלי', en: 'Prepare tool use', accent: 'blue', icon: <Wrench size={18} /> },
    { id: 'stop', he: 'לעצור לאישור', en: 'Stop for approval', accent: 'rose', icon: <Hand size={18} /> },
];

/**
 * Route Switchboard: ארבעה מסלולים מקבילים, לא רצף שלבים.
 * מסלול אחד נדלק כפעיל; מסלול אפשרי הבא מסומן עמום-מקווקו.
 */
export const RouteSwitchboard: React.FC<RouteSwitchboardProps> = ({ activeRoute, nextRoute, helper }) => {
    const reduce = useReducedMotion();

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 leading-tight">
                <div className="text-sm font-bold text-slate-200">לוח ניתוב מסלולים</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Route Switchboard</div>
            </div>

            {helper && <p className="mb-4 text-xs leading-relaxed text-slate-400">{helper}</p>}

            {/* מקור הניתוב */}
            <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-600/60 bg-slate-800/50 px-3 py-1.5 text-sm font-semibold text-slate-200">
                    <Inbox size={15} className="text-slate-400" />
                    הבקשה
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-slate-600/60 to-transparent" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">routing</span>
            </div>

            {/* ארבעת המסלולים, מקבילים */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {ROUTES.map((route) => {
                    const isActive = route.id === activeRoute;
                    const isNext = !isActive && route.id === nextRoute;
                    const a = ACCENTS[route.accent];

                    return (
                        <motion.div
                            key={route.id}
                            animate={{
                                opacity: isActive ? 1 : isNext ? 0.85 : 0.45,
                                scale: isActive ? 1.03 : 1,
                            }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className={`relative overflow-hidden rounded-xl border p-3 ${
                                isActive
                                    ? `${a.border} ${a.bgSoft} ${a.glow}`
                                    : isNext
                                        ? `border-dashed ${a.border} bg-slate-900/40`
                                        : 'border-slate-700/50 bg-slate-900/40'
                            }`}
                        >
                            {/* קו מחבר עליון - נדלק רק במסלול הפעיל */}
                            <div className={`absolute inset-x-0 top-0 h-0.5 ${isActive ? a.barGradient : 'bg-transparent'}`} />

                            <div className={`mb-1.5 flex items-center gap-1.5 ${isActive || isNext ? a.text : 'text-slate-500'}`}>
                                {route.icon}
                            </div>
                            <div className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                {route.he}
                            </div>
                            <div className={`text-[10px] font-medium uppercase tracking-wide ${isActive || isNext ? 'text-slate-400' : 'text-slate-600'}`} dir="ltr">
                                {route.en}
                            </div>

                            {isActive && (
                                <div className={`mt-2 text-[10px] font-bold ${a.text}`}>
                                    המסלול שנבחר
                                    <span className="block font-medium uppercase tracking-wider opacity-70" dir="ltr">Active route</span>
                                </div>
                            )}
                            {isNext && (
                                <div className="mt-2 text-[10px] font-semibold text-slate-400">
                                    מסלול אפשרי הבא
                                    <span className="block font-medium uppercase tracking-wider opacity-70" dir="ltr">Next: after barcode</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
