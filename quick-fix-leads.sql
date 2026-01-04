-- QUICK FIX - Create leads table immediately
-- Run this in Supabase SQL Editor to fix contact form errors

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    value DECIMAL(10,2) DEFAULT 0,
    estimatedBudget TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost')),
    assigned_to TEXT DEFAULT 'unassigned',
    notes TEXT,
    next_action TEXT DEFAULT 'Initial contact required',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Project consultation fields
    services JSONB,
    timeline JSONB,
    additionalNotes TEXT,
    projectDetails JSONB
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY IF NOT EXISTS "Anyone can insert leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can view leads" ON leads
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can update leads" ON leads
    FOR UPDATE USING (true);

-- Success message
SELECT 'LEADS_TABLE_CREATED' as status, 
       'Leads table created with basic permissions' as message;
