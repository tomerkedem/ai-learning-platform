"use client";

import React from 'react';
import { Keyboard, RotateCcw } from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import type { TokenExample } from '@/app/(course)/behind-the-scenes-ai/chapter-3/tokenizer';
import { useChapter3Lab } from '@/app/(course)/behind-the-scenes-ai/chapter-3/labContent';
import { useT } from '@/i18n/useT';

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
    const { splitter } = useChapter3Lab();
    const { dir } = useT();

    return (
        <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-4 text-start" dir={dir}>
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--bts-text-muted)]">
                <Keyboard size={14} className={a.text} />
                {splitter.hint}
            </div>

            <div className={`flex items-center rounded-xl border bg-[color-mix(in_oklab,var(--bts-panel-to)_60%,transparent)] transition-colors ${a.border}`}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={splitter.placeholder}
                    dir={dir}
                    aria-label={splitter.aria}
                    className="w-full bg-transparent px-4 py-3 text-lg font-medium text-[var(--bts-text-primary)] placeholder:text-[var(--bts-text-subtle)] focus:outline-none"
                />
            </div>

            {/* ניסויים מהירים */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[var(--bts-text-faint)]">{splitter.quickLabel}</span>
                {examples.map((ex) => {
                    const active = ex.text === text;
                    return (
                        <button
                            key={ex.text}
                            type="button"
                            onClick={() => onChange(ex.text)}
                            aria-pressed={active}
                            className={`rounded-lg border px-2.5 py-1 text-start leading-tight transition-colors ${
                                active ? `${a.border} ${a.bgTint}` : 'border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(40%_+_var(--bts-tint-mix)_*_0.6),transparent)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                            }`}
                        >
                            <span className={`block text-[11px] font-bold ${active ? a.text : 'text-[var(--bts-text-secondary)]'}`}>{ex.labelHe}</span>
                            <span className="block text-[8px] uppercase tracking-wider text-[var(--bts-text-faint)]" dir="ltr">{ex.labelEn}</span>
                        </button>
                    );
                })}
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(40%_+_var(--bts-tint-mix)_*_0.6),transparent)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--bts-text-muted)] transition-colors hover:text-[var(--bts-text-body)]"
                >
                    <RotateCcw size={12} /> {splitter.resetLabel}
                </button>
            </div>
        </div>
    );
};
