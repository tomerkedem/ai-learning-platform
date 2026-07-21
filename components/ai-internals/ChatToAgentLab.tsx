"use client";

// ────────────────────────────────────────────────────────────────────────
// ChatToAgentLab - מעבדת "צ'אט ל-Agent" של פרק 17 (Chat to Agent).
//
// הרעיון המרכזי: אותה בקשה בדיוק, "בדוק מה קורה עם החבילה ועדכן את הלקוח", נענית
// בארבעה מצבים:
//   1. צ'אט (תשובה בלבד): מקבל קלט ומחזיר תשובה, בלי כלי ובלי פעולה.
//   2. Agent, מידע חסר: אין מספר מעקב, אז הוא שואל במקום לנחש.
//   3. Agent, שימוש בכלי: יש מספר מעקב, אז הוא בוחר כלי מעקב ומנסח לפי התוצאה.
//   4. Agent, דרוש אישור: הצעד הבא הוא שליחה ללקוח, פעולה רגישה שנעצרת לאישור.
// בכל מצב רואים את מסלול הצעדים, כרטיס כלי או תוצאה כשרלוונטי, את הפלט, ותג הרשאה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין חיבור אמיתי למערכת
// מעקב, אין שליחת הודעה אמיתית, ואין שרשרת חשיבה נסתרת. כל הטקסט תלוי-השפה מגיע
// מ-data לפי locale, והכיוון (RTL/LTR) מ-dir. סדר המצבים נשאר קבוע כדי שהמסך לא
// יקפוץ, ומפתחות ה-modeType מבניים בלבד.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    MessageSquare, HelpCircle, Wrench, ShieldCheck, ListChecks, Lightbulb,
    ArrowLeft, ArrowRight, AlertTriangle, RotateCw, CheckCircle2, Clock, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { ChatToAgentLabContent, AgentModeType, VerificationStatus } from '@/i18n/locales/he/behind-ai/chatToAgentLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface ChatToAgentLabProps {
    data: ChatToAgentLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל סוג מצב. מבני, נגזר מ-modeType. */
const MODE_TONE: Record<AgentModeType, { Icon: LucideIcon; badge: string; step: string; dot: string }> = {
    chat: { Icon: MessageSquare, badge: 'border-sky-400/50 bg-sky-950/25 text-sky-100', step: 'border-sky-500/30 bg-sky-950/15 text-sky-100', dot: 'bg-sky-400' },
    askInfo: { Icon: HelpCircle, badge: 'border-amber-400/50 bg-amber-950/25 text-amber-100', step: 'border-amber-500/30 bg-amber-950/15 text-amber-100', dot: 'bg-amber-400' },
    toolLookup: { Icon: Wrench, badge: 'border-teal-400/50 bg-teal-950/25 text-teal-100', step: 'border-teal-500/30 bg-teal-950/15 text-teal-100', dot: 'bg-teal-400' },
    approval: { Icon: ShieldCheck, badge: 'border-rose-400/50 bg-rose-950/25 text-rose-100', step: 'border-rose-500/30 bg-rose-950/15 text-rose-100', dot: 'bg-rose-400' },
    toolError: { Icon: AlertTriangle, badge: 'border-orange-400/50 bg-orange-950/25 text-orange-100', step: 'border-orange-500/30 bg-orange-950/15 text-orange-100', dot: 'bg-orange-400' },
};

/** אייקון וגוון לכל סטטוס אימות. מבני, נגזר מ-VerificationStatus. */
const VERIFY_TONE: Record<VerificationStatus, { Icon: LucideIcon; cls: string }> = {
    passed: { Icon: CheckCircle2, cls: 'border-emerald-500/30 bg-emerald-950/15 text-emerald-100' },
    pending: { Icon: Clock, cls: 'border-amber-500/30 bg-amber-950/15 text-amber-100' },
    failed: { Icon: AlertTriangle, cls: 'border-rose-500/30 bg-rose-950/15 text-rose-100' },
};

export const ChatToAgentLab: React.FC<ChatToAgentLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [modeId, setModeId] = useState(data.modes[0].id);
    const isRtl = dir === 'rtl';
    const StepArrow = isRtl ? ArrowLeft : ArrowRight;

    const active = data.modes.find((m) => m.id === modeId) ?? data.modes[0];
    const tone = MODE_TONE[active.modeType];
    const BadgeIcon = tone.Icon;

    // הקראת מצב המעבדה: הבקשה, מסלול הצעדים, הכלי אם יש, החלטת הניסיון החוזר, הפלט,
    // ההערה, שורת האימות, והשורה התחתונה. מכסה מטרה, פעולה, תוצאה או שגיאה, ניסיון
    // חוזר, מצב האישור, אימות ותוצאה סופית.
    const verify = active.verification;
    const stateSpeech = speakJoin(
        `${data.heading}. ${data.requestLabel}: ${data.request}`,
        `${active.badgeLabel}. ${active.title}. ${active.summary}`,
        `${data.stepsLabel}: ${active.steps.join(', ')}`,
        active.tool && `${active.tool.name}. ${active.tool.resultLabel}: ${active.tool.result.join(', ')}`,
        active.retry && `${active.retry.attemptsLabel}: ${active.retry.attempts.join(' ')} ${active.retry.limitNote} ${active.retry.stopReason}`,
        `${active.outputLabel}: ${active.output}`,
        active.note,
        verify && `${data.verificationLabel}: ${data.verificationStatusLabels[verify.status]}. ${verify.text}`,
        `${data.takeawayLabel}: ${active.takeaway}`,
    );

    return (
        <div className="rounded-2xl border border-teal-500/25 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <ListChecks size={18} className="text-teal-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── כרטיס הבקשה הקבוע ── */}
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{data.requestLabel}</div>
                <p className="text-[15px] font-bold leading-relaxed text-slate-100">{data.request}</p>
            </div>

            {/* ── בורר המצבים ── */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-slate-400">{data.modeSelectLabel}</div>
            <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-5" role="group" aria-label={data.sr.modeGroup}>
                {data.modes.map((m) => {
                    const activeBtn = m.id === modeId;
                    const { Icon } = MODE_TONE[m.modeType];
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setModeId(m.id)}
                            aria-pressed={activeBtn}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-start text-[13px] font-bold leading-tight break-words transition-colors ${activeBtn
                                ? 'border-teal-400/60 bg-teal-900/25 text-teal-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <Icon size={15} className="shrink-0" aria-hidden />
                            <span dir={dir}>{m.control}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── המצב הפעיל ── */}
            <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
                role="group"
                aria-label={data.sr.modeDetail}
            >
                {/* תג ההרשאה + כותרת + תקציר */}
                <div className={`rounded-xl border p-3 ${tone.badge}`}>
                    <span className="flex items-center gap-2">
                        <BadgeIcon size={16} aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-90" dir={dir}>{data.permissionLabel}</span>
                        <span className="text-sm font-black">{active.badgeLabel}</span>
                    </span>
                    <div className="mt-1.5 text-[15px] font-bold leading-snug text-slate-100">{active.title}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{active.summary}</p>
                </div>

                {/* מסלול הצעדים */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <ListChecks size={13} className="text-slate-300" aria-hidden /> {data.stepsLabel}
                    </div>
                    <ol className="flex flex-wrap items-center gap-2">
                        {active.steps.map((step, i) => (
                            <React.Fragment key={step}>
                                <li className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-bold leading-tight ${tone.step}`}>
                                    <span className="me-1.5 font-mono text-[11px] opacity-70" dir="ltr">{i + 1}</span>
                                    {step}
                                </li>
                                {i < active.steps.length - 1 && (
                                    <StepArrow size={13} className="shrink-0 text-slate-500" aria-hidden />
                                )}
                            </React.Fragment>
                        ))}
                    </ol>
                </div>

                {/* כרטיס כלי ותוצאה, רק כשהמצב כולל שימוש בכלי */}
                {active.tool && (
                    <div className="rounded-xl border border-teal-500/30 bg-teal-950/15 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-200">
                            <Wrench size={13} className="text-teal-300" aria-hidden /> {active.tool.name}
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-300">
                            <span className="font-bold text-slate-200">{active.tool.inputLabel}: </span>
                            <span dir="ltr" className="font-mono">{active.tool.input}</span>
                        </p>
                        <div className="mt-2 rounded-lg border border-slate-700/50 bg-slate-950/50 p-2.5">
                            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{active.tool.resultLabel}</div>
                            <ul className="space-y-1">
                                {active.tool.result.map((row) => (
                                    <li key={row} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-200">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden />
                                        <span>{row}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* ניסיון חוזר וגבול, רק כשהכלי נכשל. מבחין בין תקלת כלי, החלטת התכנון והגבול. */}
                {active.retry && (
                    <div className="rounded-xl border border-orange-500/30 bg-orange-950/15 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-200">
                            <RotateCw size={13} className="text-orange-300" aria-hidden /> {active.retry.attemptsLabel}
                        </div>
                        <ul className="space-y-1">
                            {active.retry.attempts.map((row) => (
                                <li key={row} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-200">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden />
                                    <span>{row}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 text-[13px] font-bold leading-relaxed text-orange-100">{active.retry.limitNote}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{active.retry.stopReason}</p>
                    </div>
                )}

                {/* הפלט של המצב */}
                <div className={`rounded-xl border p-3 ${tone.badge}`}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider opacity-90">
                            <BadgeIcon size={13} aria-hidden /> {active.outputLabel}
                        </span>
                        <SpeakButton text={`${active.outputLabel}. ${active.output}`} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-slate-100">{active.output}</p>
                    {active.note && (
                        <p className="mt-2 border-t border-white/10 pt-2 text-[13px] leading-relaxed text-slate-300">{active.note}</p>
                    )}
                </div>

                {/* שורת האימות: האם התקבלה תוצאה נצפית שאפשר לסמוך עליה. */}
                {verify && (() => {
                    const vTone = VERIFY_TONE[verify.status];
                    const VIcon = vTone.Icon;
                    return (
                        <div className={`rounded-xl border p-3 ${vTone.cls}`}>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                                <VIcon size={14} aria-hidden />
                                <span dir={dir}>{data.verificationLabel}</span>
                                <span className="font-black">{data.verificationStatusLabels[verify.status]}</span>
                            </div>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-200">{verify.text}</p>
                        </div>
                    );
                })()}

                {/* השורה התחתונה */}
                <div className="rounded-xl border border-teal-500/30 bg-slate-950/40 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-200">
                        <Lightbulb size={13} className="text-teal-300" aria-hidden /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-slate-100">{active.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
