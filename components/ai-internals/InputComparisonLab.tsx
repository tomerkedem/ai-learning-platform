"use client";

// ────────────────────────────────────────────────────────────────────────
// InputComparisonLab - מעבדת השוואת הקלט של פרק 2 (מה באמת נכנס למודל).
//
// הלומד בוחר בין כמה ניסוחים של אותו צורך, ורואה מה נכנס למודל בפועל: מה מפורש,
// מה חסר, מה השתנה, רמת העמימות, ומה הבקשה מבקשת מהמודל לעשות. המסר: אותו צורך,
// כשהוא מנוסח אחרת, מספק למודל חומר אחר לעבוד איתו.
//
// המעבדה נשארת בגבול פרק 2 (הרכב הקלט). היא לא מסווגת Chat מול Agent ולא מלמדת
// מקורות חיצוניים או טוקניזציה. יש רק רמיזה אחת קצרה שהפירוק לטוקנים מגיע בהמשך.
// אין מקף ארוך, מקף בינוני או נקודה-פסיק בתוך טקסט עברית.
// ────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, MinusCircle, ArrowLeftRight, Gauge, Target, Info, MousePointerClick } from 'lucide-react';

import { useT } from '@/i18n/useT';
import { StickyContextBar, type ContextTone } from './StickyContextBar';
import { BASE_ID, type Ambiguity } from '@/app/behind-the-scenes-ai/chapter-2/inputVariations';

// גוון הצ׳יפ של רמת העמימות (מבני; התווית עברה למילון chapter2Visuals.inputLab.ambiguityLabels).
const AMBIGUITY_CHIP: Record<Ambiguity, string> = {
    low: 'border-emerald-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] text-emerald-200',
    medium: 'border-amber-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-amber-900)] [--t-l:var(--color-amber-500)] text-amber-200',
    high: 'border-rose-400/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(20%_-_var(--bts-tint-mix)_*_0.1),transparent)] [--t-d:var(--color-rose-900)] [--t-l:var(--color-rose-500)] text-rose-200',
};

// טון פס ההקשר הדביק נגזר מרמת העמימות של הקלט (תכונה של הקלט עצמו, בתוך גבול הפרק):
// קלט ברור=צעד בטוח, בינוני=זהירות, עמום=עצירה.
const AMBIGUITY_TONE: Record<Ambiguity, ContextTone> = {
    low: 'go',
    medium: 'caution',
    high: 'stop',
};

/** כרטיס שדה בודד בלוח הקריאה. */
const Field: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
        <div className="mb-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[var(--bts-text-muted)]">
            {icon} {title}
        </div>
        <div className="text-sm leading-relaxed text-[var(--bts-text-body)]">{children}</div>
    </div>
);

export const InputComparisonLab: React.FC = () => {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const viz = t.behindAi.chapter2.visuals.inputLab;
    const variations = t.behindAi.chapter2.visuals.inputVariations;
    const [id, setId] = useState(BASE_ID);
    const v = variations.find((x) => x.id === id) ?? variations[0];
    const isBase = v.id === BASE_ID;
    const ambChip = AMBIGUITY_CHIP[v.ambiguity];
    const ambLabel = viz.ambiguityLabels[v.ambiguity];

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-5 text-start" dir={dir}>
            {/* בורר ניסוחים: ההוראה יושבת צמוד לכפתורים, ובולטת יותר מהערות המשנה */}
            <p className="mb-3 flex items-start gap-1.5 text-sm font-medium text-[var(--bts-text-body)]">
                <MousePointerClick size={16} className="mt-0.5 shrink-0 text-violet-400" />
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
                                ? 'border-violet-400/60 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(30%_-_var(--bts-tint-mix)_*_0.15),transparent)] [--t-d:var(--color-violet-900)] [--t-l:var(--color-violet-500)] text-violet-100'
                                : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] text-[var(--bts-text-muted)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* פס הקשר דביק: הניסוח הפעיל ורמת העמימות שלו, נשאר גלוי תוך כדי קריאת הלוח */}
            <StickyContextBar
                inputText={v.prompt}
                labelHe={v.label}
                decisionHe={`${viz.ambiguityPrefix} ${ambLabel}`}
                tone={AMBIGUITY_TONE[v.ambiguity]}
                reduce={!!reduce}
            />

            {/* לוח הקריאה */}
            <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 6 }}
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
                    {isBase ? <span className="text-[var(--bts-text-muted)]">{viz.baseComparison}</span> : v.changed}
                </Field>

                <Field icon={<Gauge size={13} className="text-[var(--bts-text-secondary)]" />} title={viz.fields.ambiguity}>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${ambChip}`}>{ambLabel}</span>
                </Field>

                <Field icon={<Target size={13} className="text-cyan-300" />} title={viz.fields.expectation}>
                    {v.expectation}
                </Field>

                {v.note && (
                    <div className="rounded-xl border border-emerald-500/30 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-950)] [--t-l:var(--color-emerald-500)] p-3.5 sm:col-span-2">
                        <div className="mb-1 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-emerald-300">
                            <Info size={13} /> {viz.noticeLabel}
                        </div>
                        <div className="text-sm leading-relaxed text-[var(--bts-text-body)]">{v.note}</div>
                    </div>
                )}
            </motion.div>

            <p className="mt-4 text-xs leading-relaxed text-[var(--bts-text-faint)]">
                {viz.outro}
            </p>

            {/* רמיזה קצרה לטוקניזציה כהערת "בהמשך", אחרי הלוח כדי לא לקטוע את זרימת המעבדה */}
            <p className="mt-4 rounded-xl border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-700))_40%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3 text-xs leading-relaxed text-[var(--bts-text-muted)]">
                {viz.tokenizationHint}
            </p>
        </div>
    );
};
