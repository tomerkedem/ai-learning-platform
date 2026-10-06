// Learning Pulse geometry: 19 petals, Chapter 1 at 12 o'clock, clockwise, identical in every locale.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    PETAL, PETAL_COUNT, PETAL_STEP_DEG, PULSE_HALF, PULSE_VIEWBOX,
    MARKER_GAP, PETAL_DRAWN_EXTENT, fillRadius, isPetalChapter, markerPlacement, nodeCenter, petalAngle, petalExtent, petalPath, petalPoint, petalTransform, wedgePath,
} from "./learningPulseGeometry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHAPTERS = Array.from({ length: 19 }, (_, i) => i + 1);

test("exactly 19 petals, evenly spaced around the full circle", () => {
    assert.equal(PETAL_COUNT, 19);
    assert.ok(Math.abs(PETAL_STEP_DEG * PETAL_COUNT - 360) < 1e-9);
    const angles = CHAPTERS.map(petalAngle);
    assert.equal(new Set(angles).size, 19);
    angles.slice(1).forEach((a, i) => assert.ok(a > angles[i], "strictly increasing"));
    assert.ok(angles[18] < 360);
    for (const bad of [0, 20, 1.5, Number.NaN]) {
        assert.equal(isPetalChapter(bad), false);
        assert.throws(() => petalAngle(bad), RangeError);
    }
});

test("Chapter 1 is at 12 o'clock and chapters proceed clockwise", () => {
    assert.equal(petalAngle(1), 0);
    assert.deepEqual(petalPoint(1, 100), { x: 0, y: -100 });
    assert.equal(petalTransform(1), "rotate(0)");
    // Clockwise in screen space (y down): chapters 2-10 on the right, 11-19 on the left.
    for (const n of CHAPTERS.slice(1, 10)) assert.ok(petalPoint(n, 100).x > 0, `chapter ${n} right`);
    for (const n of CHAPTERS.slice(10)) assert.ok(petalPoint(n, 100).x < 0, `chapter ${n} left`);
    assert.ok(petalPoint(5, 100).y < 0 && petalPoint(6, 100).y > 0, "passes 3 o'clock between chapters 5 and 6");
    assert.ok(petalPoint(19, 100).y < 0, "chapter 19 is just before 12 o'clock");
});

test("all positions are unique and the output is deterministic", () => {
    const points = CHAPTERS.map((n) => petalPoint(n, PETAL.outerRadius));
    assert.equal(new Set(points.map((p) => `${p.x},${p.y}`)).size, 19);
    assert.deepEqual(CHAPTERS.map((n) => petalPoint(n, PETAL.outerRadius)), points);
    assert.equal(petalPath(), petalPath());
    assert.equal(petalTransform(7), "rotate(113.684)");
    assert.equal(PULSE_VIEWBOX, "-120 -120 240 240");
});

test("geometry does not depend on locale, direction or the browser", () => {
    const src = readFileSync(join(HERE, "learningPulseGeometry.ts"), "utf8");
    assert.doesNotMatch(src, /^import /m, "no imports");
    const code = src.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    assert.doesNotMatch(code, /\b(?:rtl|ltr|locale|dir|document|window|navigator)\b/i, "no locale, direction or browser API");
    assert.equal(petalAngle.length, 1, "the angle depends only on the chapter");
    assert.equal(petalPoint.length, 2, "a point depends only on the chapter and the radius");
});

test("petal shape: node inside the outer cap, emphasis inside the viewBox, no negative widths", () => {
    assert.ok(PETAL.nodeRadius < PETAL.outerHalfWidth);
    assert.deepEqual(nodeCenter(), { x: 0, y: -PETAL.outerRadius });
    assert.ok(petalExtent(2).outer <= PULSE_HALF, "an emphasis outline still fits");
    assert.ok(petalExtent().inner > 0, "petals never reach the centre");
    assert.equal(petalPath(), "M4.169 -35.495L11.218 -93.64A11.3 11.3 0 1 0 -11.218 -93.64L-4.169 -35.495A4.2 4.2 0 0 0 4.169 -35.495Z");
    assert.equal(petalPath(-20), "M0 -36L0 -95A0 0 0 1 0 0 -95L0 -36A0 0 0 0 0 0 -36Z", "a large inset clamps the widths at 0");
    assert.equal(petalPath(1.5), "M5.659 -35.314L12.707 -93.46A12.8 12.8 0 1 0 -12.707 -93.46L-5.659 -35.314A5.7 5.7 0 0 0 5.659 -35.314Z");
    // The sides are true tangents: each side point lies exactly on its end circle.
    const [x, y] = [5.659 - 0, -35.314 + 36];
    assert.ok(Math.abs(Math.hypot(x, y) - 5.7) < 0.01);
});

test("progress fill clamps safely at 0 and 1 and never reaches the mastery node", () => {
    assert.equal(fillRadius(0), 0);
    assert.equal(fillRadius(-0.5), 0);
    assert.equal(fillRadius(Number.NaN), 0);
    const end = PETAL.outerRadius - PETAL.nodeRadius - PETAL.fillGap;
    assert.equal(fillRadius(1), +end.toFixed(3));
    assert.equal(fillRadius(2), fillRadius(1));
    assert.ok(fillRadius(1) < PETAL.outerRadius - PETAL.nodeRadius, "full progress stops before the node");
    assert.ok(fillRadius(0.001) >= petalExtent().inner, "any progress starts at the inner tip");
    const steps = [0.1, 0.25, 0.5, 0.75, 0.9, 1].map((r) => fillRadius(r));
    steps.slice(1).forEach((r, i) => assert.ok(r > steps[i], "monotonic"));
});

test("neighbouring petals keep a visible gap around the outer ring", () => {
    // Petal width at the outer centre versus the arc between neighbouring petal axes there.
    const arc = (2 * Math.PI * PETAL.outerRadius) / PETAL_COUNT;
    assert.ok(arc - 2 * PETAL.outerHalfWidth > 7, "a clear outer gap");
    assert.ok(2 * PETAL.outerHalfWidth > arc * 0.65, "still substantial glass petals");
    const innerArc = (2 * Math.PI * PETAL.innerRadius) / PETAL_COUNT;
    assert.ok(innerArc - 2 * PETAL.innerHalfWidth > 2, "a gap at the inner end too");
});

test("course-map hit wedges: exactly one petal step wide, so neighbours meet without overlap or gap", () => {
    const d = wedgePath(31, 124);
    const nums = (d.match(/-?[\d.]+/g) ?? []).map(Number);
    const [x0, y0, x1, y1] = nums;
    const half = (PETAL_STEP_DEG / 2) * (Math.PI / 180);
    assert.ok(Math.abs(Math.atan2(-x0, -y0) - half) < 1e-3 && Math.abs(Math.atan2(-x1, -y1) - half) < 1e-3, "edges at -half step");
    assert.ok(Math.abs(Math.hypot(x0, y0) - 31) < 1e-2 && Math.abs(Math.hypot(x1, y1) - 124) < 1e-2);
    assert.equal(PETAL_STEP_DEG * PETAL_COUNT, 360, "19 wedges tile the full circle");
});

test("chapter-number markers sit outside every petal, extend away from it, and stay attached", () => {
    // The largest drawn petal: the current (x1.05) petal with its outline; every other petal is smaller.
    assert.equal(PETAL_DRAWN_EXTENT, +(((PETAL.outerRadius + PETAL.outerHalfWidth + 1.6 + 0.75) * 1.05).toFixed(3)));
    const clear = PETAL_DRAWN_EXTENT + MARKER_GAP;
    for (const n of CHAPTERS) {
        for (const size of [9, 10, 11]) {
            const m = markerPlacement(n, size, String(n));
            const { x0, y0, x1, y1 } = m.box;
            const nearest = Math.hypot(x0 > 0 ? x0 : x1 < 0 ? -x1 : 0, y0 > 0 ? y0 : y1 < 0 ? -y1 : 0);
            assert.ok(nearest >= clear - 1e-3, `chapter ${n} @${size}: the whole number clears every petal and the gap`);
            assert.ok(Math.hypot(m.x, m.y) < clear + 3, `chapter ${n} @${size}: still attached (not pushed far out)`);
            // Same radial direction as the petal (clockwise from 12, never mirrored).
            const p = petalPoint(n, 1);
            assert.ok(Math.abs(Math.atan2(m.x, -m.y) - Math.atan2(p.x, -p.y)) < 1e-3);
            // Text grows away from the petal: right side -> start, left side -> end, top/bottom -> middle.
            assert.equal(m.anchor, p.x > 0.3 ? "start" : p.x < -0.3 ? "end" : "middle");
            assert.equal(m.baseline, -p.y > 0.3 ? "alphabetic" : -p.y < -0.3 ? "hanging" : "central");
        }
    }
    assert.equal(markerPlacement(1, 9, "1").anchor, "middle", "Chapter 1 at 12 o'clock, centred above its petal");
    assert.equal(markerPlacement(17, 11, "17").anchor, "end", "two digits on the left side extend leftwards, away from the petal");
});
