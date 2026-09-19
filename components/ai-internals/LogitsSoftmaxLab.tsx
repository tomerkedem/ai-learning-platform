"use client";

// ────────────────────────────────────────────────────────────────────────
// LogitsSoftmaxLab - מעבדת Logits ו-Softmax של פרק 8.
//
// הרעיון המרכזי: לכל המשך אפשרי המודל נותן ציון גולמי (logit), ו-Softmax הופך את
// הציונים להתפלגות הסתברות שמסתכמת ל-100 אחוז. הלומד בוחר נתון הקשר (מצב A) שקובע
// את הציונים, או מכוון כל ציון ידנית בפלוס/מינוס (מצב B), ורואה את האחוזים זזים מיד.
//
// חישוב ה-Softmax כאן הוא כן ופשוט: p_i = exp(s_i) / sum(exp(s_j)), ועיגול בשיטת
// השארית הגדולה כדי שהאחוזים יסתכמו בדיוק ל-100. הציונים והאחוזים הם המחשה לימודית,
// לא פלט אמיתי של מודל.
//
// i18n: כל הטקסט והנתונים תלויי-השפה מגיעים מ-data (מילון logitsSoftmaxLab לפי locale).
// הכיוון (RTL/LTR) מגיע מ-dir. סדר ההמשכים נשאר קבוע כדי שכפתורי הפלוס/מינוס לא יקפצו
// מתחת לאצבע, וההמשך המוביל מסומן בצבע ובתגית.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Plus, Minus, RotateCcw, Percent, Crown } from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { LogitsSoftmaxLabContent } from '@/i18n/locales/he/behind-ai/logitsSoftmaxLab';
import { DUR, EASE } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

const SCORE_MIN = 0;
const SCORE_MAX = 9;

/** Softmax כן: הופך ציונים להסתברויות באחוזים שמסתכמים בדיוק ל-100 (שארית גדולה). */
function softmaxPercents(scores: number[]): number[] {
    if (scores.length === 0) return [];
    const max = Math.max(...scores);
    // מחסירים את המקסימום ליציבות נומרית, בלי לשנות את התוצאה.
    const exps = scores.map((s) => Math.exp(s - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    const raw = exps.map((e) => (e / sum) * 100);
    const floors = raw.map((v) => Math.floor(v));
    const remainder = 100 - floors.reduce((a, b) => a + b, 0);
    const byFrac = raw
        .map((v, i) => ({ i, frac: v - Math.floor(v) }))
        .sort((a, b) => b.frac - a.frac);
    const out = [...floors];
    for (let k = 0; k < remainder && k < byFrac.length; k++) out[byFrac[k].i] += 1;
    return out;
}

interface LogitsSoftmaxLabProps {
    data: LogitsSoftmaxLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

export const LogitsSoftmaxLab: React.FC<LogitsSoftmaxLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [contextId, setContextId] = useState(data.contexts[0].id);
    const ctx = data.contexts.find((c) => c.id === contextId) ?? data.contexts[0];

    // ציונים ניתנים לעריכה. מאותחלים מהנתון הנבחר, ומתאפסים אליו בכל החלפת הקשר.
    const [scores, setScores] = useState<Record<string, number>>(() => ({ ...ctx.scores }));

    const selectContext = (id: string) => {
        const next = data.contexts.find((c) => c.id === id) ?? data.contexts[0];
        setContextId(id);
        setScores({ ...next.scores });
    };

    const nudge = (id: string, delta: number) =>
        setScores((prev) => ({
            ...prev,
            [id]: Math.max(SCORE_MIN, Math.min(SCORE_MAX, (prev[id] ?? 0) + delta)),
        }));

    const resetScores = () => setScores({ ...ctx.scores });

    const dirty = data.continuations.some((c) => (scores[c.id] ?? 0) !== ctx.scores[c.id]);

    // הסתברויות לפי סדר ההמשכים הקבוע, והמוביל (האחוז הגבוה ביותר, שובר שוויון ראשון).
    const percents = useMemo(
        () => softmaxPercents(data.continuations.map((c) => scores[c.id] ?? 0)),
        [data.continuations, scores],
    );
    const leaderIndex = percents.reduce((best, v, i) => (v > percents[best] ? i : best), 0);
    const leader = data.continuations[leaderIndex];

    const fullPrompt = ctx.promptExtra ? `${ctx.promptExtra} ${data.promptBase}` : data.promptBase;

    // הקראת מצב המעבדה: הפרומפט המלא, ההמשך המוביל והאחוז שלו, וההערה של ההקשר.
    const stateSpeech = speakJoin(
        fullPrompt,
        `${data.topLabel}: ${leader.label} ${percents[leaderIndex]}${'%'}`,
        ctx.note,
    );

    return (
        <div className="rounded-2xl border border-purple-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Percent size={18} className="text-purple-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* בורר נתון ההקשר (מצב A) */}
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">{data.pickContextLabel}</div>
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={data.sr.contextGroup}>
                {data.contexts.map((c) => {
                    const active = c.id === contextId;
                    return (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => selectContext(c.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${active
                                ? 'border-purple-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(30%_-_var(--bts-tint-mix)_*_0.15),transparent)] [--t-d:var(--color-purple-900)] [--t-l:var(--color-purple-500)] text-purple-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            {c.control}
                        </button>
                    );
                })}
            </div>

            {/* הפרומפט המלא */}
            <div className="mb-3 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{data.promptLabel}</div>
                <p className="text-sm font-bold text-[var(--bts-text-bright)]">{fullPrompt}</p>
            </div>

            {/* הערת ההקשר */}
            <motion.div
                key={ctx.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="mb-5 flex items-start gap-2 rounded-xl border border-purple-500/25 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-purple-950)] [--t-l:var(--color-purple-500)] p-3 text-sm leading-relaxed text-[var(--bts-text-body)]"
            >
                <Sparkles size={15} className="mt-0.5 shrink-0 text-purple-300" />
                <span>{ctx.note}</span>
            </motion.div>

            {/* שורות ההמשכים: ציון גולמי (עם פלוס/מינוס) והסתברות */}
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">
                <span>{data.scoreLabel}</span>
                <span>{data.probabilityLabel}</span>
            </div>
            <div className="space-y-3">
                {data.continuations.map((c, i) => {
                    const isLeader = i === leaderIndex;
                    const pct = percents[i];
                    const score = scores[c.id] ?? 0;
                    return (
                        <div
                            key={c.id}
                            className={`rounded-xl border p-3 transition-colors ${isLeader
                                ? 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)]'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)]'
                                }`}
                        >
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${isLeader ? 'text-emerald-200' : 'text-[var(--bts-text-body)]'}`}>
                                    {isLeader && <Crown size={14} className="text-emerald-300" aria-hidden />}
                                    {c.label}
                                </span>
                                {isLeader && (
                                    <span className="rounded-full border border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                                        {data.topLabel}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {/* בקרת הציון הגולמי: פלוס/מינוס גדולים, ידידותיים למגע */}
                                <div className="flex shrink-0 items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => nudge(c.id, -1)}
                                        disabled={score <= SCORE_MIN}
                                        aria-label={`${data.sr.decrease} ${c.label}`}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] text-[var(--bts-text-body)] transition-colors hover:border-purple-400/50 hover:text-[var(--bts-text-primary)] disabled:opacity-35"
                                    >
                                        <Minus size={16} aria-hidden />
                                    </button>
                                    <span className="w-6 text-center font-mono text-base font-bold tabular-nums text-[var(--bts-text-bright)]" aria-hidden>{score}</span>
                                    <button
                                        type="button"
                                        onClick={() => nudge(c.id, 1)}
                                        disabled={score >= SCORE_MAX}
                                        aria-label={`${data.sr.increase} ${c.label}`}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] text-[var(--bts-text-body)] transition-colors hover:border-purple-400/50 hover:text-[var(--bts-text-primary)] disabled:opacity-35"
                                    >
                                        <Plus size={16} aria-hidden />
                                    </button>
                                </div>

                                {/* עמודת ההסתברות. הציון הגולמי כבר מוצג בגדול בבקרת הפלוס/מינוס
                                    ובכותרת העמודה, ולכן כאן נשאר רק האחוז, ליד הבר. */}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex justify-end text-xs">
                                        <span className={`font-mono tabular-nums ${isLeader ? 'font-bold text-emerald-200' : 'text-[var(--bts-text-secondary)]'}`} dir="ltr">{pct}%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_80%,transparent)]">
                                        <motion.div
                                            initial={false}
                                            animate={{ width: `${pct}%` }}
                                            transition={reduce ? { duration: 0 } : { duration: DUR.data, ease: EASE.inter }}
                                            className={`h-full rounded-full ${isLeader ? 'bg-emerald-400' : 'bg-[color-mix(in_oklab,var(--bts-text-muted)_var(--bts-tint-mix),var(--color-slate-500))]'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* מצב B: כיוון ידני + איפוס */}
            <div className="mt-4 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="text-sm font-bold text-[var(--bts-text-body)]">{data.adjustTitle}</div>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--bts-text-muted)]">{data.adjustHint}</p>
                    </div>
                    {dirty && (
                        <button
                            type="button"
                            onClick={resetScores}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-800))_40%,transparent)] px-3 py-1.5 text-xs font-bold text-[var(--bts-text-secondary)] transition-colors hover:border-purple-400/40 hover:text-[color-mix(in_oklab,var(--color-purple-200)_calc(100%_-_var(--bts-ink-darken)),black)]"
                        >
                            <RotateCcw size={12} aria-hidden /> {data.resetScores}
                        </button>
                    )}
                </div>
            </div>

            {/* איך ציונים הופכים לאחוזים */}
            <div className="mt-4 rounded-xl border border-purple-500/20 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(10%_-_var(--bts-tint-mix)_*_0.05),transparent)] [--t-d:var(--color-purple-950)] [--t-l:var(--color-purple-500)] p-3">
                <div className="mb-1 text-sm font-bold text-purple-200">{data.softmaxNoteTitle}</div>
                <p className="text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{data.softmaxNote}</p>
            </div>

            {/* הבהרות: ההמשכים כביטויים שלמים, והמספרים כהמחשה בלבד */}
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.continuationNote}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
