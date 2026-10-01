"use client";

// עמוד הבית של התמיכה: הסבר קצר, בקשה חדשה, והבקשות של הלומד (הפעילות האחרונה קודם).
// הסטטוס הוא זה שהמסד מחזיר ללומד; הסטטוס הפנימי לא מגיע לכאן.
// אין שימוש בתו "מקף ארוך" (em dash).

import Link from "next/link";
import { Plus } from "lucide-react";
import { useT } from "@/i18n/useT";
import { FOCUS, KIND_ICON, LocalTime, PRIMARY_BUTTON, StatusBadge, SupportOrigin } from "./supportParts";
import { SUPPORT_HOME, supportNewHref, type SupportRequestSummary } from "./supportShared";

export function SupportHome({ requests, from }: { requests: SupportRequestSummary[] | null; from: string | null }) {
    const { t } = useT();
    const s = t.chrome.support;

    return (
        <>
            <header className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-black leading-tight">{s.title}</h1>
                <p className="max-w-[62ch] text-[15px] md:text-base leading-7 text-[var(--bts-text-secondary)]">{s.lead}</p>
                <Link href={supportNewHref(undefined, from)} className={PRIMARY_BUTTON}>
                    <Plus size={16} aria-hidden className="shrink-0" />
                    {s.newRequest}
                </Link>
            </header>

            <section aria-labelledby="support-list-title" className="mt-10">
                <h2 id="support-list-title" className="text-lg md:text-xl font-bold">{s.myRequests}</h2>
                {requests === null ? (
                    <p role="alert" className="mt-4 rounded-xl border border-[var(--bts-border)] bg-[var(--bts-fill-soft)] p-4 text-sm leading-6 text-[var(--bts-text-secondary)]">
                        {s.loadFailed}
                    </p>
                ) : requests.length === 0 ? (
                    <div className="mt-4 space-y-4 rounded-2xl border border-dashed border-[var(--bts-border-emphasis)] p-5">
                        <p className="leading-7 text-[var(--bts-text-secondary)]">{s.empty}</p>
                        <Link href={supportNewHref(undefined, from)} className={PRIMARY_BUTTON}>
                            <Plus size={16} aria-hidden className="shrink-0" />
                            {s.newRequest}
                        </Link>
                    </div>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {requests.map((r) => {
                            const Icon = KIND_ICON[r.kind];
                            return (
                                <li key={r.id}>
                                    <Link
                                        href={`${SUPPORT_HOME}/${r.id}`}
                                        className={`block rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface)] p-4 no-underline transition-colors hover:border-[var(--bts-border-emphasis)] hover:bg-[var(--bts-surface-elevated)] motion-reduce:transition-none ${FOCUS}`}
                                    >
                                        <span className="flex flex-wrap items-center gap-2">
                                            <Icon size={16} aria-hidden className="shrink-0 text-[var(--bts-text-muted)]" />
                                            <span className="font-bold text-[var(--bts-text-primary)]">{s.kinds[r.kind].noun}</span>
                                            <StatusBadge status={r.status} />
                                            {r.has_unread && (
                                                <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bts-brand-primary)] px-2 py-1 text-xs font-bold text-[var(--bts-brand-primary-strong)]">
                                                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--bts-brand-primary)]" />
                                                    {s.unread}
                                                </span>
                                            )}
                                        </span>
                                        {r.excerpt && (
                                            <span dir="auto" className="mt-2 block line-clamp-2 text-sm leading-6 text-[var(--bts-text-secondary)] [overflow-wrap:anywhere]">
                                                {r.excerpt}
                                            </span>
                                        )}
                                        {/* המקור של הבקשה הזו, מה-route שנשמר בה (לא מ-?from= של העמוד). */}
                                        <SupportOrigin route={r.route} className="mt-2 text-xs text-[var(--bts-text-secondary)]" />
                                        <span className="mt-1 block text-xs text-[var(--bts-text-muted)]">
                                            <LocalTime iso={r.last_activity_at} format={s.lastActivity} />
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </>
    );
}
