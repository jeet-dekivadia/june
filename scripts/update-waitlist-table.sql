-- SQL commands to update your existing Supabase waitlist table
-- Run these in your Supabase SQL Editor

-- Add new columns to existing waitlist table
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS access_code TEXT,
ADD COLUMN IF NOT EXISTS batch_number INTEGER,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add constraints
ALTER TABLE waitlist 
ADD CONSTRAINT IF NOT EXISTS check_gender CHECK (gender IN ('Male', 'Female', 'Other') OR gender IS NULL),
ADD CONSTRAINT IF NOT EXISTS check_age CHECK (age >= 18 AND age <= 99 OR age IS NULL);

-- Add unique constraint on access_code
ALTER TABLE waitlist 
ADD CONSTRAINT IF NOT EXISTS unique_access_code UNIQUE (access_code);

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_name ON waitlist(name);
CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone);
CREATE INDEX IF NOT EXISTS idx_waitlist_gender ON waitlist(gender);
CREATE INDEX IF NOT EXISTS idx_waitlist_age ON waitlist(age);
CREATE INDEX IF NOT EXISTS idx_waitlist_instagram ON waitlist(instagram);
CREATE INDEX IF NOT EXISTS idx_waitlist_batch_number ON waitlist(batch_number);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority_score ON waitlist(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_access_code ON waitlist(access_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_updated_at ON waitlist(updated_at);

-- Function to generate unique access codes
CREATE OR REPLACE FUNCTION generate_access_code() RETURNS TEXT AS $$
BEGIN
  RETURN 'JUNE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Function to calculate priority score
CREATE OR REPLACE FUNCTION calculate_priority_score(
  p_instagram TEXT,
  p_linkedin TEXT,
  p_twitter TEXT
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Base score for complete application
  score := 100;
  
  -- Bonus points for social presence
  IF p_instagram IS NOT NULL AND LENGTH(p_instagram) > 1 THEN
    score := score + 30;
  END IF;
  
  IF p_linkedin IS NOT NULL AND LENGTH(p_linkedin) > 1 THEN
    score := score + 20;
  END IF;
  
  IF p_twitter IS NOT NULL AND LENGTH(p_twitter) > 1 THEN
    score := score + 10;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger function for auto-generation
CREATE OR REPLACE FUNCTION trigger_waitlist_insert() RETURNS TRIGGER AS $$
BEGIN
  -- Only generate access code and priority score for new complete entries
  IF NEW.name IS NOT NULL AND NEW.email IS NOT NULL THEN
    NEW.access_code := generate_access_code();
    NEW.priority_score := calculate_priority_score(NEW.instagram, NEW.linkedin, NEW.twitter);
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS waitlist_insert_trigger ON waitlist;
CREATE TRIGGER waitlist_insert_trigger
  BEFORE INSERT OR UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION trigger_waitlist_insert();

-- Update RLS policies to handle new columns
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads" ON waitlist;

-- Create updated policies
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT TO authenticated
  USING (true);

-- Allow updates for authenticated users (for admin updates)
CREATE POLICY "Allow authenticated updates" ON waitlist
  FOR UPDATE TO authenticated
  USING (true); 