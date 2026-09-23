// בדיקות יחידה לאינווריאנטות המבניות של מעבדת הקשב (פרק 6, Attention), בשש השפות.
//
// tokens/weights/pair לכל variant ולכל focus state נכתבים ידנית לכל שפה בנפרד (אין
// חישוב runtime). הבדיקות כאן לא בודקות תרגום או ניסוח, אלא רק את החוזה המבני שרכיבי
// AttentionSentenceLab מניחים: אורך weights תואם tokens, pair בתוך התחום, ושהמשפט
// המשותף של focus הוא אכן אותו משפט שמכיל גם את זוג הסתירה וגם את זוג הכינוי (כפי
// שה-variant 'pronoun' מגדיר אותו) - זו הדרישה שה-focus section חייב לעמוד בה בכל שפה.
//
// הרצה: node --test app/behind-the-scenes-ai/chapter-6/attentionLabInvariants.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { attentionLab as he } from '../../../i18n/locales/he/behind-ai/attentionLab.ts';
import { attentionLab as en } from '../../../i18n/locales/en/behind-ai/attentionLab.ts';
import { attentionLab as es } from '../../../i18n/locales/es/behind-ai/attentionLab.ts';
import { attentionLab as ru } from '../../../i18n/locales/ru/behind-ai/attentionLab.ts';
import { attentionLab as ar } from '../../../i18n/locales/ar/behind-ai/attentionLab.ts';
import { attentionLab as ja } from '../../../i18n/locales/ja/behind-ai/attentionLab.ts';
import type { AttentionLabContent } from '../../../i18n/locales/he/behind-ai/attentionLab.ts';

const LOCALES: Record<string, AttentionLabContent> = { he, en, es, ru, ar, ja };
const EXPECTED_VARIANT_IDS = ['base', 'no-abal', 'status', 'broken', 'pronoun'];
const EXPECTED_FOCUS_STATE_IDS = ['contradiction', 'pronoun'];

for (const [locale, data] of Object.entries(LOCALES)) {
    test(`${locale}: has exactly the five expected variants, in order`, () => {
        assert.deepEqual(data.variants.map((v) => v.id), EXPECTED_VARIANT_IDS);
    });

    test(`${locale}: every variant's weights length matches its tokens length`, () => {
        for (const v of data.variants) {
            assert.equal(v.weights.length, v.tokens.length, `variant ${v.id}`);
        }
    });

    test(`${locale}: every variant's pair indexes are within token bounds`, () => {
        for (const v of data.variants) {
            const [a, b] = v.pair;
            assert.ok(a >= 0 && a < v.tokens.length, `variant ${v.id} pair[0]`);
            assert.ok(b >= 0 && b < v.tokens.length, `variant ${v.id} pair[1]`);
            assert.notEqual(a, b, `variant ${v.id} pair must reference two distinct tokens`);
        }
    });

    test(`${locale}: the "status" variant never keeps a strong contradiction`, () => {
        const status = data.variants.find((v) => v.id === 'status')!;
        assert.equal(status.tension, 'low');
        assert.ok(status.pairStrength <= 0.3, 'status variant must resolve the contradiction (low pairStrength)');
    });

    test(`${locale}: the "base" and "pronoun" variants each carry a strong link`, () => {
        const base = data.variants.find((v) => v.id === 'base')!;
        const pronoun = data.variants.find((v) => v.id === 'pronoun')!;
        assert.equal(base.tension, 'high');
        assert.ok(base.pairStrength >= 0.7);
        assert.equal(pronoun.tension, 'high');
        assert.ok(pronoun.pairStrength >= 0.7);
    });

    test(`${locale}: focus has exactly the two expected states, in order`, () => {
        assert.deepEqual(data.focus.states.map((s) => s.id), EXPECTED_FOCUS_STATE_IDS);
    });

    test(`${locale}: every focus state's weights length matches focus.tokens length`, () => {
        for (const s of data.focus.states) {
            assert.equal(s.weights.length, data.focus.tokens.length, `focus state ${s.id}`);
        }
    });

    test(`${locale}: every focus state's pair indexes are within focus.tokens bounds`, () => {
        for (const s of data.focus.states) {
            const [a, b] = s.pair;
            assert.ok(a >= 0 && a < data.focus.tokens.length, `focus state ${s.id} pair[0]`);
            assert.ok(b >= 0 && b < data.focus.tokens.length, `focus state ${s.id} pair[1]`);
        }
    });

    // הדרישה הלא-משתנה של ה-focus section: אותו משפט חייב לתמוך גם בזוג הסתירה וגם
    // בזוג הכינוי בו-זמנית. ה-variant 'pronoun' הוא תמיד המשפט שמכיל את שניהם (בעברית,
    // אנגלית, ספרדית, רוסית וערבית זהה גם ל-'base'; ביפנית שונה מ-'base' כי היא מוסיפה
    // את "それ"), ולכן focus.tokens חייב להיות זהה בדיוק למערך הטוקנים של ה-variant הזה.
    test(`${locale}: focus.tokens is exactly the "pronoun" variant's tokens (the dual-purpose sentence)`, () => {
        const pronoun = data.variants.find((v) => v.id === 'pronoun')!;
        assert.deepEqual(data.focus.tokens, pronoun.tokens);
    });

    test(`${locale}: focus "contradiction" state points at the same pair as the "base" variant`, () => {
        const base = data.variants.find((v) => v.id === 'base')!;
        const contradiction = data.focus.states.find((s) => s.id === 'contradiction')!;
        // בעברית/אנגלית/ספרדית/רוסית/ערבית ל-base ול-focus.tokens אותו אורך, ולכן אותו pair
        // מצביע על אותן שתי מילים. ביפנית focus.tokens ארוך יותר (כולל それ), כך שרק אורך
        // המערך עשוי להשתנות - אבל שני האינדקסים חייבים עדיין להצביע על אותן שתי המילים.
        assert.equal(data.focus.tokens[contradiction.pair[0]], base.tokens[base.pair[0]]);
        assert.equal(data.focus.tokens[contradiction.pair[1]], base.tokens[base.pair[1]]);
    });

    test(`${locale}: focus "pronoun" state points at the same pair as the "pronoun" variant`, () => {
        const pronoun = data.variants.find((v) => v.id === 'pronoun')!;
        const pronounState = data.focus.states.find((s) => s.id === 'pronoun')!;
        assert.deepEqual(pronounState.pair, pronoun.pair);
    });
}
