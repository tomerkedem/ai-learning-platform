-- Generic legal documents: canonical versions, per-locale translation revisions and acceptances.
-- Replaces the Beta-specific public.beta_terms_versions (empty on DEV: no version was ever
-- registered) and moves Beta request consent onto a recorded legal acceptance.
--
-- Model
-- - legal_document_versions: one row per canonical version of a document type (beta_terms,
--   terms_of_service, privacy_policy). Version format YYYY-MM-DD.N. At most one current version
--   per type. English is the canonical authoring locale; this schema says nothing about which
--   language prevails legally (pending legal review).
-- - legal_document_translations: the exact legal body shown in one locale for one version, as the
--   JSON text the app renders from, with its SHA-256 (checked here). A translation correction is
--   a new revision of the same version and locale; it never creates a new canonical version.
--   At most one current revision per version and locale. Draft placeholder blocks are refused.
-- - legal_acceptances: who accepted which canonical version and which exact translation
--   revision, in which locale, when, and in which context. No IP address or User-Agent.
--
-- Versions and translations are immutable after insert except is_current, and never deleted.
-- Acceptances are immutable; they are removed only by the cascade from deleting the account
-- (temporary DEV choice, see below). The database, not app code, decides the current version.
--
-- Material changes: a version with material = true requires a new acceptance from anyone who
-- accepted an earlier version (private.legal_acceptance_is_current). Publishing a version never
-- revokes or suspends an existing grant.
--
-- Account deletion (TEMPORARY, pending a legal retention decision): acceptances cascade with
-- auth.users, like every other account table. Changing this later is a FK change only.
--
-- Activation: only beta_terms acceptance exists, and only inside request_beta_access.
-- terms_of_service has no acceptance path yet. privacy_policy can never require acceptance.
--
-- Manual grants (admin_approve_beta, private.approve_beta_tester) record NO acceptance. That
-- absence is explicit: a grant has a recorded Beta Terms acceptance only when a beta request
-- with an acceptance points to it (beta_access_requests.grant_id). admin_list_learners reports
-- it as access_terms_accepted. The four existing DEV grants stay as grandfathered test grants.

-- ── Remove the Beta-specific version table (no rows on DEV) ──
drop function public.request_beta_access(text, text, text, boolean);
drop function public.admin_list_learners(text, integer, integer, boolean);
alter table public.beta_access_requests drop column terms_version, drop column locale;
drop table public.beta_terms_versions;
drop function private.guard_beta_terms_version();

-- ── Versions ──
create table public.legal_document_versions (
    id uuid primary key default gen_random_uuid(),
    document_type text not null check (document_type in ('beta_terms', 'terms_of_service', 'privacy_policy')),
    version text not null check (version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}\.[1-9][0-9]*$'),
    canonical_locale text not null default 'en' check (canonical_locale in ('he', 'en', 'es', 'ru', 'ar', 'ja')),
    effective_at timestamptz not null default now(),
    published_at timestamptz not null default now(),
    requires_acceptance boolean not null,
    material boolean not null,
    is_current boolean not null default false,
    unique (document_type, version),
    -- The Privacy Policy is informational: it never asks for agreement.
    constraint privacy_policy_is_informational check (document_type <> 'privacy_policy' or not requires_acceptance)
);
create unique index legal_document_versions_one_current on public.legal_document_versions (document_type) where is_current;

-- ── Translations ──
create table public.legal_document_translations (
    id uuid primary key default gen_random_uuid(),
    version_id uuid not null references public.legal_document_versions (id),
    locale text not null check (locale in ('he', 'en', 'es', 'ru', 'ar', 'ja')),
    revision integer not null check (revision >= 1),
    -- The exact JSON text of the legal body the app renders (title, lead, blocks).
    content text not null check (jsonb_typeof(content::jsonb) = 'object'),
    content_sha256 text not null,
    published_at timestamptz not null default now(),
    is_current boolean not null default false,
    unique (version_id, locale, revision),
    unique (id, version_id, locale),
    constraint legal_translation_sha256 check (content_sha256 = encode(sha256(convert_to(content, 'UTF8')), 'hex')),
    constraint legal_translation_no_placeholder check (not jsonb_path_exists(content::jsonb, '$.** ? (@.kind == "placeholder")'))
);
create unique index legal_document_translations_one_current on public.legal_document_translations (version_id, locale) where is_current;

-- Immutable except is_current; never deleted.
create function private.guard_legal_document()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if tg_op = 'DELETE' then
        raise exception 'Published legal documents are permanent' using errcode = '42501';
    end if;
    if (to_jsonb(new) - 'is_current') is distinct from (to_jsonb(old) - 'is_current') then
        raise exception 'A published legal document cannot be changed; publish a new version or revision' using errcode = '42501';
    end if;
    return new;
end;
$$;

create trigger guard_legal_document_version
    before update or delete on public.legal_document_versions
    for each row execute function private.guard_legal_document();
create trigger guard_legal_document_translation
    before update or delete on public.legal_document_translations
    for each row execute function private.guard_legal_document();

-- ── Acceptances ──
create table public.legal_acceptances (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    version_id uuid not null references public.legal_document_versions (id),
    translation_id uuid not null,
    locale text not null,
    accepted_at timestamptz not null default now(),
    context text not null check (context in ('beta_access_request')),
    -- The translation shown must belong to the accepted version, in the recorded locale.
    foreign key (translation_id, version_id, locale) references public.legal_document_translations (id, version_id, locale)
);
create index legal_acceptances_user on public.legal_acceptances (user_id, accepted_at desc);

-- Immutable. A delete is allowed only as the cascade from deleting the account (nested trigger).
create function private.guard_legal_acceptance()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if tg_op = 'UPDATE' or pg_trigger_depth() < 2 then
        raise exception 'Legal acceptance records cannot be changed or deleted' using errcode = '42501';
    end if;
    return old;
end;
$$;

create trigger guard_legal_acceptance
    before update or delete on public.legal_acceptances
    for each row execute function private.guard_legal_acceptance();

-- ── Access: published documents readable by signed-in learners; own acceptances only ──
alter table public.legal_document_versions enable row level security;
alter table public.legal_document_translations enable row level security;
alter table public.legal_acceptances enable row level security;
create policy "legal_document_versions_read" on public.legal_document_versions for select to authenticated using (true);
create policy "legal_document_translations_read" on public.legal_document_translations for select to authenticated using (true);
create policy "legal_acceptances_select_own" on public.legal_acceptances
    for select to authenticated using ((select auth.uid()) = user_id);
revoke all on table public.legal_document_versions, public.legal_document_translations, public.legal_acceptances from anon, authenticated;
grant select on table public.legal_document_versions, public.legal_document_translations, public.legal_acceptances to authenticated;

-- ── Recording an acceptance (internal; called only by security-definer functions) ──
-- Resolves the current version and its current translation for the locale and records the
-- acceptance only if the supplied hash is exactly that translation's body hash.
-- BT002 = no current version requiring acceptance, no current translation for the locale,
-- or the text shown differs from the published revision (stale or edited).
create function private.record_legal_acceptance(
    p_user_id uuid, p_document_type text, p_locale text, p_body_sha256 text, p_context text
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
    v_version uuid;
    v_translation uuid;
    v_sha text;
    v_id uuid;
begin
    -- FOR SHARE: a concurrent publication waits until this acceptance commits.
    select v.id, t.id, t.content_sha256 into v_version, v_translation, v_sha
    from public.legal_document_versions v
    join public.legal_document_translations t on t.version_id = v.id and t.locale = p_locale and t.is_current
    where v.document_type = p_document_type and v.is_current and v.requires_acceptance
    for share of v, t;
    if v_version is null or v_sha is distinct from p_body_sha256 then
        raise exception 'The legal text shown is not the current published version' using errcode = 'BT002';
    end if;
    insert into public.legal_acceptances (user_id, version_id, translation_id, locale, context)
    values (p_user_id, v_version, v_translation, p_locale, p_context)
    returning id into v_id;
    return v_id;
end;
$$;

-- True when the user's acceptance still covers the current version: they accepted the current
-- version, or an earlier one with no material version published after it.
create function private.legal_acceptance_is_current(p_user_id uuid, p_document_type text)
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
        where a.user_id = p_user_id and av.document_type = p_document_type
          and av.published_at <= cur.published_at
          and not exists (
              select 1 from public.legal_document_versions m
              where m.document_type = p_document_type and m.material
                and m.published_at > av.published_at and m.published_at <= cur.published_at
          )
    );
$$;

-- ── Beta requests reference the acceptance ──
alter table public.beta_access_requests
    add column acceptance_id uuid not null unique references public.legal_acceptances (id) on delete cascade;

-- Errors: 42501 not signed in / email not confirmed / suspended; BT001 no consent;
-- BT002 Beta Terms shown are not the current published text; BT003 already has active access;
-- 23505 a pending request already exists; 22023 invalid document type or locale.
-- The acceptance and the request are one transaction: any failure records neither.
create function public.request_beta_access(p_document_type text, p_locale text, p_body_sha256 text, p_consent boolean)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
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
    v_acceptance := private.record_legal_acceptance(v_uid, 'beta_terms', p_locale, p_body_sha256, 'beta_access_request');
    insert into public.beta_access_requests (user_id, acceptance_id)
    values (v_uid, v_acceptance)
    returning id into v_id;
    return v_id;
end;
$$;

-- ── Admin list: terms version and locale come from the acceptance; explicit acceptance flag ──
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
    -- null = no grant; false = the latest grant has no recorded Beta Terms acceptance
    -- (manual or grandfathered grant); true = granted from a request with an acceptance.
    access_terms_accepted boolean,
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
           case when g.id is not null then exists (select 1 from public.beta_access_requests q where q.grant_id = g.id) end,
           a.action, a.created_at,
           r.id, r.status, r.submitted_at, r.decided_at, r.version, r.locale
    from auth.users u
    left join public.profiles p on p.user_id = u.id
    left join public.course_account_suspensions s on s.user_id = u.id
    cross join lateral private.access_detail_for(u.id) d
    -- same grant ordering as private.access_detail_for
    left join lateral (
        select x.id from public.course_access_grants x
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

revoke execute on function private.guard_legal_document() from public, anon, authenticated;
revoke execute on function private.guard_legal_acceptance() from public, anon, authenticated;
revoke execute on function private.record_legal_acceptance(uuid, text, text, text, text) from public, anon, authenticated;
revoke execute on function private.legal_acceptance_is_current(uuid, text) from public, anon, authenticated;
revoke execute on function public.request_beta_access(text, text, text, boolean) from public, anon;
revoke execute on function public.admin_list_learners(text, integer, integer, boolean) from public, anon;
grant execute on function public.request_beta_access(text, text, text, boolean) to authenticated;
grant execute on function public.admin_list_learners(text, integer, integer, boolean) to authenticated;
