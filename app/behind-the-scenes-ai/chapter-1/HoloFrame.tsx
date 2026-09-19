"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion';
import type { Accent } from '@/components/ai-internals/types';

interface HoloFrameProps {
    accent: Accent;
    children: React.ReactNode;
    className?: string;
}

// זוגות RGB לכל גוון: צבע ליבה (c1) וצבע משני (c2) ל"שביט" ה-conic ולזוהר.
const HOLO: Record<Accent, { c1: string; c2: string }> = {
    cyan: { c1: '34,211,238', c2: '96,165,250' },
    sky: { c1: '56,189,248', c2: '96,165,250' },
    teal: { c1: '45,212,191', c2: '34,211,238' },
    blue: { c1: '96,165,250', c2: '129,140,248' },
    indigo: { c1: '129,140,248', c2: '167,139,250' },
    violet: { c1: '167,139,250', c2: '192,132,252' },
    purple: { c1: '192,132,252', c2: '232,121,249' },
    fuchsia: { c1: '232,121,249', c2: '192,132,252' },
    pink: { c1: '244,114,182', c2: '251,113,133' },
    rose: { c1: '251,113,133', c2: '244,63,94' },
    orange: { c1: '251,146,60', c2: '251,191,36' },
    amber: { c1: '251,191,36', c2: '249,115,22' },
    lime: { c1: '163,230,53', c2: '52,211,153' },
    emerald: { c1: '52,211,153', c2: '20,184,166' },
    slate: { c1: '148,163,184', c2: '100,116,139' },
};

// גרעין עדין (feTurbulence) כ-data-URI - מוסיף מרקם-חומר בלי תמונה חיצונית.
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")";

/**
 * עוטף "עומק הולוגרפי": מסגרת conic-gradient מסתובבת (שביט אור שסורק את המסגרת),
 * תאורת-spotlight רכה שעוקבת אחרי העכבר, וגרעין מרקם. שכבת-הצגה טהורה - אינה
 * נוגעת בתוכן או בנתונים. מכבדת reduced-motion (מסגרת סטטית, בלי spotlight).
 */
export const HoloFrame: React.FC<HoloFrameProps> = ({ accent, children, className = '' }) => {
    const reduce = useReducedMotion();
    const h = HOLO[accent];
    const ref = useRef<HTMLDivElement>(null);

    const mx = useMotionValue(-1000);
    const my = useMotionValue(-1000);
    const spot = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(${h.c1},0.13), transparent 62%)`;

    const conic = `conic-gradient(from 0deg, transparent 0%, transparent 48%, rgba(${h.c1},0) 56%, rgba(${h.c1},0.65) 74%, rgba(${h.c2},0.95) 85%, rgba(${h.c1},0.3) 91%, transparent 100%)`;

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (reduce) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
    };
    const handleLeave = () => { mx.set(-1000); my.set(-1000); };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={`relative overflow-hidden rounded-[2.05rem] p-[1.5px] ${className}`}
            style={{ background: `rgba(${h.c1},0.14)`, boxShadow: `0 0 55px -14px rgba(${h.c1},0.45)` }}
        >
            {/* מסגרת conic מסתובבת */}
            <motion.div
                aria-hidden
                className="absolute inset-[-150%]"
                style={{ background: conic }}
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            />

            {/* תוכן (מכסה את מרכז ה-conic, משאיר רק רים מואר) */}
            {/* מכשיר כהה במכוון: ה-conic/spotlight/גרעין נשענים על משטח כהה, ולכן הפנים נעולים ל-Dark בשתי הערכות. */}
            <div data-theme="dark" className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-[var(--bts-text-primary)]">
                {children}

                {/* spotlight שעוקב אחרי העכבר */}
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-30 mix-blend-screen motion-reduce:hidden"
                    style={{ background: spot }}
                />

                {/* גרעין מרקם */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-30 opacity-[0.10] mix-blend-overlay"
                    style={{ backgroundImage: GRAIN, backgroundSize: '140px 140px' }}
                />
            </div>
        </div>
    );
};
