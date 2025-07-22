-- Create enhanced waitlist table for June premium application
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 99),
  instagram TEXT NOT NULL,
  linkedin TEXT,
  twitter TEXT,
  priority_score INTEGER DEFAULT 0,
  access_code TEXT UNIQUE,
  batch_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_batch_number ON waitlist(batch_number);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority_score ON waitlist(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_access_code ON waitlist(access_code);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts for everyone (for waitlist signup)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow reads for authenticated users only (for admin)
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT TO authenticated
  USING (true);

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

-- Trigger to auto-generate access code and priority score
CREATE OR REPLACE FUNCTION trigger_waitlist_insert() RETURNS TRIGGER AS $$
BEGIN
  NEW.access_code := generate_access_code();
  NEW.priority_score := calculate_priority_score(NEW.instagram, NEW.linkedin, NEW.twitter);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS waitlist_insert_trigger ON waitlist;
CREATE TRIGGER waitlist_insert_trigger
  BEFORE INSERT ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION trigger_waitlist_insert();
