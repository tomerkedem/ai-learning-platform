"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Sparkles, Info, Compass, ChevronDown, ChevronUp,
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

    // מצב המתנה מכוון: לפני "נגן וצפו" אין טוקנים, ולכן שלבים 2 ו-3 לא מציגים ממשק ריק
    // (פסים על 0.00, והוראה "לחצו על טוקן" כשאין טוקנים). במקום זה, הודעת המתנה קצרה.
    const started = displayTokens.length > 0;

    // הכרזה לקורא מסך: המקבילה הטקסטואלית לתוצאה שנראית בעין, ולא הערכים הגולמיים של
    // ששת הפסים. שתי הכרזות אפשריות בלבד:
    //   1. בסיום ההרצה  -> תמצית "השינוי המוביל" של השלב האחרון.
    //   2. בבחירת טוקן  -> הטוקן, ה-Token ID שלו, ואותה תמצית.
    // בזמן ההקלדה (autoTyping) ההכרזה מושתקת: אחרת כל מעבר שלב היה מכריז בנפרד, ובהרצה
    // אחת נשמעו שלוש הודעות רצופות. ב-reduced-motion אין הקלדה, ולכן ההכרזה קורית פעם אחת.
    const selectedId = selected ? data.tokenId(selected) : null;
    const changeSummary = step ? `${tx.mainChangeLabel}${step.mainChangeHe}` : '';
    const liveMessage =
        !started || autoTyping
            ? ''
            : selected && selectedId !== null
              ? `${selected}, Token ID ${selectedId}. ${changeSummary}`
              : changeSummary;

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
                כל שלב תופס את מלוא הרוחב, כדי ששלב 3 יוכל לפרוש את ששת הפסים בשתי עמודות
                בדסקטופ (בחצי רוחב לא נשאר מקום לפס עצמו). סדר ה-DOM נשאר 1, 2, 3. ── */}
            <ol className="mt-5 grid list-none grid-cols-1 gap-5">
                {/* שלב 1: בחרו משפט והריצו אותו */}
                <li>
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
                                        className={`flex min-h-[44px] flex-col justify-center rounded-xl border px-3 py-1.5 text-start leading-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
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
                            isHe={isHe}
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
                    <StepHeader n={2} step={lab.steps[1]} stepLabel={lab.stepLabel} showHint={started} />
                    {started ? (
                        <div>
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
                                isHe={isHe}
                            />
                        </div>
                    ) : (
                        <WaitingNote text={lab.waiting.step2} />
                    )}
                </li>

                {/* שלב 3: ראו איך הדפוס משתנה (התוצאה של בחירת הטוקן בשלב 2) */}
                <li>
                    <StepHeader n={3} step={lab.steps[2]} stepLabel={lab.stepLabel} showHint={started} />
                    {started ? (
                        <MeaningVectorLive step={step} prevStep={prevStep} dims={dims} reduce={!!reduce} dir={dir} tx={tx} isHe={isHe} />
                    ) : (
                        <WaitingNote text={lab.waiting.step3} />
                    )}
                </li>
            </ol>

            {/* הכרזה לקורא מסך. אין הזזת פוקוס, אין אודיו. עובד גם ב-reduced-motion. */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {liveMessage}
            </div>

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
// showHint=false לפני שהמעבדה הורצה: אז ההוראה ("לחצו על טוקן") אינה ניתנת לביצוע,
// ובמקומה מוצגת הודעת ההמתנה שמתחת לכותרת.
const StepHeader: React.FC<{ n: number; stepLabel: string; step: { title: string; hint: string }; showHint?: boolean }> = ({
    n,
    stepLabel,
    step,
    showHint = true,
}) => (
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
        {showHint && <p className="mt-1.5 ps-[2.125rem] text-[15px] leading-relaxed text-slate-400">{step.hint}</p>}
    </div>
);

/* ═══════════════════ מצב המתנה מכוון (לפני "נגן וצפו") ═══════════════════ */

// לא "מושבת" ולא "שבור": הודעה קצרה שמסבירה מה יקרה, ומפנה לשלב 1. בלי איור ריק
// ובלי ערימת כרטיסים. משטח שקט אחד, בגודל גוף רגיל.
const WaitingNote: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start gap-2.5 rounded-xl border border-slate-700/50 bg-slate-950/30 p-4">
        <MousePointerClick size={17} className="mt-0.5 shrink-0 text-slate-500" />
        <p className="text-[15px] leading-relaxed text-slate-400">{text}</p>
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
    isHe: boolean;
}

// זהו נגן, לא שדה קלט: המעבדה מדגימה משפטים מוכנים מראש (אין טוקנייזר חי), ולכן במקום
// להזמין הקלדה שלא עושה כלום, לוחצים "נגן" והמשפט נבנה טוקן אחר טוקן מול העיניים.
const TypingField: React.FC<TypingFieldProps> = ({ text, prompt, accent, autoTyping, onAutoType, onReset, dir, tx, isHe }) => {
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
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${a.border} ${a.bgSoft} ${a.text} hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
                >
                    <Play size={14} /> {tx.typing.autoType}
                    {/* המילה הלטינית (PLAY) היא סיוע לקורא העברית בלבד; בשאר השפות תווית הכפתור
                        כבר בשפת המשתמש, וה"לטיני" תורגם בטעות לאותה מילה (ריק ריק). מציגים רק בעברית. */}
                    {isHe && <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{tx.typing.autoTypeLatin}</span>}
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                    <RotateCcw size={14} /> {tx.typing.reset}
                    {isHe && <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{tx.typing.resetLatin}</span>}
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
    isHe: boolean;
}

const IdSequenceViewer: React.FC<IdSequenceViewerProps> = ({ tokens, idView, selected, accent, onToggle, onSelect, reduce, dir, tx, tokenId, isHe }) => {
    const a = ACCENTS[accent];

    return (
        <div className="rounded-xl bg-slate-950/30 p-4 text-start" dir={dir}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Binary size={16} className={a.text} />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-200">{tx.idSeq.title}</div>
                        {/* כותרת-משנה לטינית: סיוע לקורא העברית; בשאר השפות היא רק חוזרת על הכותרת */}
                        {isHe && <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{tx.idSeq.sub}</div>}
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
                                className={`min-h-[44px] min-w-[44px] rounded-lg px-3.5 py-1 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
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
                                className="flex flex-col items-center gap-1.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
                    {/* כותרת-משנה לטינית: סיוע לקורא העברית; בשאר השפות היא רק חוזרת על הכותרת */}
                    {isHe && <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{tx.vector.sub}</div>}
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

            <div className="grid gap-x-8 gap-y-2 lg:grid-flow-col lg:grid-rows-3">
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
