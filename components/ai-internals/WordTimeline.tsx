"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { History, ChevronLeft } from 'lucide-react';
import { ACCENTS } from './accents';
import type { WordScenario } from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

interface WordTimelineProps {
    scenario: WordScenario;
    stepIndex: number;
    onScrub: (index: number) => void;
}

/** המילים שנוספו בשלב מסוים ביחס לקודם. */
function newWords(scenario: WordScenario, i: number): string {
    const cur = scenario.steps[i].tokens;
    const prev = i > 0 ? scenario.steps[i - 1].tokens : [];
    return cur.slice(prev.length).join(' ');
}

/**
 * Word by Word Timeline: ציר זמן ככרטיסים נבחרים (scrubber). לחיצה על כרטיס
 * מחזירה את כל המנוע למצב שהיה באותו רגע. אפשר לחזור אחורה וקדימה בזמן.
 */
export const WordTimeline: React.FC<WordTimelineProps> = ({ scenario, stepIndex, onScrub }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[scenario.accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center gap-2">
                <History size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">ציר הזמן של המילים</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Word by Word Timeline</div>
                </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-slate-400">
                לחצו על כרטיס כדי לחזור למצב המנוע באותו רגע. אפשר לנוע קדימה ואחורה.
            </p>

            <div className="flex flex-wrap items-stretch gap-2" dir="rtl">
                {scenario.steps.map((s, i) => {
                    const active = i === stepIndex;
                    const reached = i <= stepIndex;
                    return (
                        <React.Fragment key={s.text}>
                            {i > 0 && (
                                <span className="flex items-center text-slate-600">
                                    <ChevronLeft size={16} />
                                </span>
                            )}
                            <motion.button
                                type="button"
                                onClick={() => onScrub(i)}
                                aria-pressed={active}
                                whileTap={reduce ? undefined : { scale: 0.96 }}
                                className={`relative rounded-xl border px-3 py-2 text-center transition-colors ${
                                    active
                                        ? `${a.border} ${a.bgSoft} ${a.glow}`
                                        : reached
                                            ? 'border-slate-600/60 bg-slate-800/50 hover:border-slate-500'
                                            : 'border-slate-700/40 bg-slate-950/30 text-slate-500 hover:border-slate-600'
                                }`}
                            >
                                <span className={`block font-mono text-sm font-bold ${active ? a.text : reached ? 'text-slate-200' : 'text-slate-500'}`}>
                                    {newWords(scenario, i)}
                                </span>
                                <span className="mt-0.5 block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">
                                    step {i + 1}
                                </span>
                            </motion.button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
