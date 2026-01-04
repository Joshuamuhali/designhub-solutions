-- COMPLETE DATABASE SCHEMA - Run this in Supabase SQL Editor
-- This will create all necessary tables for the Designhub system

-- Step 1: Create profiles table (if not already created)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'super_admin', 'sales_head', 'sales_rep', 'finance', 'marketing', 'support')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Step 2: Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for profiles
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );

CREATE POLICY IF NOT EXISTS "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );

-- Step 4: Create leads table (for contact form submissions)
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

-- Step 5: Enable RLS on leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for leads
CREATE POLICY IF NOT EXISTS "Users can view own leads" ON leads
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Users can insert leads" ON leads
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Admins can manage all leads" ON leads
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'sales_head', 'sales_rep')
    );

-- Step 7: Create other essential tables
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    deal_value DECIMAL(10,2) NOT NULL,
    client TEXT NOT NULL,
    date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    description TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    client TEXT NOT NULL,
    budget DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    customer TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('technical', 'billing', 'general', 'feature_request', 'bug_report')),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    revenue DECIMAL(10,2) DEFAULT 0,
    leads INTEGER DEFAULT 0,
    spent DECIMAL(10,2) DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT
);

-- Step 8: Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Step 9: Create basic RLS policies for other tables
CREATE POLICY IF NOT EXISTS "Users can manage own tasks" ON tasks
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Admins can manage all tasks" ON tasks
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

CREATE POLICY IF NOT EXISTS "Users can view commissions" ON commissions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Admins can manage commissions" ON commissions
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'sales_head'));

-- Step 10: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Step 11: Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 13: Force create/update existing users
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
    COALESCE(u.raw_user_meta_data->>'role', 'client') as role,
    u.created_at,
    NOW() as updated_at
FROM auth.users u
WHERE u.email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com')
AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;

-- Step 14: Force super admin role for specific users
UPDATE profiles 
SET role = 'super_admin'
WHERE email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com');

-- Step 15: Update auth metadata to match
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{role}',
    '"super_admin"'
)
WHERE email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com');

-- Step 16: Verification
SELECT 
    'VERIFICATION' as step,
    p.id,
    p.email,
    p.role,
    p.full_name,
    p.created_at,
    a.raw_user_meta_data->>'role' as auth_role
FROM profiles p
JOIN auth.users a ON p.id = a.id
WHERE p.email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com')
ORDER BY p.email;

-- Success message
SELECT 'DATABASE_SCHEMA_COMPLETE' as status, 
       'All tables created with RLS, triggers, and super admin users fixed' as message;
