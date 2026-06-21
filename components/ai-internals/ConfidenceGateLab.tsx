"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Gauge, ShieldAlert, ShieldCheck, Ban, CheckCircle2, ArrowDown, Lock,
    Info, ScanLine, MessageSquare, SlidersHorizontal,
    Workflow, Keyboard, Split, Wrench, Lightbulb, MousePointerClick,
} from 'lucide-react';

import { ModeToggle } from './ModeToggle';
import { ProbabilityBars } from './ProbabilityBars';
import { ACCENTS } from './accents';
import type { Accent, IntentProbability } from './types';

import {
    distributionForChat,
    distributionForBarcode,
    distributionForVague,
    CHAT_SCENARIOS,
    AGENT_SCENARIOS,
    RISK_ACTIONS,
    getRiskAction,
    DEFAULT_THRESHOLD,
    DEFAULT_RISK_ACTION_ID,
    THRESHOLD_PRESETS,
    type Distribution,
    type RiskActionDef,
} from '@/app/behind-the-scenes-ai/chapter-8/gateData';
import {
    evaluateGate,
    buildClarifyingQuestion,
    GATE_KIND_META,
} from '@/app/behind-the-scenes-ai/chapter-8/gateLogic';
import type { ConfidenceLevel } from '@/app/behind-the-scenes-ai/chapter-7/scoringEngine';

/* ════════════════════════ עזרי תצוגה ═════════════════════════════════════ */

const pct = (n: number) => Math.round(n * 100);

const CONF_META: Record<ConfidenceLevel, { he: string; accent: Accent }> = {
    High: { he: 'גבוה', accent: 'emerald' },
    Medium: { he: 'בינוני', accent: 'amber' },
    'Medium-low': { he: 'נמוך-בינוני', accent: 'amber' },
    Low: { he: 'נמוך', accent: 'rose' },
};

const TONE_STYLE = {
    open: { border: 'border-emerald-500/40', bg: 'bg-emerald-900/15', text: 'text-emerald-300', bar: 'bg-gradient-to-l from-emerald-400 to-teal-500' },
    caution: { border: 'border-amber-500/40', bg: 'bg-amber-900/15', text: 'text-amber-300', bar: 'bg-gradient-to-l from-amber-400 to-orange-500' },
    stop: { border: 'border-rose-500/40', bg: 'bg-rose-900/15', text: 'text-rose-300', bar: 'bg-gradient-to-l from-rose-400 to-pink-500' },
};

/* ════════════════════════ שכבת קריינות לימודית ═══════════════════════════ */
// טקסט בלבד, נלווה לכל רכיב אינטראקטיבי: הקדמה לפני, "השורה התחתונה" אחרי,
// ו"נסו את זה" שהופך את הווידג'ט לתרגיל ללומד העצמאי. אותו pattern כמו פרק 7.

/** פסקת הקדמה: מה עומדים לראות ולמה. */
const LayerIntro: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="mb-4 text-xs leading-relaxed text-slate-400">{children}</p>
);

/** השורה התחתונה של השלב, במשפט אחד. */
const Takeaway: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
        <Lightbulb size={13} className="mt-0.5 shrink-0 text-emerald-400/80" />
        <span><span className="font-bold text-slate-300">השורה התחתונה: </span>{children}</span>
    </p>
);

/** הנחיה מודרכת: מה לעשות עם הווידג'ט כדי ללמוד ממנו. */
const TryThis: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-500/25 bg-violet-900/10 p-3 text-[11px] leading-relaxed text-violet-100/90" dir="rtl">
        <MousePointerClick size={13} className="mt-0.5 shrink-0 text-violet-300" />
        <span><span className="font-bold text-violet-200">נסו את זה: </span>{children}</span>
    </div>
);

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const ConfidenceGateLab: React.FC = () => {
    const reduce = useReducedMotion();

    const [mode, setMode] = useState<'chat' | 'agent'>('chat');
    const [text, setText] = useState(CHAT_SCENARIOS[0].text);
    const [agentScenarioId, setAgentScenarioId] = useState(AGENT_SCENARIOS[0].id);
    const [hasBarcode, setHasBarcode] = useState(false);
    const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
    const [riskActionId, setRiskActionId] = useState(DEFAULT_RISK_ACTION_ID);

    const agentScenario = AGENT_SCENARIOS.find((s) => s.id === agentScenarioId) ?? AGENT_SCENARIOS[0];

    const dist: Distribution = useMemo(() => {
        if (mode === 'chat') return distributionForChat(text);
        if (agentScenario.kind === 'vague') return distributionForVague();
        return distributionForBarcode(hasBarcode);
    }, [mode, text, agentScenario.kind, hasBarcode]);

    const action: RiskActionDef | undefined = mode === 'agent' ? getRiskAction(riskActionId) : undefined;
    const gate = evaluateGate(
        dist.margin,
        threshold,
        mode,
        action ? { id: action.id, requiredConfidence: action.requiredConfidence, humanApproval: action.humanApproval } : undefined,
    );

    const top = dist.items[0];
    const second = dist.items[1];

    const handleMode = (m: 'chat' | 'agent') => {
        if (m === mode) return;
        setMode(m);
        if (m === 'chat') setText(CHAT_SCENARIOS[0].text);
        else { setAgentScenarioId(AGENT_SCENARIOS[0].id); setRiskActionId(DEFAULT_RISK_ACTION_ID); setHasBarcode(false); }
    };

    return (
        <div className="space-y-4">
            <LayerIntro>
                בחרו תרחיש מוכן או הקלידו משפט משלכם, וכל שאר הלוח יגיב: הפער, השער וההחלטה. ב-Chat המנוע מנסה לזהות את כוונת המשתמש, ב-Agent הוא שוקל גם את הסיכון של הפעולה. כל המספרים כאן מגיעים ישירות מהמנוע של פרק 7, השער רק מחליט מה לעשות איתם.
            </LayerIntro>

            {/* ── בקרה ───────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4" dir="rtl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">מצב:</span>
                        <ModeToggle mode={mode} onChange={(m) => handleMode(m as 'chat' | 'agent')} accent="purple" />
                    </div>

                    {mode === 'chat' ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">תרחיש:</span>
                            {CHAT_SCENARIOS.map((s) => {
                                const active = s.text === text;
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
                    ) : (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">תרחיש:</span>
                            {AGENT_SCENARIOS.map((s) => {
                                const active = s.id === agentScenarioId;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setAgentScenarioId(s.id)}
                                        aria-pressed={active}
                                        className={`rounded-xl border px-3 py-1.5 text-right leading-tight transition-colors ${active ? 'border-violet-500/50 bg-violet-900/25' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                                    >
                                        <span className={`block text-xs font-bold ${active ? 'text-violet-200' : 'text-slate-300'}`}>{s.labelHe}</span>
                                        <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{s.labelEn}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* קלט Chat: שדה חופשי */}
                {mode === 'chat' && (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 focus-within:border-violet-500/60">
                        <Keyboard size={15} className="shrink-0 text-violet-300" />
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="הקלידו משפט..."
                            dir="rtl"
                            aria-label="שדה הקלדה לשער הביטחון"
                            className="w-full bg-transparent py-2.5 text-base font-medium text-white placeholder:text-slate-600 focus:outline-none"
                        />
                    </div>
                )}

                {/* קלט Agent: משימה + ברקוד */}
                {mode === 'agent' && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3" dir="rtl">
                        <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                            <Workflow size={14} className="text-violet-300" />
                            משימה: <span className="rounded-md bg-slate-800/70 px-2 py-0.5 font-bold text-slate-200">&quot;{agentScenario.promptHe}&quot;</span>
                        </span>
                        {agentScenario.kind === 'barcode' && (
                            <button
                                type="button"
                                onClick={() => setHasBarcode((b) => !b)}
                                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${hasBarcode ? 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600' : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25'}`}
                            >
                                <ScanLine size={13} /> {hasBarcode ? 'איפוס מצב' : 'מסירת ברקוד'}
                                <span className="text-[9px] font-medium uppercase opacity-70" dir="ltr">{hasBarcode ? 'Reset' : 'Provide barcode'}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <TryThis>
                החליפו תרחיש (או הקלידו משפט משלכם) וצפו איך הפער, השער וההחלטה שבהמשך הדף משתנים יחד, בלי שנגעתם בשום מספר.
            </TryThis>

            {/* ── Risk selector (Agent בלבד) ─────────────────────────────── */}
            {mode === 'agent' && action && (
                <>
                    <LayerIntro>
                        במצב Agent נכנס גורם שני לשער: הסיכון של הפעולה. לא כל פעולה דורשת אותו ביטחון, וככל שהפעולה רגישה יותר נדרש ביטחון גבוה יותר כדי לבצע אותה לבד. הכלל המלא הוא: Decision allowed = הפער מעל הסף וגם הסיכון נסבל. Explain concept הוא סיכון נמוך, ואילו Send message to customer הוא סיכון גבוה שדורש אישור אנושי.
                    </LayerIntro>
                    <RiskSelector actionId={riskActionId} onSelect={setRiskActionId} />
                    <Takeaway>
                        סיכון הוא הגורם השני בשער. פער מספיק לבדו אינו מספיק כשהפעולה מסוכנת.
                    </Takeaway>
                    <TryThis>
                        החליפו את הפעולה ל-Send message to customer וראו שער שהיה פתוח על סמך הפער נסגר ודורש אישור אנושי.
                    </TryThis>
                </>
            )}

            {/* ── Live Decision Gate (הרכיב החתימתי) ─────────────────────── */}
            <LiveDecisionGate
                dist={dist}
                top={top}
                second={second}
                threshold={threshold}
                setThreshold={setThreshold}
                gate={gate}
                action={action}
                reduce={!!reduce}
            />

            {/* ── תוצאה: תשובה / השהיה+הבהרה / אישור ─────────────────────── */}
            <OutcomeSection dist={dist} top={top} second={second} gate={gate} action={action} reduce={!!reduce} />

            {/* ── Probability Bars (הקשר, ממנוע פרק 7) ───────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">ההתפלגות שמגיעה מפרק 7</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Probabilities (from chapter 7)</div>
                    </div>
                    <ConfidenceBadge confidence={dist.confidence} />
                </div>
                <LayerIntro>
                    זו ההתפלגות המלאה שמגיעה ממנוע פרק 7, אותו מנוע בדיוק. השער לא מחשב הסתברויות מחדש, הוא רק קורא מתוכה את הפער בין שתי האפשרויות המובילות ומחליט לפיו.
                </LayerIntro>
                <ProbabilityBars items={dist.items.map((it): IntentProbability => ({ label: it.labelHe, value: pct(it.prob) }))} accent={top?.accent ?? 'cyan'} />
            </div>

            {/* ── טבלת סיכון (Agent) ─────────────────────────────────────── */}
            {mode === 'agent' && <RiskTable activeId={riskActionId} />}

            {/* ── disclaimer + גשר ───────────────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    ההתפלגויות כאן מגיעות ישירות ממנוע פרק 7, פרק 8 רק בונה מעליהן את השער. <span className="font-bold text-slate-400">עצירה ובקשת הקשר אינן שגיאה</span> -
                    הן הצעד המקצועי כשהפער קטן מהסף. זה מודל לימודי של מדיניות החלטה: מערכות אמיתיות משתמשות בביטחון מכויל (calibrated),
                    אבל העיקרון של פער מול סף, ושל סיכון כגורם שני, תקף. כאן מתחיל החיבור בין הסתברות לאחריות.
                </span>
            </div>
        </div>
    );
};

/* ════════════════════════ Risk selector ══════════════════════════════════ */

const RiskSelector: React.FC<{ actionId: string; onSelect: (id: string) => void }> = ({ actionId, onSelect }) => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 text-right" dir="rtl">
        <div className="mb-3 flex items-center gap-2">
            <ShieldAlert size={15} className="text-rose-300" />
            <div className="leading-tight">
                <div className="text-sm font-bold text-slate-200">איזו פעולה ה-Agent עומד לבצע?</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Risk as the second gate factor</div>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {RISK_ACTIONS.map((r) => {
                const a = ACCENTS[r.accent];
                const active = r.id === actionId;
                return (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => onSelect(r.id)}
                        aria-pressed={active}
                        className={`rounded-xl border p-3 text-right leading-tight transition-colors ${active ? `${a.border} ${a.bgSoft}` : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                    >
                        <span className={`block text-sm font-bold ${active ? a.text : 'text-slate-200'}`}>{r.he}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{r.en}</span>
                        <span className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                            <span className={`rounded px-1.5 py-0.5 font-bold ${a.bgSoft} ${a.text}`}>סיכון {r.riskHe}</span>
                            <span className="text-slate-500" dir="ltr">need {r.requiredConfidence}%</span>
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
);

/* ════════════════════════ Live Decision Gate ═════════════════════════════ */

interface GateViewProps {
    dist: Distribution;
    top: Distribution['items'][number] | undefined;
    second: Distribution['items'][number] | undefined;
    threshold: number;
    setThreshold: (n: number) => void;
    gate: ReturnType<typeof evaluateGate>;
    action: RiskActionDef | undefined;
    reduce: boolean;
}

const LiveDecisionGate: React.FC<GateViewProps> = ({ dist, top, second, threshold, setThreshold, gate, action, reduce }) => {
    const meta = GATE_KIND_META[gate.kind];
    const tone = TONE_STYLE[meta.tone];
    const margin = Math.round(dist.margin);
    const eff = Math.round(gate.effectiveThreshold);
    const floorByRisk = action ? action.requiredConfidence > threshold : false;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">שער ההחלטה החי</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Live Decision Gate</div>
                </div>
            </div>

            <LayerIntro>
                כאן הכל מתחבר לשער אחד חי. שלושה דברים נפגשים בו: הפער בין המוביל לשני, שהוא הקלט; הסף הנדרש, שהוא הכוונון; ובמצב Agent גם הסיכון של הפעולה, שהוא הגורם השני. נתחיל מהפער. שלושת המספרים שלמטה הם המוביל, האפשרות השנייה, והפער ביניהם (confidence_margin = top פחות second).
            </LayerIntro>

            {/* Winner Margin Meter */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MeterCell labelHe="המוביל" labelEn="Top" value={top ? pct(top.prob) : 0} sub={top?.labelHe ?? ''} accent={top?.accent ?? 'cyan'} />
                <MeterCell labelHe="השני" labelEn="Second" value={second ? pct(second.prob) : 0} sub={second?.labelHe ?? ''} accent="slate" />
                <MeterCell labelHe="הפער" labelEn="Margin" value={margin} sub="top minus second" accent={tone === TONE_STYLE.open ? 'emerald' : 'amber'} highlight />
            </div>

            <Takeaway>
                לא מספיק לדעת מי מוביל, צריך לדעת בכמה. מוביל בולט עם פער גדול הוא החלטה ברורה; שני מובילים קרובים עם פער זעיר משאירים את המערכת מתלבטת, גם כשיש מקום ראשון.
            </Takeaway>

            <LayerIntro>
                עכשיו הסף. הסף הנדרש אינו חוק טבע, הוא בחירה. גררו אותו ושימו לב לדבר מפתיע: אותה התפלגות בדיוק, בלי לשנות אף מילה, עוברת מ-Answer ל-Ask for more context ברגע שקו הסף חוצה את עמודת הפער. הביטחון אינו רק מספר שנמדד, הוא מדיניות שנקבעת. בצ׳אט לימודי אפשר להסתפק בסף נמוך, במערכת ארגונית מול לקוח נרצה סף גבוה בהרבה.
            </LayerIntro>

            {/* Threshold track: קו הסף נפגש עם עמודת ה-Margin */}
            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">פער מול סף</span>
                    <span className="font-mono text-[11px] text-slate-400" dir="ltr">
                        margin {margin}% {gate.marginPasses ? '≥' : '<'} threshold {eff}%
                    </span>
                </div>

                <div dir="ltr" className="relative h-10 w-full rounded-lg border border-slate-700/50 bg-slate-800/60">
                    {/* מילוי הפער */}
                    <motion.div
                        animate={{ width: `${Math.max(0, Math.min(100, margin))}%` }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
                        className={`absolute inset-y-0 left-0 rounded-lg ${gate.marginPasses ? TONE_STYLE.open.bar : TONE_STYLE.caution.bar}`}
                    />
                    {/* קו הסף האפקטיבי */}
                    <motion.div
                        animate={{ left: `${Math.max(0, Math.min(100, eff))}%` }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 24 }}
                        className="absolute -top-2 bottom-[-8px] z-10 w-0.5 bg-violet-200"
                    >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-violet-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-violet-200">
                            {eff}%
                        </span>
                    </motion.div>
                    {/* תווית הפער על המילוי */}
                    <span className="absolute inset-y-0 left-2 flex items-center font-mono text-[11px] font-black text-slate-950/80">{margin}%</span>
                </div>

                {/* הסליידר */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        aria-label="סף הביטחון הנדרש"
                        className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-violet-400"
                        style={{ accentColor: '#a78bfa' }}
                    />
                    <span className="font-mono text-xs text-slate-400" dir="ltr">threshold {threshold}%</span>
                    <div className="flex items-center gap-1">
                        {THRESHOLD_PRESETS.map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setThreshold(p)}
                                className={`rounded-md border px-2 py-1 font-mono text-[11px] font-bold transition-colors ${threshold === p ? 'border-violet-500/50 bg-violet-900/25 text-violet-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                            >
                                {p}%
                            </button>
                        ))}
                    </div>
                </div>
                {floorByRisk && (
                    <p className="mt-2 text-[11px] text-rose-300/90">
                        רצפת סיכון: הפעולה &quot;{action?.he}&quot; דורשת לפחות {action?.requiredConfidence}%, אז הסף האפקטיבי עלה ל-{eff}%.
                    </p>
                )}
            </div>

            <Takeaway>
                הביטחון הוא מדיניות, לא מספר. אותם נתונים בדיוק, סף אחר, החלטה אחרת.
            </Takeaway>
            <TryThis>
                במשפט החד הפער גדול: העלו את הסף עד שהוא עובר את עמודת הפער, וראו את השער נסגר. במשפט העמום הפער קטן: הורידו את הסף מתחת לפער, וראו את השער נפתח. לא שיניתם אף מילה, רק את הסף.
            </TryThis>

            <LayerIntro>
                וזה השער עצמו. הוא מחליט אם להמשיך לתשובה, לעצור ולבקש הקשר, או לדרוש אישור. פער גדול פותח אותו, פער קטן סוגר אותו. כשהוא נסגר, המערכת לא נכשלה, היא בחרה לא לנחש.
            </LayerIntro>

            {/* השער עצמו */}
            <div className="mt-5">
                <GateDoors open={gate.open} kind={gate.kind} reduce={reduce} />
            </div>

            <Takeaway>
                גם כשיש מנצח, לא תמיד כדאי להכריז עליו. שער סגור הוא זהירות, לא שגיאה.
            </Takeaway>

            {/* ההחלטה הנגזרת */}
            <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border ${tone.border} ${tone.bg} p-3`}>
                <span className="inline-flex items-center gap-2">
                    {gate.kind === 'stop-approval' ? <ShieldAlert size={18} className={tone.text} /> : gate.open ? <ShieldCheck size={18} className={tone.text} /> : <Lock size={18} className={tone.text} />}
                    <span className="leading-tight">
                        <span className={`block text-sm font-black ${tone.text}`}>{meta.he}</span>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500" dir="ltr">{meta.en}</span>
                    </span>
                </span>
                <span className="font-mono text-[11px] text-slate-400" dir="ltr">
                    Decision allowed = (margin ≥ threshold){action ? ' AND (risk ok)' : ''} = {gate.open ? 'true' : 'false'}
                </span>
            </div>
        </div>
    );
};

const MeterCell: React.FC<{ labelHe: string; labelEn: string; value: number; sub: string; accent: Accent; highlight?: boolean }> = ({ labelHe, labelEn, value, sub, accent, highlight }) => {
    const a = ACCENTS[accent];
    return (
        <div className={`rounded-xl border p-3 leading-tight ${highlight ? `${a.border} ${a.bgSoft}` : 'border-slate-700/50 bg-slate-950/40'}`}>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">{labelEn}</span>
                <span className="text-[10px] font-bold text-slate-400">{labelHe}</span>
            </div>
            <div className={`mt-1 font-mono text-2xl font-black ${highlight ? a.text : 'text-slate-100'}`} dir="ltr">{value}%</div>
            <div className="mt-0.5 truncate text-[10px] text-slate-500">{sub}</div>
        </div>
    );
};

/** דלתות השער: נפתחות כשמותר לפעול, נסגרות כשצריך לעצור. */
const GateDoors: React.FC<{ open: boolean; kind: ReturnType<typeof evaluateGate>['kind']; reduce: boolean }> = ({ open, kind, reduce }) => {
    const tone = TONE_STYLE[GATE_KIND_META[kind].tone];
    return (
        <div className="relative h-24 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/50">
            {/* רקע מסלול */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`flex items-center gap-2 rounded-xl border ${tone.border} ${tone.bg} px-4 py-2`}>
                    {open ? <CheckCircle2 size={18} className={tone.text} /> : kind === 'stop-approval' ? <ShieldAlert size={18} className={tone.text} /> : <Ban size={18} className={tone.text} />}
                    <span className={`text-sm font-bold ${tone.text}`}>{GATE_KIND_META[kind].he}</span>
                </div>
            </div>

            {/* דלת שמאל */}
            <motion.div
                animate={{ x: open ? '-101%' : '0%' }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 22 }}
                className="absolute inset-y-0 left-0 z-10 w-1/2 border-l border-slate-700/60 bg-gradient-to-l from-slate-800 to-slate-900"
            >
                <div className="absolute inset-y-0 right-0 flex items-center"><div className="h-full w-1 bg-slate-700/60" /></div>
            </motion.div>
            {/* דלת ימין */}
            <motion.div
                animate={{ x: open ? '101%' : '0%' }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 22 }}
                className="absolute inset-y-0 right-0 z-10 w-1/2 border-r border-slate-700/60 bg-gradient-to-r from-slate-800 to-slate-900"
            >
                <div className="absolute inset-y-0 left-0 flex items-center"><div className="h-full w-1 bg-slate-700/60" /></div>
            </motion.div>

            {/* מנעול על התפר כשסגור */}
            <AnimatePresence>
                {!open && (
                    <motion.div
                        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={reduce ? undefined : { scale: 0.6, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20 }}
                        className={`absolute left-1/2 top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border ${tone.border} ${tone.bg}`}
                    >
                        {kind === 'stop-approval' ? <ShieldAlert size={16} className={tone.text} /> : <Lock size={16} className={tone.text} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ════════════════════════ Outcome section ════════════════════════════════ */

interface OutcomeProps {
    dist: Distribution;
    top: Distribution['items'][number] | undefined;
    second: Distribution['items'][number] | undefined;
    gate: ReturnType<typeof evaluateGate>;
    action: RiskActionDef | undefined;
    reduce: boolean;
}

const OutcomeSection: React.FC<OutcomeProps> = ({ top, second, gate, action, reduce }) => {
    if (!top) return null;

    // שער פתוח: ההחלטה זורמת.
    if (gate.open) {
        return (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/15 p-5 text-right" dir="rtl">
                <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    <div className="text-sm font-bold text-emerald-200">{gate.kind === 'use-tool' ? 'השער פתוח, מפעילים כלי' : 'השער פתוח, מחזירים תשובה'}</div>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{top.answerHe}</p>
                <p className="mt-2 text-[11px] text-slate-500">הפער עבר את הסף והסיכון נסבל, אז ההחלטה מותרת. עדיין ראוי לציין שזו הערכה מובילה.</p>
                <Takeaway>שער פתוח: הפער היה גדול מספיק ביחס לסף, אז כדאי וראוי להחזיר את התשובה.</Takeaway>
            </div>
        );
    }

    // שער סגור בגלל סיכון: דרוש אישור אנושי.
    if (gate.kind === 'stop-approval') {
        return (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-900/15 p-5 text-right" dir="rtl">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <ShieldAlert size={18} className="text-rose-300" />
                    <div className="text-sm font-bold text-rose-200">נדרש אישור אנושי</div>
                    <span className="rounded-md border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-200" dir="ltr">Human approval required</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">
                    הפעולה &quot;{action?.he}&quot; היא בעלת סיכון גבוה. גם אם הפער עבר את סף ברירת המחדל, פעולה מול לקוח אמיתי לא מתבצעת אוטונומית.
                    המנוע עוצר ומבקש אישור אדם לפני ביצוע.
                </p>
                <p className="mt-2 text-[11px] text-slate-500">ככל שהפעולה רגישה יותר, נדרש ביטחון גבוה יותר. כאן מתחיל החיבור בין הסתברות לאחריות.</p>
                <Takeaway>פער מספיק לבדו אינו מספיק כשהפעולה מסוכנת. עצירה לאישור היא בקרה אחראית, לא כשל.</Takeaway>
            </div>
        );
    }

    // שער סגור בגלל פער קטן: Answer Suppression + Clarifying Question.
    const question = buildClarifyingQuestion(top.clarifyOptionHe, second?.clarifyOptionHe ?? 'משהו אחר');
    return (
        <>
        <LayerIntro>
            כשהשער נסגר, המערכת לא אומרת &quot;אני לא יודע&quot;, היא בחרה לא לנחש. במקום זה היא עושה שני דברים: משהה את התשובה שכבר ניסחה, ובונה במקומה שאלה ממוקדת משתי האפשרויות שהתחרו על ההובלה.
        </LayerIntro>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Answer Suppression */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center gap-2">
                    <Ban size={16} className="text-amber-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">השהיית תשובה</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Answer Suppression</div>
                    </div>
                </div>

                {/* התשובה האפשרית, מופיעה ואז נחסמת */}
                <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Candidate answer</div>
                    <p className="mt-1 text-sm text-slate-400 line-through decoration-rose-400/60">{top.answerHe}</p>
                    <motion.div
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={reduce ? { duration: 0 } : { delay: 0.3, duration: 0.3 }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-200"
                    >
                        <Ban size={12} /> Suppressed: Low confidence
                    </motion.div>
                </div>

                <div className="my-2 flex justify-center"><ArrowDown size={16} className="text-slate-600" /></div>

                <div className="rounded-xl border border-amber-500/40 bg-amber-900/15 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-200">
                        <MessageSquare size={13} /> נשלחת במקום: שאלת הבהרה
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-200">{question}</p>
                </div>
            </div>

            {/* Clarifying Question Builder */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
                <div className="mb-3 flex items-center gap-2">
                    <Split size={16} className="text-amber-300" />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">בניית שאלת ההבהרה</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Clarifying Question Builder</div>
                    </div>
                </div>

                <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
                    השאלה נבנית משתי האפשרויות המתחרות, היא לא גנרית. ההתלבטות עצמה היא חומר הגלם.
                </p>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <SourceChip labelHe={top.labelHe} optionHe={top.clarifyOptionHe} accent={top.accent} value={pct(top.prob)} />
                    <span className="text-slate-500">+</span>
                    <SourceChip labelHe={second?.labelHe ?? ''} optionHe={second?.clarifyOptionHe ?? ''} accent={second?.accent ?? 'slate'} value={second ? pct(second.prob) : 0} />
                </div>

                <div className="my-2 flex justify-center"><ArrowDown size={16} className="text-slate-600" /></div>

                <motion.div
                    key={question}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                    className="rounded-xl border border-violet-500/40 bg-violet-900/20 p-3"
                >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-violet-300/80" dir="ltr">Built question</div>
                    <p className="mt-1 text-sm font-bold leading-relaxed text-violet-100">{question}</p>
                </motion.div>
            </div>
        </div>
        <Takeaway>
            לדעת תשובה ולא לשלוח אותה זו בקרה, לא חולשה. ושאלה טובה נבנית מההתלבטות עצמה, היא מכוונת בדיוק למקום שבו ההתפלגות לא הכריעה.
        </Takeaway>
        <TryThis>
            שימו לב לתשובה שהמערכת הכינה ואז חסמה (Suppressed), ולשאלה שהיא בנתה משתי האפשרויות המובילות ושלחה במקומה.
        </TryThis>
        </>
    );
};

const SourceChip: React.FC<{ labelHe: string; optionHe: string; accent: Accent; value: number }> = ({ labelHe, optionHe, accent, value }) => {
    const a = ACCENTS[accent];
    return (
        <div className={`rounded-xl border ${a.border} ${a.bgSoft} p-2.5 leading-tight`}>
            <div className="flex items-center justify-between gap-1">
                <span className={`text-xs font-bold ${a.text}`}>{labelHe}</span>
                <span className="font-mono text-[10px] text-slate-400" dir="ltr">{value}%</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-300">{optionHe}</div>
        </div>
    );
};

/* ════════════════════════ Risk table (reference) ═════════════════════════ */

const RiskTable: React.FC<{ activeId: string }> = ({ activeId }) => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
        <div className="mb-3 flex items-center gap-2">
            <Wrench size={16} className="text-violet-300" />
            <div className="leading-tight">
                <div className="text-sm font-bold text-slate-200">ביטחון נדרש לפי פעולה</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Required confidence by risk</div>
            </div>
        </div>
        <LayerIntro>
            זו הטבלה שמתרגמת רגישות לסף. ככל שהפעולה משמעותית יותר עבור הלקוח, כך הביטחון הנדרש עולה, עד כדי דרישת אישור אנושי. הפעולה שבחרתם למעלה מודגשת כאן.
        </LayerIntro>
        <div className="space-y-2">
            {RISK_ACTIONS.map((r) => {
                const a = ACCENTS[r.accent];
                const active = r.id === activeId;
                return (
                    <div key={r.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${active ? `${a.border} ${a.bgSoft}` : 'border-slate-700/40 bg-slate-950/30'}`}>
                        <span className="leading-tight">
                            <span className={`block text-sm font-bold ${active ? a.text : 'text-slate-200'}`}>{r.he}</span>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{r.en}</span>
                        </span>
                        <span className="flex items-center gap-2 text-[11px]">
                            <span className={`rounded px-1.5 py-0.5 font-bold ${a.bgSoft} ${a.text}`}>סיכון {r.riskHe}</span>
                            <span className="text-slate-400">ביטחון נדרש: {r.requiredHe}</span>
                            {r.humanApproval && <span className="rounded border border-rose-500/40 bg-rose-500/15 px-1.5 py-0.5 font-bold text-rose-200" dir="ltr">approval</span>}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
);

/* ════════════════════════ Confidence badge ═══════════════════════════════ */

const ConfidenceBadge: React.FC<{ confidence: ConfidenceLevel }> = ({ confidence }) => {
    const m = CONF_META[confidence];
    const a = ACCENTS[m.accent];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${a.border} ${a.bgSoft} ${a.text}`}>
            <Gauge size={11} /> ביטחון {m.he}
            <span className="opacity-70" dir="ltr">{confidence}</span>
        </span>
    );
};
