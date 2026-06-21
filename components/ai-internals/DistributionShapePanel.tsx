"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { ACCENTS } from './accents';
import { BilingualLabel } from './BilingualLabel';
import type { Accent, DistributionShape } from './types';

interface DistributionShapePanelProps {
    shape: DistributionShape;
    /** ההסתברויות (0-100) לציור צללית ההתפלגות, מסודרות מהגבוהה לנמוכה. */
    values: number[];
}

// מיפוי סטטי: צורת התפלגות -> תוויות, הסבר וגוון. הצבעים נגזרים מ-ACCENTS.
const SHAPE_INFO: Record<DistributionShape, {
    he: string; en: string; explain: string; accent: Accent;
}> = {
    sharp: {
        he: 'התפלגות חדה',
        en: 'Sharp distribution',
        explain: 'יש אפשרות מובילה ברורה שבולטת מעל כל השאר. כשהמוביל חד כל כך, המנוע יכול לענות בביטחון גבוה יותר.',
        accent: 'emerald',
    },
    close: {
        he: 'התפלגות קרובה',
        en: 'Close distribution',
        explain: 'שתי אפשרויות מובילות כמעט באותו כוח. המנוע מתלבט, ולכן עדיף לבקש עוד הקשר במקום לנחש בין השתיים.',
        accent: 'amber',
    },
    flat: {
        he: 'התפלגות מפוזרת',
        en: 'Flat distribution',
        explain: 'ההסתברות מתחלקת בין כמה אפשרויות בלי מוביל ברור. כשההתפלגות שטוחה, המנוע צריך לשאול שאלת הבהרה.',
        accent: 'purple',
    },
};

/**
 * צורת ההתפלגות (Distribution Shape): מראה אם המוביל חד, קרוב לשני, או מפוזר.
 * זהו אחד ממדי הבקרה: חד -> אפשר לענות. שטוח או קרוב -> כדאי לשאול.
 */
export const DistributionShapePanel: React.FC<DistributionShapePanelProps> = ({ shape, values }) => {
    const reduce = useReducedMotion();
    const info = SHAPE_INFO[shape];
    const a = ACCENTS[info.accent];
    const max = values.reduce((m, v) => Math.max(m, v), 0) || 1;

    return (
        <div className="flex h-full flex-col rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Activity size={16} className={a.text} />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">צורת ההתפלגות</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Distribution Shape</div>
                    </div>
                </div>
                <BilingualLabel variant="badge" he={info.he} en={info.en} accent={info.accent} />
            </div>

            {/* צללית ההתפלגות: עמודות אנכיות קטנות שמתארות את הפיזור */}
            <div className="mb-3 flex h-16 items-end justify-center gap-1.5">
                {values.map((v, i) => (
                    <motion.div
                        key={i}
                        initial={reduce ? false : { height: 0 }}
                        animate={{ height: `${Math.max(8, (v / max) * 100)}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className={`w-7 rounded-t ${i === 0 ? a.dot : 'bg-slate-600'}`}
                    />
                ))}
            </div>

            <p className="text-xs leading-relaxed text-slate-400">{info.explain}</p>
        </div>
    );
};
