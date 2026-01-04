-- FIX MISSING COLUMNS - Add missing columns to leads table
-- Run this in Supabase SQL Editor to fix the additionalNotes column error

-- Add missing additionalNotes column if it doesn't exist
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS additionalNotes TEXT;

-- Also add any other potentially missing columns for project consultations
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS services JSONB;

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS timeline JSONB;

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS projectDetails JSONB;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Success message
SELECT 'COLUMNS_ADDED' as status, 
       'Missing columns added to leads table' as message;
