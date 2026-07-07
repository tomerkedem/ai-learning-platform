"use client";

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Info, Lightbulb, MousePointerClick, ShieldCheck, ShieldAlert, Lock, Ban,
    CheckCircle2, XCircle, Gauge, KeyRound, HelpCircle, MessageSquare, Send,
    PenLine, AlertTriangle, ArrowLeft, ArrowDown, Workflow, ListChecks, ScrollText,
} from 'lucide-react';

import {
    buildControl, SCENARIOS, DEFAULT_SCENARIO_ID, RISK_SAMPLES, NARRATION,
    ACTION_META, RISK_META, RISK_ORDER, PERMISSION_BOUNDARIES,
    GATE_META, DECISION_META, CONTROL_NODES, STOP_INDEX,
    type ControlState, type Scenario, type SectionNarration, type DecisionTone,
    type RiskLevel, type Permission,
} from '@/app/behind-the-scenes-ai/_parked/agent-control/controlData';

/* ════════════════════════ טון צבעוני ═════════════════════════════════════ */
// Continue/Answer ב-teal, Draft/Ask ב-amber, Stop ב-crimson של זהירות אחראית.

const TONE: Record<DecisionTone | 'slate', { border: string; bg: string; text: string; soft: string }> = {
    continue: { border: 'border-teal-500/40', bg: 'bg-teal-900/15', text: 'text-teal-300', soft: 'bg-teal-500/15' },
    draft: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', soft: 'bg-amber-500/15' },
    ask: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', soft: 'bg-amber-500/15' },
    stop: { border: 'border-rose-500/40', bg: 'bg-rose-900/15', text: 'text-rose-300', soft: 'bg-rose-500/15' },
    slate: { border: 'border-slate-700/50', bg: 'bg-slate-950/40', text: 'text-slate-400', soft: 'bg-slate-800/40' },
};

const RISK_STYLE: Record<RiskLevel, { text: string; fill: string; border: string; bg: string }> = {
    low: { text: 'text-teal-300', fill: 'bg-teal-500/70', border: 'border-teal-500/40', bg: 'bg-teal-900/15' },
    medium: { text: 'text-amber-300', fill: 'bg-amber-500/70', border: 'border-amber-500/40', bg: 'bg-amber-900/15' },
    high: { text: 'text-rose-300', fill: 'bg-rose-500/70', border: 'border-rose-500/40', bg: 'bg-rose-900/15' },
    critical: { text: 'text-red-300', fill: 'bg-red-600/70', border: 'border-red-600/50', bg: 'bg-red-950/30' },
};

const PERMISSION_TONE: Record<Permission, 'continue' | 'draft' | 'stop'> = {
    allowed: 'continue',
    'requires-approval': 'draft',
    blocked: 'stop',
};

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const ControlLayerLab: React.FC = () => {
    const reduce = !!useReducedMotion();
    const defaultText = SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO_ID)?.text ?? SCENARIOS[0].text;
    const [text, setText] = useState(defaultText);

    const { scenario, state } = useMemo(() => buildControl(text), [text]);
    const activeScenarioId = SCENARIOS.find((s) => s.text === text)?.id;

    return (
        <div className="space-y-5">
            {/* ── בקרה: תרחישים ─ נצמד בראש כדי להחליף תרחיש תוך כדי גלילת שכבות הבקרה ─ */}
            <div
                className="sticky z-20 flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/85 p-4 shadow-xl shadow-black/30 backdrop-blur-xl"
                dir="rtl"
                style={{ top: 'var(--bts-sticky-top, 88px)' }}
            >
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
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Info size={13} /> הבקשה: <span className="rounded bg-slate-800/70 px-1.5 py-0.5 font-bold text-slate-300">&quot;{text}&quot;</span>
                </span>
            </div>

            {/* ── שכבת הבקרה (תרשים חתימתי) ───────────────────────────────── */}
            <ControlLayerPipeline state={state} reduce={reduce} />

            {/* ── 1. Risk Level Indicator ────────────────────────────────── */}
            <LabSection n={NARRATION.risk} icon={<Gauge size={18} className="text-violet-300" />}
                tryButtons={RISK_SAMPLES.map((s) => ({ label: s.labelHe, text: s.text }))} onPick={setText}
            >
                <RiskIndicator state={state} reduce={reduce} />
            </LabSection>

            {/* ── 2. Human Approval Gate ─────────────────────────────────── */}
            <LabSection n={NARRATION.approval} icon={<ShieldCheck size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'שלח ללקוח הודעה שהחבילה אבדה', text: 'שלח ללקוח הודעה שהחבילה אבדה' }]} onPick={setText}
            >
                <ApprovalGate state={state} reduce={reduce} />
            </LabSection>

            {/* ── 3. Permission Boundary View ────────────────────────────── */}
            <LabSection n={NARRATION.permission} icon={<KeyRound size={18} className="text-violet-300" />}>
                <PermissionBoundary state={state} />
            </LabSection>

            {/* ── 4. Clarifying Question Panel ───────────────────────────── */}
            <LabSection n={NARRATION.clarify} icon={<HelpCircle size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'תעדכן אותו שזה טופל', text: 'תעדכן אותו שזה טופל' }]} onPick={setText}
            >
                <ClarifyingQuestion scenario={scenario} state={state} />
            </LabSection>

            {/* ── 5. Stop Before Action Demo ─────────────────────────────── */}
            <LabSection n={NARRATION.stop} icon={<ShieldAlert size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'שלח ללקוח הודעה שהחבילה אבדה', text: 'שלח ללקוח הודעה שהחבילה אבדה' }]} onPick={setText}
            >
                <StopBeforeAction state={state} reduce={reduce} />
            </LabSection>

            {/* ── 6. Draft Instead of Send ───────────────────────────────── */}
            <LabSection n={NARRATION.draft} icon={<PenLine size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'שלח ללקוח הודעה שהחבילה אבדה', text: 'שלח ללקוח הודעה שהחבילה אבדה' }]} onPick={setText}
            >
                <DraftInsteadOfSend scenario={scenario} state={state} reduce={reduce} />
            </LabSection>

            {/* ── disclaimer + גשר לפרק 14 ───────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    זהו מודל לימודי שמאחד את שער הביטחון (פרק 9), ההרשאות (פרק 11), ושער הסיכון (פרק 12). אף פעולה אמיתית לא מתבצעת.
                    <span className="font-bold text-slate-400"> מערכות אמיתיות מנהלות ממשל והרשאות מורכבים יותר</span>, אבל העיקרון של סיכון, הרשאה ואישור תקף.
                    וזכרו: <span className="font-bold text-slate-400">עצירה אינה כישלון, היא אחריות</span>. ה-Agent מוגבל בכוונה, וזה מה שהופך אותו למקצועי.
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

/* ════════════════════════ שכבת הבקרה (חתימתי) ════════════════════════════ */

const ControlLayerPipeline: React.FC<{ state: ControlState; reduce: boolean }> = ({ state, reduce }) => {
    const stopIndex = STOP_INDEX[state.decision];
    const dmeta = DECISION_META[state.decision];
    const dt = TONE[dmeta.tone];
    const isStop = state.decision !== 'answer' && state.decision !== 'draft';

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-violet-900/10 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Workflow size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">שכבת הבקרה</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">The Control Layer</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5" dir="ltr">
                {CONTROL_NODES.map((node, i) => {
                    const passed = i < stopIndex;
                    const here = i === stopIndex;
                    const label = node.id === 'action' && here ? dmeta.en : node.en;
                    return (
                        <React.Fragment key={node.id}>
                            {i > 0 && <ArrowLeft size={12} className={`rotate-180 ${i <= stopIndex ? 'text-violet-500/50' : 'text-slate-700'}`} />}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: i > stopIndex ? 0.4 : 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.04 }}
                                className={`rounded-lg border px-2 py-1 text-center leading-tight ${
                                    here ? `${dt.border} ${dt.bg}` : passed ? 'border-teal-500/40 bg-teal-900/15' : 'border-slate-800 bg-slate-950/30'
                                }`}
                            >
                                <span className={`block text-[10px] font-bold ${here ? dt.text : passed ? 'text-teal-200' : 'text-slate-500'}`}>{node.he}</span>
                                <span className="block text-[7px] uppercase tracking-wider text-slate-500" dir="ltr">{label}</span>
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* ההחלטה */}
            <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${dt.border} ${dt.bg}`}>
                <span className="inline-flex items-center gap-2">
                    {isStop ? <ShieldAlert size={16} className={dt.text} /> : <ShieldCheck size={16} className={dt.text} />}
                    <span className="leading-tight">
                        <span className={`block text-sm font-black ${dt.text}`}>{dmeta.he}</span>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{dmeta.en}</span>
                    </span>
                </span>
                <span className="text-[11px] text-slate-400">{isStop ? 'עצירה אחראית, לא כישלון' : 'הפעולה זורמת עד הסוף'}</span>
            </div>

            {/* הנוסחה הלוגית + הקלטים החיים */}
            <div className="mt-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-2 font-mono text-[11px] text-slate-400" dir="ltr">
                    action_allowed = confidence_high AND risk_low AND permission_granted
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]" dir="ltr">
                    <BoolChip label="confidence_high" value={state.confidence === 'high'} />
                    <span className="text-slate-600">AND</span>
                    <BoolChip label="risk_low" value={state.risk === 'low'} />
                    <span className="text-slate-600">AND</span>
                    <BoolChip label="permission_granted" value={state.permission === 'allowed'} />
                    <span className="text-slate-600">=</span>
                    <BoolChip label="action_allowed" value={state.actionAllowed} strong />
                </div>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">
                פעולה בסיכון נמוך זורמת עד Action. פעולה רגישה נעצרת מוקדם, בשער הסיכון, ההרשאה, או האישור. עברו בין התרחישים וראו היכן כל אחד נעצר.
            </p>
        </div>
    );
};

const BoolChip: React.FC<{ label: string; value: boolean; strong?: boolean }> = ({ label, value, strong }) => (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono font-bold ${value ? 'border-teal-500/40 bg-teal-500/10 text-teal-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'} ${strong ? 'ring-1 ring-inset ring-white/10' : ''}`}>
        {value ? <CheckCircle2 size={11} /> : <XCircle size={11} />} {label}
    </span>
);

/* ════════════════════════ 1. Risk Level Indicator ════════════════════════ */

const RiskIndicator: React.FC<{ state: ControlState; reduce: boolean }> = ({ state, reduce }) => {
    const meta = RISK_META[state.risk];
    const s = RISK_STYLE[state.risk];
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {RISK_ORDER.map((lv, i) => {
                    const filled = RISK_META[lv].level <= meta.level;
                    const ls = RISK_STYLE[lv];
                    return (
                        <motion.div
                            key={lv}
                            initial={reduce ? false : { opacity: 0.4 }}
                            animate={{ opacity: filled ? 1 : 0.3 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.05 }}
                            className={`h-3 flex-1 rounded-full ${filled ? ls.fill : 'bg-slate-800'}`}
                        />
                    );
                })}
            </div>
            <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${s.border} ${s.bg}`}>
                <span className="inline-flex items-center gap-2">
                    <Gauge size={16} className={s.text} />
                    <span className="leading-tight">
                        <span className={`block text-lg font-black ${s.text}`}>{meta.he}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en} risk</span>
                    </span>
                </span>
                <span className="text-left leading-tight">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Action</span>
                    <span className="block text-sm font-bold text-slate-200">{state.action ? ACTION_META[state.action].he : 'לא זוהתה'}<span className="ms-1.5 text-[10px] text-slate-500" dir="ltr">{state.action ? ACTION_META[state.action].en : ''}</span></span>
                </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {RISK_ORDER.map((lv) => (
                    <div key={lv} className={`rounded-lg border px-2 py-1 text-center text-[10px] font-bold ${lv === state.risk ? `${RISK_STYLE[lv].border} ${RISK_STYLE[lv].bg} ${RISK_STYLE[lv].text}` : 'border-slate-800 bg-slate-950/30 text-slate-500'}`}>
                        {RISK_META[lv].he}<span className="ms-1 opacity-60" dir="ltr">{RISK_META[lv].en}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ════════════════════════ 2. Human Approval Gate ═════════════════════════ */

const ApprovalGate: React.FC<{ state: ControlState; reduce: boolean }> = ({ state, reduce }) => {
    const gate = state.gate;
    const tone = gate === 'open' ? TONE.continue : gate === 'approval' ? TONE.draft : TONE.stop;
    const meta = GATE_META[gate];
    return (
        <div className="space-y-3">
            <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${tone.border} ${tone.bg}`}>
                <span className="inline-flex items-center gap-3">
                    <motion.span
                        key={gate}
                        initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20 }}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border ${tone.border} ${tone.soft}`}
                    >
                        {gate === 'open' ? <ShieldCheck size={20} className={tone.text} /> : gate === 'approval' ? <Lock size={20} className={tone.text} /> : <Ban size={20} className={tone.text} />}
                    </motion.span>
                    <span className="leading-tight">
                        <span className={`block text-base font-black ${tone.text}`}>{meta.he}</span>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en}</span>
                    </span>
                </span>
                {gate === 'approval' && (
                    <span className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200" dir="ltr">Human approval required</span>
                )}
            </div>

            {gate !== 'open' && state.confidence === 'high' && (
                <div className="flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-sm leading-relaxed text-slate-300">
                    <Info size={15} className="mt-0.5 shrink-0 text-amber-300" />
                    <span>שימו לב: ה-Agent <span className="font-bold text-slate-200">מבין את המשימה</span> והביטחון שלו גבוה. ובכל זאת השער סגור, כי הפעולה רגישה. <span className="font-bold text-amber-200">ביטחון גבוה אינו תחליף לאישור.</span></span>
                </div>
            )}
            {gate === 'open' && (
                <div className="flex items-start gap-2 rounded-xl border border-teal-500/30 bg-teal-900/10 p-3 text-sm leading-relaxed text-slate-300">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-300" />
                    <span>הפעולה בסיכון נמוך ובתוך ההרשאה, אז היא יכולה לרוץ אוטומטית. המערכת לא משותקת, היא מתאימה בקרה לסיכון.</span>
                </div>
            )}
        </div>
    );
};

/* ════════════════════════ 3. Permission Boundary View ════════════════════ */

const PermissionBoundary: React.FC<{ state: ControlState }> = ({ state }) => (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {PERMISSION_BOUNDARIES.map((group) => {
            const active = state.permission === group.group;
            const tone = TONE[PERMISSION_TONE[group.group]];
            return (
                <div key={group.group} className={`rounded-2xl border p-3 ${active ? `${tone.border} ${tone.bg}` : 'border-slate-700/50 bg-slate-950/30'}`}>
                    <div className="mb-2 flex items-center gap-1.5">
                        {group.group === 'allowed' ? <CheckCircle2 size={14} className={tone.text} /> : group.group === 'requires-approval' ? <Lock size={14} className={tone.text} /> : <Ban size={14} className={tone.text} />}
                        <span className={`text-sm font-bold ${active ? tone.text : 'text-slate-300'}`}>{group.he}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{group.en}</span>
                    </div>
                    <ul className="space-y-1">
                        {group.items.map((item) => (
                            <li key={item} className="flex items-start gap-1.5 text-[12px] leading-relaxed text-slate-400">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-600" /> {item}
                            </li>
                        ))}
                    </ul>
                    {active && (
                        <div className={`mt-2 rounded-md px-2 py-0.5 text-center text-[10px] font-bold ${tone.soft} ${tone.text}`}>הפעולה הנוכחית כאן</div>
                    )}
                </div>
            );
        })}
    </div>
);

/* ════════════════════════ 4. Clarifying Question Panel ═══════════════════ */

const ClarifyingQuestion: React.FC<{ scenario: Scenario | null; state: ControlState }> = ({ scenario, state }) => {
    if (!state.ambiguous || !scenario?.missingRefs) {
        return (
            <div className="flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-400">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-300" />
                <span>בבקשה הנוכחית אין עמימות, ההפניות ברורות. נסו את הבקשה &quot;תעדכן אותו שזה טופל&quot; כדי לראות איך עמימות עוצרת את ה-Agent.</span>
            </div>
        );
    }
    return (
        <div className="space-y-3">
            <div className="space-y-2">
                {scenario.missingRefs.map((ref) => (
                    <div key={ref.ref} className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-900/15 p-3">
                        <span className="rounded-md bg-slate-800/70 px-2 py-0.5 font-mono text-sm font-bold text-amber-200">&quot;{ref.ref}&quot;</span>
                        <ArrowLeft size={13} className="text-slate-500" />
                        <span className="text-sm text-slate-300">{ref.he}</span>
                    </div>
                ))}
            </div>
            <div className="my-1 flex justify-center"><ArrowDown size={16} className="text-slate-600" /></div>
            <div className="rounded-xl border border-violet-500/40 bg-violet-900/20 p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-300/80" dir="ltr">
                    <HelpCircle size={12} /> Clarifying question
                </div>
                <p className="mt-1 text-base font-bold leading-relaxed text-violet-100">{scenario.clarifyQuestionHe}</p>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
                כאן לא צריך כלי, צריך שאלה. שאלה מבהירה במצב עמימות היא צעד אחראי, בדיוק כמו עצירה מול סיכון.
            </p>
        </div>
    );
};

/* ════════════════════════ 5. Stop Before Action Demo ═════════════════════ */

const StopBeforeAction: React.FC<{ state: ControlState; reduce: boolean }> = ({ state, reduce }) => {
    const dmeta = DECISION_META[state.decision];
    const dt = TONE[dmeta.tone];
    const allPass = state.checks.every((c) => c.pass);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {/* כוונת המשתמש */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                        <MessageSquare size={12} className="text-slate-400" /> User intent
                    </div>
                    <p className="text-sm font-bold text-slate-200">&quot;{state.text}&quot;</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">ה-Agent יודע בדיוק מה המשתמש ביקש. השאלה היא לא אם הוא מבין, אלא אם נכון לפעול.</p>
                </div>

                {/* בדיקות המנוע */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                        <ListChecks size={12} className="text-slate-400" /> Engine checks
                    </div>
                    <div className="space-y-1.5">
                        {state.checks.map((c, i) => (
                            <motion.div
                                key={c.id}
                                initial={reduce ? false : { opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.12 }}
                                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 ${c.pass ? 'border-teal-500/30 bg-teal-900/10' : 'border-rose-500/30 bg-rose-900/10'}`}
                            >
                                <span className="flex items-center gap-2 text-sm">
                                    {c.pass ? <CheckCircle2 size={14} className="text-teal-300" /> : <XCircle size={14} className="text-rose-300" />}
                                    <span className={c.pass ? 'text-slate-200' : 'text-rose-200'}>{c.labelHe}</span>
                                </span>
                                <span className={`text-[10px] font-bold uppercase ${c.pass ? 'text-teal-300' : 'text-rose-300'}`} dir="ltr">{c.pass ? 'pass' : 'fail'}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ההחלטה */}
            <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${dt.border} ${dt.bg}`}>
                <span className="inline-flex items-center gap-2">
                    {allPass ? <ShieldCheck size={16} className={dt.text} /> : <ShieldAlert size={16} className={dt.text} />}
                    <span className={`text-sm font-black ${dt.text}`}>{dmeta.he}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{dmeta.en}</span>
                </span>
                <span className="text-[11px] text-slate-400">{allPass ? 'כל הבדיקות עברו, אפשר להמשיך' : 'בדיקה נכשלה, עוצרים לפני פעולה'}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
                כשבדיקה נכשלת, ה-Agent לא מתנגד למשתמש, הוא מגן על התהליך. עצירה לפני פעולה היא אחריות, לא סירוב.
            </p>
        </div>
    );
};

/* ════════════════════════ 6. Draft Instead of Send ═══════════════════════ */

const DraftInsteadOfSend: React.FC<{ scenario: Scenario | null; state: ControlState; reduce: boolean }> = ({ scenario, state, reduce }) => {
    if (!scenario?.draftHe) {
        return (
            <div className="flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-400">
                <Info size={15} className="mt-0.5 shrink-0 text-violet-300" />
                <span>בתרחיש הזה אין פעולת שליחה. בחרו תרחיש שליחה (&quot;שלח ללקוח הודעה שהחבילה אבדה&quot;) כדי לראות איך פעולה מסוכנת הופכת לטיוטה בטוחה.</span>
            </div>
        );
    }
    const isSend = state.action === 'send';
    return (
        <div className="space-y-3">
            {isSend && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-900/15 px-3 py-1.5 text-sm font-bold text-rose-300 line-through decoration-rose-400/60">
                        <Send size={14} /> Send
                    </span>
                    <ArrowLeft size={15} className="text-slate-500" />
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-sm font-bold text-amber-200">
                        <PenLine size={14} /> Create draft
                    </span>
                </div>
            )}

            <motion.div
                key={scenario.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 22 }}
                className="rounded-2xl border border-slate-700/50 bg-slate-950/50 p-4"
            >
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                    <ScrollText size={12} className="text-amber-300" /> Proposed draft, for human review
                </div>
                <p className="text-[15px] leading-relaxed text-slate-100">{scenario.draftHe}</p>
            </motion.div>

            {isSend && !state.evidenceVerified && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-900/15 p-3 text-sm leading-relaxed text-amber-100">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" />
                    <span><span className="font-bold">Evidence not verified.</span> הטיוטה זהירה בכוונה, היא לא קובעת שהחבילה אבדה. ה-Agent לא קובע עובדה לא מאומתת, הוא משאיר את ההכרעה לאדם.</span>
                </div>
            )}
            <p className="text-[11px] leading-relaxed text-slate-500">
                טיוטה מאפשרת לאדם לבדוק, לתקן ולאשר. ה-Agent מועיל, מכין את הטקסט, אבל לא חוצה את הגבול של פעולה אמיתית בעולם.
            </p>
        </div>
    );
};
