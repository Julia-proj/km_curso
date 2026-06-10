-- Create lesson_progress table to track user's lesson completion
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed INTEGER[] DEFAULT '{}',
  last_viewed INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one progress record per user
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);

-- Enable RLS
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own progress
CREATE POLICY "Users can read own lesson progress"
  ON lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id);
