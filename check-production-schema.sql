-- IMPORTANT: Run this in your Supabase SQL Editor
-- This will show you EXACTLY which columns exist in the waitlist table

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'waitlist'
ORDER BY ordinal_position;

-- If the migration was successful, you should see:
-- first_name | text | YES
-- last_name  | text | YES
--
-- If the migration was NOT run, you will see:
-- full_name | text | YES
