// Learner Pulse: every visual signal is real learner state, and the concepts stay separate.
// Segments = chapter quizzes passed (mastery summary). Access never changes them. The unread
// signal counts only unread support replies.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pulseSegments } from "./learnerPulse.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = (...rel: string[]) => readFileSync(join(HERE, ...rel), "utf8");
const passedCount = (passed: number, total: number) => pulseSegments(passed, total).filter((s) => s.passed).length;

test("one segment per chapter quiz; the first N passed, the rest are track", () => {
    // The panel passes TOTAL_CHAPTER_QUIZZES (masteryProgress.ts imports the browser client, so it is read as text).
    assert.match(source("masteryProgress.ts"), /export const TOTAL_CHAPTER_QUIZZES = 19;/);
    const segments = pulseSegments(4, 19);
    assert.equal(segments.length, 19);
    assert.deepEqual(segments.map((s) => s.passed), Array.from({ length: 19 }, (_, i) => i < 4));
    assert.equal(new Set(segments.map((s) => s.d)).size, 19, "each segment has its own arc");
    for (const s of segments) assert.match(s.d, /^M [\d.]+ [\d.]+ A 16\.5 16\.5 0 0 1 [\d.]+ [\d.]+$/);
});

test("segment count is clamped to real values (no invented progress)", () => {
    assert.equal(passedCount(0, 19), 0);
    assert.equal(passedCount(19, 19), 19);
    assert.equal(passedCount(25, 19), 19);
    assert.equal(passedCount(-3, 19), 0);
    assert.equal(passedCount(4.9, 19), 4);
    assert.equal(pulseSegments(0, 0).length, 0);
});

test("the Pulse reads mastery only: not the positional sidebar percentage and not access", () => {
    const panel = source("AccountPanel.tsx");
    // passed comes from the mastery summary of this signed-in user, or null while loading.
    assert.match(panel, /mastery\?\.sync\?\.userId === userId \? mastery\.summary\.passedChapters : null/);
    assert.match(panel, /<LearnerPulse passed=\{passed\} total=\{TOTAL_CHAPTER_QUIZZES\} unread=\{[^}]+\} open=\{open\} \/>/);
    // The Pulse itself never receives or reads the access status.
    const pulse = panel.slice(panel.indexOf("function LearnerPulse("), panel.indexOf("export function AccountPanel("));
    assert.ok(pulse.length > 0);
    assert.doesNotMatch(pulse, /useCourseAccess|hasCourseAccess|access.status|expired|revoked/);
    // The Pulse is the only progress visual: the old positional "Course progress" bar is gone.
    const sidebar = source("..", "..", "..", "components", "CourseSidebar.tsx");
    for (const file of [panel, sidebar]) assert.doesNotMatch(file, /courseProgress|currentChapterIndex|safeIndex/);
});

test("unread signal: only unread support_reply notifications of the signed-in user", () => {
    const account = source("account.ts");
    const reader = account.slice(account.indexOf("export async function loadUnreadSupportReplies("));
    const body = reader.slice(0, reader.indexOf("\n}\n"));
    assert.match(body, /\.from\("notifications"\)/);
    assert.match(body, /\.eq\("user_id", userId\)/);
    assert.match(body, /\.eq\("type", "support_reply"\)/);
    assert.match(body, /\.is\("read_at", null\)/);
    assert.doesNotMatch(body, /support_status/);
    // Shown only to learners who may use support (same rule as the support link).
    const panel = source("AccountPanel.tsx");
    assert.match(panel, /if \(!userId \|\| !supportAllowed\) return;/);
    assert.match(panel, /const hasUnread = supportAllowed && unreadReplies > 0;/);
});

test("Learner Pulse strings: compact mastery and contextual help in all six locales", () => {
    const keys = [
        /pulseMastery: \(passed: number, total: number\) => `[^`]*\$\{passed\}[^`]*\$\{total\}[^`]*`/,
        /newReplies: \(n: number\) => /,
        /helpChapter: '[^']+'/,
        /helpIntro: '[^']+'/,
    ];
    const seen = new Map<string, string>();
    for (const locale of ["he", "en", "es", "ru", "ar", "ja"]) {
        const dict = source("..", "..", "..", "i18n", "locales", locale, "chrome.ts");
        for (const key of keys) assert.match(dict, key, `${locale}: ${key}`);
        // The removed location strings are gone everywhere (nothing renders the current location).
        assert.doesNotMatch(dict, /contextIntro|contextChapter/, `${locale}: no location strings`);
        // Compact mastery: the count and a short noun, no "chapter ... passed" sentence.
        const mastery = dict.match(/pulseMastery: \(passed: number, total: number\) => `([^`]*)`/)![1];
        assert.ok(mastery.replace(/\$\{(passed|total)\}/g, "").trim().length <= 16, `${locale}: compact mastery "${mastery}"`);
        const help = dict.match(/helpChapter: '([^']+)'/)![1];
        assert.ok(!seen.has(help), `${locale}: helpChapter copied from ${seen.get(help)}`);
        seen.set(help, locale);
        assert.notEqual(help, dict.match(/helpIntro: '([^']+)'/)![1], `${locale}: chapter and introduction labels differ`);
        assert.doesNotMatch(dict, /[\u2013\u2014]/, `${locale}: no en/em dash`);
    }
    const he = source("..", "..", "..", "i18n", "locales", "he", "chrome.ts");
    assert.match(he, /helpChapter: 'עזרה בפרק הפעיל',/);
    assert.match(he, /pulseMastery: \(passed: number, total: number\) => `\$\{passed\} מתוך \$\{total\} מבחנים`,/);
    const en = source("..", "..", "..", "i18n", "locales", "en", "chrome.ts");
    assert.match(en, /pulseMastery: \(passed: number, total: number\) => `\$\{passed\} of \$\{total\} quizzes`,/);
});

test("Pulse center stays open; mastery is text beside it (visible open, sr-only collapsed)", () => {
    const panel = source("AccountPanel.tsx");
    // The panel state follows the native details toggle (no custom disclosure).
    assert.match(panel, /<details open=\{defaultOpen \|\| undefined\} onToggle=\{\(e\) => setOpen\(e\.currentTarget\.open\)\}/);
    assert.match(panel, /const \[open, setOpen\] = useState\(defaultOpen\);/);
    // No number inside the Pulse at any size: the 19 segments are the identity.
    const pulse = panel.slice(panel.indexOf("function LearnerPulse("), panel.indexOf("export function AccountPanel("));
    assert.doesNotMatch(pulse, /\{passed\}|\{total\}|tabular-nums/);
    // 32px collapsed, 60px expanded; never shrinks.
    assert.match(pulse, /className=\{`relative block shrink-0 [^`]*\$\{open \? "size-15" : "size-8"\}`\}/);
    // One mastery text: visible when open, sr-only when collapsed (never removed from the accessible name).
    assert.match(panel, /className=\{open \? "block [^"]*" : "sr-only"\}>\s*\{passed !== null && <> \{a\.pulseMastery\(passed, TOTAL_CHAPTER_QUIZZES\)\}<\/>\}/);
    // Long names truncate inside a min-w-0 column; the chevron never shrinks; the row stays 44px.
    assert.match(panel, /<span className="min-w-0 flex-1">\s*<span className="sr-only">\{a\.summarySignedIn\} <\/span>\s*<bdi className=\{`block truncate /);
    assert.match(panel, /<ChevronDown size=\{16\} aria-hidden className=\{`shrink-0 /);
    assert.match(panel, /<summary className=\{`flex min-h-\[44px\] cursor-pointer list-none /);
});

test("expanded density: compact help action and a tight account row, targets still 44px", () => {
    const panel = source("AccountPanel.tsx");
    // Help is a content-width secondary action at the logical start, not a full-width CTA.
    const help = panel.match(/const helpLinkClass = "([^"]+)";/)?.[1] ?? "";
    assert.match(help, /\bw-fit\b/);
    assert.match(help, /min-h-\[44px\]/);
    assert.doesNotMatch(help, /(?<![\w-])w-full\b|justify-center/);
    assert.match(panel, /<Link href=\{help\.href\} className=\{helpLinkClass\}>/);
    // Sign out keeps its 44px target and stays on the email row; the email truncates instead of pushing it out.
    assert.match(panel, /className="-my-1\.5 inline-flex min-h-\[44px\] shrink-0 /);
    assert.match(panel, /<div className="flex items-center justify-between gap-2">\s*<p className="min-w-0 truncate /);
});

test("expanded composition: no location text, access, then one Help / Sign out row", () => {
    const panel = source("AccountPanel.tsx");
    // The current location is used only for the help action (wording + saved origin), never rendered.
    assert.doesNotMatch(panel, /supportOriginText|formatChapterLabel|\btField\b|\{context\}|contextIntro|contextChapter/);
    assert.match(panel, /const help = supportAction\(pathname, carriedFrom, chapters, hasCourseAccess\(access\.status\)\);/);
    assert.match(panel, /help\.label === "chapter" \? s\.helpChapter : help\.label === "intro" \? s\.helpIntro : s\.entry/);
    // Access line first (start edge, no icon); an unread reply is the primary action on its own line after it.
    assert.match(panel, /<div className="space-y-2 empty:hidden">\s*<AccessStatusLine \/>\s*<BetaAccessRequest \/>\s*\{hasUnread && \(\s*<Link href=\{supportHomeHref\(supportOrigin\(pathname, carriedFrom\)\)\} className=\{replyLinkClass\}>/);
    assert.doesNotMatch(panel, /CalendarClock|BookOpen/);
    // One wrapping row: Help at the logical start, Sign out pushed to the logical end (no left/right, no centering).
    assert.match(panel, /<div className="flex flex-wrap items-center gap-x-3 gap-y-1">\s*\{supportAllowed && \(\s*<Link href=\{help\.href\} className=\{helpLinkClass\}>[\s\S]*?<\/Link>\s*\)\}\s*\{fullName !== null && <div className="-me-2 ms-auto flex">\{signOutButton\}<\/div>\}\s*<\/div>/);
    const body = panel.slice(panel.indexOf("const hasUnread = "), panel.indexOf("} else if (sentTo) {"));
    assert.doesNotMatch(body, /justify-center|\b(?:ml|mr|pl|pr|left|right)-/);
    // Both actions are content-width with 44px targets; only the unread reply is filled.
    for (const name of ["replyLinkClass", "helpLinkClass"]) {
        const cls = panel.match(new RegExp(`const ${name} = "([^"]+)";`))?.[1] ?? "";
        assert.match(cls, /\bw-fit\b/, name);
        assert.match(cls, /min-h-\[44px\]/, name);
        assert.doesNotMatch(cls, /(?<![\w-])w-full\b/, name);
    }
    assert.doesNotMatch(panel.match(/const helpLinkClass = "([^"]+)";/)![1], /(?<![\w:-])bg-/);
});

test("email only as the fallback identity; one Sign out control in either layout", () => {
    const panel = source("AccountPanel.tsx");
    const body = panel.slice(panel.indexOf("const hasUnread = "), panel.indexOf("} else if (sentTo) {"));
    // The email renders exactly once, inside the no-stored-name branch, on one row with Sign out.
    assert.equal(body.split("session.user.email").length, 2);
    assert.match(body, /\{fullName === null && \(\s*<div className="flex items-center justify-between gap-2">\s*<p className="min-w-0 truncate [^"]*">\s*\{a\.signedInAs\}\{" "\}\s*<Mail [^>]*\/>\s*<bdi dir="ltr" [^>]*>\{session\.user\.email\}<\/bdi>\s*<\/p>\s*\{signOutButton\}\s*<\/div>\s*\)\}/);
    // Sign out appears in the action row only when there is a name, and in the email row only when there is none.
    assert.equal(body.split("{signOutButton}").length, 3);
    assert.match(body, /\{fullName !== null && <div className="-me-2 ms-auto flex">\{signOutButton\}<\/div>\}/);
    // One Sign out control, still a quiet (borderless) 44px target that does not add row height.
    assert.equal(body.split("signOutAndForget").length, 2);
    assert.match(body, /const signOutButton = \(\s*<button\s+type="button"\s+className="-my-1\.5 inline-flex min-h-\[44px\] shrink-0 /);
    assert.doesNotMatch(body.match(/const signOutButton = \(\s*<button\s+type="button"\s+className="([^"]+)"/)![1], /\bborder\b/);
});

test("identity cluster: name then mastery with a visible gap, both in a shrinkable column", () => {
    const panel = source("AccountPanel.tsx");
    assert.match(panel, /<span className=\{open \? "block mt-1 [^"]*text-\[var\(--bts-text-muted\)\]" : "sr-only"\}>/);
    assert.match(panel, /\$\{open \? "text-sm" : "text-\[13px\]"\}/);
});
