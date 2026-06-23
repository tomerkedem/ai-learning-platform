"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Compass, ArrowLeftRight, Sigma, Boxes, BarChart3, Flag, ChevronDown,
    Play, RotateCcw, Keyboard, FunctionSquare, Eye, Workflow, ScanLine,
    CheckCircle2, AlertTriangle, Info, Gauge, Repeat, MousePointerClick, Lightbulb,
    Pause, SkipForward, Zap, Scale,
} from 'lucide-react';

import { ModeToggle } from './ModeToggle';
import { ProbabilityBars } from './ProbabilityBars';
import { StickyInputDock, type DockReadout } from './StickyInputDock';
import { ACCENTS } from './accents';
import { DUR, EASE } from './motionTokens';
import type { Accent, IntentProbability } from './types';

import {
    analyzeSentence,
    analyzeAgent,
    DIMS,
    DIM_INFO,
    DIM_STYLE,
    QUICK_PROMPTS,
    WORD_SWAP,
    WEIGHTS,
    AGENT_PROMPT,
    type AnalysisResult,
    type RankItem,
    type ConfidenceLevel,
} from '@/app/behind-the-scenes-ai/chapter-8/pipelineData';

/* ════════════════════════ עזרי תצוגה ═════════════════════════════════════ */

const f2 = (n: number) => n.toFixed(2);
const pct = (n: number) => Math.round(n * 100);

const CONF_STYLE: Record<ConfidenceLevel, { he: string; accent: Accent; bar: number }> = {
    High: { he: 'גבוה', accent: 'emerald', bar: 92 },
    Medium: { he: 'בינוני', accent: 'amber', bar: 64 },
    'Medium-low': { he: 'נמוך-בינוני', accent: 'amber', bar: 44 },
    Low: { he: 'נמוך', accent: 'rose', bar: 26 },
};

/* ════════════════════════ שכבת קריינות לימודית ═══════════════════════════ */
// טקסט בלבד. שלושת הרכיבים האלה מלווים כל שלב בשרשרת: הקדמה לפני, "השורה
// התחתונה" אחרי, ו"נסו את זה" שהופך את הווידג'ט לתרגיל ללומד העצמאי.

/** פסקת הקדמה: מה עומדים לראות בשלב הזה ולמה. */
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

/* ════════════════════════ קומפוננטת השרשרת ═══════════════════════════════ */

export const PipelineCascadeLab: React.FC = () => {
    const reduce = useReducedMotion();

    const [mode, setMode] = useState<'chat' | 'agent'>('chat');
    const [text, setText] = useState('');
    const [hasBarcode, setHasBarcode] = useState(false);
    const [formulaView, setFormulaView] = useState(false);
    const [autoTyping, setAutoTyping] = useState(false);
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [waveKey, setWaveKey] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const result: AnalysisResult = useMemo(
        () => (mode === 'chat' ? analyzeSentence(text) : analyzeAgent(hasBarcode)),
        [mode, text, hasBarcode],
    );

    // חתימת מצב: כל שינוי משמעותי (מוביל, פער, וקטור) מפעיל גל חדש במורד השרשרת.
    const sig = `${mode}|${result.hasInput}|${result.leaderId}|${Math.round(result.marginPct / 5)}|${result.vector.map((v) => Math.round(v * 10)).join('')}`;
    const [prevSig, setPrevSig] = useState(sig);
    if (sig !== prevSig) {
        setPrevSig(sig);
        setWaveKey((k) => k + 1);
    }

    const stopAuto = () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        setAutoTyping(false);
    };
    useEffect(() => () => stopAuto(), []);

    const handleMode = (m: 'chat' | 'agent') => {
        if (m === mode) return;
        stopAuto();
        setMode(m);
        setHoverId(null);
    };

    const handleChange = (v: string) => { stopAuto(); setText(v); };

    const handleAutoType = (target: string) => {
        stopAuto();
        if (reduce) { setText(target); return; }
        setAutoTyping(true);
        setText('');
        let i = 0;
        intervalRef.current = setInterval(() => {
            i += 1;
            setText(target.slice(0, i));
            if (i >= target.length) stopAuto();
        }, 70);
    };

    const handleSwap = () => {
        stopAuto();
        setText((cur) => {
            if (cur.includes(WORD_SWAP.from)) return cur.replace(WORD_SWAP.from, WORD_SWAP.to);
            if (cur.includes(WORD_SWAP.to)) return cur.replace(WORD_SWAP.to, WORD_SWAP.from);
            return cur;
        });
    };

    const handleReset = () => { stopAuto(); setText(''); setHoverId(null); };

    // Replay מה-dock: בועט ב-waveKey, מה שמאתחל מחדש את אנימציית ה-Softmax (ואת
    // גל השרשרת) בלי לגעת בלוגיקה או בערכים — בדיוק כמו שינוי מצב היה עושה.
    const replaySoftmax = () => setWaveKey((k) => k + 1);

    const canSwap = mode === 'chat' && (text.includes(WORD_SWAP.from) || text.includes(WORD_SWAP.to));

    // readout ל-dock הדביק: קריאה בלבד מתוך ה-state של המנוע, ללא שינוי ערך.
    const leader = result.items[0];
    const dockReadout: DockReadout = {
        hasInput: result.hasInput,
        leaderHe: leader?.labelHe ?? '',
        leaderEn: leader?.labelEn ?? '',
        leaderAccent: leader?.accent ?? 'cyan',
        probPct: pct(leader?.prob ?? 0),
        marginPct: result.marginPct,
        decisionHe: result.decision.he,
        decisionEn: result.decision.en,
        decisionKind: result.decision.kind,
        bars: result.items.map((it) => ({ accent: it.accent, pct: pct(it.prob), labelHe: it.labelHe })),
        waitingHe: 'ממתין לקלט',
    };

    return (
        <div className="space-y-4">
            {/* ── בקרה: מצב + תצוגת נוסחה ─────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4" dir="rtl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">מצב:</span>
                        <ModeToggle mode={mode} onChange={(m) => handleMode(m as 'chat' | 'agent')} accent="purple" />
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormulaView((v) => !v)}
                        aria-pressed={formulaView}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                            formulaView ? 'border-violet-500/50 bg-violet-900/25 text-violet-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                        }`}
                    >
                        {formulaView ? <FunctionSquare size={15} /> : <Eye size={15} />}
                        {formulaView ? 'תצוגת נוסחה' : 'תצוגה פשוטה'}
                        <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{formulaView ? 'Formula' : 'Simple'}</span>
                    </button>
                </div>
                <p className="mt-3 border-t border-slate-700/40 pt-3 text-[11px] leading-relaxed text-slate-500">
                    מי שרוצה לראות את החישוב עצמו יכול ללחוץ על <span className="font-bold text-slate-400">תצוגת נוסחה</span> (Formula View). המטרה אינה להפוך אתכם למתמטיקאים, אלא להראות שהגרפים והאחוזים אינם קסם, אלא תוצאה של חישוב שאפשר לעקוב אחריו. החלפה ל-<span className="font-bold text-slate-400">Agent Mode</span> מראה שאותה שרשרת מדרגת צעדים לפי מצב, לא רק כוונות.
                </p>
            </div>

            {/* ── dock קלט דביק: הקלט + התוצאה הראשית נשארים צמודים וגלויים ─────
                שדה הקלט הקיים מקודם לתוך ה-dock (children) — מקור קלט יחיד, בלי
                כפילות. ה-readout קורא את ה-state של המנוע בלבד. ── */}
            <StickyInputDock readout={dockReadout} onReplay={replaySoftmax} reduce={!!reduce}>
                {mode === 'chat' ? (
                    <ChatInput
                        text={text}
                        autoTyping={autoTyping}
                        canSwap={canSwap}
                        onChange={handleChange}
                        onAutoType={handleAutoType}
                        onSwap={handleSwap}
                        onReset={handleReset}
                        reduce={!!reduce}
                    />
                ) : (
                    <AgentInput result={result} hasBarcode={hasBarcode} onToggleBarcode={() => setHasBarcode((b) => !b)} reduce={!!reduce} />
                )}
            </StickyInputDock>

            {/* ── מפל השרשרת (Pipeline Cascade) ───────────────────────────── */}
            <PipelineCascade
                result={result}
                waveKey={waveKey}
                formulaView={formulaView}
                hoverId={hoverId}
                setHoverId={setHoverId}
                reduce={!!reduce}
            />

            {/* ── disclaimer + גשר ───────────────────────────────────────── */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    כל המספרים כאן מחושבים חי: Cosine Similarity אמיתי בין הווקטורים, ציון = w1·דמיון + w2·השפעת מילה + w3·בונוס הקשר,
                    ואז Softmax עם temperature הופך ציונים להסתברויות. <span className="font-bold text-slate-400">דמיון אינו הסתברות, וציון אינו הסתברות</span> -
                    רק אחרי Softmax הערכים מסתכמים ל-100%. דירוג הכוונות הוא ההפשטה הלימודית שלנו: מודל אמיתי מדרג את ה-token הבא, לא כוונות שלמות.
                </span>
            </div>
        </div>
    );
};

/* ════════════════════════ קלט Chat ═══════════════════════════════════════ */

interface ChatInputProps {
    text: string;
    autoTyping: boolean;
    canSwap: boolean;
    onChange: (v: string) => void;
    onAutoType: (target: string) => void;
    onSwap: () => void;
    onReset: () => void;
    reduce: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ text, autoTyping, canSwap, onChange, onAutoType, onSwap, onReset, reduce }) => (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 text-right" dir="rtl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                <Keyboard size={14} className="text-violet-300" />
                ניסויים מהירים:
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Type, or swap a word</span>
        </div>

        <div className="relative flex items-center rounded-xl border border-slate-700/60 bg-slate-950/60 transition-colors focus-within:border-violet-500/60">
            <input
                type="text"
                value={text}
                onChange={(e) => onChange(e.target.value)}
                placeholder="הקלידו משפט, למשל: החבילה לא הגיעה"
                dir="rtl"
                aria-label="שדה הקלדה לשרשרת החישוב"
                className="w-full bg-transparent px-4 py-3 text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none"
            />
            {autoTyping && !reduce && (
                <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 bg-violet-400"
                    style={{ insetInlineStart: '1rem' }}
                />
            )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
            {QUICK_PROMPTS.map((q) => (
                <button
                    key={q.id}
                    type="button"
                    onClick={() => onAutoType(q.text)}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-900/15 px-3 py-2 text-sm font-bold text-violet-200 transition-colors hover:brightness-110"
                >
                    <Play size={13} /> {q.labelHe}
                </button>
            ))}
            <button
                type="button"
                onClick={onSwap}
                disabled={!canSwap}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                    canSwap ? 'border-amber-500/50 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25' : 'cursor-not-allowed border-slate-700/60 bg-slate-800/40 text-slate-600'
                }`}
                title="מחליף בין 'הגיעה' ל'מופיעה במערכת' ושולח גל שינוי במורד השרשרת"
            >
                <Repeat size={13} /> החלפת מילה
                <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">Swap word</span>
            </button>
            <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-200"
            >
                <RotateCcw size={13} /> איפוס
            </button>
        </div>
    </div>
);

/* ════════════════════════ קלט Agent ══════════════════════════════════════ */

const AgentInput: React.FC<{ result: AnalysisResult; hasBarcode: boolean; onToggleBarcode: () => void; reduce: boolean }> = ({ result, hasBarcode, onToggleBarcode }) => {
    const st = result.agentState;
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 text-right" dir="rtl">
            <LayerIntro>
                במצב Agent אותה שרשרת חישוב ממשיכה לעבוד, אבל היא מדרגת צעדים אפשריים ולא כוונות. ההבדל החשוב: הדירוג תלוי במצב, לא רק במשפט. לפני שיש ברקוד חסר מידע, ולכן הצעד המוביל הוא לבקש אותו. ברגע שמוסרים ברקוד, אותה מכונה מהפכת את הדירוג לטובת השימוש בכלי המעקב.
            </LayerIntro>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                    <Workflow size={14} className="text-violet-300" />
                    משימת Agent:
                    <span className="rounded-md bg-slate-800/70 px-2 py-0.5 font-bold text-slate-200">&quot;{AGENT_PROMPT}&quot;</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">Ranking depends on state</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 leading-tight">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Task detected</div>
                    <div className="mt-1 text-sm font-bold text-slate-200">{st?.taskHe}</div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 leading-tight">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Missing</div>
                    <div className={`mt-1 text-sm font-bold ${st?.missingHe ? 'text-amber-300' : 'text-emerald-300'}`}>
                        {st?.missingHe ?? 'אין, המידע הושלם'}
                    </div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 leading-tight">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">Decision</div>
                    <div className="mt-1 text-sm font-bold text-violet-200">{result.decision.he}</div>
                </div>
            </div>

            <button
                type="button"
                onClick={onToggleBarcode}
                className={`mt-3 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                    hasBarcode ? 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600' : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25'
                }`}
            >
                <ScanLine size={14} />
                {hasBarcode ? 'איפוס מצב (להסיר ברקוד)' : 'מסירת ברקוד'}
                <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{hasBarcode ? 'Reset state' : 'Provide barcode'}</span>
            </button>

            <TryThis>
                לחצו &quot;מסירת ברקוד&quot; (Provide barcode) ושימו לב שהצעד המוביל בשרשרת משתנה מ&quot;לבקש ברקוד&quot; (Ask for barcode) ל&quot;להשתמש בכלי מעקב&quot; (Use tracking tool). אותה מכונת חישוב, מצב קלט שונה, החלטה שונה.
            </TryThis>
        </div>
    );
};

/* ════════════════════════ המפל (Cascade) ═════════════════════════════════ */

interface CascadeProps {
    result: AnalysisResult;
    waveKey: number;
    formulaView: boolean;
    hoverId: string | null;
    setHoverId: (id: string | null) => void;
    reduce: boolean;
}

const PipelineCascade: React.FC<CascadeProps> = ({ result, waveKey, formulaView, hoverId, setHoverId, reduce }) => {
    const simSorted = [...result.items].sort((a, b) => b.similarity - a.similarity);
    const scoreSorted = [...result.items].sort((a, b) => b.score - a.score);
    const isAgent = result.mode === 'agent';

    const layers: { key: string; node: React.ReactNode }[] = [
        {
            key: 'vector',
            node: <VectorLayer result={result} reduce={reduce} />,
        },
        {
            key: 'similarity',
            node: <SimilarityLayer items={simSorted} sentenceVector={result.vector} isAgent={isAgent} hoverId={hoverId} setHoverId={setHoverId} reduce={reduce} />,
        },
        {
            key: 'scores',
            node: <ScoresLayer items={scoreSorted} formulaView={formulaView} reduce={reduce} />,
        },
        {
            key: 'softmax',
            node: <SoftmaxLayer items={scoreSorted} temperature={result.temperature} formulaView={formulaView} hasInput={result.hasInput} waveKey={waveKey} reduce={reduce} />,
        },
        {
            key: 'probabilities',
            node: <ProbabilitiesLayer result={result} reduce={reduce} />,
        },
        {
            key: 'decision',
            node: <DecisionLayer result={result} reduce={reduce} />,
        },
    ];

    return (
        <div>
            {layers.map((layer, i) => (
                <React.Fragment key={layer.key}>
                    {i > 0 && <CascadeConnector index={i} waveKey={waveKey} reduce={reduce} />}
                    <CascadeLayer index={i} waveKey={waveKey} active={result.hasInput} reduce={reduce}>
                        {layer.node}
                    </CascadeLayer>
                </React.Fragment>
            ))}
        </div>
    );
};

const CascadeConnector: React.FC<{ index: number; waveKey: number; reduce: boolean }> = ({ index, waveKey, reduce }) => (
    <div className="flex justify-center py-1.5" aria-hidden>
        <div className="relative h-7 w-px bg-gradient-to-b from-slate-700/70 to-slate-700/30">
            {!reduce && (
                <motion.span
                    key={waveKey}
                    className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-violet-400 shadow-[0_0_10px_2px_rgba(139,92,246,0.7)]"
                    initial={{ top: '-4px', opacity: 0 }}
                    animate={{ top: ['-4px', '28px'], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.45, delay: index * 0.12, ease: 'easeIn' }}
                />
            )}
            <ChevronDown size={12} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-slate-600" />
        </div>
    </div>
);

const CascadeLayer: React.FC<{ index: number; waveKey: number; active: boolean; reduce: boolean; children: React.ReactNode }> = ({ index, waveKey, active, reduce, children }) => (
    <div className="relative">
        {!reduce && active && (
            <motion.span
                key={waveKey}
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
                style={{ boxShadow: '0 0 26px -2px rgba(139,92,246,0.6)' }}
            />
        )}
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, delay: index * 0.08 }}
            className="relative rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5"
        >
            {children}
        </motion.div>
    </div>
);

/** כותרת שכבה אחידה. */
const LayerHead: React.FC<{ icon: React.ReactNode; he: string; en: string; accent: Accent; badge?: React.ReactNode }> = ({ icon, he, en, accent, badge }) => {
    const a = ACCENTS[accent];
    return (
        <div className="mb-4 flex items-center justify-between gap-2" dir="rtl">
            <div className="flex items-center gap-2">
                <span className={a.text}>{icon}</span>
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">{he}</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{en}</div>
                </div>
            </div>
            {badge}
        </div>
    );
};

/* ── שכבה 1: Meaning Vector ───────────────────────────────────────────────── */

const VectorLayer: React.FC<{ result: AnalysisResult; reduce: boolean }> = ({ result, reduce }) => (
    <div dir="rtl">
        <LayerHead icon={<Compass size={16} />} he="וקטור משמעות" en="Meaning Vector" accent="cyan" />
        <LayerIntro>
            כל השרשרת מתחילה כאן. המשפט שכתבתם כבר אינו מילים, אלא וקטור משמעות אחד, פרופיל מספרי שמתאר לאן המשפט מצביע על פני חמישה ממדים. זה מה שבנינו בפרק הקודם, וזו נקודת הפתיחה: כל שלב מכאן והלאה נגזר מהמספרים האלה.
        </LayerIntro>
        <div className="space-y-2.5">
            {DIMS.map((key) => {
                const idx = DIMS.indexOf(key);
                const value = result.vector[idx] ?? 0;
                const s = DIM_STYLE[key];
                const info = DIM_INFO[key];
                return (
                    <div key={key} className="flex items-center gap-3">
                        <span className="flex w-20 shrink-0 items-center gap-1.5 leading-tight">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
                            <span>
                                <span className="block text-xs font-bold text-slate-300">{info.he}</span>
                                <span className="block text-[8px] uppercase tracking-[0.12em] text-slate-500" dir="ltr">{info.en}</span>
                            </span>
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/80">
                            <motion.div
                                animate={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 18 }}
                                className={`h-full rounded-full ${value > 0 ? s.bar : 'bg-slate-700'}`}
                            />
                        </div>
                        <span className="w-10 shrink-0 text-left font-mono text-xs text-slate-400" dir="ltr">{f2(value)}</span>
                    </div>
                );
            })}
        </div>
        <Takeaway>
            הקלט מקובץ לווקטור משמעות אחד. כל מספר כאן הוא תוצאה של חישוב על המילים שהקלדתם, לא ניחוש ולא ערך קבוע מראש.
        </Takeaway>
    </div>
);

/* ── שכבה 2: Similarity Ranking ───────────────────────────────────────────── */

const SimilarityLayer: React.FC<{
    items: RankItem[];
    sentenceVector: number[];
    isAgent: boolean;
    hoverId: string | null;
    setHoverId: (id: string | null) => void;
    reduce: boolean;
}> = ({ items, sentenceVector, isAgent, hoverId, setHoverId, reduce }) => {
    const maxSim = Math.max(...items.map((it) => Math.abs(it.similarity)), 0.001);
    return (
        <div dir="rtl">
            <LayerHead
                icon={<ArrowLeftRight size={16} />}
                he={isAgent ? 'דירוג רלוונטיות' : 'דירוג דמיון'}
                en={isAgent ? 'Step Relevance' : 'Similarity Ranking'}
                accent="amber"
                badge={
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-900/15 px-2.5 py-1 text-[10px] font-bold text-amber-300" dir="ltr">
                        <AlertTriangle size={11} /> {isAgent ? 'Relevance, not probability' : 'Similarity, not probability'}
                    </span>
                }
            />
            {isAgent ? (
                <LayerIntro>
                    השלב הראשון שואל כמה כל צעד אפשרי רלוונטי למשימה. זו אותה מדידת קרבה כמו ב-Chat, רק שכאן היא בודקת צעדים ולא כוונות. שימו לב שזה ציון רלוונטיות, לא הסתברות.
                </LayerIntro>
            ) : (
                <LayerIntro>
                    השלב הראשון הוא לשאול למה המשפט שכתבתם הכי קרוב. המנוע משווה את הפרופיל המספרי של המשפט לפרופיל של כל כוונה שהוא מכיר, ומודד כמה הם מצביעים לאותו כיוון. זה נקרא Cosine Similarity, ואפשר לחשוב עליו פשוט: שני חצים שמצביעים לאותו כיוון מקבלים ציון גבוה, שני חצים בכיוונים שונים מקבלים ציון נמוך. שימו לב לדבר חשוב, המנוע לא מחפש מילים זהות. &quot;החבילה לא הגיעה&quot; ו&quot;המשלוח לא נמסר&quot; הן מילים שונות, אבל הכיוון דומה, ולכן הדמיון גבוה.
                </LayerIntro>
            )}
            <div className="space-y-2">
                {items.map((it) => {
                    const a = ACCENTS[it.accent];
                    const w = (Math.max(0, it.similarity) / maxSim) * 100;
                    const open = hoverId === it.id && !isAgent && it.vector;
                    return (
                        <div
                            key={it.id}
                            onMouseEnter={() => setHoverId(it.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onClick={() => setHoverId(hoverId === it.id ? null : it.id)}
                            className={`cursor-default rounded-xl border p-2.5 transition-colors ${open ? `${a.border} ${a.bgSoft}` : 'border-slate-700/40 bg-slate-950/30 hover:border-slate-600/60'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-32 shrink-0 leading-tight">
                                    <span className={`block text-xs font-bold ${a.text}`}>{it.labelHe}</span>
                                    <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{it.labelEn}</span>
                                </span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/80">
                                    <motion.div
                                        animate={{ width: `${w}%` }}
                                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 18 }}
                                        className={`h-full rounded-full ${a.barGradient}`}
                                    />
                                </div>
                                <span className="w-12 shrink-0 text-left font-mono text-xs font-bold text-slate-300" dir="ltr">{f2(it.similarity)}</span>
                            </div>

                            {/* hover: שני הווקטורים והקרבה (Chat בלבד) */}
                            <AnimatePresence>
                                {open && it.vector && (
                                    <motion.div
                                        initial={reduce ? false : { opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={reduce ? undefined : { opacity: 0, height: 0 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.22 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2.5 space-y-1.5 border-t border-slate-700/40 pt-2.5">
                                            <VecRow label="Sentence" labelHe="המשפט" vec={sentenceVector} />
                                            <VecRow label="Intent" labelHe="הכוונה" vec={it.vector} />
                                            <div className="flex items-center justify-between pt-1 text-[11px]">
                                                <span className="text-slate-500">cosine(sentence, intent)</span>
                                                <span className={`font-mono font-bold ${a.text}`} dir="ltr">{f2(it.similarity)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
            {isAgent ? (
                <Takeaway>המספרים כאן הם ציוני רלוונטיות, לא הסתברות, והם לא מסתכמים ל-100%. הם רק אומרים מי הצעד הכי קשור למשימה.</Takeaway>
            ) : (
                <>
                    <Takeaway>המספרים כאן הם ציוני דמיון, לא הסתברות. 0.94 לא אומר 94 אחוז נכון, הוא אומר שהמשפט קרוב מאוד לכוונה הזאת. ציוני דמיון לא מסתכמים ל-100%.</Takeaway>
                    <TryThis>
                        רחפו על שורה כדי לראות את שני הווקטורים זה מול זה. ואז שנו את &quot;הגיעה&quot; ל&quot;מופיעה במערכת&quot; ושימו לב איך הדמיון לכוונת תקלת מערכת (System issue) מטפס.
                    </TryThis>
                </>
            )}
        </div>
    );
};

const VecRow: React.FC<{ label: string; labelHe: string; vec: number[] }> = ({ label, labelHe, vec }) => (
    <div className="flex items-center gap-2">
        <span className="w-16 shrink-0 text-[10px] font-bold text-slate-400">{labelHe}</span>
        <span className="font-mono text-[11px] text-slate-300" dir="ltr">[{vec.map((v) => v.toFixed(2)).join(', ')}]</span>
        <span className="text-[9px] uppercase tracking-wider text-slate-600" dir="ltr">{label}</span>
    </div>
);

/* ── שכבה 3: Raw Scores ───────────────────────────────────────────────────── */

const ScoresLayer: React.FC<{ items: RankItem[]; formulaView: boolean; reduce: boolean }> = ({ items, formulaView }) => {
    const sumScores = items.reduce((s, it) => s + it.score, 0);
    return (
        <div dir="rtl">
            <LayerHead
                icon={<Boxes size={16} />}
                he="ציונים גולמיים"
                en="Raw Scores"
                accent="indigo"
                badge={
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/40 bg-indigo-900/15 px-2.5 py-1 text-[10px] font-bold text-indigo-300" dir="ltr">
                        Sum = {sumScores.toFixed(2)} (not 100%)
                    </span>
                }
            />

            <LayerIntro>
                הדמיון לבדו לא מספיק. הציון הגולמי מחבר כמה גורמים יחד: הדמיון, ועוד השפעת מילים בודדות (word impact), ועוד בונוס על צמדי מילים בהקשר (context bonus). התוצאה היא ציון אחד לכל כוונה. שימו לב, זה עדיין לא אחוז, והציונים לא מסתכמים ל-100. הם רק אומרים מי מוביל, לא בכמה.
            </LayerIntro>

            <div className="overflow-x-auto">
                <div className="min-w-[34rem] space-y-1.5">
                    {/* כותרות עמודות */}
                    <div className="grid grid-cols-[1fr_repeat(3,4.6rem)_4.6rem] items-center gap-2 px-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500" dir="ltr">
                        <span className="text-right" dir="rtl">Intent</span>
                        {items[0]?.breakdown.map((b) => (
                            <span key={b.key} className="text-center">{b.labelEn}</span>
                        ))}
                        <span className="text-center text-slate-300">Score</span>
                    </div>

                    {items.map((it) => {
                        const a = ACCENTS[it.accent];
                        return (
                            <div key={it.id} className="grid grid-cols-[1fr_repeat(3,4.6rem)_4.6rem] items-center gap-2 rounded-lg border border-slate-700/40 bg-slate-950/30 px-2 py-2">
                                <span className="min-w-0 leading-tight" dir="rtl">
                                    <span className={`block truncate text-xs font-bold ${a.text}`}>{it.labelHe}</span>
                                </span>
                                {it.breakdown.map((b) => (
                                    <span key={b.key} className="text-center leading-tight" dir="ltr">
                                        {formulaView ? (
                                            <span className="font-mono text-[10px] text-slate-400">{b.weight}×{f2(b.value)}</span>
                                        ) : (
                                            <span className="font-mono text-xs text-slate-300">{f2(b.value)}</span>
                                        )}
                                    </span>
                                ))}
                                <span className="text-center font-mono text-sm font-black text-slate-100" dir="ltr">{f2(it.score)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {formulaView && (
                <div className="mt-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 font-mono text-[11px] text-slate-300" dir="ltr">
                    score = {WEIGHTS.similarity}·similarity + {WEIGHTS.wordImpact}·word_impact + {WEIGHTS.contextBonus}·context_bonus
                </div>
            )}
            <Takeaway>
                Score הוא ציון גולמי, לא אחוז. הוא סכום משוקלל של שלושת הרכיבים, והוא מתחיל את התחרות, אבל עוד לא מכריע אותה. הציונים הגולמיים הם רק חומר הגלם ל-Softmax.
            </Takeaway>
            <TryThis>
                פתחו את תצוגת הנוסחה (Formula View) למעלה, ועקבו אחרי שורה אחת: איך similarity ועוד word impact ועוד context בונים יחד ציון אחד.
            </TryThis>
        </div>
    );
};

/* ── שכבה 4: Softmax machine ──────────────────────────────────────────────── */
// רגע ה-Softmax: אנימציית ההוראה המרכזית של הלומדה. שתי פעימות שמגלמות את שתי
// הפעולות של Softmax — (1) הגברה: exp מותח את ההפרשים, חלקו של המוביל גדל יותר
// מפרופורציונלית; (2) נרמול: המשקלים נשפכים למיכל בעל קיבולת קבועה של 100%
// ומתחרים על מקום. כל הערכים נקראים חי מהמנוע; האנימציה נוחתת בדיוק על
// ההסתברויות שהמנוע נתן (it.prob), בלי לשנות אף מספר.

type SoftmaxPhase = 'idle' | 'amplify' | 'normalize' | 'done';

const BEAT1_FILL = 0.66;   // כמה הפעימה הראשונה ממלאת מהמיכל (< 1 = "עוד לא 100%")
const RAW_HOLD_MS = 450;   // הצגת הציונים הגולמיים לפני ההגברה
const AMPLIFY_MS = 1100;   // משך פעימת ההגברה
const NORMALIZE_MS = 1200; // משך פעימת הנרמול

const BeatPill: React.FC<{ n: number; he: string; en: string; icon: React.ReactNode; active: boolean; done: boolean }> = ({ n, he, en, icon, active, done }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
            active
                ? 'border-purple-400/70 bg-purple-500/25 text-purple-100'
                : done
                    ? 'border-emerald-500/40 bg-emerald-900/15 text-emerald-300'
                    : 'border-slate-700/60 bg-slate-900/40 text-slate-500'
        }`}
        dir="rtl"
    >
        {icon}
        <span>{n}. {he}</span>
        <span className="font-medium uppercase opacity-70" dir="ltr">{en}</span>
    </span>
);

const SoftmaxLayer: React.FC<{
    items: RankItem[];
    temperature: number;
    formulaView: boolean;
    hasInput: boolean;
    waveKey: number;
    reduce: boolean;
}> = ({ items, temperature, formulaView, hasInput, waveKey, reduce }) => {
    // ── הכל נקרא חי מהמנוע. שכבת הצגה בלבד — איננו משנים אף ערך. ──
    const scores = items.map((it) => it.score);
    const sumScores = scores.reduce((a, b) => a + Math.max(0, b), 0) || 1;
    // יחס הציון הגולמי (לפני ההגברה) מול ההסתברות הסופית של המנוע (אחרי exp+נרמול,
    // כולל ה-temperature הקנונית). ההפרש בין השניים הוא בדיוק ההגברה ש-exp(s/T) יוצר.
    const rawShare = scores.map((s) => Math.max(0, s) / sumScores);
    const probShare = items.map((it) => it.prob); // אמת המנוע — נקודת הנחיתה הסופית

    const [phase, setPhase] = useState<SoftmaxPhase>(reduce || !hasInput ? 'done' : 'idle');
    const [auto, setAuto] = useState(true);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearTimer = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };

    // אתחול שתי הפעימות בכל פעם שהשרשרת זזה (waveKey) או שמצב הקלט משתנה.
    useEffect(() => {
        clearTimer();
        setPhase(reduce || !hasInput ? 'done' : 'idle');
        return clearTimer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waveKey, hasInput, reduce]);

    // התקדמות אוטומטית בין הפעימות. במצב השהיה (auto=false) נעצרים בין הפעימות.
    useEffect(() => {
        clearTimer();
        if (reduce || !auto || !hasInput) return;
        if (phase === 'idle') timer.current = setTimeout(() => setPhase('amplify'), RAW_HOLD_MS);
        else if (phase === 'amplify') timer.current = setTimeout(() => setPhase('normalize'), AMPLIFY_MS);
        else if (phase === 'normalize') timer.current = setTimeout(() => setPhase('done'), NORMALIZE_MS);
        return clearTimer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, auto, hasInput, reduce]);

    const replay = () => { clearTimer(); setAuto(true); setPhase('idle'); };
    const stepNext = () => setPhase((p) => (p === 'idle' ? 'amplify' : p === 'amplify' ? 'normalize' : 'done'));

    // רוחב הסגמנט לכל פעימה. idle: יחסי הציון הגולמי. amplify: יחסי ההסתברות
    // (ההגברה — אותו מיכל חלקי, אבל חלקו של המוביל גדל). normalize/done: מילוי מלא.
    const widthPctFor = (i: number): number => {
        if (phase === 'idle') return rawShare[i] * BEAT1_FILL * 100;
        if (phase === 'amplify') return probShare[i] * BEAT1_FILL * 100;
        return probShare[i] * 100; // normalize / done — Σ=100%
    };

    const normalized = phase === 'normalize' || phase === 'done';
    const animating = phase === 'amplify' || phase === 'normalize';
    const segTransition = reduce ? { duration: 0 } : { duration: DUR.data, ease: EASE.out };

    return (
        <div dir="rtl">
            <LayerHead
                icon={<Sigma size={16} />}
                he="מכונת ה-Softmax"
                en="Softmax"
                accent="purple"
                badge={<span className="rounded-full border border-purple-500/40 bg-purple-900/15 px-2.5 py-1 font-mono text-[10px] font-bold text-purple-300" dir="ltr">T = {temperature}</span>}
            />

            <LayerIntro>
                כאן נכנסת מכונת ה-Softmax. היא לוקחת את הציונים הגולמיים והופכת אותם להתפלגות הסתברויות שמסתכמת ל-100 אחוז. הרעיון החשוב אינו הנוסחה אלא התחרות שהיא יוצרת: כשאפשרות אחת עולה, האחרות חייבות לרדת, כי הכל יחד חייב להסתכם ל-100.
            </LayerIntro>

            {/* ── רגע ה-Softmax: הגברה ואז נרמול (האנימציה הלימודית) ── */}
            {hasInput && (
                <div className="mb-4 rounded-2xl border border-purple-500/25 bg-purple-950/10 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <BeatPill n={1} he="הגברה" en="Amplify" icon={<Zap size={11} />} active={phase === 'amplify'} done={normalized} />
                            <BeatPill n={2} he="נרמול" en="Normalize" icon={<Scale size={11} />} active={phase === 'normalize'} done={phase === 'done'} />
                        </div>
                        {!reduce && (
                            <div className="flex items-center gap-1.5">
                                {!auto && phase !== 'done' && (
                                    <button type="button" onClick={stepNext} className="inline-flex items-center gap-1 rounded-lg border border-purple-500/40 bg-purple-900/20 px-2 py-1 text-[11px] font-bold text-purple-200 transition-colors hover:bg-purple-900/35">
                                        <SkipForward size={12} /> שלב הבא
                                    </button>
                                )}
                                <button type="button" onClick={() => setAuto((x) => !x)} aria-pressed={!auto} className="inline-flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2 py-1 text-[11px] font-bold text-slate-300 transition-colors hover:border-slate-600">
                                    {auto ? <><Pause size={12} /> השהה</> : <><Play size={12} /> המשך</>}
                                </button>
                                <button type="button" onClick={replay} className="inline-flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2 py-1 text-[11px] font-bold text-slate-300 transition-colors hover:border-slate-600">
                                    <RotateCcw size={12} /> הרצה חוזרת
                                </button>
                            </div>
                        )}
                    </div>

                    {/* המיכל: קיבולת קבועה של 100%. בפעימה 1 הוא חלקי; בפעימה 2 הוא מתמלא. */}
                    <div className="relative h-9 w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/50" dir="ltr">
                        <div className="absolute inset-y-0 right-0 z-10 w-0.5 bg-emerald-400/50" title="100%" />
                        <div className="flex h-full w-full">
                            {items.map((it, i) => {
                                const a = ACCENTS[it.accent];
                                const isLeader = i === 0;
                                const p = pct(it.prob);
                                return (
                                    <motion.div
                                        key={it.id}
                                        animate={{ width: `${widthPctFor(i)}%` }}
                                        transition={segTransition}
                                        className={`relative h-full ${a.barFill} ${i > 0 ? 'border-l border-slate-950/50' : ''} ${isLeader && animating ? a.glow : ''}`}
                                        title={`${it.labelHe}: ${p}%`}
                                    >
                                        {normalized && p >= 8 && (
                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-950/90">{p}%</span>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-slate-400">
                            {phase === 'idle' && 'ציונים גולמיים — לא בטווח 0–100% ולא מסתכמים ל-100%'}
                            {phase === 'amplify' && 'exp(s/T): ההפרשים נמתחים — חלקו של המוביל גדל יותר'}
                            {phase === 'normalize' && 'נשפך למיכל ה-100% — כשהמוביל לוקח יותר, האחרים נדחקים'}
                            {phase === 'done' && 'נחת על ההסתברויות של המנוע'}
                        </span>
                        <span className={`shrink-0 rounded-md px-2 py-0.5 font-mono font-bold ${normalized ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`} dir="ltr">
                            {normalized ? 'Σ = 100%' : 'Σ < 100%'}
                        </span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3" dir="ltr">
                {/* כניסה: ציונים */}
                <div className="space-y-1.5">
                    <div className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-500">Raw scores in</div>
                    {items.map((it) => (
                        <div key={it.id} className="rounded-md border border-slate-700/50 bg-slate-950/40 px-2 py-1 text-center font-mono text-xs text-slate-300">{f2(it.score)}</div>
                    ))}
                </div>

                {/* המכונה (ה-pulse המתמשך מעומעם בזמן ההפיכה — תנועה אחת בכל רגע) */}
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        animate={reduce || animating ? {} : { boxShadow: ['0 0 0 0 rgba(168,85,247,0.0)', '0 0 22px -2px rgba(168,85,247,0.55)', '0 0 0 0 rgba(168,85,247,0.0)'] }}
                        transition={reduce || animating ? { duration: 0 } : { duration: 2.2, repeat: Infinity }}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/50 bg-purple-900/20"
                    >
                        <Sigma size={26} className="text-purple-300" />
                    </motion.div>
                    <span className="font-mono text-[9px] text-slate-500">exp(s/T) / Σexp</span>
                </div>

                {/* יציאה: הסתברויות */}
                <div className="space-y-1.5">
                    <div className="text-center text-[9px] font-bold uppercase tracking-wider text-slate-500">Probabilities out</div>
                    {items.map((it) => {
                        const a = ACCENTS[it.accent];
                        return (
                            <div key={it.id} className={`rounded-md border px-2 py-1 text-center font-mono text-xs font-bold ${a.border} ${a.bgSoft} ${a.text}`}>{pct(it.prob)}%</div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px]">
                <span className="text-slate-500">סכום ההסתברויות:</span>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono font-bold text-emerald-300" dir="ltr">{items.reduce((s, it) => s + pct(it.prob), 0)}%</span>
            </div>

            {formulaView && (
                <div className="mt-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 font-mono text-[11px] text-slate-300" dir="ltr">
                    p_i = exp(score_i / T) / Σ_j exp(score_j / T)
                </div>
            )}
            <Takeaway>
                עכשיו אלה אחוזים, והם מתחרים זה בזה. סכום הכל הוא 100. זה בדיוק ההבדל בין ציון להסתברות.
            </Takeaway>
            <TryThis>
                שימו לב שכשעמודה אחת גדלה, האחרות מתכווצות. זה לא מקרי, זה בדיוק מה ש-Softmax עושה: מחלק 100 אחוז בין כל האפשרויות.
            </TryThis>
        </div>
    );
};

/* ── שכבה 5: Probabilities ────────────────────────────────────────────────── */

const ProbabilitiesLayer: React.FC<{ result: AnalysisResult; reduce: boolean }> = ({ result }) => {
    const leaderAccent = result.items[0]?.accent ?? 'cyan';
    const bars: IntentProbability[] = result.items.map((it) => ({ label: it.labelHe, value: pct(it.prob) }));
    return (
        <div dir="rtl">
            <LayerHead icon={<BarChart3 size={16} />} he="הסתברויות" en="Probabilities" accent="emerald" />
            <LayerIntro>
                זה היעד הסופי של כל השרשרת: ההתפלגות שעליה תתקבל ההחלטה. עברנו מווקטור, לדמיון, לציון גולמי, דרך Softmax, וכל זה כדי להגיע לעמודות שאתם רואים כאן.
            </LayerIntro>
            <ProbabilityBars items={bars} accent={leaderAccent} />
            <Takeaway>
                זו התוצאה הסופית, אבל היא נולדה משרשרת חישובים, לא מהשמיים.
            </Takeaway>
            <TryThis>
                שנו מילה אחת במשפט (או לחצו &quot;החלפת מילה&quot;) וצפו בכל השרשרת זזה בבת אחת, מהדמיון למעלה ועד האחוזים כאן למטה.
            </TryThis>
        </div>
    );
};

/* ── שכבה 6: Decision ─────────────────────────────────────────────────────── */

const DecisionLayer: React.FC<{ result: AnalysisResult; reduce: boolean }> = ({ result, reduce }) => {
    const conf = CONF_STYLE[result.confidence];
    const ca = ACCENTS[conf.accent];
    const top = result.items[0];
    const ta = ACCENTS[top?.accent ?? 'purple'];
    return (
        <div dir="rtl">
            <LayerHead icon={<Flag size={16} />} he="החלטה" en="Decision" accent="rose" />
            <LayerIntro>
                ורק עכשיו, אחרי שיש התפלגות הסתברויות, המנוע בוחר. ההחלטה אינה רק &quot;מי המוביל&quot;, אלא גם כמה הוא בולט מעל השני: פער גדול מאפשר לענות בביטחון, פער קטן מוביל לשאלת הבהרה במקום ניחוש.
            </LayerIntro>
            <div className={`rounded-xl border ${ta.border} ${ta.bgSoft} p-4`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className={ta.text} />
                        <div className="leading-tight">
                            <div className={`text-base font-black ${ta.text}`}>{result.decision.he}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">{result.decision.en}</div>
                        </div>
                    </div>
                    {top && (
                        <div className="text-left leading-tight" dir="ltr">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Leader</div>
                            <div className={`text-sm font-bold ${ta.text}`}>{pct(top.prob)}% {top.labelEn}</div>
                        </div>
                    )}
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">{result.decision.detail}</p>

                {/* מד ביטחון (תומך גם ב-Medium-low) */}
                <div className="mt-3 border-t border-slate-700/40 pt-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500"><Gauge size={12} /> Confidence</span>
                        <span className={`font-black ${ca.text}`}>{conf.he}<span className="ms-1.5 text-[11px] font-medium text-slate-500" dir="ltr">{result.confidence}</span></span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                            animate={{ width: `${conf.bar}%` }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
                            className={`h-full rounded-full ${ca.barGradient}`}
                        />
                    </div>
                    <div className="mt-1 flex justify-between font-mono text-[9px] text-slate-600">
                        <span>Low</span><span>Medium</span><span>High</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
