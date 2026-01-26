-- Migration: Add additional_details field to boat_data table
-- Date: 2024
-- Description: Adds additional_details as a TEXT field for styled text content

-- Add additional_details column to boat_data table
ALTER TABLE boat_data 
    ADD COLUMN IF NOT EXISTS additional_details TEXT NULLABLE DEFAULT NULL;

-- Add a comment explaining the field
COMMENT ON COLUMN boat_data.additional_details IS 'Styled text field for additional boat details and information.';
