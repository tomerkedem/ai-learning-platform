// Shared learner state: one store, one derivation, many readers. The sources are fakes that count
// every server request, so the request guarantees are tested exactly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
import { createLearnerStore, STALE_MS } from "./learnerStore.ts";
import {
    LEARNING_UNITS, chapterMilestones, courseLearning, mergeAttempt, mergeReached, withPending,
    type PendingAttemptInput, type QuizRecord, type ReachedUnit,
} from "./learningProgress.ts";

type P = PendingAttemptInput & { attemptId: string };

const rec = (chapterId: number | null, scores: number[], t = 1): QuizRecord =>
    scores.reduce<QuizRecord | undefined>((prev, s) => mergeAttempt(prev, {
        quizId: chapterId === null ? "behind-ai-final" : `behind-ai-chapter-${chapterId}`, chapterId, scorePercent: s,
        correctCount: s / 10, totalQuestions: 10, passed: s >= (chapterId === null ? 75 : 70), weakConcepts: [], strongConcepts: [],
    }, t), undefined)!;
const pend = (attemptId: string, chapterId: number, score: number, completedAt = 5, rejected?: string): P => ({
    attemptId, quizId: `behind-ai-chapter-${chapterId}`, chapterId, scorePercent: score, correctCount: score / 10, totalQuestions: 10,
    passed: score >= 70, weakConcepts: [], strongConcepts: [], completedAt, rejected,
});
const unit = (chapterId: number, i: number, reachedAt = 1): ReachedUnit => ({ chapterId, unitId: LEARNING_UNITS[chapterId][i], reachedAt });
const settle = () => new Promise((r) => setTimeout(r, 0));

function setup() {
    const server = { records: new Map<string, QuizRecord[]>(), units: new Map<string, ReachedUnit[]>() };
    const local = {
        cache: new Map<string, { records: QuizRecord[]; loadedAt: number }>(),
        units: new Map<string, ReachedUnit[]>(),
        outbox: new Map<string, P[]>(),
    };
    const env = { user: "A" as string | null, clock: 1_000_000, online: true, calls: { records: 0, units: 0 } };
    let gate: Promise<void> = Promise.resolve();
    let release = () => {};
    const hold = () => { gate = new Promise((r) => { release = r; }); };
    const open = () => { release(); gate = Promise.resolve(); };
    const store = createLearnerStore<P, { records: number }>({
        currentUserId: () => env.user,
        cachedRecords: (u) => local.cache.get(u) ?? null,
        localUnits: (u) => local.units.get(u) ?? [],
        outbox: (u) => local.outbox.get(u) ?? [],
        loadRecords: async (u) => {
            env.calls.records++;
            await gate;
            if (!env.online) {
                const c = local.cache.get(u);
                return c ? { ...c, offline: true } : { records: [], loadedAt: null, offline: true };
            }
            const records = server.records.get(u) ?? [];
            local.cache.set(u, { records, loadedAt: env.clock });
            return { records, loadedAt: env.clock, offline: false };
        },
        loadUnits: async (u) => {
            env.calls.units++;
            await gate;
            const known = local.units.get(u) ?? [];
            if (!env.online) return { reached: known, offline: true };
            const merged = mergeReached(server.units.get(u) ?? [], known);
            local.units.set(u, merged);
            return { reached: merged, offline: false };
        },
        derive: courseLearning,
        milestones: chapterMilestones,
        mergeReached,
        withPending,
        summarize: (records) => ({ records: records.length }),
        now: () => env.clock,
    });
    const requests = () => env.calls.records + env.calls.units;
    return { store, server, local, env, hold, open, requests };
}

test("initial snapshot comes from local sources, then exactly two parallel server requests replace it", async () => {
    const { store, server, local, env, hold, open, requests } = setup();
    local.cache.set("A", { records: [rec(4, [80])], loadedAt: 10 });
    local.units.set("A", [unit(8, 0), unit(8, 1)]);
    local.outbox.set("A", [pend("q1", 6, 90)]);
    const first = store.getView("A")!;
    assert.equal(requests(), 0, "reading the snapshot never fetches");
    assert.equal(first.ready, false);
    assert.deepEqual(first.course.chapters.filter((c) => c.masteryEarned).map((c) => c.chapterId), [4, 6], "cache + pending attempt");
    assert.equal(first.course.chapters[7].learningProgressRatio, 0.2, "local units");
    assert.equal(first.sync.pending.length, 1);

    server.records.set("A", [rec(4, [80]), rec(14, [88])]);
    server.units.set("A", [unit(8, 2)]);
    hold();
    store.subscribe("A", () => {});
    assert.deepEqual(env.calls, { records: 1, units: 1 }, "both requests start together");
    open();
    await settle();
    const view = store.getView("A")!;
    assert.equal(view.ready, true);
    assert.equal(view.sync.loadedAt, env.clock);
    assert.deepEqual(view.course.chapters.filter((c) => c.masteryEarned).map((c) => c.chapterId), [4, 6, 14], "server + still-pending attempt");
    assert.equal(view.course.chapters[7].learningProgressRatio, 0.3, "server units merged with local");
    assert.equal(requests(), 2);
});

test("exact chapter identity, sticky mastery and a lower pending retake survive the store", async () => {
    const { store, server, local } = setup();
    server.records.set("A", [rec(5, [85])]);
    local.outbox.set("A", [pend("retake", 5, 50, 9)]);
    store.subscribe("A", () => {});
    await settle();
    const c5 = store.getView("A")!.course.chapters[4];
    assert.deepEqual([c5.chapterId, c5.latestScore, c5.masteryEarned, c5.attempted], [5, 50, true, true]);
    assert.equal(store.getView("A")!.course.masteredCount, 1);
    assert.equal(store.getView("A")!.course.chapters[0].masteryEarned, false, "not the first chapter");
});

test("other readers, remounts and local recomputation make no requests", async () => {
    const { store, local, requests } = setup();
    const off1 = store.subscribe("A", () => {});
    await settle();
    assert.equal(requests(), 2);
    const off2 = store.subscribe("A", () => {});
    off1();
    off2();
    store.subscribe("A", () => {});
    store.getView("A");
    assert.equal(requests(), 2, "second reader, unmount and remount: no new requests");
    const before = store.getView("A")!;
    local.units.set("A", [unit(3, 0)]);
    store.onUnitsEvent();
    assert.notEqual(store.getView("A"), before, "a reached unit recomputes");
    assert.equal(store.getView("A")!.course.chapters[2].learningProgressRatio, 0.2);
    assert.equal(requests(), 2, "a reached unit never refetches");
});

test("quiz cycle: queued and confirmed locally, then exactly one coalesced quiz_results refresh", async () => {
    const { store, server, local, env, hold, open } = setup();
    store.subscribe("A", () => {});
    await settle();
    // Queued: shown immediately, no request.
    local.outbox.set("A", [pend("a1", 7, 84, 50)]);
    store.onQuizEvent();
    assert.equal(store.getView("A")!.course.chapters[6].latestScore, 84);
    assert.deepEqual(env.calls, { records: 1, units: 1 });
    // The server confirms: the item leaves the queue. Still shown, still no request.
    server.records.set("A", [rec(7, [84])]);
    local.outbox.set("A", []);
    store.onQuizEvent();
    assert.equal(store.getView("A")!.course.chapters[6].latestScore, 84, "a confirmed attempt never disappears");
    assert.equal(store.getView("A")!.sync.pending.length, 0);
    assert.deepEqual(env.calls, { records: 1, units: 1 });
    // End of the flush ("sent"), plus a duplicate event while that refresh is in flight: one request.
    hold();
    store.onQuizEvent();
    store.onQuizEvent();
    assert.deepEqual(env.calls, { records: 2, units: 1 });
    open();
    await settle();
    assert.equal(store.getView("A")!.course.chapters[6].latestScore, 84);
    assert.equal(store.getView("A")!.course.chapters[6].masteryEarned, true);
});

test("rejected attempts stay visible for retry/remove and are not counted", async () => {
    const { store, local } = setup();
    local.outbox.set("A", [pend("bad", 2, 95, 5, "22P02"), pend("ok", 3, 60)]);
    store.subscribe("A", () => {});
    await settle();
    const v = store.getView("A")!;
    assert.deepEqual(v.sync.rejected.map((p) => p.attemptId), ["bad"]);
    assert.deepEqual(v.sync.pending.map((p) => p.attemptId), ["ok"]);
    assert.equal(v.course.chapters[1].attempted, false, "a rejected attempt is not shown as a score");
    // Removing the rejected item is not a confirmation: nothing is merged.
    local.outbox.set("A", [pend("ok", 3, 60)]);
    store.onQuizEvent();
    assert.equal(store.getView("A")!.course.chapters[1].attempted, false);
});

test("duplicate refresh requests coalesce", async () => {
    const { store, env, hold, open } = setup();
    hold();
    store.subscribe("A", () => {});
    void store.refresh();
    void store.refresh();
    store.onVisible();
    store.onQuizEvent();
    assert.deepEqual(env.calls, { records: 1, units: 1 });
    open();
    await settle();
});

test("offline: cached state and local units are used, marked offline, and a failed refresh keeps the last truthful snapshot", async () => {
    const { store, server, local, env } = setup();
    env.online = false;
    local.cache.set("A", { records: [rec(9, [77])], loadedAt: 5 });
    local.units.set("A", [unit(9, 0)]);
    local.outbox.set("A", [pend("p", 10, 40)]);
    store.subscribe("A", () => {});
    await settle();
    let v = store.getView("A")!;
    assert.equal(v.sync.offline, true);
    assert.equal(v.ready, true);
    assert.equal(v.sync.loadedAt, 5);
    assert.deepEqual([v.course.chapters[8].masteryEarned, v.course.chapters[8].learningProgressRatio > 0, v.course.chapters[9].latestScore], [true, true, 40]);

    // Online: fresh data. Then offline again with no cache at all: nothing known is erased.
    env.online = true;
    server.records.set("A", [rec(9, [77]), rec(11, [90])]);
    store.onOnline();
    await settle();
    v = store.getView("A")!;
    assert.equal(v.sync.offline, false);
    assert.equal(v.course.masteredCount, 2);
    env.online = false;
    local.cache.delete("A");
    await store.refresh();
    v = store.getView("A")!;
    assert.equal(v.sync.offline, true);
    assert.equal(v.course.masteredCount, 2, "a failed refresh keeps the last truthful snapshot");
    assert.ok(v.course.chapters[8].learningProgressRatio > 0);
});

test("online refresh happens only after a failed load", async () => {
    const { store, requests } = setup();
    store.subscribe("A", () => {});
    await settle();
    store.onOnline();
    assert.equal(requests(), 2, "already online: no request");
});

test("sign-out never exposes the previous learner, even for one render", async () => {
    const { store, server, env } = setup();
    server.records.set("A", [rec(4, [90])]);
    store.subscribe("A", () => {});
    await settle();
    env.user = null;
    assert.equal(store.getView("A"), null, "a stale reader of A gets nothing once A is signed out");
    assert.equal(store.getView(null), null);
    store.reset();
    assert.equal(store.userId(), null, "A's state is released");
    assert.doesNotThrow(() => store.subscribe("A", () => {})(), "subscribing for a signed-out user is a no-op");
});

test("user A -> sign-out -> user B: B's state is independent from the first render", async () => {
    const { store, server, local, env, hold, open, requests } = setup();
    server.records.set("A", [rec(4, [90]), rec(14, [80])]);
    local.cache.set("A", { records: [rec(4, [90])], loadedAt: 1 });
    store.subscribe("A", () => {});
    await settle();
    assert.equal(store.getView("A")!.course.masteredCount, 2);

    env.user = null;
    store.reset();
    env.user = "B";
    server.records.set("B", [rec(2, [75])]);
    const firstB = store.getView("B")!;
    assert.equal(firstB.userId, "B");
    assert.equal(firstB.course.masteredCount, 0, "B's first render shows nothing of A");
    assert.equal(store.getView("A"), null);
    hold();
    store.subscribe("B", () => {});
    assert.equal(requests(), 4, "B loads on its own");
    open();
    await settle();
    assert.deepEqual(store.getView("B")!.course.chapters.filter((c) => c.masteryEarned).map((c) => c.chapterId), [2]);
});

test("a late response for a previous learner is discarded", async () => {
    const { store, server, env, hold, open } = setup();
    server.records.set("A", [rec(4, [90])]);
    hold();
    store.subscribe("A", () => {});
    env.user = "B";
    store.reset();
    const b = store.getView("B")!;
    open();
    await settle();
    assert.equal(store.getView("B")!.course.masteredCount, 0);
    assert.equal(b.userId, "B");
});

test("storage events: relevant keys recompute without requests; irrelevant keys do nothing", async () => {
    const { store, local, requests } = setup();
    store.subscribe("A", () => {});
    await settle();
    const before = store.getView("A")!;
    store.onStorage(null);
    assert.equal(store.getView("A"), before, "irrelevant key: same snapshot");
    local.outbox.set("A", [pend("t2", 12, 66)]);
    store.onStorage("outbox");
    assert.equal(store.getView("A")!.course.chapters[11].latestScore, 66);
    local.units.set("A", [unit(1, 0)]);
    store.onStorage("units");
    assert.ok(store.getView("A")!.course.chapters[0].learningProgressRatio > 0);
    // Another tab loaded newer server data into the cache: adopted without a request.
    local.cache.set("A", { records: [rec(17, [91])], loadedAt: 9_999_999 });
    store.onStorage("cache");
    assert.equal(store.getView("A")!.course.chapters[16].masteryEarned, true);
    // An older cache is ignored.
    local.cache.set("A", { records: [], loadedAt: 1 });
    store.onStorage("cache");
    assert.equal(store.getView("A")!.course.chapters[16].masteryEarned, true);
    assert.equal(requests(), 2);
});

test("visibility: fresh data makes no request; stale data refreshes once, in parallel", async () => {
    const { store, env, hold, open } = setup();
    store.subscribe("A", () => {});
    await settle();
    env.clock += STALE_MS - 1;
    store.onVisible();
    assert.deepEqual(env.calls, { records: 1, units: 1 }, "inside the freshness window");
    env.clock += 2;
    hold();
    store.onVisible();
    store.onVisible();
    assert.deepEqual(env.calls, { records: 2, units: 2 }, "stale: one refresh, both tables, no duplicate");
    open();
    await settle();
    store.onVisible();
    assert.deepEqual(env.calls, { records: 2, units: 2 }, "fresh again");
});

test("the store derives chapter milestones from the same reached units (one store, no extra request)", async () => {
    const { store, server, local, requests } = setup();
    local.units.set("A", [unit(2, 0), unit(2, 3)]);
    server.units.set("A", [unit(2, 5)]);
    store.subscribe("A", () => {});
    await settle();
    const v = store.getView("A")!;
    assert.equal(v.milestones.length, 19);
    assert.deepEqual(v.milestones[1], [true, false, false, true, false, true], "local + server reaches, with real gaps");
    assert.equal(requests(), 2);
    assert.deepEqual(Object.keys(v.course.chapters[1]).sort(), ["attempted", "chapterId", "latestPassed", "latestScore", "learningProgressRatio", "masteryEarned"], "the public chapter model stays chapter-level");
});

test("the view exposes each quiz's latest attempt (not best), including a pending retake; mastery stays", async () => {
    const { store, server, local, requests } = setup();
    server.records.set("A", [rec(5, [85])]);
    store.subscribe("A", () => {});
    await settle();
    assert.equal(store.getView("A")!.records.find((r) => r.quizId === "behind-ai-chapter-5")!.scorePercent, 85);
    local.outbox.set("A", [pend("retake", 5, 50, 9)]);
    store.onQuizEvent();
    const latest = store.getView("A")!.records.find((r) => r.quizId === "behind-ai-chapter-5")!;
    assert.deepEqual([latest.scorePercent, latest.bestScorePercent, latest.masteryEarned], [50, 85, true]);
    assert.equal(store.getView("A")!.records.some((r) => r.quizId === "behind-ai-chapter-6"), false, "never attempted: no record");
    assert.equal(requests(), 2, "no extra request");
});

test("quiz screen: a persisted latest attempt restores the result screen; only Retry starts a new attempt", () => {
    const engine = readFileSync(join(HERE, "..", "..", "..", "components", "content", "AssessmentEngine.tsx"), "utf8");
    assert.match(engine, /const restored = !isStarted && !isSubmitted && previousResult \? previousResult : null;/);
    assert.match(engine, /if \(!isStarted && !restored\) \{/, "start screen only when there is no persisted attempt");
    assert.match(engine, /if \(\(isSubmitted \|\| restored\) && !isReviewMode\) \{\s*const result = restored \?\? buildResult\(\);/);
    assert.match(engine, /setOptionOrder\(buildOptionOrder\(questions\)\); setIsStarted\(true\); \}\}/, "Retry explicitly starts a fresh attempt");
    const quizData = readFileSync(join(HERE, "quizData.ts"), "utf8");
    assert.match(quizData, /const latest = useLatestQuizRecord\(chapterQuizId\(n\)\);/);
    assert.match(quizData, /scorePercent: latest\.scorePercent/, "latest score, never best");
    assert.doesNotMatch(quizData.slice(quizData.indexOf("const latest =")), /bestScorePercent/);
});
