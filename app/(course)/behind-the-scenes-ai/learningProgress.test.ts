// Learning state for Chapters 1-19: the learning-unit registry agrees with the rendered chapters,
// progress counts only current units, mastery is sticky and per chapter, and the four concepts
// (progress, latest score, mastery, access) stay separate.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    CHAPTER_IDS, LEARNING_UNITS, chapterLearningStates, latestReachedUnit, legacyMasteryEarned, mergeAttempt, mergeReached,
    type AttemptInput, type QuizRecord, type ReachedUnit,
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
    assert.match(layout, /useLearningUnitTracking\(scrollContainerRef, courseId === 'behind-the-scenes-ai' && currentChapterId >= 1 && currentChapterId <= 19 \? currentChapterId : null\);/);
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
    // The final exam status is still read from the latest attempt.
    assert.match(source("masteryProgress.ts"), /if \(final\) finalExam = final\.passed \? "passed" : "needs-review";/);
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
    assert.match(account, /if \(!p\.rejected\) byId\.set\(p\.quizId, mergeAttempt\(byId\.get\(p\.quizId\), p, p\.completedAt\)\);/);
    assert.match(account, /masteryEarned: r\.mastery_earned,/);
    assert.match(account, /mastery_earned: r\.masteryEarned,/);
    // A server record with mastery, then a pending failed attempt: mastery stays.
    const server = run(6, [90]);
    assert.equal(mergeAttempt(server, attempt(6, 40), 9).masteryEarned, true);
    const mastery = source("masteryProgress.ts");
    assert.match(mastery, /const passedChapters = chapterRecords\.filter\(r => r\.masteryEarned\)\.length;/);
    // Average score is unchanged in this phase (still the best scores).
    assert.match(mastery, /chapterRecords\.reduce\(\(acc, r\) => acc \+ r\.bestScorePercent, 0\)/);
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
