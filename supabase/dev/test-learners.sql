-- Test learners for the DEVELOPMENT project only (cdwbcwafzohezvpushue). Never run in production.
--
-- Creates exactly three clearly labeled learners for the course admin page:
--   test-learner-no-grant@example.com   "TEST Learner (no grant)"       no grant
--   test-learner-active@example.com     "TEST Learner (active grant)"   beta grant: now until now + 1 month
--   test-learner-expired@example.com    "TEST Learner (expired grant)"  beta grant: 40 to 10 days ago
--
-- Sends no Auth emails: rows are inserted directly (Supabase Auth is never called). The
-- accounts are confirmed, flagged with app_metadata.bts_test_learner = true (not editable by
-- users), and get a random, unrecorded password, so nobody can sign in as them. To sign in as
-- one in dev, set a password deliberately from the SQL editor.
--
-- Usage (Supabase SQL editor of the dev project, runs as postgres):
--   1. Run the SEED block. It is idempotent: existing test learners are left as they are.
--   2. Run the CLEANUP block to remove the three learners and all their data (profile, grants,
--      progress and their audit rows). It only matches rows carrying BOTH the flag and a
--      test-learner-*@example.com address, so it cannot touch any other account.

-- ════════════════════════════ SEED ════════════════════════════
do $$
declare
    r record;
    v_id uuid;
begin
    for r in
        select * from (values
            ('test-learner-no-grant@example.com', 'TEST Learner (no grant)', 'none'),
            ('test-learner-active@example.com', 'TEST Learner (active grant)', 'active'),
            ('test-learner-expired@example.com', 'TEST Learner (expired grant)', 'expired')
        ) as t(email, full_name, grant_state)
    loop
        continue when exists (select 1 from auth.users where lower(email) = r.email);
        v_id := gen_random_uuid();
        insert into auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
            confirmation_token, recovery_token, email_change_token_new, email_change,
            email_change_token_current, phone_change, phone_change_token, reauthentication_token
        ) values (
            '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', r.email,
            extensions.crypt(encode(extensions.gen_random_bytes(32), 'base64'), extensions.gen_salt('bf')), now(),
            '{"provider": "email", "providers": ["email"], "bts_test_learner": true}',
            jsonb_build_object('full_name', r.full_name), now(), now(),
            '', '', '', '', '', '', '', ''
        );
        -- the create_profile_for_new_user trigger stores full_name in public.profiles
        insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        values (gen_random_uuid(), v_id, v_id::text,
                jsonb_build_object('sub', v_id::text, 'email', r.email, 'email_verified', true),
                'email', null, now(), now());
        if r.grant_state = 'active' then
            insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note)
            values (v_id, 'beta', now(), now() + interval '1 month', 'TEST seed: active grant');
        elsif r.grant_state = 'expired' then
            insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note)
            values (v_id, 'beta', now() - interval '40 days', now() - interval '10 days', 'TEST seed: expired grant');
        end if;
    end loop;
end $$;

-- ════════════════════════════ CLEANUP ════════════════════════════
-- delete from public.course_access_audit
-- where target_user_id in (
--     select id from auth.users
--     where raw_app_meta_data ->> 'bts_test_learner' = 'true' and email like 'test-learner-%@example.com'
-- );
-- delete from auth.users
-- where raw_app_meta_data ->> 'bts_test_learner' = 'true' and email like 'test-learner-%@example.com';
-- (profiles, grants, quiz results, identities and sessions are removed by ON DELETE CASCADE)
