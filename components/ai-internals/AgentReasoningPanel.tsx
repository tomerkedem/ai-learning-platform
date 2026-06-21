"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Workflow, Radar, Target, Database, HelpCircle, ArrowLeftCircle } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import type { AgentReasoning } from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

interface AgentReasoningPanelProps {
    reasoning: AgentReasoning;
    accent: Accent;
}

const NEEDS_DATA: Record<NonNullable<AgentReasoning['needsExternalData']>, string> = {
    yes: 'כן',
    'likely-yes': 'כנראה כן',
    no: 'לא',
};

interface Row {
    icon: React.ReactNode;
    labelHe: string;
    labelEn: string;
    he?: string;
    en?: string;
}

/**
 * פאנל היגיון ה-Agent: מוצג רק במצב Agent. כאן רואים שלא רק התוכן חשוב,
 * אלא גם סוג הבקשה - המילה "בדוק" הופכת שאלה לבקשת פעולה ומובילה לצעד הבא.
 */
export const AgentReasoningPanel: React.FC<AgentReasoningPanelProps> = ({ reasoning, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    const rows: Row[] = [
        { icon: <Radar size={14} />, labelHe: 'אות שזוהה', labelEn: 'Signal', he: reasoning.signalHe, en: reasoning.signalEn },
        { icon: <Target size={14} />, labelHe: 'מטרה', labelEn: 'Goal', he: reasoning.goalHe, en: reasoning.goalEn },
        {
            icon: <Database size={14} />,
            labelHe: 'דרוש מידע חיצוני',
            labelEn: 'Needs external data',
            he: reasoning.needsExternalData ? NEEDS_DATA[reasoning.needsExternalData] : undefined,
            en: reasoning.needsExternalData,
        },
        { icon: <HelpCircle size={14} />, labelHe: 'מידע חסר', labelEn: 'Missing information', he: reasoning.missingInfoHe, en: reasoning.missingInfoEn },
        { icon: <ArrowLeftCircle size={14} />, labelHe: 'הצעד הבא', labelEn: 'Next step', he: reasoning.nextStepHe, en: reasoning.nextStepEn },
    ].filter((r) => r.he);

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center gap-2">
                <Workflow size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">היגיון ה-Agent</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Agent Reasoning</div>
                </div>
            </div>

            <div className="space-y-2">
                {rows.map((r, i) => (
                    <motion.div
                        key={r.labelEn}
                        layout
                        initial={reduce ? false : { opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3"
                    >
                        <span className="flex items-center gap-2 text-slate-400">
                            <span className={a.text}>{r.icon}</span>
                            <span className="leading-tight">
                                <span className="block text-[11px] font-bold text-slate-300">{r.labelHe}</span>
                                <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{r.labelEn}</span>
                            </span>
                        </span>
                        <span className="text-right leading-tight">
                            <span className="block text-sm font-bold text-slate-100">{r.he}</span>
                            {r.en && <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{r.en}</span>}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
