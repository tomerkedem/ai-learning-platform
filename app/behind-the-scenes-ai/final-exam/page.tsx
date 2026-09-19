"use client";

// ════════════════════════════════════════════════════════════════════════
// עמוד ייעודי למבחן סיום הלומדה "מאחורי הקלעים של AI".
// מפריד את המבחן המסכם מפרק 16, ומציג מעליו את לוח ההתקדמות.
// משתמש בסרגל הצד המשותף וברקע של הלומדה, בלי לשנות את ChapterLayout.
// כל מחרוזת תצוגה מגיעה מהמילון (t.behindAi.finalExam); ההתנהגות והנתונים המבניים
// של דרגות הציון (min/color) נשארים ב-quizData.ts ואינם משתנים כאן.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { ArrowRight, ArrowLeft, GraduationCap } from "lucide-react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { AssessmentEngine, type ReviewLink } from "@/components/content/AssessmentEngine";
import { behindAiFinalExam, finalExamTiers } from "../quizData";
import { MasteryDashboard } from "../MasteryDashboard";
import { useT } from "@/i18n/useT";

export default function FinalExamPage() {
    const { dir, t } = useT();
    const fx = t.behindAi.finalExam;
    const cq = t.behindAi.chapterQuiz;

    // נתונים והתנהגות בלבד מתוך quizData (בלי מחרוזות התצוגה העבריות).
    const { questions: baseQuestions, passScore, onComplete, getReviewLinks, soundEnabled } = behindAiFinalExam;
    const questions = baseQuestions.map((question) => ({
        ...question,
        ...(fx.questionOverrides[question.id as 13 | 17] ?? {}),
    }));

    // דרגות ציון מתורגמות: שומרים את ה-min/color המבניים מ-quizData וממזגים מעליהם
    // את ה-label/sub מהמילון לפי הסדר, בלי לשנות את quizData.
    const localizedTiers = finalExamTiers.map((tier, i) => ({
        ...tier,
        label: fx.tiers[i]?.label ?? tier.label,
        sub: fx.tiers[i]?.sub ?? tier.sub,
    }));

    // קישורי חזרה: שומרים על ה-href והניתוב, ומתרגמים רק את התווית. מספר הפרק נגזר
    // מתוך ה-href (.../chapter-N). אם הגזירה נכשלת, נשארים בתווית המקורית. אותו דפוס
    // בטוח כמו ב-ChapterQuiz, ובלי לשנות את reviewLinksForConcepts שב-quizData.
    const localizedReviewLinks = getReviewLinks
        ? (weakConcepts: string[]): ReviewLink[] =>
              getReviewLinks(weakConcepts).map((link) => {
                  const match = link.href.match(/chapter-(\d+)/);
                  const n = match ? Number(match[1]) : null;
                  const name = n != null ? cq.chapterNames[n] : undefined;
                  if (n == null || !name) return link;
                  return { ...link, label: cq.reviewLinkLabel(n, name) };
              })
        : undefined;

    return (
        <div
            className="flex min-h-screen bg-[var(--bts-page)] font-sans text-[var(--bts-text-bright)] selection:bg-indigo-500/30 overflow-hidden relative"
            dir={dir}
        >
            {/* רקע גלובלי, באותו שפה עיצובית של פרקי הלומדה */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[var(--bts-page)]" />
                <div className="absolute inset-0 opacity-40">
                    <div
                        className="absolute inset-0"
                        style={{ backgroundImage: "radial-gradient(var(--bts-dot) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                    />
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-150 h-150 bg-blue-500/20 blur-[120px] rounded-full [mix-blend-mode:var(--bts-ambient-blend)] animate-pulse motion-reduce:animate-none" />
                <div className="absolute bottom-[-20%] left-[-10%] w-125 h-125 bg-indigo-600/10 blur-[100px] rounded-full [mix-blend-mode:var(--bts-ambient-blend)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bts-page)_120%)]" />
            </div>

            <CourseSidebar />

            <div className="flex-1 relative h-screen overflow-y-auto custom-scrollbar z-10">
                <main className="mx-auto max-w-3xl px-6 md:px-10 py-16 space-y-10">
                    {/* כותרת */}
                    <header className="text-center space-y-4">
                        <Link
                            href="/behind-the-scenes-ai/chapter-19"
                            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--bts-text-faint)] hover:text-[color-mix(in_oklab,var(--color-blue-400)_calc(100%_-_var(--bts-ink-darken)),black)] transition-colors no-underline group"
                        >
                            {dir === "rtl"
                                ? <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform" />
                                : <ArrowLeft size={14} className="group-hover:translate-x-1 transition-transform" />}
                            {fx.backToChapter}
                        </Link>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
                            <GraduationCap size={32} className="text-blue-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--bts-text-primary)]">{fx.pageTitle}</h1>
                        <p className="text-[var(--bts-text-muted)] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            {fx.pageSubtitle}
                        </p>
                    </header>

                    {/* לוח התקדמות לפני המבחן */}
                    <MasteryDashboard showFinalExamCta={false} />

                    {/* המבחן עצמו: התנהגות מ-quizData, כל מחרוזות התצוגה מהמילון */}
                    <AssessmentEngine
                        questions={questions}
                        passScore={passScore}
                        scoreTiers={localizedTiers}
                        onComplete={onComplete}
                        getReviewLinks={localizedReviewLinks}
                        soundEnabled={soundEnabled}
                        title={fx.examTitle}
                        subtitle={fx.examSubtitle}
                        startLabel={fx.startLabel}
                        submitLabel={fx.submitLabel}
                        completedTitle={fx.completedTitle}
                        /* M13: אין כאן prop של מנטור. חוסר-הפורטרט הוא ברירת המחדל של
                           AssessmentEngine, ולכן אייקוני הסטטוס בפתיחה ובתוצאה אינם
                           תלויים בכך שהעמוד הזה יזכור להעביר משהו. */
                        reviewHref="/behind-the-scenes-ai/introduction"
                        reviewLabel={fx.reviewLabel}
                        nextHref="/"
                        nextLabel={fx.nextLabel}
                    />
                </main>
            </div>
        </div>
    );
}
