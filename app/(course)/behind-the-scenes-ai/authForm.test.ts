import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
    validateAuth, authErrorKey, readAuthRedirect, normalizeFullName, signupRedirectUrl, SIGNUP_CONFIRM_PATH, PASSWORD_MIN,
} from "./authForm.ts";

const ok = { nameOk: true, email: "learner@example.com", password: "secret123" };

test("valid input passes in every mode", () => {
    assert.deepEqual(validateAuth("signin", ok), {});
    assert.deepEqual(validateAuth("signup", ok), {});
    assert.deepEqual(validateAuth("reset", ok), {});
});

test("required fields", () => {
    assert.deepEqual(validateAuth("signin", { nameOk: false, email: "  ", password: "" }), {
        email: "emailRequired", password: "passwordRequired",
    });
    assert.deepEqual(validateAuth("signup", { nameOk: false, email: "", password: "" }), {
        fullName: "nameInvalid", email: "emailRequired", password: "passwordRequired",
    });
});

test("invalid email", () => {
    for (const email of ["learner", "learner@", "@example.com", "learner@example", "a b@example.com"]) {
        assert.equal(validateAuth("signin", { ...ok, email }).email, "emailInvalid", email);
    }
    assert.equal(validateAuth("signin", { ...ok, email: "  learner@example.com  " }).email, undefined);
});

test("password length applies to signup only", () => {
    const short = "x".repeat(PASSWORD_MIN - 1);
    assert.equal(validateAuth("signup", { ...ok, password: short }).password, "passwordShort");
    assert.equal(validateAuth("signup", { ...ok, password: "x".repeat(PASSWORD_MIN) }).password, undefined);
    // התחברות לא חוסמת סיסמה קצרה: השרת מחליט, והתשובה לא חושפת דבר.
    assert.equal(validateAuth("signin", { ...ok, password: short }).password, undefined);
});

test("name is required for signup only, reset ignores password", () => {
    assert.equal(validateAuth("signin", { ...ok, nameOk: false }).fullName, undefined);
    assert.equal(validateAuth("signup", { ...ok, nameOk: false }).fullName, "nameInvalid");
    assert.deepEqual(validateAuth("reset", { ...ok, password: "" }), {});
});

test("auth error mapping", () => {
    const cases: [unknown, string][] = [
        [{ code: "invalid_credentials", status: 400 }, "invalid"],
        [{ code: "email_not_confirmed" }, "unconfirmed"],
        [{ code: "weak_password" }, "weakPassword"],
        [{ code: "same_password" }, "samePassword"],
        [{ code: "user_banned" }, "suspended"],
        [{ code: "over_email_send_rate_limit", status: 429, message: "email rate limit exceeded" }, "emailRateLimit"],
        [{ code: "over_request_rate_limit", status: 429 }, "rateLimit"],
        [{ status: 429 }, "rateLimit"],
        [{ code: "user_already_exists" }, "accountExists"],
        [{ code: "email_exists" }, "accountExists"],
        [{ code: "email_address_invalid" }, "emailRejected"],
        [{ name: "AuthRetryableFetchError", status: 0 }, "network"],
        // F1: supabase-js מחזיר AuthRetryableFetchError גם ל-5xx. זו תקלת שרת, לא רשת.
        [{ name: "AuthRetryableFetchError", status: 500, message: "Database error saving new user" }, "generic"],
        [{ name: "AuthRetryableFetchError", status: 503 }, "generic"],
        [new TypeError("Failed to fetch"), "network"],
        [{ code: "unexpected_failure", status: 500 }, "generic"],
        [new Error("boom"), "generic"],
        [null, "generic"],
        [undefined, "generic"],
    ];
    for (const [error, key] of cases) assert.equal(authErrorKey(error), key, JSON.stringify(error));
});

const BASE = "https://course.example/behind-the-scenes-ai/introduction";

test("F2: failed email link is detected and its error params are removed", () => {
    const expired = `${BASE}#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired&sb=`;
    assert.deepEqual(readAuthRedirect(expired), { cleanUrl: BASE, tokens: null, recovery: false, linkError: true });
    // query (PKCE) גם נתמך, ופרמטרים אחרים נשמרים.
    assert.equal(readAuthRedirect(`${BASE}?x=1&error=server_error&error_description=Oops`)?.cleanUrl, `${BASE}?x=1`);
    assert.equal(readAuthRedirect(`${BASE}?error_code=otp_expired`)?.cleanUrl, BASE);
});

test("anchors and ordinary URLs are not auth redirects", () => {
    assert.equal(readAuthRedirect(BASE), null);
    assert.equal(readAuthRedirect(`${BASE}#intro-more`), null);
    assert.equal(readAuthRedirect(`${BASE}?error=1`), null);
    assert.equal(readAuthRedirect(`${BASE}?type=signup`), null);
});

// QA: אחרי אישור מייל הכתובת נשארה עם access_token, refresh_token וכו', גם אחרי Ctrl+R.
const SECRET_PARAMS = ["access_token", "refresh_token", "expires_at", "expires_in", "token_type", "type", "provider_token", "provider_refresh_token"];
const tokenHash = (type: string) =>
    `#access_token=eyJ.access.sig&expires_at=1790000000&expires_in=3600&refresh_token=r3fr3sh&token_type=bearer&type=${type}`;

test("confirmation tokens are consumed and every auth param leaves the URL", () => {
    const r = readAuthRedirect(`${BASE}${tokenHash("signup")}`);
    assert.ok(r);
    assert.equal(r.cleanUrl, BASE);
    for (const p of SECRET_PARAMS) assert.ok(!r.cleanUrl.includes(p), p);
    assert.ok(!r.cleanUrl.includes("eyJ.access.sig") && !r.cleanUrl.includes("r3fr3sh"));
    // הטוקנים עוברים ל-setSession (ה-session נשמר ומתרענן כרגיל), ולא נשארים בכתובת.
    assert.deepEqual(r.tokens, { access_token: "eyJ.access.sig", refresh_token: "r3fr3sh" });
    assert.equal(r.recovery, false);
    assert.equal(r.linkError, false);
});

test("recovery tokens are consumed, flagged as recovery, and other params survive", () => {
    const r = readAuthRedirect(`https://course.example/behind-the-scenes-ai/chapter-3?x=1${tokenHash("recovery")}`);
    assert.ok(r);
    assert.equal(r.cleanUrl, "https://course.example/behind-the-scenes-ai/chapter-3?x=1");
    assert.equal(r.recovery, true);
    assert.ok(r.tokens);
});

test("an incomplete token hash is still removed but never used", () => {
    const r = readAuthRedirect(`${BASE}#access_token=only&token_type=bearer`);
    assert.ok(r);
    assert.equal(r.cleanUrl, BASE);
    assert.equal(r.tokens, null);
});

test("signup confirmation always returns to the introduction, never the current chapter", () => {
    assert.equal(SIGNUP_CONFIRM_PATH, "/behind-the-scenes-ai/introduction");
    assert.equal(signupRedirectUrl("https://course.example"), BASE);
    assert.equal(signupRedirectUrl("http://localhost:3000"), "http://localhost:3000/behind-the-scenes-ai/introduction");
});

test("full name: two parts and at least 5 characters for he, en, es, ru, ar", () => {
    for (const locale of ["he", "en", "es", "ru", "ar"]) {
        for (const ok of ["Ana Li", "Li Na", "תומר כהן", "علي حسن", "Иван Петров", "José María López"]) {
            assert.equal(normalizeFullName(ok, locale), ok, `${locale}: ${ok}`);
        }
        for (const bad of ["", "   ", "Madonna", "Li N", "A B", "x".repeat(101), "John\u0007 Smith", "山田太郎"]) {
            assert.equal(normalizeFullName(bad, locale), null, `${locale}: ${JSON.stringify(bad)}`);
        }
        // רווחים בקצוות, רצף רווחים ורווחי Unicode (NBSP, טאב) הופכים לרווח אחד.
        assert.equal(normalizeFullName("  John \t  Smith  ", locale), "John Smith");
        assert.equal(normalizeFullName("John Smith", locale), "John Smith");
    }
});

test("full name: Japanese needs no space, at least 2 characters", () => {
    for (const ok of ["山田太郎", "林誠", "山田 太郎", "Taro Yamada", "やまだ"]) assert.equal(normalizeFullName(ok, "ja"), ok, ok);
    assert.equal(normalizeFullName("山田　太郎", "ja"), "山田 太郎");
    for (const bad of ["", "　", "  ", "山", "x".repeat(101)]) assert.equal(normalizeFullName(bad, "ja"), null, JSON.stringify(bad));
});

test("admin rename uses the database base rule (2 to 100), not the registration rule", () => {
    assert.equal(normalizeFullName("Madonna", null), "Madonna");
    assert.equal(normalizeFullName(" A ", null), null);
    assert.equal(normalizeFullName("x".repeat(101), null), null);
});

test("full name length counts characters (code points), like the database", () => {
    // 100 נקודות קוד (199 יחידות UTF-16): תקין.
    assert.ok(normalizeFullName(`${"𠮷".repeat(50)} ${"𠮷".repeat(49)}`, "en"));
    assert.equal(normalizeFullName(`${"𠮷".repeat(50)} ${"𠮷".repeat(50)}`, "en"), null);
});

test("the client name rule matches the database trigger", () => {
    const sql = readFileSync(new URL("../../../supabase/migrations/20261001120000_locale_aware_registration_names.sql", import.meta.url), "utf8");
    assert.match(sql, /'locale', ''\) = 'ja'/);
    assert.match(sql, /char_length\(v_name\) > 100/);
    assert.match(sql, /v_ja and char_length\(v_name\) < 2/);
    assert.match(sql, /not v_ja and \(char_length\(v_name\) < 5 or position\(' ' in v_name\) = 0\)/);
});

test("sign-in and sign-up modes: Enter submits the active mode, and only sign-up checks the name", () => {
    // AccountPanel: כפתור שליחה יחיד לפי המצב (Enter = הפעולה הזו), ושם מלא רק ביצירת חשבון.
    const panel = readFileSync(new URL("./AccountPanel.tsx", import.meta.url), "utf8");
    assert.equal((panel.match(/type="submit"/g) ?? []).length, 2); // טופס החשבון + חלון הסיסמה החדשה
    assert.match(panel, /\{signup && \(\s*<div>\s*<label htmlFor=\{`\$\{fid\}-fullName`\}/);
    assert.match(panel, /autoComplete=\{signup \? "new-password" : "current-password"\}/);
    assert.match(panel, /emailRedirectTo: signupRedirectUrl\(window\.location\.origin\)/);
    assert.doesNotMatch(panel, /submitter/);
    assert.deepEqual(validateAuth("signin", { nameOk: false, email: "a@b.co", password: "x" }), {});
    assert.equal(validateAuth("signup", { nameOk: false, email: "a@b.co", password: "secret1" }).fullName, "nameInvalid");
});

test("the browser client takes over URL session detection", () => {
    const account = readFileSync(new URL("./account.ts", import.meta.url), "utf8");
    assert.match(account, /detectSessionInUrl: false/);
    assert.match(account, /readAuthRedirect\(window\.location\.href\)/);
    assert.match(account, /supabase\.auth\.setSession\(authRedirect\.tokens\)/);
    // replaceState בלבד (לא location.hash), ו-state ריק לסנכרון עם הנתב של Next.
    assert.match(account, /window\.history\.replaceState\(null, "", authRedirect\.cleanUrl\)/);
    assert.doesNotMatch(account, /^\s*(window\.)?location\.hash\s*=/m);
    assert.doesNotMatch(account, /console\.\w+\([^)]*token/i);
});

test("learners never write their own name from the app", () => {
    // השם נכתב רק במטא-דאטה של ההרשמה (signUp). אין upsert/update של full_name ואין updateUser עם full_name.
    for (const file of ["./account.ts", "./AccountPanel.tsx"]) {
        const src = readFileSync(new URL(file, import.meta.url), "utf8");
        assert.doesNotMatch(src, /updateUser\(\{[^}]*full_name/, file);
        assert.doesNotMatch(src, /\.(upsert|update|insert)\(\{[^}]*full_name/, file);
    }
});

// ── תבניות המייל (supabase/templates) ──
const LOCALE_BRANCHES = ["he", "ar", "es", "ru", "ja"]; // en = {{ else }}
for (const kind of ["confirmation", "recovery"]) {
    test(`${kind} email: one branch per locale, RTL for he and ar, English fallback, safe metadata use`, () => {
        const html = readFileSync(new URL(`../../../supabase/templates/${kind}.html`, import.meta.url), "utf8");
        const subject = readFileSync(new URL(`../../../supabase/templates/${kind}.subject.txt`, import.meta.url), "utf8");
        for (const src of [html, subject]) {
            assert.match(src, /\$l := printf "%v" \(or \.Data\.locale "en"\)/);
            for (const l of LOCALE_BRANCHES) assert.match(src, new RegExp(`if eq \\$l "${l}" \\}\\}`), `${kind}: ${l}`);
            assert.match(src, /\{\{ else \}\}/);
            // מטא-דאטה רק בהשוואה: שום ערך מהמשתמש לא מודפס לתוך המייל.
            assert.doesNotMatch(src, /\{\{-?\s*\$l\s*-?\}\}|\{\{-?\s*\.Data/);
            assert.doesNotMatch(src, /full_name/);
            assert.doesNotMatch(src, /[–—]/);
        }
        const branches = html.split(/\{\{ (?:else )?if eq \$l "|\{\{ else \}\}/).slice(1);
        assert.equal(branches.length, 6);
        for (const b of branches) {
            // ענף "if eq $l "xx"" מתחיל ב-xx"; ענף ה-else הוא אנגלית.
            const locale = /^(\w\w)"/.exec(b)?.[1] ?? "en";
            const attrs = /lang="(\w+)" dir="(\w+)"/.exec(b);
            assert.ok(attrs, `${kind}: ${locale}`);
            assert.equal(attrs[1], locale);
            assert.equal(attrs[2], locale === "he" || locale === "ar" ? "rtl" : "ltr", `${kind}: ${locale}`);
            assert.equal((b.match(/href="\{\{ \.ConfirmationURL \}\}"/g) ?? []).length, 1, `${kind}: ${locale} link`);
        }
    });
}


// ── Server-rejected email: separate from the client format check, and claims no reason ──
test("server email_address_invalid uses its own copy; malformed input keeps the field validation", () => {
    // Client side: a malformed address is a field error, as before; a well-formed one passes in every mode
    // (the server may still reject it, e.g. on /recover).
    assert.equal(validateAuth("reset", { ...ok, email: "learner@example" }).email, "emailInvalid");
    for (const mode of ["signin", "signup", "reset"] as const) {
        assert.equal(validateAuth(mode, { ...ok, email: "test-learner-active@example.com" }).email, undefined, mode);
    }
    // Server side: its own key, never the field-validation key.
    assert.equal(authErrorKey({ code: "email_address_invalid", status: 400 }), "emailRejected");
    // The panel shows the new message for it, keeps the operation title, and uses the field copy only for field errors.
    const panel = readFileSync(new URL("./AccountPanel.tsx", import.meta.url), "utf8");
    assert.match(panel, /emailRejected: a\.errorEmailRejected,/);
    assert.equal(panel.split("a.fieldEmailInvalid").length, 2, "fieldEmailInvalid only in fieldText");
    assert.match(panel, /case "emailInvalid": return a\.fieldEmailInvalid;/);
    assert.match(panel, /void run\(a\.errorTitleReset, async \(\) => \{/);
    // The new key exists in all six locales, differs from the format message, and says nothing about why.
    for (const locale of ["he", "en", "es", "ru", "ar", "ja"]) {
        const dict = readFileSync(new URL(`../../../i18n/locales/${locale}/chrome.ts`, import.meta.url), "utf8");
        const rejected = dict.match(/\n        errorEmailRejected: '((?:[^'\\]|\\.)+)',/)?.[1];
        const invalid = dict.match(/\n        fieldEmailInvalid: '((?:[^'\\]|\\.)+)',/)?.[1];
        assert.ok(rejected, `${locale}: errorEmailRejected`);
        assert.notEqual(rejected, invalid, `${locale}: not the format message`);
        assert.doesNotMatch(rejected!, /example\.com|@/, `${locale}: no example address`);
    }
    const he = readFileSync(new URL("../../../i18n/locales/he/chrome.ts", import.meta.url), "utf8");
    assert.match(he, /errorEmailRejected: 'לא ניתן לשלוח הודעה לכתובת האימייל הזו\. בדקו שהכתובת נכונה ונסו שוב\.',/);
});
