"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ACCENTS } from './accents';
import type { ProbabilityScenario } from './types';

interface PromptScenarioSelectorProps {
    scenarios: ProbabilityScenario[];
    selectedId: string;
    onSelect: (id: string) => void;
}

/**
 * בורר פרומטים: שלושה כרטיסים. כל כרטיס מציג את הניסוח, תווית עברית
 * (ברור / עמום / כללי) ותווית אנגלית משנית. הכרטיס הפעיל מודגש בגוונו.
 */
export const PromptScenarioSelector: React.FC<PromptScenarioSelectorProps> = ({
    scenarios,
    selectedId,
    onSelect,
}) => {
    const reduce = useReducedMotion();

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3" dir="rtl">
            {scenarios.map((sc, i) => {
                const isActive = sc.id === selectedId;
                const a = ACCENTS[sc.accent];
                return (
                    <motion.button
                        key={sc.id}
                        type="button"
                        onClick={() => onSelect(sc.id)}
                        aria-pressed={isActive}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className={`group relative overflow-hidden rounded-2xl border p-4 text-right transition-colors ${
                            isActive
                                ? `${a.border} ${a.bgSoft} ${a.glow}`
                                : 'border-slate-700/50 bg-slate-900/50 hover:border-slate-600'
                        }`}
                    >
                        <div className={`absolute inset-y-0 right-0 w-1 ${a.barGradient} ${isActive ? 'opacity-90' : 'opacity-30'}`} />

                        <div className="mb-2 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                {isActive && !reduce && (
                                    <span className={`absolute inline-flex h-full w-full rounded-full ${a.dot} opacity-75 animate-ping`} />
                                )}
                                <span className={`relative inline-flex h-2 w-2 rounded-full ${isActive ? a.dot : 'bg-slate-600'}`} />
                            </span>
                            <span className={`leading-tight ${isActive ? a.text : 'text-slate-500'}`}>
                                <span className="block text-xs font-bold">{sc.labelHe}</span>
                                <span className="block text-[9px] font-medium uppercase tracking-[0.18em] opacity-70" dir="ltr">{sc.labelEn}</span>
                            </span>
                        </div>

                        <div className={`text-base font-bold leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            &quot;{sc.prompt}&quot;
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
};
