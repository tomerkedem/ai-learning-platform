-- Learner names, course administrators, beta-access administration and an audit trail.
--
-- Names: profiles.full_name (2 to 100 characters, trimmed, no control characters). New
-- registrations must carry a full name in their sign-up metadata; a trigger on auth.users
-- copies it into profiles and rejects the registration otherwise. Existing users complete
-- or edit their name through the profile row they already own (own-row RLS).
--
-- Admins: public.course_admins, keyed by user_id. No API role can read or write it, so admin
-- rights never come from email, client state or an editable profile field. The first admin is
-- designated once, from the SQL editor, with private.designate_first_course_admin (see
-- docs/behind-ai-access-admin.md). Nobody is an admin by default.
--
-- Admin operations: SECURITY DEFINER functions in public (callable over the API) that check
-- course_admins for the caller on every call and refuse everyone else with 42501.
--
-- Audit: every grant approval and revocation (admin page or SQL editor) is recorded by a
-- trigger with the acting user (null for the SQL editor) and the time.

-- ── Names ──
alter table public.profiles
    add column full_name text
    constraint profiles_full_name_valid check (
        full_name is null
        or (char_length(full_name) between 2 and 100 and full_name = btrim(full_name) and full_name !~ '[[:cntrl:]]')
    );

create function private.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_name text := btrim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
begin
    if char_length(v_name) < 2 or char_length(v_name) > 100 or v_name ~ '[[:cntrl:]]' then
        raise exception 'A full name between 2 and 100 characters is required to register'
            using errcode = '23514';
    end if;
    insert into public.profiles (user_id, full_name)
    values (new.id, v_name)
    on conflict (user_id) do update set full_name = coalesce(public.profiles.full_name, excluded.full_name);
    return new;
end;
$$;

create trigger create_profile_for_new_user
    after insert on auth.users
    for each row execute function private.create_profile_for_new_user();

-- ── Admins ──
create table public.course_admins (
    user_id uuid primary key references auth.users (id) on delete cascade,
    designated_at timestamptz not null default now(),
    note text check (char_length(note) <= 500)
);
alter table public.course_admins enable row level security;
revoke all on table public.course_admins from anon, authenticated;

create function private.is_course_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select p_user_id is not null and exists (select 1 from public.course_admins a where a.user_id = p_user_id);
$$;

-- For the app: is the caller an admin? (Checked again inside every admin operation.)
create function public.is_course_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select private.is_course_admin((select auth.uid()));
$$;

-- One-time designation of the first admin, from the SQL editor only. Refuses if any admin exists.
create function private.designate_first_course_admin(p_email text, p_note text default null)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
    v_user uuid;
begin
    if exists (select 1 from public.course_admins) then
        raise exception 'A course admin already exists; add further admins deliberately with an explicit insert';
    end if;
    select id into v_user from auth.users where lower(email) = lower(p_email) and email_confirmed_at is not null;
    if v_user is null then
        raise exception 'No confirmed user with email %', p_email;
    end if;
    insert into public.course_admins (user_id, note) values (v_user, p_note);
    return v_user;
end;
$$;

-- ── Audit ──
create table public.course_access_audit (
    id bigint generated always as identity primary key,
    grant_id uuid not null,
    target_user_id uuid not null,
    action text not null check (action in ('approve', 'revoke')),
    -- the admin who acted through the app; null when run from the SQL editor
    actor_user_id uuid,
    created_at timestamptz not null default now()
);
alter table public.course_access_audit enable row level security;
revoke all on table public.course_access_audit from anon, authenticated;

create function private.audit_course_access()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if tg_op = 'INSERT' then
        insert into public.course_access_audit (grant_id, target_user_id, action, actor_user_id)
        values (new.id, new.user_id, 'approve', (select auth.uid()));
    elsif old.revoked_at is null and new.revoked_at is not null then
        insert into public.course_access_audit (grant_id, target_user_id, action, actor_user_id)
        values (new.id, new.user_id, 'revoke', (select auth.uid()));
    end if;
    return new;
end;
$$;

create trigger audit_course_access
    after insert or update of revoked_at on public.course_access_grants
    for each row execute function private.audit_course_access();

-- ── Admin operations (API) ──
-- Same rules as public.course_access_status, for any user (admin view only).
create function private.access_status_for(p_user_id uuid)
returns table (status text, expires_at timestamptz)
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
        case when l.revoked_at is null then l.expires_at end
    from (select 1) as one
    left join latest l on true;
$$;

create function public.admin_list_learners(p_query text default null, p_limit integer default 50, p_offset integer default 0)
returns table (
    user_id uuid,
    email text,
    full_name text,
    email_confirmed_at timestamptz,
    registered_at timestamptz,
    access_status text,
    access_expires_at timestamptz,
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
           s.status, s.expires_at, a.action, a.created_at
    from auth.users u
    left join public.profiles p on p.user_id = u.id
    cross join lateral private.access_status_for(u.id) s
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

create function public.admin_approve_beta(p_user_id uuid, p_duration interval default interval '1 month')
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_expires timestamptz;
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    if p_duration is null or p_duration <= interval '0' or p_duration > interval '1 month' then
        raise exception 'Duration must be more than zero and at most one month' using errcode = '22023';
    end if;
    if not exists (select 1 from auth.users where id = p_user_id) then
        raise exception 'No such user' using errcode = '22023';
    end if;
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note)
    values (p_user_id, 'beta', now(), now() + p_duration, 'approved from the admin page')
    returning expires_at into v_expires;
    return v_expires;
end;
$$;

create function public.admin_revoke_beta(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_count integer;
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    update public.course_access_grants
    set revoked_at = now()
    where user_id = p_user_id and revoked_at is null;
    get diagnostics v_count = row_count;
    return v_count;
end;
$$;

-- Execute rights: private functions are never callable over the API; the public admin
-- functions are callable by signed-in users and refuse everyone who is not an admin.
revoke execute on function private.create_profile_for_new_user() from public, anon, authenticated;
revoke execute on function private.is_course_admin(uuid) from public, anon, authenticated;
revoke execute on function private.designate_first_course_admin(text, text) from public, anon, authenticated;
revoke execute on function private.audit_course_access() from public, anon, authenticated;
revoke execute on function private.access_status_for(uuid) from public, anon, authenticated;
revoke execute on function public.is_course_admin() from public, anon;
revoke execute on function public.admin_list_learners(text, integer, integer) from public, anon;
revoke execute on function public.admin_approve_beta(uuid, interval) from public, anon;
revoke execute on function public.admin_revoke_beta(uuid) from public, anon;
grant execute on function public.is_course_admin() to authenticated;
grant execute on function public.admin_list_learners(text, integer, integer) to authenticated;
grant execute on function public.admin_approve_beta(uuid, interval) to authenticated;
grant execute on function public.admin_revoke_beta(uuid) to authenticated;
