-- AUDIT AND FIX SCRIPT - Complete Supabase Setup
-- Run this in Supabase SQL Editor to fix all inconsistencies

-- =====================================================
-- 1. FIX USERS TABLE SCHEMA INCONSISTENCIES
-- =====================================================

-- Drop and recreate users table with correct schema
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('super_admin', 'admin', 'sales_head', 'sales_rep', 'client')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  avatar_url TEXT
);

-- =====================================================
-- 2. CREATE ALL REQUIRED TABLES
-- =====================================================

-- Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  budget DECIMAL(10,2),
  client_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  client_id TEXT,
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT
);

-- Project Milestones Table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE,
  client_name TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'draft',
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT
);

-- Quote Items Table
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT,
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  total DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE,
  client_name TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'draft',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT
);

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations Participants Table
CREATE TABLE IF NOT EXISTS conversations_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id UUID,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR ALL USING (auth.role() IS NOT NULL);

-- Service requests policies
CREATE POLICY "Service requests are viewable by all users" ON service_requests FOR ALL USING (auth.role() IS NOT NULL);

-- Projects policies
CREATE POLICY "Projects are viewable by all users" ON projects FOR ALL USING (auth.role() IS NOT NULL);

-- Quotes policies
CREATE POLICY "Quotes are viewable by all users" ON quotes FOR ALL USING (auth.role() IS NOT NULL);

-- Invoices policies
CREATE POLICY "Invoices are viewable by all users" ON invoices FOR ALL USING (auth.role() IS NOT NULL);

-- Conversations policies
CREATE POLICY "Conversations are viewable by all users" ON conversations FOR ALL USING (auth.role() IS NOT NULL);

-- Messages policies
CREATE POLICY "Messages are viewable by all users" ON messages FOR ALL USING (auth.role() IS NOT NULL);

-- Profiles policies
CREATE POLICY "Profiles are viewable by all users" ON profiles FOR ALL USING (auth.role() IS NOT NULL);

-- =====================================================
-- 5. INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample data for the current user
INSERT INTO service_requests (id, title, description, service_type, status, budget, client_id, user_id, created_at) VALUES
  ('550e8400-5e6b-4e8a-9c8a-1f2a3b4c5d6', 'Website Development Project', 'Complete website development with e-commerce functionality', 'web_development', 'pending', 15000, 'client1', '9e698f5b-deb3-48ed-b3e9-65df692e25d1', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, name, description, service_type, status, client_id, budget, start_date, end_date, user_id, created_at) VALUES
  ('7a8b9c0d-1e2d-4f3a-8c9d-2e3f4a5b6c7d', 'Company Website', 'Corporate website with advanced features and e-commerce', 'web_development', 'in_progress', 'client1', 15000, '2024-01-15', '2024-03-15', '9e698f5b-deb3-48ed-b3e9-65df692e25d1', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO quotes (id, quote_number, client_name, project_id, total_amount, status, user_id, created_at) VALUES
  ('8b9c0d1e-2f3d-4a8b-9d0e-3f4a5b6c7d8e', 'QUOTE-2024-001', 'Client Company', '7a8b9c0d-1e2d-4f3a-8c9d-2e3f4a5b6c7d', 15000, 'draft', '9e698f5b-deb3-48ed-b3e9-65df692e25d1', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (id, invoice_number, client_name, project_id, total_amount, status, due_date, user_id, created_at) VALUES
  ('9c0d1e2f-3f4a-4b8b-9d0e-4f5a6b7c8d9f', 'INV-2024-001', 'Client Company', '7a8b9c0d-1e2d-4f3a-8c9d-2e3f4a5b6c7d', 15000, 'draft', '2024-02-15', '9e698f5b-deb3-48ed-b3e9-65df692e25d1', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO conversations (id, title, created_at, updated_at, last_message_time) VALUES
  ('a0d1e2f3-4f5a-6b7c-8d9e-0f4a5b6c7d8e', 'Project Discussion', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO conversations_participants (id, conversation_id, profile_id, joined_at) VALUES
  ('b1e2f3f4-5a6b-7c7c-8d9e-0f4a5b6c7d8e', 'a0d1e2f3-4f5a-6b7c-8d9e-0f4a5b6c7d8e', '9e698f5b-deb3-48ed-b3e9-65df692e25d1', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, user_id, full_name, created_at) VALUES
  ('d3f4a5b6-5a6b-7c7c-8d9e-0f4a5b6c7d8e', '9e698f5b-deb3-48ed-b3e9-65df692e25d1', 'Super Admin', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, content, sender_id, created_at) VALUES
  ('f5b6c7d8-5a6b-7c7c-8d9e-0f4a5b6c7d8e', 'a0d1e2f3-4f5a-6b7c-8d9e-0f4a5b6c7d8e', 'Hello! Let''s discuss your project requirements in detail.', 'd3f4a5b6-5a6b-7c7c-8d9e-0f4a5b6c7d8e', NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);

-- =====================================================
-- 7. AUDIT CHECKS
-- =====================================================

-- Check if all tables exist
SELECT 'TABLES' as check_type, table_name as item, 'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'service_requests', 'projects', 'quotes', 'invoices', 'conversations', 'messages', 'profiles')
ORDER BY table_name;

-- Check if sample data exists
SELECT 'SAMPLE_DATA' as check_type, 
       'service_requests' as table_name, 
       COUNT(*) as count
FROM service_requests
UNION ALL
SELECT 'SAMPLE_DATA' as check_type, 
       'projects' as table_name, 
       COUNT(*) as count
FROM projects
UNION ALL
SELECT 'SAMPLE_DATA' as check_type, 
       'quotes' as table_name, 
       COUNT(*) as count
FROM quotes
UNION ALL
SELECT 'SAMPLE_DATA' as check_type, 
       'invoices' as table_name, 
       COUNT(*) as count
FROM invoices;

-- Success message
SELECT 'AUDIT_COMPLETE' as status, 'All tables created and sample data inserted' as message;
