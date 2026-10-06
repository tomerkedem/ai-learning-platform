"use client";

// ════════════════════════════════════════════════════════════════════════
// חיבור Learning Pulse וכרטיסי הפרקים לסרגל הצד האמיתי. המקום היחיד שקורא את המצב המשותף
// (useCourseLearning), את מצב הגישה ואת הנתיב. אין כאן טעינה ואין גזירה נוספת: הכל מגיע מהמאגר
// (learnerState.ts). הסרגל עולה מחדש בכל ניווט, ובנייד יש עותק נוסף במגירה: שניהם קוראים מאותו מאגר.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useState, useSyncExternalStore } from "react";
import { useT } from "@/i18n/useT";
import { courses } from "@/lib/courseData";
import { tField } from "@/lib/localize";
import { useCourseAccess } from "./_access/CourseAccessContext";
import { hasCourseAccess } from "./_access/access";
import { chapterMilestones, courseLearning } from "./learningProgress";
import { useCourseLearning } from "./learnerState";
import { ContinueLink, LearningPulsePanel, type PulseLayout } from "./LearningPulse";
import { ChapterNavCard, IntroNavRow } from "./ChapterNavCard";
import { FINAL_EXAM_HREF, chapterIdFromPath } from "./learningPulseModel";
import { SyncNotice, hasSyncNotice } from "./MasteryDashboard";

// ── מצב ה-Pulse: פתוח בראש הרשימה במסך גבוה, מכווץ אחרי גלילה (listScrolled, עם סף כפול ב-CourseSidebar)
//    ובמסך נמוך/נייד. בחירה מפורשת של הלומד גוברת עד שהרשימה חוצה שוב סף; בלי שמירה בין עמודים. ──
const TALL = "(min-width: 768px) and (min-height: 800px)";

function subscribeTall(listener: () => void) {
    const mq = window.matchMedia(TALL);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
}

/**
 * ה-Pulse בסרגל (מעל רשימת הפרקים, לא נגלל). מוצג ללומד מחובר בלבד: לאורח אין מצב למידה. הודעת
 * הסנכרון הקיימת מופיעה רק כשיש מצב חריג (ניתוק, תוצאות שממתינות, תוצאות שנדחו).
 */
export function SidebarPulse({ pathname, previewChapterId, listScrolled, morph, onNavigate }: {
    pathname: string | null; previewChapterId: number | null; listScrolled: boolean; morph: boolean; onNavigate: () => void;
}) {
    const learner = useCourseLearning();
    const access = useCourseAccess();
    // null בשרת ובהידרציה: "auto" (CSS לפי המסך), כדי שהעמוד הראשון לא יהבהב.
    const tall = useSyncExternalStore(subscribeTall, () => window.matchMedia(TALL).matches, () => null);
    const [choice, setChoice] = useState<"expanded" | "compact" | null>(null);
    // חציית סף (ירידה או חזרה לראש) מבטלת את הבחירה המפורשת: מעדכנים בזמן הרינדור, בלי אפקט.
    const [seenScrolled, setSeenScrolled] = useState(listScrolled);
    if (seenScrolled !== listScrolled) {
        setSeenScrolled(listScrolled);
        setChoice(null);
    }
    if (!learner) return null;
    const layout: PulseLayout = choice ?? (listScrolled ? "compact" : tall === null ? "auto" : tall ? "expanded" : "compact");
    return (
        <div className="mt-2">
            <LearningPulsePanel
                course={learner.course}
                currentChapterId={chapterIdFromPath(pathname)}
                previewChapterId={previewChapterId}
                accessActive={hasCourseAccess(access.status)}
                layout={layout}
                morph={morph || choice !== null}
                onLayoutChange={setChoice}
                finalExamCurrent={pathname === FINAL_EXAM_HREF}
                onNavigate={onNavigate}
                syncNotice={hasSyncNotice(learner.sync) ? <SyncNotice sync={learner.sync} compact /> : undefined}
            />
        </div>
    );
}

/** "המשך" בכותרת תוכן העניינים: אותו מאגר ואותו כלל יעד. ללומד מחובר עם גישה פעילה בלבד. */
export function SidebarContinue({ pathname, onNavigate }: { pathname: string | null; onNavigate: () => void }) {
    const learner = useCourseLearning();
    const access = useCourseAccess();
    if (!learner || !hasCourseAccess(access.status)) return null;
    return <ContinueLink course={learner.course} currentChapterId={chapterIdFromPath(pathname)} onNavigate={onNavigate} />;
}

const GUEST = { course: courseLearning([], []), milestones: chapterMilestones([]) };

/**
 * רשימת הניווט: מבוא ו-19 כרטיסי פרקים. מבחן הסיום אינו פרק: הוא כרטיס הזהב בפאנל ה-Pulse (ובסוף
 * עמוד פרק 19). אורח רואה את הפרקים בלי מצב למידה (ונעולים).
 * הנעילה לפי הגישה בלבד, ואינה מוחקת היסטוריה.
 */
export function SidebarChapterList({ pathname, onPreview, onNavigate }: {
    pathname: string | null; onPreview: (id: number | null) => void; onNavigate: () => void;
}) {
    const { locale } = useT();
    const learner = useCourseLearning();
    const access = useCourseAccess();
    const { course, milestones } = learner ?? GUEST;
    const locked = !hasCourseAccess(access.status);
    const current = chapterIdFromPath(pathname);
    const intro = courses["behind-the-scenes-ai"].chapters.find((c) => c.id === 0);
    return (
        <div className="space-y-1">
            {intro?.href && (
                <IntroNavRow title={tField(intro.title, locale)} href={intro.href} current={pathname === intro.href} onNavigate={onNavigate} />
            )}
            {course.chapters.map((c) => (
                <ChapterNavCard
                    key={c.chapterId}
                    chapter={c}
                    milestones={milestones[c.chapterId - 1]}
                    current={c.chapterId === current}
                    locked={locked}
                    onPreview={onPreview}
                    onNavigate={onNavigate}
                />
            ))}
        </div>
    );
}
