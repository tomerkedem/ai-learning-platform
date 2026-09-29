-- Account suspension (distinct from revoking course access).
--
-- Revoke: ends beta grants; the learner can still sign in and use public pages.
-- Suspend: the learner cannot open protected content (enforced here, immediately, on the next
-- request of any existing session) and cannot sign in (Supabase Auth ban, applied by the
-- server with the service-role key, never from the browser).
--
-- public.course_account_suspensions is the source of truth for the intended state:
--   suspended    what the admin asked for
--   auth_synced  whether Supabase Auth confirmed the matching ban/unban
--   last_error   the last Auth failure, shown to admins
-- Ordering (in the server action) keeps every partial failure on the restrictive side:
--   suspend    = begin (row suspended, not synced) -> Auth ban -> finish (records the outcome)
--   reactivate = check target -> Auth unban -> finish (clears the row only if Auth succeeded)
-- Every step is idempotent, so retries are safe. Admins (including the caller) are refused.

create table public.course_account_suspensions (
    user_id uuid primary key references auth.users (id) on delete cascade,
    suspended boolean not null,
    auth_synced boolean not null default false,
    last_error text check (char_length(last_error) <= 500),
    updated_at timestamptz not null default now(),
    updated_by uuid
);
alter table public.course_account_suspensions enable row level security;
create policy "course_account_suspensions_select_own" on public.course_account_suspensions
    for select to authenticated using ((select auth.uid()) = user_id);
revoke all on table public.course_account_suspensions from anon, authenticated;
grant select on table public.course_account_suspensions to authenticated;

alter table public.course_access_audit drop constraint course_access_audit_action_check;
alter table public.course_access_audit add constraint course_access_audit_action_check
    check (action in ('approve', 'revoke', 'rename', 'suspend', 'reactivate'));

-- Suspension first: a suspended account gets 'suspended' whatever its grants say.
create or replace function public.course_access_status(p_course_id text default 'behind-the-scenes-ai')
returns table (status text, expires_at timestamptz)
language sql
stable
security invoker
set search_path = ''
as $$
    with latest as (
        select g.approved_at, g.expires_at, g.revoked_at
        from public.course_access_grants g
        where g.user_id = (select auth.uid()) and g.course_id = p_course_id
        order by (g.revoked_at is null and g.approved_at <= now() and now() < g.expires_at) desc,
                 g.approved_at desc
        limit 1
    )
    select
        case
            when exists (
                select 1 from public.course_account_suspensions s
                where s.user_id = (select auth.uid()) and s.suspended
            ) then 'suspended'
            when l.approved_at is null then 'no-grant'
            when l.revoked_at is not null then 'revoked'
            when now() >= l.expires_at then 'expired'
            when now() < l.approved_at then 'no-grant'
            else 'active'
        end,
        case when l.revoked_at is null then l.expires_at end
    from (select 1) as one
    left join latest l on true;
$$;

-- Caller must be an admin; the target must exist and must not be an admin (covers the caller).
create function private.assert_can_manage_account(p_user_id uuid)
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    if not exists (select 1 from auth.users where id = p_user_id) then
        raise exception 'No such user' using errcode = '22023';
    end if;
    if private.is_course_admin(p_user_id) then
        raise exception 'Admin accounts cannot be suspended or reactivated here' using errcode = '42501';
    end if;
end;
$$;

-- Step 1 of suspend: block access now. Idempotent.
create function public.admin_begin_suspension(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    perform private.assert_can_manage_account(p_user_id);
    insert into public.course_account_suspensions (user_id, suspended, auth_synced, last_error, updated_at, updated_by)
    values (p_user_id, true, false, null, now(), (select auth.uid()))
    on conflict (user_id) do update
        set suspended = true, auth_synced = false, last_error = null, updated_at = now(), updated_by = excluded.updated_by;
end;
$$;

-- Step 1 of reactivate: only checks permission, so Auth is never called for a refused target.
create function public.admin_check_account_target(p_user_id uuid)
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
    perform private.assert_can_manage_account(p_user_id);
end;
$$;

-- Last step of either action: records what Supabase Auth actually did, and audits it.
create function public.admin_finish_account_action(p_user_id uuid, p_action text, p_auth_ok boolean, p_error text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_error text := left(p_error, 500);
    v_outcome text := case when p_auth_ok then 'succeeded' else 'auth_failed' end;
begin
    perform private.assert_can_manage_account(p_user_id);
    if p_action = 'suspend' then
        -- stays suspended either way; only the Auth confirmation changes
        insert into public.course_account_suspensions (user_id, suspended, auth_synced, last_error, updated_at, updated_by)
        values (p_user_id, true, p_auth_ok, case when p_auth_ok then null else v_error end, now(), (select auth.uid()))
        on conflict (user_id) do update
            set suspended = true, auth_synced = excluded.auth_synced, last_error = excluded.last_error,
                updated_at = now(), updated_by = excluded.updated_by;
    elsif p_action = 'reactivate' then
        if p_auth_ok then
            update public.course_account_suspensions
            set suspended = false, auth_synced = true, last_error = null, updated_at = now(), updated_by = (select auth.uid())
            where user_id = p_user_id;
        else
            -- Auth still has the ban (or its state is unknown): the account stays suspended
            update public.course_account_suspensions
            set last_error = v_error, updated_at = now(), updated_by = (select auth.uid())
            where user_id = p_user_id;
        end if;
    else
        raise exception 'Unknown action %', p_action using errcode = '22023';
    end if;
    insert into public.course_access_audit (grant_id, target_user_id, action, actor_user_id, details)
    values (null, p_user_id, p_action, (select auth.uid()),
            jsonb_strip_nulls(jsonb_build_object('outcome', v_outcome, 'error', case when p_auth_ok then null else v_error end)));
    return v_outcome;
end;
$$;

-- Admin list: also admin flag and suspension state.
drop function public.admin_list_learners(text, integer, integer);

create function public.admin_list_learners(p_query text default null, p_limit integer default 50, p_offset integer default 0)
returns table (
    user_id uuid,
    email text,
    full_name text,
    email_confirmed_at timestamptz,
    registered_at timestamptz,
    is_admin boolean,
    suspended boolean,
    suspension_auth_synced boolean,
    suspension_error text,
    access_status text,
    access_approved_at timestamptz,
    access_expires_at timestamptz,
    access_revoked_at timestamptz,
    last_action text,
    last_action_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_q text := lower(btrim(coalesce(p_query, '')));
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    return query
    select u.id, u.email::text, p.full_name, u.email_confirmed_at, u.created_at,
           private.is_course_admin(u.id), coalesce(s.suspended, false), s.auth_synced, s.last_error,
           d.status, d.approved_at, d.expires_at, d.revoked_at, a.action, a.created_at
    from auth.users u
    left join public.profiles p on p.user_id = u.id
    left join public.course_account_suspensions s on s.user_id = u.id
    cross join lateral private.access_detail_for(u.id) d
    left join lateral (
        select x.action, x.created_at from public.course_access_audit x
        where x.target_user_id = u.id order by x.created_at desc limit 1
    ) a on true
    where v_q = ''
       or position(v_q in lower(u.email)) > 0
       or position(v_q in lower(coalesce(p.full_name, ''))) > 0
    order by u.created_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
    offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

revoke execute on function private.assert_can_manage_account(uuid) from public, anon, authenticated;
revoke execute on function public.admin_begin_suspension(uuid) from public, anon;
revoke execute on function public.admin_check_account_target(uuid) from public, anon;
revoke execute on function public.admin_finish_account_action(uuid, text, boolean, text) from public, anon;
revoke execute on function public.admin_list_learners(text, integer, integer) from public, anon;
grant execute on function public.admin_begin_suspension(uuid) to authenticated;
grant execute on function public.admin_check_account_target(uuid) to authenticated;
grant execute on function public.admin_finish_account_action(uuid, text, boolean, text) to authenticated;
grant execute on function public.admin_list_learners(text, integer, integer) to authenticated;
