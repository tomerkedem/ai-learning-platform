"use client";

// ────────────────────────────────────────────────────────────────────────
// ContextWindowLab - מעבדת חלון ההקשר של פרק 7 (Context Window).
//
// הרעיון המרכזי: המודל עונה לפי מה שנמצא בחלון ההקשר עכשיו, לא לפי כל מה שנאמר אי
// פעם. הלומד מזיז את מצב החלון (הפרט הקריטי בפנים, השיחה התארכה והוא בחוץ, או פרומפט
// עצמאי שמחזיר אותו) ורואה איך התשובה של המודל משתנה מיד.
//
// i18n: כל הטקסט והנתונים תלויי-השפה (messages, states, answers, labels) מגיעים מ-data
// (מילון contextWindowLab לפי locale). מיפוי הגוונים (answerTone -> צבע) הוא היחיד
// שנשאר כאן, כי הוא מבני ואינו תלוי שפה. הכיוון (RTL/LTR) מגיע מ-dir.
//
// זו המחשה לימודית של הרעיון, לא מדידה מדויקת של גבול הטוקנים. אין בקובץ הזה מקף
// ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, User, Bot, Eye, EyeOff, Sparkles, PenLine } from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { ContextWindowLabContent, AnswerTone, LabMessage } from '@/i18n/locales/he/behind-ai/contextWindowLab';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

/** מיפוי גוון התשובה -> צבעי הצ'יפ והפאנל. מבני, אינו תלוי שפה (התוויות מהמילון). */
const TONE_STYLES: Record<AnswerTone, { chip: string; panel: string }> = {
    specific: { chip: 'border-emerald-400/50 bg-emerald-900/25 text-emerald-200', panel: 'border-emerald-500/30 bg-emerald-950/15' },
    generic: { chip: 'border-amber-400/50 bg-amber-900/25 text-amber-200', panel: 'border-amber-500/30 bg-amber-950/12' },
    restored: { chip: 'border-violet-400/50 bg-violet-900/25 text-violet-200', panel: 'border-violet-500/30 bg-violet-950/15' },
};

interface ContextWindowLabProps {
    data: ContextWindowLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

export const ContextWindowLab: React.FC<ContextWindowLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [stateId, setStateId] = useState(data.states[0].id);
    const st = data.states.find((s) => s.id === stateId) ?? data.states[0];

    const findMsg = (id: string): LabMessage | undefined => data.messages.find((m) => m.id === id);
    const insideMsgs = st.visibleIds.map(findMsg).filter(Boolean) as LabMessage[];
    const outsideMsgs = data.messages.filter((m) => !st.visibleIds.includes(m.id));
    // הבלוק "מחוץ לחלון" רלוונטי רק כשהשיחה עדיין רצה (לא במצב הפרומפט העצמאי).
    const showOutside = !st.standalonePrompt && outsideMsgs.length > 0;
    const tone = TONE_STYLES[st.answerTone];

    // ── שורת הודעה בשיחה. dimmed = מחוץ לחלון (מעומעם). ──
    const MessageRow: React.FC<{ m: LabMessage; dimmed?: boolean }> = ({ m, dimmed }) => {
        const RoleIcon = m.role === 'agent' ? Bot : User;
        const sr = dimmed ? data.sr.outside : data.sr.inside;
        return (
            <div
                aria-label={`${data.roleLabels[m.role]}: ${m.text}. ${sr}`}
                className={`rounded-xl border px-3 py-2 ${
                    dimmed
                        ? 'border-slate-700/40 bg-slate-950/20 opacity-55'
                        : m.critical
                          ? 'border-emerald-400/50 bg-emerald-950/15 ring-1 ring-emerald-400/30'
                          : m.role === 'agent'
                            ? 'border-violet-500/25 bg-violet-950/15'
                            : 'border-slate-700/50 bg-slate-950/40'
                }`}
            >
                <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <RoleIcon size={12} className="text-slate-500" /> {data.roleLabels[m.role]}
                    </span>
                    {m.critical && (
                        <span className="inline-flex items-center rounded-full border border-emerald-400/50 bg-emerald-900/25 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                            {data.criticalTag}
                        </span>
                    )}
                </div>
                <p className="text-[15px] leading-relaxed text-slate-200">{m.text}</p>
            </div>
        );
    };

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={speakJoin(data.toneLabels[st.answerTone], st.answer, st.caption)} speechLocale={speechLocale} />
            </div>

            {/* בורר מצבים */}
            <p className="mb-2 flex items-center gap-1.5 text-[13px] text-slate-400">
                <PenLine size={13} className="text-violet-400" />
                {data.pickHint}
            </p>
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={data.sr.group}>
                {data.states.map((item) => {
                    const active = item.id === stateId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setStateId(item.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition-colors ${active
                                ? 'border-violet-400/60 bg-violet-900/30 text-violet-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            {item.control}
                        </button>
                    );
                })}
            </div>

            {/* חיזוי חלון ההקשר */}
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">{data.conversationLabel}</div>

            <motion.div
                key={st.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="space-y-3"
            >
                {/* מחוץ לחלון: הודעות קודמות שיצאו */}
                {showOutside && (
                    <div className="rounded-xl border border-dashed border-slate-700/60 bg-slate-950/20 p-3">
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <EyeOff size={13} /> {data.outsideLabel}
                        </div>
                        <p className="mb-2.5 text-[12px] text-slate-500">{data.earlierMessages}</p>
                        <div className="space-y-2">
                            {outsideMsgs.map((m) => (
                                <MessageRow key={m.id} m={m} dimmed />
                            ))}
                        </div>
                    </div>
                )}

                {/* בתוך החלון: מסגרת שרואה חלק מהשיחה */}
                <div className="rounded-xl border border-violet-500/40 bg-violet-950/10 p-3">
                    <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-900/20 px-2.5 py-0.5 text-[11px] font-bold text-violet-200">
                        <Eye size={13} /> {data.insideLabel}
                    </div>

                    {st.standalonePrompt ? (
                        <div className="rounded-xl border border-violet-400/50 bg-violet-950/25 p-3">
                            <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-violet-300">
                                    <PenLine size={12} /> {data.standaloneLabel}
                                </span>
                                <span className="inline-flex items-center rounded-full border border-emerald-400/50 bg-emerald-900/25 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                                    {data.criticalTag}
                                </span>
                            </div>
                            <p className="text-[15px] leading-relaxed text-slate-100">{st.standalonePrompt}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {insideMsgs.map((m) => (
                                <MessageRow key={m.id} m={m} />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* מה המודל רואה עכשיו -> התשובה */}
            <div className="mt-5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{data.modelSeesLabel}</div>
                <motion.div
                    key={`${st.id}-answer`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                    className={`rounded-xl border p-3.5 ${tone.panel}`}
                >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-200">
                                <Sparkles size={14} className="text-violet-300" /> {data.answerLabel}
                            </span>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${tone.chip}`}>
                                {data.toneLabels[st.answerTone]}
                            </span>
                        </div>
                        <SpeakButton text={speakJoin(data.answerLabel, st.answer)} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[15px] leading-relaxed text-slate-100">{st.answer}</p>
                </motion.div>
            </div>

            {/* כיתוב דינמי למצב הנבחר */}
            <motion.p
                key={`${st.id}-caption`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 rounded-xl border border-slate-700/50 bg-slate-950/30 p-3 text-[15px] leading-relaxed text-slate-300"
            >
                {st.caption}
            </motion.p>

            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
