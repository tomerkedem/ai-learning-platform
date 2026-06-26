"use client";

// components/ai-internals/IntroRoadmap.tsx
//
// מפת התחנות המרכזיות של המבוא: 14 תחנות, מקובצות לארבעה אזורי-למידה, מהטקסט
// ועד התשובה. זו המפה הראשית של המבוא, לא רובד עומק אופציונלי.
//
// ── אינטראקציה ────────────────────────────────────────────────────────────────
// כל תחנה היא disclosure נגיש: כותרת והסבר קצר תמיד גלויים, ולחיצה פותחת פאנל עם
// "מה קורה כאן / למה זה חשוב / מה נראה בהמשך", ולעיתים המחשה שמלמדת את המושג.
// הכפתור נושא aria-expanded ו-aria-controls, תומך במקלדת, ובעל טבעת פוקוס גלויה.
//
// ── תוכן מבחוץ ────────────────────────────────────────────────────────────────
// הרכיב ניטרלי לתוכן: הטקסט מגיע מ-introContent (מוכן ל-i18n). כאן חיים רק
// האייקונים, הצבעים, הפריסה והאנימציה.

import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Keyboard, Scissors, Hash, Network, ListOrdered, MessageCircle,
    Focus, Shuffle, Layers, Brain, BarChart3, Percent, GitBranch, Repeat,
    CornerDownLeft, ChevronDown,
} from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import { StationViz } from './IntroStationViz';
import type {
    RoadmapStation, RoadmapZone, RoadmapZoneId,
} from '@/app/behind-the-scenes-ai/introduction/introContent';

// תוויות שלוש שאלות ההרחבה. מגיעות מהמילון דרך ה-prop, לא מ-introContent.
type StationDetailLabels = Record<keyof RoadmapStation['detail'], string>;

// גוון לכל אזור: מסע צבעוני מהקלט (cyan) אל ההכרעה (purple).
const ZONE_ACCENT: Record<RoadmapZoneId, Accent> = {
    A: 'cyan',
    B: 'blue',
    C: 'indigo',
    D: 'purple',
};

// אייקון לכל תחנה לפי id. רמז ויזואלי בלבד, לא ניתן לתרגום ולכן נשמר כאן.
const STATION_ICON: Record<string, React.ReactNode> = {
    request: <Keyboard size={18} />,
    tokenize: <Scissors size={18} />,
    ids: <Hash size={18} />,
    embedding: <Network size={18} />,
    position: <ListOrdered size={18} />,
    context: <MessageCircle size={18} />,
    attention: <Focus size={18} />,
    mix: <Shuffle size={18} />,
    layers: <Layers size={18} />,
    state: <Brain size={18} />,
    logits: <BarChart3 size={18} />,
    softmax: <Percent size={18} />,
    decoding: <GitBranch size={18} />,
    loop: <Repeat size={18} />,
};

/* ── כרטיס תחנה בודד (disclosure) ── */
function StationCard({ station, n, accent, reduce, detailLabels, defaultOpen = false }: { station: RoadmapStation; n: number; accent: Accent; reduce: boolean; detailLabels: StationDetailLabels; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const panelId = useId();
    const a = ACCENTS[accent];
    const isLoop = station.id === 'loop';

    return (
        <div className={`overflow-hidden rounded-2xl border ${a.border} ${a.bgSoft}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-start gap-3.5 p-3.5 text-right transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 md:p-4"
            >
                {/* תג מספר רץ */}
                <motion.span
                    animate={open && !reduce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
                    className={`relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${a.solid} ${a.solidText}`}
                    dir="ltr"
                >
                    {n}
                </motion.span>

                {/* אייקון */}
                <span className={`mt-1 shrink-0 ${a.text}`} aria-hidden>
                    {STATION_ICON[station.id]}
                </span>

                {/* טקסט */}
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-base font-bold leading-tight text-white">{station.title}</span>
                        {station.term && (
                            <code dir="ltr" className={`rounded-md border ${a.border} bg-slate-950/60 px-1.5 py-0.5 font-mono text-[11px] font-bold ${a.text}`}>
                                {station.term}
                            </code>
                        )}
                        {isLoop && (
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${a.text}`}>
                                <CornerDownLeft size={12} aria-hidden />
                                חוזר לתחילת המסלול
                            </span>
                        )}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-300">{station.explanation}</span>
                </span>

                {/* מחוון פתיחה: רמז ברור שאפשר להציץ פנימה */}
                <span className="mt-0.5 flex shrink-0 items-center gap-1.5">
                    {!open && <span className={`hidden text-[10px] font-bold sm:inline ${a.text}`}>הצצה</span>}
                    <motion.span
                        aria-hidden
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${a.border} ${open ? `${a.text} ${a.bgSoft}` : `${a.text} bg-slate-950/40`}`}
                    >
                        <ChevronDown size={15} />
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
                        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`border-t ${a.border} px-3.5 pb-4 pt-3 md:px-4`}>
                            {/* קצב 3 פעימות: הדגשת מספר (בכפתור) -> דיאגרמה -> טקסט */}
                            {station.viz && (
                                <motion.div
                                    initial={reduce ? false : { opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.06 }}
                                >
                                    <StationViz kind={station.viz} accent={accent} reduce={reduce} />
                                </motion.div>
                            )}
                            <motion.dl
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: station.viz ? 0.18 : 0.06 }}
                                className={`flex flex-col gap-2.5 ${station.viz ? 'mt-3' : ''}`}
                            >
                                {([
                                    ['whatHappens', station.detail.whatHappens],
                                    ['whyItMatters', station.detail.whyItMatters],
                                    ['whatNext', station.detail.whatNext],
                                ] as const).map(([key, value]) => (
                                    <div key={key}>
                                        <dt className={`text-[11px] font-black uppercase tracking-wide ${a.text}`}>
                                            {detailLabels[key]}
                                        </dt>
                                        <dd className="mt-0.5 text-sm leading-relaxed text-slate-300">{value}</dd>
                                    </div>
                                ))}
                            </motion.dl>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface IntroRoadmapProps {
    zones: RoadmapZone[];
    stations: RoadmapStation[];
    /** תוויות שלוש שאלות ההרחבה, מהמילון. */
    stationDetailLabels: StationDetailLabels;
    reduce: boolean;
    /** מזהה תחנה שתיפתח כברירת מחדל, כדי שהלומד יראה מיד שהכרטיסים מכילים עומק. */
    defaultOpenId?: string;
}

export const IntroRoadmap: React.FC<IntroRoadmapProps> = ({ zones, stations, stationDetailLabels, reduce, defaultOpenId }) => {
    // מספור רץ ורציף 1..N על פני כל האזורים (סדר המערך = סדר המסלול).
    const indexById = new Map(stations.map((s, i) => [s.id, i]));

    return (
        <div dir="rtl" className="flex flex-col gap-4">
            {zones.map((zone, zi) => {
                const acc = ZONE_ACCENT[zone.id];
                const a = ACCENTS[acc];
                const zoneStations = stations.filter((s) => s.zone === zone.id);

                return (
                    <React.Fragment key={zone.id}>
                        <motion.section
                            initial={reduce ? false : { opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5, delay: reduce ? 0 : zi * 0.05 }}
                            className={`relative overflow-hidden rounded-[1.75rem] border ${a.border} bg-slate-900/55 p-5 backdrop-blur-xl md:p-6`}
                        >
                            <div className={`pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full ${a.bgSoft} blur-[70px]`} />

                            {/* כותרת האזור */}
                            <header className="relative mb-5 flex items-start gap-3">
                                <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black ${a.border} ${a.bgSoft} ${a.text}`}>
                                    <span>אזור</span>
                                    <span dir="ltr">{zi + 1}/{zones.length}</span>
                                </span>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-black text-white md:text-xl">{zone.title}</h3>
                                    <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{zone.caption}</p>
                                </div>
                            </header>

                            {/* תחנות האזור */}
                            <div className="relative flex flex-col gap-2.5">
                                {zoneStations.map((station) => (
                                    <StationCard
                                        key={station.id}
                                        station={station}
                                        n={(indexById.get(station.id) ?? 0) + 1}
                                        accent={acc}
                                        reduce={reduce}
                                        detailLabels={stationDetailLabels}
                                        defaultOpen={station.id === defaultOpenId}
                                    />
                                ))}
                            </div>
                        </motion.section>

                        {/* מחבר בין אזורים */}
                        {zi < zones.length - 1 && (
                            <div className="flex items-center justify-center gap-2 py-0.5 text-slate-600" aria-hidden>
                                <span className="h-5 w-px bg-gradient-to-b from-transparent to-slate-600/60" />
                                <span className="text-xs font-bold">▼</span>
                                <span className="h-5 w-px bg-gradient-to-t from-transparent to-slate-600/60" />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
