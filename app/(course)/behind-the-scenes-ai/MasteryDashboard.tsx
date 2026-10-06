"use client";

// ════════════════════════════════════════════════════════════════════════
// לוח התקדמות קל ל"מאחורי הקלעים של AI".
// קורא את הסיכום מ-localStorage רק אחרי mount (כדי למנוע אי-התאמת hydration),
// ומתעדכן כשמבדק נשמר (אירוע פנימי) או כשמשתנה אחסון בטאב אחר.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { CheckCircle2, Target, TrendingUp, GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";
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
import { removeRejected, retryRejected, useAuthState, type PendingAttempt } from "./account";
import { useCourseLearning } from "./learnerState";

type ProgressDict = Dictionary["chrome"]["progress"];

const FINAL_EXAM_HREF = "/behind-the-scenes-ai/final-exam";

export interface SyncState {
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

export const hasSyncNotice = (s: SyncState | null) => !!s && (s.offline || s.pending.length > 0 || s.rejected.length > 0);

// מחובר: מהמצב המשותף (learnerState.ts): הסיכום מהחשבון (בכל מכשיר) ועוד ניסיונות שממתינים
// בתור, ובלי רשת העותק האחרון שנטען ועוד מה שממתין. כל הקוראים חולקים טעינה אחת. לא מחובר:
// מהתרגול המקומי בלי חשבון. נתוני חשבון אחד לעולם לא מוצגים תחת חשבון אחר או תחת אורח.
function useMasteryView(): MasteryView | null {
    const learner = useCourseLearning();
    const userId = useAuthState().session?.user.id;
    const [guest, setGuest] = useState<MasterySummary | null>(null);

    useEffect(() => {
        if (userId) return;
        const refresh = () => setGuest(getMasterySummary());
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
    }, [userId]);

    if (userId) return learner ? { summary: learner.summary, sync: learner.sync } : null;
    return guest ? { summary: guest, sync: null } : null;
}

// ────────────────────────────────────────────────────────────────────────
// מצב סנכרון לחשבון: ניתוק, תוצאות שעוד לא נשלחו, ותוצאות שהחשבון דחה (עם פעולות
// מפורשות: נסו שוב / הסרה). לא מבוסס רק על צבע: לכל מצב יש כותרת טקסט.
// ────────────────────────────────────────────────────────────────────────
export function SyncNotice({ sync, compact = false }: { sync: SyncState; compact?: boolean }) {
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
                        {sync.pending.map(p => <li key={p.attemptId}>{name(p)} · {t.chrome.assessment.scoreOutOf(p.scorePercent)} · {time(p.completedAt)}</li>)}
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
                                <span>{name(p)} · {t.chrome.assessment.scoreOutOf(p.scorePercent)} · {time(p.completedAt)}</span>
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
                    <div className="text-[10px] font-bold uppercase text-[var(--bts-text-faint)] mb-1">{progress.attempted}</div>
                    <div className="text-[var(--bts-text-primary)] font-black text-lg">{summary.attemptedChapters}<span className="text-[var(--bts-text-faint)] text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-[var(--bts-fill-soft)] rounded-2xl border border-[var(--bts-divider-soft)] p-3">
                    <div className="text-[10px] font-bold uppercase text-[var(--bts-text-faint)] mb-1">{progress.passed}</div>
                    <div className="text-emerald-400 font-black text-lg">{summary.passedChapters}<span className="text-[var(--bts-text-faint)] text-sm">/{summary.totalChapters}</span></div>
                </div>
                <div className="bg-[var(--bts-fill-soft)] rounded-2xl border border-[var(--bts-divider-soft)] p-3">
                    <div className="text-[10px] font-bold uppercase text-[var(--bts-text-faint)] mb-1">{progress.average}</div>
                    <div className="text-[var(--bts-text-primary)] font-black text-lg tabular-nums">{summary.averageScore !== null ? summary.averageScore : "-"}</div>
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
