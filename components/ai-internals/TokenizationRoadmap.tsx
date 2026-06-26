"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Lock, Map } from 'lucide-react';
import { ROADMAP_STEPS } from '@/app/behind-the-scenes-ai/chapter-3/tokenizer';

/**
 * מפת הדרכים: Text -> Tokens -> Token IDs -> Vectors -> Similarity -> Scores -> Probabilities.
 * רק החץ הראשון פעיל; השאר נעולים כטיזר לפרקים הבאים. בלי Tokenization אין התחלה למסלול.
 */
export const TokenizationRoadmap: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Map size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מפת הדרכים של המנוע</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">From Text to Probabilities</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2" dir="ltr">
                {ROADMAP_STEPS.map((step, i) => (
                    <React.Fragment key={step.en}>
                        {i > 0 && <ArrowLeft size={15} className="rotate-180 text-slate-600" />}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
                            className={`relative rounded-xl border px-3 py-1.5 text-center leading-tight ${
                                step.active
                                    ? 'border-violet-500/50 bg-violet-900/25'
                                    : 'border-slate-700/40 bg-slate-950/30'
                            }`}
                        >
                            <span className={`flex items-center gap-1 text-[11px] font-bold ${step.active ? 'text-violet-200' : 'text-slate-500'}`}>
                                {!step.active && <Lock size={9} />}
                                {step.he}
                            </span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{step.en}</span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-400">
                כרגע אנחנו רק בשלב הראשון: טקסט הופך לטוקנים. השלבים הבאים (מזהי טוקן, וקטורים) הם המקום שבו מודלים אמיתיים עושים את החישוב הסטטיסטי. בלי הפירוק הזה, אין בכלל התחלה למסלול.
            </p>
        </div>
    );
};
