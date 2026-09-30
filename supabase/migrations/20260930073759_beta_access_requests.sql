-- Beta-access requests with versioned consent to the Beta Terms.
--
-- A confirmed, signed-in, non-suspended learner without active access can request beta access
-- once they accept the current Beta Terms version. A request grants NOTHING: access still
-- comes only from an admin approval, which goes through the existing public.admin_approve_beta
-- grant function inside the same transaction that marks the request approved.
--
-- Terms versions (public.beta_terms_versions) are immutable snapshots of the Beta Terms page
-- in all six locales, with the SHA-256 the app computes from the text it shows. A version whose
-- snapshot still contains a draft placeholder block is refused, so draft terms can never
-- become a consent version. This migration registers NO version: while there is no current
-- version, request_beta_access refuses every submission. Register one with
-- scripts/beta-terms-version.mjs once the Beta Terms have no placeholders.
--
-- Learners read only their own requests (RLS) and have no insert, update or delete rights;
-- every write goes through the functions below, which check identity in the database.

-- ── Terms versions ──
create table public.beta_terms_versions (
    version text primary key check (version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}(\.[0-9]+)?$'),
    content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
    content jsonb not null,
    published_at timestamptz not null default now(),
    is_current boolean not null default false
);
create unique index beta_terms_versions_one_current on public.beta_terms_versions (is_current) where is_current;
alter table public.beta_terms_versions enable row level security;
revoke all on table public.beta_terms_versions from anon, authenticated;

-- Immutable and never a draft: only is_current may change after insert; rows are never deleted.
create function private.guard_beta_terms_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if tg_op = 'DELETE' then
        raise exception 'Beta Terms versions are permanent' using errcode = '42501';
    end if;
    if tg_op = 'UPDATE' and (new.version, new.content_sha256, new.content, new.published_at)
        is distinct from (old.version, old.content_sha256, old.content, old.published_at) then
        raise exception 'A Beta Terms version cannot be changed; register a new version' using errcode = '42501';
    end if;
    if tg_op = 'INSERT' and jsonb_path_exists(new.content, '$.*.blocks[*] ? (@.kind == "placeholder")') then
        raise exception 'Beta Terms with unresolved placeholders cannot become a consent version' using errcode = '22023';
    end if;
    return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger guard_beta_terms_version
    before insert or update or delete on public.beta_terms_versions
    for each row execute function private.guard_beta_terms_version();

-- ── Requests ──
create table public.beta_access_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id text not null default 'behind-the-scenes-ai' check (course_id = 'behind-the-scenes-ai'),
    status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
    submitted_at timestamptz not null default now(),
    terms_version text not null references public.beta_terms_versions (version),
    locale text not null check (locale in ('he', 'en', 'es', 'ru', 'ar', 'ja')),
    decided_at timestamptz,
    -- the admin who decided (kept even if that admin is later removed, like course_access_audit)
    decided_by uuid,
    grant_id uuid references public.course_access_grants (id),
    constraint beta_access_request_decision check (
        (status = 'pending' and decided_at is null and decided_by is null and grant_id is null)
        or (status = 'declined' and decided_at is not null and decided_by is not null and grant_id is null)
        or (status = 'approved' and decided_at is not null and decided_by is not null and grant_id is not null)
    )
);
-- At most one pending request per learner, also under concurrent submissions.
create unique index beta_access_requests_one_pending on public.beta_access_requests (user_id, course_id) where status = 'pending';
create index beta_access_requests_user on public.beta_access_requests (user_id, submitted_at desc);

alter table public.beta_access_requests enable row level security;
create policy "beta_access_requests_select_own" on public.beta_access_requests
    for select to authenticated using ((select auth.uid()) = user_id);
revoke all on table public.beta_access_requests from anon, authenticated;
grant select on table public.beta_access_requests to authenticated;

-- ── Learner: submit ──
-- Errors: 42501 not signed in / email not confirmed / suspended; BT001 no consent;
-- BT002 terms version not current (or none registered); BT003 already has active access;
-- 23505 a pending request already exists; 22023 invalid locale.
create function public.request_beta_access(p_terms_version text, p_terms_sha256 text, p_locale text, p_consent boolean)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
    v_id uuid;
begin
    if v_uid is null or not exists (select 1 from auth.users u where u.id = v_uid and u.email_confirmed_at is not null) then
        raise exception 'A signed-in account with a confirmed email is required' using errcode = '42501';
    end if;
    if exists (select 1 from public.course_account_suspensions s where s.user_id = v_uid and s.suspended) then
        raise exception 'This account is suspended' using errcode = '42501';
    end if;
    if p_consent is not true then
        raise exception 'Consent to the Beta Terms is required' using errcode = 'BT001';
    end if;
    if not exists (
        select 1 from public.beta_terms_versions v
        where v.is_current and v.version = p_terms_version and v.content_sha256 = p_terms_sha256
    ) then
        raise exception 'These Beta Terms are not the current consent version' using errcode = 'BT002';
    end if;
    if p_locale is null or p_locale not in ('he', 'en', 'es', 'ru', 'ar', 'ja') then
        raise exception 'Invalid locale' using errcode = '22023';
    end if;
    if (select d.status from private.access_status_for(v_uid) d) = 'active' then
        raise exception 'This account already has active beta access' using errcode = 'BT003';
    end if;
    insert into public.beta_access_requests (user_id, terms_version, locale)
    values (v_uid, p_terms_version, p_locale)
    returning id into v_id;
    return v_id;
end;
$$;

-- ── Admin: approve (atomic with the grant) and decline ──
-- BT004 = the request is no longer pending (already decided, possibly by another admin).
create function public.admin_approve_beta_request(p_request_id uuid, p_duration interval default interval '1 month')
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_req public.beta_access_requests;
    v_expires timestamptz;
    v_grant uuid;
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    -- The row lock serializes concurrent decisions on the same request.
    select * into v_req from public.beta_access_requests where id = p_request_id for update;
    if not found or v_req.status <> 'pending' then
        raise exception 'This request is no longer pending' using errcode = 'BT004';
    end if;
    if v_req.user_id = (select auth.uid()) then
        raise exception 'Admins cannot approve their own request' using errcode = '42501';
    end if;
    -- Existing grant mechanism: re-checks admin, validates the duration, inserts the grant
    -- (audited by the audit_course_access trigger with the acting admin).
    v_expires := public.admin_approve_beta(v_req.user_id, p_duration);
    select g.id into v_grant from public.course_access_grants g
    where g.user_id = v_req.user_id and g.approved_at = now() and g.expires_at = v_expires
    order by g.created_at desc limit 1;
    update public.beta_access_requests
    set status = 'approved', decided_at = now(), decided_by = (select auth.uid()), grant_id = v_grant
    where id = p_request_id;
    return v_expires;
end;
$$;

create function public.admin_decline_beta_request(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    update public.beta_access_requests
    set status = 'declined', decided_at = now(), decided_by = (select auth.uid())
    where id = p_request_id and status = 'pending';
    if not found then
        raise exception 'This request is no longer pending' using errcode = 'BT004';
    end if;
end;
$$;

-- ── Admin list: latest request per learner, and a pending-only filter ──
drop function public.admin_list_learners(text, integer, integer);

create function public.admin_list_learners(
    p_query text default null, p_limit integer default 50, p_offset integer default 0, p_pending_only boolean default false
)
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
    last_action_at timestamptz,
    request_id uuid,
    request_status text,
    request_submitted_at timestamptz,
    request_decided_at timestamptz,
    request_terms_version text,
    request_locale text
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
           d.status, d.approved_at, d.expires_at, d.revoked_at, a.action, a.created_at,
           r.id, r.status, r.submitted_at, r.decided_at, r.terms_version, r.locale
    from auth.users u
    left join public.profiles p on p.user_id = u.id
    left join public.course_account_suspensions s on s.user_id = u.id
    cross join lateral private.access_detail_for(u.id) d
    left join lateral (
        select x.action, x.created_at from public.course_access_audit x
        where x.target_user_id = u.id order by x.created_at desc limit 1
    ) a on true
    left join lateral (
        select y.id, y.status, y.submitted_at, y.decided_at, y.terms_version, y.locale
        from public.beta_access_requests y
        where y.user_id = u.id order by y.submitted_at desc limit 1
    ) r on true
    where (v_q = ''
           or position(v_q in lower(u.email)) > 0
           or position(v_q in lower(coalesce(p.full_name, ''))) > 0)
      and (not coalesce(p_pending_only, false) or r.status = 'pending')
    -- pending filter: oldest request first; otherwise newest registration first
    order by case when coalesce(p_pending_only, false) then r.submitted_at end asc,
             u.created_at desc
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
    offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

revoke execute on function private.guard_beta_terms_version() from public, anon, authenticated;
revoke execute on function public.request_beta_access(text, text, text, boolean) from public, anon;
revoke execute on function public.admin_approve_beta_request(uuid, interval) from public, anon;
revoke execute on function public.admin_decline_beta_request(uuid) from public, anon;
revoke execute on function public.admin_list_learners(text, integer, integer, boolean) from public, anon;
grant execute on function public.request_beta_access(text, text, text, boolean) to authenticated;
grant execute on function public.admin_approve_beta_request(uuid, interval) to authenticated;
grant execute on function public.admin_decline_beta_request(uuid) to authenticated;
grant execute on function public.admin_list_learners(text, integer, integer, boolean) to authenticated;
