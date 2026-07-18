// בדיקות יחידה לפונקציות הטהורות של מרחב המשמעות (פרק 5).
//
// המעבדה היא בחירה-בלבד: הנקודות קבועות במיקומן הלימודי המקורי ואינן ניתנות להזזה.
// רק בחירת משפט (activeId) משנה את המשפט הפעיל, וחישוב השכנים נגזר תמיד מהקואורדינטות
// הקבועות של PHRASES. הבדיקות כאן מוודאות בדיוק את החוזה הזה, ואינן נוגעות ב-DOM,
// בגודל מסך או בכיווניות (אלו אינם קלט של החישוב).
//
// הרצה: npm test  (node --test עם הפשטת טיפוסים מובנית של Node, בלי תלות חדשה).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    PHRASES,
    ANCHOR_ID,
    findPhrase,
    distance,
    closenessTone,
    proximityScore,
    rankNeighbors,
    type PhraseId,
} from './semanticSpace.ts';

/* 1. כל 12 הנקודות הקבועות קיימות, עם מזהים ייחודיים. */
test('all 12 fixed points exist with unique ids', () => {
    assert.equal(PHRASES.length, 12);
    assert.equal(new Set(PHRASES.map((p) => p.id)).size, 12);
});

/* 2. לכל משפט קואורדינטה מקורית אחת, מספרית ויציבה (findPhrase דטרמיניסטי). */
test('every phrase has one immutable numeric coordinate', () => {
    for (const p of PHRASES) {
        assert.equal(typeof p.x, 'number');
        assert.equal(typeof p.y, 'number');
        const found = findPhrase(p.id);
        assert.ok(found);
        assert.equal(found.x, p.x);
        assert.equal(found.y, p.y);
    }
});

/* 3. הדירוג מחריג את המשפט הנבחר עצמו. */
test('neighbour ranking excludes the selected point itself', () => {
    const ranked = rankNeighbors(ANCHOR_ID);
    assert.equal(ranked.length, PHRASES.length - 1);
    assert.ok(!ranked.some((r) => r.phrase.id === ANCHOR_ID));
});

/* 4. אותו משפט נבחר מפיק תמיד את אותו סדר בדיוק (דטרמיניזם). */
test('the same selected point always produces the same ordering', () => {
    const a = rankNeighbors(ANCHOR_ID).map((r) => [r.phrase.id, proximityScore(r.dist)]);
    const b = rankNeighbors(ANCHOR_ID).map((r) => [r.phrase.id, proximityScore(r.dist)]);
    assert.deepEqual(a, b);
});

/* 5. עבור "החבילה לא הגיעה", "המשלוח מתעכב" מדורג ראשון. */
test('not-arrived ranks delayed first', () => {
    assert.equal(rankNeighbors('not-arrived')[0].phrase.id, 'delayed');
});

/* 6. "החבילה הגיעה" אינו מסווג כ-near ביחס ל"החבילה לא הגיעה" (מהפך משמעות). */
test('arrived is not classified as "near" for not-arrived', () => {
    const d = distance(findPhrase('not-arrived')!, findPhrase('arrived')!);
    assert.notEqual(closenessTone(d), 'near');
});

/* 7. משפטים לא קשורים נשארים "far" מ"החבילה לא הגיעה". */
test('unrelated phrases remain "far" from not-arrived', () => {
    const from = findPhrase('not-arrived')!;
    for (const id of ['recipe', 'weather'] as PhraseId[]) {
        assert.equal(closenessTone(distance(from, findPhrase(id)!)), 'far');
    }
});

/* 8. שובר שוויון דטרמיניסטי: המיון עולה במרחק, ובמרחק זהה נשבר לפי מזהה עולה.
   בקואורדינטות הקבועות אין שוויון-מרחק מדויק, ולכן שובר-השוויון לפי המזהה הוא רשת
   ביטחון דטרמיניסטית; הבדיקה מאמתת את האינווריאנטה עבור כל משפט פעיל. */
test('ordering is deterministic: non-decreasing distance, ties broken by id', () => {
    for (const active of PHRASES.map((p) => p.id)) {
        const ranked = rankNeighbors(active);
        for (let i = 1; i < ranked.length; i++) {
            const prev = ranked[i - 1];
            const cur = ranked[i];
            assert.ok(prev.dist <= cur.dist, 'distances must be non-decreasing');
            if (prev.dist === cur.dist) {
                assert.ok(prev.phrase.id < cur.phrase.id, 'equal distances must order by id');
            }
        }
    }
});

/* 9. ציון הקרבה חסום ל-0..100 ומונוטוני במרחק. */
test('proximity score is clamped to 0..100 and monotonic in distance', () => {
    assert.equal(proximityScore(0), 100);
    assert.equal(proximityScore(1000), 0);
    assert.ok(proximityScore(1) > proximityScore(5));
    for (const d of [0, 1, 2, 5, 10, 20, 50]) {
        const s = proximityScore(d);
        assert.ok(s >= 0 && s <= 100);
        assert.equal(s, Math.round(s));
    }
});

/* 10. הדירוג משתמש רק בקואורדינטות הקבועות: אין פרמטר קואורדינטות (arity 1), ואי אפשר
   להזין מיקום שהמשתמש הזיז. המרחקים תואמים בדיוק את הקואורדינטות המאוחסנות. */
test('ranking uses only stored coordinates and cannot receive a moved coordinate', () => {
    assert.equal(rankNeighbors.length, 1); // מזהה בלבד, אין פרמטר positions
    const from = findPhrase('not-arrived')!;
    for (const r of rankNeighbors('not-arrived')) {
        assert.equal(r.dist, distance(from, findPhrase(r.phrase.id)!));
    }
});
