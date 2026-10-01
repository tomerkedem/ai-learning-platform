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
import { CircleAlert, Eye, EyeOff, MailCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useT } from "@/i18n/useT";
import { useCourseAccess } from "./_access/CourseAccessContext";
import { BetaAccessRequest } from "./_access/BetaAccessRequest";
import type { Dictionary } from "@/i18n/dictionary";
import { LOCALES } from "@/i18n/config";
import { getAllRecords, MASTERY_UPDATED_EVENT } from "./masteryProgress";
import {
    supabase,
    useAuthState,
    endPasswordRecovery,
    flushPendingAttempts,
    signOutAndForget,
    loadFullName,
    cachedFullName,
    checkIsCourseAdmin,
    importLocalRecords,
    isImportHandled,
    markImportHandled,
    loadPreferredLocale,
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
        emailInvalid: a.fieldEmailInvalid,
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

/** שגיאה בולטת אך לא תוקפנית: אייקון, כותרת וגוף, ו-role="alert" שמוקרא מיד. */
function AuthAlert({ title, body }: { title?: string; body: string }) {
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

/** שגיאת שדה: אייקון וטקסט (לא צבע בלבד), מקושרת לשדה דרך aria-describedby. */
function FieldError({ id, text }: { id: string; text?: string }) {
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

/** מצב הרשאת הבטא של החשבון המחובר. אימות מייל לבדו לעולם לא מוצג כגישה. */
function AccessStatusLine() {
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
    return <p className="text-[11px] font-bold text-[var(--bts-text-secondary)] leading-relaxed">{text}</p>;
}

/** defaultOpen: פתוח מראש (בשער התצוגה המקדימה של המבוא), כדי שההרשמה וההתחברות יהיו גלויות מיד. */
export function AccountPanel({ defaultOpen = false }: { defaultOpen?: boolean } = {}) {
    const { dir, locale, t } = useT();
    const a = t.chrome.account;
    const { session, ready } = useAuthState();
    const userId = session?.user.id;
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
        body = (
            <>
                <p className="text-[11px] text-[var(--bts-text-muted)] leading-relaxed">
                    {a.signedInAs}{" "}
                    {fullName && <><bdi className="font-bold text-[var(--bts-text-secondary)]">{fullName}</bdi><br /></>}
                    <bdi dir="ltr" className={fullName ? "" : "font-bold text-[var(--bts-text-secondary)]"}>{session.user.email}</bdi>
                </p>
                {fullName === null && (
                    <div className="rounded-lg border border-[var(--bts-border)] bg-[var(--bts-sub-fill)] p-2.5 space-y-1">
                        <p className="text-[11px] font-bold text-[var(--bts-text-primary)]">{a.nameMissingTitle}</p>
                        <p className="text-[11px] text-[var(--bts-text-muted)] leading-relaxed">{a.nameMissingBody}</p>
                    </div>
                )}
                <AccessStatusLine />
                <BetaAccessRequest />
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
                <button type="button" className={buttonClass} disabled={busy} onClick={() => userId && void signOutAndForget(userId)}>{a.signOut}</button>
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
        <details open={defaultOpen || undefined} className="mt-2 pt-0.5 border-t border-[var(--bts-sub-rule)]" dir={dir}>
            {/* שורה אחת: שם ארוך נחתך חזותית בלבד בתוך ה-bdi, לפי כיוון השם עצמו (תחילתו נשמרת),
                והשם המלא נשאר בשם הנגיש של ה-summary. */}
            <summary className="cursor-pointer truncate py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--bts-text-faint)] hover:text-[var(--bts-text-secondary)]">
                {session && fullName ? (
                    <span className="inline-flex max-w-[calc(100%-1rem)] items-center gap-1 align-bottom">
                        <span className="shrink-0">{a.summarySignedIn}</span>{" "}
                        <UserRound size={12} aria-hidden="true" className="shrink-0" />{" "}
                        <bdi className="min-w-0 truncate normal-case tracking-normal leading-none text-[11px] text-[var(--bts-text-secondary)]">{fullName}</bdi>
                    </span>
                ) : ready && !session ? (
                    // אורח: המצב (אורח) והפעולה (התחברות / יצירת חשבון) מוצגים בנפרד.
                    <span className="inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 align-bottom">
                        <UserRound size={12} aria-hidden="true" className="shrink-0" />
                        <span className="shrink-0">{a.guest}</span>
                        <span aria-hidden="true">·</span>
                        <span className="min-w-0 truncate normal-case tracking-normal text-[11px] text-[var(--bts-brand-primary-strong)] underline underline-offset-2">{a.summarySignedOut}</span>
                    </span>
                ) : a.title}
            </summary>
            <div className="pt-3 space-y-3 text-start">
                {body}
                {session && alert && <AuthAlert {...alert} />}
                <p id={statusId} aria-live="polite" className="text-xs text-[var(--bts-text-secondary)] leading-relaxed">
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
        const flush = () => void flushPendingAttempts(userId);
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
