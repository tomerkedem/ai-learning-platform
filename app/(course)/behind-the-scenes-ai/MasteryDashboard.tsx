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
import { formatChapterLabel } from "@/i18n/format";
import { LOCALES } from "@/i18n/config";
import {
    getPendingAttempts,
    loadAccountSnapshot,
    removeRejected,
    retryRejected,
    useAuthState,
    withPending,
    type PendingAttempt,
} from "./account";

type ProgressDict = Dictionary["chrome"]["progress"];

const FINAL_EXAM_HREF = "/behind-the-scenes-ai/final-exam";

interface SyncState {
    userId: string;
    offline: boolean;
    loadedAt: number | null;
    pending: PendingAttempt[];
    rejected: PendingAttempt[];
}

interface MasteryView {
    summary: MasterySummary;
    /** null = לא מחובר (תרגול בלי חשבון). */
    sync: SyncState | null;
}

const hasSyncNotice = (s: SyncState | null) => !!s && (s.offline || s.pending.length > 0 || s.rejected.length > 0);

// מחובר: הסיכום מהחשבון (בכל מכשיר) ועוד ניסיונות שממתינים בתור. בלי רשת: העותק האחרון
// שנטען מהחשבון ועוד מה שממתין. לא מחובר: מהתרגול המקומי בלי חשבון. נתוני חשבון אחד
// לעולם לא מוצגים תחת חשבון אחר או תחת אורח.
export function useMasteryView(): MasteryView | null {
    const [view, setView] = useState<MasteryView | null>(null);
    const userId = useAuthState().session?.user.id;

    useEffect(() => {
        let cancelled = false;
        const refresh = () => {
            if (!userId) return setView({ summary: getMasterySummary(), sync: null });
            loadAccountSnapshot(userId).then(snap => {
                if (cancelled) return;
                const queue = getPendingAttempts(userId);
                setView({
                    summary: getMasterySummary(withPending(snap.records, queue)),
                    sync: {
                        userId,
                        offline: snap.offline,
                        loadedAt: snap.loadedAt,
                        pending: queue.filter(p => !p.rejected),
                        rejected: queue.filter(p => p.rejected),
                    },
                });
            });
        };
        refresh();
        const onStorage = (e: StorageEvent) => {
            if (e.key === MASTERY_STORAGE_KEY) refresh();
        };
        window.addEventListener(MASTERY_UPDATED_EVENT, refresh);
        window.addEventListener("storage", onStorage);
        return () => {
            cancelled = true;
            window.removeEventListener(MASTERY_UPDATED_EVENT, refresh);
            window.removeEventListener("storage", onStorage);
        };
    }, [userId]);

    return view;
}

// ────────────────────────────────────────────────────────────────────────
// מצב סנכרון לחשבון: ניתוק, תוצאות שעוד לא נשלחו, ותוצאות שהחשבון דחה (עם פעולות
// מפורשות: נסו שוב / הסרה). לא מבוסס רק על צבע: לכל מצב יש כותרת טקסט.
// ────────────────────────────────────────────────────────────────────────
function SyncNotice({ sync, compact = false }: { sync: SyncState; compact?: boolean }) {
    const { locale, t } = useT();
    const a = t.chrome.account;
    const name = (p: PendingAttempt) => p.chapterId === null ? t.chrome.progress.finalExam : formatChapterLabel(locale, p.chapterId);
    const time = (ms: number) => new Date(ms).toLocaleString(LOCALES[locale].htmlLang, { dateStyle: "short", timeStyle: "short" });
    const text = compact ? "text-[10px]" : "text-xs";
    const btn = "rounded-md border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-2 py-1 font-bold text-[var(--bts-text-secondary)]";

    return (
        <div role="status" className={`space-y-2 ${text} leading-relaxed`}>
            {sync.offline && (
                <p className="text-[var(--bts-text-muted)]">
                    {sync.loadedAt !== null ? a.offlineCached(time(sync.loadedAt)) : a.offlineNoCache}
                </p>
            )}
            {sync.pending.length > 0 && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2">
                    <p className="font-bold bts-tier-amber">{a.unsyncedTitle(sync.pending.length)}</p>
                    <ul className="text-[var(--bts-text-secondary)]">
                        {sync.pending.map(p => <li key={p.attemptId}>{name(p)} · {p.scorePercent}% · {time(p.completedAt)}</li>)}
                    </ul>
                    <p className="text-[var(--bts-text-muted)]">{a.unsyncedHint}</p>
                </div>
            )}
            {sync.rejected.length > 0 && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 space-y-1.5">
                    <p className="font-bold text-[var(--bts-status-danger)]">{a.rejectedTitle(sync.rejected.length)}</p>
                    <p className="text-[var(--bts-text-muted)]">{a.rejectedHint}</p>
                    <ul className="space-y-1.5">
                        {sync.rejected.map(p => (
                            <li key={p.attemptId} className="flex flex-wrap items-center justify-between gap-2 text-[var(--bts-text-secondary)]">
                                <span>{name(p)} · {p.scorePercent}% · {time(p.completedAt)}</span>
                                <span className="flex gap-1.5">
                                    <button type="button" className={btn} onClick={() => retryRejected(sync.userId, p.attemptId)}>{a.retry}</button>
                                    <button type="button" className={btn} onClick={() => removeRejected(sync.userId, p.attemptId)}>{a.remove}</button>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function finalExamText(status: FinalExamStatus, progress: ProgressDict): { label: string; color: string } {
    switch (status) {
        case "passed":
            return { label: progress.status.passed, color: "text-emerald-400" };
        case "needs-review":
            return { label: progress.status.needsReview, color: "bts-tier-amber" };
        default:
            return { label: progress.status.notTaken, color: "text-[var(--bts-text-muted)]" };
    }
}

// ────────────────────────────────────────────────────────────────────────
// פאנל מלא: לעמוד מבחן הסיום ולמקומות שבהם יש מקום לסיכום נרחב.
// ────────────────────────────────────────────────────────────────────────
export function MasteryDashboard({ showFinalExamCta = true }: { showFinalExamCta?: boolean }) {
    const { dir, t } = useT();
    const progress = t.chrome.progress;
    const conceptLabels = t.behindAi.conceptLabels;
    const view = useMasteryView();
    const summary = view?.summary;
    const sync = view?.sync ?? null;
    const notice = sync && hasSyncNotice(sync) ? <SyncNotice sync={sync} /> : null;

    if (!summary || !summary.hasAnyData) {
        return (
            <div dir={dir} className="rounded-3xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-6 text-start space-y-3">
                <div className="flex items-center gap-2 text-[var(--bts-text-secondary)] mb-1">
                    <TrendingUp size={18} className="text-blue-400" />
                    <h3 className="font-black text-[var(--bts-text-primary)]">{progress.emptyTitle}</h3>
                </div>
                <p className="text-sm text-[var(--bts-text-muted)] leading-relaxed">
                    {progress.emptyBody}
                </p>
                {notice}
            </div>
        );
    }

    const exam = finalExamText(summary.finalExam, progress);

    return (
        <div dir={dir} className="rounded-3xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_50%,transparent)] p-6 text-start space-y-5">
            <div className="flex items-center gap-2 text-[var(--bts-text-secondary)]">
                <TrendingUp size={18} className="text-blue-400" />
                <h3 className="font-black text-[var(--bts-text-primary)]">{progress.title}</h3>
            </div>

            {notice}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[var(--bts-fill-soft)] rounded-2xl border border-[var(--bts-divider-soft)] p-3">
                    <div className="text-[10px] font-bold uppercase text-[var(--bts-text-faint)] mb-1">{progress.completed}</div>
                    <div className="text-[var(--bts-text-primary)] font-black text-lg">{summary.completedChapters}<span className="text-[var(--bts-text-faint)] text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-[var(--bts-fill-soft)] rounded-2xl border border-[var(--bts-divider-soft)] p-3">
                    <div className="text-[10px] font-bold uppercase text-[var(--bts-text-faint)] mb-1">{progress.passed}</div>
                    <div className="text-emerald-400 font-black text-lg">{summary.passedChapters}<span className="text-[var(--bts-text-faint)] text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-[var(--bts-fill-soft)] rounded-2xl border border-[var(--bts-divider-soft)] p-3">
                    <div className="text-[10px] font-bold uppercase text-[var(--bts-text-faint)] mb-1">{progress.average}</div>
                    <div className="text-[var(--bts-text-primary)] font-black text-lg tabular-nums">{summary.averageScore !== null ? `${summary.averageScore}%` : "-"}</div>
                </div>
                <div className="bg-[var(--bts-fill-soft)] rounded-2xl border border-[var(--bts-divider-soft)] p-3">
                    <div className="text-[10px] font-bold uppercase text-[var(--bts-text-faint)] mb-1">{progress.finalExam}</div>
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
                    <div className="flex items-center gap-1.5 bts-tier-amber text-xs font-black mb-2">
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
    const view = useMasteryView();
    const summary = view?.summary;
    const sync = view?.sync ?? null;
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

    const showNotice = !!sync && hasSyncNotice(sync);
    if (!summary || (!summary.hasAnyData && !showNotice)) return null;

    const exam = finalExamText(summary.finalExam, progress);

    return (
        <div className="mt-2 pt-0.5 border-t border-[var(--bts-sub-rule)]" dir={dir}>
            {/* כותרת לחיצה: מציגה סיכום קצר גם כשמכווץ, ומתקפלת בלחיצה */}
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-2 py-1.5 group"
            >
                <span className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--bts-text-faint)] group-hover:text-[var(--bts-text-secondary)] transition-colors">{progress.sidebarTitle}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[var(--bts-text-muted)]">{summary.completedChapters}/{summary.totalChapters}</span>
                    {summary.averageScore !== null && (
                        <span className="text-[10px] font-mono text-[var(--bts-text-faint)]">· {summary.averageScore}%</span>
                    )}
                    <ChevronDown size={14} className={`text-[var(--bts-text-faint)] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </span>
            </button>

            {/* מצב הסנכרון מוצג תמיד, גם כשהסיכום מכווץ */}
            {showNotice && sync && <div className="mt-2"><SyncNotice sync={sync} compact /></div>}

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
                                <div className="bg-[var(--bts-sub-fill)] rounded-lg border border-[var(--bts-border)] px-2.5 py-1.5">
                                    <div className="text-[9px] text-[var(--bts-text-faint)] font-bold">{progress.completed}</div>
                                    <div className="text-[var(--bts-text-primary)] text-sm font-bold">{summary.completedChapters}/{summary.totalChapters}</div>
                                </div>
                                <div className="bg-[var(--bts-sub-fill)] rounded-lg border border-[var(--bts-border)] px-2.5 py-1.5">
                                    <div className="text-[9px] text-[var(--bts-text-faint)] font-bold">{progress.passed}</div>
                                    <div className="text-emerald-400 text-sm font-bold">{summary.passedChapters}/{summary.totalChapters}</div>
                                </div>
                            </div>

                            {summary.weakConcepts.length > 0 && (
                                <div className="mb-3">
                                    <div className="text-[9px] bts-tier-amber font-bold mb-1.5">{progress.weakHeaderShort}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {summary.weakConcepts.slice(0, 3).map(c => (
                                            <span key={c} className="text-[10px] font-medium text-amber-200/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{conceptLabels[c] ?? c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Link
                                href={FINAL_EXAM_HREF}
                                className="flex items-center justify-between gap-2 bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-2.5 py-2 rounded-lg border border-[var(--bts-border)] transition-colors no-underline"
                            >
                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--bts-text-secondary)]">
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
