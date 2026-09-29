-- Account learning data for "Behind the Scenes of AI".
-- Stores each signed-in learner's preferred locale and quiz results (chapter progress is
-- derived from the chapter-quiz rows, exactly as the local store does).
-- Having an account (registered or email-verified) grants NO beta or paid access; nothing
-- here is an entitlement.

create table public.profiles (
    user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
    preferred_locale text check (preferred_locale in ('he', 'en', 'es', 'ru', 'ar', 'ja'))
);

create table public.quiz_results (
    user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
    quiz_id text not null check (quiz_id ~ '^behind-ai-(chapter-[0-9]{1,2}|final)$'),
    chapter_id smallint check (chapter_id between 1 and 99),
    score_percent smallint not null check (score_percent between 0 and 100),
    correct_count smallint not null check (correct_count >= 0),
    total_questions smallint not null check (total_questions between 1 and 500),
    passed boolean not null,
    attempts integer not null check (attempts >= 1),
    best_score_percent smallint not null check (best_score_percent between 0 and 100),
    last_completed_at timestamptz not null,
    weak_concepts text[] not null default '{}' check (cardinality(weak_concepts) <= 100),
    strong_concepts text[] not null default '{}' check (cardinality(strong_concepts) <= 100),
    primary key (user_id, quiz_id),
    check (correct_count <= total_questions)
);

alter table public.profiles enable row level security;
alter table public.quiz_results enable row level security;

-- Own rows only. No delete policy: the app never deletes (account deletion cascades).
create policy "profiles_select_own" on public.profiles
    for select to authenticated using ((select auth.uid()) = user_id);
create policy "profiles_insert_own" on public.profiles
    for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "profiles_update_own" on public.profiles
    for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "quiz_results_select_own" on public.quiz_results
    for select to authenticated using ((select auth.uid()) = user_id);
create policy "quiz_results_insert_own" on public.quiz_results
    for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "quiz_results_update_own" on public.quiz_results
    for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Records one completed attempt atomically, so two devices never lose an attempt or lower
-- the best score. SECURITY INVOKER: the RLS policies above still apply.
create function public.record_quiz_result(
    p_quiz_id text,
    p_chapter_id smallint,
    p_score_percent smallint,
    p_correct_count smallint,
    p_total_questions smallint,
    p_passed boolean,
    p_weak_concepts text[],
    p_strong_concepts text[]
) returns void
language sql
security invoker
set search_path = ''
as $$
    insert into public.quiz_results as q (
        user_id, quiz_id, chapter_id, score_percent, correct_count, total_questions, passed,
        attempts, best_score_percent, last_completed_at, weak_concepts, strong_concepts
    ) values (
        auth.uid(), p_quiz_id, p_chapter_id, p_score_percent, p_correct_count, p_total_questions, p_passed,
        1, p_score_percent, now(), coalesce(p_weak_concepts, '{}'), coalesce(p_strong_concepts, '{}')
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
        strong_concepts = excluded.strong_concepts;
$$;

revoke execute on function public.record_quiz_result(text, smallint, smallint, smallint, smallint, boolean, text[], text[]) from public, anon;
grant execute on function public.record_quiz_result(text, smallint, smallint, smallint, smallint, boolean, text[], text[]) to authenticated;
