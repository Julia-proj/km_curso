-- Add full_name field to profiles table for storing user name from Google OAuth
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add updated_at field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Keep existing email-based RLS policy (schema uses gen_random_uuid() for id, not auth.uid())
DROP POLICY IF EXISTS "read own profile" ON profiles;
CREATE POLICY "read own profile" ON profiles
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = email);

-- Update RLS policy for updates to use email
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = email);

-- Service role can manage profiles (for auth callback and webhooks)
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
CREATE POLICY "Service role can manage profiles" ON profiles
  FOR ALL
  USING (auth.role() = 'service_role');
