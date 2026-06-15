-- 009: Bonus lesson claims.
-- A student shares the course on Instagram and tags the studio; Elena reviews
-- each claim and approves/rejects it manually. Only an APPROVED claim unlocks
-- the bonus lesson (profiles.has_bonus_lesson). No auto/instant unlock.
--
-- Run in the Supabase SQL editor. Safe to re-run.

-- ========== 1. Unlock flag on the profile (mirrors has_full_course) ==========
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_bonus_lesson BOOLEAN DEFAULT false;

-- ========== 2. Claims table ==========
CREATE TABLE IF NOT EXISTS bonus_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  -- Proof the student provides: a link to the story/post and/or their handle.
  proof_url TEXT,
  instagram_handle TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  -- One claim per student; resubmitting after a reject overwrites the row.
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_bonus_claims_status ON bonus_claims(status);

-- ========== 3. RLS ==========
-- Students may read and create only their own claim. All status changes happen
-- through the admin API on the service-role key, which bypasses RLS, so there
-- is deliberately no "admin" policy here.
ALTER TABLE bonus_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own bonus claim" ON bonus_claims;
CREATE POLICY "read own bonus claim" ON bonus_claims
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert own bonus claim" ON bonus_claims;
CREATE POLICY "insert own bonus claim" ON bonus_claims
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update own bonus claim" ON bonus_claims;
CREATE POLICY "update own bonus claim" ON bonus_claims
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
