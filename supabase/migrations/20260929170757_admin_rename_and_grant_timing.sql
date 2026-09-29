-- Admin page improvements: admin-only name edits (audited) and grant timing in the learner list.
--
-- - course_access_audit gains a 'rename' action with details {from, to}. Grant actions keep
--   grant_id; a rename has none.
-- - public.admin_set_learner_name: admin-only (checked on every call), same name rule as
--   profiles_full_name_valid (enforced by that constraint), audited. Learners keep editing
--   their own name through their own profile row (own-row RLS, not audited).
-- - public.admin_list_learners also returns the latest grant's start, expiry and revocation time.

alter table public.course_access_audit alter column grant_id drop not null;
alter table public.course_access_audit drop constraint course_access_audit_action_check;
alter table public.course_access_audit add constraint course_access_audit_action_check
    check (action in ('approve', 'revoke', 'rename'));
alter table public.course_access_audit add column details jsonb;

create function public.admin_set_learner_name(p_user_id uuid, p_full_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_old text;
    v_new text := btrim(regexp_replace(coalesce(p_full_name, ''), '\s+', ' ', 'g'));
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    if not exists (select 1 from auth.users where id = p_user_id) then
        raise exception 'No such user' using errcode = '22023';
    end if;
    select full_name into v_old from public.profiles where user_id = p_user_id;
    -- profiles_full_name_valid rejects an invalid name (23514) before anything is audited.
    insert into public.profiles (user_id, full_name) values (p_user_id, v_new)
    on conflict (user_id) do update set full_name = excluded.full_name;
    insert into public.course_access_audit (grant_id, target_user_id, action, actor_user_id, details)
    values (null, p_user_id, 'rename', (select auth.uid()), jsonb_build_object('from', v_old, 'to', v_new));
    return v_new;
end;
$$;

-- Latest grant for a user (same ordering as the status functions): status plus its timing.
create function private.access_detail_for(p_user_id uuid)
returns table (status text, approved_at timestamptz, expires_at timestamptz, revoked_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
    with latest as (
        select g.approved_at, g.expires_at, g.revoked_at
        from public.course_access_grants g
        where g.user_id = p_user_id and g.course_id = 'behind-the-scenes-ai'
        order by (g.revoked_at is null and g.approved_at <= now() and now() < g.expires_at) desc,
                 g.approved_at desc
        limit 1
    )
    select
        case
            when l.approved_at is null then 'no-grant'
            when l.revoked_at is not null then 'revoked'
            when now() >= l.expires_at then 'expired'
            when now() < l.approved_at then 'no-grant'
            else 'active'
        end,
        l.approved_at, l.expires_at, l.revoked_at
    from (select 1) as one
    left join latest l on true;
$$;

drop function public.admin_list_learners(text, integer, integer);

create function public.admin_list_learners(p_query text default null, p_limit integer default 50, p_offset integer default 0)
returns table (
    user_id uuid,
    email text,
    full_name text,
    email_confirmed_at timestamptz,
    registered_at timestamptz,
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
           d.status, d.approved_at, d.expires_at, d.revoked_at, a.action, a.created_at
    from auth.users u
    left join public.profiles p on p.user_id = u.id
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

revoke execute on function private.access_detail_for(uuid) from public, anon, authenticated;
revoke execute on function public.admin_set_learner_name(uuid, text) from public, anon;
revoke execute on function public.admin_list_learners(text, integer, integer) from public, anon;
grant execute on function public.admin_set_learner_name(uuid, text) to authenticated;
grant execute on function public.admin_list_learners(text, integer, integer) to authenticated;
