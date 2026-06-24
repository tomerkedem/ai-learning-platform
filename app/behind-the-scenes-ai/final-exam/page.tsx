"use client";

// ════════════════════════════════════════════════════════════════════════
// עמוד ייעודי למבחן סיום הלומדה "מאחורי הקלעים של AI".
// מפריד את המבחן המסכם מפרק 16, ומציג מעליו את לוח ההתקדמות.
// משתמש בסרגל הצד המשותף וברקע הכהה של הלומדה, בלי לשנות את ChapterLayout.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { AssessmentEngine } from "@/components/content/AssessmentEngine";
import { behindAiFinalExam } from "../quizData";
import { MasteryDashboard } from "../MasteryDashboard";

export default function FinalExamPage() {
    return (
        <div
            className="flex min-h-screen bg-[#050B14] font-sans text-slate-100 selection:bg-indigo-500/30 overflow-hidden relative"
            dir="rtl"
        >
            {/* רקע גלובלי, באותו שפה עיצובית של פרקי הלומדה */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#050B14]" />
                <div className="absolute inset-0 opacity-40">
                    <div
                        className="absolute inset-0"
                        style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                    />
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-150 h-150 bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-125 h-125 bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050B14_120%)]" />
            </div>

            <CourseSidebar />

            <div className="flex-1 relative h-screen overflow-y-auto custom-scrollbar z-10">
                <main className="mx-auto max-w-3xl px-6 md:px-10 py-16 space-y-10">
                    {/* כותרת */}
                    <header className="text-center space-y-4">
                        <Link
                            href="/behind-the-scenes-ai/chapter-16"
                            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors no-underline group"
                        >
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            חזרה לפרק 16
                        </Link>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
                            <GraduationCap size={32} className="text-blue-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">מבחן סיום הלומדה</h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            המבחן המסכם של &quot;מאחורי הקלעים של AI&quot;. הוא בוחן את כל המסלול: מהקלט ועד ההחלטה האחראית, ואת הקשרים בין המושגים. אפשר לחזור אליו בכל עת, וההתקדמות נשמרת במכשיר שלכם.
                        </p>
                    </header>

                    {/* לוח התקדמות לפני המבחן */}
                    <MasteryDashboard showFinalExamCta={false} />

                    {/* המבחן עצמו */}
                    <AssessmentEngine
                        {...behindAiFinalExam}
                        reviewHref="/behind-the-scenes-ai/introduction"
                        reviewLabel="חזרה לתחילת הלומדה"
                        nextHref="/"
                        nextLabel="סיום: חזרה לקטלוג הלומדות"
                    />
                </main>
            </div>
        </div>
    );
}
