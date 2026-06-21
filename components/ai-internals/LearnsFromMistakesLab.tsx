"use client";

// מעבדת פרק 14: "האם AI לומד מהטעויות שלך".
// רכיב עצמאי אחד שמחזיק חמישה כלים, כל אחד עם קריינות משלו: הקדמה לפני,
// "השורה התחתונה" אחרי, ו"נסו את זה". זה לא מנוע דטרמיניסטי, אלא המחשה לימודית
// שמתקנת מודל מנטלי שגוי. כל ה"מודל", ה"משקלים" וה"שיחה" כאן מקומיים ומדומים.
//
// גארדריל דיוק כפול: הפרק על דיוק, ולכן לא מפשטים ל"הוא בכלל לא לומד". שכבת
// "שלוש שכבות הלמידה" שומרת על התמונה המלאה: אימון (בעבר), התאמה בהקשר (זמני),
// ולולאת פידבק של הספק (איטי, נפרד, ולא תמיד).

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Lock, Snowflake, RefreshCw, History, MessageSquare, RotateCcw, Layers,
    Clock, Check, X, ArrowDown, Sparkles, Lightbulb, MousePointerClick, Info,
    Send, User, Trash2, GraduationCap,
} from 'lucide-react';

import { ACCENTS } from './accents';
import {
    INCONTEXT_EXAMPLE,
    THREE_LAYERS,
    MYTH_CARDS,
    WEIGHTS_FROZEN,
    TRAINING_SNAPSHOTS,
    type LearningLayer,
} from '@/app/behind-the-scenes-ai/chapter-14/learningData';

/* ════════════════════════ שכבת קריינות לימודית ═══════════════════════════ */
// אותו pattern כמו פרקים 7-8: הקדמה, שורה תחתונה, ונסו את זה.

const LayerIntro: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="mb-4 text-xs leading-relaxed text-slate-400">{children}</p>
);

const Takeaway: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
        <Lightbulb size={13} className="mt-0.5 shrink-0 text-emerald-400/80" />
        <span><span className="font-bold text-slate-300">השורה התחתונה: </span>{children}</span>
    </p>
);

const TryThis: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-500/25 bg-violet-900/10 p-3 text-[11px] leading-relaxed text-violet-100/90" dir="rtl">
        <MousePointerClick size={13} className="mt-0.5 shrink-0 text-violet-300" />
        <span><span className="font-bold text-violet-200">נסו את זה: </span>{children}</span>
    </div>
);

/** מעטפת מקטע אחידה: כותרת עברית + תת-כותרת אנגלית + אייקון. */
const Section: React.FC<{
    icon: React.ReactNode;
    he: string;
    en: string;
    children: React.ReactNode;
}> = ({ icon, he, en, children }) => (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 text-right" dir="rtl">
        <div className="mb-4 flex items-center gap-2">
            {icon}
            <div className="leading-tight">
                <div className="text-sm font-bold text-slate-200">{he}</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500" dir="ltr">{en}</div>
            </div>
        </div>
        {children}
    </section>
);

/* ════════════════════════ 1. Frozen Weights ══════════════════════════════ */
// בלוק משקלים נעול. שולחים תיקונים, הבלוק לא משתנה. עוברים ל-Training (בעבר),
// והבלוק כן משתנה. נייטרלי = קפוא, indigo מרוחק = אימון בעבר.

const WeightCell: React.FC<{ value: number; training: boolean; changed: boolean; reduce: boolean }> = ({ value, training, changed, reduce }) => (
    <motion.div
        animate={training && changed && !reduce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.35 }}
        className={`rounded-md border px-1 py-1.5 text-center font-mono text-[11px] font-bold ${
            training
                ? 'border-indigo-500/40 bg-indigo-900/20 text-indigo-200'
                : 'border-slate-600/50 bg-slate-800/50 text-slate-300'
        }`}
        dir="ltr"
    >
        {value.toFixed(2)}
    </motion.div>
);

const FrozenWeights: React.FC<{ reduce: boolean }> = ({ reduce }) => {
    const [training, setTraining] = useState(false);
    const [corrections, setCorrections] = useState(0);
    const [trainStep, setTrainStep] = useState(0);

    const weights = training ? TRAINING_SNAPSHOTS[trainStep] : WEIGHTS_FROZEN;
    const prev = training ? TRAINING_SNAPSHOTS[Math.max(0, trainStep - 1)] : WEIGHTS_FROZEN;

    return (
        <div className="space-y-4">
            <LayerIntro>
                ברגע שאתה מדבר עם המודל (זמן השימוש, inference), המשקלים שלו נעולים. אותו מודל שענה לך אתמול עונה לך היום, והתיקון שלך לא משנה את המשקלים.
                המשקלים הם מה ש&quot;המודל יודע&quot;, והם נקבעו באימון. כאן הם בלוק נעול: שלחו אליו תיקונים וראו שהוא נשאר זהה. ואז עברו
                ל-Training, שבו הבלוק כן משתנה, אבל זה קרה בעבר, לפני שדיברתם איתו.
            </LayerIntro>

            {/* מתג מצב */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-300">
                    {training ? <History size={15} className="text-indigo-300" /> : <Snowflake size={15} className="text-slate-300" />}
                    מצב: {training ? 'אימון (בעבר)' : 'שיחה (inference)'}
                </div>
                <div className="inline-flex overflow-hidden rounded-lg border border-slate-700/60" dir="ltr">
                    <button
                        type="button"
                        onClick={() => setTraining(false)}
                        aria-pressed={!training}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors ${!training ? 'bg-slate-700 text-white' : 'bg-slate-900/40 text-slate-400 hover:text-slate-200'}`}
                    >
                        Inference
                    </button>
                    <button
                        type="button"
                        onClick={() => setTraining(true)}
                        aria-pressed={training}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors ${training ? 'bg-indigo-600 text-white' : 'bg-slate-900/40 text-slate-400 hover:text-slate-200'}`}
                    >
                        Training (past)
                    </button>
                </div>
            </div>

            {/* בלוק המשקלים */}
            <div className={`relative rounded-2xl border p-4 ${training ? 'border-indigo-500/40 bg-indigo-950/20' : 'border-slate-600/50 bg-slate-900/60'}`}>
                <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300" dir="ltr">
                        {training ? <RefreshCw size={13} className="text-indigo-300" /> : <Lock size={13} className="text-slate-400" />}
                        weights
                    </span>
                    {!training && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-600/50 bg-slate-800/60 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                            <Lock size={10} /> נעול
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                    {weights.map((w, i) => (
                        <WeightCell key={i} value={w} training={training} changed={w !== prev[i]} reduce={reduce} />
                    ))}
                </div>

                {!training && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-lg border border-slate-700/50 bg-slate-950/40 p-2">
                            <div className="font-mono text-lg font-black text-slate-200" dir="ltr">{corrections}</div>
                            <div className="text-[10px] text-slate-500">תיקונים שנשלחו</div>
                        </div>
                        <div className="rounded-lg border border-slate-700/50 bg-slate-950/40 p-2">
                            <div className="font-mono text-lg font-black text-emerald-300" dir="ltr">0</div>
                            <div className="text-[10px] text-slate-500">משקלים שהשתנו</div>
                        </div>
                    </div>
                )}
            </div>

            {/* פקדים */}
            {training ? (
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setTrainStep((s) => Math.min(TRAINING_SNAPSHOTS.length - 1, s + 1))}
                        disabled={trainStep >= TRAINING_SNAPSHOTS.length - 1}
                        className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3 py-2 text-xs font-bold text-indigo-100 transition-colors hover:bg-indigo-500/25 disabled:opacity-40"
                    >
                        <RefreshCw size={14} /> צעד אימון
                    </button>
                    <button
                        type="button"
                        onClick={() => setTrainStep(0)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600"
                    >
                        <RotateCcw size={14} /> איפוס
                    </button>
                    <span className="text-[11px] text-indigo-300/90">באימון המשקלים כן משתנים, אבל זה קרה בעבר.</span>
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCorrections((c) => c + 1)}
                        className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-100 transition-colors hover:bg-violet-500/25"
                    >
                        <Send size={14} /> שלח תיקון למודל
                    </button>
                    {corrections > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <X size={13} className="text-rose-300" /> המשקלים זהים בדיוק לפני ואחרי. התיקון לא נכנס אליהם.
                        </span>
                    )}
                </div>
            )}

            <Takeaway>ב-inference המשקלים קפואים. אתה לא מאמן את המודל כשאתה מתקן אותו.</Takeaway>
            <TryThis>
                שלחו כמה תיקונים וצפו בבלוק המשקלים נשאר זהה, ובמונה &quot;משקלים שהשתנו&quot; שנשאר 0. ואז עברו ל-Training, לחצו &quot;צעד אימון&quot;,
                וראו את אותו בלוק כן משתנה, בעבר.
            </TryThis>
        </div>
    );
};

/* ════════════════════════ 2. In-context vs Persistent ════════════════════ */
// הרכיב החתימתי. תקנו את המודל בשיחה, התיקון נכנס לקופסת ההקשר ומשפיע.
// פתחו שיחה חדשה, ההקשר מתרוקן והתיקון נעלם.

const InContextVsPersistent: React.FC<{ reduce: boolean }> = ({ reduce }) => {
    const [corrected, setCorrected] = useState(false);
    const [session, setSession] = useState(1);

    const name = corrected ? INCONTEXT_EXAMPLE.rightNameHe : INCONTEXT_EXAMPLE.wrongNameHe;
    const reply = corrected ? INCONTEXT_EXAMPLE.correctedReplyHe : INCONTEXT_EXAMPLE.defaultReplyHe;

    return (
        <div className="space-y-4">
            <LayerIntro>
                כשאתה מתקן את המודל, הוא כן מתאים את עצמו, אבל רק כי התיקון נמצא עכשיו בהקשר, בקופסה הזמנית שנשלחת אליו בכל תור.
                ברגע שההקשר נמחק, בשיחה חדשה, התיקון איננו. שימו לב לשם שבו המודל פונה אליכם.
            </LayerIntro>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* פאנל השיחה */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4" dir="rtl">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300">
                            <MessageSquare size={14} className="text-violet-300" /> השיחה
                        </span>
                        <span className="rounded-full border border-slate-700/60 bg-slate-800/60 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-300" dir="ltr">
                            session #{session}
                        </span>
                    </div>

                    {/* הודעת המשתמש */}
                    <div className="mb-2 flex justify-start">
                        <div className="inline-flex items-center gap-2 rounded-2xl rounded-tr-sm border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-sm text-slate-200">
                            <User size={13} className="shrink-0 text-slate-400" />
                            {INCONTEXT_EXAMPLE.userTurnHe}
                        </div>
                    </div>

                    {/* תיקון המשתמש, אם נשלח */}
                    <AnimatePresence>
                        {corrected && (
                            <motion.div
                                initial={reduce ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduce ? undefined : { opacity: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                                className="mb-2 flex justify-start"
                            >
                                <div className="inline-flex items-center gap-2 rounded-2xl rounded-tr-sm border border-amber-500/40 bg-amber-900/20 px-3 py-2 text-sm text-amber-100">
                                    <User size={13} className="shrink-0 text-amber-300" />
                                    {INCONTEXT_EXAMPLE.correctionHe}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* תשובת המודל */}
                    <div className="flex justify-end">
                        <motion.div
                            key={`${corrected}-${session}`}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className="inline-flex max-w-[85%] items-start gap-2 rounded-2xl rounded-tl-sm border border-violet-500/30 bg-violet-900/15 px-3 py-2 text-sm text-slate-100"
                        >
                            <Sparkles size={13} className="mt-0.5 shrink-0 text-violet-300" />
                            <span>{reply}</span>
                        </motion.div>
                    </div>

                    {/* באנר השם */}
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                        <span className="text-slate-500">המודל פונה אליך בשם:</span>
                        <span className={`rounded-md px-2 py-0.5 font-bold ${corrected ? 'border border-emerald-500/40 bg-emerald-900/20 text-emerald-200' : 'border border-rose-500/40 bg-rose-900/20 text-rose-200'}`}>
                            {name}
                        </span>
                        {corrected ? <Check size={14} className="text-emerald-300" /> : <X size={14} className="text-rose-300" />}
                    </div>
                </div>

                {/* קופסת ההקשר */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-4" dir="rtl">
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-amber-200">
                        <Clock size={14} /> קופסת ההקשר
                        <span className="text-[10px] font-medium uppercase tracking-wider text-amber-300/60" dir="ltr">Context (temporary)</span>
                    </div>

                    <div className="min-h-[7rem] space-y-2">
                        <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-xs text-slate-300">
                            הודעת המשתמש: &quot;{INCONTEXT_EXAMPLE.userTurnHe}&quot;
                        </div>
                        <AnimatePresence>
                            {corrected && (
                                <motion.div
                                    initial={reduce ? false : { opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={reduce ? undefined : { opacity: 0, x: 12 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                                    className="rounded-lg border border-amber-500/40 bg-amber-900/20 px-3 py-2 text-xs font-bold text-amber-100"
                                >
                                    התיקון: &quot;{INCONTEXT_EXAMPLE.correctionHe}&quot;
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!corrected && (
                            <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-700/60 bg-slate-950/30 px-3 py-2 text-xs text-slate-500">
                                <Info size={12} /> אין כאן תיקון. בשיחה חדשה הקופסה מתחילה ריקה.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* פקדים */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setCorrected(true)}
                    disabled={corrected}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-100 transition-colors hover:bg-amber-500/25 disabled:opacity-40"
                >
                    <Send size={14} /> תקן את המודל
                </button>
                <button
                    type="button"
                    onClick={() => { setCorrected(false); setSession((s) => s + 1); }}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-100 transition-colors hover:bg-violet-500/25"
                >
                    <RotateCcw size={14} /> פתח שיחה חדשה
                </button>
            </div>

            <Takeaway>התאמה בהקשר היא זמנית. היא חיה כל עוד התיקון בקלט, ונעלמת איתו.</Takeaway>
            <TryThis>
                תקנו את המודל וראו אותו פונה אליכם בשם הנכון, והתיקון נכנס לקופסת ההקשר. ואז פתחו שיחה חדשה, וראו את הקופסה מתרוקנת
                ואת המודל חוזר לשם השגוי. זה הרגע שמתקן את האמונה ש&quot;הוא זוכר אותי&quot;.
            </TryThis>
        </div>
    );
};

/* ════════════════════════ 3. Three Layers of Learning ════════════════════ */

const ThreeLayers: React.FC = () => {
    const [selectedId, setSelectedId] = useState<LearningLayer['id']>('in-context');
    const selected = THREE_LAYERS.find((l) => l.id === selectedId) ?? THREE_LAYERS[0];
    const a = ACCENTS[selected.accent];

    return (
        <div className="space-y-4">
            <LayerIntro>
                אנשים מבלבלים בין שלושה דברים שונים. למידה באימון, שקרתה בעבר. התאמה בהקשר, שזמנית. ולולאת פידבק של הספק, שאיטית
                ונפרדת. אף אחת מהן אינה &quot;המודל לומד ממך חי&quot;. לחצו על כל שכבה כדי לראות מתי היא קורה, ואם היא משפיעה עליכם עכשיו.
            </LayerIntro>

            {/* בוחר השכבות */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {THREE_LAYERS.map((layer) => {
                    const la = ACCENTS[layer.accent];
                    const active = layer.id === selectedId;
                    return (
                        <button
                            key={layer.id}
                            type="button"
                            onClick={() => setSelectedId(layer.id)}
                            aria-pressed={active}
                            className={`rounded-xl border p-3 text-right leading-tight transition-colors ${active ? `${la.border} ${la.bgSoft}` : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'}`}
                        >
                            <span className={`block text-sm font-bold ${active ? la.text : 'text-slate-200'}`}>{layer.he}</span>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-500" dir="ltr">{layer.en}</span>
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-slate-400">
                                <Clock size={10} /> {layer.whenHe}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* פאנל פירוט */}
            <motion.div
                key={selected.id}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border ${a.border} ${a.bgSoft} p-4`}
                dir="rtl"
            >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-2 text-sm font-bold ${a.text}`}>
                        <Layers size={15} /> {selected.he}
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500" dir="ltr">{selected.en}</span>
                    </span>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            selected.affectsNow
                                ? 'border-amber-500/40 bg-amber-900/20 text-amber-200'
                                : 'border-slate-600/50 bg-slate-800/60 text-slate-400'
                        }`}
                    >
                        {selected.affectsNow ? <Check size={11} /> : <X size={11} />}
                        {selected.affectsNow ? 'משפיע על השיחה הנוכחית' : 'לא משפיע על השיחה הנוכחית'}
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{selected.detailHe}</p>
                <p className="mt-2 text-[11px] text-slate-400">{selected.affectsHe}</p>
            </motion.div>

            <div className="flex items-start gap-2 rounded-xl border border-violet-500/25 bg-violet-900/10 p-3 text-[11px] leading-relaxed text-violet-100/90">
                <Info size={13} className="mt-0.5 shrink-0 text-violet-300" />
                אף אחת משלוש השכבות אינה &quot;המודל לומד ממך חי&quot;. האימון קפוא, ההתאמה זמנית, ולולאת הספק נפרדת ואיטית.
            </div>

            <Takeaway>יש שלושה סוגי למידה שונים, ואף אחד מהם אינו עדכון חי מהשיחה שלך.</Takeaway>
            <TryThis>לחצו על כל שכבה וקראו &quot;מתי&quot; ו&quot;האם משפיע עכשיו&quot;. שימו לב שרק ההתאמה בהקשר משפיעה על השיחה הנוכחית, וגם היא זמנית.</TryThis>
        </div>
    );
};

/* ════════════════════════ 4. Myth vs Reality ═════════════════════════════ */
// כרטיסים שמתהפכים מאמונה נפוצה לגרסה המדויקת. לכל כרטיס משפט שמסביר למה.

const MythCardView: React.FC<{ myth: typeof MYTH_CARDS[number]; reduce: boolean }> = ({ myth, reduce }) => {
    const [flipped, setFlipped] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            className="relative h-full min-h-[8.5rem] w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-right transition-colors hover:border-slate-600"
            dir="rtl"
        >
            <AnimatePresence mode="wait" initial={false}>
                {flipped ? (
                    <motion.div
                        key="reality"
                        initial={reduce ? false : { opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={reduce ? undefined : { opacity: 0, rotateY: 90 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                    >
                        <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-900/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                            <Check size={11} /> מציאות
                        </div>
                        <div className="text-sm font-bold text-emerald-100">{myth.realityHe}</div>
                        <div className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{myth.becauseHe}</div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="myth"
                        initial={reduce ? false : { opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={reduce ? undefined : { opacity: 0, rotateY: 90 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                    >
                        <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-slate-600/50 bg-slate-800/60 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                            <X size={11} className="text-rose-300" /> מיתוס
                        </div>
                        <div className="text-base font-bold text-slate-100">&quot;{myth.mythHe}&quot;</div>
                    </motion.div>
                )}
            </AnimatePresence>
            <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 text-[10px] text-slate-500">
                <RefreshCw size={10} /> {flipped ? 'הפוך חזרה' : 'הפכו את הכרטיס'}
            </span>
        </button>
    );
};

const MythVsReality: React.FC<{ reduce: boolean }> = ({ reduce }) => (
    <div className="space-y-4">
        <LayerIntro>
            כמה אמונות נפוצות על AI הן שגויות, והבנת המנגנון מתקנת אותן. רוב הבלבול הוא בין הקשר זמני לבין אימון. הפכו כל כרטיס
            כדי לראות את הגרסה המדויקת, ואת המשפט שמסביר אותה.
        </LayerIntro>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {MYTH_CARDS.map((m) => (
                <MythCardView key={m.id} myth={m} reduce={reduce} />
            ))}
        </div>

        <Takeaway>רוב מה שאנשים מאמינים על &quot;זיכרון&quot; ו&quot;למידה&quot; של AI מתבלבל בין הקשר זמני לבין אימון.</Takeaway>
        <TryThis>הפכו כל כרטיס וקראו לא רק את הגרסה המדויקת אלא גם את המשפט שמסביר למה. שימו לב שכל תיקון נשען על אותו הבדל: הקשר זמני מול משקלים קפואים.</TryThis>
    </div>
);

/* ════════════════════════ 5. Why It Forgets (גשר ל-Context Window) ════════ */
// מקטע קצר: הסיבה שהתיקון נעלם קשורה לחלון ההקשר המוגבל. כשהשיחה ממשיכה,
// הודעות ישנות (כולל התיקון) נדחקות מחוץ לחלון.

const WINDOW_CAPACITY = 4;

const WhyItForgets: React.FC<{ reduce: boolean }> = ({ reduce }) => {
    const [added, setAdded] = useState(0);

    // פריט 0 הוא התיקון, אחריו הודעות. החלון מציג רק את האחרונים שנכנסים לקיבולת.
    const allItems = [
        { id: 'correction', label: 'התיקון שלך', isCorrection: true },
        ...Array.from({ length: added }, (_, i) => ({ id: `m${i}`, label: `הודעה ${i + 1}`, isCorrection: false })),
    ];
    const visible = allItems.slice(Math.max(0, allItems.length - WINDOW_CAPACITY));
    const correctionVisible = visible.some((it) => it.isCorrection);

    return (
        <div className="space-y-4">
            <LayerIntro>
                הסיבה שהמודל &quot;שוכח&quot; אינה שהוא לומד או לא לומד, אלא שיש לו חלון הקשר מוגבל. רק מה שנמצא בחלון נשלח אליו בכל תור.
                כשהשיחה ממשיכה, הודעות ישנות נדחקות החוצה, ואיתן גם תיקונים שנתת מוקדם. זה נושא בפני עצמו שנעמיק בו בנפרד.
            </LayerIntro>

            {/* חלון ההקשר */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4" dir="rtl">
                <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300">
                        <Clock size={14} className="text-amber-300" /> חלון ההקשר
                    </span>
                    <span className="font-mono text-[10px] text-slate-500" dir="ltr">{visible.length}/{WINDOW_CAPACITY} slots</span>
                </div>

                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${WINDOW_CAPACITY}, minmax(0, 1fr))` }} dir="rtl">
                    {Array.from({ length: WINDOW_CAPACITY }, (_, slot) => {
                        const item = visible[slot];
                        return (
                            <div
                                key={slot}
                                className={`flex h-16 items-center justify-center rounded-lg border p-1 text-center text-[11px] font-bold leading-tight ${
                                    item
                                        ? item.isCorrection
                                            ? 'border-amber-500/50 bg-amber-900/25 text-amber-100'
                                            : 'border-slate-600/50 bg-slate-800/50 text-slate-300'
                                        : 'border-dashed border-slate-700/50 bg-slate-900/30 text-slate-600'
                                }`}
                            >
                                {item ? item.label : 'ריק'}
                            </div>
                        );
                    })}
                </div>

                {/* סטטוס התיקון */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                    {correctionVisible ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-200">
                            <Check size={13} /> התיקון עדיין בחלון, אז המודל ישתמש בו.
                        </span>
                    ) : (
                        <motion.span
                            initial={reduce ? false : { opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                            className="inline-flex items-center gap-1.5 font-bold text-rose-200"
                        >
                            <Trash2 size={13} /> התיקון נדחק מחוץ לחלון. המודל כבר לא רואה אותו.
                        </motion.span>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setAdded((n) => n + 1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/15 px-3 py-2 text-xs font-bold text-violet-100 transition-colors hover:bg-violet-500/25"
                >
                    <MessageSquare size={14} /> המשך לדבר (הוסף הודעה)
                </button>
                <button
                    type="button"
                    onClick={() => setAdded(0)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-slate-600"
                >
                    <RotateCcw size={14} /> איפוס
                </button>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <ArrowDown size={12} /> הוסיפו הודעות עד שהתיקון נדחק החוצה.
                </span>
            </div>

            <Takeaway>שכחה והתאמה זמנית הן שני צדדים של אותו דבר, ההקשר.</Takeaway>
        </div>
    );
};

/* ════════════════════════ קומפוננטה ראשית ════════════════════════════════ */

export const LearnsFromMistakesLab: React.FC = () => {
    const reduce = !!useReducedMotion();

    return (
        <div className="space-y-6">
            <Section icon={<Snowflake size={18} className="text-slate-300" />} he="משקלים קפואים" en="Frozen Weights">
                <FrozenWeights reduce={reduce} />
            </Section>

            <Section icon={<RotateCcw size={18} className="text-amber-300" />} he="התיקון שנעלם" en="In-context vs Persistent">
                <InContextVsPersistent reduce={reduce} />
            </Section>

            <Section icon={<Layers size={18} className="text-violet-300" />} he="שלוש שכבות הלמידה" en="Three Layers of Learning">
                <ThreeLayers />
            </Section>

            <Section icon={<Sparkles size={18} className="text-violet-300" />} he="מיתוס מול מציאות" en="Myth vs Reality">
                <MythVsReality reduce={reduce} />
            </Section>

            <Section icon={<GraduationCap size={18} className="text-violet-300" />} he="למה הוא שוכח" en="Why It Forgets">
                <WhyItForgets reduce={reduce} />
            </Section>

            {/* disclaimer + גשר (גארדריל) */}
            <div className="flex items-start gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-500" dir="rtl">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                    זהו מודל לימודי מקומי, אין כאן מודל אמיתי או משקלים אמיתיים. <span className="font-bold text-slate-400">התמונה מדויקת בשני הכיוונים</span>:
                    המודל לא לומד ממך חי, אבל הוא כן נלמד מטעויות בעבר באימון, ויכול להשתפר בעתיד דרך גרסה חדשה מהספק. מערכות יכולות
                    להוסיף שכבות זיכרון חיצוניות (למשל זיכרון מתמשך או חיפוש), אבל המודל עצמו, ברמת ה-inference, נשאר קפוא.
                </span>
            </div>
        </div>
    );
};
