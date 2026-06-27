"use client";

// ────────────────────────────────────────────────────────────────────────
// InputComparisonLab - מעבדת השוואת הקלט של פרק 2 (מה באמת נכנס למודל).
//
// הלומד בוחר אחד מכמה ניסוחים של אותו צורך, ורואה מה נכנס למודל בפועל: מה מפורש,
// מה חסר, מה השתנה, רמת העמימות, מה מצופה, האם דרוש מידע חיצוני, ולאן זה נוטה
// (Chat או Agent). המסר: אותו רצון, מנוסח אחרת, מכניס למודל חומר אחר לעבוד איתו.
//
// הפרק לא מלמד טוקניזציה לעומק. יש רק רמיזה אחת קצרה. אין מקף ארוך, מקף בינוני
// או נקודה-פסיק בתוך טקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, MinusCircle, ArrowLeftRight, Gauge, Target, Database, Split, Info, MousePointerClick } from 'lucide-react';

import { useT } from '@/i18n/useT';
import { StickyContextBar, type ContextTone } from './StickyContextBar';
import { BASE_ID, type Ambiguity, type Tendency } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

// גוון הצ׳יפ של רמת העמימות (מבני; התווית עברה למילון chapter2Visuals.inputLab.ambiguityLabels).
const AMBIGUITY_CHIP: Record<Ambiguity, string> = {
    low: 'border-emerald-400/40 bg-emerald-900/20 text-emerald-200',
    medium: 'border-amber-400/40 bg-amber-900/20 text-amber-200',
    high: 'border-rose-400/40 bg-rose-900/20 text-rose-200',
};

// גוון הצ׳יפ והטון של הנטייה (מבני; התווית עברה למילון chapter2Visuals.inputLab.tendencyLabels).
const TENDENCY_CHIP: Record<Tendency, { chip: string; tone: ContextTone }> = {
    chat: { chip: 'border-sky-400/40 bg-sky-900/20 text-sky-200', tone: 'neutral' },
    'chat-agent': { chip: 'border-indigo-400/40 bg-indigo-900/20 text-indigo-200', tone: 'caution' },
    agent: { chip: 'border-violet-400/40 bg-violet-900/20 text-violet-200', tone: 'caution' },
};

/** כרטיס שדה בודד בלוח הקריאה. */
const Field: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-3.5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {icon} {title}
        </div>
        <div className="text-sm leading-relaxed text-slate-200">{children}</div>
    </div>
);

export const InputComparisonLab: React.FC = () => {
    const reduce = useReducedMotion();
    const { t } = useT();
    const viz = t.behindAi.chapter2.visuals.inputLab;
    const variations = t.behindAi.chapter2.visuals.inputVariations;
    const [id, setId] = useState(BASE_ID);
    const v = variations.find((x) => x.id === id) ?? variations[0];
    const isBase = v.id === BASE_ID;
    const tnd = TENDENCY_CHIP[v.tendency];
    const tndLabel = viz.tendencyLabels[v.tendency];
    const ambChip = AMBIGUITY_CHIP[v.ambiguity];
    const ambLabel = viz.ambiguityLabels[v.ambiguity];

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/50 p-5 text-right" dir="rtl">
            {/* רמיזה קצרה לטוקניזציה, בלי ללמד אותה כאן */}
            <p className="mb-4 rounded-xl border border-slate-700/40 bg-slate-950/30 p-3 text-xs leading-relaxed text-slate-400">
                {viz.tokenizationHint}
            </p>

            {/* בורר ניסוחים */}
            <p className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
                <MousePointerClick size={13} className="text-violet-400" />
                {viz.pickerHint}
            </p>
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={viz.pickerAria}>
                {variations.map((item) => {
                    const active = item.id === id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setId(item.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition-colors ${active
                                ? 'border-violet-400/60 bg-violet-900/30 text-violet-100'
                                : 'border-slate-700/50 bg-slate-950/30 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* פס הקשר דביק: הניסוח הפעיל והנטייה שלו, נשאר גלוי תוך כדי קריאת הלוח */}
            <StickyContextBar
                inputText={v.prompt}
                labelHe={v.label}
                decisionHe={tndLabel}
                tone={tnd.tone}
                metricHe={`${viz.ambiguityPrefix} ${ambLabel}`}
                reduce={!!reduce}
            />

            {/* לוח הקריאה */}
            <motion.div
                key={v.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
                <Field icon={<Check size={13} className="text-emerald-300" />} title={viz.fields.explicit}>
                    <ul className="space-y-1">
                        {v.explicit.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                </Field>

                <Field icon={<MinusCircle size={13} className="text-amber-300" />} title={viz.fields.missing}>
                    <ul className="space-y-1">
                        {v.missing.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                </Field>

                <Field icon={<ArrowLeftRight size={13} className="text-violet-300" />} title={viz.fields.changed}>
                    {isBase ? <span className="text-slate-400">{viz.baseComparison}</span> : v.changed}
                </Field>

                <Field icon={<Gauge size={13} className="text-slate-300" />} title={viz.fields.ambiguity}>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${ambChip}`}>{ambLabel}</span>
                </Field>

                <Field icon={<Target size={13} className="text-cyan-300" />} title={viz.fields.expectation}>
                    {v.expectation}
                </Field>

                <Field icon={<Database size={13} className="text-slate-300" />} title={viz.fields.external}>
                    {v.externalData ? (
                        <span>
                            <span className="font-bold text-violet-200">{viz.externalYes}</span> {v.externalNote}
                        </span>
                    ) : (
                        <span className="text-slate-400">{viz.externalNo}</span>
                    )}
                </Field>

                <Field icon={<Split size={13} className="text-slate-300" />} title={viz.fields.tendency}>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${tnd.chip}`}>{tndLabel}</span>
                </Field>

                {v.note && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3.5 sm:col-span-2">
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                            <Info size={13} /> {viz.noticeLabel}
                        </div>
                        <div className="text-sm leading-relaxed text-slate-200">{v.note}</div>
                    </div>
                )}
            </motion.div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                {viz.outro}
            </p>
        </div>
    );
};
