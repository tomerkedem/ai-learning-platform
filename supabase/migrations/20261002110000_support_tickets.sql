-- In-app support: tickets and messages, learner and admin operations.
-- Requires 20261002100000_notifications (private.notify).
--
-- Who: any signed-in learner with a confirmed email who is not suspended. Course access is NOT
-- required (no-grant, expired and revoked learners may use support). Guests cannot.
--
-- Kinds: problem, help, feedback. Every ticket is a conversation.
--
-- Status: support_tickets.status is the internal workflow state and the only stored status:
--   new, open, in_progress, waiting_on_learner, resolved, closed.
-- Learners never receive it. private.support_learner_status(status) is the single, authoritative
-- projection to the learner-facing state (open, waiting_for_you, resolved, closed); every learner
-- operation and every notification goes through it, and admin operations return both values.
--
-- Access: learners have NO privilege on support_tickets or support_messages (RLS on, no
-- policies). Every read and write is a security-definer function that takes identity from
-- auth.uid(). Learner results never include the internal status or any admin user id; admin
-- replies are attributed to "team".
--
-- Lifecycle:
--   learner reply to resolved or waiting_on_learner -> open (reopen); to closed -> refused.
--   admin reply: new -> open unless a status is given; clears awaiting_team_since.
--   admin status change: any status except new. 'new' is only the initial state.
--   An admin cannot reply to or change the status of a ticket they own as the learner (BT105).
--
-- Attention (admin, derived, not stored per admin): awaiting_team_since is set by the first
-- learner message the team has not answered yet and cleared by a team reply. A ticket needs
-- attention while awaiting_team_since is set and its status is not resolved or closed.
--
-- Abuse guards (not business quotas), all in private.support_limits(): 10 active tickets per
-- learner, 30 learner messages per rolling 24 hours, 4000 characters per message. A per-learner
-- transaction advisory lock makes the counts exact under concurrent requests.
--
-- Privacy: the stored context is the request kind, the UI locale and a validated course pathname
-- (no query string, no hash, no host). No IP address, User-Agent, location or browser data.
--
-- Account deletion (INTERIM V1 POLICY, review before commercial launch): tickets, messages and
-- notifications cascade with auth.users, like all other account data. Admin actor ids
-- (support_messages.author_user_id, support_tickets.status_changed_by) have no foreign key, so
-- they survive the removal of an admin, like course_access_audit.actor_user_id.
--
-- Not in V1: events table, attachments, internal notes, assignment, priority, app version.
-- course_access_audit is not used for support.
--
-- Error codes: 42501 not allowed; 22023 invalid input; BT101 too many active tickets;
-- BT102 daily message limit; BT103 ticket closed; BT104 ticket not found; BT105 an admin cannot
-- handle their own ticket.
-- No em dash.

-- ── Rules (single definitions, used by constraints and operations) ──

-- Abuse guards. To change a limit, replace this function in a new migration. The message length
-- is also enforced by support_messages_body_valid through private.support_body_ok, which reads
-- this function; existing rows are not revalidated when the limit changes.
create function private.support_limits(out max_active_tickets integer, out max_learner_messages_per_day integer, out max_message_chars integer)
language sql
immutable
set search_path = ''
as $$
    select 10, 30, 4000;
$$;

-- Internal status -> learner-facing status. The only place this mapping exists.
create function private.support_learner_status(p_status text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
    select case p_status
        when 'new' then 'open'
        when 'open' then 'open'
        when 'in_progress' then 'open'
        when 'waiting_on_learner' then 'waiting_for_you'
        when 'resolved' then 'resolved'
        when 'closed' then 'closed'
    end;
$$;

-- Line endings become \n; surrounding spaces, tabs and newlines are removed.
create function private.support_normalize_body(p_body text)
returns text
language sql
immutable
set search_path = ''
as $$
    select btrim(regexp_replace(coalesce(p_body, ''), E'\r\n?', E'\n', 'g'), E' \n\t');
$$;

-- A stored body: normalized, 1 to max_message_chars characters, no control characters except
-- newline and tab.
create function private.support_body_ok(p_body text)
returns boolean
language sql
immutable
set search_path = ''
as $$
    select p_body is not null
        and char_length(p_body) between 1 and (private.support_limits()).max_message_chars
        and p_body = btrim(p_body, E' \n\t')
        and regexp_replace(p_body, E'[\n\t]', '', 'g') !~ '[[:cntrl:]]';
$$;

-- A course pathname only: no host, query string or hash, at most three lowercase segments.
create function private.support_route_ok(p_route text)
returns boolean
language sql
immutable
set search_path = ''
as $$
    select p_route is not null
        and char_length(p_route) <= 200
        and p_route ~ '^/behind-the-scenes-ai(/[a-z0-9-]{1,64}){0,3}$';
$$;

-- Chapter number derived from a chapter route, else null.
create function private.support_route_chapter(p_route text)
returns smallint
language sql
immutable
set search_path = ''
as $$
    select (regexp_match(p_route, '^/behind-the-scenes-ai/chapter-([1-9][0-9]?)$'))[1]::smallint;
$$;

-- ── Tables ──
create table public.support_tickets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id text not null default 'behind-the-scenes-ai' check (course_id = 'behind-the-scenes-ai'),
    kind text not null check (kind in ('problem', 'help', 'feedback')),
    status text not null default 'new'
        check (status in ('new', 'open', 'in_progress', 'waiting_on_learner', 'resolved', 'closed')),
    locale text not null check (locale in ('he', 'en', 'es', 'ru', 'ar', 'ja')),
    route text constraint support_tickets_route_valid check (route is null or private.support_route_ok(route)),
    created_at timestamptz not null default now(),
    -- learner-visible events only (messages and changes of the learner-facing status)
    last_activity_at timestamptz not null default now(),
    -- first learner message the team has not answered yet; null after a team reply
    awaiting_team_since timestamptz default now(),
    status_changed_at timestamptz not null default now(),
    -- who last changed the status (admin, or the learner when a reply reopened it); no FK
    status_changed_by uuid
);
create index support_tickets_user on public.support_tickets (user_id, last_activity_at desc);
create index support_tickets_attention on public.support_tickets (awaiting_team_since)
    where awaiting_team_since is not null and status not in ('resolved', 'closed');

create table public.support_messages (
    id uuid primary key default gen_random_uuid(),
    ticket_id uuid not null references public.support_tickets (id) on delete cascade,
    author_role text not null check (author_role in ('learner', 'admin')),
    -- the learner (ticket owner) or the acting admin; no FK (kept for accountability)
    author_user_id uuid not null,
    body text not null constraint support_messages_body_valid check (private.support_body_ok(body)),
    -- clock_timestamp: messages keep their real order even within one transaction
    created_at timestamptz not null default clock_timestamp()
);
create index support_messages_ticket on public.support_messages (ticket_id, created_at);
create index support_messages_learner_rate on public.support_messages (author_user_id, created_at) where author_role = 'learner';

-- Messages are immutable. A delete is allowed only as a cascade (ticket or account deletion).
create function private.guard_support_message()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if tg_op = 'UPDATE' or pg_trigger_depth() < 2 then
        raise exception 'Support messages cannot be changed or deleted' using errcode = '42501';
    end if;
    return old;
end;
$$;

create trigger guard_support_message
    before update or delete on public.support_messages
    for each row execute function private.guard_support_message();

-- No API role reads or writes these tables directly (no policies, no privileges).
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
revoke all on table public.support_tickets, public.support_messages from anon, authenticated;

-- ── Internal helpers ──

-- The caller may use learner support: signed in, confirmed email, not suspended. Returns the id.
create function private.assert_support_learner()
returns uuid
language plpgsql
stable
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
begin
    if v_uid is null or not exists (select 1 from auth.users u where u.id = v_uid and u.email_confirmed_at is not null) then
        raise exception 'A signed-in account with a confirmed email is required' using errcode = '42501';
    end if;
    if exists (select 1 from public.course_account_suspensions s where s.user_id = v_uid and s.suspended) then
        raise exception 'This account is suspended' using errcode = '42501';
    end if;
    return v_uid;
end;
$$;

-- Serializes one learner's writes, so the limit counts below are exact under concurrency.
create function private.lock_support_learner(p_uid uuid)
returns void
language sql
set search_path = ''
as $$
    select pg_advisory_xact_lock(hashtextextended('bts-support:' || p_uid::text, 0));
$$;

-- Abuse guards for one more learner message (p_new_ticket: it also opens a ticket).
create function private.assert_support_limits(p_uid uuid, p_new_ticket boolean)
returns void
language plpgsql
stable
set search_path = ''
as $$
declare
    v_limits record;
begin
    select * into v_limits from private.support_limits();
    if p_new_ticket and (
        select count(*) from public.support_tickets t
        where t.user_id = p_uid and t.status not in ('resolved', 'closed')
    ) >= v_limits.max_active_tickets then
        raise exception 'Too many active support requests' using errcode = 'BT101';
    end if;
    if (
        select count(*) from public.support_messages m
        where m.author_user_id = p_uid and m.author_role = 'learner' and m.created_at > now() - interval '24 hours'
    ) >= v_limits.max_learner_messages_per_day then
        raise exception 'Daily support message limit reached' using errcode = 'BT102';
    end if;
end;
$$;

-- Admin mutation guard: caller is an admin, the ticket exists (locked for update) and does not
-- belong to the caller. Every admin mutation goes through this.
create function private.lock_support_ticket_for_admin(p_ticket_id uuid)
returns public.support_tickets
language plpgsql
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
    v_ticket public.support_tickets;
begin
    if not private.is_course_admin(v_uid) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    select * into v_ticket from public.support_tickets where id = p_ticket_id for update;
    if not found then
        raise exception 'Support request not found' using errcode = 'BT104';
    end if;
    if v_ticket.user_id = v_uid then
        raise exception 'Admins cannot handle their own support request' using errcode = 'BT105';
    end if;
    return v_ticket;
end;
$$;

-- Notifies the ticket owner, with learner-safe parameters only.
-- support_reply: one unread reply notification per ticket; it carries the current status, so
--   an unread status notification for the same ticket is superseded (marked read).
-- support_status: folded into an unread reply notification for the ticket when there is one.
create function private.notify_support(p_ticket public.support_tickets, p_type text)
returns void
language plpgsql
set search_path = ''
as $$
declare
    v_params jsonb := jsonb_build_object('kind', p_ticket.kind, 'status', private.support_learner_status(p_ticket.status));
begin
    if p_type = 'support_reply' then
        update public.notifications set read_at = now()
        where user_id = p_ticket.user_id and type = 'support_status' and subject_id = p_ticket.id and read_at is null;
    else
        update public.notifications set params = v_params
        where user_id = p_ticket.user_id and type = 'support_reply' and subject_id = p_ticket.id and read_at is null;
        if found then
            return;
        end if;
    end if;
    perform private.notify(p_ticket.user_id, p_type, p_ticket.id, v_params);
end;
$$;

-- ── Learner operations ──

create function public.create_support_ticket(p_kind text, p_body text, p_locale text, p_route text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := private.assert_support_learner();
    v_body text := private.support_normalize_body(p_body);
    v_id uuid;
begin
    if p_kind is null or p_kind not in ('problem', 'help', 'feedback') then
        raise exception 'Invalid request kind' using errcode = '22023';
    end if;
    if p_locale is null or p_locale not in ('he', 'en', 'es', 'ru', 'ar', 'ja') then
        raise exception 'Invalid locale' using errcode = '22023';
    end if;
    if not private.support_body_ok(v_body) then
        raise exception 'Invalid message' using errcode = '22023';
    end if;
    if p_route is not null and not private.support_route_ok(p_route) then
        raise exception 'Invalid route' using errcode = '22023';
    end if;
    perform private.lock_support_learner(v_uid);
    perform private.assert_support_limits(v_uid, true);
    insert into public.support_tickets (user_id, kind, locale, route)
    values (v_uid, p_kind, p_locale, p_route)
    returning id into v_id;
    insert into public.support_messages (ticket_id, author_role, author_user_id, body)
    values (v_id, 'learner', v_uid, v_body);
    return v_id;
end;
$$;

-- Reply on the caller's own ticket. Resolved or waiting_on_learner -> open. Closed -> BT103.
-- Replying marks the ticket's notifications read. Learner actions never notify the learner.
create function public.add_support_message(p_ticket_id uuid, p_body text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := private.assert_support_learner();
    v_body text := private.support_normalize_body(p_body);
    v_ticket public.support_tickets;
    v_status text;
    v_at timestamptz;
begin
    if not private.support_body_ok(v_body) then
        raise exception 'Invalid message' using errcode = '22023';
    end if;
    perform private.lock_support_learner(v_uid);
    select * into v_ticket from public.support_tickets where id = p_ticket_id and user_id = v_uid for update;
    if not found then
        raise exception 'Support request not found' using errcode = 'BT104';
    end if;
    if v_ticket.status = 'closed' then
        raise exception 'This support request is closed' using errcode = 'BT103';
    end if;
    perform private.assert_support_limits(v_uid, false);
    insert into public.support_messages (ticket_id, author_role, author_user_id, body)
    values (p_ticket_id, 'learner', v_uid, v_body)
    returning created_at into v_at;
    v_status := case when v_ticket.status in ('resolved', 'waiting_on_learner') then 'open' else v_ticket.status end;
    update public.support_tickets
    set status = v_status,
        status_changed_at = case when v_status <> v_ticket.status then now() else status_changed_at end,
        status_changed_by = case when v_status <> v_ticket.status then v_uid else status_changed_by end,
        awaiting_team_since = coalesce(awaiting_team_since, now()),
        last_activity_at = now()
    where id = p_ticket_id;
    update public.notifications set read_at = now()
    where user_id = v_uid and subject_id = p_ticket_id and read_at is null
      and type in ('support_reply', 'support_status');
    return v_at;
end;
$$;

-- The caller's tickets, latest activity first, with the learner-facing status only.
create function public.list_my_support_tickets(p_limit integer default 50, p_offset integer default 0)
returns table (
    id uuid,
    kind text,
    status text,
    created_at timestamptz,
    last_activity_at timestamptz,
    excerpt text,
    has_unread boolean
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
                     and n.type in ('support_reply', 'support_status'))
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
    can_reply boolean
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
    select t.id, t.kind, private.support_learner_status(t.status), t.created_at, t.last_activity_at, t.status <> 'closed'
    from public.support_tickets t
    where t.id = p_ticket_id and t.user_id = v_uid;
end;
$$;

-- Messages of one of the caller's tickets, oldest first. author = 'you' or 'team'; no user ids.
create function public.list_my_support_messages(p_ticket_id uuid)
returns table (
    id uuid,
    author text,
    body text,
    created_at timestamptz
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
    select m.id, case m.author_role when 'learner' then 'you' else 'team' end, m.body, m.created_at
    from public.support_messages m
    join public.support_tickets t on t.id = m.ticket_id
    where t.id = p_ticket_id and t.user_id = v_uid
    order by m.created_at, m.id;
end;
$$;

-- ── Admin operations ──

-- Derived attention counts. Excludes the caller's own tickets (they cannot handle them).
create function public.admin_support_counts()
returns table (
    attention_count integer,
    new_count integer,
    oldest_attention_since timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
begin
    if not private.is_course_admin(v_uid) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    return query
    select (count(*) filter (where t.awaiting_team_since is not null))::integer,
           (count(*) filter (where t.status = 'new'))::integer,
           min(t.awaiting_team_since)
    from public.support_tickets t
    where t.status not in ('resolved', 'closed') and t.user_id <> v_uid;
end;
$$;

-- p_view: attention (default; oldest waiting first; excludes the caller's own tickets), active,
-- resolved, closed, all (latest activity first). p_query matches email or full name.
create function public.admin_list_support_tickets(
    p_view text default 'attention', p_kind text default null, p_query text default null,
    p_limit integer default 50, p_offset integer default 0
)
returns table (
    id uuid,
    user_id uuid,
    email text,
    full_name text,
    learner_suspended boolean,
    kind text,
    status text,
    learner_status text,
    locale text,
    route text,
    chapter_id smallint,
    created_at timestamptz,
    last_activity_at timestamptz,
    awaiting_team_since timestamptz,
    needs_attention boolean,
    message_count integer,
    excerpt text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
    v_view text := coalesce(p_view, 'attention');
    v_q text := lower(btrim(coalesce(p_query, '')));
begin
    if not private.is_course_admin(v_uid) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    if v_view not in ('attention', 'active', 'resolved', 'closed', 'all') then
        raise exception 'Invalid view' using errcode = '22023';
    end if;
    if p_kind is not null and p_kind not in ('problem', 'help', 'feedback') then
        raise exception 'Invalid request kind' using errcode = '22023';
    end if;
    return query
    select t.id, t.user_id, u.email::text, p.full_name, coalesce(s.suspended, false),
           t.kind, t.status, private.support_learner_status(t.status), t.locale, t.route,
           private.support_route_chapter(t.route), t.created_at, t.last_activity_at, t.awaiting_team_since,
           t.awaiting_team_since is not null and t.status not in ('resolved', 'closed'),
           (select count(*) from public.support_messages m where m.ticket_id = t.id)::integer,
           left(f.body, 140)
    from public.support_tickets t
    join auth.users u on u.id = t.user_id
    left join public.profiles p on p.user_id = t.user_id
    left join public.course_account_suspensions s on s.user_id = t.user_id
    left join lateral (
        select m.body from public.support_messages m
        where m.ticket_id = t.id order by m.created_at, m.id limit 1
    ) f on true
    where (case v_view
            when 'attention' then t.awaiting_team_since is not null and t.status not in ('resolved', 'closed') and t.user_id <> v_uid
            when 'active' then t.status not in ('resolved', 'closed')
            when 'resolved' then t.status = 'resolved'
            when 'closed' then t.status = 'closed'
            else true
          end)
      and (p_kind is null or t.kind = p_kind)
      and (v_q = '' or position(v_q in lower(u.email)) > 0 or position(v_q in lower(coalesce(p.full_name, ''))) > 0)
    order by case when v_view = 'attention' then t.awaiting_team_since end asc,
             t.last_activity_at desc, t.id
    limit least(greatest(coalesce(p_limit, 50), 1), 200)
    offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

-- One ticket with its learner. Reading the caller's own ticket is allowed (is_own = true).
create function public.admin_get_support_ticket(p_ticket_id uuid)
returns table (
    id uuid,
    user_id uuid,
    email text,
    full_name text,
    learner_suspended boolean,
    access_status text,
    kind text,
    status text,
    learner_status text,
    locale text,
    route text,
    chapter_id smallint,
    created_at timestamptz,
    last_activity_at timestamptz,
    awaiting_team_since timestamptz,
    needs_attention boolean,
    status_changed_at timestamptz,
    status_changed_by uuid,
    is_own boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
begin
    if not private.is_course_admin(v_uid) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    return query
    select t.id, t.user_id, u.email::text, p.full_name, coalesce(s.suspended, false), d.status,
           t.kind, t.status, private.support_learner_status(t.status), t.locale, t.route,
           private.support_route_chapter(t.route), t.created_at, t.last_activity_at, t.awaiting_team_since,
           t.awaiting_team_since is not null and t.status not in ('resolved', 'closed'),
           t.status_changed_at, t.status_changed_by, t.user_id = v_uid
    from public.support_tickets t
    join auth.users u on u.id = t.user_id
    left join public.profiles p on p.user_id = t.user_id
    left join public.course_account_suspensions s on s.user_id = t.user_id
    cross join lateral private.access_status_for(t.user_id) d
    where t.id = p_ticket_id;
    if not found then
        raise exception 'Support request not found' using errcode = 'BT104';
    end if;
end;
$$;

create function public.admin_list_support_messages(p_ticket_id uuid)
returns table (
    id uuid,
    author_role text,
    author_user_id uuid,
    body text,
    created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
    if not private.is_course_admin((select auth.uid())) then
        raise exception 'Not authorized' using errcode = '42501';
    end if;
    if not exists (select 1 from public.support_tickets t where t.id = p_ticket_id) then
        raise exception 'Support request not found' using errcode = 'BT104';
    end if;
    return query
    select m.id, m.author_role, m.author_user_id, m.body, m.created_at
    from public.support_messages m
    where m.ticket_id = p_ticket_id
    order by m.created_at, m.id;
end;
$$;

-- Team reply, optionally with a new status in the same transaction. Without p_status a new
-- ticket becomes open. Closed tickets are refused (BT103): reopen with a status change first.
-- Returns the new internal status. Notifies the learner (support_reply).
create function public.admin_reply_support_ticket(p_ticket_id uuid, p_body text, p_status text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
    v_ticket public.support_tickets := private.lock_support_ticket_for_admin(p_ticket_id);
    v_body text := private.support_normalize_body(p_body);
    v_status text;
begin
    if not private.support_body_ok(v_body) then
        raise exception 'Invalid message' using errcode = '22023';
    end if;
    if p_status is not null and p_status not in ('open', 'in_progress', 'waiting_on_learner', 'resolved', 'closed') then
        raise exception 'Invalid status' using errcode = '22023';
    end if;
    if v_ticket.status = 'closed' then
        raise exception 'This support request is closed' using errcode = 'BT103';
    end if;
    v_status := coalesce(p_status, case when v_ticket.status = 'new' then 'open' else v_ticket.status end);
    insert into public.support_messages (ticket_id, author_role, author_user_id, body)
    values (p_ticket_id, 'admin', v_uid, v_body);
    update public.support_tickets
    set status = v_status,
        status_changed_at = case when v_status <> v_ticket.status then now() else status_changed_at end,
        status_changed_by = case when v_status <> v_ticket.status then v_uid else status_changed_by end,
        awaiting_team_since = null,
        last_activity_at = now()
    where id = p_ticket_id
    returning * into v_ticket;
    perform private.notify_support(v_ticket, 'support_reply');
    return v_status;
end;
$$;

-- Status change. 'new' cannot be set. Same status = no change. The learner is notified only when
-- the learner-facing status changes; internal-only moves (for example new -> in_progress) are
-- invisible to the learner, including last_activity_at.
create function public.admin_set_support_status(p_ticket_id uuid, p_status text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
    v_ticket public.support_tickets := private.lock_support_ticket_for_admin(p_ticket_id);
    v_visible boolean;
begin
    if p_status is null or p_status not in ('open', 'in_progress', 'waiting_on_learner', 'resolved', 'closed') then
        raise exception 'Invalid status' using errcode = '22023';
    end if;
    if p_status = v_ticket.status then
        return p_status;
    end if;
    v_visible := private.support_learner_status(p_status) <> private.support_learner_status(v_ticket.status);
    update public.support_tickets
    set status = p_status,
        status_changed_at = now(),
        status_changed_by = v_uid,
        last_activity_at = case when v_visible then now() else last_activity_at end
    where id = p_ticket_id
    returning * into v_ticket;
    if v_visible then
        perform private.notify_support(v_ticket, 'support_status');
    end if;
    return p_status;
end;
$$;

-- ── Execute rights: private helpers never; public operations for signed-in users only ──
revoke execute on function private.support_limits() from public, anon, authenticated;
revoke execute on function private.support_learner_status(text) from public, anon, authenticated;
revoke execute on function private.support_normalize_body(text) from public, anon, authenticated;
revoke execute on function private.support_body_ok(text) from public, anon, authenticated;
revoke execute on function private.support_route_ok(text) from public, anon, authenticated;
revoke execute on function private.support_route_chapter(text) from public, anon, authenticated;
revoke execute on function private.guard_support_message() from public, anon, authenticated;
revoke execute on function private.assert_support_learner() from public, anon, authenticated;
revoke execute on function private.lock_support_learner(uuid) from public, anon, authenticated;
revoke execute on function private.assert_support_limits(uuid, boolean) from public, anon, authenticated;
revoke execute on function private.lock_support_ticket_for_admin(uuid) from public, anon, authenticated;
revoke execute on function private.notify_support(public.support_tickets, text) from public, anon, authenticated;

revoke execute on function public.create_support_ticket(text, text, text, text) from public, anon;
revoke execute on function public.add_support_message(uuid, text) from public, anon;
revoke execute on function public.list_my_support_tickets(integer, integer) from public, anon;
revoke execute on function public.get_my_support_ticket(uuid) from public, anon;
revoke execute on function public.list_my_support_messages(uuid) from public, anon;
revoke execute on function public.admin_support_counts() from public, anon;
revoke execute on function public.admin_list_support_tickets(text, text, text, integer, integer) from public, anon;
revoke execute on function public.admin_get_support_ticket(uuid) from public, anon;
revoke execute on function public.admin_list_support_messages(uuid) from public, anon;
revoke execute on function public.admin_reply_support_ticket(uuid, text, text) from public, anon;
revoke execute on function public.admin_set_support_status(uuid, text) from public, anon;

grant execute on function public.create_support_ticket(text, text, text, text) to authenticated;
grant execute on function public.add_support_message(uuid, text) to authenticated;
grant execute on function public.list_my_support_tickets(integer, integer) to authenticated;
grant execute on function public.get_my_support_ticket(uuid) to authenticated;
grant execute on function public.list_my_support_messages(uuid) to authenticated;
grant execute on function public.admin_support_counts() to authenticated;
grant execute on function public.admin_list_support_tickets(text, text, text, integer, integer) to authenticated;
grant execute on function public.admin_get_support_ticket(uuid) to authenticated;
grant execute on function public.admin_list_support_messages(uuid) to authenticated;
grant execute on function public.admin_reply_support_ticket(uuid, text, text) to authenticated;
grant execute on function public.admin_set_support_status(uuid, text) to authenticated;
