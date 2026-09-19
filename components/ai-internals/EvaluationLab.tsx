"use client";

// ────────────────────────────────────────────────────────────────────────
// EvaluationLab - מעבדת "הערכה והכללה" של פרק 15
// (Evaluation & Generalization: שינן או הבין).
//
// הרעיון המרכזי: המודל תוקן על דוגמה אחת (אל תמציא מועד הגעה כשאין מועד במקור).
// עכשיו בודקים אם הוא מחזיק את העיקרון כשהמקרה משתנה. הלומד עובר בין חמישה מקרי
// בדיקה: מקרה מוכר, ניסוח אחר, סתירה מהלקוח, מקור חסר, וסטטוס אחר. בכל מקרה רואים
// את פניית הלקוח, את המקור, את ההתנהגות הרצויה, את תשובת המודל, ואם עבר או נכשל.
// פאנל סיכום מציג כמה מקרים עברו ואיפה הנקודה החלשה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין מדד אמיתי (benchmark),
// ואין טענה על מדיניות של מוצר מסוים. כל הנתונים תלויי-השפה מגיעים מ-data לפי locale,
// והכיוון (RTL/LTR) מ-dir. סדר המקרים נשאר קבוע כדי שהמסך לא יקפוץ. מפתחות ה-caseType
// וה-verdict מבניים בלבד.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    BadgeCheck, Repeat, AlertTriangle, FileQuestion, PackageCheck, Target,
    User, FileSearch, CheckCircle2, XCircle, Lightbulb, Gauge, History, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type {
    EvaluationLabContent, EvalCaseType, EvalVerdict,
} from '@/i18n/locales/he/behind-ai/evaluationLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface EvaluationLabProps {
    data: EvaluationLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל סוג מקרה. מבני, נגזר מ-caseType. */
const CASE_TONE: Record<EvalCaseType, { Icon: LucideIcon; cls: string }> = {
    familiar: { Icon: BadgeCheck, cls: 'border-sky-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] text-[color-mix(in_oklab,var(--color-sky-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-sky-700))]' },
    paraphrase: { Icon: Repeat, cls: 'border-violet-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)] text-[color-mix(in_oklab,var(--color-violet-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-violet-700))]' },
    contradiction: { Icon: AlertTriangle, cls: 'border-rose-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] text-[color-mix(in_oklab,var(--color-rose-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-rose-700))]' },
    missing: { Icon: FileQuestion, cls: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-[color-mix(in_oklab,var(--color-amber-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-amber-800))]' },
    newStatus: { Icon: PackageCheck, cls: 'border-teal-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-teal-950)] [--t-l:var(--color-teal-500)] text-[color-mix(in_oklab,var(--color-teal-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-teal-700))]' },
};

/** אייקון וגוון לכל תוצאה. מבני, נגזר מ-verdict. */
const VERDICT_TONE: Record<EvalVerdict, { Icon: LucideIcon; badge: string; answer: string }> = {
    pass: {
        Icon: CheckCircle2,
        badge: 'border-emerald-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-[color-mix(in_oklab,var(--color-emerald-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]',
        answer: 'border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)]',
    },
    fail: {
        Icon: XCircle,
        badge: 'border-rose-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-rose-900)] [--t-l:var(--color-rose-500)] text-[color-mix(in_oklab,var(--color-rose-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-rose-700))]',
        answer: 'border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)]',
    },
};

export const EvaluationLab: React.FC<EvaluationLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [caseId, setCaseId] = useState(data.cases[0].id);

    const active = data.cases.find((c) => c.id === caseId) ?? data.cases[0];
    const { Icon: CaseIcon, cls: caseCls } = CASE_TONE[active.caseType];
    const verdict = VERDICT_TONE[active.verdict];
    const VerdictIcon = verdict.Icon;
    const verdictLabel = active.verdict === 'pass' ? data.passLabel : data.failLabel;
    const isKnown = active.caseType === 'familiar';
    const answerLabelForCase = active.baselineAnswer ? data.improvedLabel : data.answerLabel;

    // ציון ההכללה נמדד רק על המקרים החדשים (לא כולל המוכר, שעליו כבר תוקן). מחושב מהנתונים,
    // כדי שהמונה והמכנה תמיד יתאימו למקרים בפועל ולא למספר קשיח.
    const heldOut = data.cases.filter((c) => c.caseType !== 'familiar');
    const heldOutTotal = heldOut.length;
    const heldOutPassed = heldOut.filter((c) => c.verdict === 'pass').length;
    const heldOutFailed = heldOutTotal - heldOutPassed;

    // הקראת מצב המעבדה: המטרה, הפנייה, ההתנהגות הרצויה, ההשוואה (אם יש), התוצאה, מה נחשף,
    // וסיכום ההכללה (מקרים חדשים בלבד) עם הנקודה החלשה והסתייגות.
    const stateSpeech = speakJoin(
        `${data.goalLabel}: ${data.goal}`,
        `${data.customerLabel}: ${active.customer}`,
        `${data.expectedLabel}: ${active.expected}`,
        active.baselineAnswer && `${data.baselineLabel}: ${active.baselineAnswer}`,
        `${answerLabelForCase}: ${active.modelAnswer}`,
        `${verdictLabel}. ${data.revealsLabel}: ${active.reveals}`,
        `${data.score.title}: ${heldOutPassed}/${heldOutTotal}. ${data.score.weakSpotLabel}: ${data.score.weakSpot}. ${data.score.note}`,
    );

    return (
        <div className="rounded-2xl border border-emerald-500/25 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Gauge size={18} className="text-[color-mix(in_oklab,var(--color-emerald-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── כרטיס המטרה + הדוגמה שעליה תוקן ── */}
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_oklab,var(--color-emerald-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]">
                    <Target size={13} aria-hidden /> {data.goalLabel}
                </div>
                <p className="text-[14px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{data.goal}</p>

                <div className="mt-3 rounded-lg border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-2.5">
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">{data.trainedLabel}</div>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{data.trainedCustomer}</p>
                    <div className="mt-1.5 flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[color-mix(in_oklab,var(--color-emerald-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]" aria-hidden />
                        <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-body)]">
                            <span className="text-[color-mix(in_oklab,var(--color-emerald-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]">{data.trainedAnswerLabel}: </span>{data.trainedAnswer}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── בורר מקרי הבדיקה ── */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.caseSelectLabel}</div>
            <p className="mb-2 flex items-start gap-1.5 text-[13px] leading-relaxed text-[color-mix(in_oklab,color-mix(in_oklab,var(--color-amber-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-amber-800))_90%,transparent)]">
                <AlertTriangle size={13} className="mt-0.5 shrink-0 text-[color-mix(in_oklab,var(--color-amber-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-amber-800))]" aria-hidden /> {data.findFailureHint}
            </p>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label={data.sr.caseGroup}>
                {data.cases.map((c) => {
                    const activeBtn = c.id === caseId;
                    const { Icon } = CASE_TONE[c.caseType];
                    return (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setCaseId(c.id)}
                            aria-pressed={activeBtn}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-start text-[13px] font-bold leading-tight break-words transition-colors ${activeBtn
                                ? 'border-emerald-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-[color-mix(in_oklab,var(--color-emerald-100)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            <Icon size={15} className="shrink-0" aria-hidden />
                            <span>{c.control}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── המקרה הפעיל ── */}
            <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
                role="group"
                aria-label={data.sr.caseDetail}
            >
                {/* תג הסוג + כותרת + תקציר + תג תוצאה */}
                <div className={`rounded-xl border p-3 ${caseCls}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <CaseIcon size={16} aria-hidden />
                            <span className="text-sm font-black">{active.badgeLabel}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            {isKnown && (
                                <span className="inline-flex items-center rounded-full border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-500))_40%,transparent)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-800))_50%,transparent)] px-2 py-0.5 text-[11px] font-bold text-[var(--bts-text-secondary)]">
                                    {data.notCountedBadge}
                                </span>
                            )}
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-black ${verdict.badge}`}>
                                <VerdictIcon size={12} aria-hidden /> {verdictLabel}
                            </span>
                        </span>
                    </div>
                    <div className="mt-1.5 text-[15px] font-bold leading-snug text-[var(--bts-text-bright)]">{active.title}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{active.summary}</p>
                </div>

                {/* פניית הלקוח */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">
                        <User size={12} className="text-[var(--bts-text-muted)]" aria-hidden /> {data.customerLabel}
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{active.customer}</p>
                </div>

                {/* כרטיס המקור */}
                <div className="rounded-xl border border-sky-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-sky-950)] [--t-l:var(--color-sky-500)] p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_oklab,var(--color-sky-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-sky-700))]">
                        <FileSearch size={13} aria-hidden /> {data.sourceLabel}
                    </div>
                    <p className="mb-2.5 text-[13px] leading-relaxed text-[var(--bts-text-muted)]">{data.sourceCaption}</p>
                    <dl className="space-y-1.5">
                        {active.sourceRows.map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-800))_60%,transparent)] pb-1.5 last:border-0 last:pb-0">
                                <dt className="text-[13px] font-medium text-[var(--bts-text-muted)]">{row.label}</dt>
                                <dd className={`text-[13px] font-bold ${row.missing ? 'text-[color-mix(in_oklab,color-mix(in_oklab,var(--color-amber-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-amber-800))_90%,transparent)]' : 'text-[var(--bts-text-bright)]'}`}>{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-[color-mix(in_oklab,color-mix(in_oklab,var(--color-sky-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-sky-700))_90%,transparent)]">{active.sourceNote}</p>
                </div>

                {/* ההתנהגות הרצויה */}
                <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(12%_-_var(--bts-tint-mix)_*_0.06),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_oklab,var(--color-emerald-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]">
                        <Target size={13} aria-hidden /> {data.expectedLabel}
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{active.expected}</p>
                </div>

                {/* השוואת גרסה קודמת מול משופרת: אותה פנייה, אותו קריטריון. מוצג רק כשיש baseline. */}
                {active.baselineAnswer && (
                    <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-faint)]">
                            <History size={13} aria-hidden /> {data.baselineLabel}
                        </div>
                        <p className="text-[14px] leading-relaxed text-[var(--bts-text-muted)]">{active.baselineAnswer}</p>
                    </div>
                )}

                {/* תשובת המודל, בגוון התוצאה */}
                <div className={`rounded-xl border p-3 ${verdict.answer}`}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-secondary)]">
                            <VerdictIcon size={13} className={active.verdict === 'pass' ? 'text-[color-mix(in_oklab,var(--color-emerald-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]' : 'text-[color-mix(in_oklab,var(--color-rose-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-rose-700))]'} aria-hidden /> {answerLabelForCase}
                        </span>
                        <SpeakButton text={`${answerLabelForCase}. ${active.modelAnswer}. ${verdictLabel}`} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{active.modelAnswer}</p>
                </div>

                {/* מה הבדיקה חושפת */}
                <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_oklab,var(--color-emerald-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]">
                        <Lightbulb size={13} className="text-[color-mix(in_oklab,var(--color-emerald-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]" aria-hidden /> {data.revealsLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{active.reveals}</p>
                </div>
            </motion.div>

            {/* ── פאנל סיכום ההערכה ── */}
            <div className="mt-4 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                    <Gauge size={13} className="text-[color-mix(in_oklab,var(--color-emerald-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]" aria-hidden /> {data.score.title}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-2">
                        <div className="font-mono text-xl font-black text-[var(--bts-text-body)]" dir="ltr">{heldOutTotal}</div>
                        <div className="text-[11px] text-[var(--bts-text-faint)]">{data.score.totalLabel}</div>
                    </div>
                    <div className="rounded-lg border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-2">
                        <div className="font-mono text-xl font-black text-[color-mix(in_oklab,var(--color-emerald-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))]" dir="ltr">{heldOutPassed}</div>
                        <div className="text-[11px] text-[color-mix(in_oklab,color-mix(in_oklab,var(--color-emerald-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-emerald-700))_80%,transparent)]">{data.score.passedLabel}</div>
                    </div>
                    <div className="rounded-lg border border-rose-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-2">
                        <div className="font-mono text-xl font-black text-[color-mix(in_oklab,var(--color-rose-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-rose-700))]" dir="ltr">{heldOutFailed}</div>
                        <div className="text-[11px] text-[color-mix(in_oklab,color-mix(in_oklab,var(--color-rose-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-rose-700))_80%,transparent)]">{data.score.failedLabel}</div>
                    </div>
                </div>
                <p className="mt-2.5 text-[12px] leading-relaxed text-[var(--bts-text-muted)]">{data.score.knownExcludedNote}</p>
                <div className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(12%_-_var(--bts-tint-mix)_*_0.06),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] p-2.5">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0 text-[color-mix(in_oklab,var(--color-amber-300)_calc(100%_-_var(--bts-tint-mix)),var(--color-amber-800))]" aria-hidden />
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">
                        <span className="font-bold text-[color-mix(in_oklab,var(--color-amber-200)_calc(100%_-_var(--bts-tint-mix)),var(--color-amber-800))]">{data.score.weakSpotLabel}: </span>{data.score.weakSpot}
                    </p>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--bts-text-faint)]">{data.score.note}</p>
            </div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
