"use client";

import React from 'react';
import { Keyboard, RotateCcw } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import type { TokenExample } from '@/app/behind-the-scenes-ai/chapter-5/tokenizer';

interface TokenSplitterInputProps {
    text: string;
    accent: Accent;
    examples: TokenExample[];
    onChange: (value: string) => void;
    onReset: () => void;
}

/**
 * Token Splitter - שדה הקלט. הקלדה חופשית בעברית RTL מתפרקת לטוקנים מיידית.
 * כפתורי ניסוי מהירים ממלאים דוגמאות (בסיס, עם הקשר, פיסוק, מקף).
 */
export const TokenSplitterInput: React.FC<TokenSplitterInputProps> = ({
    text,
    accent,
    examples,
    onChange,
    onReset,
}) => {
    const a = ACCENTS[accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 text-right" dir="rtl">
            <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                <Keyboard size={14} className={a.text} />
                הקלידו משפט, והוא יתפרק לטוקנים בזמן אמת.
            </div>

            <div className={`flex items-center rounded-xl border bg-slate-950/60 transition-colors ${a.border}`}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="לדוגמה: החבילה לא הגיעה"
                    dir="rtl"
                    aria-label="שדה הקלדה לפירוק טוקנים"
                    className="w-full bg-transparent px-4 py-3 text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none"
                />
            </div>

            {/* ניסויים מהירים */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">ניסויים מהירים:</span>
                {examples.map((ex) => {
                    const active = ex.text === text;
                    return (
                        <button
                            key={ex.text}
                            type="button"
                            onClick={() => onChange(ex.text)}
                            aria-pressed={active}
                            className={`rounded-lg border px-2.5 py-1 text-right leading-tight transition-colors ${
                                active ? `${a.border} ${a.bgSoft}` : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                            }`}
                        >
                            <span className={`block text-[11px] font-bold ${active ? a.text : 'text-slate-300'}`}>{ex.labelHe}</span>
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{ex.labelEn}</span>
                        </button>
                    );
                })}
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1.5 text-[11px] font-bold text-slate-400 transition-colors hover:text-slate-200"
                >
                    <RotateCcw size={12} /> איפוס
                </button>
            </div>
        </div>
    );
};
