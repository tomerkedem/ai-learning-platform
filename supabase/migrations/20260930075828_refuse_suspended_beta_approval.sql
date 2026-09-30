-- Refuse approving a beta request while the learner's account is suspended.
--
-- BT005: the account is suspended. The exception aborts the whole call, so the request stays
-- pending and no grant is created. The admin reactivates the account first, then approves.
-- Manual grants (admin_approve_beta) are unchanged.

create or replace function public.admin_approve_beta_request(p_request_id uuid, p_duration interval default interval '1 month')
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
    if exists (select 1 from public.course_account_suspensions s where s.user_id = v_req.user_id and s.suspended) then
        raise exception 'The account is suspended; reactivate it before approving' using errcode = 'BT005';
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

-- create or replace keeps existing grants; restated for clarity.
revoke execute on function public.admin_approve_beta_request(uuid, interval) from public, anon;
grant execute on function public.admin_approve_beta_request(uuid, interval) to authenticated;
