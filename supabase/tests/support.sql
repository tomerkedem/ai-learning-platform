-- Database tests for in-app support and notifications.
-- Requires migrations 20261002100000_notifications, 20261002110000_support_tickets and
-- 20261002120000_support_learner_route.
-- DEV ONLY. Everything runs inside one transaction that is always rolled back: no test user,
-- ticket, message or notification is ever committed.
-- Run the whole file in the DEV SQL editor (or via execute_sql / supabase db query). Success = the
-- final row "support tests passed". Any failure raises "TEST FAIL: ..." and nothing is committed.
-- Concurrency (the per-learner advisory lock and the ticket row lock) cannot be exercised from one
-- session; section 10 checks that the locks are in place.
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

-- Same, as the anon role (no JWT subject).
create function pg_temp.ta(p_sql text)
returns text
language plpgsql
as $$
declare
    v text;
begin
    begin
        perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
        execute 'set local role anon';
        execute p_sql into v;
        execute 'reset role';
        return coalesce(v, 'OK');
    exception when others then
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

-- A uuid result, or TEST FAIL with the error it returned.
create function pg_temp.id(p_got text, p_what text)
returns uuid
language plpgsql
as $$
begin
    if p_got is null or p_got like 'ERR:%' then
        raise exception 'TEST FAIL: % (got %)', p_what, p_got;
    end if;
    return p_got::uuid;
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
        case when p_confirmed then now() end, '{"provider": "email"}', '{"full_name": "Support Test Learner"}', now(), now());
    return v;
end;
$$;

-- Learner creates a ticket; returns its id or TEST FAIL.
create function pg_temp.ticket(p_uid uuid, p_kind text, p_body text, p_route text default null)
returns uuid
language sql
as $$
    select pg_temp.id(pg_temp.t(p_uid, format('select public.create_support_ticket(%L, %L, %L, %L)', p_kind, p_body, 'en', p_route)),
        'create ticket: ' || p_body);
$$;

-- Unread notifications of a ticket, as "type:count:status" rows joined by commas (postgres view).
create function pg_temp.unread(p_ticket uuid)
returns text
language sql
as $$
    select coalesce(string_agg(n.type || ':' || n.count || ':' || (n.params ->> 'status'), ',' order by n.type), '')
    from public.notifications n where n.subject_id = p_ticket and n.read_at is null;
$$;

do $$
declare
    l_nogrant uuid := pg_temp.user('support-test-nogrant@example.com');
    l_expired uuid := pg_temp.user('support-test-expired@example.com');
    l_revoked uuid := pg_temp.user('support-test-revoked@example.com');
    l_active uuid := pg_temp.user('support-test-active@example.com');
    l_other uuid := pg_temp.user('support-test-other@example.com');
    l_unconfirmed uuid := pg_temp.user('support-test-unconfirmed@example.com', false);
    l_suspended uuid := pg_temp.user('support-test-suspended@example.com');
    l_valid uuid := pg_temp.user('support-test-valid@example.com');
    l_limit uuid := pg_temp.user('support-test-limit@example.com');
    l_rate uuid := pg_temp.user('support-test-rate@example.com');
    l_window uuid := pg_temp.user('support-test-window@example.com');
    l_admin uuid := pg_temp.user('support-test-admin@example.com');
    t1 uuid; t2 uuid; t3 uuid; t4 uuid; t_own uuid; t_chapter uuid; t_noroute uuid; t_crlf uuid; t_old uuid;
    limit_ids uuid[] := '{}';
    fn record;
    pair text[];
    i int;
begin
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note, basis) values
        (l_active, 'beta', now(), now() + interval '1 month', 'support test', 'admin_override'),
        (l_expired, 'beta', now() - interval '40 days', now() - interval '10 days', 'support test', 'admin_override');
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, revoked_at, note, basis)
        values (l_revoked, 'beta', now() - interval '2 days', now() + interval '20 days', now() - interval '1 day', 'support test', 'admin_override');
    insert into public.course_account_suspensions (user_id, suspended) values (l_suspended, true);
    insert into public.course_admins (user_id) values (l_admin);

    -- ══ 0. Privileges and exposure (catalog) ══
    foreach pair slice 1 in array array[array['support_tickets'], array['support_messages']] loop
        perform pg_temp.eq((select c.relrowsecurity::text from pg_class c where c.oid = ('public.' || pair[1])::regclass), 'true', pair[1] || ': RLS enabled');
        perform pg_temp.eq((select count(*)::text from pg_policies p where p.schemaname = 'public' and p.tablename = pair[1]), '0', pair[1] || ': no policies');
        perform pg_temp.eq((has_table_privilege('authenticated', 'public.' || pair[1], 'select, insert, update, delete, truncate, references, trigger'))::text,
            'false', pair[1] || ': authenticated has no privilege');
        perform pg_temp.eq((has_table_privilege('anon', 'public.' || pair[1], 'select, insert, update, delete, truncate, references, trigger'))::text,
            'false', pair[1] || ': anon has no privilege');
    end loop;
    perform pg_temp.eq((select c.relrowsecurity::text from pg_class c where c.oid = 'public.notifications'::regclass), 'true', 'notifications: RLS enabled');
    perform pg_temp.eq(has_table_privilege('authenticated', 'public.notifications', 'select')::text, 'true', 'notifications: learners can read (own rows)');
    perform pg_temp.eq(has_table_privilege('authenticated', 'public.notifications', 'insert, update, delete, truncate, references, trigger')::text, 'false', 'notifications: learners cannot write');
    perform pg_temp.eq(has_table_privilege('anon', 'public.notifications', 'select, insert, update, delete, truncate, references, trigger')::text, 'false', 'notifications: anon has nothing');

    for fn in
        select p.oid, n.nspname || '.' || p.proname as name from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where (n.nspname = 'private' and (p.proname like '%support%' or p.proname = 'notify'))
    loop
        perform pg_temp.eq(has_function_privilege('authenticated', fn.oid, 'execute')::text, 'false', fn.name || ': not executable by authenticated');
        perform pg_temp.eq(has_function_privilege('anon', fn.oid, 'execute')::text, 'false', fn.name || ': not executable by anon');
    end loop;
    perform pg_temp.eq((select count(*)::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'private' and (p.proname like '%support%' or p.proname = 'notify')), '13', 'private helper count (all checked above)');
    for fn in
        select p.oid, p.proname as name, p.prosecdef, p.proconfig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and (p.proname like '%support%' or p.proname = 'mark_notifications_read')
    loop
        perform pg_temp.eq(has_function_privilege('anon', fn.oid, 'execute')::text, 'false', fn.name || ': not executable by anon');
        perform pg_temp.eq(has_function_privilege('authenticated', fn.oid, 'execute')::text, 'true', fn.name || ': executable by authenticated');
        perform pg_temp.eq(fn.prosecdef::text, 'true', fn.name || ': security definer');
        perform pg_temp.eq((fn.proconfig @> array['search_path=""'])::text, 'true', fn.name || ': empty search_path');
    end loop;
    perform pg_temp.eq((select count(*)::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and (p.proname like '%support%' or p.proname = 'mark_notifications_read')), '12', 'public operation count (all checked above)');
    -- Learner result shapes never include the internal status columns or any user id.
    perform pg_temp.eq((select count(*)::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname in ('list_my_support_tickets', 'get_my_support_ticket', 'list_my_support_messages')
          and p.proargnames && array['author_user_id', 'user_id', 'status_changed_by', 'author_role', 'awaiting_team_since', 'learner_status']), '0',
        'learner results expose no internal fields');
    -- Exact learner result columns (20261002120000 added route only).
    perform pg_temp.eq((select string_agg(a.name, ',' order by a.ord) from pg_proc p join pg_namespace n on n.oid = p.pronamespace,
            unnest(p.proargnames, p.proargmodes) with ordinality as a(name, mode, ord)
        where n.nspname = 'public' and p.proname = 'list_my_support_tickets' and a.mode = 't'),
        'id,kind,status,created_at,last_activity_at,excerpt,has_unread,route', 'list_my_support_tickets result columns');
    perform pg_temp.eq((select string_agg(a.name, ',' order by a.ord) from pg_proc p join pg_namespace n on n.oid = p.pronamespace,
            unnest(p.proargnames, p.proargmodes) with ordinality as a(name, mode, ord)
        where n.nspname = 'public' and p.proname = 'get_my_support_ticket' and a.mode = 't'),
        'id,kind,status,created_at,last_activity_at,can_reply,route', 'get_my_support_ticket result columns');
    -- Stored context: exactly these columns (no URL, IP, User-Agent or device data).
    perform pg_temp.eq((select string_agg(column_name, ',' order by ordinal_position) from information_schema.columns
        where table_schema = 'public' and table_name = 'support_tickets'),
        'id,user_id,course_id,kind,status,locale,route,created_at,last_activity_at,awaiting_team_since,status_changed_at,status_changed_by',
        'support_tickets columns');
    perform pg_temp.eq((select max_active_tickets || '/' || max_learner_messages_per_day || '/' || max_message_chars from private.support_limits()),
        '10/30/4000', 'abuse limits');

    -- ══ 1. Identity: confirmed, not suspended; course access NOT required ══
    perform pg_temp.eq(pg_temp.ta($q$select public.create_support_ticket('help', 'hi', 'en')$q$), 'ERR:42501', 'anon cannot create');
    perform pg_temp.eq(pg_temp.ta('select count(*) from public.notifications'), 'ERR:42501', 'anon cannot read notifications');
    perform pg_temp.eq(pg_temp.t(l_unconfirmed, $q$select public.create_support_ticket('help', 'hi', 'en')$q$), 'ERR:42501', 'unconfirmed email refused');
    perform pg_temp.eq(pg_temp.t(l_suspended, $q$select public.create_support_ticket('help', 'hi', 'en')$q$), 'ERR:42501', 'suspended refused (create)');
    perform pg_temp.eq(pg_temp.t(l_suspended, 'select count(*) from public.list_my_support_tickets()'), 'ERR:42501', 'suspended refused (list)');
    perform pg_temp.eq(pg_temp.t(l_nogrant, 'select status from public.course_access_status()'), 'no-grant', 'fixture: no grant');
    perform pg_temp.eq(pg_temp.t(l_expired, 'select status from public.course_access_status()'), 'expired', 'fixture: expired');
    perform pg_temp.eq(pg_temp.t(l_revoked, 'select status from public.course_access_status()'), 'revoked', 'fixture: revoked');
    perform pg_temp.eq(pg_temp.t(l_active, 'select status from public.course_access_status()'), 'active', 'fixture: active');
    t1 := pg_temp.ticket(l_nogrant, 'problem', 'The lab in chapter 3 does not load.', '/behind-the-scenes-ai/chapter-3');
    t2 := pg_temp.ticket(l_expired, 'help', 'How do I renew access?');
    t3 := pg_temp.ticket(l_revoked, 'feedback', 'Great course.');
    t4 := pg_temp.ticket(l_active, 'help', 'Question about tokens.');
    perform pg_temp.eq((select s.status from public.support_tickets s where s.id = t1), 'new', 'new ticket starts as new');
    perform pg_temp.eq((select (s.awaiting_team_since is not null)::text from public.support_tickets s where s.id = t1), 'true', 'new ticket awaits the team');
    perform pg_temp.eq((select count(*)::text from public.support_messages m where m.ticket_id = t1 and m.author_role = 'learner' and m.author_user_id = l_nogrant), '1',
        'first message stored with the learner as author');

    -- ══ 2. Validation and privacy of the stored context ══
    perform pg_temp.eq(pg_temp.t(l_valid, $q$select public.create_support_ticket('bug', 'hi', 'en')$q$), 'ERR:22023', 'invalid kind');
    perform pg_temp.eq(pg_temp.t(l_valid, $q$select public.create_support_ticket(null, 'hi', 'en')$q$), 'ERR:22023', 'null kind');
    perform pg_temp.eq(pg_temp.t(l_valid, $q$select public.create_support_ticket('help', 'hi', 'fr')$q$), 'ERR:22023', 'invalid locale');
    perform pg_temp.eq(pg_temp.t(l_valid, $q$select public.create_support_ticket('help', '', 'en')$q$), 'ERR:22023', 'empty body');
    perform pg_temp.eq(pg_temp.t(l_valid, $q$select public.create_support_ticket('help', E' \r\n\t ', 'en')$q$), 'ERR:22023', 'whitespace-only body');
    perform pg_temp.eq(pg_temp.t(l_valid, $q$select public.create_support_ticket('help', null, 'en')$q$), 'ERR:22023', 'null body');
    perform pg_temp.eq(pg_temp.t(l_valid, format('select public.create_support_ticket(%L, %L, %L)', 'help', repeat('x', 4001), 'en')), 'ERR:22023', '4001 characters refused');
    perform pg_temp.eq(pg_temp.t(l_valid, $q$select public.create_support_ticket('help', E'bell \x07 here', 'en')$q$), 'ERR:22023', 'control character refused');
    foreach pair slice 1 in array array[
        array['/behind-the-scenes-ai/chapter-3?x=1', 'query string'],
        array['/behind-the-scenes-ai/chapter-3#access_token=abc', 'hash'],
        array['https://evil.example/behind-the-scenes-ai', 'absolute URL'],
        array['//evil.example/behind-the-scenes-ai', 'protocol-relative URL'],
        array['/math/mathIntuitive/introduction', 'another course'],
        array['/behind-the-scenes-ai/../admin', 'dot segment'],
        array['/behind-the-scenes-ai/Chapter-3', 'uppercase'],
        array['/behind-the-scenes-ai/a/b/c/d', 'too many segments'],
        array['/behind-the-scenes-ai/', 'trailing slash'],
        array['/behind-the-scenes-ai/' || repeat('a', 65), 'segment too long'],
        array['', 'empty route']
    ] loop
        perform pg_temp.eq(pg_temp.t(l_valid, format('select public.create_support_ticket(%L, %L, %L, %L)', 'problem', 'x', 'en', pair[1])),
            'ERR:22023', 'route refused: ' || pair[2]);
    end loop;
    t_chapter := pg_temp.ticket(l_valid, 'problem', repeat('y', 4000), '/behind-the-scenes-ai/chapter-12');
    t_noroute := pg_temp.ticket(l_valid, 'help', E'tab\tallowed');
    t_crlf := pg_temp.ticket(l_valid, 'help', E'  line one\r\nline two\r\n\n  ', '/behind-the-scenes-ai/support/new');
    perform pg_temp.eq((select s.route from public.support_tickets s where s.id = t_chapter), '/behind-the-scenes-ai/chapter-12', 'pathname stored as given');
    perform pg_temp.eq((select coalesce(s.route, 'null') from public.support_tickets s where s.id = t_noroute), 'null', 'route optional');
    perform pg_temp.eq((select m.body from public.support_messages m where m.ticket_id = t_crlf), E'line one\nline two', 'CRLF normalized and trimmed');
    -- The learner receives the persisted route of their own requests (and null when none).
    perform pg_temp.eq(pg_temp.t(l_valid, format('select route from public.get_my_support_ticket(%L)', t_chapter)), '/behind-the-scenes-ai/chapter-12', 'learner get: own route');
    perform pg_temp.eq(pg_temp.t(l_valid, format('select route from public.list_my_support_tickets() where id = %L', t_chapter)), '/behind-the-scenes-ai/chapter-12', 'learner list: own route');
    perform pg_temp.eq(pg_temp.t(l_valid, format('select coalesce(route, %L) from public.get_my_support_ticket(%L)', 'null', t_noroute)), 'null', 'learner get: null route stays null');
    perform pg_temp.eq(pg_temp.t(l_valid, format('select coalesce(route, %L) from public.list_my_support_tickets() where id = %L', 'null', t_noroute)), 'null', 'learner list: null route stays null');
    perform pg_temp.eq(pg_temp.t(l_other, format('select count(*) from public.get_my_support_ticket(%L)', t_chapter)), '0', 'other learner: no row, no route');
    perform pg_temp.eq(pg_temp.t(l_other, format('select count(*) from public.list_my_support_tickets() where route is not null')), '0', 'other learner lists no routes');
    perform pg_temp.eq(pg_temp.t(l_valid, 'select count(*) from public.support_tickets'), 'ERR:42501', 'still no direct ticket read');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select chapter_id from public.admin_get_support_ticket(%L)', t_chapter)), '12', 'chapter derived from route');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select coalesce(chapter_id::text, %L) from public.admin_get_support_ticket(%L)', 'null', t_crlf)), 'null', 'no chapter outside chapter routes');
    -- Table constraints are the backstop for any other write path.
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.support_tickets (user_id, kind, locale, route) values (%L, 'help', 'en', '/behind-the-scenes-ai?x')$q$, l_valid)),
        'ERR:23514', 'constraint: route');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.support_messages (ticket_id, author_role, author_user_id, body) values (%L, 'learner', %L, ' padded ')$q$, t_noroute, l_valid)),
        'ERR:23514', 'constraint: body');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.support_tickets (user_id, kind, status, locale) values (%L, 'help', 'triage', 'en')$q$, l_valid)),
        'ERR:23514', 'constraint: status');

    -- ══ 3. Isolation ══
    perform pg_temp.eq(pg_temp.t(l_other, 'select count(*) from public.list_my_support_tickets()'), '0', 'other learner lists nothing');
    perform pg_temp.eq(pg_temp.t(l_other, format('select count(*) from public.get_my_support_ticket(%L)', t1)), '0', 'other learner cannot get the ticket');
    perform pg_temp.eq(pg_temp.t(l_other, format('select count(*) from public.list_my_support_messages(%L)', t1)), '0', 'other learner cannot read messages');
    perform pg_temp.eq(pg_temp.t(l_other, format('select public.add_support_message(%L, %L)', t1, 'hijack')), 'ERR:BT104', 'other learner cannot reply');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select count(*) from public.get_my_support_ticket(%L)', gen_random_uuid())), '0', 'unknown ticket: no row');
    perform pg_temp.eq(pg_temp.t(l_nogrant, 'select count(*) from public.support_tickets'), 'ERR:42501', 'no direct ticket read');
    perform pg_temp.eq(pg_temp.t(l_nogrant, 'select count(*) from public.support_messages'), 'ERR:42501', 'no direct message read');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format($q$insert into public.support_messages (ticket_id, author_role, author_user_id, body) values (%L, 'admin', %L, 'fake')$q$, t1, l_nogrant)),
        'ERR:42501', 'no direct message write');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format($q$update public.support_tickets set status = 'resolved' where id = %L$q$, t1)), 'ERR:42501', 'no direct ticket write');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format($q$insert into public.notifications (user_id, type, subject_id, params) values (%L, 'support_reply', %L, '{"kind":"help","status":"open"}')$q$, l_nogrant, t1)),
        'ERR:42501', 'no direct notification insert');
    perform pg_temp.eq(pg_temp.t(l_nogrant, 'update public.notifications set read_at = now()'), 'ERR:42501', 'no direct notification update');
    perform pg_temp.eq(pg_temp.t(l_nogrant, 'delete from public.notifications'), 'ERR:42501', 'no direct notification delete');
    perform pg_temp.eq(pg_temp.t(l_nogrant, $q$select private.support_learner_status('new')$q$), 'ERR:42501', 'private helpers not callable');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format($q$select private.notify(%L, 'support_reply', %L, '{"kind":"help","status":"open"}')$q$, l_nogrant, t1)),
        'ERR:42501', 'private.notify not callable');

    -- ══ 4. Learner-status projection ══
    foreach pair slice 1 in array array[
        array['new', 'open'], array['open', 'open'], array['in_progress', 'open'],
        array['waiting_on_learner', 'waiting_for_you'], array['resolved', 'resolved'], array['closed', 'closed']
    ] loop
        perform pg_temp.eq(private.support_learner_status(pair[1]), pair[2], 'mapping ' || pair[1]);
    end loop;
    -- Every status the table accepts has a mapping.
    perform pg_temp.eq((select count(*)::text from unnest(array['new', 'open', 'in_progress', 'waiting_on_learner', 'resolved', 'closed']) s
        where private.support_learner_status(s) is null), '0', 'all statuses mapped');
    perform pg_temp.eq((select pg_get_constraintdef(c.oid) like '%''new''::text, ''open''::text, ''in_progress''::text, ''waiting_on_learner''::text, ''resolved''::text, ''closed''::text%'
        from pg_constraint c where c.conrelid = 'public.support_tickets'::regclass and c.contype = 'c' and pg_get_constraintdef(c.oid) like '%status%in_progress%')::text,
        'true', 'status check lists exactly the mapped statuses');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select status from public.get_my_support_ticket(%L)', t1)), 'open', 'learner sees new as open');

    -- ══ 5. Lifecycle, reopen, notifications, timestamps (t1: learner l_nogrant) ══
    update public.support_tickets set last_activity_at = now() - interval '1 day' where id = t1;
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'in_progress')), 'in_progress', 'admin: new -> in_progress');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select status from public.get_my_support_ticket(%L)', t1)), 'open', 'learner sees in_progress as open');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select status || %L || learner_status from public.admin_get_support_ticket(%L)', '/', t1)), 'in_progress/open', 'admin sees both statuses');
    perform pg_temp.eq((select (s.last_activity_at = now() - interval '1 day')::text from public.support_tickets s where s.id = t1), 'true', 'internal-only change keeps last_activity_at');
    perform pg_temp.eq((select s.status_changed_by::text from public.support_tickets s where s.id = t1), l_admin::text, 'status_changed_by records the admin');
    perform pg_temp.eq(pg_temp.unread(t1), '', 'internal-only change: no notification');

    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t1, 'Which browser do you use?')), 'in_progress', 'reply keeps a non-new status');
    perform pg_temp.eq((select (s.awaiting_team_since is null and s.last_activity_at = now())::text from public.support_tickets s where s.id = t1), 'true',
        'reply clears attention and moves last_activity_at');
    perform pg_temp.eq(pg_temp.unread(t1), 'support_reply:1:open', 'reply notifies with the learner status');
    perform pg_temp.eq((select n.params::text from public.notifications n where n.subject_id = t1), '{"kind": "problem", "status": "open"}', 'notification params: kind and learner status only');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t1, 'Also, which device?')), 'in_progress', 'second reply');
    perform pg_temp.eq(pg_temp.unread(t1), 'support_reply:2:open', 'second reply deduplicated (count 2)');
    perform pg_temp.eq((select count(*)::text from public.notifications n where n.subject_id = t1), '1', 'one notification row for both replies');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select has_unread from public.list_my_support_tickets() where id = %L', t1)), 'true', 'learner list: unread');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select count(*) from public.notifications where subject_id = %L and read_at is null', t1)), '1', 'learner reads own notification');
    perform pg_temp.eq(pg_temp.t(l_other, 'select count(*) from public.notifications'), '0', 'other learner sees no notifications');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select string_agg(author, %L order by created_at) from public.list_my_support_messages(%L)', ',', t1)),
        'you,team,team', 'learner sees you/team only');

    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'waiting_on_learner')), 'waiting_on_learner', 'admin: waiting_on_learner');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select status from public.get_my_support_ticket(%L)', t1)), 'waiting_for_you', 'learner sees waiting_for_you');
    perform pg_temp.eq(pg_temp.unread(t1), 'support_reply:2:waiting_for_you', 'status change folded into the unread reply');

    -- Reopen: learner reply to waiting_on_learner -> open
    perform pg_temp.eq((pg_temp.t(l_nogrant, format('select public.add_support_message(%L, %L)', t1, 'Firefox on Android.')) like 'ERR:%')::text, 'false', 'learner reply accepted');
    perform pg_temp.eq((select s.status from public.support_tickets s where s.id = t1), 'open', 'waiting_on_learner + learner reply -> open');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select status from public.get_my_support_ticket(%L)', t1)), 'open', 'learner no longer sees waiting_for_you');
    perform pg_temp.eq((select (s.status_changed_by = l_nogrant and s.awaiting_team_since is not null)::text from public.support_tickets s where s.id = t1), 'true',
        'reopen records the learner and awaits the team');
    perform pg_temp.eq(pg_temp.unread(t1), '', 'learner reply marks the ticket read');
    perform pg_temp.eq((select count(*)::text from public.notifications n where n.subject_id = t1), '1', 'learner actions create no notification');

    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'resolved')), 'resolved', 'admin: resolved');
    perform pg_temp.eq(pg_temp.unread(t1), 'support_status:1:resolved', 'visible status change notifies (no unread reply)');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'closed')), 'closed', 'admin: closed');
    perform pg_temp.eq(pg_temp.unread(t1), 'support_status:2:closed', 'status notifications deduplicated');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select can_reply::text from public.get_my_support_ticket(%L)', t1)), 'false', 'closed: cannot reply');
    perform pg_temp.eq(pg_temp.t(l_nogrant, format('select public.add_support_message(%L, %L)', t1, 'hello?')), 'ERR:BT103', 'learner reply to closed refused');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t1, 'hello')), 'ERR:BT103', 'admin reply to closed refused');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'closed')), 'closed', 'same status: no change');
    perform pg_temp.eq(pg_temp.unread(t1), 'support_status:2:closed', 'same status: no notification');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'open')), 'open', 'admin reopens a closed ticket');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L, %L)', t1, 'Fixed now.', 'resolved')), 'resolved', 'reply and resolve in one call');
    perform pg_temp.eq(pg_temp.unread(t1), 'support_reply:1:resolved', 'reply supersedes the unread status notification');

    -- Reopen: learner reply to resolved -> open
    perform pg_temp.eq((pg_temp.t(l_nogrant, format('select public.add_support_message(%L, %L)', t1, 'Still broken.')) like 'ERR:%')::text, 'false', 'reply to resolved accepted');
    perform pg_temp.eq((select s.status from public.support_tickets s where s.id = t1), 'open', 'resolved + learner reply -> open');

    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'new')), 'ERR:22023', 'new cannot be set');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t1, 'triage')), 'ERR:22023', 'unknown status refused');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L, %L)', t1, 'x', 'new')), 'ERR:22023', 'reply cannot set new');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t1, '   ')), 'ERR:22023', 'admin empty reply refused');

    -- Admin reply on a new ticket: new -> open
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t2, 'Ask for beta access again.')), 'open', 'reply: new -> open');
    -- Mark read (one subject and all), and a later event starts a new row
    perform pg_temp.eq(pg_temp.t(l_expired, format('select public.mark_notifications_read(%L)', t1)), '0', 'mark read: other learner subject untouched');
    perform pg_temp.eq(pg_temp.t(l_expired, format('select public.mark_notifications_read(%L)', t2)), '1', 'mark read by subject');
    perform pg_temp.eq(pg_temp.unread(t2), '', 'subject read');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t2, 'Any news?')), 'open', 'reply after read');
    perform pg_temp.eq((select count(*)::text from public.notifications n where n.subject_id = t2), '2', 'event after read creates a new row');
    perform pg_temp.eq(pg_temp.t(l_expired, 'select public.mark_notifications_read()'), '1', 'mark all read');
    perform pg_temp.eq(pg_temp.ta('select public.mark_notifications_read()'), 'ERR:42501', 'anon cannot mark read');
    -- Learner-safe params enforced by the table
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.notifications (user_id, type, subject_id, params) values (%L, 'support_status', %L, '{"kind":"help","status":"in_progress"}')$q$, l_expired, t2)),
        'ERR:23514', 'internal status cannot be stored in a notification');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.notifications (user_id, type, subject_id, params) values (%L, 'support_status', %L, '{"kind":"help","status":"open","admin":"x"}')$q$, l_expired, t2)),
        'ERR:23514', 'no extra notification parameters');
    perform pg_temp.eq(pg_temp.t(null, format($q$insert into public.notifications (user_id, type, subject_id, params) values (%L, 'beta_approved', %L, '{}')$q$, l_expired, t2)),
        'ERR:23514', 'only V1 notification types');

    -- ══ 6. Admin self-handling and admin authorization ══
    t_own := pg_temp.ticket(l_admin, 'help', 'Admin testing as a learner.');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t_own, 'self answer')), 'ERR:BT105', 'admin cannot reply to own ticket');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L, %L)', t_own, 'self answer', 'resolved')), 'ERR:BT105', 'admin cannot reply+resolve own ticket');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t_own, 'resolved')), 'ERR:BT105', 'admin cannot change own ticket status');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', t_own, 'closed')), 'ERR:BT105', 'admin cannot close own ticket');
    perform pg_temp.eq((select s.status || '/' || (select count(*) from public.support_messages m where m.ticket_id = t_own) from public.support_tickets s where s.id = t_own),
        'new/1', 'own ticket unchanged after refused mutations');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select is_own::text from public.admin_get_support_ticket(%L)', t_own)), 'true', 'admin can read own ticket');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(*) from public.admin_list_support_messages(%L)', t_own)), '1', 'admin can read own messages');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(*) from public.admin_list_support_tickets(%L) where id = %L', 'all', t_own)), '1', 'own ticket in the all view');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(*) from public.admin_list_support_tickets(%L) where id = %L', 'attention', t_own)), '0', 'own ticket not in attention');
    perform pg_temp.eq((pg_temp.t(l_admin, format('select public.add_support_message(%L, %L)', t_own, 'more detail')) like 'ERR:%')::text, 'false', 'admin may reply as the learner');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', gen_random_uuid(), 'x')), 'ERR:BT104', 'admin reply: unknown ticket');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select status from public.admin_get_support_ticket(%L)', gen_random_uuid())), 'ERR:BT104', 'admin get: unknown ticket');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(*) from public.admin_list_support_messages(%L)', gen_random_uuid())), 'ERR:BT104', 'admin messages: unknown ticket');
    foreach pair slice 1 in array array[
        array['select attention_count from public.admin_support_counts()', 'counts'],
        array['select count(*) from public.admin_list_support_tickets()', 'list'],
        array[format('select status from public.admin_get_support_ticket(%L)', t2), 'get'],
        array[format('select count(*) from public.admin_list_support_messages(%L)', t2), 'messages'],
        array[format('select public.admin_reply_support_ticket(%L, %L)', t2, 'x'), 'reply'],
        array[format('select public.admin_set_support_status(%L, %L)', t2, 'closed'), 'status']
    ] loop
        perform pg_temp.eq(pg_temp.t(l_other, pair[1]), 'ERR:42501', 'learner refused: admin ' || pair[2]);
        perform pg_temp.eq(pg_temp.ta(pair[1]), 'ERR:42501', 'anon refused: admin ' || pair[2]);
    end loop;
    perform pg_temp.eq((select s.status from public.support_tickets s where s.id = t2), 'open', 'refused non-admin status change left the ticket unchanged');

    -- ══ 7. Admin views, attention and counts ══
    update public.support_tickets set awaiting_team_since = now() - interval '3 days' where id = t3;
    update public.support_tickets set awaiting_team_since = now() - interval '2 days' where id = t4;
    perform pg_temp.eq(pg_temp.t(l_admin, 'select id from public.admin_list_support_tickets() limit 1'), t3::text, 'attention: oldest waiting first');
    perform pg_temp.eq(pg_temp.t(l_admin, 'select attention_count || ''/'' || new_count || ''/'' || oldest_attention_since from public.admin_support_counts()'),
        (select count(*) filter (where s.awaiting_team_since is not null) || '/' || count(*) filter (where s.status = 'new') || '/' || min(s.awaiting_team_since)
         from public.support_tickets s where s.status not in ('resolved', 'closed') and s.user_id <> l_admin),
        'counts derived from tickets, excluding own');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(*) from public.admin_list_support_tickets(%L) where id = %L', 'attention', t2)), '0', 'answered ticket leaves attention');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(*) from public.admin_list_support_tickets(%L) where id = %L', 'attention', t1)), '1', 'learner reply puts it back in attention');
    perform pg_temp.eq(pg_temp.t(l_admin, $q$select count(*) from public.admin_list_support_tickets('all', null, null, 200)
        where (status, learner_status) not in (('new', 'open'), ('open', 'open'), ('in_progress', 'open'),
            ('waiting_on_learner', 'waiting_for_you'), ('resolved', 'resolved'), ('closed', 'closed'))$q$), '0', 'admin list learner_status matches the mapping');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select id from public.admin_list_support_tickets(%L, null, %L)', 'all', 'support-test-revoked@')), t3::text, 'search by email');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(*) from public.admin_list_support_tickets(%L, %L) where kind <> %L', 'all', 'feedback', 'feedback')), '0', 'kind filter');
    perform pg_temp.eq(pg_temp.t(l_admin, $q$select count(*) from public.admin_list_support_tickets('everything')$q$), 'ERR:22023', 'invalid view');
    perform pg_temp.eq(pg_temp.t(l_admin, $q$select count(*) from public.admin_list_support_tickets('all', 'bug')$q$), 'ERR:22023', 'invalid kind filter');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select access_status || %L || learner_suspended from public.admin_get_support_ticket(%L)', '/', t2)), 'expired/false', 'admin sees live access');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select string_agg(author_role, %L order by created_at) from public.admin_list_support_messages(%L)', ',', t1)),
        'learner,admin,admin,learner,admin,learner', 'admin sees roles in order');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select count(distinct author_user_id) from public.admin_list_support_messages(%L) where author_role = %L', t1, 'admin')), '1',
        'admin actor ids kept for admins');

    -- ══ 8. Abuse limits (10 active tickets, 30 learner messages per rolling 24 hours) ══
    for i in 1..10 loop
        limit_ids := limit_ids || pg_temp.ticket(l_limit, 'help', 'request ' || i);
    end loop;
    perform pg_temp.eq(pg_temp.t(l_limit, $q$select public.create_support_ticket('help', 'request 11', 'en')$q$), 'ERR:BT101', '11th active ticket refused');
    perform pg_temp.eq((select count(*)::text from public.support_tickets s where s.user_id = l_limit), '10', 'refused ticket not stored');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', limit_ids[1], 'resolved')), 'resolved', 'resolve one');
    perform pg_temp.ticket(l_limit, 'help', 'request 11 after resolve');
    perform pg_temp.eq((select count(*)::text from public.support_tickets s where s.user_id = l_limit and s.status not in ('resolved', 'closed')), '10', 'resolving frees a slot');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_set_support_status(%L, %L)', limit_ids[2], 'closed')), 'closed', 'close one');
    perform pg_temp.ticket(l_limit, 'help', 'request 12 after close');
    perform pg_temp.eq(pg_temp.t(l_limit, $q$select public.create_support_ticket('help', 'request 13', 'en')$q$), 'ERR:BT101', 'cap holds again at 10');
    -- Reopening by reply is a reply, not a new request: it is not blocked by the active cap.
    perform pg_temp.eq((pg_temp.t(l_limit, format('select public.add_support_message(%L, %L)', limit_ids[1], 'reopen')) like 'ERR:%')::text, 'false', 'reply may reopen above the cap');

    t_old := pg_temp.ticket(l_rate, 'help', 'message 1');
    for i in 2..30 loop
        perform pg_temp.eq((pg_temp.t(l_rate, format('select public.add_support_message(%L, %L)', t_old, 'message ' || i)) like 'ERR:%')::text, 'false', 'message ' || i || ' within limit');
    end loop;
    perform pg_temp.eq(pg_temp.t(l_rate, format('select public.add_support_message(%L, %L)', t_old, 'message 31')), 'ERR:BT102', '31st message in 24h refused');
    perform pg_temp.eq(pg_temp.t(l_rate, $q$select public.create_support_ticket('help', 'new one', 'en')$q$), 'ERR:BT102', 'a new ticket counts as a message');
    perform pg_temp.eq((select count(*)::text from public.support_messages m where m.author_user_id = l_rate), '30', 'refused messages not stored');
    perform pg_temp.eq(pg_temp.t(l_admin, format('select public.admin_reply_support_ticket(%L, %L)', t_old, 'Admins have no message limit.')), 'open', 'admin messages not limited');

    -- Rolling window: messages older than 24 hours do not count.
    t_old := pg_temp.ticket(l_window, 'help', 'fresh start');
    insert into public.support_messages (ticket_id, author_role, author_user_id, body, created_at)
    select t_old, 'learner', l_window, 'old ' || g, now() - interval '25 hours' from generate_series(1, 40) g;
    perform pg_temp.eq((pg_temp.t(l_window, format('select public.add_support_message(%L, %L)', t_old, 'after old ones')) like 'ERR:%')::text, 'false', 'messages older than 24h ignored');
    insert into public.support_messages (ticket_id, author_role, author_user_id, body, created_at)
    select t_old, 'learner', l_window, 'recent ' || g, now() - interval '23 hours' from generate_series(1, 28) g;
    perform pg_temp.eq(pg_temp.t(l_window, format('select public.add_support_message(%L, %L)', t_old, 'one too many')), 'ERR:BT102', 'messages inside 24h counted');

    -- ══ 9. Immutability and account deletion ══
    perform pg_temp.eq(pg_temp.t(null, format($q$update public.support_messages set body = 'edited' where ticket_id = %L$q$, t2)), 'ERR:42501', 'messages cannot be edited');
    perform pg_temp.eq(pg_temp.t(null, format('delete from public.support_messages where ticket_id = %L', t2)), 'ERR:42501', 'messages cannot be deleted directly');
    delete from auth.users where id = l_nogrant;
    perform pg_temp.eq((select count(*)::text from public.support_tickets s where s.user_id = l_nogrant), '0', 'tickets cascade with the account');
    perform pg_temp.eq((select count(*)::text from public.support_messages m where m.ticket_id = t1), '0', 'messages cascade with the account');
    perform pg_temp.eq((select count(*)::text from public.notifications n where n.user_id = l_nogrant), '0', 'notifications cascade with the account');
    -- Removing an admin keeps the messages they wrote on other learners' tickets.
    delete from public.course_admins where user_id = l_admin;
    delete from auth.users where id = l_admin;
    perform pg_temp.eq((select count(*)::text from public.support_messages m where m.ticket_id = t2 and m.author_role = 'admin' and m.author_user_id = l_admin), '2',
        'admin-authored messages survive admin removal');
    perform pg_temp.eq((select count(*)::text from public.support_tickets s where s.id = t_own), '0', 'admin own ticket cascades with the admin account');

    -- ══ 10. Concurrency protections are in place ══
    perform pg_temp.eq((select (prosrc like '%pg_advisory_xact_lock%')::text from pg_proc where proname = 'lock_support_learner'), 'true', 'per-learner advisory lock');
    perform pg_temp.eq((select string_agg(proname, ',' order by proname) from pg_proc
        where proname in ('create_support_ticket', 'add_support_message') and prosrc like '%private.lock_support_learner%'),
        'add_support_message,create_support_ticket', 'learner writes take the learner lock');
    perform pg_temp.eq((select string_agg(proname, ',' order by proname) from pg_proc
        where proname in ('add_support_message', 'lock_support_ticket_for_admin') and prosrc like '%for update%'),
        'add_support_message,lock_support_ticket_for_admin', 'ticket row locked by every mutation');
    perform pg_temp.eq((select string_agg(proname, ',' order by proname) from pg_proc
        where proname in ('admin_reply_support_ticket', 'admin_set_support_status') and prosrc like '%private.lock_support_ticket_for_admin%'),
        'admin_reply_support_ticket,admin_set_support_status', 'admin mutations use the self-handling guard');
end $$;

rollback;

select 'support tests passed' as result;
