"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { ROLE_STYLE, ROLE_INFO, type TokenRole } from '@/app/behind-the-scenes-ai/chapter-5/tokenRoles';

interface TokenRoleCardProps {
    text: string;
    role: TokenRole;
    onClose: () => void;
}

/**
 * כרטיס התפקיד (Role Card): נפתח בלחיצה על טוקן. התוויות הקצרות באנגלית,
 * ההסבר "למה זה חשוב" בעברית. מראה ש-token הוא לא רק טקסט אלא יחידה עם תפקיד.
 */
export const TokenRoleCard: React.FC<TokenRoleCardProps> = ({ text, role, onClose }) => {
    const reduce = useReducedMotion();
    const s = ROLE_STYLE[role];
    const info = ROLE_INFO[role];

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24 }}
            className={`relative rounded-2xl border ${s.border} ${s.bg} p-4 text-right`}
            dir="rtl"
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="סגירת כרטיס התפקיד"
                className="absolute left-3 top-3 rounded-lg border border-white/10 bg-slate-950/40 p-1 text-slate-400 transition-colors hover:text-slate-200"
            >
                <X size={14} />
            </button>

            <div className="mb-2 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                <span className="font-mono text-lg font-bold text-white">{text}</span>
            </div>

            <div className="mb-2 flex items-baseline gap-2">
                <span className={`text-sm font-bold ${s.text}`}>{info.he}</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500" dir="ltr">{info.en}</span>
            </div>

            <p className="text-sm leading-relaxed text-slate-200">{info.whyHe}</p>
        </motion.div>
    );
};
