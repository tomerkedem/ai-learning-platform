// Prints the SQL that publishes a legal document from the repository locale dictionaries into
// public.legal_document_versions / legal_document_translations. Put the output in a new migration.
//
//   New canonical version (all six locales, revision 1; the previous version stops being current):
//     node scripts/legal-document-version.mjs version <type> YYYY-MM-DD.N --material|--not-material
//   Translation correction (same canonical version, next revision for one locale):
//     node scripts/legal-document-version.mjs revision <type> YYYY-MM-DD.N <locale>
//
// <type>: beta_terms | privacy_policy | terms_of_service. Refuses while the body has a
// placeholder block (the database refuses too) and for a type with no source page yet.
// Whether a change is material (requires re-acceptance) is a human decision: the flag is required.
// Hashing rules live in app/(course)/behind-the-scenes-ai/_access/legalDocuments.ts.
// See docs/behind-ai-access-admin.md. No em dash.

import { LEGAL_DOCUMENT_PAGES, hasPlaceholder, legalBody, legalBodySha256 } from '../app/(course)/behind-the-scenes-ai/_access/legalDocuments.ts';

const LOCALES = ['en', 'he', 'es', 'ru', 'ar', 'ja'];
// Current product configuration, stored on each published version (the schema allows either).
// Privacy Policy: informational. Terms of Service: acceptance not activated. Change only by decision.
const REQUIRES_ACCEPTANCE = { beta_terms: true, privacy_policy: false, terms_of_service: false };
const [mode, type, version, arg] = process.argv.slice(2);
const fail = (msg, code = 1) => { console.error(msg); return code; };

process.exitCode = await main();

async function main() {

if (!['version', 'revision'].includes(mode) || !Object.hasOwn(LEGAL_DOCUMENT_PAGES, type) || !/^\d{4}-\d{2}-\d{2}\.[1-9]\d*$/.test(version ?? '')) {
    return fail('Usage: node scripts/legal-document-version.mjs version <type> YYYY-MM-DD.N --material|--not-material\n'
        + '       node scripts/legal-document-version.mjs revision <type> YYYY-MM-DD.N <locale>');
}
const pageKey = LEGAL_DOCUMENT_PAGES[type];
if (!pageKey) return fail(`${type} has no source text in the repository yet.`, 2);
if (mode === 'version' && !['--material', '--not-material'].includes(arg)) return fail('Say whether the version is material: --material or --not-material.');
if (mode === 'revision' && !LOCALES.includes(arg)) return fail(`Unknown locale: ${arg}`);

const locales = mode === 'version' ? LOCALES : [arg];
const rows = [];
const drafts = [];
for (const l of locales) {
    const { infoPages } = await import(new URL(`../i18n/locales/${l}/behind-ai/infoPages.ts`, import.meta.url));
    const page = infoPages.pages[pageKey];
    if (hasPlaceholder(page)) drafts.push(...page.blocks.filter((b) => b.kind === 'placeholder').map((b) => `${l}: ${b.heading}`));
    rows.push({ locale: l, body: legalBody(page), sha: legalBodySha256(page) });
}
if (drafts.length) return fail([`${type} still has unresolved placeholders:`, ...drafts].join('\n'), 2);

const tag = '$legal$';
if (rows.some((r) => r.body.includes(tag))) return fail('Body contains the dollar-quote tag');
const values = rows.map((r) => `    ('${r.locale}', ${tag}${r.body}${tag}, '${r.sha}')`).join(',\n');
const version_ = `(select id from public.legal_document_versions where document_type = '${type}' and version = '${version}')`;

if (mode === 'version') {
    console.log(`update public.legal_document_versions set is_current = false where document_type = '${type}' and is_current;
insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current)
values ('${type}', '${version}', ${REQUIRES_ACCEPTANCE[type]}, ${arg === '--material'}, true);
insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
select ${version_}, x.locale, 1, x.content, x.sha, true
from (values
${values}
) as x(locale, content, sha);`);
} else {
    console.log(`update public.legal_document_translations set is_current = false
where version_id = ${version_} and locale = '${arg}' and is_current;
insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
select ${version_}, x.locale,
       (select coalesce(max(t.revision), 0) + 1 from public.legal_document_translations t where t.version_id = ${version_} and t.locale = x.locale),
       x.content, x.sha, true
from (values
${values}
) as x(locale, content, sha);`);
}
return 0;
}
