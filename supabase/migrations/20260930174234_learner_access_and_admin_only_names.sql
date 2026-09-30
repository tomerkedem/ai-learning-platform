-- Learner-level access and admin-only names.
--
-- 1. course_access_status now also reports 'unconfirmed' for a signed-in account whose email is
--    not confirmed. The full introduction and Chapter 1 open for any signed-in, confirmed,
--    non-suspended learner ('no-grant', 'expired', 'revoked' or 'active'); Chapters 2-19 and the
--    final exam still require 'active'. The function becomes SECURITY DEFINER so it can read the
--    caller's own confirmation time in auth.users. It still reads only the caller's rows
--    (auth.uid()), and execution stays limited to authenticated.
--
-- 2. Learners can no longer set or change profiles.full_name. Column privileges allow them to
--    write only user_id and preferred_locale (language); progress lives in quiz_results and is
--    unchanged. Names come from registration (create_profile_for_new_user) or an admin
--    (admin_set_learner_name, SECURITY DEFINER, audited).
--
-- 3. The full_name in auth user metadata is pinned after registration, so a self-service
--    auth.updateUser({ data: { full_name } }) cannot change it either. The app never reads the
--    name from metadata; profiles.full_name is the only source.

create or replace function public.course_access_status(p_course_id text default 'behind-the-scenes-ai')
returns table (status text, expires_at timestamptz)
language sql
stable
security definer
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
            when not exists (
                select 1 from auth.users u
                where u.id = (select auth.uid()) and u.email_confirmed_at is not null
            ) then 'unconfirmed'
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

-- ── Names: admin only ──
revoke insert, update on table public.profiles from authenticated;
grant insert (user_id, preferred_locale) on table public.profiles to authenticated;
grant update (user_id, preferred_locale) on table public.profiles to authenticated;

create function private.pin_registered_full_name()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.raw_user_meta_data -> 'full_name' is distinct from old.raw_user_meta_data -> 'full_name' then
        if old.raw_user_meta_data ? 'full_name' then
            new.raw_user_meta_data := coalesce(new.raw_user_meta_data, '{}'::jsonb)
                || jsonb_build_object('full_name', old.raw_user_meta_data -> 'full_name');
        else
            new.raw_user_meta_data := new.raw_user_meta_data - 'full_name';
        end if;
    end if;
    return new;
end;
$$;

revoke execute on function private.pin_registered_full_name() from public, anon, authenticated;

create trigger pin_registered_full_name
    before update of raw_user_meta_data on auth.users
    for each row execute function private.pin_registered_full_name();
