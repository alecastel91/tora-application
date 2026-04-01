-- Migration: Add test environment support to tora-application database
-- Date: March 31, 2026
-- Purpose: Create separate waitlist_test table for test data

-- Step 1: Create waitlist_test table with same structure as waitlist
CREATE TABLE IF NOT EXISTS waitlist_test (LIKE waitlist INCLUDING ALL);

-- Step 2: Verify table was created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('waitlist', 'waitlist_test');
