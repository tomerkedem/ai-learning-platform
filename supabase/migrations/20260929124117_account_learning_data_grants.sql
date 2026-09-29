-- This project does not auto-grant new tables to the API roles. Grant exactly what the app
-- uses (RLS still limits every row to its owner) and drop TRUNCATE/REFERENCES/TRIGGER, which
-- RLS does not cover. anon gets nothing.
revoke all on table public.profiles, public.quiz_results from anon, authenticated;
grant select, insert, update on table public.profiles, public.quiz_results to authenticated;
