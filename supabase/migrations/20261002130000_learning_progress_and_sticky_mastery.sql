-- Learning progress (reached learning units) and sticky chapter mastery.
--
-- 1. Sticky mastery. quiz_results.passed describes only the latest attempt, so a later failed
--    attempt hid an earlier pass. mastery_earned records "passed this chapter quiz at least once"
--    explicitly: it never returns to false, and it does not depend on the pass threshold that is
--    current when it is read. Chapter quizzes only; the final exam keeps its latest-attempt
--    semantics (mastery_earned is always false there). score_percent stays the latest score and
--    best_score_percent stays history.
--    Backfill: every existing chapter row was recorded while the chapter pass threshold was 70
--    (the AssessmentEngine default since before these tables existed), so "passed now, or best
--    score ever >= 70" is exactly "passed at least once".
--
-- 2. learning_unit_progress: one row per learner, chapter (1-19) and learning unit the learner
--    reached, with the first time it was reached. A reached unit is history, like quiz results:
--    it is never deleted when access expires, is revoked or the account is suspended (only
--    account deletion cascades), and it grants no access. Unit ids are not validated against
--    the course content here; the app counts only ids in its current registry, so a removed or
--    unknown id never inflates progress.
-- No em dash.

-- ── 1. Sticky chapter mastery ──
alter table public.quiz_results add column mastery_earned boolean not null default false;

update public.quiz_results
    set mastery_earned = true
    where chapter_id is not null and (passed or best_score_percent >= 70);

alter table public.quiz_results
    add constraint quiz_results_mastery_chapters_only check (chapter_id is not null or not mastery_earned);

-- Same signature, grants and retry safety as before; only mastery_earned is added.
create or replace function public.record_quiz_result(
    p_attempt_id uuid,
    p_quiz_id text,
    p_chapter_id smallint,
    p_score_percent smallint,
    p_correct_count smallint,
    p_total_questions smallint,
    p_passed boolean,
    p_weak_concepts text[],
    p_strong_concepts text[],
    p_completed_at timestamptz
) returns void
language sql
security invoker
set search_path = ''
as $$
    insert into public.quiz_results as q (
        user_id, quiz_id, chapter_id, score_percent, correct_count, total_questions, passed,
        attempts, best_score_percent, last_completed_at, weak_concepts, strong_concepts, last_attempt_id,
        mastery_earned
    ) values (
        auth.uid(), p_quiz_id, p_chapter_id, p_score_percent, p_correct_count, p_total_questions, p_passed,
        1, p_score_percent, least(coalesce(p_completed_at, now()), now()),
        coalesce(p_weak_concepts, '{}'), coalesce(p_strong_concepts, '{}'), p_attempt_id,
        p_chapter_id is not null and p_passed
    )
    on conflict (user_id, quiz_id) do update set
        chapter_id = excluded.chapter_id,
        score_percent = excluded.score_percent,
        correct_count = excluded.correct_count,
        total_questions = excluded.total_questions,
        passed = excluded.passed,
        attempts = q.attempts + 1,
        best_score_percent = greatest(q.best_score_percent, excluded.score_percent),
        last_completed_at = excluded.last_completed_at,
        weak_concepts = excluded.weak_concepts,
        strong_concepts = excluded.strong_concepts,
        last_attempt_id = excluded.last_attempt_id,
        mastery_earned = excluded.chapter_id is not null and (q.mastery_earned or excluded.mastery_earned)
    where q.last_attempt_id is distinct from excluded.last_attempt_id;
$$;

-- ── 2. Reached learning units ──
create table public.learning_unit_progress (
    user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
    chapter_id smallint not null check (chapter_id between 1 and 19),
    unit_id text not null check (unit_id ~ '^[a-z][a-z0-9-]{0,47}$'),
    reached_at timestamptz not null default now(),
    primary key (user_id, chapter_id, unit_id)
);

alter table public.learning_unit_progress enable row level security;

-- Own rows only. No update or delete policy: a reached unit stays reached (account deletion cascades).
create policy "learning_unit_progress_select_own" on public.learning_unit_progress
    for select to authenticated using ((select auth.uid()) = user_id);
create policy "learning_unit_progress_insert_own" on public.learning_unit_progress
    for insert to authenticated with check ((select auth.uid()) = user_id);

revoke all on table public.learning_unit_progress from anon, authenticated;
grant select, insert on table public.learning_unit_progress to authenticated;

-- Records reached units in one call (the client's offline queue). Idempotent: a unit that is
-- already recorded keeps its first reached_at, so retries after a lost response are no-ops.
-- reached_at keeps the real time of a unit reached offline, never in the future.
-- SECURITY INVOKER: the RLS policies above still apply.
create function public.record_learning_units(
    p_chapter_ids smallint[],
    p_unit_ids text[],
    p_reached_at timestamptz[]
) returns void
language sql
security invoker
set search_path = ''
as $$
    insert into public.learning_unit_progress (user_id, chapter_id, unit_id, reached_at)
    select auth.uid(), u.chapter_id, u.unit_id, least(coalesce(u.reached_at, now()), now())
    from unnest(p_chapter_ids, p_unit_ids, p_reached_at) as u (chapter_id, unit_id, reached_at)
    on conflict (user_id, chapter_id, unit_id) do nothing;
$$;

revoke execute on function public.record_learning_units(smallint[], text[], timestamptz[]) from public, anon;
grant execute on function public.record_learning_units(smallint[], text[], timestamptz[]) to authenticated;
