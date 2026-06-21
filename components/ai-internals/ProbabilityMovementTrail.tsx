"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { ACCENTS } from './accents';
import { candidateById, type WordScenario, type CandidateId } from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

interface ProbabilityMovementTrailProps {
    scenario: WordScenario;
    /** עד איזה שלב לצייר (כולל). -1 = ריק. */
    stepIndex: number;
}

const W = 320;
const H = 130;
const MX = 28;
const MY = 18;

/**
 * Probability Movement Trail: sparkline כפול שמראה איך שתי אפשרויות נעות
 * לאורך המשפט. רואים את ההיפוך במבט אחד (אחת עולה בזמן שהשנייה יורדת).
 * הקווים מצטיירים בהדרגה ככל שמתקדמים בציר הזמן.
 */
export const ProbabilityMovementTrail: React.FC<ProbabilityMovementTrailProps> = ({ scenario, stepIndex }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[scenario.accent];
    const steps = scenario.steps;
    const n = steps.length;

    const x = (i: number) => MX + (n > 1 ? (i / (n - 1)) * (W - 2 * MX) : 0);
    const y = (p: number) => H - MY - (p / 100) * (H - 2 * MY);

    const visible = Math.max(0, stepIndex + 1); // כמה נקודות להציג

    const lines: { id: CandidateId; color: string; stroke: string }[] = [
        { id: scenario.trail[0], color: 'text-emerald-300', stroke: 'rgb(52,211,153)' },
        { id: scenario.trail[1], color: 'text-rose-300', stroke: 'rgb(251,113,133)' },
    ];

    const pathFor = (id: CandidateId) =>
        steps
            .slice(0, visible)
            .map((s, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(s.probabilities[id]).toFixed(1)}`)
            .join(' ');

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-1 flex items-center gap-2">
                <TrendingUp size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מסלול תנועת ההסתברות</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Probability Movement Trail</div>
                </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-slate-400">
                שני קווים במקביל: אחד עולה בזמן שהשני יורד. כך רואים את ההיפוך לאורך המשפט.
            </p>

            {/* מקרא */}
            <div className="mb-2 flex flex-wrap gap-3 text-[11px]" dir="rtl">
                {lines.map((ln) => (
                    <span key={ln.id} className="inline-flex items-center gap-1.5">
                        <span className="inline-block h-2 w-4 rounded-full" style={{ backgroundColor: ln.stroke }} />
                        <span className={ln.color}>{candidateById(ln.id).he}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{candidateById(ln.id).en}</span>
                    </span>
                ))}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="מסלול תנועת ההסתברות">
                {/* קווי עזר אופקיים */}
                {[0, 50, 100].map((p) => (
                    <g key={p}>
                        <line x1={MX} y1={y(p)} x2={W - MX} y2={y(p)} stroke="rgb(51,65,85)" strokeWidth="0.5" strokeDasharray="3 3" />
                        <text x={MX - 6} y={y(p) + 3} textAnchor="end" fontSize="8" fill="rgb(100,116,139)">{p}</text>
                    </g>
                ))}

                {visible >= 1 && lines.map((ln) => (
                    <g key={ln.id}>
                        <motion.path
                            key={`${ln.id}-${visible}`}
                            d={pathFor(ln.id)}
                            fill="none"
                            stroke={ln.stroke}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
                        />
                        {steps.slice(0, visible).map((s, i) => (
                            <motion.circle
                                key={i}
                                cx={x(i)}
                                cy={y(s.probabilities[ln.id])}
                                r={i === visible - 1 ? 4 : 2.5}
                                fill={ln.stroke}
                                initial={reduce ? false : { scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 18, delay: i * 0.05 }}
                            />
                        ))}
                        {/* תווית הערך בנקודה האחרונה */}
                        {visible >= 1 && (
                            <text
                                x={x(visible - 1)}
                                y={y(steps[visible - 1].probabilities[ln.id]) - 8}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="bold"
                                fill={ln.stroke}
                            >
                                {steps[visible - 1].probabilities[ln.id]}%
                            </text>
                        )}
                    </g>
                ))}

                {/* תוויות השלבים על ציר ה-X */}
                {steps.slice(0, visible).map((s, i) => (
                    <text key={i} x={x(i)} y={H - 4} textAnchor="middle" fontSize="8" fill="rgb(100,116,139)">
                        {i + 1}
                    </text>
                ))}
            </svg>

            {visible === 0 && (
                <p className="text-center text-xs text-slate-500">הקווים יצוירו ככל שתקלידו מילים.</p>
            )}
        </div>
    );
};
