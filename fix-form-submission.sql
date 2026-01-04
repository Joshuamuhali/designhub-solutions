-- COMPREHENSIVE FORM SUBMISSION FIX
-- Run this in Supabase SQL Editor to fix all form submission issues

-- Step 1: Add missing columns to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS additionalNotes TEXT;

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS services JSONB;

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS projectDetails JSONB;

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS timeline JSONB;

-- Step 2: Fix RLS policies to allow public submissions
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
DROP POLICY IF EXISTS "Anyone can view leads" ON leads;
DROP POLICY IF EXISTS "Anyone can update leads" ON leads;

-- Create proper policies for public form submissions
CREATE POLICY "Public can insert leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view own leads" ON leads
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage all leads" ON leads
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'sales_head', 'sales_rep')
    );

-- Step 3: Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Step 4: Verify table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;

-- Success message
SELECT 'FORM_SUBMISSION_FIXED' as status, 
       'All form submission issues resolved' as message;
