"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Route, Zap, MapPin, Hash, Combine } from 'lucide-react';

import { ModeToggle } from './ModeToggle';
import { TokenSplitterInput } from './TokenSplitterInput';
import { TokenStream } from './TokenStream';
import { TokenColorLegend } from './TokenColorLegend';
import { TokenCountMeter } from './TokenCountMeter';
import { HebrewTokenLab } from './HebrewTokenLab';
import { ACCENTS } from './accents';
import type { Accent } from './types';

import {
    tokenize,
    getScenario,
    defaultScenarioFor,
    hasSortingCenter,
    hasDeliveryFailure,
    hasActionSignal,
    hasNumber,
    looksLikeNoSpaceClump,
    type TokenizationMode,
} from '@/app/behind-the-scenes-ai/chapter-3/tokenizer';
import { useChapter3Lab } from '@/app/behind-the-scenes-ai/chapter-3/labContent';
import { useT } from '@/i18n/useT';

/**
 * TokenizationLab - מיכל מעבדת ה-Tokenization. מחזיק את מצב ההקלדה
 * (mode, scenario, text, selected token) ומרכיב את כל הרכיבים.
 * הטוקנייזר עצמו דטרמיניסטי ומגיע מ-tokenizer.ts; כאן רק תזמור ותצוגה.
 */
export const TokenizationLab: React.FC = () => {
    const reduce = useReducedMotion();
    const content = useChapter3Lab();
    const { dir } = useT();
    const scenarios = content.scenarios;

    const [mode, setMode] = useState<TokenizationMode>('chat');
    const [scenarioId, setScenarioId] = useState<string>(defaultScenarioFor('chat', scenarios).id);
    const [text, setText] = useState<string>(defaultScenarioFor('chat', scenarios).prompt);
    const [selected, setSelected] = useState<number | null>(null);

    const scenario = useMemo(() => getScenario(scenarioId, scenarios) ?? scenarios[0], [scenarioId, scenarios]);
    const accent = scenario.accent as Accent;
    const a = ACCENTS[accent];

    const tokens = useMemo(() => tokenize(text, content.roleWords), [text, content.roleWords]);

    const sortingCenter = hasSortingCenter(tokens, content.sortingCenter);
    const deliveryFailure = hasDeliveryFailure(tokens, content.deliveryFailure);
    const actionSignal = hasActionSignal(tokens);
    const numberSignal = hasNumber(tokens);
    const noSpaceClump = looksLikeNoSpaceClump(tokens);

    const handleMode = (m: TokenizationMode) => {
        if (m === mode) return;
        const next = defaultScenarioFor(m, scenarios);
        setMode(m);
        setScenarioId(next.id);
        setText(next.prompt);
        setSelected(null);
    };

    const handleChange = (value: string) => {
        setText(value);
        setSelected(null);
    };

    const handleReset = () => {
        setText('');
        setSelected(null);
    };

    return (
        <div className="space-y-4">
            {/* בקרות המעבדה (מצב + שדה קלט + הצעות) נשארות דביקות בראש בזמן גלילה, כדי
                לראות את פירוק הטוקנים למטה בלי לגלול חזרה למעלה. */}
            <div
                className="sticky z-20 space-y-3 rounded-2xl bg-[color-mix(in_oklab,var(--bts-panel-to)_80%,transparent)] p-2 backdrop-blur-md"
                style={{ top: 'var(--bts-sticky-top, 88px)' }}
                dir={dir}
            >
            {/* בקרת מצב */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-4 sm:flex-row sm:items-center sm:justify-between" dir={dir}>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--bts-text-muted)]">{content.modeLabel}</span>
                    <ModeToggle mode={mode} onChange={(m) => handleMode(m as TokenizationMode)} accent={accent} />
                </div>
                {/* תווית המסלול: לאן הפירוק מזין */}
                <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 ${a.border} ${a.bgTint}`}>
                    <Route size={15} className={a.text} />
                    <span className="leading-tight text-start">
                        <span className={`block text-xs font-bold ${a.text}`}>{scenario.routeHe}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-[var(--bts-text-faint)]" dir="ltr">{scenario.routeEn}</span>
                    </span>
                </div>
            </div>

            {/* שדה ההקלדה */}
            <TokenSplitterInput
                text={text}
                accent={accent}
                examples={scenario.examples}
                onChange={handleChange}
                onReset={handleReset}
            />
            </div>

            {/* אותות שזוהו בקלט */}
            <AnimatePresence>
                {(sortingCenter || deliveryFailure || actionSignal || numberSignal) && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : undefined}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        className="flex flex-wrap gap-2"
                        dir={dir}
                    >
                        {numberSignal && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-lime-500/45 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-lime-900)] [--t-l:var(--color-lime-500)] px-2.5 py-1 text-[11px] font-bold text-lime-300">
                                <Hash size={12} /> {content.signals.number.label}
                                <span className="opacity-70" dir="ltr">{content.signals.number.en}</span>
                            </span>
                        )}
                        {actionSignal && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/45 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)] px-2.5 py-1 text-[11px] font-bold text-violet-300">
                                <Zap size={12} /> {content.signals.action.label}
                                <span className="opacity-70" dir="ltr">{content.signals.action.en}</span>
                            </span>
                        )}
                        {deliveryFailure && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/45 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-rose-900)] [--t-l:var(--color-rose-500)] px-2.5 py-1 text-[11px] font-bold text-rose-300">
                                <Zap size={12} /> {content.signals.deliveryFailure.label}
                                <span className="opacity-70" dir="ltr">{content.signals.deliveryFailure.en}</span>
                            </span>
                        )}
                        {sortingCenter && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/45 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-cyan-900)] [--t-l:var(--color-cyan-500)] px-2.5 py-1 text-[11px] font-bold text-cyan-300">
                                <MapPin size={12} /> {content.signals.sortingCenter.label}
                                <span className="opacity-70" dir="ltr">{content.signals.sortingCenter.en}</span>
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* הערה למקרה של טקסט בלי רווחים: הטוקנייזר הלימודי רואה יחידה אחת */}
            <AnimatePresence>
                {noSpaceClump && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0 } : undefined}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] p-3 text-[11px] leading-relaxed text-amber-200/90"
                        dir={dir}
                    >
                        <Combine size={14} className="mt-0.5 shrink-0 text-amber-300" />
                        <span>
                            {content.noSpaceNote}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* לוח הבקרה */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <TokenStream tokens={tokens} accent={accent} selectedIndex={selected} onSelect={setSelected} />
                </div>
                <div className="lg:col-span-1">
                    <TokenCountMeter count={tokens.length} accent={accent} />
                </div>
            </div>

            {/* מפת הצבעים */}
            <TokenColorLegend />

            {/* מעבדת הטוקנים העברית */}
            <HebrewTokenLab />

            {/* הערת שקיפות */}
            <div className="flex items-start gap-2 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4 text-[11px] leading-relaxed text-[var(--bts-text-faint)]" dir={dir}>
                <span className="mt-0.5 shrink-0 rounded-md border border-amber-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] px-1.5 py-0.5 text-[9px] font-bold text-amber-300" dir="ltr">{content.educational.badge}</span>
                <span>
                    {content.educational.note}
                </span>
            </div>
        </div>
    );
};
