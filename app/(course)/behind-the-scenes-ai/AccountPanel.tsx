"use client";

// ════════════════════════════════════════════════════════════════════════
// חשבון לומד בסרגל הצד: הרשמה והתחברות במייל וסיסמה, איפוס סיסמה, יציאה, מצב
// ניסיונות שממתינים לשליחה, והצעת ייבוא מפורשת וחד-פעמית של תרגול בלי חשבון.
// AccountSync (נטען פעם אחת ב-layout) מסנכרן שפה ושולח מחדש ניסיונות שממתינים בתור.
// חשבון אינו מעניק גישת בטא או גישה בתשלום. מצב הגישה מוצג כאן בלבד; האכיפה בשרת
// (_access/courseAccess.ts).
// אין שימוש בתו "מקף ארוך" (em dash).
// ════════════════════════════════════════════════════════════════════════

import React, { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { ChevronDown, CircleAlert, Eye, EyeOff, LogOut, Mail, MailCheck, MessageSquare, UserRound } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useT } from "@/i18n/useT";
import { useCourseAccess } from "./_access/CourseAccessContext";
import { BetaAccessRequest } from "./_access/BetaAccessRequest";
import { hasCourseAccess } from "./_access/access";
import { canUseSupport, supportAction, supportHomeHref, supportOrigin } from "./support/supportShared";
import type { Dictionary } from "@/i18n/dictionary";
import { LOCALES } from "@/i18n/config";
import { courses } from "@/lib/courseData";
import { getAllRecords, MASTERY_UPDATED_EVENT } from "./masteryProgress";
import {
    supabase,
    useAuthState,
    endPasswordRecovery,
    flushPendingAttempts,
    flushLearningUnits,
    signOutAndForget,
    loadFullName,
    cachedFullName,
    checkIsCourseAdmin,
    importLocalRecords,
    isImportHandled,
    markImportHandled,
    loadPreferredLocale,
    loadUnreadSupportReplies,
    savePreferredLocale,
    syncCleanAuthUrl,
    takeAuthLinkError,
    AUTH_LINK_ERROR_EVENT,
} from "./account";
import { authErrorKey, normalizeFullName, signupRedirectUrl, validateAuth, PASSWORD_MIN, type AuthErrorKey, type AuthField, type AuthMode, type FieldErrorKey, type FieldErrors } from "./authForm";

type AccountDict = Dictionary["chrome"]["account"];

/** הודעה מתורגמת לכל שגיאה. הודעת השרת הגולמית לעולם לא מוצגת. */
function errorText(error: unknown, a: AccountDict): string {
    const text: Record<AuthErrorKey, string> = {
        invalid: a.errorInvalid,
        unconfirmed: a.errorUnconfirmed,
        weakPassword: a.errorWeakPassword,
        samePassword: a.errorSamePassword,
        suspended: a.errorSuspended,
        emailRateLimit: a.errorEmailRateLimit,
        rateLimit: a.errorRateLimit,
        accountExists: a.errorAccountExists,
        emailRejected: a.errorEmailRejected,
        network: a.errorNetwork,
        generic: a.errorGeneric,
    };
    return text[authErrorKey(error)];
}

function fieldText(key: FieldErrorKey, a: AccountDict): string {
    switch (key) {
        case "nameInvalid": return a.errorName;
        case "emailRequired": return a.fieldEmailRequired;
        case "emailInvalid": return a.fieldEmailInvalid;
        case "passwordRequired": return a.fieldPasswordRequired;
        case "passwordShort": return a.fieldPasswordShort(PASSWORD_MIN);
    }
}

// קישור איפוס סיסמה חוזר לעמוד הנוכחי. קישור אישור הרשמה חוזר תמיד למבוא (signupRedirectUrl).
const pageUrl = () => window.location.href.split("#")[0];

const buttonClass = "flex-1 rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill-soft)] hover:bg-[var(--bts-sub-fill-hover)] px-2.5 py-2 text-[11px] font-bold text-[var(--bts-text-secondary)] transition-colors disabled:opacity-50";
// 16px בשדות: פחות מזה גורם ל-iOS להגדיל את העמוד בפוקוס.
const inputClass = "w-full rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] px-2.5 py-2 text-base text-[var(--bts-text-primary)] aria-[invalid=true]:border-[var(--bts-status-danger)]";
const labelClass = "block text-xs font-bold text-[var(--bts-text-secondary)]";
// פעולות ההקשר: בגודל התוכן, בקו ההתחלה של שורות ההקשר (start לוגי), 44px. תשובת תמיכה שמחכה היא
// הראשית (מילוי בגוון המותג); העזרה משנית (גבול בלבד). תווית ארוכה (es/ru) נשברת בתוך הרוחב.
const replyLinkClass = "flex w-fit max-w-full min-h-[44px] items-center gap-2 rounded-lg border border-[color-mix(in_oklab,var(--bts-brand-primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--bts-brand-primary)_12%,transparent)] px-3 py-2 text-start text-xs font-bold text-[var(--bts-text-primary)] no-underline transition-colors hover:bg-[color-mix(in_oklab,var(--bts-brand-primary)_18%,transparent)] motion-reduce:transition-none";

/** שגיאה בולטת אך לא תוקפנית: אייקון, כותרת וגוף, ו-role="alert" שמוקרא מיד. משמש גם בתמיכה. */
export function AuthAlert({ title, body }: { title?: string; body: string }) {
    return (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[var(--bts-status-danger)]/50 bg-[color-mix(in_oklab,var(--bts-status-danger)_9%,transparent)] p-3 text-start">
            <CircleAlert size={18} aria-hidden className="mt-0.5 shrink-0 text-[var(--bts-status-danger)]" />
            <div className="min-w-0 space-y-0.5">
                {title && <p className="text-sm font-bold leading-snug text-[var(--bts-text-primary)]">{title}</p>}
                <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{body}</p>
            </div>
        </div>
    );
}

/** שגיאת שדה: אייקון וטקסט (לא צבע בלבד), מקושרת לשדה דרך aria-describedby. משמש גם בתמיכה. */
export function FieldError({ id, text }: { id: string; text?: string }) {
    if (!text) return null;
    return (
        <p id={id} className="mt-1 flex items-start gap-1 text-xs font-semibold leading-snug text-[var(--bts-status-danger)]">
            <CircleAlert size={14} aria-hidden className="mt-px shrink-0" />
            {text}
        </p>
    );
}

/**
 * שדה סיסמה עם מתג הצגה. המתג הוא כפתור עם שם קבוע ו-aria-pressed, כך שקורא מסך מודיע
 * על המצב. השדה נשאר LTR (תוכן הסיסמה), ולכן המתג תמיד בצד ימין שלו, בכל כיוון עמוד.
 * autoComplete נשמר בשני המצבים, ומנהלי סיסמאות ממשיכים לזהות את השדה.
 */
function PasswordField({ name, label, autoComplete, autoFocus, describedBy, invalid, showLabel }: {
    name: string; label: string; autoComplete: string; autoFocus?: boolean; describedBy?: string; invalid?: boolean; showLabel: string;
}) {
    const id = useId();
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className={labelClass}>{label}</label>
            <div className="relative mt-1" dir="ltr">
                <input
                    id={id} name={name} type={visible ? "text" : "password"} required autoComplete={autoComplete} autoFocus={autoFocus}
                    autoCapitalize="none" autoCorrect="off" spellCheck={false}
                    aria-invalid={invalid || undefined} aria-describedby={describedBy}
                    className={`${inputClass} pr-11`}
                />
                <button
                    type="button" aria-label={showLabel} title={showLabel} aria-pressed={visible} aria-controls={id}
                    onClick={() => setVisible((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-e-lg text-[var(--bts-text-muted)] hover:text-[var(--bts-text-primary)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--bts-focus-ring)]"
                >
                    {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
                </button>
            </div>
        </div>
    );
}

/**
 * מצב הרשאת הבטא של החשבון המחובר. אימות מייל לבדו לעולם לא מוצג כגישה. טקסט בלבד, באותו קו
 * התחלה כמו שורת ההקשר שמעליו (המצב נאמר במילים, לא בצבע).
 */
function AccessStatusLine({ compact = false }: { compact?: boolean } = {}) {
    const { locale, t } = useT();
    const access = useCourseAccess();
    const x = t.chrome.access;
    const date = access.expiresAt ? new Date(access.expiresAt).toLocaleDateString(LOCALES[locale].htmlLang, { dateStyle: "medium" }) : "";
    const text = access.status === "active" ? x.accessActive(date)
        : access.status === "no-grant" ? x.accessNone
        : access.status === "expired" ? x.accessExpired(date)
        : access.status === "revoked" ? x.accessRevoked
        : access.status === "suspended" ? x.accessSuspended
        : access.status === "unconfirmed" ? x.accessUnconfirmed
        : null;
    if (!text) return null;
    return compact
        ? <span className="mt-0.5 block text-[11.5px] leading-snug text-[var(--bts-text-muted)]">{text}</span>
        : <p className="text-xs leading-snug text-[var(--bts-text-secondary)]">{text}</p>;
}

/**
 * סמל זהות ניטרלי בכותרת החשבון. נקודה בפינה = תשובת תמיכה שלא נקראה; אין לה קשר להתקדמות או לשליטה.
 * דקורטיבי (aria-hidden): ההתראה נאמרת כטקסט לקורא המסך בשורת הזהות.
 */
function IdentityMark({ unread }: { unread: boolean }) {
    return (
        <span aria-hidden="true" className="relative grid size-8 shrink-0 place-items-center rounded-full border border-[var(--bts-border-emphasis)] bg-[var(--bts-sub-fill-soft)] text-[var(--bts-text-muted)]">
            <UserRound size={16} />
            {unread && (
                <span className="absolute -end-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[var(--bts-surface-elevated)] bg-[var(--bts-status-caution)] forced-colors:bg-[CanvasText]" />
            )}
        </span>
    );
}

/**
 * עזרה תלוית ההקשר בסרגל הכלים שבתחתית הסרגל (ליד השפה, הנגישות וערכת הנושא). עזרה בפרק או במבוא כשיש
 * גישה פעילה ונמצאים בהם, אחרת עזרה ותמיכה כללית; נתיב המקור נשמר (העמוד הנוכחי, או המקור שעמוד תמיכה כבר
 * נושא). מוצג רק למי שיכול להשתמש בתמיכה (מחובר, מייל מאומת, לא מושעה).
 */
export function SidebarHelpButton() {
    const { t } = useT();
    const s = t.chrome.support;
    const access = useCourseAccess();
    const pathname = usePathname();
    const carriedFrom = useSearchParams().get("from");
    if (!canUseSupport(access.status)) return null;
    const help = supportAction(pathname, carriedFrom, courses["behind-the-scenes-ai"].chapters, hasCourseAccess(access.status));
    const label = help.label === "chapter" ? s.helpChapter : help.label === "intro" ? s.helpIntro : s.entry;
    return (
        <Link
            href={help.href}
            aria-label={label}
            title={label}
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[color-mix(in_oklab,var(--color-sky-400)_70%,transparent)] bg-[color-mix(in_oklab,var(--color-sky-400)_12%,transparent)] text-[#7dd3fc] no-underline shadow-[0_0_10px_-2px_color-mix(in_oklab,var(--color-sky-400)_45%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-sky-400)_22%,transparent)] hover:text-[var(--bts-text-primary)] light:border-[color-mix(in_oklab,var(--color-blue-600)_60%,transparent)] light:bg-[color-mix(in_oklab,var(--color-blue-500)_10%,transparent)] light:text-[#2563eb] light:shadow-[0_0_10px_-3px_color-mix(in_oklab,var(--color-blue-500)_35%,transparent)] forced-colors:shadow-none after:absolute after:-inset-1 after:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bts-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bts-focus-ring-offset)] motion-reduce:transition-none"
        >
            {/* סימן שאלה נקי, בלי עיגול פנימי: האייקונים של העזרה בספרייה כוללים מסגרת משלהם. */}
            <span aria-hidden="true" className="text-[22px] font-black leading-none">?</span>
        </Link>
    );
}

/** defaultOpen: פתוח מראש (בשער התצוגה המקדימה של המבוא), כדי שההרשמה וההתחברות יהיו גלויות מיד. */
export function AccountPanel({ defaultOpen = false }: { defaultOpen?: boolean } = {}) {
    const { dir, locale, t } = useT();
    const a = t.chrome.account;
    const { session, ready } = useAuthState();
    const access = useCourseAccess();
    const s = t.chrome.support;
    const pathname = usePathname();
    const carriedFrom = useSearchParams().get("from");
    const userId = session?.user.id;
    const supportAllowed = canUseSupport(access.status);
    const [unreadReplies, setUnreadReplies] = useState(0);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState<{ title?: string; body: string } | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    // כתובת שנשלח אליה מייל אישור אחרי הרשמה. כל עוד יש ערך, מוצג מצב "בדקו את המייל".
    const [sentTo, setSentTo] = useState<string | null>(null);
    // התחברות או יצירת חשבון: כל מצב מציג רק את השדות והפעולה שלו, ו-Enter מפעיל את הפעולה שלו.
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const sentTitleRef = useRef<HTMLParagraphElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [importCount, setImportCount] = useState(0);
    // undefined = עוד נטען; null = אין שם בפרופיל (משתמש ותיק; מנהל משלים אותו).
    // מתחיל מהשם שכבר נטען לאותו משתמש, כדי שהסיכום לא יהבהב בניווט בין עמודים.
    const [fullName, setFullName] = useState<string | null | undefined>(() => cachedFullName(userId));
    const [isAdmin, setIsAdmin] = useState(false);
    // מצב הפאנל (פתוח/מכווץ), מסונכרן מאירוע toggle המקורי של details. קובע מה מוצג בשורת הסיכום.
    const [open, setOpen] = useState(defaultOpen);
    const statusId = useId();
    const fid = useId();
    // שגיאת שדה מקושרת לשדה, כך שקורא מסך מקריא אותה עם הפוקוס שעובר אליו.
    const fieldProps = (field: AuthField, extra?: string) => {
        const describedBy = [fieldErrors[field] && `${fid}-${field}-error`, extra].filter(Boolean).join(" ");
        return { "aria-invalid": fieldErrors[field] ? true : undefined, "aria-describedby": describedBy || undefined };
    };

    useEffect(() => {
        // פוקוס לכותרת מצב האישור: הטופס (והכפתור שבו היה הפוקוס) נעלם, והכותרת מוקראת.
        if (sentTo) sentTitleRef.current?.focus();
    }, [sentTo]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- התקדמות מקומית נקראת רק אחרי mount בצד הלקוח
        setImportCount(userId && !isImportHandled(userId) ? getAllRecords().length : 0);
        setMessage("");
        setAlert(null);
        setFieldErrors({});
        setSentTo(null);
        setFullName(cachedFullName(userId));
        setIsAdmin(false);
        if (!userId) return;
        let cancelled = false;
        loadFullName(userId).then((n) => { if (!cancelled) setFullName(n); }).catch(() => {});
        // קישור לעמוד הניהול לתצוגה בלבד: ההרשאה נאכפת בשרת ובמסד.
        checkIsCourseAdmin().then((v) => { if (!cancelled) setIsAdmin(v); });
        return () => { cancelled = true; };
    }, [userId]);

    useEffect(() => {
        // תשובות תמיכה שלא נקראו: רק למי שיכול להשתמש בתמיכה. נטען מחדש בכל טעינה של הסרגל (ניווט).
        // eslint-disable-next-line react-hooks/set-state-in-effect -- איפוס כשהמשתמש או ההרשאה לתמיכה מתחלפים
        setUnreadReplies(0);
        if (!userId || !supportAllowed) return;
        let cancelled = false;
        loadUnreadSupportReplies(userId).then((n) => { if (!cancelled) setUnreadReplies(n); }).catch(() => {});
        return () => { cancelled = true; };
    }, [userId, supportAllowed]);

    if (!supabase) return null;
    const client = supabase;

    // task מחזירה הודעת סטטוס (או ""), וזורקת שגיאה שתוצג כ-AuthAlert עם errorTitle.
    const run = async (errorTitle: string | undefined, task: () => Promise<string>) => {
        setBusy(true);
        setMessage("");
        setAlert(null);
        try {
            setMessage(await task());
        } catch (error) {
            setAlert({ title: errorTitle, body: errorText(error, a) });
        }
        setBusy(false);
    };

    /** בדיקת שדות בצד הלקוח (במקום הודעות הדפדפן). בקשה לא תקינה לא נשלחת ל-Supabase. */
    const check = (form: HTMLFormElement, mode: AuthMode, values: { nameOk: boolean; email: string; password: string }) => {
        const errors = validateAuth(mode, values);
        // flushSync: השגיאה והקישור שלה לשדה נכנסים ל-DOM לפני העברת הפוקוס, כדי שיוקראו יחד.
        flushSync(() => {
            setFieldErrors(errors);
            setAlert(null);
            setMessage("");
        });
        const first = (["fullName", "email", "password"] as const).find((f) => errors[f]);
        if (first) (form.elements.namedItem(first) as HTMLInputElement).focus();
        return !first;
    };

    // הקלדה בשדה מנקה את השגיאה שלו בלבד.
    const clearFieldError = (e: React.FormEvent<HTMLFormElement>) => {
        const name = (e.target as HTMLInputElement).name as AuthField;
        if (fieldErrors[name]) setFieldErrors((f) => ({ ...f, [name]: undefined }));
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const nameInput = form.elements.namedItem("fullName") as HTMLInputElement | null;
        const name = mode === "signup" && nameInput ? normalizeFullName(nameInput.value, locale) : null;
        if (!check(form, mode, { nameOk: !!name, email, password })) return;
        void run(mode === "signup" ? a.errorTitleSignUp : a.errorTitleSignIn, async () => {
            if (mode === "signup") {
                // השם עובר במטא-דאטה של ההרשמה; טריגר במסד שומר אותו ב-profiles ודוחה הרשמה בלי שם.
                // locale: שפת הלומדה בהרשמה, לבחירת שפה בתבנית המייל (ראו docs/behind-ai-access-admin.md).
                // היעד אחרי האישור הוא תמיד המבוא: אימות מייל אינו נותן גישה לפרק שממנו נרשמו.
                const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: signupRedirectUrl(window.location.origin), data: { full_name: name, locale } } });
                if (error) throw error;
                // בלי session = נדרש אישור מייל. אותו מצב גם לכתובת שכבר רשומה (לא חושפים קיום חשבון).
                if (!data.session) setSentTo(email);
                return "";
            }
            // שגיאת התחברות זהה לחשבון שלא קיים ולסיסמה שגויה (invalid_credentials).
            const { error } = await client.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return "";
        });
    };

    const requestReset = (e: React.MouseEvent<HTMLButtonElement>) => {
        const form = e.currentTarget.form;
        if (!form) return;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
        if (!check(form, "reset", { nameOk: true, email, password: "" })) return;
        void run(a.errorTitleReset, async () => {
            const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: pageUrl() });
            if (error) throw error;
            // אותה הודעה בין אם הכתובת רשומה ובין אם לא.
            return a.resetSent;
        });
    };

    /** מעבר בין התחברות ליצירת חשבון. המייל והסיסמה שהוקלדו נשמרים; הפוקוס עובר לשדה הראשון. */
    const switchMode = (next: "signin" | "signup") => {
        flushSync(() => {
            setMode(next);
            setFieldErrors({});
            setAlert(null);
            setMessage("");
        });
        (formRef.current?.elements.namedItem(next === "signup" ? "fullName" : "email") as HTMLInputElement | null)?.focus();
    };

    const backToForm = () => {
        flushSync(() => setSentTo(null));
        (formRef.current?.elements.namedItem("email") as HTMLInputElement | null)?.focus();
    };

    const runImport = () => {
        if (!userId) return;
        void run(undefined, async () => {
            // שגיאה נזרקת לפני הסימון: ההצעה נשארת, ושום דבר בשרת לא השתנה.
            const { added, kept } = await importLocalRecords(userId, getAllRecords());
            markImportHandled(userId);
            setImportCount(0);
            window.dispatchEvent(new CustomEvent(MASTERY_UPDATED_EVENT));
            return a.importDone(added, kept);
        });
    };

    const skipImport = () => {
        if (userId) markImportHandled(userId);
        setImportCount(0);
    };

    let body: React.ReactNode;
    if (session) {
        const hasUnread = supportAllowed && unreadReplies > 0;
        const signOutButton = (
            <button
                type="button"
                className="-my-1.5 inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-[var(--bts-text-muted)] transition-colors hover:bg-[var(--bts-sub-fill-soft)] hover:text-[var(--bts-text-primary)] disabled:opacity-50 motion-reduce:transition-none"
                disabled={busy}
                onClick={() => userId && void signOutAndForget(userId)}
            >
                <LogOut size={14} aria-hidden className="shrink-0 rtl:-scale-x-100" />
                {a.signOut}
            </button>
        );
        body = (
            <>
                {/* זהות: לחשבון בלי שם, ההסבר צמוד לשורת הזהות שמעליו. */}
                {fullName === null && (
                    <div className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] p-2.5 space-y-1">
                        <p className="text-[11px] font-bold text-[var(--bts-text-primary)]">{a.nameMissingTitle}</p>
                        <p className="text-[11px] text-[var(--bts-text-muted)] leading-relaxed">{a.nameMissingBody}</p>
                    </div>
                )}
                {/* גישה: מצב הגישה (טקסט, בקו ההתחלה של ה-Pulse; מושג נפרד מהשליטה). תשובה שלא נקראה היא
                    הפעולה הראשית, בשורה משלה מיד אחריו (מובילה לבקשות שלי, עם המקור שנשמר). */}
                <div className="space-y-2 empty:hidden">
                    <BetaAccessRequest />
                    {hasUnread && (
                        <Link href={supportHomeHref(supportOrigin(pathname, carriedFrom))} className={replyLinkClass}>
                            <MessageSquare size={16} aria-hidden className="shrink-0 text-[var(--bts-status-caution)]" />
                            {s.newReplies(unreadReplies)}
                        </Link>
                    )}
                </div>
                {isAdmin && (
                    <Link href="/behind-the-scenes-ai/admin" className={`${buttonClass} block text-center no-underline`}>{a.adminLink}</Link>
                )}
                {importCount > 0 && (
                    <div className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] p-2.5 space-y-2">
                        <p className="text-[11px] font-bold text-[var(--bts-text-primary)]">{a.importTitle}</p>
                        <p className="text-[11px] text-[var(--bts-text-muted)] leading-relaxed">{a.importBody(importCount)}</p>
                        <div className="flex gap-2">
                            <button type="button" className={buttonClass} disabled={busy} onClick={runImport}>{a.importAction}</button>
                            <button type="button" className={buttonClass} disabled={busy} onClick={skipImport}>{a.importSkip}</button>
                        </div>
                    </div>
                )}
                {/* היציאה בסוף השורה (end לוגי), שקטה ובלי מסגרת. -me-2 מיישר את תווית היציאה לקצה הטקסט. העזרה
                    תלוית ההקשר נמצאת בסרגל הכלים בתחתית הסרגל (SidebarHelpButton). בלי שם שמור, היציאה נשארת
                    בשורת המייל שלמטה. */}
                {fullName !== null && <div className="-me-2 flex justify-end">{signOutButton}</div>}
                {/* בלי שם שמור: המייל הוא הזהות הגלויה של החשבון, בשורה אחת עם היציאה. השוליים השליליים של
                    היציאה (-my-1.5) משאירים יעד לחיצה של 44px בלי להגביה את השורה. האייקון מתהפך ב-RTL. */}
                {fullName === null && (
                    <div className="flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate text-[11px] leading-relaxed text-[var(--bts-text-faint)]">
                            {a.signedInAs}{" "}
                            <Mail size={11} aria-hidden className="me-1 inline-block shrink-0 align-[-1px]" />
                            <bdi dir="ltr" className="font-bold text-[var(--bts-text-muted)]">{session.user.email}</bdi>
                        </p>
                        {signOutButton}
                    </div>
                )}
            </>
        );
    } else if (sentTo) {
        body = (
            <div className="space-y-3">
                <div className="space-y-2 rounded-xl border border-[var(--bts-status-positive)]/45 bg-[color-mix(in_oklab,var(--bts-status-positive)_8%,transparent)] p-3">
                    <p ref={sentTitleRef} tabIndex={-1} className="flex items-start gap-2 text-sm font-bold leading-snug text-[var(--bts-text-primary)] focus:outline-none">
                        <MailCheck size={18} aria-hidden className="mt-px shrink-0 text-[var(--bts-status-positive)]" />
                        {a.checkEmailTitle}
                    </p>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">
                        {a.checkEmailSentTo}{" "}
                        <bdi dir="ltr" className="break-all font-bold text-[var(--bts-text-primary)]">{sentTo}</bdi>
                    </p>
                    <p className="text-[13px] leading-relaxed text-[var(--bts-text-body)]">{a.checkEmailNext}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-[var(--bts-text-secondary)]">{a.checkEmailHelpTitle}</p>
                    <p className="text-xs leading-relaxed text-[var(--bts-text-muted)]">{a.checkEmailHelp}</p>
                </div>
                <button type="button" className={`${buttonClass} w-full`} onClick={backToForm}>{a.checkEmailBack}</button>
            </div>
        );
    } else {
        const passwordHintId = `${fid}-password-hint`;
        const signup = mode === "signup";
        const linkClass = "py-1 text-xs font-bold text-[var(--bts-brand-primary-strong)] underline underline-offset-2 hover:text-[var(--bts-text-primary)] disabled:opacity-50";
        body = (
            // noValidate: הבדיקה והודעות השגיאה של הלומדה (מתורגמות), לא של הדפדפן.
            <form ref={formRef} onSubmit={submit} onInput={clearFieldError} noValidate aria-labelledby={`${fid}-heading`} className="space-y-3">
                <h2 id={`${fid}-heading`} className="text-sm font-bold text-[var(--bts-text-primary)]">{signup ? a.signUpTitle : a.signInTitle}</h2>
                <p className="text-[13px] text-[var(--bts-text-body)] leading-relaxed">{a.intro}</p>
                {signup && (
                    <div>
                        <label htmlFor={`${fid}-fullName`} className={labelClass}>{a.fullName}</label>
                        <input id={`${fid}-fullName`} name="fullName" type="text" maxLength={100} autoComplete="name" {...fieldProps("fullName", `${fid}-fullName-hint`)} className={`${inputClass} mt-1`} />
                        <FieldError id={`${fid}-fullName-error`} text={fieldErrors.fullName && fieldText(fieldErrors.fullName, a)} />
                        <p id={`${fid}-fullName-hint`} className="mt-1 text-xs text-[var(--bts-text-muted)]">{a.fullNameHint}</p>
                    </div>
                )}
                <div>
                    <label htmlFor={`${fid}-email`} className={labelClass}>{a.email}</label>
                    <input id={`${fid}-email`} name="email" type="email" required autoComplete="email" autoCapitalize="none" spellCheck={false} dir="ltr" {...fieldProps("email")} className={`${inputClass} mt-1`} />
                    <FieldError id={`${fid}-email-error`} text={fieldErrors.email && fieldText(fieldErrors.email, a)} />
                </div>
                <div>
                    <PasswordField
                        name="password" label={a.password} autoComplete={signup ? "new-password" : "current-password"} showLabel={a.showPassword}
                        invalid={!!fieldErrors.password} describedBy={fieldProps("password", signup ? passwordHintId : undefined)["aria-describedby"]}
                    />
                    <FieldError id={`${fid}-password-error`} text={fieldErrors.password && fieldText(fieldErrors.password, a)} />
                    {signup && <p id={passwordHintId} className="mt-1 text-xs text-[var(--bts-text-muted)]">{a.passwordHint(PASSWORD_MIN)}</p>}
                </div>
                {alert && <AuthAlert {...alert} />}
                {/* כפתור שליחה יחיד: Enter בכל שדה מפעיל את הפעולה של המצב הנוכחי. */}
                <button type="submit" className={`${buttonClass} w-full text-[var(--bts-text-primary)]`} disabled={busy}>
                    {signup ? a.signUp : a.signIn}
                </button>
                {!signup && (
                    <button type="button" onClick={requestReset} disabled={busy} className={linkClass}>{a.forgotPassword}</button>
                )}
                <p className="border-t border-[var(--bts-sub-rule)] pt-2 text-xs text-[var(--bts-text-muted)]">
                    {signup ? a.haveAccount : a.noAccount}{" "}
                    <button type="button" onClick={() => switchMode(signup ? "signin" : "signup")} disabled={busy} className={linkClass}>
                        {signup ? a.signIn : a.signUp}
                    </button>
                </p>
            </form>
        );
    }

    return (
        <details open={defaultOpen || undefined} onToggle={(e) => setOpen(e.currentTarget.open)} className="mt-2 pt-0.5 border-t border-[var(--bts-sub-rule)]" dir={dir}>
            {session ? (
                // מחובר: כותרת חשבון קומפקטית. זהות (סמל משתמש ניטרלי ושם) ומתחתיה מצב הגישה ומועד הסיום,
                // משני. אין כאן מצב למידה: ההתקדמות והמבדקים שעברו נמצאים ב-Learning Pulse בלבד. נקודה על סמל
                // המשתמש = תשובת תמיכה שלא נקראה (וגם טקסט לקורא מסך). summary מקורי (מקלדת וקורא מסך כרגיל),
                // עם חץ משלו. שם ארוך נחתך חזותית בלבד; בלי שם (עוד נטען, או משתמש ותיק) הכותרת כללית.
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2.5 py-1.5 text-start [&::-webkit-details-marker]:hidden">
                    <IdentityMark unread={supportAllowed && unreadReplies > 0} />
                    <span className="min-w-0 flex-1">
                        <span className="sr-only">{a.summarySignedIn} </span>
                        <bdi className="block truncate text-[13px] font-bold leading-snug text-[var(--bts-text-primary)]">{fullName || a.title}</bdi>
                        <AccessStatusLine compact />
                        {supportAllowed && unreadReplies > 0 && <span className="sr-only"> {s.unread}</span>}
                    </span>
                    <ChevronDown size={16} aria-hidden className={`shrink-0 text-[var(--bts-text-faint)] transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
                </summary>
            ) : (
            <summary className="cursor-pointer truncate py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--bts-text-faint)] hover:text-[var(--bts-text-secondary)]">
                {ready ? (
                    // אורח: המצב (אורח) והפעולה (התחברות / יצירת חשבון) מוצגים בנפרד.
                    <span className="inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 align-bottom">
                        <UserRound size={12} aria-hidden="true" className="shrink-0" />
                        <span className="shrink-0">{a.guest}</span>
                        <span aria-hidden="true">·</span>
                        <span className="min-w-0 truncate normal-case tracking-normal text-[11px] text-[var(--bts-brand-primary-strong)] underline underline-offset-2">{a.summarySignedOut}</span>
                    </span>
                ) : a.title}
            </summary>
            )}
            {/* מחובר: מרווחים צפופים יותר, כי הפאנל יושב בכותרת הסרגל שאינה נגללת. */}
            <div className={`${session ? "pt-3.5 space-y-3" : "pt-3 space-y-3"} text-start`}>
                {body}
                {session && alert && <AuthAlert {...alert} />}
                {/* מחובר: שורת הסטטוס הריקה היא הילד האחרון, ו-space-y משאיר מעליה רווח. כשהיא ריקה הרווח מבוטל
                    (היא נשארת ב-DOM, כדי שהודעה חדשה תוקרא). */}
                <p id={statusId} aria-live="polite" className={`${session ? "empty:-mt-3" : ""} text-xs text-[var(--bts-text-secondary)] leading-relaxed`}>
                    {busy ? a.working : message}
                </p>
            </div>
        </details>
    );
}

/**
 * טופס סיסמה חדשה אחרי חזרה מקישור איפוס. חלון מודאלי מקורי (<dialog>) שנטען פעם אחת
 * ב-layout, ולכן נראה מיד בכל גודל מסך, בלי לפתוח את התפריט. Esc או "סגירה" מסיימים את
 * מצב האיפוס; הלומד נשאר מחובר ויכול לבקש קישור חדש בהמשך.
 */
export function PasswordResetDialog() {
    const { dir, t } = useT();
    const a = t.chrome.account;
    const { session, recovering } = useAuthState();
    const ref = useRef<HTMLDialogElement>(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [done, setDone] = useState(false);
    const fid = useId();
    const show = !!session && recovering;

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (show && !d.open) d.showModal();
        if (!show && d.open) d.close();
    }, [show]);

    if (!supabase) return null;
    const client = supabase;

    const save = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("newPassword") as HTMLInputElement;
        const password = input.value;
        setMessage("");
        setError("");
        const invalid = !password ? a.fieldPasswordRequired : password.length < PASSWORD_MIN ? a.fieldPasswordShort(PASSWORD_MIN) : "";
        flushSync(() => setFieldError(invalid));
        if (invalid) {
            input.focus();
            return;
        }
        setBusy(true);
        try {
            const { error } = await client.auth.updateUser({ password });
            if (error) throw error;
            setDone(true);
            setMessage(a.passwordUpdated);
        } catch (err) {
            setError(errorText(err, a));
        }
        setBusy(false);
    };

    return (
        <dialog
            ref={ref}
            dir={dir}
            aria-labelledby="bts-reset-title"
            onCancel={() => endPasswordRecovery()}
            className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface-elevated)] p-5 text-start text-[var(--bts-text-primary)] shadow-2xl backdrop:bg-black/60"
        >
            <form onSubmit={save} noValidate className="space-y-3">
                <h2 id="bts-reset-title" className="text-base font-black">{a.newPasswordTitle}</h2>
                <p className="text-sm text-[var(--bts-text-muted)]">
                    <bdi className="font-bold text-[var(--bts-text-secondary)]">{session?.user.email}</bdi>
                </p>
                {!done && (
                    <div>
                        <PasswordField
                            name="newPassword" label={a.newPassword} autoComplete="new-password" autoFocus showLabel={a.showPassword}
                            invalid={!!fieldError} describedBy={`${fid}-hint${fieldError ? ` ${fid}-error` : ""}`}
                        />
                        <FieldError id={`${fid}-error`} text={fieldError} />
                        <p id={`${fid}-hint`} className="mt-1 text-xs text-[var(--bts-text-muted)]">{a.fieldPasswordShort(PASSWORD_MIN)}</p>
                    </div>
                )}
                {error && <AuthAlert title={a.errorTitlePassword} body={error} />}
                <p aria-live="polite" className="text-sm text-[var(--bts-text-secondary)] leading-relaxed">
                    {busy ? a.working : message}
                </p>
                <div className="flex gap-2">
                    {!done && <button type="submit" className={buttonClass} disabled={busy}>{a.savePassword}</button>}
                    <button type="button" className={buttonClass} disabled={busy} onClick={() => endPasswordRecovery()}>{a.close}</button>
                </div>
            </form>
        </dialog>
    );
}

/**
 * קישור מייל (אישור כתובת או איפוס סיסמה) שפג תוקפו, שכבר נוצל או שאינו תקין: Supabase מחזיר
 * לעמוד עם פרמטרי שגיאה בכתובת. נטען פעם אחת ב-layout, מציג הודעה מתורגמת בחלון מודאלי מקורי,
 * ומנקה את פרמטרי השגיאה משורת הכתובת. ההודעה אחידה לשני סוגי הקישורים, ואינה חושפת דבר על החשבון.
 */
export function AuthLinkErrorDialog() {
    const { dir, t } = useT();
    const a = t.chrome.account;
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        // הכתובת כבר נוקתה ב-account.ts. כאן רק מציגים את ההודעה.
        const show = () => { if (takeAuthLinkError() && !ref.current?.open) ref.current?.showModal(); };
        show();
        window.addEventListener(AUTH_LINK_ERROR_EVENT, show);
        return () => window.removeEventListener(AUTH_LINK_ERROR_EVENT, show);
    }, []);

    return (
        <dialog
            ref={ref}
            dir={dir}
            aria-labelledby="bts-link-error-title"
            aria-describedby="bts-link-error-body"
            className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-[var(--bts-border)] bg-[var(--bts-surface-elevated)] p-5 text-start text-[var(--bts-text-primary)] shadow-2xl backdrop:bg-black/60"
        >
            <div className="space-y-3">
                <h2 id="bts-link-error-title" className="flex items-start gap-2 text-base font-black leading-snug">
                    <CircleAlert size={20} aria-hidden className="mt-0.5 shrink-0 text-[var(--bts-status-danger)]" />
                    {a.linkErrorTitle}
                </h2>
                <p id="bts-link-error-body" className="text-sm leading-relaxed text-[var(--bts-text-body)]">{a.linkErrorBody}</p>
                <button type="button" autoFocus className={`${buttonClass} w-full`} onClick={() => ref.current?.close()}>{a.close}</button>
            </div>
        </dialog>
    );
}

/**
 * נטען פעם אחת ב-layout של הלומדה.
 * 1. ניסיונות שממתינים בתור של המשתמש נשלחים בכל כניסה/טעינה ובכל חזרה של הרשת.
 * 2. שפה: בכניסה, העדפה שמורה מוחלת; אם אין, השפה הנוכחית נשמרת. אחר כך כל החלפת
 *    שפה נשמרת. לא שומרים לפני שהקריאה הראשונה הצליחה, כדי לא לדרוס העדפה ממכשיר אחר.
 */
export function AccountSync() {
    const { locale, setLocale } = useT();
    const { session, ready } = useAuthState();
    const userId = session?.user.id;
    const syncedFor = useRef<string | null>(null);
    const router = useRouter();
    const serverSignedIn = useCourseAccess().status !== "signed-out";
    const seenUser = useRef<string | null | undefined>(undefined);

    // 0. כתובת שחזרה מקישור מייל כבר נוקתה מהטוקנים בטעינת account.ts. setTimeout: אחרי שכל
    //    ה-effects של הטעינה רצו, כולל זה של הנתב של Next, כדי שגם הכתובת שהוא שומר תתעדכן.
    useEffect(() => {
        const id = window.setTimeout(syncCleanAuthUrl);
        return () => window.clearTimeout(id);
    }, []);

    // 3. השרת מרנדר לפי העוגייה. כשהמשתמש מתחלף (כניסה/יציאה), או כשבטעינה הראשונה השרת
    //    והדפדפן לא מסכימים (למשל טוקן שרוענן זה עתה), מרעננים פעם אחת את תצוגת השרת.
    useEffect(() => {
        if (!ready) return;
        const current = userId ?? null;
        const changed = seenUser.current !== undefined && seenUser.current !== current;
        const mismatch = seenUser.current === undefined && !!current !== serverSignedIn;
        seenUser.current = current;
        if (changed || mismatch) router.refresh();
    }, [ready, userId, serverSignedIn, router]);

    useEffect(() => {
        if (!userId) return;
        const flush = () => {
            void flushPendingAttempts(userId);
            void flushLearningUnits(userId);
        };
        flush();
        window.addEventListener("online", flush);
        return () => window.removeEventListener("online", flush);
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            syncedFor.current = null;
            return;
        }
        if (syncedFor.current === userId) {
            void savePreferredLocale(userId, locale);
            return;
        }
        let cancelled = false;
        loadPreferredLocale(userId).then(saved => {
            if (cancelled) return;
            syncedFor.current = userId;
            if (!saved) void savePreferredLocale(userId, locale);
            else if (saved !== locale) setLocale(saved);
        }).catch(() => {});
        return () => { cancelled = true; };
    }, [userId, locale, setLocale]);

    return null;
}
