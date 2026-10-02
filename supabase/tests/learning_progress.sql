-- Database tests for reached learning units and sticky chapter mastery.
-- Requires migration 20261002130000_learning_progress_and_sticky_mastery.
-- DEV ONLY. Everything runs inside one transaction that is always rolled back: no test user,
-- grant, quiz result or progress row is ever committed.
-- Run the whole file in the DEV SQL editor (or via execute_sql). Success = the final row
-- "learning progress tests passed". Any failure raises "TEST FAIL: ..." and nothing is committed.
-- No em dash.

begin;

-- Runs p_sql as the given learner (role authenticated + JWT claims). Returns the first column
-- as text, 'OK' when there is none (or void), or 'ERR:<sqlstate>'.
create function pg_temp.t(p_uid uuid, p_sql text)
returns text
language plpgsql
as $$
declare
    v text;
begin
    begin
        perform set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
        execute 'set local role authenticated';
        execute p_sql into v;
        execute 'reset role';
        return coalesce(nullif(v, ''), 'OK');
    exception when others then
        execute 'reset role';
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

create function pg_temp.user(p_email text)
returns uuid
language plpgsql
as $$
declare
    v uuid := gen_random_uuid();
begin
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    values ('00000000-0000-0000-0000-000000000000', v, 'authenticated', 'authenticated', p_email, '',
        now(), '{"provider": "email"}', '{"full_name": "Progress Test Learner"}', now(), now());
    return v;
end;
$$;

-- One quiz attempt through the real RPC, as the learner.
create function pg_temp.attempt(p_uid uuid, p_attempt uuid, p_quiz text, p_chapter int, p_score int, p_passed boolean)
returns text
language sql
as $$
    select pg_temp.t(p_uid, format(
        'select public.record_quiz_result(%L::uuid, %L, %s::smallint, %s::smallint, %s::smallint, 10::smallint, %L::boolean, ''{}'', ''{}'', now())',
        p_attempt, p_quiz, coalesce(p_chapter::text, 'null'), p_score, p_score / 10, p_passed));
$$;

-- "latest/best/mastery/attempts" of one quiz row, read as the learner (RLS applies).
create function pg_temp.quiz(p_uid uuid, p_quiz text)
returns text
language sql
as $$
    select pg_temp.t(p_uid, format(
        'select score_percent || ''/'' || best_score_percent || ''/'' || mastery_earned || ''/'' || attempts from public.quiz_results where quiz_id = %L',
        p_quiz));
$$;

-- Reached units of the learner, as "chapter:unit" sorted, read as the learner.
create function pg_temp.units(p_uid uuid)
returns text
language sql
as $$
    select pg_temp.t(p_uid, 'select coalesce(string_agg(chapter_id || '':'' || unit_id, '','' order by chapter_id, unit_id), ''none'') from public.learning_unit_progress');
$$;

do $$
declare
    l_a uuid := pg_temp.user('progress-test-a@example.com');
    l_b uuid := pg_temp.user('progress-test-b@example.com');
    l_legacy uuid := pg_temp.user('progress-test-legacy@example.com');
    l_e uuid := pg_temp.user('progress-test-expiry@example.com');
    first_reached timestamptz;
    a1 uuid := gen_random_uuid();
    a2 uuid := gen_random_uuid();
    a3 uuid := gen_random_uuid();
begin
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note, basis) values
        (l_a, 'beta', now(), now() + interval '1 month', 'progress test', 'admin_override'),
        (l_e, 'beta', now(), now() + interval '1 month', 'progress test', 'admin_override');

    -- ── Sticky mastery: 60 -> 85 -> 50 on chapter 8 ──
    perform pg_temp.eq(pg_temp.attempt(l_a, a1, 'behind-ai-chapter-8', 8, 60, false), 'OK', 'attempt 60');
    perform pg_temp.eq(pg_temp.quiz(l_a, 'behind-ai-chapter-8'), '60/60/false/1', 'after 60: no mastery');
    perform pg_temp.eq(pg_temp.attempt(l_a, a2, 'behind-ai-chapter-8', 8, 85, true), 'OK', 'attempt 85');
    perform pg_temp.eq(pg_temp.attempt(l_a, a3, 'behind-ai-chapter-8', 8, 50, false), 'OK', 'attempt 50');
    perform pg_temp.eq(pg_temp.quiz(l_a, 'behind-ai-chapter-8'), '50/85/true/3', 'latest 50, best 85, mastery kept, 3 attempts');
    -- A retried attempt (same id) is still a no-op and does not touch mastery.
    perform pg_temp.eq(pg_temp.attempt(l_a, a3, 'behind-ai-chapter-8', 8, 50, false), 'OK', 'retry of attempt 3');
    perform pg_temp.eq(pg_temp.quiz(l_a, 'behind-ai-chapter-8'), '50/85/true/3', 'retry counted once');

    -- Mastery is per chapter: passing chapters 4, 11 and 17 masters exactly those.
    perform pg_temp.attempt(l_a, gen_random_uuid(), 'behind-ai-chapter-4', 4, 90, true);
    perform pg_temp.attempt(l_a, gen_random_uuid(), 'behind-ai-chapter-11', 11, 70, true);
    perform pg_temp.attempt(l_a, gen_random_uuid(), 'behind-ai-chapter-17', 17, 100, true);
    perform pg_temp.attempt(l_a, gen_random_uuid(), 'behind-ai-chapter-1', 1, 40, false);
    perform pg_temp.eq(pg_temp.t(l_a, 'select string_agg(chapter_id::text, '','' order by chapter_id) from public.quiz_results where mastery_earned'),
        '4,8,11,17', 'mastered chapters are the exact chapters');

    -- Final exam: latest-attempt semantics unchanged, never sticky mastery.
    perform pg_temp.attempt(l_a, gen_random_uuid(), 'behind-ai-final', null, 80, true);
    perform pg_temp.attempt(l_a, gen_random_uuid(), 'behind-ai-final', null, 60, false);
    perform pg_temp.eq(pg_temp.t(l_a, 'select passed || ''/'' || score_percent || ''/'' || best_score_percent || ''/'' || mastery_earned from public.quiz_results where quiz_id = ''behind-ai-final'''),
        'false/60/80/false', 'final exam keeps latest passed and no mastery');
    perform pg_temp.eq(pg_temp.t(l_a, 'update public.quiz_results set mastery_earned = true where quiz_id = ''behind-ai-final'''),
        'ERR:23514', 'final exam cannot hold mastery');

    -- Backfill rule (legacy rows): passed now, or best >= 70 ever.
    insert into public.quiz_results (user_id, quiz_id, chapter_id, score_percent, correct_count, total_questions,
        passed, attempts, best_score_percent, last_completed_at) values
        (l_legacy, 'behind-ai-chapter-2', 2, 50, 5, 10, false, 2, 80, now()),
        (l_legacy, 'behind-ai-chapter-3', 3, 60, 6, 10, false, 1, 60, now());
    update public.quiz_results set mastery_earned = true
        where user_id = l_legacy and chapter_id is not null and (passed or best_score_percent >= 70);
    perform pg_temp.eq(pg_temp.t(l_legacy, 'select string_agg(chapter_id || ''='' || mastery_earned, '','' order by chapter_id) from public.quiz_results'),
        '2=true,3=false', 'backfill: earlier pass kept, never passed stays false');

    -- ── Reached learning units ──
    perform pg_temp.eq(pg_temp.t(l_a, 'select public.record_learning_units(''{8,8,3}'', ''{guess,lab,lab}'', ''{2026-01-01T10:00:00Z,2026-01-01T10:05:00Z,2026-01-01T09:00:00Z}'')'),
        'OK', 'record units');
    first_reached := (select reached_at from public.learning_unit_progress where user_id = l_a and chapter_id = 8 and unit_id = 'guess');
    -- Repeating the same reach (and a duplicate inside one batch) is idempotent and keeps the first time.
    perform pg_temp.eq(pg_temp.t(l_a, 'select public.record_learning_units(''{8,8}'', ''{guess,guess}'', ''{2026-02-01T10:00:00Z,2026-02-01T10:00:00Z}'')'),
        'OK', 'repeat reach');
    perform pg_temp.eq(pg_temp.units(l_a), '3:lab,8:guess,8:lab', 'one row per chapter and unit');
    perform pg_temp.eq((select reached_at from public.learning_unit_progress where user_id = l_a and chapter_id = 8 and unit_id = 'guess')::text,
        first_reached::text, 'first reached_at kept');
    -- A unit reached "in the future" (wrong device clock) is stored at now at most.
    perform pg_temp.t(l_a, 'select public.record_learning_units(''{9}'', ''{wow}'', ''{2999-01-01T00:00:00Z}'')');
    perform pg_temp.eq((select (reached_at <= now())::text from public.learning_unit_progress where user_id = l_a and chapter_id = 9), 'true', 'no future reached_at');

    -- Scope: chapters 1-19 only, semantic ids only.
    perform pg_temp.eq(pg_temp.t(l_a, 'select public.record_learning_units(''{0}'', ''{guess}'', ''{null}'')'), 'ERR:23514', 'introduction is not a chapter');
    perform pg_temp.eq(pg_temp.t(l_a, 'select public.record_learning_units(''{20}'', ''{guess}'', ''{null}'')'), 'ERR:23514', 'no chapter 20 (final exam)');
    perform pg_temp.eq(pg_temp.t(l_a, 'select public.record_learning_units(''{8}'', ''{"Bad Id"}'', ''{null}'')'), 'ERR:23514', 'unit id format');

    -- Isolation: B sees none of A's rows and cannot write rows for A.
    perform pg_temp.eq(pg_temp.units(l_b), 'none', 'B cannot read A');
    perform pg_temp.eq(pg_temp.t(l_b, format('insert into public.learning_unit_progress (user_id, chapter_id, unit_id) values (%L, 8, ''see'')', l_a)),
        'ERR:42501', 'B cannot write for A');
    perform pg_temp.eq(pg_temp.t(l_b, 'select count(*) from public.quiz_results'), '0', 'B cannot read A quiz results');
    -- Reached units are permanent for the learner: no update or delete.
    perform pg_temp.eq(pg_temp.t(l_a, 'delete from public.learning_unit_progress'), 'ERR:42501', 'no delete');
    perform pg_temp.eq(pg_temp.t(l_a, 'update public.learning_unit_progress set reached_at = now()'), 'ERR:42501', 'no update');
    -- Anonymous callers get nothing.
    perform pg_temp.eq((select has_table_privilege('anon', 'public.learning_unit_progress', 'select')::text), 'false', 'anon cannot read');
    perform pg_temp.eq((select has_function_privilege('anon', 'public.record_learning_units(smallint[], text[], timestamptz[])', 'execute')::text), 'false', 'anon cannot record');

    -- Tracking grants no access: B recorded nothing and has no grant; recording does not create one.
    perform pg_temp.t(l_b, 'select public.record_learning_units(''{5}'', ''{lab}'', ''{null}'')');
    perform pg_temp.eq(pg_temp.t(l_b, 'select status from public.course_access_status()'), 'no-grant', 'progress is not access');

    -- ── Access ends: history stays ──
    perform pg_temp.eq(pg_temp.t(l_a, 'select status from public.course_access_status()'), 'active', 'A active');
    perform private.revoke_beta_tester('progress-test-a@example.com');
    perform pg_temp.eq(pg_temp.t(l_a, 'select status from public.course_access_status()'), 'revoked', 'A revoked');
    perform pg_temp.eq(pg_temp.units(l_a), '3:lab,8:guess,8:lab,9:wow', 'units survive revocation');
    perform pg_temp.eq(pg_temp.quiz(l_a, 'behind-ai-chapter-8'), '50/85/true/3', 'mastery survives revocation');
    -- Expiry: progress and mastery recorded while active, then the grant runs out.
    perform pg_temp.attempt(l_e, gen_random_uuid(), 'behind-ai-chapter-2', 2, 90, true);
    perform pg_temp.t(l_e, 'select public.record_learning_units(''{2}'', ''{guess}'', ''{null}'')');
    update public.course_access_grants set approved_at = now() - interval '40 days', expires_at = now() - interval '10 days'
        where user_id = l_e;
    perform pg_temp.eq(pg_temp.t(l_e, 'select status from public.course_access_status()'), 'expired', 'E expired');
    perform pg_temp.eq(pg_temp.units(l_e), '2:guess', 'units survive expiry');
    perform pg_temp.eq(pg_temp.quiz(l_e, 'behind-ai-chapter-2'), '90/90/true/1', 'mastery survives expiry');
end $$;

rollback;

select 'learning progress tests passed' as result;
