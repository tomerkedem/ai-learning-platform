"use client";

// ════════════════════════════════════════════════════════════════════════
// לוח התקדמות קל ל"מאחורי הקלעים של AI".
// קורא את הסיכום מ-localStorage רק אחרי mount (כדי למנוע אי-התאמת hydration),
// ומתעדכן כשמבדק נשמר (אירוע פנימי) או כשמשתנה אחסון בטאב אחר.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Target, TrendingUp, GraduationCap, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useT } from "@/i18n/useT";
import { GuessButton } from "@/components/ai-internals/GuessButton";
import type { Dictionary } from "@/i18n/dictionary";
import {
    getMasterySummary,
    MASTERY_UPDATED_EVENT,
    MASTERY_STORAGE_KEY,
    type MasterySummary,
    type FinalExamStatus,
} from "./masteryProgress";

type ProgressDict = Dictionary["chrome"]["progress"];

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

function finalExamText(status: FinalExamStatus, progress: ProgressDict): { label: string; color: string } {
    switch (status) {
        case "passed":
            return { label: progress.status.passed, color: "text-emerald-400" };
        case "needs-review":
            return { label: progress.status.needsReview, color: "text-amber-400" };
        default:
            return { label: progress.status.notTaken, color: "text-slate-400" };
    }
}

// ────────────────────────────────────────────────────────────────────────
// פאנל מלא: לעמוד מבחן הסיום ולמקומות שבהם יש מקום לסיכום נרחב.
// ────────────────────────────────────────────────────────────────────────
export function MasteryDashboard({ showFinalExamCta = true }: { showFinalExamCta?: boolean }) {
    const { dir, t } = useT();
    const progress = t.chrome.progress;
    const conceptLabels = t.behindAi.conceptLabels;
    const summary = useMasterySummary();

    if (!summary || !summary.hasAnyData) {
        return (
            <div dir={dir} className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-start">
                <div className="flex items-center gap-2 text-slate-300 mb-1">
                    <TrendingUp size={18} className="text-blue-400" />
                    <h3 className="font-black text-white">{progress.emptyTitle}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                    {progress.emptyBody}
                </p>
            </div>
        );
    }

    const exam = finalExamText(summary.finalExam, progress);

    return (
        <div dir={dir} className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-start space-y-5">
            <div className="flex items-center gap-2 text-slate-300">
                <TrendingUp size={18} className="text-blue-400" />
                <h3 className="font-black text-white">{progress.title}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">{progress.completed}</div>
                    <div className="text-white font-black text-lg">{summary.completedChapters}<span className="text-slate-500 text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">{progress.passed}</div>
                    <div className="text-emerald-400 font-black text-lg">{summary.passedChapters}<span className="text-slate-500 text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">{progress.average}</div>
                    <div className="text-white font-black text-lg tabular-nums">{summary.averageScore !== null ? `${summary.averageScore}%` : "-"}</div>
                </div>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">{progress.finalExam}</div>
                    <div className={`font-black text-lg ${exam.color}`}>{exam.label}</div>
                </div>
            </div>

            {summary.strongConcepts.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black mb-2">
                        <CheckCircle2 size={14} /> {progress.strongHeader}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {summary.strongConcepts.slice(0, 6).map(c => (
                            <span key={c} className="text-[11px] font-bold text-emerald-200 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">{conceptLabels[c] ?? c}</span>
                        ))}
                    </div>
                </div>
            )}

            {summary.weakConcepts.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black mb-2">
                        <Target size={14} /> {progress.weakHeader}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {summary.weakConcepts.slice(0, 6).map(c => (
                            <span key={c} className="text-[11px] font-bold text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">{conceptLabels[c] ?? c}</span>
                        ))}
                    </div>
                </div>
            )}

            {showFinalExamCta && (
                <GuessButton
                    href={FINAL_EXAM_HREF}
                    rgb="59,130,246"
                    fullWidth
                    leadingIcon={<GraduationCap size={18} />}
                    trailingIcon={dir === "rtl" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                >
                    {progress.finalExamCta}
                </GuessButton>
            )}
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────
// גרסה קומפקטית לסרגל הצד. נטענת רק אם כבר יש נתונים, כדי לא להכביד.
// מתקפלת (ברירת מחדל מכווצת) כדי לא לדחוק את רשימת הפרקים. ההעדפה נשמרת.
// ────────────────────────────────────────────────────────────────────────
const SIDEBAR_OPEN_KEY = "behindAiMasterySidebarOpen";

export function SidebarMastery() {
    const { dir, t } = useT();
    const progress = t.chrome.progress;
    const conceptLabels = t.behindAi.conceptLabels;
    const summary = useMasterySummary();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        try {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- שחזור העדפת הקיפול חייב לקרות אחרי mount בצד הלקוח, כדי למנוע אי-התאמת hydration
            setOpen(window.localStorage.getItem(SIDEBAR_OPEN_KEY) === "1");
        } catch {
            // אין localStorage: נשארים במצב מכווץ כברירת מחדל.
        }
    }, []);

    const toggle = () => {
        setOpen(prev => {
            const next = !prev;
            try {
                window.localStorage.setItem(SIDEBAR_OPEN_KEY, next ? "1" : "0");
            } catch {
                // התעלמות בשקט אם אי אפשר לשמור העדפה.
            }
            return next;
        });
    };

    if (!summary || !summary.hasAnyData) return null;

    const exam = finalExamText(summary.finalExam, progress);

    return (
        <div className="mt-5 pt-5 border-t border-slate-800/80" dir={dir}>
            {/* כותרת לחיצה: מציגה סיכום קצר גם כשמכווץ, ומתקפלת בלחיצה */}
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-2 group"
            >
                <span className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">{progress.sidebarTitle}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">{summary.completedChapters}/{summary.totalChapters}</span>
                    {summary.averageScore !== null && (
                        <span className="text-[10px] font-mono text-slate-500">· {summary.averageScore}%</span>
                    )}
                    <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 px-2.5 py-1.5">
                                    <div className="text-[9px] text-slate-500 font-bold">{progress.completed}</div>
                                    <div className="text-white text-sm font-bold">{summary.completedChapters}/{summary.totalChapters}</div>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 px-2.5 py-1.5">
                                    <div className="text-[9px] text-slate-500 font-bold">{progress.passed}</div>
                                    <div className="text-emerald-400 text-sm font-bold">{summary.passedChapters}/{summary.totalChapters}</div>
                                </div>
                            </div>

                            {summary.weakConcepts.length > 0 && (
                                <div className="mb-3">
                                    <div className="text-[9px] text-amber-400 font-bold mb-1.5">{progress.weakHeaderShort}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {summary.weakConcepts.slice(0, 3).map(c => (
                                            <span key={c} className="text-[10px] font-medium text-amber-200/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{conceptLabels[c] ?? c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Link
                                href={FINAL_EXAM_HREF}
                                className="flex items-center justify-between gap-2 bg-slate-800/40 hover:bg-slate-800 px-2.5 py-2 rounded-lg border border-slate-700/50 transition-colors no-underline"
                            >
                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                                    <GraduationCap size={13} className="text-blue-400" /> {progress.finalExam}
                                </span>
                                <span className={`text-[10px] font-bold ${exam.color}`}>{exam.label}</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
