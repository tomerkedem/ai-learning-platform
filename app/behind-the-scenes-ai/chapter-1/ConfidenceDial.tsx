"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SlidersHorizontal, ShieldCheck, HelpCircle, Info, ShieldAlert } from 'lucide-react';

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
// ואז ההחלטה היא "לבקש הבהרה". מסמנים אותו כדי שהלומד יראה היכן המנוע עצמו עומד.
const ENGINE_DEFAULT_THRESHOLD = 15;
const PRESETS = [15, 30, 50, 70];

const RANGE_HEX = '#22d3ee';

/**
 * "חוגת הביטחון": סף גריר על הפער שהמנוע חישב. מתחת לסף ההחלטה היא "לבקש הבהרה",
 * מעליו "לענות". אותו קלט מתהפך בין ענה/שאל בלי לשנות אף מספר שהמנוע הפיק -
 * הפער מחושב מתוך ההסתברויות האמיתיות, והסף הוא מדיניות שהלומד שולט בה.
 */
export const ConfidenceDial: React.FC<ConfidenceDialProps> = ({ text, mode, accent }) => {
    const reduce = useReducedMotion();
    const isChat = mode === 'chat';

    if (!isChat) {
        return <AgentGatePanel text={text} />;
    }

    return <ChatConfidenceDial text={text} accent={accent} reduce={!!reduce} />;
};

/* ── מצב Chat: חוגת סף על הפער ─────────────────────────────────────────────── */

const ChatConfidenceDial: React.FC<{ text: string; accent: Accent; reduce: boolean }> = ({ text, reduce }) => {
    const result = runChatEngine(text);
    const top = result.intents[0];
    const second = result.intents[1];
    // הפער מחושב מההסתברויות שהמנוע הפיק - לא מספר חדש.
    const margin = Math.max(0, (top?.value ?? 0) - (second?.value ?? 0));

    const [threshold, setThreshold] = useState(ENGINE_DEFAULT_THRESHOLD);
    const passes = margin >= threshold;
    const atEngineDefault = threshold === ENGINE_DEFAULT_THRESHOLD;

    const decision: DecisionState = passes
        ? { kind: 'answer', label: 'Generate response' }
        : { kind: 'ask', label: 'Ask for more context' };

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
            <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-cyan-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">חוגת הביטחון</div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">Confidence Dial</div>
                </div>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-slate-400">
                המנוע חישב פער של <span className="font-bold text-cyan-300">{margin}%</span> בין האפשרות המובילה
                (<span className="text-slate-300">{top?.label}</span>) לשנייה. הסף שלמטה הוא <span className="font-bold text-slate-200">מדיניות שאתם קובעים</span>:
                גררו אותו וראו את אותו קלט בדיוק מתהפך בין ענה לבין שאל - בלי לשנות אף מספר שהמנוע הפיק.
            </p>

            {/* פס פער מול סף */}
            <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">פער מול סף</span>
                <span className="font-mono text-xs text-slate-400" dir="ltr">
                    margin {margin}% {passes ? '≥' : '<'} threshold {threshold}%
                </span>
            </div>

            <div dir="ltr" className="relative h-10 w-full rounded-lg border border-slate-700/50 bg-slate-800/60">
                {/* מילוי הפער */}
                <motion.div
                    animate={{ width: `${Math.max(0, Math.min(100, margin))}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
                    className={`absolute inset-y-0 left-0 rounded-lg ${passes ? 'bg-gradient-to-l from-emerald-400 to-teal-500' : 'bg-gradient-to-l from-amber-400 to-orange-500'}`}
                />
                {/* קו הסף */}
                <motion.div
                    animate={{ left: `${Math.max(0, Math.min(100, threshold))}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 24 }}
                    className="absolute -top-2 bottom-[-8px] z-10 w-0.5 bg-cyan-200"
                >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[11px] font-bold text-cyan-200">
                        {threshold}%
                    </span>
                </motion.div>
                {/* סמן ברירת המחדל של המנוע */}
                <div
                    className="absolute bottom-0 top-0 z-0 w-px bg-slate-500/50"
                    style={{ left: `${ENGINE_DEFAULT_THRESHOLD}%` }}
                    aria-hidden
                />
                <span className="absolute inset-y-0 left-2 flex items-center font-mono text-xs font-black text-slate-950/80">{margin}%</span>
            </div>

            {/* סליידר + presets */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    aria-label="סף הביטחון הנדרש"
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700"
                    style={{ accentColor: RANGE_HEX }}
                />
                <span className="font-mono text-xs text-slate-400" dir="ltr">threshold {threshold}%</span>
                <div className="flex items-center gap-1">
                    {PRESETS.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setThreshold(p)}
                            className={`rounded-md border px-2 py-1 font-mono text-xs font-bold transition-colors ${threshold === p ? 'border-cyan-500/50 bg-cyan-900/25 text-cyan-200' : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600'}`}
                        >
                            {p}%
                        </button>
                    ))}
                </div>
            </div>

            {/* ההחלטה הנגזרת */}
            <div className="mt-5" role="status" aria-live="polite">
                <DecisionCard decision={decision} />
            </div>

            {/* יושרה: הסבר על המספרים */}
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-xs leading-relaxed text-slate-500">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    {atEngineDefault ? (
                        <>אתם על <span className="font-bold text-slate-300">סף ברירת המחדל של המנוע ({ENGINE_DEFAULT_THRESHOLD}%)</span>: פער קטן ממנו מסומן כביטחון נמוך, ואז המנוע עוצר ושואל. זו בדיוק הלוגיקה שרצה מאחורי הקלעים.</>
                    ) : (
                        <>הזזתם את הסף מברירת המחדל של המנוע ({ENGINE_DEFAULT_THRESHOLD}%). הפער עצמו לא זז - רק המדיניות. <span className="font-bold text-slate-300">עצירה ובקשת הבהרה אינן שגיאה</span>, אלא הצעד הנכון כשהפער קטן מהסף שבחרתם.</>
                    )}
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
