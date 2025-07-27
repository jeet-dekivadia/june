-- Enhanced Waitlist Functions for June Premium Application
-- Run these in your Supabase SQL Editor to update the functions

-- Function to generate 6-digit alternating number-letter access codes
CREATE OR REPLACE FUNCTION generate_access_code() RETURNS TEXT AS $$
DECLARE
  code TEXT := '';
  numbers TEXT := '0123456789';
  letters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  i INTEGER;
BEGIN
  -- Generate 6-character alternating number-letter code
  FOR i IN 1..6 LOOP
    IF i % 2 = 1 THEN
      -- Odd positions: numbers (1st, 3rd, 5th)
      code := code || SUBSTRING(numbers, (RANDOM() * 9)::INTEGER + 1, 1);
    ELSE
      -- Even positions: letters (2nd, 4th, 6th)
      code := code || SUBSTRING(letters, (RANDOM() * 25)::INTEGER + 1, 1);
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Enhanced function to calculate priority score with comprehensive scoring system
CREATE OR REPLACE FUNCTION calculate_priority_score(
  p_name TEXT,
  p_phone TEXT,
  p_location TEXT,
  p_gender TEXT,
  p_age INTEGER,
  p_instagram TEXT,
  p_linkedin TEXT,
  p_twitter TEXT
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  field_count INTEGER := 0;
BEGIN
  -- Base score for starting application
  score := 50;
  
  -- Count and score for filled required fields
  IF p_name IS NOT NULL AND LENGTH(TRIM(p_name)) > 0 THEN
    field_count := field_count + 1;
    score := score + 15; -- Required field bonus
  END IF;
  
  IF p_phone IS NOT NULL AND LENGTH(TRIM(p_phone)) > 0 THEN
    field_count := field_count + 1;
    score := score + 15; -- Required field bonus
  END IF;
  
  IF p_location IS NOT NULL AND LENGTH(TRIM(p_location)) > 0 THEN
    field_count := field_count + 1;
    score := score + 15; -- Required field bonus
  END IF;
  
  IF p_gender IS NOT NULL AND LENGTH(TRIM(p_gender)) > 0 THEN
    field_count := field_count + 1;
    score := score + 10; -- Required field bonus
  END IF;
  
  IF p_age IS NOT NULL AND p_age BETWEEN 18 AND 99 THEN
    field_count := field_count + 1;
    score := score + 10; -- Required field bonus
  END IF;
  
  -- Social media profile bonuses (higher priority on Instagram)
  IF p_instagram IS NOT NULL AND LENGTH(TRIM(p_instagram)) > 1 THEN
    field_count := field_count + 1;
    score := score + 40; -- Instagram is most important for dating app
  END IF;
  
  IF p_linkedin IS NOT NULL AND LENGTH(TRIM(p_linkedin)) > 1 THEN
    field_count := field_count + 1;
    score := score + 25; -- LinkedIn shows professional presence
  END IF;
  
  IF p_twitter IS NOT NULL AND LENGTH(TRIM(p_twitter)) > 1 THEN
    field_count := field_count + 1;
    score := score + 15; -- Twitter shows social engagement
  END IF;
  
  -- Completion bonus for having all fields filled
  IF field_count >= 7 THEN -- All required fields + at least 2 social
    score := score + 30;
  ELSIF field_count >= 6 THEN -- Most fields filled
    score := score + 20;
  ELSIF field_count >= 5 THEN -- Basic completion
    score := score + 10;
  END IF;
  
  -- Location-based bonus (New York gets priority)
  IF p_location IS NOT NULL THEN
    -- Check for New York variations (case insensitive)
    IF LOWER(p_location) LIKE '%new york%' OR 
       LOWER(p_location) LIKE '%nyc%' OR 
       LOWER(p_location) LIKE '%manhattan%' OR 
       LOWER(p_location) LIKE '%brooklyn%' OR 
       LOWER(p_location) LIKE '%queens%' OR 
       LOWER(p_location) LIKE '%bronx%' OR 
       LOWER(p_location) LIKE '%staten island%' THEN
      score := score + 100; -- Big bonus for New York area
    END IF;
  END IF;
  
  -- Gender-based bonus
  IF p_gender IS NOT NULL AND LOWER(TRIM(p_gender)) = 'female' THEN
    score := score + 10; -- Bonus for female users
  END IF;
  
  -- Age-based scoring (dating apps favor certain age ranges)
  IF p_age IS NOT NULL THEN
    IF p_age BETWEEN 22 AND 32 THEN
      score := score + 15; -- Prime dating age gets bonus
    ELSIF p_age BETWEEN 18 AND 35 THEN
      score := score + 10; -- Still in high-activity range
    ELSIF p_age BETWEEN 36 AND 45 THEN
      score := score + 5; -- Moderate bonus
    END IF;
  END IF;
  
  -- Ensure minimum score
  IF score < 50 THEN
    score := 50;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Enhanced trigger function with improved validation and scoring
CREATE OR REPLACE FUNCTION trigger_waitlist_insert() RETURNS TRIGGER AS $$
DECLARE
  generated_code TEXT;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  -- Generate unique access code with retry logic
  LOOP
    generated_code := generate_access_code();
    
    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM waitlist WHERE access_code = generated_code) THEN
      NEW.access_code := generated_code;
      EXIT;
    END IF;
    
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      -- Fallback to timestamp-based code if we can't generate unique code
      NEW.access_code := SUBSTRING(UPPER(MD5(EXTRACT(EPOCH FROM NOW())::TEXT)), 1, 6);
      EXIT;
    END IF;
  END LOOP;
  
  -- Calculate priority score with all available data
  NEW.priority_score := calculate_priority_score(
    NEW.name,
    NEW.phone,
    NEW.location,
    NEW.gender,
    NEW.age,
    NEW.instagram,
    NEW.linkedin,
    NEW.twitter
  );
  
  -- Update timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger to use the new function
DROP TRIGGER IF EXISTS waitlist_insert_trigger ON waitlist;
CREATE TRIGGER waitlist_insert_trigger
  BEFORE INSERT OR UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION trigger_waitlist_insert();

-- Function to recalculate priority scores for existing records
CREATE OR REPLACE FUNCTION recalculate_all_priority_scores() RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  updated_count INTEGER := 0;
BEGIN
  FOR rec IN SELECT * FROM waitlist LOOP
    UPDATE waitlist 
    SET priority_score = calculate_priority_score(
      rec.name,
      rec.phone,
      rec.location,
      rec.gender,
      rec.age,
      rec.instagram,
      rec.linkedin,
      rec.twitter
    ),
    updated_at = NOW()
    WHERE id = rec.id;
    
    updated_count := updated_count + 1;
  END LOOP;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to regenerate all access codes with new format
CREATE OR REPLACE FUNCTION regenerate_all_access_codes() RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  generated_code TEXT;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
  updated_count INTEGER := 0;
BEGIN
  FOR rec IN SELECT id FROM waitlist LOOP
    -- Generate unique access code for each record
    LOOP
      generated_code := generate_access_code();
      
      -- Check if code already exists (excluding current record)
      IF NOT EXISTS (SELECT 1 FROM waitlist WHERE access_code = generated_code AND id != rec.id) THEN
        UPDATE waitlist 
        SET access_code = generated_code,
            updated_at = NOW()
        WHERE id = rec.id;
        
        updated_count := updated_count + 1;
        EXIT;
      END IF;
      
      attempt := attempt + 1;
      IF attempt >= max_attempts THEN
        -- Fallback to timestamp-based code
        UPDATE waitlist 
        SET access_code = SUBSTRING(UPPER(MD5(rec.id::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT)), 1, 6),
            updated_at = NOW()
        WHERE id = rec.id;
        
        updated_count := updated_count + 1;
        EXIT;
      END IF;
    END LOOP;
    
    attempt := 0; -- Reset for next record
  END LOOP;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Optional: Run these commands to update existing data
-- SELECT recalculate_all_priority_scores(); -- Updates all priority scores
-- SELECT regenerate_all_access_codes();     -- Updates all access codes to new format

-- Create a view for easy access to waitlist statistics
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
  COUNT(*) as total_applications,
  COUNT(CASE WHEN instagram IS NOT NULL AND LENGTH(TRIM(instagram)) > 1 THEN 1 END) as with_instagram,
  COUNT(CASE WHEN linkedin IS NOT NULL AND LENGTH(TRIM(linkedin)) > 1 THEN 1 END) as with_linkedin,
  COUNT(CASE WHEN twitter IS NOT NULL AND LENGTH(TRIM(twitter)) > 1 THEN 1 END) as with_twitter,
  COUNT(CASE WHEN gender = 'Female' THEN 1 END) as female_users,
  COUNT(CASE WHEN gender = 'Male' THEN 1 END) as male_users,
  COUNT(CASE WHEN gender = 'Other' THEN 1 END) as other_gender,
  COUNT(CASE WHEN LOWER(location) LIKE '%new york%' THEN 1 END) as new_york_users,
  AVG(priority_score)::DECIMAL(10,2) as avg_priority_score,
  MAX(priority_score) as max_priority_score,
  MIN(priority_score) as min_priority_score
FROM waitlist; 