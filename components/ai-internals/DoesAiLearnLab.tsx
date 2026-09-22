"use client";

// ────────────────────────────────────────────────────────────────────────
// DoesAiLearnLab - מעבדת "האם AI לומד ממני" של פרק 16 (Does AI Learn From Me).
//
// הרעיון המרכזי: המודל אמר "הספרייה פתוחה בחג בין 10:00 ל-14:00", והמשתמש תיקן: "לא.
// המקור הזמין לא מציין שעות פתיחה בחג." המעבדה מראה ארבע שכבות שבהן התיקון מתנהג אחרת:
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
    sameChat: { Icon: MessageSquare, cls: 'border-emerald-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] text-emerald-100', dot: 'bg-emerald-400' },
    newChat: { Icon: FilePlus2, cls: 'border-amber-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-amber-950)] [--t-l:var(--color-amber-500)] text-amber-100', dot: 'bg-amber-400' },
    memory: { Icon: Bookmark, cls: 'border-violet-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)] text-violet-100', dot: 'bg-violet-400' },
    training: { Icon: GraduationCap, cls: 'border-indigo-400/50 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-indigo-950)] [--t-l:var(--color-indigo-500)] text-indigo-100', dot: 'bg-indigo-400' },
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
        <div className="rounded-2xl border border-violet-500/25 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* כותרת הרכיב */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Layers size={18} className="text-violet-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-bright)]">{data.heading}</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]" dir="ltr">{data.kicker}</div>
                    </div>
                </div>
                <SpeakButton text={stateSpeech} speechLocale={speechLocale} />
            </div>

            {/* ── כרטיס התרחיש הקבוע ── */}
            <div className="mb-4 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.scenario.label}</div>
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 shrink-0 text-violet-300" aria-hidden />
                        <p className="text-[14px] leading-relaxed text-[var(--bts-text-body)]">
                            <span className="font-bold text-violet-200">{data.scenario.aiSaidLabel}: </span>{data.scenario.aiSaid}
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <User size={14} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
                        <p className="text-[14px] leading-relaxed text-[var(--bts-text-body)]">
                            <span className="font-bold text-amber-200">{data.scenario.userCorrectionLabel}: </span>{data.scenario.userCorrection}
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden />
                        <p className="text-[14px] leading-relaxed text-[var(--bts-text-body)]">
                            <span className="font-bold text-emerald-200">{data.scenario.aiRevisedLabel}: </span>{data.scenario.aiRevised}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── בורר השכבות ── */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">{data.layerSelectLabel}</div>
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
                                ? 'border-violet-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(25%_-_var(--bts-tint-mix)_*_0.125),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)] text-violet-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-secondary)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
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
                initial={{ opacity: 0, y: 6 }}
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
                    <div className="mt-1.5 text-[15px] font-bold leading-snug text-[var(--bts-text-bright)]">{active.title}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--bts-text-secondary)]">{active.summary}</p>
                </div>

                {/* מה המודל רואה עכשיו */}
                <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                        <Eye size={13} className="text-[var(--bts-text-secondary)]" aria-hidden /> {data.seesLabel}
                    </div>
                    <ul className="space-y-1.5">
                        {active.sees.map((row) => (
                            <li key={row} className="flex items-start gap-2 text-[13px] leading-relaxed text-[var(--bts-text-body)]">
                                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${LAYER_TONE[active.layerType].dot}`} aria-hidden />
                                <span>{row}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* תשובת המודל */}
                <div className="rounded-xl border border-violet-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-violet-950)] [--t-l:var(--color-violet-500)] p-3">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-200">
                            <Sparkles size={13} className="text-violet-300" aria-hidden /> {data.answerLabel}
                        </span>
                        <SpeakButton text={`${data.answerLabel}. ${active.answer}`} speechLocale={speechLocale} />
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{active.answer}</p>
                </div>

                {/* מה השתנה / מה לא השתנה */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(12%_-_var(--bts-tint-mix)_*_0.06),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                            <CheckCircle2 size={13} aria-hidden /> {data.changedLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{active.changed}</p>
                    </div>
                    <div className="rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_40%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
                            <Lock size={13} aria-hidden /> {data.unchangedLabel}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{active.unchanged}</p>
                    </div>
                </div>

                {/* השורה התחתונה */}
                <div className="rounded-xl border border-violet-500/30 bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-violet-200">
                        <Lightbulb size={13} className="text-violet-300" aria-hidden /> {data.takeawayLabel}
                    </div>
                    <p className="text-[13px] font-bold leading-relaxed text-[var(--bts-text-bright)]">{active.takeaway}</p>
                </div>
            </motion.div>

            {/* הבהרה: כל הדוגמאות לימודיות בלבד */}
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--bts-text-faint)]">{data.disclaimer}</p>
        </div>
    );
};
