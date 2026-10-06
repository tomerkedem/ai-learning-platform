// Learning state for Chapters 1-19: the learning-unit registry agrees with the rendered chapters,
// progress counts only current units, mastery is sticky and per chapter, and the four concepts
// (progress, latest score, mastery, access) stay separate.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    CHAPTER_IDS, LEARNING_UNITS, averageLatestChapterScore, chapterLearningStates, chapterMilestones, continueTarget, courseLearning,
    latestReachedUnit, legacyMasteryEarned, masterySummary, mergeAttempt, mergeReached, progressBand, withPending,
    type AttemptInput, type ContinueTarget, type QuizRecord, type ReachedUnit,
} from "./learningProgress.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = (...rel: string[]) => readFileSync(join(HERE, ...rel), "utf8");
const at = (chapterId: number, unitId: string, reachedAt = 1): ReachedUnit => ({ chapterId, unitId, reachedAt });
const attempt = (chapterId: number | null, scorePercent: number, passScore = chapterId === null ? 75 : 70): AttemptInput => ({
    quizId: chapterId === null ? "behind-ai-final" : `behind-ai-chapter-${chapterId}`,
    chapterId, scorePercent, correctCount: scorePercent / 10, totalQuestions: 10,
    passed: scorePercent >= passScore, weakConcepts: [], strongConcepts: [],
});
const run = (chapterId: number | null, scores: number[]): QuizRecord =>
    scores.reduce<QuizRecord | undefined>((prev, s, i) => mergeAttempt(prev, attempt(chapterId, s), i + 1), undefined)!;
const stateOf = (chapterId: number, reached: ReachedUnit[], records: QuizRecord[] = []) =>
    chapterLearningStates(reached, records).find((s) => s.chapterId === chapterId)!;

test("Chapters 1-19 each have an ordered, duplicate-free unit list; no intro, final exam, quiz or bridge", () => {
    assert.deepEqual(CHAPTER_IDS, Array.from({ length: 19 }, (_, i) => i + 1));
    assert.deepEqual(Object.keys(LEARNING_UNITS).map(Number), CHAPTER_IDS);
    for (const n of CHAPTER_IDS) {
        const units = LEARNING_UNITS[n];
        assert.ok(units.length >= 4, `chapter ${n} has units`);
        assert.equal(new Set(units).size, units.length, `chapter ${n}: no duplicate ids`);
        for (const id of units) {
            assert.match(id, /^[a-z][a-z0-9-]{0,47}$/, `chapter ${n}: "${id}" matches the database format`);
            assert.doesNotMatch(id, /quiz|bridge|cta|final|hero/, `chapter ${n}: "${id}" is not quiz, bridge or post-quiz`);
        }
    }
    assert.equal(LEARNING_UNITS[0], undefined, "introduction is not a chapter");
    assert.equal(LEARNING_UNITS[20], undefined, "final exam is not a chapter");
    const states = chapterLearningStates([at(0, "guess"), at(20, "guess")], [run(null, [90])]);
    assert.deepEqual(states.map((s) => s.chapterId), CHAPTER_IDS);
    assert.ok(states.every((s) => s.reachedUnitCount === 0 && !s.attempted && !s.masteryEarned));
});

test("every chapter page marks exactly its registered units, in order, before the quiz", () => {
    for (const n of CHAPTER_IDS) {
        const page = source(`chapter-${n}`, "ChapterView.tsx");
        const marked = [...page.matchAll(/data-learning-unit="([^"]+)"/g)];
        assert.deepEqual(marked.map((m) => m[1]), [...LEARNING_UNITS[n]], `chapter ${n}: registry and page agree`);
        const quizAt = page.indexOf("<AssessmentEngine");
        const bridgeAt = page.search(/chapterBridges\[\d+\]\}<\/p><\/section>/);
        assert.ok(quizAt > 0, `chapter ${n} has a quiz`);
        for (const m of marked) {
            // A unit is a top-level <section> (never nested content), placed before the bridge and the quiz.
            const lineStart = page.lastIndexOf("\n", m.index) + 1;
            assert.match(page.slice(lineStart, m.index), /^\s*<section $/, `chapter ${n}: "${m[1]}" is on a <section>`);
            assert.ok(m.index! < quizAt && (bridgeAt < 0 || m.index! < bridgeAt), `chapter ${n}: "${m[1]}" is before the bridge and quiz`);
        }
    }
    // The introduction and final exam are not tracked.
    for (const file of [["introduction", "IntroView.tsx"], ["final-exam", "FinalExamView.tsx"]]) {
        assert.doesNotMatch(source(...file), /data-learning-unit/, file.join("/"));
    }
});

test("detection is rooted on the chapter scroll container, with a documented visibility rule", () => {
    const layout = source("..", "..", "..", "components", "ChapterLayout.tsx");
    assert.match(layout, /const learningChapterId = courseId === 'behind-the-scenes-ai' && currentChapterId >= 1 && currentChapterId <= 19 \? currentChapterId : null;\s*useLearningUnitTracking\(scrollContainerRef, learningChapterId\);/);
    assert.match(layout, /ref=\{scrollContainerRef\}\s+className="flex-1 overflow-y-auto/);
    const hook = source("useLearningUnitTracking.ts");
    assert.match(hook, /new IntersectionObserver\([\s\S]*\{ root, threshold: THRESHOLDS \}\)/);
    assert.match(hook, /const REACHED_SHARE = 0\.5;/);
    assert.match(hook, /Math\.min\(e\.boundingClientRect\.height, e\.rootBounds\.height\) \* REACHED_SHARE/);
    // Sticky: a reached unit leaves the observer. No timers (time on page is not evidence).
    assert.match(hook, /observer\.unobserve\(e\.target\);\s*markUnitReached\(/);
    assert.doesNotMatch(hook, /setTimeout|setInterval|Date\.now|performance\.now|scrollTop/);
});

test("reaching a unit repeatedly is idempotent and sticky; merges keep the first reach", () => {
    const once = mergeReached([at(8, "lab", 5)]);
    assert.deepEqual(mergeReached(once, [at(8, "lab", 9)], [at(8, "lab", 7)]), [at(8, "lab", 5)]);
    assert.deepEqual(mergeReached(once, once, once), once);
    // Offline queue + server copy of the same reach (a retried write) still count once.
    const s = stateOf(8, mergeReached([at(8, "lab", 3)], [at(8, "lab", 3)], [at(8, "guess", 4)]));
    assert.equal(s.reachedUnitCount, 2);
    // Nothing removes a reach: merging an empty list changes nothing.
    assert.deepEqual(mergeReached(once, []), once);
    // The account outbox only adds, and only units of the registry.
    const account = source("account.ts");
    const mark = account.slice(account.indexOf("export function markUnitReached("), account.indexOf("export async function flushLearningUnits("));
    assert.match(mark, /if \(!userId \|\| !isLearningUnit\(chapterId, unitId\)\) return;/);
    assert.match(mark, /if \(store\.reached\.some\(u => u\.chapterId === chapterId && u\.unitId === unitId\)\) return;/);
});

test("fractional progress counts only current registry units of that chapter", () => {
    const six = LEARNING_UNITS[8].slice(0, 6).map((id) => at(8, id));
    const s = stateOf(8, six);
    assert.equal(s.unitCount, 10);
    assert.equal(s.reachedUnitCount, 6);
    assert.equal(s.learningProgressRatio, 0.6);
    assert.equal(s.learningProgressPercent, 60);
    // Unknown, removed or renamed ids never inflate the numerator.
    const stale = stateOf(8, [...six, at(8, "removed-unit"), at(8, "old-name"), at(8, "Lab")]);
    assert.equal(stale.reachedUnitCount, 6);
    assert.equal(stale.learningProgressPercent, 60);
    // Progress belongs to its chapter: chapter 9's "lab" is not chapter 8's "lab".
    assert.equal(stateOf(8, [at(9, "lab")]).reachedUnitCount, 0);
    assert.deepEqual(stateOf(9, [at(9, "lab")]).reachedUnitIds, ["lab"]);
    assert.equal(stateOf(1, LEARNING_UNITS[1].map((id) => at(1, id))).learningProgressPercent, 100);
});

test("reordering the registry keeps semantic progress; reached ids follow the current order", () => {
    const reached = [at(8, "lock"), at(8, "guess")];
    const original = LEARNING_UNITS[8];
    const reversed = [...original].reverse();
    const mutable = LEARNING_UNITS as Record<number, readonly string[]>;
    mutable[8] = reversed;
    try {
        const s = stateOf(8, reached);
        assert.equal(s.reachedUnitCount, 2);
        assert.deepEqual(s.reachedUnitIds, ["lock", "guess"]);
        // Adding a unit lowers the percentage (more material); it never invents progress.
        mutable[8] = [...original, "new-unit"];
        assert.equal(stateOf(8, reached).learningProgressPercent, Math.round((2 / 11) * 100));
    } finally {
        mutable[8] = original;
    }
});

test("sticky mastery: 60 -> 85 -> 50 keeps mastery, latest 50, best 85, 3 attempts", () => {
    const r = run(8, [60, 85, 50]);
    assert.equal(r.scorePercent, 50);
    assert.equal(r.bestScorePercent, 85);
    assert.equal(r.masteryEarned, true);
    assert.equal(r.attempts, 3);
    assert.equal(r.passed, false, "latest attempt semantics are unchanged");
    const s = stateOf(8, [], [r]);
    assert.equal(s.latestScore, 50, "the current score is the latest attempt, not the best");
    assert.equal(s.masteryEarned, true);
    assert.equal(s.attempted, true);
    // Never passed: no mastery, even with many attempts.
    assert.equal(run(8, [60, 65, 69]).masteryEarned, false);
});

test("mastery identifies exact chapters, never the first N", () => {
    const records = [run(4, [90]), run(11, [70]), run(17, [100]), run(2, [40])];
    const states = chapterLearningStates([], records);
    assert.deepEqual(states.filter((s) => s.masteryEarned).map((s) => s.chapterId), [4, 11, 17]);
    assert.deepEqual(states.filter((s) => s.attempted).map((s) => s.chapterId), [2, 4, 11, 17]);
    assert.equal(states[0].masteryEarned, false);
    // A record whose quiz id belongs to another chapter is not this chapter's state.
    assert.equal(stateOf(5, [], [{ ...run(4, [90]), chapterId: 5 }]).attempted, false);
});

test("learning progress and mastery are independent dimensions", () => {
    const all = (n: number) => LEARNING_UNITS[n].map((id) => at(n, id));
    const three = (n: number) => LEARNING_UNITS[n].slice(0, Math.round(LEARNING_UNITS[n].length * 0.3)).map((id) => at(n, id));
    assert.deepEqual([stateOf(8, []).learningProgressPercent, stateOf(8, []).masteryEarned], [0, false]);
    assert.deepEqual([stateOf(8, all(8)).learningProgressPercent, stateOf(8, all(8)).masteryEarned], [100, false]);
    const masteredEarly = stateOf(8, three(8), [run(8, [80])]);
    assert.deepEqual([masteredEarly.learningProgressPercent, masteredEarly.masteryEarned], [30, true]);
    const both = stateOf(8, all(8), [run(8, [80])]);
    assert.deepEqual([both.learningProgressPercent, both.masteryEarned], [100, true]);
});

test("final exam is outside the 19-chapter model and keeps latest-attempt semantics", () => {
    const final = run(null, [80, 60]);
    assert.equal(final.passed, false);
    assert.equal(final.bestScorePercent, 80);
    assert.equal(final.masteryEarned, false, "no sticky mastery for the final exam");
    assert.ok(chapterLearningStates([], [final]).every((s) => !s.attempted));
    // The final exam status is still read from the latest attempt (now in the pure summary).
    assert.match(source("learningProgress.ts"), /finalExam: !finalExam\.attempted \? "not-taken" : finalExam\.passed \? "passed" : "needs-review",/);
    assert.equal(masterySummary([final]).finalExam, "needs-review");
    assert.match(source("quizData.ts"), /passScore: 75,/);
});

test("legacy records (before mastery_earned) derive mastery once from pass-or-best >= 70", () => {
    assert.equal(legacyMasteryEarned({ chapterId: 3, passed: false, bestScorePercent: 85 }), true);
    assert.equal(legacyMasteryEarned({ chapterId: 3, passed: true, bestScorePercent: 70 }), true);
    assert.equal(legacyMasteryEarned({ chapterId: 3, passed: false, bestScorePercent: 69 }), false);
    assert.equal(legacyMasteryEarned({ chapterId: null, passed: true, bestScorePercent: 100 }), false);
    // The same rule as the database backfill.
    const migration = readFileSync(join(HERE, "..", "..", "..", "supabase", "migrations", "20261002130000_learning_progress_and_sticky_mastery.sql"), "utf8");
    assert.match(migration, /where chapter_id is not null and \(passed or best_score_percent >= 70\);/);
    assert.match(migration, /mastery_earned = excluded\.chapter_id is not null and \(q\.mastery_earned or excluded\.mastery_earned\)/);
});

test("pending (offline) attempts merge with sticky mastery and the summary counts mastery", () => {
    const account = source("account.ts");
    // withPending lives in the pure module (tested directly below) and account.ts re-exports it.
    assert.match(source("learningProgress.ts"), /if \(!p\.rejected\) byId\.set\(p\.quizId, mergeAttempt\(byId\.get\(p\.quizId\), p, p\.completedAt\)\);/);
    assert.match(account, /export \{ withPending \} from "\.\/learningProgress";/);
    const pending = (score: number, completedAt: number, rejected?: string) => ({ ...attempt(6, score), completedAt, rejected });
    const merged = withPending([run(6, [90])], [pending(40, 9)]);
    assert.deepEqual([merged[0].scorePercent, merged[0].masteryEarned, merged[0].attempts, merged[0].bestScorePercent], [40, true, 2, 90]);
    assert.deepEqual(withPending([run(6, [90])], [pending(10, 9, "22P02")]), [run(6, [90])], "a rejected attempt is not merged");
    assert.equal(withPending([], [pending(75, 3)])[0].masteryEarned, true, "a pending pass shows mastery");
    assert.match(account, /masteryEarned: r\.mastery_earned,/);
    assert.match(account, /mastery_earned: r\.masteryEarned,/);
    // A server record with mastery, then a pending failed attempt: mastery stays.
    const server = run(6, [90]);
    assert.equal(mergeAttempt(server, attempt(6, 40), 9).masteryEarned, true);
    // The summary counts sticky mastery: a later failed attempt keeps the chapter mastered.
    assert.equal(masterySummary(withPending([server], [{ ...attempt(6, 40), completedAt: 9 }])).passedChapters, 1);
    // The dashboard summary is the pure derivation, with no second aggregate path.
    const mastery = source("masteryProgress.ts");
    assert.match(mastery, /return masterySummary\(records\);/);
    const summarySection = mastery.slice(mastery.indexOf("export type { FinalExamStatus, MasterySummary }"));
    assert.ok(summarySection.length > 0 && summarySection.length < mastery.length);
    assert.doesNotMatch(summarySection, /bestScorePercent/, "no best-score aggregate remains");
    assert.doesNotMatch(source("learningProgress.ts").slice(source("learningProgress.ts").indexOf("export function masterySummary")), /bestScorePercent/);
});

test("access never changes learning history", () => {
    for (const file of ["learningProgress.ts", "useLearningUnitTracking.ts"]) {
        assert.doesNotMatch(source(file), /useCourseAccess|hasCourseAccess|course_access|revoked_at|expires_at/, file);
    }
    const migration = readFileSync(join(HERE, "..", "..", "..", "supabase", "migrations", "20261002130000_learning_progress_and_sticky_mastery.sql"), "utf8");
    assert.doesNotMatch(migration, /delete from|course_access_grants/i);
    assert.match(migration, /references auth\.users \(id\) on delete cascade/);
    // No update or delete grant: a reached unit stays reached.
    assert.match(migration, /grant select, insert on table public\.learning_unit_progress to authenticated;/);
});

test("resume foundation: the latest reach of a unit that still exists", () => {
    assert.equal(latestReachedUnit([]), null);
    const reached = [at(3, "lab", 10), at(11, "see", 30), at(11, "removed-unit", 50), at(0, "guess", 60)];
    assert.deepEqual(latestReachedUnit(reached), at(11, "see", 30));
});

// ── The public course model (Chapters 1-19 exactly; learning units stay internal) ──
const full = (chapterId: number, reachedAt = 1) => LEARNING_UNITS[chapterId].map((u) => at(chapterId, u, reachedAt));
const some = (chapterId: number, count: number, reachedAt = 1) => full(chapterId, reachedAt).slice(0, count);
const quizAt = (record: QuizRecord, lastCompletedAt: number): QuizRecord => ({ ...record, lastCompletedAt });
const masteredIds = (reached: ReachedUnit[], records: QuizRecord[]) =>
    courseLearning(reached, records).chapters.filter((c) => c.masteryEarned).map((c) => c.chapterId);

test("course model: exactly 19 chapters in order, with only the public fields", () => {
    const course = courseLearning([], []);
    assert.equal(course.chapters.length, 19);
    assert.deepEqual(course.chapters.map((c) => c.chapterId), CHAPTER_IDS);
    for (const c of course.chapters) {
        assert.deepEqual(Object.keys(c).sort(), ["attempted", "chapterId", "latestPassed", "latestScore", "learningProgressRatio", "masteryEarned"]);
        assert.deepEqual(c, { chapterId: c.chapterId, learningProgressRatio: 0, masteryEarned: false, latestScore: null, latestPassed: null, attempted: false });
    }
    assert.equal(course.masteredCount, 0);
    assert.deepEqual(course.finalExam, { attempted: false, passed: false, latestScore: null });
    assert.equal(course.lastActivity, null);
    // chapters[n - 1] is chapter n, whatever the data.
    const mixed = courseLearning([...some(9, 3), ...full(2)], [run(17, [90]), run(3, [40])]);
    mixed.chapters.forEach((c, i) => assert.equal(c.chapterId, i + 1));
});

test("course model: mastery is the exact chapters passed, never the first N", () => {
    assert.deepEqual(masteredIds([], [run(4, [80])]), [4]);
    assert.deepEqual(masteredIds([], [run(14, [88]), run(4, [80])]), [4, 14]);
    const course = courseLearning([], [run(4, [80]), run(14, [88])]);
    assert.equal(course.masteredCount, 2);
    assert.equal(course.chapters[0].masteryEarned, false, "two mastered chapters are not chapters 1 and 2");
    assert.equal(course.chapters[1].masteryEarned, false);
    // masteredCount always equals the mastered identities.
    const records = [run(1, [90]), run(2, [50]), run(7, [60, 85, 40]), run(19, [75]), run(11, [69])];
    const big = courseLearning(full(5), records);
    assert.equal(big.masteredCount, big.chapters.filter((c) => c.masteryEarned).length);
    assert.deepEqual(big.chapters.filter((c) => c.masteryEarned).map((c) => c.chapterId), [1, 7, 19]);
});

test("course model: latest score and attempted, including a lower retake after mastery", () => {
    const { chapters } = courseLearning([], [run(3, [60]), run(5, [85, 50])]);
    assert.deepEqual(chapters[0], { chapterId: 1, learningProgressRatio: 0, masteryEarned: false, latestScore: null, latestPassed: null, attempted: false });
    assert.deepEqual(chapters[2], { chapterId: 3, learningProgressRatio: 0, masteryEarned: false, latestScore: 60, latestPassed: false, attempted: true });
    assert.deepEqual([chapters[4].latestScore, chapters[4].latestPassed, chapters[4].masteryEarned], [50, false, true], "85 then 50: latest failed, mastery kept");
    assert.equal(chapters[4].latestScore, 50, "latest, not best (85)");
    assert.equal(chapters[4].masteryEarned, true, "mastery stays after the lower retake");
    assert.equal(chapters[4].attempted, true);
});

test("course model: learning progress and mastery are independent (90/no, 25/yes, 100/no, 100/yes)", () => {
    const { chapters } = courseLearning(
        [...some(8, 9), ...some(14, 2), ...full(3), ...full(1)],
        [run(14, [88]), run(3, [62]), run(1, [86])],
    );
    const pick = (n: number) => [chapters[n - 1].learningProgressRatio, chapters[n - 1].masteryEarned];
    assert.deepEqual(pick(8), [0.9, false]);
    assert.deepEqual(pick(14), [0.25, true]);
    assert.deepEqual(pick(3), [1, false]);
    assert.deepEqual(pick(1), [1, true]);
});

test("course model: unknown quiz records and unit ids are ignored; the final exam stays outside", () => {
    const mismatched: QuizRecord = { ...run(4, [90]), quizId: "behind-ai-chapter-5" };
    const outside = run(20, [95]);
    const other: QuizRecord = { ...run(6, [99]), quizId: "some-other-quiz" };
    const course = courseLearning(
        [at(3, "not-a-unit"), at(0, "guess"), at(20, "guess"), at(1.5, "guide")],
        [mismatched, outside, other, run(null, [80])],
    );
    assert.ok(course.chapters.every((c) => c.learningProgressRatio === 0 && !c.attempted && !c.masteryEarned && c.latestScore === null));
    assert.equal(course.masteredCount, 0);
    assert.deepEqual(course.finalExam, { attempted: true, passed: true, latestScore: 80 });
    assert.equal(course.lastActivity, null, "the final exam and unknown units are not chapter activity");
    // Final exam: latest attempt, no mastery semantics.
    assert.deepEqual(courseLearning([], [run(null, [90, 60])]).finalExam, { attempted: true, passed: false, latestScore: 60 });
});

test("course model: last activity is the later of a unit reach and a chapter quiz, resuming at that chapter's latest unit", () => {
    const reached = [at(2, "guess", 10), at(2, "lab", 20), at(6, "guess", 30)];
    assert.deepEqual(courseLearning(reached, []).lastActivity, { chapterId: 6, unitId: "guess", at: 30 });
    assert.deepEqual(courseLearning(reached, [quizAt(run(2, [50]), 40)]).lastActivity, { chapterId: 2, unitId: "lab", at: 40 });
    assert.deepEqual(courseLearning(reached, [quizAt(run(4, [50]), 30)]).lastActivity, { chapterId: 4, unitId: null, at: 30 }, "tie: the quiz");
    assert.deepEqual(courseLearning(reached, [quizAt(run(null, [90]), 99)]).lastActivity, { chapterId: 6, unitId: "guess", at: 30 });
});

test("progress bands: every boundary", () => {
    const cases: [number, string][] = [
        [0, "not-started"], [-1, "not-started"], [Number.NaN, "not-started"],
        [0.0001, "started"], [0.25, "started"], [1 / 3 - 1e-9, "started"],
        [1 / 3, "in-progress"], [2 / 6, "in-progress"], [0.5, "in-progress"], [0.749, "in-progress"],
        [0.75, "well-advanced"], [3 / 4, "well-advanced"], [0.9, "well-advanced"], [0.999, "well-advanced"],
        [1, "all-reached"], [1.5, "all-reached"],
    ];
    for (const [ratio, band] of cases) assert.equal(progressBand(ratio), band, `ratio ${ratio}`);
});

test("continue target: every branch of the deterministic rule", () => {
    const allMastered = CHAPTER_IDS.map((n) => quizAt(run(n, [90]), n));
    const cases: { name: string; reached?: ReachedUnit[]; records?: QuizRecord[]; access?: boolean; expected: ContinueTarget | null }[] = [
        { name: "inactive access: no target, even with history", reached: some(5, 2), access: false, expected: null },
        { name: "inactive access: no target for a new learner", access: false, expected: null },
        { name: "brand-new learner", expected: { kind: "start", chapterId: 1 } },
        { name: "only a final exam attempt is not chapter activity", records: [run(null, [40])], expected: { kind: "start", chapterId: 1 } },
        { name: "partial chapter continues at its latest unit", reached: [at(5, "guess", 5), at(5, "lab", 6)], expected: { kind: "continue", chapterId: 5, unitId: "lab" } },
        {
            name: "latest quiz activity newer than latest unit activity anchors on the quiz's chapter",
            reached: [at(7, "guess", 10), at(7, "primer", 11), at(3, "lab", 50)],
            records: [quizAt(run(7, [40]), 60)],
            expected: { kind: "continue", chapterId: 7, unitId: "primer" },
        },
        { name: "fully reached but not mastered: the chapter quiz", reached: full(6, 9), expected: { kind: "quiz", chapterId: 6 } },
        {
            name: "fully reached but not mastered stays on the quiz even with other open chapters",
            reached: [...some(2, 1, 1), ...full(6, 9)], records: [quizAt(run(6, [50]), 9)],
            expected: { kind: "quiz", chapterId: 6 },
        },
        { name: "mastered anchor: next untouched chapter starts", reached: full(2, 5), records: [quizAt(run(2, [90]), 6)], expected: { kind: "start", chapterId: 3 } },
        {
            name: "mastered anchor: next partial chapter continues (resume point unknown there)",
            reached: [...some(3, 2, 1), ...full(2, 5)], records: [quizAt(run(2, [90]), 6)],
            expected: { kind: "continue", chapterId: 3, unitId: null },
        },
        {
            name: "mastered anchor skips fully reached and mastered chapters",
            reached: [...full(3, 1), ...full(2, 5)], records: [quizAt(run(4, [90]), 2), quizAt(run(2, [90]), 6)],
            expected: { kind: "start", chapterId: 5 },
        },
        {
            name: "mastery with low progress closes the chapter (25% + mastery moves on)",
            reached: some(14, 2, 1), records: [quizAt(run(14, [88]), 3)],
            expected: { kind: "start", chapterId: 15 },
        },
        {
            name: "wraps after chapter 19",
            reached: full(18, 5), records: [quizAt(run(19, [80]), 4), quizAt(run(18, [80]), 6)],
            expected: { kind: "start", chapterId: 1 },
        },
        {
            name: "all closed with a fully reached, non-mastered chapter left: its quiz",
            reached: full(12, 1), records: [...allMastered.filter((r) => r.chapterId !== 12), quizAt(run(5, [95]), 100)],
            expected: { kind: "quiz", chapterId: 12 },
        },
        { name: "all mastered, final exam not taken: final exam", records: allMastered, expected: { kind: "final-exam" } },
        { name: "all mastered, final exam latest attempt failed: final exam", records: [...allMastered, run(null, [90, 50])], expected: { kind: "final-exam" } },
        { name: "all mastered and final exam passed: no target", records: [...allMastered, run(null, [80])], expected: null },
    ];
    for (const c of cases) {
        assert.deepEqual(continueTarget(courseLearning(c.reached ?? [], c.records ?? []), c.access ?? true), c.expected, c.name);
    }
});

test("continue target is an ordering suggestion; the final exam has no eligibility gate here", () => {
    // A final exam attempt with open chapters changes nothing: the learner is still sent to the open chapter.
    const reached = [at(5, "guess", 5), at(5, "lab", 6)];
    assert.deepEqual(continueTarget(courseLearning(reached, [run(null, [90])]), true), { kind: "continue", chapterId: 5, unitId: "lab" });
    assert.doesNotMatch(source("learningProgress.ts"), /finalExam\.(?:locked|eligible|available)|eligib/i);
});

test("average: latest scores of attempted Chapter 1-19 quizzes only", () => {
    assert.equal(averageLatestChapterScore([]), null);
    assert.equal(averageLatestChapterScore([run(null, [80])]), null, "final exam alone");
    assert.equal(averageLatestChapterScore([run(3, [64])]), 64);
    assert.equal(averageLatestChapterScore([run(1, [80]), run(2, [71])]), 76);
    assert.equal(averageLatestChapterScore([run(1, [90, 50])]), 50, "latest, not best");
    assert.equal(averageLatestChapterScore([run(1, [80]), run(2, [70]), run(null, [10])]), 75, "final exam excluded");
    const mismatched: QuizRecord = { ...run(4, [10]), quizId: "behind-ai-chapter-5" };
    assert.equal(averageLatestChapterScore([run(1, [80]), run(20, [0]), mismatched]), 80, "unknown chapter records excluded");
});

test("the final exam id matches masteryProgress", () => {
    assert.match(source("masteryProgress.ts"), /FINAL_EXAM_QUIZ_ID = "behind-ai-final"/);
    assert.match(source("learningProgress.ts"), /const FINAL_EXAM_ID = "behind-ai-final"/);
});

// ── Course summary semantics (MasteryDashboard): latest scores, exact identity, attempted is not completed ──
test("summary: latest chapter score with sticky mastery (85 then 50)", () => {
    const records = [run(5, [85, 50])];
    const chapter = courseLearning([], records).chapters[4];
    assert.deepEqual([chapter.latestScore, chapter.masteryEarned], [50, true]);
    const summary = masterySummary(records);
    assert.equal(summary.passedChapters, 1, "mastery stays after the lower retake");
    assert.equal(summary.averageScore, 50, "the latest score, not the best (85)");
});

test("summary: average of latest scores of attempted chapters only (50 and 70 -> 60, despite higher bests)", () => {
    const records = [run(1, [95, 50]), run(2, [90, 70])];
    assert.equal(masterySummary(records).averageScore, 60);
    assert.equal(masterySummary(records).averageScore, averageLatestChapterScore(records), "one derivation");
    assert.equal(masterySummary([]).averageScore, null, "no attempts: no average");
    assert.equal(masterySummary([...records, run(null, [10])]).averageScore, 60, "final exam excluded");
    const mismatched: QuizRecord = { ...run(4, [0]), quizId: "behind-ai-chapter-5" };
    assert.equal(masterySummary([...records, run(20, [0]), mismatched, { ...run(3, [0]), quizId: "other" }]).averageScore, 60, "unknown records excluded");
});

test("summary: final exam score is the latest attempt, with the existing pass semantics", () => {
    const later = masterySummary([run(null, [95, 60])]);
    assert.equal(later.finalExamScore, 60, "latest, not the earlier 95");
    assert.equal(later.finalExam, "needs-review", "status follows the latest attempt, as before");
    assert.deepEqual([masterySummary([run(null, [60, 90])]).finalExamScore, masterySummary([run(null, [60, 90])]).finalExam], [90, "passed"]);
    assert.deepEqual([masterySummary([]).finalExamScore, masterySummary([]).finalExam], [null, "not-taken"]);
    assert.equal(masterySummary([{ ...run(null, [80]), chapterId: 3 }]).finalExam, "not-taken", "a malformed final-exam record is ignored");
});

test("summary: mastered count is exact identity; attempted is not mastered and not 'completed'", () => {
    const records = [run(4, [80]), run(14, [88]), run(7, [40]), run(9, [55, 60])];
    const summary = masterySummary(records);
    assert.equal(summary.passedChapters, 2, "chapters 4 and 14");
    assert.deepEqual(courseLearning([], records).chapters.filter((c) => c.masteryEarned).map((c) => c.chapterId), [4, 14], "not chapters 1 and 2");
    assert.equal(summary.attemptedChapters, 4, "attempted: 4, 7, 9, 14");
    assert.equal(summary.totalChapters, 19);
    assert.ok(!("completedChapters" in summary), "no value is called completed any more");
    // Unknown records affect nothing.
    const noise = [run(20, [99]), { ...run(2, [99]), quizId: "behind-ai-chapter-3" }, { ...run(1, [99]), quizId: "x" }];
    assert.deepEqual(masterySummary([...records, ...noise]), summary);
    assert.equal(masterySummary(noise).hasAnyData, false);
});

test("summary: the learner-facing tile says attempted, in all six locales", () => {
    const root = join(HERE, "..", "..", "..");
    for (const locale of ["he", "en", "es", "ru", "ar", "ja"]) {
        const chrome = readFileSync(join(root, "i18n", "locales", locale, "chrome.ts"), "utf8");
        const progress = chrome.slice(chrome.indexOf("progress: {"));
        assert.match(progress, /\n\s+attempted: '[^']+',/, `${locale}: attempted label`);
        assert.doesNotMatch(progress.slice(0, progress.indexOf("status: {")), /\n\s+completed: /, `${locale}: no "completed" tile label`);
    }
    const dashboard = source("MasteryDashboard.tsx");
    assert.doesNotMatch(dashboard, /progress\.completed|completedChapters/);
    assert.match(dashboard, /\{progress\.attempted\}<\/div>\s*<div[^>]*>\{summary\.attemptedChapters\}/);
});

// ── Chapter milestones (card trail): one per registered unit, from real reaches, in registry order ──
test("milestones: every chapter gets exactly its registered units, in order; nothing for the final exam", () => {
    const m = chapterMilestones([]);
    assert.equal(m.length, 19, "19 chapters, no 20th");
    CHAPTER_IDS.forEach((n) => assert.equal(m[n - 1].length, LEARNING_UNITS[n].length, `chapter ${n}`));
    assert.ok(m.every((row) => row.every((r) => r === false)));
    const counts = CHAPTER_IDS.map((n) => m[n - 1].length);
    assert.deepEqual(counts, [4, 6, 5, 6, 7, 9, 9, 10, 10, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8], "different chapters keep their real counts");
    // Registry order: reaching the 3rd registered unit of chapter 8 marks index 2, whatever the reach order.
    const third = LEARNING_UNITS[8][2];
    assert.deepEqual(chapterMilestones([at(8, third, 99)])[7].map((r, i) => (r ? i : -1)).filter((i) => i >= 0), [2]);
});

test("milestones: real reached state, including gaps; never manufactured from the ratio", () => {
    const pick = (n: number, indexes: number[]) => indexes.map((i) => at(n, LEARNING_UNITS[n][i], i + 1));
    // Chapter 2 (6 units): reached, not, reached, reached, not, reached.
    assert.deepEqual(chapterMilestones(pick(2, [0, 2, 3, 5]))[1], [true, false, true, true, false, true]);
    // Same ratio (3/10), different truth: a prefix and a scattered pattern stay different.
    const prefix = chapterMilestones(pick(8, [0, 1, 2]))[7];
    const scattered = chapterMilestones(pick(8, [0, 4, 9]))[7];
    assert.equal(courseLearning(pick(8, [0, 1, 2]), []).chapters[7].learningProgressRatio, courseLearning(pick(8, [0, 4, 9]), []).chapters[7].learningProgressRatio);
    assert.notDeepEqual(prefix, scattered);
    assert.deepEqual(scattered, [true, false, false, false, true, false, false, false, false, true]);
});

test("milestones: unknown, removed or out-of-course unit ids create no dots", () => {
    const m = chapterMilestones([at(3, "not-a-unit"), at(3, "removed-unit"), at(0, "guess"), at(20, "guess"), at(1.5, "guide")]);
    assert.deepEqual(m.map((row) => row.length), CHAPTER_IDS.map((n) => LEARNING_UNITS[n].length));
    assert.ok(m.every((row) => row.every((r) => r === false)));
});

// ── Course learning progress: registered units reached / all registered units ──
test("course learning progress: exact registered reached units over all registered units", () => {
    const total = CHAPTER_IDS.reduce((sum, n) => sum + LEARNING_UNITS[n].length, 0);
    assert.equal(courseLearning([], []).learningProgress, 0, "nothing reached: 0");
    const everything = CHAPTER_IDS.flatMap((n) => full(n));
    assert.equal(courseLearning(everything, []).learningProgress, 1, "all registered units: 1");
    const some3 = [...some(8, 3), ...some(2, 2)];
    assert.equal(courseLearning(some3, []).learningProgress, 5 / total);
    // Unknown, removed and out-of-course ids, and duplicates, never inflate it.
    const noisy = [...some3, ...some3, at(8, LEARNING_UNITS[8][0], 999), at(3, "not-a-unit"), at(0, "guess"), at(20, "guess")];
    assert.equal(courseLearning(noisy, []).learningProgress, 5 / total);
    // Not from quizzes or mastery.
    assert.equal(courseLearning([], CHAPTER_IDS.map((n) => run(n, [95]))).learningProgress, 0);
    // Unit-weighted, not an average of chapter percentages: one full 4-unit chapter is 4/total, not 1/19.
    assert.equal(courseLearning(full(1), []).learningProgress, 4 / total);
    assert.notEqual(courseLearning(full(1), []).learningProgress, 1 / 19);
});
