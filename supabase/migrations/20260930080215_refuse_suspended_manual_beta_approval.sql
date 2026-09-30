-- Refuse manual beta approval (and renewal) while the learner's account is suspended.
--
-- Same guard and error as admin_approve_beta_request (BT005): raised before the insert, so no
-- grant is created or renewed. The admin reactivates the account first, then approves.
-- Because admin_approve_beta_request calls this function, both paths are covered here.
-- private.approve_beta_tester (SQL editor, postgres only) is unchanged.

create or replace function public.admin_approve_beta(p_user_id uuid, p_duration interval default interval '1 month')
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
    if exists (select 1 from public.course_account_suspensions s where s.user_id = p_user_id and s.suspended) then
        raise exception 'The account is suspended; reactivate it before approving' using errcode = 'BT005';
    end if;
    insert into public.course_access_grants (user_id, kind, approved_at, expires_at, note)
    values (p_user_id, 'beta', now(), now() + p_duration, 'approved from the admin page')
    returning expires_at into v_expires;
    return v_expires;
end;
$$;

-- create or replace keeps existing grants; restated for clarity.
revoke execute on function public.admin_approve_beta(uuid, interval) from public, anon;
grant execute on function public.admin_approve_beta(uuid, interval) to authenticated;
