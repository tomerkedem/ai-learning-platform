"use client";

// ════════════════════════════════════════════════════════════════════════
// Learning Pulse: 19 עלי כותרת, עלה לכל פרק. מילוי פנימי = התקדמות למידה; צומת בקצה = שליטה
// (אמרלד); קו מתאר = הפרק הנוכחי. רכיבי תצוגה בלבד: הנתונים מגיעים כ-CourseLearning (המצב
// המשותף), בלי טעינה ובלי גזירה נוספת. הגאומטריה מ-learningPulseGeometry, אחידה בכל שפה (פרק 1
// בשעה 12, עם כיוון השעון, בלי שיקוף ב-RTL). אין מספרי יחידות ואין אחוז כללי.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, Flag, GraduationCap, Lock, Sparkle } from "lucide-react";
import { useT } from "@/i18n/useT";
import { formatChapterLabel } from "@/i18n/format";
import { courses } from "@/lib/courseData";
import { tField } from "@/lib/localize";
import { continueTarget, type CourseLearning } from "./learningProgress";
import { PETAL, PULSE_HALF, PULSE_VIEWBOX, fillRadius, markerPlacement, petalAngle, petalPath, wedgePath } from "./learningPulseGeometry";
import { FILL_START, FINAL_EXAM_HREF, chapterHref, continueAction, coursePercent, mapMarkers, petalLinkName, petalModels, pulseSummary, resumeSelector } from "./learningPulseModel";

// שכבות העלה: גוף זכוכית, ברק צדדי, חומר ההתקדמות (באותה צורה, מעט פנימה) עם ליבה בהירה, וצומת.
const TRACK = petalPath();
const SHEEN = petalPath(-0.8);
const OUTLINE = petalPath(1.6);
const FILL_END = fillRadius(1);
const NODE_Y = -PETAL.outerRadius;
const EASE = "transition-[opacity,transform,fill,stroke] duration-500 ease-out motion-reduce:transition-none";
// אורך החומר משתנה דרך d (Chromium ו-Firefox מנפישים; בדפדפן אחר העדכון מיידי).
const GROW = "transition-[d,opacity] duration-500 ease-out motion-reduce:transition-none";
const R_OUT = PETAL.outerRadius + PETAL.outerHalfWidth;
// מפת הקורס: מספר פרק מחוץ לעלה (markerPlacement), ותיאור צף מעבר למספר.
// אזור הלחיצה: מחוץ לעיגול המרכז ועד מעבר למספר, ברוחב זווית של עלה אחד.
const HIT = wedgePath(31, R_OUT + 18);
const MARK_CLASS = {
    start: "fill-[var(--lp-center-label)] font-semibold",
    current: "fill-[var(--lp-current)] font-bold",
    active: "fill-[var(--bts-text-primary)] font-semibold",
} as const;
const MARK_SIZE = { start: 9, current: 11, active: 10 } as const;

export const chapterTitle = (chapterId: number, locale: Parameters<typeof tField>[1]) => {
    const chapter = courses["behind-the-scenes-ai"].chapters.find((c) => c.id === chapterId);
    return chapter ? tField(chapter.title, locale) : "";
};

const stop = (offset: number, color: string, opacity?: number) =>
    <stop offset={offset} style={{ stopColor: color, ...(opacity === undefined ? {} : { stopOpacity: opacity }) }} />;

/**
 * ה-SVG עצמו. הציור הוא תמונה אחת עם הסיכום הנגיש (label); הפנים שלו לא נחשפים. גרסה אחת בלבד: המצב
 * המכווץ של הפאנל מקטין את אותו SVG. map = מפת הקורס (19 קישורי פרק, מספרי פרק): מוסתרת ב-CSS במצב
 * המכווץ (lp-map), כך שבו אין עלים אינטראקטיביים.
 */
export function PulseGraphic({ course, currentId, focusedId = null, centerLabel = "", label, map }: {
    course: CourseLearning;
    currentId: number | null;
    focusedId?: number | null;
    centerLabel?: string;
    label: string;
    map?: {
        activeId: number | null;
        nameOf: (chapterId: number) => string;
        /** pointer = מיקום הסמן בכניסה לעלה (לתיאור הצף); בלי = מיקוד מקלדת. */
        onActive: (chapterId: number | null, pointer?: { x: number; y: number }) => void;
        onOpen: (chapterId: number, e: React.MouseEvent) => void;
    };
}) {
    const id = useId().replace(/[^a-zA-Z0-9]/g, "");
    const activeId = map?.activeId ?? null;
    // ריחוף/מיקוד על עלה מקבל את אותה הדגשת תצוגה מקדימה כמו ריחוף על כרטיס פרק.
    const petals = petalModels(course, currentId, activeId ?? focusedId);
    const url = (k: string) => `url(#${id}${k})`;
    return (
        <svg viewBox={PULSE_VIEWBOX} focusable="false" className="block size-full overflow-visible">
            <g role="img" aria-label={label}>
            <defs>
                <linearGradient id={`${id}t`} gradientUnits="userSpaceOnUse" x1="0" y1={-FILL_START} x2="0" y2={-R_OUT}>
                    {stop(0, "var(--lp-track-a)")}{stop(1, "var(--lp-track-b)")}
                </linearGradient>
                <linearGradient id={`${id}tc`} gradientUnits="userSpaceOnUse" x1="0" y1={-FILL_START} x2="0" y2={-R_OUT}>
                    {stop(0, "var(--lp-track-current-a)")}{stop(1, "var(--lp-track-current-b)")}
                </linearGradient>
                <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1={-PETAL.outerHalfWidth} y1="0" x2={PETAL.outerHalfWidth} y2="0">
                    {stop(0, "var(--lp-sheen)")}{stop(0.42, "var(--lp-sheen)", 0)}{stop(1, "var(--lp-sheen)", 0)}
                </linearGradient>
                <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1="0" y1={-FILL_START} x2="0" y2={-FILL_END}>
                    {stop(0, "var(--lp-fill-a)")}{stop(0.5, "var(--lp-fill-b)")}{stop(1, "var(--lp-fill-c)")}
                </linearGradient>
                <radialGradient id={`${id}a`}>
                    {stop(0.3, "var(--lp-aura)")}{stop(1, "var(--lp-aura)", 0)}
                </radialGradient>
                <radialGradient id={`${id}c`} cx="0.45" cy="0.35" r="0.75">
                    {stop(0, "var(--lp-center-a)")}{stop(1, "var(--lp-center-b)")}
                </radialGradient>
                <radialGradient id={`${id}h`} cx="0.5" cy="0.5" r="0.5">
                    {stop(0, "var(--lp-center-sheen)")}{stop(1, "var(--lp-center-sheen)", 0)}
                </radialGradient>
            </defs>
            <circle r="119" fill={url("a")} className="forced-colors:hidden" />
            {/* מסלול דקורטיבי עדין מאחורי העלים, דרך אזור צמתי הקצה: מחבר את 19 העלים לגוף אחד. לא מייצג נתון. */}
            <circle r={PETAL.outerRadius} fill="none" strokeWidth="0.6" className="lp-orbit stroke-[var(--lp-orbit)] [filter:drop-shadow(0_0_3.5px_var(--lp-orbit-glow))] forced-colors:hidden" />
            <g className="[filter:var(--lp-ring-filter)] forced-colors:[filter:none]">
                {petals.map((p) => (
                    <g key={p.chapterId} transform={p.transform}>
                        <g className={`${EASE} ${p.chapterId === activeId ? "brightness-[1.22]" : ""}`} style={{ transform: p.current ? "scale(1.05)" : p.chapterId === activeId ? "scale(1.02)" : "scale(1)" }}>
                            <path
                                d={OUTLINE} fill="none" strokeWidth={p.current ? 1.5 : 1.1}
                                strokeDasharray={p.focused ? "3.5 2.5" : undefined}
                                opacity={p.current ? 1 : p.focused ? 0.9 : 0}
                                className={`${EASE} stroke-[var(--lp-current)] [filter:drop-shadow(0_0_3px_var(--lp-current-glow))] forced-colors:stroke-[Highlight] forced-colors:[filter:none]`}
                            />
                            <path
                                d={TRACK} fill={url(p.current ? "tc" : "t")} strokeWidth={p.complete || p.current ? 1.1 : 0.6}
                                className={`${EASE} ${p.complete || p.current ? "stroke-[var(--lp-track-complete-edge)]" : "stroke-[var(--lp-track-edge)]"} forced-colors:fill-[Canvas] forced-colors:stroke-[CanvasText]`}
                            />
                            <path d={SHEEN} fill={url("s")} className="forced-colors:hidden" />
                            {p.fillPath && (
                                <g className="[filter:drop-shadow(0_0_4px_var(--lp-fill-glow))] forced-colors:[filter:none]">
                                    <path d={p.fillPath} fill={url("f")} className={`${GROW} forced-colors:fill-[CanvasText]`} style={{ d: `path("${p.fillPath}")` }} />
                                    {p.corePath && (
                                        <path d={p.corePath} fill="none" strokeWidth={2.4} strokeLinecap="round" className={`${GROW} stroke-[var(--lp-fill-core)] forced-colors:hidden`} style={{ d: `path("${p.corePath}")` }} />
                                    )}
                                </g>
                            )}
                            <circle cy={NODE_Y} r={PETAL.nodeRadius + 3.4} opacity={p.mastered ? 1 : 0} className={`${EASE} fill-[var(--lp-mastery-halo)] forced-colors:hidden`} />
                            <circle
                                cy={NODE_Y} r={p.mastered ? PETAL.nodeRadius + 0.4 : PETAL.nodeRadius} strokeWidth={1.3}
                                className={`${EASE} ${p.mastered
                                    ? "fill-[var(--lp-mastery)] stroke-[var(--lp-mastery-edge)] [filter:drop-shadow(0_0_3px_var(--lp-mastery-glow))] forced-colors:fill-[CanvasText] forced-colors:stroke-[CanvasText]"
                                    : "fill-[var(--lp-node-fill)] stroke-[var(--lp-node-empty)] forced-colors:fill-[Canvas] forced-colors:stroke-[CanvasText]"} forced-colors:[filter:none]`}
                            />
                        </g>
                    </g>
                ))}
            </g>
            <g>
                    <circle r="30.5" fill="none" strokeWidth="0.6" className="stroke-[var(--lp-center-edge)] opacity-60 forced-colors:hidden" />
                    <circle r="28" fill={url("c")} strokeWidth="1" className="stroke-[var(--lp-center-edge)] [filter:var(--lp-ring-filter)] forced-colors:fill-[Canvas] forced-colors:stroke-[CanvasText] forced-colors:[filter:none]" />
                    <ellipse cy="-13" rx="19" ry="10" fill={url("h")} className="forced-colors:hidden" />
                    <text y="6.5" textAnchor="middle" className="fill-[var(--lp-center-text)] text-[23px] font-bold forced-colors:fill-[CanvasText]">{course.chapters.length}</text>
                    <text y="17.5" textAnchor="middle" className="fill-[var(--lp-center-label)] text-[8px] font-medium forced-colors:fill-[CanvasText]">{centerLabel}</text>
            </g>
            </g>
            {map && (
                <g className="lp-map">
                    {/* מספרי הפרקים: זקופים, מחוץ לעלה ובהמשך הציר שלו. direction="ltr": העיגון (start/end) פיזי
                        בכל שפה, כך שבעמוד RTL המספר לא נמתח בחזרה אל העלה. */}
                    <g aria-hidden="true" direction="ltr" className="pointer-events-none">
                        {mapMarkers(currentId, activeId).map(({ chapterId, kind }) => {
                            const m = markerPlacement(chapterId, MARK_SIZE[kind], String(chapterId));
                            return (
                                <text key={chapterId} x={m.x} y={m.y} textAnchor={m.anchor} dominantBaseline={m.baseline} fontSize={MARK_SIZE[kind]} className={`${MARK_CLASS[kind]} tabular-nums forced-colors:fill-[CanvasText]`}>
                                    {chapterId}
                                </text>
                            );
                        })}
                    </g>
                    {/* קישור לכל פרק, בסדר הפרקים 1-19: טריז בלתי נראה ורחב מהעלה. ההדגשה (קו מקווקו, גם בצבעים
                        מאולצים), המספר והתיאור הצף הם מצב המיקוד. */}
                    {petals.map((p) => (
                        <a
                            key={p.chapterId}
                            href={chapterHref(p.chapterId)}
                            aria-label={map.nameOf(p.chapterId)}
                            aria-current={p.current ? "page" : undefined}
                            className="pointer-events-auto outline-none"
                            onClick={(e) => map.onOpen(p.chapterId, e)}
                            onMouseEnter={(e) => map.onActive(p.chapterId, { x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => map.onActive(null)}
                            onFocus={() => map.onActive(p.chapterId)}
                            onBlur={() => map.onActive(null)}
                        >
                            <path d={HIT} transform={p.transform} fill="transparent" />
                        </a>
                    ))}
                </g>
            )}
        </svg>
    );
}

/** צומת שליטה ב-HTML (כרטיס פרק): אותה שפה כמו צומת העלה. */
export function MasteryNode({ mastered, attempted = false }: { mastered: boolean; attempted?: boolean }) {
    // מקום קבוע של 16px. שלושה מצבים: שליטה (אמרלד, קבועה גם אחרי ניסיון שנכשל), נוסה בלי שליטה (ענבר),
    // לא נוסה (טבעת ניטרלית חלולה). בשני הצבעוניים: טבעת חיה וקטנה ומסביבה הילה רכה באותו גוון, בלי קצה.
    const tone = mastered ? "vivid" : attempted ? "attempt" : null;
    return (
        <span
            aria-hidden="true"
            className={`grid size-4 shrink-0 place-items-center rounded-full ${tone === "vivid"
                ? "bg-[radial-gradient(circle,var(--lp-node-vivid-halo)_0%,transparent_75%)] shadow-[0_0_16px_6px_var(--lp-node-vivid-halo)] forced-colors:bg-none forced-colors:shadow-none"
                : tone === "attempt"
                    ? "bg-[radial-gradient(circle,var(--lp-node-attempt-halo)_0%,transparent_75%)] shadow-[0_0_16px_6px_var(--lp-node-attempt-halo)] forced-colors:bg-none forced-colors:shadow-none"
                    : ""}`}
        >
            <span
                className={`size-2.5 rounded-full transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none ${tone === "vivid"
                    ? "border-2 border-[var(--lp-node-vivid)] bg-[var(--lp-node-body)] shadow-[0_0_6px_var(--lp-node-vivid-glow)] forced-colors:border-[CanvasText] forced-colors:!bg-[CanvasText] forced-colors:[forced-color-adjust:none]"
                    : tone === "attempt"
                        ? "border-2 border-[var(--lp-node-attempt)] bg-[var(--lp-node-body)] shadow-[0_0_6px_var(--lp-node-attempt-glow)] forced-colors:border-2 forced-colors:border-[CanvasText]"
                        : "border-[1.5px] border-[var(--lp-node-empty)] forced-colors:border-[GrayText]"}`}
            />
        </span>
    );
}

export interface LearningPulsePanelProps {
    course: CourseLearning;
    /** הפרק של הנתיב הנוכחי, או null (מבוא, מבחן סיום, עמוד אחר). */
    currentChapterId: number | null;
    /** פרק בתצוגה מקדימה (ריחוף או מיקוד על כרטיס פרק). */
    previewChapterId?: number | null;
    accessActive: boolean;
    /** פתוח (הסימן המלא) או מכווץ (אותו Pulse, קטן, בראש הפאנל). auto = לפי המסך ב-CSS (רק עד שהמסך ידוע). */
    layout: PulseLayout;
    /** הנפשת המעבר בין המצבים (גלילה או לחיצה). בלי: החלפה מיידית (טעינה, שחזור גלילה). */
    morph?: boolean;
    onLayoutChange?: (layout: "expanded" | "compact") => void;
    /** הנתיב הנוכחי הוא מבחן הסיום (לכרטיס הזהב). */
    finalExamCurrent?: boolean;
    /** ניווט מתוך הפאנל (למשל סגירת מגירת הנייד). */
    onNavigate?: () => void;
    /** מקום להודעת הסנכרון הקיימת (SyncNotice). */
    syncNotice?: React.ReactNode;
}

export type PulseLayout = "auto" | "expanded" | "compact";

/**
 * הפאנל: כותרת שהיא גם כפתור ההרחבה/כיווץ, ה-Pulse, שני נתוני הקורס וכרטיס מבחן הסיום. שני מצבים של אותו
 * רכיב (CSS ב-globals.css, lp-panel): פתוח = הסימן המלא; מכווץ = אותו Pulse בגודל 72px בתחילת שורת
 * הכותרת, עם שני הנתונים לצדו. מבחן הסיום גלוי בשני המצבים. אין מצב שבו ה-Pulse נעלם.
 */
export function LearningPulsePanel(props: LearningPulsePanelProps) {
    const { course, currentChapterId, previewChapterId = null, layout, morph = false, onLayoutChange, syncNotice, finalExamCurrent = false, onNavigate } = props;
    const { locale, dir, t } = useT();
    const p = t.chrome.pulse;
    const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0, numberingSystem: "latn" }).format(coursePercent(course) / 100);
    const summary = pulseSummary(
        p.brand, course, p,
        currentChapterId ? { id: currentChapterId, title: chapterTitle(currentChapterId, locale) } : null,
        percent,
    );
    const compact = layout === "compact";
    const router = useRouter();
    // העלה שבריחוף/מיקוד במפת הקורס. מתאפס כשהמצב משתנה (במצב המכווץ המפה מוסתרת).
    const [activeId, setActiveId] = useState<number | null>(null);
    // מיקום הסמן ברגע הכניסה לעלה (לא בכל תנועה): התיאור הצף נשאר יציב בתוך העלה.
    const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
    const onActive = (chapterId: number | null, at?: { x: number; y: number }) => {
        setActiveId(chapterId);
        setPointer(at ?? null);
    };
    const [seenLayout, setSeenLayout] = useState(layout);
    if (seenLayout !== layout) {
        setSeenLayout(layout);
        setActiveId(null);
    }
    const nameOf = (chapterId: number) => petalLinkName(formatChapterLabel(locale, chapterId), chapterTitle(chapterId, locale));
    // ניווט רגיל של הלומדה ("פתיחת פרק N"). לחיצה עם מקש שינוי או כפתור אחר: התנהגות הקישור של הדפדפן.
    const openChapter = (chapterId: number, e: React.MouseEvent) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onNavigate?.();
        router.push(chapterHref(chapterId));
    };
    const progressDot = "bg-[var(--lp-fill-a)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--lp-fill-a)_22%,transparent)]";
    const masteryDot = "bg-[var(--lp-mastery)] shadow-[0_0_0_3px_var(--lp-mastery-halo)]";
    const mastered = `${course.masteredCount} / ${course.chapters.length}`;

    return (
        <section aria-label={p.brand} dir={dir} data-layout={layout} data-morph={morph ? "" : undefined} className="lp-panel relative">
            {/* ה-Pulse האמיתי, אחד לשני המצבים: זז ומוקטן (lp-art), לא מוחלף. בפתוח הוא גם מפת הקורס. */}
            <div className="lp-art">
                <PulseGraphic
                    course={course} currentId={currentChapterId} focusedId={previewChapterId} centerLabel={p.chapters} label={summary}
                    map={{ activeId, nameOf, onActive, onOpen: openChapter }}
                />
                {activeId !== null && <PetalTip chapterId={activeId} pointer={pointer} markSize={MARK_SIZE[mapMarkers(currentChapterId, activeId).find((m) => m.chapterId === activeId)?.kind ?? "active"]} text={nameOf(activeId)} dir={dir} />}
            </div>
            {/* שורת הכותרת. במצב המכווץ היא כרטיס עצמאי (lp-head::before), נפרד מכרטיס מבחן הסיום. */}
            <div className="lp-head flex w-full items-center gap-1.5 text-start">
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-1.5">
                        <span className="block whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--bts-text-primary)]">{p.brand}</span>
                        {/* מכווץ: התקדמות הלמידה באותה שורה עם הכותרת (גם 100% נכנס ברוחב הסרגל הרגיל; צר יותר: יורדת שורה). */}
                        <span aria-hidden="true" className="lp-compact lp-inline ms-auto flex items-center gap-1">
                            <span dir="ltr" className="whitespace-nowrap text-[13px] font-bold leading-none tabular-nums text-[var(--bts-text-primary)]">{percent}</span>
                            <span className={`size-2 shrink-0 rounded-full forced-colors:bg-[CanvasText] ${progressDot}`} />
                        </span>
                    </span>
                    {/* פתוח: תת-הכותרת. מכווץ: מבדקים שעברו, בקצרה ("1 / 19 פרקים"). באותו מקום, בהחלפת שקיפות. */}
                    <span className="grid *:[grid-area:1/1]">
                        <span className="lp-full block truncate text-[12px] text-[var(--bts-text-muted)]">{p.subtitle}</span>
                        <span aria-hidden="true" className="lp-compact mt-1 flex items-baseline gap-1.5 whitespace-nowrap">
                            <span dir="ltr" className="text-[13px] font-bold tabular-nums text-[var(--bts-text-primary)]">{mastered}</span>
                            <span className="text-[12px] text-[var(--bts-text-secondary)]">{p.chapters}</span>
                        </span>
                    </span>
                </span>
                <button
                    type="button"
                    aria-expanded={layout === "auto" ? undefined : !compact}
                    aria-label={compact ? p.expand : p.collapse}
                    onClick={() => onLayoutChange?.(compact ? "expanded" : "compact")}
                    className="lp-toggle rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]"
                >
                    <ChevronDown aria-hidden="true" size={18} className="lp-chevron shrink-0 text-[var(--bts-text-faint)]" />
                </button>
            </div>
            {/* מקום הסימן המלא ושני הנתונים: נסגר במצב המכווץ. */}
            <div className="lp-body">
                <div className="min-h-0 overflow-hidden">
                    <div className="h-[220px]" />
                    {/* שני נתוני הקורס, משניים ל-Pulse: התקדמות הלמידה (cyan/כחול) ומבדקים שעברו (אמרלד, שליטה קבועה). */}
                    <div aria-hidden="true" className="mt-1 grid grid-cols-2 gap-3 px-1">
                        <Stat dot={progressDot} value={percent} label={p.learningProgress} />
                        <Stat dot={masteryDot} value={mastered} label={p.mastered} />
                    </div>
                </div>
            </div>
            <FinalExamCard finalExam={course.finalExam} current={finalExamCurrent} locked={!props.accessActive} onNavigate={onNavigate} />
            {!props.accessActive && <AccessNotice />}
            {syncNotice && <div className="mt-2">{syncNotice}</div>}
        </section>
    );
}

// מרווח התיאור הצף מהסמן: 12px מעליו, או מתחתיו (מעבר לחץ הסמן עצמו) כשאין מקום מעל; 8px משולי הסרגל.
const TIP_GAP = 12;
const TIP_GAP_BELOW = 22;
const TIP_EDGE = 8;

/**
 * תיאור צף קומפקטי לעלה במפת הקורס. בריחוף: מעל הסמן וממורכז אליו (מתחתיו כשאין מקום מעל), ומוזז
 * פנימה כך שכולו בתוך הסרגל; המיקום נקבע לפני הציור (useLayoutEffect), בלי רינדור נוסף. במיקוד מקלדת
 * (אין סמן): מעבר למספר הפרק (לעולם לא מעליו), מעל בחצי העליון ומתחת בתחתון. aria-hidden: השם על הקישור.
 */
function PetalTip({ chapterId, pointer, markSize, text, dir }: {
    chapterId: number; pointer: { x: number; y: number } | null; markSize: number; text: string; dir: "rtl" | "ltr";
}) {
    const ref = useRef<HTMLSpanElement>(null);
    useLayoutEffect(() => {
        const tip = ref.current;
        const art = tip?.parentElement;
        const bounds = tip?.closest("aside, [role=dialog]");
        if (!pointer || !tip || !art || !bounds) return;
        const a = art.getBoundingClientRect();
        const b = bounds.getBoundingClientRect();
        const { width: w, height: h } = tip.getBoundingClientRect();
        const left = Math.min(Math.max(pointer.x - w / 2, b.left + TIP_EDGE), b.right - TIP_EDGE - w);
        const above = pointer.y - TIP_GAP - h;
        const top = above >= b.top + TIP_EDGE ? above : pointer.y + TIP_GAP_BELOW;
        Object.assign(tip.style, { left: `${left - a.left}px`, top: `${top - a.top}px`, transform: "none" });
    }, [pointer, text]);
    const { box } = markerPlacement(chapterId, markSize, String(chapterId));
    const upper = box.y0 + box.y1 <= 0;
    const pt = { x: (box.x0 + box.x1) / 2, y: upper ? box.y0 - 4 : box.y1 + 4 };
    const k = 220 / (PULSE_HALF * 2);
    const sin = Math.sin((petalAngle(chapterId) * Math.PI) / 180);
    return (
        <span
            ref={ref}
            aria-hidden="true"
            dir={dir}
            className="lp-map pointer-events-none absolute z-10 max-w-[200px] truncate whitespace-nowrap rounded-md border border-[var(--bts-border-emphasis)] bg-[var(--bts-surface-elevated)] px-2 py-0.5 text-[11.5px] font-semibold leading-5 text-[var(--bts-text-primary)] shadow-[0_6px_16px_-6px_rgb(0_0_0/0.45)] forced-colors:border-[CanvasText]"
            style={pointer ? undefined : {
                left: (pt.x + PULSE_HALF) * k,
                top: (pt.y + PULSE_HALF) * k,
                transform: `translate(${-50 - 40 * sin}%, ${upper ? -100 : 0}%)`,
            }}
        >
            {text}
        </span>
    );
}

/** הציון האחרון (לא הטוב ביותר) בבאר עגולה שקועה. הקורא מציג אותו רק כשיש ניסיון. */
export const ScoreWell = ({ score, latestPassed }: { score: number; latestPassed?: boolean | null }) => {
    // תוצאת הניסיון האחרון (לא השליטה): הילה רכה סביב הבאר, אמרלד אם עבר וענבר אם לא. חלשה מהילת צומת השליטה.
    const shadow = latestPassed == null
        ? "shadow-[inset_0_1.5px_3px_var(--lp-score-well-shadow),inset_0_-1px_0_var(--lp-score-well-light)]"
        : latestPassed
            ? "shadow-[inset_0_1.5px_3px_var(--lp-score-well-shadow),inset_0_-1px_0_var(--lp-score-well-light),0_0_12px_2px_var(--lp-score-glow-pass)]"
            : "shadow-[inset_0_1.5px_3px_var(--lp-score-well-shadow),inset_0_-1px_0_var(--lp-score-well-light),0_0_12px_2px_var(--lp-score-glow-fail)]";
    return (
        <span aria-hidden="true" className={`grid size-[30px] shrink-0 place-items-center rounded-full bg-[var(--lp-score-well)] text-[13px] font-bold tabular-nums text-[var(--bts-text-primary)] ${shadow} forced-colors:bg-transparent forced-colors:shadow-none`}>{score}</span>
    );
};

/**
 * מבחן הסיום: היעד של הקורס (המסע = Pulse, הצלחה במבדק פרק = ירוק, היעד = זהב). אינו פרק 20 ואינו עלה,
 * ואינו נספר בהתקדמות או ב-19 המבדקים. מצב לפי הניסיון האחרון (לא נבחן, דורש חזרה, עבר) וציון אחרון
 * כשנבחן. נעילה לפי הגישה בלבד; אין תנאי זכאות. המצב נאמר במילים, לא רק בצבע. הקישוטים aria-hidden.
 */
function FinalExamCard({ finalExam, current, locked, onNavigate }: {
    finalExam: CourseLearning["finalExam"]; current: boolean; locked: boolean; onNavigate?: () => void;
}) {
    const { t } = useT();
    const p = t.chrome.pulse;
    const title = t.chrome.progress.finalExam;
    const state = !finalExam.attempted ? "open" : finalExam.passed ? "passed" : "review";
    const status = state === "open" ? p.finalExamState.notTaken : state === "passed" ? p.finalExamState.passed : p.finalExamState.needsReview;
    const parts = [title, status];
    if (finalExam.latestScore !== null) parts.push(p.latestScoreValue(finalExam.latestScore));
    if (locked) parts.push(t.chrome.access.lockedLabel);
    // אזור היעד (תגית "יעד הקורס" ומשפט ההסבר) מקבל את המקום שנשאר אחרי הכותרת והציון. כשאין בו מקום
    // לתגית המלאה, נשאר הדגל בלבד ומשפט ההסבר מוסתר, במקום להוסיף שורה.
    const destRef = useRef<HTMLSpanElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const summaryRef = useRef<HTMLSpanElement>(null);
    const [roomy, setRoomy] = useState(true);
    const [summaryFits, setSummaryFits] = useState(true);
    useLayoutEffect(() => {
        const dest = destRef.current;
        const label = labelRef.current;
        if (!dest || !label || typeof ResizeObserver === "undefined") return;
        // משפט ההסבר: שורה אחת בלבד. כשאין לו מקום בשורה אחת הוא מוסתר (נשאר ב-DOM כדי שאפשר יהיה למדוד אותו).
        const summary = summaryRef.current;
        const check = () => {
            setRoomy(dest.clientWidth >= label.scrollWidth + 26);
            setSummaryFits(!!summary && dest.clientWidth + 1 >= summary.scrollWidth);
        };
        check();
        const ro = new ResizeObserver(check);
        ro.observe(dest);
        return () => ro.disconnect();
    }, [p.courseDestination, p.finalExamSummary]);
    // הזהב נשאר הזהות בכל מצב. דורש שיפור: אווירה ענבר-כתומה חמה. עבר: אווירת אמרלד מאופקת סביב זהב.
    const frame = {
        open: "border-[var(--lp-gold-edge-strong)] shadow-[0_0_24px_-3px_var(--lp-gold-glow),inset_0_1px_0_var(--lp-gold-inner),0_10px_24px_-16px_var(--lp-gold-depth)]",
        review: "border-[var(--lp-review-edge)] bg-[linear-gradient(135deg,var(--lp-review-tint),transparent_65%)] shadow-[0_0_22px_-3px_var(--lp-review-glow),inset_0_1px_0_var(--lp-gold-inner),0_10px_24px_-16px_var(--lp-gold-depth)]",
        passed: "border-[color-mix(in_oklab,var(--lp-gold-edge-strong)_60%,var(--lp-mastery))] bg-[linear-gradient(135deg,var(--lp-pass-tint),transparent_65%)] shadow-[0_0_22px_-4px_var(--lp-mastery-halo),0_0_26px_-6px_var(--lp-gold-glow),inset_0_1px_0_var(--lp-gold-inner),0_10px_24px_-16px_var(--lp-gold-depth)]",
    }[state];
    const statusTone = { open: "text-[var(--bts-text-secondary)]", review: "font-semibold text-[var(--lp-review-text)]", passed: "font-semibold text-[var(--lp-mastery)]" }[state];
    const well = state === "passed"
        ? "border-[color-mix(in_oklab,var(--lp-mastery)_60%,transparent)] bg-[var(--lp-pass-well)] text-[var(--lp-mastery)]"
        : "border-[var(--lp-review-edge)] bg-[var(--lp-review-well)] text-[var(--lp-review-text)]";
    return (
        <Link
            href={FINAL_EXAM_HREF}
            aria-label={p.sentences(parts)}
            aria-current={current ? "page" : undefined}
            title={locked ? t.chrome.access.lockedHint : undefined}
            onClick={onNavigate}
            className={`relative isolate mt-3 flex min-h-[60px] items-center gap-2 overflow-hidden rounded-[14px] border-[1.5px] bg-[image:var(--lp-gold-card)] py-2 ps-2 pe-2 text-start no-underline transition-[box-shadow,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)] motion-reduce:transition-none forced-colors:border-[CanvasText] forced-colors:shadow-none ${current ? "ring-1 ring-[var(--lp-gold-edge-strong)] " : ""}${frame}`}
        >
            {/* הארה חמה מאחורי סמל היעד (בתחילת השורה, לפי כיוון הקריאה). */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-0 -z-10 w-3/5 bg-[radial-gradient(75%_130%_at_0%_50%,var(--lp-gold-light),transparent_72%)] rtl:bg-[radial-gradient(75%_130%_at_100%_50%,var(--lp-gold-light),transparent_72%)] forced-colors:hidden" />
            {/* סמל היעד: טבעות זהב קונצנטריות, כובע במרכז, הילה וניצוצות. */}
            <span aria-hidden="true" className="relative me-1 grid size-[38px] shrink-0 place-items-center">
                <span className="absolute -inset-[10px] rounded-full bg-[radial-gradient(circle,var(--lp-gold-light)_0%,transparent_70%)] forced-colors:hidden" />
                <span className="absolute inset-0 rounded-full border-[1.5px] border-[var(--lp-gold-edge-strong)] bg-[radial-gradient(circle,var(--lp-gold-ring-core)_0%,transparent_78%)] shadow-[0_0_14px_-1px_var(--lp-gold-glow),inset_0_0_10px_-3px_var(--lp-gold-light)] forced-colors:border-[CanvasText] forced-colors:shadow-none" />
                <span className="absolute inset-[5px] rounded-full border border-[color-mix(in_oklab,var(--lp-gold)_22%,transparent)] forced-colors:hidden" />
                <GraduationCap size={18} strokeWidth={1.8} className="relative text-[var(--lp-gold)] [filter:drop-shadow(0_0_4px_var(--lp-gold-glow))] forced-colors:text-[CanvasText] forced-colors:[filter:none]" />
                <Sparkle size={8} fill="currentColor" strokeWidth={0} className="absolute -end-1.5 top-0 text-[var(--lp-gold)] opacity-80 forced-colors:hidden" />
                <Sparkle size={5} fill="currentColor" strokeWidth={0} className="absolute -end-2 bottom-1.5 text-[var(--lp-gold)] opacity-60 forced-colors:hidden" />
            </span>
            {/* כותרת ומצב: הטקסט החזק בכרטיס. הכותרת לעולם לא נחתכת. הציון האחרון (לא הטוב ביותר) בשורת המצב, רק אחרי ניסיון. */}
            <span aria-hidden="true" className="min-w-0 shrink">
                <span className="block text-[15px] font-bold leading-tight text-[var(--bts-text-primary)]">{title}</span>
                <span className="mt-0.5 flex min-h-[22px] flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className={`text-[12px] leading-snug ${statusTone}`}>{status}</span>
                    {finalExam.latestScore !== null && (
                        <span className={`inline-grid min-w-[30px] shrink-0 place-items-center rounded-md border px-1.5 text-[13px] font-bold leading-[20px] tabular-nums shadow-[inset_0_1px_3px_var(--lp-score-well-shadow)] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:shadow-none ${well}`}>{finalExam.latestScore}</span>
                    )}
                </span>
            </span>
            {/* אזור היעד בקצה הנגדי: תגית "יעד הקורס" ומתחתיה משפט הסבר שקט. */}
            <span ref={destRef} aria-hidden="true" className="flex min-w-[24px] flex-1 basis-0 flex-col items-end gap-1 text-end">
                <span className="inline-flex max-w-full items-center overflow-hidden rounded-md border border-[var(--lp-gold-edge)] bg-[color-mix(in_oklab,var(--lp-gold)_14%,transparent)] px-1 py-px text-[10px] font-semibold leading-[14px] text-[var(--lp-gold-text)] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]">
                    <span ref={labelRef} className={`whitespace-nowrap ${roomy ? "me-1" : "max-w-0 overflow-hidden"}`}>{p.courseDestination}</span>
                    <Flag size={10} fill="currentColor" className="shrink-0" />
                </span>
                <span ref={summaryRef} className={`whitespace-nowrap text-[10px] leading-[14px] tracking-[-0.02em] text-[var(--bts-text-muted)] ${summaryFits ? "" : "h-0 overflow-hidden"}`}>{p.finalExamSummary}</span>
            </span>
            {locked && <Lock aria-hidden="true" size={13} className="shrink-0 text-[var(--bts-text-faint)]" />}
        </Link>
    );
}

function Stat({ dot, value, label }: { dot: string; value: string; label: string }) {
    return (
        <span className="min-w-0 text-start">
            <span className="flex items-center gap-1.5">
                <span className={`size-2 shrink-0 rounded-full forced-colors:bg-[CanvasText] ${dot}`} />
                <span dir="ltr" className="whitespace-nowrap text-[20px] font-bold leading-none tabular-nums text-[var(--bts-text-primary)]">{value}</span>
            </span>
            <span className="mt-1 block text-[11.5px] leading-tight text-[var(--bts-text-secondary)]">{label}</span>
        </span>
    );
}

function AccessNotice() {
    const { t } = useT();
    const p = t.chrome.pulse;
    return (
        <div className="mt-3 flex gap-2.5 rounded-xl border border-[var(--bts-border-emphasis)] bg-[var(--lp-card)] px-3 py-2.5 text-start">
            <Lock aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-[var(--bts-text-muted)]" />
            <span className="min-w-0 text-[12px] leading-snug">
                <span className="block font-bold text-[var(--bts-text-primary)]">{p.accessInactive.title}</span>
                <span className="block text-[var(--bts-text-secondary)]">{p.accessInactive.body}</span>
            </span>
        </div>
    );
}

/**
 * "המשך" כפעולת ניווט קומפקטית בכותרת תוכן העניינים (לא חלק מחתימת הלמידה). אותו יעד ואותו כלל
 * (continueTarget); מוצג רק עם גישה פעילה. שם הפרק נשאר בשם הנגיש ובתיאור הצף.
 */
export function ContinueLink({ course, currentChapterId, onNavigate }: {
    course: CourseLearning; currentChapterId: number | null; onNavigate?: () => void;
}) {
    const { locale, dir, t } = useT();
    const p = t.chrome.pulse;
    const action = continueAction(continueTarget(course, true), currentChapterId, p, (n) => formatChapterLabel(locale, n));
    if (!action) return null;
    const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
    const sub = action.target.kind === "final-exam" ? null : chapterTitle(action.target.chapterId, locale);
    // כבר בפרק היעד: ניווט לאותה כתובת לא היה מזיז דבר, ולכן קופצים ישירות לנקודת ההמשך (או לראש
    // הפרק), בלי רשומת היסטוריה. מיידי, כמו בהגעה מעמוד אחר (ChapterLayout).
    const here = action.target.kind !== "final-exam" && action.target.chapterId === currentChapterId ? currentChapterId : null;
    const onClick = (e: React.MouseEvent) => {
        onNavigate?.();
        if (here === null) return;
        e.preventDefault();
        const selector = resumeSelector(action.href.slice(chapterHref(here).length), here) ?? "#chapter-main";
        document.querySelector(selector)?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    return (
        <Link
            href={action.href}
            onClick={onClick}
            title={sub ?? undefined}
            className="inline-flex min-h-8 min-w-0 max-w-full items-center gap-1.5 rounded-full border border-[var(--lp-cta-edge)] bg-[var(--lp-cta)] py-1 ps-3 pe-1 text-start no-underline shadow-[var(--lp-cta-shadow)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--lp-cta),var(--lp-cta-icon)_10%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)] motion-reduce:transition-none forced-colors:border-[LinkText]"
        >
            <span className="min-w-0 truncate text-[12px] font-bold leading-tight text-[var(--lp-cta-text)]">{action.label}</span>
            {sub && <span className="sr-only">{` ${sub}`}</span>}
            {/* מחוון כיוון יחיד: חץ עגול בקצה, לכיוון הקריאה (שמאלה ב-RTL, ימינה ב-LTR). */}
            <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--lp-cta-icon)] text-white forced-colors:bg-[LinkText] forced-colors:text-[Canvas]">
                <Arrow size={14} strokeWidth={2.4} />
            </span>
        </Link>
    );
}
