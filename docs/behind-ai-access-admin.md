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

## Approve a tester (development project only)

Run these in the Supabase SQL editor of the development project (`cdwbcwafzohezvpushue`). The
editor runs as `postgres`, which is the only role allowed to call these functions.

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
