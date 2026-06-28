"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Sparkles, Info, Compass, ChevronDown, ChevronUp, Table2,
    Play, RotateCcw, Keyboard, ArrowLeftRight, ShieldAlert,
    ShieldCheck, MousePointerClick, Binary,
} from 'lucide-react';

import { ModeToggle } from './ModeToggle';
import { ACCENTS } from './accents';

import {
    SCENARIOS,
    getScenario,
    defaultScenarioFor,
    scenariosFor,
    activeStepIndex,
    dimsForMode,
    idForWord,
    shiftForWord,
    dimValue,
    visualCloseness,
    DIM_INFO,
    DIM_STYLE,
    SIMILAR_PAIR,
    type EngineMode,
    type EngineStep,
    type DimKey,
    type Profile,
    type ShiftEntry,
} from '@/app/behind-the-scenes-ai/chapter-4/embeddingEngine';

/**
 * WordToNumberLab - מעבדת פרק 4, Embeddings: "ממספר חסר משמעות למשמעות".
 * רכיב עצמאי לחלוטין: מחזיק את מצב ההקלדה (mode, scenario, text, selection)
 * ומרכיב את חמשת הרכיבים האינטראקטיביים. כל הנתונים דטרמיניסטיים ומגיעים
 * מ-embeddingEngine. אין כאן backend, קריאת API או LLM אמיתי.
 */
export const WordToNumberLab: React.FC = () => {
    const reduce = useReducedMotion();

    const [mode, setMode] = useState<EngineMode>('chat');
    const [scenarioId, setScenarioId] = useState<string>(defaultScenarioFor('chat').id);
    const [text, setText] = useState('');
    const [selected, setSelected] = useState<string | null>(null);
    const [idView, setIdView] = useState(false);
    const [autoTyping, setAutoTyping] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const scenario = useMemo(() => getScenario(scenarioId) ?? SCENARIOS[0], [scenarioId]);
    const a = ACCENTS[scenario.accent];

    const stepIndex = activeStepIndex(scenario, text);
    const step = stepIndex >= 0 ? scenario.steps[stepIndex] : null;
    const prevStep = stepIndex >= 1 ? scenario.steps[stepIndex - 1] : null;

    const dims = dimsForMode(mode);

    const stopAuto = () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        setAutoTyping(false);
    };
    useEffect(() => () => stopAuto(), []);

    // מורף ה-IDs: בכל פעם ששלב חדש מושלם מציגים קודם מילים ואז הופכים ל-IDs.
    // איפוס התצוגה בזמן render (תבנית "reset state on key change" של React),
    // והמורף עצמו נדחה ב-timeout בתוך effect. זו ההמחשה של המעבר לעולם החישובי.
    const morphKey = `${scenarioId}:${stepIndex}`;
    const [prevMorphKey, setPrevMorphKey] = useState(morphKey);
    if (morphKey !== prevMorphKey) {
        setPrevMorphKey(morphKey);
        setIdView(!!reduce);
    }
    useEffect(() => {
        if (reduce || stepIndex < 0) return;
        const t = setTimeout(() => setIdView(true), 650);
        return () => clearTimeout(t);
    }, [stepIndex, scenarioId, reduce]);

    const resetTo = (id: string) => {
        stopAuto();
        setScenarioId(id);
        setText('');
        setSelected(null);
    };

    const handleMode = (m: EngineMode) => {
        if (m === mode) return;
        setMode(m);
        resetTo(defaultScenarioFor(m).id);
    };

    const handleChange = (value: string) => {
        stopAuto();
        setSelected(null);
        setText(value);
    };

    const handleAutoType = () => {
        stopAuto();
        setSelected(null);
        const target = scenario.prompt;
        if (reduce) { setText(target); return; }
        setAutoTyping(true);
        setText('');
        let i = 0;
        intervalRef.current = setInterval(() => {
            i += 1;
            setText(target.slice(0, i));
            if (i >= target.length) stopAuto();
        }, 75);
    };

    const handleReset = () => {
        stopAuto();
        setText('');
        setSelected(null);
    };

    const modeScenarios = scenariosFor(mode);
    const displayTokens = step ? step.tokens : [];
    const selectToken = (w: string) => setSelected((cur) => (cur === w ? null : w));

    return (
        <div className="space-y-4">
            {/* ── בקרת מצב + בחירת תרחיש ──────────────────────────────────── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between" dir="rtl">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">מצב:</span>
                    <ModeToggle mode={mode} onChange={(m) => handleMode(m as EngineMode)} accent={scenario.accent} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">תרחיש:</span>
                    {modeScenarios.map((s) => {
                        const active = s.id === scenario.id;
                        const sa = ACCENTS[s.accent];
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => resetTo(s.id)}
                                aria-pressed={active}
                                className={`rounded-xl border px-3 py-1.5 text-right leading-tight transition-colors ${
                                    active ? `${sa.border} ${sa.bgSoft}` : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                                }`}
                            >
                                <span className={`block text-xs font-bold ${active ? sa.text : 'text-slate-300'}`}>{s.labelHe}</span>
                                <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{s.labelEn}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── שדה ההקלדה ─────────────────────────────────────────────── */}
            <TypingField
                text={text}
                prompt={scenario.prompt}
                accent={scenario.accent}
                autoTyping={autoTyping}
                onChange={handleChange}
                onAutoType={handleAutoType}
                onReset={handleReset}
            />

            {/* ── שורת "מה השתנה" ────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {step && (
                    <motion.div
                        key={`${scenario.id}-${stepIndex}`}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className={`flex items-start gap-2 rounded-xl border ${a.border} ${a.bgSoft} p-3 text-right`}
                        dir="rtl"
                    >
                        <Sparkles size={15} className={`mt-0.5 shrink-0 ${a.text}`} />
                        <span className="text-sm leading-relaxed text-slate-200">
                            <span className={`font-bold ${a.text}`}>שינוי מוביל: </span>
                            {step.mainChangeHe}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── רכיב 2: ID Sequence Viewer (רוחב מלא, ה-wow הראשון) ─────── */}
            <IdSequenceViewer
                tokens={displayTokens}
                idView={idView}
                selected={selected}
                accent={scenario.accent}
                onToggle={setIdView}
                onSelect={selectToken}
                reduce={!!reduce}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* רכיב 3: Meaning Vector Live */}
                <MeaningVectorLive step={step} prevStep={prevStep} dims={dims} reduce={!!reduce} />

                <div className="space-y-4">
                    {/* רכיב 1: Token ID Table */}
                    <TokenIdTable tokens={displayTokens} selected={selected} accent={scenario.accent} onSelect={selectToken} />
                    {/* רכיב 4: Vector Shift by Word */}
                    <VectorShiftCard word={selected} accent={scenario.accent} reduce={!!reduce} />
                </div>
            </div>

            {/* היגיון / החלטת Agent (רק במצב Agent) */}
            <AnimatePresence>
                {mode === 'agent' && step?.agent && (
                    <AgentOutcomeCard key={`agent-${scenario.id}-${stepIndex}`} agent={step.agent} reduce={!!reduce} />
                )}
            </AnimatePresence>

            {/* רכיב 5: Similar Meaning Preview (רוחב מלא, הפאנץ' של הפרק) */}
            <SimilarMeaningPreview reduce={!!reduce} />

            {/* disclaimer: ממדי המשמעות הם צירים קריאים שנבחרו ללמידה */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    שתי הבהרות: <span className="font-bold text-slate-400">Token ID הוא כתובת במילון, לא משמעות</span> - המספר 1042 מצביע על המילה
                    &quot;החבילה&quot;, הוא לא &quot;אומר&quot; חבילה. <span className="font-bold text-slate-400">ממדי המשמעות (Delivery, Failure וכו&apos;) הם צירים קריאים שבחרנו ללמידה</span> -
                    בייצוגים אמיתיים הממדים אינם תוויות אנושיות אלא מאות או אלפי ממדים נלמדים שאינם קריאים לאדם. עדיין לא מחשבים כאן דמיון או הסתברות, רק בונים פרופיל שאפשר יהיה להשוות בפרקים הבאים.
                </span>
            </div>
        </div>
    );
};

/* ═══════════════════════════ שדה ההקלדה ══════════════════════════════════ */

interface TypingFieldProps {
    text: string;
    prompt: string;
    accent: keyof typeof ACCENTS;
    autoTyping: boolean;
    onChange: (v: string) => void;
    onAutoType: () => void;
    onReset: () => void;
}

const TypingField: React.FC<TypingFieldProps> = ({ text, prompt, accent, autoTyping, onChange, onAutoType, onReset }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 text-right" dir="rtl">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                    <Keyboard size={14} className={a.text} />
                    תרחיש מוצע:
                    <span className="rounded-md bg-slate-800/70 px-2 py-0.5 font-bold text-slate-200">&quot;{prompt}&quot;</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Type it slowly</span>
            </div>

            <div className="relative flex items-center rounded-xl border border-slate-700/60 bg-slate-950/60 transition-colors focus-within:border-slate-500">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="התחילו להקליד כאן..."
                    dir="rtl"
                    aria-label="שדה הקלדה למעבדת המילים למספרים"
                    className="w-full bg-transparent px-4 py-3 text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none"
                />
                {autoTyping && !reduce && (
                    <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className={`absolute top-1/2 h-5 w-0.5 -translate-y-1/2 ${a.solid}`}
                        style={{ insetInlineStart: '1rem' }}
                    />
                )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={onAutoType}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${a.border} ${a.bgSoft} ${a.text} hover:brightness-110`}
                >
                    <Play size={14} /> הקלידו עבורי
                    <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">Auto type</span>
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-200"
                >
                    <RotateCcw size={14} /> איפוס
                    <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">Reset</span>
                </button>
            </div>
        </div>
    );
};

/* ═══════════════════════ רכיב 2: ID Sequence Viewer ══════════════════════ */

interface IdSequenceViewerProps {
    tokens: string[];
    idView: boolean;
    selected: string | null;
    accent: keyof typeof ACCENTS;
    onToggle: (v: boolean) => void;
    onSelect: (w: string) => void;
    reduce: boolean;
}

const IdSequenceViewer: React.FC<IdSequenceViewerProps> = ({ tokens, idView, selected, accent, onToggle, onSelect, reduce }) => {
    const a = ACCENTS[accent];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Binary size={16} className={a.text} />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">רצף ה-IDs</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">ID Sequence Viewer</div>
                    </div>
                </div>
                {/* מתג מילים / מספרים */}
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1" dir="ltr">
                    {([['words', 'מילים'], ['ids', 'IDs']] as const).map(([key, label]) => {
                        const active = (key === 'ids') === idView;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onToggle(key === 'ids')}
                                aria-pressed={active}
                                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                                    active ? `${a.solid} ${a.solidText}` : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {tokens.length === 0 ? (
                <p className="text-xs leading-relaxed text-slate-500">התחילו להקליד (או לחצו &quot;הקלידו עבורי&quot;), והמשפט יהפוך לרצף מספרים.</p>
            ) : (
                <div className="flex flex-wrap items-start gap-3" dir="rtl">
                    {tokens.map((tok, i) => {
                        const id = idForWord(tok);
                        const isSel = selected === tok;
                        return (
                            <button
                                key={`${tok}-${i}`}
                                type="button"
                                onClick={() => onSelect(tok)}
                                className="flex flex-col items-center gap-1.5 outline-none"
                            >
                                {/* פאה מתחלפת: מילה <-> ID */}
                                <span
                                    className={`relative flex h-11 min-w-[5.5rem] items-center justify-center rounded-xl border px-3 transition-colors ${
                                        isSel ? `${a.border} ${a.bgSoft} ring-2 ${a.ringSoft}` : `${a.border} ${a.bgSoft}`
                                    }`}
                                >
                                    {reduce ? (
                                        <span className="flex flex-col items-center leading-none">
                                            <span className="text-sm font-bold text-slate-200">{tok}</span>
                                            <span className={`mt-0.5 font-mono text-xs ${a.text}`} dir="ltr">{id ?? '-'}</span>
                                        </span>
                                    ) : (
                                        <AnimatePresence mode="wait" initial={false}>
                                            {idView ? (
                                                <motion.span
                                                    key="id"
                                                    dir="ltr"
                                                    initial={{ y: -12, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: 12, opacity: 0 }}
                                                    transition={{ type: 'spring', stiffness: 360, damping: 26, delay: i * 0.05 }}
                                                    className={`font-mono text-base font-bold ${a.text}`}
                                                >
                                                    {id ?? '-'}
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="word"
                                                    initial={{ y: -12, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: 12, opacity: 0 }}
                                                    transition={{ type: 'spring', stiffness: 360, damping: 26, delay: i * 0.05 }}
                                                    className="text-sm font-bold text-slate-200"
                                                >
                                                    {tok}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </span>
                                {/* חץ למטה שמתחלף בצבע כשהמילה הופכת ל-ID */}
                                <motion.span
                                    animate={reduce ? {} : { opacity: idView ? 1 : 0.4, y: idView ? 0 : -2 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <ChevronDown size={14} className={idView ? a.text : 'text-slate-600'} />
                                </motion.span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* אכיפת ההבחנה: ID מצביע על מילה, לא אומר משמעות */}
            <div className="mt-4">
                <AnimatePresence mode="wait">
                    {selected && idForWord(selected) !== null ? (
                        <motion.div
                            key={selected}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -4 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                            className={`flex flex-wrap items-center gap-2 rounded-xl border ${a.border} ${a.bgSoft} p-3`}
                            dir="ltr"
                        >
                            <span className={`font-mono text-sm font-bold ${a.text}`}>Token ID {idForWord(selected)}</span>
                            <span className="text-xs text-slate-400">points to</span>
                            <span className="rounded-md bg-slate-800/70 px-2 py-0.5 text-sm font-bold text-slate-100" dir="rtl">{selected}</span>
                            <span className="text-[11px] text-slate-500" dir="rtl">(כתובת במילון, לא משמעות)</span>
                        </motion.div>
                    ) : (
                        <p className="text-[11px] leading-relaxed text-slate-500" dir="rtl">
                            לחצו על מילה כדי לראות לאיזה Token ID היא מצביעה. ה-ID הוא כתובת במילון, כמו ברקוד שאינו הטעם של המוצר.
                        </p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

/* ═══════════════════════ רכיב 1: Token ID Table ══════════════════════════ */

interface TokenIdTableProps {
    tokens: string[];
    selected: string | null;
    accent: keyof typeof ACCENTS;
    onSelect: (w: string) => void;
}

const TokenIdTable: React.FC<TokenIdTableProps> = ({ tokens, selected, accent, onSelect }) => {
    const a = ACCENTS[accent];
    // מציגים את המילים הייחודיות של המשפט הנוכחי; אם אין, דוגמה מהמילון.
    const rows = useMemo(() => {
        const base = tokens.length > 0 ? tokens : ['החבילה', 'לא', 'הגיעה'];
        return Array.from(new Set(base));
    }, [tokens]);
    const muted = tokens.length === 0;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center gap-2">
                <Table2 size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">לוח תרגום</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Human text to Model IDs</div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-700/50">
                <div className="grid grid-cols-[1fr_auto_1fr] bg-slate-800/40 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span className="px-3 py-2">מילה / Token</span>
                    <span className="px-2 py-2 text-center">→</span>
                    <span className="px-3 py-2 text-left" dir="ltr">Token ID</span>
                </div>
                {rows.map((w) => {
                    const id = idForWord(w);
                    const isSel = selected === w;
                    return (
                        <button
                            key={w}
                            type="button"
                            onClick={() => onSelect(w)}
                            className={`grid w-full grid-cols-[1fr_auto_1fr] items-center border-t border-slate-700/40 text-right transition-colors ${
                                isSel ? a.bgSoft : 'hover:bg-slate-800/30'
                            } ${muted ? 'opacity-50' : ''}`}
                        >
                            <span className={`px-3 py-2 text-sm font-bold ${isSel ? a.text : 'text-slate-200'}`}>{w}</span>
                            <span className="px-2 py-2 text-center text-slate-600">→</span>
                            <span className={`px-3 py-2 text-left font-mono text-sm ${isSel ? a.text : 'text-slate-300'}`} dir="ltr">{id ?? '-'}</span>
                        </button>
                    );
                })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                כל מילה מצביעה על כתובת קבועה במילון. ה-ID הוא מזהה, לא משמעות.
            </p>
        </div>
    );
};

/* ═══════════════════════ רכיב 3: Meaning Vector Live ═════════════════════ */

interface MeaningVectorLiveProps {
    step: EngineStep | null;
    prevStep: EngineStep | null;
    dims: DimKey[];
    reduce: boolean;
}

const fmt = (n: number) => n.toFixed(2);

const MeaningVectorLive: React.FC<MeaningVectorLiveProps> = ({ step, prevStep, dims, reduce }) => {
    const profile: Profile = step ? step.profile : {};
    const prev: Profile = prevStep ? prevStep.profile : {};

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <Compass size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">וקטור המשמעות החי</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Meaning Vector Live</div>
                </div>
            </div>

            <div className="space-y-2.5">
                {dims.map((key) => {
                    const value = dimValue(profile, key);
                    const before = dimValue(prev, key);
                    const delta = value - before;
                    const bumped = !!step && delta >= 0.2;
                    const isLead = !!step && step.lead === key;
                    const s = DIM_STYLE[key];
                    const info = DIM_INFO[key];
                    return (
                        <div key={key} className="flex items-center gap-3">
                            <span className="flex w-20 shrink-0 items-center gap-1.5 leading-tight">
                                <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
                                <span>
                                    <span className={`block text-xs font-bold ${isLead ? s.text : 'text-slate-300'}`}>{info.he}</span>
                                    <span className="block text-[8px] uppercase tracking-[0.12em] text-slate-500" dir="ltr">{info.en}</span>
                                </span>
                            </span>

                            <div className={`relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/80 ${bumped ? `ring-1 ${s.border}` : ''}`}>
                                <motion.div
                                    animate={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 18 }}
                                    className={`h-full rounded-full ${value > 0 ? s.bar : 'bg-slate-700'}`}
                                />
                            </div>

                            <span className="flex w-16 shrink-0 items-center justify-end gap-1">
                                <AnimatePresence>
                                    {bumped && (
                                        <motion.span
                                            key="bump"
                                            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={reduce ? undefined : { opacity: 0, scale: 0.6 }}
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 16 }}
                                            className={`inline-flex items-center ${s.text}`}
                                        >
                                            <ChevronUp size={13} strokeWidth={3} />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                <span className={`font-mono text-xs ${value > 0 ? 'text-slate-300' : 'text-slate-600'}`} dir="ltr">{fmt(value)}</span>
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
                ערכים מנורמלים בין 0 ל-1. שימו לב איך המילה &quot;לא&quot; מקפיצה את הכשל ואת הדחיפות. זהו פרופיל המשמעות, נפרד מנוסחת הסכימה הלימודית.
            </p>
        </div>
    );
};

/* ═══════════════════════ רכיב 4: Vector Shift by Word ════════════════════ */

const DIR_LABEL: Record<ShiftEntry['dir'], { he: string; chevrons: number; strong: boolean }> = {
    'up-strong': { he: 'עלייה חזקה', chevrons: 2, strong: true },
    'up': { he: 'עלייה', chevrons: 1, strong: true },
    'up-slight': { he: 'עלייה קלה', chevrons: 1, strong: false },
};

interface VectorShiftCardProps {
    word: string | null;
    accent: keyof typeof ACCENTS;
    reduce: boolean;
}

const VectorShiftCard: React.FC<VectorShiftCardProps> = ({ word, accent, reduce }) => {
    const a = ACCENTS[accent];
    const entries = word ? shiftForWord(word) : [];

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-3 flex items-center gap-2">
                <ChevronUp size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">השפעת המילה</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Vector Shift by Word</div>
                </div>
            </div>

            {!word ? (
                <p className="flex items-center gap-2 text-xs leading-relaxed text-slate-500">
                    <MousePointerClick size={14} /> לחצו על מילה כדי לראות לאן היא דוחפת את הפרופיל.
                </p>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={word}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.22 }}
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <span className="rounded-md bg-slate-800/70 px-2 py-0.5 text-sm font-bold text-slate-100">{word}</span>
                            <span className="text-[11px] text-slate-500">דוחפת מעלה את הממדים:</span>
                        </div>

                        {entries.length === 0 ? (
                            <p className="text-xs leading-relaxed text-slate-500">תורמת מעט מאוד לפרופיל. עדיין הופכת ל-Token ID ונכנסת לחישוב.</p>
                        ) : (
                            <div className="space-y-2">
                                {entries.map((e) => {
                                    const dimStyle = e.dim ? DIM_STYLE[e.dim] : null;
                                    const label = DIR_LABEL[e.dir];
                                    return (
                                        <div
                                            key={`${e.en}-${e.dir}`}
                                            className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                                                dimStyle ? `${dimStyle.border} ${dimStyle.soft}` : 'border-slate-700/50 bg-slate-950/40'
                                            }`}
                                        >
                                            <span className="leading-tight">
                                                <span className={`block text-sm font-bold ${dimStyle ? dimStyle.text : 'text-slate-200'}`}>{e.he}</span>
                                                <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{e.en}</span>
                                            </span>
                                            <span className={`inline-flex items-center gap-0.5 ${dimStyle ? dimStyle.text : 'text-slate-300'}`} title={label.he}>
                                                {Array.from({ length: label.chevrons }).map((_, k) => (
                                                    <ChevronUp key={k} size={15} strokeWidth={label.strong ? 3 : 2} className={label.strong ? '' : 'opacity-60'} />
                                                ))}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                            כיוון השפעה, לא אריתמטיקה מדויקת. כל מילה תורמת משהו לפרופיל המספרי.
                        </p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

/* ═══════════════════════ רכיב 5: Similar Meaning Preview ═════════════════ */

const SimilarColumn: React.FC<{ item: typeof SIMILAR_PAIR.left; dims: DimKey[]; reduce: boolean }> = ({ item, dims, reduce }) => (
    <div className="flex-1 rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
        <div className="mb-3 text-sm font-bold text-slate-100">&quot;{item.prompt}&quot;</div>
        <div className="mb-3 flex flex-wrap gap-1.5" dir="rtl">
            {item.tokens.map((t, i) => (
                <span key={`${t}-${i}`} className="flex flex-col items-center rounded-lg border border-slate-700/50 bg-slate-800/40 px-2 py-1 leading-none">
                    <span className="text-xs font-bold text-slate-200">{t}</span>
                    <span className="mt-0.5 font-mono text-[10px] text-slate-400" dir="ltr">{idForWord(t) ?? '-'}</span>
                </span>
            ))}
        </div>
        <div className="space-y-1.5">
            {dims.map((key) => {
                const value = dimValue(item.profile, key);
                const s = DIM_STYLE[key];
                return (
                    <div key={key} className="flex items-center gap-2">
                        <span className={`w-14 shrink-0 text-[10px] font-bold ${s.text}`} dir="ltr">{DIM_INFO[key].en}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/80">
                            <motion.div
                                initial={reduce ? false : { width: 0 }}
                                animate={{ width: `${value * 100}%` }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
                                className={`h-full rounded-full ${s.bar}`}
                            />
                        </div>
                        <span className="w-9 shrink-0 text-left font-mono text-[10px] text-slate-400" dir="ltr">{fmt(value)}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

const SimilarMeaningPreview: React.FC<{ reduce: boolean }> = ({ reduce }) => {
    const { left, right, sharedDims } = SIMILAR_PAIR;
    const closeness = visualCloseness(left.profile, right.profile, sharedDims);
    const pct = Math.round(closeness * 100);

    return (
        <div className="rounded-2xl border border-violet-500/30 bg-violet-900/10 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">כיוון דומה</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Similar Meaning Preview</div>
                </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
                <SimilarColumn item={left} dims={sharedDims} reduce={reduce} />
                <SimilarColumn item={right} dims={sharedDims} reduce={reduce} />
            </div>

            {/* חיווי התיישרות */}
            <div className="mt-4 rounded-xl border border-violet-500/30 bg-slate-950/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-violet-200">Token IDs שונים, Meaning Vector מתיישר</span>
                    <span className="font-mono text-xs text-violet-300" dir="ltr">~{pct}% direction overlap</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800/80">
                    <motion.div
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 20, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-l from-violet-400 to-fuchsia-500"
                    />
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    שני המשפטים לא חולקים אף Token ID (1042,17,883 מול 1057,17,904), אבל הם מצביעים לאותו כיוון משמעות. זו טעימה ויזואלית בלבד. את הגיאומטריה של הכיוון הזה נפתח בפרק הבא, ואת חישוב הדמיון המלא בפרק 8.
                </p>
            </div>
        </div>
    );
};

/* ═══════════════════════ Agent Outcome Card ══════════════════════════════ */

const AgentOutcomeCard: React.FC<{ agent: NonNullable<EngineStep['agent']>; reduce: boolean }> = ({ agent, reduce }) => {
    const approval = agent.status === 'approval';
    const tone = approval
        ? { border: 'border-rose-500/40', bg: 'bg-rose-900/15', text: 'text-rose-300', icon: <ShieldAlert size={18} className="text-rose-300" /> }
        : { border: 'border-emerald-500/40', bg: 'bg-emerald-900/15', text: 'text-emerald-300', icon: <ShieldCheck size={18} className="text-emerald-300" /> };

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
            className={`rounded-2xl border ${tone.border} ${tone.bg} p-5 text-right`}
            dir="rtl"
        >
            <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">{tone.icon}</span>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-bold ${tone.text}`}>{agent.headlineHe}</span>
                        {approval && (
                            <span className="rounded-md border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-200" dir="ltr">
                                Needs approval
                            </span>
                        )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{agent.detailHe}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                        אותו פרופיל מספרי מבדיל בין חקירה בטוחה לבין פעולה מסוכנת מול לקוח. ייצוג המשמעות לא רק עונה, הוא משפיע על החלטות פעולה.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
