"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, RotateCcw, Check, ArrowLeftRight, CornerLeftDown, Repeat, AlertTriangle, Eye, SlidersHorizontal } from 'lucide-react';

import { ACCENTS } from './accents';
import { useT } from '@/i18n/useT';
import { formatStepOnly, assembleLocalizedAnswer } from '@/i18n/format';
import {
    composeScenario,
    getBranch,
    chosenFragmentsUpTo,
    totalSteps,
    composeVariants,
    type BuildBranch,
    type FragmentCandidate,
    type PromptVariantId,
} from '@/app/behind-the-scenes-ai/chapter-10/answerBuildSteps';

/** עמודת "מידת התאמה" להמחשה לימודית בלבד. */
const FitBar: React.FC<{ value: number; accent: keyof typeof ACCENTS; muted?: boolean }> = ({ value, accent, muted }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];
    return (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_70%,transparent)]">
            <motion.div
                className={`h-full rounded-full ${muted ? 'bg-[color-mix(in_oklab,var(--bts-text-muted)_var(--bts-tint-mix),var(--color-slate-600))]' : a.barFill}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
    );
};

/** שורת חלק המשך אחד מתוך האפשרויות שנשקלות בצעד. */
const CandidateRow: React.FC<{ cand: FragmentCandidate; accent: keyof typeof ACCENTS }> = ({ cand, accent }) => {
    const { t } = useT();
    const lab = t.behindAi.generationLoop.lab;
    const a = ACCENTS[accent];
    const lead = !!cand.leading;
    return (
        <div
            className={`rounded-xl border p-3 transition-colors ${
                lead ? `${a.border} ${a.bgTint}` : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)]'
            }`}
        >
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`text-sm font-bold ${lead ? a.text : 'text-[var(--bts-text-secondary)]'}`}>{cand.text}</span>
                {lead && (
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${a.border} ${a.text}`}>
                        <Check size={11} /> {lab.leading}
                    </span>
                )}
            </div>
            <FitBar value={cand.fit} accent={accent} muted={!lead} />
        </div>
    );
};

/**
 * WatchBuildMode - מצב א "צפו בבנייה". מציג את לולאת הייצור על פרומפט קבוע: הקשר מצטבר,
 * חלקי המשך אפשריים, החלק שנבחר שמצטרף להקשר, והשינוי באפשרויות בצעד הבא. שני מסלולים
 * קבועים מתפצלים מהבחירה הראשונה כדי להראות שצעד מוקדם מכוון את כל מה שאחריו. התנהגות זו
 * נשמרה במלואה ממעבדת הפרק המקורית. דטרמיניסטי לחלוטין, בלי API.
 */
const WatchBuildMode: React.FC = () => {
    const reduce = useReducedMotion();
    const { t } = useT();
    const c10 = t.behindAi.generationLoop;
    const lab = c10.lab;
    // פורמטרים תלויי-תוכן משתמשים בשפת התוכן בפועל (contentLocale), לא בשפת ה-UI.
    const contentLocale = c10.contentLocale;

    // מיזוג שלד + טקסט מתורגם לתרחיש מוכן לרינדור (נבנה מחדש כשהשפה מתחלפת).
    const scenario = useMemo(() => composeScenario(lab.scenario), [lab.scenario]);

    // null = עדיין לא נבחרה פתיחה (מציגים את שתי הפתיחות). אחרת מזהה המסלול.
    const [branchId, setBranchId] = useState<string | null>(null);
    // כמה חלקים כבר בהקשר (כולל הפתיחה). 0 = רק הפרומפט.
    const [stepCount, setStepCount] = useState(0);

    const branch: BuildBranch | null = branchId ? getBranch(scenario, branchId) : null;
    const total = branch ? totalSteps(branch) : 0;
    const fragments = branch ? chosenFragmentsUpTo(branch, stepCount) : [];
    const done = !!branch && stepCount >= total;

    // הצעד שנשקל עכשיו (האינדקס ב-steps הוא stepCount-1, כי 1 = הפתיחה כבר הונחה).
    const nextStep = branch && stepCount >= 1 && stepCount - 1 < branch.steps.length ? branch.steps[stepCount - 1] : null;

    const chooseBranch = (id: string) => {
        setBranchId(id);
        setStepCount(1);
    };

    const advance = () => {
        if (branch && stepCount < total) setStepCount((n) => n + 1);
    };

    const reset = () => {
        setBranchId(null);
        setStepCount(0);
    };

    const [aBranch, bBranch] = scenario.branches;
    const accent = branch ? branch.accent : 'purple';

    return (
        <div className="space-y-4">
            {/* תרשים הלולאה: קבוע, מסביר את הרעיון של כל המעבדה */}
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-3 text-center text-xs font-bold">
                <span className="rounded-full border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_60%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] px-3 py-1 text-[var(--bts-text-body)]">{lab.loop.contextSoFar}</span>
                <CornerLeftDown size={14} className="rotate-90 text-[var(--bts-text-faint)]" />
                <span className="rounded-full border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_60%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] px-3 py-1 text-[var(--bts-text-body)]">{lab.loop.candidates}</span>
                <CornerLeftDown size={14} className="rotate-90 text-[var(--bts-text-faint)]" />
                <span className="rounded-full border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_60%,transparent)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] px-3 py-1 text-[var(--bts-text-body)]">{lab.loop.chosen}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-emerald-900)] [--t-l:var(--color-emerald-500)] px-3 py-1 text-emerald-300">
                    <Repeat size={12} /> {lab.loop.backToContext}
                </span>
            </div>

            {/* ההקשר המצטבר: הפרומפט ומה שנבנה עד כה */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{lab.contextLabel}</div>
                <p className="text-sm font-bold leading-relaxed text-[var(--bts-text-bright)]">
                    <span className="text-[var(--bts-text-muted)]">{lab.promptLabel}</span>
                    &quot;{scenario.prompt}&quot;
                </p>

                {fragments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        <AnimatePresence initial={false}>
                            {fragments.map((frag, i) => {
                                const latest = i === fragments.length - 1;
                                const a = ACCENTS[accent];
                                return (
                                    <motion.span
                                        key={`${branchId}-${i}`}
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
                                            latest ? `${a.border} ${a.bgTint} ${a.text}` : 'border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] text-[var(--bts-text-secondary)]'
                                        }`}
                                    >
                                        {frag}
                                    </motion.span>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* בחירת פתיחה (צעד ראשון) או התקדמות במסלול */}
            {!branch && (
                <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-4">
                    <div className="mb-1 text-sm font-bold text-[var(--bts-text-body)]">{lab.howToOpen}</div>
                    <p className="mb-4 text-xs leading-relaxed text-[var(--bts-text-muted)]">{scenario.firstStepIntro}</p>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {[aBranch, bBranch].map((br) => {
                            const a = ACCENTS[br.accent];
                            return (
                                <button
                                    key={br.id}
                                    type="button"
                                    onClick={() => chooseBranch(br.id)}
                                    className={`rounded-xl border p-3 text-start transition-colors ${a.border} bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] hover:brightness-110`}
                                >
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <span className={`text-sm font-bold ${a.text}`}>{br.opener}</span>
                                        <span className="text-[10px] font-bold text-[var(--bts-text-faint)]">{br.label}</span>
                                    </div>
                                    <FitBar value={br.openerFit} accent={br.accent} />
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-[var(--bts-text-faint)]">
                        {lab.openersNote}
                    </p>
                </div>
            )}

            {branch && (
                <div className="space-y-4">
                    {/* מה השתנה בהקשר, ומה נשקל עכשיו */}
                    <AnimatePresence mode="wait">
                        {nextStep ? (
                            <motion.div
                                key={`${branch.id}-${stepCount}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                                className="space-y-3"
                            >
                                <div className={`flex items-start gap-2 rounded-xl border ${ACCENTS[accent].border} ${ACCENTS[accent].bgTint} p-3`}>
                                    <Sparkles size={15} className={`mt-0.5 shrink-0 ${ACCENTS[accent].text}`} />
                                    <span className="text-sm leading-relaxed text-[var(--bts-text-body)]">
                                        <span className={`font-bold ${ACCENTS[accent].text}`}>{lab.changedPrefix}</span>
                                        {stepCount === 1 ? branch.openerChanged : nextStep.changed}
                                    </span>
                                </div>

                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">
                                    {lab.candidatesConsidered}
                                </div>
                                <div className="grid gap-2 sm:grid-cols-3">
                                    {nextStep.candidates.map((c, ci) => (
                                        <CandidateRow key={ci} cand={c} accent={accent} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* תוצאה סופית כשהמסלול הושלם */}
                    {done && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className={`rounded-2xl border ${ACCENTS[accent].border} ${ACCENTS[accent].bgTint} p-4`}
                        >
                            <div className={`mb-1 text-[10px] font-bold uppercase tracking-[0.2em] ${ACCENTS[accent].text}`}>
                                {lab.builtAnswer}
                            </div>
                            <p className="text-sm font-bold leading-relaxed text-[var(--bts-text-bright)]">{assembleLocalizedAnswer(contentLocale, fragments)}</p>
                            <p className="mt-2 text-xs leading-relaxed text-[var(--bts-text-muted)]">
                                {lab.builtAnswerNote}
                            </p>
                            <p className="mt-2 border-t border-[var(--bts-border)] pt-2 text-xs leading-relaxed text-[var(--bts-text-muted)]">
                                {lab.demoEndNote}
                            </p>
                        </motion.div>
                    )}

                    {/* בקרה */}
                    <div className="flex flex-wrap items-center gap-2">
                        {!done && (
                            <button
                                type="button"
                                onClick={advance}
                                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${ACCENTS[accent].border} ${ACCENTS[accent].bgTint} ${ACCENTS[accent].text} hover:brightness-110`}
                            >
                                <CornerLeftDown size={15} /> {lab.nextStep}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-2 rounded-xl border border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] px-4 py-2 text-sm font-bold text-[var(--bts-text-secondary)] transition-colors hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]"
                        >
                            <RotateCcw size={15} /> {lab.restart}
                        </button>
                        {!done && (
                            <span className="text-xs font-bold text-[var(--bts-text-faint)]">
                                {formatStepOnly(contentLocale, stepCount)}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* כרטיס ההשוואה: אותו פרומפט, שתי פתיחות, שתי תשובות */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-4">
                <div className="mb-3 flex items-center gap-2">
                    <ArrowLeftRight size={16} className="text-[var(--bts-text-secondary)]" />
                    <div className="text-sm font-bold text-[var(--bts-text-body)]">{lab.comparisonTitle}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[aBranch, bBranch].map((br) => {
                        const a = ACCENTS[br.accent];
                        const active = branch?.id === br.id;
                        return (
                            <div
                                key={br.id}
                                className={`rounded-xl border p-3 ${active ? `${a.border} ${a.bgTint}` : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)]'}`}
                            >
                                <div className={`mb-1 text-sm font-bold ${active ? a.text : 'text-[var(--bts-text-secondary)]'}`}>{br.opener}</div>
                                <p className="text-xs leading-relaxed text-[var(--bts-text-muted)]">{br.summary}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* הערת שקיפות (המחשה לימודית) */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4 text-[11px] leading-relaxed text-[var(--bts-text-faint)]">
                {lab.transparencyNote}
            </div>
        </div>
    );
};

/**
 * InstructionMode - מצב ב "שנו את ההוראה". אותה משימה (מענה ללקוח על חבילה שהתעכבה),
 * אבל ההוראה משתנה: עמומה, בטוחה מדי, זהירה, מובנית. כל וריאנט הוא מסלול ייצור דטרמיניסטי
 * וקבוע מראש, שמראה איך ההוראה נכנסת להקשר ומעצבת את כל המסלול והתוצאה. אלה חלקים לימודיים
 * מפושטים, לא עקבה אמיתית מתוך מודל. בלי אקראיות ובלי API.
 */
const InstructionMode: React.FC = () => {
    const reduce = useReducedMotion();
    const { t, dir } = useT();
    const lab = t.behindAi.generationLoop.lab;
    const v = lab.variants;
    const variants = useMemo(() => composeVariants(v.items), [v.items]);
    const [variantId, setVariantId] = useState<PromptVariantId>('vague');
    const selected = variants.find((x) => x.id === variantId) ?? variants[0];
    const a = ACCENTS[selected.accent];

    return (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-[var(--bts-text-secondary)]">{v.intro}</p>

            {/* בורר ההוראה */}
            <div>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{v.pickLabel}</div>
                <div className="grid grid-cols-2 gap-2">
                    {variants.map((item) => {
                        const ia = ACCENTS[item.accent];
                        const active = item.id === variantId;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setVariantId(item.id)}
                                aria-pressed={active}
                                className={`rounded-xl border p-3 text-start transition-colors ${active ? `${ia.border} ${ia.bgTint}` : 'border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'}`}
                            >
                                <div className={`text-sm font-bold ${active ? ia.text : 'text-[var(--bts-text-body)]'}`}>{item.label}</div>
                                <div className="mt-1 text-[11px] leading-snug text-[var(--bts-text-muted)]">&quot;{item.prompt}&quot;</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* פירוט הוריאנט הנבחר */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={variantId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                    className="space-y-3"
                >
                    {/* ההוראה שנבחרה */}
                    <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{v.promptLabel}</div>
                        <p className="mt-1 text-sm font-bold text-[var(--bts-text-bright)]">&quot;{selected.prompt}&quot;</p>
                    </div>

                    {/* איך זה נבנה: חלק אחרי חלק */}
                    <div>
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{v.buildsLabel}</div>
                        <div className="space-y-1.5">
                            {selected.chunks.map((c, i) => (
                                <motion.div
                                    key={`${variantId}-${i}`}
                                    initial={{ opacity: 0, x: dir === 'rtl' ? 8 : -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.12 }}
                                    className="flex items-center gap-2 rounded-lg border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] px-3 py-2"
                                >
                                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${a.bgTint} ${a.text} text-[11px] font-bold`} dir="ltr">{i + 1}</span>
                                    <span className="text-sm text-[var(--bts-text-body)]">{c}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* התשובה שנבנתה */}
                    <div className={`rounded-2xl border ${a.border} ${a.bgTint} p-4`}>
                        <div className={`mb-1 text-[10px] font-bold uppercase tracking-[0.2em] ${a.text}`}>{v.finalLabel}</div>
                        <p className="text-sm font-bold leading-relaxed text-[var(--bts-text-bright)]">{selected.finalAnswer}</p>
                    </div>

                    {/* מה קרה במסלול הזה */}
                    <div className="flex items-start gap-2 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-from)_40%,transparent)] p-3">
                        <span className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${a.border} ${a.text}`}>{selected.outcomeLabel}</span>
                        <span className="text-sm leading-relaxed text-[var(--bts-text-secondary)]">{selected.outcomeNote}</span>
                    </div>

                    {/* אזהרה, רק לוריאנט שדוחף לוודאות שלא נבדקה */}
                    {selected.caution && (
                        <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-[color-mix(in_oklab,color-mix(in_oklab,var(--t-l)_var(--bts-tint-mix),var(--t-d))_calc(15%_-_var(--bts-tint-mix)_*_0.075),transparent)] [--t-d:var(--color-rose-950)] [--t-l:var(--color-rose-500)] p-3">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-300" />
                            <span className="text-sm leading-relaxed text-rose-100">
                                <span className="font-bold text-rose-200">{v.cautionLabel} </span>
                                {selected.caution}
                            </span>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* הערת שקיפות (המחשה לימודית) */}
            <div className="rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-4 text-[11px] leading-relaxed text-[var(--bts-text-faint)]">
                {v.disclaimer}
            </div>
        </div>
    );
};

/**
 * GenerationLoopLab - מעבדת לולאת הייצור של פרק 10. שני מצבים:
 *   א. "צפו בבנייה" (WatchBuildMode): פרומפט קבוע, שתי פתיחות שמתפצלות, כדי לראות שצעד
 *      מוקדם מכוון את כל ההמשך. זו התנהגות המעבדה המקורית, נשמרה כמות שהיא.
 *   ב. "שנו את ההוראה" (InstructionMode): אותה משימה, הוראה משתנה (עמומה/בטוחה מדי/זהירה/
 *      מובנית), כדי לראות איך ההוראה מעצבת את כל התשובה, ומתי נוצרת ודאות לא מבוססת.
 * שני המצבים דטרמיניסטיים לחלוטין, בלי מודל אמיתי וללא קריאת רשת. כיוון הכתיבה מהרישום.
 */
export const GenerationLoopLab: React.FC = () => {
    const { t, dir } = useT();
    const lab = t.behindAi.generationLoop.lab;
    const [mode, setMode] = useState<'watch' | 'instruction'>('watch');

    const tabs = [
        { id: 'watch' as const, label: lab.modeA, icon: Eye },
        { id: 'instruction' as const, label: lab.modeB, icon: SlidersHorizontal },
    ];

    return (
        <div className="space-y-4" dir={dir}>
            {/* בורר מצב המעבדה */}
            <div className="flex gap-1 rounded-2xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-1" role="tablist" aria-label={lab.modeToggleLabel}>
                {tabs.map((tab) => {
                    const active = tab.id === mode;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setMode(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                                active ? 'border border-violet-500/40 bg-violet-500/20 text-violet-100' : 'border border-transparent text-[var(--bts-text-muted)] hover:text-[var(--bts-text-body)]'
                            }`}
                        >
                            <Icon size={15} aria-hidden /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {mode === 'watch' ? <WatchBuildMode /> : <InstructionMode />}
        </div>
    );
};
