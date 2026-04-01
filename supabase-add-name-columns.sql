-- Migration: Replace full_name with first_name and last_name
-- Date: March 31, 2026
-- Purpose: Split full_name into separate first_name and last_name fields

-- Step 1: Add first_name and last_name columns to waitlist
ALTER TABLE waitlist
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Step 2: Add first_name and last_name columns to waitlist_test
ALTER TABLE waitlist_test
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Step 3: Remove full_name column from waitlist (no longer needed)
ALTER TABLE waitlist
DROP COLUMN IF EXISTS full_name;

-- Step 4: Remove full_name column from waitlist_test
ALTER TABLE waitlist_test
DROP COLUMN IF EXISTS full_name;

-- Step 5: Verify changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('waitlist', 'waitlist_test')
AND column_name IN ('first_name', 'last_name')
ORDER BY table_name, column_name;
