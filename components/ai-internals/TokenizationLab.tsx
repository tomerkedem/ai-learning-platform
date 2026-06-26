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
    TOKEN_SCENARIOS,
    type TokenizationMode,
} from '@/app/behind-the-scenes-ai/chapter-3/tokenizer';

/**
 * TokenizationLab - מיכל מעבדת ה-Tokenization. מחזיק את מצב ההקלדה
 * (mode, scenario, text, selected token) ומרכיב את כל הרכיבים.
 * הטוקנייזר עצמו דטרמיניסטי ומגיע מ-tokenizer.ts; כאן רק תזמור ותצוגה.
 */
export const TokenizationLab: React.FC = () => {
    const reduce = useReducedMotion();

    const [mode, setMode] = useState<TokenizationMode>('chat');
    const [scenarioId, setScenarioId] = useState<string>(defaultScenarioFor('chat').id);
    const [text, setText] = useState<string>(defaultScenarioFor('chat').prompt);
    const [selected, setSelected] = useState<number | null>(null);

    const scenario = useMemo(() => getScenario(scenarioId) ?? TOKEN_SCENARIOS[0], [scenarioId]);
    const accent = scenario.accent as Accent;
    const a = ACCENTS[accent];

    const tokens = useMemo(() => tokenize(text), [text]);

    const sortingCenter = hasSortingCenter(tokens);
    const deliveryFailure = hasDeliveryFailure(tokens);
    const actionSignal = hasActionSignal(tokens);
    const numberSignal = hasNumber(tokens);
    const noSpaceClump = looksLikeNoSpaceClump(tokens);

    const handleMode = (m: TokenizationMode) => {
        if (m === mode) return;
        const next = defaultScenarioFor(m);
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
            {/* בקרת מצב */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between" dir="rtl">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">מצב:</span>
                    <ModeToggle mode={mode} onChange={(m) => handleMode(m as TokenizationMode)} accent={accent} />
                </div>
                {/* תווית המסלול: לאן הפירוק מזין */}
                <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 ${a.border} ${a.bgSoft}`}>
                    <Route size={15} className={a.text} />
                    <span className="leading-tight text-right">
                        <span className={`block text-xs font-bold ${a.text}`}>{scenario.routeHe}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{scenario.routeEn}</span>
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

            {/* אותות שזוהו בקלט */}
            <AnimatePresence>
                {(sortingCenter || deliveryFailure || actionSignal || numberSignal) && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        className="flex flex-wrap gap-2"
                        dir="rtl"
                    >
                        {numberSignal && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-lime-500/45 bg-lime-900/20 px-2.5 py-1 text-[11px] font-bold text-lime-300">
                                <Hash size={12} /> טוקן מספר
                                <span className="opacity-70" dir="ltr">Number token</span>
                            </span>
                        )}
                        {actionSignal && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/45 bg-violet-900/20 px-2.5 py-1 text-[11px] font-bold text-violet-300">
                                <Zap size={12} /> אות פעולה
                                <span className="opacity-70" dir="ltr">Action signal</span>
                            </span>
                        )}
                        {deliveryFailure && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/45 bg-rose-900/20 px-2.5 py-1 text-[11px] font-bold text-rose-300">
                                <Zap size={12} /> צירוף כשל מסירה
                                <span className="opacity-70" dir="ltr">Delivery failure signal</span>
                            </span>
                        )}
                        {sortingCenter && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/45 bg-cyan-900/20 px-2.5 py-1 text-[11px] font-bold text-cyan-300">
                                <MapPin size={12} /> צירוף הקשר: מרכז המיון
                                <span className="opacity-70" dir="ltr">Sorting center</span>
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* הערה למקרה של טקסט בלי רווחים: הטוקנייזר הלימודי רואה יחידה אחת */}
            <AnimatePresence>
                {noSpaceClump && (
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-900/15 p-3 text-[11px] leading-relaxed text-amber-200/90"
                        dir="rtl"
                    >
                        <Combine size={14} className="mt-0.5 shrink-0 text-amber-300" />
                        <span>
                            בלי רווחים, הטוקנייזר הלימודי הזה רואה יחידה אחת ארוכה. טוקנייזר אמיתי היה מפרק אותה בכל זאת לתת-מילים, כי הוא לא נשען רק על רווחים. זו בדיוק הסיבה שטוקן אינו בהכרח מילה.
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
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <span className="mt-0.5 shrink-0 rounded-md border border-amber-500/40 bg-amber-900/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300" dir="ltr">Educational</span>
                <span>
                    זהו טוקנייזר לימודי, לא של מודל מסחרי. השלב הזה הוא הכנה בלבד: המערכת עוד לא מחשבת הסתברות מלאה ולא עונה, היא רק מפרקת את הטקסט ליחידות עבודה. צביעת התפקידים היא עזר לימודי - מודלים אמיתיים מפרקים לפי סטטיסטיקה, לא לפי תפקיד לשוני.
                </span>
            </div>
        </div>
    );
};
