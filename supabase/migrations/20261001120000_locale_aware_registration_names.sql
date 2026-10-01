-- Locale-aware full-name rule at registration.
--
-- Same rule as normalizeFullName in app/(course)/behind-the-scenes-ai/authForm.ts, so the client
-- and the database never contradict each other. The client sends the name already normalized
-- (every Unicode whitespace run becomes one ASCII space); the database normalizes again and decides.
--
--   - trimmed, whitespace runs collapsed, at most 100 characters, no control characters;
--   - locale 'ja' (raw_user_meta_data.locale at sign-up): at least 2 characters, no space needed,
--     because Japanese names are usually written without one;
--   - every other locale: at least 5 characters and at least two space-separated parts.
--
-- The locale comes from the sign-up request, so it only chooses the format rule; it grants nothing.
-- profiles_full_name_valid (2 to 100 characters) still applies to every write, including the
-- admin-only rename (admin_set_learner_name), which is unchanged. Existing names are not touched.

create or replace function private.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_name text := btrim(regexp_replace(coalesce(new.raw_user_meta_data ->> 'full_name', ''), '\s+', ' ', 'g'));
    v_ja boolean := coalesce(new.raw_user_meta_data ->> 'locale', '') = 'ja';
begin
    if char_length(v_name) > 100 or v_name ~ '[[:cntrl:]]'
       or (v_ja and char_length(v_name) < 2)
       or (not v_ja and (char_length(v_name) < 5 or position(' ' in v_name) = 0)) then
        raise exception 'A valid full name is required to register'
            using errcode = '23514';
    end if;
    insert into public.profiles (user_id, full_name)
    values (new.id, v_name)
    on conflict (user_id) do update set full_name = coalesce(public.profiles.full_name, excluded.full_name);
    return new;
end;
$$;

revoke execute on function private.create_profile_for_new_user() from public, anon, authenticated;
