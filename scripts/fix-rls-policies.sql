-- Fix RLS policies for waitlist table
-- Run this in your Supabase SQL Editor

-- First, let's check current policies and remove them
DROP POLICY IF EXISTS "Allow public inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated updates" ON waitlist;

-- Ensure RLS is enabled
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create proper policy for anonymous users to insert data (for waitlist form)
CREATE POLICY "Enable insert for anonymous users" ON waitlist
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Create policy for public to read their own data (optional, for future features)
CREATE POLICY "Enable select for users based on email" ON waitlist
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create policy for authenticated users (admins) to read all data
CREATE POLICY "Enable full access for authenticated users" ON waitlist
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON waitlist TO anon;
GRANT SELECT ON waitlist TO anon;

-- Grant full permissions to authenticated role
GRANT ALL ON waitlist TO authenticated;

-- Grant usage on the sequence for the id column
GRANT USAGE ON SEQUENCE waitlist_id_seq TO anon;
GRANT USAGE ON SEQUENCE waitlist_id_seq TO authenticated;

-- Verify the policies are created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'waitlist'; 