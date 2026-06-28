"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Keyboard, MousePointerClick, ArrowDown, Zap, Target, Tag, ClipboardList,
    ShieldAlert, CheckCircle2, XCircle, HelpCircle, Wrench, MessageSquare,
    Hand, Gauge, ScanText, Workflow, ScanLine, Info, Lightbulb,
} from 'lucide-react';

import { StickyContextBar, type ContextTone } from './StickyContextBar';
import {
    parse, SCENARIOS, NARRATION, SIGNAL_WORDS, PIPELINE_STEPS,
    BARCODE_SAMPLE, DEFAULT_SCENARIO_ID, type SectionNarration,
} from '@/app/behind-the-scenes-ai/_parked/chat-to-agent/taskData';
import {
    DECISION_META, type TaskAnalysis, type TaskDecisionKind, type ClarityLevel,
} from '@/app/behind-the-scenes-ai/_parked/chat-to-agent/taskEngine';

/* ════════════════════════ טון צבעוני לפי החלטה ═══════════════════════════ */
// Answer נייטרלי-teal, Ask ב-amber של זהירות, Use tool ברמז violet קדימה,
// Stop for approval ב-crimson (rose), כמו הסיכון בפרק 9.

type Tone = 'answer' | 'ask' | 'tool' | 'stop';

const TONE: Record<Tone, { border: string; bg: string; text: string; soft: string }> = {
    answer: { border: 'border-teal-500/40', bg: 'bg-teal-900/15', text: 'text-teal-300', soft: 'bg-teal-500/15' },
    ask: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', soft: 'bg-amber-500/15' },
    tool: { border: 'border-violet-500/40', bg: 'bg-violet-900/20', text: 'text-violet-200', soft: 'bg-violet-500/15' },
    stop: { border: 'border-rose-500/40', bg: 'bg-rose-900/15', text: 'text-rose-300', soft: 'bg-rose-500/15' },
};

const DECISION_ICON: Record<TaskDecisionKind, React.ReactNode> = {
    answer: <MessageSquare size={16} />,
    'ask-info': <HelpCircle size={16} />,
    'use-tool': <Wrench size={16} />,
    'stop-approval': <Hand size={16} />,
};

const DECISION_OPTIONS: TaskDecisionKind[] = ['answer', 'ask-info', 'use-tool', 'stop-approval'];

// טון ההחלטה → טון פס ההקשר הדביק.
const DECISION_TONE: Record<Tone, ContextTone> = {
    answer: 'go',
    tool: 'go',
    ask: 'caution',
    stop: 'stop',
};

const CLARITY_META: Record<ClarityLevel, { he: string; en: string; tone: Tone; fill: number }> = {
    low: { he: 'נמוך', en: 'Low', tone: 'stop', fill: 1 },
    medium: { he: 'בינוני', en: 'Medium', tone: 'ask', fill: 2 },
    high: { he: 'גבוה', en: 'High', tone: 'answer', fill: 3 },
};

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const TaskUnderstandingLab: React.FC = () => {
    const reduce = !!useReducedMotion();
    const defaultText = SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO_ID)?.text ?? SCENARIOS[0].text;
    const [text, setText] = useState(defaultText);

    const a: TaskAnalysis = useMemo(() => parse(text), [text]);

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
                        aria-label="שדה הקלדת בקשה לפירוק משימה"
                        className="w-full bg-transparent py-2.5 text-base font-medium text-white placeholder:text-slate-600 focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Info size={13} /> שנו את הבקשה וראו את כל הרכיבים והמסלול מתעדכנים יחד, בזמן אמת.
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

            {/* פס הקשר דביק: הבקשה הפעילה + ההחלטה שנגזרה ממנה, גלוי לאורך גלילת הניתוח */}
            <StickyContextBar
                inputText={text.trim() || 'ממתין לבקשה'}
                labelHe={SCENARIOS.find((s) => s.text === text)?.labelHe ?? 'בקשה חופשית'}
                labelEn={SCENARIOS.find((s) => s.text === text)?.labelEn ?? 'Free request'}
                decisionHe={DECISION_META[a.decision].he}
                decisionEn={DECISION_META[a.decision].en}
                tone={DECISION_TONE[DECISION_META[a.decision].tone]}
                reduce={reduce}
            />

            {/* ── מסלול ה-Agent (החתימתי) ─────────────────────────────────── */}
            <AgentPipeline a={a} reduce={reduce} />

            {/* ── 1. Task Parser ─────────────────────────────────────────── */}
            <LabSection n={NARRATION.parser} icon={<ScanText size={18} className="text-violet-300" />}
                tryButtons={[
                    { label: 'למה החבילה לא הגיעה', text: 'למה החבילה לא הגיעה' },
                    { label: 'בדוק למה החבילה לא הגיעה', text: 'בדוק למה החבילה לא הגיעה' },
                ]}
                onPick={setText}
            >
                <TaskParserView a={a} reduce={reduce} />
            </LabSection>

            {/* ── 2. Goal Detector ───────────────────────────────────────── */}
            <LabSection n={NARRATION.goal} icon={<Target size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'תטפל בזה', text: 'תטפל בזה' }]} onPick={setText}
            >
                <GoalDetectorView a={a} reduce={reduce} />
            </LabSection>

            {/* ── 3. Missing Info Detector ───────────────────────────────── */}
            <LabSection n={NARRATION.missing} icon={<ClipboardList size={18} className="text-violet-300" />}
                tryButtons={[
                    { label: 'בלי ברקוד', text: 'בדוק למה החבילה לא הגיעה' },
                    { label: 'עם ברקוד 123456789', text: 'בדוק למה החבילה 123456789 לא הגיעה' },
                ]}
                onPick={setText}
            >
                <MissingInfoView a={a} reduce={reduce} />
            </LabSection>

            {/* ── 4. Answer or Act Panel ─────────────────────────────────── */}
            <LabSection n={NARRATION.decide} icon={<Workflow size={18} className="text-violet-300" />}
                tryButtons={[{ label: 'שלח ללקוח הודעה שהחבילה אבדה', text: 'שלח ללקוח הודעה שהחבילה אבדה' }]} onPick={setText}
            >
                <AnswerOrActView a={a} reduce={reduce} />
            </LabSection>

            {/* ── 5. Task Clarity Meter ──────────────────────────────────── */}
            <LabSection n={NARRATION.clarity} icon={<Gauge size={18} className="text-violet-300" />}
                tryButtons={[
                    { label: 'תטפל בזה', text: 'תטפל בזה' },
                    { label: 'בדוק למה החבילה לא הגיעה', text: 'בדוק למה החבילה לא הגיעה' },
                    { label: 'בדוק למה החבילה 123456789 לא הגיעה', text: 'בדוק למה החבילה 123456789 לא הגיעה' },
                ]}
                onPick={setText}
            >
                <ClarityMeterView a={a} reduce={reduce} />
            </LabSection>

            {/* ── disclaimer + גשר ───────────────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    זהו מודל לימודי של ניתוח משימה: המנוע מפרק את הבקשה לפי טבלת חוקים קבועה ושקופה. <span className="font-bold text-slate-400">Agents אמיתיים מפרקים משימות בצורה עשירה הרבה יותר</span>,
                    אבל העיקרון של מטרה, מידע חסר והחלטה תקף. וזכרו: <span className="font-bold text-slate-400">Action signal אינו אישור לפעול</span>. זיהוי משימה הוא תחילת תהליך, לא אישור ביצוע.
                    כש-&quot;Ready for tool selection&quot; מופיע, השלב הבא הוא בחירת כלי, וזה כבר פרק 11.
                </span>
            </div>
        </div>
    );
};

/* ════════════════════════ עוטף סקשן עם קריינות ════════════════════════════ */
// כל רכיב נולד עם הקדמה (intro), takeaway, ו-try this. העוטף אוכף את זה.

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

        {/* הקדמה */}
        <p className="text-sm leading-relaxed text-slate-300">{n.intro}</p>

        {/* הרכיב */}
        {children}

        {/* takeaway */}
        <div className="flex items-start gap-2 rounded-xl border border-violet-500/30 bg-violet-900/15 p-3">
            <Lightbulb size={15} className="mt-0.5 shrink-0 text-violet-300" />
            <p className="text-sm font-bold leading-relaxed text-violet-100">{n.takeaway}</p>
        </div>

        {/* try this */}
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

/* ════════════════════════ מסלול ה-Agent ══════════════════════════════════ */

const AgentPipeline: React.FC<{ a: TaskAnalysis; reduce: boolean }> = ({ a, reduce }) => {
    const isQuestion = a.requestType === 'question';

    const steps = PIPELINE_STEPS.map((step) => {
        switch (step.id) {
            case 'understand':
                return {
                    ...step,
                    state: 'active' as const,
                    valueHe: isQuestion ? 'שאלה' : 'משימה',
                    sub: a.action ? `Action: ${a.action.word}` : 'אין מילת פעולה',
                };
            case 'goal':
                return {
                    ...step,
                    state: isQuestion ? ('skipped' as const) : ('active' as const),
                    valueHe: isQuestion ? 'לא רלוונטי' : a.goalClear ? a.goalHe : 'לא ברור',
                    sub: isQuestion ? 'שאלה לא דורשת מטרה' : a.goalClear ? a.goalEn : 'Unclear',
                };
            case 'missing':
                return {
                    ...step,
                    state: isQuestion ? ('skipped' as const) : ('active' as const),
                    valueHe: isQuestion
                        ? 'לא רלוונטי'
                        : a.requiredData.length === 0
                            ? 'אין מידע נדרש'
                            : a.missingData.length > 0
                                ? `חסר: ${a.missingData.map((d) => d.he).join(', ')}`
                                : 'כל המידע קיים',
                    sub: !isQuestion && a.requiredData.length > 0
                        ? a.missingData.length > 0 ? 'Missing' : 'Available'
                        : '',
                };
            default: {
                const meta = DECISION_META[a.decision];
                return { ...step, state: 'decision' as const, valueHe: a.decisionDetailHe, sub: a.decisionDetailEn, tone: meta.tone };
            }
        }
    });

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Workflow size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">מסלול ה-Agent</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Task Understanding to Answer or Act</div>
                </div>
            </div>

            <div className="space-y-1.5">
                {steps.map((s, i) => {
                    const isDecision = s.state === 'decision';
                    const skipped = s.state === 'skipped';
                    const tone = isDecision && 'tone' in s ? TONE[s.tone as Tone] : null;
                    return (
                        <React.Fragment key={s.id}>
                            {i > 0 && (
                                <div className="flex justify-center">
                                    <ArrowDown size={15} className={skipped ? 'text-slate-700' : 'text-slate-600'} />
                                </div>
                            )}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: skipped ? 0.45 : 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 24, delay: i * 0.05 }}
                                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${
                                    tone ? `${tone.border} ${tone.bg}` : skipped ? 'border-slate-800 bg-slate-950/30' : 'border-violet-500/40 bg-violet-900/15'
                                }`}
                            >
                                <span className="leading-tight">
                                    <span className={`block text-sm font-bold ${tone ? tone.text : skipped ? 'text-slate-500' : 'text-violet-100'}`}>{s.he}</span>
                                    <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{s.en}</span>
                                </span>
                                <span className="text-left leading-tight">
                                    <span className={`block text-sm font-bold ${tone ? tone.text : skipped ? 'text-slate-500' : 'text-slate-100'}`}>{s.valueHe}</span>
                                    {s.sub && <span className="block text-[10px] text-slate-500" dir="ltr">{s.sub}</span>}
                                </span>
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

/* ════════════════════════ 1. Task Parser view ════════════════════════════ */

const ScoreBar: React.FC<{ label: string; en: string; value: number; reduce: boolean }> = ({ label, en, value, reduce }) => (
    <div className="rounded-lg border border-slate-700/40 bg-slate-950/30 p-2.5 leading-tight">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">{label}</span>
            <span className="font-mono text-[11px] font-bold text-violet-200" dir="ltr">{value.toFixed(2)}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${Math.round(value * 100)}%` }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 20 }}
                className="h-full rounded-full bg-gradient-to-l from-violet-400 to-fuchsia-500"
            />
        </div>
        <div className="mt-1 text-[8px] uppercase tracking-wider text-slate-600" dir="ltr">{en}</div>
    </div>
);

const ParseCell: React.FC<{ icon: React.ReactNode; label: string; en: string; value: string; tone?: Tone }> = ({ icon, label, en, value, tone }) => {
    const t = tone ? TONE[tone] : null;
    return (
        <div className={`rounded-xl border p-3 leading-tight ${t ? `${t.border} ${t.bg}` : 'border-slate-700/50 bg-slate-950/40'}`}>
            <div className="flex items-center gap-1.5 text-slate-400">
                <span className={t ? t.text : 'text-slate-400'}>{icon}</span>
                <span className="text-[10px] font-bold">{label}</span>
            </div>
            <div className={`mt-1 text-sm font-bold ${t ? t.text : 'text-slate-100'}`}>{value}</div>
            <div className="text-[8px] uppercase tracking-wider text-slate-600" dir="ltr">{en}</div>
        </div>
    );
};

const TaskParserView: React.FC<{ a: TaskAnalysis; reduce: boolean }> = ({ a, reduce }) => {
    const isQuestion = a.requestType === 'question';
    return (
        <div className="space-y-4">
            {/* פירוק הבקשה לרכיבים */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <ParseCell
                    icon={<Zap size={13} />} label="פעולה" en="Action signal"
                    value={a.action ? a.action.word : 'אין'} tone={a.action ? 'tool' : undefined}
                />
                <ParseCell icon={<Target size={13} />} label="מטרה" en="Goal" value={a.goalClear ? a.goalHe : isQuestion ? 'הסבר כללי' : 'לא ברור'} tone={a.goalClear ? 'answer' : isQuestion ? undefined : 'ask'} />
                <ParseCell icon={<Tag size={13} />} label="תחום" en="Domain" value={a.domain ? a.domain.he : 'כללי'} />
                <ParseCell icon={<ClipboardList size={13} />} label="מידע נדרש" en="Required data" value={a.requiredData.length ? a.requiredData.map((d) => d.def.he).join(', ') : 'אין'} />
                <ParseCell icon={<HelpCircle size={13} />} label="מידע חסר" en="Missing data" value={a.missingData.length ? a.missingData.map((d) => d.he).join(', ') : 'אין'} tone={a.missingData.length ? 'ask' : undefined} />
                <ParseCell icon={<ShieldAlert size={13} />} label="סיכון" en="Risk" value={a.risk === 'high' ? 'גבוה' : 'נמוך'} tone={a.risk === 'high' ? 'stop' : undefined} />
            </div>

            {/* נוסחת הציון */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
                <div className="mb-2 font-mono text-[11px] text-slate-400" dir="ltr">
                    task_score = action_signal + goal_clarity + required_data_presence
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <ScoreBar label="פעולה" en="action_signal" value={a.score.action} reduce={reduce} />
                    <ScoreBar label="בהירות מטרה" en="goal_clarity" value={a.score.goal} reduce={reduce} />
                    <ScoreBar label="מידע קיים" en="required_data_presence" value={a.score.data} reduce={reduce} />
                </div>
                <div className="mt-3 font-mono text-xs text-slate-300" dir="ltr">
                    task_score = <span className="font-black text-violet-200">{a.score.total.toFixed(2)}</span> / 3
                </div>
            </div>

            {/* הגארדרייל: זיהוי משימה אינו אישור לפעול */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <Badge labelHe="זיהוי משימה" en="Task detected" valueHe={a.taskDetected === 'none' ? 'אין' : a.taskDetected === 'high' ? 'גבוה' : 'נמוך'} tone={a.taskDetected === 'none' ? undefined : 'tool'} />
                <Badge labelHe="מוכן לפעול" en="Ready to act" valueHe={a.readyToAct ? 'כן' : 'לא'} tone={a.readyToAct ? 'answer' : 'ask'} />
                <span className="text-[11px] leading-relaxed text-slate-500">
                    זיהוי משימה אינו אישור לפעול. task_score גבוה יכול לדור בכפיפה אחת עם &quot;מוכן לפעול: לא&quot;.
                </span>
            </div>

            {/* לגנדה: מילות ה-Action signal */}
            <div className="rounded-xl border border-slate-700/40 bg-slate-950/30 p-3">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Zap size={12} className="text-violet-300" /> מילות Action signal שנדלקות
                </div>
                <div className="flex flex-wrap gap-1.5" dir="rtl">
                    {SIGNAL_WORDS.map((w) => {
                        const active = a.action?.word === w.he;
                        return (
                            <span
                                key={w.he}
                                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-bold transition-colors ${
                                    active
                                        ? 'border-violet-500/60 bg-violet-500/20 text-violet-100'
                                        : w.risk === 'high'
                                            ? 'border-rose-500/30 bg-rose-900/10 text-rose-300/80'
                                            : 'border-slate-700/50 bg-slate-800/40 text-slate-400'
                                }`}
                            >
                                {w.he}
                                {w.risk === 'high' && <ShieldAlert size={10} className="opacity-70" />}
                            </span>
                        );
                    })}
                </div>
                <p className="mt-2 text-[10px] text-slate-600">מילים מסומנות ב-<ShieldAlert size={9} className="inline text-rose-300/80" /> משנות מצב בעולם (שליחה, עדכון), ולכן סיכון גבוה.</p>
            </div>
        </div>
    );
};

const Badge: React.FC<{ labelHe: string; en: string; valueHe: string; tone?: Tone }> = ({ labelHe, en, valueHe, tone }) => {
    const t = tone ? TONE[tone] : null;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${t ? `${t.border} ${t.soft} ${t.text}` : 'border-slate-700/50 bg-slate-800/40 text-slate-400'}`}>
            {labelHe}: {valueHe}
            <span className="opacity-60" dir="ltr">{en}</span>
        </span>
    );
};

/* ════════════════════════ 2. Goal Detector view ══════════════════════════ */

const GoalDetectorView: React.FC<{ a: TaskAnalysis; reduce: boolean }> = ({ a, reduce }) => {
    const isQuestion = a.requestType === 'question';

    if (isQuestion) {
        return (
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
                <p className="text-sm leading-relaxed text-slate-300">
                    זו שאלה, לא משימה, אז אין כאן מטרה אופרטיבית לבנות. המסלול הוא הסבר, לא ביצוע.
                </p>
            </div>
        );
    }

    if (a.goalClear) {
        return (
            <motion.div
                key={a.goalHe}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                className="rounded-xl border border-teal-500/40 bg-teal-900/15 p-4"
            >
                <div className="flex items-center gap-2">
                    <Target size={16} className="text-teal-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300/80" dir="ltr">Goal detected</span>
                </div>
                <p className="mt-2 text-lg font-black text-teal-100">{a.goalHe}</p>
                <p className="text-xs text-slate-400" dir="ltr">{a.goalEn}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-400" dir="ltr">
                    <Chip>{a.action?.en}</Chip> + <Chip>{a.domain?.en}</Chip> = <span className="font-bold text-teal-200">{a.goalEn}</span>
                </div>
            </motion.div>
        );
    }

    // לא ברור: מבקשים הבהרה, לא מנחשים.
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
            className="rounded-xl border border-amber-500/40 bg-amber-900/15 p-4"
        >
            <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-amber-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80" dir="ltr">Goal unclear</span>
            </div>
            <p className="mt-2 text-lg font-black text-amber-100">לא ברור</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{a.clarityReasonHe}</p>
            {a.vagueReference && (
                <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400" dir="rtl">
                    <Chip>זה</Chip> <ArrowDown size={12} className="-rotate-90" /> <span className="font-bold text-amber-200">?</span>
                    <span className="ms-2 text-slate-500">המנוע לא מנחש, הוא מבקש הבהרה.</span>
                </div>
            )}
        </motion.div>
    );
};

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="rounded-md bg-slate-800/70 px-1.5 py-0.5 text-slate-200">{children}</span>
);

/* ════════════════════════ 3. Missing Info view ═══════════════════════════ */

const MissingInfoView: React.FC<{ a: TaskAnalysis; reduce: boolean }> = ({ a, reduce }) => {
    if (a.requestType === 'question' || a.requiredData.length === 0) {
        return (
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
                <p className="text-sm leading-relaxed text-slate-300">
                    {a.requestType === 'question'
                        ? 'זו שאלה, לא משימה, אז אין מידע שצריך לאסוף לפני פעולה.'
                        : 'לבקשה הזו לא נדרש מידע נוסף כדי להתקדם.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                {a.requiredData.map((d) => (
                    <motion.div
                        key={d.def.id}
                        layout
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 28 }}
                        className={`flex items-center justify-between gap-2 rounded-xl border p-3 ${d.present ? 'border-emerald-500/40 bg-emerald-900/15' : 'border-amber-500/40 bg-amber-900/15'}`}
                    >
                        <span className="flex items-center gap-2">
                            {d.present ? <CheckCircle2 size={16} className="text-emerald-300" /> : <XCircle size={16} className="text-amber-300" />}
                            <span className="leading-tight">
                                <span className="block text-sm font-bold text-slate-100">{d.def.he}</span>
                                <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{d.def.en}</span>
                            </span>
                        </span>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={d.present ? 'present' : 'missing'}
                                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${d.present ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}`}
                                dir="ltr"
                            >
                                {d.present ? 'available' : 'missing'}
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* הצעד הבא, משתנה לפי המידע */}
            <div className={`flex items-center gap-2 rounded-xl border p-3 ${a.missingData.length ? 'border-amber-500/40 bg-amber-900/15' : 'border-violet-500/40 bg-violet-900/20'}`}>
                {a.missingData.length ? <HelpCircle size={15} className="text-amber-300" /> : <Wrench size={15} className="text-violet-200" />}
                <span className="text-sm leading-tight">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Next step</span>
                    <span className={`block font-bold ${a.missingData.length ? 'text-amber-200' : 'text-violet-100'}`}>
                        {a.missingData.length ? `הצעד הבא: ${a.decisionDetailHe}` : 'הצעד הבא: מוכן לבחירת כלי'}
                    </span>
                </span>
            </div>
        </div>
    );
};

/* ════════════════════════ 4. Answer or Act view ══════════════════════════ */

const AnswerOrActView: React.FC<{ a: TaskAnalysis; reduce: boolean }> = ({ a, reduce }) => (
    <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DECISION_OPTIONS.map((kind) => {
                const meta = DECISION_META[kind];
                const t = TONE[meta.tone];
                const active = a.decision === kind;
                return (
                    <motion.div
                        key={kind}
                        animate={{ opacity: active ? 1 : 0.5 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className={`flex items-center gap-2.5 rounded-xl border p-3 ${active ? `${t.border} ${t.bg}` : 'border-slate-800 bg-slate-950/30'}`}
                    >
                        <span className={active ? t.text : 'text-slate-500'}>{DECISION_ICON[kind]}</span>
                        <span className="leading-tight">
                            <span className={`block text-sm font-bold ${active ? t.text : 'text-slate-400'}`}>{meta.he}</span>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en}</span>
                        </span>
                        {active && (
                            <motion.span
                                layoutId="decision-active-dot"
                                className={`ms-auto h-2 w-2 rounded-full ${t.text}`}
                                style={{ backgroundColor: 'currentColor' }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>

        {/* ההחלטה שנבחרה, עם נימוק */}
        <motion.div
            key={a.decision + a.decisionDetailHe}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
            className={`rounded-xl border p-4 ${TONE[DECISION_META[a.decision].tone].border} ${TONE[DECISION_META[a.decision].tone].bg}`}
        >
            <div className="flex items-center gap-2">
                <span className={TONE[DECISION_META[a.decision].tone].text}>{DECISION_ICON[a.decision]}</span>
                <span className={`text-sm font-black ${TONE[DECISION_META[a.decision].tone].text}`}>{a.decisionDetailHe}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{a.decisionDetailEn}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{decisionReason(a)}</p>
        </motion.div>
    </div>
);

function decisionReason(a: TaskAnalysis): string {
    switch (a.decision) {
        case 'answer':
            return 'אין מילת פעולה, אז זו שאלה. המערכת יכולה פשוט להסביר, בלי לזהות מטרה או להפעיל כלי.';
        case 'stop-approval':
            return 'הפעולה משנה מצב בעולם מול גורם אמיתי. גם כשהמטרה ברורה, פעולה רגישה לא מתבצעת אוטונומית, עוצרים לאישור אדם.';
        case 'use-tool':
            return 'המטרה ברורה, כל המידע הנדרש קיים, והסיכון נסבל. עכשיו אפשר להתקדם לבחירת כלי. זה מה שיקרה בפרק הבא.';
        case 'ask-info':
            return a.vagueReference
                ? 'יש פעולה, אבל היעד עמום. המנוע לא מנחש, הוא מבקש להבהיר למה הבקשה מתייחסת.'
                : 'המטרה ברורה אבל חסר מידע נדרש. בקשת המידע החסר היא הצעד המקצועי, לא תקלה.';
    }
}

/* ════════════════════════ 5. Clarity Meter view ══════════════════════════ */

const ClarityMeterView: React.FC<{ a: TaskAnalysis; reduce: boolean }> = ({ a, reduce }) => {
    if (a.clarity === null) {
        return (
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
                <p className="text-sm leading-relaxed text-slate-300">{a.clarityReasonHe}</p>
            </div>
        );
    }
    const meta = CLARITY_META[a.clarity];
    const t = TONE[meta.tone];
    const levels: ClarityLevel[] = ['low', 'medium', 'high'];

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {levels.map((lv, i) => {
                    const filled = i < meta.fill;
                    const ct = TONE[CLARITY_META[lv].tone];
                    return (
                        <motion.div
                            key={lv}
                            initial={reduce ? false : { opacity: 0.4 }}
                            animate={{ opacity: filled ? 1 : 0.3 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25, delay: i * 0.05 }}
                            className={`h-3 flex-1 rounded-full ${filled ? ct.soft : 'bg-slate-800'}`}
                            style={filled ? {} : undefined}
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
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en} clarity</span>
                    </span>
                </span>
                <span className="max-w-md text-right text-sm leading-relaxed text-slate-300">{a.clarityReasonHe}</span>
            </div>
        </div>
    );
};
