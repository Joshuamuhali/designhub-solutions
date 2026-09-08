-- FULL ERP & BUSINESS OPERATING SYSTEM SCHEMA

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Opportunities / Deals Table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    offering_slug TEXT,
    deal_value DECIMAL(10,2) DEFAULT 0.00,
    stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost')),
    assigned_sales_rep TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_number TEXT UNIQUE NOT NULL,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    terms TEXT,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    offering_slug TEXT,
    deal_value DECIMAL(10,2) DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'internal_review', 'client_review', 'revision_required', 'client_approved', 'completed', 'on_hold', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0,
    pm_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    brief TEXT,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Project Members (RBAC + Contextual Assignment)
CREATE TABLE IF NOT EXISTS project_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_in_project TEXT NOT NULL CHECK (role_in_project IN ('pm', 'sales', 'designer', 'developer', 'copywriter', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- 7. Create Project Tasks
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'internal_qa', 'client_review', 'completed')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create Project Files (Tiered RLS Visibility)
CREATE TABLE IF NOT EXISTS project_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    visibility TEXT NOT NULL DEFAULT 'internal_only' CHECK (visibility IN ('internal_only', 'working_file', 'client_review', 'final_deliverable')),
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create Project Revisions & Proof Reviews
CREATE TABLE IF NOT EXISTS project_revisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    proof_file_url TEXT NOT NULL,
    designer_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'revision_requested')),
    client_feedback TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('draft', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'mobile_money' CHECK (payment_method IN ('mobile_money', 'card', 'bank_transfer', 'cash')),
    reference_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Create Feedbacks Table
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    would_recommend BOOLEAN DEFAULT true,
    testimonial TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Enable RLS on all ERP Tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 14. Basic RLS Policies
CREATE POLICY "Staff can view all companies" ON companies FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view all contacts" ON contacts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view all opportunities" ON opportunities FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view all quotes" ON quotes FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view assigned projects" ON projects
    FOR SELECT USING (
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can view project tasks" ON project_tasks
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Files visibility policy" ON project_files
    FOR SELECT USING (
        visibility IN ('client_review', 'final_deliverable') OR auth.uid() IS NOT NULL
    );

CREATE POLICY "Staff can view invoices" ON invoices FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view payments" ON payments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view feedbacks" ON feedbacks FOR ALL USING (auth.uid() IS NOT NULL);

-- 15. Seed Demonstration Company & Project
INSERT INTO companies (id, name, industry, email, phone)
VALUES ('c1111111-1111-1111-1111-111111111111', 'ABC Construction Ltd', 'Construction & Engineering', 'info@abcconstruction.com', '+260 971 112 233')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contacts (id, company_id, full_name, email, phone, role_title)
VALUES ('ct111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'John Banda', 'john@abcconstruction.com', '+260 971 112 233', 'Managing Director')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, project_number, name, company_id, contact_id, offering_slug, deal_value, status, progress_percentage, brief, due_date)
VALUES (
    'p1111111-1111-1111-1111-111111111111',
    'DH-2026-00421',
    'ABC Construction — 12-Page Company Profile',
    'c1111111-1111-1111-1111-111111111111',
    'ct111111-1111-1111-1111-111111111111',
    'company-profile',
    5000.00,
    'in_progress',
    65,
    'Create an authoritative, tender-ready 12-page company profile. Highlight past civil works, machinery fleet, HSE policy, and leadership team.',
    CURRENT_DATE + INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO project_tasks (project_id, title, description, status, due_date)
VALUES 
('p1111111-1111-1111-1111-111111111111', 'Information Intake & Copywriting', 'Draft copy for executive statement and equipment list.', 'completed', CURRENT_DATE - INTERVAL '2 days'),
('p1111111-1111-1111-1111-111111111111', 'Layout & Visual Styling', 'Design 12-page layout in InDesign following brand colors.', 'in_progress', CURRENT_DATE + INTERVAL '2 days'),
('p1111111-1111-1111-1111-111111111111', 'Internal PM Proof Review', 'Conduct internal QA check before sending to client.', 'todo', CURRENT_DATE + INTERVAL '4 days')
ON CONFLICT DO NOTHING;

INSERT INTO project_files (project_id, file_name, file_url, file_size, visibility, version)
VALUES
('p1111111-1111-1111-1111-111111111111', 'ABC-Logo-Vector.png', 'https://example.com/files/logo.png', '1.2 MB', 'working_file', 1),
('p1111111-1111-1111-1111-111111111111', 'Company-Profile-Proof-v1.pdf', 'https://example.com/files/proof-v1.pdf', '4.5 MB', 'client_review', 1)
ON CONFLICT DO NOTHING;
