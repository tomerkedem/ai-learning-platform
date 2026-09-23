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
import { usePortalTheme } from './usePortalTheme';
import { SpeakButton } from './SpeakButton';
import { speakJoin } from './GuessVerdict';
import { useT } from '@/i18n/useT';
import type {
    RoadmapStation, RoadmapZone, RoadmapZoneId,
} from '@/app/(course)/behind-the-scenes-ai/introduction/introContent';
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
   משטח סלייט ניטרלי, והזהות נשמרת בסימנים מעטים: המספר, האייקון, רמז המסגרת כשהכרטיס
   מכוון בגלילה, והסימנים הפדגוגיים בתוך הסצנה. כך "מודגש" הופך למצב, לא לברירת
   המחדל של כל 14 התחנות. פס-השדרה בגובה מלא ירד לגמרי עם ההצטרפות המלאה ל-Focus Stage.

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

/* ── Focus Stage: כל 14 התחנות ──────────────────────────────────────────────────
   תחנה פתוחה היא יחידת הלמידה הנוכחית, לא אקורדיון צבעוני: פריסת צד-קריאה + מכשיר,
   הכיתוב הקיים מתחתיהם כמשפט סיכום, משטח סלייט ניטרלי ומיקום בחלון הלמידה בפתיחה
   מפורשת. אחרי ההצטרפות המלאה אין יותר "תחנה שאינה תחנת-במה", ולכן אין רשימת
   הצטרפות ואין ענף עיצוב מקביל: הסגנון הקודם (פס-שדרה בגובה מלא, משטח בגוון התחנה)
   אינו קיים במבנה, וממילא אינו יכול להבזיק בפתיחה או בסגירה. */

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
    // יעד הכיתוב של Focus Stage (StationViz מרנדר אליו את הכיתוב הקיים, פעם אחת).
    const [captionSlot, setCaptionSlot] = useState<HTMLDivElement | null>(null);

    return (
        <div
            ref={setRef}
            data-station-id={station.id}
            // עוגן הגלילה במצב הדגמה: התחנה נוחתת מתחת לכותרת הקבועה (--bts-sticky-top,
            // גובה הכותרת שנמדד ב-ChapterLayout) בתוספת מרווח נשימה, כדי שלא תיפתח גבוה מדי.
            //
            // הצבע: סגור = משטח סלייט ניטרלי; מועמד = רמז מסגרת עדין בגוון התחנה; פתוח
            // (תחנת-במה) = משטח סלייט ניטרלי, מסגרת ניטרלית ועומק שקט במקום הילה. הזוהר
            // הרחב הקודם (a.glow) ירד: הוא סימן "פעיל" גם כשהכרטיס רק ישב במקומו.
            //
            // במובייל הכרטיס הפתוח מתרחב אל ריפוד האזור בצד ההתחלה בלבד, כדי לפנות רוחב
            // קריאה בלי להיכנס מתחת למסילת-הקצה הצפה שיושבת בצד הסוף.
            style={{
                scrollMarginTop: 'calc(var(--bts-sticky-top, 6rem) + 1.75rem)',
                borderColor: open ? 'var(--bts-border-emphasis)' : candidate ? `rgba(${rgb} / 0.3)` : 'var(--bts-border)',
                backgroundColor: open ? 'var(--bts-surface-elevated)' : 'var(--bts-surface)',
                boxShadow: open ? 'var(--bts-shadow-elevation)' : 'none',
            }}
            className={open
                ? 'relative overflow-hidden rounded-2xl border transition-shadow duration-500 max-md:-ms-5 max-md:rounded-s-none max-md:border-s-0'
                : 'relative overflow-hidden rounded-2xl border transition-shadow duration-500'}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-start gap-3.5 p-3.5 text-start transition-colors hover:bg-[var(--bts-text-primary)]/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bts-focus-ring-offset)] md:p-4"
            >
                {/* תג מספר רץ. עד כאן היה מילוי רווי בגוון התחנה עם טקסט לבן, שנמדד
                    ב-3.19:1 עד 3.61:1 בגוונים הבהירים. עכשיו: משטח כהה ניטרלי, המספר
                    עצמו בגוון התחנה (שם נשארת הזהות), וטבעת פנימית דקה במקום המילוי. */}
                <span
                    className="bts-ink relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                        backgroundColor: 'var(--bts-surface-inset)',
                        color: `rgb(${ink})`,
                        '--ink': ink,
                        boxShadow: `inset 0 0 0 1px rgba(${rgb} / ${open ? 0.4 : 0.35})`,
                    } as React.CSSProperties}
                    dir="ltr"
                >
                    {n}
                </span>

                {/* אייקון: נשאר בגוון הזהות המלא (גרפיקה, לא טקסט) */}
                <span className="mt-1 shrink-0" style={{ color: open ? `rgba(${rgb} / 0.8)` : `rgb(${rgb})` }} aria-hidden>
                    {STATION_ICON[station.id]}
                </span>

                {/* טקסט */}
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={open ? 'text-lg font-bold leading-tight text-[var(--bts-text-primary)] md:text-xl' : 'text-base font-bold leading-tight text-[var(--bts-text-primary)]'}>{station.title}</span>
                        {isLoop && (
                            <span className="bts-ink inline-flex items-center gap-1 text-xs font-bold" style={{ color: `rgb(${ink})`, '--ink': ink } as React.CSSProperties}>
                                <CornerDownLeft size={13} aria-hidden />
                                {roadmapLabels.loopBadge}
                            </span>
                        )}
                    </span>
                </span>

                {/* מחוון פתיחה: רמז ברור שאפשר להציץ פנימה */}
                <span className="mt-0.5 flex shrink-0 items-center gap-1.5">
                    {!open && <span className="bts-ink hidden text-xs font-bold sm:inline" style={{ color: `rgb(${ink})`, '--ink': ink } as React.CSSProperties}>{roadmapLabels.peek}</span>}
                    <motion.span
                        aria-hidden
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${open ? '' : 'bts-ink'}`}
                        style={(open ? {
                            borderColor: 'var(--bts-border-emphasis)',
                            backgroundColor: 'transparent',
                            color: 'var(--bts-text-secondary)',
                        } : {
                            borderColor: `rgba(${rgb} / 0.28)`,
                            backgroundColor: 'var(--bts-surface-inset)',
                            color: `rgb(${ink})`,
                            '--ink': ink,
                        }) as React.CSSProperties}
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
                        {/* Focus Stage: צד קריאה (מה לשים לב אליו) ומכשיר (מה מפעילים), ומתחתם
                            הכיתוב הקיים כמשפט הסיכום. שתי עמודות רק כשרוחב הכרטיס עצמו מספיק
                            (container query), כי הסרגל הצדדי משנה את הרוחב הזמין. סדר ה-DOM
                            נשאר לינארי: רמז, מונח, הסבר, מכשיר, כיתוב. */}
                        <div className="@container px-4 pb-5 pt-1 md:px-5">
                            <div className="grid gap-4 @min-[560px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @min-[560px]:gap-6">
                                <div className="min-w-0">
                                    {hint && <p className="text-base font-semibold leading-relaxed text-[var(--bts-text-primary)]">{hint}</p>}
                                    <div className="mt-3 flex items-center justify-between gap-2.5">
                                        {station.term && <code dir="ltr" className="rounded-md border border-[var(--bts-border-emphasis)] bg-[var(--bts-surface-inset)] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[var(--bts-text-secondary)]">{station.term}</code>}
                                        <SpeakButton
                                            text={speakJoin(station.title, station.term, station.explanation, station.detail, hint)}
                                            className="ms-auto shrink-0"
                                        />
                                    </div>
                                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--bts-text-secondary)]">{station.detail ?? station.explanation}</p>
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
                            <div ref={setCaptionSlot} className="mt-5 border-t border-[var(--bts-border)] pt-4" />
                        </div>
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
    // עוגן לא-מפורטל לגזירת נעילת-ההיקף (data-theme) של דוק הניווט המפורטל למטה.
    // ראו components/ai-internals/usePortalTheme.ts.
    const rootRef = useRef<HTMLDivElement>(null);
    const candidateRef = useRef<string | null>(null);
    const cardEls = useRef<Map<string, HTMLElement>>(new Map());
    const holdUntil = useRef(0);

    // ── מצב הדגמה (למרצה) ──────────────────────────────────────────────────────
    // כלי הרצאה: מקפיא את הפתיחה-האוטומטית-בגלילה (המקור ל"תחנה בורחת"), מציג ניווט
    // הקודם/הבא + מונה, ומאפשר צעידה קבועה במקלדת (רווח/חצים) או במגע. חוויית הלומד
    // העצמאי (כשמכובה) נשארת כפי שהיא. הבר הצף מרונדר ב-Portal ל-body רק כש-demo פעיל,
    // מצב שמתרחש רק אחרי לחיצת משתמש בצד הלקוח, ולכן document.body קיים (בטוח ב-SSR).
    const [demo, setDemo] = useState(false);
    // נגזר רק כש-demo נדלק (זה הרגע היחיד שבו דוק הניווט המפורטל בכלל מרונדר).
    const dockTheme = usePortalTheme(rootRef, demo);

    // גלילה יציבה אל התחנה: ראש הכרטיס נוחת באותו מקום בכל צעד (scroll-mt-24), כך
    // שהתחנה הפעילה לא "קופצת". אחרי הפריים כי הפתיחה במצב הדגמה מיידית (snap).
    // Focus Stage (פתיחה מפורשת בלבד): מציבים את היחידה בחלון הלמידה הזמין, כלומר
    // מתחת לכותרת הקבועה (--bts-sticky-top) ועד תחתית מיכל הגלילה, לא לפי innerHeight.
    // FIT: כל התחנה נכנסת עם מרווחי נשימה, ולכן היא ממורכזת. TOP: לא נכנסת, ולכן ראשה
    // נוחת מתחת לכותרת והשאר בגלילה רגילה. שני פריימים: הפאנל עלה והכיתוב עבר ליעדו.
    // הגובה נלקח מהתוכן הפנימי, שכבר בגובהו הסופי גם בזמן שאנימציית הגובה רצה, והסצנה
    // שומרת את גובה תצוגת המודל מראש, כך שהחשיפה המאוחרת לא מזיזה את התחנה.
    //
    // closingId: הכרטיס שנסגר באותה לחיצה. אם הוא יושב מעל תחנת היעד, הפאנל שלו עוד
    // בעיצומה של אנימציית הסגירה ברגע המדידה, ולכן תחנת היעד עוד תעלה בדיוק בגובה
    // שנשאר לו. בלי הקיזוז הזה הגלילה מחושבת מול פריסה שכבר אינה נכונה, והתחנה נוחתת
    // מעל ראש חלון הלמידה. תחנה 1 לא חשפה זאת כי אין מעליה כרטיס, ושם הקיזוז תמיד 0.
    const positionFocusStage = useCallback((id: string, closingId: string | null) => {
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
            const cardTop = card.getBoundingClientRect().top;
            let closing = 0;
            if (closingId && closingId !== id) {
                const prev = cardEls.current.get(closingId);
                const prevPanel = prev?.querySelector<HTMLElement>('[role="region"]');
                if (prev && prevPanel && prev.getBoundingClientRect().top < cardTop) {
                    closing = prevPanel.getBoundingClientRect().height;
                }
            }
            scroller.scrollBy({ top: cardTop - closing - target, behavior: reduce ? 'instant' : 'smooth' });
        }));
    }, [reduce]);

    const scrollToCard = useCallback((id: string) => {
        positionFocusStage(id, openIdRef.current);
    }, [positionFocusStage]);

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
        // Focus Stage: רק פתיחה מפורשת מציבה את התחנה בחלון (לא סגירה, ולא פתיחה מגלילה).
        if (openIdRef.current !== id) positionFocusStage(id, openIdRef.current);
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
        <div dir={dir} ref={rootRef} className="relative flex flex-col gap-4">
            {/* מתג מצב הדגמה: קטן ולא פולשני, נשאר מחוץ לחוויית הלומד העצמאי כשמכובה */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={toggleDemo}
                    aria-pressed={demo}
                    className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] ${demo ? 'border-[var(--bts-brand-primary-strong)]/70 bg-[var(--bts-brand-primary)]/20 text-[var(--bts-brand-primary-strong)]' : 'border-[var(--bts-border-emphasis)] bg-[var(--bts-surface)] text-[var(--bts-text-secondary)] hover:border-[var(--bts-brand-primary-strong)]/40'}`}
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
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : zi * 0.05 }}
                            className={`relative overflow-hidden rounded-[1.75rem] border ${a.border} bg-[var(--bts-surface)] p-5 backdrop-blur-xl md:p-6`}
                        >
                            {/* הילת-אזור: נשארת כרמז עומק בלבד ב-Dark. אווירה בלבד. */}
                            <div className={`pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full ${a.bgSoft} opacity-50 blur-[70px]`} />

                            {/* כותרת האזור. טקסט התג ניטרלי בכוונה (לא a.text): הגוון הרך של הצבע
                                (300-series) נכשל בניגודיות על משטח בהיר, וזהות האזור נשמרת דרך
                                המסגרת והרקע הרך (a.border/a.bgSoft) שעובדים היטב בשתי הערכות. */}
                            <header className="relative mb-5 flex items-start gap-3">
                                <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black ${a.border} ${a.bgSoft} text-[var(--bts-text-secondary)]`}>
                                    <span>{roadmapLabels.zone}</span>
                                    <span dir="ltr">{zi + 1}/{zones.length}</span>
                                </span>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-black text-[var(--bts-text-primary)] md:text-xl">{zone.title}</h3>
                                    <p className="mt-0.5 text-sm leading-relaxed text-[var(--bts-text-muted)]">{zone.caption}</p>
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
                            <div className="flex items-center justify-center gap-2 py-0.5 text-[var(--bts-text-muted)]" aria-hidden>
                                <span className="h-5 w-px bg-gradient-to-b from-transparent to-[var(--bts-border-emphasis)]" />
                                <span className="text-xs font-bold">▼</span>
                                <span className="h-5 w-px bg-gradient-to-t from-transparent to-[var(--bts-border-emphasis)]" />
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
                    data-theme={dockTheme}
                    initial={reduce ? false : { opacity: 0, x: isRtl ? -12 : 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                    className={`fixed top-1/2 z-[10000] -translate-y-1/2 ${isRtl ? 'left-2 sm:left-3' : 'right-2 sm:right-3'}`}
                >
                    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--bts-brand-primary-strong)]/40 bg-[var(--bts-surface-elevated)] p-1.5 shadow-2xl backdrop-blur-xl">
                        <button
                            type="button"
                            onClick={() => step(-1)}
                            disabled={atStart}
                            aria-label={demoLabels.prev}
                            title={demoLabels.prev}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--bts-border-emphasis)] bg-[var(--bts-surface)] text-[var(--bts-text-primary)] transition-colors hover:border-[var(--bts-brand-primary-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] disabled:opacity-40 disabled:hover:border-[var(--bts-border-emphasis)]"
                        >
                            <ChevronUp size={20} aria-hidden />
                        </button>

                        {/* מונה קומפקטי: מספר נוכחי מעל הסך-הכל. הטקסט המלא זמין לקוראי-מסך. */}
                        <div className="flex flex-col items-center py-0.5" aria-live="polite">
                            <span className="sr-only">{demoLabels.counter(Math.max(1, currentIndex + 1), total)}</span>
                            <span aria-hidden className="text-base font-black leading-none text-[var(--bts-brand-primary-strong)]">{Math.max(1, currentIndex + 1)}</span>
                            <span aria-hidden className="my-1 h-px w-4 bg-[var(--bts-brand-primary-strong)]/40" />
                            <span aria-hidden className="text-xs font-bold leading-none text-[var(--bts-text-muted)]" dir="ltr">{total}</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => step(1)}
                            disabled={atEnd}
                            aria-label={demoLabels.next}
                            title={demoLabels.next}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--bts-brand-primary-strong)]/50 bg-[var(--bts-brand-primary)]/15 text-[var(--bts-brand-primary-strong)] transition-colors hover:border-[var(--bts-brand-primary-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] disabled:opacity-40"
                        >
                            <ChevronDown size={20} aria-hidden />
                        </button>

                        <span className="my-0.5 h-px w-6 bg-[var(--bts-border-emphasis)]" aria-hidden />

                        <button
                            type="button"
                            onClick={() => setDemo(false)}
                            aria-label={demoLabels.exit}
                            title={demoLabels.exit}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--bts-border-emphasis)] bg-[var(--bts-surface)] text-[var(--bts-text-secondary)] transition-colors hover:border-[var(--bts-brand-primary-strong)] hover:text-[var(--bts-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)]"
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
