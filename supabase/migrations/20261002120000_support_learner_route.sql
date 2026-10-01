-- Learner support functions also return the request's saved route.
-- Requires 20261002110000_support_tickets.
--
-- The learner's own request pages show where a request was sent from ("Sent from Chapter 3"),
-- resolved in the app from the persisted route. Learners still have no privilege on
-- support_tickets or support_messages; they read their requests only through these
-- security-definer functions, which keep every check unchanged (signed in, confirmed email,
-- not suspended, own rows only).
--
-- route is learner-safe: it is the validated course pathname the learner's own browser sent
-- (no query string, hash or host; support_tickets_route_valid), or null. No other field is
-- added: the internal status, awaiting_team_since, status_changed_* and admin ids stay hidden.
--
-- A function's result columns cannot be changed in place, so both are dropped and recreated with
-- the same bodies plus route as the last column, and the same execute rights.
-- No table, column, constraint or data changes. No em dash.

drop function public.list_my_support_tickets(integer, integer);
drop function public.get_my_support_ticket(uuid);

-- The caller's tickets, latest activity first, with the learner-facing status only.
create function public.list_my_support_tickets(p_limit integer default 50, p_offset integer default 0)
returns table (
    id uuid,
    kind text,
    status text,
    created_at timestamptz,
    last_activity_at timestamptz,
    excerpt text,
    has_unread boolean,
    route text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_uid uuid := private.assert_support_learner();
begin
    return query
    select t.id, t.kind, private.support_learner_status(t.status), t.created_at, t.last_activity_at,
           left(f.body, 140),
           exists (select 1 from public.notifications n
                   where n.user_id = v_uid and n.subject_id = t.id and n.read_at is null
                     and n.type in ('support_reply', 'support_status')),
           t.route
    from public.support_tickets t
    left join lateral (
        select m.body from public.support_messages m
        where m.ticket_id = t.id order by m.created_at, m.id limit 1
    ) f on true
    where t.user_id = v_uid
    order by t.last_activity_at desc, t.created_at desc, t.id
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
    offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

-- One of the caller's tickets; no row when it does not exist or is not the caller's.
create function public.get_my_support_ticket(p_ticket_id uuid)
returns table (
    id uuid,
    kind text,
    status text,
    created_at timestamptz,
    last_activity_at timestamptz,
    can_reply boolean,
    route text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_uid uuid := private.assert_support_learner();
begin
    return query
    select t.id, t.kind, private.support_learner_status(t.status), t.created_at, t.last_activity_at, t.status <> 'closed', t.route
    from public.support_tickets t
    where t.id = p_ticket_id and t.user_id = v_uid;
end;
$$;

revoke execute on function public.list_my_support_tickets(integer, integer) from public, anon;
revoke execute on function public.get_my_support_ticket(uuid) from public, anon;
grant execute on function public.list_my_support_tickets(integer, integer) to authenticated;
grant execute on function public.get_my_support_ticket(uuid) to authenticated;
