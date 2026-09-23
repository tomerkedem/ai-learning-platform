// בדיקות לפתרון השפה ההתחלתית של הלומדה (resolveLocale ב-config.ts).
// הרצה: node --test i18n/config.test.ts  (הפשטת טיפוסים מובנית של Node, בלי תלות חדשה).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { resolveLocale, localeFromAcceptLanguage, LOCALE_LIST, LOCALES, dirOf } from './config.ts';

test('registry: six locales in selector order, RTL only for he/ar', () => {
    assert.deepEqual(LOCALE_LIST, ['he', 'en', 'es', 'ru', 'ar', 'ja']);
    assert.deepEqual(LOCALE_LIST.filter((l) => dirOf(l) === 'rtl'), ['he', 'ar']);
    for (const l of LOCALE_LIST) assert.equal(LOCALES[l].htmlLang, l);
});

test('explicit cookie choice overrides browser preference and country', () => {
    assert.equal(resolveLocale({ cookie: 'ar', acceptLanguage: 'ja,en;q=0.9', country: 'JP' }), 'ar');
});

test('invalid cookie falls through to the browser language', () => {
    for (const cookie of ['xx', 'EN', '', 'he; drop', '__proto__', 'toString']) {
        assert.equal(resolveLocale({ cookie, acceptLanguage: 'ru-RU,ru;q=0.9' }), 'ru', cookie);
    }
});

test('Accept-Language: q-weights, region subtags, legacy iw, unsupported skipped', () => {
    assert.equal(localeFromAcceptLanguage('fr-FR,fr;q=0.9,es;q=0.8,en;q=0.7'), 'es');
    assert.equal(localeFromAcceptLanguage('en;q=0.2,ja;q=0.8'), 'ja');
    assert.equal(localeFromAcceptLanguage('pt-BR, he-IL;q=0.5'), 'he');
    assert.equal(localeFromAcceptLanguage('iw'), 'he');
    assert.equal(localeFromAcceptLanguage('AR-eg'), 'ar');
    assert.equal(localeFromAcceptLanguage('he;q=0,en;q=0.1'), 'en');
});

test('invalid or unsupported Accept-Language yields null', () => {
    for (const h of [null, undefined, '', '*', 'fr,de;q=0.9', ';;;,', 'en;q=abc', 'q=1']) {
        assert.equal(localeFromAcceptLanguage(h), null, String(h));
    }
});

test('country hint applies only after cookie and browser language', () => {
    assert.equal(resolveLocale({ acceptLanguage: 'fr', country: 'jp' }), 'ja');
    assert.equal(resolveLocale({ acceptLanguage: 'en', country: 'JP' }), 'en');
    assert.equal(resolveLocale({ acceptLanguage: null, country: 'IL' }), 'he');
});

test('fallback is English', () => {
    assert.equal(resolveLocale({}), 'en');
    assert.equal(resolveLocale({ cookie: 'bogus', acceptLanguage: 'fr', country: 'FR' }), 'en');
    assert.equal(resolveLocale({ country: 'ZZ' }), 'en');
});
