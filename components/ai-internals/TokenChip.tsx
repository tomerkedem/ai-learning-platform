"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ROLE_STYLE, type TokenRole } from '@/app/behind-the-scenes-ai/chapter-3/tokenRoles';

interface TokenChipProps {
    text: string;
    role: TokenRole;
    onClick?: () => void;
    active?: boolean;
    /** פעימת "New token detected" לטוקן שזה עתה נוסף. */
    pulse?: boolean;
    size?: 'sm' | 'md';
}

const SIZE = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1.5 text-sm' };

/**
 * TokenChip - הצגה אחידה של טוקן צבוע לפי תפקידו. אותו צבע לכל role בכל
 * התצוגות (Stream, Color Map, Hebrew Lab). זהו אבן הבניין החזותית של הפרק.
 */
export const TokenChip: React.FC<TokenChipProps> = ({ text, role, onClick, active, pulse, size = 'md' }) => {
    const reduce = useReducedMotion();
    const s = ROLE_STYLE[role];
    const cls = `inline-flex items-center gap-1.5 rounded-lg border font-mono ${SIZE[size]} ${s.border} ${s.bg} ${s.text} ${
        active ? 'ring-2 ring-[rgb(var(--bts-fill-rgb)/0.3)]' : ''
    }`;

    const dot = <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} aria-hidden />;

    const content = (
        <>
            {dot}
            <span>{text}</span>
        </>
    );

    if (onClick) {
        return (
            <motion.button
                type="button"
                onClick={onClick}
                aria-pressed={active}
                whileTap={{ scale: reduce ? 1 : 0.94 }}
                animate={pulse && !reduce ? { scale: [1, 1.12, 1] } : undefined}
                transition={pulse && !reduce ? { duration: 0.5 } : undefined}
                className={`${cls} transition-shadow hover:brightness-110`}
            >
                {content}
            </motion.button>
        );
    }

    return <span className={cls}>{content}</span>;
};
