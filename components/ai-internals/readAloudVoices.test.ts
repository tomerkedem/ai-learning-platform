// Read Aloud voice matching and capability: the pure rules shared by useReadAloud and SpeakButton.
// A known wrong-language voice is never selected, and an empty voice list is never "unavailable".
import { test } from "node:test";
import assert from "node:assert/strict";
import { knownWrongLanguage, matchVoices, pickVoiceURI, voiceCapability } from "./readAloudLang.ts";

const v = (voiceURI: string, lang: string, localService = true) => ({ voiceURI, lang, localService });
const uris = (list: { voiceURI: string }[]) => list.map((x) => x.voiceURI);

test("matches by base language and excludes other languages", () => {
    const all = [v("en", "en-US"), v("he", "he-IL"), v("ar", "ar-SA"), v("he-net", "he-IL", false)];
    assert.deepEqual(uris(matchVoices(all, "he-IL")), ["he", "he-net"]);
    assert.deepEqual(uris(matchVoices(all, "ar")), ["ar"]);
    // a lookalike prefix is a different language, not a base match
    assert.deepEqual(uris(matchVoices([v("x", "jam-JM")], "ja-JP")), []);
});

test("exact locale first, then local before network", () => {
    const all = [v("gb-local", "en-GB"), v("us-net", "en-US", false), v("us-local", "en-US"), v("au-net", "en-AU", false)];
    assert.deepEqual(uris(matchVoices(all, "en-US")), ["us-local", "us-net", "gb-local", "au-net"]);
});

test("underscore and case are normalized in language tags", () => {
    const all = [v("es-mx", "es_MX"), v("es-es", "ES_es", false)];
    assert.deepEqual(uris(matchVoices(all, "es-ES")), ["es-es", "es-mx"]);
});

test("no matching voice yields an empty list and no selection", () => {
    const matched = matchVoices([v("en", "en-US"), v("ja", "ja-JP")], "he-IL");
    assert.deepEqual(matched, []);
    assert.equal(pickVoiceURI(matched, "en"), null);
});

test("remembered matching voice wins; a missing or wrong-language one falls back to the top match", () => {
    const matched = matchVoices([v("ru-a", "ru-RU"), v("ru-b", "ru-RU", false)], "ru-RU");
    assert.equal(pickVoiceURI(matched, "ru-b"), "ru-b");
    assert.equal(pickVoiceURI(matched, "gone"), "ru-a");
    assert.equal(pickVoiceURI(matched, "en-voice"), "ru-a");
    assert.equal(pickVoiceURI(matched, null), "ru-a");
});

test("capability: empty list stays unknown, settling decides unavailable", () => {
    assert.equal(voiceCapability(0, 0, false), "unknown");
    assert.equal(voiceCapability(0, 0, true), "unknown");
    assert.equal(voiceCapability(3, 0, false), "unknown");
    assert.equal(voiceCapability(3, 0, true), "unavailable");
    assert.equal(voiceCapability(3, 1, false), "available");
    assert.equal(voiceCapability(3, 1, true), "available");
});

test("speech is blocked only for a known wrong-language list", () => {
    assert.equal(knownWrongLanguage(0, 0), false);
    assert.equal(knownWrongLanguage(2, 0), true);
    assert.equal(knownWrongLanguage(2, 1), false);
});
