"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Keyboard, Info, Lightbulb, MousePointerClick, ScanLine, Workflow, Wrench,
    CheckCircle2, XCircle, ShieldAlert, ShieldCheck, ListChecks, Boxes,
    BarChart3, Sigma, Lock, Ban, HelpCircle, MessageSquare, ChevronDown,
    ArrowLeft, KeyRound, CircleSlash,
} from 'lucide-react';

import { StickyContextBar, type ContextTone } from './StickyContextBar';
import { ACCENTS } from './accents';
import type { Accent } from './types';

import {
    selectFor, TOOLS, SCENARIOS, NARRATION, DECISION_META, RISK_META, PERMISSION_META,
    GATE_STEPS, BARCODE_SAMPLE, DEFAULT_SCENARIO_ID,
    type SectionNarration, type DecisionTone,
} from '@/app/(course)/behind-the-scenes-ai/_parked/tool-selection/toolData';
import type { ToolEval, ToolSelection } from '@/app/(course)/behind-the-scenes-ai/_parked/tool-selection/toolEngine';
import type { TaskAnalysis } from '@/app/(course)/behind-the-scenes-ai/_parked/chat-to-agent/taskEngine';

/* ════════════════════════ טון צבעוני ═════════════════════════════════════ */
// Selected ב-emerald, No tool needed נייטרלי-teal (כבוד), Ask/Approval ב-amber,
// Blocked/Cannot ב-crimson (rose), אפור לכלי לא רלוונטי.

const TONE: Record<DecisionTone | 'none', { border: string; bg: string; text: string; soft: string }> = {
    selected: { border: 'border-emerald-500/40', bg: 'bg-emerald-900/15', text: 'text-emerald-300', soft: 'bg-emerald-500/15' },
    answer: { border: 'border-teal-500/40', bg: 'bg-teal-900/15', text: 'text-teal-300', soft: 'bg-teal-500/15' },
    ask: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', soft: 'bg-amber-500/15' },
    approval: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', soft: 'bg-amber-500/15' },
    blocked: { border: 'border-rose-500/40', bg: 'bg-rose-900/15', text: 'text-rose-300', soft: 'bg-rose-500/15' },
    none: { border: 'border-slate-700/50', bg: 'bg-slate-950/40', text: 'text-slate-400', soft: 'bg-slate-800/40' },
};

type StateTone = 'ok' | 'warn' | 'block' | 'none';
const STATE_TONE: Record<StateTone, string> = {
    ok: 'text-emerald-300', warn: 'text-amber-300', block: 'text-rose-300', none: 'text-slate-400',
};
const STATE_TONE_BG: Record<StateTone, string> = {
    ok: 'border-emerald-500/40 bg-emerald-900/15', warn: 'border-amber-500/40 bg-amber-900/15',
    block: 'border-rose-500/40 bg-rose-900/15', none: 'border-slate-700/50 bg-slate-950/40',
};

const pctOf = (n: number) => Math.round(n * 100);

// טון החלטת בחירת הכלי → טון פס ההקשר הדביק.
const DECISION_TONE: Record<DecisionTone, ContextTone> = {
    selected: 'go',
    answer: 'go',
    ask: 'caution',
    approval: 'caution',
    blocked: 'stop',
};

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const ToolSelectionLab: React.FC = () => {
    const reduce = !!useReducedMotion();
    const defaultText = SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO_ID)?.text ?? SCENARIOS[0].text;
    const [text, setText] = useState(defaultText);

    const { ctx, selection } = useMemo(() => selectFor(text), [text]);

    const hasBarcode = /\d{6,}/.test(text);
    const activeScenarioId = SCENARIOS.find((s) => s.text === text)?.id;

    const toggleBarcode = () => {
        if (hasBarcode) {
            setText(text.replace(/\s*\d{6,}/, '').replace(/\s{2,}/g, ' ').trim());
        } else if (text.includes('החבילה')) {
            setText(text.replace('החבילה', `החבילה ${BARCODE_SAMPLE}`));
        } else {
            setText(`${text} ${BARCODE_SAMPLE}`.trim());
        }
    };

    return (
        <div className="space-y-5">
            {/* ── בקרה: תרחישים + קלט חופשי + ברקוד ───────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4" dir="rtl">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">תרחיש:</span>
                    {SCENARIOS.map((s) => {
                        const active = s.id === activeScenarioId;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setText(s.text)}
                                aria-pressed={active}
                                className={`rounded-xl border px-3 py-1.5 text-right leading-tight transition-colors ${active ? 'border-violet-500/50 bg-violet-900/25' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                            >
                                <span className={`block text-xs font-bold ${active ? 'text-violet-200' : 'text-slate-300'}`}>{s.labelHe}</span>
                                <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{s.labelEn}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 focus-within:border-violet-500/60">
                    <Keyboard size={15} className="shrink-0 text-violet-300" />
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="כתבו בקשה..."
                        dir="rtl"
                        aria-label="שדה הקלדת בקשה לבחירת כלי"
                        className="w-full bg-transparent py-2.5 text-base font-medium text-white placeholder:text-slate-600 focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Info size={13} /> שנו את הבקשה וראו את הדירוג, השערים וההחלטה מתעדכנים יחד, בזמן אמת.
                    </span>
                    <button
                        type="button"
                        onClick={toggleBarcode}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${hasBarcode ? 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600' : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25'}`}
                    >
                        <ScanLine size={13} /> {hasBarcode ? 'הסרת ברקוד' : `הוספת ברקוד ${BARCODE_SAMPLE}`}
                        <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">{hasBarcode ? 'Remove' : 'Add barcode'}</span>
                    </button>
                </div>
            </div>

            {/* פס הקשר דביק: הבקשה הפעילה + החלטת בחירת הכלי, גלוי לאורך גלילת הדירוג והשערים */}
            <StickyContextBar
                inputText={text.trim() || 'ממתין לבקשה'}
                labelHe={SCENARIOS.find((s) => s.text === text)?.labelHe ?? 'בקשה חופשית'}
                labelEn={SCENARIOS.find((s) => s.text === text)?.labelEn ?? 'Free request'}
                decisionHe={DECISION_META[selection.decision].he}
                decisionEn={DECISION_META[selection.decision].en}
                tone={DECISION_TONE[DECISION_META[selection.decision].tone]}
                reduce={reduce}
            />

            {/* ── הרכיב החתימתי: Tool Decision Gate ───────────────────────── */}
            <LabSection n={NARRATION.gate} icon={<Workflow size={18} className="text-violet-300" />}
                tryButtons={[
                    { label: 'בלי ברקוד', text: 'בדוק למה החבילה לא הגיעה' },
                    { label: 'עם ברקוד 123456789', text: 'בדוק למה החבילה 123456789 לא הגיעה' },
                ]}
                onPick={setText}
            >
                <ToolDecisionGate ctx={ctx} selection={selection} reduce={reduce} />
            </LabSection>

            {/* ── 1. Available Tools Panel ───────────────────────────────── */}
            <LabSection n={NARRATION.tools} icon={<Boxes size={18} className="text-violet-300" />}>
                <AvailableToolsPanel selection={selection} />
            </LabSection>

            {/* ── 2. Tool Match Ranking ──────────────────────────────────── */}
            <LabSection n={NARRATION.ranking} icon={<BarChart3 size={18} className="text-violet-300" />}
                tryButtons={[
                    { label: 'בדוק חבילה', text: 'בדוק למה החבילה 123456789 לא הגיעה' },
                    { label: 'סכם משימות שמתעכבות', text: 'סכם משימות שמתעכבות' },
                ]}
                onPick={setText}
            >
                <ToolMatchRanking selection={selection} reduce={reduce} />
            </LabSection>

            {/* ── 3. Tool Score Formula ──────────────────────────────────── */}
            <LabSection n={NARRATION.formula} icon={<Sigma size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'שלח ללקוח הודעה שהחבילה אבדה', text: 'שלח ללקוח הודעה שהחבילה אבדה' }]} onPick={setText}
            >
                <ToolScoreFormula selection={selection} reduce={reduce} />
            </LabSection>

            {/* ── 4. Selected Tool Highlight ─────────────────────────────── */}
            <LabSection n={NARRATION.selected} icon={<Wrench size={18} className="text-violet-300" />}
                tryButtons={[
                    { label: 'עם ברקוד', text: 'בדוק למה החבילה 123456789 לא הגיעה' },
                    { label: 'בלי ברקוד', text: 'בדוק למה החבילה לא הגיעה' },
                ]}
                onPick={setText}
            >
                <SelectedToolHighlight ctx={ctx} selection={selection} reduce={reduce} />
            </LabSection>

            {/* ── 5. Permission Warning ──────────────────────────────────── */}
            <LabSection n={NARRATION.permission} icon={<KeyRound size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'בדוק את פרטי הלקוח לפי מספר חבילה', text: 'בדוק את פרטי הלקוח לפי מספר חבילה' }]} onPick={setText}
            >
                <PermissionWarning selection={selection} />
            </LabSection>

            {/* ── disclaimer + גשר לפרק 12 ───────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    זהו מודל לימודי של בחירת כלי: המנוע מדרג כלים לפי טבלת חוקים קבועה ושקופה, וצורך את מצב המשימה מפרק 10. <span className="font-bold text-slate-400">Agents אמיתיים בוחרים כלים בצורה עשירה הרבה יותר</span>,
                    אבל העיקרון של התאמה, נתונים, סיכון והרשאה תקף. וזכרו: <span className="font-bold text-slate-400">כלי רלוונטי אינו כלי שאפשר להפעיל עכשיו</span>. הפרק עוצר רגע לפני הפעלת הכלי.
                    הפעלת הכלי עצמה, הקלט שנשלח אליו והתוצאה שחוזרת, הם פרק 12.
                </span>
            </div>
        </div>
    );
};

/* ════════════════════════ עוטף סקשן עם קריינות ════════════════════════════ */

const LabSection: React.FC<{
    n: SectionNarration;
    icon: React.ReactNode;
    children: React.ReactNode;
    tryButtons?: { label: string; text: string }[];
    onPick?: (text: string) => void;
}> = ({ n, icon, children, tryButtons, onPick }) => (
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
            {tryButtons && onPick && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {tryButtons.map((b) => (
                        <button
                            key={b.label}
                            type="button"
                            onClick={() => onPick(b.text)}
                            className="rounded-lg border border-slate-700/60 bg-slate-800/50 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-violet-500/50 hover:text-violet-200"
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </section>
);

/* ════════════════════════ Tool Decision Gate (חתימתי) ════════════════════ */

const ToolDecisionGate: React.FC<{ ctx: TaskAnalysis; selection: ToolSelection; reduce: boolean }> = ({ selection, reduce }) => {
    const meta = DECISION_META[selection.decision];
    const tone = TONE[meta.tone];
    const relevant = selection.evals.filter((e) => e.gates.matchPass).slice(0, 3);

    return (
        <div className="space-y-3">
            {/* ההחלטה */}
            <motion.div
                key={selection.decision + selection.reasonHe}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                className={`rounded-xl border p-4 ${tone.border} ${tone.bg}`}
            >
                <div className="flex flex-wrap items-center gap-2">
                    <DecisionIcon kind={selection.decision} className={tone.text} />
                    <span className={`text-base font-black ${tone.text}`}>{meta.he}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en}</span>
                    {selection.decision === 'stop-approval' && (
                        <span className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200" dir="ltr">Human approval required</span>
                    )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{selection.reasonHe}</p>
            </motion.div>

            {/* טבלת ארבעת השערים לכלים הרלוונטיים */}
            {relevant.length === 0 ? (
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-400">
                    אין כאן כלי שעובר את שער ההתאמה. זה בסדר גמור: לא כל בקשה צריכה כלי, ולפעמים הצעד הנכון הוא פשוט לענות.
                </div>
            ) : (
                <div className="space-y-2">
                    {/* כותרות העמודות */}
                    <div className="hidden grid-cols-[1fr_repeat(4,5.5rem)_5rem] items-center gap-2 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:grid" dir="ltr">
                        <span className="text-right" dir="rtl">Tool</span>
                        {GATE_STEPS.map((g) => <span key={g.id} className="text-center">{g.en}</span>)}
                        <span className="text-center">Result</span>
                    </div>
                    {relevant.map((e) => (
                        <GateRow key={e.tool.id} ev={e} selection={selection} reduce={reduce} />
                    ))}
                </div>
            )}
        </div>
    );
};

const GateRow: React.FC<{ ev: ToolEval; selection: ToolSelection; reduce: boolean }> = ({ ev, selection, reduce }) => {
    const isSelected = selection.selectedToolId === ev.tool.id;
    const resultTone: DecisionTone = isSelected ? 'selected' : ev.selectable ? 'answer' : 'blocked';
    const rt = TONE[resultTone];
    const resultHe = isSelected ? 'נבחר' : ev.selectable ? 'זמין' : 'חסום';
    const resultEn = isSelected ? 'Selected' : ev.selectable ? 'Available' : 'Blocked';

    const gateStates: { pass: boolean; labelHe: string }[] = [
        { pass: ev.gates.matchPass, labelHe: `${pctOf(ev.match)}%` },
        { pass: ev.gates.inputPass, labelHe: ev.gates.inputPass ? 'קיים' : 'חסר' },
        { pass: ev.gates.riskPass, labelHe: RISK_META[ev.tool.risk].he },
        { pass: ev.gates.permPass, labelHe: PERMISSION_META[ev.tool.permission].he },
    ];

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
            className={`grid grid-cols-2 items-center gap-2 rounded-xl border p-2.5 sm:grid-cols-[1fr_repeat(4,5.5rem)_5rem] ${isSelected ? `${rt.border} ${rt.bg}` : 'border-slate-700/50 bg-slate-950/30'}`}
        >
            <span className="col-span-2 leading-tight sm:col-span-1" dir="ltr">
                <span className={`block text-sm font-bold ${isSelected ? rt.text : 'text-slate-200'}`}>{ev.tool.nameEn}</span>
                <span className="block text-[10px] text-slate-500" dir="rtl">{ev.tool.nameHe}</span>
            </span>
            {gateStates.map((g, i) => (
                <span key={i} className={`flex items-center justify-center gap-1 rounded-lg border px-1 py-1 text-[10px] font-bold ${g.pass ? 'border-emerald-500/30 bg-emerald-900/10 text-emerald-300' : 'border-rose-500/30 bg-rose-900/10 text-rose-300'}`}>
                    {g.pass ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                    <span dir="ltr">{g.labelHe}</span>
                </span>
            ))}
            <span className={`flex items-center justify-center gap-1 rounded-lg border px-1 py-1 text-[10px] font-black ${rt.border} ${rt.soft} ${rt.text}`}>
                {isSelected ? <ShieldCheck size={12} /> : ev.selectable ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                <span className="leading-none">
                    {resultHe}<span className="ms-1 opacity-70" dir="ltr">{resultEn}</span>
                </span>
            </span>
        </motion.div>
    );
};

const DecisionIcon: React.FC<{ kind: ToolSelection['decision']; className?: string }> = ({ kind, className }) => {
    const map: Record<ToolSelection['decision'], React.ReactNode> = {
        'no-tool': <MessageSquare size={16} className={className} />,
        clarify: <HelpCircle size={16} className={className} />,
        'ask-input': <HelpCircle size={16} className={className} />,
        'stop-approval': <ShieldAlert size={16} className={className} />,
        'cannot-use': <CircleSlash size={16} className={className} />,
        ready: <Wrench size={16} className={className} />,
    };
    return <>{map[kind]}</>;
};

/* ════════════════════════ 1. Available Tools Panel ═══════════════════════ */

const AvailableToolsPanel: React.FC<{ selection: ToolSelection }> = ({ selection }) => {
    const [openId, setOpenId] = useState<string | null>('tracking');
    const relevantIds = new Set(selection.evals.filter((e) => e.gates.matchPass).map((e) => e.tool.id));

    return (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {TOOLS.map((tool) => {
                const a = ACCENTS[tool.accent as Accent];
                const isSelected = selection.selectedToolId === tool.id;
                const isRelevant = relevantIds.has(tool.id);
                const open = openId === tool.id;
                return (
                    <button
                        key={tool.id}
                        type="button"
                        onClick={() => setOpenId(open ? null : tool.id)}
                        className={`rounded-2xl border p-4 text-right transition-colors ${isSelected ? 'border-emerald-500/50 bg-emerald-900/15' : isRelevant ? `${a.border} ${a.bgSoft}` : 'border-slate-700/50 bg-slate-950/30 hover:border-slate-600'}`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="leading-tight">
                                <div className={`text-sm font-bold ${isSelected ? 'text-emerald-200' : 'text-slate-100'}`} dir="ltr">{tool.nameEn}</div>
                                <div className="text-[10px] text-slate-500">{tool.nameHe}</div>
                            </div>
                            <ChevronDown size={15} className={`mt-0.5 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                        </div>

                        <div className="mt-2 text-[13px] font-medium text-slate-200">{tool.canDoHe}</div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-600" dir="ltr">{tool.canDoEn}</div>

                        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                            <Pill labelHe="קלט" valueHe={tool.requiredInput ? tool.requiredInput.he : 'אין'} tone={tool.requiredInput ? 'warn' : 'none'} />
                            <Pill labelHe="סיכון" valueHe={RISK_META[tool.risk].he} tone={RISK_META[tool.risk].tone} />
                            <Pill labelHe="הרשאה" valueHe={PERMISSION_META[tool.permission].he} tone={PERMISSION_META[tool.permission].tone} />
                        </div>

                        <AnimatePresence initial={false}>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.22 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 space-y-1.5 border-t border-slate-700/40 pt-2.5 text-[11px] leading-relaxed">
                                        <BoundaryRow icon={<ListChecks size={12} className="text-teal-300" />} labelHe="מחזיר" value={tool.returnsHe} />
                                        <BoundaryRow icon={<Ban size={12} className="text-rose-300" />} labelHe="אסור לו" value={tool.cannotHe} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                );
            })}
        </div>
    );
};

const Pill: React.FC<{ labelHe: string; valueHe: string; tone: StateTone }> = ({ labelHe, valueHe, tone }) => (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-bold ${STATE_TONE_BG[tone]} ${STATE_TONE[tone]}`}>
        <span className="text-slate-500">{labelHe}:</span> {valueHe}
    </span>
);

const BoundaryRow: React.FC<{ icon: React.ReactNode; labelHe: string; value: string }> = ({ icon, labelHe, value }) => (
    <div className="flex items-start gap-1.5">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <span className="text-slate-400"><span className="font-bold text-slate-300">{labelHe}: </span>{value}</span>
    </div>
);

/* ════════════════════════ 2. Tool Match Ranking ══════════════════════════ */

const ToolMatchRanking: React.FC<{ selection: ToolSelection; reduce: boolean }> = ({ selection, reduce }) => {
    const max = Math.max(...selection.evals.map((e) => e.match), 0.01);
    return (
        <div className="space-y-2">
            {selection.evals.map((e) => {
                const isTop = e.tool.id === selection.topRelevantId;
                const isSelected = e.tool.id === selection.selectedToolId;
                const a = ACCENTS[e.tool.accent as Accent];
                return (
                    <div key={e.tool.id} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 truncate text-xs leading-tight" dir="ltr">
                            <span className={`block font-bold ${isTop ? a.text : 'text-slate-300'}`}>{e.tool.nameEn}</span>
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/80">
                            <motion.div
                                animate={{ width: `${(e.match / max) * 100}%` }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 20 }}
                                className={`h-full rounded-full ${isSelected ? 'bg-gradient-to-l from-emerald-400 to-teal-500' : isTop ? a.barGradient : 'bg-slate-600'}`}
                            />
                        </div>
                        <span className={`w-10 shrink-0 text-left font-mono text-xs font-bold ${isTop ? a.text : 'text-slate-500'}`} dir="ltr">{pctOf(e.match)}</span>
                    </div>
                );
            })}
            <p className="pt-1 text-[11px] leading-relaxed text-slate-500">
                ההתאמה היא בין המשימה ליכולות הכלי. כלי בראש הדירוג עדיין צריך לעבור את שערי הקלט, הסיכון וההרשאה כדי להיבחר.
            </p>
        </div>
    );
};

/* ════════════════════════ 3. Tool Score Formula ══════════════════════════ */

const ToolScoreFormula: React.FC<{ selection: ToolSelection; reduce: boolean }> = ({ selection, reduce }) => {
    const rows = [...selection.evals].sort((a, b) => b.toolScore - a.toolScore);
    const f2 = (n: number) => n.toFixed(2);
    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 font-mono text-[12px] text-slate-300" dir="ltr">
                tool_score = task_match + data_match - <span className="text-rose-300">risk_penalty</span>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[30rem] space-y-1.5">
                    <div className="grid grid-cols-[1fr_4rem_4rem_4.5rem_4.5rem] items-center gap-2 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                        <span className="text-right" dir="rtl">Tool</span>
                        <span className="text-center">task</span>
                        <span className="text-center">data</span>
                        <span className="text-center text-rose-300/80">risk</span>
                        <span className="text-center text-violet-200">score</span>
                    </div>
                    {rows.map((e) => {
                        const a = ACCENTS[e.tool.accent as Accent];
                        const top = e.tool.id === selection.selectedToolId;
                        return (
                            <motion.div
                                key={e.tool.id}
                                layout={!reduce}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                                className={`grid grid-cols-[1fr_4rem_4rem_4.5rem_4.5rem] items-center gap-2 rounded-lg border px-2 py-2 ${top ? 'border-emerald-500/40 bg-emerald-900/15' : 'border-slate-700/40 bg-slate-950/30'}`}
                            >
                                <span className={`truncate text-xs font-bold ${top ? 'text-emerald-200' : a.text}`} dir="ltr">{e.tool.nameEn}</span>
                                <span className="text-center font-mono text-xs text-slate-300" dir="ltr">{f2(e.match)}</span>
                                <span className="text-center font-mono text-xs text-slate-300" dir="ltr">+{f2(e.dataMatch)}</span>
                                <span className="text-center font-mono text-xs text-rose-300" dir="ltr">-{f2(e.riskPenalty)}</span>
                                <span className={`text-center font-mono text-sm font-black ${top ? 'text-emerald-200' : 'text-violet-200'}`} dir="ltr">{f2(e.toolScore)}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
                שימו לב לעמודת ה-<span className="font-mono text-rose-300">risk</span>: כלי בעל סיכון גבוה (כמו שליחת דואר) מאבד יותר ניקוד, ולכן יכול לרדת מתחת לכלי שרק קורא מידע, גם כשההתאמה שלו גבוהה.
            </p>
        </div>
    );
};

/* ════════════════════════ 4. Selected Tool Highlight ═════════════════════ */

const SelectedToolHighlight: React.FC<{ ctx: TaskAnalysis; selection: ToolSelection; reduce: boolean }> = ({ selection, reduce }) => {
    const selected = selection.selectedToolId ? TOOLS.find((t) => t.id === selection.selectedToolId) : null;
    const topTool = selection.topRelevantId ? TOOLS.find((t) => t.id === selection.topRelevantId) : null;

    // מצב א: נבחר כלי.
    if (selected) {
        return (
            <motion.div
                key="selected"
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 22 }}
                className="rounded-2xl border border-emerald-500/50 bg-emerald-900/15 p-5"
            >
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80" dir="ltr">Selected tool, ready to call</span>
                </div>
                <div className="mt-2 text-xl font-black text-emerald-100" dir="ltr">{selected.nameEn}</div>
                <p className="text-sm text-slate-300">{selected.canDoHe}. כל ארבעת השערים ירוקים, אז אפשר להתקדם להפעלה (פרק 12).</p>
            </motion.div>
        );
    }

    // מצב ב: כלי רלוונטי אבל חסר קלט. הלב של הפרק.
    if (selection.decision === 'ask-input' && topTool) {
        return (
            <div className="space-y-2">
                <div className="rounded-2xl border border-amber-500/40 bg-amber-900/15 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-teal-500/40 bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold text-teal-200" dir="ltr">Relevant</span>
                        <ArrowLeft size={13} className="text-slate-500" />
                        <span className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-200" dir="ltr">Input missing</span>
                    </div>
                    <div className="mt-2 text-xl font-black text-amber-100" dir="ltr">{topTool.nameEn}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                        הכלי מתאים למשימה, אבל הוא צריך <span className="font-bold text-amber-200">{selection.missingInputHe}</span> כדי לרוץ. הוא נשאר רלוונטי, אבל עדיין אי אפשר להפעיל אותו.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-200">
                        <HelpCircle size={14} /> הצעד הבא: {DECISION_META['ask-input'].he} ({selection.missingInputHe})
                    </div>
                </div>
            </div>
        );
    }

    // מצב ג: אין כלי נבחר (אין צורך / חסום אחר).
    const isNoToolNeeded = selection.decision === 'no-tool';
    const t = isNoToolNeeded ? TONE.answer : TONE[DECISION_META[selection.decision].tone];
    return (
        <div className={`rounded-2xl border p-5 ${t.border} ${t.bg}`}>
            <div className="flex items-center gap-2">
                {isNoToolNeeded ? <MessageSquare size={18} className={t.text} /> : <Lock size={18} className={t.text} />}
                <span className={`text-[10px] font-bold uppercase tracking-wider ${t.text}`} dir="ltr">
                    {isNoToolNeeded ? 'No tool selected, and that is fine' : 'No tool selected'}
                </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{selection.reasonHe}</p>
            {isNoToolNeeded && selection.noToolReason === 'answerable' && (
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    הימנעות משימוש בכלי כשאין צורך היא שיקול דעת, לא כישלון. שימוש מיותר בכלי יכול להיות איטי, יקר ומסוכן לפרטיות.
                </p>
            )}
        </div>
    );
};

/* ════════════════════════ 5. Permission Warning ══════════════════════════ */

const PermissionWarning: React.FC<{ selection: ToolSelection }> = ({ selection }) => {
    const relevant = selection.evals.filter((e) => e.gates.matchPass);
    const blockedByPerm = relevant.filter((e) => !e.gates.permPass);

    return (
        <div className="space-y-2.5">
            {blockedByPerm.length === 0 ? (
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-400">
                    בתרחיש הנוכחי אין כלי רלוונטי שחסום בגלל הרשאה. נסו את הבקשה על פרטי לקוח כדי לראות שער הרשאה נסגר, גם כשהכלי מתאים והקלט קיים.
                </div>
            ) : (
                blockedByPerm.map((e) => {
                    const isApproval = e.tool.permission === 'approval';
                    const tone = isApproval ? TONE.approval : TONE.blocked;
                    return (
                        <div key={e.tool.id} className={`rounded-2xl border p-4 ${tone.border} ${tone.bg}`}>
                            <div className="flex flex-wrap items-center gap-2">
                                {isApproval ? <KeyRound size={16} className={tone.text} /> : <Lock size={16} className={tone.text} />}
                                <span className="text-sm font-black text-slate-100" dir="ltr">{e.tool.nameEn}</span>
                                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${tone.border} ${tone.soft} ${tone.text}`} dir="ltr">
                                    Permission {isApproval ? 'approval needed' : 'missing'}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                                <Pill labelHe="התאמה" valueHe={`${pctOf(e.match)}%`} tone="ok" />
                                <Pill labelHe="קלט" valueHe={e.gates.inputPass ? 'קיים' : 'חסר'} tone={e.gates.inputPass ? 'ok' : 'warn'} />
                                <Pill labelHe="הרשאה" valueHe={PERMISSION_META[e.tool.permission].he} tone={isApproval ? 'warn' : 'block'} />
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                {isApproval
                                    ? 'טכנית אפשר להפעיל את הכלי, אבל הוא דורש אישור אנושי. "האם אני יכול" אינו "האם מותר לי".'
                                    : 'הכלי מתאים והקלט קיים, אבל חסרה הרשאה להשתמש בו. הצעד הנכון הוא לבקש הרשאה או לעצור, לא לעקוף.'}
                            </p>
                        </div>
                    );
                })
            )}
        </div>
    );
};
