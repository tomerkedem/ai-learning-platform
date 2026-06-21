"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, Info, Loader2, AlertTriangle, Bot } from 'lucide-react';

import { ModeToggle } from './ModeToggle';
import { LiveTypingInput } from './LiveTypingInput';
import { TokenStreamPanel } from './TokenStreamPanel';
import { MeaningVectorPanel } from './MeaningVectorPanel';
import { CandidateProbabilityPanel } from './CandidateProbabilityPanel';
import { NegationAlert } from './NegationAlert';
import { WordImpactFormula } from './WordImpactFormula';
import { ProbabilityMovementTrail } from './ProbabilityMovementTrail';
import { WordTimeline } from './WordTimeline';
import { AgentReasoningPanel } from './AgentReasoningPanel';
import { SendOutcomeCard } from './SendOutcomeCard';
import { ACCENTS } from './accents';

import {
    WORD_SCENARIOS,
    getScenario,
    defaultScenarioFor,
    activeStepIndex,
    type WordMode,
    type AgentReasoning,
    type TypingStep,
    type WordFinal,
} from '@/app/behind-the-scenes-ai/chapter-4/wordEngine';

/** האם יש תוכן ממשי בהיגיון ה-Agent (כדי לא להציג פאנל ריק). */
const agentHasContent = (r: AgentReasoning) =>
    !!(r.signalHe || r.goalHe || r.missingInfoHe || r.nextStepHe);

type LiveStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * WordEngineLab - מיכל מעבדת "כל מילה מזיזה את המנוע".
 * מחזיק את מצב ההקלדה (mode, scenario, text, sent) ומרכיב את כל הפאנלים.
 * המנוע עצמו דטרמיניסטי ומגיע מ-wordEngine; כאן רק תזמור ותצוגה.
 */
export const WordEngineLab: React.FC = () => {
    const reduce = useReducedMotion();

    const [mode, setMode] = useState<WordMode>('chat');
    const [scenarioId, setScenarioId] = useState<string>(defaultScenarioFor('chat').id);
    const [text, setText] = useState('');
    const [sent, setSent] = useState(false);
    const [autoTyping, setAutoTyping] = useState(false);

    // האם המנוע החי זמין (מוגדר ANTHROPIC_API_KEY בשרת). null = עדיין בודקים.
    // true = מצב חי (ניתוח אמיתי דרך Claude). false = מצב דמו (רק תרחישים מתוסרטים).
    const [liveEnabled, setLiveEnabled] = useState<boolean | null>(null);

    // מצב "חי": ניתוח אמיתי של טקסט חופשי דרך Claude (API route בצד שרת).
    const [liveStep, setLiveStep] = useState<TypingStep | null>(null);
    const [liveFinal, setLiveFinal] = useState<WordFinal | null>(null);
    const [liveStatus, setLiveStatus] = useState<LiveStatus>('idle');
    const [liveError, setLiveError] = useState<string | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const liveReqRef = useRef(0);

    const clearLive = () => {
        liveReqRef.current += 1; // מבטל תשובות באוויר
        setLiveStep(null);
        setLiveFinal(null);
        setLiveStatus('idle');
        setLiveError(null);
    };

    const scenario = useMemo(() => getScenario(scenarioId) ?? WORD_SCENARIOS[0], [scenarioId]);
    const a = ACCENTS[scenario.accent];

    const stepIndex = activeStepIndex(scenario, text);
    const step = stepIndex >= 0 ? scenario.steps[stepIndex] : null;
    const prevStep = stepIndex >= 1 ? scenario.steps[stepIndex - 1] : null;
    // Send נדלק ברגע שיש טקסט כלשהו (לא רק המשפט המתוסרט), כדי שהכפתור יהיה
    // לחיץ גם בהקלדה חופשית. הלחיצה נועלת את הכיוון הנוכחי כהחלטה סופית.
    const canSend = text.trim().length > 0 && !sent;
    const isFinal = sent;
    const temporary = !isFinal;

    // צבירת היגיון ה-Agent מכל השלבים עד הנוכחי (השדות מצטברים).
    const mergedAgent: AgentReasoning = useMemo(() => {
        if (scenario.mode !== 'agent' || stepIndex < 0) return {};
        return scenario.steps.slice(0, stepIndex + 1).reduce<AgentReasoning>((acc, s) => ({ ...acc, ...(s.agent ?? {}) }), {});
    }, [scenario, stepIndex]);

    // "חי" = הוקלד טקסט חופשי שלא תואם לאף ניסוי מתוסרט. אז המנוע האמיתי נכנס לפעולה.
    const isLive = stepIndex < 0 && text.trim().length > 0;

    // הערכים שמוזנים לפאנלים: מתוסרט מהטבלה, או חי מתשובת Claude.
    const effStep = stepIndex >= 0 ? step : liveStep;
    const effPrev = stepIndex >= 0 ? prevStep : null; // בחי כל ניתוח הוא מלא, אין דלתא בין-מילים אמינה
    const effFinal: WordFinal = stepIndex >= 0 ? scenario.final : (liveFinal ?? scenario.final);
    const effAgent: AgentReasoning = stepIndex >= 0 ? mergedAgent : (liveStep?.agent ?? {});
    const effHasAgent = mode === 'agent' && agentHasContent(effAgent);

    const stopAuto = () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        setAutoTyping(false);
    };

    // ניקוי ה-interval בעת unmount.
    useEffect(() => () => stopAuto(), []);

    // בדיקה חד-פעמית: האם השרת מוגדר עם מפתח (מצב חי) או לא (מצב דמו).
    useEffect(() => {
        let alive = true;
        fetch('/api/word-engine')
            .then((r) => r.json())
            .then((d) => { if (alive) setLiveEnabled(!!d?.live); })
            .catch(() => { if (alive) setLiveEnabled(false); });
        return () => { alive = false; };
    }, []);

    // מנוע חי: כשמקלידים טקסט חופשי (לא ניסוי מתוסרט), שולחים אותו ל-Claude
    // אחרי השהיה קצרה (debounce) ומקבלים ניתוח אמיתי. תשובות ישנות מבוטלות.
    useEffect(() => {
        const t = text.trim();
        // לא שולחים בקשה אם: המנוע החי כבוי (אין מפתח → מצב דמו), מקלידים אוטומטית,
        // תואם ניסוי מתוסרט, או שהשדה ריק. הבקשות הישנות מבוטלות דרך liveReqRef.
        if (liveEnabled !== true || autoTyping || stepIndex >= 0 || t.length === 0) return;
        const handle = setTimeout(async () => {
            const id = ++liveReqRef.current;
            setLiveStatus('loading');
            setLiveError(null);
            try {
                const res = await fetch('/api/word-engine', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: t, mode }),
                });
                if (id !== liveReqRef.current) return; // תשובה ישנה - מתעלמים
                const data = await res.json().catch(() => null);
                if (id !== liveReqRef.current) return;
                if (!res.ok || !data) {
                    setLiveStatus('error');
                    setLiveError(data?.message ?? 'לא הצלחתי להתחבר למנוע האמיתי.');
                    return;
                }
                setLiveStep(data as TypingStep);
                setLiveFinal((data.final ?? null) as WordFinal | null);
                setLiveStatus('ready');
            } catch {
                if (id !== liveReqRef.current) return;
                setLiveStatus('error');
                setLiveError('לא הצלחתי להתחבר למנוע האמיתי.');
            }
        }, 650);
        return () => clearTimeout(handle);
    }, [text, mode, stepIndex, autoTyping, liveEnabled]);

    // החלפת תרחיש / מצב מאפסת את ההקלדה.
    const resetTo = (id: string) => {
        stopAuto();
        clearLive();
        setScenarioId(id);
        setText('');
        setSent(false);
    };

    const handleMode = (m: WordMode) => {
        if (m === mode) return;
        setMode(m);
        resetTo(defaultScenarioFor(m).id);
    };

    const handleChange = (value: string) => {
        stopAuto();
        if (sent) setSent(false);
        setText(value);
    };

    const handleScrub = (i: number) => {
        stopAuto();
        setSent(false);
        setText(scenario.steps[i].text);
    };

    const handleSend = () => {
        stopAuto();
        if (text.trim().length > 0) setSent(true);
    };

    const handleReset = () => {
        stopAuto();
        clearLive();
        setText('');
        setSent(false);
    };

    const handleAutoType = () => {
        stopAuto();
        setSent(false);
        const target = scenario.prompt;
        if (reduce) { setText(target); return; }
        setAutoTyping(true);
        setText('');
        let i = 0;
        intervalRef.current = setInterval(() => {
            i += 1;
            setText(target.slice(0, i));
            if (i >= target.length) stopAuto();
        }, 80);
    };

    const modeScenarios = WORD_SCENARIOS.filter((s) => s.mode === mode);

    return (
        <div className="space-y-4">
            {/* בקרת מצב + בחירת ניסוי */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between" dir="rtl">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">מצב:</span>
                    <ModeToggle mode={mode} onChange={(m) => handleMode(m as WordMode)} accent={scenario.accent} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">ניסוי:</span>
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

            {/* שדה ההקלדה */}
            <LiveTypingInput
                text={text}
                prompt={scenario.prompt}
                accent={scenario.accent}
                canSend={canSend}
                sent={sent}
                autoTyping={autoTyping}
                onChange={handleChange}
                onAutoType={handleAutoType}
                onSend={handleSend}
                onReset={handleReset}
            />

            {/* מצב המנוע: חי (ניתוח אמיתי דרך Claude) או דמו (אין מפתח) */}
            {isLive && liveEnabled === false && (
                <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-xs text-slate-400" dir="rtl">
                    <Info size={14} className="shrink-0" />
                    <span className="font-bold">
                        מצב דמו: ניתוח חי של טקסט חופשי דורש ANTHROPIC_API_KEY בשרת. בינתיים נסו את הניסויים המוצעים למעלה.
                    </span>
                </div>
            )}
            {isLive && liveEnabled === true && (
                <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                        liveStatus === 'error'
                            ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                            : `${a.border} ${a.bgSoft} ${a.text}`
                    }`}
                    dir="rtl"
                >
                    {liveStatus === 'loading' && <Loader2 size={14} className="animate-spin shrink-0" />}
                    {liveStatus === 'ready' && <Bot size={14} className="shrink-0" />}
                    {liveStatus === 'error' && <AlertTriangle size={14} className="shrink-0" />}
                    {(liveStatus === 'idle') && <Bot size={14} className="shrink-0" />}
                    <span className="font-bold">
                        {liveStatus === 'loading' && 'Claude מנתח את הטקסט שלך…'}
                        {liveStatus === 'ready' && 'ניתוח חי על ידי Claude (טקסט חופשי, לא תרחיש מתוסרט)'}
                        {liveStatus === 'error' && (liveError ?? 'שגיאה בחיבור למנוע.')}
                        {liveStatus === 'idle' && 'המנוע האמיתי ייכנס לפעולה כשתעצרו להקליד.'}
                    </span>
                </div>
            )}

            {/* שורת "מה השתנה" - הסבר חי לשלב הנוכחי */}
            <AnimatePresence mode="wait">
                {effStep && (
                    <motion.div
                        key={isLive ? `live-${effStep.text}` : `${scenario.id}-${stepIndex}`}
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
                            {effStep.mainChangeHe}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* לוח הבקרה */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* עמודה ראשית: הסתברויות + שלילה + נוסחה */}
                <div className="space-y-4">
                    <CandidateProbabilityPanel step={effStep} prevStep={effPrev} accent={scenario.accent} temporary={temporary} />
                    <AnimatePresence>
                        {effStep?.negation && <NegationAlert key={`neg-${isLive ? 'live' : stepIndex}`} step={effStep} prevStep={effPrev} />}
                    </AnimatePresence>
                    {effStep && effPrev && <WordImpactFormula step={effStep} prevStep={effPrev} />}
                </div>

                {/* עמודה משנית: טוקנים + וקטור + היגיון Agent */}
                <div className="space-y-4">
                    <TokenStreamPanel step={effStep} accent={scenario.accent} />
                    <MeaningVectorPanel step={effStep} accent={scenario.accent} />
                    {effHasAgent && <AgentReasoningPanel reasoning={effAgent} accent={scenario.accent} />}
                </div>
            </div>

            {/* מסלול התנועה + ציר הזמן: רלוונטיים רק לתרחישים המתוסרטים */}
            {!isLive && (
                <>
                    <ProbabilityMovementTrail scenario={scenario} stepIndex={stepIndex} />
                    <WordTimeline scenario={scenario} stepIndex={stepIndex} onScrub={handleScrub} />
                </>
            )}

            {/* התוצאה הסופית / מצב זמני */}
            <SendOutcomeCard final={effFinal} sent={isFinal} />

            {/* הערת שקיפות */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    זו המחשה לימודית. מודלים אמיתיים עובדים בחישובים מורכבים הרבה יותר, וההתפלגות שהם מחשבים היא על המילה הבאה,
                    לא על &quot;כוונות&quot; שלמות. הדירוג לפי כוונות כאן הוא ייצוג של אותו עיקרון: כל מילה מזיזה את המשקל. את הצד של הטוקן הבא נפגוש בפרק הבא.
                </span>
            </div>
        </div>
    );
};
