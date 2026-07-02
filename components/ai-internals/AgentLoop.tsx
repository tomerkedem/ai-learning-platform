"use client";

// components/ai-internals/AgentLoop.tsx
//
// "Living Engine" v4 (אב-טיפוס ויזואלי בטוח, DOM/SVG/CSS בלבד):
// שתי סצנות פרימיום שוות-מעמד סביב אותה ליבת-LLM. הליבה (EngineCore) זהה בגודל
// ובמיקום בשני המצבים, כדי שתורגש כמנוע אחד שסביבו מתחלף עולם:
//
//   Chat  - עולם תכלת: מסילת-זכוכית אופקית שעוברת ישר דרך הליבה (ChatStraightPath).
//           מינימלי ומרוּוח. רצועת העולם/סטטוס קיימת אך נעולה ומעומעמת. המסר בסיום:
//           השיחה השתנתה, העולם שבחוץ לא.
//   Agent - עולם סגול: אותה ליבה, אותו גודל, אותו מיקום, מוקפת בטבעות חדר-בקרה
//           (AgentControlRoom) עם 6 תחנות. רצועת העולם/סטטוס פעילה, מתקדמת בין
//           התחנות בזמן הרצה, ובסיום/אישור מציגה שינוי-עולם מתמשך.
//
// ארכיטקטורה: AgentLoop הוא המנצח (state, מתג, הרצה, פולס, תחנות); רכיבי-העזר
// הפנימיים הם חלקי-הסצנה. שכבת ה-canvas הריקה (aria-hidden) שמורה לשלב עתידי של
// מנוע חלקיקים, בלי תלות חדשה וללא ריסטור טקסט-לחלקיקים כרגע.
//
// נגישות: התחנות ומתג המצב הם כפתורים אמיתיים (aria-pressed), עם תווית מלאה,
// תמיכת מקלדת וטבעת פוקוס. קישוטים aria-hidden. הכיתוב החי הוא aria-live יחיד.
//
// reduced-motion: מבטל תנועות רציפות (טבעות מסתובבות, פולס, parallax, פעימות,
// סריקת-אור), ומשאיר רק החלפות-מצב עדינות. כל הטקסט מגיע מבחוץ (מוכן ל-i18n).

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Cpu, Keyboard, Sparkles, Target, Wrench, ShieldCheck, Zap, MessageSquare, Lock,
} from 'lucide-react';
import type { AgentDemo } from '@/app/behind-the-scenes-ai/introduction/introContent';
import type { Direction } from '@/i18n/config';
import { GuessButton } from './GuessButton';

const STAGE_ICON: Record<string, React.ReactNode> = {
    task: <Target size={18} />,
    tool: <Wrench size={18} />,
    risk: <ShieldCheck size={18} />,
    act: <Zap size={18} />,
    answer: <MessageSquare size={18} />,
    in: <Keyboard size={18} />,
    out: <Sparkles size={18} />,
};

const ORBIT_R = 38; // אחוז רדיוס - טבעת התחנות במצב Agent

type Mode = 'agent' | 'chat';
type Stage = AgentDemo['agentStages'][number];
type Positioned = Stage & { x: number; y: number };

/* ═══════════════════════ רכיבי-סצנה פנימיים ═══════════════════════ */

// ── EngineCore: הליבה המשותפת. זהה בגודל ובמיקום בשני המצבים (רציפות ויזואלית).
//    הצבע הניטרלי-תכלת נשמר גם ב-Agent; מה שמתחלף הוא העולם *סביב* הליבה, לא היא. ──
const EngineCore: React.FC<{ coreLabel: string; coreText: string; reduce: boolean }> = ({
    coreLabel, coreText, reduce,
}) => (
    <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(34,211,238,0.5),inset_0_0_28px_-12px_rgba(34,211,238,0.5)]">
        {/* פעימת-נשימה עדינה: שכבת זוהר פנימית שנושמת, בלי להזיז את הטקסט */}
        {reduce ? (
            <div className="pointer-events-none absolute inset-3 rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 blur-md" aria-hidden />
        ) : (
            <motion.div
                className="pointer-events-none absolute inset-3 rounded-full bg-gradient-to-br from-cyan-400/15 to-purple-400/15 blur-md"
                aria-hidden
                animate={{ opacity: [0.55, 1, 0.55], scale: [0.94, 1.04, 0.94] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            />
        )}
        <div className="relative mb-1 inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-slate-950/60 px-2 py-0.5">
            <Cpu size={11} className="text-cyan-300" aria-hidden />
            <span className="font-mono text-[10px] font-bold text-cyan-200" dir="ltr">{coreLabel}</span>
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
);

// ── ChatStraightPath: עולם התכלת. נתיב-זכוכית אופקי (lane) עם מסילה שעוברת ישר
//    דרך הליבה. סריקת-אור זורמת רק בזמן הרצה (טקסט "זורם" במסלול), לפי כיוון הקריאה. ──
const ChatStraightPath: React.FC<{ reduce: boolean; running: boolean; isRtl: boolean }> = ({
    reduce, running, isRtl,
}) => (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* מסדרון-הזכוכית: לוח אופקי רחב שממלא את הסצנה ונותן לה גוף (מרוּוח אך לא ריק) */}
        <div className="absolute inset-x-[6%] inset-y-[16%] rounded-[2.25rem] border border-cyan-500/25 bg-cyan-500/[0.04] shadow-[inset_0_1px_0_0_rgba(34,211,238,0.15)]" />
        <div className="absolute inset-x-[6%] inset-y-[16%] rounded-[2.25rem] bg-gradient-to-b from-cyan-400/[0.06] via-transparent to-cyan-500/[0.03]" />
        {/* הילה רכה סביב הליבה: עומק וכובד-מרכז לעולם התכלת, במקום ריק */}
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.07] blur-2xl" />
        {/* המסילה: קו דק שמחבר קלט->ליבה->תשובה */}
        <div className="absolute inset-x-[15%] top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500/10 via-cyan-400/50 to-cyan-500/10">
            {running && !reduce && (
                <motion.div
                    className="absolute top-0 h-full w-1/4 rounded-full bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent"
                    animate={{ left: isRtl ? ['100%', '-25%'] : ['-25%', '100%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                />
            )}
        </div>
    </div>
);

// ── AgentControlRoom: עולם הסגול. טבעות חדר-בקרה סביב הליבה. הטבעת המקווקוות
//    עוברת בדיוק דרך מרכזי התחנות (inset 12% = רדיוס 38%). ──
const AgentControlRoom: React.FC<{ reduce: boolean }> = ({ reduce }) => (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-[12%] rounded-full border border-dashed border-purple-400/30" />
        <div className="absolute inset-[12%] rounded-full bg-purple-500/[0.04]" />
        {!reduce ? (
            <>
                <motion.div
                    className="absolute inset-[4%] rounded-full"
                    style={{
                        background: 'conic-gradient(from 0deg, rgba(168,85,247,0), rgba(168,85,247,0.4), rgba(34,211,238,0.25), rgba(168,85,247,0))',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
                />
                {/* טבעת פנימית נגדית, דקה מאוד - עומק של חדר בקרה */}
                <motion.div
                    className="absolute inset-[22%] rounded-full"
                    style={{
                        background: 'conic-gradient(from 180deg, rgba(34,211,238,0), rgba(34,211,238,0.22), rgba(168,85,247,0))',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1px), #000 calc(100% - 1px))',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 1px), #000 calc(100% - 1px))',
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                />
            </>
        ) : (
            <div className="absolute inset-[4%] rounded-full border border-purple-400/20" />
        )}
    </div>
);

// ── WorldStatusStrip: מצב העולם/המערכת מתחת לבמה. משתמש רק במחרוזות קיימות.
//    Chat  - נעול ומעומעם: תשובה שנשארת בתוך השיחה, בלי שינוי בעולם.
//    Agent - ממתין בזמן הרצה, ובסיום עובר לשינוי-עולם מתמשך (ירוק, אישור/פעולה). ──
const WorldStatusStrip: React.FC<{
    mode: Mode; completed: boolean; reduce: boolean;
    label: string; chatValue: string; agentValue: string; pendingValue: string;
}> = ({ mode, completed, reduce, label, chatValue, agentValue, pendingValue }) => {
    const changed = mode === 'agent' && completed;
    const value = mode === 'chat' ? chatValue : changed ? agentValue : pendingValue;

    const box = mode === 'chat'
        ? 'border-slate-700/50 bg-slate-950/40'
        : changed
            ? 'border-emerald-500/40 bg-emerald-900/15'
            : 'border-purple-500/30 bg-purple-900/12';
    const labelTone = mode === 'chat'
        ? 'text-slate-500'
        : changed ? 'text-emerald-300/80' : 'text-purple-300/80';
    const valueTone = changed ? 'text-slate-100' : 'text-slate-400';

    return (
        <div className={`mx-auto mt-3 flex max-w-md items-center gap-2.5 rounded-xl border px-3 py-2 text-start transition-colors ${box}`}>
            {mode === 'chat' ? (
                <Lock size={15} className="shrink-0 text-slate-500" aria-hidden />
            ) : changed ? (
                <ShieldCheck size={16} className="shrink-0 text-emerald-300" aria-hidden />
            ) : (
                <span className="relative flex h-3 w-3 shrink-0 items-center justify-center" aria-hidden>
                    {!reduce && <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400/70 animate-ping" />}
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
                </span>
            )}
            <div className="min-w-0 flex-1">
                <div className={`text-[10px] font-bold ${labelTone}`}>{label}</div>
                <div className={`truncate text-xs leading-snug ${valueTone}`}>{value}</div>
            </div>
            {/* נורית-עולם: אפור=נעול, סגול=ממתין, ירוק=השתנה (מתמשך) */}
            <span
                aria-hidden
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${mode === 'chat' ? 'bg-slate-600' : changed ? 'bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]' : 'bg-purple-400/60'}`}
            />
        </div>
    );
};

// ── LiveStatusSlot: תיבת הנרטיב הנושמת. מצב יחיד של aria-live לכל הכרטיס.
//    idle: רמז שקט · running/hover: הסבר התחנה הפעילה · completed: הפאנץ' (closing+note). ──
const LiveStatusSlot: React.FC<{
    reduce: boolean; showClosing: boolean; activeStage: Stage | null;
    closing?: string; note?: string; hintPrompt: string;
}> = ({ reduce, showClosing, activeStage, closing, note, hintPrompt }) => (
    <div
        role="status"
        aria-live="polite"
        className={`mx-auto mt-3 flex min-h-[2.75rem] max-w-md flex-col items-center justify-center rounded-xl border px-4 py-2.5 text-center text-sm leading-relaxed transition-colors ${showClosing ? 'border-indigo-500/30 bg-indigo-900/15 text-slate-200' : 'border-purple-500/20 bg-purple-900/10 text-slate-300'}`}
    >
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={showClosing ? 'done' : activeStage ? `stage-${activeStage.id}` : 'idle'}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={reduce ? { duration: 0 } : { duration: 0.28 }}
            >
                {showClosing ? (
                    <>
                        <p className="font-bold text-indigo-100">{closing}</p>
                        {note && <p className="mt-1 text-xs leading-snug text-slate-400">{note}</p>}
                    </>
                ) : activeStage ? (
                    <span><span className="font-bold text-purple-200">{activeStage.label}: </span>{activeStage.hint}</span>
                ) : (
                    <span className="text-slate-400">{hintPrompt}</span>
                )}
            </motion.div>
        </AnimatePresence>
    </div>
);

/* ═══════════════════════ המנצח: AgentLoop ═══════════════════════ */

export const AgentLoop: React.FC<{
    reduce: boolean;
    demo: AgentDemo;
    /** כיוון הכתיבה הפעיל. נקבע בעמוד מ-useT, לא מקובע ב-rtl. */
    dir: Direction;
    mode?: Mode;
    onModeChange?: (m: Mode) => void;
    /** הפאנץ' שנוחת ב-slot החי במצב סיום. מגיע מהכרטיס לפי המצב הפעיל (page). */
    closing?: string;
    /** הערת דיוק קטנה שנלווית ל-closing, באותו slot. */
    note?: string;
}> = ({ reduce, demo, dir, mode: modeProp, onModeChange, closing, note }) => {
    const isRtl = dir === 'rtl';
    // המתג יכול להיות נשלט מבחוץ (כדי שהקופי שמסביב יתחלף יחד איתו) או פנימי.
    const [modeInternal, setModeInternal] = useState<Mode>('chat');
    const mode = modeProp ?? modeInternal;
    const [step, setStep] = useState(-1);
    const [running, setRunning] = useState(false);
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    // מזהה הרצה: עולה בכל הרצה, כדי לאפס את פולס-ההחלטה אל תחנת ההתחלה (קלט)
    // במקום שימשיך מהמיקום הקודם (התשובה) ויסחף אחורה.
    const [runId, setRunId] = useState(0);
    // שכבת-חלקיקים עתידית: נקודת-עיגון בלבד (aria-hidden, ריקה) לשלב ה-Canvas.
    const particleLayerRef = useRef<HTMLCanvasElement>(null);

    const stages = mode === 'agent' ? demo.agentStages : demo.chatStages;

    // הרצת הסבב: קידום שלב-אחרי-שלב, עד התחנה האחרונה.
    useEffect(() => {
        if (!running) return;
        if (step >= stages.length - 1) {
            const t = setTimeout(() => setRunning(false), 800);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setStep((s) => s + 1), reduce ? 1000 : 1900);
        return () => clearTimeout(t);
    }, [running, step, stages.length, reduce]);

    const switchMode = (m: Mode) => {
        if (onModeChange) onModeChange(m); else setModeInternal(m);
        setStep(-1); setRunning(false); setHoverId(null);
    };
    const run = () => { setStep(0); setRunning(true); setRunId((n) => n + 1); };

    const activeId = hoverId ?? (step >= 0 ? stages[step].id : null);
    const activeStage = stages.find((s) => s.id === activeId) ?? null;
    const coreText = activeStage ? activeStage.label : demo.idleCore;
    const completed = step >= 0 && step === stages.length - 1;
    // הפאנץ' נוחת רק כשהסבב הסתיים ואיננו מרחפים מעל תחנה (ריחוף = חזרה לחקירה).
    const showClosing = completed && hoverId == null && !!closing;

    // תחנות שמסביב לליבה. ב-Chat הליבה היא שלב "מודל", ולכן היא לא תחנה על המסילה.
    const orbit = mode === 'agent' ? demo.agentStages : demo.chatStages.filter((s) => s.id !== 'model');
    const positioned: Positioned[] = orbit.map((s, i) => {
        if (mode === 'agent') {
            // כיוון זוויתי תלוי-קריאה: LTR עם כיוון השעון, RTL נגדו, כך שהתחנה השנייה
            // מתקדמת לכיוון הקריאה במקום מראה עיוור של הבמה.
            const sign = isRtl ? -1 : 1;
            const ang = ((-90 + sign * i * (360 / orbit.length)) * Math.PI) / 180;
            return { ...s, x: 50 + ORBIT_R * Math.cos(ang), y: 50 + ORBIT_R * Math.sin(ang) };
        }
        // Chat: קלט בקצה תחילת-הקריאה, תשובה בקצה סופה (תלוי-כיוון, לא מראה עיוור).
        const startX = isRtl ? 84 : 16;
        const endX = isRtl ? 16 : 84;
        return { ...s, x: s.id === 'in' ? startX : endX, y: 50 };
    });
    const activeOrbit = positioned.find((n) => n.id === activeId);
    const activePos = activeOrbit ? { x: activeOrbit.x, y: activeOrbit.y } : activeId ? { x: 50, y: 50 } : null;

    // תחנת ההתחלה של הסבב (קלט בשני המצבים). הפולס מתחיל ממנה בכל הרצה.
    const firstOrbit = positioned.find((n) => n.id === stages[0]?.id);
    const firstPos = firstOrbit ? { x: firstOrbit.x, y: firstOrbit.y } : { x: 50, y: 50 };

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

    // צבעי הסצנה: תכלת ל-Chat, סגול ל-Agent. הליבה עצמה נשארת ניטרלית בשני המצבים.
    const isAgent = mode === 'agent';
    const stationActive = isAgent ? 'border-purple-300 bg-purple-500/30 text-white' : 'border-cyan-300 bg-cyan-500/30 text-white';
    const stationIdle = isAgent ? 'border-purple-500/40 bg-slate-900/80 text-purple-200' : 'border-cyan-500/40 bg-slate-900/80 text-cyan-200';
    const stationRing = isAgent ? 'focus-visible:ring-purple-400/60' : 'focus-visible:ring-cyan-400/60';
    const activeHalo = isAgent ? 'ring-purple-300/70' : 'ring-cyan-300/70';

    return (
        <div dir={dir}>
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
                <GuessButton
                    onClick={run}
                    disabled={running}
                    reduce={reduce}
                    rgb={isAgent ? '168,85,247' : '34,211,238'}
                    sheen
                    leadingIcon={<Play size={13} aria-hidden />}
                >
                    {running ? demo.running : completed ? demo.replay : demo.run}
                </GuessButton>
            </div>

            {/* תווית הסצנה (צבע לפי העולם) + הבקשה הנכנסת - שתי שורות דקות, בלי תיבות כבדות */}
            <div className="mb-3 flex flex-col items-center gap-1.5">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${isAgent ? 'border-purple-500/40 bg-purple-900/20 text-purple-200' : 'border-cyan-500/40 bg-cyan-900/20 text-cyan-200'}`}
                >
                    {isAgent ? demo.layerLabel : demo.layerLabelChat}
                </span>
                <span className="text-center text-sm">
                    <span className="text-[11px] font-bold text-cyan-300/80">{demo.input.label} </span>
                    <span className="text-slate-300">{demo.input.text}</span>
                </span>
            </div>

            {/* הבמה: ליבה משותפת + סצנה תלוית-מצב (מסילה / חדר-בקרה) + תחנות + פולס */}
            <div
                className="relative mx-auto aspect-square w-full max-w-[380px]"
                onMouseMove={onMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
                {/* שכבת-חלקיקים עתידית: ריקה, aria-hidden, לא מציירת דבר כרגע (עיגון ל-Canvas). */}
                <canvas ref={particleLayerRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />

                {/* הסצנה הויזואלית סביב הליבה, לפי המצב */}
                {isAgent
                    ? <AgentControlRoom reduce={reduce} />
                    : <ChatStraightPath reduce={reduce} running={running} isRtl={isRtl} />}

                {/* ליבת המודל: זהה בשני המצבים (גודל, מיקום, צבע), עם parallax עדין */}
                <div
                    className="absolute left-1/2 top-1/2 z-10"
                    style={{ transform: `translate(-50%, -50%) translate(${tilt.x}px, ${tilt.y}px)` }}
                >
                    <EngineCore coreLabel={demo.coreLabel} coreText={coreText} reduce={reduce} />
                </div>

                {/* פולס ההחלטה: נקודה זוהרת שעוברת אל התחנה/הליבה הפעילה */}
                {!reduce && activePos && (
                    <motion.span
                        // key לפי הרצה: כל הרצה ממקמת מחדש את הפולס בתחנת הקלט (בלי סחיפה אחורה מהתשובה).
                        key={runId}
                        aria-hidden
                        className="pointer-events-none absolute z-30 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(34,211,238,0.7)]"
                        // הכדור 12px: היסט -6px ממרכז ה-(left,top), בתוספת אותו parallax כמו התחנות,
                        // כך שמרכזו נוחת בדיוק על מרכז האייקון של התחנה הפעילה.
                        style={{ x: -6 + tilt.x * 0.4, y: -6 + tilt.y * 0.4 }}
                        initial={{ left: `${firstPos.x}%`, top: `${firstPos.y}%` }}
                        animate={{ left: `${activePos.x}%`, top: `${activePos.y}%` }}
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                )}

                {/* תחנות המסלול (Agent: 6 סביב הטבעת · Chat: קלט/תשובה בקצות המסילה) */}
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
                                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors focus:outline-none focus-visible:ring-2 ${stationRing} ${isActive ? stationActive : stationIdle}`}
                            >
                                {isActive && !reduce && (
                                    <motion.span
                                        aria-hidden
                                        className={`absolute inset-0 rounded-2xl ring-2 ${activeHalo}`}
                                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}
                                <span className="relative">{STAGE_ICON[n.id]}</span>
                                <span className={`pointer-events-none absolute left-1/2 top-full mt-1 w-20 -translate-x-1/2 text-center text-[10px] font-bold leading-tight transition-colors ${isActive ? (isAgent ? 'text-purple-100' : 'text-cyan-100') : 'text-slate-300'}`}>
                                    {n.label}
                                </span>
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* רצועת העולם/סטטוס: Chat נעולה ומעומעמת · Agent פעילה ומשתנה בסיום */}
            <WorldStatusStrip
                mode={mode}
                completed={completed}
                reduce={reduce}
                label={demo.output.label}
                chatValue={demo.output.chat}
                agentValue={demo.output.agent}
                pendingValue={demo.consoleEmpty}
            />

            {/* ה-slot החי: תיבת נרטיב אחת שנושמת בין idle / תחנה פעילה / סיום */}
            <LiveStatusSlot
                reduce={reduce}
                showClosing={showClosing}
                activeStage={activeStage}
                closing={closing}
                note={note}
                hintPrompt={demo.hintPrompt}
            />

            {/* קריאת חדר-הבקרה (Agent בלבד): שורת החלטה קומפקטית שמתמלאת תוך כדי סבב */}
            {isAgent && (
                <div className="mx-auto mt-3 max-w-md">
                    <div className="mb-2 text-center text-[11px] font-black uppercase tracking-wide text-purple-300/80">{demo.consoleTitle}</div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {consoleRows.map((r) => (
                            <div
                                key={r.key}
                                className={`rounded-xl border px-2.5 py-1.5 text-start transition-colors ${r.value ? 'border-purple-500/30 bg-purple-900/15' : 'border-white/5 bg-slate-950/40'}`}
                            >
                                <div className="text-[10px] font-bold text-purple-300/80">{r.label}</div>
                                <div className={`text-xs leading-snug ${r.value ? 'text-slate-100' : 'text-slate-500'}`}>{r.value || demo.consoleEmpty}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
