"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Sparkles, Info, Compass, ChevronDown, ChevronUp, Table2,
    Play, RotateCcw, Keyboard,
    MousePointerClick, Binary, FlaskConical,
} from 'lucide-react';

import { ACCENTS } from './accents';
import { SpeakButton } from './SpeakButton';
import { useT } from '@/i18n/useT';

import {
    activeStepIndex,
    dimsForMode,
    dimValue,
    DIM_INFO,
    DIM_STYLE,
    type EngineMode,
    type EngineStep,
    type DimKey,
    type Profile,
    type ShiftEntry,
} from '@/app/behind-the-scenes-ai/chapter-4/embeddingEngine';
import {
    getWordDataset,
    getWordText,
    type WordLabText,
} from '@/app/behind-the-scenes-ai/chapter-4/wordLabContent';

/**
 * WordToNumberLab - מעבדת פרק 4, Embeddings: "ממספר חסר משמעות למשמעות".
 * רכיב עצמאי לחלוטין: מחזיק את מצב ההקלדה (mode, scenario, text, selection)
 * ומרכיב את חמשת הרכיבים האינטראקטיביים. כל הנתונים דטרמיניסטיים ומגיעים
 * מ-embeddingEngine. אין כאן backend, קריאת API או LLM אמיתי.
 *
 * locale-aware: הנתיב העברי משתמש בנתוני המנוע ובמחרוזות העבריות (זהה למקור), והנתיב
 * האנגלי משתמש בשכבת הנתונים והמחרוזות מ-wordLabContent. embeddingEngine לא משתנה.
 */
export const WordToNumberLab: React.FC = () => {
    const { t, locale, dir } = useT();
    const isHe = locale === 'he';
    const data = getWordDataset(locale);
    const tx = getWordText(locale);
    const lab = t.behindAi.chapter4.lab2;
    const cc = t.behindAi.chapter4.labConclusion;

    const reduce = useReducedMotion();

    const firstScenarioFor = (m: EngineMode) => data.scenarios.find((s) => s.mode === m) ?? data.scenarios[0];

    // המעבדה בפרק Embeddings ממוקדת בטקסט -> מספרים בלבד. מצב Agent (סיכון/אישור פעולה)
    // שייך לפרק מאוחר (Guardrails), ולכן כאן נעולים ל-chat כדי לא לפצל את המיקוד.
    const [mode] = useState<EngineMode>('chat');
    const [scenarioId, setScenarioId] = useState<string>(() => firstScenarioFor('chat').id);
    const [text, setText] = useState('');
    const [selected, setSelected] = useState<string | null>(null);
    const [idView, setIdView] = useState(false);
    const [autoTyping, setAutoTyping] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const scenario = useMemo(
        () => data.scenarios.find((s) => s.id === scenarioId) ?? data.scenarios[0],
        [data, scenarioId],
    );
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

    const modeScenarios = data.scenarios.filter((s) => s.mode === mode);
    const displayTokens = step ? step.tokens : [];
    const selectToken = (w: string) => setSelected((cur) => (cur === w ? null : w));

    return (
        // גבול חיצוני אחד למעבדה 2. כל מה שבתוכו הוא שלב של אותה מעבדה, ולא מעבדה נוספת.
        <section
            dir={dir}
            aria-labelledby="lab2-title"
            className="rounded-[2rem] border border-violet-500/30 bg-slate-900/50 p-5 backdrop-blur-xl md:p-7"
        >
            {/* ── כותרת המעבדה: המספר 2 מופיע כאן, בתחילת האינטראקציה האמיתית ── */}
            <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/40 bg-violet-500/15 font-mono text-base font-black text-violet-200">
                        2
                    </span>
                    <div>
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
                            <FlaskConical size={14} /> {lab.eyebrow}
                        </span>
                        <h3 id="lab2-title" className="text-xl font-black text-white md:text-2xl">{lab.title}</h3>
                    </div>
                </div>
                <SpeakButton text={`${lab.eyebrow}. ${lab.title}. ${lab.goal}`} className="mt-0.5" />
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{lab.goal}</p>

            {/* ── שלושת השלבים: פעולה, תצפית, שינוי. המסקנה אינה שלב, היא הסיכום שלמטה.
                בדסקטופ שלבים 2 ו-3 יושבים זה לצד זה כזוג סיבה ותוצאה (בחירת טוקן -> השפעה
                על הדפוס). במובייל הם נערמים, וסדר ה-DOM נשאר 1, 2, 3. ── */}
            <ol className="mt-5 grid list-none grid-cols-1 gap-5 lg:grid-cols-2">
                {/* שלב 1: בחרו משפט והריצו אותו (רוחב מלא: הוא מזין את שני השלבים הבאים) */}
                <li className="lg:col-span-2">
                    <StepHeader n={1} step={lab.steps[0]} stepLabel={lab.stepLabel} />
                    {/* הפקדים אינם דביקים: ב-390px הם כיסו את התוצאה, והם רלוונטיים רק לשלב הזה.
                        החלפת תרחיש מאפסת את ההרצה, ולכן עדיף שתהיה פעולה מודעת בראש המעבדה. */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">{tx.scenarioLabel}</span>
                            {modeScenarios.map((s) => {
                                const active = s.id === scenario.id;
                                const sa = ACCENTS[s.accent];
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => resetTo(s.id)}
                                        aria-pressed={active}
                                        className={`rounded-xl border px-3 py-1.5 text-start leading-tight transition-colors ${
                                            active ? `${sa.border} ${sa.bgSoft}` : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                                        }`}
                                    >
                                        <span className={`block text-xs font-bold ${active ? sa.text : 'text-slate-300'}`}>{isHe ? s.labelHe : s.labelEn}</span>
                                        {isHe && <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{s.labelEn}</span>}
                                    </button>
                                );
                            })}
                        </div>

                        <TypingField
                            text={text}
                            prompt={scenario.prompt}
                            accent={scenario.accent}
                            autoTyping={autoTyping}
                            onAutoType={handleAutoType}
                            onReset={handleReset}
                            dir={dir}
                            tx={tx}
                        />
                    </div>

                    {/* שורת "מה השתנה": התוצאה של ההרצה */}
                    <AnimatePresence mode="wait">
                        {step && (
                            <motion.div
                                key={`${scenario.id}-${stepIndex}`}
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                                className={`mt-3 flex items-start gap-2 rounded-xl border ${a.border} ${a.bgSoft} p-3 text-start`}
                            >
                                <Sparkles size={15} className={`mt-0.5 shrink-0 ${a.text}`} />
                                <span className="text-[15px] leading-relaxed text-slate-200">
                                    <span className={`font-bold ${a.text}`}>{tx.mainChangeLabel}</span>
                                    {step.mainChangeHe}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </li>

                {/* שלב 2: עקבו אחרי הטוקנים. תצוגה אחת של מילה -> Token ID (לוח התרגום הוסר:
                    הוא הציג בדיוק את אותו מיפוי בפורמט שני). פרטי הכתובת בשורת הפירוט שבתוכה. */}
                <li>
                    <StepHeader n={2} step={lab.steps[1]} stepLabel={lab.stepLabel} />
                    <div className="space-y-2.5">
                        <IdSequenceViewer
                            tokens={displayTokens}
                            idView={idView}
                            selected={selected}
                            accent={scenario.accent}
                            onToggle={setIdView}
                            onSelect={selectToken}
                            reduce={!!reduce}
                            dir={dir}
                            tx={tx}
                            tokenId={data.tokenId}
                        />
                        {/* ה-ID הוא מספר השורה, ותוכן השורה הוא הווקטור. הגשר לשלב 3. */}
                        <div className="flex items-start gap-2 rounded-xl bg-violet-500/10 p-3">
                            <Table2 size={15} className="mt-0.5 shrink-0 text-violet-300" />
                            <span className="text-[15px] leading-relaxed text-slate-200">{tx.table.rowIsVector}</span>
                        </div>
                    </div>
                </li>

                {/* שלב 3: ראו איך הדפוס משתנה (התוצאה של בחירת הטוקן בשלב 2) */}
                <li>
                    <StepHeader n={3} step={lab.steps[2]} stepLabel={lab.stepLabel} />
                    <div className="space-y-3">
                        <MeaningVectorLive step={step} prevStep={prevStep} dims={dims} reduce={!!reduce} dir={dir} tx={tx} isHe={isHe} />
                        <VectorShiftCard word={selected} accent={scenario.accent} reduce={!!reduce} dir={dir} tx={tx} isHe={isHe} shift={data.shift} />
                    </div>
                </li>
            </ol>

            {/* ── סיכום המעבדה: סגירה קצרה על מה שנצפה בשלבים 1 עד 3. בלי דוגמה חדשה, בלי
                השוואה, בלי אחוזים ובלי ויזואליזציה נוספת. ── */}
            <div className="mt-6 border-t border-violet-500/30 pt-4">
                <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                        <Sparkles size={17} className="mt-0.5 shrink-0 text-violet-300" />
                        <div>
                            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">{lab.conclusionLabel}</span>
                            <h4 className="mt-0.5 text-base font-bold text-white">{cc.title}</h4>
                        </div>
                    </div>
                    <SpeakButton text={`${lab.conclusionLabel}. ${cc.title}. ${cc.body}`} className="mt-0.5" />
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-200">{cc.body}</p>
            </div>
        </section>
    );
};

/* ═══════════════════════ כותרת שלב פנימי במעבדה 2 ════════════════════════ */

// שלב, לא מעבדה: מספור "שלב N", כותרת, והוראה קצרה צמודה לפעולה שמתחתיה.
const StepHeader: React.FC<{ n: number; stepLabel: string; step: { title: string; hint: string } }> = ({ n, stepLabel, step }) => (
    <div className="mb-3">
        <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-600/60 bg-slate-800/60 font-mono text-[12px] font-black text-slate-200">
                {n}
            </span>
            <h4 className="text-base font-bold leading-tight text-white">
                <span className="text-slate-400">{stepLabel} {n}: </span>
                {step.title}
            </h4>
        </div>
        <p className="mt-1.5 ps-[2.125rem] text-[15px] leading-relaxed text-slate-400">{step.hint}</p>
    </div>
);

/* ═══════════════════════════ שדה ההקלדה ══════════════════════════════════ */

interface TypingFieldProps {
    text: string;
    prompt: string;
    accent: keyof typeof ACCENTS;
    autoTyping: boolean;
    onAutoType: () => void;
    onReset: () => void;
    dir: 'rtl' | 'ltr';
    tx: WordLabText;
}

// זהו נגן, לא שדה קלט: המעבדה מדגימה משפטים מוכנים מראש (אין טוקנייזר חי), ולכן במקום
// להזמין הקלדה שלא עושה כלום, לוחצים "נגן" והמשפט נבנה טוקן אחר טוקן מול העיניים.
const TypingField: React.FC<TypingFieldProps> = ({ text, prompt, accent, autoTyping, onAutoType, onReset, dir, tx }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    return (
        <div className="rounded-xl bg-slate-950/40 p-4 text-start" dir={dir}>
            <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                <Keyboard size={14} className={a.text} />
                {tx.typing.suggested}
                <span className="rounded-md bg-slate-800/70 px-2 py-0.5 font-bold text-slate-200">&quot;{prompt}&quot;</span>
            </div>

            {/* תצוגת המשפט הנבנה (קריאה בלבד). ריק => מציג את המשפט המוצע מעומעם כתצוגה מקדימה */}
            <div className="relative flex min-h-[3.25rem] items-center rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3">
                <span className="text-lg font-medium leading-snug text-white">
                    {text || <span className="text-slate-600">{prompt}</span>}
                </span>
                {autoTyping && !reduce && (
                    <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className={`ms-1 inline-block h-5 w-0.5 shrink-0 ${a.solid}`}
                    />
                )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={onAutoType}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${a.border} ${a.bgSoft} ${a.text} hover:brightness-110`}
                >
                    <Play size={14} /> {tx.typing.autoType}
                    <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{tx.typing.autoTypeLatin}</span>
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-200"
                >
                    <RotateCcw size={14} /> {tx.typing.reset}
                    <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{tx.typing.resetLatin}</span>
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
    dir: 'rtl' | 'ltr';
    tx: WordLabText;
    tokenId: (w: string) => number | null;
}

const IdSequenceViewer: React.FC<IdSequenceViewerProps> = ({ tokens, idView, selected, accent, onToggle, onSelect, reduce, dir, tx, tokenId }) => {
    const a = ACCENTS[accent];

    return (
        <div className="rounded-xl bg-slate-950/30 p-4 text-start" dir={dir}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Binary size={16} className={a.text} />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">{tx.idSeq.title}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{tx.idSeq.sub}</div>
                    </div>
                </div>
                {/* מתג מילים / מספרים */}
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1" dir="ltr">
                    {([['words', tx.idSeq.words], ['ids', tx.idSeq.ids]] as const).map(([key, label]) => {
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
                <p className="text-xs leading-relaxed text-slate-500">{tx.idSeq.empty}</p>
            ) : (
                <div className="flex flex-wrap items-start gap-3" dir={dir}>
                    {tokens.map((tok, i) => {
                        const id = tokenId(tok);
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
                    {selected && tokenId(selected) !== null ? (
                        <motion.div
                            key={selected}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -4 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                            className={`flex flex-wrap items-center gap-2 rounded-xl border ${a.border} ${a.bgSoft} p-3`}
                            dir="ltr"
                        >
                            <span className={`font-mono text-sm font-bold ${a.text}`}>Token ID {tokenId(selected)}</span>
                            <span className="text-xs text-slate-400">{tx.idSeq.pointsTo}</span>
                            <span className="rounded-md bg-slate-800/70 px-2 py-0.5 text-sm font-bold text-slate-100" dir={dir}>{selected}</span>
                            <span className="text-[11px] text-slate-500" dir={dir}>{tx.idSeq.addressNote}</span>
                        </motion.div>
                    ) : (
                        <p className="text-[11px] leading-relaxed text-slate-500" dir={dir}>{tx.idSeq.selectHint}</p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

/* ═══════════════════════ רכיב 3: Meaning Vector Live ═════════════════════ */

interface MeaningVectorLiveProps {
    step: EngineStep | null;
    prevStep: EngineStep | null;
    dims: DimKey[];
    reduce: boolean;
    dir: 'rtl' | 'ltr';
    tx: WordLabText;
    isHe: boolean;
}

const fmt = (n: number) => n.toFixed(2);

const MeaningVectorLive: React.FC<MeaningVectorLiveProps> = ({ step, prevStep, dims, reduce, dir, tx, isHe }) => {
    const profile: Profile = step ? step.profile : {};
    const prev: Profile = prevStep ? prevStep.profile : {};

    return (
        <div className="rounded-xl bg-slate-950/30 p-4 text-start" dir={dir}>
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <Compass size={16} className="text-violet-300" />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">{tx.vector.title}</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{tx.vector.sub}</div>
                </div>
                <span className="ms-auto inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2 py-1 text-[13px] font-bold text-amber-100">
                    <Info size={13} className="shrink-0" /> {tx.vector.eduBadge}
                </span>
            </div>

            {/* ההבהרה הראשית על הפישוט הלימודי: מעל הפסים, לא כהערת שוליים. הלומד קורא אותה
                לפני שהוא מפרש את שמות הצירים, כדי שלא יסיק שלממדים אמיתיים יש שמות קריאים. */}
            <p className="mb-3 rounded-xl border border-amber-500/30 bg-amber-900/15 p-3 text-[15px] leading-relaxed text-amber-50">
                {tx.vector.eduNote}
            </p>

            <div className="space-y-2">
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
                                    <span className={`block text-xs font-bold ${isLead ? s.text : 'text-slate-300'}`}>{isHe ? info.he : (tx.dimLabel?.[key] ?? info.en)}</span>
                                    {isHe && <span className="block text-[8px] uppercase tracking-[0.12em] text-slate-500" dir="ltr">{info.en}</span>}
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

            <p className="mt-3 text-[13px] leading-relaxed text-slate-400">{tx.vector.note}</p>
        </div>
    );
};

/* ═══════════════════════ רכיב 4: Vector Shift by Word ════════════════════ */

const DIR_META: Record<ShiftEntry['dir'], { chevrons: number; strong: boolean }> = {
    'up-strong': { chevrons: 2, strong: true },
    'up': { chevrons: 1, strong: true },
    'up-slight': { chevrons: 1, strong: false },
};

interface VectorShiftCardProps {
    word: string | null;
    accent: keyof typeof ACCENTS;
    reduce: boolean;
    dir: 'rtl' | 'ltr';
    tx: WordLabText;
    isHe: boolean;
    shift: (w: string) => ShiftEntry[];
}

const VectorShiftCard: React.FC<VectorShiftCardProps> = ({ word, accent, reduce, dir, tx, isHe, shift }) => {
    const a = ACCENTS[accent];
    const entries = word ? shift(word) : [];

    return (
        <div className="rounded-xl bg-slate-950/30 p-4 text-start" dir={dir}>
            <div className="mb-3 flex items-center gap-2">
                <ChevronUp size={16} className={a.text} />
                <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-200">{tx.shift.title}</div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{tx.shift.sub}</div>
                </div>
            </div>

            {!word ? (
                <p className="flex items-center gap-2 text-xs leading-relaxed text-slate-500">
                    <MousePointerClick size={14} /> {tx.shift.idleHint}
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
                            <span className="text-[11px] text-slate-500">{tx.shift.pushesUp}</span>
                        </div>

                        {entries.length === 0 ? (
                            <p className="text-xs leading-relaxed text-slate-500">{tx.shift.tiny}</p>
                        ) : (
                            <div className="space-y-2">
                                {entries.map((e) => {
                                    const dimStyle = e.dim ? DIM_STYLE[e.dim] : null;
                                    const meta = DIR_META[e.dir];
                                    const dirLabel = tx.dirLabels[e.dir];
                                    return (
                                        <div
                                            key={`${e.en}-${e.dir}`}
                                            className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                                                dimStyle ? `${dimStyle.border} ${dimStyle.soft}` : 'border-slate-700/50 bg-slate-950/40'
                                            }`}
                                        >
                                            <span className="leading-tight">
                                                <span className={`block text-sm font-bold ${dimStyle ? dimStyle.text : 'text-slate-200'}`}>{isHe ? e.he : e.en}</span>
                                                {isHe && <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{e.en}</span>}
                                            </span>
                                            <span className={`inline-flex items-center gap-0.5 ${dimStyle ? dimStyle.text : 'text-slate-300'}`} title={dirLabel}>
                                                {Array.from({ length: meta.chevrons }).map((_, k) => (
                                                    <ChevronUp key={k} size={15} strokeWidth={meta.strong ? 3 : 2} className={meta.strong ? '' : 'opacity-60'} />
                                                ))}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{tx.shift.note}</p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};
