-- Hardening of 20261001130000_legal_documents. No architecture change.
--
-- 1. A pending Beta request whose acceptance no longer covers the current Beta Terms (a newer
--    material version was published after it) cannot be approved: BT006. The learner re-accepts
--    through request_beta_access, which attaches the new acceptance to the same pending request.
--    A translation revision alone never invalidates an acceptance (coverage is by canonical
--    version); a non-material version keeps it (same rule as legal_acceptance_is_current).
-- 2. Every new grant states its basis: 'beta_request' (approved from a request that carries a
--    learner acceptance) or 'admin_override' (an administrative grant; no learner acceptance).
--    An override is never linked to an acceptance. Grants created before this migration keep
--    basis null ("legacy"); their rows are not modified.
-- 3. A version cannot be current without a current translation in its canonical locale
--    (deferred constraint triggers, checked at commit; valid for any canonical locale).
-- 4. The schema no longer forbids a Privacy Policy that requires acceptance. The Privacy Policy
--    stays informational through its data (requires_acceptance = false when published) and
--    because no acceptance path exists for it.
-- 5. effective_at is removed: nothing used it (is_current alone decides), and no product need
--    for future-dated legal versions exists yet. published_at records publication.
-- No em dash.

-- ── 4 and 5 ──
alter table public.legal_document_versions drop constraint privacy_policy_is_informational;
alter table public.legal_document_versions drop column effective_at;

-- ── 3. Canonical translation ──
create function private.check_canonical_translation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    v_version uuid;
begin
    -- separate branches: the two tables have different columns
    if tg_table_name = 'legal_document_versions' then
        v_version := new.id;
    else
        v_version := new.version_id;
    end if;
    if exists (
        select 1 from public.legal_document_versions v
        where v.id = v_version and v.is_current
          and not exists (
              select 1 from public.legal_document_translations t
              where t.version_id = v.id and t.locale = v.canonical_locale and t.is_current
          )
    ) then
        raise exception 'A current legal document version needs a current translation in its canonical locale'
            using errcode = '23514';
    end if;
    return null;
end;
$$;

create constraint trigger legal_version_has_canonical_translation
    after insert or update on public.legal_document_versions
    deferrable initially deferred
    for each row execute function private.check_canonical_translation();
create constraint trigger legal_translation_keeps_canonical
    after update on public.legal_document_translations
    deferrable initially deferred
    for each row execute function private.check_canonical_translation();

-- ── 1. Does one acceptance still cover the current version? ──
create function private.legal_acceptance_covers_current(p_acceptance_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
    select exists (
        select 1
        from public.legal_acceptances a
        join public.legal_document_versions av on av.id = a.version_id
        join public.legal_document_versions cur on cur.document_type = av.document_type and cur.is_current
        where a.id = p_acceptance_id
          and av.published_at <= cur.published_at
          and not exists (
              select 1 from public.legal_document_versions m
              where m.document_type = av.document_type and m.material
                and m.published_at > av.published_at and m.published_at <= cur.published_at
          )
    );
$$;

create or replace function private.legal_acceptance_is_current(p_user_id uuid, p_document_type text)
returns boolean
language sql
stable
set search_path = ''
as $$
    select exists (
        select 1 from public.legal_acceptances a
        join public.legal_document_versions v on v.id = a.version_id
        where a.user_id = p_user_id and v.document_type = p_document_type
          and private.legal_acceptance_covers_current(a.id)
    );
$$;

-- ── 2. Grant basis ──
alter table public.course_access_grants
    add column basis text check (basis in ('beta_request', 'admin_override'));

-- Required for every new grant; legacy rows (null) stay as they are and can still be revoked.
create function private.require_grant_basis()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.basis is null then
        raise exception 'A new grant must state its basis (beta_request or admin_override)' using errcode = '23502';
    end if;
    return new;
end;
$$;

create trigger require_grant_basis
    before insert on public.course_access_grants
    for each row execute function private.require_grant_basis();

-- Shared grant rules (duration, user, suspension). Callers check the admin.
create function private.grant_beta(p_user_id uuid, p_duration interval, p_basis text)
returns public.course_access_grants
language plpgsql
set search_path = ''
as $$
declare
    v_row public.course_access_grants;
begin
    if p_duration is null or p_duration <= interval '0' or p_duration > interval '1 month' then
        raise exception 'Duration must be more than zero and at most one month' using errcode = '22023';
    end if;
    if not exists (select 1 from auth.users where id = p_user_id) then
        raise exception 'No such user' using errcode = '22023';
    end if;
    if exists (select 1 from public.course_account_suspensions s where s.user_id = p_user_id and s.suspended) then
        raise exception 'The account is suspended; reactivate it before approving' using errcode = 'BT005';
    end if;
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note, basis)
    values (p_user_id, 'beta', now(), now() + p_duration,
            case p_basis when 'beta_request' then 'approved from a beta request' else 'approved from the admin page' end,
            p_basis)
    returning * into v_row;
    return v_row;
end;
$$;

-- Manual grant from the admin page: an administrative override, never a learner acceptance.
create or replace function public.admin_approve_beta(p_user_id uuid, p_duration interval default interval '1 month')
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    return (private.grant_beta(p_user_id, p_duration, 'admin_override')).expires_at;
end;
$$;

-- BT006: the request's acceptance no longer covers the current Beta Terms.
create or replace function public.admin_approve_beta_request(p_request_id uuid, p_duration interval default interval '1 month')
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_req public.beta_access_requests;
    v_grant public.course_access_grants;
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    -- The row lock serializes concurrent decisions (and a concurrent re-acceptance).
    select * into v_req from public.beta_access_requests where id = p_request_id for update;
    if not found or v_req.status <> 'pending' then
        raise exception 'This request is no longer pending' using errcode = 'BT004';
    end if;
    if v_req.user_id = (select auth.uid()) then
        raise exception 'Admins cannot approve their own request' using errcode = '42501';
    end if;
    if not private.legal_acceptance_covers_current(v_req.acceptance_id) then
        raise exception 'The learner must accept the current Beta Terms before approval' using errcode = 'BT006';
    end if;
    v_grant := private.grant_beta(v_req.user_id, p_duration, 'beta_request');
    update public.beta_access_requests
    set status = 'approved', decided_at = now(), decided_by = (select auth.uid()), grant_id = v_grant.id
    where id = p_request_id;
    return v_grant.expires_at;
end;
$$;

-- SQL editor path (postgres only): also an administrative override.
create or replace function private.approve_beta_tester(
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
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note, basis)
    values (v_user, 'beta', now(), now() + p_duration, p_note, 'admin_override')
    returning * into v_row;
    return v_row;
end;
$$;

-- ── 1. Learner request with re-acceptance ──
-- A pending request whose acceptance still covers the current version: 23505 (duplicate).
-- A pending request whose acceptance no longer covers it: a new acceptance is recorded and
-- attached to the same request (the earlier acceptance stays as evidence).
create or replace function public.request_beta_access(p_document_type text, p_locale text, p_body_sha256 text, p_consent boolean)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
    v_pending public.beta_access_requests;
    v_acceptance uuid;
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
    if p_document_type is distinct from 'beta_terms' then
        raise exception 'A beta request accepts the Beta Terms only' using errcode = '22023';
    end if;
    if p_locale is null or p_locale not in ('he', 'en', 'es', 'ru', 'ar', 'ja') then
        raise exception 'Invalid locale' using errcode = '22023';
    end if;
    if (select d.status from private.access_status_for(v_uid) d) = 'active' then
        raise exception 'This account already has active beta access' using errcode = 'BT003';
    end if;
    select * into v_pending from public.beta_access_requests r
    where r.user_id = v_uid and r.course_id = 'behind-the-scenes-ai' and r.status = 'pending'
    for update;
    if found and private.legal_acceptance_covers_current(v_pending.acceptance_id) then
        raise exception 'A pending request already exists' using errcode = '23505';
    end if;
    v_acceptance := private.record_legal_acceptance(v_uid, 'beta_terms', p_locale, p_body_sha256, 'beta_access_request');
    if v_pending.id is not null then
        update public.beta_access_requests set acceptance_id = v_acceptance where id = v_pending.id;
        return v_pending.id;
    end if;
    insert into public.beta_access_requests (user_id, acceptance_id)
    values (v_uid, v_acceptance)
    returning id into v_id;
    return v_id;
end;
$$;

-- For the learner's own panel: true when their pending request needs a new acceptance.
create function public.beta_request_needs_reacceptance()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1 from public.beta_access_requests r
        where r.user_id = (select auth.uid()) and r.status = 'pending'
          and not private.legal_acceptance_covers_current(r.acceptance_id)
    );
$$;

-- ── Admin list: grant basis instead of the derived acceptance flag ──
drop function public.admin_list_learners(text, integer, integer, boolean);

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
    -- latest grant: 'beta_request' | 'admin_override' | 'legacy' (before bases were recorded); null = no grant
    access_grant_basis text,
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
           d.status, d.approved_at, d.expires_at, d.revoked_at,
           case when g.id is not null then coalesce(g.basis, 'legacy') end,
           a.action, a.created_at,
           r.id, r.status, r.submitted_at, r.decided_at, r.version, r.locale
    from auth.users u
    left join public.profiles p on p.user_id = u.id
    left join public.course_account_suspensions s on s.user_id = u.id
    cross join lateral private.access_detail_for(u.id) d
    -- same grant ordering as private.access_detail_for
    left join lateral (
        select x.id, x.basis from public.course_access_grants x
        where x.user_id = u.id and x.course_id = 'behind-the-scenes-ai'
        order by (x.revoked_at is null and x.approved_at <= now() and now() < x.expires_at) desc, x.approved_at desc
        limit 1
    ) g on true
    left join lateral (
        select x.action, x.created_at from public.course_access_audit x
        where x.target_user_id = u.id order by x.created_at desc limit 1
    ) a on true
    left join lateral (
        select y.id, y.status, y.submitted_at, y.decided_at, v.version, la.locale
        from public.beta_access_requests y
        join public.legal_acceptances la on la.id = y.acceptance_id
        join public.legal_document_versions v on v.id = la.version_id
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

revoke execute on function private.check_canonical_translation() from public, anon, authenticated;
revoke execute on function private.legal_acceptance_covers_current(uuid) from public, anon, authenticated;
revoke execute on function private.require_grant_basis() from public, anon, authenticated;
revoke execute on function private.grant_beta(uuid, interval, text) from public, anon, authenticated;
revoke execute on function private.approve_beta_tester(text, interval, text) from public, anon, authenticated;
revoke execute on function public.admin_approve_beta(uuid, interval) from public, anon;
revoke execute on function public.admin_approve_beta_request(uuid, interval) from public, anon;
revoke execute on function public.request_beta_access(text, text, text, boolean) from public, anon;
revoke execute on function public.beta_request_needs_reacceptance() from public, anon;
revoke execute on function public.admin_list_learners(text, integer, integer, boolean) from public, anon;
grant execute on function public.admin_approve_beta(uuid, interval) to authenticated;
grant execute on function public.admin_approve_beta_request(uuid, interval) to authenticated;
grant execute on function public.request_beta_access(text, text, text, boolean) to authenticated;
grant execute on function public.beta_request_needs_reacceptance() to authenticated;
grant execute on function public.admin_list_learners(text, integer, integer, boolean) to authenticated;
