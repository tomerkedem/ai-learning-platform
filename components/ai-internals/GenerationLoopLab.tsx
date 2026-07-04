"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, RotateCcw, Check, ArrowLeftRight, CornerLeftDown, Repeat, AlertTriangle, Eye, SlidersHorizontal } from 'lucide-react';

import { ACCENTS } from './accents';
import { useT } from '@/i18n/useT';
import { formatStepCounter, assembleLocalizedAnswer } from '@/i18n/format';
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
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/70">
            <motion.div
                className={`h-full rounded-full ${muted ? 'bg-slate-600' : a.barFill}`}
                initial={reduce ? false : { width: 0 }}
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
                lead ? `${a.border} ${a.bgSoft}` : 'border-slate-700/50 bg-slate-950/30'
            }`}
        >
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`text-sm font-bold ${lead ? a.text : 'text-slate-300'}`}>{cand.text}</span>
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
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-3 text-center text-xs font-bold">
                <span className="rounded-full border border-slate-600/60 bg-slate-950/40 px-3 py-1 text-slate-200">{lab.loop.contextSoFar}</span>
                <CornerLeftDown size={14} className="rotate-90 text-slate-500" />
                <span className="rounded-full border border-slate-600/60 bg-slate-950/40 px-3 py-1 text-slate-200">{lab.loop.candidates}</span>
                <CornerLeftDown size={14} className="rotate-90 text-slate-500" />
                <span className="rounded-full border border-slate-600/60 bg-slate-950/40 px-3 py-1 text-slate-200">{lab.loop.chosen}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-900/15 px-3 py-1 text-emerald-300">
                    <Repeat size={12} /> {lab.loop.backToContext}
                </span>
            </div>

            {/* ההקשר המצטבר: הפרומפט ומה שנבנה עד כה */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{lab.contextLabel}</div>
                <p className="text-sm font-bold leading-relaxed text-slate-100">
                    <span className="text-slate-400">{lab.promptLabel}</span>
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
                                        initial={reduce ? false : { opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
                                            latest ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-slate-700/60 bg-slate-900/50 text-slate-300'
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
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                    <div className="mb-1 text-sm font-bold text-slate-200">{lab.howToOpen}</div>
                    <p className="mb-4 text-xs leading-relaxed text-slate-400">{scenario.firstStepIntro}</p>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {[aBranch, bBranch].map((br) => {
                            const a = ACCENTS[br.accent];
                            return (
                                <button
                                    key={br.id}
                                    type="button"
                                    onClick={() => chooseBranch(br.id)}
                                    className={`rounded-xl border p-3 text-start transition-colors ${a.border} bg-slate-950/30 hover:brightness-110`}
                                >
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <span className={`text-sm font-bold ${a.text}`}>{br.opener}</span>
                                        <span className="text-[10px] font-bold text-slate-500">{br.label}</span>
                                    </div>
                                    <FitBar value={br.openerFit} accent={br.accent} />
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
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
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                                className="space-y-3"
                            >
                                <div className={`flex items-start gap-2 rounded-xl border ${ACCENTS[accent].border} ${ACCENTS[accent].bgSoft} p-3`}>
                                    <Sparkles size={15} className={`mt-0.5 shrink-0 ${ACCENTS[accent].text}`} />
                                    <span className="text-sm leading-relaxed text-slate-200">
                                        <span className={`font-bold ${ACCENTS[accent].text}`}>{lab.changedPrefix}</span>
                                        {stepCount === 1 ? branch.openerChanged : nextStep.changed}
                                    </span>
                                </div>

                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
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
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className={`rounded-2xl border ${ACCENTS[accent].border} ${ACCENTS[accent].bgSoft} p-4`}
                        >
                            <div className={`mb-1 text-[10px] font-bold uppercase tracking-[0.2em] ${ACCENTS[accent].text}`}>
                                {lab.builtAnswer}
                            </div>
                            <p className="text-sm font-bold leading-relaxed text-slate-100">{assembleLocalizedAnswer(contentLocale, fragments)}</p>
                            <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                {lab.builtAnswerNote}
                            </p>
                        </motion.div>
                    )}

                    {/* בקרה */}
                    <div className="flex flex-wrap items-center gap-2">
                        {!done && (
                            <button
                                type="button"
                                onClick={advance}
                                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${ACCENTS[accent].border} ${ACCENTS[accent].bgSoft} ${ACCENTS[accent].text} hover:brightness-110`}
                            >
                                <CornerLeftDown size={15} /> {lab.nextStep}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-slate-600"
                        >
                            <RotateCcw size={15} /> {lab.restart}
                        </button>
                        <span className="text-xs font-bold text-slate-500">
                            {formatStepCounter(contentLocale, stepCount, total)}
                        </span>
                    </div>
                </div>
            )}

            {/* כרטיס ההשוואה: אותו פרומפט, שתי פתיחות, שתי תשובות */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                <div className="mb-3 flex items-center gap-2">
                    <ArrowLeftRight size={16} className="text-slate-300" />
                    <div className="text-sm font-bold text-slate-200">{lab.comparisonTitle}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[aBranch, bBranch].map((br) => {
                        const a = ACCENTS[br.accent];
                        const active = branch?.id === br.id;
                        return (
                            <div
                                key={br.id}
                                className={`rounded-xl border p-3 ${active ? `${a.border} ${a.bgSoft}` : 'border-slate-700/50 bg-slate-950/30'}`}
                            >
                                <div className={`mb-1 text-sm font-bold ${active ? a.text : 'text-slate-300'}`}>{br.opener}</div>
                                <p className="text-xs leading-relaxed text-slate-400">{br.summary}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* הערת שקיפות (המחשה לימודית) */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500">
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
            <p className="text-sm leading-relaxed text-slate-300">{v.intro}</p>

            {/* בורר ההוראה */}
            <div>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{v.pickLabel}</div>
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
                                className={`rounded-xl border p-3 text-start transition-colors ${active ? `${ia.border} ${ia.bgSoft}` : 'border-slate-700/50 bg-slate-950/30 hover:border-slate-600'}`}
                            >
                                <div className={`text-sm font-bold ${active ? ia.text : 'text-slate-200'}`}>{item.label}</div>
                                <div className="mt-1 text-[11px] leading-snug text-slate-400">&quot;{item.prompt}&quot;</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* פירוט הוריאנט הנבחר */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={variantId}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                    className="space-y-3"
                >
                    {/* ההוראה שנבחרה */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{v.promptLabel}</div>
                        <p className="mt-1 text-sm font-bold text-slate-100">&quot;{selected.prompt}&quot;</p>
                    </div>

                    {/* איך זה נבנה: חלק אחרי חלק */}
                    <div>
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{v.buildsLabel}</div>
                        <div className="space-y-1.5">
                            {selected.chunks.map((c, i) => (
                                <motion.div
                                    key={`${variantId}-${i}`}
                                    initial={reduce ? false : { opacity: 0, x: dir === 'rtl' ? 8 : -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.12 }}
                                    className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2"
                                >
                                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${a.bgSoft} ${a.text} text-[11px] font-bold`} dir="ltr">{i + 1}</span>
                                    <span className="text-sm text-slate-200">{c}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* התשובה שנבנתה */}
                    <div className={`rounded-2xl border ${a.border} ${a.bgSoft} p-4`}>
                        <div className={`mb-1 text-[10px] font-bold uppercase tracking-[0.2em] ${a.text}`}>{v.finalLabel}</div>
                        <p className="text-sm font-bold leading-relaxed text-slate-100">{selected.finalAnswer}</p>
                    </div>

                    {/* מה קרה במסלול הזה */}
                    <div className="flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
                        <span className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${a.border} ${a.text}`}>{selected.outcomeLabel}</span>
                        <span className="text-sm leading-relaxed text-slate-300">{selected.outcomeNote}</span>
                    </div>

                    {/* אזהרה, רק לוריאנט שדוחף לוודאות שלא נבדקה */}
                    {selected.caution && (
                        <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-950/15 p-3">
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
            <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500">
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
            <div className="flex gap-1 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-1" role="tablist" aria-label={lab.modeToggleLabel}>
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
                                active ? 'border border-violet-500/40 bg-violet-500/20 text-violet-100' : 'border border-transparent text-slate-400 hover:text-slate-200'
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
