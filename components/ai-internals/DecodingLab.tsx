"use client";

// ────────────────────────────────────────────────────────────────────────
// DecodingLab - מעבדת Decoding של פרק 9 (Decoding: בחירת הטוקן הבא).
//
// הרעיון המרכזי: ההסתברויות כבר קיימות (זה היה פרק 8) והן קבועות כאן. הלומד משנה רק
// את סגנון הבחירה (שמרני, מאוזן, פתוח) ולוחץ "נסה בחירה נוספת", ורואה איך אותה
// התפלגות בדיוק יכולה להוביל לטוקנים שונים. שמרני נשאר על האפשרות הסבירה ביותר, פתוח
// נותן סיכוי גם לאפשרויות נמוכות יותר.
//
// הבחירה אינה אקראית: לכל סגנון יש רצף בחירות קבוע (picks). הלחיצה מתקדמת באינדקס
// לאורך הרצף, כך שהלומד רואה גיוון בלי שהבדיקות יהפכו לא יציבות. ההסתברויות והבחירות
// הן המחשה לימודית בלבד, לא פלט אמיתי של מודל, ושום סגנון אינו בודק אם ההמשך נכון.
//
// i18n: כל הטקסט והנתונים תלויי-השפה (continuations, styles, labels) מגיעים מ-data לפי
// locale. הכיוון (RTL/LTR) מגיע מ-dir. סדר ההמשכים נשאר קבוע כדי שהעמודות לא יקפצו.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SlidersHorizontal, Shuffle, Crown, Sparkles } from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { DecodingLabContent } from '@/i18n/locales/he/behind-ai/decodingLab';
import { DUR, EASE } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface DecodingLabProps {
    data: DecodingLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** שלוש משבצות רמה (יציבות או גיוון). level 1..3 מלאות. דקורטיבי, aria-hidden. */
const LevelPips: React.FC<{ level: number }> = ({ level }) => (
    <span className="inline-flex items-center gap-1" aria-hidden>
        {[1, 2, 3].map((i) => (
            <span
                key={i}
                className={`h-1.5 w-3.5 rounded-full ${i <= level ? 'bg-sky-400' : 'bg-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-700))]'}`}
            />
        ))}
    </span>
);

export const DecodingLab: React.FC<DecodingLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [styleId, setStyleId] = useState(data.styles[0].id);
    const [pickIndex, setPickIndex] = useState(0);

    const style = data.styles.find((s) => s.id === styleId) ?? data.styles[0];

    // המוביל = ההמשך עם ההסתברות הגבוהה ביותר (קבוע, שובר שוויון ראשון).
    const leaderId = data.continuations.reduce(
        (best, c) => (c.prob > (data.continuations.find((x) => x.id === best)?.prob ?? -1) ? c.id : best),
        data.continuations[0].id,
    );

    // הטוקן שנבחר לפי הרצף הקבוע של הסגנון (דטרמיניסטי).
    const selectedId = style.picks[pickIndex % style.picks.length];
    const selected = data.continuations.find((c) => c.id === selectedId) ?? data.continuations[0];
    const isTop = selectedId === leaderId;
    const why = isTop ? style.whenTop : style.whenLower;

    const selectStyle = (id: string) => {
        setStyleId(id);
        setPickIndex(0);
    };
    const replay = () => setPickIndex((i) => i + 1);

    // הקראת מצב המעבדה: הפרומפט עם ההמשך שנבחר, תווית הבחירה, ותיאור הסיבה.
    const stateSpeech = speakJoin(
        `${data.promptBase} ${selected.label}`,
        `${data.selectedLabel}: ${selected.label}`,
        why,
    );

    return (
        <div className="rounded-2xl border border-sky-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-sky-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* הפרומפט הקבוע */}
            <div className="mb-4 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{data.promptLabel}</div>
                <p className="text-sm font-bold text-[var(--bts-text-bright)]">{data.promptBase}</p>
            </div>

            {/* בורר סגנון הבחירה (מצב A) */}
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">{data.styleLabel}</div>
            <div className="mb-3 grid grid-cols-3 gap-2" role="group" aria-label={data.sr.styleGroup}>
                {data.styles.map((s) => {
                    const active = s.id === styleId;
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => selectStyle(s.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-2 py-2.5 text-center text-sm font-bold leading-tight break-words transition-colors ${active
                                ? 'border-sky-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(30%_-_var(--bts-tint-mix)_*_0.15),transparent)] [--t-d:var(--color-sky-900)] [--t-l:var(--color-sky-500)] text-sky-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            {s.control}
                        </button>
                    );
                })}
            </div>

            {/* סיכום הסגנון הפעיל: תיאור, טמפרטורה, ומדדי יציבות מול גיוון */}
            <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="mb-5 rounded-xl border border-sky-500/25 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3"
            >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-100">
                        <Sparkles size={14} className="text-sky-300" /> {style.control}
                    </span>
                </div>
                <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{style.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="inline-flex items-center gap-2 text-[12px] font-bold text-[var(--bts-text-secondary)]">
                        {data.stabilityLabel} <LevelPips level={style.stability} />
                    </span>
                    <span className="inline-flex items-center gap-2 text-[12px] font-bold text-[var(--bts-text-secondary)]">
                        {data.varietyLabel} <LevelPips level={style.variety} />
                    </span>
                </div>
            </motion.div>

            {/* ההתפלגות הקבועה: עמודות הסתברות. ההמשך שנבחר מודגש (לא בהכרח המוביל). */}
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">
                <span>{data.distributionLabel}</span>
                <span>{data.probabilityLabel}</span>
            </div>
            <div className="space-y-2.5" role="group" aria-label={data.sr.distribution}>
                {data.continuations.map((c) => {
                    const isChosen = c.id === selectedId;
                    return (
                        <div
                            key={c.id}
                            className={`rounded-xl border p-3 transition-colors ${isChosen
                                ? 'border-sky-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] ring-1 ring-sky-400/30'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)]'
                                }`}
                        >
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${isChosen ? 'text-sky-100' : 'text-[var(--bts-text-body)]'}`}>
                                    {isChosen && <Crown size={14} className="text-sky-300" aria-hidden />}
                                    {c.label}
                                </span>
                                <span className={`font-mono text-xs tabular-nums ${isChosen ? 'font-bold text-sky-200' : 'text-[var(--bts-text-muted)]'}`} dir="ltr">{c.prob}%</span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-strong)_var(--bts-tint-mix),var(--color-slate-800))_80%,transparent)]">
                                <motion.div
                                    initial={false}
                                    animate={{ width: `${c.prob}%` }}
                                    transition={reduce ? { duration: 0 } : { duration: DUR.data, ease: EASE.inter }}
                                    className={`h-full rounded-full ${isChosen ? 'bg-sky-400' : 'bg-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-500))]'}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* הטוקן שנבחר + הסבר קצר, ותחתיו כפתור הבחירה החוזרת */}
            <motion.div
                key={`${style.id}-${pickIndex}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="mt-5 rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-4"
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.selectedLabel}</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(30%_-_var(--bts-tint-mix)_*_0.15),transparent)] [--t-d:var(--color-sky-900)] [--t-l:var(--color-sky-500)] px-3 py-1 text-sm font-black text-sky-100">
                            <Crown size={14} className="text-sky-300" aria-hidden /> {selected.label}
                        </span>
                    </div>
                    <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--bts-text-body)]">
                    <span className="font-bold text-sky-200">{data.whyLabel}: </span>
                    {why}
                </p>
            </motion.div>

            <button
                type="button"
                onClick={replay}
                aria-label={data.sr.replay}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-sky-900)] [--t-l:var(--color-sky-500)] px-4 py-3 text-sm font-bold text-sky-100 transition-colors hover:bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(40%_-_var(--bts-tint-mix)_*_0.2),transparent)] [--t-d:var(--color-sky-900)] [--t-l:var(--color-sky-500)] sm:w-auto"
            >
                <Shuffle size={16} aria-hidden /> {data.replayButton}
            </button>

            {/* הבהרות: ההמשכים כביטויים שלמים, וההסתברויות והבחירות כהמחשה בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.continuationNote}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
