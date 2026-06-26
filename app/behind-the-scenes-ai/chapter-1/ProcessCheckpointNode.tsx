"use client";

// app/behind-the-scenes-ai/chapter-1/ProcessCheckpointNode.tsx
// נקודת-ביקורת עצבית (neural checkpoint) בצינור המנוע השקוף של פרק 1.
// טבעת זכוכית חיצונית + ליבה זוהרת, עם ארבעה מצבים לשימוש חוזר. הקישוט כולו
// aria-hidden; תנועה רציפה (קשת סריקה + נשימה) רק במצב current, ורק ללא
// reduced-motion. אחריות יחידה: להציג צומת בודד. אין כאן לוגיקת מנוע.

import React from 'react';
import { motion } from 'framer-motion';
import { ACCENTS } from '@/components/ai-internals/accents';
import type { Accent } from '@/components/ai-internals/types';

export type CheckpointState = 'pending' | 'active' | 'completed' | 'current';

interface ProcessCheckpointNodeProps {
    /** מצב הצומת. ברירת מחדל completed. */
    state?: CheckpointState;
    /** גוון הדגשה (תואם מצב הצ'אט/אג'נט). */
    accent?: Accent;
    /** מכבה תנועה רציפה (prefers-reduced-motion מועבר מהפאנל). */
    reduce?: boolean;
    /** אינדקס לשרשור עיכוב עדין בפעימת הכניסה החד-פעמית. */
    index?: number;
    /** תווית נגישות לא-נראית (שם השלב), לקוראי מסך בלבד. */
    label?: string;
    /** מחלקות נוספות לעטיפה החיצונית. */
    className?: string;
}

/**
 * הצומת מחליף את עיגול ה-timeline הישן. ברוח "calm": כל הצמתים הם טבעות זכוכית
 * סטטיות עם ליבה זוהרת; רק הצומת הנוכחי (החלטת המנוע) נושם ומקבל קשת סריקה.
 */
export const ProcessCheckpointNode: React.FC<ProcessCheckpointNodeProps> = ({
    state = 'completed',
    accent = 'cyan',
    reduce = false,
    index = 0,
    label,
    className = '',
}) => {
    const a = ACCENTS[accent];
    const isCurrent = state === 'current';
    const isActive = state === 'active';
    const isPending = state === 'pending';

    // גודל הליבה לפי מצב: current בולט ביותר, pending עמום וקטן.
    const coreSize = isCurrent ? 'h-3 w-3' : isActive ? 'h-2.5 w-2.5' : 'h-2 w-2';

    return (
        <span
            className={`relative flex h-7 w-7 shrink-0 items-center justify-center ${a.text} ${className}`}
            style={{ opacity: isPending ? 0.4 : 1 }}
        >
            {label && <span className="sr-only">{label}</span>}

            {/* טבעת זכוכית חיצונית */}
            <span
                aria-hidden
                className={`absolute inset-0 rounded-full border bg-slate-950/60 backdrop-blur-sm ${
                    isPending ? 'border-white/10' : a.border
                } ${isCurrent ? a.glow : ''}`}
            />

            {/* קשת סריקה מסתובבת - current בלבד, וללא reduced-motion */}
            {isCurrent && !reduce && (
                <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{
                        background:
                            'conic-gradient(from 0deg, transparent 0deg, currentColor 70deg, transparent 150deg)',
                        WebkitMask:
                            'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))',
                        opacity: 0.75,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                />
            )}

            {/* פעימת כניסה חד-פעמית (לא רציפה) - מודלקת מחדש בכל replay של הפאנל */}
            {!isPending && !reduce && (
                <motion.span
                    aria-hidden
                    className={`absolute inset-0 rounded-full ${a.solid}`}
                    initial={{ opacity: 0.4, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.9 }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: index * 0.08 }}
                />
            )}

            {/* ליבה זוהרת */}
            <motion.span
                aria-hidden
                className={`relative rounded-full ${coreSize} ${isPending ? 'bg-slate-600' : a.solid} ${
                    isCurrent ? a.glow : ''
                }`}
                animate={isCurrent && !reduce ? { scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] } : undefined}
                transition={
                    isCurrent && !reduce ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : undefined
                }
            />
        </span>
    );
};
