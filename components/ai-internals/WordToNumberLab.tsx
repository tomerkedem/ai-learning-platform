"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Sparkles, ChevronDown,
    Play, RotateCcw, Keyboard,
    MousePointerClick, Binary, FlaskConical,
} from 'lucide-react';

import { ACCENTS } from './accents';
import { SpeakButton } from './SpeakButton';
import { useT } from '@/i18n/useT';

import {
    activeStepIndex,
    type EngineMode,
} from '@/app/(course)/behind-the-scenes-ai/chapter-4/embeddingEngine';
import {
    getWordDataset,
    getWordText,
    type WordLabText,
} from '@/app/(course)/behind-the-scenes-ai/chapter-4/wordLabContent';

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

    // מצב המתנה מכוון: לפני "נגן וצפו" אין טוקנים, ולכן שלב 2 לא מציג ממשק ריק
    // (הוראה "לחצו על טוקן" כשאין טוקנים). במקום זה, הודעת המתנה קצרה.
    const started = displayTokens.length > 0;

    // הכרזה לקורא מסך: רק בבחירת טוקן, ורק את הטוקן, ה-Token ID שלו, ויחס השורה בטבלה.
    // אין הכרזת ממדים/פסים/"שינוי מוביל" (שלב 3 הוסר). בזמן הקלדה (autoTyping) מושתק.
    const selectedId = selected ? data.tokenId(selected) : null;
    const liveMessage =
        !started || autoTyping || !selected || selectedId === null
            ? ''
            : `${selected}, Token ID ${selectedId}. ${tx.idSeq.rowAria}`;

    return (
        // גבול חיצוני אחד למעבדה 2. כל מה שבתוכו הוא שלב של אותה מעבדה, ולא מעבדה נוספת.
        <section
            dir={dir}
            aria-labelledby="lab2-title"
            className="rounded-[2rem] border border-violet-500/30 bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-4 backdrop-blur-xl md:p-5"
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
                        <h3 id="lab2-title" className="text-xl font-black text-[var(--bts-text-primary)] md:text-2xl">{lab.title}</h3>
                    </div>
                </div>
                <SpeakButton text={`${lab.eyebrow}. ${lab.title}. ${lab.goal}`} className="mt-0.5" />
            </div>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{lab.goal}</p>

            {/* ── שני השלבים: פעולה (הרצה לטוקנים) ותצפית (טוקן -> Token ID -> שורה בטבלה).
                המסקנה אינה שלב, היא הסיכום שלמטה. ── */}
            <ol className="mt-4 grid list-none grid-cols-1 gap-4">
                {/* שלב 1: בחרו משפט והריצו אותו */}
                <li>
                    <StepHeader n={1} step={lab.steps[0]} stepLabel={lab.stepLabel} />
                    {/* הפקדים אינם דביקים: ב-390px הם כיסו את התוצאה, והם רלוונטיים רק לשלב הזה.
                        החלפת תרחיש מאפסת את ההרצה, ולכן עדיף שתהיה פעולה מודעת בראש המעבדה.
                        בורר התרחיש ופקדי Play/Reset יושבים בשורה אחת: הבורר בצד תחילת הקריאה,
                        וקבוצת Play/Reset נדחפת לקצה עם ms-auto (Play ראשי, Reset משני). ב-390px
                        הקבוצה גולשת מתחת לבורר באופן טבעי (flex-wrap), בלי גלילה אופקית. */}
                    <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-[var(--bts-text-muted)]">{tx.scenarioLabel}</span>
                            {modeScenarios.map((s) => {
                                const active = s.id === scenario.id;
                                const sa = ACCENTS[s.accent];
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => resetTo(s.id)}
                                        aria-pressed={active}
                                        className={`flex min-h-[44px] flex-col justify-center rounded-xl border px-3 py-1.5 text-start leading-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))] ${
                                            active ? `${sa.border} ${sa.bgTint}` : 'border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(40%_+_var(--bts-tint-mix)_*_0.6),transparent)] hover:border-[color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))]'
                                        }`}
                                    >
                                        <span className={`block text-xs font-bold ${active ? sa.text : 'text-[var(--bts-text-secondary)]'}`}>{isHe ? s.labelHe : s.labelEn}</span>
                                        {isHe && <span className="block text-[9px] uppercase tracking-wider text-[var(--bts-text-faint)]" dir="ltr">{s.labelEn}</span>}
                                    </button>
                                );
                            })}

                            {/* Play ראשי + Reset משני, נדחפים לקצה שורת הבורר. אותם handlers, labels ו-aria. */}
                            <div className="ms-auto flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleAutoType}
                                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${a.border} ${a.bgTint} ${a.text} hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))]`}
                                >
                                    <Play size={14} /> {tx.typing.autoType}
                                    {isHe && <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{tx.typing.autoTypeLatin}</span>}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(40%_+_var(--bts-tint-mix)_*_0.6),transparent)] px-3 py-2 text-sm font-bold text-[var(--bts-text-muted)] transition-colors hover:text-[var(--bts-text-body)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))]"
                                >
                                    <RotateCcw size={14} /> {tx.typing.reset}
                                    {isHe && <span className="text-[10px] font-medium uppercase opacity-70" dir="ltr">{tx.typing.resetLatin}</span>}
                                </button>
                            </div>
                        </div>

                        <TypingField
                            text={text}
                            prompt={scenario.prompt}
                            accent={scenario.accent}
                            autoTyping={autoTyping}
                            dir={dir}
                            tx={tx}
                        />
                    </div>
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
            </ol>

            {/* הכרזה לקורא מסך. אין הזזת פוקוס, אין אודיו. עובד גם ב-reduced-motion. */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {liveMessage}
            </div>

            {/* ── סיכום המעבדה: סגירה קצרה על מה שנצפה בשלבים 1 ו-2. בלי דוגמה חדשה, בלי
                השוואה, בלי אחוזים ובלי ויזואליזציה נוספת. ── */}
            <div className="mt-5 border-t border-violet-500/30 pt-3">
                <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                        <Sparkles size={17} className="mt-0.5 shrink-0 text-violet-300" />
                        <div>
                            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">{lab.conclusionLabel}</span>
                            <h4 className="mt-0.5 text-base font-bold text-[var(--bts-text-primary)]">{cc.title}</h4>
                        </div>
                    </div>
                    <SpeakButton text={`${lab.conclusionLabel}. ${cc.title}. ${cc.body}`} className="mt-0.5" />
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--bts-text-body)]">{cc.body}</p>
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
    <div className="mb-2">
        <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-border-emphasis)_var(--bts-tint-mix),var(--color-slate-600))_60%,transparent)] bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(60%_+_var(--bts-tint-mix)_*_0.4),transparent)] font-mono text-[12px] font-black text-[var(--bts-text-body)]">
                {n}
            </span>
            <h4 className="text-base font-bold leading-tight text-[var(--bts-text-primary)]">
                <span className="text-[var(--bts-text-muted)]">{stepLabel} {n}: </span>
                {step.title}
            </h4>
        </div>
        {showHint && <p className="mt-1 ps-[2.125rem] text-[15px] leading-relaxed text-[var(--bts-text-muted)]">{step.hint}</p>}
    </div>
);

/* ═══════════════════ מצב המתנה מכוון (לפני "נגן וצפו") ═══════════════════ */

// לא "מושבת" ולא "שבור": הודעה קצרה שמסבירה מה יקרה, ומפנה לשלב 1. בלי איור ריק
// ובלי ערימת כרטיסים. משטח שקט אחד, בגודל גוף רגיל.
const WaitingNote: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start gap-2.5 rounded-xl border border-[var(--bts-border)] bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5">
        <MousePointerClick size={17} className="mt-0.5 shrink-0 text-[var(--bts-text-faint)]" />
        <p className="text-[15px] leading-relaxed text-[var(--bts-text-muted)]">{text}</p>
    </div>
);

/* ═══════════════════════════ שדה ההקלדה ══════════════════════════════════ */

interface TypingFieldProps {
    text: string;
    prompt: string;
    accent: keyof typeof ACCENTS;
    autoTyping: boolean;
    dir: 'rtl' | 'ltr';
    tx: WordLabText;
}

// זהו נגן, לא שדה קלט: המעבדה מדגימה משפטים מוכנים מראש (אין טוקנייזר חי), ולכן במקום
// להזמין הקלדה שלא עושה כלום, לוחצים "נגן" (בשורת הבורר למעלה) והמשפט נבנה טוקן אחר טוקן
// מול העיניים. פקדי Play/Reset עברו לשורת הבורר, ולכן כאן נשארת רק תצוגת המשפט הנבנה.
const TypingField: React.FC<TypingFieldProps> = ({ text, prompt, accent, autoTyping, dir, tx }) => {
    const reduce = useReducedMotion();
    const a = ACCENTS[accent];

    return (
        <div className="rounded-xl bg-[color-mix(in_oklab,var(--bts-panel-to)_40%,transparent)] p-3.5 text-start" dir={dir}>
            <div className="mb-2.5 flex items-center gap-2 text-xs text-[var(--bts-text-muted)]">
                <Keyboard size={14} className={a.text} />
                {tx.typing.suggested}
                <span className="rounded-md bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(70%_+_var(--bts-tint-mix)_*_0.3),transparent)] px-2 py-0.5 font-bold text-[var(--bts-text-body)]">&quot;{prompt}&quot;</span>
            </div>

            {/* תצוגת המשפט הנבנה (קריאה בלבד). ריק => מציג את המשפט המוצע מעומעם כתצוגה מקדימה */}
            <div className="relative flex min-h-[3rem] items-center rounded-xl border border-[var(--bts-border-mid)] bg-[color-mix(in_oklab,var(--bts-panel-to)_60%,transparent)] px-4 py-2.5">
                <span className="text-lg font-medium leading-snug text-[var(--bts-text-primary)]">
                    {text || <span className="text-[var(--bts-text-subtle)]">{prompt}</span>}
                </span>
                {autoTyping && !reduce && (
                    <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className={`ms-1 inline-block h-5 w-0.5 shrink-0 ${a.solid}`}
                    />
                )}
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
    // מצב תנועה מופחתת נקבע רק אחרי ה-mount, כדי שה-DOM בהידרציה יהיה זהה לשרת.
    const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

    return (
        <div className="rounded-xl bg-[color-mix(in_oklab,var(--bts-panel-to)_30%,transparent)] p-3.5 text-start" dir={dir}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Binary size={16} className={a.text} />
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-[var(--bts-text-body)]">{tx.idSeq.title}</div>
                        {/* כותרת-משנה לטינית: סיוע לקורא העברית; בשאר השפות היא רק חוזרת על הכותרת */}
                        {isHe && <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--bts-text-faint)]">{tx.idSeq.sub}</div>}
                    </div>
                </div>
                {/* מתג מילים / מספרים */}
                <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_80%,transparent)] p-1" dir="ltr">
                    {([['words', tx.idSeq.words], ['ids', tx.idSeq.ids]] as const).map(([key, label]) => {
                        const active = (key === 'ids') === idView;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onToggle(key === 'ids')}
                                aria-pressed={active}
                                className={`min-h-[44px] min-w-[44px] rounded-lg px-3.5 py-1 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))] ${
                                    active ? `${a.solid} ${a.solidText}` : 'text-[var(--bts-text-muted)] hover:text-[var(--bts-text-body)]'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {tokens.length === 0 ? (
                <p className="text-xs leading-relaxed text-[var(--bts-text-faint)]">{tx.idSeq.empty}</p>
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
                                className="flex flex-col items-center gap-1.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_oklab,var(--bts-panel-to)_var(--bts-tint-mix),var(--color-slate-950))]"
                            >
                                {/* פאה מתחלפת: מילה <-> ID */}
                                <span
                                    className={`relative flex h-11 min-w-[5.5rem] items-center justify-center rounded-xl border px-3 transition-colors ${
                                        isSel ? `${a.border} ${a.bgTint} ring-2 ${a.ringSoft}` : `${a.border} ${a.bgTint}`
                                    }`}
                                >
                                    {mounted && reduce ? (
                                        <span className="flex flex-col items-center leading-none">
                                            <span className="text-sm font-bold text-[var(--bts-text-body)]">{tok}</span>
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
                                                    className="text-sm font-bold text-[var(--bts-text-body)]"
                                                >
                                                    {tok}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </span>
                                {/* חץ למטה שמתחלף בצבע כשהמילה הופכת ל-ID */}
                                <motion.span
                                    animate={{ opacity: reduce || idView ? 1 : 0.4, y: reduce || idView ? 0 : -2 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <ChevronDown size={14} className={idView ? a.text : 'text-[var(--bts-text-subtle)]'} />
                                </motion.span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* אכיפת ההבחנה: ID מצביע על מילה, לא אומר משמעות */}
            <div className="mt-3">
                <AnimatePresence mode="wait">
                    {selected && tokenId(selected) !== null ? (
                        <motion.div
                            key={selected}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -4 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                            className={`flex flex-wrap items-center gap-2 rounded-xl border ${a.border} ${a.bgTint} p-3`}
                            dir="ltr"
                        >
                            <span className={`font-mono text-sm font-bold ${a.text}`}>Token ID {tokenId(selected)}</span>
                            <span className="text-xs text-[var(--bts-text-muted)]">{tx.idSeq.pointsTo}</span>
                            <span className="rounded-md bg-[color-mix(in_oklab,color-mix(in_oklab,var(--bts-fill-track)_var(--bts-tint-mix),var(--color-slate-800))_calc(70%_+_var(--bts-tint-mix)_*_0.3),transparent)] px-2 py-0.5 text-sm font-bold text-[var(--bts-text-bright)]" dir={dir}>{selected}</span>
                            <span className="text-[11px] text-[var(--bts-text-faint)]" dir={dir}>{tx.idSeq.addressNote}</span>
                        </motion.div>
                    ) : (
                        <p className="text-[11px] leading-relaxed text-[var(--bts-text-faint)]" dir={dir}>{idView ? tx.idSeq.selectHintIds : tx.idSeq.selectHintWords}</p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

/* המחשת שלב 3 (MeaningVectorLive, ששת הפסים עם שמות ממדים) הוסרה: היא רמזה ששמות
   הצירים הם ממדי embedding קריאים, חזרה על שיעור מעבדה 1, והוסיפה גובה. המעבדה מסתיימת
   כעת אחרי שלב 2 עם סיכום קצר. DIM_INFO/DIM_STYLE/dimValue נשארו במנוע כי פרק 6 ומעבדות
   אחרות צורכים אותם. */
