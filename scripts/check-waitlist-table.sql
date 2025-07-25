-- Check waitlist table structure and policies
-- Run this in your Supabase SQL editor to diagnose issues

-- 1. Check if the waitlist table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
ORDER BY ordinal_position;

-- 2. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'waitlist';

-- 3. Check existing RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'waitlist';

-- 4. Check permissions for anon role
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_name = 'waitlist' 
AND grantee = 'anon';

-- 5. Quick test - try to insert a minimal record (will show exact error)
-- Uncomment the next lines to test (but don't run this if you don't want test data)
-- INSERT INTO waitlist (name, created_at) 
-- VALUES ('Test User', NOW()); 