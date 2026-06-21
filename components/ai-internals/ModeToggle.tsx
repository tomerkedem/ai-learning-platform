"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, Workflow } from 'lucide-react';
import { ACCENTS } from './accents';
import { SPRING } from './motionTokens';
import type { Accent, FlowMode } from './types';

interface ModeToggleProps {
    mode: FlowMode;
    onChange: (mode: FlowMode) => void;
    /** גוון לכפתור הפעיל. מאפשר להבדיל חזותית בין Chat ל-Agent. */
    accent?: Accent;
}

const OPTIONS: { value: FlowMode; label: string; icon: React.ReactNode }[] = [
    { value: 'chat', label: 'Chat Mode', icon: <MessageCircle size={16} /> },
    { value: 'agent', label: 'Agent Mode', icon: <Workflow size={16} /> },
];

/** מעבר בין Chat Mode ל-Agent Mode עם גלולה נעה. אחריות יחידה: בחירת FlowMode. */
export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange, accent = 'cyan' }) => {
    const a = ACCENTS[accent];
    const reduce = useReducedMotion();

    return (
        <div className="relative inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-900/80 border border-white/10" dir="ltr">
            {OPTIONS.map((opt) => {
                const active = mode === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        aria-pressed={active}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-200
                            ${active ? a.solidText : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {active && (
                            <motion.span
                                layoutId="mode-toggle-pill"
                                transition={reduce ? { duration: 0 } : SPRING.pill}
                                className={`absolute inset-0 rounded-xl ${a.solid} ${a.glow}`}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {opt.icon}
                            {opt.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
