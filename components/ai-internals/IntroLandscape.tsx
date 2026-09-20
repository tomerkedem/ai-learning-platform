"use client";

// components/ai-internals/IntroLandscape.tsx
//
// מפה קצרה של עולם ה-AI, רצף חזותי אחד:
// AI > ML > רשתות נוירונים (אותו אובייקט = Deep Learning) > שאלה אחרת: מזהה או יוצר >
// Generative AI > בחירה: איזה מסלול הוא הצ'אט > LLM > Agent כמערכת סביב אותו LLM.
//
// אפס אינטראקציות נדרשות: כל המסע רץ לבד עד הסיום (גם ב-reduced-motion, בלי תנועה).
// הלומד רשאי לקחת שליטה: צמתי המסע בצינור מאפשרים קפיצה לכל מושג (קדימה או אחורה), והקפיצה
// משהה את ההצגה. אינטראקציה לעולם לא "מתירה" להצגה להמשיך; היא רק נותנת שליטה.
//
// הקראה: הקופי (beats) הוא גם הכתוביות וגם ההקראה. כשההקראה פעילה על מקטע של המפה, ההצגה
// מתקדמת רק כשעבר זמן הצפייה המינימלי (AutoCue) וגם ההקראה של הרגע הנוכחי הסתיימה.
// כשההקראה כבויה, הטיימר החזותי לבדו קובע.

import React from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    ArrowDown, Pause, RotateCcw, Play, Sparkles, Target, Wrench,
    ClipboardCheck, FileText, Image as ImageIcon, AudioLines, Headphones,
} from 'lucide-react';
import { useT } from '@/i18n/useT';
import type { Locale } from '@/i18n/config';
import type { IntroductionDict } from '@/i18n/dictionary';
import type { ReadAloudSegment, ReadAloudStatus } from './useReadAloud';
import type { Direction } from '@/i18n/config';

type Copy = IntroductionDict['landscape'];

/** מצב ההקראה שמדווח מהדוק: המקטע הנוכחי, הסטטוס, והאם מקטע המפה הסתיים וממתין לשחרור. */
export interface LandscapeSpeech {
    id: string | null;
    status: ReadAloudStatus;
    held: boolean;
}

/** action: sync = רק עדכון הדוק במצב החזותי; play = הקראה מחדש של הרגע; release = שחרור המקטע שהסתיים. */
export type LandscapeMoment = (step: number, text: string | null, action: 'sync' | 'play' | 'release') => void;

interface Props {
    reduce: boolean;
    dir: Direction;
    speech: LandscapeSpeech;
    onMoment: LandscapeMoment;
    /** מבקש מדוק ההקראה המשותף להקריא את כל המפה מההקדמה שלה. */
    onReadAloud: () => void;
}

const SEG_PREFIX = 'landscape-';
const segId = (step: number) => `${SEG_PREFIX}${step}`;
const TEXT_STEP = 6;
const AGENT_STEP = 8;

// כותרת LLM בשתי שורות מכוונות: השם המלא בשורה אחת, והשם המקומי בסוגריים בשורה השנייה (בלי לפצל אותו). התרגום עצמו לא משתנה.
const renderTitle = (t: string) => {
    const m = /^(LLM - Large Language Model) ((.+))$/.exec(t);
    return m ? <><span className="block">{m[1]}</span><span className="inline-block">{m[2]}</span></> : t;
};

// כותרת + גוף למשפט הקראה אחד. יפנית מסיימת ב-。 ובלי רווח.
const narrate = (locale: Locale, t: string, b: string) =>
    /[.?!。？！]$/.test(t) ? `${t}${locale === 'ja' ? '' : ' '}${b}` : locale === 'ja' ? `${t}。${b}` : `${t}. ${b}`;

/**
 * מקטעי ההקראה של המפה: מקטע לרגע מושגי, כולם hold חוץ מהאחרון (ההצגה משחררת אותם).
 * textOverride מחליף את מקטע רגע הבחירה (טקסט/תמונה/שמע) כשהתצוגה מציגה משוב.
 */
export const buildLandscapeSegments = (c: Copy, locale: Locale, textOverride: string | null): ReadAloudSegment[] => [
    // ההקדמה נקראת פעם אחת לפני המושג הראשון; אינה hold וההצגה אינה עוקבת אחריה.
    { id: `${SEG_PREFIX}intro`, label: c.eyebrow, text: c.intro.join(' ') },
    ...c.beats.map((b, i) => ({
        id: segId(i),
        label: b.t,
        text: i === TEXT_STEP && textOverride
            ? textOverride
            : i === AGENT_STEP ? `${narrate(locale, b.t, b.b)}${locale === 'ja' ? '' : ' '}${c.agentNote}` : narrate(locale, b.t, b.b),
        hold: i < c.beats.length - 1,
    })),
];

// ── רצף ──
// 0 AI, 1 ML, 2 רשת נוירונים, 3 עמוקה, 4 מזהה מול יוצר, 5 Generative AI,
// 6 טקסט/תמונה/שמע (אופציונלי; בלי מגע ממקד אוטומטית בטקסט), 7 LLM, 8 Agent, 9 סיום (CTA ידני).
const AUTO_MS: Record<number, number> = { 0: 6000, 1: 7000, 2: 7000, 3: 7000, 4: 7000, 5: 6000, 6: 7000, 7: 6000, 8: 10000 };
const LAST = 9;
const TEXT_FOCUS_MS = 4000; // אחרי שהזמן לחקור נגמר: ההצגה ממקדת בטקסט ואז ממשיכה ל-LLM

// צמתי המסע: מפת המושגים של הלומד (לא מכונת המצבים). enter = השלב שבו המושג מתחיל,
// jump = לאן קופצים בלחיצה, pct = מיקום בצינור. "מזהה מול יוצר" הוא פתיחה של Generative AI, לא מושג נפרד.
const NODES = [
    { enter: 0, jump: 0 },
    { enter: 1, jump: 1 },
    { enter: 2, jump: 2 },
    { enter: 3, jump: 3 },
    { enter: 4, jump: 5 },
    { enter: 7, jump: 7 },
    { enter: 8, jump: 8 },
    { enter: 9, jump: 9 }, // מסך הסיום: יעד ניווט, לא מושג נוסף
] as const;

// התקדמות לפי רגע מושגי בלבד (לא לפי אנימציה). מתחיל מלא חלקית, ומגיע ל-100 רק בסיום.
const PROGRESS = [8, 20, 32, 44, 54, 62, 70, 82, 92, 100];

type TileId = 'text' | 'image' | 'audio';
type Pos = { x: number; y: number; w: number; h: number; o: number };

// מיקומי האריחים באחוזי הבמה (הבמה ביחס 8/7, אותה מערכת קואורדינטות כמו ה-viewBox 400x350).
const TILE_POS: Record<TileId, (step: number) => Pos> = {
    text: (s) => s >= 7 ? { x: 50, y: 46, w: 31, h: 35.4, o: 1 } : { x: 18, y: 62, w: 25, h: 30, o: s >= 5 ? 1 : 0 },
    image: (s) => s >= 7 ? { x: 13, y: 46, w: 15, h: 17.1, o: s === 8 ? 0 : 0.4 } : { x: 50, y: 62, w: 25, h: 30, o: s >= 5 ? 1 : 0 },
    audio: (s) => s >= 7 ? { x: 87, y: 46, w: 15, h: 17.1, o: s === 8 ? 0 : 0.4 } : { x: 82, y: 62, w: 25, h: 30, o: s >= 5 ? 1 : 0 },
};
const TILE_ICON: Record<TileId, React.ComponentType<{ size?: number; className?: string }>> = {
    text: FileText, image: ImageIcon, audio: AudioLines,
};

// רשת נוירונים: 6 עמודות (קלט, 4 נסתרות, פלט). ברשת הרדודה 3 העמודות האמצעיות מקופלות על עמודה 1.
const COL_NODES = [3, 4, 4, 4, 4, 2];
const NODE_YS = (n: number) => Array.from({ length: n }, (_, i) => 185 + (i - (n - 1) / 2) * 50);
const colX = (col: number, deep: boolean) => {
    if (deep) return 60 + col * 56;
    return col === 0 ? 90 : col === 5 ? 310 : 200;
};

// הטיימר היחיד של הרגע הנוכחי: אותו מונה קובע גם את הספירה, גם את הפס וגם את המעבר.
// מוצב עם key=step, ולכן כל רגע מתחיל מחדש ואף טיימר ישן לא יכול להזיז רגע מאוחר.
// השהיה עוצרת את המונה ושומרת את הזמן שנותר; המשך ממשיך משם. השניות אינן מוכרזות (aria-hidden).
const AutoCue: React.FC<{
    ms: number; paused: boolean; hold: boolean; copy: Copy; locale: Locale; onDone: () => void;
}> = ({ ms, paused, hold, copy, locale, onDone }) => {
    const [left, setLeft] = React.useState(ms);
    const done = React.useRef(false);
    const onDoneRef = React.useRef(onDone);
    React.useEffect(() => { onDoneRef.current = onDone; });

    React.useEffect(() => {
        if (paused) return;
        let last = performance.now();
        const id = window.setInterval(() => {
            const now = performance.now();
            const dt = now - last;
            last = now;
            setLeft((l) => Math.max(0, l - dt));
        }, 100);
        return () => window.clearInterval(id);
    }, [paused]);

    // זמן הצפייה המינימלי עבר. אם ההקראה של הרגע עדיין רצה (hold), ממתינים לסיומה.
    React.useEffect(() => {
        if (left > 0 || hold || done.current) return;
        done.current = true;
        onDoneRef.current();
    }, [left, hold]);

    const n = Math.max(1, Math.ceil(left / 1000));
    const time = copy.seconds[new Intl.PluralRules(locale).select(n)].replace('{n}', String(n));
    const label = paused ? copy.paused : left <= 0 && hold ? copy.waitingNarration : copy.next.replace('{time}', time);

    return (
        <div aria-hidden className="flex flex-col items-center gap-1.5">
            <span className="text-sm tabular-nums text-[var(--bts-text-muted)]">{label}</span>
            <span className="h-[3px] w-24 overflow-hidden rounded-full bg-[var(--bts-fill-track)]">
                <span
                    className="block h-full rounded-full bg-[var(--bts-brand-primary)]/60 transition-[width] duration-100 ease-linear"
                    style={{ width: `${(left / ms) * 100}%` }}
                />
            </span>
        </div>
    );
};

export const IntroLandscape: React.FC<Props> = ({ reduce, dir, speech, onMoment, onReadAloud }) => {
    const { t, locale } = useT();
    const c = t.behindAi.introduction.landscape;
    const isRtl = dir === 'rtl';
    const mx = (x: number) => (isRtl ? 100 - x : x); // מראה באחוזים (במה)
    const vx = (x: number) => (isRtl ? 400 - x : x); // מראה ביחידות viewBox
    const uid = React.useId().replace(/:/g, '');

    const rootRef = React.useRef<HTMLElement>(null);
    const inView = useInView(rootRef, { once: true, amount: 0.5 });
    const [heard, setHeard] = React.useState(false); // ההקראה הגיעה למפה: מתחילים גם בלי שהמפה בתצוגה
    const [step, setStep] = React.useState(0);
    const stepRef = React.useRef(step);
    React.useEffect(() => { stepRef.current = step; });
    const [maxStep, setMaxStep] = React.useState(0); // "ביקרתי": לא משנה את המיקום הנוכחי
    const [paused, setPaused] = React.useState(false);
    const [picked, setPicked] = React.useState<'image' | 'audio' | null>(null);
    const [textFocus, setTextFocus] = React.useState(false);
    const [restart, setRestart] = React.useState(0); // מחליף את הטיימר (ספירה חדשה) בניווט ישיר או בחקירה

    // ── הקראה ──
    // narrating: ההקראה קוראת כרגע מקטע של המפה. רק אז ההקראה מעכבת את ההצגה.
    // narrationDone: מקטע הרגע הנוכחי הסתיים והדוק ממתין (ולא מושהה בדוק).
    const speechOn = speech.status === 'speaking' || speech.status === 'paused';
    const narrating = speechOn && !!speech.id?.startsWith(SEG_PREFIX);
    const narrationDone = !narrating || (speech.held && speech.status === 'speaking' && speech.id === segId(step));

    const hintOf = (p: 'image' | 'audio') => (p === 'image' ? c.hintImage : c.hintAudio);
    // הטקסט שמוקרא ברגע הבחירה כשהתצוגה מציגה משוב (הסבר או מיקוד בטקסט); null = הקופי הרגיל.
    const feedbackText = (pick: 'image' | 'audio' | null, focus: boolean) =>
        focus ? narrate(locale, c.textFocus.t, pick ? hintOf(pick) : c.textFocus.b) : pick ? hintOf(pick) : null;

    const moveTo = (next: number) => {
        setStep(next);
        setMaxStep((m) => Math.max(m, next));
        setPicked(null);
        setTextFocus(false);
    };
    // הטיימר היחיד (AutoCue) מפעיל גם את המעבר וגם את הספירה; ה-key שלו מבטל כל טיימר ישן.
    // הוא מפעיל את onDone רק אחרי שהזמן המינימלי עבר וגם ההקראה של הרגע (אם פעילה) הסתיימה.
    const onTimerDone = () => {
        if (step === TEXT_STEP && !textFocus) {
            setTextFocus(true);
            setPicked(null);
            onMoment(TEXT_STEP, feedbackText(null, true), narrating ? 'play' : 'sync');
            return;
        }
        if (step < LAST) {
            moveTo(step + 1);
            onMoment(step + 1, null, narrating ? 'release' : 'sync');
        }
    };
    // ניווט ישיר: מבטל טיימר, קופץ, משהה ומשאיר את המושג עד שהלומד לוחץ המשך (ספירה חדשה).
    // אם ההקראה פעילה היא עוברת מיד למושג שנבחר.
    const goTo = (target: number) => {
        moveTo(target);
        setPaused(true);
        setRestart((n) => n + 1);
        onMoment(target, null, speechOn ? 'play' : 'sync');
    };
    // צפייה מחדש: מאפס הכול ל-AI ומפעיל ניגון מיד (בניגוד לצומת AI שמשהה לעיון).
    const resetVisual = () => {
        setStep(0);
        setMaxStep(0);
        setPicked(null);
        setTextFocus(false);
        setPaused(false);
        setRestart((n) => n + 1);
    };
    const replay = () => {
        resetVisual();
        onMoment(0, null, speechOn ? 'play' : 'sync');
    };
    // טריגר מקומי: מקריא את כל המפה מההקדמה דרך דוק ההקראה המשותף. ההצגה חוזרת ל-AI כדי
    // שתהיה מסונכרנת עם ההקראה; אם המפה כבר מוקראת, לא מתחילים הקראה כפולה.
    const readAloud = () => {
        if (narrating) return;
        resetVisual();
        setHeard(true);
        onMoment(0, null, 'sync');
        onReadAloud();
    };
    const choose = (id: TileId) => {
        if (step !== TEXT_STEP) return;
        if (id === 'text') { moveTo(7); onMoment(7, null, narrating ? 'play' : 'sync'); return; }
        setPicked(id);
        setTextFocus(false);
        setRestart((n) => n + 1); // זמן חדש לקרוא את ההסבר לפני שההצגה ממשיכה
        onMoment(TEXT_STEP, feedbackText(id, false), narrating ? 'play' : 'sync');
    };
    // ההקראה עברה למקטע אחר של המפה (הקראה מההתחלה, קטעים, הבא/הקודם בדוק): ההצגה עוקבת אחריה.
    // כשההצגה כבר באותו רגע (מעבר שההצגה עצמה יזמה) אין מה לעשות.
    React.useEffect(() => {
        const m = /^landscape-(\d+)$/.exec(speech.id ?? '');
        if (!m) return;
        setHeard(true);
        const k = Number(m[1]);
        if (k === stepRef.current) return;
        setStep(k);
        setMaxStep((prev) => (k === 0 ? 0 : Math.max(prev, k)));
        setPicked(null);
        setTextFocus(false);
        setPaused(false);
        setRestart((n) => n + 1);
        onMoment(k, null, 'sync');
    }, [speech.id, onMoment]);
    const openEngine = () => {
        (rootRef.current?.nextElementSibling as HTMLElement | null)
            ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };

    const tf = step === TEXT_STEP && textFocus;
    const beat = tf ? c.textFocus : c.beats[step];
    const body = step === TEXT_STEP && picked ? hintOf(picked) : beat.b;
    const tileLabel: Record<TileId, string> = { text: c.tileText, image: c.tileImage, audio: c.tileAudio };
    const move = reduce ? { duration: 0 } : { duration: 0.9, ease: [0.4, 0, 0.2, 1] as const };
    const fade = reduce ? { duration: 0 } : { duration: 0.6 };

    // ── סצנה א: AI > ML > רשת (SVG) ──
    const sceneA = step <= 3;
    const deep = step === 3;
    const aiState = step === 0
        ? { r: 125, opacity: 1 } : step === 1 ? { r: 125, opacity: 0.55 } : { r: 420, opacity: 0 };
    const mlState = step === 0
        ? { cy: 170, r: 50, opacity: 0 }
        : step === 1 ? { cy: 170, r: 83, opacity: 1 } : { cy: 145, r: 125, opacity: 1 };
    const DOTS: [number, number][] = [[104, 158], [296, 141], [154, 59], [252, 64], [275, 220]];

    // ── קישורי הרשת ──
    const links: { key: string; c: number; a: number; b: number }[] = [];
    for (let c = 0; c < 5; c++)
        for (let a = 0; a < COL_NODES[c]; a++)
            for (let b = 0; b < COL_NODES[c + 1]; b++) links.push({ key: `${c}-${a}-${b}`, c, a, b });

    // ── מסלולי חיבור ל-Generative AI (viewBox) ──
    const curve = (x1: number, y1: number, x2: number, y2: number, bend: number) =>
        `M${vx(x1)} ${y1} C${vx(x1)} ${y1 + bend} ${vx(x2)} ${y2 - bend} ${vx(x2)} ${y2}`;
    const llmFocus = step >= 7;
    const pathFor: Record<TileId, string> = llmFocus
        ? { text: curve(200, 64, 200, 102, 12), image: curve(200, 64, 52, 131, 30), audio: curve(200, 64, 348, 131, 30) }
        : { text: curve(200, 74, 72, 166, 25), image: curve(200, 74, 200, 166, 25), audio: curve(200, 74, 328, 166, 25) };
    const pathOpacity: Record<TileId, number> = step >= 5 && step !== 8
        ? (llmFocus ? { text: 0.7, image: 0.3, audio: 0.3 } : { text: 0.6, image: 0.6, audio: 0.6 })
        : { text: 0, image: 0, audio: 0 };

    // ── סצנת Agent ──
    const agent = step === 8;
    const P = (x: number, y: number) => `${vx(x)} ${y}`;
    const arrow = {
        toGoal: `M${P(200, 99)} L${P(200, 80)}`,
        toTools: `M${P(152, 209)} C${P(134, 212)} ${P(122, 218)} ${P(114, 226)}`,
        toResults: `M${P(130, 266)} C${P(168, 280)} ${P(232, 280)} ${P(270, 266)}`,
        toModel: `M${P(288, 226)} C${P(278, 218)} ${P(264, 213)} ${P(248, 209)}`,
    };
    const stagger = (i: number) => (agent && !reduce ? { duration: 0.6, delay: 0.5 + i * 0.35 } : fade);

    const glow = 'bg-[var(--bts-brand-primary)]/8';

    // ── צינור הזרימה: חלק שהושלם מואר, עתיד שקט. חלקיקים רק כשאין reduced-motion. ──
    const pct = PROGRESS[step];
    const flowCount = step < 2 ? 2 : step < 5 ? 4 : 6; // דליל בהתחלה, צפוף יותר עם הרשת
    const laneY = (i: number) => (step === 5 || step === 6 ? [30, 50, 70][i % 3] : 50); // הסתעפות ב-Generative AI, מיקוד ב-LLM

    return (
        <section ref={rootRef} dir={dir} className="mt-20" aria-label={c.regionLabel}>
            {speech.status !== 'unsupported' && (
                <div className="mb-3 flex justify-center">
                    <button
                        type="button" onClick={readAloud} aria-disabled={narrating}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)] ${narrating ? 'border-[var(--bts-brand-primary)] bg-[var(--bts-brand-primary)]/10 text-[var(--bts-brand-primary-strong)]' : 'border-[var(--bts-border)] bg-[var(--bts-surface)] text-[var(--bts-text-secondary)] hover:border-[var(--bts-brand-primary)]/50 hover:text-[var(--bts-text-primary)]'}`}
                    >
                        <Headphones size={16} aria-hidden /> {c.readAloud}
                    </button>
                </div>
            )}
            <div className="mx-auto mb-5 max-w-xl space-y-2 text-center text-base leading-relaxed text-[var(--bts-text-secondary)]">
                {c.intro.map((line) => <p key={line}>{line}</p>)}
            </div>
            <p className="mb-3 text-center text-base font-bold text-[var(--bts-brand-primary-strong)] md:text-lg">
                {c.eyebrow}
            </p>

            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--bts-border)] bg-[var(--bts-surface-elevated)] p-3 shadow-2xl backdrop-blur-2xl md:p-5">
                <div className={`pointer-events-none absolute -top-20 -end-16 h-64 w-64 rounded-full ${glow} blur-[90px]`} />
                <div className="pointer-events-none absolute -bottom-20 -start-12 h-72 w-72 rounded-full bg-[var(--bts-brand-secondary)]/8 blur-[100px]" />

                {/* צינור זרימת ה-AI: מטאפורה חזותית להתקדמות, לא מודל של איך רשת עובדת */}
                <div className="relative mx-auto mb-3 w-full max-w-[460px]">
                <div
                    role="progressbar" aria-label={c.progressLabel} aria-valuetext={beat.t}
                    aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
                    className="relative h-5 w-full overflow-hidden rounded-full border border-[var(--bts-border-emphasis)] bg-[var(--bts-surface-inset)] shadow-[inset_0_2px_5px_var(--bts-shadow-lift)] backdrop-blur-md"
                >
                    <motion.div
                        className="absolute inset-y-0 start-0 overflow-hidden rounded-full bg-gradient-to-r from-[var(--bts-brand-secondary)] to-[var(--bts-brand-primary)] shadow-[0_0_14px_-2px_var(--bts-brand-primary)] rtl:bg-gradient-to-l"
                        initial={false} animate={{ width: `${pct}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="absolute inset-0 motion-reduce:hidden rtl:-scale-x-100" aria-hidden>
                            {Array.from({ length: 6 }, (_, i) => {
                                const on = i < flowCount;
                                return (
                                    <motion.span
                                        key={i}
                                        className="absolute h-[3px] w-[3px] rounded-full bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.9)]"
                                        style={{ y: '-50%' }}
                                        initial={false}
                                        animate={{
                                            top: `${laneY(i)}%`,
                                            left: on ? ['-4%', '104%'] : '-4%',
                                            opacity: on ? [0, 1, 1, 0] : 0,
                                        }}
                                        transition={{
                                            top: move,
                                            left: { duration: 3.4 + i * 0.5, delay: i * 0.55, repeat: Infinity, ease: 'linear' },
                                            opacity: { duration: 3.4 + i * 0.5, delay: i * 0.55, repeat: Infinity, ease: 'linear', times: [0, 0.15, 0.85, 1] },
                                        }}
                                    />
                                );
                            })}
                        </div>
                        {/* קצה מואר: נשאר גם ב-reduced-motion */}
                        <span className="absolute inset-y-0 end-0 w-6 bg-[radial-gradient(closest-side,rgba(255,255,255,0.85),transparent)] opacity-80" aria-hidden />
                    </motion.div>
                    <span className="pointer-events-none absolute inset-x-2 top-px h-1/2 rounded-full bg-gradient-to-b from-white/15 to-transparent [[data-theme=light]_&]:from-white/70" aria-hidden />
                </div>
                </div>

                {/* ══ הבמה ══ */}
                <div className="relative mx-auto aspect-[400/290] w-full max-w-[460px] overflow-hidden rounded-3xl bg-[var(--bts-surface-inset)]">
                    {/* הקנבס המקורי (8/7) מעוגן למעלה; החלון מציג את 290 היחידות העליונות שלו */}
                    <div className="absolute inset-x-0 top-0 aspect-[8/7]">

                    {/* סצנה א: AI > ML > רשת נוירונים */}
                    <motion.svg
                        viewBox="0 0 400 350" className="absolute inset-0 h-full w-full" aria-hidden
                        initial={false} animate={{ opacity: sceneA ? 1 : 0 }} transition={fade}
                    >
                        <defs>
                            <radialGradient id={`${uid}ai`}>
                                <stop offset="0%" style={{ stopColor: 'var(--bts-brand-primary)', stopOpacity: 0.05 }} />
                                <stop offset="100%" style={{ stopColor: 'var(--bts-brand-primary)', stopOpacity: 0.22 }} />
                            </radialGradient>
                            <radialGradient id={`${uid}ml`}>
                                <stop offset="0%" style={{ stopColor: 'var(--bts-brand-secondary)', stopOpacity: 0.06 }} />
                                <stop offset="100%" style={{ stopColor: 'var(--bts-brand-secondary)', stopOpacity: 0.26 }} />
                            </radialGradient>
                        </defs>

                        <motion.circle
                            cx={200} cy={145} fill={`url(#${uid}ai)`} strokeWidth={2}
                            style={{ stroke: 'var(--bts-brand-primary)' }}
                            initial={false} animate={aiState} transition={move}
                        />
                        {DOTS.map(([x, y], i) => (
                            <motion.circle
                                key={i} cx={x} r={5} style={{ fill: 'var(--bts-brand-primary)' }}
                                initial={false}
                                animate={{ cy: reduce ? y : [y, y - 6, y], opacity: step <= 1 ? 0.5 : 0 }}
                                transition={{
                                    cy: reduce ? { duration: 0 } : { duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' },
                                    opacity: fade,
                                }}
                            />
                        ))}
                        <motion.text
                            textAnchor="middle" dominantBaseline="middle" fontWeight={900}
                            style={{ fill: 'var(--bts-text-primary)' }}
                            initial={false}
                            animate={step === 0 ? { x: 200, y: 145, fontSize: 64, opacity: 1 } : { x: 200, y: 39, fontSize: 24, opacity: step === 1 ? 1 : 0 }}
                            transition={move}
                        >AI</motion.text>

                        <motion.circle
                            cx={200} fill={`url(#${uid}ml)`} strokeWidth={2}
                            style={{ stroke: 'var(--bts-brand-secondary)' }}
                            initial={false} animate={mlState} transition={move}
                        />
                        <motion.text
                            textAnchor="middle" dominantBaseline="middle" fontWeight={900}
                            style={{ fill: 'var(--bts-text-primary)' }}
                            initial={false}
                            animate={step <= 1 ? { x: 200, y: 170, fontSize: 40, opacity: step === 1 ? 1 : 0 } : { x: 200, y: 36, fontSize: 20, opacity: 0 }}
                            transition={move}
                        >ML</motion.text>

                        {/* רשת נוירונים: אותו אובייקט הופך ל-Deep Learning כשהשכבות נפרשות */}
                        <g transform="translate(200 145) scale(0.76) translate(-200 -185)">
                        <motion.rect
                            x={96} y={85} width={208} height={200} rx={24}
                            style={{ fill: 'var(--bts-brand-secondary)' }}
                            initial={false} animate={{ opacity: deep ? 0.12 : 0 }} transition={fade}
                        />
                        {links.map(({ key, c, a, b }) => {
                            const ysA = NODE_YS(COL_NODES[c]);
                            const ysB = NODE_YS(COL_NODES[c + 1]);
                            const shown = step >= 2 && (deep || c === 0 || c === 4);
                            return (
                                <motion.line
                                    key={key} strokeWidth={1.3} style={{ stroke: 'var(--bts-text-muted)' }}
                                    initial={false}
                                    animate={{
                                        x1: vx(colX(c, deep)), x2: vx(colX(c + 1, deep)), y1: ysA[a], y2: ysB[b],
                                        opacity: shown ? 0.3 : 0,
                                    }}
                                    transition={move}
                                />
                            );
                        })}
                        {COL_NODES.map((n, col) =>
                            NODE_YS(n).map((y, i) => {
                                const visible = step >= 2 && (deep || col === 0 || col === 1 || col === 5);
                                const edge = col === 0 || col === 5;
                                return (
                                    <motion.circle
                                        key={`${col}-${i}`} r={9}
                                        style={{ fill: edge ? 'var(--bts-text-muted)' : 'var(--bts-brand-secondary)' }}
                                        initial={false}
                                        animate={{
                                            cx: vx(colX(col, deep)), cy: y,
                                            opacity: visible ? (reduce ? 1 : [1, 0.55, 1]) : 0,
                                        }}
                                        transition={{
                                            cx: move,
                                            cy: move,
                                            opacity: visible && !reduce
                                                ? { duration: 2.6, repeat: Infinity, delay: col * 0.3 + i * 0.1 }
                                                : fade,
                                        }}
                                    />
                                );
                            }),
                        )}
                        <motion.text
                            x={200} y={306} textAnchor="middle" fontSize={19} fontWeight={700}
                            style={{ fill: 'var(--bts-text-secondary)' }}
                            initial={false} animate={{ opacity: deep ? 1 : 0 }} transition={fade}
                        >{c.manyLayers}</motion.text>
                        </g>
                    </motion.svg>

                    {/* סצנה ב: מזהה מול יוצר */}
                    <motion.div
                        className="absolute inset-x-0 top-0 flex h-[82.9%] items-center justify-center gap-3 p-3" aria-hidden
                        initial={false} animate={{ opacity: step === 4 ? 1 : 0 }} transition={fade}
                    >
                        {[
                            { id: 'recognize', label: c.recognize, from: <ImageIcon size={26} />, to: <span className="text-lg font-bold">{c.cat}</span>, create: false },
                            { id: 'create', label: c.create, from: <span className="text-lg font-bold">{c.cat}</span>, to: <span className="relative"><ImageIcon size={26} /><Sparkles size={14} className="absolute -top-2 -end-3 text-[var(--bts-brand-primary-strong)]" /></span>, create: true },
                        ].map((p) => (
                            <motion.div
                                key={p.id}
                                className={`flex w-[46%] flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-[var(--bts-text-primary)] ${p.create ? 'border-[var(--bts-brand-primary)] bg-[var(--bts-surface)]' : 'border-[var(--bts-border-emphasis)] bg-[var(--bts-surface)]'}`}
                                initial={false}
                                animate={step === 4
                                    ? (p.create ? { scale: [1, 1, 1.04], opacity: 1 } : { opacity: [1, 1, 0.4], scale: 1 })
                                    : { scale: 1, opacity: 1 }}
                                transition={reduce ? { duration: 0 } : { duration: 4, times: [0, 0.6, 1] }}
                            >
                                <span className={`text-sm font-black sm:text-base ${p.create ? 'text-[var(--bts-brand-primary-strong)]' : 'text-[var(--bts-text-secondary)]'}`}>{p.label}</span>
                                <span className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--bts-surface-inset)] sm:h-14">{p.from}</span>
                                <ArrowDown size={18} className="text-[var(--bts-text-muted)]" />
                                <span className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--bts-surface-inset)] sm:h-14">{p.to}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Generative AI: חיבורים, כותרת ואריחים. אותם אריחים ממשיכים ל-LLM ול-Agent */}
                    <svg viewBox="0 0 400 350" className="absolute inset-0 h-full w-full" aria-hidden>
                        {(['text', 'image', 'audio'] as TileId[]).map((id) => (
                            <motion.path
                                key={id} fill="none" strokeWidth={2} strokeLinecap="round"
                                style={{ stroke: 'var(--bts-brand-primary)' }}
                                initial={false} animate={{ d: pathFor[id], opacity: pathOpacity[id] }} transition={move}
                            />
                        ))}
                    </svg>

                    <motion.div
                        className="absolute flex items-center justify-center gap-2 rounded-full border border-[var(--bts-brand-primary)] bg-[var(--bts-surface)] text-[var(--bts-text-primary)]"
                        style={{ x: '-50%', y: '-50%', left: '50%', height: '12.6%', width: '46%' }}
                        aria-hidden initial={false}
                        animate={{ top: step >= 7 ? '12%' : '15%', opacity: step === 8 || step < 5 ? 0 : step >= 7 ? 0.5 : 1 }}
                        transition={move}
                    >
                        <Sparkles size={16} className="text-[var(--bts-brand-primary-strong)]" />
                        <span className="text-sm font-black">Generative AI</span>
                    </motion.div>

                    {(['image', 'audio', 'text'] as TileId[]).map((id) => {
                        const p = { ...TILE_POS[id](step) };
                        if (tf && id !== 'text') p.o = 0.4;
                        const Icon = TILE_ICON[id];
                        const isLlm = id === 'text' && llmFocus;
                        const chip = id !== 'text' && llmFocus;
                        const active = step === 6;
                        return (
                            <motion.button
                                key={id} type="button" onClick={() => choose(id)}
                                disabled={!active} tabIndex={active ? 0 : -1} aria-hidden={!active}
                                aria-label={active ? tileLabel[id] : undefined}
                                className={`absolute flex flex-col items-center justify-center gap-1 border text-[var(--bts-text-primary)] transition-[border-color,box-shadow,background-color] duration-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)] disabled:cursor-default ${isLlm ? 'border-[var(--bts-brand-primary)] bg-[var(--bts-surface)] shadow-[0_0_40px_-6px_var(--bts-brand-primary)]' : tf && id === 'text' ? 'border-[var(--bts-brand-primary)] bg-[var(--bts-surface)] shadow-[0_0_28px_-6px_var(--bts-brand-primary)]' : `bg-[var(--bts-surface)] ${picked === id ? 'border-[var(--bts-status-caution)]' : 'border-[var(--bts-border-emphasis)]'}`} ${active ? 'cursor-pointer hover:border-[var(--bts-brand-primary)]' : ''}`}
                                style={{ x: '-50%', y: '-50%' }}
                                initial={false}
                                animate={{
                                    left: `${mx(p.x)}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%`,
                                    opacity: p.o, borderRadius: isLlm || chip ? '999px' : '22px',
                                }}
                                transition={move}
                            >
                                <span className={`flex flex-col items-center gap-1 transition-opacity duration-500 ${isLlm ? 'opacity-0' : 'opacity-100'} ${isLlm ? 'absolute' : ''}`}>
                                    <Icon size={chip ? 16 : 28} className="text-[var(--bts-brand-primary-strong)]" />
                                    <span className={chip ? 'text-[10px] font-bold' : 'text-base font-bold'}>{tileLabel[id]}</span>
                                </span>
                                {id === 'text' && (
                                    <span className={`flex flex-col items-center transition-opacity duration-500 ${isLlm ? 'opacity-100' : 'absolute opacity-0'}`}>
                                        <span className="text-2xl font-black leading-none">LLM</span>
                                        <span className="mt-1 text-xs font-bold text-[var(--bts-text-secondary)]">{c.llmSub}</span>
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}

                    {/* Agent: מערכת שמופיעה סביב אותו LLM */}
                    <motion.div
                        className="pointer-events-none absolute inset-x-[3%] top-[3%] bottom-[20%] rounded-[28px] border-2 border-dashed border-[var(--bts-brand-secondary)] bg-[var(--bts-brand-secondary)]/6"
                        aria-hidden initial={false} animate={{ opacity: agent ? 1 : 0 }} transition={stagger(0)}
                    />
                    <motion.div
                        className="pointer-events-none absolute start-1/2 top-[3%] -translate-y-1/2 rounded-full bg-[var(--bts-brand-secondary)] px-4 py-1 text-sm font-black text-white ltr:-translate-x-1/2 rtl:translate-x-1/2"
                        aria-hidden initial={false} animate={{ opacity: agent ? 1 : 0 }} transition={stagger(0)}
                    >Agent</motion.div>
                    <motion.svg
                        viewBox="0 0 400 350" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden
                        initial={false} animate={{ opacity: agent ? 1 : 0 }} transition={stagger(3)}
                    >
                        <defs>
                            <marker id={`${uid}ar`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                                <path d="M0 0 L10 5 L0 10 z" style={{ fill: 'var(--bts-brand-secondary)' }} />
                            </marker>
                        </defs>
                        {Object.values(arrow).map((d) => (
                            <path key={d} d={d} fill="none" strokeWidth={2} strokeLinecap="round"
                                style={{ stroke: 'var(--bts-brand-secondary)' }} markerEnd={`url(#${uid}ar)`} />
                        ))}
                    </motion.svg>
                    {[
                        { x: 50, y: 17, label: c.goal, Icon: Target },
                        { x: 27, y: 69.5, label: c.tools, Icon: Wrench },
                        { x: 73, y: 69.5, label: c.results, Icon: ClipboardCheck },
                    ].map(({ x, y, label, Icon }, i) => (
                        <motion.div
                            key={label}
                            className="pointer-events-none absolute flex w-max min-w-[22%] items-center justify-center gap-1 rounded-[9px] border border-[var(--bts-brand-secondary)]/70 bg-[var(--bts-surface)] px-2 py-0.5 text-[var(--bts-text-primary)] sm:py-1"
                            style={{ x: '-50%', y: '-50%', left: `${mx(x)}%`, top: `${y}%` }}
                            aria-hidden initial={false} animate={{ opacity: agent ? 1 : 0 }} transition={stagger(1 + i)}
                        >
                            <Icon size={14} className="shrink-0 text-[var(--bts-brand-secondary)]" />
                            <span className="text-[13px] font-bold sm:text-sm">{label}</span>
                        </motion.div>
                    ))}
                    </div>
                </div>

                {/* ══ כיתוב + פעולה, תמיד מתחת לבמה ══ */}
                <div className="mx-auto mt-4 max-w-[460px] px-1 text-center">
                    <div
                        aria-live="polite"
                        className="outline-none"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={step === 6 && picked ? 'hint' : tf ? 'tf' : step}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                transition={{ duration: reduce ? 0 : 0.35 }}
                            >
                                <h3 className={`font-black leading-snug tracking-tight text-[var(--bts-text-primary)] ${step === 8 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                                    {renderTitle(beat.t)}
                                </h3>
                                <p className="mt-2 text-base leading-relaxed text-[var(--bts-text-secondary)]">{body}</p>
                                {step === AGENT_STEP && <p className="mt-2 text-sm leading-relaxed text-[var(--bts-text-muted)]">{c.agentNote}</p>}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* צמתי המסע: ניווט ישיר אופציונלי, מעל בקרי ההשמעה. ההצגה מתקדמת גם בלי לגעת בהם. */}
                    <nav aria-label={c.navLabel} className="mx-auto -mt-1 flex w-full max-w-[336px] items-center">
                        {NODES.map((n, i) => {
                            const next = NODES[i + 1]?.enter ?? LAST + 1;
                            const current = step >= n.enter && step < next;
                            const done = step >= next;
                            const seen = !current && !done && maxStep >= n.enter;
                            return (
                                <button
                                    key={n.enter} type="button" onClick={() => goTo(n.jump)}
                                    aria-label={c.nodes[i]} aria-current={current ? 'step' : undefined}
                                    className="group relative flex h-11 min-w-0 flex-1 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)]"
                                >
                                    {current ? (
                                        <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-white shadow-[0_0_10px_2px_var(--bts-brand-primary)] ring-2 ring-[var(--bts-brand-secondary)]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--bts-brand-secondary)]" />
                                        </span>
                                    ) : done ? (
                                        <span className="h-2 w-2 rounded-full bg-[var(--bts-brand-primary)]" />
                                    ) : (
                                        <span className={`h-2 w-2 rounded-full border-[1.5px] border-[var(--bts-text-muted)] ${seen ? 'bg-[var(--bts-text-muted)]/50' : 'bg-transparent'}`} />
                                    )}
                                    <span className="pointer-events-none absolute bottom-full z-30 mb-0.5 hidden whitespace-nowrap rounded-full border border-[var(--bts-border-emphasis)] bg-[var(--bts-surface-elevated)] px-2.5 py-1 text-xs font-bold text-[var(--bts-text-primary)] opacity-0 shadow-lg backdrop-blur-md transition-opacity group-focus-visible:opacity-100 md:block [@media(hover:hover)]:group-hover:opacity-100">
                                        {c.nodes[i]}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex min-h-14 items-center justify-center">
                        {step === LAST ? (
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    type="button" onClick={openEngine}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--bts-brand-primary)] px-8 py-3.5 text-lg font-black text-slate-950 transition-all hover:bg-[var(--bts-brand-primary-strong)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]"
                                >
                                    {c.openLlm} <ArrowDown size={20} />
                                </button>
                                <button
                                    type="button" onClick={replay}
                                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-[var(--bts-text-muted)] transition-colors hover:text-[var(--bts-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]"
                                >
                                    <RotateCcw size={15} /> {c.replay}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button" onClick={() => setPaused((p) => !p)}
                                    aria-label={paused ? c.resumeLabel : c.pauseLabel}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--bts-text-muted)] transition-colors hover:text-[var(--bts-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]"
                                >
                                    {paused ? <Play size={18} /> : <Pause size={18} />}
                                </button>
                                {/* רוחב קבוע: אין קפיצה כש-10 הופך ל-9. הטיימר מוצג רק אחרי כניסה לתצוגה, ולא בסיום. */}
                                <div className="flex min-h-[3.25rem] w-36 items-center justify-center">
                                    {(inView || heard) && (
                                        <AutoCue
                                            key={`${step}-${tf ? 'f' : 'a'}-${restart}`}
                                            ms={tf ? TEXT_FOCUS_MS : AUTO_MS[step]} paused={paused} hold={!narrationDone} copy={c} locale={locale} onDone={onTimerDone}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
