-- Database tests for legal documents, acceptances, grants and the Beta request flow.
-- Requires migrations 20261001130000_legal_documents and 20261001140000_legal_documents_hardening.
-- DEV ONLY. Everything runs inside one transaction that is always rolled back: no test user,
-- version, translation, acceptance, request or grant is ever committed.
-- Run the whole file in the DEV SQL editor (or via execute_sql). Success = the final row
-- "legal document tests passed". Any failure raises "TEST FAIL: ..." and nothing is committed.
-- No em dash.

begin;

-- Runs p_sql as the given learner (role authenticated + JWT claims) or as postgres when p_uid is
-- null. Returns the first column as text, 'OK' when there is none, or 'ERR:<sqlstate>'.
create function pg_temp.t(p_uid uuid, p_sql text)
returns text
language plpgsql
as $$
declare
    v text;
begin
    begin
        if p_uid is not null then
            perform set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
            execute 'set local role authenticated';
        end if;
        execute p_sql into v;
        execute 'reset role';
        return coalesce(v, 'OK');
    exception when others then
        return 'ERR:' || sqlstate;
    end;
end;
$$;

-- Runs statements as postgres, then checks the deferred constraints immediately (as a commit
-- would). Returns 'OK' or 'ERR:<sqlstate>'; on error the statements are undone.
create function pg_temp.tc(p_stmts text[])
returns text
language plpgsql
as $$
declare
    s text;
begin
    begin
        foreach s in array p_stmts loop
            execute s;
        end loop;
        set constraints all immediate;
        set constraints all deferred;
        return 'OK';
    exception when others then
        set constraints all deferred;
        return 'ERR:' || sqlstate;
    end;
end;
$$;

create function pg_temp.eq(p_got text, p_want text, p_what text)
returns void
language plpgsql
as $$
begin
    if p_got is distinct from p_want then
        raise exception 'TEST FAIL: % (got %, want %)', p_what, p_got, p_want;
    end if;
end;
$$;

create function pg_temp.user(p_email text, p_confirmed boolean default true)
returns uuid
language plpgsql
as $$
declare
    v uuid := gen_random_uuid();
begin
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    values ('00000000-0000-0000-0000-000000000000', v, 'authenticated', 'authenticated', p_email, '',
        case when p_confirmed then now() end, '{"provider": "email"}', '{"full_name": "Legal Test Learner"}', now(), now());
    return v;
end;
$$;

-- Same hashing rule as the app: SHA-256 of the UTF-8 JSON text.
create function pg_temp.sha(p text) returns text language sql as $$ select encode(sha256(convert_to(p, 'UTF8')), 'hex') $$;

do $$
declare
    l_new uuid := pg_temp.user('legal-test-new@example.com');
    l_active uuid := pg_temp.user('legal-test-active@example.com');
    l_suspended uuid := pg_temp.user('legal-test-suspended@example.com');
    l_unconfirmed uuid := pg_temp.user('legal-test-unconfirmed@example.com', false);
    l_expired uuid := pg_temp.user('legal-test-expired@example.com');
    l_revoked uuid := pg_temp.user('legal-test-revoked@example.com');
    l_admin uuid := pg_temp.user('legal-test-admin@example.com');
    test_users uuid[];
    v1 uuid; v2 uuid; v3 uuid; he1 uuid; he2 uuid; en1 uuid;
    body text;
    loc text;
    req uuid;
    acc public.legal_acceptances;
    n_acceptances int;
    legacy_rows jsonb := (select jsonb_agg(to_jsonb(g) order by g.id) from public.course_access_grants g);
    legacy_user uuid := (select g.user_id from public.course_access_grants g order by g.id limit 1);
    grandfathered_active text[] := array(select g.user_id::text from public.course_access_grants g
        where g.revoked_at is null and now() < g.expires_at order by 1);
begin
    test_users := array[l_new, l_active, l_suspended, l_unconfirmed, l_expired, l_revoked, l_admin];
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note, basis) values
        (l_active, 'beta', now(), now() + interval '1 month', 'legal test', 'admin_override'),
        (l_expired, 'beta', now() - interval '40 days', now() - interval '10 days', 'legal test', 'admin_override');
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, revoked_at, note, basis)
        values (l_revoked, 'beta', now() - interval '2 days', now() + interval '20 days', now() - interval '1 day', 'legal test', 'admin_override');
    insert into public.course_account_suspensions (user_id, suspended) values (l_suspended, true);
    insert into public.course_admins (user_id) values (l_admin);

    -- Hash rule shared with the app (legalDocuments.test.ts checks the same literal).
    perform pg_temp.eq(pg_temp.sha('{"title":"תנאים","lead":"規約","blocks":[]}'),
        '3414fb0375151ecd86723a4dbe6ee7045222952d5a0b08bfd745559b1c42ae0a', 'UTF-8 JSON hash matches the app');

    -- ── No current version: requests are refused, nothing is recorded ──
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'en', repeat('0', 64))),
        'ERR:BT002', 'no published Beta Terms');

    -- ── Publish version 1 in six locales ──
    insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current, published_at)
    values ('beta_terms', '2026-10-01.1', true, true, true, now() - interval '3 hours') returning id into v1;
    foreach loc in array array['en', 'he', 'es', 'ru', 'ar', 'ja'] loop
        body := format('{"title":"Beta %s","lead":"v1","blocks":[{"kind":"text","heading":"H","paragraphs":["%s"]}]}', loc, loc);
        insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
        values (v1, loc, 1, body, pg_temp.sha(body), true);
    end loop;
    select id into he1 from public.legal_document_translations where version_id = v1 and locale = 'he';
    select id into en1 from public.legal_document_translations where version_id = v1 and locale = 'en';
    perform pg_temp.eq(pg_temp.tc(array[]::text[]), 'OK', 'version with its canonical translation is valid');

    -- ── Schema rules ──
    perform pg_temp.eq(pg_temp.t(null, $q$insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current)
        values ('beta_terms', '2026-10-01.9', true, true, true)$q$), 'ERR:23505', 'only one current version per type');
    perform pg_temp.eq(pg_temp.t(null, $q$insert into public.legal_document_versions (document_type, version, requires_acceptance, material)
        values ('beta_terms', '2026-10-01', true, true)$q$), 'ERR:23514', 'version format YYYY-MM-DD.N');
    perform pg_temp.eq(pg_temp.t(null, $q$insert into public.legal_document_versions (document_type, version, requires_acceptance, material)
        values ('beta_terms', '2026-10-01.1', true, true)$q$), 'ERR:23505', 'version unique per type');
    -- The generic schema allows a Privacy Policy version that requires acceptance (not current here).
    perform pg_temp.eq(pg_temp.t(null, $q$insert into public.legal_document_versions (document_type, version, requires_acceptance, material)
        values ('privacy_policy', '2026-09-30.1', true, false) returning 'OK'$q$), 'OK', 'schema does not forbid future Privacy acceptance');
    perform pg_temp.eq((select count(*)::text from information_schema.columns
        where table_schema = 'public' and table_name = 'legal_document_versions' and column_name = 'effective_at'), '0', 'effective_at removed');
    perform pg_temp.eq(pg_temp.t(null, format('update public.legal_document_versions set version = %L where id = %L', '2026-10-02.1', v1)),
        'ERR:42501', 'version text immutable');
    perform pg_temp.eq(pg_temp.t(null, format('update public.legal_document_versions set material = false where id = %L', v1)),
        'ERR:42501', 'version flags immutable');
    perform pg_temp.eq(pg_temp.t(null, format('delete from public.legal_document_versions where id = %L', v1)),
        'ERR:42501', 'version never deleted');
    perform pg_temp.eq(pg_temp.t(null, format('update public.legal_document_translations set content = %L where id = %L', '{"title":"x"}', he1)),
        'ERR:42501', 'translation content immutable');
    perform pg_temp.eq(pg_temp.t(null, format('delete from public.legal_document_translations where id = %L', he1)),
        'ERR:42501', 'translation never deleted');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
        values (%L, 'he', 2, '{"blocks":[]}', pg_temp.sha('{"blocks":[]}'), true)$q$, v1)), 'ERR:23505', 'one current translation per version and locale');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256)
        values (%L, 'he', 2, '{"blocks":[{"kind":"placeholder","heading":"x","decision":"y"}]}', pg_temp.sha('{"blocks":[{"kind":"placeholder","heading":"x","decision":"y"}]}'))$q$, v1)),
        'ERR:23514', 'placeholder block refused');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256)
        values (%L, 'he', 2, '{"blocks":[]}', %L)$q$, v1, repeat('a', 64))), 'ERR:23514', 'stored hash must match the content');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256)
        values (%L, 'fr', 1, '{"blocks":[]}', pg_temp.sha('{"blocks":[]}'))$q$, v1)), 'ERR:23514', 'only the six locales');

    -- ── Canonical translation invariant (deferred: checked as at commit) ──
    perform pg_temp.eq(pg_temp.tc(array[$q$insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current)
        values ('terms_of_service', '2026-10-01.1', false, true, true)$q$]), 'ERR:23514', 'current version without any translation');
    perform pg_temp.eq(pg_temp.tc(array[$q$insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current)
        values ('terms_of_service', '2026-10-01.1', false, true, true)$q$,
        $q$insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
        select id, 'he', 1, '{"blocks":[]}', pg_temp.sha('{"blocks":[]}'), true from public.legal_document_versions where document_type = 'terms_of_service'$q$]),
        'ERR:23514', 'current version with only a non-canonical translation');
    perform pg_temp.eq(pg_temp.tc(array[$q$insert into public.legal_document_versions (document_type, version, requires_acceptance, material)
        values ('terms_of_service', '2026-10-01.1', false, true)$q$]), 'OK', 'non-current version may wait for translations');
    perform pg_temp.eq(pg_temp.tc(array[format($q$update public.legal_document_versions set is_current = true
        where document_type = 'terms_of_service' and version = '2026-10-01.1'$q$)]), 'ERR:23514', 'cannot make a version current without its canonical translation');
    perform pg_temp.eq(pg_temp.tc(array[format('update public.legal_document_translations set is_current = false where id = %L', en1)]),
        'ERR:23514', 'cannot retire the canonical translation of the current version');
    perform pg_temp.eq(pg_temp.tc(array[$q$insert into public.legal_document_versions (document_type, version, canonical_locale, requires_acceptance, material, is_current)
        values ('terms_of_service', '2026-10-01.2', 'he', false, true, true)$q$,
        $q$insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
        select id, 'he', 1, '{"blocks":[]}', pg_temp.sha('{"blocks":[]}'), true from public.legal_document_versions where document_type = 'terms_of_service' and version = '2026-10-01.2'$q$]),
        'OK', 'the rule follows canonical_locale, not a fixed language');

    -- ── Learner request: refusals record nothing ──
    body := (select content from public.legal_document_translations where id = he1);
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, false)', 'beta_terms', 'he', pg_temp.sha(body))), 'ERR:BT001', 'consent required');
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'terms_of_service', 'he', pg_temp.sha(body))), 'ERR:22023', 'Terms of Service acceptance inactive');
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'fr', pg_temp.sha(body))), 'ERR:22023', 'invalid locale');
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body || ' '))), 'ERR:BT002', 'hash mismatch');
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'en', pg_temp.sha(body))), 'ERR:BT002', 'hash of another locale');
    perform pg_temp.eq(pg_temp.t(l_active, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body))), 'ERR:BT003', 'active grant');
    perform pg_temp.eq(pg_temp.t(l_suspended, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body))), 'ERR:42501', 'suspended');
    perform pg_temp.eq(pg_temp.t(l_unconfirmed, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body))), 'ERR:42501', 'unconfirmed email');
    perform pg_temp.eq(pg_temp.t(null, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body))), 'ERR:42501', 'not signed in');
    perform pg_temp.eq((select count(*)::text from public.legal_acceptances), '0', 'refusals record no acceptance');
    perform pg_temp.eq((select count(*)::text from public.beta_access_requests), '0', 'refusals record no request');

    -- ── Learner request: success (Hebrew, RTL) records the exact version and revision ──
    req := pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body)))::uuid;
    select a.* into acc from public.legal_acceptances a join public.beta_access_requests r on r.acceptance_id = a.id where r.id = req;
    perform pg_temp.eq(acc.user_id::text, l_new::text, 'acceptance user');
    perform pg_temp.eq(acc.version_id::text, v1::text, 'acceptance canonical version');
    perform pg_temp.eq(acc.translation_id::text, he1::text, 'acceptance translation revision');
    perform pg_temp.eq(acc.locale, 'he', 'acceptance locale');
    perform pg_temp.eq(acc.context, 'beta_access_request', 'acceptance context');
    perform pg_temp.eq((acc.accepted_at = now())::text, 'true', 'acceptance timestamp');
    perform pg_temp.eq((select status from public.beta_access_requests where id = req), 'pending', 'request pending');
    perform pg_temp.eq(pg_temp.t(l_new, 'select public.beta_request_needs_reacceptance()'), 'false', 'fresh request needs no re-acceptance');

    -- Duplicate pending under the current terms: refused, and its acceptance is rolled back with it.
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body))), 'ERR:23505', 'duplicate pending');
    perform pg_temp.eq((select count(*)::text from public.legal_acceptances where user_id = l_new), '1', 'duplicate records no acceptance');

    -- Expired and revoked learners may request again; Arabic (RTL) and Japanese recorded as shown.
    body := (select content from public.legal_document_translations where version_id = v1 and locale = 'ar');
    perform pg_temp.eq(length(pg_temp.t(l_expired, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'ar', pg_temp.sha(body))))::text, '36', 'expired grant may request');
    perform pg_temp.eq((select locale from public.legal_acceptances where user_id = l_expired), 'ar', 'Arabic locale recorded');
    body := (select content from public.legal_document_translations where version_id = v1 and locale = 'ja');
    perform pg_temp.eq(length(pg_temp.t(l_revoked, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'ja', pg_temp.sha(body))))::text, '36', 'revoked grant may request');

    -- ── Learner cannot forge, alter or delete; sees only own records ──
    perform pg_temp.eq(pg_temp.t(l_new, format($q$insert into public.legal_acceptances (user_id, version_id, translation_id, locale, context)
        values (%L, %L, %L, 'he', 'beta_access_request')$q$, l_new, v1, he1)), 'ERR:42501', 'learner cannot insert acceptance');
    perform pg_temp.eq(pg_temp.t(l_new, format('update public.legal_acceptances set locale = %L where user_id = %L', 'en', l_new)), 'ERR:42501', 'learner cannot update acceptance');
    perform pg_temp.eq(pg_temp.t(l_new, format('delete from public.legal_acceptances where user_id = %L', l_new)), 'ERR:42501', 'learner cannot delete acceptance');
    perform pg_temp.eq(pg_temp.t(l_new, format($q$select private.record_legal_acceptance(%L, 'beta_terms', 'he', %L, 'beta_access_request')$q$, l_new, repeat('0', 64))),
        'ERR:42501', 'learner cannot call the internal recorder');
    perform pg_temp.eq(pg_temp.t(l_new, format('insert into public.beta_access_requests (user_id, acceptance_id) values (%L, %L)', l_new, acc.id)), 'ERR:42501', 'learner cannot insert a request');
    perform pg_temp.eq(pg_temp.t(l_new, format('update public.beta_access_requests set acceptance_id = %L where user_id = %L', acc.id, l_new)), 'ERR:42501', 'learner cannot relink a request');
    perform pg_temp.eq(pg_temp.t(l_new, format('update public.legal_document_versions set is_current = false where id = %L', v1)), 'ERR:42501', 'learner cannot change versions');
    perform pg_temp.eq(pg_temp.t(l_new, format($q$insert into public.course_access_grants (user_id, kind, approved_at, expires_at, basis)
        values (%L, 'beta', now(), now() + interval '1 day', 'beta_request')$q$, l_new)), 'ERR:42501', 'learner cannot create a grant');
    perform pg_temp.eq(pg_temp.t(l_new, 'select count(*) from public.legal_acceptances'), '1', 'learner sees only own acceptance');
    perform pg_temp.eq(pg_temp.t(l_new, 'select count(*) from public.legal_document_translations'), '7', 'learner reads published translations');
    perform pg_temp.eq(pg_temp.t(null, format('update public.legal_acceptances set locale = %L where id = %L', 'en', acc.id)), 'ERR:42501', 'acceptance immutable even for postgres');
    perform pg_temp.eq(pg_temp.t(null, format('delete from public.legal_acceptances where id = %L', acc.id)), 'ERR:42501', 'acceptance not directly deletable');
    perform pg_temp.eq((has_table_privilege('anon', 'public.legal_document_translations', 'select')
        or has_table_privilege('anon', 'public.legal_acceptances', 'select')
        or has_table_privilege('authenticated', 'public.legal_acceptances', 'insert')
        or has_table_privilege('authenticated', 'public.legal_document_versions', 'update')
        or has_function_privilege('anon', 'public.beta_request_needs_reacceptance()', 'execute'))::text, 'false', 'privileges');
    perform pg_temp.eq((select string_agg(p.proname, ',' order by p.proname) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where p.prosecdef and n.nspname = 'public'
          and p.proname in ('request_beta_access', 'admin_list_learners', 'admin_approve_beta', 'admin_approve_beta_request', 'beta_request_needs_reacceptance')
          and p.proconfig @> array['search_path=""']),
        'admin_approve_beta,admin_approve_beta_request,admin_list_learners,beta_request_needs_reacceptance,request_beta_access', 'security definer search_path pinned');
    perform pg_temp.eq((select string_agg(p.proname, ',') from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.prosrc like '%record_legal_acceptance%'), 'request_beta_access', 'only the Beta request records acceptance');

    -- ── Translation revision: same canonical version, new exact text ──
    update public.legal_document_translations set is_current = false where id = he1;
    body := '{"title":"Beta he","lead":"v1 corrected","blocks":[{"kind":"text","heading":"H","paragraphs":["he"]}]}';
    insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
    values (v1, 'he', 2, body, pg_temp.sha(body), true) returning id into he2;
    perform pg_temp.eq((select count(*)::text from public.legal_document_versions where document_type = 'beta_terms'), '1', 'revision creates no version');
    delete from public.course_account_suspensions where user_id = l_suspended;
    perform pg_temp.eq(pg_temp.t(l_suspended, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he',
        (select content_sha256 from public.legal_document_translations where id = he1))), 'ERR:BT002', 'stale translation revision');
    req := pg_temp.t(l_suspended, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'he', pg_temp.sha(body)))::uuid;
    select a.* into acc from public.legal_acceptances a join public.beta_access_requests r on r.acceptance_id = a.id where r.id = req;
    perform pg_temp.eq(acc.translation_id::text, he2::text, 'acceptance records revision 2');
    perform pg_temp.eq(acc.version_id::text, v1::text, 'revision keeps the canonical version');
    perform pg_temp.eq((select revision::text from public.legal_document_translations where id = acc.translation_id), '2', 'revision number');

    -- ── Approval under the current material version; a revision alone does not invalidate ──
    n_acceptances := (select count(*) from public.legal_acceptances);
    perform pg_temp.eq(pg_temp.t(l_new, 'select public.beta_request_needs_reacceptance()'), 'false', 'translation revision needs no re-acceptance');
    req := (select id from public.beta_access_requests where user_id = l_revoked);
    perform pg_temp.eq((pg_temp.t(l_admin, format('select public.admin_approve_beta_request(%L)', req)) like 'ERR:%')::text, 'false', 'request under the current material version is approvable');
    req := (select id from public.beta_access_requests where user_id = l_new);
    perform pg_temp.eq((pg_temp.t(l_admin, format('select public.admin_approve_beta_request(%L)', req)) like 'ERR:%')::text, 'false', 'acceptance of revision 1 still approvable after revision 2');
    perform pg_temp.eq((select g.basis from public.course_access_grants g join public.beta_access_requests r on r.grant_id = g.id where r.id = req), 'beta_request', 'request grant basis');

    -- ── New non-material version: stale hash refused; acceptance still covers; grant untouched ──
    update public.legal_document_versions set is_current = false where id = v1;
    insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current, published_at)
    values ('beta_terms', '2026-10-01.2', true, false, true, now() - interval '2 hours') returning id into v2;
    body := '{"title":"Beta en","lead":"v2","blocks":[]}';
    insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
    values (v2, 'en', 1, body, pg_temp.sha(body), true);
    delete from public.beta_access_requests where user_id = l_expired;
    perform pg_temp.eq(pg_temp.t(l_expired, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'en',
        (select content_sha256 from public.legal_document_translations where version_id = v1 and locale = 'en'))), 'ERR:BT002', 'stale canonical version');
    perform pg_temp.eq(pg_temp.t(l_expired, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'ar',
        (select content_sha256 from public.legal_document_translations where version_id = v1 and locale = 'ar'))), 'ERR:BT002', 'no current translation for the locale');
    perform pg_temp.eq((select d.status from private.access_status_for(l_active) d), 'active', 'new version does not revoke an active grant');
    perform pg_temp.eq(private.legal_acceptance_is_current(l_new, 'beta_terms')::text, 'true', 'non-material version keeps acceptance');
    perform pg_temp.eq(pg_temp.t(l_suspended, 'select public.beta_request_needs_reacceptance()'), 'false', 'non-material version keeps the pending request valid');

    -- ── New material version: old pending request cannot be approved until re-acceptance ──
    update public.legal_document_versions set is_current = false where id = v2;
    insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current, published_at)
    values ('beta_terms', '2026-10-01.3', true, true, true, now() - interval '1 hour') returning id into v3;
    body := '{"title":"Beta en","lead":"v3","blocks":[]}';
    insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
    values (v3, 'en', 1, body, pg_temp.sha(body), true);
    perform pg_temp.eq(private.legal_acceptance_is_current(l_new, 'beta_terms')::text, 'false', 'material version requires re-acceptance');
    perform pg_temp.eq(private.legal_acceptance_is_current(l_active, 'beta_terms')::text, 'false', 'no acceptance is not current');
    perform pg_temp.eq((select d.status from private.access_status_for(l_active) d), 'active', 'material version does not revoke an active grant');
    perform pg_temp.eq((select d.status from private.access_status_for(l_new) d), 'active', 'material version does not revoke a request grant');
    req := (select id from public.beta_access_requests where user_id = l_suspended);
    perform pg_temp.eq(pg_temp.t(l_suspended, 'select public.beta_request_needs_reacceptance()'), 'true', 'learner is told to re-accept');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_approve_beta_request(%L)', req)), 'ERR:BT006', 'old pending request cannot be approved');
    perform pg_temp.eq((select status from public.beta_access_requests where id = req), 'pending', 'refused approval leaves the request pending');
    perform pg_temp.eq((select count(*)::text from public.course_access_grants where user_id = l_suspended), '0', 'refused approval creates no grant');
    perform pg_temp.eq(pg_temp.t(l_suspended, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'en',
        (select content_sha256 from public.legal_document_translations where version_id = v2 and locale = 'en'))), 'ERR:BT002', 're-acceptance needs the current text');
    perform pg_temp.eq(pg_temp.t(l_suspended, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'en', pg_temp.sha(body))),
        req::text, 're-acceptance keeps the same pending request');
    select a.* into acc from public.legal_acceptances a join public.beta_access_requests r on r.acceptance_id = a.id where r.id = req;
    perform pg_temp.eq(acc.version_id::text, v3::text, 'request now carries the new acceptance');
    perform pg_temp.eq((select count(*)::text from public.legal_acceptances where user_id = l_suspended), '2', 'earlier acceptance kept as evidence');
    perform pg_temp.eq(pg_temp.t(l_suspended, 'select public.beta_request_needs_reacceptance()'), 'false', 're-accepted request is current');
    perform pg_temp.eq(pg_temp.t(l_suspended, format('select public.request_beta_access(%L, %L, %L, true)', 'beta_terms', 'en', pg_temp.sha(body))),
        'ERR:23505', 'no second re-acceptance while current');
    perform pg_temp.eq((pg_temp.t(l_admin, format('select public.admin_approve_beta_request(%L)', req)) like 'ERR:%')::text, 'false', 're-accepted request is approvable');

    -- ── Admin never creates learner acceptance; manual grants are administrative overrides ──
    perform pg_temp.eq((select count(*)::text from public.legal_acceptances), (n_acceptances + 1)::text, 'only the learner re-acceptance added an acceptance');
    perform pg_temp.eq((pg_temp.t(l_admin, format('select public.admin_approve_beta(%L)', l_expired)) like 'ERR:%')::text, 'false', 'admin manual grant');
    perform pg_temp.eq((select string_agg(g.basis || '/' || g.note, ',') from public.course_access_grants g where g.user_id = l_expired and g.note <> 'legal test'),
        'admin_override/approved from the admin page', 'manual grant is an administrative override');
    perform pg_temp.eq((select count(*)::text from public.legal_acceptances where user_id = l_expired), '1', 'manual grant manufactures no acceptance');
    perform pg_temp.eq((select count(*)::text from public.beta_access_requests r join public.course_access_grants g on g.id = r.grant_id
        where g.basis is distinct from 'beta_request'), '0', 'no request points to an override or legacy grant');
    perform pg_temp.eq((select count(*)::text from public.course_access_grants g where g.basis = 'beta_request'
        and not exists (select 1 from public.beta_access_requests r where r.grant_id = g.id)), '0', 'every request grant has its request and acceptance');
    perform pg_temp.eq((select count(*)::text from public.course_access_audit au join public.course_access_grants g on g.id = au.grant_id
        where au.action = 'approve' and g.user_id = l_expired and g.basis = 'admin_override' and g.note <> 'legal test'), '1', 'audit row resolves to the override grant');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.course_access_grants (user_id, kind, approved_at, expires_at)
        values (%L, 'beta', now(), now() + interval '1 day')$q$, l_expired)), 'ERR:23502', 'a new grant must state its basis');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select access_grant_basis || %L || request_terms_version || %L || request_locale from public.admin_list_learners(%L)',
        '/', '/', 'legal-test-new@')), 'beta_request/2026-10-01.1/he', 'admin list: request grant');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select access_grant_basis from public.admin_list_learners(%L)', 'legal-test-expired@')),
        'admin_override', 'admin list: manual grant');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select access_grant_basis from public.admin_list_learners(%L)', (select email from auth.users where id = legacy_user))),
        'legacy', 'admin list: grandfathered grant');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select coalesce(access_grant_basis, %L) from public.admin_list_learners(%L)', 'null', 'legal-test-unconfirmed@')),
        'null', 'admin list: no grant');

    -- ── Privacy Policy stays informational today (data, not schema) ──
    insert into public.legal_document_versions (document_type, version, requires_acceptance, material, is_current)
    values ('privacy_policy', '2026-10-01.1', false, true, true);
    insert into public.legal_document_translations (version_id, locale, revision, content, content_sha256, is_current)
    select id, 'en', 1, '{"blocks":[]}', pg_temp.sha('{"blocks":[]}'), true from public.legal_document_versions where document_type = 'privacy_policy' and version = '2026-10-01.1';
    perform pg_temp.eq(pg_temp.t(null, format($q$select private.record_legal_acceptance(%L, 'privacy_policy', 'en', %L, 'beta_access_request')$q$, l_new, pg_temp.sha('{"blocks":[]}'))),
        'ERR:BT002', 'informational Privacy Policy cannot be accepted');
    perform pg_temp.eq(pg_temp.t(l_new, format('select public.request_beta_access(%L, %L, %L, true)', 'privacy_policy', 'en', pg_temp.sha('{"blocks":[]}'))),
        'ERR:22023', 'no learner path accepts the Privacy Policy');

    -- ── Grandfathered grants unchanged ──
    perform pg_temp.eq((select jsonb_agg(to_jsonb(g) order by g.id) from public.course_access_grants g where not (g.user_id = any (test_users)))::text,
        legacy_rows::text, 'existing grants unchanged, field by field');
    perform pg_temp.eq((select count(*)::text from public.course_access_grants g where not (g.user_id = any (test_users)) and g.basis is not null), '0', 'existing grants stay legacy');
    perform pg_temp.eq((select count(*)::text from public.legal_acceptances a where a.user_id::text = any (grandfathered_active)), '0', 'no acceptance invented for grandfathered grants');
    -- A legacy grant can still be revoked (the basis rule applies to new grants only).
    perform pg_temp.eq(pg_temp.t(null, format($q$update public.course_access_grants set revoked_at = now() where user_id = %L returning 'OK'$q$, legacy_user)), 'OK', 'legacy grant still revocable');

    -- ── Whole state satisfies the deferred constraints ──
    perform pg_temp.eq(pg_temp.tc(array[]::text[]), 'OK', 'final state valid at commit');

    -- ── Account deletion cascades acceptances and requests (temporary choice) ──
    delete from auth.users where id = l_new;
    perform pg_temp.eq((select count(*)::text from public.legal_acceptances where user_id = l_new), '0', 'acceptances cascade with the account');
    perform pg_temp.eq((select count(*)::text from public.beta_access_requests where user_id = l_new), '0', 'requests cascade with the account');
end $$;

rollback;

select 'legal document tests passed' as result;
