# Behind the Scenes of AI: beta access admin runbook

Chapters 2-19, their quizzes and the final exam open only for a signed-in learner with an
active, explicitly approved grant. The introduction and Chapter 1 stay public.

Creating an account or confirming an email grants nothing. New users have no grant.

## How access is decided

- Grants live in `public.course_access_grants` (migration `20260929153624_course_access_grants`).
- Today the only kind is `beta`. The database enforces that a beta grant ends after its approval
  and no later than one month after it (`beta_grant_at_most_one_month`).
- Every protected page asks the database on every request (`public.course_access_status()`, run
  with the learner's own token). Revocation and expiry therefore apply on the learner's next
  request, including client-side navigation.
- Learners can read their own grants. They cannot create, extend, approve, un-revoke or delete
  grants: no API role has insert, update or delete rights on the table.
- The approve and revoke functions live in the `private` schema. That schema is not exposed
  through the Data API, and `anon` and `authenticated` cannot execute the functions.

## Course admins

Admins use the course admin page (`/behind-the-scenes-ai/admin`) to find learners by name or
email, see email-confirmation and beta-access status, approve access for up to one month and
revoke it (migration `20260929164555_learner_names_and_beta_admin`).

- Admin rights live only in `public.course_admins`, keyed by `user_id`. No API role can read or
  write that table, so rights never come from an email address, client state or a profile field
  that learners can edit.
- The page checks the caller on the server on every request and returns 404 to everyone else.
- Every admin operation (`admin_list_learners`, `admin_approve_beta`, `admin_revoke_beta`) checks
  `course_admins` again in the database and refuses non-admins with error `42501`. A direct API
  call is therefore refused too.
- Nobody is an admin by default.

### Designate the first admin (one time, development project only)

1. The person must already have a confirmed account (sign up, then click the email link).
2. The project owner runs this once in the Supabase SQL editor of the development project
   (`cdwbcwafzohezvpushue`), which runs as `postgres`:

```sql
select private.designate_first_course_admin('admin@example.com', 'first course admin');
```

The function refuses if any admin already exists, or if the email has no confirmed account. To
add another admin later, the project owner inserts the row deliberately:

```sql
insert into public.course_admins (user_id, note)
select id, 'second admin' from auth.users where lower(email) = lower('someone@example.com');
```

To remove an admin: `delete from public.course_admins where user_id = '...';`. The next request
to the admin page, or the next admin operation, is refused.

### Audit trail

Every approval and revocation, from the admin page or the SQL editor, is recorded by a trigger
in `public.course_access_audit` with the grant, the learner, the action, the acting admin
(`actor_user_id`, empty when run from the SQL editor) and the time. No API role can read or
change it.

```sql
select a.created_at, a.action, t.email as learner, actor.email as by_admin
from public.course_access_audit a
join auth.users t on t.id = a.target_user_id
left join auth.users actor on actor.id = a.actor_user_id
order by a.created_at desc;
```

### Grant timing on the admin page

For a learner with a grant, the page shows the latest grant's start, exact expiry (date and
time) and the remaining time, or "Expired" / "Revoked" with its time. Learners without a grant
show no timing. Remaining time is computed from when the list was last loaded.

### Editing a learner's name

Admins can correct a learner's full name on the admin page (`admin_set_learner_name`). The
same rule applies as for learners (2 to 100 characters, trimmed, no control characters,
enforced by the database), and each change is recorded in `course_access_audit` as action
`rename` with the old and new name in `details`. Learners can still edit their own name.

### Suspending an account

Revoking access only ends beta grants: the learner can still sign in and read public pages.
Suspending an account blocks both chapter access and sign-in (migration
`20260929201342_account_suspension`). Admin accounts, including your own, cannot be suspended.

- `public.course_account_suspensions` holds the intended state. As soon as it says suspended,
  `course_access_status` returns `suspended`, so an existing session loses protected content on
  its next request, whatever happens at Supabase Auth.
- Sign-in is blocked by a Supabase Auth ban, applied by a server action with the service-role
  key. The key never reaches the browser.
- Order of operations, so a partial failure is never reported as success:
  - **Suspend:** the database blocks access first, then Auth bans, then the real outcome is
    recorded.
  - **Reactivate:** the database checks the target, then Auth unbans, and only then is access
    restored.
  - If Auth fails, the admin page shows what happened and a retry. Suspending leaves access
    blocked but sign-in open. Reactivating leaves the account suspended.
  - Retries are safe: every step can be repeated.
- Every attempt is recorded in `course_access_audit` (actions `suspend` / `reactivate`) with
  `details.outcome` = `succeeded` or `auth_failed` and the Auth error.

**Server secret required:** `SUPABASE_SERVICE_ROLE_KEY`, set only in the server environment
(`.env.local` locally, the hosting provider's secret settings in deployment), never with a
`NEXT_PUBLIC_` prefix and never committed. Use the development project's secret key (Supabase
dashboard > Project Settings > API Keys: a `sb_secret_...` key, or the legacy `service_role` key).
Restart the server after setting it. Without it, the admin page refuses to suspend or reactivate
and changes nothing.

## Test learners (development project only)

`supabase/dev/test-learners.sql` creates exactly three labeled learners for trying the admin
page: `test-learner-no-grant@example.com` (no grant), `test-learner-active@example.com` (active
one-month beta grant) and `test-learner-expired@example.com` (a grant that ended 10 days ago).

- Run the SEED block in the SQL editor of the development project only. It inserts rows
  directly, so Supabase Auth sends no emails. It is idempotent.
- The accounts are confirmed, flagged with `app_metadata.bts_test_learner = true` and have a
  random, unrecorded password, so nobody can sign in as them unless a password is set
  deliberately in dev.
- **Removing them:** run the CLEANUP block from the same file (uncomment it). It deletes their
  audit rows and then the users; their profiles, grants, progress, identities and sessions
  go with them through `ON DELETE CASCADE`. It matches only rows with both the flag and a
  `test-learner-*@example.com` address, so no other account is touched.

## Learner names

Registration requires a full name (2 to 100 characters). It is sent with the sign-up and a
database trigger stores it in `public.profiles.full_name`; a registration without a valid name
is rejected by the database. Learners who registered before names existed are asked to add one
after signing in, and anyone can edit their own name. The identity key everywhere remains
`user_id`, never the name or email.

Because of that trigger, a user created by hand (for example from the dashboard) must include a
`full_name` in its user metadata.

## Approve a tester from the SQL editor (development project only)

The admin page is the normal way. These SQL functions remain for the project owner. Run them in
the Supabase SQL editor of the development project (`cdwbcwafzohezvpushue`). The editor runs as
`postgres`, which is the only role allowed to call these functions.

```sql
-- One month from now (the default and the maximum):
select * from private.approve_beta_tester('tester@example.com');

-- Shorter period, with a note:
select * from private.approve_beta_tester('tester@example.com', interval '14 days', 'spring cohort');
```

- The tester must already have an account.
- Each approval adds a new row, so history is kept; the newest active grant wins.
- A period longer than one month is rejected by the database.

To extend access, approve again after the current grant ends. The new grant still runs at most
one month from the moment of approval.

## Revoke a tester

```sql
select private.revoke_beta_tester('tester@example.com');  -- returns the number of grants revoked
```

Revocation sets `revoked_at` and never deletes rows.

## Check a tester's status

```sql
select u.email, g.kind, g.approved_at, g.expires_at, g.revoked_at, g.note
from public.course_access_grants g
join auth.users u on u.id = g.user_id
where lower(u.email) = lower('tester@example.com')
order by g.approved_at desc;
```

## Adding paid access later

Paid entitlements become a new `kind` value, with its own duration rule in a new migration
(for example, extend the `kind` check and add a constraint for the paid rules). The status
function, page enforcement and learner permissions stay as they are.
