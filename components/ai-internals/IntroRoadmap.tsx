"use client";

// components/ai-internals/IntroRoadmap.tsx
//
// מפת התחנות המרכזיות של המבוא: 14 תחנות, מקובצות לארבעה אזורי-למידה, מהטקסט
// ועד התשובה. זו המפה הראשית של המבוא, לא רובד עומק אופציונלי.
//
// ── אינטראקציה ────────────────────────────────────────────────────────────────
// כל תחנה היא disclosure נגיש: כותרת והסבר קצר תמיד גלויים, ולחיצה פותחת פאנל עם
// "מה קורה כאן / למה זה חשוב / מה נראה בהמשך", ולעיתים המחשה שמלמדת את המושג.
// הכפתור נושא aria-expanded ו-aria-controls, תומך במקלדת, ובעל טבעת פוקוס גלויה.
//
// ── תוכן מבחוץ ────────────────────────────────────────────────────────────────
// הרכיב ניטרלי לתוכן: הטקסט מגיע מ-introContent (מוכן ל-i18n). כאן חיים רק
// האייקונים, הצבעים, הפריסה והאנימציה.

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Keyboard, Scissors, Hash, Network, ListOrdered, MessageCircle,
    Focus, Shuffle, Layers, Brain, BarChart3, Percent, GitBranch, Repeat,
    CornerDownLeft, ChevronDown, ChevronUp, Presentation, X,
} from 'lucide-react';
import { ACCENTS, type AccentStyle } from './accents';
import type { Accent } from './types';
import { StationViz, STATION_PALETTE, STATION_RGB, haptic } from './IntroStationViz';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';
import { useT } from '@/i18n/useT';
import type {
    RoadmapStation, RoadmapZone, RoadmapZoneId,
} from '@/app/behind-the-scenes-ai/introduction/introContent';
import type { Direction } from '@/i18n/config';

// תוויות מסגרת קצרות של המפה, מהמילון (introVisuals.roadmap).
type RoadmapLabels = { peek: string; zone: string; loopBadge: string };

// גוון לכל אזור: מסע צבעוני מהקלט (cyan) אל ההכרעה (purple). משמש למסגרת האזור.
const ZONE_ACCENT: Record<RoadmapZoneId, Accent> = {
    A: 'cyan',
    B: 'blue',
    C: 'indigo',
    D: 'purple',
};

// צבע ייחודי ואקזוטי לכל תחנה מגיע מ-STATION_PALETTE (IntroStationViz), כדי
// שהכרטיס והסצנה החיה יחלקו את אותו גוון. הצבע מזהה את התחנה לאורך כל המפה.

// אייקון לכל תחנה לפי id. רמז ויזואלי בלבד, לא ניתן לתרגום ולכן נשמר כאן.
const STATION_ICON: Record<string, React.ReactNode> = {
    request: <Keyboard size={18} />,
    tokenize: <Scissors size={18} />,
    ids: <Hash size={18} />,
    embedding: <Network size={18} />,
    position: <ListOrdered size={18} />,
    context: <MessageCircle size={18} />,
    attention: <Focus size={18} />,
    mix: <Shuffle size={18} />,
    layers: <Layers size={18} />,
    state: <Brain size={18} />,
    logits: <BarChart3 size={18} />,
    softmax: <Percent size={18} />,
    decoding: <GitBranch size={18} />,
    loop: <Repeat size={18} />,
};

/* ── טיפול הצבע של כרטיס התחנה (נורמליזציה ויזואלית) ──────────────────────────
   צבע הזהות של התחנה נשאר, אבל הוא כבר לא צובע את כל הכרטיס. כרטיס סגור יושב על
   משטח סלייט ניטרלי, והזהות נשמרת בסימנים מעטים: פס-השדרה, המספר, האייקון והמסגרת
   כשהכרטיס פתוח. כך "מודגש" הופך למצב, לא לברירת המחדל של כל 14 התחנות.

   ה-RGB מגיע מ-STATION_RGB (ייבוא קריאה-בלבד; הפלטה עצמה לא משתנה, כדי שפרק 1
   שצורך את STATION_PALETTE יישאר זהה). STATION_INK מחזיק רק את שני הגוונים שנמדדו
   מתחת ל-4.5:1 גם על המשטח המנוטרל, בבהירות מעט גבוהה יותר ובאותו גוון. */
// הערכים נפתרו מול המשטח *הפתוח* (הבהיר מבין השניים), כדי שיעברו את הסף גם כשהתחנה
// פתוחה וגם כשהיא סגורה.
const STATION_INK: Record<string, string> = {
    position: '169 88 255',  // מקור #a24bff - 4.59:1 ומעלה
    decoding: '132 107 255', // מקור #6c4dff - 4.57:1 ומעלה
};
const inkOf = (id: string) => STATION_INK[id] ?? STATION_RGB[id] ?? '148 163 184';

/* ── Focus Stage: אב-טיפוס לתחנה 1 בלבד ─────────────────────────────────────────
   תחנה פתוחה היא יחידת הלמידה הנוכחית, לא אקורדיון צבעוני. רק התחנה הזו מקבלת את
   הפריסה (צד קריאה + מכשיר, והכיתוב הקיים מתחתיהם), את המשטח הניטרלי ואת המיקום
   בחלון בפתיחה מפורשת. תחנות 2-14 נשארות כפי שהן עד לאישור העיצוב. */
const FOCUS_STAGE_STATION_ID = 'request';

/* ── כרטיס תחנה בודד (disclosure) ── */
// open/onToggle מנוהלים מרמת המפה (אקורדיון מונחה-גלילה, אחד פתוח בכל רגע).
// registerRef רושם את שורש הכרטיס אצל ה-IntersectionObserver של המפה.
// snap: פתיחה מיידית בלי אנימציית גובה (מצב הדגמה). כך הפריסה מתייצבת בפריים אחד
// והגלילה ל"מרכז/ראש" נוחתת מדויק, בלי שהתחנה תזוז אחרי הפתיחה.
function StationCard({ station, n, a, reduce, snap, roadmapLabels, hint, open, candidate, onToggle, registerRef }: { station: RoadmapStation; n: number; a: AccentStyle; reduce: boolean; snap: boolean; roadmapLabels: RoadmapLabels; hint?: string; open: boolean; candidate: boolean; onToggle: () => void; registerRef: (id: string, el: HTMLElement | null) => void }) {
    const panelId = useId();
    const isLoop = station.id === 'loop';
    const setRef = useCallback((el: HTMLDivElement | null) => registerRef(station.id, el), [registerRef, station.id]);
    const instant = reduce || snap;
    const rgb = STATION_RGB[station.id] ?? '148 163 184';
    const ink = inkOf(station.id);
    const focusStation = station.id === FOCUS_STAGE_STATION_ID;
    const stage = open && focusStation;
    // יעד הכיתוב של Focus Stage (StationViz מרנדר אליו את הכיתוב הקיים, פעם אחת).
    const [captionSlot, setCaptionSlot] = useState<HTMLDivElement | null>(null);

    return (
        <div
            ref={setRef}
            data-station-id={station.id}
            // עוגן הגלילה במצב הדגמה: התחנה נוחתת מתחת לכותרת הקבועה (--bts-sticky-top,
            // גובה הכותרת שנמדד ב-ChapterLayout) בתוספת מרווח נשימה, כדי שלא תיפתח גבוה מדי.
            //
            // הצבע: סגור = משטח סלייט ניטרלי; מועמד = רמז מסגרת עדין בגוון התחנה; פתוח =
            // מסגרת בגוון מלא + גוון-רקע דק מאוד + הילה מרוסנת. הזוהר הרחב הקודם (a.glow)
            // ירד: הוא סימן "פעיל" גם כשהכרטיס רק ישב במקומו.
            //
            // Focus Stage (תחנה 1 פתוחה): משטח סלייט ניטרלי, מסגרת ניטרלית ועומק שקט במקום
            // הילה. במובייל הכרטיס מתרחב אל ריפוד האזור בצד ההתחלה בלבד, כדי לפנות רוחב קריאה
            // בלי להיכנס מתחת למסילת-הקצה הצפה שיושבת בצד הסוף.
            style={{
                scrollMarginTop: 'calc(var(--bts-sticky-top, 6rem) + 1.75rem)',
                borderColor: stage ? 'rgba(71 85 105 / 0.55)' : open ? `rgba(${rgb} / 0.45)` : candidate ? `rgba(${rgb} / 0.3)` : 'rgba(51 65 85 / 0.5)',
                backgroundColor: stage ? 'rgba(15 23 42 / 0.92)' : open ? `rgba(${rgb} / 0.05)` : 'rgba(15 23 42 / 0.4)',
                boxShadow: stage ? '0 24px 48px -32px rgba(2 6 23 / 0.9)' : open ? `0 0 28px -16px rgba(${rgb} / 0.55)` : 'none',
            }}
            className={stage
                ? 'relative overflow-hidden rounded-2xl border transition-shadow duration-500 max-md:-ms-5 max-md:rounded-s-none max-md:border-s-0'
                : 'relative overflow-hidden rounded-2xl border transition-shadow duration-500'}
        >
            {/* פס-שדרה צבעוני בקצה-ההתחלה: "נטען" עמום כשהכרטיס מכוון בגלילה (candidate),
                ונדלק במלואו כשהוא נפתח - כך רואים אילו כרטיס עומד להיפתח.
                תחנה 1 (Focus Stage) לא מרנדרת אותו כלל: אם העיצוב היה תלוי ב-open, הסגירה
                הייתה מחזירה את הפס המלא בזמן שאנימציית היציאה שלו עוד רצה. */}
            {!focusStation && (
                <motion.span
                    aria-hidden
                    className={`pointer-events-none absolute inset-y-0 start-0 w-1 ${a.solid}`}
                    initial={false}
                    animate={{ scaleY: open ? 1 : candidate ? 0.5 : 0, opacity: open ? 1 : candidate ? 0.45 : 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
                    style={{ originY: 0 }}
                />
            )}
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-start gap-3.5 p-3.5 text-start transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 md:p-4"
            >
                {/* תג מספר רץ. עד כאן היה מילוי רווי בגוון התחנה עם טקסט לבן, שנמדד
                    ב-3.19:1 עד 3.61:1 בגוונים הבהירים. עכשיו: משטח כהה ניטרלי, המספר
                    עצמו בגוון התחנה (שם נשארת הזהות), וטבעת פנימית דקה במקום המילוי. */}
                <motion.span
                    animate={open && !reduce && !stage ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
                    className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                        backgroundColor: 'rgba(2 6 23 / 0.7)',
                        color: `rgb(${ink})`,
                        boxShadow: `inset 0 0 0 1px rgba(${rgb} / ${stage ? 0.4 : open ? 0.55 : 0.35})`,
                    }}
                    dir="ltr"
                >
                    {n}
                </motion.span>

                {/* אייקון: נשאר בגוון הזהות המלא (גרפיקה, לא טקסט) */}
                <span className="mt-1 shrink-0" style={{ color: stage ? `rgba(${rgb} / 0.8)` : `rgb(${rgb})` }} aria-hidden>
                    {STATION_ICON[station.id]}
                </span>

                {/* טקסט */}
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={stage ? 'text-lg font-bold leading-tight text-white md:text-xl' : 'text-base font-bold leading-tight text-white'}>{station.title}</span>
                        {isLoop && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: `rgb(${ink})` }}>
                                <CornerDownLeft size={13} aria-hidden />
                                {roadmapLabels.loopBadge}
                            </span>
                        )}
                    </span>
                </span>

                {/* מחוון פתיחה: רמז ברור שאפשר להציץ פנימה */}
                <span className="mt-0.5 flex shrink-0 items-center gap-1.5">
                    {!open && <span className="hidden text-xs font-bold sm:inline" style={{ color: `rgb(${ink})` }}>{roadmapLabels.peek}</span>}
                    <motion.span
                        aria-hidden
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full border"
                        style={stage ? {
                            borderColor: 'rgba(100 116 139 / 0.5)',
                            backgroundColor: 'transparent',
                            color: 'rgb(203 213 225)',
                        } : {
                            borderColor: `rgba(${rgb} / ${open ? 0.45 : 0.28})`,
                            backgroundColor: open ? `rgba(${rgb} / 0.08)` : 'rgba(2 6 23 / 0.4)',
                            color: `rgb(${ink})`,
                        }}
                    >
                        <ChevronDown size={15} />
                    </motion.span>
                </span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        initial={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={instant ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={instant ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        {stage ? (
                            // Focus Stage: צד קריאה (מה לשים לב אליו) ומכשיר (מה מפעילים), ומתחתם
                            // הכיתוב הקיים כמשפט הסיכום. שתי עמודות רק כשרוחב הכרטיס עצמו מספיק
                            // (container query), כי הסרגל הצדדי משנה את הרוחב הזמין. סדר ה-DOM
                            // נשאר לינארי: רמז, מונח, הסבר, מכשיר, כיתוב.
                            <div className="@container px-4 pb-5 pt-1 md:px-5">
                                <div className="grid gap-4 @min-[560px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @min-[560px]:gap-6">
                                    <div className="min-w-0">
                                        {hint && <p className="text-base font-semibold leading-relaxed text-slate-50">{hint}</p>}
                                        <div className="mt-3 flex items-center justify-between gap-2.5">
                                            {station.term && <code dir="ltr" className="rounded-md border border-slate-600/60 bg-slate-950/60 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-300">{station.term}</code>}
                                            <SpeakButton
                                                text={speakJoin(station.title, station.term, station.explanation, station.detail, hint)}
                                                className="ms-auto shrink-0"
                                            />
                                        </div>
                                        <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{station.detail ?? station.explanation}</p>
                                    </div>
                                    {station.viz && (
                                        <motion.div
                                            className="min-w-0"
                                            initial={reduce ? false : { opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.06 }}
                                        >
                                            <StationViz kind={station.viz} a={a} reduce={reduce} focusStage={{ captionSlot }} />
                                        </motion.div>
                                    )}
                                </div>
                                <div ref={setCaptionSlot} className="mt-5 border-t border-slate-700/60 pt-4" />
                            </div>
                        ) : (
                            <div className="border-t px-3.5 pb-4 pt-3 md:px-4" style={{ borderColor: `rgba(${rgb} / 0.32)` }}>
                                {/* מהות התחנה בקול: הקראת הכותרת, ההסבר ורמז התחנה הפתוחה.
                                    עד M12 הרמז הוצג כטקסט רק מתחת ל-xl, כי מעל זה הוא ישב בבועת
                                    מנטור-הצד. הבועה ירדה יחד עם הפורטרט, ולכן הרמז הוא עכשיו הטקסט
                                    היחיד שנושא אותו, והוא גלוי בכל רוחב מסך כשורה משלו מעל פרטי התחנה. */}
                                {hint && <p className="mb-2.5 text-sm font-bold leading-relaxed" style={{ color: `rgb(${ink})` }}>{hint}</p>}
                                <div className="mb-2.5 flex items-start justify-between gap-2.5">
                                    <div>
                                        {station.term && <code dir="ltr" className="rounded-md border bg-slate-950/60 px-1.5 py-0.5 font-mono text-[11px] font-bold" style={{ borderColor: `rgba(${rgb} / 0.35)`, color: `rgb(${ink})` }}>{station.term}</code>}
                                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{station.detail ?? station.explanation}</p>
                                    </div>
                                    <SpeakButton
                                        text={speakJoin(station.title, station.term, station.explanation, station.detail, hint)}
                                        className="ms-auto shrink-0"
                                    />
                                </div>
                                {/* הסצנה החיה היא ההעמקה: היא מתנגנת מיד, ושורת התובנה שלה נושאת את הטקסט */}
                                {station.viz && (
                                    <motion.div
                                        initial={reduce ? false : { opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.06 }}
                                    >
                                        <StationViz kind={station.viz} a={a} reduce={reduce} />
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface IntroRoadmapProps {
    zones: RoadmapZone[];
    stations: RoadmapStation[];
    reduce: boolean;
    /** כיוון הכתיבה הפעיל. נקבע בעמוד מ-useT, לא מקובע ב-rtl. */
    dir: Direction;
}

export const IntroRoadmap: React.FC<IntroRoadmapProps> = ({ zones, stations, reduce, dir }) => {
    // תוויות מסגרת קצרות (אזור / הצצה / תג הלולאה) מהמילון.
    const introVisuals = useT().t.behindAi.introVisuals;
    const roadmapLabels = introVisuals.roadmap;
    // רמז קצר לכל תחנה: מוסיף זווית מעבר להסבר שעל הכרטיס, ומוצג בראש
    // הפאנל הפתוח. מפתח המילון נשאר mentorHints (מפתח פנימי יציב, לא מתורגם).
    const mentorHints = introVisuals.viz.mentorHints as Record<string, string>;
    // מספור רץ ורציף 1..N על פני כל האזורים (סדר המערך = סדר המסלול).
    const indexById = new Map(stations.map((s, i) => [s.id, i]));

    // ── אקורדיון מונחה-גלילה ──────────────────────────────────────────────────
    // ── "התייצבות מגנטית" בגלילה ────────────────────────────────────────────────
    // הבעיה עם פתיחה-על-חצייה: גלילה ממשיכה מדפדפת בין כרטיסים לפני שמישהו נפתח.
    // הפתרון: בזמן גלילה מסמנים "מועמד" (הכרטיס הכי קרוב למרכז) ומדליקים לו רמז
    // עדין, אבל פותחים אותו רק כשמתייצבים עליו - או כשהגלילה נעצרת (idle), או
    // כשהוא נשאר במרכז מספיק זמן (dwell). כרטיס שנפתח מוחזק לפחות 700ms כדי לתת
    // זמן קריאה. כך גלילה מהירה רק "בוחרת יעד", ולא מדפדפת.
    const [openId, setOpenId] = useState<string | null>(null);
    const [candidateId, setCandidateId] = useState<string | null>(null);
    const [manualOnly, setManualOnly] = useState(false);
    useEffect(() => {
        const query = window.matchMedia('(max-width: 767px), (pointer: coarse)');
        const sync = () => setManualOnly(query.matches);
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);
    const openIdRef = useRef<string | null>(null);
    useEffect(() => { openIdRef.current = openId; }, [openId]);
    const candidateRef = useRef<string | null>(null);
    const cardEls = useRef<Map<string, HTMLElement>>(new Map());
    const holdUntil = useRef(0);

    // ── מצב הדגמה (למרצה) ──────────────────────────────────────────────────────
    // כלי הרצאה: מקפיא את הפתיחה-האוטומטית-בגלילה (המקור ל"תחנה בורחת"), מציג ניווט
    // הקודם/הבא + מונה, ומאפשר צעידה קבועה במקלדת (רווח/חצים) או במגע. חוויית הלומד
    // העצמאי (כשמכובה) נשארת כפי שהיא. הבר הצף מרונדר ב-Portal ל-body רק כש-demo פעיל,
    // מצב שמתרחש רק אחרי לחיצת משתמש בצד הלקוח, ולכן document.body קיים (בטוח ב-SSR).
    const [demo, setDemo] = useState(false);

    // גלילה יציבה אל התחנה: ראש הכרטיס נוחת באותו מקום בכל צעד (scroll-mt-24), כך
    // שהתחנה הפעילה לא "קופצת". אחרי הפריים כי הפתיחה במצב הדגמה מיידית (snap).
    // Focus Stage (תחנה 1, פתיחה מפורשת בלבד): מציבים את היחידה בחלון הלמידה הזמין, כלומר
    // מתחת לכותרת הקבועה (--bts-sticky-top) ועד תחתית מיכל הגלילה, לא לפי innerHeight.
    // FIT: כל התחנה נכנסת עם מרווחי נשימה, ולכן היא ממורכזת. TOP: לא נכנסת, ולכן ראשה
    // נוחת מתחת לכותרת והשאר בגלילה רגילה. שני פריימים: הפאנל עלה והכיתוב עבר ליעדו.
    // הגובה נלקח מהתוכן הפנימי, שכבר בגובהו הסופי גם בזמן שאנימציית הגובה רצה, והסצנה
    // שומרת את גובה תצוגת המודל מראש, כך שהחשיפה המאוחרת לא מזיזה את התחנה.
    const positionFocusStage = useCallback((id: string) => {
        if (typeof window === 'undefined') return;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            const card = cardEls.current.get(id);
            const head = card?.querySelector<HTMLElement>(':scope > button');
            const body = card?.querySelector<HTMLElement>('[role="region"] > div');
            let scroller = card?.parentElement ?? null;
            while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
            if (!card || !head || !body || !scroller) return;
            const box = scroller.getBoundingClientRect();
            const stickyTop = parseFloat(getComputedStyle(scroller).getPropertyValue('--bts-sticky-top'));
            const top = Number.isFinite(stickyTop) ? Math.max(box.top, stickyTop - 8) : box.top;
            const available = box.bottom - top;
            const height = head.offsetHeight + body.offsetHeight + (card.offsetHeight - card.clientHeight);
            const margin = Math.min(32, Math.max(12, available * 0.03));
            const target = height <= available - 2 * margin ? top + (available - height) / 2 : top + 12;
            scroller.scrollBy({ top: card.getBoundingClientRect().top - target, behavior: reduce ? 'instant' : 'smooth' });
        }));
    }, [reduce]);

    const scrollToCard = useCallback((id: string) => {
        if (typeof window === 'undefined') return;
        if (id === FOCUS_STAGE_STATION_ID) { positionFocusStage(id); return; }
        requestAnimationFrame(() => {
            cardEls.current.get(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        });
    }, [reduce, positionFocusStage]);

    const registerRef = useCallback((id: string, el: HTMLElement | null) => {
        if (el) cardEls.current.set(id, el); else cardEls.current.delete(id);
    }, []);

    // פתיחת כרטיס מתוך הגלילה: מכבדת "החזקה מינימלית" (700ms) כדי שכל כרטיס יקבל
    // רגע קריאה ולא ידופדף מיד על ידי הבא.
    const commitOpen = useCallback((id: string | null) => {
        if (!id || id === openIdRef.current) return;
        if (Date.now() < holdUntil.current) return;
        holdUntil.current = Date.now() + 700;
        setOpenId(id);
    }, []);

    const toggle = useCallback((id: string) => {
        haptic();
        holdUntil.current = Date.now() + 700;
        // במצב הדגמה לחיצה בוחרת תחנה (תמיד נפתחת, לא נסגרת) כדי שהתחנה הפעילה לא
        // תיעלם באמצע הסבר; מחוץ למצב הדגמה מתנהג כאקורדיון רגיל.
        if (demo) { setOpenId(id); scrollToCard(id); return; }
        // Focus Stage: רק פתיחה מפורשת של תחנה 1 מציבה אותה בחלון (לא סגירה, ולא פתיחה מגלילה).
        if (id === FOCUS_STAGE_STATION_ID && openIdRef.current !== id) positionFocusStage(id);
        setOpenId((prev) => (prev === id ? null : id));
    }, [demo, scrollToCard, positionFocusStage]);

    // צעד הדגמה: קדימה/אחורה תחנה אחת (נעצר בקצוות), פותח מיידית וגולל למקום יציב.
    const step = useCallback((delta: number) => {
        haptic();
        const cur = openIdRef.current;
        const from = cur ? stations.findIndex((s) => s.id === cur) : 0;
        const to = Math.max(0, Math.min(stations.length - 1, from + delta));
        const id = stations[to].id;
        holdUntil.current = 0;
        setOpenId(id);
        scrollToCard(id);
    }, [stations, scrollToCard]);

    // כניסה/יציאה ממצב הדגמה. בכניסה מוודאים שתחנה אחת פתוחה (הנוכחית או הראשונה)
    // וגוללים אליה, ומנקים סימון-מועמד שנשאר מהגלילה הרגילה.
    const toggleDemo = useCallback(() => {
        setDemo((on) => {
            const next = !on;
            if (next) {
                const id = openIdRef.current ?? stations[0].id;
                setOpenId(id);
                setCandidateId(null);
                scrollToCard(id);
            }
            return next;
        });
    }, [stations, scrollToCard]);

    useEffect(() => {
        // ב-reduced-motion אין פתיחה אוטומטית מונחית-גלילה (הכרטיסים נשארים ידניים).
        // במצב הדגמה מכובה לגמרי: המרצה שולט בצעדים, ושום דבר לא נפתח מעצמו בגלילה.
        if (reduce || demo || manualOnly || typeof window === 'undefined') return;
        let raf = 0;
        let dwell = 0;
        let idle = 0;

        // מוצא את הכרטיס הכי קרוב למרכז המסך; מסמן אותו כמועמד, ומתזמן פתיחה
        // רק אם הוא יציב (dwell) - כלומר הגלילה האטה או נעצרה עליו.
        const evaluate = () => {
            const center = window.innerHeight / 2;
            let best: string | null = null;
            let bestDist = Infinity;
            cardEls.current.forEach((el, id) => {
                const r = el.getBoundingClientRect();
                const d = Math.abs((r.top + r.bottom) / 2 - center);
                if (d < bestDist) { bestDist = d; best = id; }
            });
            // מועמד רק אם הוא באמת קרוב למרכז, אחרת גלילה בקצה הסקשן לא תפתח כלום.
            if (best && bestDist > window.innerHeight * 0.3) best = null;
            setCandidateId(best);
            // dwell מתאפס רק כשהמועמד מתחלף, כך שגם בגלילה איטית-רציפה כרטיס
            // שנשאר במרכז ~220ms ייפתח (ולא רק כשעוצרים לגמרי).
            if (best !== candidateRef.current) {
                candidateRef.current = best;
                window.clearTimeout(dwell);
                if (best) dwell = window.setTimeout(() => commitOpen(candidateRef.current), 220);
            }
        };

        const onScroll = () => {
            // idle: כשמפסיקים לגלול, פותחים את המועמד הנוכחי (נחיתה על יעד) ומנקים
            // את סימון-המועמד, כדי שהרמז העמום לא יישאר "תקוע" על כרטיס סגור.
            window.clearTimeout(idle);
            idle = window.setTimeout(() => {
                commitOpen(candidateRef.current);
                candidateRef.current = null;
                setCandidateId(null);
            }, 150);
            if (raf) return;
            raf = requestAnimationFrame(() => { raf = 0; evaluate(); });
        };

        // capture:true תופס גם גלילה של מיכל פנימי (הפריסה גוללת ב-container מקונן).
        window.addEventListener('scroll', onScroll, { capture: true, passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll, { capture: true });
            if (raf) cancelAnimationFrame(raf);
            window.clearTimeout(dwell);
            window.clearTimeout(idle);
        };
    }, [reduce, demo, manualOnly, commitOpen]);

    // ── מקלדת במצב הדגמה בלבד (כמו שלט מצגת) ──────────────────────────────────
    // רווח = הבא. חצים מודעי-כיוון: ב-RTL חץ שמאלה מתקדם, ימינה חוזר; ב-LTR הפוך.
    // Esc יוצא ממצב הדגמה. מתעלמים כשמקלידים בשדה קלט. ברווח מבטלים פוקוס מכפתור
    // כדי שלא תהיה הפעלה כפולה (window + click של הכפתור הממוקד).
    //
    // capture:true בכוונה: ChapterLayout מאזין לחצים לניווט-בין-פרקים ב-bubble ומדלג
    // כש-defaultPrevented. מאזין ה-capture שלנו רץ לפניו, ולכן preventDefault כאן גורם
    // לניווט-הפרקים לדלג. כך במצב הדגמה החצים מזיזים תחנות ולא מחליפים פרק.
    useEffect(() => {
        if (!demo || typeof window === 'undefined') return;
        const onKey = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement | null;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                (document.activeElement as HTMLElement | null)?.blur?.();
                step(1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                step(dir === 'rtl' ? -1 : 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                step(dir === 'rtl' ? 1 : -1);
            } else if (e.key === 'Escape') {
                setDemo(false);
            }
        };
        window.addEventListener('keydown', onKey, { capture: true });
        return () => window.removeEventListener('keydown', onKey, { capture: true });
    }, [demo, dir, step]);

    // מצב הדגמה: מיקום התחנה הנוכחית למונה ולנעילת הקצוות של הניווט.
    const isRtl = dir === 'rtl';
    const demoLabels = roadmapLabels.demo;
    const total = stations.length;
    const currentIndex = openId ? stations.findIndex((s) => s.id === openId) : -1;
    const atStart = currentIndex <= 0;
    const atEnd = currentIndex >= total - 1;

    return (
        <div dir={dir} className="relative flex flex-col gap-4">
            {/* מתג מצב הדגמה: קטן ולא פולשני, נשאר מחוץ לחוויית הלומד העצמאי כשמכובה */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={toggleDemo}
                    aria-pressed={demo}
                    className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${demo ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-100' : 'border-slate-600/60 bg-slate-900/70 text-slate-300 hover:border-slate-400'}`}
                >
                    <Presentation size={15} aria-hidden />
                    {demo ? demoLabels.exit : demoLabels.start}
                </button>
            </div>

            {zones.map((zone, zi) => {
                const acc = ZONE_ACCENT[zone.id];
                const a = ACCENTS[acc];
                const zoneStations = stations.filter((s) => s.zone === zone.id);

                return (
                    <React.Fragment key={zone.id}>
                        <motion.section
                            initial={reduce ? false : { opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5, delay: reduce ? 0 : zi * 0.05 }}
                            className={`relative overflow-hidden rounded-[1.75rem] border ${a.border} bg-slate-900/55 p-5 backdrop-blur-xl md:p-6`}
                        >
                            {/* הילת-אזור: נשארת כרמז עומק בלבד. הוחלשה כדי שהאזור ייקרא
                                כמשטח קריאה רגוע ולא כמשטח מואר. */}
                            <div className={`pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full ${a.bgSoft} opacity-50 blur-[70px]`} />

                            {/* כותרת האזור */}
                            <header className="relative mb-5 flex items-start gap-3">
                                <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black ${a.border} ${a.bgSoft} ${a.text}`}>
                                    <span>{roadmapLabels.zone}</span>
                                    <span dir="ltr">{zi + 1}/{zones.length}</span>
                                </span>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-black text-white md:text-xl">{zone.title}</h3>
                                    <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{zone.caption}</p>
                                </div>
                                {/* הקראת כותרת האזור והכיתוב שלו */}
                                <SpeakButton text={speakJoin(zone.title, zone.caption)} className="ms-auto shrink-0" />
                            </header>

                            {/* תחנות האזור */}
                            <div className="relative flex flex-col gap-2.5">
                                {zoneStations.map((station) => (
                                    <StationCard
                                        key={station.id}
                                        station={station}
                                        n={(indexById.get(station.id) ?? 0) + 1}
                                        a={STATION_PALETTE[station.id] ?? ACCENTS[acc]}
                                        reduce={reduce}
                                        snap={demo}
                                        roadmapLabels={roadmapLabels}
                                        hint={mentorHints[station.id]}
                                        open={openId === station.id}
                                        candidate={candidateId === station.id && openId !== station.id}
                                        onToggle={() => toggle(station.id)}
                                        registerRef={registerRef}
                                    />
                                ))}
                            </div>
                        </motion.section>

                        {/* מחבר בין אזורים */}
                        {zi < zones.length - 1 && (
                            <div className="flex items-center justify-center gap-2 py-0.5 text-slate-600" aria-hidden>
                                <span className="h-5 w-px bg-gradient-to-b from-transparent to-slate-600/60" />
                                <span className="text-xs font-bold">▼</span>
                                <span className="h-5 w-px bg-gradient-to-t from-transparent to-slate-600/60" />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}

            {/* דוק ניווט אנכי למצב הדגמה: מוצמד לקצה הצד דרך Portal ל-body כדי לצאת מכל
                stacking context (טרנספורמים של סקשנים, מסך מלא) ולהישאר נגיש במגע. יושב
                בצד הפנימי (הרחק מהסרגל-הצדדי בקצה הקריאה) כדי לא לכסות את התחנות. הכיוון
                אנכי: למעלה=הקודם, למטה=הבא, תואם לרשימת התחנות. z גבוה מהמסך-המלא (9999). */}
            {demo && createPortal(
                <motion.div
                    dir={dir}
                    initial={reduce ? false : { opacity: 0, x: isRtl ? -12 : 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                    className={`fixed top-1/2 z-[10000] -translate-y-1/2 ${isRtl ? 'left-2 sm:left-3' : 'right-2 sm:right-3'}`}
                >
                    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
                        <button
                            type="button"
                            onClick={() => step(-1)}
                            disabled={atStart}
                            aria-label={demoLabels.prev}
                            title={demoLabels.prev}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-600/60 bg-slate-800/70 text-slate-100 transition-colors hover:border-cyan-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-40 disabled:hover:border-slate-600/60"
                        >
                            <ChevronUp size={20} aria-hidden />
                        </button>

                        {/* מונה קומפקטי: מספר נוכחי מעל הסך-הכל. הטקסט המלא זמין לקוראי-מסך. */}
                        <div className="flex flex-col items-center py-0.5" aria-live="polite">
                            <span className="sr-only">{demoLabels.counter(Math.max(1, currentIndex + 1), total)}</span>
                            <span aria-hidden className="text-base font-black leading-none text-cyan-100">{Math.max(1, currentIndex + 1)}</span>
                            <span aria-hidden className="my-1 h-px w-4 bg-cyan-500/40" />
                            <span aria-hidden className="text-xs font-bold leading-none text-slate-400" dir="ltr">{total}</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => step(1)}
                            disabled={atEnd}
                            aria-label={demoLabels.next}
                            title={demoLabels.next}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/50 bg-cyan-500/15 text-cyan-50 transition-colors hover:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-40"
                        >
                            <ChevronDown size={20} aria-hidden />
                        </button>

                        <span className="my-0.5 h-px w-6 bg-slate-700" aria-hidden />

                        <button
                            type="button"
                            onClick={() => setDemo(false)}
                            aria-label={demoLabels.exit}
                            title={demoLabels.exit}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-600/60 bg-slate-800/70 text-slate-300 transition-colors hover:border-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                            <X size={18} aria-hidden />
                        </button>
                    </div>
                </motion.div>,
                document.body,
            )}
        </div>
    );
};
