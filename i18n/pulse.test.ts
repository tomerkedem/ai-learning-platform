// Learning Pulse copy contract (chrome.pulse): the same structure in all six locales, the brand kept
// in English, no internal learning-unit vocabulary, and no claim that reaching content means reading,
// completing or understanding it. The real dictionaries are loaded (not parsed as text).
import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import type { ChromeDict } from "./dictionary";

// The locale files import each other without an extension (bundler resolution); add ".ts" for node.
register("data:text/javascript," + encodeURIComponent(`
export async function resolve(specifier, context, next) {
    try { return await next(specifier, context); }
    catch (error) {
        if (specifier.startsWith(".") && !/\\.[a-z]+$/i.test(specifier)) return next(specifier + ".ts", context);
        throw error;
    }
}`));

const LOCALES = ["he", "en", "es", "ru", "ar", "ja"] as const;
const pulses: Record<string, ChromeDict["pulse"]> = {};
const chromes: Record<string, ChromeDict> = {};
for (const locale of LOCALES) {
    const { chrome } = await import(`./locales/${locale}/chrome.ts`);
    chromes[locale] = chrome;
    pulses[locale] = chrome.pulse;
}

/** Key paths with the kind of each leaf (string, or a function with its arity). */
function shape(value: unknown, path = ""): string[] {
    if (typeof value === "function") return [`${path}:fn${value.length}`];
    if (typeof value === "string") return [`${path}:string`];
    if (value && typeof value === "object") return Object.keys(value).sort().flatMap((k) => shape((value as Record<string, unknown>)[k], `${path}.${k}`));
    return [`${path}:${typeof value}`];
}

/** Every learner-visible string: plain strings, and every function called with representative inputs. */
function rendered(locale: string): string[] {
    const p = pulses[locale];
    const chapter = locale === "ja" ? "第8章" : "Chapter 8";
    return [
        p.brand, p.subtitle, p.chapters, p.mastered, p.learningProgress, p.latestScore, p.latestScoreValue(84),
        p.notAttempted, p.masteryAchieved, p.masteryNotYet, p.currentChapter, ...Object.values(p.bands),
        p.continue.start(chapter), p.continue.continue(chapter), p.continue.quiz(chapter), p.continue.finalExam, p.continue.resumeHere,
        p.accessInactive.title, p.accessInactive.body, p.expand, p.collapse,
        p.titled(chapter, "Title"), p.sentences(["A", "B"]), p.masteredSummary(6, 19), p.currentSummary(7, "Title"),
    ];
}

test("chrome.pulse exists in all six locales with identical structure", () => {
    const reference = shape(pulses.he);
    assert.ok(reference.length > 20);
    for (const locale of LOCALES) {
        assert.ok(pulses[locale], `${locale}: chrome.pulse`);
        assert.deepEqual(shape(pulses[locale]), reference, `${locale}: same keys and function arities as he`);
    }
});

test("the brand is exactly 'Learning Pulse' in every locale", () => {
    for (const locale of LOCALES) assert.equal(pulses[locale].brand, "Learning Pulse", locale);
    // The descriptive subtitle is localized (not left in English).
    const subtitles = LOCALES.map((l) => pulses[l].subtitle);
    assert.equal(new Set(subtitles).size, 6);
    assert.equal(pulses.he.subtitle, "חתימת הלמידה שלך");
});

test("every required copy family exists", () => {
    for (const locale of LOCALES) {
        const p = pulses[locale];
        assert.deepEqual(Object.keys(p.bands).sort(), ["all-reached", "in-progress", "not-started", "started", "well-advanced"], `${locale}: bands`);
        assert.deepEqual(Object.keys(p.continue).sort(), ["continue", "finalExam", "quiz", "resumeHere", "start"], `${locale}: continue (no final-exam-passed label)`);
        for (const key of ["learningProgress", "latestScore", "latestScoreValue", "notAttempted", "masteryAchieved", "masteryNotYet", "currentChapter"] as const) {
            assert.ok(p[key], `${locale}: focus strip / card ${key}`);
        }
        for (const key of ["titled", "sentences", "masteredSummary", "currentSummary"] as const) assert.equal(typeof p[key], "function", `${locale}: ${key}`);
        assert.ok(p.accessInactive.title && p.accessInactive.body, `${locale}: inactive access`);
        assert.ok(p.expand && p.collapse && p.expand !== p.collapse, `${locale}: expand/collapse`);
        // The final exam row reuses the existing, truthful progress and access copy.
        const { progress } = chromes[locale];
        assert.ok(progress.finalExam && progress.status.passed && progress.status.needsReview && progress.status.notTaken, `${locale}: final exam states`);
        assert.ok(chromes[locale].access.lockedLabel, `${locale}: locked label`);
    }
});

test("no missing or empty strings, and functions interpolate their inputs", () => {
    for (const locale of LOCALES) {
        for (const s of rendered(locale)) {
            assert.equal(typeof s, "string", locale);
            assert.ok(s.trim().length > 0, `${locale}: empty string`);
            assert.doesNotMatch(s, /undefined|NaN|\[object/, `${locale}: "${s}"`);
        }
        const p = pulses[locale];
        assert.match(p.latestScoreValue(84), /84/);
        assert.doesNotMatch(p.latestScoreValue(84), /%/, `${locale}: a score is not a percentage`);
        assert.match(p.masteredSummary(6, 19), /6/);
        assert.match(p.masteredSummary(6, 19), /19/);
        assert.match(p.currentSummary(7, "Title"), /7/);
        assert.match(p.continue.continue("X-8"), /X-8/, `${locale}: continue takes the formatted chapter label`);
    }
});

test("no internal learning-unit vocabulary, no 150, no completion or understanding claims", () => {
    const units = /\bunits?\b|learning unit|יחיד|unidad|единиц|وحد|ユニット|150/i;
    const claims: Record<string, RegExp> = {
        he: /הושלם|השלמת|קראת|נקרא|הבנת|הבין/,
        en: /complet|\bread\b|understood|understand/i,
        es: /complet|leíd|leíste|entend/i,
        ru: /заверш|прочит|понят|понял/i,
        ar: /اكتمل|مكتمل|أكمل|قرأ|فهم/,
        ja: /完了|読了|理解/,
    };
    for (const locale of LOCALES) {
        for (const s of rendered(locale)) {
            assert.doesNotMatch(s, units, `${locale}: "${s}"`);
            assert.doesNotMatch(s, claims[locale], `${locale}: "${s}"`);
        }
    }
});

test("the final exam is never called chapter 20, and RTL locales use their own punctuation", () => {
    for (const locale of LOCALES) {
        for (const s of rendered(locale)) assert.doesNotMatch(s, /20/, `${locale}: "${s}"`);
    }
    assert.match(pulses.ar.titled("الفصل 8", "عنوان"), /،/, "Arabic comma");
    assert.match(pulses.ja.sentences(["A", "B"]), /^A。B。$/, "Japanese full stops");
});

test("the 6 / 19 label says quizzes passed in all six locales", () => {
    const expected: Record<string, string> = {
        he: "מבדקים שעברו בהצלחה", en: "Quizzes passed", es: "Tests aprobados",
        ru: "Сдано тестов", ar: "اختبارات اجتيزت بنجاح", ja: "合格したテスト",
    };
    for (const l of LOCALES) {
        assert.equal(pulses[l].mastered, expected[l], l);
        assert.doesNotMatch(pulses[l].mastered, /attempt|נוסו|intent|попыт|محاول|受験済/i, `${l}: not "attempted"`);
    }
    assert.equal(pulses.he.learningProgress, "התקדמות בלמידה");
    assert.equal(pulses.en.masteredSummary(6, 19), "6 of 19 quizzes passed");
});

test("the final-exam destination eyebrow is localized in all six locales", () => {
    const expected: Record<string, string> = { he: "יעד הקורס", en: "Course goal", es: "Meta del curso", ru: "Цель курса", ar: "هدف الدورة", ja: "コースのゴール" };
    for (const l of LOCALES) assert.equal(pulses[l].courseDestination, expected[l], l);
    assert.equal(new Set(LOCALES.map((l) => pulses[l].courseDestination)).size, 6);
});

test("final exam card copy: state, summary and goal in all six locales", () => {
    assert.deepEqual(pulses.he.finalExamState, { notTaken: "לא בוצע", needsReview: "נדרש שיפור", passed: "עבר בהצלחה" });
    assert.equal(pulses.he.finalExamSummary, "המבחן המסכם של כל התכנים");
    for (const l of LOCALES) {
        const s = pulses[l].finalExamState;
        assert.equal(new Set([s.notTaken, s.needsReview, s.passed]).size, 3, `${l}: three distinct states`);
        assert.ok(pulses[l].finalExamSummary.trim().length > 0);
        assert.doesNotMatch(pulses[l].finalExamSummary, /150|20/);
    }
});
