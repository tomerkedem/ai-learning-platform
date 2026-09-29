-- Retry-safe quiz result writes, and a least-privilege fix for the pre-existing RLS event trigger.
--
-- The client queues every signed-in attempt locally and retries it until the server confirms.
-- A retry after a lost response must not count twice: each attempt carries a client-generated
-- id, and an attempt whose id is already the row's last applied id is a no-op. The queue is
-- flushed in order, one at a time, so only the most recent attempt can ever be retried.
-- completed_at keeps the real completion time of an attempt that was queued while offline
-- (never in the future).

alter table public.quiz_results add column last_attempt_id uuid;

drop function public.record_quiz_result(text, smallint, smallint, smallint, smallint, boolean, text[], text[]);

create function public.record_quiz_result(
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
        attempts, best_score_percent, last_completed_at, weak_concepts, strong_concepts, last_attempt_id
    ) values (
        auth.uid(), p_quiz_id, p_chapter_id, p_score_percent, p_correct_count, p_total_questions, p_passed,
        1, p_score_percent, least(coalesce(p_completed_at, now()), now()),
        coalesce(p_weak_concepts, '{}'), coalesce(p_strong_concepts, '{}'), p_attempt_id
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
        last_attempt_id = excluded.last_attempt_id
    where q.last_attempt_id is distinct from excluded.last_attempt_id;
$$;

revoke execute on function public.record_quiz_result(uuid, text, smallint, smallint, smallint, smallint, boolean, text[], text[], timestamptz) from public, anon;
grant execute on function public.record_quiz_result(uuid, text, smallint, smallint, smallint, smallint, boolean, text[], text[], timestamptz) to authenticated;

-- rls_auto_enable() backs the ensure_rls event trigger. Event triggers fire without an
-- EXECUTE check, so API roles never need it; revoking stops it being exposed as an RPC.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
