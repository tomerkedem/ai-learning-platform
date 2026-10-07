// Quiz accessibility: the answered state reaches screen readers as text, and keyboard focus is never
// dropped to <body> by a control that becomes disabled or unmounts under it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { optionVerdict } from "./assessmentScreen.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ENGINE = readFileSync(join(HERE, "AssessmentEngine.tsx"), "utf8");
const LOCALES = ["he", "en", "es", "ru", "ar", "ja"] as const;

test("optionVerdict names the selected, correct and wrong options only after answering", () => {
    const v = (showResult: boolean, isSelected: boolean, isCorrect: boolean) => optionVerdict({ showResult, isSelected, isCorrect });
    assert.deepEqual(v(false, true, true), [], "still choosing: nothing extra");
    assert.deepEqual(v(true, true, true), ["yourAnswer", "verdictCorrect"]);
    assert.deepEqual(v(true, true, false), ["yourAnswer", "verdictWrong"]);
    assert.deepEqual(v(true, false, true), ["verdictCorrect"], "the correct answer after a wrong choice");
    assert.deepEqual(v(true, false, false), [], "an unchosen wrong option stays plain");
});

test("every locale carries the option verdict labels", () => {
    for (const locale of LOCALES) {
        const src = readFileSync(join(HERE, "..", "..", "i18n", "locales", locale, "chrome.ts"), "utf8");
        for (const key of ["yourAnswer", "verdictCorrect", "verdictWrong"]) {
            assert.ok(new RegExp(`${key}: '[^']+'`).test(src), `${locale}: assessment.${key}`);
        }
    }
});

test("answered options stay focusable and expose their verdict", () => {
    assert.match(ENGINE, /aria-disabled=\{showResult && !isReviewMode \? true : undefined\}/);
    assert.doesNotMatch(ENGINE, /disabled=\{showResult && !isReviewMode\}/, "native disabled drops focus to body");
    assert.match(ENGINE, /optionVerdict\(\{ showResult, isSelected, isCorrect \}\)\.map\(\(k\) => a\[k\]\)/);
});

test("the feedback live region exists before the answer arrives", () => {
    assert.match(ENGINE, /<div role="status" aria-live="polite">\s*<AnimatePresence>\s*\{\(isAnswered \|\| isReviewMode\)/);
});

test("navigation and submission move focus to the new screen's heading", () => {
    assert.match(ENGINE, /<h3 ref=\{questionHeadingRef\} tabIndex=\{-1\}/);
    assert.match(ENGINE, /<h2 ref=\{resultHeadingRef\} tabIndex=\{-1\}/);
    // Continue/Back set 'question'; finishing the quiz or the review sets 'result'.
    assert.equal(ENGINE.match(/pendingFocus\.current = 'question'/g)?.length, 2);
    assert.equal(ENGINE.match(/pendingFocus\.current = 'result'/g)?.length, 2);
});
