"use client";

// ════════════════════════════════════════════════════════════════════════
// עטיפה ממוקמת ל-AssessmentEngine שמלבישה כרום מתורגם על שלד מבדק הפרק.
// ────────────────────────────────────────────────────────────────────────
// ההתנהגות והנתונים (questions, passScore, onComplete, getReviewLinks, nextHref,
// showTimer, soundEnabled) נשמרים כמו שהם מ-behindAiChapterQuizzes[chapterId];
// רק מחרוזות התצוגה מוחלפות במחרוזות מהמילון (t.behindAi.chapterQuiz). quizData.ts
// אינו משתנה. הניתוב של קישורי החזרה נשמר, ורק התווית מתורגמת לפי מספר הפרק.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React from "react";
import { AssessmentEngine, type ReviewLink } from "@/components/content/AssessmentEngine";
import { ExpandableLab } from "@/components/ai-internals/ExpandableLab";
import { behindAiChapterQuizzes } from "./quizData";
import { useT } from "@/i18n/useT";

export function ChapterQuiz({ chapterId }: { chapterId: number }) {
    const { t } = useT();
    const cq = t.behindAi.chapterQuiz;
    const base = behindAiChapterQuizzes[chapterId];
    if (!base) return null;

    const chapterName = cq.chapterNames[chapterId] ?? "";

    // עטיפת getReviewLinks: שומרת על ה-href והניתוב, ומתרגמת רק את התווית. מספר
    // הפרק נגזר מתוך ה-href (.../chapter-N). אם הגזירה נכשלת, נשארים בתווית המקורית.
    const baseGetReviewLinks = base.getReviewLinks;
    const getReviewLinks = baseGetReviewLinks
        ? (weakConcepts: string[]): ReviewLink[] =>
              baseGetReviewLinks(weakConcepts).map((link) => {
                  const match = link.href.match(/chapter-(\d+)/);
                  const n = match ? Number(match[1]) : null;
                  const name = n != null ? cq.chapterNames[n] : undefined;
                  if (n == null || !name) return link;
                  return { ...link, label: cq.reviewLinkLabel(n, name) };
              })
        : undefined;

    return (
        <ExpandableLab title={cq.title(chapterName)}>
            <AssessmentEngine
                {...base}
                title={cq.title(chapterName)}
                subtitle={cq.subtitle}
                startLabel={cq.startLabel}
                submitLabel={cq.submitLabel}
                completedTitle={cq.completedTitle}
                getReviewLinks={getReviewLinks}
            />
        </ExpandableLab>
    );
}
