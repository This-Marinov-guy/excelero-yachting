-- Migration: Add user_id to boats table
-- Date: 2024
-- Description: Adds user_id column to boats table to associate boats with the user who created them

-- Add user_id column to boats table
ALTER TABLE boats
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id NOT NULL (for new records)
-- Note: For existing records, you may need to handle NULL values first
-- ALTER TABLE boats ALTER COLUMN user_id SET NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_boats_user_id ON boats(user_id);

-- Add comment explaining the field
COMMENT ON COLUMN boats.user_id IS 'References the user who created/owns this boat.';
