-- Migration: Add active column to boats table
-- Date: 2024
-- Description: Adds active boolean column to boats table with default value of false

-- Add active column to boats table
ALTER TABLE boats
    ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment explaining the field
COMMENT ON COLUMN boats.active IS 'Indicates whether the boat listing is active/published. Defaults to false (inactive).';
