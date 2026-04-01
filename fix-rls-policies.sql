-- FIX: Enable public INSERT access to waitlist tables
-- Run this ONLY if the check-rls-policies.sql shows RLS is enabled but no INSERT policy exists

-- Option 1: Disable RLS entirely (EASIEST - use this if waitlist data isn't sensitive)
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_test DISABLE ROW LEVEL SECURITY;

-- OR

-- Option 2: Keep RLS enabled but add INSERT policy for anonymous users
-- (Comment out Option 1 above if using this)
/*
-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_test ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for waitlist (allows anonymous users to insert)
CREATE POLICY "Allow public insert" ON waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create INSERT policy for waitlist_test (allows anonymous users to insert)
CREATE POLICY "Allow public insert" ON waitlist_test
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create SELECT policy for authenticated users (for admin dashboard)
CREATE POLICY "Allow authenticated select" ON waitlist
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated select" ON waitlist_test
FOR SELECT
TO authenticated
USING (true);

-- Create UPDATE policy for authenticated users (for admin dashboard)
CREATE POLICY "Allow authenticated update" ON waitlist
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON waitlist_test
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
*/
