-- Add location column to waitlist table
-- Run this in your Supabase SQL editor

-- 1. Add the location column to the waitlist table
ALTER TABLE waitlist 
ADD COLUMN location TEXT;

-- 2. Update RLS policies to include the new location column
-- First, check if the policy exists and drop it if needed
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON waitlist;
DROP POLICY IF EXISTS "Allow insert for all users" ON waitlist;
DROP POLICY IF EXISTS "Allow public insert" ON waitlist;

-- 3. Create a new RLS policy that allows public inserts
-- This allows anyone to insert into the waitlist table (for signup form)
CREATE POLICY "Allow public insert on waitlist" ON waitlist
    FOR INSERT 
    WITH CHECK (true);

-- 4. Create a policy for reading data (optional - if you need to read waitlist data)
-- Uncomment the next lines if you need to allow reading waitlist data
-- CREATE POLICY "Allow read for authenticated users" ON waitlist
--     FOR SELECT 
--     USING (auth.role() = 'authenticated');

-- 5. Ensure RLS is enabled on the table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 6. Grant necessary permissions for public access (for inserts)
GRANT INSERT ON waitlist TO anon;
GRANT USAGE ON SEQUENCE waitlist_id_seq TO anon;

-- Optional: Add an index on location for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlist_location ON waitlist(location);

-- Verify the table structure
\d waitlist; 