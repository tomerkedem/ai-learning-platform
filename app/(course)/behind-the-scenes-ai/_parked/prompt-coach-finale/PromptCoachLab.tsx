"use client";

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Keyboard, Info, Lightbulb, MousePointerClick, PenLine, Gauge, GitFork,
    MessageSquare, Workflow, ShieldAlert, CheckCircle2, XCircle,
    AlertTriangle, Sparkles, ArrowLeft, ArrowDown, Target, ClipboardList, ListChecks,
} from 'lucide-react';

import { coach, recommendModeForText, type CoachResult, type DimTone, type DimEval, type RecommendedMode } from './coachEngine';
import {
    COACH_SCENARIOS, SELECTOR_SCENARIOS, TEMPLATES, IMPROVEMENTS, NARRATION,
    MODE_META, FORMULA_PARTS, GOOD_REQUEST_FORMULA, ROUTES, DEFAULT_TEXT, lockedImprovement,
    type SectionNarration,
} from './coachData';

/* ════════════════════════ טון צבעוני ═════════════════════════════════════ */
// ממד חזק או מצב מומלץ ב-teal, חסר ב-amber, סיכון גבוה ב-crimson.

const DIM_STYLE: Record<DimTone, { text: string; bar: string; border: string; bg: string; badge: string }> = {
    ok: { text: 'text-teal-300', bar: 'bg-teal-500/70', border: 'border-teal-500/40', bg: 'bg-teal-900/15', badge: 'bg-teal-500/15 text-teal-300' },
    warn: { text: 'text-amber-300', bar: 'bg-amber-500/70', border: 'border-amber-500/40', bg: 'bg-amber-900/15', badge: 'bg-amber-500/15 text-amber-200' },
    bad: { text: 'text-rose-300', bar: 'bg-rose-500/70', border: 'border-rose-500/40', bg: 'bg-rose-900/15', badge: 'bg-rose-500/15 text-rose-200' },
};

const MODE_STYLE: Record<'chat' | 'agent' | 'approval', { text: string; border: string; bg: string; icon: React.ReactNode }> = {
    chat: { text: 'text-teal-300', border: 'border-teal-500/40', bg: 'bg-teal-900/15', icon: <MessageSquare size={16} /> },
    agent: { text: 'text-violet-200', border: 'border-violet-500/40', bg: 'bg-violet-900/20', icon: <Workflow size={16} /> },
    approval: { text: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-900/15', icon: <ShieldAlert size={16} /> },
};

const LEVEL_LABEL: Record<DimEval['level'], string> = {
    high: 'חזק', medium: 'בינוני', low: 'חסר', missing: 'חסר', na: 'לא נדרש',
};

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const PromptCoachLab: React.FC = () => {
    const reduce = !!useReducedMotion();
    const [text, setText] = useState(DEFAULT_TEXT);
    const result: CoachResult = useMemo(() => coach(text), [text]);

    return (
        <div className="space-y-5">
            {/* ── קלט משותף ──────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4" dir="rtl">
                <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 focus-within:border-violet-500/60">
                    <Keyboard size={15} className="shrink-0 text-violet-300" />
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="כתבו בקשה..."
                        dir="rtl"
                        aria-label="שדה הקלט של מאמן הבקשות"
                        className="w-full bg-transparent py-2.5 text-base font-medium text-white placeholder:text-slate-600 focus:outline-none"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">ניסוי מהיר:</span>
                    {COACH_SCENARIOS.map((s) => {
                        const active = s.text === text;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setText(s.text)}
                                className={`rounded-lg border px-2.5 py-1 text-right text-[11px] font-bold leading-tight transition-colors ${active ? 'border-violet-500/50 bg-violet-900/25 text-violet-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'}`}
                            >
                                {s.text}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── 1. Prompt Coach Mode (חתימתי) ──────────────────────────── */}
            <LabSection n={NARRATION.coach} icon={<PenLine size={18} className="text-violet-300" />}>
                <CoachView text={text} result={result} reduce={reduce} />
            </LabSection>

            {/* ── 2. Prompt Quality Meter ────────────────────────────────── */}
            <LabSection n={NARRATION.quality} icon={<Gauge size={18} className="text-violet-300" />}>
                <QualityMeter text={text} result={result} reduce={reduce} />
            </LabSection>

            {/* ── 3. Chat or Agent Selector ──────────────────────────────── */}
            <LabSection n={NARRATION.selector} icon={<GitFork size={18} className="text-violet-300" />}>
                <SelectorView text={text} onPick={setText} reduce={reduce} />
            </LabSection>

            {/* ── ניסוי מסכם ─────────────────────────────────────────────── */}
            <LabSection n={NARRATION.experiment} icon={<Sparkles size={18} className="text-violet-300" />}>
                <ExperimentView reduce={reduce} />
            </LabSection>

            {/* ── disclaimer ─────────────────────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    אלה כלי אימון לימודיים, לא הצצה למנוע. <span className="font-bold text-slate-400">הנדסת prompt אמיתית עשירה יותר</span>, אבל העקרונות של מטרה, הקשר, מידע, פלט וגבולות תקפים.
                    זה לא פרק על לרמות את המודל, אלא על שיתוף פעולה מקצועי: <span className="font-bold text-slate-400">שאלת הבהרה היא צעד מקצועי, ובחירה ב-Chat כשמתאים היא עבודה נכונה</span>, לא חולשה.
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

/* ════════════════════════ עזרי תצוגה משותפים ═════════════════════════════ */

const ModeChip: React.FC<{ mode: RecommendedMode; small?: boolean }> = ({ mode, small }) => {
    const meta = MODE_META[mode];
    const st = MODE_STYLE[meta.tone];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-bold ${st.border} ${st.bg} ${st.text} ${small ? 'text-[11px]' : 'text-sm'}`}>
            {st.icon} {meta.he}
            <span className="opacity-70" dir="ltr">{meta.en}</span>
        </span>
    );
};

const SuggestionCard: React.FC<{ text: string; result: CoachResult; reduce: boolean }> = ({ text, result, reduce }) => {
    const locked = lockedImprovement(text);
    const improved = locked ? locked.improvedHe : result.composedSuggestionHe;
    const safer = locked ? locked.safer : result.sensitive;
    const unchanged = improved.trim() === text.trim();
    return (
        <motion.div
            key={improved}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
            className={`rounded-xl border p-4 ${safer ? 'border-amber-500/40 bg-amber-900/15' : 'border-teal-500/40 bg-teal-900/15'}`}
        >
            <div className="mb-1.5 flex items-center gap-1.5">
                {safer ? <ShieldAlert size={15} className="text-amber-300" /> : <Sparkles size={15} className="text-teal-300" />}
                <span className={`text-[11px] font-bold uppercase tracking-wider ${safer ? 'text-amber-300' : 'text-teal-300'}`} dir="ltr">{safer ? 'Safer prompt' : 'Suggested improvement'}</span>
            </div>
            {unchanged ? (
                <p className="text-sm leading-relaxed text-slate-200">הבקשה כבר ברורה ובטוחה. אין צורך בשיפור מהותי.</p>
            ) : (
                <p className="text-[15px] leading-relaxed text-slate-100">{improved}</p>
            )}
            {safer && (
                <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">Draft אינו Send. בקשה רגישה עדיף לפרק לשלבים: קודם לבדוק, ואז להכין טיוטה לאישור, לא לקבוע עובדה לא מאומתת.</p>
            )}
        </motion.div>
    );
};

/* ════════════════════════ 1. Prompt Coach Mode ═══════════════════════════ */

const CoachView: React.FC<{ text: string; result: CoachResult; reduce: boolean }> = ({ text, result, reduce }) => {
    const p = result.parse;
    const locked = lockedImprovement(text);
    const headline = locked?.headlineHe;

    return (
        <div className="space-y-3">
            {/* מה זוהה */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <DetectCell labelEn="Request type" value={p.requestType === 'task' ? 'משימה' : 'שאלה'} tone={p.requestType === 'task' ? 'ok' : 'warn'} />
                <DetectCell labelEn="Goal" value={p.goalClear ? 'ברורה' : p.requestType === 'question' ? 'הסבר' : 'לא ברורה'} tone={p.goalClear || p.requestType === 'question' ? 'ok' : 'warn'} />
                <DetectCell labelEn="Missing" value={p.missingData.length ? p.missingData.map((d) => d.he).join(', ') : 'אין'} tone={p.missingData.length ? 'warn' : 'ok'} />
                <DetectCell labelEn="Risk" value={p.risk === 'high' ? 'גבוה' : 'נמוך'} tone={p.risk === 'high' ? 'bad' : 'ok'} />
            </div>

            {/* המלצת מצב + ציון */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="font-bold text-slate-200">מצב מומלץ:</span> <ModeChip mode={result.recommendation.mode} small />
                </span>
                <span className="text-[11px] text-slate-500">איכות: <span className="font-bold text-slate-300">{result.quality.levelHe} ({result.quality.scorePct}%)</span></span>
            </div>

            {headline && (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <AlertTriangle size={14} className="text-amber-300" /> {headline}
                </div>
            )}

            {/* ההצעה לשיפור */}
            <SuggestionCard text={text} result={result} reduce={reduce} />

            {/* נוסחת העבודה */}
            <FormulaChecklist dims={result.quality.dims} />
        </div>
    );
};

const DetectCell: React.FC<{ labelEn: string; value: string; tone: DimTone }> = ({ labelEn, value, tone }) => {
    const st = DIM_STYLE[tone];
    return (
        <div className={`rounded-xl border p-2.5 leading-tight ${st.border} ${st.bg}`}>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">{labelEn}</div>
            <div className={`mt-0.5 truncate text-sm font-bold ${st.text}`}>{value}</div>
        </div>
    );
};

const FormulaChecklist: React.FC<{ dims: DimEval[] }> = ({ dims }) => {
    const map: Record<string, DimEval['key']> = { clear_goal: 'goal', relevant_context: 'context', required_data: 'data', output_expectation: 'output', safety_boundaries: 'risk' };
    return (
        <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
            <div className="mb-2 font-mono text-[10px] leading-relaxed text-slate-400" dir="ltr">{GOOD_REQUEST_FORMULA}</div>
            <div className="flex flex-wrap gap-1.5">
                {FORMULA_PARTS.map((part) => {
                    const dim = dims.find((d) => d.key === map[part.en]);
                    const present = dim ? (dim.level === 'high' || dim.level === 'na') : false;
                    return (
                        <span key={part.en} className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${present ? 'border-teal-500/40 bg-teal-500/10 text-teal-300' : 'border-amber-500/40 bg-amber-500/10 text-amber-200'}`}>
                            {present ? <CheckCircle2 size={10} /> : <XCircle size={10} />} {part.he}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

/* ════════════════════════ 2. Prompt Quality Meter ════════════════════════ */

const QualityMeter: React.FC<{ text: string; result: CoachResult; reduce: boolean }> = ({ text, result, reduce }) => {
    const q = result.quality;
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-200">איכות הבקשה: <span className={q.goodCount >= 4 ? 'text-teal-300' : q.goodCount >= 2 ? 'text-amber-300' : 'text-rose-300'}>{q.levelHe}</span></span>
                <span className="font-mono text-xs text-slate-400" dir="ltr">{q.scorePct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                    animate={{ width: `${q.scorePct}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
                    className={`h-full rounded-full ${q.goodCount >= 4 ? 'bg-teal-500/70' : q.goodCount >= 2 ? 'bg-amber-500/70' : 'bg-rose-500/70'}`}
                />
            </div>

            <div className="space-y-2">
                {q.dims.map((d) => {
                    const st = DIM_STYLE[d.tone];
                    return (
                        <div key={d.key} className={`rounded-xl border p-3 ${st.border} ${st.bg}`}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="leading-tight">
                                    <span className="block text-sm font-bold text-slate-100">{d.he}</span>
                                    <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{d.en}</span>
                                </span>
                                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${st.badge}`}>{LEVEL_LABEL[d.level]}</span>
                            </div>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{d.note}</p>
                        </div>
                    );
                })}
            </div>

            <div className="my-1 flex justify-center"><ArrowDown size={16} className="text-slate-600" /></div>
            <SuggestionCard text={text} result={result} reduce={reduce} />
        </div>
    );
};

/* ════════════════════════ 3. Chat or Agent Selector ══════════════════════ */

const SelectorView: React.FC<{ text: string; onPick: (t: string) => void; reduce: boolean }> = ({ text, onPick, reduce }) => {
    const rec = useMemo(() => recommendModeForText(text), [text]);

    return (
        <div className="space-y-3">
            {/* בקשות מהירות */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">בקשות:</span>
                {SELECTOR_SCENARIOS.map((s) => {
                    const active = s.text === text;
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => onPick(s.text)}
                            className={`rounded-lg border px-2.5 py-1 text-right leading-tight transition-colors ${active ? 'border-violet-500/50 bg-violet-900/25' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                        >
                            <span className={`block text-[11px] font-bold ${active ? 'text-violet-200' : 'text-slate-300'}`}>{s.labelHe}</span>
                            <span className="block text-[9px] text-slate-500">{s.text}</span>
                        </button>
                    );
                })}
            </div>

            {/* ההמלצה + נימוק */}
            <motion.div
                key={rec.mode}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4"
            >
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-300">מצב מומלץ:</span>
                    <ModeChip mode={rec.mode} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300"><span className="font-bold text-slate-200">למה: </span>{rec.reasonHe}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{rec.reasonEn}</p>
            </motion.div>

            {/* המסלולים */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ROUTES.map((route) => {
                    const isRec = (route.mode === 'chat' && rec.mode === 'chat') || (route.mode === 'agent' && rec.mode !== 'chat');
                    return (
                        <div key={route.mode} className={`rounded-xl border p-3 ${isRec ? 'border-violet-500/40 bg-violet-900/15' : 'border-slate-700/50 bg-slate-950/30 opacity-70'}`}>
                            <div className="mb-1.5 flex items-center gap-1.5">
                                {route.mode === 'chat' ? <MessageSquare size={13} className="text-teal-300" /> : <Workflow size={13} className="text-violet-300" />}
                                <span className="text-xs font-bold text-slate-200">{route.titleHe}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1" dir="ltr">
                                {route.steps.map((step, i) => (
                                    <React.Fragment key={step}>
                                        {i > 0 && <ArrowLeft size={9} className="rotate-180 text-slate-600" />}
                                        <span className="rounded border border-slate-700/50 bg-slate-900/40 px-1.5 py-0.5 text-[9px] text-slate-300">{step}</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* תבניות עבודה */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {TEMPLATES.map((tpl) => (
                    <div key={tpl.mode} className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                        <div className="mb-2 flex items-center gap-1.5">
                            {tpl.mode === 'chat' ? <ClipboardList size={14} className="text-teal-300" /> : <ListChecks size={14} className="text-violet-300" />}
                            <span className="text-sm font-bold text-slate-200">{tpl.titleHe}</span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{tpl.titleEn}</span>
                        </div>
                        <ol className="space-y-1.5">
                            {tpl.parts.map((part, i) => (
                                <li key={part.en} className="flex items-start gap-2">
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[9px] font-bold text-slate-400">{i + 1}</span>
                                    <span className="leading-tight">
                                        <span className="text-[12px] font-bold text-slate-200">{part.he}</span>
                                        <span className="ms-1.5 text-[10px] text-slate-500">{part.exampleHe}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ════════════════════════ ניסוי מסכם ═════════════════════════════════════ */

const ExperimentView: React.FC<{ reduce: boolean }> = ({ reduce }) => {
    const [revealed, setRevealed] = useState<number[]>([]);
    const toggle = (i: number) => setRevealed((r) => (r.includes(i) ? r.filter((x) => x !== i) : [...r, i]));

    return (
        <div className="space-y-2.5">
            {IMPROVEMENTS.map((imp, i) => {
                const open = revealed.includes(i);
                return (
                    <div key={i} className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                        <div className="flex items-start gap-2">
                            <span className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-900/15 px-1.5 py-0.5 text-[9px] font-bold text-rose-200" dir="ltr">Before</span>
                            <p className="flex-1 text-sm text-slate-400 line-through decoration-rose-400/40">{imp.beforeHe}</p>
                        </div>

                        {open ? (
                            <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: 0 } : { duration: 0.3 }} className="mt-2">
                                <div className="my-1 flex justify-center"><ArrowDown size={14} className="text-slate-600" /></div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-teal-500/40 bg-teal-900/15 px-1.5 py-0.5 text-[9px] font-bold text-teal-200" dir="ltr">After</span>
                                    <p className="flex-1 text-[15px] leading-relaxed text-slate-100">{imp.afterHe}</p>
                                </div>
                                <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400"><Target size={12} className="mt-0.5 shrink-0 text-violet-300" />{imp.noteHe}</p>
                            </motion.div>
                        ) : (
                            <button type="button" onClick={() => toggle(i)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-900/15 px-3 py-1.5 text-[12px] font-bold text-violet-200 hover:brightness-110">
                                <Sparkles size={13} /> הצג את השיפור
                            </button>
                        )}
                        {open && (
                            <button type="button" onClick={() => toggle(i)} className="mt-2 text-[11px] text-slate-500 hover:text-slate-300">הסתר</button>
                        )}
                    </div>
                );
            })}
            <p className="text-[11px] leading-relaxed text-slate-500">
                בכל שיפור נוסף רכיב מהנוסחה: מטרה, הקשר, מידע, פלט, או גבול בטיחות. הבקשה לא ארוכה יותר סתם, היא ברורה ובטוחה יותר.
            </p>
        </div>
    );
};
