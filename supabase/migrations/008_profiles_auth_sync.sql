-- 008: Link profiles.id to auth.users.id so RLS checks by auth.uid() are
-- reliable. Until now profiles.id was a random uuid (gen_random_uuid), so rows
-- created by the Stripe webhook before the user's first login were invisible
-- to `auth.uid() = id` policies and broke the dashboard access check.
--
-- Run this in the Supabase SQL editor. Safe to re-run.

-- ========== 1. Let profile id changes cascade into lesson_progress ==========
-- (needed for step 2 and for the auth-callback upsert that relinks ids)
ALTER TABLE lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_user_id_fkey;
ALTER TABLE lesson_progress ADD CONSTRAINT lesson_progress_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ========== 2. Relink existing rows to their auth user ==========
-- Profiles created by the webhook (random id) get the real auth.users id,
-- matched by email. Skips rows whose target id is already taken.
UPDATE profiles p
SET id = u.id
FROM auth.users u
WHERE lower(u.email) = lower(p.email)
  AND p.id <> u.id
  AND NOT EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = u.id);

-- ========== 3. Auto-create/link a profile on every signup ==========
-- Standard Supabase pattern: trigger on auth.users. If a webhook-created
-- profile already exists for that email, it gets relinked to the auth id.
-- Never blocks signup: errors are downgraded to warnings.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (email) DO UPDATE
    SET id = EXCLUDED.id,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== 4. RLS: own row visible by id OR email ==========
-- The email fallback covers webhook-created rows that are not linked yet
-- (e.g. the user paid but the relink hasn't happened). This replaces the
-- conflicting policies from earlier scripts — final state is deterministic.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own profile" ON profiles;
CREATE POLICY "read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR (auth.jwt() ->> 'email') = email);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR (auth.jwt() ->> 'email') = email);

-- ========== 5. Drop the no-op service-role policy ==========
-- The service role key bypasses RLS entirely; this policy only caused confusion.
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
