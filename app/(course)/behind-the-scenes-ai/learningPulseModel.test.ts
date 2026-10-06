// Learning Pulse view model and component contract: 19 petals by chapter identity, independent
// progress and mastery, one accessible summary, cards that carry the score only in their name, and
// copy that works in all six locales. No pixel snapshots.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { register } from "node:module";
import type { ChromeDict } from "../../../i18n/dictionary";

// Source files import each other without an extension (bundler resolution); add ".ts" for node.
register("data:text/javascript," + encodeURIComponent(`
export async function resolve(specifier, context, next) {
    try { return await next(specifier, context); }
    catch (error) {
        if (specifier.startsWith(".") && !/\\.[a-z]+$/i.test(specifier)) return next(specifier + ".ts", context);
        throw error;
    }
}`));

const { LEARNING_UNITS, continueTarget, courseLearning, mergeAttempt } = await import("./learningProgress.ts");
const model = await import("./learningPulseModel.ts");
const { PETAL, fillPath } = await import("./learningPulseGeometry.ts");
type QuizRecord = import("./learningProgress.ts").QuizRecord;
type ReachedUnit = import("./learningProgress.ts").ReachedUnit;

const HERE = dirname(fileURLToPath(import.meta.url));
const source = (file: string) => readFileSync(join(HERE, file), "utf8");
const LOCALES = ["he", "en", "es", "ru", "ar", "ja"] as const;
const copies: Record<string, ChromeDict["pulse"]> = {};
for (const l of LOCALES) copies[l] = (await import(`../../../i18n/locales/${l}/chrome.ts`)).chrome.pulse;
const en = copies.en;
const label = (n: number) => `Chapter ${n}`;

const rec = (chapterId: number | null, scores: number[]): QuizRecord =>
    scores.reduce<QuizRecord | undefined>((prev, s, i) => mergeAttempt(prev, {
        quizId: chapterId === null ? "behind-ai-final" : `behind-ai-chapter-${chapterId}`, chapterId, scorePercent: s,
        correctCount: s / 10, totalQuestions: 10, passed: s >= (chapterId === null ? 75 : 70), weakConcepts: [], strongConcepts: [],
    }, i + 1), undefined)!;
const units = (chapterId: number, count: number): ReachedUnit[] =>
    LEARNING_UNITS[chapterId].slice(0, count).map((unitId, i) => ({ chapterId, unitId, reachedAt: i + 1 }));
const full = (chapterId: number) => units(chapterId, LEARNING_UNITS[chapterId].length);

// 90% no mastery (8), 25% mastery (14), 100% no mastery (3), 100% mastery (1).
const course = courseLearning([...units(8, 9), ...units(14, 2), ...full(3), ...full(1)], [rec(14, [88]), rec(3, [62]), rec(1, [86]), rec(null, [90])]);

test("exactly 19 petal models, by chapter identity; the final exam is never a petal", () => {
    const petals = model.petalModels(course, 7, null);
    assert.equal(petals.length, 19);
    assert.deepEqual(petals.map((p) => p.chapterId), Array.from({ length: 19 }, (_, i) => i + 1));
    assert.equal(petals[0].transform, "rotate(0)", "chapter 1 at 12 o'clock");
});

test("petal geometry is the same in every locale (the model takes no locale or direction)", () => {
    assert.equal(model.petalModels.length, 3);
    const pulse = source("LearningPulse.tsx");
    const graphic = pulse.slice(pulse.indexOf("export function PulseGraphic"), pulse.indexOf("export function MasteryNode"));
    // The only direction in the SVG is a fixed direction="ltr" on the numbers (physical anchoring on every page).
    assert.doesNotMatch(graphic.replaceAll('direction="ltr"', ""), /\b(?:dir|rtl|ltr|locale)\b/, "the SVG never reads the direction");
});

test("progress and mastery are independent per petal (90/no, 25/yes, 100/no, 100/yes)", () => {
    const p = model.petalModels(course, null, null);
    const pick = (n: number) => [p[n - 1].fill > 0, p[n - 1].complete, p[n - 1].mastered];
    const end = model.fillExtent(1);
    const share = (n: number) => (p[n - 1].fill - model.FILL_START) / (end - model.FILL_START);
    assert.deepEqual(pick(8), [true, false, false]);
    assert.deepEqual(pick(14), [true, false, true]);
    assert.deepEqual(pick(3), [true, true, false]);
    assert.deepEqual(pick(1), [true, true, true]);
    assert.ok(share(8) > 0.85 && share(8) < 1, "90% is near, not at, the end");
    assert.ok(share(14) > 0 && share(14) < 0.35, "25% is short");
    assert.ok(p[7].fillPath.startsWith("M") && p[4].fillPath === "" && p[4].corePath === "", "untouched: no material, no core");
    assert.deepEqual(pick(5), [false, false, false], "untouched");
});

test("progress boundaries: 0 draws nothing, any start is visible, 1 reaches the end before the node", () => {
    assert.equal(model.fillExtent(0), 0);
    assert.equal(model.fillExtent(Number.NaN), 0);
    assert.ok(model.fillExtent(0.01) >= model.FILL_START + model.FILL_MIN_VISIBLE, "a just-started chapter shows visible material");
    assert.equal(model.fillExtent(2), model.fillExtent(1));
    const nodeInner = PETAL.outerRadius - PETAL.nodeRadius;
    assert.ok(model.fillExtent(1) < nodeInner, "the full material never touches the mastery node");
    // The material is a capsule inside the glass: its rounded front never passes the requested front.
    const front = model.fillExtent(1);
    const ys = [...fillPath(front, model.FILL_INSET).matchAll(/-?\d+(?:\.\d+)?/g)].map(Number).filter((n) => n < 0);
    assert.ok(Math.min(...ys) > -front - 0.5, "the material stays within its front");
});

test("current and focused are separate; focusing the current chapter is just current", () => {
    const a = model.petalModels(course, 7, 14);
    assert.deepEqual([a[6].current, a[6].focused, a[13].current, a[13].focused], [true, false, false, true]);
    const b = model.petalModels(course, 7, 7);
    assert.deepEqual([b[6].current, b[6].focused], [true, false]);
    assert.equal(b.filter((p) => p.current || p.focused).length, 1);
});

test("one useful Pulse summary: mastered chapters and the current chapter, no units or percentages", () => {
    const s = model.pulseSummary("Learning Pulse", course, en, { id: 7, title: "Context Window" }, "13%");
    assert.equal(s, "Learning Pulse. Learning progress 13%. 2 of 19 quizzes passed. Current chapter: 7, Context Window.");
    assert.equal(model.pulseSummary("Learning Pulse", course, en, null, "13%"), "Learning Pulse. Learning progress 13%. 2 of 19 quizzes passed.");
    assert.equal(model.coursePercent(course), 13, "20 of 150 registered units, floored");
    const pulse = source("LearningPulse.tsx");
    assert.equal(pulse.match(/role="img"/g)?.length, 1, "one semantic image");
    assert.match(pulse, /<svg viewBox=\{PULSE_VIEWBOX\} focusable="false"[^>]*>\s*<g role="img" aria-label=\{label\}>/, "the drawing is one image named by the summary");
    assert.doesNotMatch(pulse, /tabIndex/, "no extra tab stops: only the course-map links are focusable");
    assert.doesNotMatch(pulse, /FocusStrip|LearningTrail/, "no focus strip and no continuous trail remain");
});

test("card accessible name: chapter, title, band, mastery, latest score or not attempted, current, locked", () => {
    const c = course.chapters;
    assert.equal(model.chapterCardName(c[13], en, "Chapter 14", "Learning from Mistakes"),
        "Chapter 14, Learning from Mistakes. Started. Mastery achieved. Latest score 88.".replace("Started", en.bands.started));
    assert.match(model.chapterCardName(c[4], en, "Chapter 5", "Semantic Space"), /Quiz not attempted\.$/);
    assert.match(model.chapterCardName(c[6], en, "Chapter 7", "T", { current: true }), /Current chapter\.$/);
    assert.match(model.chapterCardName(c[0], en, "Chapter 1", "T", { lockedLabel: "Locked" }), /Mastery achieved\. Latest score 86\. Locked\.$/);
    for (const ch of c) assert.doesNotMatch(model.chapterCardName(ch, en, label(ch.chapterId), "T"), /\d+\s*\/\s*\d+|units?\b|150|%/);
});

test("cards show the latest score only when attempted (no placeholder), and never expose unit data", () => {
    const card = source("ChapterNavCard.tsx");
    const markup = card.slice(card.indexOf("export function ChapterNavCard"), card.indexOf("export function IntroNavRow"));
    // Attempted: the latest score, as a bare number. Never attempted: nothing at all (no 0, dash or reserved slot).
    assert.match(markup, /\{chapter\.latestScore !== null && <ScoreWell score=\{chapter\.latestScore\} latestPassed=\{chapter\.latestPassed\} \/>\}/);
    assert.equal([...markup.matchAll(/latestScore/g)].length, 2, "rendered in exactly one place");
    assert.doesNotMatch(card, /bestScore|scoreText|%<|\{"-"\}|"\u2013"|notAttempted/, "no best score, percent, dash or placeholder");
    // 85 then 50: the card model shows 50 and mastery stays achieved.
    const retake = courseLearning([], [rec(5, [85, 50])]).chapters[4];
    assert.deepEqual([retake.latestScore, retake.masteryEarned], [50, true]);
    assert.equal(courseLearning([], []).chapters[4].latestScore, null, "never attempted: no score");
    assert.match(card, /aria-label=\{name\}/);
    assert.match(card, /aria-current=\{current \? "page" : undefined\}/);
    for (const file of ["LearningPulse.tsx", "ChapterNavCard.tsx", "learningPulseModel.ts"]) {
        assert.doesNotMatch(source(file), /LEARNING_UNITS|unitCount|reachedUnit|learningProgressPercent/, file);
    }
});

test("continue: every target has a label; a passed final exam and inactive access hide it", () => {
    const a = (t: ReturnType<typeof continueTarget>, current: number | null = null) => model.continueAction(t, current, en, label);
    assert.deepEqual(a({ kind: "start", chapterId: 1 }), { target: { kind: "start", chapterId: 1 }, label: "Start Chapter 1", href: "/behind-the-scenes-ai/chapter-1" });
    assert.equal(a({ kind: "continue", chapterId: 8, unitId: "lab" })!.label, "Continue Chapter 8");
    assert.equal(a({ kind: "continue", chapterId: 8, unitId: "lab" }, 8)!.label, "Continue where you left off");
    assert.equal(a({ kind: "quiz", chapterId: 13 })!.label, "Take the Chapter 13 quiz");
    assert.deepEqual(a({ kind: "final-exam" }), { target: { kind: "final-exam" }, label: "Go to the final exam", href: "/behind-the-scenes-ai/final-exam" });
    assert.equal(a(null), null);
    const allDone = courseLearning([], [...Array.from({ length: 19 }, (_, i) => rec(i + 1, [90])), rec(null, [80])]);
    assert.equal(a(continueTarget(allDone, true)), null, "final exam passed: no Continue");
    assert.equal(a(continueTarget(course, false)), null, "inactive access: no Continue");
    assert.match(source("LearningPulse.tsx"), /\{!props\.accessActive && <AccessNotice \/>\}/, "inactive access shows the access notice in the panel");
    assert.match(source("LearningSidebar.tsx"), /if \(!learner \|\| !hasCourseAccess\(access\.status\)\) return null;\s*return <ContinueLink /, "and no Continue");
});

test("inactive access never changes the learning visuals", () => {
    const pulse = source("LearningPulse.tsx");
    const graphic = pulse.slice(pulse.indexOf("export function PulseGraphic"), pulse.indexOf("export function MasteryNode"));
    assert.doesNotMatch(graphic, /access|locked/i, "the Pulse has no access input");
    const card = source("ChapterNavCard.tsx");
    const lines = card.split("\n").filter((line) => /\blocked\b/.test(line) && !line.trim().startsWith("//") && !line.trim().startsWith("/**"));
    assert.ok(lines.length >= 4);
    for (const line of lines) {
        assert.match(line, /locked: boolean|\{ (?:chapter|finalExam), (?:milestones, )?current, locked|lockedLabel|lockedHint|<Lock |^\s*\{locked\s*$/, `only lock-specific use: ${line.trim()}`);
    }
    assert.doesNotMatch(card, /locked \?[^:]*(?:opacity|grayscale|text-\[var\(--bts-text-faint\)\][^"]*title)/, "earned state is never dimmed when locked");
});

test("compact state: the same two course values as the expanded statistics, beside the same real Pulse", () => {
    const pulse = source("LearningPulse.tsx");
    const panel = pulse.slice(pulse.indexOf("export function LearningPulsePanel"), pulse.indexOf("export const ScoreWell"));
    assert.equal([...panel.matchAll(/<PulseGraphic\s/g)].length, 1, "one Pulse for both states, never a second or mini variant");
    assert.doesNotMatch(pulse, /\bmini\b/);
    assert.match(panel, /lp-compact lp-inline[^>]*>\s*<span [^>]*>\{percent\}<\/span>\s*<span className=\{`[^`]*\$\{progressDot\}`\} \/>/, "compact: progress with its cyan dot on the title row");
    assert.match(panel, /lp-compact mt-1[^>]*>\s*<span [^>]*>\{mastered\}<\/span>\s*<span [^>]*>\{p\.chapters\}<\/span>/, "compact: the short quizzes-passed count");
    assert.match(panel, /<Stat dot=\{progressDot\} value=\{percent\} label=\{p\.learningProgress\} \/>\s*<Stat dot=\{masteryDot\} value=\{mastered\} label=\{p\.mastered\} \/>/);
    for (const l of LOCALES) assert.doesNotMatch(copies[l].masteredSummary(6, 19), /%/);
});

test("reduced motion: every transition has a motion-reduce counterpart; no continuous animation", () => {
    for (const file of ["LearningPulse.tsx", "ChapterNavCard.tsx"]) {
        const src = source(file);
        const transitions = [...src.matchAll(/\btransition(?:-\[[^\]]+\]|-colors|-transform)?\b/g)].length;
        const reduced = [...src.matchAll(/motion-reduce:transition-none/g)].length;
        assert.ok(transitions > 0 && reduced > 0, file);
        assert.doesNotMatch(src, /animate-|@keyframes|repeatCount/, `${file}: no continuous animation`);
    }
    // The shared easing constant carries the reduced-motion override for every SVG transition.
    assert.match(source("LearningPulse.tsx"), /const EASE = "[^"]*motion-reduce:transition-none"/);
});

test("six locales: card names, summaries and continue labels render without units, 150 or empty text", () => {
    for (const l of LOCALES) {
        const p = copies[l];
        const strings = [
            model.pulseSummary(p.brand, course, p, { id: 7, title: "T" }, "13%"),
            ...course.chapters.map((c) => model.chapterCardName(c, p, `#${c.chapterId}`, "T", { current: c.chapterId === 7 })),
            ...(["start", "quiz"] as const).map((k) => model.continueAction({ kind: k, chapterId: 3 }, null, p, (n) => `#${n}`)!.label),
            model.continueAction({ kind: "continue", chapterId: 3, unitId: null }, null, p, (n) => `#${n}`)!.label,
            model.continueAction({ kind: "final-exam" }, null, p, (n) => `#${n}`)!.label,
        ];
        for (const s of strings) {
            assert.ok(s.trim().length > 0, l);
            assert.doesNotMatch(s, /150|undefined|NaN/, `${l}: ${s}`);
        }
        assert.match(model.chapterCardName(course.chapters[13], p, "#14", "T"), /88/, `${l}: latest score in the name`);
    }
});

test("card milestone trail: booleans only, no ids, names or counts; visual only; no tab stops", () => {
    const card = source("ChapterNavCard.tsx");
    assert.match(card, /milestones: readonly boolean\[\];/, "the card receives only reached/unreached states");
    assert.doesNotMatch(card, /unitId|unitIds|LEARNING_UNITS|\.length\s*\}|150/, "no unit ids, registry or rendered counts");
    const trail = card.slice(card.indexOf("export function MilestoneTrail"));
    assert.match(trail, /<span aria-hidden="true" className="relative block h-\[9px\]/, "the whole trail is hidden from assistive tech");
    assert.doesNotMatch(trail, /tabIndex|<button|role=|aria-label|title=/, "no tab stops, no per-dot announcements");
    assert.doesNotMatch(trail, />\s*\{(?:i|n|milestones\.length)\}\s*</, "no rendered numbers (keys are not rendered)");
    assert.match(trail, /reached && milestones\[i \+ 1\]/, "a connecting segment only between two reached neighbours");
    assert.doesNotMatch(trail, /mastery/i, "milestones never use the mastery colour");
    // The card's name stays qualitative: it never enumerates units.
    assert.doesNotMatch(card.slice(card.indexOf("const name ="), card.indexOf("return (", card.indexOf("const name ="))), /milestones/);
    // The pulse itself is unchanged: 19 petals, no milestone dots.
    assert.doesNotMatch(source("LearningPulse.tsx"), /milestone/i);
});

test("course percent: floored so 100 only when every registered unit is reached; never the unit total", () => {
    const allUnits = Array.from({ length: 19 }, (_, i) => full(i + 1)).flat();
    assert.equal(model.coursePercent(courseLearning(allUnits, [])), 100);
    assert.equal(model.coursePercent(courseLearning(allUnits.slice(1), [])), 99, "one unit missing is not 100");
    assert.equal(model.coursePercent(courseLearning([], [])), 0);
    const pulse = source("LearningPulse.tsx");
    assert.doesNotMatch(pulse, /totalUnits|unitCount|150|LEARNING_UNITS/, "the unit total is never rendered");
    const panel = pulse.slice(pulse.indexOf("export function LearningPulsePanel"), pulse.indexOf("export const ScoreWell"));
    assert.match(panel, /<Stat [^>]*value=\{percent\} label=\{p\.learningProgress\} \/>/, "expanded shows learning progress");
    assert.match(panel, /const masteryDot = "bg-\[var\(--lp-mastery\)\]/, "mastery is a separate emerald statistic");
    assert.match(panel, /const mastered = `\$\{course\.masteredCount\} \/ \$\{course\.chapters\.length\}`;/);
    assert.doesNotMatch(pulse.slice(pulse.indexOf("export function PulseGraphic"), pulse.indexOf("export function MasteryNode")), /percent/, "the centre stays 19 chapters");
});

test("chapter card: no navigation chevron; the lock still shows when access is inactive", () => {
    const card = source("ChapterNavCard.tsx");
    assert.doesNotMatch(card, /Chevron/);
    assert.match(card, /\{locked && <Lock aria-hidden="true"/);
    assert.match(card, /focus-visible:outline-2/, "the whole card keeps its visible focus");
});

test("decorative orbit: exactly one faint ring behind the petals, outside the accessibility tree", () => {
    const pulse = source("LearningPulse.tsx");
    const graphic = pulse.slice(pulse.indexOf("export function PulseGraphic"), pulse.indexOf("export function MasteryNode"));
    assert.equal(graphic.match(/className="lp-orbit /g)?.length, 1, "one orbit");
    assert.match(graphic, /<circle r=\{PETAL\.outerRadius\} fill="none"[^>]*lp-orbit[^>]*forced-colors:hidden/, "through the node radius; hidden in forced colors");
    const orbitAt = graphic.indexOf("lp-orbit");
    const petalGroupAt = graphic.indexOf("[filter:var(--lp-ring-filter)]");
    assert.ok(orbitAt > 0 && petalGroupAt > 0 && orbitAt < petalGroupAt, "drawn before (behind) the petal group");
    const drawing = graphic.slice(graphic.indexOf('<g role="img"'), graphic.indexOf('<g className="lp-map">'));
    assert.ok(drawing.includes("lp-orbit"), "inside the single image (its internals are not exposed)");
    assert.doesNotMatch(graphic.slice(graphic.indexOf("lp-orbit") - 200, graphic.indexOf("lp-orbit") + 200), /mastered|fill\b.*ratio|learningProgress/, "the orbit carries no data");
});

test("card hover and keyboard focus preview the matching petal (no separate text box)", () => {
    const card = source("ChapterNavCard.tsx");
    assert.match(card, /onMouseEnter=\{\(\) => onPreview\?\.\(chapter\.chapterId\)\}/);
    assert.match(card, /onFocus=\{\(\) => onPreview\?\.\(chapter\.chapterId\)\}/);
    assert.match(card, /onBlur=\{\(\) => onPreview\?\.\(null\)\}/);
    assert.match(source("LearningPulse.tsx"), /<PulseGraphic\s+course=\{course\} currentId=\{currentChapterId\} focusedId=\{previewChapterId\}/);
    const petals = model.petalModels(course, 7, 14);
    assert.deepEqual(petals.filter((p) => p.focused).map((p) => p.chapterId), [14]);
});

test("the 6 / 19 statistic is sticky mastery (quizzes passed), never attempts", () => {
    // Attempted but failed chapters do not count; a passed-then-failed chapter still counts.
    const c = courseLearning([], [rec(2, [40]), rec(3, [55]), rec(5, [85, 50])]);
    assert.equal(c.masteredCount, 1);
    const pulse = source("LearningPulse.tsx");
    assert.match(pulse, /const mastered = `\$\{course\.masteredCount\} \/ \$\{course\.chapters\.length\}`;/);
    assert.match(pulse, /value=\{mastered\} label=\{p\.mastered\}/);
    const stats = pulse.slice(pulse.indexOf("{/* שני נתוני הקורס"), pulse.indexOf("<FinalExamCard "));
    assert.doesNotMatch(stats, /attempted/, "the 6 / 19 statistic never reads attempts");
});

test("navigation titles: the audited short title for Chapters 1-19 in all six locales; full titles unchanged", async () => {
    const { courses } = await import("../../../lib/courseData.ts");
    const chapters = courses["behind-the-scenes-ai"].chapters.filter((c: { id: number }) => c.id >= 1 && c.id <= 19);
    assert.equal(chapters.length, 19);
    const CONCEPT: Record<number, string> = {
        2: "Model Input", 3: "Tokenization", 4: "Embeddings", 5: "Semantic Space", 6: "Attention", 7: "Context Window",
        8: "Logits & Softmax", 9: "Decoding", 10: "Generation Loop", 11: "Hallucinations", 12: "RAG & Grounding",
        13: "Self-Check", 14: "Learning from Mistakes", 15: "Evaluation & Generalization", 16: "Does AI Learn From Me",
        17: "Chat to Agent", 18: "Guardrails", 19: "Full Trace",
    };
    const CHAPTER_1: Record<string, string> = {
        he: "הצ'אט השקוף", en: "The Transparent Chat", es: "El chat transparente", ru: "Прозрачный чат", ar: "المحادثة الشفافة", ja: "透明なチャット",
    };
    for (const c of chapters) {
        for (const l of LOCALES) {
            const full: string = c.title[l];
            const nav = model.navTitle(full);
            const expected = c.id === 1 ? CHAPTER_1[l] : c.id === 16 && l === "en" ? "Does AI Learn From Me?" : CONCEPT[c.id];
            assert.equal(nav, expected, `chapter ${c.id} ${l}`);
            assert.doesNotMatch(nav, /[:：]/, `chapter ${c.id} ${l}: no colon left`);
            assert.ok(full.startsWith(nav) && nav.length > 0, `chapter ${c.id} ${l}: a prefix of the full title`);
        }
    }
    // The card shows the short title; the accessible name and the page keep the full one.
    const card = source("ChapterNavCard.tsx");
    assert.match(card, /\{navTitle\(title\)\}/);
    assert.match(card, /chapterCardName\(chapter, t\.chrome\.pulse, label, title,/);
});

test("mastery node: a small emerald mark inside a broad, soft, edgeless halo; not-mastered stays quiet", () => {
    const pulse = source("LearningPulse.tsx");
    const node = pulse.slice(pulse.indexOf("export function MasteryNode"), pulse.indexOf("export interface LearningPulsePanelProps"));
    assert.match(node, /className=\{`grid size-4 shrink-0 place-items-center rounded-full /, "same 16px footprint (layout unchanged)");
    assert.match(node, /className=\{`size-2\.5 rounded-full /, "the visible mark is smaller (10px)");
    const [halo, mark] = [node.slice(node.indexOf("? \"bg-["), node.indexOf(": \"\"")), node.slice(node.indexOf("size-2.5"))];
    assert.ok(node.indexOf("size-2.5") > 0, "the mark element exists");
    assert.match(halo, /bg-\[radial-gradient\(circle,var\(--lp-node-vivid-halo\)_0%,transparent_75%\)\] shadow-\[0_0_16px_6px_var\(--lp-node-vivid-halo\)\]/, "broad halo that fades out, in the ring\'s own hue");
    assert.doesNotMatch(halo, /border/, "no hard outer border around the halo");
    assert.match(mark, /\? "border-2 border-\[var\(--lp-node-vivid\)\] bg-\[var\(--lp-node-body\)\]/, "vivid emerald ring around a dark body (same size)");
    assert.match(mark, /: "border-\[1\.5px\] border-\[var\(--lp-node-empty\)\] forced-colors:border-\[GrayText\]"/, "quiet neutral ring when not mastered");
    assert.match(mark, /forced-colors:!bg-\[CanvasText\] forced-colors:\[forced-color-adjust:none\]/, "forced colors: filled mark vs hollow ring");
    const notMastered = mark.slice(mark.indexOf(': "border-[1.5px]'));
    assert.doesNotMatch(notMastered.split('"}`}')[0], /lp-mastery|shadow|bg-/, "no emerald, halo or filled core when not mastered");
    const css = readFileSync(join(HERE, "..", "..", "globals.css"), "utf8");
    const halo2 = [...css.matchAll(/--lp-node-vivid-halo: rgb\([\d ]+\/ ([\d.]+)\)/g)].map((m) => Number(m[1]));
    assert.equal(halo2.length, 2, "tuned per theme");
    assert.ok(halo2.every((a) => a >= 0.3 && a <= 0.55), "clearly perceptible but soft");
    assert.equal(css.split("--lp-node-vivid:").length - 1, 2, "a vivid ring colour per theme");
});

test("latest score: a bare number in a recessed circular well (not a badge); nothing when never attempted", () => {
    const card = source("ChapterNavCard.tsx");
    const markup = card.slice(card.indexOf("export function ChapterNavCard"), card.indexOf("export function IntroNavRow"));
    // The well itself is one shared component (chapter cards and the final-exam card), rendered only behind an attempted score.
    const pulseSource = source("LearningPulse.tsx");
    const scoreBlock = pulseSource.slice(pulseSource.indexOf("export const ScoreWell"), pulseSource.indexOf("function FinalExamCard"));
    assert.match(markup, /\{chapter\.latestScore !== null && <ScoreWell score=\{chapter\.latestScore\} latestPassed=\{chapter\.latestPassed\} \/>\}/);
    assert.equal([...card.matchAll(/<ScoreWell /g)].length + [...pulseSource.matchAll(/<ScoreWell /g)].length, 1, "only behind an attempted chapter score");
    assert.match(scoreBlock, /grid size-\[30px\] shrink-0 place-items-center rounded-full bg-\[var\(--lp-score-well\)\]/, "compact circular well");
    assert.match(scoreBlock, /shadow-\[inset_0_1\.5px_3px_var\(--lp-score-well-shadow\),inset_0_-1px_0_var\(--lp-score-well-light\)\]/, "inset depth, recessed into the card");
    assert.match(scoreBlock, />\{score\}<\/span>/, "the number itself is the visible object");
    assert.doesNotMatch(scoreBlock, /\bborder\b|ring-|px-|<svg|Icon|onClick|tabIndex|<button/, "no border, pill, icon or interactivity");
    assert.match(scoreBlock, /forced-colors:bg-transparent forced-colors:shadow-none/);
    // Latest attempt (not mastery): a soft emerald or amber glow added to the same recessed well; none when never attempted.
    assert.match(scoreBlock, /: latestPassed\s*\? "shadow-\[[^"]*,0_0_12px_2px_var\(--lp-score-glow-pass\)\]"\s*: "shadow-\[[^"]*,0_0_12px_2px_var\(--lp-score-glow-fail\)\]"/);
    assert.doesNotMatch(scoreBlock, /strokeDasharray|dashed|dotted|border-/, "no outline around the score");
    assert.doesNotMatch(card, /--lp-score-well/);
    const css = readFileSync(join(HERE, "..", "..", "globals.css"), "utf8");
    assert.equal([...css.matchAll(/--lp-score-well: /g)].length, 2, "one value per theme, in globals.css only");
    assert.doesNotMatch(css, /--lp-score-aura/, "the old faint aura is gone");
});

test("continue has exactly one directional indicator: a circular arrow at the inline end", () => {
    const pulse = source("LearningPulse.tsx");
    const slot = pulse.slice(pulse.indexOf("export function ContinueLink"));
    assert.doesNotMatch(slot, /Chevron|<Play/, "no chevron and no play icon");
    assert.match(slot, /const Arrow = dir === "rtl" \? ArrowLeft : ArrowRight;/, "points left in RTL, right in LTR");
    assert.equal([...slot.matchAll(/<Arrow /g)].length, 1);
    // The arrow comes after the text, so it sits at the inline end (left in RTL, right in LTR).
    assert.ok(slot.indexOf("{action.label}") < slot.indexOf("<Arrow "));
    assert.match(slot, /<span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full[^"]*">\s*<Arrow /, "decorative, not a tab stop");
    assert.equal([...slot.matchAll(/<Link\b/g)].length, 1, "the whole surface is the single control");
});

test("the orbit is atmospheric: a thin quiet core with a soft halo, still visible and decorative", () => {
    const css = readFileSync(join(HERE, "..", "..", "globals.css"), "utf8");
    const alphas = [...css.matchAll(/--lp-orbit: rgb\([\d ]+\/ ([\d.]+)\)/g)].map((m) => Number(m[1]));
    assert.equal(alphas.length, 2, "dark and light");
    assert.ok(alphas.every((a) => a >= 0.2 && a < 0.42), "quieter core than 5F, still perceptible");
    const glows = [...css.matchAll(/--lp-orbit-glow: rgb\([\d ]+\/ ([\d.]+)\)/g)].map((m) => Number(m[1]));
    assert.equal(glows.length, 2, "a soft halo in both themes");
    assert.ok(glows[1] < glows[0], "light stays more restrained than dark");
    assert.match(source("LearningPulse.tsx"), /<circle r=\{PETAL\.outerRadius\} fill="none" strokeWidth="0\.6" className="lp-orbit stroke-\[var\(--lp-orbit\)\] \[filter:drop-shadow\(0_0_3\.5px_var\(--lp-orbit-glow\)\)\]/, "thin core, soft halo, no heavy blur");
});

test("forced colors: reached milestone dots and segments stay visible (system colour wins over the inline gradient)", () => {
    const trail = source("ChapterNavCard.tsx").slice(source("ChapterNavCard.tsx").indexOf("export function MilestoneTrail"));
    assert.equal([...trail.matchAll(/forced-colors:!bg-\[CanvasText\] forced-colors:\[forced-color-adjust:none\]/g)].length >= 1, true);
    assert.match(trail, /\? "forced-colors:!bg-\[CanvasText\] forced-colors:\[forced-color-adjust:none\]"/, "reached dots");
    assert.match(trail, /h-px -translate-y-1\/2 opacity-75 forced-colors:!bg-\[CanvasText\]/, "segments between reached dots");
});

test("card layout: identity (number + mastery) at inline-start, score at inline-end, title in the middle; one markup", () => {
    const card = source("ChapterNavCard.tsx");
    const markup = card.slice(card.indexOf("export function ChapterNavCard"), card.indexOf("export function IntroNavRow"));
    const identity = markup.indexOf('className="flex shrink-0 items-center gap-2.5"');
    const middle = markup.indexOf('className="min-w-0 flex-1"');
    const score = markup.indexOf("{chapter.latestScore !== null && <ScoreWell");
    assert.ok(identity > 0 && identity < middle && middle < score, "DOM order: identity, title/trail, score (logical start to end)");
    // LTR: number then node; RTL: node at the edge, then number. Only the order utilities differ.
    assert.match(markup, /className=\{`order-1 w-5 [^`]*rtl:order-2 /, "number first in LTR, second in RTL");
    assert.match(markup, /<span className="order-2 rtl:order-1"><MasteryNode mastered=\{chapter\.masteryEarned\} attempted=\{chapter\.attempted\} \/><\/span>/, "node second in LTR, at the edge in RTL");
    assert.equal([...card.matchAll(/<MasteryNode /g)].length, 1, "no duplicated RTL/LTR markup");
    assert.equal([...markup.matchAll(/<MilestoneTrail milestones=\{milestones\} \/>/g)].length, 1, "trail under the title in the flexible middle");
    assert.doesNotMatch(card, /Chevron/);
});

test("cards are refined rounded rectangles, not capsules; height unchanged", () => {
    const card = source("ChapterNavCard.tsx");
    assert.match(card, /group relative flex min-h-10 items-center gap-3 rounded-\[10px\] border/);
    assert.doesNotMatch(card, /rounded-(?:xl|2xl|full) border/, "no capsule radius on the card");
    assert.match(card, /absolute inset-y-\[5px\] start-0 w-\[3px\] rounded-e-full/, "current edge indicator spans almost the full card height");
});

// ── Expanded Pulse = interactive course map ──

test("course map: 19 chapter links in petal order (Chapter 1 at 12 o'clock, 19 last), never mirrored", () => {
    const petals = model.petalModels(course, 6, null);
    assert.deepEqual(petals.map((p) => p.chapterId), Array.from({ length: 19 }, (_, i) => i + 1));
    assert.equal(petals[0].transform, "rotate(0)", "Chapter 1 at 12 o'clock");
    assert.equal(petals[18].transform, `rotate(${+(18 * 360 / 19).toFixed(3)})`, "Chapter 19 is the last petal clockwise, just before Chapter 1");
    const graphic = source("LearningPulse.tsx").slice(source("LearningPulse.tsx").indexOf("export function PulseGraphic"), source("LearningPulse.tsx").indexOf("export function MasteryNode"));
    const map = graphic.slice(graphic.indexOf('<g className="lp-map">'));
    assert.equal([...map.matchAll(/<a\b/g)].length, 1, "one link element, rendered once per petal");
    assert.match(map, /\{petals\.map\(\(p\) => \(\s*<a\s+key=\{p\.chapterId\}\s+href=\{chapterHref\(p\.chapterId\)\}/, "petal N opens Chapter N with the normal chapter route");
    assert.match(map, /aria-label=\{map\.nameOf\(p\.chapterId\)\}/);
    assert.match(map, /<path d=\{HIT\} transform=\{p\.transform\} fill="transparent" \/>/, "invisible hit wedge on the same petal rotation");
    assert.doesNotMatch(graphic, /useT|dir=|locale/, "the map takes no direction or locale");
});

test("course map: only in Expanded; Compact has no petal links, numbers or tooltip", () => {
    const css = readFileSync(join(HERE, "..", "..", "globals.css"), "utf8");
    assert.match(css, /\.lp-panel\[data-layout="compact"\] \.lp-map \{ visibility: hidden; \}/, "hidden = not focusable, not clickable");
    assert.match(css, /@media not \(\(min-width: 768px\) and \(min-height: 800px\)\) \{\s*\.lp-panel\[data-layout="auto"\] \.lp-map \{ visibility: hidden; \}/);
    const pulse = source("LearningPulse.tsx");
    assert.match(pulse, /function PetalTip[\s\S]*?className="lp-map /, "the tooltip is part of the hidden map layer");
    assert.match(pulse, /if \(seenLayout !== layout\) \{\s*setSeenLayout\(layout\);\s*setActiveId\(null\);/, "a state change clears hover/focus");
});

test("course map markers: permanent 1 and current, temporary hover/focus, never duplicated", () => {
    const m = (current: number | null, active: number | null) => model.mapMarkers(current, active).map((x) => `${x.chapterId}${x.kind[0]}`);
    assert.deepEqual(m(null, null), ["1s"], "orientation only (not on a chapter page)");
    assert.deepEqual(m(6, null), ["1s", "6c"], "resting: 1 + current");
    assert.deepEqual(m(6, 8), ["1s", "6c", "8a"], "hover/focus adds a temporary number");
    assert.deepEqual(m(6, null), ["1s", "6c"], "and it goes away afterwards");
    assert.deepEqual(m(1, null), ["1c"], "current Chapter 1: one 1, with the current treatment");
    assert.deepEqual(m(1, 1), ["1c"]);
    assert.deepEqual(m(6, 1), ["1s", "6c"], "hovering 1 adds no duplicate");
    assert.deepEqual(m(6, 6), ["1s", "6c"], "hovering the current chapter adds no duplicate");
    assert.ok(model.mapMarkers(19, 19).length <= 3, "never all 19 numbers");
});

test("course map link names: chapter label and the navigation short title", async () => {
    const { formatChapterLabel } = await import("../../../i18n/format.ts");
    assert.equal(model.petalLinkName(formatChapterLabel("en", 6), "Attention: Who Matters Now"), "Chapter 6 - Attention");
    assert.equal(model.petalLinkName(formatChapterLabel("he", 6), "Attention: מי חשוב עכשיו"), `${formatChapterLabel("he", 6)} - Attention`);
});

test("course map interaction never changes learning state", () => {
    const a = model.petalModels(course, 6, null);
    const b = model.petalModels(course, 6, 8);
    const strip = (ps: typeof a) => ps.map((p) => ({ ...p, focused: false }));
    assert.deepEqual(strip(a), strip(b), "hover/focus only adds the preview emphasis");
    assert.deepEqual(b.filter((p) => p.focused).map((p) => p.chapterId), [8]);
});

test("course map numbers are placed by the shared outside-marker rule (no fixed radius, no centred text)", () => {
    const pulse = source("LearningPulse.tsx");
    assert.match(pulse, /const m = markerPlacement\(chapterId, MARK_SIZE\[kind\], String\(chapterId\)\);/);
    assert.match(pulse, /textAnchor=\{m\.anchor\} dominantBaseline=\{m\.baseline\} fontSize=\{MARK_SIZE\[kind\]\}/);
    assert.doesNotMatch(pulse, /MARK_R\b|MARK_R_CURRENT|TIP_R/);
    assert.match(pulse, /<g aria-hidden="true" direction="ltr" className="pointer-events-none">/, "physical anchoring on RTL pages too");
    assert.match(pulse, /const \{ box \} = markerPlacement\(chapterId, markSize, String\(chapterId\)\);/, "the tooltip starts beyond the number, never over it");
});

test("resume: Continue carries the stored resume point in the chapter URL, and only a valid one", () => {
    const href = (reached: ReachedUnit[], records: QuizRecord[] = []) => model.continueAction(continueTarget(courseLearning(reached, records), true), null, en, label)!.href;
    assert.equal(href([]), "/behind-the-scenes-ai/chapter-1", "no activity: chapter 1, top");
    assert.equal(href(units(5, 3)), "/behind-the-scenes-ai/chapter-5#resume=lab", "the latest reached unit itself, not the one after it");
    assert.equal(href(full(6)), "/behind-the-scenes-ai/chapter-6#resume=quiz", "all units reached, no mastery: the chapter quiz");
    const allMastered = Array.from({ length: 19 }, (_, i) => rec(i + 1, [90]));
    assert.equal(href([], [...allMastered, rec(null, [50])]), "/behind-the-scenes-ai/final-exam", "the final exam route, never a chapter");
    const a = (t: Parameters<typeof model.continueAction>[0], current: number | null) => model.continueAction(t, current, en, label)!.href;
    assert.equal(a({ kind: "continue", chapterId: 9, unitId: null }, null), "/behind-the-scenes-ai/chapter-9", "unknown point: chapter top");
    assert.equal(a({ kind: "continue", chapterId: 8, unitId: "gone" }, null), "/behind-the-scenes-ai/chapter-8", "unregistered unit: chapter top");
    assert.equal(a({ kind: "continue", chapterId: 8, unitId: "lab" }, 8), a({ kind: "continue", chapterId: 8, unitId: "lab" }, 3), "same URL from the same or another chapter");

    assert.equal(model.resumeSelector("#resume=lab", 5), '[data-learning-unit="lab"]');
    assert.equal(model.resumeSelector("#resume=quiz", 12), "[data-chapter-quiz]");
    for (const [hash, chapter] of [["#resume=embedding-table", 8], ["#resume=", 3], ["#resume=lab\"]", 3], ["#grounding-lab", 12], ["", 1]] as const) {
        assert.equal(model.resumeSelector(hash, chapter), null, `fails safe: ${hash}`);
    }
});

test("resume: every chapter has its registered units and exactly one quiz target, and the quiz follows the units", () => {
    for (let n = 1; n <= 19; n++) {
        const page = source(`chapter-${n}/ChapterView.tsx`);
        const quiz = [...page.matchAll(/<section data-chapter-quiz\b[^>]*>\s*<ExpandableLab title=\{localizedQuiz\.title\}>/g)];
        assert.equal(quiz.length, 1, `chapter ${n}: one quiz target, on the section around the quiz`);
        assert.equal(page.split("data-chapter-quiz").length, 2, `chapter ${n}: no second quiz target`);
        const lastUnit = LEARNING_UNITS[n].at(-1)!;
        assert.ok(page.indexOf(`data-learning-unit="${lastUnit}"`) < quiz[0].index!, `chapter ${n}: quiz after the units`);
    }
    assert.match(readFileSync(join(HERE, "../../globals.css"), "utf8"), /\[data-learning-unit\], \[data-chapter-quiz\] \{ scroll-margin-top: var\(--bts-sticky-top, 88px\); \}/, "targets stop below the measured header");
});

test("resume: consumed once on arrival, jumped to (no smooth pass over units), then removed from the URL", () => {
    const layout = readFileSync(join(HERE, "../../../components/ChapterLayout.tsx"), "utf8");
    const block = layout.slice(layout.indexOf("const headerMeasured"), layout.indexOf("// ניווט בין פרקים"));
    assert.match(block, /if \(!headerMeasured \|\| learningChapterId === null\) return;/, "after the header is measured, chapters 1-19 only");
    assert.match(block, /if \(!hash\.startsWith\(RESUME_HASH\)\) return;/, "an ordinary URL is never touched");
    assert.match(block, /scrollIntoView\(\{ block: 'start', behavior: 'instant' \}\);\s*window\.history\.replaceState\(null, '', pathname \+ search\);/, "jump, then strip the hash (also when invalid)");
    assert.match(block, /\}, \[headerMeasured, learningChapterId\]\);/, "runs per chapter, not per scroll or render");
    assert.ok(layout.indexOf("scrollTop = 0") < layout.indexOf("const headerMeasured"), "after the chapter's scroll reset");
    assert.doesNotMatch(block, /fetch|supabase|learner|setTimeout|setInterval|requestAnimationFrame|focus\(|aria-live|useState/, "no network, timers, focus or state");

    const pulse = source("LearningPulse.tsx");
    const link = pulse.slice(pulse.indexOf("export function ContinueLink"));
    assert.match(link, /if \(here === null\) return;\s*e\.preventDefault\(\);/, "another chapter: a normal link navigation");
    assert.match(link, /resumeSelector\(action\.href\.slice\(chapterHref\(here\)\.length\), here\) \?\? "#chapter-main"/, "same chapter: the same target, or the chapter top");
    assert.match(link, /scrollIntoView\(\{ block: "start", behavior: "instant" \}\)/);
    assert.doesNotMatch(link, /focus\(|pushState|replaceState|fetch|useLearner/, "no focus move, history entry or extra learner read");
});
