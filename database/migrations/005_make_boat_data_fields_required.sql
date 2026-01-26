-- Migration: Make all boat_data fields required except brochure and additional_details
-- Date: 2024
-- Description: Adds NOT NULL constraints to all boat_data fields except brochure and additional_details

-- Add NOT NULL constraints to required fields
ALTER TABLE boat_data 
    ALTER COLUMN manufacturer SET NOT NULL,
    ALTER COLUMN build_number SET NOT NULL,
    ALTER COLUMN build_year SET NOT NULL,
    ALTER COLUMN location SET NOT NULL,
    ALTER COLUMN price SET NOT NULL,
    ALTER COLUMN vat_included SET NOT NULL,
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN designer SET NOT NULL,
    ALTER COLUMN hull_length SET NOT NULL,
    ALTER COLUMN waterline_length SET NOT NULL,
    ALTER COLUMN beam SET NOT NULL,
    ALTER COLUMN draft SET NOT NULL,
    ALTER COLUMN ballast SET NOT NULL,
    ALTER COLUMN displacement SET NOT NULL,
    ALTER COLUMN engine_power SET NOT NULL,
    ALTER COLUMN fuel_tank SET NOT NULL,
    ALTER COLUMN water_tank SET NOT NULL,
    ALTER COLUMN exterior_description SET NOT NULL;

-- Note: brochure and additional_details remain nullable (optional)
