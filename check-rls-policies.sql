-- Check if Row Level Security (RLS) is enabled on waitlist tables
-- Run this in Supabase SQL Editor

-- Step 1: Check RLS status
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('waitlist', 'waitlist_test');

-- Step 2: Check existing policies
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
WHERE schemaname = 'public'
AND tablename IN ('waitlist', 'waitlist_test')
ORDER BY tablename, policyname;

-- Expected result:
-- If rls_enabled = true but no INSERT policy exists, that's the problem!
-- Solution: Either disable RLS or add an INSERT policy that allows anonymous users
