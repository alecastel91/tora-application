-- Run this in Supabase SQL Editor to verify columns exist
-- This will show you which columns exist in both tables

SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('waitlist', 'waitlist_test')
AND column_name IN ('full_name', 'first_name', 'last_name')
ORDER BY table_name, column_name;

-- Expected output for correctly migrated tables:
-- waitlist | first_name | text | YES
-- waitlist | last_name  | text | YES
-- waitlist_test | first_name | text | YES
-- waitlist_test | last_name  | text | YES

-- If you see 'full_name' in the results, the migration wasn't run properly
