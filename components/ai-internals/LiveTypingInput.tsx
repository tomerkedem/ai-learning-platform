"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Send, RotateCcw, Lock, Keyboard } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';

interface LiveTypingInputProps {
    text: string;
    prompt: string;
    accent: Accent;
    canSend: boolean;
    sent: boolean;
    autoTyping: boolean;
    onChange: (value: string) => void;
    onAutoType: () => void;
    onSend: () => void;
    onReset: () => void;
}

/**
 * Live Typing Engine - שדה הקלט. הקלדה חופשית בעברית RTL, אבל מודרכת:
 * כפתור "הקלידו עבורי" מקליד את הניסוי המוצע מילה-מילה כדי לראות את המנוע חי.
 * אפשר גם להקליד ידנית. עד Send הכול זמני; אחרי Send הקלט ננעל.
 */
export const LiveTypingInput: React.FC<LiveTypingInputProps> = ({
    text,
    prompt,
    accent,
    canSend,
    sent,
    autoTyping,
    onChange,
    onAutoType,
    onSend,
    onReset,
}) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 text-right" dir="rtl">
            {/* הניסוי המוצע */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                    <Keyboard size={14} className={a.text} />
                    ניסוי מוצע:
                    <span className="rounded-md bg-slate-800/70 px-2 py-0.5 font-bold text-slate-200">&quot;{prompt}&quot;</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Type it slowly</span>
            </div>

            {/* שדה הקלט */}
            <div className={`relative flex items-center rounded-xl border bg-slate-950/60 transition-colors ${sent ? `${a.border}` : 'border-slate-700/60 focus-within:border-slate-500'}`}>
                <input
                    type="text"
                    value={text}
                    disabled={sent}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="התחילו להקליד כאן..."
                    dir="rtl"
                    aria-label="שדה הקלדה למעבדת המילים"
                    className="w-full bg-transparent px-4 py-3 text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none disabled:text-slate-300"
                />
                {/* סמן מהבהב כשמקלידים אוטומטית */}
                {autoTyping && !reduce && (
                    <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className={`absolute top-1/2 h-5 w-0.5 -translate-y-1/2 ${a.solid}`}
                        style={{ insetInlineStart: '1rem' }}
                    />
                )}
                {sent && (
                    <span className={`absolute inset-y-0 left-3 flex items-center ${a.text}`}>
                        <Lock size={16} />
                    </span>
                )}
            </div>

            {/* כפתורי פעולה */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={onAutoType}
                    disabled={sent}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors disabled:opacity-40 ${a.border} ${a.bgSoft} ${a.text} hover:brightness-110`}
                >
                    <Play size={14} /> הקלידו עבורי
                    <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">Auto type</span>
                </button>

                <button
                    type="button"
                    onClick={onSend}
                    disabled={!canSend}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                        canSend
                            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25'
                            : 'cursor-not-allowed border-slate-700/60 bg-slate-800/40 text-slate-500'
                    }`}
                >
                    <Send size={14} /> שליחה
                    <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">Send</span>
                </button>

                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-200"
                >
                    <RotateCcw size={14} /> איפוס
                    <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">Reset</span>
                </button>

                {!canSend && !sent && (
                    <span className="text-[11px] text-slate-500">התחילו להקליד (או לחצו &quot;הקלידו עבורי&quot;) כדי לאפשר שליחה.</span>
                )}
            </div>
        </div>
    );
};
