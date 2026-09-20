-- ============================================================================
-- DESIGNHUB SOLUTIONS - MASTER DATABASE SCHEMA
-- ============================================================================
-- This is the canonical database schema for the Designhub Solutions system.
-- Run this SQL in Supabase SQL Editor to initialize a clean database.
--
-- Version: 1.0.0
-- Last Updated: 2026-09-20
-- ============================================================================

-- ============================================================================
-- SECTION 1: EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 2: HELPER FUNCTIONS
-- ============================================================================

-- Function to get current user role from profiles table
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is staff (any non-client role)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'sales_head', 'sales_rep', 'finance', 'marketing', 'support')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  invoice_num TEXT;
  year_part TEXT;
  month_part TEXT;
  sequence_num TEXT;
BEGIN
  year_part := EXTRACT(year FROM NOW())::TEXT;
  month_part := LPAD(EXTRACT(month FROM NOW())::TEXT, 2, '0');
  
  SELECT COALESCE(MAX(SUBSTRING(invoice_number FROM '[0-9]+$')), '0')::TEXT + 1
  INTO sequence_num
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || year_part || '-' || month_part || '-%';
  
  invoice_num := 'INV-' || year_part || '-' || month_part || '-' || LPAD(sequence_num, 4, '0');
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION public.auto_generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 3: AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'super_admin', 'sales_head', 'sales_rep', 'finance', 'marketing', 'support')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Trigger for updated_at on profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- ============================================================================
-- SECTION 4: LEAD MANAGEMENT
-- ============================================================================

-- Leads table (comprehensive lead tracking)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  value DECIMAL(10,2) DEFAULT 0,
  estimated_budget TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost')),
  assigned_to TEXT DEFAULT 'unassigned',
  notes TEXT,
  next_action TEXT DEFAULT 'Initial contact required',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Product catalog & solution vertical fields
  product_id TEXT,
  product_name TEXT,
  category_id TEXT,
  category_title TEXT,
  price_anchor TEXT,
  selected_addons TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Project consultation fields
  services JSONB DEFAULT '{}'::jsonb,
  timeline JSONB DEFAULT '{}'::jsonb,
  additional_notes TEXT,
  project_details JSONB DEFAULT '{}'::jsonb,
  
  -- Attribution fields
  offering_type TEXT CHECK (offering_type IN ('service', 'product', 'general')),
  offering_id UUID,
  offering_slug TEXT,
  landing_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_offering_slug ON public.leads(offering_slug);

-- ============================================================================
-- SECTION 5: PROJECT MANAGEMENT
-- ============================================================================

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'internal_review', 'client_review', 'revision_required', 'client_approved', 'completed', 'on_hold', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  brief TEXT,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relationships
  quote_id UUID,
  opportunity_id UUID,
  company_id UUID,
  contact_id UUID,
  offering_slug TEXT,
  deal_value DECIMAL(10,2) DEFAULT 0.00,
  pm_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Legacy compatibility
  service_request_id UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  budget DECIMAL(10,2),
  client TEXT
);

-- Trigger for updated_at on projects
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Project members table
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_in_project TEXT NOT NULL CHECK (role_in_project IN ('pm', 'sales', 'designer', 'developer', 'copywriter', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Project tasks table
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'internal_qa', 'client_review', 'completed')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project files table (with visibility tiers)
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT,
  visibility TEXT NOT NULL DEFAULT 'internal_only' CHECK (visibility IN ('internal_only', 'working_file', 'client_review', 'final_deliverable')),
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project revisions table (proof reviews)
CREATE TABLE IF NOT EXISTS public.project_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  proof_file_url TEXT NOT NULL,
  designer_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'revision_requested')),
  client_feedback TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy project milestones table (for compatibility)
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_pm_id ON public.projects(pm_id);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Indexes for project tasks
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned_to ON public.project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON public.project_tasks(status);

-- Indexes for project files
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_visibility ON public.project_files(visibility);

-- Indexes for project revisions
CREATE INDEX IF NOT EXISTS idx_project_revisions_project_id ON public.project_revisions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_revisions_status ON public.project_revisions(status);

-- Indexes for project members
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);

-- ============================================================================
-- SECTION 6: FINANCIAL MANAGEMENT
-- ============================================================================

-- Quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  company_id UUID,
  contact_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  terms TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at on quotes
CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Quote items table
CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  company_id UUID,
  contact_id UUID,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for auto-generating invoice numbers
CREATE TRIGGER invoices_auto_generate_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_invoice_number();

-- Trigger for updated_at on invoices
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'mobile_money' CHECK (payment_method IN ('mobile_money', 'card', 'bank_transfer', 'cash')),
  reference_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commissions table
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  deal_value DECIMAL(10,2) NOT NULL,
  client TEXT NOT NULL,
  date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  due_date DATE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  description TEXT,
  category TEXT,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for quotes
CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON public.quotes(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);

-- Indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoice_project_id ON public.invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoice_quote_id ON public.invoices(quote_id);
CREATE INDEX IF NOT EXISTS idx_invoice_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_number ON public.invoices(invoice_number);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference_number ON public.payments(reference_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Indexes for commissions
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON public.commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_date ON public.commissions(date);

-- Indexes for expenses
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- ============================================================================
-- SECTION 7: COMMUNICATION
-- ============================================================================

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  participant_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  file_url TEXT,
  file_name TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'quote', 'invoice', 'project', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy file attachments table (for compatibility)
CREATE TABLE IF NOT EXISTS public.file_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON public.conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON public.conversations(participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON public.conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_time ON public.conversations(last_message_time DESC);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Indexes for file_attachments
CREATE INDEX IF NOT EXISTS idx_file_attachments_user_id ON public.file_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_project_id ON public.file_attachments(project_id);

-- ============================================================================
-- SECTION 8: SUPPORT
-- ============================================================================

-- Support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  customer TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('technical', 'billing', 'general', 'feature_request', 'bug_report')),
  assigned_to TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5)
);

-- Trigger for updated_at on support_tickets
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_number ON public.support_tickets(ticket_number);

-- ============================================================================
-- SECTION 9: MARKETING
-- ============================================================================

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('email', 'social', 'ppc', 'content', 'seo')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  budget DECIMAL(10,2),
  revenue DECIMAL(10,2) DEFAULT 0,
  leads INTEGER DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON public.campaigns(type);

-- ============================================================================
-- SECTION 10: OFFERINGS (Services & Products)
-- ============================================================================

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'digital',
  short_description TEXT NOT NULL,
  full_description TEXT,
  price DECIMAL(10,2),
  price_type TEXT NOT NULL DEFAULT 'starting_at' CHECK (price_type IN ('fixed', 'starting_at', 'range', 'custom')),
  pricing_details TEXT,
  turnaround_time TEXT DEFAULT '5-7 business days',
  intake_status TEXT DEFAULT 'Open for Intake' CHECK (intake_status IN ('Open for Intake', 'Limited Slots', 'Waitlist Only')),
  hero_headline TEXT,
  hero_subheadline TEXT,
  problem_statement TEXT,
  solution_statement TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  process JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT DEFAULT 'Express Interest',
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at on services
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'branding',
  short_description TEXT NOT NULL,
  full_description TEXT,
  price DECIMAL(10,2),
  price_type TEXT NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'starting_at', 'range', 'custom')),
  pricing_details TEXT,
  turnaround_time TEXT DEFAULT '3-5 business days',
  intake_status TEXT DEFAULT 'In Stock & Ready' CHECK (intake_status IN ('In Stock & Ready', 'Pre-Order', 'Limited Stock')),
  hero_headline TEXT,
  hero_subheadline TEXT,
  problem_statement TEXT,
  solution_statement TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  process JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT DEFAULT 'Order / Express Interest',
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at on products
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Service inquiries table (landing page submissions)
CREATE TABLE IF NOT EXISTS public.service_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  service_category TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('Standard', 'Subscription', 'Bundle')),
  service_title TEXT NOT NULL,
  service_price TEXT NOT NULL,
  selected_addons TEXT[] DEFAULT '{}',
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  business_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Indexes for services
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Indexes for service_inquiries
CREATE INDEX IF NOT EXISTS idx_service_inquiries_status_created_at ON public.service_inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_service_title ON public.service_inquiries(service_title);

-- ============================================================================
-- SECTION 11: ERP (Companies, Contacts, Opportunities)
-- ============================================================================

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
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

-- Trigger for updated_at on companies
CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  service_id UUID,
  product_id UUID,
  offering_slug TEXT,
  deal_value DECIMAL(10,2) DEFAULT 0.00,
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost')),
  assigned_sales_rep TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at on opportunities
CREATE TRIGGER opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Feedbacks table
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  would_recommend BOOLEAN DEFAULT true,
  testimonial TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for companies
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);

-- Indexes for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- Indexes for opportunities
CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON public.opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_contact_id ON public.opportunities(contact_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_lead_id ON public.opportunities(lead_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);

-- Indexes for feedbacks
CREATE INDEX IF NOT EXISTS idx_feedbacks_project_id ON public.feedbacks(project_id);

-- ============================================================================
-- SECTION 12: LEGACY/COMPATIBILITY TABLES
-- ============================================================================

-- Service requests table (legacy, for compatibility)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at on service_requests
CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for service_requests
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);

-- ============================================================================
-- SECTION 13: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 14: RLS POLICIES
-- ============================================================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Leads policies
CREATE POLICY "Staff can view all leads" ON public.leads
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can insert leads" ON public.leads
  FOR INSERT WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update leads" ON public.leads
  FOR UPDATE USING (public.is_staff());

CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (user_id = auth.uid());

-- Projects policies
CREATE POLICY "Staff can view all projects" ON public.projects
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update projects" ON public.projects
  FOR UPDATE USING (public.is_staff());

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = public.projects.id AND pm.user_id = auth.uid()
    )
  );

-- Project members policies
CREATE POLICY "Staff can view project members" ON public.project_members
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage project members" ON public.project_members
  FOR ALL USING (public.is_staff());

-- Project tasks policies
CREATE POLICY "Staff can view project tasks" ON public.project_tasks
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage project tasks" ON public.project_tasks
  FOR ALL USING (public.is_staff());

-- Project files policies
CREATE POLICY "Staff can view project files" ON public.project_files
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage project files" ON public.project_files
  FOR ALL USING (public.is_staff());

CREATE POLICY "Users can view project files if member" ON public.project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = public.project_files.project_id AND pm.user_id = auth.uid()
    ) OR visibility IN ('client_review', 'final_deliverable')
  );

-- Project revisions policies
CREATE POLICY "Staff can view project revisions" ON public.project_revisions
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage project revisions" ON public.project_revisions
  FOR ALL USING (public.is_staff());

-- Project milestones policies
CREATE POLICY "Staff can view project milestones" ON public.project_milestones
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage project milestones" ON public.project_milestones
  FOR ALL USING (public.is_staff());

-- Quotes policies
CREATE POLICY "Staff can view quotes" ON public.quotes
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage quotes" ON public.quotes
  FOR ALL USING (public.is_staff());

CREATE POLICY "Users can view own quotes" ON public.quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = public.quotes.project_id AND pm.user_id = auth.uid()
    )
  );

-- Quote items policies
CREATE POLICY "Staff can view quote items" ON public.quote_items
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage quote items" ON public.quote_items
  FOR ALL USING (public.is_staff());

-- Invoices policies
CREATE POLICY "Staff can view invoices" ON public.invoices
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage invoices" ON public.invoices
  FOR ALL USING (public.is_staff());

CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = public.invoices.project_id AND pm.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Staff can view payments" ON public.payments
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage payments" ON public.payments
  FOR ALL USING (public.is_staff());

-- Commissions policies
CREATE POLICY "Staff can view commissions" ON public.commissions
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage commissions" ON public.commissions
  FOR ALL USING (public.is_staff());

CREATE POLICY "Users can view own commissions" ON public.commissions
  FOR SELECT USING (user_id = auth.uid());

-- Expenses policies
CREATE POLICY "Staff can view expenses" ON public.expenses
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage expenses" ON public.expenses
  FOR ALL USING (public.is_staff());

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (participant_1_id = auth.uid() OR participant_2_id = auth.uid());

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (participant_1_id = auth.uid() OR participant_2_id = auth.uid());

CREATE POLICY "Staff can view all conversations" ON public.conversations
  FOR SELECT USING (public.is_staff());

-- Messages policies
CREATE POLICY "Users can view conversation messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = public.messages.conversation_id
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = public.messages.conversation_id
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Staff can view all messages" ON public.messages
  FOR SELECT USING (public.is_staff());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- File attachments policies
CREATE POLICY "Users can view own files" ON public.file_attachments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can upload files" ON public.file_attachments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can view all files" ON public.file_attachments
  FOR SELECT USING (public.is_staff());

-- Support tickets policies
CREATE POLICY "Staff can view support tickets" ON public.support_tickets
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage support tickets" ON public.support_tickets
  FOR ALL USING (public.is_staff());

-- Campaigns policies
CREATE POLICY "Staff can view campaigns" ON public.campaigns
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Marketing can manage campaigns" ON public.campaigns
  FOR ALL USING (public.has_role('marketing') OR public.is_admin());

-- Services policies (public read, admin manage)
CREATE POLICY "Public can view published services" ON public.services
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.is_admin());

-- Products policies (public read, admin manage)
CREATE POLICY "Public can view published products" ON public.products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.is_admin());

-- Service inquiries policies (public insert, staff view)
CREATE POLICY "Anonymous can insert service inquiries" ON public.service_inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can view service inquiries" ON public.service_inquiries
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Staff can update service inquiries" ON public.service_inquiries
  FOR UPDATE TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Companies policies
CREATE POLICY "Staff can view companies" ON public.companies
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage companies" ON public.companies
  FOR ALL USING (public.is_staff());

-- Contacts policies
CREATE POLICY "Staff can view contacts" ON public.contacts
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage contacts" ON public.contacts
  FOR ALL USING (public.is_staff());

-- Opportunities policies
CREATE POLICY "Staff can view opportunities" ON public.opportunities
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff can manage opportunities" ON public.opportunities
  FOR ALL USING (public.is_staff());

-- Feedbacks policies
CREATE POLICY "Staff can view feedbacks" ON public.feedbacks
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Users can create feedbacks" ON public.feedbacks
  FOR INSERT WITH CHECK (client_id = auth.uid());

-- Service requests policies (legacy)
CREATE POLICY "Users can view own service requests" ON public.service_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create service requests" ON public.service_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own service requests" ON public.service_requests
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Staff can view all service requests" ON public.service_requests
  FOR SELECT USING (public.is_staff());

-- ============================================================================
-- SECTION 15: VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT 
  'VERIFICATION' as step,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'leads', 'projects', 'invoices', 'service_inquiries')
ORDER BY table_name, ordinal_position;

-- Verify RLS is enabled
SELECT 
  'RLS_STATUS' as step,
  table_name,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND table_name IN ('profiles', 'leads', 'projects', 'invoices', 'service_inquiries')
ORDER BY table_name;

-- Verify indexes
SELECT 
  'INDEXES' as step,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'leads', 'projects', 'invoices', 'service_inquiries')
ORDER BY tablename, indexname;

-- Success message
SELECT 'MASTER_SCHEMA_COMPLETE' as status, 
       'All tables, indexes, functions, triggers, and RLS policies created successfully' as message;
