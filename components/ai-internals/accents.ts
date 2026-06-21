// components/ai-internals/accents.ts
// מקור אמת יחיד לסגנון צבע. כל המחלקות כאן הן literal/static בלבד,
// כדי ש-Tailwind JIT יזהה אותן (אין template-strings דינמיים).

import type { Accent } from './types';

export interface AccentStyle {
    border: string;       // מסגרת רכה
    text: string;         // טקסט מודגש
    softText: string;     // טקסט משני
    bgSoft: string;       // רקע רך
    solid: string;        // רקע מלא (כפתורים/בועות)
    solidText: string;    // טקסט מעל רקע מלא
    barFill: string;      // מילוי עמודה אחיד
    barGradient: string;  // מילוי עמודה כגרדיאנט
    dot: string;          // נקודת מצב
    ringSoft: string;     // טבעת הדגשה
    glow: string;         // הילת זוהר (box-shadow)
}

export const ACCENTS: Record<Accent, AccentStyle> = {
    cyan: {
        border: 'border-cyan-500/40', text: 'text-cyan-300', softText: 'text-cyan-400/70', bgSoft: 'bg-cyan-900/15',
        solid: 'bg-cyan-500', solidText: 'text-slate-950', barFill: 'bg-cyan-500', barGradient: 'bg-gradient-to-l from-cyan-400 to-blue-500',
        dot: 'bg-cyan-400', ringSoft: 'ring-cyan-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(34,211,238,0.55)]',
    },
    blue: {
        border: 'border-blue-500/40', text: 'text-blue-300', softText: 'text-blue-400/70', bgSoft: 'bg-blue-900/15',
        solid: 'bg-blue-500', solidText: 'text-white', barFill: 'bg-blue-500', barGradient: 'bg-gradient-to-l from-blue-400 to-indigo-500',
        dot: 'bg-blue-400', ringSoft: 'ring-blue-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(96,165,250,0.55)]',
    },
    indigo: {
        border: 'border-indigo-500/40', text: 'text-indigo-300', softText: 'text-indigo-400/70', bgSoft: 'bg-indigo-900/15',
        solid: 'bg-indigo-500', solidText: 'text-white', barFill: 'bg-indigo-500', barGradient: 'bg-gradient-to-l from-indigo-400 to-violet-500',
        dot: 'bg-indigo-400', ringSoft: 'ring-indigo-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(129,140,248,0.55)]',
    },
    purple: {
        border: 'border-purple-500/40', text: 'text-purple-300', softText: 'text-purple-400/70', bgSoft: 'bg-purple-900/15',
        solid: 'bg-purple-500', solidText: 'text-white', barFill: 'bg-purple-500', barGradient: 'bg-gradient-to-l from-purple-400 to-fuchsia-500',
        dot: 'bg-purple-400', ringSoft: 'ring-purple-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(192,132,252,0.55)]',
    },
    amber: {
        border: 'border-amber-500/40', text: 'text-amber-300', softText: 'text-amber-400/70', bgSoft: 'bg-amber-900/15',
        solid: 'bg-amber-500', solidText: 'text-slate-950', barFill: 'bg-amber-500', barGradient: 'bg-gradient-to-l from-amber-400 to-orange-500',
        dot: 'bg-amber-400', ringSoft: 'ring-amber-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(251,191,36,0.5)]',
    },
    emerald: {
        border: 'border-emerald-500/40', text: 'text-emerald-300', softText: 'text-emerald-400/70', bgSoft: 'bg-emerald-900/15',
        solid: 'bg-emerald-500', solidText: 'text-slate-950', barFill: 'bg-emerald-500', barGradient: 'bg-gradient-to-l from-emerald-400 to-teal-500',
        dot: 'bg-emerald-400', ringSoft: 'ring-emerald-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(52,211,153,0.5)]',
    },
    rose: {
        border: 'border-rose-500/40', text: 'text-rose-300', softText: 'text-rose-400/70', bgSoft: 'bg-rose-900/15',
        solid: 'bg-rose-500', solidText: 'text-white', barFill: 'bg-rose-500', barGradient: 'bg-gradient-to-l from-rose-400 to-pink-500',
        dot: 'bg-rose-400', ringSoft: 'ring-rose-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(251,113,133,0.55)]',
    },
    slate: {
        border: 'border-slate-500/40', text: 'text-slate-300', softText: 'text-slate-400/70', bgSoft: 'bg-slate-800/40',
        solid: 'bg-slate-500', solidText: 'text-white', barFill: 'bg-slate-500', barGradient: 'bg-gradient-to-l from-slate-400 to-slate-500',
        dot: 'bg-slate-400', ringSoft: 'ring-slate-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(148,163,184,0.4)]',
    },
};
