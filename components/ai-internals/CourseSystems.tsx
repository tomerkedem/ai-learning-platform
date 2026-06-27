"use client";

// components/ai-internals/CourseSystems.tsx
//
// "16 פרקים שפותחים את המנוע, שלב אחרי שלב": חמש תת-מערכות של המנוע על מסלול
// חישובי אחד. לא אקורדיון: כל שער הוא תא זוהר עם זהות-צבע, קצה מואר, פינות-מעגל,
// ופורט שמתחבר למסלול. פתיחת שער מרגישה כמו *הפעלת תת-מערכת*: הקצה נדלק, סריקת-אור
// קצרה עוברת, התוכן נפרש בשכבות, אותות התחנות נדלקים, ומסלול הפרקים נמתח.
//
// שכבת התנועה: תנועה רק בתגובה ל-hover / focus / open / reveal. אין תנועה מתמדת
// רועשת. מחבר-המסלול בין שערים פועם רק כששער סמוך פתוח, לא כל הזמן. reduced-motion
// מבטל את כל הפעימות, הסריקות והמתיחות, ומשאיר את המשמעות וההיררכיה.
//
// נגישות: כל שער הוא <button> עם aria-expanded ו-aria-controls; הפרקים הם רשימה
// סמנטית (ol/li) עם קישורים וטקסט קריא (לא צבע בלבד); קישוטים aria-hidden;
// תמיכת מקלדת וטבעת פוקוס גלויה; RTL ונוח למובייל.

import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, Eye, Binary, Focus, Workflow, Layers, Route, Activity, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import type { CourseSystem } from '@/app/behind-the-scenes-ai/introduction/introContent';
import type { Direction } from '@/i18n/config';

// גוון-זהות לכל תת-מערכת: מסע צבעוני לאורך המנוע.
const SYSTEM_ACCENTS: Accent[] = ['cyan', 'blue', 'indigo', 'purple', 'rose'];

// אייקון "תא" לכל תת-מערכת. רמז ויזואלי, לא ניתן לתרגום.
const SYSTEM_ICON: Record<string, React.ReactNode> = {
    outside: <Eye size={20} />,
    representations: <Binary size={20} />,
    context: <Focus size={20} />,
    agent: <Workflow size={20} />,
    synthesis: <Layers size={20} />,
};

interface SystemLabels {
    purpose: string;
    stations: string;
    chapters: string;
    open: string;
    startHere: string;
}

const CHAPTER_BASE = '/behind-the-scenes-ai/chapter-';

function SystemGate({ system, index, total, accent, labels, reduce, isFirstSystem, open, onToggle }: {
    system: CourseSystem;
    index: number;
    total: number;
    accent: Accent;
    labels: SystemLabels;
    reduce: boolean;
    isFirstSystem: boolean;
    open: boolean;
    onToggle: () => void;
}) {
    const panelId = useId();
    const a = ACCENTS[accent];

    return (
        <div
            className={`group relative overflow-hidden rounded-[1.6rem] border ${a.border} bg-slate-900/60 backdrop-blur-xl transition-shadow duration-300 ${open && !reduce ? a.glow : ''}`}
        >
            {/* שכבות קישוט: הילה, קצה מואר מוביל (נדלק ב-hover/open), פינות-מעגל */}
            <div className={`pointer-events-none absolute -top-20 -right-12 h-44 w-44 rounded-full ${a.bgSoft} blur-[80px]`} aria-hidden />
            <span className={`pointer-events-none absolute inset-y-6 right-0 w-[3px] rounded-full ${a.solid} transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} ${open && !reduce ? a.glow : ''}`} aria-hidden />
            <span className={`pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 rounded-tl border-l border-t ${a.border}`} aria-hidden />
            <span className={`pointer-events-none absolute bottom-3 left-3 h-3.5 w-3.5 rounded-bl border-b border-l ${a.border}`} aria-hidden />

            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={panelId}
                className="relative flex w-full items-center gap-4 p-4 text-start transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 md:p-5"
            >
                {/* תא-מנוע: אייקון בתוך מעוין זוהר */}
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <span className={`absolute inset-1 rotate-45 rounded-[0.6rem] border ${a.border} ${a.bgSoft} transition-shadow duration-300 ${open && !reduce ? a.glow : ''}`} aria-hidden />
                    <span className={`absolute -top-0.5 right-1 h-1.5 w-1.5 rounded-full ${a.dot}`} aria-hidden />
                    <span className={`relative ${a.text}`} aria-hidden>{SYSTEM_ICON[system.id]}</span>
                </span>

                <span className="min-w-0 flex-1">
                    <span className={`block font-mono text-[11px] font-black uppercase tracking-[0.2em] ${a.text}`}>
                        מערכה <span dir="ltr">{index + 1}/{total}</span>
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-lg font-black leading-tight text-white md:text-xl">{system.title}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border ${a.border} bg-slate-950/50 px-2 py-0.5 text-[11px] font-bold ${a.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} aria-hidden />
                            {system.range}
                        </span>
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-slate-400">{system.teaser}</span>
                </span>

                {/* אפשרות הפעלה */}
                <span className="flex shrink-0 flex-col items-center gap-1">
                    {!open && <span className={`hidden text-[10px] font-bold sm:block ${a.text}`}>{labels.open}</span>}
                    <motion.span
                        aria-hidden
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${a.border} ${a.text} ${open ? a.bgSoft : 'bg-slate-950/40'}`}
                    >
                        <ChevronDown size={16} />
                    </motion.span>
                </span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden"
                    >
                        <div className={`border-t ${a.border} px-4 pb-5 pt-4 md:px-5`}>
                            {/* מה תגלו? */}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.05 }}
                                className="mb-4"
                            >
                                <div className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide ${a.text}`}>
                                    <Sparkles size={12} aria-hidden /> {labels.purpose}
                                </div>
                                <p className="mt-1 text-sm leading-relaxed text-slate-300">{system.purpose}</p>
                            </motion.div>

                            {/* אותות: תחנות קשורות במפה (נדלקות בקצרה) */}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.1 }}
                                className="mb-4"
                            >
                                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-slate-400">
                                    <Activity size={12} aria-hidden /> {labels.stations}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {system.stationChips.map((chip, ci) => (
                                        <motion.span
                                            key={chip}
                                            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={reduce ? { duration: 0 } : { duration: 0.25, delay: 0.18 + ci * 0.07 }}
                                            className={`inline-flex items-center gap-1.5 rounded-full border ${a.border} ${a.bgSoft} px-2.5 py-1 text-xs font-bold ${a.text}`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} aria-hidden />
                                            {chip}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* מסלול הפרקים */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-slate-400">
                                    <Route size={12} aria-hidden /> {labels.chapters}
                                </div>
                                <ol className="flex flex-col">
                                    {system.chapters.map((ch, ci) => {
                                        const last = ci === system.chapters.length - 1;
                                        const isStart = isFirstSystem && ci === 0;
                                        // כניסה רגועה ומדורגת: opacity + translateY קטן, צעד עדין בין שורות.
                                        const rowDelay = 0.12 + ci * 0.08;
                                        return (
                                            <motion.li
                                                key={ch.n}
                                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut', delay: rowDelay }}
                                                className="flex gap-3"
                                            >
                                                {/* פס המסלול: תא-צומת + קו מחבר נמתח */}
                                                <span className="flex flex-col items-center self-stretch">
                                                    <span className="relative">
                                                        {/* זוהר עדין וקצר על המספר בזמן הופעת השורה */}
                                                        {!reduce && (
                                                            <motion.span
                                                                aria-hidden
                                                                className={`absolute inset-0 rounded-[0.55rem] ${a.solid} blur-md`}
                                                                initial={{ opacity: 0.45 }}
                                                                animate={{ opacity: 0 }}
                                                                transition={{ duration: 0.7, ease: 'easeOut', delay: rowDelay + 0.04 }}
                                                            />
                                                        )}
                                                        <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.55rem] text-[11px] font-bold ${a.solid} ${a.solidText}`} dir="ltr">
                                                            {ch.n}
                                                        </span>
                                                    </span>
                                                    {!last && (
                                                        <motion.span
                                                            className={`my-1 w-px flex-1 ${a.dot} opacity-40`}
                                                            style={{ transformOrigin: 'top' }}
                                                            initial={reduce ? false : { scaleY: 0 }}
                                                            animate={{ scaleY: 1 }}
                                                            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut', delay: rowDelay + 0.12 }}
                                                            aria-hidden
                                                        />
                                                    )}
                                                </span>

                                                <Link
                                                    href={`${CHAPTER_BASE}${ch.n}`}
                                                    className="group/ch mb-2.5 block flex-1 rounded-xl border border-white/5 bg-slate-950/40 px-3 py-2 transition-colors hover:border-cyan-500/40 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                                                >
                                                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="text-sm font-bold text-slate-100 group-hover/ch:text-white">{ch.label}</span>
                                                        {isStart && (
                                                            <motion.span
                                                                className={`inline-flex items-center gap-1 rounded-full ${a.bgSoft} px-1.5 py-0.5 text-[9px] font-black ${a.text}`}
                                                                animate={reduce ? undefined : { opacity: [1, 0.55, 1] }}
                                                                transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                                                            >
                                                                <Sparkles size={9} aria-hidden /> {labels.startHere}
                                                            </motion.span>
                                                        )}
                                                    </span>
                                                    <span className="mt-0.5 block font-mono text-[10px] text-slate-500">פרק <span dir="ltr">{ch.n}</span></span>
                                                </Link>
                                            </motion.li>
                                        );
                                    })}
                                </ol>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── מחבר-מסלול בין תת-מערכות: פועם רק כששער סמוך פתוח ── */
function RouteConnector({ accent, active, reduce }: { accent: Accent; active: boolean; reduce: boolean }) {
    const a = ACCENTS[accent];
    const pulsing = active && !reduce;
    return (
        <div className="flex justify-center py-1.5" aria-hidden>
            <div className="flex flex-col items-center gap-1">
                <span className={`h-3 w-px ${a.dot} transition-opacity duration-500 ${active ? 'opacity-60' : 'opacity-25'}`} />
                <motion.span
                    className={`h-2 w-2 rotate-45 rounded-[1px] ${a.solid}`}
                    animate={pulsing ? { opacity: [0.5, 1, 0.5], scale: [0.9, 1.12, 0.9] } : { opacity: active ? 0.95 : 0.5, scale: 1 }}
                    transition={pulsing ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
                />
                <span className={`h-3 w-px ${a.dot} transition-opacity duration-500 ${active ? 'opacity-60' : 'opacity-25'}`} />
            </div>
        </div>
    );
}

interface CourseSystemsProps {
    systems: CourseSystem[];
    labels: SystemLabels;
    reduce: boolean;
    /** כיוון הכתיבה הפעיל. נקבע בעמוד מ-useT, לא מקובע ב-rtl. */
    dir: Direction;
}

export const CourseSystems: React.FC<CourseSystemsProps> = ({ systems, labels, reduce, dir }) => {
    // מצב הפתיחה מורם להורה כדי שמחברי-המסלול ידעו מתי שער סמוך פעיל.
    const [openIds, setOpenIds] = useState<string[]>([]);
    const toggle = (id: string) =>
        setOpenIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

    return (
        <div dir={dir} className="relative flex flex-col">
            {systems.map((system, i) => {
                const accent = SYSTEM_ACCENTS[i % SYSTEM_ACCENTS.length];
                const nextAccent = SYSTEM_ACCENTS[(i + 1) % SYSTEM_ACCENTS.length];
                const connectorActive = i < systems.length - 1 &&
                    (openIds.includes(system.id) || openIds.includes(systems[i + 1].id));
                return (
                    <React.Fragment key={system.id}>
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.05 }}
                        >
                            <SystemGate
                                system={system}
                                index={i}
                                total={systems.length}
                                accent={accent}
                                labels={labels}
                                reduce={reduce}
                                isFirstSystem={i === 0}
                                open={openIds.includes(system.id)}
                                onToggle={() => toggle(system.id)}
                            />
                        </motion.div>
                        {i < systems.length - 1 && (
                            <RouteConnector accent={nextAccent} active={connectorActive} reduce={reduce} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
