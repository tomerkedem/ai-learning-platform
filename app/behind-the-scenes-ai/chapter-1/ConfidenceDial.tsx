"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SlidersHorizontal, ShieldCheck, HelpCircle, ShieldAlert, Hand, Sparkles, MessageSquare, Target } from 'lucide-react';

import { DecisionCard } from '@/components/ai-internals/DecisionCard';
import { EngineMetricCard } from '@/components/ai-internals/EngineMetricCard';
import type { Accent, DecisionState, FlowMode } from '@/components/ai-internals/types';

import { runChatEngine, runAgentEngine } from './mockEngine';

interface ConfidenceDialProps {
    text: string;
    mode: FlowMode;
    accent: Accent;
}

// סף ברירת המחדל של המנוע הלימודי: confidenceFrom מסווג פער < 15% כביטחון נמוך,
// ואז ההחלטה היא "לבקש הבהרה". זהו גם הרף ההתחלתי שהלומד מתחיל ממנו.
const ENGINE_DEFAULT_THRESHOLD = 15;
const PRESETS = [15, 30, 50, 70];

const RANGE_HEX = '#22d3ee';

const clampPct = (v: number) => Math.max(0, Math.min(100, v));

// רמות סיכון -> רף מומלץ. מחבר בין גודל הפער (הסתברות) לבין כמה ביטחון נדרוש (אחריות).
interface Stake { key: string; he: string; sub: string; rec: number; note: string; }
const STAKES: Stake[] = [
    { key: 'low', he: 'סיכון נמוך', sub: 'שאלת מידע פשוטה', rec: 15, note: 'טעות כאן זולה. אפשר לדרוש ביטחון נמוך ולתת למנוע לענות לבד.' },
    { key: 'mid', he: 'סיכון בינוני', sub: 'מידע חלקי', rec: 35, note: 'כדאי רף בינוני. אם הפער שהמנוע חישב קטן ממנו, עדיף לעצור ולשאול.' },
    { key: 'high', he: 'סיכון גבוה', sub: 'פעולה שמשפיעה על לקוח', rec: 65, note: 'טעות כאן יקרה. דורשים ביטחון גבוה, ואם אין, עוצרים ומבקשים אישור.' },
];

// קלטים לדוגמה עם רמות ביטחון יורדות, כדי להרגיש איך אותו רף מכריע אחרת לפי הקלט.
const SAMPLES = [
    { he: 'החבילה לא הגיעה', tag: 'קלט ברור' },
    { he: 'איפה ההזמנה, היא לא מופיעה במערכת', tag: 'קלט מעורב' },
    { he: 'איפה התשלום שלי', tag: 'קלט מעורפל' },
];

/**
 * "חוגת הביטחון": סף גריר על הפער שהמנוע חישב. מתחת לסף ההחלטה היא "לבקש הבהרה",
 * מעליו "לענות". אותו קלט מתהפך בין ענה/שאל בלי לשנות אף מספר שהמנוע הפיק -
 * הפער מחושב מתוך ההסתברויות האמיתיות, והסף הוא מדיניות שהלומד שולט בה.
 */
export const ConfidenceDial: React.FC<ConfidenceDialProps> = ({ text, mode }) => {
    const reduce = useReducedMotion();
    const isChat = mode === 'chat';

    if (!isChat) {
        return <AgentGatePanel text={text} />;
    }

    return <ChatConfidenceDial text={text} reduce={!!reduce} />;
};

/* ── מצב Chat: מעבדת מדיניות על הפער ─────────────────────────────────────────── */

const ChatConfidenceDial: React.FC<{ text: string; reduce: boolean }> = ({ text, reduce }) => {
    // הלומד יכול לבחון את ההודעה שלו או קלטים לדוגמה עם רמות ביטחון שונות.
    const [sampleText, setSampleText] = useState<string | null>(null);
    const activeText = sampleText ?? text;

    const result = runChatEngine(activeText);
    const top = result.intents[0];
    const second = result.intents[1];
    // הפער בין שתי האפשרויות המובילות = "הביטחון" של המנוע. לא מספר חדש.
    const margin = Math.max(0, (top?.value ?? 0) - (second?.value ?? 0));

    const [threshold, setThreshold] = useState(ENGINE_DEFAULT_THRESHOLD);
    const [stake, setStake] = useState<string | null>(null);
    const passes = margin >= threshold;

    const decision: DecisionState = passes
        ? { kind: 'answer', label: 'Generate response' }
        : { kind: 'ask', label: 'Ask for more context' };

    // הבזק קצר כשההחלטה מתהפכת - כדי שהרגע יורגש.
    const [flash, setFlash] = useState(false);
    const prevPasses = useRef(passes);
    useEffect(() => {
        if (prevPasses.current === passes) return;
        prevPasses.current = passes;
        if (reduce) return;
        // setState ב-setTimeout (לא סינכרוני בגוף ה-effect) לכבוד ה-lint.
        const on = setTimeout(() => setFlash(true), 0);
        const off = setTimeout(() => setFlash(false), 900);
        return () => { clearTimeout(on); clearTimeout(off); };
    }, [passes, reduce]);

    const trackRef = useRef<HTMLDivElement>(null);
    const setFromClientX = (clientX: number) => {
        const el = trackRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const pct = Math.round(((clientX - r.left) / r.width) * 100);
        setThreshold(clampPct(pct));
        setStake(null);
    };

    const shown = activeText.length > 42 ? activeText.slice(0, 42) + '...' : activeText;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            {/* כותרת */}
            <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-cyan-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">חוגת הביטחון</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Confidence Dial</div>
                </div>
            </div>

            {/* הסיפור: על מה מדובר */}
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
                לפני שהמנוע עונה, הוא מתלבט בין כמה פירושים לאותו משפט. <span className="font-bold text-white">הפער</span> בין
                הפירוש המוביל לשני הוא מידת הביטחון שלו. השאלה שלכם: <span className="font-bold text-cyan-300">כמה ביטחון לדרוש</span> לפני
                שנותנים לו לענות לבד, ומתי עדיף שיעצור וישאל.
            </p>

            {/* שתי האפשרויות המתחרות + הפער ביניהן */}
            <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
                <div className="rounded-xl border border-cyan-500/40 bg-cyan-900/15 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">הפירוש המוביל</div>
                    <div className="mt-1 truncate text-sm font-bold text-slate-100" title={top?.label}>{top?.label}</div>
                    <div className="font-mono text-2xl font-black text-cyan-300">{top?.value ?? 0}%</div>
                </div>
                <div className="flex flex-col items-center justify-center px-1">
                    <div className="text-[10px] text-slate-500">פער</div>
                    <div className="font-mono text-xl font-black text-white">{margin}%</div>
                </div>
                <div className="rounded-xl border border-slate-600/40 bg-slate-800/40 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">המתחרה</div>
                    <div className="mt-1 truncate text-sm font-bold text-slate-200" title={second?.label}>{second?.label}</div>
                    <div className="font-mono text-2xl font-black text-slate-300">{second?.value ?? 0}%</div>
                </div>
            </div>

            {/* קלטים לדוגמה */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500"><MessageSquare size={12} /> נסו קלט:</span>
                <button
                    type="button"
                    onClick={() => setSampleText(null)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors ${sampleText === null ? 'border-cyan-500/50 bg-cyan-900/25 text-cyan-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                >
                    ההודעה שלכם
                </button>
                {SAMPLES.map((s) => (
                    <button
                        key={s.he}
                        type="button"
                        onClick={() => setSampleText(s.he)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors ${sampleText === s.he ? 'border-cyan-500/50 bg-cyan-900/25 text-cyan-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                    >
                        {s.tag}
                    </button>
                ))}
            </div>
            <div className="mb-4 truncate text-xs text-slate-500">מנתח: &quot;{shown}&quot;</div>

            {/* הציר: ביטחון המנוע מול הרף */}
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
                <span className="text-amber-300">עצור ושאל</span>
                <span className="text-slate-400">גררו את הרף לאורך הציר</span>
                <span className="text-emerald-300">ענה לבד</span>
            </div>
            <div
                ref={trackRef}
                dir="ltr"
                onPointerDown={(e) => setFromClientX(e.clientX)}
                onPointerMove={(e) => { if (e.buttons === 1) setFromClientX(e.clientX); }}
                className="relative h-20 w-full cursor-pointer select-none touch-none overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/60"
            >
                {/* אזור "עצור ושאל" (משמאל לרף) */}
                <motion.div
                    animate={{ width: `${clampPct(threshold)}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 26 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500/30 to-amber-500/5"
                />
                {/* אזור "ענה לבד" (מימין לרף) */}
                <motion.div
                    animate={{ left: `${clampPct(threshold)}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 26 }}
                    className="absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-500/30 to-emerald-500/5"
                />

                {/* אורב: הביטחון של המנוע (יושב על הפער) */}
                <motion.div
                    animate={{ left: `${clampPct(margin)}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
                    className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                >
                    <div className="flex flex-col items-center">
                        <div className="mb-1 whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-200">המנוע {margin}%</div>
                        <div className={`relative h-6 w-6 rounded-full border-2 ${passes ? 'border-emerald-100 bg-emerald-400' : 'border-amber-100 bg-amber-400'}`}>
                            {!reduce && <span className={`absolute inset-0 animate-ping rounded-full ${passes ? 'bg-emerald-400' : 'bg-amber-400'} opacity-60`} />}
                        </div>
                    </div>
                </motion.div>

                {/* הרף שאתם קובעים */}
                <motion.div
                    animate={{ left: `${clampPct(threshold)}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 24 }}
                    className="absolute inset-y-0 z-30 w-0.5 -translate-x-1/2 bg-cyan-100"
                >
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-cyan-500/25 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-100">
                        רף {threshold}%
                    </span>
                </motion.div>
            </div>

            {/* סליידר נגיש + presets */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={threshold}
                    onChange={(e) => { setThreshold(Number(e.target.value)); setStake(null); }}
                    aria-label="סף הביטחון הנדרש"
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700"
                    style={{ accentColor: RANGE_HEX }}
                />
                <div className="flex items-center gap-1">
                    {PRESETS.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => { setThreshold(p); setStake(null); }}
                            className={`rounded-md border px-2 py-1 font-mono text-xs font-bold transition-colors ${threshold === p && !stake ? 'border-cyan-500/50 bg-cyan-900/25 text-cyan-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                        >
                            {p}%
                        </button>
                    ))}
                </div>
            </div>

            {/* רמת סיכון -> מדיניות מומלצת (חיבור בין הסתברות לאחריות) */}
            <div className="mt-5 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Target size={13} className="text-cyan-300" /> מה הסיכון אם המנוע יטעה כאן?
                </div>
                <div className="flex flex-wrap gap-2">
                    {STAKES.map((s) => (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => { setStake(s.key); setThreshold(s.rec); }}
                            className={`flex-1 rounded-lg border px-3 py-2 text-right transition-colors ${stake === s.key ? 'border-cyan-500/50 bg-cyan-900/20' : 'border-slate-700/60 bg-slate-800/30 hover:border-slate-600'}`}
                        >
                            <div className="text-sm font-bold text-slate-100">{s.he}</div>
                            <div className="text-[11px] text-slate-400">{s.sub}</div>
                            <div className="mt-1 font-mono text-[11px] text-cyan-300">רף מומלץ {s.rec}%</div>
                        </button>
                    ))}
                </div>
                {stake && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        {STAKES.find((s) => s.key === stake)?.note}
                    </p>
                )}
            </div>

            {/* ההחלטה הנגזרת */}
            <div className={`mt-5 rounded-2xl transition-shadow ${flash ? 'ring-2 ring-white/50' : ''}`} role="status" aria-live="polite">
                <DecisionCard decision={decision} />
            </div>

            {/* פידבק מגיב */}
            <div className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed ${passes ? 'border-emerald-500/40 bg-emerald-900/15 text-emerald-100' : 'border-amber-500/40 bg-amber-900/15 text-amber-100'}`}>
                {passes
                    ? <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-300" />
                    : <Hand size={15} className="mt-0.5 shrink-0 text-amber-300" />}
                <span>
                    {passes
                        ? <>הביטחון של המנוע (פער {margin}%) <span className="font-bold">גבוה מהרף</span> שהצבתם ({threshold}%). הוא יענה לבד.</>
                        : <>הרף שהצבתם ({threshold}%) <span className="font-bold">גבוה מהביטחון</span> של המנוע (פער {margin}%). הצעד האחראי: לעצור ולשאול.</>}
                </span>
            </div>

            {/* רמז + יושרה */}
            <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                <Sparkles size={14} className="mt-0.5 shrink-0 text-cyan-400" />
                <span>
                    גררו את הרף עד שהוא חוצה את האורב של המנוע - בדיוק שם ההחלטה מתהפכת. שום מספר שהמנוע הפיק לא השתנה, רק
                    <span className="font-bold text-slate-300"> המדיניות שאתם בוחרים</span>. כך הסתברות הופכת לאחריות.
                </span>
            </div>
        </div>
    );
};

/* ── מצב Agent: השער מבוסס-סיכון, לא פער ───────────────────────────────────── */

const AgentGatePanel: React.FC<{ text: string }> = ({ text }) => {
    const result = runAgentEngine(text);
    const canAct = result.canActNow;

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                {canAct ? <ShieldCheck size={16} className="text-purple-300" /> : <ShieldAlert size={16} className="text-amber-300" />}
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">שער ההחלטה ב-Agent</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Agent decision gate</div>
                </div>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-slate-400">
                ב-Agent השער לא נשען על פער בין הסתברויות אלא על <span className="font-bold text-purple-300">סיכון ומידע חסר</span>:
                האם המשימה ברורה, האם חסר מזהה, והאם הפעולה רגישה. לכן כאן אין חוגת-פער - ההחלטה נקבעת מהגורמים שלמטה.
            </p>

            <div className="grid gap-4 md:grid-cols-2 md:items-start">
                <div className="space-y-4">
                    <EngineMetricCard label="Task detected" value={result.task} tone="purple" />
                    <EngineMetricCard
                        label="Missing information"
                        value={result.missingInfo}
                        tone={result.missingInfo === 'None' ? 'emerald' : 'amber'}
                    />
                    <EngineMetricCard
                        label="Action readiness"
                        value={canAct ? 'Can act now: Yes' : 'Can act now: No'}
                        hint={`Risk: ${result.risk}`}
                        tone={canAct ? 'emerald' : 'rose'}
                    />
                </div>
                <div role="status" aria-live="polite">
                    <DecisionCard decision={result.decision} />
                </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-xs leading-relaxed text-slate-500">
                <HelpCircle size={14} className="mt-0.5 shrink-0" />
                <span>
                    החליפו ל-<span className="font-bold text-cyan-300">Chat</span> כדי לגרור את חוגת הביטחון על הפער. ב-Agent
                    העצירה לאישור אינה כשל - היא בקרה אחראית לפני פעולה שמשפיעה על לקוח.
                </span>
            </div>
        </div>
    );
};
