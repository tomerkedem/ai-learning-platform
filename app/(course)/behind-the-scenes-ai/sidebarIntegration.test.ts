// Production sidebar integration (Phase 6): one learning visualization (the Pulse), a compact account
// header with no learning state, one shared learner store, 19 chapter cards plus a separate final-exam row,
// and a scroll layout where only the chapter list scrolls. Source contracts plus the pure route helper.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { register } from "node:module";

// The model imports its siblings without an extension (bundler resolution); add ".ts" for node.
register("data:text/javascript," + encodeURIComponent(`
export async function resolve(specifier, context, next) {
    try { return await next(specifier, context); }
    catch (error) {
        if (specifier.startsWith(".") && !/\\.[a-z]+$/i.test(specifier)) return next(specifier + ".ts", context);
        throw error;
    }
}`));
const { chapterIdFromPath, FINAL_EXAM_HREF, revealScrollTop } = await import("./learningPulseModel.ts");

const HERE = dirname(fileURLToPath(import.meta.url));
const source = (...rel: string[]) => readFileSync(join(HERE, ...rel), "utf8");
const sidebar = source("..", "..", "..", "components", "CourseSidebar.tsx");
const account = source("AccountPanel.tsx");
const wiring = source("LearningSidebar.tsx");

test("account header: no learning ring, no quiz count, no learning state at all", () => {
    assert.doesNotMatch(account, /LearnerPulse|pulseSegments|learnerPulse|useMasteryView|useCourseLearning|TOTAL_CHAPTER_QUIZZES|pulseMastery|passedChapters|masteredCount/);
    assert.equal(existsSync(join(HERE, "learnerPulse.ts")), false, "the old ring module is gone");
    for (const l of ["he", "en", "es", "ru", "ar", "ja"]) {
        const chrome = source("..", "..", "..", "i18n", "locales", l, "chrome.ts");
        assert.doesNotMatch(chrome, /pulseMastery|sidebarTitle|weakHeaderShort/, `${l}: retired keys removed`);
    }
});

test("account header keeps identity, access and every account action", () => {
    const summary = account.slice(account.indexOf("<summary className=\"flex min-h-[44px]"), account.indexOf("</summary>"));
    assert.match(summary, /<IdentityMark unread=\{supportAllowed && unreadReplies > 0\} \/>/, "neutral identity mark");
    assert.match(summary, /\{fullName \|\| a\.title\}/, "learner name");
    assert.match(summary, /<AccessStatusLine compact \/>/, "access status and expiry, secondary, in the compact header");
    assert.match(summary, /\{supportAllowed && unreadReplies > 0 && <span className="sr-only"> \{s\.unread\}<\/span>\}/, "unread stays announced");
    for (const kept of [
        /<BetaAccessRequest \/>/, /supportHomeHref\(supportOrigin\(pathname, carriedFrom\)\)/, /\{s\.newReplies\(unreadReplies\)\}/,
        /href="\/behind-the-scenes-ai\/admin"/, /onClick=\{runImport\}/, /\{a\.nameMissingTitle\}/,
        /signOutAndForget\(userId\)/, /aria-live="polite"/, /\{a\.signedInAs\}/,
    ]) assert.match(account, kept, String(kept));
    assert.equal([...account.matchAll(/<AccessStatusLine/g)].length, 1, "access status shown once (header), not again in the body");
});

test("unread support indicator survives the ring's retirement, on the neutral identity mark", () => {
    const mark = account.slice(account.indexOf("function IdentityMark"), account.indexOf("/** defaultOpen:"));
    assert.match(mark, /<UserRound /);
    assert.match(mark, /\{unread && \(/);
    assert.match(mark, /bg-\[var\(--bts-status-caution\)\]/, "support colour, not a learning colour");
    assert.doesNotMatch(mark, /lp-|mastery|progress/i);
    assert.match(mark, /aria-hidden="true"/);
});

test("the sidebar reads the one shared learner store; no learning fetch or second derivation", () => {
    assert.match(wiring, /useCourseLearning\(\)/);
    assert.doesNotMatch(wiring, /supabase|loadAccountSnapshot|loadReachedUnits|fetch\(|masterySummary|getMasterySummary/);
    assert.doesNotMatch(sidebar, /SidebarMastery|useCourseLearning|supabase|loadReachedUnits/, "CourseSidebar holds no learning state itself");
    assert.equal(existsSync(join(HERE, "MasteryDashboard.tsx")) && /export function SidebarMastery/.test(source("MasteryDashboard.tsx")), false, "SidebarMastery retired");
    assert.doesNotMatch(source("MasteryDashboard.tsx"), /export function useMasteryView/, "useMasteryView is private to the final-exam dashboard");
});

test("layout: account header and Pulse do not scroll; only the chapter list does", () => {
    const header = sidebar.slice(sidebar.indexOf("{/* Header */}"), sidebar.indexOf("{/* Navigation List */}"));
    const list = sidebar.slice(sidebar.indexOf("{/* Navigation List */}"), sidebar.indexOf("{/* Footer */}"));
    assert.match(header, /<AccountPanel \/>/);
    assert.match(header, /<SidebarPulse /);
    assert.ok(header.indexOf("<AccountPanel") < header.indexOf("<SidebarPulse"), "account above learning");
    assert.match(list, /<SidebarChapterList /);
    assert.match(list, /overflow-y-auto/);
    assert.doesNotMatch(header, /overflow-y-auto/, "no nested competing scroll region");
});

test("chapter list: intro and exactly the 19 chapter cards; the final exam is not in the list and never chapter 20", () => {
    const list = wiring.slice(wiring.indexOf("export function SidebarChapterList"));
    assert.match(list, /course\.chapters\.map\(\(c\) => \(\s*<ChapterNavCard/);
    assert.match(list, /milestones=\{milestones\[c\.chapterId - 1\]\}/);
    assert.match(list, /current=\{c\.chapterId === current\}/);
    assert.doesNotMatch(list, /FinalExam|final-exam|FINAL_EXAM_HREF/, "no final-exam row after chapter 19");
    assert.doesNotMatch(source("ChapterNavCard.tsx"), /FinalExam|GraduationCap/);
    assert.equal(chapterIdFromPath(FINAL_EXAM_HREF), null, "the final exam is not a chapter");
    assert.equal(chapterIdFromPath("/behind-the-scenes-ai/chapter-20"), null);
    assert.equal(chapterIdFromPath("/behind-the-scenes-ai/chapter-7"), 7);
    assert.equal(chapterIdFromPath("/behind-the-scenes-ai/introduction"), null);
});

test("final exam: the gold destination card stays visible in both Pulse states; Continue lives in the contents header", () => {
    const pulse = source("LearningPulse.tsx");
    const panel = pulse.slice(pulse.indexOf("export function LearningPulsePanel"), pulse.indexOf("export const ScoreWell"));
    const body = panel.slice(panel.indexOf('<div className="lp-body">'), panel.indexOf("<FinalExamCard "));
    assert.match(body, /<Stat /, "the statistics fold away in compact");
    assert.ok(panel.indexOf("<FinalExamCard ") > panel.indexOf('<div className="lp-body">'), "after the statistics, outside the folding body");
    assert.equal([...panel.matchAll(/<FinalExamCard /g)].length, 1);
    assert.doesNotMatch(panel, /ContinueLink|continueAction/, "Continue is not part of the learning signature");
    assert.match(sidebar, /\{t\.chrome\.tableOfContents\}\s*<\/div>\s*\{currentCourseId === 'behind-the-scenes-ai' && <SidebarContinue /, "compact Continue beside the contents title");
    assert.match(wiring, /finalExamCurrent=\{pathname === FINAL_EXAM_HREF\}/);
    const card = pulse.slice(pulse.indexOf("function FinalExamCard"), pulse.indexOf("function Stat("));
    // States in words (not colour alone), from the latest attempt; latest score only when taken; never best score.
    // Approved reference, compressed: emblem (rings, arc, cap, halo, sparkles) | title + status (+ latest score) |
    // destination area (Course goal flag badge + quiet summary). No chevron: the whole card is the link.
    assert.match(card, /className="relative me-1 grid size-\[38px\] shrink-0 place-items-center"/, "a medallion with deliberate breathing room before the title");
    const medallion = card.slice(card.indexOf("size-[38px]"), card.indexOf("<GraduationCap"));
    assert.equal([...medallion.matchAll(/rounded-full border/g)].length, 2, "one strong glowing ring and one faint depth ring, not a target");
    assert.match(medallion, /border-\[1\.5px\] border-\[var\(--lp-gold-edge-strong\)\][^"]*shadow-\[0_0_14px_-1px_var\(--lp-gold-glow\)/, "the primary ring keeps the premium glow");
    assert.match(card, /<GraduationCap size=\{18\}/);
    assert.equal([...card.matchAll(/<Sparkle /g)].length, 2, "the two decorative sparkles");
    assert.doesNotMatch(card, /Chevron|ArrowLeft|ArrowRight/, "no navigation arrow inside the card");
    assert.match(card, /\{p\.courseDestination\}<\/span>\s*<Flag size=\{10\} fill="currentColor" className="shrink-0" \/>/, "Course goal badge, flag after the label");
    assert.match(card, /<span ref=\{summaryRef\} className=\{`whitespace-nowrap text-\[10px\][^`]*\$\{summaryFits \? "" : "h-0 overflow-hidden"\}`\}>\{p\.finalExamSummary\}<\/span>/, "quiet summary on one line, hidden (never wrapped or clipped) when it does not fit");
    assert.match(card, /className="block text-\[15px\] font-bold leading-tight text-\[var\(--bts-text-primary\)\]">\{title\}<\/span>/, "the title is the strongest text and never truncated");
    assert.doesNotMatch(card, /truncate/);
    const order = ["size-[38px]", "{title}", "{status}", "{finalExam.latestScore}</span>", "{p.courseDestination}"].map((x) => card.indexOf(x));
    assert.ok(order.every((v, i) => v > 0 && (i === 0 || v > order[i - 1])), "emblem, title, status, score, destination (logical order)");
    // Latest score only once taken, in the status row; never a 0, dash or best score.
    assert.match(card, /\{finalExam\.latestScore !== null && \(\s*<span className=\{`inline-grid min-w-\[30px\][^`]*`\}>\{finalExam\.latestScore\}<\/span>/);
    assert.doesNotMatch(card, /bestScore|formatChapterLabel|chapter-20|MasteryNode|masteryEarned|\{"-"\}/, "not a chapter, no best score, no chapter mastery");
    assert.match(card, /aria-current=\{current \? "page" : undefined\}/);
    // States from the existing final-exam semantics; dedicated card copy; gold stays the identity.
    assert.match(card, /const state = !finalExam\.attempted \? "open" : finalExam\.passed \? "passed" : "review";/);
    assert.match(card, /const status = state === "open" \? p\.finalExamState\.notTaken : state === "passed" \? p\.finalExamState\.passed : p\.finalExamState\.needsReview;/);
    assert.match(card, /const parts = \[title, status\];/, "the accessible name says what the card shows");
    assert.match(card, /review: "border-\[var\(--lp-review-edge\)\]/);
    assert.match(card, /passed: "border-\[color-mix\(in_oklab,var\(--lp-gold-edge-strong\)_60%,var\(--lp-mastery\)\)\][^"]*var\(--lp-mastery-halo\)/, "passed: gold with an emerald atmosphere, not a green card");
    assert.match(card, /min-h-\[60px\]/, "compact, still taller than a 44px chapter card");
    assert.match(card, /flex min-h-\[22px\] flex-wrap items-center/, "the status row keeps its height: no jump when a score appears");
    // Restrained gold in both themes; no animation.
    const css = readFileSync(join(HERE, "..", "..", "globals.css"), "utf8");
    for (const token of ["--lp-gold:", "--lp-gold-edge:", "--lp-gold-surface:", "--lp-gold-halo:"]) {
        assert.equal(css.split(token).length - 1, 2, `${token} in Dark and Light`);
    }
    const surfaces = [...css.matchAll(/--lp-gold-surface: rgb\([\d ]+\/ ([\d.]+)\)/g)].map((m) => Number(m[1]));
    assert.ok(surfaces.every((a) => a <= 0.1), "a restrained tint, not a gold block");
    assert.doesNotMatch(card, /animate-|@keyframes/);
});

test("inactive access keeps history: cards stay populated, only the lock is added", () => {
    const list = wiring.slice(wiring.indexOf("export function SidebarChapterList"));
    assert.match(list, /const \{ course, milestones \} = learner \?\? GUEST;/, "a signed-in learner's history is always shown");
    assert.match(list, /const locked = !hasCourseAccess\(access\.status\);/);
    assert.match(wiring, /accessActive=\{hasCourseAccess\(access\.status\)\}/, "the Pulse shows the access notice instead of Continue");
});

test("mobile drawer: no second data source; opening reveals the current card in the drawer's own list", () => {
    assert.match(sidebar, /revealCurrentCard\(drawerRef\.current\?\.querySelector<HTMLElement>\('\[data-chapter-scroller\]'\)\);/);
    assert.doesNotMatch(sidebar, /scrollIntoView/, "only the chapter list scrolls, never the page or the sidebar");
    // Both the desktop aside and the drawer render sidebarContent; both read the same module store
    // (learnerStore: a second reader and a remount make no requests, tested in learnerStore.test.ts).
    assert.equal([...sidebar.matchAll(/\{sidebarContent\}/g)].length, 2);
    assert.doesNotMatch(wiring, /useEffect/, "the wiring keeps no per-instance learning state");
    assert.equal([...wiring.matchAll(/useState/g)].length, 3, "only the Pulse layout choice and its crossing marker (import + two calls)");
});

test("Pulse states: expanded at the top of a tall screen, compact after scrolling or on short screens; an explicit choice holds until a threshold is crossed", () => {
    assert.match(wiring, /const TALL = "\(min-width: 768px\) and \(min-height: 800px\)";/);
    assert.match(wiring, /useSyncExternalStore\(subscribeTall, \(\) => window\.matchMedia\(TALL\)\.matches, \(\) => null\)/, "server snapshot = auto = CSS default, no flash");
    assert.match(wiring, /const layout: PulseLayout = choice \?\? \(listScrolled \? "compact" : tall === null \? "auto" : tall \? "expanded" : "compact"\);/);
    assert.match(wiring, /if \(seenScrolled !== listScrolled\) \{\s*setSeenScrolled\(listScrolled\);\s*setChoice\(null\);/, "a threshold crossing ends the explicit choice");
    const css = readFileSync(join(HERE, "..", "..", "globals.css"), "utf8");
    assert.match(css, /@media not \(\(min-width: 768px\) and \(min-height: 800px\)\) \{\s*\.lp-panel\[data-layout="auto"\] \{ --lp-c: 1;/, "same threshold as the CSS default");
    assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.lp-panel\[data-morph\][^{]*\{ transition: none; \}/, "reduced motion: no morph");
    // Hysteresis: compact after a meaningful scroll, expanded again only near the top; state changes only on a crossing.
    assert.match(sidebar, /const PULSE_COMPACT_AT = 96;\s*const PULSE_EXPAND_AT = 16;/);
    assert.match(sidebar, /const scrolled = listScrolledRef\.current \? top > PULSE_EXPAND_AT : top > PULSE_COMPACT_AT;\s*if \(scrolled === listScrolledRef\.current\) return;/);
});

test("sync notice lives in the Pulse panel and only appears for exceptional states", () => {
    assert.match(wiring, /syncNotice=\{hasSyncNotice\(learner\.sync\) \? <SyncNotice sync=\{learner\.sync\} compact \/> : undefined\}/);
    const dashboard = source("MasteryDashboard.tsx");
    assert.match(dashboard, /export const hasSyncNotice = \(s: SyncState \| null\) => !!s && \(s\.offline \|\| s\.pending\.length > 0 \|\| s\.rejected\.length > 0\);/);
    assert.match(dashboard, /onClick=\{\(\) => retryRejected\(sync\.userId, p\.attemptId\)\}/);
    assert.match(dashboard, /onClick=\{\(\) => removeRejected\(sync\.userId, p\.attemptId\)\}/);
});

test("contextual help lives in the bottom toolbar (not the account panel), keeping its origin and permission", () => {
    const body = account.slice(account.indexOf("export function AccountPanel"));
    assert.doesNotMatch(body, /help\.href|LifeBuoy/, "no help action inside the account panel");
    const button = account.slice(account.indexOf("export function SidebarHelpButton"), account.indexOf("export function AccountPanel"));
    assert.match(button, /if \(!canUseSupport\(access\.status\)\) return null;/);
    assert.match(button, /supportAction\(pathname, carriedFrom, courses\["behind-the-scenes-ai"\]\.chapters, hasCourseAccess\(access\.status\)\)/, "chapter and origin context kept");
    assert.match(button, /aria-label=\{label\}/);
    assert.match(button, /<span aria-hidden="true" className="text-\[22px\] font-black leading-none">\?<\/span>/, "a clean question mark, no inner ring");
    const footer = sidebar.slice(sidebar.indexOf("{/* Footer */}"));
    assert.match(footer, /<SidebarHelpButton \/>/);
    assert.match(footer, /\{t\.chrome\.creatorLabel\}<bdi className="font-semibold[^"]*">\{t\.chrome\.authorName\}<\/bdi>/, "creator credit: label plus emphasized name");
});

// ── Current-chapter reveal in the chapter list (any navigation source) ──

test("reveal: an already comfortably visible current card does not move the list", () => {
    const view = { scrollTop: 300, height: 480, scrollHeight: 1500 };
    assert.equal(revealScrollTop(view, { top: 400, height: 60 }), null);
    assert.equal(revealScrollTop(view, { top: 312, height: 60 }), null, "the 12px comfort margin counts as visible");
});

test("reveal: a card outside (or cut at the edge of) the viewport is centred, within the natural scroll bounds", () => {
    const view = { scrollTop: 0, height: 480, scrollHeight: 1500 };
    assert.equal(revealScrollTop(view, { top: 900, height: 60 }), 690, "below: centred (900 + 30 - 240)");
    assert.equal(revealScrollTop({ ...view, scrollTop: 800 }, { top: 200, height: 60 }), 0, "above, near the start: the top bound wins");
    assert.equal(revealScrollTop(view, { top: 1440, height: 60 }), 1020, "near the end: the bottom bound wins, no blank space");
    assert.equal(revealScrollTop(view, { top: 450, height: 60 }), 240, "partly hidden at the bottom edge");
    assert.equal(revealScrollTop({ ...view, scrollTop: 690 }, { top: 900, height: 60 }), null, "after revealing, the same card is visible: no second move");
});

test("reveal: once per route change from the sidebar (not from a Pulse click), after the scroll restore, never focus", () => {
    const restoreAt = sidebar.indexOf("sessionStorage.getItem('sidebar-scroll-pos')");
    assert.ok(restoreAt > 0 && sidebar.indexOf("if (revealedPath.current === pathname) return;") > restoreAt, "runs after the restore, before paint");
    assert.match(sidebar, /\/\/ אחרי כל שחזור[^\n]*\s*revealedPath\.current = null;/, "every restore re-arms the reveal (also when dev runs effects twice)");
    assert.match(sidebar, /if \(revealedPath\.current === pathname\) return;\s*revealedPath\.current = pathname;/, "once per route: a manual scroll afterwards is never fought");
    // Layout above the list settles after mount: re-check on list resize only until the first user interaction.
    assert.match(sidebar, /const events = \['pointerdown', 'wheel', 'touchstart', 'keydown'\] as const;/);
    assert.match(sidebar, /ro\.observe\(scroller\);\s*scroller\.addEventListener\('scroll', onScroll, \{ passive: true \}\);\s*events\.forEach\(\(type\) => root\.addEventListener\(type, stop, \{ passive: true \}\)\);/);
    assert.match(sidebar, /if \(Math\.abs\(scroller\.scrollTop - expected\) > 1\) stop\(\);/, "any list scroll that is not its own ends the watch");
    const fn = sidebar.slice(sidebar.indexOf("function revealCurrentCard"), sidebar.indexOf("export function CourseSidebar"));
    assert.match(fn, /'\[data-chapter-list\] \[aria-current="page"\]'/, "the current card, identified by the route (aria-current)");
    assert.match(fn, /scroller\.scrollTop = top;/, "scrolls the list element only");
    assert.doesNotMatch(fn, /focus\(|scrollIntoView|smooth|setTimeout|IntersectionObserver/, "no focus move, no page scroll, no animation, no timers or observers");
    const pulse = source("LearningPulse.tsx");
    assert.doesNotMatch(pulse, /scrollTop|scrollIntoView|data-chapter-list/, "the Pulse only navigates; the sidebar reveals");
});
