// Prints the SQL that registers a new Beta Terms consent version: a snapshot of the Beta Terms
// page in all six locales and its SHA-256. Refuses while any locale still has a placeholder
// block (draft terms are never registered as a consent version; the database refuses too).
//   node scripts/beta-terms-version.mjs 2026-10-15 > snapshot.sql
// Put the output in a new migration, set BETA_TERMS_VERSION in
// app/(course)/behind-the-scenes-ai/_access/access.ts, and apply the migration.
// Snapshot and hash rules must match BETA_TERMS_SHA256 in _access/betaTerms.server.ts.
// See docs/behind-ai-access-admin.md. No em dash.

import { createHash } from 'node:crypto';

const version = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}(\.\d+)?$/.test(version ?? '')) {
    console.error('Usage: node scripts/beta-terms-version.mjs YYYY-MM-DD[.N]');
    process.exit(1);
}

const LOCALES = ['he', 'en', 'es', 'ru', 'ar', 'ja'];
const pages = {};
const drafts = [];
for (const l of LOCALES) {
    const mod = await import(new URL(`../i18n/locales/${l}/behind-ai/infoPages.ts`, import.meta.url));
    pages[l] = mod.infoPages.pages.betaTerms;
    for (const b of pages[l].blocks) if (b.kind === 'placeholder') drafts.push(`${l}: ${b.heading}`);
}
if (drafts.length) {
    console.error(['Beta Terms still have unresolved placeholders:', ...drafts].join('\n'));
    process.exitCode = 2;
} else {
    const json = JSON.stringify(pages);
    const sha = createHash('sha256').update(json).digest('hex');
    const tag = '$terms$';
    if (json.includes(tag)) throw new Error('Snapshot contains the dollar-quote tag');

    console.log(`update public.beta_terms_versions set is_current = false where is_current;
insert into public.beta_terms_versions (version, content_sha256, content, is_current)
values ('${version}', '${sha}', ${tag}${json}${tag}::jsonb, true);`);
}
