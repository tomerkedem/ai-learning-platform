"use client";

// ────────────────────────────────────────────────────────────────────────
// DoesAiLearnLab - מעבדת "האם AI לומד ממני" של פרק 16 (Does AI Learn From Me).
//
// הרעיון המרכזי: המודל אמר "החבילה תגיע מחר", והמשתמש תיקן: "לא. לפי המעקב אין
// מועד הגעה מאושר." המעבדה מראה ארבע שכבות שבהן התיקון מתנהג אחרת:
//   1. אותה שיחה (הקשר נוכחי): התיקון בהקשר, אז הוא עוזר עכשיו.
//   2. שיחה חדשה: ההקשר מתחיל ריק, אין להניח שהתיקון נמצא שם.
//   3. תכונת זיכרון: העדפה שמורה (דוגמה למוצר) יכולה לחזור להקשר.
//   4. אימון או עדכון: שיפור קבוע דורש תהליך נפרד, לא הודעה אחת בשיחה.
// בכל שכבה רואים מה המודל רואה עכשיו, את תשובת המודל, מה השתנה ומה לא השתנה, ואת
// השורה התחתונה.
//
// דטרמיניסטי לחלוטין: אין אקראיות, אין קריאת מודל אמיתית, אין שרשרת חשיבה נסתרת,
// ואין טענה על מדיניות, פרטיות או אימון של מוצר מסוים. כל הטקסט תלוי-השפה מגיע
// מ-data לפי locale, והכיוון (RTL/LTR) מ-dir. סדר השכבות נשאר קבוע כדי שהמסך לא
// יקפוץ. מפתחות ה-layerType מבניים בלבד.
//
// אין בקובץ הזה מקף ארוך או מקף בינוני.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    MessageSquare, FilePlus2, Bookmark, GraduationCap, Sparkles, Eye,
    CheckCircle2, Lock, Lightbulb, User, Layers, type LucideIcon,
} from 'lucide-react';
import type { Direction, Locale } from '@/i18n/config';
import type { DoesAiLearnLabContent, LearnLayerType } from '@/i18n/locales/he/behind-ai/doesAiLearnLab';
import { DUR } from './motionTokens';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';

interface DoesAiLearnLabProps {
    data: DoesAiLearnLabContent;
    dir: Direction;
    /** שפת ההקראה של התוכן (contentLocale). ברירת מחדל: שפת הממשק. */
    speechLocale?: Locale;
}

/** אייקון וגוון לכל סוג שכבה. מבני, נגזר מ-layerType. */
const LAYER_TONE: Record<LearnLayerType, { Icon: LucideIcon; cls: string; dot: string }> = {
    sameChat: { Icon: MessageSquare, cls: 'border-emerald-400/50 bg-emerald-950/25 text-emerald-100', dot: 'bg-emerald-400' },
    newChat: { Icon: FilePlus2, cls: 'border-amber-400/50 bg-amber-950/25 text-amber-100', dot: 'bg-amber-400' },
    memory: { Icon: Bookmark, cls: 'border-violet-400/50 bg-violet-950/25 text-violet-100', dot: 'bg-violet-400' },
    training: { Icon: GraduationCap, cls: 'border-indigo-400/50 bg-indigo-950/25 text-indigo-100', dot: 'bg-indigo-400' },
};

export const DoesAiLearnLab: React.FC<DoesAiLearnLabProps> = ({ data, dir, speechLocale }) => {
    const reduce = useReducedMotion();
    const [layerId, setLayerId] = useState(data.layers[0].id);

    const active = data.layers.find((l) => l.id === layerId) ?? data.layers[0];
    const { Icon: LayerIcon, cls: layerCls } = LAYER_TONE[active.layerType];

    // הקראת מצב המעבדה: התרחיש, מה המודל רואה, תשובת המודל, מה השתנה ומה לא, והשורה התחתונה.
    const stateSpeech = speakJoin(
        `${data.heading}. ${active.badgeLabel}. ${active.title}`,
        `${data.seesLabel}: ${active.sees.join(' ')}`,
        `${data.answerLabel}: ${active.answer}`,
        `${data.changedLabel}: ${active.changed}`,
        `${data.unchangedLabel}: ${active.unchanged}`,
        `${data.takeawayLabel}: ${active.takeaway}`,
    );

    return (
        <div className="rounded-2xl border border-violet-500/25 bg-slate-900/50 p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Layers size={18} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-100">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── כרטיס התרחיש הקבוע ── */}
            <div className="mb-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3.5">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{data.scenario.label}</div>
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 shrink-0 text-violet-300" aria-hidden />
                        <p className="text-[14px] leading-relaxed text-slate-200">
                            <span className="font-bold text-violet-200">{data.scenario.aiSaidLabel}: </span>{data.scenario.aiSaid}
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <User size={14} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
                        <p className="text-[14px] leading-relaxed text-slate-200">
                            <span className="font-bold text-amber-200">{data.scenario.userCorrectionLabel}: </span>{data.scenario.userCorrection}
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden />
                        <p className="text-[14px] leading-relaxed text-slate-200">
                            <span className="font-bold text-emerald-200">{data.scenario.aiRevisedLabel}: </span>{data.scenario.aiRevised}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── בורר השכבות ── */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-slate-400">{data.layerSelectLabel}</div>
            <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4" role="group" aria-label={data.sr.layerGroup}>
                {data.layers.map((l) => {
                    const activeBtn = l.id === layerId;
                    const { Icon } = LAYER_TONE[l.layerType];
                    return (
                        <button
                            key={l.id}
                            type="button"
                            onClick={() => setLayerId(l.id)}
                            aria-pressed={activeBtn}
                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-start text-[13px] font-bold leading-tight break-words transition-colors ${activeBtn
                                ? 'border-violet-400/60 bg-violet-900/25 text-violet-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <Icon size={15} className="shrink-0" aria-hidden />
                            <span>{l.control}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── השכבה הפעילה ── */}
            <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: DUR.quick }}
                className="space-y-3"
                role="group"
                aria-label={data.sr.layerDetail}
            >
                {/* תג השכבה + כותרת + תקציר */}
                <div className={`rounded-xl border p-3 ${layerCls}`}>
                    <span className="flex items-center gap-2">
                        <LayerIcon size={16} aria-hidden />
                        <span className="text-sm font-black">{active.badgeLabel}</span>
                    </span>
                    <div className="mt-1.5 text-[15px] font-bold leading-snug text-slate-100">{active.title}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{active.summary}</p>
                </div>

                {/* מה המודל רואה עכשיו */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <Eye size={13} className="text-slate-300" aria-hidden /> {data.seesLabel}
                    </div>
                    <ul className="space-y-1.5">
                        {active.sees.map((row) => (
                            <li key={row} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-200">
                                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${LAYER_TONE[active.layerType].dot}`} aria-hidden />
                                <span>{row}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* תשובת המודל */}
                <div className="rounded-xl border border-violet-500/30 bg-violet-950/15 p-3">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-200">
                            <Sparkles size={13} className="text-violet-300" aria-hidden /> {data.answerLabel}
                        </span>
                        <SpeakButton text={`${data.answerLabel}. ${active.answer}`} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-slate-100">{active.answer}</p>
                </div>

                {/* מה השתנה / מה לא השתנה */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/12 p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                            <CheckCircle2 size={13} aria-hidden /> {data.changedLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-200">{active.changed}</p>
                    </div>
                    <div className="rounded-xl border border-slate-600/40 bg-slate-950/40 p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <Lock size={13} aria-hidden /> {data.unchangedLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-200">{active.unchanged}</p>
                    </div>
                </div>

                {/* השורה התחתונה */}
                <div className="rounded-xl border border-violet-500/30 bg-slate-950/40 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-violet-200">
                        <Lightbulb size={13} className="text-violet-300" aria-hidden /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-slate-100">{active.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{data.disclaimer}</p>
        </div>
    );
};
