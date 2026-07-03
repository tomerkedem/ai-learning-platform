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
import { motion, AnimatePresence } from 'framer-motion';
import {
    Keyboard, Scissors, Hash, Network, ListOrdered, MessageCircle,
    Focus, Shuffle, Layers, Brain, BarChart3, Percent, GitBranch, Repeat,
    CornerDownLeft, ChevronDown,
} from 'lucide-react';
import { ACCENTS, type AccentStyle } from './accents';
import type { Accent } from './types';
import { StationViz, STATION_PALETTE, STATION_RGB, haptic } from './IntroStationViz';
import { Mentor, type MentorAccent } from './Mentor';
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

/* ── כרטיס תחנה בודד (disclosure) ── */
// open/onToggle מנוהלים מרמת המפה (אקורדיון מונחה-גלילה, אחד פתוח בכל רגע).
// registerRef רושם את שורש הכרטיס אצל ה-IntersectionObserver של המפה.
function StationCard({ station, n, a, reduce, roadmapLabels, open, candidate, onToggle, registerRef }: { station: RoadmapStation; n: number; a: AccentStyle; reduce: boolean; roadmapLabels: RoadmapLabels; open: boolean; candidate: boolean; onToggle: () => void; registerRef: (id: string, el: HTMLElement | null) => void }) {
    const panelId = useId();
    const isLoop = station.id === 'loop';
    const setRef = useCallback((el: HTMLDivElement | null) => registerRef(station.id, el), [registerRef, station.id]);

    return (
        <div ref={setRef} data-station-id={station.id} className={`relative overflow-hidden rounded-2xl border ${a.border} ${a.bgSoft} transition-shadow duration-500 ${open ? a.glow : candidate ? `ring-1 ${a.ringSoft}` : ''}`}>
            {/* פס-שדרה צבעוני בקצה-ההתחלה: "נטען" עמום כשהכרטיס מכוון בגלילה (candidate),
                ונדלק במלואו כשהוא נפתח - כך רואים אילו כרטיס עומד להיפתח. */}
            <motion.span
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 start-0 w-1 ${a.solid}`}
                initial={false}
                animate={{ scaleY: open ? 1 : candidate ? 0.5 : 0, opacity: open ? 1 : candidate ? 0.45 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
                style={{ originY: 0 }}
            />
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-start gap-3.5 p-3.5 text-start transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900 md:p-4"
            >
                {/* תג מספר רץ */}
                <motion.span
                    animate={open && !reduce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
                    className={`relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${a.solid} ${a.solidText}`}
                    dir="ltr"
                >
                    {n}
                </motion.span>

                {/* אייקון */}
                <span className={`mt-1 shrink-0 ${a.text}`} aria-hidden>
                    {STATION_ICON[station.id]}
                </span>

                {/* טקסט */}
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-base font-bold leading-tight text-white">{station.title}</span>
                        {station.term && (
                            <code dir="ltr" className={`rounded-md border ${a.border} bg-slate-950/60 px-1.5 py-0.5 font-mono text-[11px] font-bold ${a.text}`}>
                                {station.term}
                            </code>
                        )}
                        {isLoop && (
                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${a.text}`}>
                                <CornerDownLeft size={13} aria-hidden />
                                {roadmapLabels.loopBadge}
                            </span>
                        )}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-300">{station.explanation}</span>
                </span>

                {/* מחוון פתיחה: רמז ברור שאפשר להציץ פנימה */}
                <span className="mt-0.5 flex shrink-0 items-center gap-1.5">
                    {!open && <span className={`hidden text-xs font-bold sm:inline ${a.text}`}>{roadmapLabels.peek}</span>}
                    <motion.span
                        aria-hidden
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${a.border} ${open ? `${a.text} ${a.bgSoft}` : `${a.text} bg-slate-950/40`}`}
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
                        initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`border-t ${a.border} px-3.5 pb-4 pt-3 md:px-4`}>
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
    /** משפט מנטור-המדריך שגולש לאורך המפה אל התחנה הפתוחה (xl+). ללא טקסט - אין מנטור. */
    mentorLine?: string;
    /** רוחב מנטור-המדריך בפיקסלים. */
    mentorWidth?: number;
}

export const IntroRoadmap: React.FC<IntroRoadmapProps> = ({ zones, stations, reduce, dir, mentorLine, mentorWidth = 425 }) => {
    // תוויות מסגרת קצרות (אזור / הצצה / תג הלולאה) מהמילון.
    const introVisuals = useT().t.behindAi.introVisuals;
    const roadmapLabels = introVisuals.roadmap;
    // משפט-מנטור קצר לכל תחנה (מוסיף זווית מעבר להסבר שעל הכרטיס). ברירת מחדל:
    // כשאין תחנה פתוחה, המנטור אומר את משפט הליווי הכללי (mentorLine).
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
    const openIdRef = useRef<string | null>(null);
    useEffect(() => { openIdRef.current = openId; }, [openId]);
    const candidateRef = useRef<string | null>(null);
    const cardEls = useRef<Map<string, HTMLElement>>(new Map());
    const holdUntil = useRef(0);

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
        setOpenId((prev) => (prev === id ? null : id));
    }, []);

    useEffect(() => {
        // ב-reduced-motion אין פתיחה אוטומטית מונחית-גלילה (הכרטיסים נשארים ידניים).
        if (reduce || typeof window === 'undefined') return;
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
    }, [reduce, commitOpen]);

    // ── מנטור-המדריך שגולש לאורך המפה ─────────────────────────────────────────
    // יעד המיקום: ראש בועת-הדיבור (מעל ראש המנטור) מתיישר לראש הכרטיס הפתוח. מודדים
    // את הבועה בפועל (data-mentor-bubble) כדי לדייק בלי ניחוש. מודדים פעמיים: מוקדם
    // לתגובה מהירה, ושוב אחרי שאנימציית ה"וווש" מתייצבת (scale=1) לדיוק מלא. ה-y
    // בלתי תלוי גלילה כי הוא נמדד יחסית לשורש המפה.
    const rootRef = useRef<HTMLDivElement>(null);
    const mentorRef = useRef<HTMLDivElement>(null);
    const [mentorY, setMentorY] = useState<number | null>(null);
    useEffect(() => {
        if (!openId) return;
        const measure = () => {
            const root = rootRef.current;
            const card = cardEls.current.get(openId);
            const wrap = mentorRef.current;
            if (!root || !card || !wrap) return;
            const rr = root.getBoundingClientRect();
            const cr = card.getBoundingClientRect();
            const bubble = wrap.querySelector('[data-mentor-bubble]') as HTMLElement | null;
            if (bubble) {
                // הפרש קבוע (בלתי תלוי ב-y הנוכחי): מיקום ראש הבועה יחסית לראש עוטף המנטור.
                const wr = wrap.getBoundingClientRect();
                const br = bubble.getBoundingClientRect();
                setMentorY((cr.top - rr.top) - (br.top - wr.top));
            } else {
                // גיבוי: מרכוז אנכי על הכרטיס אם אין בועה.
                setMentorY((cr.top + cr.bottom) / 2 - rr.top - wrap.offsetHeight / 2);
            }
        };
        const t1 = window.setTimeout(measure, reduce ? 0 : 360);
        const t2 = window.setTimeout(measure, reduce ? 0 : 760);
        return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
    }, [openId, reduce]);

    // בועת-הדיבור מקבלת את גוון התחנה הפתוחה: מסגרת והילה בצבע התחנה, ורקע כהה
    // מוצלל באותו גוון (color-mix) כדי שהטקסט יישאר קריא. כשאין תחנה פתוחה -
    // undefined, והמנטור חוזר לגוון ברירת המחדל (ציאן).
    const mentorRgb = openId ? STATION_RGB[openId] : undefined;
    const mentorAccent: MentorAccent | undefined = mentorRgb
        ? {
            base: mentorRgb,
            shadow: mentorRgb,
            // טקסט בגוון בהיר (pastel) של צבע התחנה, קריא על הרקע הכהה המוצלל.
            text: `color-mix(in srgb, rgb(${mentorRgb}) 70%, white)`,
            bubbleBg: `color-mix(in srgb, rgb(${mentorRgb}) 18%, #020617)`,
        }
        : undefined;

    return (
        <div ref={rootRef} dir={dir} className="relative flex flex-col gap-4">
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
                            <div className={`pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full ${a.bgSoft} blur-[70px]`} />

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
                                        roadmapLabels={roadmapLabels}
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

            {/* מנטור-המדריך: גולש אל הכרטיס הפתוח (xl+ בלבד, דקורטיבי). ב-LTR מהופך
                אופקית כדי לפנות אל התוכן. float כבוי כדי שהגלישה תהיה התנועה היחידה. */}
            {mentorLine && (
                <motion.div
                    ref={mentorRef}
                    aria-hidden
                    className={`pointer-events-none absolute top-0 z-20 hidden xl:block ${dir === 'rtl' ? 'left-full ml-3 2xl:ml-6' : 'right-full mr-3 2xl:mr-6'}`}
                    animate={reduce
                        ? { y: mentorY ?? 0 }
                        : { y: mentorY ?? 0, scale: mentorY == null ? 1 : [1, 0.82, 1] }}
                    transition={reduce
                        ? { duration: 0 }
                        : { y: { type: 'spring', stiffness: 90, damping: 16 }, scale: { duration: 0.6, times: [0, 0.5, 1], ease: 'easeInOut' } }}
                >
                    <Mentor
                        pose="mapNavigator"
                        line={(openId ? mentorHints[openId] : undefined) ?? mentorLine}
                        width={mentorWidth}
                        flip={dir === 'ltr'}
                        float={false}
                        accent={mentorAccent}
                        bubbleWidthClass="max-w-xs"
                        bubbleTextClass="text-base leading-snug"
                    />
                </motion.div>
            )}
        </div>
    );
};
