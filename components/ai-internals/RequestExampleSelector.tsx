"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ACCENTS } from './accents';
import type { RequestType, RoutingExample } from './types';

// מיפוי סטטי: סוג הבקשה (מושג אנגלי) -> תווית עברית ראשית.
const TYPE_HE: Record<RequestType, string> = {
    'General question': 'שאלה כללית',
    'Specific investigation': 'בקשת בדיקה ספציפית',
    'Action request': 'בקשת פעולה',
};

interface RequestExampleSelectorProps {
    examples: RoutingExample[];
    selectedId: string;
    onSelect: (id: string) => void;
}

/** בורר ניסוחים: שלושה כרטיסי בקשה. הכרטיס הפעיל מודגש בגוון שלו. */
export const RequestExampleSelector: React.FC<RequestExampleSelectorProps> = ({
    examples,
    selectedId,
    onSelect,
}) => {
    const reduce = useReducedMotion();

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3" dir="rtl">
            {examples.map((ex, i) => {
                const isActive = ex.id === selectedId;
                const a = ACCENTS[ex.accent];
                return (
                    <motion.button
                        key={ex.id}
                        type="button"
                        onClick={() => onSelect(ex.id)}
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
                            <span className={`relative flex h-2 w-2`}>
                                {isActive && !reduce && (
                                    <span className={`absolute inline-flex h-full w-full rounded-full ${a.dot} opacity-75 animate-ping`} />
                                )}
                                <span className={`relative inline-flex h-2 w-2 rounded-full ${isActive ? a.dot : 'bg-slate-600'}`} />
                            </span>
                            <span className={`leading-tight ${isActive ? a.text : 'text-slate-500'}`}>
                                <span className="block text-xs font-bold">{TYPE_HE[ex.requestType]}</span>
                                <span className="block text-[9px] font-medium uppercase tracking-[0.18em] opacity-70" dir="ltr">{ex.requestType}</span>
                            </span>
                        </div>

                        <div className={`text-base font-bold leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {ex.requestText}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
};
