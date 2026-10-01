// מטריצת הגישה: רק הרשאה פעילה פותחת תוכן מוגן. כל מצב אחר מקבל את התצוגה המקדימה של המבוא
// בלבד. בנוסף, בדיקת חיווט: כל עמוד מוגן עובר דרך openCourseContent בלי מסלול עוקף, ומחזיר
// מסך נעילה או תצוגה מקדימה כשאין הרשאה. (האכיפה עצמה בשרת ובמסד, בכל בקשה.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hasCourseAccess, isProtectedCoursePath, type AccessStatus } from "./access.ts";

const COURSE = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCKED: AccessStatus[] = ["signed-out", "unconfirmed", "no-grant", "expired", "revoked", "suspended", "unavailable"];

test("only an active grant opens protected content", () => {
    for (const status of LOCKED) assert.equal(hasCourseAccess(status), false, status);
    assert.equal(hasCourseAccess("active"), true);
});

test("sidebar marks every chapter (including chapter 1) and the final exam as protected", () => {
    for (let n = 1; n <= 19; n++) assert.equal(isProtectedCoursePath(`/behind-the-scenes-ai/chapter-${n}`), true, `chapter-${n}`);
    assert.equal(isProtectedCoursePath("/behind-the-scenes-ai/final-exam"), true);
    for (const href of ["/behind-the-scenes-ai/introduction", "/behind-the-scenes-ai/about", "/behind-the-scenes-ai/chapter-1/x", "/python/chapter-1", "", null, undefined]) {
        assert.equal(isProtectedCoursePath(href), false, String(href));
    }
});

test("every protected page is gated by openCourseContent with no lower access level", () => {
    const pages = readdirSync(COURSE).filter((d) => /^chapter-\d+$/.test(d) || d === "final-exam" || d === "introduction");
    assert.equal(pages.length, 21); // introduction + 19 chapters + final exam
    for (const dir of pages) {
        const src = readFileSync(join(COURSE, dir, "page.tsx"), "utf8");
        assert.match(src, /await openCourseContent\(\{/, dir);
        assert.doesNotMatch(src, /level\s*:/, `${dir} must not request a lower access level`);
        const fallback = dir === "introduction" ? "IntroPreview" : "LockedChapter";
        assert.match(src, new RegExp(`if \\(!gate\\.open\\) return <${fallback} access=\\{gate\\.access\\}`), `${dir} returns ${fallback} without content`);
    }
    const gate = readFileSync(join(COURSE, "_access", "courseAccess.ts"), "utf8");
    assert.match(gate, /if \(!hasCourseAccess\(access\.status\)\) return \{ open: false, access \};/);
});

// ── בקשת בטא: אין גרסת הסכמה כל עוד בתנאים יש טיוטה (בשום שפה), ולהפך ──
test("beta requests stay disabled while the Beta Terms contain a draft placeholder", async () => {
    const { BETA_TERMS_VERSION } = await import("./access.ts");
    const drafts: string[] = [];
    for (const l of ["he", "en", "es", "ru", "ar", "ja"]) {
        const { infoPages } = await import(`../../../../i18n/locales/${l}/behind-ai/infoPages.ts`);
        for (const b of infoPages.pages.betaTerms.blocks) if (b.kind === "placeholder") drafts.push(`${l}: ${b.heading}`);
    }
    if (drafts.length) assert.equal(BETA_TERMS_VERSION, null, `version set while drafts remain: ${drafts.join(", ")}`);
    else assert.match(String(BETA_TERMS_VERSION), /^\d{4}-\d{2}-\d{2}(\.\d+)?$/);
    // השרת חוסם גם כן, בלי קשר ללקוח.
    const actions = readFileSync(join(COURSE, "_access", "betaActions.ts"), "utf8");
    assert.match(actions, /if \(!BETA_TERMS_VERSION \|\| BETA_TERMS_HAVE_PLACEHOLDERS\) return "terms_unavailable";/);
});

// ── אורח: מצב (אורח) ופעולה (התחברות / יצירת חשבון) נפרדים, בכל שש השפות ──
test("guest account summary shows the guest state and a separate sign-in / create-account action", () => {
    // chrome.ts מייבא ערכים מ-he בלי סיומת, ולכן נקרא כטקסט (הצורה נבדקת ב-tsc).
    for (const l of ["he", "en", "es", "ru", "ar", "ja"]) {
        const src = readFileSync(join(COURSE, "..", "..", "..", "i18n", "locales", l, "chrome.ts"), "utf8");
        const value = (k: string) => new RegExp(`\\n        ${k}: (['"])(.+?)\\1,`).exec(src)?.[2];
        for (const k of ["guest", "summarySignedOut", "signInTitle", "signUpTitle", "noAccount", "haveAccount"]) {
            assert.ok(value(k)?.trim(), `${l}.${k}`);
        }
        assert.notEqual(value("guest"), value("summarySignedOut"), l);
    }
    const panel = readFileSync(join(COURSE, "AccountPanel.tsx"), "utf8");
    assert.match(panel, /\{a\.guest\}<\/span>[\s\S]{0,400}\{a\.summarySignedOut\}/);
});

// ── Light: תוכן הלומדה עוקב אחרי הערכה. אין "איי Dark" כפויים (data-theme="dark") ──
test("no forced-Dark island in learner-facing course content", () => {
    const ROOT = join(COURSE, "..", "..", "..");
    const offenders: string[] = [];
    const walk = (dir: string) => {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
            if (e.name === "_parked" || e.name === "node_modules") continue;
            const p = join(dir, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name.endsWith(".tsx") && /data-theme="dark"/.test(readFileSync(p, "utf8"))) offenders.push(p);
        }
    };
    walk(COURSE);
    walk(join(ROOT, "components", "ai-internals"));
    assert.deepEqual(offenders, []);

    const read = (...p: string[]) => readFileSync(join(ROOT, ...p), "utf8");
    // ממצא QA (פרק 19) ושלושת הרכיבים שהיו נעולים: כל טקסט/משטח כהה מקבל ערך Light.
    // מחלקה כהה מדויקת (לא חלק מ-hover:/light:/מחלקה ארוכה יותר) שאחריה אין דריסת light:.
    const bareDark = (line: string, cls: string) =>
        new RegExp(`(?<![\\w:/\\[-])${cls.replace("/", "\\/")}(?![\\w/\\]-])(?! light:)`).test(line);
    for (const file of [
        ["components", "ai-internals", "FullTraceLab.tsx"],
        ["components", "ai-internals", "ChatInterfacePanel.tsx"],
        ["app", "(course)", "behind-the-scenes-ai", "chapter-1", "GlassEnginePanel.tsx"],
    ]) {
        // שורת הדגשת הטוקן בבועת המשתמש (על רקע accent מלא) זהה בשתי הערכות במכוון.
        const lines = read(...file).split(/\r?\n/).filter((l) => !l.includes("font-[inherit] text-inherit"));
        for (const cls of ["text-white", "text-slate-100", "text-slate-200", "text-slate-300", "bg-slate-900", "bg-slate-950", "bg-slate-950/40", "border-white/10"]) {
            assert.ok(!lines.some((l) => bareDark(l, cls)), `${file.at(-1)}: ${cls} without a light: override`);
        }
    }
    const holo = read("app", "(course)", "behind-the-scenes-ai", "chapter-1", "HoloFrame.tsx");
    assert.match(holo, /bg-slate-950 light:bg-\[var\(--bts-panel-to\)\]/);
    assert.match(holo, /mix-blend-screen light:mix-blend-multiply/);
    const dna = read("app", "(course)", "behind-the-scenes-ai", "chapter-4", "components", "MeaningDnaStrip.tsx");
    assert.match(dna, /light:from-slate-50/);
    assert.doesNotMatch(dna, /stroke=\{color[AB]\.hex\}|backgroundColor: color[AB]\.hex/);
    const verdict = read("components", "ai-internals", "GuessVerdict.tsx");
    assert.equal((verdict.match(/light:from-(emerald|cyan)-50 light:to-white/g) ?? []).length, 2);
});
