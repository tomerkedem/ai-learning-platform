// ניקוי נתיב המקור של בקשת תמיכה: רק pathname של עמוד בלומדה נשמר. שום query, hash,
// token, מקור או כתובת מלאה לא עוברים. המסד בודק שוב (private.support_route_ok).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    canUseSupport, firstParam, isSupportKind, isUuid, normalizeSupportFrom, SUPPORT_HOME, supportHomeHref, supportNewHref, supportOrigin,
    supportAction, supportOriginText, type SupportOriginLabels,
} from "./supportShared.ts";
import { hasCourseAccess } from "../_access/access.ts";
import { courses } from "../../../../lib/courseData.ts";
import { tField } from "../../../../lib/localize.ts";
import { formatChapterLabel } from "../../../../i18n/format.ts";
import { LOCALE_LIST, type Locale } from "../../../../i18n/config.ts";
import { chrome as heChrome } from "../../../../i18n/locales/he/chrome.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = (rel: string) => readFileSync(join(HERE, rel), "utf8");
// Same rule as private.support_route_ok in 20261002110000_support_tickets.sql.
const DB_ROUTE = /^\/behind-the-scenes-ai(\/[a-z0-9-]{1,64}){0,3}$/;
// What a server page does with ?from= (searchParams of a link this module built).
const fromOf = (href: string) => normalizeSupportFrom(firstParam(new URL(href, "https://x.invalid").searchParams.get("from") ?? undefined));

test("keeps a valid course pathname", () => {
    for (const path of [
        "/behind-the-scenes-ai",
        "/behind-the-scenes-ai/introduction",
        "/behind-the-scenes-ai/chapter-3",
        "/behind-the-scenes-ai/final-exam",
        "/behind-the-scenes-ai/contact",
    ]) {
        assert.equal(normalizeSupportFrom(path), path, path);
    }
});

test("support pages are never an origin", () => {
    for (const path of [
        "/behind-the-scenes-ai/support",
        "/behind-the-scenes-ai/support/new",
        "/behind-the-scenes-ai/support/0b6f0c58-3c8e-4f0a-9d5e-2a1b3c4d5e6f",
    ]) {
        assert.equal(normalizeSupportFrom(path), null, path);
    }
    // A page whose name only starts with "support" is a normal course page.
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/supportive"), "/behind-the-scenes-ai/supportive");
});

test("Chapter 3 -> account panel -> support home -> new request -> ticket keeps Chapter 3", () => {
    const chapter = "/behind-the-scenes-ai/chapter-3";
    // 1. On Chapter 3 the account panel links to support home with the chapter as origin.
    const homeHref = supportHomeHref(supportOrigin(chapter, null));
    assert.equal(homeHref, `${SUPPORT_HOME}?from=%2Fbehind-the-scenes-ai%2Fchapter-3`);
    // 2. The support home page reads ?from= and keeps it.
    const homeFrom = fromOf(homeHref);
    assert.equal(homeFrom, chapter);
    // 3. On the support home the account panel keeps the same origin (not /support).
    assert.equal(supportHomeHref(supportOrigin(SUPPORT_HOME, homeFrom)), homeHref);
    // 4. "New request" carries it on.
    const newHref = supportNewHref(undefined, homeFrom);
    assert.equal(newHref, `${SUPPORT_HOME}/new?from=%2Fbehind-the-scenes-ai%2Fchapter-3`);
    const formFrom = fromOf(newHref);
    assert.equal(formFrom, chapter);
    // 5. On the new-request page the account panel and "Back to my requests" keep it too.
    assert.equal(supportHomeHref(supportOrigin(`${SUPPORT_HOME}/new`, formFrom)), homeHref);
    assert.equal(supportHomeHref(formFrom), homeHref);
    // 6. The action sends normalizeSupportFrom(from) as p_route, which the database accepts.
    const route = normalizeSupportFrom(formFrom);
    assert.equal(route, chapter);
    assert.match(String(route), DB_ROUTE);
});

test("direct support access without an origin still works", () => {
    assert.equal(supportHomeHref(), SUPPORT_HOME);
    assert.equal(supportHomeHref(null), SUPPORT_HOME);
    assert.equal(supportOrigin(SUPPORT_HOME, null), null);
    assert.equal(supportHomeHref(supportOrigin(SUPPORT_HOME, undefined)), SUPPORT_HOME);
    assert.equal(supportNewHref(undefined, fromOf(SUPPORT_HOME)), `${SUPPORT_HOME}/new`);
    assert.equal(fromOf(`${SUPPORT_HOME}/new`), null);
});

test("invalid or external origins are ignored, never navigated to or stored", () => {
    for (const bad of [
        "https://evil.example/behind-the-scenes-ai/chapter-3",
        "//evil.example/behind-the-scenes-ai",
        "javascript:alert(1)",
        "/python/introduction",
        "/behind-the-scenes-ai/support/new",
        "/behind-the-scenes-ai/../admin",
    ]) {
        assert.equal(supportOrigin(SUPPORT_HOME, bad), null, bad);
        assert.equal(supportHomeHref(bad), SUPPORT_HOME, bad);
        assert.equal(supportNewHref(undefined, bad), `${SUPPORT_HOME}/new`, bad);
        assert.equal(fromOf(`${SUPPORT_HOME}?from=${encodeURIComponent(bad)}`), null, bad);
    }
    // A query or hash on the origin is dropped; the clean pathname survives.
    assert.equal(supportOrigin(SUPPORT_HOME, "/behind-the-scenes-ai/chapter-3?x=1#access_token=abc"), "/behind-the-scenes-ai/chapter-3");
});

test("error page origin: the page itself, or the origin a support page carries", () => {
    const from = supportOrigin("/behind-the-scenes-ai/chapter-3", null);
    assert.equal(supportNewHref("problem", from), `${SUPPORT_HOME}/new?kind=problem&from=%2Fbehind-the-scenes-ai%2Fchapter-3`);
    assert.equal(supportOrigin(`${SUPPORT_HOME}/new`, "/behind-the-scenes-ai/chapter-3"), "/behind-the-scenes-ai/chapter-3");
    assert.equal(supportOrigin(`${SUPPORT_HOME}/new`, null), null);
    assert.equal(supportOrigin("/behind-the-scenes-ai/chapter-3", "/behind-the-scenes-ai/chapter-9"), "/behind-the-scenes-ai/chapter-3");
});

// The flow above only holds if every hop uses these helpers. Wiring check, as in access.test.ts.
test("every support entry and hop passes the origin through the shared helpers", () => {
    const panel = source("../AccountPanel.tsx");
    // The panel's help action and its "new reply" link both resolve the origin from the current
    // page or the ?from= a support page carries, through the shared helpers.
    assert.match(panel, /const pathname = usePathname\(\);/);
    assert.match(panel, /const carriedFrom = useSearchParams\(\)\.get\("from"\);/);
    assert.match(panel, /supportAction\(pathname, carriedFrom, chapters, hasCourseAccess\(access\.status\)\)/);
    assert.match(panel, /<Link href=\{help\.href\}/);
    assert.match(panel, /<Link href=\{supportHomeHref\(supportOrigin\(pathname, carriedFrom\)\)\}/);
    assert.doesNotMatch(panel, /href=\{SUPPORT_HOME\}/);

    const homePage = source("page.tsx");
    assert.match(homePage, /normalizeSupportFrom\(firstParam\(\(await searchParams\)\.from\)\)/);
    assert.match(homePage, /<SupportHome [^>]*from=\{from\}/);
    const home = source("SupportHome.tsx");
    assert.doesNotMatch(home, /supportNewHref\(\)/);
    assert.equal((home.match(/supportNewHref\(undefined, from\)/g) ?? []).length, 2);

    assert.match(source("new/page.tsx"), /from=\{normalizeSupportFrom\(firstParam\(query\.from\)\)\}/);
    const form = source("new/NewRequestForm.tsx");
    assert.match(form, /createSupportRequest\(kind, body, from\)/);
    assert.match(form, /href=\{supportHomeHref\(from\)\}/);
    assert.match(source("actions.ts"), /p_route: normalizeSupportFrom\(from\)/);

    const errorPage = source("../../error.tsx");
    assert.match(errorPage, /supportOrigin\(usePathname\(\), useSearchParams\(\)\.get\("from"\)\)/);
    assert.match(errorPage, /supportNewHref\("problem", from\)/);
});

test("removes the query string", () => {
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter-3?step=2&x=y"), "/behind-the-scenes-ai/chapter-3");
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter-3?"), "/behind-the-scenes-ai/chapter-3");
});

test("removes the hash, including auth tokens from email links", () => {
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter-3#section-2"), "/behind-the-scenes-ai/chapter-3");
    const tokenUrl = "/behind-the-scenes-ai/introduction#access_token=eyJhbGciOiJIUzI1NiJ9.x.y&refresh_token=abc&type=recovery";
    const out = normalizeSupportFrom(tokenUrl);
    assert.equal(out, "/behind-the-scenes-ai/introduction");
    assert.doesNotMatch(String(out), /token|eyJ|#|\?/);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter-1?x=1#access_token=abc"), "/behind-the-scenes-ai/chapter-1");
});

test("rejects absolute and external URLs", () => {
    for (const url of [
        "https://evil.example/behind-the-scenes-ai/chapter-3",
        "http://localhost:3000/behind-the-scenes-ai/chapter-3",
        "//evil.example/behind-the-scenes-ai",
        "\\\\evil.example/behind-the-scenes-ai",
        "/\\evil.example/behind-the-scenes-ai",
        "javascript:alert(1)",
        "data:text/html,hi",
        "mailto:a@example.com",
    ]) {
        assert.equal(normalizeSupportFrom(url), null, url);
    }
});

test("rejects paths outside the course", () => {
    for (const path of [
        "/",
        "/admin",
        "/python/introduction",
        "/math/mathIntuitive/introduction",
        "/behind-the-scenes-ai-other/chapter-1",
        "behind-the-scenes-ai/chapter-1",
        "chapter-1",
    ]) {
        assert.equal(normalizeSupportFrom(path), null, path);
    }
});

test("traversal and encoding tricks never escape the course or smuggle characters", () => {
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/../admin"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/%2e%2e/admin"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter-3/.."), null); // becomes a trailing slash
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter%2D3"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter-3%3Fx%3D1"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter-3%23access_token%3Dabc"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/Chapter-3"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/chapter_3"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/פרק"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/a/b/c/d"), null);
    assert.equal(normalizeSupportFrom("/behind-the-scenes-ai/"), null);
});

test("rejects over-long values and non-strings", () => {
    assert.equal(normalizeSupportFrom(`/behind-the-scenes-ai/${"a".repeat(65)}`), null);
    assert.equal(normalizeSupportFrom(`/behind-the-scenes-ai/${"a".repeat(64)}`), `/behind-the-scenes-ai/${"a".repeat(64)}`);
    const long = `/behind-the-scenes-ai/${"a".repeat(60)}/${"b".repeat(60)}/${"c".repeat(60)}`;
    assert.ok(long.length > 200);
    assert.equal(normalizeSupportFrom(long), null);
    assert.equal(normalizeSupportFrom(`/behind-the-scenes-ai/chapter-3?${"x".repeat(5000)}`), null);
    for (const value of ["", null, undefined, 42, ["/behind-the-scenes-ai/chapter-3"], {}]) {
        assert.equal(normalizeSupportFrom(value), null, String(value));
    }
});

test("new-request link carries only a clean kind and route", () => {
    assert.equal(supportNewHref(), "/behind-the-scenes-ai/support/new");
    assert.equal(supportNewHref("problem", "/behind-the-scenes-ai/chapter-3?x=1#access_token=abc"),
        "/behind-the-scenes-ai/support/new?kind=problem&from=%2Fbehind-the-scenes-ai%2Fchapter-3");
    assert.equal(supportNewHref("help", "https://evil.example/x"), "/behind-the-scenes-ai/support/new?kind=help");
});

test("kinds, ids and who may use support", () => {
    for (const kind of ["problem", "help", "feedback"]) assert.equal(isSupportKind(kind), true, kind);
    for (const kind of ["bug", "", null, "Problem"]) assert.equal(isSupportKind(kind), false, String(kind));
    assert.equal(isUuid("0b6f0c58-3c8e-4f0a-9d5e-2a1b3c4d5e6f"), true);
    assert.equal(isUuid("0b6f0c58"), false);
    assert.equal(isUuid("../0b6f0c58-3c8e-4f0a-9d5e-2a1b3c4d5e6f"), false);
    // Course access is not required; signing in with a confirmed, non-suspended account is.
    for (const status of ["active", "no-grant", "expired", "revoked"] as const) assert.equal(canUseSupport(status), true, status);
    for (const status of ["signed-out", "unconfirmed", "suspended", "unavailable"] as const) assert.equal(canUseSupport(status), false, status);
});

// ── Where a request was sent from: from the request's persisted route, through the course data ──
const CHAPTERS = courses["behind-the-scenes-ai"].chapters;
// Same composition as SupportOrigin in supportParts.tsx.
const originOf = (route: string | null | undefined, locale: Locale, labels: SupportOriginLabels) =>
    supportOriginText(route, CHAPTERS, labels, (n) => formatChapterLabel(locale, n), (c) => tField(c.title, locale));
const he = heChrome.support;
const titleOf = (id: number, locale: Locale) => tField(CHAPTERS.find((c) => c.id === id)!.title, locale);

test("origin: Chapter 1 request shows Chapter 1 with its title from the course data", () => {
    assert.equal(originOf("/behind-the-scenes-ai/chapter-1", "he", he), `נשלחה מתוך פרק 1 - ${titleOf(1, "he")}`);
    assert.match(titleOf(1, "he"), /הצ'אט השקוף/);
});

test("origin: Chapter 3 request shows Chapter 3", () => {
    assert.equal(originOf("/behind-the-scenes-ai/chapter-3", "he", he), "נשלחה מתוך פרק 3 - Tokenization: כשהטקסט מתפרק לטוקנים");
});

test("origin: introduction request shows the introduction", () => {
    assert.equal(originOf("/behind-the-scenes-ai/introduction", "he", he), "נשלחה מתוך המבוא");
});

test("origin: no recorded route, or a page that is not the intro or a chapter, shows nothing", () => {
    for (const route of [null, undefined, "", "/behind-the-scenes-ai/contact", "/behind-the-scenes-ai/chapter-99", "/behind-the-scenes-ai/support", "/behind-the-scenes-ai/chapter-3?x=1"]) {
        assert.equal(originOf(route, "he", he), null, String(route));
    }
});

test("origin: the current page's ?from= never changes a saved request's origin", () => {
    // The support page was opened from the introduction, but this request was sent from Chapter 3.
    const pageFrom = fromOf(supportHomeHref("/behind-the-scenes-ai/introduction"));
    assert.equal(pageFrom, "/behind-the-scenes-ai/introduction");
    const ticket = { route: "/behind-the-scenes-ai/chapter-3" };
    assert.equal(originOf(ticket.route, "he", he), "נשלחה מתוך פרק 3 - Tokenization: כשהטקסט מתפרק לטוקנים");
    // An old request without a route stays without an origin, whatever ?from= says.
    assert.equal(originOf(null, "he", he), null);
    // Wiring: both views pass the request's own route, never the page's from.
    const home = source("SupportHome.tsx");
    assert.match(home, /<SupportOrigin route=\{r\.route\}/);
    assert.doesNotMatch(home, /<SupportOrigin route=\{from/);
    assert.match(source("[id]/SupportRequestView.tsx"), /<SupportOrigin route=\{request\.route\}/);
    assert.match(source("supportParts.tsx"), /supportOriginText\(route, COURSE_CHAPTERS, t\.chrome\.support, \(n\) => formatChapterLabel\(locale, n\), \(c\) => tField\(c\.title, locale\)\)/);
});

test("origin: chapter label and title come from the existing locale data in every locale", () => {
    const probe: SupportOriginLabels = { originIntro: "INTRO", originChapter: (label, title) => `${label}|${title}` };
    for (const locale of LOCALE_LIST) {
        assert.equal(originOf("/behind-the-scenes-ai/chapter-3", locale, probe), `${formatChapterLabel(locale, 3)}|${titleOf(3, locale)}`, locale);
    }
    assert.equal(originOf("/behind-the-scenes-ai/chapter-3", "en", probe), "Chapter 3|Tokenization: When Text Breaks Into Tokens");
    assert.equal(originOf("/behind-the-scenes-ai/chapter-1", "ar", probe), "الفصل 1|المحادثة الشفافة: الطريق خلف الجواب");
    assert.equal(originOf("/behind-the-scenes-ai/chapter-3", "ja", probe), "第3章|Tokenization：テキストがトークンに分かれるとき");
    // The sentence wrappers exist in all six dictionaries and are translated, not copied from Hebrew.
    for (const locale of LOCALE_LIST) {
        const dict = readFileSync(join(HERE, `../../../../i18n/locales/${locale}/chrome.ts`), "utf8");
        const intro = dict.match(/originIntro: '([^']+)'/)?.[1];
        assert.ok(intro, `${locale}: originIntro`);
        assert.match(dict, /originChapter: \(chapterLabel: string, title: string\) => `[^`]*\$\{chapterLabel\}[^`]*\$\{title\}[^`]*`/, `${locale}: originChapter`);
        if (locale !== "he") assert.notEqual(intro, he.originIntro, `${locale}: not a Hebrew copy`);
        // No "label: title" double colon (course titles already contain one); the intro gets no separator.
        assert.doesNotMatch(dict, /\$\{chapterLabel\}:/, `${locale}: no colon after the chapter label`);
        assert.doesNotMatch(intro, /-/, `${locale}: no hyphen in the intro wording`);
    }
});

// ── Learner Pulse: the account panel's help action follows the real context and access ──
test("help action: chapter and introduction only with active access, origin always kept", () => {
    const chapters = courses["behind-the-scenes-ai"].chapters;
    const chapter = "/behind-the-scenes-ai/chapter-3";
    const intro = "/behind-the-scenes-ai/introduction";
    // Active access on a chapter: a new help request whose origin is that chapter.
    const onChapter = supportAction(chapter, null, chapters, true);
    assert.equal(onChapter.label, "chapter");
    assert.equal(onChapter.href, supportNewHref("help", chapter));
    assert.equal(fromOf(onChapter.href), chapter);
    assert.equal(new URL(onChapter.href, "https://x.invalid").searchParams.get("kind"), "help");
    const onIntro = supportAction(intro, null, chapters, true);
    assert.deepEqual(onIntro, { label: "intro", href: supportNewHref("help", intro) });
    // Without active access the same pages get generic support, still carrying the page as origin.
    assert.deepEqual(supportAction(chapter, null, chapters, false), { label: "generic", href: supportHomeHref(chapter) });
    assert.deepEqual(supportAction(intro, null, chapters, false), { label: "generic", href: supportHomeHref(intro) });
    // Pages that are not the introduction or a chapter: generic, with their own origin.
    for (const page of ["/behind-the-scenes-ai", "/behind-the-scenes-ai/faq", "/behind-the-scenes-ai/final-exam"]) {
        assert.deepEqual(supportAction(page, null, chapters, true), { label: "generic", href: supportHomeHref(page) }, page);
    }
    // A support page is never "this chapter", but keeps the origin it already carries.
    const fromSupport = supportAction(SUPPORT_HOME, chapter, chapters, true);
    assert.deepEqual(fromSupport, { label: "generic", href: supportHomeHref(chapter) });
    assert.equal(fromOf(fromSupport.href), chapter);
    assert.deepEqual(supportAction(null, null, chapters, true), { label: "generic", href: SUPPORT_HOME });
});

test("help action: only the active access status counts as active", () => {
    const chapters = courses["behind-the-scenes-ai"].chapters;
    const statuses = ["signed-out", "unconfirmed", "no-grant", "expired", "revoked", "active", "unavailable", "suspended"] as const;
    for (const status of statuses) {
        const label = supportAction("/behind-the-scenes-ai/chapter-3", null, chapters, hasCourseAccess(status)).label;
        assert.equal(label, status === "active" ? "chapter" : "generic", status);
    }
});
