# Behind the Scenes of AI: beta access admin runbook

Access has two levels (`hasCourseAccess` in `app/(course)/behind-the-scenes-ai/_access/access.ts`):

- **No active grant** (guest, unconfirmed email, confirmed with no grant, expired grant, revoked
  grant, suspended account): only the introduction preview (heading, hero and the opening chat
  example) and an explanation that the introduction continues with approved access. The rest of
  the introduction, Chapters 1-19 and the final exam are never rendered or sent.
- **Active grant:** the full introduction, Chapters 1-19, their quizzes and the final exam, for a
  signed-in learner with an active, explicitly approved grant.

Creating an account or confirming an email is authentication only: it grants no access. New users
have no grant. `course_access_status` still distinguishes every state (for the messages shown),
but only `active` opens content.
Information pages, registration, email confirmation and password recovery stay public.

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
same rule applies as at registration (2 to 100 characters, trimmed, no control characters,
enforced by the database), and each change is recorded in `course_access_audit` as action
`rename` with the old and new name in `details`. Only admins can change a name: learners have no
update or insert privilege on `profiles.full_name`, and a trigger pins `full_name` in the Auth
user metadata after registration, so `auth.updateUser` cannot change it either.

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
- Beta access cannot be approved or renewed for a suspended account, from a request or manually
  (migration `20260930080215_refuse_suspended_manual_beta_approval`, error `BT005`). No grant
  changes; the admin page says to reactivate the account first.
- Every attempt is recorded in `course_access_audit` (actions `suspend` / `reactivate`) with
  `details.outcome` = `succeeded` or `auth_failed` and the Auth error.

**Server secret required:** `SUPABASE_SERVICE_ROLE_KEY`, set only in the server environment
(`.env.local` locally, the hosting provider's secret settings in deployment), never with a
`NEXT_PUBLIC_` prefix and never committed. Use the development project's secret key (Supabase
dashboard > Project Settings > API Keys: a `sb_secret_...` key, or the legacy `service_role` key).
Restart the server after setting it. Without it, the admin page refuses to suspend or reactivate
and changes nothing.

## Beta-access requests

Migration `20260930073759_beta_access_requests`. A signed-in learner with a confirmed email, no
suspension and no active access can request beta access from the account panel or a locked
chapter. A request grants nothing.

- **Submission** (`public.request_beta_access`, called by a server action) is checked in the
  database: identity, confirmed email, not suspended, consent ticked, no active access, and a
  Beta Terms acceptance (see Legal documents below). The acceptance and the request are recorded
  in one transaction; if either is refused, neither is stored. A unique index allows at most one
  pending request per learner. The request row points to its acceptance
  (`beta_access_requests.acceptance_id`). Learners can read only their own requests and
  acceptances and cannot write either table.
- **Admin page**: "Pending beta requests only" lists pending requests, oldest first. For a
  learner with a pending request, the approve button approves the request
  (`admin_approve_beta_request`): it grants access through `admin_approve_beta` (same period
  rules and audit) and marks the request approved with the acting admin and grant, in one
  transaction. Decline (`admin_decline_beta_request`) asks for confirmation and records the
  acting admin. A request that is no longer pending is refused (another admin decided first).
  Admins cannot approve their own request. A suspended learner's request cannot be approved
  (migration `20260930075828_refuse_suspended_beta_approval`): it stays pending with no grant,
  and the page says to reactivate the account first. Manual approve, revoke and suspend work as before.

## Legal documents and acceptances

Migrations `20261001130000_legal_documents` and `20261001140000_legal_documents_hardening`, both
applied to the development project. Replaces
`beta_terms_versions` and the `BETA_TERMS_VERSION` constant. The database decides which version is current; the repository
locale dictionaries remain the authoring source.

- **`legal_document_versions`**: one row per canonical version of `beta_terms`,
  `terms_of_service` or `privacy_policy`, version format `YYYY-MM-DD.N`, at most one current
  version per type. English is the canonical authoring locale (`canonical_locale`). A version can
  be current only with a current translation in its canonical locale (deferred constraint
  triggers, checked at commit). Flags: `requires_acceptance` and `material` (a material version
  needs a new acceptance from anyone who accepted an earlier version;
  `private.legal_acceptance_covers_current`). There is no `effective_at`: `is_current` alone
  decides, and `published_at` records publication. Add a future-dated field only when the product
  needs scheduled legal versions.
- **Privacy Policy**: informational today because its published versions have
  `requires_acceptance = false` (set in `scripts/legal-document-version.mjs`) and no acceptance
  path exists for it. The schema itself does not forbid a future decision to require acceptance.
- **`legal_document_translations`**: the exact legal body shown in one locale (JSON of the info
  page `title`, `lead` and `blocks`; not `navTitle` or `summary`) and its SHA-256, checked by the
  database. A translation correction is a new `revision` of the same version and locale. At most
  one current revision per version and locale. A body with a placeholder block is refused.
- Versions and translations cannot be changed (except `is_current`) or deleted.
- **`legal_acceptances`**: user, canonical version, exact translation revision, locale,
  `accepted_at` and `context` (`beta_access_request`). No IP address or User-Agent. Immutable.
  Learners can read only their own rows. Created only inside `request_beta_access`, through the
  internal `private.record_legal_acceptance`, which resolves the current version and translation
  for the locale and refuses (BT002) when the hash the server sends does not match.
- **Account deletion (temporary, pending a legal retention decision)**: acceptances are deleted
  with the account, like all other account data. Changing this is a foreign-key change.
- **Terms of Service**: the type exists, but there is no source text and no acceptance path.
- **Publishing a new Beta Terms version never revokes or suspends an existing grant.**
- **Pending requests after a material version (BT006)**: an admin cannot approve a pending
  request whose acceptance no longer covers the current version (a material version was
  published after it). A translation revision alone, or a non-material version, does not block
  approval. The learner's panel asks them to read and accept the current terms again; that
  records a new acceptance and attaches it to the same pending request (the earlier acceptance
  stays as evidence). No acceptance is ever created by an admin.

### Grant basis: request acceptance versus administrative override

Every new grant records `course_access_grants.basis` (required by a trigger for new rows):

- `beta_request`: created only by `admin_approve_beta_request`, from a pending request whose
  acceptance covers the current terms. The request row links the grant (`grant_id`) and the
  learner's acceptance (`acceptance_id`).
- `admin_override`: created by a manual approval (`admin_approve_beta` from the admin page, or
  `private.approve_beta_tester`). An administrative override, not learner consent: no
  acceptance is recorded or linked.
- Grants created before the hardening migration keep `basis = null` ("legacy"); their rows are
  not modified and can still be revoked. This covers the four grandfathered test grants on the
  development project.

The audit row (`course_access_audit`, action `approve`) points to the grant by `grant_id`, so
the basis of every audited approval is visible through the grant. The admin page shows
"Administrative grant" or "Granted before grant types were recorded" for those grants
(`admin_list_learners.access_grant_basis`).

### Applying migrations (official Supabase CLI)

Migrations are applied with the official Supabase CLI, run through `npx` (no global install and
no package dependency). The repository is linked to the development project; the CLI keeps its
link state in `supabase/.temp/`, which is git-ignored. Never insert or edit rows in
`supabase_migrations.schema_migrations` by hand.

1. `npx supabase login` (once per machine; your own terminal, browser sign-in).
2. `npx --yes supabase link --project-ref cdwbcwafzohezvpushue` (development project only).
3. `npx --yes supabase migration list --linked`: local and remote must match, with only the new
   migration pending.
4. `npx --yes supabase db push --dry-run`: must list exactly the new migration.
5. `npx --yes supabase db push`.
6. Run `supabase/tests/legal_documents.sql` on the development project (rolled back, leaves no
   data).

`20261001140000_legal_documents_hardening` was applied this way. The history entry for
`20261001130000` was recorded before this workflow existed and stores only a pointer comment in
`statements`; the CLI lists it as applied normally and `db push` treats it as applied.

### Publishing (submissions are disabled until a Beta Terms version exists)

**No version is published today**, because the Beta Terms page still has placeholder blocks
(tester license, legal terms). Until then the learner sees an explanation instead of the
consent form, and the server and database refuse every submission.

After the final wording is approved and the placeholders are removed from all six locales:

1. New version: `node scripts/legal-document-version.mjs version beta_terms YYYY-MM-DD.N --material`
   (or `--not-material`; this is a human decision). Translation correction of the current
   version: `node scripts/legal-document-version.mjs revision beta_terms YYYY-MM-DD.N <locale>`.
   Both refuse while any placeholder remains.
2. Put the output in a new migration and apply it to the development project.

If the text in the repository changes without a new version or revision, its hash no longer
matches, the consent form is hidden and submissions are refused, so an acceptance is never
recorded against text the learner did not see.

Database tests: `supabase/tests/legal_documents.sql` (development project only; everything is
rolled back).

## In-app support and notifications

Migrations `20261002100000_notifications`, `20261002110000_support_tickets` and
`20261002120000_support_learner_route`, all applied to the development project. Database tests: `supabase/tests/support.sql` (development project only;
everything is rolled back). Learner pages: `/behind-the-scenes-ai/support`,
`/behind-the-scenes-ai/support/new` and `/behind-the-scenes-ai/support/[id]` (noindex, not in the
sitemap). There is no admin support page yet.

Who can use it: a signed-in learner with a confirmed email who is not suspended. Course access is
not required (no-grant, expired, revoked and active learners can all use it). Guests cannot, and
a suspended account cannot sign in, so it has no in-app channel.

### Tables

- `public.support_tickets`: one request. `kind` (`problem`, `help`, `feedback`), `status` (the
  internal workflow state: `new`, `open`, `in_progress`, `waiting_on_learner`, `resolved`,
  `closed`), `locale` (the course language when it was opened), `route` (a validated course
  pathname or null; no query string, hash or host), `created_at`, `last_activity_at` (learner-visible
  events only), `awaiting_team_since` (the first learner message the team has not answered yet),
  `status_changed_at`, `status_changed_by`.
- `public.support_messages`: the conversation. `author_role` (`learner` or `admin`),
  `author_user_id`, `body` (1 to 4000 characters), `created_at`. Messages cannot be edited or
  deleted, except by a cascade from deleting the ticket or the account.
- `public.notifications`: user notifications (today `support_reply` and `support_status`). A row
  stores a type, a subject id and learner-safe parameters (the request kind and the
  learner-facing status), never text. At most one unread row per user, type and subject; a repeat
  updates it and increments `count`.

Learners have no privilege on the two support tables. They read their own notifications directly
(RLS) and can only mark them read. Every other read and write goes through the functions below,
which take identity from the session. `list_my_support_tickets` and `get_my_support_ticket` also
return the request's own `route` (added by `20261002120000_support_learner_route`), which the
learner pages show as "Sent from Chapter N: title" using the course chapter list; no other internal
field is returned to learners.

### Learner-facing status

The learner never receives the internal status. `private.support_learner_status(status)` is the
only mapping: `new`, `open` and `in_progress` show as `open`; `waiting_on_learner` as
`waiting_for_you`; `resolved` and `closed` unchanged. A learner reply to `resolved` or
`waiting_on_learner` sets `open`; a `closed` request accepts no replies. Admin replies are shown
to learners as the course team, never with the admin's identity.

### Functions

| Learner (`authenticated`) | Admin (refuses non-admins with `42501`) |
| --- | --- |
| `create_support_ticket(kind, body, locale, route)` | `admin_support_counts()` |
| `add_support_message(ticket_id, body)` | `admin_list_support_tickets(view, kind, query, limit, offset)` |
| `list_my_support_tickets(limit, offset)` | `admin_get_support_ticket(ticket_id)` |
| `get_my_support_ticket(ticket_id)` | `admin_list_support_messages(ticket_id)` |
| `list_my_support_messages(ticket_id)` | `admin_reply_support_ticket(ticket_id, body, status)` |
| `mark_notifications_read(subject_id)` | `admin_set_support_status(ticket_id, status)` |

An admin can read their own request as a learner but cannot reply to it or change its status as
an admin (`BT105`). Admin attention is derived (a request awaits the team and is not resolved or
closed), not stored, and excludes the caller's own requests.

Error codes: `42501` not allowed; `22023` invalid input; `BT101` too many active requests;
`BT102` daily message limit; `BT103` request closed; `BT104` request not found; `BT105` an admin
cannot handle their own request.

### Abuse limits

Defined once, in `private.support_limits()`: at most 10 active (not resolved or closed) requests
per learner, 30 learner messages per rolling 24 hours (a new request counts as one), and 4000
characters per message. Admins have no limit. To change a value, replace that function in a new
migration; the message length is also enforced by the `support_messages_body_valid` constraint
through `private.support_body_ok`, and existing rows are not revalidated.

### Account deletion (interim V1 behavior)

Support tickets, messages and notifications are deleted with the account (`ON DELETE CASCADE`),
like the rest of the account data. Admin actor ids on messages and status changes have no foreign
key, so messages an admin wrote stay when the admin account is removed. This is an interim choice
that needs review before commercial launch.

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

Registration requires a full name. The rule depends on the course language at sign-up
(`normalizeFullName` in `authForm.ts`, and the same rule in the database trigger
`private.create_profile_for_new_user`, migration `20261001120000_locale_aware_registration_names`):
whitespace is trimmed and collapsed, at most 100 characters, no control characters; Japanese
(`ja`) needs at least 2 characters and no space (Japanese names are usually written without one);
every other language needs at least two space-separated parts and at least 5 characters. It is
sent with the sign-up and the trigger stores it in `public.profiles.full_name`; a registration
without a valid name is rejected by the database. After that, only an admin can set or change it (admin page). An
account without a name (registered before names existed) shows a note that an admin will add
it; the learner has no form for it. The identity key everywhere remains
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

## Auth emails: templates, language and links

The hosted project's email templates live in the Supabase dashboard. This repository keeps the
source in `supabase/templates/` (there is no `supabase/config.toml`, so nothing applies them
automatically):

| Dashboard template (Authentication > Email Templates) | Subject field | Body (Source) |
| --- | --- | --- |
| Confirm signup | `supabase/templates/confirmation.subject.txt` | `supabase/templates/confirmation.html` |
| Reset password | `supabase/templates/recovery.subject.txt` | `supabase/templates/recovery.html` |

How the language is chosen: each template branches on `.Data.locale` (user metadata) and falls
back to English for a missing or unknown value. `he` and `ar` branches are `dir="rtl"`. The
templates only compare `.Data.locale` with fixed strings; they never print metadata (no name,
no locale), and `lang`/`dir` are constants per branch. The link is always `{{ .ConfirmationURL }}`,
so Supabase's own verification and expiry rules are unchanged.

Where `locale` comes from: signup sends the course language at signup. After that, every
language change of a signed-in learner also updates `user_metadata.locale`
(`savePreferredLocale` in `account.ts`), so a password-reset email follows the learner's current
language. Accounts created before `locale` existed get English until they next change or load a
language while signed in.

### Manual dashboard steps (not done from this repository)

1. Authentication > Email Templates > **Confirm signup**: paste `confirmation.subject.txt` into
   Subject and `confirmation.html` into the message body. Save.
2. Same for **Reset password** with `recovery.subject.txt` and `recovery.html`.
3. Send one test of each from a `he`, an `ar`, a `ja` and an `en` account. Check that the subject
   is translated (if it shows raw `{{ ... }}`, the subject field does not support templating on
   this project: use a fixed subject instead) and that Hebrew and Arabic render right-to-left.
4. Authentication > URL Configuration: Site URL is the production origin. Redirect URLs must
   include `<origin>/behind-the-scenes-ai/introduction` (signup confirmation always returns there)
   and the course pages used for password reset (for example `<origin>/behind-the-scenes-ai/**`),
   for every origin in use (production, preview, `http://localhost:3000`). A `redirectTo` that is
   not on the list is replaced by the Site URL.

### Confirmation destination and tokens in the URL

- Signup confirmation always returns to `/behind-the-scenes-ai/introduction`
  (`SIGNUP_CONFIRM_PATH` in `authForm.ts`), never to the chapter where the learner registered.
  Confirming an email grants nothing: without an active grant the learner sees the preview.
- The project uses the implicit flow: a successful link returns with `#access_token=...` and
  `refresh_token` in the URL. The app turns off supabase-js URL detection and handles it in
  `account.ts`: it reads the tokens once, replaces the URL with a clean one (`replaceState`, no new
  history entry), establishes the session with `setSession`, and then syncs the clean URL into the
  Next.js router so a later router update cannot restore the old hash. Failed links (`error_code`)
  are cleaned the same way and show the localized "link no longer valid" dialog.

Limits to know:

- The default Supabase SMTP sender is for development only. It allows very few emails per hour
  (the development project is set to 2 per hour), which learners see as the localized
  "too many emails" message (`over_email_send_rate_limit`).

Options, from least to most infrastructure:

1. **One template with `.Data.locale` branches** (implemented in `supabase/templates/`). Suitable
   for the beta.
2. **Custom SMTP** (Authentication > SMTP Settings). Needed before production regardless of
   language: it removes the default sender's limits and lets Auth > Rate Limits be raised.
3. **Send Email Auth Hook** (an Edge Function or HTTP endpoint). Supabase hands the email to our
   code, which renders it from our own six-locale templates and sends it through a provider. Most
   control (for example the learner's current language), but it adds a deployed function, a
   provider and a signing secret to maintain. Consider it only if option 1 proves insufficient.

## Learning progress and sticky mastery

Migration `20261002130000_learning_progress_and_sticky_mastery`, applied to the development
project. Database tests: `supabase/tests/learning_progress.sql` (development project only;
everything is rolled back).

- `learning_unit_progress`: one row per learner, chapter (1-19) and learning unit reached, with the
  first `reached_at`. The app writes through `record_learning_units` (idempotent). Learners can read
  and insert their own rows only; there is no update or delete. The unit registry is
  `app/(course)/behind-the-scenes-ai/learningProgress.ts`; progress counts only ids in the current
  registry.
- `quiz_results.mastery_earned`: the chapter quiz was passed at least once. It never returns to
  false and is always false for the final exam. `score_percent` is the latest score;
  `best_score_percent` is history.
- Access ending (expiry, revocation, suspension) changes neither. Only account deletion removes them.
