// components/ai-internals/accents.ts
// מקור אמת יחיד לסגנון צבע. כל המחלקות כאן הן literal/static בלבד,
// כדי ש-Tailwind JIT יזהה אותן (אין template-strings דינמיים).

import type { Accent } from './types';

export interface AccentStyle {
    border: string;       // מסגרת רכה
    text: string;         // טקסט מודגש
    softText: string;     // טקסט משני
    bgSoft: string;       // רקע רך
    bgTint?: string;            // כמו bgSoft, עם וריאנט Light (Dark זהה)
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
        border: 'border-cyan-500/40', text: 'text-cyan-300', softText: 'text-cyan-400/70', bgSoft: 'bg-cyan-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)]',
        solid: 'bg-cyan-500', solidText: 'text-slate-950', barFill: 'bg-cyan-500', barGradient: 'bg-gradient-to-l from-cyan-400 to-blue-500',
        dot: 'bg-cyan-400', ringSoft: 'ring-cyan-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(34,211,238,0.55)]',
    },
    sky: {
        border: 'border-sky-500/40', text: 'text-sky-300', softText: 'text-sky-400/70', bgSoft: 'bg-sky-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-900)] [--t-l:var(--color-sky-500)]',
        solid: 'bg-sky-500', solidText: 'text-slate-950', barFill: 'bg-sky-500', barGradient: 'bg-gradient-to-l from-sky-400 to-blue-500',
        dot: 'bg-sky-400', ringSoft: 'ring-sky-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(56,189,248,0.55)]',
    },
    teal: {
        border: 'border-teal-500/40', text: 'text-teal-300', softText: 'text-teal-400/70', bgSoft: 'bg-teal-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-teal-900)] [--t-l:var(--color-teal-500)]',
        solid: 'bg-teal-500', solidText: 'text-slate-950', barFill: 'bg-teal-500', barGradient: 'bg-gradient-to-l from-teal-400 to-cyan-500',
        dot: 'bg-teal-400', ringSoft: 'ring-teal-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(45,212,191,0.5)]',
    },
    blue: {
        border: 'border-blue-500/40', text: 'text-blue-300', softText: 'text-blue-400/70', bgSoft: 'bg-blue-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-blue-900)] [--t-l:var(--color-blue-500)]',
        solid: 'bg-blue-500', solidText: 'text-white', barFill: 'bg-blue-500', barGradient: 'bg-gradient-to-l from-blue-400 to-indigo-500',
        dot: 'bg-blue-400', ringSoft: 'ring-blue-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(96,165,250,0.55)]',
    },
    indigo: {
        border: 'border-indigo-500/40', text: 'text-indigo-300', softText: 'text-indigo-400/70', bgSoft: 'bg-indigo-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-indigo-900)] [--t-l:var(--color-indigo-500)]',
        solid: 'bg-indigo-500', solidText: 'text-white', barFill: 'bg-indigo-500', barGradient: 'bg-gradient-to-l from-indigo-400 to-violet-500',
        dot: 'bg-indigo-400', ringSoft: 'ring-indigo-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(129,140,248,0.55)]',
    },
    violet: {
        border: 'border-violet-500/40', text: 'text-violet-300', softText: 'text-violet-400/70', bgSoft: 'bg-violet-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)]',
        solid: 'bg-violet-500', solidText: 'text-white', barFill: 'bg-violet-500', barGradient: 'bg-gradient-to-l from-violet-400 to-purple-500',
        dot: 'bg-violet-400', ringSoft: 'ring-violet-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(167,139,250,0.55)]',
    },
    purple: {
        border: 'border-purple-500/40', text: 'text-purple-300', softText: 'text-purple-400/70', bgSoft: 'bg-purple-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-purple-900)] [--t-l:var(--color-purple-500)]',
        solid: 'bg-purple-500', solidText: 'text-white', barFill: 'bg-purple-500', barGradient: 'bg-gradient-to-l from-purple-400 to-fuchsia-500',
        dot: 'bg-purple-400', ringSoft: 'ring-purple-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(192,132,252,0.55)]',
    },
    fuchsia: {
        border: 'border-fuchsia-500/40', text: 'text-fuchsia-300', softText: 'text-fuchsia-400/70', bgSoft: 'bg-fuchsia-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-fuchsia-900)] [--t-l:var(--color-fuchsia-500)]',
        solid: 'bg-fuchsia-500', solidText: 'text-white', barFill: 'bg-fuchsia-500', barGradient: 'bg-gradient-to-l from-fuchsia-400 to-purple-500',
        dot: 'bg-fuchsia-400', ringSoft: 'ring-fuchsia-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(232,121,249,0.55)]',
    },
    pink: {
        border: 'border-pink-500/40', text: 'text-pink-300', softText: 'text-pink-400/70', bgSoft: 'bg-pink-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-pink-900)] [--t-l:var(--color-pink-500)]',
        solid: 'bg-pink-500', solidText: 'text-white', barFill: 'bg-pink-500', barGradient: 'bg-gradient-to-l from-pink-400 to-rose-500',
        dot: 'bg-pink-400', ringSoft: 'ring-pink-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(244,114,182,0.55)]',
    },
    orange: {
        border: 'border-orange-500/40', text: 'text-orange-300', softText: 'text-orange-400/70', bgSoft: 'bg-orange-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-orange-900)] [--t-l:var(--color-orange-500)]',
        solid: 'bg-orange-500', solidText: 'text-slate-950', barFill: 'bg-orange-500', barGradient: 'bg-gradient-to-l from-orange-400 to-amber-500',
        dot: 'bg-orange-400', ringSoft: 'ring-orange-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(251,146,60,0.5)]',
    },
    lime: {
        border: 'border-lime-500/40', text: 'text-lime-300', softText: 'text-lime-400/70', bgSoft: 'bg-lime-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-lime-900)] [--t-l:var(--color-lime-500)]',
        solid: 'bg-lime-500', solidText: 'text-slate-950', barFill: 'bg-lime-500', barGradient: 'bg-gradient-to-l from-lime-400 to-emerald-500',
        dot: 'bg-lime-400', ringSoft: 'ring-lime-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(163,230,53,0.5)]',
    },
    amber: {
        border: 'border-amber-500/40', text: 'text-amber-300', softText: 'text-amber-400/70', bgSoft: 'bg-amber-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)]',
        solid: 'bg-amber-500', solidText: 'text-slate-950', barFill: 'bg-amber-500', barGradient: 'bg-gradient-to-l from-amber-400 to-orange-500',
        dot: 'bg-amber-400', ringSoft: 'ring-amber-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(251,191,36,0.5)]',
    },
    emerald: {
        border: 'border-emerald-500/40', text: 'text-emerald-300', softText: 'text-emerald-400/70', bgSoft: 'bg-emerald-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)]',
        solid: 'bg-emerald-500', solidText: 'text-slate-950', barFill: 'bg-emerald-500', barGradient: 'bg-gradient-to-l from-emerald-400 to-teal-500',
        dot: 'bg-emerald-400', ringSoft: 'ring-emerald-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(52,211,153,0.5)]',
    },
    rose: {
        border: 'border-rose-500/40', text: 'text-rose-300', softText: 'text-rose-400/70', bgSoft: 'bg-rose-900/15', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-900)] [--t-l:var(--color-rose-500)]',
        solid: 'bg-rose-500', solidText: 'text-white', barFill: 'bg-rose-500', barGradient: 'bg-gradient-to-l from-rose-400 to-pink-500',
        dot: 'bg-rose-400', ringSoft: 'ring-rose-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(251,113,133,0.55)]',
    },
    slate: {
        border: 'border-slate-500/40', text: 'text-slate-300', softText: 'text-slate-400/70', bgSoft: 'bg-slate-800/40', bgTint: 'bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-800))_40%,transparent)]',
        solid: 'bg-slate-500', solidText: 'text-white', barFill: 'bg-slate-500', barGradient: 'bg-gradient-to-l from-slate-400 to-slate-500',
        dot: 'bg-slate-400', ringSoft: 'ring-slate-500/20', glow: 'shadow-[0_0_45px_-10px_rgba(148,163,184,0.4)]',
    },
};
