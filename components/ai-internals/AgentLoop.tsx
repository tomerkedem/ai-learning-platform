"use client";

// components/ai-internals/AgentLoop.tsx
//
// "Agent Control Loop" חי: ליבת-זכוכית הולוגרפית במרכז (המודל) שמציגה טקסט דינמי
// לפי השלב הפעיל, מוקפת בטבעת איטית ובתחנות-מסלול עם אייקונים. אפשר להריץ סבב
// ולראות פולס-החלטה עובר בין התחנות, עם קונסולת החלטה שמתעדכנת בזמן אמת. מתג
// Chat/Agent ממחיש את ההבדל בין מסלול קצר (קלט->מודל->תשובה) לסבב מלא של חמישה
// שלבים. Agent מוצג כשכבת מערכת *סביב* המודל, לא כתחנה פנימית של ה-Transformer.
//
// נגישות: התחנות ומתג המצב הם כפתורים אמיתיים (aria-pressed), עם תווית מלאה,
// תמיכת מקלדת וטבעת פוקוס. קישוטים aria-hidden. הכיתוב החי הוא aria-live.
//
// reduced-motion: מבטל את התנועות הרציפות (טבעת מסתובבת, פולס, parallax, פעימות),
// ומשאיר רק החלפות-מצב עדינות. כל הטקסט מגיע מבחוץ (מוכן ל-i18n).

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Cpu, Keyboard, Sparkles, Target, Wrench, ShieldCheck, Zap, MessageSquare,
} from 'lucide-react';
import type { AgentDemo } from '@/app/behind-the-scenes-ai/introduction/introContent';

const STAGE_ICON: Record<string, React.ReactNode> = {
    task: <Target size={18} />,
    tool: <Wrench size={18} />,
    risk: <ShieldCheck size={18} />,
    act: <Zap size={18} />,
    answer: <MessageSquare size={18} />,
    in: <Keyboard size={18} />,
    out: <Sparkles size={18} />,
};

const ORBIT_R = 38; // אחוז רדיוס

type Mode = 'agent' | 'chat';

export const AgentLoop: React.FC<{ reduce: boolean; demo: AgentDemo }> = ({ reduce, demo }) => {
    const [mode, setMode] = useState<Mode>('agent');
    const [step, setStep] = useState(-1);
    const [running, setRunning] = useState(false);
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const stages = mode === 'agent' ? demo.agentStages : demo.chatStages;

    // הרצת הסבב: קידום שלב-אחרי-שלב, עד התחנה האחרונה.
    useEffect(() => {
        if (!running) return;
        if (step >= stages.length - 1) {
            const t = setTimeout(() => setRunning(false), 800);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setStep((s) => s + 1), reduce ? 650 : 1100);
        return () => clearTimeout(t);
    }, [running, step, stages.length, reduce]);

    const switchMode = (m: Mode) => { setMode(m); setStep(-1); setRunning(false); setHoverId(null); };
    const run = () => { setStep(0); setRunning(true); };

    const activeId = hoverId ?? (step >= 0 ? stages[step].id : null);
    const activeStage = stages.find((s) => s.id === activeId) ?? null;
    const coreText = activeStage ? activeStage.label : demo.idleCore;
    const completed = step >= 0 && step === stages.length - 1;

    // תחנות שמסביב לליבה (במצב Chat הליבה היא שלב "מודל").
    const orbit = mode === 'agent' ? demo.agentStages : demo.chatStages.filter((s) => s.id !== 'model');
    const positioned = orbit.map((s, i) => {
        if (mode === 'agent') {
            const ang = ((-90 + i * (360 / orbit.length)) * Math.PI) / 180;
            return { ...s, x: 50 + ORBIT_R * Math.cos(ang), y: 50 + ORBIT_R * Math.sin(ang) };
        }
        return { ...s, x: s.id === 'in' ? 88 : 12, y: 50 };
    });
    const activeOrbit = positioned.find((n) => n.id === activeId);
    const activePos = activeOrbit ? { x: activeOrbit.x, y: activeOrbit.y } : activeId ? { x: 50, y: 50 } : null;

    // קונסולת ההחלטה מצטברת לפי השלב שהגענו אליו (Agent בלבד).
    const cs = { intent: '', tool: '', risk: '', next: '' };
    if (mode === 'agent' && step >= 0) {
        for (let i = 0; i <= step; i++) {
            const s = demo.agentStages[i];
            cs.intent = s.intent ?? cs.intent;
            cs.tool = s.tool ?? cs.tool;
            cs.risk = s.risk ?? cs.risk;
            cs.next = s.next ?? cs.next;
        }
    }
    const consoleRows = [
        { key: 'intent', label: demo.consoleLabels.intent, value: cs.intent },
        { key: 'tool', label: demo.consoleLabels.tool, value: cs.tool },
        { key: 'risk', label: demo.consoleLabels.risk, value: cs.risk },
        { key: 'next', label: demo.consoleLabels.next, value: cs.next },
    ];

    const onMove = (e: React.MouseEvent) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        setTilt({ x: Math.max(-1, Math.min(1, dx)) * 6, y: Math.max(-1, Math.min(1, dy)) * 6 });
    };

    return (
        <div dir="rtl">
            {/* מתג מצב + הרצה */}
            <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex rounded-full border border-slate-700/60 bg-slate-950/50 p-1">
                    {(['chat', 'agent'] as const).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => switchMode(m)}
                            aria-pressed={mode === m}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${mode === m ? (m === 'agent' ? 'bg-purple-500 text-white' : 'bg-cyan-500 text-slate-950') : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            {m === 'agent' ? demo.modeAgent : demo.modeChat}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={run}
                    disabled={running}
                    className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/50 bg-purple-500/15 px-4 py-1.5 text-xs font-bold text-purple-100 transition-colors hover:bg-purple-500/25 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60"
                >
                    <Play size={13} aria-hidden /> {running ? demo.running : completed ? demo.replay : demo.run}
                </button>
            </div>

            {/* תווית השכבה */}
            <div className="mb-3 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-900/20 px-3 py-1 text-[11px] font-bold text-purple-200">
                    {demo.layerLabel}
                </span>
            </div>

            {/* בקשה נכנסת */}
            <div className="mx-auto mb-3 flex max-w-md items-center justify-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-900/10 px-3 py-2 text-center text-sm">
                <span className="text-[11px] font-bold text-cyan-300/80">{demo.input.label}</span>
                <span className="text-slate-200">{demo.input.text}</span>
            </div>

            {/* הבמה: ליבה + תחנות */}
            <div className="relative mx-auto aspect-square w-full max-w-[420px]" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
                {/* טבעת המסלול: עוברת בדיוק דרך מרכזי התחנות (inset 12% = רדיוס 38%) */}
                <div className="pointer-events-none absolute inset-[12%] rounded-full border border-dashed border-purple-400/30" aria-hidden />
                <div className="pointer-events-none absolute inset-[12%] rounded-full bg-purple-500/[0.04]" aria-hidden />

                {/* טבעת חיצונית איטית (Agent בלבד) */}
                {mode === 'agent' && !reduce && (
                    <motion.div
                        className="pointer-events-none absolute inset-[4%] rounded-full"
                        aria-hidden
                        style={{
                            background: 'conic-gradient(from 0deg, rgba(168,85,247,0), rgba(168,85,247,0.4), rgba(34,211,238,0.25), rgba(168,85,247,0))',
                            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    />
                )}

                {/* ליבת המודל (זכוכית הולוגרפית) */}
                <div
                    className="absolute left-1/2 top-1/2 z-10"
                    style={{ transform: `translate(-50%, -50%) translate(${tilt.x}px, ${tilt.y}px)` }}
                >
                    <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(34,211,238,0.5),inset_0_0_28px_-12px_rgba(34,211,238,0.5)]">
                        <div className="pointer-events-none absolute inset-3 rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 blur-md" aria-hidden />
                        <div className="relative mb-1 inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-slate-950/60 px-2 py-0.5">
                            <Cpu size={11} className="text-cyan-300" aria-hidden />
                            <span className="font-mono text-[10px] font-bold text-cyan-200" dir="ltr">{demo.coreLabel}</span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={coreText}
                                initial={reduce ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                                className="relative px-2 text-center text-sm font-black text-white"
                            >
                                {coreText}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                {/* פולס ההחלטה: נקודה זוהרת שעוברת אל התחנה הפעילה */}
                {!reduce && activePos && (
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute z-30 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(34,211,238,0.7)]"
                        // הכדור 12px: היסט -6px ממרכז ה-(left,top), בתוספת אותו parallax כמו התחנות,
                        // כך שמרכזו נוחת בדיוק על מרכז האייקון של התחנה הפעילה.
                        style={{ x: -6 + tilt.x * 0.4, y: -6 + tilt.y * 0.4 }}
                        initial={{ left: '50%', top: '50%' }}
                        animate={{ left: `${activePos.x}%`, top: `${activePos.y}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    />
                )}

                {/* תחנות המסלול */}
                {positioned.map((n) => {
                    const isActive = activeId === n.id;
                    return (
                        // עוטף-מיקום: ממקם את *מרכז האייקון* בדיוק על (x,y), עם parallax זהה לכדור.
                        <div
                            key={n.id}
                            className="absolute z-20"
                            style={{ left: `${n.x}%`, top: `${n.y}%`, transform: `translate(-50%, -50%) translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)` }}
                        >
                            <motion.button
                                type="button"
                                initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                                onMouseEnter={() => setHoverId(n.id)}
                                onMouseLeave={() => setHoverId((cur) => (cur === n.id ? null : cur))}
                                onFocus={() => setHoverId(n.id)}
                                onBlur={() => setHoverId((cur) => (cur === n.id ? null : cur))}
                                aria-pressed={isActive}
                                aria-label={`${n.label}: ${n.hint}`}
                                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 ${isActive ? 'border-purple-300 bg-purple-500/30 text-white' : 'border-purple-500/40 bg-slate-900/80 text-purple-200'}`}
                            >
                                {isActive && !reduce && (
                                    <motion.span
                                        aria-hidden
                                        className="absolute inset-0 rounded-2xl ring-2 ring-purple-300/70"
                                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}
                                <span className="relative">{STAGE_ICON[n.id]}</span>
                                <span className={`pointer-events-none absolute left-1/2 top-full mt-1 w-20 -translate-x-1/2 text-center text-[10px] font-bold leading-tight transition-colors ${isActive ? 'text-purple-100' : 'text-slate-300'}`}>
                                    {n.label}
                                </span>
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* התשובה (נכנסת בסיום הסבב) */}
            <div className={`mx-auto mt-3 flex max-w-md items-center justify-center gap-2 rounded-xl border px-3 py-2 text-center text-sm transition-colors ${completed ? 'border-indigo-500/40 bg-indigo-900/15' : 'border-white/5 bg-slate-950/40'}`}>
                <Sparkles size={13} className={completed ? 'text-indigo-300' : 'text-slate-600'} aria-hidden />
                <span className={`text-[11px] font-bold ${completed ? 'text-indigo-300/80' : 'text-slate-600'}`}>{demo.output.label}</span>
                <span className={completed ? 'text-slate-200' : 'text-slate-600'}>
                    {completed ? (mode === 'agent' ? demo.output.agent : demo.output.chat) : '...'}
                </span>
            </div>

            {/* כיתוב חי: הסבר התחנה הפעילה */}
            <div
                role="status"
                aria-live="polite"
                className="mx-auto mt-3 flex min-h-[2.75rem] max-w-md items-center justify-center rounded-xl border border-purple-500/20 bg-purple-900/10 px-4 py-2.5 text-center text-sm leading-relaxed text-slate-300"
            >
                {activeStage ? (
                    <span><span className="font-bold text-purple-200">{activeStage.label}: </span>{activeStage.hint}</span>
                ) : (
                    <span className="text-slate-400">{demo.hintPrompt}</span>
                )}
            </div>

            {/* קונסולת החלטה (Agent בלבד) */}
            {mode === 'agent' && (
                <div className="mx-auto mt-3 max-w-md">
                    <div className="mb-2 text-center text-[11px] font-black uppercase tracking-wide text-purple-300/80">{demo.consoleTitle}</div>
                    <div className="grid grid-cols-2 gap-2">
                        {consoleRows.map((r) => (
                            <div
                                key={r.key}
                                className={`rounded-xl border px-3 py-2 text-right transition-colors ${r.value ? 'border-purple-500/30 bg-purple-900/15' : 'border-white/5 bg-slate-950/40'}`}
                            >
                                <div className="text-[10px] font-bold text-purple-300/80">{r.label}</div>
                                <div className={`text-xs leading-snug ${r.value ? 'text-slate-100' : 'text-slate-500'}`}>{r.value || demo.consoleEmpty}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* רמז ההבדל בין המצבים */}
            <p className="mx-auto mt-3 max-w-md text-center text-xs text-purple-300/80">
                {mode === 'agent' ? demo.agentHint : demo.chatHint}
            </p>
        </div>
    );
};
