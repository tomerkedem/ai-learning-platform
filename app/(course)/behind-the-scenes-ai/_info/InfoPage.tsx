"use client";

// מעטפת משותפת לששת דפי המידע של "מאחורי הקלעים של AI". אותו רקע וסרגל צד כמו עמוד
// מבחן הסיום, ועמודת קריאה אחת: כותרת, בלוקי תוכן מהמילון, ובסוף חזרה ללמידה ושאר הדפים.
// בלוק placeholder הוא טיוטה עריכתית מסומנת (data-editorial-placeholder), לא נוסח סופי.

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
    ArrowLeft, ArrowRight, BookOpen, ChevronDown, PenLine,
    Layers, Languages, MonitorSmartphone, KeyRound, CalendarClock, CreditCard, Save,
    Cookie, SlidersHorizontal, ArrowLeftRight, Keyboard, CirclePause, SunMoon, Volume2,
    type LucideIcon,
} from "lucide-react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { FloatingReadAloud } from "@/components/ai-internals/FloatingReadAloud";
import { ReadAloudControls } from "@/components/ai-internals/ReadAloudControls";
import { SpeakButton } from "@/components/ai-internals/SpeakButton";
import type { ReadAloudSegment } from "@/components/ai-internals/useReadAloud";
import { LOCALE_SPEECH_LANG } from "@/components/ai-internals/readAloudLang";
import { useT } from "@/i18n/useT";
import type { InfoBlock, InfoIcon, InfoPageKey } from "@/i18n/locales/he/behind-ai/infoPages";
import { INFO_PAGE_LINKS } from "./infoRoutes";

const FACT_ICONS: Record<InfoIcon, LucideIcon> = {
    layers: Layers,
    languages: Languages,
    device: MonitorSmartphone,
    key: KeyRound,
    clock: CalendarClock,
    card: CreditCard,
    save: Save,
    cookie: Cookie,
    sliders: SlidersHorizontal,
    direction: ArrowLeftRight,
    keyboard: Keyboard,
    motion: CirclePause,
    theme: SunMoon,
    speaker: Volume2,
    book: BookOpen,
};

// טבעת מיקוד מפורשת: גלויה בשתי הערכות גם על כרטיסים עם רקע.
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]";
const H2 = "text-xl md:text-2xl font-bold tracking-tight text-[var(--bts-text-primary)]";

function Block({ block, id, placeholderLabel }: { block: InfoBlock; id: string; placeholderLabel: string }) {
    if (block.kind === "placeholder") {
        return (
            <section
                aria-labelledby={id}
                data-editorial-placeholder
                className="rounded-2xl border border-dashed border-amber-500/50 bg-amber-500/[0.06] p-5 md:p-6"
            >
                <p className="flex items-center gap-2 text-xs font-bold text-[var(--bts-status-caution)]">
                    <PenLine size={14} aria-hidden className="shrink-0" />
                    {placeholderLabel}
                </p>
                <h2 id={id} className="mt-2 text-lg font-bold text-[var(--bts-text-primary)]">{block.heading}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--bts-text-secondary)]">{block.decision}</p>
            </section>
        );
    }

    if (block.kind === "facts") {
        return (
            <section aria-labelledby={id}>
                <h2 id={id} className={H2}>{block.heading}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {block.items.map((item, i) => {
                        const Icon = FACT_ICONS[item.icon];
                        const spanLast = i === block.items.length - 1 && block.items.length % 2 === 1;
                        return (
                            <li
                                key={item.title}
                                className={`rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface)] p-5 shadow-[var(--bts-shadow-elevation)] ${spanLast ? "sm:col-span-2" : ""}`}
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-[var(--bts-brand-primary-strong)]">
                                    <Icon size={20} aria-hidden />
                                </span>
                                <h3 className="mt-4 font-bold leading-snug text-[var(--bts-text-primary)]">{item.title}</h3>
                                <p className="mt-1.5 text-sm leading-6 text-[var(--bts-text-secondary)]">{item.body}</p>
                            </li>
                        );
                    })}
                </ul>
            </section>
        );
    }

    if (block.kind === "faq") {
        return (
            <section aria-labelledby={id}>
                <h2 id={id} className={H2}>{block.heading}</h2>
                {/* details/summary: פתיחה וסגירה מובנות בדפדפן, עם מקלדת וקוראי מסך, בלי JS. */}
                <div className="mt-5 divide-y divide-[var(--bts-border)] overflow-hidden rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface)]">
                    {block.items.map((item) => (
                        <details key={item.q} className="group">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold leading-snug text-[var(--bts-text-primary)] transition-colors hover:bg-[var(--bts-fill-soft)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)] [&::-webkit-details-marker]:hidden">
                                <span>{item.q}</span>
                                <ChevronDown size={18} aria-hidden className="shrink-0 text-[var(--bts-text-muted)] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
                            </summary>
                            {/* הקראת תשובה בודדת: שאלה ותשובה, בלי לפתוח או להקריא את שאר התשובות. */}
                            <div className="flex items-start gap-3 px-5 pb-5">
                                <p className="flex-1 leading-7 text-[var(--bts-text-body)]">{item.a}</p>
                                <SpeakButton text={`${item.q} ${item.a}`} className="mt-0.5" />
                            </div>
                        </details>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section aria-labelledby={id}>
            <h2 id={id} className={H2}>{block.heading}</h2>
            {block.paragraphs?.map((p) => (
                <p key={p} className="mt-4 max-w-[65ch] leading-7 text-[var(--bts-text-body)]">{p}</p>
            ))}
            {block.items && (
                <ul className="mt-5 space-y-3">
                    {block.items.map((item) => (
                        <li key={item} className="flex max-w-[65ch] gap-3 leading-7 text-[var(--bts-text-body)]">
                            <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--bts-brand-primary)]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export function InfoPage({ page }: { page: InfoPageKey }) {
    const { dir, t, locale } = useT();
    const ip = t.behindAi.infoPages;
    const content = ip.pages[page];
    const isRTL = dir === "rtl";
    const PageIcon = INFO_PAGE_LINKS.find((p) => p.key === page)?.Icon ?? BookOpen;
    const Back = isRTL ? ArrowRight : ArrowLeft;
    const Forward = isRTL ? ArrowLeft : ArrowRight;
    const others = INFO_PAGE_LINKS.filter((p) => p.key !== page);
    const reduce = useReducedMotion();

    // מקטעי הקראה לפי סדר הדף. placeholder (טיוטה) והניווט בסוף הדף אינם מוקראים.
    // בדף שאלות נפוצות כל שאלה היא מקטע נפרד, כך שאפשר להתחיל ממנה במגירת הקטעים.
    const segments: ReadAloudSegment[] = [{ id: "intro", label: content.title, text: `${content.title}. ${content.lead}` }];
    content.blocks.forEach((block, i) => {
        if (block.kind === "placeholder") return;
        if (block.kind === "faq") {
            block.items.forEach((item, j) => segments.push({ id: `b${i}-${j}`, label: item.q, text: j === 0 ? `${block.heading}. ${item.q} ${item.a}` : `${item.q} ${item.a}` }));
            return;
        }
        const parts = block.kind === "facts"
            ? block.items.map((item) => `${item.title}. ${item.body}`)
            : [...(block.paragraphs ?? []), ...(block.items ?? [])];
        segments.push({ id: `b${i}`, label: block.heading, text: `${block.heading}. ${parts.join(" ")}` });
    });

    return (
        <div className="flex min-h-[100dvh] bg-[var(--bts-page)] font-sans text-[var(--bts-text-bright)] selection:bg-indigo-500/30 overflow-hidden relative" dir={dir}>
            <a
                href="#info-main"
                className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[200] focus:rounded-full focus:bg-[var(--bts-surface-elevated)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--bts-text-primary)] focus:shadow-lg ${FOCUS}`}
            >
                {ip.skipToContent}
            </a>

            {/* רקע: אותה שפה עיצובית של הלומדה, בעוצמה נמוכה יותר כדי לא להתחרות בקריאה */}
            <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(var(--bts-dot) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className={`absolute top-[-25%] ${isRTL ? "right-[-10%]" : "left-[-10%]"} w-150 h-150 bg-cyan-500/15 blur-[120px] rounded-full [mix-blend-mode:var(--bts-ambient-blend)] animate-pulse motion-reduce:animate-none`} />
                <div className={`absolute bottom-[-25%] ${isRTL ? "left-[-10%]" : "right-[-10%]"} w-125 h-125 bg-indigo-600/10 blur-[100px] rounded-full [mix-blend-mode:var(--bts-ambient-blend)]`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bts-page)_120%)]" />
            </div>

            <CourseSidebar />

            <div className="flex-1 relative h-[100dvh] overflow-y-auto custom-scrollbar z-10">
                <main id="info-main" tabIndex={-1} className="mx-auto w-full max-w-3xl px-5 sm:px-8 md:px-10 pt-20 md:pt-14 pb-24 focus:outline-none">
                    <Link
                        href="/behind-the-scenes-ai/introduction"
                        className={`group inline-flex items-center gap-2 rounded-full py-1.5 text-sm font-medium text-[var(--bts-text-muted)] transition-colors hover:text-[var(--bts-text-primary)] ${FOCUS}`}
                    >
                        <Back size={16} aria-hidden className={`transition-transform motion-reduce:transition-none ${isRTL ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"}`} />
                        {ip.backToCourse}
                    </Link>

                    <header className="mt-8 mb-12 md:mb-14">
                        <p className="flex items-center gap-3 text-sm font-semibold text-[var(--bts-brand-primary-strong)]">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-linear-to-br from-cyan-500/20 to-indigo-500/10">
                                <PageIcon size={18} aria-hidden />
                            </span>
                            {ip.navLabel}
                        </p>
                        <h1 className="mt-5 text-3xl md:text-[2.75rem] font-black leading-[1.15] tracking-tight text-[var(--bts-text-primary)]">
                            {content.title}
                        </h1>
                        <p className="mt-5 max-w-[62ch] text-base md:text-lg leading-8 text-[var(--bts-text-secondary)]">
                            {content.lead}
                        </p>
                        {/* דוק ההאזנה המודרכת: אותו רכיב של הפרקים. לדפי מידע אין גרסאות היקף שונות, לכן בורר ההיקף מוסתר. */}
                        <FloatingReadAloud dir={dir}>
                            <ReadAloudControls
                                segmentsByMode={{ short: segments, regular: segments, full: segments }}
                                hideScope
                                lang={LOCALE_SPEECH_LANG[locale]}
                                locale={locale}
                                dir={dir}
                                labels={t.behindAi.aiInternals.readAloud}
                                reduce={!!reduce}
                                resetSignal={page}
                                compact
                            />
                        </FloatingReadAloud>
                    </header>

                    <div className="space-y-12 md:space-y-14">
                        {content.blocks.map((block, i) => (
                            <Block key={`${page}-${i}`} block={block} id={`${page}-block-${i}`} placeholderLabel={ip.placeholderLabel} />
                        ))}
                    </div>

                    <nav aria-labelledby="info-more" className="mt-16 border-t border-[var(--bts-border)] pt-10">
                        <h2 id="info-more" className={H2}>{ip.morePages}</h2>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                            <li className="sm:col-span-2">
                                <Link
                                    href="/behind-the-scenes-ai/introduction"
                                    className={`group flex items-center gap-4 rounded-2xl border border-cyan-500/30 bg-linear-to-br from-cyan-500/12 via-indigo-500/8 to-transparent p-5 md:p-6 transition-colors hover:border-cyan-400/60 ${FOCUS}`}
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-[var(--bts-brand-primary-strong)]">
                                        <BookOpen size={22} aria-hidden />
                                    </span>
                                    <span className="flex min-w-0 flex-col">
                                        <span className="text-lg font-bold text-[var(--bts-text-primary)]">{ip.continueTitle}</span>
                                        <span className="text-sm leading-6 text-[var(--bts-text-secondary)]">{ip.continueBody}</span>
                                    </span>
                                    <Forward size={20} aria-hidden className={`ms-auto shrink-0 text-[var(--bts-brand-primary-strong)] transition-transform motion-reduce:transition-none ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                                </Link>
                            </li>
                            {others.map(({ key, href, Icon }) => (
                                <li key={key}>
                                    <Link
                                        href={href}
                                        className={`group flex h-full items-start gap-3 rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface)] p-4 transition-colors hover:border-[var(--bts-border-emphasis)] hover:bg-[var(--bts-surface-elevated)] ${FOCUS}`}
                                    >
                                        <Icon size={18} aria-hidden className="mt-0.5 shrink-0 text-[var(--bts-text-muted)] transition-colors group-hover:text-[var(--bts-brand-primary-strong)]" />
                                        <span className="flex min-w-0 flex-col">
                                            <span className="font-semibold text-[var(--bts-text-primary)]">{ip.pages[key].navTitle}</span>
                                            <span className="text-sm leading-6 text-[var(--bts-text-muted)]">{ip.pages[key].summary}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </main>
            </div>
        </div>
    );
}
