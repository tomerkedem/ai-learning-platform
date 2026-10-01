// מסמכים משפטיים: מה נכנס לטביעת האצבע, שש השפות, חסימת טיוטות והחיווט לשרת ולמסד.
// התנהגות המסד עצמו (גרסאות, מהדורות, הסכמות, RLS, בקשת בטא) נבדקת ב-supabase/tests/legal_documents.sql.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGAL_DOCUMENT_PAGES, hasPlaceholder, legalBody, legalBodySha256 } from "./legalDocuments.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..");
const LOCALES = ["he", "en", "es", "ru", "ar", "ja"];
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), "utf8");
const pagesOf = async (l: string) => (await import(`../../../../i18n/locales/${l}/behind-ai/infoPages.ts`)).infoPages.pages;

const page = {
    navTitle: "Nav", summary: "Summary", title: "Title", lead: "Lead",
    blocks: [{ kind: "text", heading: "H", paragraphs: ["P"] }],
} as const;

test("document types map to their source pages; Terms of Service has no text yet", () => {
    assert.deepEqual(LEGAL_DOCUMENT_PAGES, { beta_terms: "betaTerms", privacy_policy: "privacy", terms_of_service: null });
});

test("the legal hash covers title, lead and blocks only", () => {
    const base = legalBodySha256(page);
    assert.equal(legalBody(page), JSON.stringify({ title: "Title", lead: "Lead", blocks: page.blocks }));
    // UI-only copy does not affect the hash.
    assert.equal(legalBodySha256({ ...page, navTitle: "Other nav", summary: "Other summary" }), base);
    // Any change to the legal body does.
    assert.notEqual(legalBodySha256({ ...page, title: "Title." }), base);
    assert.notEqual(legalBodySha256({ ...page, lead: "Lead." }), base);
    assert.notEqual(legalBodySha256({ ...page, blocks: [{ kind: "text", heading: "H", paragraphs: ["P."] }] }), base);
});

test("the hash is SHA-256 of the UTF-8 body, the same literal the database test checks", () => {
    const p = { navTitle: "", summary: "", title: "תנאים", lead: "規約", blocks: [] };
    assert.equal(legalBody(p), '{"title":"תנאים","lead":"規約","blocks":[]}');
    assert.equal(legalBodySha256(p), "3414fb0375151ecd86723a4dbe6ee7045222952d5a0b08bfd745559b1c42ae0a");
    assert.equal(legalBodySha256(p), createHash("sha256").update(Buffer.from(legalBody(p), "utf8")).digest("hex"));
    assert.match(read("supabase", "tests", "legal_documents.sql"), /3414fb0375151ecd86723a4dbe6ee7045222952d5a0b08bfd745559b1c42ae0a/);
});

test("placeholder blocks are detected", () => {
    assert.equal(hasPlaceholder(page), false);
    assert.equal(hasPlaceholder({ ...page, blocks: [...page.blocks, { kind: "placeholder", heading: "x", decision: "y" }] }), true);
});

test("six locales: each legal page has its own body and hash, with the same draft state", async () => {
    for (const type of ["beta_terms", "privacy_policy"] as const) {
        const key = LEGAL_DOCUMENT_PAGES[type];
        const hashes = new Set<string>();
        const drafts = new Set<boolean>();
        for (const l of LOCALES) {
            const p = (await pagesOf(l))[key];
            assert.ok(p.title.trim() && p.blocks.length, `${type} ${l}`);
            hashes.add(legalBodySha256(p));
            drafts.add(hasPlaceholder(p));
        }
        assert.equal(hashes.size, 6, `${type}: one distinct body per locale`);
        assert.equal(drafts.size, 1, `${type}: draft state differs between locales`);
    }
    // RTL locales are hashed from the same logical text order; direction is presentation only.
    const he = (await pagesOf("he")).betaTerms;
    assert.match(legalBody(he), /^\{"title":"תנאי/);
});

test("draft legal texts cannot be published: the script refuses while placeholders remain", async () => {
    for (const [type, key] of [["beta_terms", "betaTerms"], ["privacy_policy", "privacy"]] as const) {
        const draft = hasPlaceholder((await pagesOf("en"))[key]);
        const run = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", join(ROOT, "scripts", "legal-document-version.mjs"), "version", type, "2026-10-01.1", "--material"], { encoding: "utf8" });
        if (draft) {
            assert.equal(run.status, 2, `${type}: ${run.stderr}`);
            assert.match(run.stderr, /unresolved placeholders/);
            assert.equal(run.stdout, "");
        } else {
            assert.equal(run.status, 0, run.stderr);
        }
    }
    const tos = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", join(ROOT, "scripts", "legal-document-version.mjs"), "version", "terms_of_service", "2026-10-01.1", "--material"], { encoding: "utf8" });
    assert.equal(tos.status, 2);
    // Today's configuration is data: Privacy informational, Terms of Service not activated.
    const script = read("scripts", "legal-document-version.mjs");
    assert.match(script, /const REQUIRES_ACCEPTANCE = \{ beta_terms: true, privacy_policy: false, terms_of_service: false \};/);
    assert.match(script, /\$\{REQUIRES_ACCEPTANCE\[type\]\}/);
});

test("server wiring: the database decides the version; the server sends type, locale and body hash", () => {
    const actions = read("app", "(course)", "behind-the-scenes-ai", "_access", "betaActions.ts");
    assert.match(actions, /if \(hasPlaceholder\(BETA_TERMS\[locale\]\)\) return "terms_unavailable";/);
    assert.match(actions, /p_document_type: "beta_terms", p_locale: locale, p_body_sha256: legalBodySha256\(BETA_TERMS\[locale\]\), p_consent: true/);
    assert.match(actions, /\.eq\("legal_document_translations\.locale", locale\)/);
    const panel = read("app", "(course)", "behind-the-scenes-ai", "_access", "BetaAccessRequest.tsx");
    assert.match(panel, /getBetaTermsState\(locale\)/);
    assert.match(panel, /const termsReady = termsState\.ready;/);
    // Re-acceptance: the database says when a pending request needs it; the form reopens for it.
    assert.match(actions, /db\.rpc\("beta_request_needs_reacceptance"\)/);
    assert.match(panel, /const reaccept = pending && termsState\.reaccept;/);
    assert.match(panel, /\(!pending \|\| reaccept\) && latest !== undefined/);
    const admin = read("app", "(course)", "behind-the-scenes-ai", "admin", "AdminView.tsx");
    assert.match(admin, /if \(error\?\.code === "BT006"\) return x\.requestTermsOutdated;/);
    assert.match(admin, /l\.access_grant_basis === "admin_override" \? x\.grantAdminOverride : x\.grantLegacy/);
    // No version constant anywhere in the app: the source of truth is the database.
    const offenders: string[] = [];
    const walk = (dir: string) => {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
            const p = join(dir, e.name);
            if (e.isDirectory()) walk(p);
            else if (/\.tsx?$/.test(e.name) && !e.name.endsWith(".test.ts") && /BETA_TERMS_VERSION|beta_terms_versions/.test(readFileSync(p, "utf8"))) offenders.push(p);
        }
    };
    walk(join(ROOT, "app"));
    assert.deepEqual(offenders, []);
});

test("migration: acceptance only through the security-definer Beta request; Privacy Policy informational", () => {
    const sql = read("supabase", "migrations", "20261001130000_legal_documents.sql");
    assert.match(sql, /constraint privacy_policy_is_informational check \(document_type <> 'privacy_policy' or not requires_acceptance\)/);
    assert.match(sql, /legal_translation_no_placeholder check/);
    assert.match(sql, /revoke all on table public\.legal_document_versions, public\.legal_document_translations, public\.legal_acceptances from anon, authenticated;/);
    assert.match(sql, /grant select on table public\.legal_document_versions, public\.legal_document_translations, public\.legal_acceptances to authenticated;/);
    assert.doesNotMatch(sql, /grant (insert|update|delete|all)[^;]*legal_/i);
    assert.match(sql, /revoke execute on function private\.record_legal_acceptance\(uuid, text, text, text, text\) from public, anon, authenticated;/);
    assert.match(sql, /if p_document_type is distinct from 'beta_terms' then/);
});

test("hardening migration: re-acceptance, grant basis, canonical translation, no Privacy prohibition, no effective_at", () => {
    const sql = read("supabase", "migrations", "20261001140000_legal_documents_hardening.sql");
    // Privacy acceptance is a data setting, not a schema prohibition.
    assert.match(sql, /drop constraint privacy_policy_is_informational;/);
    assert.match(sql, /drop column effective_at;/);
    // Canonical translation: deferred constraint triggers on both tables, keyed on canonical_locale.
    assert.equal((sql.match(/deferrable initially deferred/g) ?? []).length, 2);
    assert.match(sql, /t\.locale = v\.canonical_locale and t\.is_current/);
    // Old pending requests: BT006 until the learner re-accepts; never an acceptance made by the admin.
    assert.match(sql, /if not private\.legal_acceptance_covers_current\(v_req\.acceptance_id\) then\s+raise exception [^;]+errcode = 'BT006'/);
    assert.match(sql, /update public\.beta_access_requests set acceptance_id = v_acceptance where id = v_pending\.id;/);
    const admin = sql.slice(sql.indexOf("create or replace function public.admin_approve_beta_request"), sql.indexOf("create or replace function private.approve_beta_tester"));
    assert.doesNotMatch(admin, /record_legal_acceptance|insert into public\.legal_acceptances/);
    // Grant basis: manual = admin_override, request = beta_request; required for new grants only.
    assert.match(sql, /private\.grant_beta\(p_user_id, p_duration, 'admin_override'\)/);
    assert.match(sql, /private\.grant_beta\(v_req\.user_id, p_duration, 'beta_request'\)/);
    assert.match(sql, /before insert on public\.course_access_grants/);
    assert.doesNotMatch(sql, /update public\.course_access_grants/);
    assert.match(sql, /revoke execute on function public\.beta_request_needs_reacceptance\(\) from public, anon;/);
});
