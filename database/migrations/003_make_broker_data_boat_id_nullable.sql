-- Migration: Make broker_data.boat_id nullable
-- Date: 2024
-- Description: Allows broker_data to exist without a boat_id, so dealers can be created independently
--              and linked to boats later when boat forms are submitted

-- Make boat_id nullable in broker_data table
ALTER TABLE broker_data 
    ALTER COLUMN boat_id DROP NOT NULL;

-- Add a comment explaining the change
COMMENT ON COLUMN broker_data.boat_id IS 'Nullable: Allows broker_data to exist independently. Set when a boat is linked to this dealer.';
