"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Route, ChevronDown, MousePointerClick } from 'lucide-react';

import { ACCENTS } from '@/components/ai-internals/accents';
import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import type { Accent, FlowMode } from '@/components/ai-internals/types';

import { tokenize, runChatEngine, runAgentEngine } from './mockEngine';

interface DecisionTraceProps {
    text: string;
    mode: FlowMode;
    accent: Accent;
}

interface Factor {
    id: string;
    label: string;
    value: string;
}

/**
 * "עקוב אחר ההחלטה": ריחוף או נגיעה על ההחלטה הסופית מדליקים במעלה הזרם את הגורמים
 * שהובילו אליה (הטוקנים, הכוונה המובילה, הפער). "למה זה?" נענה ויזואלית, אחורה.
 * הכול נקרא מתוך אותה ריצת mockEngine - אין כאן חישוב או מספר חדש.
 */
export const DecisionTrace: React.FC<DecisionTraceProps> = ({ text, mode, accent }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    const isChat = mode === 'chat';

    const tokens = tokenize(text);

    let factors: Factor[];
    let decision;
    if (isChat) {
        const r = runChatEngine(text);
        const top = r.intents[0];
        const second = r.intents[1];
        const margin = Math.max(0, (top?.value ?? 0) - (second?.value ?? 0));
        factors = [
            { id: 'tokens', label: 'הטוקנים שנקראו', value: tokens.join(' · ') || '-' },
            { id: 'intent', label: 'הכוונה המובילה', value: `${top?.label ?? '-'} (${top?.value ?? 0}%)` },
            { id: 'margin', label: 'הפער והביטחון', value: `פער ${margin}% · ביטחון ${r.confidence}` },
        ];
        decision = r.decision;
    } else {
        const r = runAgentEngine(text);
        factors = [
            { id: 'tokens', label: 'הטוקנים שנקראו', value: tokens.join(' · ') || '-' },
            { id: 'task', label: 'המשימה שזוהתה', value: r.task },
            { id: 'gate', label: 'מידע חסר וסיכון', value: `${r.missingInfo} · סיכון ${r.risk}` },
        ];
        decision = r.decision;
    }

    const [traced, setTraced] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-1 flex items-center gap-2">
                <Route size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">עקוב אחר ההחלטה</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Trace the decision</div>
                </div>
            </div>

            <p className="mb-4 flex items-center gap-1.5 text-xs leading-relaxed text-slate-400">
                <MousePointerClick size={13} className={a.text} />
                רחפו מעל ההחלטה (או הקישו עליה) כדי להדליק אחורה את הגורמים שהובילו אליה.
            </p>

            {/* גורמי המעלה */}
            <div className="flex flex-col items-stretch gap-0">
                {factors.map((f, i) => (
                    <React.Fragment key={f.id}>
                        <div
                            className={`rounded-xl border p-3 transition-colors duration-300 ${traced ? `${a.border} ${a.bgSoft}` : 'border-white/10 bg-slate-950/40'}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className={`text-[11px] font-bold uppercase tracking-widest ${traced ? a.text : 'text-slate-500'}`}>{f.label}</span>
                                {traced && (
                                    <motion.span
                                        initial={reduce ? false : { opacity: 0, x: 6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.06 }}
                                        className={`text-[11px] font-bold ${a.text}`}
                                    >
                                        ← הוביל להחלטה
                                    </motion.span>
                                )}
                            </div>
                            <div className="mt-1 font-mono text-sm text-slate-200" dir="auto">{f.value}</div>
                        </div>
                        <div className="flex justify-center py-1" aria-hidden>
                            <ChevronDown size={15} className={`transition-colors duration-300 ${traced ? a.text : 'text-slate-700'}`} />
                        </div>
                    </React.Fragment>
                ))}

                {/* ההחלטה - נקודת המגע */}
                <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={traced}
                    aria-label="עקוב אחר הגורמים שהובילו להחלטה"
                    onPointerEnter={() => setTraced(true)}
                    onPointerLeave={() => setTraced(false)}
                    onClick={() => setTraced((v) => !v)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTraced((v) => !v); }
                    }}
                    onFocus={() => setTraced(true)}
                    onBlur={() => setTraced(false)}
                    className={`cursor-pointer rounded-2xl outline-none transition-shadow ${traced ? `ring-2 ${a.ringSoft}` : ''}`}
                >
                    <DecisionCard decision={decision} />
                </div>
            </div>
        </div>
    );
};
