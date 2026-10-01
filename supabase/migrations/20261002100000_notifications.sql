-- General in-app notifications (Notification Center foundation).
--
-- One row per notification for one user. A row stores only a type, an optional subject id (for
-- example a support ticket) and small parameters (identifiers and enum values). It never stores
-- prose: the app renders the text from the type and parameters in the viewer's current locale,
-- so a language switch applies to old notifications too and no message text is copied here.
--
-- Not coupled to any feature: subject_id has no foreign key. The link target is derived in the
-- app from type + subject_id. Later types (beta decisions, account notices) extend the type
-- check in their own migration.
--
-- De-duplication: at most one UNREAD row per (user, type, subject). A repeated event while the
-- row is still unread updates it (newest parameters, count + 1, created_at = now()) instead of
-- adding a row. After it is read, the next event starts a new row.
--
-- Access: a learner reads only their own rows (RLS) and has no insert, update or delete right.
-- Rows are created only by private.notify, called inside the security-definer operation that
-- caused the event (same transaction). Learners mark rows read through mark_notifications_read.
-- Notifications hold user notifications only; admin support attention is a separate, derived
-- concern (admin_support_counts in the support migration) and is never mixed in here.
--
-- Account deletion: rows cascade with auth.users (interim V1 policy, to be reviewed before
-- commercial launch together with support tickets and messages).
--
-- Retention: no pruning in V1 (low volume; the app shows the latest rows). Add pruning of old
-- read rows if the table grows.
-- No em dash.

create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    type text not null check (type in ('support_reply', 'support_status')),
    subject_id uuid,
    params jsonb not null default '{}' check (jsonb_typeof(params) = 'object' and pg_column_size(params) <= 1024),
    count integer not null default 1 check (count >= 1),
    created_at timestamptz not null default now(),
    read_at timestamptz,
    -- Support notifications carry only learner-safe values: the request kind and the
    -- learner-facing status. An internal workflow status can never be stored here.
    constraint notifications_support_params check (
        type not in ('support_reply', 'support_status') or (
            subject_id is not null
            and params ?& array['kind', 'status']
            and (params - 'kind' - 'status') = '{}'::jsonb
            and params ->> 'kind' in ('problem', 'help', 'feedback')
            and params ->> 'status' in ('open', 'waiting_for_you', 'resolved', 'closed')
        )
    )
);

create unique index notifications_one_unread on public.notifications (user_id, type, subject_id) where read_at is null;
create index notifications_user_recent on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;
create policy "notifications_select_own" on public.notifications
    for select to authenticated using ((select auth.uid()) = user_id);
revoke all on table public.notifications from anon, authenticated;
grant select on table public.notifications to authenticated;

-- Internal: create a notification, or update the unread one for the same (user, type, subject).
-- Called only from security-definer operations; never exposed to API roles.
create function private.notify(p_user_id uuid, p_type text, p_subject_id uuid, p_params jsonb)
returns void
language sql
set search_path = ''
as $$
    insert into public.notifications as n (user_id, type, subject_id, params)
    values (p_user_id, p_type, p_subject_id, coalesce(p_params, '{}'::jsonb))
    on conflict (user_id, type, subject_id) where read_at is null
    do update set params = excluded.params, count = n.count + 1, created_at = now();
$$;

-- Learner: mark the caller's unread notifications read. p_subject_id = only that subject's
-- notifications (for example when a support ticket is opened); null = all. Returns the count.
create function public.mark_notifications_read(p_subject_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_uid uuid := (select auth.uid());
    v_count integer;
begin
    if v_uid is null then
        raise exception 'A signed-in account is required' using errcode = '42501';
    end if;
    update public.notifications
    set read_at = now()
    where user_id = v_uid and read_at is null and (p_subject_id is null or subject_id = p_subject_id);
    get diagnostics v_count = row_count;
    return v_count;
end;
$$;

revoke execute on function private.notify(uuid, text, uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.mark_notifications_read(uuid) from public, anon;
grant execute on function public.mark_notifications_read(uuid) to authenticated;
