"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Info, Lightbulb, MousePointerClick, ScanLine, ShieldAlert, Workflow,
    CheckCircle2, XCircle, Clock, ArrowDown, ArrowLeft, Play, Pause,
    StepForward, RotateCcw, Eye, Gauge, MessageSquare, HelpCircle, Wrench,
    Terminal, Repeat, Lock, AlertTriangle, Boxes, Loader,
} from 'lucide-react';

import {
    buildLoop, OUTCOMES, DEFAULT_OUTCOME_ID, TOOL_CALL, TIMELINE_STEPS,
    NARRATION, DECISION_META, PANEL_SLOTS, QUALITY_META, CONFIDENCE_META, RISK_META,
    LOOP_NODES,
    type LoopState, type SectionNarration, type DecisionTone,
} from '@/app/behind-the-scenes-ai/chapter-11/observationData';
import {
    timelineStates, maxReplayStep, type StepState,
} from '@/app/behind-the-scenes-ai/chapter-11/loopEngine';

/* ════════════════════════ טון צבעוני ═════════════════════════════════════ */
// Answer ב-teal, Use another tool ב-violet, Ask ב-amber, Stop ב-crimson.

const TONE: Record<DecisionTone, { border: string; bg: string; text: string; soft: string }> = {
    answer: { border: 'border-teal-500/40', bg: 'bg-teal-900/15', text: 'text-teal-300', soft: 'bg-teal-500/15' },
    tool: { border: 'border-violet-500/40', bg: 'bg-violet-900/20', text: 'text-violet-200', soft: 'bg-violet-500/15' },
    ask: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', soft: 'bg-amber-500/15' },
    stop: { border: 'border-rose-500/40', bg: 'bg-rose-900/15', text: 'text-rose-300', soft: 'bg-rose-500/15' },
};

const METER_TONE = { high: TONE.answer, mid: TONE.ask, low: TONE.stop };

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const ObservationLoopLab: React.FC = () => {
    const reduce = !!useReducedMotion();
    const [outcomeId, setOutcomeId] = useState(DEFAULT_OUTCOME_ID);
    const [hasBarcode, setHasBarcode] = useState(true);
    const [riskHigh, setRiskHigh] = useState(false);

    const loop: LoopState = useMemo(() => buildLoop(outcomeId, hasBarcode, riskHigh), [outcomeId, hasBarcode, riskHigh]);
    const loopKey = `${outcomeId}|${hasBarcode}|${riskHigh}`;

    return (
        <div className="space-y-5">
            {/* ── בקרה: תוצאה + ברקוד + סיכון ─────────────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4" dir="rtl">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">מה הכלי מחזיר:</span>
                    {OUTCOMES.map((o) => {
                        const active = o.id === outcomeId;
                        return (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => setOutcomeId(o.id)}
                                aria-pressed={active}
                                className={`rounded-xl border px-3 py-1.5 text-right leading-tight transition-colors ${active ? 'border-violet-500/50 bg-violet-900/25' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                            >
                                <span className={`block text-xs font-bold ${active ? 'text-violet-200' : 'text-slate-300'}`}>{o.labelHe}</span>
                                <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{o.labelEn}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Info size={13} /> הבקשה: <span className="rounded bg-slate-800/70 px-1.5 py-0.5 font-bold text-slate-300">&quot;בדוק למה החבילה לא הגיעה&quot;</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setHasBarcode((b) => !b)}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${hasBarcode ? 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600' : 'border-amber-500/50 bg-amber-500/15 text-amber-200'}`}
                        >
                            <ScanLine size={13} /> {hasBarcode ? 'הסרת ברקוד' : 'החזרת ברקוד'}
                            <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">{hasBarcode ? 'Remove' : 'Restore'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRiskHigh((r) => !r)}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${riskHigh ? 'border-rose-500/50 bg-rose-500/15 text-rose-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'}`}
                        >
                            <ShieldAlert size={13} /> {riskHigh ? 'פעולה רגישה: פעיל' : 'פעולה רגישה'}
                            <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">Risk high</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── הלולאה (תרשים חתימתי) ───────────────────────────────────── */}
            <AgentLoopDiagram loop={loop} reduce={reduce} />

            {/* ── 1. Tool Call Timeline ──────────────────────────────────── */}
            <LabSection n={NARRATION.timeline} icon={<Workflow size={18} className="text-violet-300" />}>
                <ToolCallTimeline loop={loop} reduce={reduce} />
            </LabSection>

            {/* ── 2. Tool Input Viewer ───────────────────────────────────── */}
            <LabSection n={NARRATION.input} icon={<Terminal size={18} className="text-violet-300" />}>
                <ToolInputViewer hasBarcode={hasBarcode} />
            </LabSection>

            {/* ── 3. Observation Card ────────────────────────────────────── */}
            <LabSection n={NARRATION.observation} icon={<Eye size={18} className="text-violet-300" />}>
                <ObservationCard loop={loop} reduce={reduce} />
            </LabSection>

            {/* ── 4. Observation Quality Meter ───────────────────────────── */}
            <LabSection n={NARRATION.quality} icon={<Gauge size={18} className="text-violet-300" />}>
                <QualityMeter loop={loop} reduce={reduce} />
            </LabSection>

            {/* ── 5. Next Decision Panel ─────────────────────────────────── */}
            <LabSection n={NARRATION.decision} icon={<Workflow size={18} className="text-violet-300" />}>
                <NextDecisionPanel loop={loop} reduce={reduce} />
            </LabSection>

            {/* ── 6. Agent Loop Replay ───────────────────────────────────── */}
            <LabSection n={NARRATION.replay} icon={<Repeat size={18} className="text-violet-300" />}>
                <AgentLoopReplay loop={loop} hasBarcode={hasBarcode} resetKey={loopKey} reduce={reduce} />
            </LabSection>

            {/* ── disclaimer + גשר לפרק 12 ───────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    זהו מודל לימודי: הכלי מדומה וה-Observation מגיעה מטבלת תרחישים, אין כאן קריאה לשירות חיצוני. <span className="font-bold text-slate-400">Agents אמיתיים מנהלים לולאות ארוכות ומורכבות יותר</span>,
                    אבל העיקרון של Tool Call, Observation והחלטה חוזרת תקף. וזכרו: <span className="font-bold text-slate-400">Observation מגיעה מהכלי, לא מהמודל</span>, ותוצאה חלשה מובילה לזהירות, לא להמצאה.
                    גם כשיש תשובה אפשרית, לפעמים הצעד הנכון הוא לעצור ולבקש אישור, וזה פרק 12.
                </span>
            </div>
        </div>
    );
};

/* ════════════════════════ עוטף סקשן עם קריינות ════════════════════════════ */

const LabSection: React.FC<{ n: SectionNarration; icon: React.ReactNode; children: React.ReactNode }> = ({ n, icon, children }) => (
    <section className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 text-right" dir="rtl">
        <div className="flex items-center gap-2.5">
            {icon}
            <div className="leading-tight">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400" dir="ltr">{n.eyebrow}</div>
                <h4 className="text-lg font-bold text-white">{n.titleHe}</h4>
            </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{n.intro}</p>
        {children}
        <div className="flex items-start gap-2 rounded-xl border border-violet-500/30 bg-violet-900/15 p-3">
            <Lightbulb size={15} className="mt-0.5 shrink-0 text-violet-300" />
            <p className="text-sm font-bold leading-relaxed text-violet-100">{n.takeaway}</p>
        </div>
        <div className="rounded-xl border border-slate-700/40 bg-slate-950/30 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400" dir="ltr">
                <MousePointerClick size={13} /> Try this
            </div>
            <p className="text-[13px] leading-relaxed text-slate-400">{n.tryThis}</p>
        </div>
    </section>
);

/* ════════════════════════ הלולאה (תרשים חתימתי) ══════════════════════════ */

const AgentLoopDiagram: React.FC<{ loop: LoopState; reduce: boolean }> = ({ loop, reduce }) => {
    const looping = loop.decision === 'another-tool';
    const answered = loop.decision === 'answer';
    return (
        <div className="rounded-2xl border border-violet-500/30 bg-violet-900/10 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Repeat size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">לולאת ה-Agent</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">The Agent Loop</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2" dir="ltr">
                {LOOP_NODES.map((node, i) => {
                    const isResponse = node.id === 'response';
                    const dim = isResponse && !answered;
                    return (
                        <React.Fragment key={node.id}>
                            {i > 0 && <ArrowLeft size={14} className="rotate-180 text-violet-500/50" />}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: dim ? 0.4 : 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.06 }}
                                className={`rounded-xl border px-3 py-1.5 text-center leading-tight ${
                                    isResponse && answered ? 'border-teal-500/50 bg-teal-900/20' : 'border-violet-500/40 bg-violet-900/20'
                                }`}
                            >
                                <span className={`block text-[11px] font-bold ${isResponse && answered ? 'text-teal-200' : 'text-violet-100'}`}>{node.he}</span>
                                <span className="block text-[8px] uppercase tracking-wider text-slate-500" dir="ltr">{node.en}</span>
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* חץ הלולאה החוזרת: Decision -> Tool */}
            <div className="mt-3 flex items-center justify-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${looping ? 'border-violet-500/50 bg-violet-500/15 text-violet-200' : 'border-slate-700/50 bg-slate-950/40 text-slate-500'}`}>
                    <Repeat size={12} /> maybe another tool
                    <ArrowLeft size={12} className="rotate-180" />
                </span>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">
                Tool Call אינו סוף הסיפור. ההחלטה יכולה לסגור את הלולאה בתשובה, או לפתוח סיבוב נוסף עם כלי אחר.
            </p>
        </div>
    );
};

/* ════════════════════════ 1. Tool Call Timeline ══════════════════════════ */

const stepIcon = (state: StepState) => {
    switch (state) {
        case 'done': return <CheckCircle2 size={15} className="text-emerald-300" />;
        case 'active': return <Loader size={15} className="text-violet-300" />;
        case 'blocked': return <XCircle size={15} className="text-rose-300" />;
        default: return <Clock size={15} className="text-slate-600" />;
    }
};

function timelineValue(stepId: string, loop: LoopState): { he: string; en?: string } {
    switch (stepId) {
        case 'understand': return { he: 'בדיקת סטטוס משלוח', en: 'Delivery status' };
        case 'select': return { he: TOOL_CALL.toolHe, en: TOOL_CALL.toolEn };
        case 'prepare': return loop.toolCalled ? { he: `${TOOL_CALL.inputLabelHe}: ${TOOL_CALL.inputValue}`, en: 'Input ready' } : { he: `${TOOL_CALL.inputLabelHe} חסר`, en: 'Input missing' };
        case 'call': return loop.toolCalled ? { he: 'הכלי הופעל', en: 'Called' } : { he: 'נחסם, חסר קלט', en: 'Not called' };
        case 'observe': return loop.toolCalled ? { he: loop.observation.fields[0].value, en: 'Observation' } : { he: 'אין תוצאה', en: 'None' };
        default: return { he: DECISION_META[loop.decision].he, en: DECISION_META[loop.decision].en };
    }
}

const ToolCallTimeline: React.FC<{ loop: LoopState; reduce: boolean }> = ({ loop, reduce }) => {
    const states = timelineStates(loop.toolCalled, -1);
    return (
        <div className="space-y-1.5">
            {TIMELINE_STEPS.map((step, i) => {
                const state = states[i];
                const isDecision = step.id === 'decide' && state !== 'pending';
                const dt = isDecision ? TONE[DECISION_META[loop.decision].tone] : null;
                const val = timelineValue(step.id, loop);
                return (
                    <React.Fragment key={step.id}>
                        {i > 0 && (
                            <div className="flex justify-center">
                                <ArrowDown size={14} className={state === 'pending' ? 'text-slate-700' : 'text-slate-600'} />
                            </div>
                        )}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: state === 'pending' ? 0.45 : 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 24, delay: i * 0.06 }}
                            className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${
                                dt ? `${dt.border} ${dt.bg}` : state === 'blocked' ? 'border-rose-500/40 bg-rose-900/15' : state === 'pending' ? 'border-slate-800 bg-slate-950/30' : 'border-violet-500/30 bg-violet-900/10'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                {stepIcon(state)}
                                <span className="leading-tight">
                                    <span className={`block text-sm font-bold ${dt ? dt.text : state === 'blocked' ? 'text-rose-200' : state === 'pending' ? 'text-slate-500' : 'text-violet-100'}`}>{step.he}</span>
                                    <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{step.en}</span>
                                </span>
                            </span>
                            <span className="text-left leading-tight">
                                <span className={`block text-sm font-bold ${dt ? dt.text : state === 'blocked' ? 'text-rose-200' : 'text-slate-200'}`} dir="ltr">{val.he}</span>
                                {val.en && <span className="block text-[10px] text-slate-500" dir="ltr">{val.en}</span>}
                            </span>
                        </motion.div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

/* ════════════════════════ 2. Tool Input Viewer ═══════════════════════════ */

const ToolInputViewer: React.FC<{ hasBarcode: boolean }> = ({ hasBarcode }) => (
    <div className="space-y-3">
        <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 p-4 font-mono text-[13px] leading-relaxed" dir="ltr">
            <div className="text-slate-400">Tool: <span className="text-violet-200">{TOOL_CALL.toolEn}</span></div>
            <div className="text-slate-400">Method: <span className="text-cyan-200">{TOOL_CALL.method}</span></div>
            <div className="text-slate-400">
                Input: <span className="text-slate-300">{'{ '}</span>
                <span className="text-slate-300">&quot;{TOOL_CALL.inputKey}&quot;: </span>
                {hasBarcode
                    ? <span className="text-emerald-200">&quot;{TOOL_CALL.inputValue}&quot;</span>
                    : <span className="rounded bg-amber-500/20 px-1 text-amber-200">&lt;missing&gt;</span>}
                <span className="text-slate-300">{' }'}</span>
            </div>
        </div>

        {hasBarcode ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-900/15 p-3 text-sm text-emerald-200">
                <CheckCircle2 size={15} /> הקלט תקין, הקריאה תופעל.
            </div>
        ) : (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-900/15 p-3 text-sm text-amber-200">
                <XCircle size={15} className="mt-0.5 shrink-0" />
                <span><span className="font-bold">Input missing: {TOOL_CALL.inputKey}.</span> ה-Tool Call לא מופעל. Tool selected אינו Tool called, צריך קלט תקין.</span>
            </div>
        )}
    </div>
);

/* ════════════════════════ 3. Observation Card ════════════════════════════ */

const ObservationCard: React.FC<{ loop: LoopState; reduce: boolean }> = ({ loop, reduce }) => {
    const obs = loop.observation;

    if (!loop.toolCalled) {
        return (
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-400">
                <Lock size={15} className="mt-0.5 shrink-0 text-amber-300" />
                <span>אין Observation: הכלי לא הופעל, כי חסר קלט. בלי קריאה אין תוצאה לקרוא.</span>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={obs.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 22 }}
                className="space-y-3"
            >
                {obs.userClaimHe && (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/50 p-3 text-sm text-slate-300">
                        <MessageSquare size={15} className="text-slate-400" /> הקשר: {obs.userClaimHe}
                    </div>
                )}

                <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                        <Eye size={12} className="text-violet-300" /> Observation, returned from {TOOL_CALL.toolEn}
                    </div>
                    <div className="space-y-1 font-mono text-[13px]" dir="ltr">
                        {obs.fields.map((f) => (
                            <div key={f.key} className="flex items-center gap-2">
                                <span className="w-28 shrink-0 text-slate-500">{f.key}:</span>
                                <span className={f.weak ? 'rounded bg-amber-500/15 px-1 text-amber-200' : 'text-slate-200'}>{f.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-300">{obs.summaryHe}</p>

                <div className="flex items-start gap-2 rounded-xl border border-slate-700/40 bg-slate-900/40 p-3 text-[12px] leading-relaxed text-slate-400">
                    <Info size={13} className="mt-0.5 shrink-0 text-violet-300" />
                    זה מידע חדש שהגיע מהכלי, לא משהו שהמודל ידע מראש. ה-Agent ביקש את התוצאה, וקיבל אותה עכשיו.
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ════════════════════════ 4. Observation Quality Meter ═══════════════════ */

const QualityMeter: React.FC<{ loop: LoopState; reduce: boolean }> = ({ loop, reduce }) => {
    if (!loop.toolCalled) {
        return (
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-400">
                אין תוצאה למדוד: הכלי לא הופעל. כשאין Observation, אין מה לדרג.
            </div>
        );
    }
    const obs = loop.observation;
    const meta = QUALITY_META[obs.quality];
    const t = METER_TONE[meta.tone];
    const levels: ('low' | 'mid' | 'high')[] = ['low', 'mid', 'high'];

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {levels.map((lv, i) => {
                    const filled = i < meta.fill;
                    const ct = lv === 'high' ? TONE.answer : lv === 'mid' ? TONE.ask : TONE.stop;
                    return (
                        <motion.div
                            key={lv}
                            initial={reduce ? false : { opacity: 0.4 }}
                            animate={{ opacity: filled ? 1 : 0.3 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.05 }}
                            className={`h-3 flex-1 rounded-full ${filled ? ct.soft : 'bg-slate-800'}`}
                        >
                            <div className={`h-full w-full rounded-full ${filled ? ct.text : ''}`} style={filled ? { backgroundColor: 'currentColor', opacity: 0.7 } : undefined} />
                        </motion.div>
                    );
                })}
            </div>

            <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${t.border} ${t.bg}`}>
                <span className="inline-flex items-center gap-2">
                    <Gauge size={16} className={t.text} />
                    <span className="leading-tight">
                        <span className={`block text-lg font-black ${t.text}`}>{meta.he}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en} quality</span>
                    </span>
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${loop.canAnswer ? `${TONE.answer.border} ${TONE.answer.soft} ${TONE.answer.text}` : `${TONE.ask.border} ${TONE.ask.soft} ${TONE.ask.text}`}`}>
                    {loop.canAnswer ? <CheckCircle2 size={12} /> : <HelpCircle size={12} />}
                    Can answer: {loop.canAnswer ? 'Yes' : 'No'}
                </span>
            </div>

            {/* הנוסחה והקלטים החיים */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-2 font-mono text-[11px] text-slate-400" dir="ltr">
                    next_decision = f(observation_quality, confidence, risk_level)
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                    <FactorChip labelEn="quality" valueHe={meta.he} tone={meta.tone} />
                    <FactorChip labelEn="confidence" valueHe={CONFIDENCE_META[obs.confidence].he} tone={obs.confidence === 'high' ? 'high' : obs.confidence === 'medium' ? 'mid' : 'low'} />
                    <FactorChip labelEn="risk" valueHe={RISK_META[loop.risk].he} tone={loop.risk === 'high' ? 'low' : 'high'} />
                </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
                תוצאה חלשה אינה שגיאה של המערכת, היא מצב שדורש זהירות. כשהאיכות נמוכה, ה-Agent מבקש, מנסה כלי אחר, או מסביר מגבלה, אבל לא ממציא סיבה.
            </p>
        </div>
    );
};

const FactorChip: React.FC<{ labelEn: string; valueHe: string; tone: 'high' | 'mid' | 'low' }> = ({ labelEn, valueHe, tone }) => {
    const t = METER_TONE[tone];
    return (
        <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-bold ${t.border} ${t.soft} ${t.text}`}>
            <span className="text-slate-500" dir="ltr">{labelEn}:</span> {valueHe}
        </span>
    );
};

/* ════════════════════════ 5. Next Decision Panel ═════════════════════════ */

const DECISION_SLOT_ICON: Record<string, React.ReactNode> = {
    answer: <MessageSquare size={15} />,
    'another-tool': <Wrench size={15} />,
    ask: <HelpCircle size={15} />,
    'stop-approval': <Lock size={15} />,
};

const NextDecisionPanel: React.FC<{ loop: LoopState; reduce: boolean }> = ({ loop, reduce }) => {
    const meta = DECISION_META[loop.decision];
    const activeSlot = meta.slot;
    const t = TONE[meta.tone];
    const obs = loop.observation;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PANEL_SLOTS.map((slot) => {
                    const active = slot.slot === activeSlot;
                    const st = TONE[slot.tone];
                    return (
                        <motion.div
                            key={slot.slot}
                            animate={{ opacity: active ? 1 : 0.5 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                            className={`flex items-center gap-2.5 rounded-xl border p-3 ${active ? `${st.border} ${st.bg}` : 'border-slate-800 bg-slate-950/30'}`}
                        >
                            <span className={active ? st.text : 'text-slate-500'}>{DECISION_SLOT_ICON[slot.slot]}</span>
                            <span className="leading-tight">
                                <span className={`block text-sm font-bold ${active ? st.text : 'text-slate-400'}`}>{slot.he}</span>
                                <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{slot.en}</span>
                            </span>
                            {active && <motion.span layoutId="ch11-active-dot" className={`ms-auto h-2 w-2 rounded-full ${st.text}`} style={{ backgroundColor: 'currentColor' }} />}
                        </motion.div>
                    );
                })}
            </div>

            {/* סתירה: להציף, לא לפסול את המשתמש */}
            {loop.decision === 'flag-conflict' && obs.conflictHe && (
                <div className="rounded-xl border border-amber-500/50 bg-amber-900/20 p-3">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-amber-200">
                        <AlertTriangle size={14} /> Conflict detected
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{obs.conflictHe}</p>
                </div>
            )}

            {/* ההחלטה הנבחרת + נימוק */}
            <motion.div
                key={loop.decision}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                className={`rounded-xl border p-4 ${t.border} ${t.bg}`}
            >
                <div className="flex flex-wrap items-center gap-2">
                    <span className={t.text}>{DECISION_SLOT_ICON[activeSlot]}</span>
                    <span className={`text-sm font-black ${t.text}`}>{meta.he}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en}</span>
                    {loop.decision === 'stop-approval' && (
                        <span className="rounded-md border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-200" dir="ltr">Human approval required</span>
                    )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{decisionReason(loop)}</p>

                {/* צעדים חלופיים (תוצאה חלקית) */}
                {loop.decision === 'another-tool' && obs.alternativesHe && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {obs.alternativesHe.map((alt) => (
                            <span key={alt} className="rounded-md border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 text-[11px] text-slate-300">{alt}</span>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

function decisionReason(loop: LoopState): string {
    if (loop.decision === 'ask-input') {
        return 'הכלי לא הופעל, כי חסר קלט. הצעד הנכון הוא לבקש את הקלט החסר, לא לנחש תוצאה.';
    }
    if (loop.decision === 'stop-approval') {
        return 'גם אחרי שהכלי החזיר מידע, שער הסיכון נשאר. הפעולה רגישה, אז גם כשהתשובה ברורה עוצרים לאישור אנושי לפני המשך.';
    }
    return loop.observation.decisionDetailHe;
}

/* ════════════════════════ 6. Agent Loop Replay ═══════════════════════════ */

const AgentLoopReplay: React.FC<{ loop: LoopState; hasBarcode: boolean; resetKey: string; reduce: boolean }> = ({ loop, hasBarcode, resetKey, reduce }) => {
    const max = maxReplayStep(loop.toolCalled);
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);

    // איפוס הניגון כשמשתנה התרחיש (תבנית reset-on-key של React, ללא effect).
    const [prevKey, setPrevKey] = useState(resetKey);
    if (resetKey !== prevKey) { setPrevKey(resetKey); setStep(0); setPlaying(false); }
    // עצירה בסוף (התאמת state בזמן render, בטוח ומתכנס).
    if (playing && step >= max) setPlaying(false);
    if (step > max) setStep(max);

    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => setStep((s) => Math.min(s + 1, max)), reduce ? 450 : 900);
        return () => clearInterval(id);
    }, [playing, max, reduce]);

    const states = timelineStates(loop.toolCalled, step);

    return (
        <div className="space-y-3">
            {/* בקרים */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => { if (step >= max) setStep(0); setPlaying((p) => !p); }}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-500/50 bg-violet-900/25 px-3 py-2 text-sm font-bold text-violet-200 transition-colors hover:brightness-110"
                >
                    {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'עצירה' : 'Replay'}
                    <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">{playing ? 'Pause' : 'Replay loop'}</span>
                </button>
                <button
                    type="button"
                    onClick={() => { setPlaying(false); setStep((s) => Math.min(s + 1, max)); }}
                    disabled={step >= max}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-slate-600 disabled:opacity-40"
                >
                    <StepForward size={14} /> צעד
                    <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">Step</span>
                </button>
                <button
                    type="button"
                    onClick={() => { setPlaying(false); setStep(0); }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-200"
                >
                    <RotateCcw size={14} /> איפוס
                    <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">Reset</span>
                </button>
                <span className="font-mono text-xs text-slate-500" dir="ltr">step {step + 1} / {max + 1}</span>
            </div>

            {/* ציר הניגון */}
            <div className="flex flex-wrap items-stretch gap-1.5" dir="ltr">
                {TIMELINE_STEPS.map((s, i) => {
                    const state = states[i];
                    return (
                        <div
                            key={s.id}
                            className={`flex-1 rounded-lg border px-1.5 py-2 text-center leading-tight transition-colors ${
                                state === 'active' ? 'border-violet-500/60 bg-violet-500/15' : state === 'done' ? 'border-emerald-500/30 bg-emerald-900/10' : state === 'blocked' ? 'border-rose-500/40 bg-rose-900/15' : 'border-slate-800 bg-slate-950/30'
                            }`}
                        >
                            <div className="flex justify-center">{stepIcon(state)}</div>
                            <div className={`mt-1 text-[8px] uppercase tracking-wider ${state === 'pending' ? 'text-slate-600' : 'text-slate-400'}`}>{s.en}</div>
                        </div>
                    );
                })}
            </div>

            {/* תיאור השלב הנוכחי */}
            <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3"
            >
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-300" dir="ltr">
                    <Boxes size={12} /> {TIMELINE_STEPS[step].en}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-200">{replayDescription(step, loop, hasBarcode)}</p>
            </motion.div>
        </div>
    );
};

function replayDescription(step: number, loop: LoopState, hasBarcode: boolean): string {
    switch (TIMELINE_STEPS[step].id) {
        case 'understand': return 'ה-Agent מזהה את המשימה: בדיקת סטטוס משלוח עבור המשתמש.';
        case 'select': return `ה-Agent בוחר את הכלי המתאים: ${TOOL_CALL.toolEn}. הוא קורא, לא משנה מצב.`;
        case 'prepare': return hasBarcode ? `מכין קריאה מוגדרת עם קלט: ${TOOL_CALL.inputKey} = ${TOOL_CALL.inputValue}.` : 'מנסה להכין את הקריאה, אבל הברקוד חסר. בלי קלט תקין אין הפעלה.';
        case 'call': return hasBarcode ? 'מפעיל את הכלי וממתין שהתוצאה תחזור. כאן ה-Agent יוצא לעולם החיצוני.' : 'הקריאה נחסמה: Tool selected אינו Tool called.';
        case 'observe': return `התקבלה Observation מהכלי: ${loop.observation.fields[0].value}. זה מידע חדש שהגיע מבחוץ, לא ידע שהיה למודל.`;
        default: return `לפי ה-Observation, ה-Agent מחליט על הצעד הבא: ${DECISION_META[loop.decision].he}. התוצאה הפכה לקלט של ההחלטה.`;
    }
}
