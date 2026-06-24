"use client";

// components/ai-internals/Mentor.tsx
// המנטור של הלומדה כרכיב יחיד וגנרי: ממפה פוזה סמנטית → קובץ נכס, מצרף בועת-דיבור
// אופציונלית, מנרמל גודל, ומכבד reduced-motion. אחריות יחידה: להציג את המנטור.
// אין כאן לוגיקת פרק — הפוזה והטקסט מגיעים מבחוץ, כך שאפשר להפוך אותו למלווה מגיב
// (למשל think→celebrate) פשוט על-ידי החלפת ה-pose לפי state של ההורה.

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type MentorPose =
    | 'hero'
    | 'think'
    | 'headsup'
    | 'celebrate'
    | 'hello'
    | 'reassure'
    | 'explain'
    | 'explain-opposite'
    | 'token'
    | 'happy'
    | 'roadmap'
    | 'inspect'
    | 'peek'
    | 'pointdown'
    | 'chart'
    | 'code'
    | 'type';

const POSE_SRC: Record<MentorPose, string> = {
    hero: '/assets/mentor-hero.png',
    think: '/assets/mentor-think.png',
    headsup: '/assets/mentor-headsup.png',
    celebrate: '/assets/mentor-celebrate.png',
    hello: '/assets/mentor-hello.png',
    reassure: '/assets/mentor-reassure.png',
    explain: '/assets/mentor-explain.png',
    'explain-opposite': '/assets/mentor-explain-opposite.png',
    token: '/assets/mentor-token.png',
    happy: '/assets/mentor-happy.png',
    roadmap: '/assets/mentor-roadmap.png',
    inspect: '/assets/mentor-inspect.png',
    peek: '/assets/mentor-peek.png',
    pointdown: '/assets/mentor-pointdown.png',
    chart: '/assets/mentor-chart.png',
    code: '/assets/mentor-code.png',
    type: '/assets/mentor-type.png',
};

// נרמול גודל: פוזות "גוף מלא" (600px) מצולמות רחוק יותר מהבוסטים (~315px), ולכן הפנים
// יוצאות קטנות יותר באותו רוחב-מסגרת. מכפיל per-pose מקרב את גודל-הראש בין הפוזות,
// כדי שהחלפת פוזה באותו slot לא "תקפיץ" את המנטור. ערך 1 = ברירת מחדל.
const POSE_SCALE: Partial<Record<MentorPose, number>> = {
    hero: 1.12,
    explain: 1.12,
    'explain-opposite': 1.12,
    token: 1.08,
    roadmap: 1.15,
    inspect: 1.12,
    pointdown: 1.12,
};

// צבע ההדגשה (הילה, בועת-דיבור, drop-shadow). ברירת המחדל מעתיקה במדויק את גווני
// הציאן המקוריים, כך שכל שימוש קיים (BTS-AI) נשאר זהה לחלוטין. לומדות אחרות יכולות
// להעביר accent משלהן (למשל אמרלד לפייתון). base/shadow הם שלשות RGB ("r g b").
export interface MentorAccent {
    /** גוון הבסיס להילה ולמסגרת הבועה (שלשת RGB, למשל "6 182 212"). */
    base: string;
    /** גוון ה-drop-shadow מתחת לדמות (שלשת RGB, למשל "34 211 238"). */
    shadow: string;
    /** צבע טקסט הבועה (כל ערך CSS תקין, למשל "#a5f3fc"). */
    text: string;
}

const CYAN_ACCENT: MentorAccent = { base: '6 182 212', shadow: '34 211 238', text: '#a5f3fc' };

export const EMERALD_ACCENT: MentorAccent = { base: '16 185 129', shadow: '52 211 153', text: '#a7f3d0' };

export interface MentorProps {
    pose?: MentorPose;
    /** טקסט בועת-דיבור. ללא טקסט — אין בועה. */
    line?: string;
    /** רוחב המסגרת בפיקסלים (הגובה אוטומטי). */
    width?: number;
    /** מראה הופכת אופקית (כיוון הצבעה הפוך / התאמת RTL). */
    flip?: boolean;
    /** ריחוף עדין. ברירת מחדל true (מכובה אוטומטית ב-reduced-motion). */
    float?: boolean;
    /** צד בועת-הדיבור ביחס לדמות. */
    bubbleSide?: 'top' | 'bottom';
    /** הילת רקע רכה. ברירת מחדל true. */
    glow?: boolean;
    /** צבע ההדגשה. ברירת מחדל ציאן (תואם BTS-AI). */
    accent?: MentorAccent;
    className?: string;
}

export const Mentor: React.FC<MentorProps> = ({
    pose = 'hero',
    line,
    width = 160,
    flip = false,
    float = true,
    bubbleSide = 'top',
    glow = true,
    accent = CYAN_ACCENT,
    className = '',
}) => {
    const reduce = useReducedMotion();
    const doFloat = float && !reduce;
    const scale = POSE_SCALE[pose] ?? 1;

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 18 }}
            className={`relative ${className}`}
            style={{ width }}
        >
            {glow && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-full blur-2xl"
                    style={{ backgroundColor: `rgb(${accent.base} / 0.15)` }}
                />
            )}

            {/* בועת-דיבור — מחוץ לעטיפת ה-flip כדי שהטקסט לא יתהפך */}
            {line && (
                <div
                    className={`absolute left-1/2 z-10 w-max max-w-[12rem] -translate-x-1/2 ${
                        bubbleSide === 'top' ? '-top-2 -translate-y-full' : '-bottom-2 translate-y-full'
                    }`}
                >
                    <div
                        className="relative rounded-2xl border bg-slate-900/95 px-3 py-2 text-center shadow-lg backdrop-blur-sm"
                        style={{ borderColor: `rgb(${accent.base} / 0.4)` }}
                        dir="rtl"
                    >
                        <p className="text-[11px] font-bold leading-snug" style={{ color: accent.text }}>{line}</p>
                        <span
                            className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-slate-900/95 ${
                                bubbleSide === 'top' ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-l border-t'
                            }`}
                            style={{ borderColor: `rgb(${accent.base} / 0.4)` }}
                        />
                    </div>
                </div>
            )}

            {/* עטיפת ה-flip סטטית (לא מונפשת) כדי לא להתנגש בטרנספורם של הריחוף */}
            <div className="relative" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
                <motion.img
                    src={POSE_SRC[pose]}
                    alt="המנטור של הלומדה"
                    animate={doFloat ? { y: [0, -10, 0] } : undefined}
                    transition={doFloat ? { repeat: Infinity, duration: 4, ease: 'easeInOut' } : undefined}
                    className="relative mx-auto block h-auto w-full object-contain"
                    style={{ scale, filter: `drop-shadow(0 15px 35px rgb(${accent.shadow} / 0.35))` }}
                    draggable={false}
                />
            </div>
        </motion.div>
    );
};
