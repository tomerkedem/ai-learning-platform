"use client";

// ════════════════════════════════════════════════════════════════════════
// ממשק ניהול הלומדה: חיפוש לומדים לפי שם או מייל, סטטוס אימות המייל וגישת הבטא, אישור
// לתקופה של עד חודש וביטול. כל קריאה עוברת לפונקציות admin_* במסד, שבודקות בעצמן שהקורא
// מנהל (public.course_admins) ומתעדות כל אישור וביטול. הרכיב הזה אינו מקור הרשאה.
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/i18n/useT";
import { LOCALES } from "@/i18n/config";
import { supabase } from "../account";
import { normalizeFullName } from "../authForm";
import { suspendAccount, reactivateAccount, type AccountActionResult } from "./actions";

interface Learner {
    user_id: string;
    email: string;
    full_name: string | null;
    email_confirmed_at: string | null;
    registered_at: string;
    is_admin: boolean;
    suspended: boolean;
    /** null = never suspended; false = Supabase Auth has not confirmed the sign-in block. */
    suspension_auth_synced: boolean | null;
    suspension_error: string | null;
    access_status: "active" | "no-grant" | "expired" | "revoked";
    access_approved_at: string | null;
    access_expires_at: string | null;
    access_revoked_at: string | null;
    /**
     * בסיס ההרשאה האחרונה. beta_request = מבקשה עם הסכמה רשומה של הלומד; admin_override = הרשאה
     * מנהלית ידנית, בלי הסכמה; legacy = מלפני שהבסיס נרשם; null = אין הרשאה.
     */
    access_grant_basis: "beta_request" | "admin_override" | "legacy" | null;
    last_action: "approve" | "revoke" | "rename" | "suspend" | "reactivate" | null;
    last_action_at: string | null;
    /** הבקשה האחרונה של הלומד לגישת בטא, אם יש. */
    request_id: string | null;
    request_status: "pending" | "approved" | "declined" | null;
    request_submitted_at: string | null;
    request_decided_at: string | null;
    request_terms_version: string | null;
    request_locale: string | null;
}

const PAGE = 50;
const DURATIONS = { week: "7 days", twoWeeks: "14 days", month: "1 month" } as const;
type DurationKey = keyof typeof DURATIONS;

const btn = "min-h-[44px] rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-3 py-2 text-xs font-bold text-[var(--bts-text-secondary)] transition-colors disabled:opacity-50";
const field = "min-h-[44px] w-full rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] px-3 py-2 text-sm text-[var(--bts-text-primary)]";

export default function AdminView() {
    const { dir, locale, t } = useT();
    const x = t.chrome.admin;
    const a = t.chrome.account;
    const lang = LOCALES[locale].htmlLang;
    const [query, setQuery] = useState("");
    const [pendingOnly, setPendingOnly] = useState(false);
    const [rows, setRows] = useState<Learner[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [durations, setDurations] = useState<Record<string, DurationKey>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loadedAt, setLoadedAt] = useState(0);
    // פעולה (אישור, ביטול, שינוי שם) מבקשת רענון; ה-effect טוען מחדש ומודד את הזמן.
    const [refreshTick, setRefreshTick] = useState(0);

    const fmt = (iso: string) => new Date(iso).toLocaleDateString(lang, { dateStyle: "medium" });
    const fmtExact = (iso: string) => new Date(iso).toLocaleString(lang, { dateStyle: "medium", timeStyle: "short" });
    // זמן שנותר נכון לרגע הטעינה האחרונה של הרשימה (loadedAt), בניסוח מקומי עם צורת הרבים
    // הנכונה (Intl), או null אם כבר עבר.
    const remaining = (iso: string): string | null => {
        const ms = Date.parse(iso) - loadedAt;
        if (ms <= 0) return null;
        const unit = (v: number, u: "day" | "hour" | "minute") =>
            new Intl.NumberFormat(lang, { style: "unit", unit: u, unitDisplay: "long" }).format(v);
        const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
        const parts = d > 0 ? [unit(d, "day"), unit(h, "hour")] : [unit(h, "hour"), unit(m, "minute")];
        return new Intl.ListFormat(lang, { style: "long", type: "unit" }).format(parts);
    };

    const fetchPage = useCallback(async (q: string, offset: number): Promise<Learner[] | null> => {
        if (!supabase) return null;
        const { data, error } = await supabase.rpc("admin_list_learners", { p_query: q.trim() || null, p_limit: PAGE, p_offset: offset, p_pending_only: pendingOnly });
        return error ? null : (data as Learner[]);
    }, [pendingOnly]);

    // now: רגע הבקשה, מועבר מהקורא (טיימר או פעולה) כדי שהרינדור יישאר טהור.
    const reload = useCallback(async (q: string, now: number) => {
        setLoading(true);
        const page = await fetchPage(q, 0);
        if (page) { setRows(page); setHasMore(page.length === PAGE); setLoadedAt(now); } else setMessage(x.error);
        setLoading(false);
    }, [fetchPage, x.error]);

    // חיפוש עם השהיה קצרה בזמן הקלדה, ורענון אחרי כל פעולה.
    useEffect(() => {
        const id = setTimeout(() => { void reload(query, Date.now()); }, 250);
        return () => clearTimeout(id);
    }, [query, reload, refreshTick]);

    const loadMore = async () => {
        setLoading(true);
        const page = await fetchPage(query, rows.length);
        if (page) { setRows((r) => [...r, ...page]); setHasMore(page.length === PAGE); } else setMessage(x.error);
        setLoading(false);
    };

    const act = async (userId: string, run: () => Promise<string>) => {
        setBusyId(userId);
        setMessage("");
        try {
            setMessage(await run());
            setRefreshTick((n) => n + 1);
        } catch {
            setMessage(x.error);
        }
        setBusyId(null);
    };

    // בקשה ממתינה מאושרת דרך admin_approve_beta_request: המסד יוצר את ההרשאה במנגנון הקיים
    // ומסמן את הבקשה כמאושרת באותה טרנזקציה. בלי בקשה ממתינה, אישור ידני כמו קודם.
    const approve = (l: Learner) => act(l.user_id, async () => {
        const p_duration = DURATIONS[durations[l.user_id] ?? "month"];
        const { data, error } = l.request_status === "pending" && l.request_id
            ? await supabase!.rpc("admin_approve_beta_request", { p_request_id: l.request_id, p_duration })
            : await supabase!.rpc("admin_approve_beta", { p_user_id: l.user_id, p_duration });
        if (error?.code === "BT004") return x.requestNotPending;
        // מושעה: שום הרשאה לא נוצרה או חודשה (ובקשה, אם יש, נשארת ממתינה). קודם מחזירים את החשבון.
        if (error?.code === "BT005") return x.requestSuspended;
        // פורסמה גרסה מהותית אחרי ההסכמה שבבקשה: הבקשה נשארת ממתינה עד שהלומד יאשר שוב.
        if (error?.code === "BT006") return x.requestTermsOutdated;
        if (error?.code === "42501") return x.requestNotAllowed;
        if (error) throw error;
        return x.approved(fmt(data as string));
    });

    const decline = (l: Learner) => {
        if (!l.request_id || !window.confirm(x.confirmDecline(l.full_name ?? l.email))) return;
        const requestId = l.request_id;
        void act(l.user_id, async () => {
            const { error } = await supabase!.rpc("admin_decline_beta_request", { p_request_id: requestId });
            if (error?.code === "BT004") return x.requestNotPending;
            if (error) throw error;
            return x.declined;
        });
    };

    const requestText = (l: Learner) =>
        !l.request_status || !l.request_submitted_at ? null
        : l.request_status === "pending" ? x.requestPending(fmt(l.request_submitted_at))
        : l.request_status === "approved" ? x.requestApproved(fmt(l.request_decided_at ?? l.request_submitted_at))
        : x.requestDeclined(fmt(l.request_decided_at ?? l.request_submitted_at));

    const revoke = (l: Learner) => {
        if (!window.confirm(x.confirmRevoke(l.full_name ?? l.email))) return;
        void act(l.user_id, async () => {
            const { error } = await supabase!.rpc("admin_revoke_beta", { p_user_id: l.user_id });
            if (error) throw error;
            return x.revoked;
        });
    };

    const saveName = (l: Learner, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("fullName") as HTMLInputElement;
        // עריכת מנהל: כלל הבסיס של המסד (2 עד 100), לא כלל ההרשמה של הלומדים.
        const name = normalizeFullName(input.value, null);
        if (!name) {
            setMessage(x.errorNameAdmin);
            input.focus();
            return;
        }
        void act(l.user_id, async () => {
            // המסד בודק שהקורא מנהל, אוכף את כלל השם ורושם את השינוי ביומן.
            const { error } = await supabase!.rpc("admin_set_learner_name", { p_user_id: l.user_id, p_full_name: name });
            if (error) throw error;
            setEditingId(null);
            return x.nameUpdated;
        });
    };

    // השעיה והחזרה רצות בשרת (מפתח ה-service role לעולם לא מגיע לדפדפן). כל תוצאה מקבלת
    // הודעה מדויקת: הצלחה רק כשגם המסד וגם Supabase Auth אישרו.
    const accountMessage = (kind: "suspend" | "reactivate", r: AccountActionResult) => {
        switch (r.outcome) {
            case "done": return kind === "suspend" ? x.suspendDone : x.reactivateDone;
            case "auth_failed": return kind === "suspend" ? x.suspendAuthFailed(r.detail) : x.reactivateAuthFailed(r.detail);
            case "record_failed": return x.recordFailed;
            case "not_allowed": return x.notAllowed;
            case "not_configured": return x.notConfigured;
            default: return x.error;
        }
    };

    const suspend = (l: Learner) => {
        if (!window.confirm(x.confirmSuspend(l.full_name ?? l.email))) return;
        void act(l.user_id, async () => accountMessage("suspend", await suspendAccount(l.user_id)));
    };

    const reactivate = (l: Learner) => {
        if (!window.confirm(x.confirmReactivate(l.full_name ?? l.email))) return;
        void act(l.user_id, async () => accountMessage("reactivate", await reactivateAccount(l.user_id)));
    };

    const lastActionText = (l: Learner) => {
        if (!l.last_action || !l.last_action_at) return null;
        const d = fmt(l.last_action_at);
        switch (l.last_action) {
            case "approve": return x.lastApproved(d);
            case "revoke": return x.lastRevoked(d);
            case "rename": return x.lastRenamed(d);
            case "suspend": return x.lastSuspended(d);
            default: return x.lastReactivated(d);
        }
    };

    const statusText = (l: Learner) =>
        l.access_status === "active" && l.access_expires_at ? x.statusActive(fmt(l.access_expires_at))
        : l.access_status === "expired" && l.access_expires_at ? x.statusExpired(fmt(l.access_expires_at))
        : l.access_status === "revoked" ? x.statusRevoked
        : x.statusNone;

    return (
        <div className="min-h-screen bg-[var(--bts-page)] text-[var(--bts-text-primary)]" dir={dir}>
            <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12 space-y-5 text-start">
                <Link href="/behind-the-scenes-ai/introduction" className="text-xs font-bold text-[var(--bts-text-muted)] underline hover:text-[var(--bts-text-secondary)]">
                    {x.back}
                </Link>
                <header className="space-y-2">
                    <h1 className="text-2xl font-black">{x.title}</h1>
                    <p className="text-sm text-[var(--bts-text-muted)] leading-relaxed">{x.intro}</p>
                </header>

                <label className="block text-xs font-bold text-[var(--bts-text-secondary)]">
                    {x.searchLabel}
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={x.searchPlaceholder}
                        className={`${field} mt-1`}
                    />
                </label>
                <label className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--bts-text-secondary)]">
                    <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} className="h-5 w-5 shrink-0" />
                    {x.pendingOnly}
                </label>

                <p aria-live="polite" className="min-h-[1.25rem] text-sm font-bold text-[var(--bts-text-secondary)]">
                    {message || (!loading && x.shown(rows.length))}
                </p>

                {!loading && rows.length === 0 && <p className="text-sm text-[var(--bts-text-muted)]">{pendingOnly ? x.emptyPending : x.empty}</p>}

                <ul className="space-y-3">
                    {rows.map((l) => {
                        const busy = busyId === l.user_id;
                        return (
                            <li key={l.user_id} className="rounded-2xl border border-[var(--bts-divider-soft)] bg-[color-mix(in_oklab,var(--bts-panel-from)_60%,transparent)] p-4 space-y-3">
                                <div className="min-w-0">
                                    {editingId === l.user_id ? (
                                        <form onSubmit={(e) => saveName(l, e)} className="space-y-2">
                                            <label className="block text-[11px] font-bold text-[var(--bts-text-faint)]">
                                                {a.fullName}
                                                <input name="fullName" type="text" required minLength={2} maxLength={100} autoComplete="off" defaultValue={l.full_name ?? ""} aria-describedby={`name-rule-${l.user_id}`} className={`${field} mt-1`} />
                                            </label>
                                            <p id={`name-rule-${l.user_id}`} className="text-[11px] leading-relaxed text-[var(--bts-text-muted)]">{x.nameRuleHint}</p>
                                            <div className="flex gap-2">
                                                <button type="submit" className={`${btn} flex-1`} disabled={busy}>{a.saveName}</button>
                                                <button type="button" className={`${btn} flex-1`} disabled={busy} onClick={() => setEditingId(null)}>{a.cancel}</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-bold leading-tight break-words">
                                                {l.full_name ? <bdi>{l.full_name}</bdi> : <span className="text-[var(--bts-text-faint)]">{x.noName}</span>}
                                            </p>
                                            <button type="button" className="shrink-0 min-h-[44px] px-2 text-[11px] font-bold text-[var(--bts-text-muted)] underline hover:text-[var(--bts-text-secondary)]" onClick={() => setEditingId(l.user_id)}>
                                                {a.editName}
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-sm text-[var(--bts-text-muted)] break-all"><bdi dir="ltr">{l.email}</bdi></p>
                                </div>
                                <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                                    <span className={`rounded-md border px-2 py-1 ${l.email_confirmed_at ? "border-emerald-500/40 text-[var(--bts-status-positive)]" : "border-[var(--bts-border)] text-[var(--bts-text-muted)]"}`}>
                                        {l.email_confirmed_at ? x.confirmed : x.unconfirmed}
                                    </span>
                                    <span className={`rounded-md border px-2 py-1 ${l.access_status === "active" ? "border-emerald-500/40 text-[var(--bts-status-positive)]" : "border-[var(--bts-border)] text-[var(--bts-text-secondary)]"}`}>
                                        {statusText(l)}
                                    </span>
                                    {l.is_admin && (
                                        <span className="rounded-md border border-[var(--bts-border)] px-2 py-1 text-[var(--bts-text-secondary)]">{x.adminBadge}</span>
                                    )}
                                    {l.suspended && (
                                        <span className="rounded-md border border-rose-500/50 px-2 py-1 text-[var(--bts-status-danger)]">{x.suspendedBadge}</span>
                                    )}
                                    {requestText(l) && (
                                        <span className={`rounded-md border px-2 py-1 ${l.request_status === "pending" ? "border-amber-500/50 bts-tier-amber" : "border-[var(--bts-border)] text-[var(--bts-text-secondary)]"}`}>
                                            {requestText(l)}
                                        </span>
                                    )}
                                </div>
                                {l.request_terms_version && l.request_locale && (
                                    <p className="text-[11px] text-[var(--bts-text-faint)]">
                                        {x.requestTerms(l.request_terms_version, LOCALES[l.request_locale as keyof typeof LOCALES]?.label ?? l.request_locale)}
                                    </p>
                                )}
                                {l.suspended && l.suspension_auth_synced === false && (
                                    <p role="note" className="rounded-lg border border-amber-500/40 px-3 py-2 text-xs font-bold bts-tier-amber">
                                        {x.suspendPending(l.suspension_error ?? "")}
                                    </p>
                                )}
                                {/* תזמון ההרשאה: רק למי שיש לו הרשאה (בלי ספירה לאחור למי שאין). */}
                                {l.access_approved_at && l.access_expires_at && (
                                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                                        <dt className="text-[var(--bts-text-faint)]">{x.grantStart}</dt>
                                        <dd className="font-bold">{fmtExact(l.access_approved_at)}</dd>
                                        <dt className="text-[var(--bts-text-faint)]">{x.expiresAt}</dt>
                                        <dd className="font-bold">{fmtExact(l.access_expires_at)}</dd>
                                        <dt className="text-[var(--bts-text-faint)]">{x.timeLeft}</dt>
                                        <dd className="font-bold">
                                            {l.access_status === "revoked" && l.access_revoked_at ? x.revokedAt(fmtExact(l.access_revoked_at))
                                                : (l.access_status === "active" && remaining(l.access_expires_at)) || x.expired}
                                        </dd>
                                    </dl>
                                )}
                                {(l.access_grant_basis === "admin_override" || l.access_grant_basis === "legacy") && (
                                    <p className="text-[11px] text-[var(--bts-text-faint)]">
                                        {l.access_grant_basis === "admin_override" ? x.grantAdminOverride : x.grantLegacy}
                                    </p>
                                )}
                                <p className="text-[11px] text-[var(--bts-text-faint)]">
                                    {x.registered(fmt(l.registered_at))}
                                    {lastActionText(l) && <> · {lastActionText(l)}</>}
                                </p>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                    <label className="block flex-1 text-[11px] font-bold text-[var(--bts-text-faint)]">
                                        {x.duration}
                                        <select
                                            value={durations[l.user_id] ?? "month"}
                                            onChange={(e) => setDurations((d) => ({ ...d, [l.user_id]: e.target.value as DurationKey }))}
                                            className={`${field} mt-1`}
                                        >
                                            <option value="week">{x.week}</option>
                                            <option value="twoWeeks">{x.twoWeeks}</option>
                                            <option value="month">{x.month}</option>
                                        </select>
                                    </label>
                                    <button type="button" className={btn} disabled={busy} onClick={() => void approve(l)}>
                                        {l.request_status === "pending" ? x.approveRequest : x.approve}
                                    </button>
                                    {l.request_status === "pending" && (
                                        <button type="button" className={btn} disabled={busy} onClick={() => decline(l)}>{x.decline}</button>
                                    )}
                                    {l.access_status === "active" && (
                                        <button type="button" className={btn} disabled={busy} onClick={() => revoke(l)}>{x.revoke}</button>
                                    )}
                                </div>
                                {/* השעיה חוסמת גם כניסה (שונה מביטול גישה). לא מוצגת למנהלים; גם השרת והמסד מסרבים. */}
                                {!l.is_admin && (
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        {/* השעיה: כשאינו מושעה, או כשחסימת הכניסה עוד לא אושרה (ניסיון חוזר בטוח). */}
                                        {(!l.suspended || l.suspension_auth_synced === false) && (
                                            <button type="button" className={`${btn} flex-1 border-rose-500/40 text-[var(--bts-status-danger)]`} disabled={busy} onClick={() => suspend(l)}>
                                                {x.suspend}
                                            </button>
                                        )}
                                        {l.suspended && (
                                            <button type="button" className={`${btn} flex-1`} disabled={busy} onClick={() => reactivate(l)}>
                                                {x.reactivate}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {hasMore && (
                    <button type="button" className={`${btn} w-full`} disabled={loading} onClick={() => void loadMore()}>{x.loadMore}</button>
                )}
            </main>
        </div>
    );
}
