-- Course access grants for "Behind the Scenes of AI".
--
-- Chapters 2-19, their quizzes and the final exam require an active, explicitly approved grant.
-- Registration and email confirmation grant NOTHING: new users have no row here.
-- Today the only grant kind is 'beta' (approved tester, at most one month). A future paid
-- entitlement becomes a new kind with its own rules; nothing else in the model changes.
--
-- Learners can read their own grants (RLS) and nothing else: no insert, update or delete
-- privilege or policy exists for API roles, so they cannot create, extend or approve grants.
-- Approval and revocation are admin-only, through functions in the unexposed "private" schema,
-- run from the Supabase SQL editor (see docs/behind-ai-access-admin.md).

create table public.course_access_grants (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id text not null default 'behind-the-scenes-ai' check (course_id = 'behind-the-scenes-ai'),
    kind text not null check (kind in ('beta')),
    approved_at timestamptz not null default now(),
    expires_at timestamptz not null,
    revoked_at timestamptz,
    note text check (char_length(note) <= 500),
    created_at timestamptz not null default now(),
    constraint beta_grant_at_most_one_month
        check (kind <> 'beta' or (expires_at > approved_at and expires_at <= approved_at + interval '1 month'))
);

create index course_access_grants_user_course on public.course_access_grants (user_id, course_id);

alter table public.course_access_grants enable row level security;

create policy "course_access_grants_select_own" on public.course_access_grants
    for select to authenticated using ((select auth.uid()) = user_id);

revoke all on table public.course_access_grants from anon, authenticated;
grant select on table public.course_access_grants to authenticated;

-- The server calls this on every protected request with the learner's own JWT, so revocation
-- and expiry apply on the next request. SECURITY INVOKER: RLS limits it to the caller's rows.
-- status: 'active' | 'no-grant' | 'expired' | 'revoked'. expires_at is null for 'revoked'.
create function public.course_access_status(p_course_id text default 'behind-the-scenes-ai')
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

revoke execute on function public.course_access_status(text) from public, anon;
grant execute on function public.course_access_status(text) to authenticated;

-- ── Admin-only (SQL editor as postgres). Not exposed through the Data API. ──
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Approves a tester by email: a new beta grant from now until now + p_duration (max 1 month).
-- A new row is added (history is kept); the newest active grant wins.
create function private.approve_beta_tester(
    p_email text,
    p_duration interval default interval '1 month',
    p_note text default null
) returns public.course_access_grants
language plpgsql
set search_path = ''
as $$
declare
    v_user uuid;
    v_row public.course_access_grants;
begin
    select id into v_user from auth.users where lower(email) = lower(p_email);
    if v_user is null then
        raise exception 'No user with email %', p_email;
    end if;
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note)
    values (v_user, 'beta', now(), now() + p_duration, p_note)
    returning * into v_row;
    return v_row;
end;
$$;

-- Revokes every currently unrevoked grant of the tester. Returns how many rows changed.
create function private.revoke_beta_tester(p_email text)
returns integer
language plpgsql
set search_path = ''
as $$
declare
    v_count integer;
begin
    update public.course_access_grants g
    set revoked_at = now()
    from auth.users u
    where u.id = g.user_id and lower(u.email) = lower(p_email) and g.revoked_at is null;
    get diagnostics v_count = row_count;
    return v_count;
end;
$$;

revoke execute on function private.approve_beta_tester(text, interval, text) from public, anon, authenticated;
revoke execute on function private.revoke_beta_tester(text) from public, anon, authenticated;
