"use client";

// components/ai-internals/IntroStationViz.tsx
//
// הסצנות החיות שנפתחות בתוך כרטיסי התחנות במפת המבוא. לכל אחת מ-14 התחנות יש
// סצנה שמתחילה לנוע מיד עם פתיחת הכרטיס, ומגע אחד שמשנה את התוצאה. כל סצנה
// מלמדת מושג אחד, לא מקשטת. אין כאן מודל אמיתי: אלה דוגמאות לימודיות מוחשיות.
//
// ── יושרה ─────────────────────────────────────────────────────────────────────
// המספרים והאחוזים כאן הם דוגמה להמחשה בלבד, לא פלט אמיתי של מודל.
//
// ── תוכן וכיוון ────────────────────────────────────────────────────────────────
// הטקסט (משפטים, טוקנים, תוויות, הערות) מגיע מהמילון (t.behindAi.introVisuals.viz),
// והכיוון מגיע מ-useT. המבנה שאינו תלוי-שפה (וקטורים, ציונים גולמיים, אחוזים,
// מיקומים במפת המשמעות, אינדקסים של קשב) נשאר כאן.
//
// ── הפעלה מחדש ────────────────────────────────────────────────────────────────
// הפאנל של תחנה נטען מחדש בכל פתיחה, ולכן כל סצנה רצה מחדש בכל פתיחת כרטיס.
// בנוסף, כפתור "הפעלה מחדש" בעוטף (StationViz) מרענן את הסצנה דרך key, בלי
// לסגור את הכרטיס. חשוב להרצאות: הסצנה זמינה שוב מול קהל בלחיצה אחת.
//
// ── reduced-motion ────────────────────────────────────────────────────────────
// כל סצנה מקבלת reduce. כשהתנועה מצומצמת מציגים את המצב הקונספטואלי הסופי בלי
// רצפים מתוזמנים, והאינטראקציות ממשיכות לעבוד בלי תנועה.

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, ArrowRightLeft, CornerDownLeft, Pause, Play, Plus,
    RotateCcw, Square, Volume2, VolumeX,
} from 'lucide-react';
import { ACCENTS } from './accents';
import type { Accent } from './types';
import { useT } from '@/i18n/useT';
import type { Direction } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import type { StationVizKind } from '@/app/behind-the-scenes-ai/introduction/introContent';

type IntroViz = Dictionary['behindAi']['introVisuals']['viz'];

interface VizProps {
    accent: Accent;
    reduce: boolean;
    viz: IntroViz;
    dir: Direction;
}

function Caption({ children }: { children: React.ReactNode }) {
    return <p className="mt-3 text-[13px] leading-relaxed text-slate-400">{children}</p>;
}

// חץ זרימה תלוי-כיוון: בעברית וערבית הזרימה שמאלה, בשאר השפות ימינה.
function FlowArrow({ dir }: { dir: Direction }) {
    return dir === 'rtl'
        ? <ArrowLeft size={14} className="shrink-0 text-slate-600" aria-hidden />
        : <ArrowRight size={14} className="shrink-0 text-slate-600" aria-hidden />;
}

// טיימרים עם ניקוי אוטומטי: כמה סצנות מריצות רצף פתיחה קצוב, וכולן חייבות לבטל
// את הטיימרים כשהכרטיס נסגר או כשהסצנה מופעלת מחדש.
function useTimers() {
    const ids = useRef<number[]>([]);
    useEffect(() => () => { ids.current.forEach((id) => clearTimeout(id)); }, []);
    return (fn: () => void, ms: number) => { ids.current.push(window.setTimeout(fn, ms)); };
}

/* ── סאונד עדין (Web Audio API, ללא קבצי שמע וללא תלות חדשה) ──
   טונים סינתטיים קצרים ורכים שמלווים רגעי-מפתח בלבד: חיתוך, היפוך קלף, נעילת
   100%, הגרלה, טוקן שנפלט. אין צליל על אנימציה אינסופית ואין רקע מתמשך.
   מתג ההשתקה בכותרת הסצנה משותף לכל התחנות. ה-AudioContext נפתח במחוות
   המשתמש הראשונה (לחיצת פתיחת הכרטיס) כדי לעמוד במדיניות ה-autoplay. */
const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // סולם פנטטוני חמים
let vizAudio: AudioContext | null = null;
let vizAudioArmed = false;

function armVizAudio() {
    if (vizAudioArmed || typeof window === 'undefined') return;
    vizAudioArmed = true;
    const unlock = () => {
        const AC = window.AudioContext
            ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC && !vizAudio) vizAudio = new AC();
        if (vizAudio && vizAudio.state === 'suspended') void vizAudio.resume();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
}

const sound = {
    enabled: true,
    play(freq: number, dur = 0.2, peak = 0.05, type: OscillatorType = 'sine') {
        const ctx = vizAudio;
        if (!this.enabled || !ctx || ctx.state !== 'running') return;
        const t0 = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2400; // טימבר רך, לא צפצוף
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
    },
    /** טיק קצר בסולם הפנטטוני, לפי אינדקס עולה. */
    tick(i = 0) { this.play(PENTA[i % PENTA.length], 0.16, 0.045); },
    /** צליל סיום קטן ומתגמל: יסוד + קווינטה. */
    chime() { this.play(523.25, 0.35, 0.06); this.play(783.99, 0.4, 0.035); },
};

// כפתור פעולה קטן ואחיד לסצנות (מגע נוח גם בטלפון).
function VizButton({ onClick, active, disabled, children, accent }: {
    onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; accent: Accent;
}) {
    const a = ACCENTS[accent];
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${active
                ? `${a.border} ${a.solid} ${a.solidText}`
                : `${a.border} bg-slate-950/50 ${a.text} hover:bg-white/[0.04]`
                } ${disabled ? 'opacity-40' : ''}`}
        >
            {children}
        </button>
    );
}

/* ════════════ 1 · הבקשה נכנסת: מה שאתם רואים מול מה שהמודל מקבל ════════════ */

// רוחבי מקטעי הרצף (הוראות / היסטוריה / הבקשה), באחוזים. להמחשה בלבד.
const REQ_SEGMENTS = [42, 33, 25];

function RequestViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.request;
    const [view, setView] = useState<'you' | 'model'>(reduce ? 'model' : 'you');
    const touched = useRef(false);
    const after = useTimers();

    // רצף הפתיחה: קודם רואים את הבועה המוכרת, ואז נחשף מה שהמודל באמת מקבל.
    useEffect(() => {
        if (!reduce) after(() => { if (!touched.current) { sound.tick(1); setView('model'); } }, 1700);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pick = (next: 'you' | 'model') => { touched.current = true; sound.tick(1); setView(next); };

    return (
        <div dir={dir}>
            <div className="mb-3 flex flex-wrap gap-1.5">
                <VizButton accent={accent} active={view === 'you'} onClick={() => pick('you')}>{v.youTab}</VizButton>
                <VizButton accent={accent} active={view === 'model'} onClick={() => pick('model')}>{v.modelTab}</VizButton>
            </div>

            <div className="min-h-[150px]">
                <AnimatePresence mode="wait" initial={false}>
                    {view === 'you' ? (
                        <motion.div
                            key="you"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.3 }}
                            className="flex justify-end pt-4"
                        >
                            <div className="max-w-[85%]">
                                <span className={`mb-1 block text-end text-xs font-bold ${a.softText}`}>{v.userLabel}</span>
                                <motion.div
                                    initial={reduce ? false : { scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 22, delay: 0.15 }}
                                    className={`rounded-2xl ${a.solid} ${a.solidText} px-4 py-2.5 text-sm font-bold`}
                                >
                                    {v.userText}
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="model"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.25 }}
                            className="flex flex-col gap-1.5"
                        >
                            {/* השכבות הסמויות נערמות מעל ההודעה הגלויה. לכל שכבה צבע משלה,
                                ואותם צבעים בדיוק חוזרים ברצועה למטה: הרצועה היא שלוש השכבות. */}
                            {([
                                ['system', v.systemLabel, v.systemText, 'border-violet-500/40 bg-violet-900/20 text-violet-100', 'bg-violet-400'],
                                ['history', v.historyLabel, v.historyText, 'border-amber-500/40 bg-amber-900/15 text-amber-100', 'bg-amber-400'],
                                ['user', v.userLabel, v.userText, `${a.border} ${a.bgSoft} text-white`, ''],
                            ] as const).map(([key, label, text, cls, dotCls], i) => (
                                <motion.div
                                    key={key}
                                    initial={reduce ? false : { opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.3, delay: i * 0.22 }}
                                    className={`rounded-xl border px-3 py-2 ${cls}`}
                                >
                                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide opacity-80">
                                        <span className={`h-1.5 w-1.5 rounded-full ${key === 'user' ? a.dot : dotCls}`} aria-hidden />
                                        {label}
                                    </span>
                                    <span className="mt-0.5 block text-sm leading-relaxed">{text}</span>
                                </motion.div>
                            ))}

                            {/* הפאנץ׳: הכל נמתח לרצועה אחת */}
                            <motion.div
                                initial={reduce ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.8 }}
                                className="mt-1.5"
                            >
                                <span className={`mb-1 flex items-center gap-1 text-sm font-bold ${a.text}`}>
                                    <CornerDownLeft size={13} aria-hidden />
                                    {v.stripLabel}
                                </span>
                                <div className="flex h-3 w-full overflow-hidden rounded-full" dir={dir}>
                                    {REQ_SEGMENTS.map((w, i) => (
                                        <motion.span
                                            key={i}
                                            initial={reduce ? false : { scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            style={{ width: `${w}%`, originX: dir === 'rtl' ? 1 : 0 }}
                                            transition={reduce ? { duration: 0 } : { duration: 0.35, delay: 0.9 + i * 0.18 }}
                                            className={i === 0 ? 'bg-violet-500' : i === 1 ? 'bg-amber-500' : a.solid}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 2 · פירוק לטוקנים: קו חיתוך חי ושני משפטים ════════════ */

// צבעי קבוצות לחלקי-מילה במשפט "המילים הארוכות": חלקים של אותה מילה מקבלים
// אותו צבע, כך שרואים מיד אילו חתיכות היו פעם מילה אחת. מחלקות סטטיות בלבד.
const PIECE_STYLES = [
    { border: 'border-sky-500/40', text: 'text-sky-300' },
    { border: 'border-amber-500/40', text: 'text-amber-300' },
    { border: 'border-violet-500/40', text: 'text-violet-300' },
    { border: 'border-emerald-500/40', text: 'text-emerald-300' },
    { border: 'border-rose-500/40', text: 'text-rose-300' },
];

function TokenizeViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.tokenize;
    const [variant, setVariant] = useState<'a' | 'b'>('a');
    const after = useTimers();
    const data = variant === 'a'
        ? { sentence: v.sentence, tokens: v.tokens, caption: v.caption }
        : { sentence: v.altSentence, tokens: v.altTokens, caption: v.altCaption };

    // צליל "חיתוך" קטן כשקו החיתוך מסיים לעבור על המשפט.
    useEffect(() => {
        if (!reduce) after(() => sound.play(880, 0.09, 0.045, 'triangle'), 460);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant]);

    return (
        <div dir={dir}>
            {/* key=variant: החלפת משפט מריצה את סצנת החיתוך מחדש */}
            <div key={variant}>
                <div className="relative mb-3 overflow-hidden rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2 text-sm text-slate-300">
                    {data.sentence}
                    {/* קו החיתוך חולף על המשפט בכיוון הקריאה */}
                    {!reduce && (
                        <motion.span
                            aria-hidden
                            className={`absolute inset-y-0 w-0.5 ${a.solid}`}
                            initial={{ left: dir === 'rtl' ? '100%' : '0%', opacity: 1 }}
                            animate={{ left: dir === 'rtl' ? '0%' : '100%', opacity: [1, 1, 0] }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                        />
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.tokens.map((tok, i) => {
                        // במשפט המילים הארוכות, חלקי אותה מילה צבועים באותו צבע.
                        const piece = variant === 'b'
                            ? PIECE_STYLES[v.altGroups[i] % PIECE_STYLES.length]
                            : { border: a.border, text: a.text };
                        return (
                            <motion.span
                                key={`${tok}-${i}`}
                                initial={reduce ? false : { opacity: 0, y: 8, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={reduce ? { duration: 0 } : { delay: 0.45 + i * 0.12, type: 'spring', stiffness: 320, damping: 22 }}
                                className={`inline-flex items-center gap-1.5 rounded-lg border ${piece.border} bg-slate-950/60 px-2.5 py-1.5`}
                            >
                                <span className="font-mono text-[10px] text-slate-500" dir="ltr">{i + 1}</span>
                                <span className={`text-sm font-bold ${piece.text}`}>{tok}</span>
                            </motion.span>
                        );
                    })}
                </div>
                <Caption>{data.caption}</Caption>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
                <VizButton accent={accent} active={variant === 'a'} onClick={() => { sound.tick(0); setVariant('a'); }}>{v.variantA}</VizButton>
                <VizButton accent={accent} active={variant === 'b'} onClick={() => { sound.tick(0); setVariant('b'); }}>{v.variantB}</VizButton>
            </div>
        </div>
    );
}

/* ════════════ 3 · מזהים: קלפים שמתהפכים ממילים למספרים ════════════ */

// מזהים להמחשה בלבד (כתובות במילון), לא מזהים אמיתיים של מודל.
const TOKEN_IDS = [7412, 209, 5306, 4812, 1573, 662, 3948, 88];

function IdsViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.ids;
    const tokens = viz.tokenize.tokens;
    const [flipped, setFlipped] = useState<boolean[]>(() => tokens.map(() => reduce));
    const after = useTimers();

    // רצף הפתיחה: הקלפים מתהפכים אחד אחרי השני עד ששורת המילים הופכת לשורת מספרים.
    useEffect(() => {
        if (reduce) return;
        tokens.forEach((_, i) => {
            after(() => { sound.tick(i); setFlipped((f) => f.map((x, j) => (j === i ? true : x))); }, 650 + i * 240);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = (i: number) => { sound.tick(i); setFlipped((f) => f.map((x, j) => (j === i ? !x : x))); };

    return (
        <div dir={dir}>
            <div className="flex flex-wrap gap-2">
                {tokens.map((tok, i) => (
                    <button
                        key={`${tok}-${i}`}
                        type="button"
                        onClick={() => toggle(i)}
                        aria-pressed={flipped[i]}
                        className="[perspective:600px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-lg"
                    >
                        <motion.span
                            className="grid [transform-style:preserve-3d]"
                            animate={{ rotateY: flipped[i] ? 180 : 0 }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24 }}
                        >
                            <span className={`[grid-area:1/1] [backface-visibility:hidden] inline-flex items-center justify-center rounded-lg border ${a.border} bg-slate-950/60 px-2.5 py-1.5 text-sm font-bold ${a.text}`}>
                                {tok}
                            </span>
                            <span
                                dir="ltr"
                                className={`[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] inline-flex items-center justify-center rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 font-mono text-sm font-bold text-slate-200`}
                            >
                                {TOKEN_IDS[i % TOKEN_IDS.length]}
                            </span>
                        </motion.span>
                    </button>
                ))}
            </div>
            <p className={`mt-2.5 text-sm font-bold ${a.text}`}>{v.hint}</p>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 4 · ייצוג מספרי: השרשרת + מפת משמעות זעירה ════════════ */

const EMB_VECTOR = ['0.12', '-0.44', '0.91', '0.07', '-0.28'];

// מפת המשמעות מציגה מילים, לא אובייקטים: התחנה מלמדת שטקסט הופך למספרים, והמודל
// לא רואה חתול, רק את המילה. הסדר מבני וקבוע בכל השפות: 0 חבילה, 1 משלוח,
// 2 חתול, 3 כלב. זוג 0+1 קרוב, זוג 2+3 קרוב, והזוגות רחוקים זה מזה.
// לכל מילה שני מספרים מהווקטור שלה (להמחשה): מילים קרובות = מספרים דומים.
// המספרים של "חבילה" הם שני הראשונים מהשרשרת שמעל (EMB_VECTOR), כדי שהלומד
// יפגוש את אותו וקטור פעמיים: פעם כרשימה ופעם כמיקום במרחב.
const MAP_POS = [
    { x: 22, y: 30 },
    { x: 38, y: 58 },
    { x: 68, y: 26 },
    { x: 84, y: 54 },
];
const MAP_VEC = [
    ['0.12', '-0.44'],
    ['0.15', '-0.41'],
    ['0.80', '0.62'],
    ['0.83', '0.65'],
];
const MAP_NEAREST = [1, 0, 3, 2];

// שני האשכולות בצבעים שונים: מילות המשלוח (0,1) מול החיות (2,3). הצבע מסמן
// שכונה במרחב המשמעות, וגם המספרים צבועים לפי האשכול. מחלקות סטטיות בלבד.
const CLUSTER_STYLE = [
    { border: 'border-blue-500/40', text: 'text-blue-300', ring: 'ring-blue-400/40' },
    { border: 'border-rose-500/40', text: 'text-rose-300', ring: 'ring-rose-400/40' },
];
const clusterOf = (i: number) => (i < 2 ? 0 : 1);

function EmbeddingViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const [sel, setSel] = useState(0);
    const near = MAP_NEAREST[sel];

    return (
        <div dir={dir}>
            {/* השרשרת: טוקן, מזהה, וקטור */}
            <div className="flex flex-wrap items-center gap-2">
                <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                    className={`rounded-lg border ${a.border} bg-slate-950/60 px-2.5 py-1.5 text-sm font-bold ${a.text}`}
                >
                    {viz.embedding.token}
                </motion.span>
                <FlowArrow dir={dir} />
                <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.25 }}
                    className="rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-300"
                    dir="ltr"
                >
                    ID 4812
                </motion.span>
                <FlowArrow dir={dir} />
                <div className="flex flex-wrap items-center gap-1" dir="ltr">
                    {EMB_VECTOR.map((val, i) => (
                        <motion.span
                            key={i}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.5 + i * 0.08 }}
                            className="rounded-md border border-white/10 bg-slate-950/60 px-1.5 py-1 font-mono text-[10px] text-slate-300"
                        >
                            {val}
                        </motion.span>
                    ))}
                    <span className="px-1 font-mono text-[10px] text-slate-600">...</span>
                </div>
            </div>

            {/* מפת המשמעות: מילים עם המספרים שלהן. דומות במשמעות = מספרים דומים = קרובות */}
            <div className="relative mt-3 h-36 rounded-xl border border-white/5 bg-slate-950/60 sm:h-44" dir="ltr">
                <svg className={`pointer-events-none absolute inset-0 h-full w-full ${CLUSTER_STYLE[clusterOf(sel)].text}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                    <motion.line
                        key={`ln-${sel}`}
                        x1={MAP_POS[sel].x} y1={MAP_POS[sel].y}
                        x2={MAP_POS[near].x} y2={MAP_POS[near].y}
                        stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 3" vectorEffect="non-scaling-stroke"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.9 }}
                    />
                </svg>
                {viz.embedding.mapWords.map((w, i) => {
                    const isSel = i === sel;
                    const isNear = i === near;
                    const c = CLUSTER_STYLE[clusterOf(i)];
                    return (
                        <motion.button
                            key={w}
                            type="button"
                            onClick={() => { sound.play(440, 0.15, 0.05); setSel(i); }}
                            aria-pressed={isSel}
                            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={reduce ? { duration: 0 } : { delay: 0.3 + i * 0.15, type: 'spring', stiffness: 280, damping: 20 }}
                            style={{ left: `${MAP_POS[i].x}%`, top: `${MAP_POS[i].y}%` }}
                            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                            <span
                                className={`rounded-full border px-2.5 py-1 text-sm font-bold transition-all ${c.border} ${c.text} ${isSel
                                    ? `bg-slate-950/90 ring-2 ${c.ring}`
                                    : isNear
                                        ? 'bg-slate-950/80'
                                        : 'bg-slate-950/70 opacity-60'
                                    }`}
                            >
                                {w}
                            </span>
                            {/* שני מספרים מהווקטור: הראיה שקרבה במפה היא דמיון במספרים */}
                            <span className={`font-mono text-xs transition-opacity ${c.text} ${isSel || isNear ? '' : 'opacity-50'}`} dir="ltr">
                                {MAP_VEC[i][0]} · {MAP_VEC[i][1]}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
            <p className={`mt-2 text-sm font-bold ${a.text}`}>
                {viz.embedding.nearLabel}: {viz.embedding.mapWords[sel]} + {viz.embedding.mapWords[near]} · {viz.embedding.mapHint}
            </p>
            <Caption>{viz.embedding.mapCaption} {viz.embedding.caption(viz.sharedNote)}</Caption>
        </div>
    );
}

/* ════════════ 5 · מיקום וסדר: החלפה שהופכת את משמעות העסקה ════════════ */

// אינדקסים מבניים: אילו שתי מילים מתחלפות. המילים עצמן מהמילון.
const POS_SWAP: readonly [number, number] = [1, 3];

function PositionViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.position;
    const [swapped, setSwapped] = useState(false);
    const touched = useRef(false);
    const after = useTimers();

    // רצף פתיחה: אחרי שהתגים נחתמים, המילים מתחלפות פעם אחת מול העיניים.
    useEffect(() => {
        if (!reduce) after(() => { if (!touched.current) { sound.tick(3); setSwapped(true); } }, 1800);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const order = v.tokens.map((_, i) => i);
    if (swapped) { order[POS_SWAP[0]] = POS_SWAP[1]; order[POS_SWAP[1]] = POS_SWAP[0]; }

    return (
        <div dir={dir}>
            {/* תגי המיקום קבועים במקומם; המילים הן שזזות ביניהם */}
            <div className="grid grid-cols-4 gap-1.5">
                {v.tokens.map((_, i) => (
                    <motion.span
                        key={`badge-${i}`}
                        initial={reduce ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={reduce ? { duration: 0 } : { delay: 0.2 + i * 0.12, type: 'spring', stiffness: 340, damping: 18 }}
                        className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${a.solid} ${a.solidText}`}
                        dir="ltr"
                    >
                        {i + 1}
                    </motion.span>
                ))}
                {order.map((tokenIdx) => (
                    <motion.span
                        key={`tok-${tokenIdx}`}
                        layout
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 26 }}
                        // שתי המילים שמתחלפות צבועות כל אחת בצבע קבוע משלה, כדי שרואים
                        // אותן נוסעות בין התגים. מחלקות סטטיות בלבד.
                        className={`mt-1 flex min-h-[34px] items-center justify-center rounded-lg border px-1 py-1.5 text-center text-xs font-bold sm:text-sm ${tokenIdx === POS_SWAP[0]
                            ? 'border-amber-500/40 bg-slate-950/70 text-amber-300'
                            : tokenIdx === POS_SWAP[1]
                                ? 'border-emerald-500/40 bg-slate-950/70 text-emerald-300'
                                : 'border-white/10 bg-slate-950/50 text-slate-300'
                            }`}
                    >
                        {v.tokens[tokenIdx]}
                    </motion.span>
                ))}
            </div>

            {/* המשמעות מתהפכת יחד עם הסדר */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <VizButton accent={accent} onClick={() => { touched.current = true; sound.tick(3); setSwapped((s) => !s); }}>
                    <ArrowRightLeft size={12} aria-hidden />
                    {v.swapLabel}
                </VizButton>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={swapped ? 'b' : 'a'}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.2 }}
                        className={`rounded-full border px-3 py-1 text-sm font-bold ${swapped
                            ? 'border-amber-500/40 bg-amber-900/15 text-amber-300'
                            : 'border-emerald-500/40 bg-emerald-900/15 text-emerald-300'
                            }`}
                    >
                        {swapped ? v.meaningB : v.meaningA}
                    </motion.span>
                </AnimatePresence>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 6 · חלון הקשר: הודעות נכנסות, הישנות נשכחות ════════════ */

const CTX_WINDOW = 3;

function ContextViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.context;
    const msgs = v.messages;
    const [count, setCount] = useState(CTX_WINDOW);
    const after = useTimers();

    // רצף פתיחה: הודעה אחת מגיעה לבד, כדי שיהיה ברור מה הכפתור עושה.
    useEffect(() => {
        if (!reduce) after(() => { sound.tick(2); setCount((c) => Math.min(c + 1, msgs.length)); }, 1500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const outside = msgs.slice(0, count - CTX_WINDOW);
    const inside = msgs.slice(count - CTX_WINDOW, count);
    const done = count >= msgs.length;

    return (
        <div dir={dir}>
            {/* הערימה שמחוץ לחלון: אפורה, דחוסה, לא קיימת עבור המודל */}
            <div className="mb-2 min-h-[22px]">
                {outside.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-500">{v.outLabel} · <span dir="ltr">{outside.length}</span></span>
                        {outside.map((m, i) => (
                            <motion.div
                                key={`m-${i}`}
                                layoutId={`ctx-${i}`}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                                className="w-fit max-w-[80%] rounded-lg border border-white/5 bg-slate-950/40 px-2 py-0.5 text-xs text-slate-500 line-through decoration-slate-600"
                            >
                                {m}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* החלון עצמו: רק מה שבפנים קיים */}
            <div className={`rounded-xl border-2 ${a.border} ${a.bgSoft} p-2.5 ring-1 ${a.ringSoft}`}>
                <span className={`mb-1.5 block text-xs font-black uppercase tracking-wide ${a.text}`}>
                    {v.windowLabel} · <span dir="ltr">{CTX_WINDOW}</span>
                </span>
                <div className="flex flex-col gap-1.5">
                    {inside.map((m, i) => {
                        const gi = count - CTX_WINDOW + i;
                        return (
                            <motion.div
                                key={`m-${gi}`}
                                layoutId={`ctx-${gi}`}
                                initial={reduce ? false : { opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                                className={`w-fit max-w-[85%] rounded-lg border px-2.5 py-1 text-sm ${gi % 2 === 0
                                    ? `self-start ${a.border} bg-slate-950/60 text-slate-200`
                                    : 'self-end border-white/10 bg-slate-800/60 text-slate-300'
                                    }`}
                            >
                                {m}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-2.5">
                <VizButton accent={accent} disabled={done} onClick={() => { sound.tick(2); setCount((c) => Math.min(c + 1, msgs.length)); }}>
                    <Plus size={12} aria-hidden />
                    {v.addLabel}
                </VizButton>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 7 · קשב: לחיצה על מילה מציירת מחדש את הקשרים ════════════ */

// לכל מילה מוגדר מבנית למי היא הכי קשובה (חזק) ולמי פחות (חלש). אינדקסים לפי
// סדר הטוקנים הקבוע במילון: 0 שם עצם, 1 פועל, 2 מילת קישור, 3 כינוי גוף, 4 מצב.
const FOCUS_MAP: Record<number, { s: number; w: number }> = {
    0: { s: 1, w: 4 },
    1: { s: 0, w: 4 },
    2: { s: 4, w: 1 },
    3: { s: 0, w: 4 },
    4: { s: 3, w: 0 },
};
const ATTN_DEFAULT_FOCUS = 3;

type AttnArc = { d: string; tx: number; ty: number; lx: number; ly: number };

function AttentionViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.attention;
    const wrapRef = useRef<HTMLDivElement>(null);
    const tokRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focus, setFocus] = useState(ATTN_DEFAULT_FOCUS);
    const [geo, setGeo] = useState<{ w: number; h: number; strong: AttnArc; weak: AttnArc } | null>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const compute = () => {
            const els = tokRefs.current;
            const map = FOCUS_MAP[focus];
            const f = els[focus], s = els[map.s], w = els[map.w];
            if (!f || !s || !w) return;
            const cb = wrap.getBoundingClientRect();
            const topOf = (el: HTMLElement) => {
                const r = el.getBoundingClientRect();
                return { x: r.left - cb.left + r.width / 2, y: r.top - cb.top };
            };
            const fp = topOf(f);
            const toArc = (p: { x: number; y: number }): AttnArc => {
                const cx = (fp.x + p.x) / 2;
                const cy = Math.min(fp.y, p.y) - 26;
                return { d: `M ${fp.x} ${fp.y} Q ${cx} ${cy} ${p.x} ${p.y}`, tx: p.x, ty: p.y, lx: cx, ly: (fp.y + 2 * cy + p.y) / 4 };
            };
            setGeo({ w: cb.width, h: cb.height, strong: toArc(topOf(s)), weak: toArc(topOf(w)) });
        };
        const raf = requestAnimationFrame(compute);
        const ro = new ResizeObserver(compute);
        ro.observe(wrap);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, [focus]);

    return (
        <div dir={dir}>
            <div ref={wrapRef} className="relative pt-14">
                {geo && (
                    <svg
                        key={`arcs-${focus}`}
                        className={`pointer-events-none absolute left-0 top-0 ${a.text}`}
                        width={geo.w}
                        height={geo.h}
                        viewBox={`0 0 ${geo.w} ${geo.h}`}
                        aria-hidden
                    >
                        {/* קשר חלש */}
                        <motion.path
                            d={geo.weak.d} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.35}
                            initial={reduce ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeInOut' }}
                        />
                        <circle cx={geo.weak.tx} cy={geo.weak.ty} r={2.5} fill="currentColor" opacity={0.4} />
                        {/* קשר חזק: הילה + קו + נקודת-נחיתה */}
                        <circle cx={geo.strong.tx} cy={geo.strong.ty} r={7} fill="currentColor" opacity={0.18} />
                        <motion.path
                            d={geo.strong.d} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
                            initial={reduce ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
                        />
                        <circle cx={geo.strong.tx} cy={geo.strong.ty} r={3.5} fill="currentColor" />
                    </svg>
                )}

                {/* פולס שנע לאורך הקשר החזק: הקשב הוא זרימה, לא קו סטטי */}
                {geo && !reduce && (
                    <motion.span
                        key={`pulse-${focus}-${geo.w}`}
                        aria-hidden
                        className={`pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 rounded-full ${a.solid}`}
                        style={{ offsetPath: `path("${geo.strong.d}")` }}
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.5, delay: 0.9, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
                    />
                )}

                {/* תוויות קצרות ליד הקווים */}
                {geo && (
                    <>
                        <span
                            className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border ${a.border} bg-slate-950/80 px-2 py-0.5 text-[11px] font-bold ${a.text}`}
                            style={{ left: geo.strong.lx, top: geo.strong.ly }}
                        >
                            {v.strongLabel}
                        </span>
                        <span
                            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border border-white/10 bg-slate-950/70 px-2 py-0.5 text-[11px] font-bold text-slate-400"
                            style={{ left: geo.weak.lx, top: geo.weak.ly }}
                        >
                            {v.weakLabel}
                        </span>
                    </>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    {v.tokens.map((tok, i) => {
                        const map = FOCUS_MAP[focus];
                        const cls =
                            i === focus ? `${a.border} bg-slate-950/70 ${a.text} ring-1 ${a.ringSoft}`
                                : i === map.s ? `${a.border} bg-slate-950/60 ${a.text}`
                                    : i === map.w ? 'border-white/10 bg-slate-950/50 text-slate-300'
                                        : 'border-white/5 bg-slate-950/40 text-slate-500';
                        return (
                            <button
                                key={tok}
                                type="button"
                                onClick={() => { sound.play(440, 0.15, 0.05); setFocus(i); }}
                                aria-pressed={i === focus}
                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-lg"
                            >
                                <span
                                    ref={(el) => { tokRefs.current[i] = el; }}
                                    className={`inline-block rounded-lg border px-2.5 py-1.5 text-sm font-bold transition-colors ${cls}`}
                                >
                                    {tok}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            {/* שורת הסיפור: מה בדיוק המילה שבמוקד מחפשת, מתחלפת עם כל לחיצה */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.p
                    key={focus}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.2 }}
                    className={`mt-2.5 text-sm font-bold ${a.text}`}
                >
                    {v.stories[focus]}
                </motion.p>
            </AnimatePresence>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 8 · ערבוב מידע: אותה מילה, הקשר אחר, משמעות אחרת ════════════ */

// שני ההקשרים בצבעים קבועים (מחלקות סטטיות בלבד, בשביל Tailwind JIT):
// הראשון תכלת, השני ענבר. הצבע מלווה את הזרימה ואת המשמעות שיוצאת.
const MIX_STYLE = {
    a: {
        chip: 'border-cyan-500/40 bg-cyan-900/15 text-cyan-200',
        dot: 'bg-cyan-400',
    },
    b: {
        chip: 'border-amber-500/40 bg-amber-900/15 text-amber-200',
        dot: 'bg-amber-400',
    },
} as const;

function MixViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.mix;
    const [ctx, setCtx] = useState<'a' | 'b'>('a');
    const touched = useRef(false);
    const after = useTimers();

    // מעבר הקשר: טיק קטן במעבר, וצליל עדין כשהמשמעות החדשה נוחתת.
    const switchCtx = (k: 'a' | 'b') => {
        sound.tick(1);
        after(() => sound.play(659.25, 0.25, 0.04), 950);
        setCtx(k);
    };

    // רצף פתיחה: ההקשר הראשון נמזג אל המילה, ואז מעבר אוטומטי לשני מראה את
    // היפוך המשמעות בלי שנדרש מגע. מכאן הלומד ממשיך להחליף בעצמו.
    useEffect(() => {
        if (!reduce) after(() => { if (!touched.current) switchCtx('b'); }, 2800);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cur = ctx === 'a'
        ? { source: v.aSource, meaning: v.aMeaning }
        : { source: v.bSource, meaning: v.bMeaning };
    const s = MIX_STYLE[ctx];

    return (
        <div dir={dir}>
            {/* בחירת הקשר: שני משפטים שמכילים בדיוק את אותה מילה */}
            <div className="flex flex-col gap-1.5">
                {(['a', 'b'] as const).map((k) => {
                    const on = ctx === k;
                    return (
                        <button
                            key={k}
                            type="button"
                            onClick={() => { touched.current = true; switchCtx(k); }}
                            aria-pressed={on}
                            className={`w-full rounded-xl border px-3 py-2 text-start text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${on ? MIX_STYLE[k].chip : 'border-white/10 bg-slate-950/50 text-slate-400 hover:bg-white/[0.03]'}`}
                        >
                            {k === 'a' ? v.aLabel : v.bLabel}
                        </button>
                    );
                })}
            </div>

            {/* הזירה: מילת ההקשר נמזגת אל תוך המילה, והמשמעות שיוצאת מתחלפת */}
            <div className="relative mx-auto mt-3 flex h-44 w-full max-w-xs flex-col items-center justify-between py-1">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={`src-${ctx}`}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.25 }}
                        className={`rounded-full border px-3 py-1 text-sm font-bold ${s.chip}`}
                    >
                        {cur.source}
                    </motion.span>
                </AnimatePresence>

                {/* טיפות המידע: השכנה נמזגת אל המילה */}
                {!reduce && [0, 1, 2].map((i) => (
                    <motion.span
                        key={`${ctx}-${i}`}
                        aria-hidden
                        className={`absolute left-1/2 top-10 h-2 w-2 -translate-x-1/2 rounded-full ${s.dot}`}
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: 50, opacity: [0, 1, 0.9, 0] }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.22, ease: 'easeIn' }}
                    />
                ))}

                {/* המילה: נכנסת זהה בשני ההקשרים */}
                <span className={`rounded-xl border ${a.border} bg-slate-950/80 px-4 py-2 text-lg font-black text-white`}>
                    {v.word}
                </span>

                {/* המשמעות שיוצאת מהערבוב */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={`mean-${ctx}`}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { delay: 0.8, type: 'spring', stiffness: 300, damping: 22 }}
                        className={`rounded-full border px-3 py-1 text-center text-sm font-bold ${s.chip}`}
                    >
                        {cur.meaning}
                    </motion.span>
                </AnimatePresence>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 9 · שכבות עומק: מעלית שמחדדת את ההבנה ════════════ */

// טשטוש המשפט לפי הקומה הנוכחית: למטה מטושטש, למעלה חד.
const FLOOR_BLUR = [3, 1.5, 0];
const FLOOR_OPACITY = [0.55, 0.8, 1];

function LayersViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.layers;
    const [floor, setFloor] = useState(reduce ? v.floors.length - 1 : 0);
    const touched = useRef(false);
    const after = useTimers();

    // מעבר קומה: צליל עולה בסולם ככל שעולים, כמו פעמון מעלית קטן.
    const goFloor = (i: number) => { sound.tick(i + 1); setFloor(i); };

    // רצף פתיחה: המעלית עולה לבד קומה-קומה, והמשפט מתחדד.
    useEffect(() => {
        if (reduce) return;
        after(() => { if (!touched.current) goFloor(1); }, 1100);
        after(() => { if (!touched.current) goFloor(2); }, 2200);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div dir={dir}>
            {/* המשפט: מטושטש למטה, חד למעלה */}
            <motion.div
                animate={{ filter: `blur(${FLOOR_BLUR[floor]}px)`, opacity: FLOOR_OPACITY[floor] }}
                transition={{ duration: reduce ? 0 : 0.45 }}
                className="mb-3 rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2 text-center text-sm font-bold text-slate-100"
            >
                {v.sentence}
            </motion.div>

            {/* הקומות, מלמעלה למטה בתצוגה: הקומה הגבוהה היא המחודדת ביותר */}
            <div className="flex flex-col gap-1.5">
                {[...v.floors].map((_, ri) => v.floors.length - 1 - ri).map((i) => {
                    const active = i === floor;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => { touched.current = true; goFloor(i); }}
                            aria-pressed={active}
                            className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${active ? `${a.border} ${a.bgSoft}` : 'border-white/5 bg-slate-950/40 hover:bg-white/[0.03]'
                                }`}
                        >
                            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                {active && (
                                    <motion.span
                                        layoutId="lv-car"
                                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 28 }}
                                        className={`absolute inset-0 rounded-md ${a.solid}`}
                                        aria-hidden
                                    />
                                )}
                                <span className={`relative text-xs font-black ${active ? a.solidText : 'text-slate-500'}`} dir="ltr">{i + 1}</span>
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className={`block text-sm font-bold ${active ? a.text : 'text-slate-400'}`}>
                                    {v.floorLabel} <span dir="ltr">{i + 1}</span> · {v.floors[i]}
                                </span>
                                <AnimatePresence initial={false}>
                                    {active && (
                                        <motion.span
                                            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                            transition={{ duration: reduce ? 0 : 0.25 }}
                                            className="block overflow-hidden text-[13px] leading-relaxed text-slate-300"
                                        >
                                            {v.notes[i]}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        </button>
                    );
                })}
            </div>
            <p className={`mt-2.5 text-sm font-bold ${a.text}`}>{v.hint}</p>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 10 · מצב פנימי: כל ההקשר נדחס לנקודה אחת ════════════ */

// מיקומי רוחות-הרפאים של המילים סביב הכדור (אחוזים בתוך הזירה).
const GHOST_POS = [
    { left: '10%', top: '16%' },
    { left: '74%', top: '10%' },
    { left: '6%', top: '62%' },
    { left: '72%', top: '66%' },
    { left: '42%', top: '4%' },
];

function StateViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.state;
    const tokens = viz.attention.tokens;
    const [ghosts, setGhosts] = useState(reduce);
    const after = useTimers();

    // צליל דחיסה חם כשהכדור נולד: בס עדין + נגיעת פעמון.
    useEffect(() => {
        if (!reduce) after(() => { sound.play(130.81, 0.3, 0.06, 'triangle'); sound.play(523.25, 0.4, 0.04); }, 1600);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div dir={dir}>
            {/* הטוקנים מופיעים, ואז נדחסים אל הכדור */}
            {!reduce && (
                <motion.div
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    animate={{ opacity: 0, scale: 0.1, y: 46 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: 'easeIn' }}
                    className="flex flex-wrap justify-center gap-1.5"
                    aria-hidden
                >
                    {tokens.map((tok, i) => (
                        <motion.span
                            key={tok}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.3 }}
                            className={`rounded-md border ${a.border} bg-slate-950/60 px-2 py-1 text-xs font-bold ${a.text}`}
                        >
                            {tok}
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {/* הזירה: הכדור במרכז, רוחות המילים סביבו */}
            <div className="relative mx-auto h-36 w-full max-w-xs">
                <AnimatePresence>
                    {ghosts && tokens.slice(0, GHOST_POS.length).map((tok, i) => (
                        <motion.span
                            key={tok}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.08 }}
                            style={GHOST_POS[i]}
                            className="absolute text-sm font-bold text-slate-400"
                        >
                            {tok}
                        </motion.span>
                    ))}
                </AnimatePresence>

                <motion.div
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { delay: 1.6, type: 'spring', stiffness: 220, damping: 16 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                    <motion.div
                        animate={reduce ? undefined : { scale: [1, 1.07, 1] }}
                        transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
                        className={`h-16 w-16 rounded-full ${a.barGradient} ${a.glow}`}
                        aria-hidden
                    />
                </motion.div>
                <span className={`absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center text-sm font-bold leading-tight ${a.text}`}>
                    {v.orbLabel}
                </span>
            </div>

            <div className="mt-2.5 flex justify-center">
                <VizButton accent={accent} active={ghosts} onClick={() => { sound.tick(4); setGhosts((g) => !g); }}>{v.insideBtn}</VizButton>
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ 11 · ציונים גולמיים: מרוץ מועמדים שמסתדר לפי מוביל ════════════ */

// ציונים גולמיים להמחשה בלבד, בסדר "לא ממוין" בכוונה כדי שהמיון יקרה מול העיניים.
const LOGIT_SCORES = [8.2, 6.1, 4.0, 5.5, 3.2, 4.8, 2.1, 3.9];
const LOGIT_MAX = 10;

function LogitsViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.logits;
    const [sorted, setSorted] = useState(reduce);
    const after = useTimers();

    // רצף פתיחה: העמודות מתמלאות בערבוביה, ואז הרשימה מסתדרת לפי מוביל.
    useEffect(() => {
        if (!reduce) after(() => { sound.tick(4); setSorted(true); }, 1900);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = v.words.map((w, i) => ({ w, s: LOGIT_SCORES[i % LOGIT_SCORES.length] }));
    const list = sorted ? [...items].sort((x, y) => y.s - x.s) : items;
    const leader = sorted ? list[0].w : null;

    return (
        <div dir={dir}>
            <div className="mb-2.5 w-fit rounded-lg border border-white/5 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-300">
                {v.prompt}
            </div>
            <div className="flex flex-col gap-1.5">
                {list.map(({ w, s }, i) => {
                    const isLeader = w === leader;
                    return (
                        <motion.div
                            key={w}
                            layout
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                            className={`flex items-center gap-2 rounded-md px-1.5 py-0.5 ${isLeader ? `ring-1 ${a.ringSoft} ${a.bgSoft}` : ''}`}
                        >
                            <span className={`w-16 shrink-0 truncate text-sm font-bold ${isLeader ? a.text : 'text-slate-300'}`}>{w}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                                <motion.div
                                    className={`h-full rounded-full ${isLeader ? a.barGradient : 'bg-slate-500'}`}
                                    initial={reduce ? false : { width: 0 }}
                                    animate={{ width: `${(s / LOGIT_MAX) * 100}%` }}
                                    transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.15 + i * 0.08 }}
                                />
                            </div>
                            <span className="w-8 shrink-0 text-left font-mono text-xs text-slate-400" dir="ltr">{s}</span>
                        </motion.div>
                    );
                })}
            </div>
            <p className="mt-2 text-[13px] font-bold text-slate-400">{v.note}</p>
            <Caption>{v.caption(viz.sharedNote)}</Caption>
        </div>
    );
}

/* ════════════ 12 · Softmax: הציונים הופכים לאחוזים שננעלים על 100 ════════════ */

// ציון גולמי והסתברות מבניים (לא תלויי-שפה). התוויות (שמש/גשם/ענן) מהמילון.
const SCORE_DATA = [
    { raw: 8.2, prob: 72 },
    { raw: 6.1, prob: 19 },
    { raw: 4.0, prob: 6 },
];

function ScoresViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const maxRaw = 10; // קנה מידה קבוע לעמודות הציון הגולמי
    const [total, setTotal] = useState(reduce ? 100 : 0);

    // המונה מטפס אל 100 אחרי שעמודות ההסתברות מסיימות להתמלא.
    useEffect(() => {
        if (reduce) return;
        let iv: number | undefined;
        const to = window.setTimeout(() => {
            iv = window.setInterval(() => {
                setTotal((t) => {
                    if (t + 5 >= 100) { if (iv) window.clearInterval(iv); return 100; }
                    return t + 5;
                });
            }, 30);
        }, 1200);
        return () => { window.clearTimeout(to); if (iv) window.clearInterval(iv); };
    }, [reduce]);

    // צליל נעילה קטן כשהמונה מגיע ל-100%.
    useEffect(() => {
        if (total === 100 && !reduce) sound.chime();
    }, [total, reduce]);

    return (
        <div className="flex flex-col gap-2.5">
            {/* כותרות שתי העמודות: ציון גולמי (אפור) מול סיכוי (צבעוני) */}
            <div className="flex items-center gap-2.5" dir={dir}>
                <span className="w-12 shrink-0" />
                <span className="flex-1 text-center text-xs font-bold text-slate-500">{viz.scores.rawHeader}</span>
                <span className="w-8 shrink-0" />
                <span className="w-3 shrink-0" />
                <span className={`flex-1 text-center text-xs font-bold ${a.text}`}>{viz.scores.probHeader}</span>
                <span className="w-10 shrink-0" />
            </div>
            {SCORE_DATA.map((row, i) => (
                <div key={i} className="flex items-center gap-2.5" dir={dir}>
                    <span className="w-12 shrink-0 truncate text-sm font-bold text-slate-300">{viz.scores.rowLabels[i]}</span>
                    {/* ציון גולמי */}
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                        <motion.div
                            className="h-full rounded-full bg-slate-500"
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${(row.raw / maxRaw) * 100}%` }}
                            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
                        />
                    </div>
                    <span className="w-8 shrink-0 text-left font-mono text-xs text-slate-400" dir="ltr">{row.raw}</span>
                    <CornerDownLeft size={12} className="shrink-0 text-slate-600" aria-hidden />
                    {/* הסתברות */}
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                        <motion.div
                            className={`h-full rounded-full ${a.barGradient}`}
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${row.prob}%` }}
                            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 + i * 0.1 }}
                        />
                    </div>
                    <span className={`w-10 shrink-0 text-left font-mono text-xs font-bold ${a.text}`} dir="ltr">{row.prob}%</span>
                </div>
            ))}

            {/* רגע הנעילה: ביחד תמיד 100% */}
            <div className="flex items-center justify-end gap-2" dir={dir}>
                <span className="text-sm font-bold text-slate-400">{viz.scores.totalLabel}</span>
                <motion.span
                    animate={total === 100 && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-sm font-black ${total === 100 ? `${a.border} ${a.text} ${a.bgSoft}` : 'border-white/10 text-slate-400'}`}
                    dir="ltr"
                >
                    {total}%
                </motion.span>
            </div>
            <Caption>{viz.scores.caption(viz.sharedNote)}</Caption>
        </div>
    );
}

/* ════════════ 13 · בחירת הטוקן הבא: מצב בטוח מול מצב מפתיע ════════════ */

// ההסתברויות זהות לתחנת ה-Softmax (72/19/6), כדי שהסיפור יהיה רציף.
const DECODE_PROBS = [72, 19, 6];

function DecodingViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.decoding;
    const labels = viz.scores.rowLabels;
    const [mode, setMode] = useState<'sure' | 'surprise'>('sure');
    const [highlight, setHighlight] = useState<number | null>(null);
    const [chosen, setChosen] = useState<number | null>(null);
    const [tally, setTally] = useState<number[]>([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    const after = useTimers();
    const rolls = tally.reduce((s, n) => s + n, 0);

    const pick = (m: 'sure' | 'surprise') => {
        if (m === 'sure') return 0;
        const r = Math.random() * 100;
        return r < DECODE_PROBS[0] ? 0 : r < DECODE_PROBS[0] + DECODE_PROBS[1] ? 1 : 2;
    };

    const roll = (m: 'sure' | 'surprise') => {
        if (spinning) return;
        const target = pick(m);
        if (reduce) {
            sound.tick(5);
            setChosen(target);
            setTally((t) => t.map((n, i) => (i === target ? n + 1 : n)));
            return;
        }
        setSpinning(true);
        setChosen(null);
        // אפקט הגרלה: הסימון רץ בין האפשרויות עם טיק קטן, מאט, ונעצר על הנבחרת.
        // הצעד האחרון מסומן idx = steps % 3, לכן בוחרים steps בין 7 ל-9 בהתאם.
        const steps = target === 0 ? 9 : target === 1 ? 7 : 8;
        let t = 0;
        for (let k = 0; k < steps; k++) {
            t += 70 + k * 26;
            const idx = (k + 1) % 3;
            after(() => { sound.play(329.63, 0.06, 0.03); setHighlight(idx); }, t);
        }
        after(() => {
            setHighlight(null);
            setChosen(target);
            setTally((prev) => prev.map((n, i) => (i === target ? n + 1 : n)));
            setSpinning(false);
            sound.chime();
        }, t + 240);
    };

    // רצף פתיחה: הגרלה אחת אוטומטית במצב הבטוח, כדי שהסצנה חיה מיד.
    useEffect(() => {
        if (!reduce) after(() => roll('sure'), 900);
        else { setChosen(0); setTally([1, 0, 0]); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div dir={dir}>
            {/* המשפט הנבנה: הפרומפט + הטוקן שנבחר */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="rounded-lg border border-white/5 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-300">{v.prompt}</span>
                <AnimatePresence mode="wait">
                    {chosen !== null && (
                        <motion.span
                            key={`${rolls}-${chosen}`}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 18 }}
                            className={`rounded-lg border ${a.border} ${a.bgSoft} px-3 py-1.5 text-base font-black ${a.text}`}
                        >
                            {labels[chosen]}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* שלוש האפשרויות עם ההסתברויות שלהן */}
            <div className="flex flex-col gap-1.5">
                {labels.map((w, i) => {
                    const isHl = highlight === i;
                    const isChosen = chosen === i && !spinning;
                    return (
                        <div
                            key={w}
                            className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 transition-all ${isChosen ? `${a.border} ${a.bgSoft} ring-1 ${a.ringSoft}` : isHl ? `${a.border} bg-slate-950/70` : 'border-white/5 bg-slate-950/40'
                                }`}
                        >
                            <span className={`w-16 shrink-0 truncate text-sm font-bold ${isChosen || isHl ? a.text : 'text-slate-300'}`}>{w}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/70">
                                <motion.div
                                    className={`h-full rounded-full ${isChosen ? a.barGradient : 'bg-slate-500'}`}
                                    initial={reduce ? false : { width: 0 }}
                                    animate={{ width: `${DECODE_PROBS[i]}%` }}
                                    transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.1 }}
                                />
                            </div>
                            <span className="w-10 shrink-0 text-left font-mono text-xs text-slate-400" dir="ltr">{DECODE_PROBS[i]}%</span>
                        </div>
                    );
                })}
            </div>

            {/* מגע: מצב, הגרלה, ותוצאות מצטברות */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <VizButton accent={accent} active={mode === 'sure'} onClick={() => setMode('sure')}>{v.sure}</VizButton>
                <VizButton accent={accent} active={mode === 'surprise'} onClick={() => setMode('surprise')}>{v.surprise}</VizButton>
                <VizButton accent={accent} disabled={spinning} onClick={() => roll(mode)}>
                    <Play size={12} aria-hidden />
                    {v.roll}
                </VizButton>
            </div>
            {rolls > 1 && (
                <p className="mt-2 text-[13px] font-bold text-slate-400">
                    {v.tally}: {labels.map((w, i) => `${w} ${tally[i]}`).join(' · ')}
                </p>
            )}
            <Caption>{mode === 'sure' ? v.sureNote : v.surpriseNote}</Caption>
        </div>
    );
}

/* ════════════ 14 · הלולאה: כל סיבוב מנוע מוסיף טוקן אחד ════════════ */

function LoopViz({ accent, reduce, viz, dir }: VizProps) {
    const a = ACCENTS[accent];
    const v = viz.loop;
    const [n, setN] = useState(reduce ? v.words.length : 0);
    const [playing, setPlaying] = useState(!reduce);
    const done = n >= v.words.length;

    // כל "סיבוב מנוע" פולט טוקן אחד עם טיק עולה בסולם. השהיה מקפיאה את התשובה באמצע.
    useEffect(() => {
        if (!playing || done) return;
        const id = window.setTimeout(() => { sound.tick(n); setN((x) => x + 1); }, n === 0 ? 700 : 850);
        return () => window.clearTimeout(id);
    }, [playing, n, done]);

    // צליל סיום קטן כשמגיעים לסימן העצירה.
    useEffect(() => {
        if (done && !reduce) sound.chime();
    }, [done, reduce]);

    return (
        <div dir={dir}>
            <div className="mb-3 flex items-center gap-3">
                {/* טבעת המנוע: מסתובבת כשהלולאה רצה */}
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden>
                    {done ? (
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${a.border} ${a.text}`}>
                            <Square size={11} fill="currentColor" />
                        </span>
                    ) : (
                        <motion.span
                            className={`h-9 w-9 rounded-full border-2 border-t-transparent ${a.border} ${a.text}`}
                            animate={playing && !reduce ? { rotate: 360 } : { rotate: 0 }}
                            transition={playing && !reduce ? { repeat: Infinity, duration: 0.85, ease: 'linear' } : { duration: 0 }}
                        />
                    )}
                </span>
                <span className={`text-sm font-bold ${a.text}`}>
                    {v.tokenLabel} <span className="font-mono" dir="ltr">{n}/{v.words.length}</span>
                </span>
                {!reduce && !done && (
                    <VizButton accent={accent} onClick={() => setPlaying((p) => !p)}>
                        {playing ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />}
                        {playing ? v.pause : v.play}
                    </VizButton>
                )}
            </div>

            {/* התשובה הנבנית, טוקן אחרי טוקן */}
            <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2">
                {v.words.slice(0, n).map((w, i) => (
                    <motion.span
                        key={i}
                        initial={reduce ? false : { opacity: 0, y: 6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 20 }}
                        className={`rounded-md border ${a.border} bg-slate-950/60 px-2 py-0.5 text-sm font-bold ${a.text}`}
                    >
                        {w}
                    </motion.span>
                ))}
                {!done && !reduce && playing && (
                    <motion.span
                        aria-hidden
                        className={`h-4 w-0.5 ${a.solid}`}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                    />
                )}
                {done && (
                    <motion.span
                        initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18 }}
                        className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-slate-900 px-2 py-0.5 text-xs font-bold text-slate-400"
                    >
                        <Square size={9} fill="currentColor" aria-hidden />
                        {v.stopLabel}
                    </motion.span>
                )}
            </div>
            <Caption>{v.caption}</Caption>
        </div>
    );
}

/* ════════════ מפה ועוטף ════════════ */

const VIZ_MAP: Record<StationVizKind, React.FC<VizProps>> = {
    request: RequestViz,
    tokenize: TokenizeViz,
    ids: IdsViz,
    embedding: EmbeddingViz,
    position: PositionViz,
    context: ContextViz,
    attention: AttentionViz,
    mix: MixViz,
    layers: LayersViz,
    state: StateViz,
    logits: LogitsViz,
    scores: ScoresViz,
    decoding: DecodingViz,
    loop: LoopViz,
};

// משך רצף הפתיחה המשוער של כל סצנה (מילישניות). לולאת התצוגה ממתינה לסוף
// הרצף ועוד 3 שניות, ואז מריצה את הסצנה מחדש, כאילו נלחץ "הפעלה מחדש".
const VIZ_RUN_MS: Record<StationVizKind, number> = {
    request: 3600,
    tokenize: 1500,
    ids: 2000,
    embedding: 1700,
    position: 2800,
    context: 2100,
    attention: 1500,
    mix: 4000,
    layers: 3000,
    state: 2600,
    logits: 2600,
    scores: 2200,
    decoding: 2700,
    loop: 5200,
};
const LOOP_PAUSE_MS = 3000;

/**
 * מתג השתקה גלובלי יחיד לכל סצנות התחנות. מוצג פעם אחת מעל המפה (לא בכל
 * כרטיס), ומשתיק או מפעיל את הצלילים של כל 14 התחנות יחד.
 */
export const VizSoundToggle: React.FC = () => {
    const { t, dir } = useT();
    const viz = t.behindAi.introVisuals.viz;
    const [on, setOn] = useState(sound.enabled);
    useEffect(() => { armVizAudio(); }, []);
    return (
        <button
            type="button"
            dir={dir}
            onClick={() => { sound.enabled = !sound.enabled; setOn(sound.enabled); if (sound.enabled) sound.tick(2); }}
            aria-pressed={on}
            className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/15 px-3.5 py-1.5 text-xs font-bold text-cyan-200 transition-colors hover:bg-cyan-900/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
            {on ? <Volume2 size={13} aria-hidden /> : <VolumeX size={13} aria-hidden />}
            {on ? viz.soundOff : viz.soundOn}
        </button>
    );
};

export const StationViz: React.FC<{ kind: StationVizKind; accent: Accent; reduce: boolean }> = ({ kind, accent, reduce }) => {
    const { t, dir } = useT();
    const viz = t.behindAi.introVisuals.viz;
    // key=runId: כל עלייה טוענת את הסצנה מחדש (ידנית או מלולאת התצוגה).
    const [runId, setRunId] = useState(0);
    // לולאת תצוגה: כל עוד הכרטיס פתוח ואף אחד לא נגע בסצנה, היא רצה שוב ושוב.
    // מגע בסצנה עוצר את הלולאה (הלומד השתלט); "הפעלה מחדש" מחזירה אותה.
    const [looping, setLooping] = useState(!reduce);
    useEffect(() => { armVizAudio(); }, []);

    useEffect(() => {
        if (!looping || reduce) return;
        const id = window.setTimeout(() => setRunId((r) => r + 1), VIZ_RUN_MS[kind] + LOOP_PAUSE_MS);
        return () => window.clearTimeout(id);
    }, [looping, runId, reduce, kind]);

    const stopLoop = () => setLooping(false);
    const Cmp = VIZ_MAP[kind];
    return (
        <div className="mt-3 rounded-xl border border-white/5 bg-slate-950/40 p-3.5" dir={dir}>
            <div className="mb-1.5 flex justify-end">
                <button
                    type="button"
                    onClick={() => { setLooping(!reduce); setRunId((r) => r + 1); }}
                    className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-0.5 text-xs font-bold text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                >
                    <RotateCcw size={12} aria-hidden />
                    {viz.replay}
                </button>
            </div>
            <div key={runId} onPointerDownCapture={stopLoop} onKeyDownCapture={stopLoop}>
                <Cmp accent={accent} reduce={reduce} viz={viz} dir={dir} />
            </div>
        </div>
    );
};
