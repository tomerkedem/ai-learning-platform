"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScanSearch } from 'lucide-react';
import { ProbabilityBars } from './ProbabilityBars';
import { ACCENTS } from './accents';
import type { Accent, IntentProbability, RequestType } from './types';

interface RequestTypeDetectorProps {
    /** סוג הבקשה שזוהה - לא החלטת ניתוב. */
    requestType: RequestType;
    /** הסתברויות סוגי הבקשה. */
    typeScores: IntentProbability[];
    accent: Accent;
    /** טקסט הסבר קצר מתחת לכותרת. */
    helper?: string;
}

// מיפוי סטטי: סוג הבקשה (מושג אנגלי) -> תווית עברית ראשית.
const TYPE_HE: Record<RequestType, string> = {
    'General question': 'שאלה כללית',
    'Specific investigation': 'בקשת בדיקה ספציפית',
    'Action request': 'בקשת פעולה',
};

/**
 * Request Type Detector: מזהה את *סוג הבקשה* בלבד.
 * מופרד במכוון מ-Route Switchboard שמציג את החלטת הניתוב.
 */
export const RequestTypeDetector: React.FC<RequestTypeDetectorProps> = ({ requestType, typeScores, accent, helper }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center gap-2">
                <ScanSearch size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">זיהוי סוג הבקשה</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Request Type Detector</div>
                </div>
            </div>

            {helper && <p className="mb-4 text-xs leading-relaxed text-slate-400">{helper}</p>}

            <motion.div
                key={requestType}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 inline-flex flex-col rounded-xl border px-3 py-1.5 leading-tight ${a.border} ${a.bgSoft} ${a.text}`}
            >
                <span className="text-sm font-bold">{TYPE_HE[requestType]}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide opacity-70" dir="ltr">{requestType}</span>
            </motion.div>

            <div className="mb-2 leading-tight">
                <div className="text-xs font-semibold text-slate-300">עד כמה כל פירוש מתאים</div>
                <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500" dir="ltr">Request type probabilities</div>
            </div>
            <ProbabilityBars items={typeScores} accent={accent} />
        </div>
    );
};
