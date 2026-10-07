// ════════════════════════════════════════════════════════════════════════
// מודל התצוגה של Learning Pulse וכרטיסי הפרקים: פונקציות טהורות בין המצב הציבורי
// (CourseLearning, ContinueTarget) לבין מה שהרכיבים מציירים ומקריאים. בלי React ובלי דפדפן,
// כדי שהסמנטיקה תיבדק ישירות. הגאומטריה מגיעה מ-learningPulseGeometry; אין כאן מספר יחידות.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import type { ChapterLearning, ContinueTarget, CourseLearning } from "./learningProgress";
import { isLearningUnit, progressBand } from "./learningProgress";
import { PETAL, fillPath, fillRadius, petalTransform } from "./learningPulseGeometry";

/** מחרוזות chrome.pulse (נמסרות מבחוץ, כך שהמודל אינו תלוי במנגנון המילון). */
/** אחוז התקדמות הלמידה בקורס, 0..100, מעוגל כלפי מטה: 100 רק כשהגיעו לכל היחידות הרשומות. */
export const coursePercent = (course: CourseLearning) => Math.floor(Math.min(1, Math.max(0, course.learningProgress)) * 100 + 1e-9);

export interface PulseCopy {
    learningProgress: string;
    bands: Record<"not-started" | "started" | "in-progress" | "well-advanced" | "all-reached", string>;
    latestScoreValue: (score: number) => string;
    notAttempted: string;
    masteryAchieved: string;
    masteryNotYet: string;
    currentChapter: string;
    titled: (chapter: string, title: string) => string;
    sentences: (parts: string[]) => string;
    masteredSummary: (mastered: number, total: number) => string;
    currentSummary: (chapter: number, title: string) => string;
    continue: { start: (c: string) => string; continue: (c: string) => string; quiz: (c: string) => string; finalExam: string; resumeHere: string };
}

/**
 * כותרת ניווט קצרה לכרטיס הפרק: החלק שלפני הנקודתיים הראשונות (":" או "：" ביפנית), או הכותרת כולה
 * כשאין נקודתיים. נבדק על כל 19 הפרקים בשש השפות (ראו הבדיקות): זה תמיד שם המושג. הכותרת המלאה
 * נשארת בעמוד הפרק ובשם הנגיש.
 */
export function navTitle(title: string): string {
    const i = title.search(/[:：]/);
    return (i < 0 ? title : title.slice(0, i)).trim();
}

export const COURSE_BASE = "/behind-the-scenes-ai";
export const chapterHref = (chapterId: number) => `${COURSE_BASE}/chapter-${chapterId}`;
export const FINAL_EXAM_HREF = `${COURSE_BASE}/final-exam`;

/** פרק 1-19 של הנתיב הנוכחי, או null (מבוא, מבחן סיום, עמוד מידע). מבחן הסיום אינו פרק. */
export function chapterIdFromPath(pathname: string | null): number | null {
    const m = pathname?.match(/^\/behind-the-scenes-ai\/chapter-(\d+)$/);
    const n = m ? Number(m[1]) : NaN;
    return Number.isInteger(n) && n >= 1 && n <= 19 ? n : null;
}

/** עלה אחד, מוכן לציור. */
/**
 * חשיפת הכרטיס הנוכחי ברשימת הפרקים: null כשהוא כבר גלוי בנוחות (בלי תזוזה מיותרת); אחרת scrollTop
 * שממרכז אותו, בגבולות הגלילה הטבעיים (בלי רווח ריק בתחילת הרשימה או בסופה). הכל בפיקסלים, יחסית
 * לתוכן הרשימה (card.top = המרחק מראש התוכן). לא תלוי במקור הניווט.
 */
export function revealScrollTop(
    view: { scrollTop: number; height: number; scrollHeight: number },
    card: { top: number; height: number },
    margin = 12,
): number | null {
    if (card.top >= view.scrollTop + margin && card.top + card.height <= view.scrollTop + view.height - margin) return null;
    const max = Math.max(0, view.scrollHeight - view.height);
    return Math.round(Math.min(max, Math.max(0, card.top + card.height / 2 - view.height / 2)));
}

export interface PetalModel {
    chapterId: number;
    transform: string;
    /** רדיוס חזית המילוי, 0 = אין מילוי. תמיד לפני צומת השליטה. */
    fill: number;
    /** צורת חומר ההתקדמות (קפסולה עם חזית מעוגלת), או "" כשאין מילוי. */
    fillPath: string;
    /** הליבה הבהירה: קו לאורך הציר עד ממש לפני החזית, או "". */
    corePath: string;
    complete: boolean;
    mastered: boolean;
    current: boolean;
    focused: boolean;
}

/** כל התקדמות גדולה מאפס נראית לפחות כקצה קטן של חומר מאיר, כדי ש"הלמידה החלה" תיראה. */
export const FILL_MIN_VISIBLE = 10;
export const FILL_START = PETAL.innerRadius - PETAL.innerHalfWidth;
/** כמה פנימה מהזכוכית חומר ההתקדמות מצויר. */
export const FILL_INSET = 2.2;
const corePath = (front: number) =>
    front - 5 > PETAL.innerRadius ? `M0 ${-PETAL.innerRadius}L0 ${-(front - 5)}` : "";

export function fillExtent(ratio: number): number {
    if (!(ratio > 0)) return 0;
    return Math.max(fillRadius(ratio), FILL_START + FILL_MIN_VISIBLE);
}

/** 19 עלים, לפי זהות הפרק. focused = פרק שמוצג בתצוגה מקדימה (לא הנוכחי). */
export function petalModels(course: CourseLearning, currentId: number | null, focusedId: number | null): PetalModel[] {
    return course.chapters.map((c) => ({
        chapterId: c.chapterId,
        transform: petalTransform(c.chapterId),
        fill: fillExtent(c.learningProgressRatio),
        fillPath: c.learningProgressRatio > 0 ? fillPath(fillExtent(c.learningProgressRatio), FILL_INSET) : "",
        corePath: c.learningProgressRatio > 0 ? corePath(fillExtent(c.learningProgressRatio)) : "",
        complete: c.learningProgressRatio >= 1,
        mastered: c.masteryEarned,
        current: c.chapterId === currentId,
        focused: c.chapterId === focusedId && c.chapterId !== currentId,
    }));
}

/**
 * מספרי הפרקים סביב מפת הקורס (ה-Pulse הפתוח): "1" קבוע (כאן המפה מתחילה), מספר הפרק הנוכחי ("אתה
 * כאן"), ומספר הפרק שבריחוף/מיקוד, זמני. בלי כפילויות: פרק 1 נוכחי מקבל רק את סימון הנוכחי.
 */
export type MapMarker = { chapterId: number; kind: "start" | "current" | "active" };
export function mapMarkers(currentId: number | null, activeId: number | null): MapMarker[] {
    const marks: MapMarker[] = [];
    if (currentId !== 1) marks.push({ chapterId: 1, kind: "start" });
    if (currentId !== null) marks.push({ chapterId: currentId, kind: "current" });
    if (activeId !== null && activeId !== 1 && activeId !== currentId) marks.push({ chapterId: activeId, kind: "active" });
    return marks;
}

/** השם של עלה כקישור ניווט (וגם התיאור הצף): "פרק 6 - Attention", עם הכותרת הקצרה של כרטיסי הניווט. */
export const petalLinkName = (chapterLabel: string, title: string) => `${chapterLabel} - ${navTitle(title)}`;

/** הסיכום הנגיש היחיד של ה-Pulse. percent = אחוז התקדמות הלמידה, כבר בפורמט של השפה. */
export function pulseSummary(brand: string, course: CourseLearning, copy: PulseCopy, current: { id: number; title: string } | null, percent: string): string {
    const parts = [brand, `${copy.learningProgress} ${percent}`, copy.masteredSummary(course.masteredCount, course.chapters.length)];
    if (current) parts.push(copy.currentSummary(current.id, current.title));
    return copy.sentences(parts);
}

export const scoreText = (chapter: ChapterLearning, copy: PulseCopy) =>
    chapter.latestScore === null ? copy.notAttempted : copy.latestScoreValue(chapter.latestScore);

/** שם נגיש לכרטיס פרק: פרק, שם, התקדמות איכותית, שליטה, ציון אחרון, ומצבים. בלי מספר יחידות. */
export function chapterCardName(
    chapter: ChapterLearning,
    copy: PulseCopy,
    label: string,
    title: string,
    opts: { current?: boolean; lockedLabel?: string | null } = {},
): string {
    const parts = [
        copy.titled(label, title),
        copy.bands[progressBand(chapter.learningProgressRatio)],
        chapter.masteryEarned ? copy.masteryAchieved : copy.masteryNotYet,
        scoreText(chapter, copy),
    ];
    if (opts.current) parts.push(copy.currentChapter);
    if (opts.lockedLabel) parts.push(opts.lockedLabel);
    return copy.sentences(parts);
}

export interface ContinueAction {
    target: ContinueTarget;
    label: string;
    href: string;
}

/**
 * נקודת ההמשך בתוך פרק, ככתובת: #resume=<unitId> (יחידת למידה רשומה) או #resume=quiz (מבדק הפרק).
 * ChapterLayout צורך אותה פעם אחת ומוחק אותה מהכתובת. יחידה היא "הגיע", לא "סיים": חוזרים אליה,
 * לא מדלגים אחריה.
 */
export const RESUME_HASH = "#resume=";

/** הבורר של נקודת ההמשך בפרק, או null כשה-hash אינו נקודת המשך תקפה של הפרק הזה. */
export function resumeSelector(hash: string, chapterId: number): string | null {
    if (!hash.startsWith(RESUME_HASH)) return null;
    const id = hash.slice(RESUME_HASH.length);
    if (id === "quiz") return "[data-chapter-quiz]";
    return isLearningUnit(chapterId, id) ? `[data-learning-unit="${id}"]` : null;
}

/**
 * הקפיצה לנקודת ההמשך (ChapterLayout בהגעה, "המשך" באותו פרק). גוללת רק את מיכל התוכן של הפרק:
 * scrollIntoView גולל גם את המסמך, ואז הפוטר שמתחת למעטפת נחשף. המרווח מהכותרת נלקח פעם אחת,
 * מ-scroll-padding של המיכל (--bts-sticky-top), בלי להוסיף את scroll-margin של היעד.
 * מיידי: גלילה חלקה הייתה חולפת על יחידות ומסמנת אותן "הגיע".
 */
export function scrollToResumeTarget(selector: string): void {
    const target = document.querySelector(selector);
    const scroller = target?.closest<HTMLElement>("[data-chapter-content-scroller]");
    if (!target || !scroller) return;
    const clearance = parseFloat(getComputedStyle(scroller).scrollPaddingTop) || 0;
    const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - clearance;
    scroller.scrollTo({ top, behavior: "instant" });
}

const resumeHash = (target: ContinueTarget): string => {
    if (target.kind === "quiz") return `${RESUME_HASH}quiz`;
    if (target.kind === "continue" && target.unitId && isLearningUnit(target.chapterId, target.unitId)) return RESUME_HASH + target.unitId;
    return "";
};

/**
 * הפעולה "המשך למידה" מתוך היעד הטהור. null = אין פעולה (אין גישה, או שמבחן הסיום עבר).
 * כשהיעד הוא הפרק שבו הלומד נמצא, התווית היא "המשך מאיפה שעצרת". הקישור לפרק, עם נקודת ההמשך
 * (יחידה או מבדק) כשהיא ידועה; בלעדיה, ראש הפרק.
 */
export function continueAction(
    target: ContinueTarget | null,
    currentId: number | null,
    copy: PulseCopy,
    chapterLabel: (n: number) => string,
): ContinueAction | null {
    if (!target) return null;
    if (target.kind === "final-exam") return { target, label: copy.continue.finalExam, href: FINAL_EXAM_HREF };
    const label = chapterLabel(target.chapterId);
    const href = chapterHref(target.chapterId) + resumeHash(target);
    if (target.kind === "start") return { target, label: copy.continue.start(label), href };
    if (target.kind === "quiz") return { target, label: copy.continue.quiz(label), href };
    return { target, label: target.chapterId === currentId ? copy.continue.resumeHere : copy.continue.continue(label), href };
}
