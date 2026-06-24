"use client";

// ════════════════════════════════════════════════════════════════════════
// לוח התקדמות קל ל"מאחורי הקלעים של AI".
// קורא את הסיכום מ-localStorage רק אחרי mount (כדי למנוע אי-התאמת hydration),
// ומתעדכן כשמבדק נשמר (אירוע פנימי) או כשמשתנה אחסון בטאב אחר.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Target, TrendingUp, GraduationCap, ArrowLeft } from "lucide-react";
import {
    getMasterySummary,
    MASTERY_UPDATED_EVENT,
    MASTERY_STORAGE_KEY,
    type MasterySummary,
    type FinalExamStatus,
} from "./masteryProgress";

const FINAL_EXAM_HREF = "/behind-the-scenes-ai/final-exam";

function useMasterySummary(): MasterySummary | null {
    const [summary, setSummary] = useState<MasterySummary | null>(null);

    useEffect(() => {
        const refresh = () => setSummary(getMasterySummary());
        refresh();
        const onStorage = (e: StorageEvent) => {
            if (e.key === MASTERY_STORAGE_KEY) refresh();
        };
        window.addEventListener(MASTERY_UPDATED_EVENT, refresh);
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener(MASTERY_UPDATED_EVENT, refresh);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    return summary;
}

function finalExamText(status: FinalExamStatus): { label: string; color: string } {
    switch (status) {
        case "passed":
            return { label: "עבר", color: "text-emerald-400" };
        case "needs-review":
            return { label: "דורש חזרה", color: "text-amber-400" };
        default:
            return { label: "לא בוצע", color: "text-slate-400" };
    }
}

// ────────────────────────────────────────────────────────────────────────
// פאנל מלא: לעמוד מבחן הסיום ולמקומות שבהם יש מקום לסיכום נרחב.
// ────────────────────────────────────────────────────────────────────────
export function MasteryDashboard({ showFinalExamCta = true }: { showFinalExamCta?: boolean }) {
    const summary = useMasterySummary();

    if (!summary || !summary.hasAnyData) {
        return (
            <div dir="rtl" className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-right">
                <div className="flex items-center gap-2 text-slate-300 mb-1">
                    <TrendingUp size={18} className="text-blue-400" />
                    <h3 className="font-black text-white">ההתקדמות שלכם</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                    השלימו מבדק הבנה קצר בסוף כל פרק, וכאן תראו אילו מושגים כבר חזקים אצלכם ואילו כדאי לחזק. ההתקדמות נשמרת במכשיר שלכם.
                </p>
            </div>
        );
    }

    const exam = finalExamText(summary.finalExam);

    return (
        <div dir="rtl" className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-right space-y-5">
            <div className="flex items-center gap-2 text-slate-300">
                <TrendingUp size={18} className="text-blue-400" />
                <h3 className="font-black text-white">ההתקדמות שלכם בלומדה</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">הושלמו</div>
                    <div className="text-white font-black text-lg">{summary.completedChapters}<span className="text-slate-500 text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">עברו</div>
                    <div className="text-emerald-400 font-black text-lg">{summary.passedChapters}<span className="text-slate-500 text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">ממוצע</div>
                    <div className="text-white font-black text-lg tabular-nums">{summary.averageScore !== null ? `${summary.averageScore}%` : "-"}</div>
                </div>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">מבחן סיום</div>
                    <div className={`font-black text-lg ${exam.color}`}>{exam.label}</div>
                </div>
            </div>

            {summary.strongConcepts.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black mb-2">
                        <CheckCircle2 size={14} /> חזק אצלכם
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {summary.strongConcepts.slice(0, 6).map(c => (
                            <span key={c} className="text-[11px] font-bold text-emerald-200 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">{c}</span>
                        ))}
                    </div>
                </div>
            )}

            {summary.weakConcepts.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black mb-2">
                        <Target size={14} /> מושגים שכדאי לחזק
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {summary.weakConcepts.slice(0, 6).map(c => (
                            <span key={c} className="text-[11px] font-bold text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">{c}</span>
                        ))}
                    </div>
                </div>
            )}

            {showFinalExamCta && (
                <Link
                    href={FINAL_EXAM_HREF}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all no-underline"
                >
                    <GraduationCap size={18} /> מעבר למבחן סיום הלומדה
                    <ArrowLeft size={18} />
                </Link>
            )}
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────
// גרסה קומפקטית לסרגל הצד. נטענת רק אם כבר יש נתונים, כדי לא להכביד.
// ────────────────────────────────────────────────────────────────────────
export function SidebarMastery() {
    const summary = useMasterySummary();
    if (!summary || !summary.hasAnyData) return null;

    const exam = finalExamText(summary.finalExam);

    return (
        <div className="mt-5 pt-5 border-t border-slate-800/80" dir="rtl">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">שליטה במבדקים</span>
                {summary.averageScore !== null && (
                    <span className="text-[10px] font-mono text-slate-400">ממוצע {summary.averageScore}%</span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 px-2.5 py-1.5">
                    <div className="text-[9px] text-slate-500 font-bold">הושלמו</div>
                    <div className="text-white text-sm font-bold">{summary.completedChapters}/{summary.totalChapters}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 px-2.5 py-1.5">
                    <div className="text-[9px] text-slate-500 font-bold">עברו</div>
                    <div className="text-emerald-400 text-sm font-bold">{summary.passedChapters}/{summary.totalChapters}</div>
                </div>
            </div>

            {summary.weakConcepts.length > 0 && (
                <div className="mb-3">
                    <div className="text-[9px] text-amber-400 font-bold mb-1.5">כדאי לחזק</div>
                    <div className="flex flex-wrap gap-1">
                        {summary.weakConcepts.slice(0, 3).map(c => (
                            <span key={c} className="text-[10px] font-medium text-amber-200/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{c}</span>
                        ))}
                    </div>
                </div>
            )}

            <Link
                href={FINAL_EXAM_HREF}
                className="flex items-center justify-between gap-2 bg-slate-800/40 hover:bg-slate-800 px-2.5 py-2 rounded-lg border border-slate-700/50 transition-colors no-underline group"
            >
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                    <GraduationCap size={13} className="text-blue-400" /> מבחן סיום
                </span>
                <span className={`text-[10px] font-bold ${exam.color}`}>{exam.label}</span>
            </Link>
        </div>
    );
}
