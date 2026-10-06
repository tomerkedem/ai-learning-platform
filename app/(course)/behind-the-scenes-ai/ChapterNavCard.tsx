"use client";

// ════════════════════════════════════════════════════════════════════════
// כרטיס ניווט לפרק, באותה שפה חזותית כמו Learning Pulse: מספר, שם, מסלול אבני דרך (נקודה אחת לכל
// יחידת למידה רשומה של הפרק, לפי מצב ההגעה האמיתי), צומת שליטה, ומצב נוכחי ונעילה. הכרטיס כולו הוא הקישור
// והממשק הנגיש: השם הנגיש כולל את ההתקדמות האיכותית, השליטה והציון האחרון. הציון לא מוצג
// חזותית בכרטיס. אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useT } from "@/i18n/useT";
import { formatChapterLabel } from "@/i18n/format";
import type { ChapterLearning } from "./learningProgress";
import { chapterCardName, chapterHref, navTitle } from "./learningPulseModel";
import { MasteryNode, ScoreWell, chapterTitle } from "./LearningPulse";

const cardClass = (current: boolean) => `group relative flex min-h-10 items-center gap-3 rounded-[10px] border px-3 py-1.5 no-underline transition-[background-color,border-color] duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)] ${current
    ? "border-[var(--lp-card-current-edge)] bg-[var(--lp-card-current)] forced-colors:border-2 forced-colors:border-[Highlight]"
    : "border-[var(--lp-card-edge)] bg-[var(--lp-card)] hover:bg-[var(--lp-card-hover)]"}`;

const CurrentEdge = () => (
    <span aria-hidden="true" className="absolute inset-y-[5px] start-0 w-[3px] rounded-e-full bg-[linear-gradient(to_bottom,var(--lp-fill-a),var(--lp-fill-b))] forced-colors:bg-[Highlight]" />
);

export interface ChapterNavCardProps {
    chapter: ChapterLearning;
    /** אבני הדרך של הפרק (מהמצב המשותף): לכל יחידה רשומה, לפי סדר המרשם, האם הלומד הגיע אליה. */
    milestones: readonly boolean[];
    /** הפרק של הנתיב הנוכחי. */
    current: boolean;
    /** הגישה לפרקים אינה פעילה. ההיסטוריה (מסלול, שליטה) נשארת מוצגת במלואה. */
    locked: boolean;
    /** ריחוף או מיקוד: הפרק מוצג ב-Pulse וברצועת המיקוד; null = סיום התצוגה המקדימה. */
    onPreview?: (chapterId: number | null) => void;
    onNavigate?: () => void;
}

export function ChapterNavCard({ chapter, milestones, current, locked, onPreview, onNavigate }: ChapterNavCardProps) {
    const { locale, t } = useT();
    const label = formatChapterLabel(locale, chapter.chapterId);
    const title = chapterTitle(chapter.chapterId, locale);
    const name = chapterCardName(chapter, t.chrome.pulse, label, title, { current, lockedLabel: locked ? t.chrome.access.lockedLabel : null });
    return (
        <Link
            href={chapterHref(chapter.chapterId)}
            aria-label={name}
            aria-current={current ? "page" : undefined}
            title={locked ? t.chrome.access.lockedHint : undefined}
            onClick={onNavigate}
            onMouseEnter={() => onPreview?.(chapter.chapterId)}
            onMouseLeave={() => onPreview?.(null)}
            onFocus={() => onPreview?.(chapter.chapterId)}
            onBlur={() => onPreview?.(null)}
            className={cardClass(current)}
        >
            {current && <CurrentEdge />}
            {/* זהות הפרק בתחילת השורה: ב-RTL הצומת בקצה ואחריו המספר; ב-LTR המספר בקצה ואחריו הצומת. */}
            <span aria-hidden="true" className="flex shrink-0 items-center gap-2.5">
                <span className={`order-1 w-5 text-[12px] font-semibold tabular-nums rtl:order-2 ${current ? "text-[var(--bts-text-primary)]" : "text-[var(--bts-text-muted)]"}`}>
                    {String(chapter.chapterId).padStart(2, "0")}
                </span>
                <span className="order-2 rtl:order-1"><MasteryNode mastered={chapter.masteryEarned} attempted={chapter.attempted} /></span>
            </span>
            <span aria-hidden="true" className="min-w-0 flex-1">
                <span className={`line-clamp-2 text-[13px] leading-[1.3] ${current ? "font-bold" : "font-semibold"} text-[var(--bts-text-primary)]`}>{navTitle(title)}</span>
                <span className="mt-1 block"><MilestoneTrail milestones={milestones} /></span>
            </span>
            {/* הציון האחרון (לא הטוב ביותר) בסוף השורה, רק אם המבדק נוסה. בלי סימן אחוז ובלי מקום שמור. */}
            {chapter.latestScore !== null && <ScoreWell score={chapter.latestScore} latestPassed={chapter.latestPassed} />}
            {locked && <Lock aria-hidden="true" size={13} className="shrink-0 text-[var(--bts-text-faint)]" />}
        </Link>
    );
}

/** שורת המבוא: לא פרק מבין ה-19, בלי מסלול ובלי שליטה. */
export function IntroNavRow({ title, href, current, onNavigate }: { title: string; href: string; current: boolean; onNavigate?: () => void }) {
    return (
        <Link href={href} aria-current={current ? "page" : undefined} onClick={onNavigate} className={cardClass(current)}>
            {current && <CurrentEdge />}
            <span aria-hidden="true" className={`w-5 shrink-0 text-[12px] font-semibold tabular-nums ${current ? "text-[var(--bts-text-primary)]" : "text-[var(--bts-text-muted)]"}`}>00</span>
            <span className={`min-w-0 flex-1 truncate text-[13px] ${current ? "font-bold" : "font-semibold"} text-[var(--bts-text-primary)]`}>{navTitle(title)}</span>
        </Link>
    );
}

const DOT = 7;

/** צבע אבן הדרך לפי מיקומה במסלול: אותה משפחה כמו מילוי ה-Pulse (cyan > כחול > סגול). לעולם לא אמרלד. */
function milestoneColor(i: number, n: number): string {
    const t = n > 1 ? i / (n - 1) : 0;
    return t <= 0.5
        ? `color-mix(in oklab, var(--lp-fill-a), var(--lp-fill-b) ${Math.round(t * 200)}%)`
        : `color-mix(in oklab, var(--lp-fill-b), var(--lp-fill-c) ${Math.round((t - 0.5) * 200)}%)`;
}

/**
 * מסלול אבני הדרך: מסילה דקה, ונקודה אחת לכל יחידת למידה רשומה של הפרק. נקודה שהלומד הגיע אליה
 * צבועה; קטע מחבר מצויר רק בין שתי נקודות סמוכות שהגיעו לשתיהן, כך שפער לעולם לא נראה כמו הגעה.
 * חזותי בלבד (aria-hidden): בלי מזהים, בלי שמות, בלי ספירה.
 */
export function MilestoneTrail({ milestones }: { milestones: readonly boolean[] }) {
    const n = milestones.length;
    const at = (i: number) => (n > 1 ? `calc((100% - ${DOT}px) * ${(i / (n - 1)).toFixed(4)})` : "0px");
    const step = n > 1 ? `calc((100% - ${DOT}px) / ${n - 1})` : "0px";
    return (
        <span aria-hidden="true" className="relative block h-[9px] [--lp-dir:to_right] rtl:[--lp-dir:to_left]">
            <span className="absolute inset-x-[3.5px] top-1/2 h-px -translate-y-1/2 bg-[var(--lp-trail-track)] opacity-70 forced-colors:bg-[GrayText] forced-colors:opacity-100" />
            {milestones.map((reached, i) =>
                reached && milestones[i + 1] ? (
                    <span
                        key={`s${i}`}
                        className="absolute top-1/2 h-px -translate-y-1/2 opacity-75 forced-colors:!bg-[CanvasText] forced-colors:opacity-100 forced-colors:[forced-color-adjust:none]"
                        style={{
                            insetInlineStart: `calc(${at(i)} + ${DOT / 2}px)`,
                            width: step,
                            background: `linear-gradient(var(--lp-dir), ${milestoneColor(i, n)}, ${milestoneColor(i + 1, n)})`,
                        }}
                    />
                ) : null,
            )}
            {milestones.map((reached, i) => (
                <span
                    key={i}
                    className={`absolute top-1/2 size-[7px] -translate-y-1/2 rounded-full transition-[background-color,transform] duration-300 motion-reduce:transition-none ${reached
                        ? "forced-colors:!bg-[CanvasText] forced-colors:[forced-color-adjust:none]"
                        : "scale-[0.78] bg-[var(--lp-milestone-empty)] forced-colors:border forced-colors:border-[GrayText] forced-colors:bg-[Canvas]"}`}
                    style={{
                        insetInlineStart: at(i),
                        ...(reached ? { background: milestoneColor(i, n), boxShadow: `0 0 0 1.5px color-mix(in oklab, ${milestoneColor(i, n)} 25%, transparent)` } : {}),
                    }}
                />
            ))}
        </span>
    );
}
