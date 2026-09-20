// Auto-generated database types from MASTER_DATABASE_SCHEMA.sql
// This file defines TypeScript interfaces matching the database schema
// To regenerate: npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'super_admin' | 'admin' | 'sales_head' | 'finance' | 'marketing' | 'support' | 'sales_rep' | 'client'
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'sales_head' | 'finance' | 'marketing' | 'support' | 'sales_rep' | 'client'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'sales_head' | 'finance' | 'marketing' | 'support' | 'sales_rep' | 'client'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource: string | null
          timestamp: string
          ip_address: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource?: string | null
          timestamp?: string
          ip_address?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource?: string | null
          timestamp?: string
          ip_address?: string | null
          metadata?: Json
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          value: number
          estimated_budget: string | null
          status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost'
          assigned_to: string
          notes: string | null
          next_action: string
          created_at: string
          last_contact: string
          product_id: string | null
          product_name: string | null
          category_id: string | null
          category_title: string | null
          price_anchor: string | null
          selected_addons: string[]
          user_id: string | null
          client_id: string | null
          services: Json
          timeline: Json
          additional_notes: string | null
          project_details: Json
          offering_type: 'service' | 'product' | 'general' | null
          offering_id: string | null
          offering_slug: string | null
          landing_page: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          value?: number
          estimated_budget?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost'
          assigned_to?: string
          notes?: string | null
          next_action?: string
          created_at?: string
          last_contact?: string
          product_id?: string | null
          product_name?: string | null
          category_id?: string | null
          category_title?: string | null
          price_anchor?: string | null
          selected_addons?: string[]
          user_id?: string | null
          client_id?: string | null
          services?: Json
          timeline?: Json
          additional_notes?: string | null
          project_details?: Json
          offering_type?: 'service' | 'product' | 'general' | null
          offering_id?: string | null
          offering_slug?: string | null
          landing_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          value?: number
          estimated_budget?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost'
          assigned_to?: string
          notes?: string | null
          next_action?: string
          created_at?: string
          last_contact?: string
          product_id?: string | null
          product_name?: string | null
          category_id?: string | null
          category_title?: string | null
          price_anchor?: string | null
          selected_addons?: string[]
          user_id?: string | null
          client_id?: string | null
          services?: Json
          timeline?: Json
          additional_notes?: string | null
          project_details?: Json
          offering_type?: 'service' | 'product' | 'general' | null
          offering_id?: string | null
          offering_slug?: string | null
          landing_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          project_number: string
          name: string
          description: string | null
          status: 'planning' | 'in_progress' | 'internal_review' | 'client_review' | 'revision_required' | 'client_approved' | 'completed' | 'on_hold' | 'cancelled'
          progress_percentage: number
          brief: string | null
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
          quote_id: string | null
          opportunity_id: string | null
          company_id: string | null
          contact_id: string | null
          offering_slug: string | null
          deal_value: number
          pm_id: string | null
          service_request_id: string | null
          start_date: string | null
          end_date: string | null
          budget: number | null
          client: string | null
        }
        Insert: {
          id?: string
          project_number: string
          name: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'internal_review' | 'client_review' | 'revision_required' | 'client_approved' | 'completed' | 'on_hold' | 'cancelled'
          progress_percentage?: number
          brief?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          quote_id?: string | null
          opportunity_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          offering_slug?: string | null
          deal_value?: number
          pm_id?: string | null
          service_request_id?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          client?: string | null
        }
        Update: {
          id?: string
          project_number?: string
          name?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'internal_review' | 'client_review' | 'revision_required' | 'client_approved' | 'completed' | 'on_hold' | 'cancelled'
          progress_percentage?: number
          brief?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          quote_id?: string | null
          opportunity_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          offering_slug?: string | null
          deal_value?: number
          pm_id?: string | null
          service_request_id?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          client?: string | null
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role_in_project: 'pm' | 'sales' | 'designer' | 'developer' | 'copywriter' | 'client'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role_in_project: 'pm' | 'sales' | 'designer' | 'developer' | 'copywriter' | 'client'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role_in_project?: 'pm' | 'sales' | 'designer' | 'developer' | 'copywriter' | 'client'
          created_at?: string
        }
      }
      project_tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          assigned_to: string | null
          status: 'todo' | 'in_progress' | 'internal_qa' | 'client_review' | 'completed'
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          assigned_to?: string | null
          status?: 'todo' | 'in_progress' | 'internal_qa' | 'client_review' | 'completed'
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          assigned_to?: string | null
          status?: 'todo' | 'in_progress' | 'internal_qa' | 'client_review' | 'completed'
          due_date?: string | null
          created_at?: string
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_url: string
          file_size: string | null
          visibility: 'internal_only' | 'working_file' | 'client_review' | 'final_deliverable'
          uploaded_by: string | null
          version: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name: string
          file_url: string
          file_size?: string | null
          visibility?: 'internal_only' | 'working_file' | 'client_review' | 'final_deliverable'
          uploaded_by?: string | null
          version?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_name?: string
          file_url?: string
          file_size?: string | null
          visibility?: 'internal_only' | 'working_file' | 'client_review' | 'final_deliverable'
          uploaded_by?: string | null
          version?: number
          created_at?: string
        }
      }
      project_revisions: {
        Row: {
          id: string
          project_id: string
          version_number: number
          proof_file_url: string
          designer_notes: string | null
          status: 'pending_review' | 'approved' | 'revision_requested'
          client_feedback: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          version_number: number
          proof_file_url: string
          designer_notes?: string | null
          status?: 'pending_review' | 'approved' | 'revision_requested'
          client_feedback?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          version_number?: number
          proof_file_url?: string
          designer_notes?: string | null
          status?: 'pending_review' | 'approved' | 'revision_requested'
          client_feedback?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      project_milestones: {
        Row: {
          id: string
          project_id: string | null
          title: string
          description: string | null
          due_date: string | null
          status: 'pending' | 'in_progress' | 'completed'
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          completed_at?: string | null
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          quote_number: string
          project_id: string | null
          company_id: string | null
          contact_id: string | null
          title: string
          description: string | null
          amount: number
          terms: string | null
          status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          accepted_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number: string
          project_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          title: string
          description?: string | null
          amount: number
          terms?: string | null
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          accepted_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_number?: string
          project_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          title?: string
          description?: string | null
          amount?: number
          terms?: string | null
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          accepted_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          name: string
          description: string | null
          quantity: number
          unit_price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          name: string
          description?: string | null
          quantity?: number
          unit_price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          name?: string
          description?: string | null
          quantity?: number
          unit_price?: number
          total?: number
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          project_id: string | null
          company_id: string | null
          contact_id: string | null
          quote_id: string | null
          amount: number
          tax: number
          total_amount: number
          status: 'draft' | 'sent' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'
          due_date: string | null
          paid_at: string | null
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number?: string
          project_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          quote_id?: string | null
          amount: number
          tax?: number
          total_amount: number
          status?: 'draft' | 'sent' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          paid_at?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          project_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          quote_id?: string | null
          amount?: number
          tax?: number
          total_amount?: number
          status?: 'draft' | 'sent' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          paid_at?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string
          amount: number
          payment_method: 'mobile_money' | 'card' | 'bank_transfer' | 'cash'
          reference_number: string
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          amount: number
          payment_method?: 'mobile_money' | 'card' | 'bank_transfer' | 'cash'
          reference_number: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          amount?: number
          payment_method?: 'mobile_money' | 'card' | 'bank_transfer' | 'cash'
          reference_number?: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
      }
      commissions: {
        Row: {
          id: string
          amount: number
          deal_value: number
          client: string
          date: string | null
          status: 'pending' | 'paid'
          due_date: string | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          amount: number
          deal_value: number
          client: string
          date?: string | null
          status?: 'pending' | 'paid'
          due_date?: string | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          amount?: number
          deal_value?: number
          client?: string
          date?: string | null
          status?: 'pending' | 'paid'
          due_date?: string | null
          user_id?: string | null
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          amount: number
          status: 'pending' | 'approved' | 'rejected'
          description: string | null
          category: string | null
          approved_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          amount: number
          status?: 'pending' | 'approved' | 'rejected'
          description?: string | null
          category?: string | null
          approved_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          amount?: number
          status?: 'pending' | 'approved' | 'rejected'
          description?: string | null
          category?: string | null
          approved_by?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          project_id: string | null
          participant_1_id: string
          participant_2_id: string
          last_message: string | null
          last_message_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          participant_1_id: string
          participant_2_id: string
          last_message?: string | null
          last_message_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          participant_1_id?: string
          participant_2_id?: string
          last_message?: string | null
          last_message_time?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          type: string
          file_url: string | null
          file_name: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          type?: string
          file_url?: string | null
          file_name?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          type?: string
          file_url?: string | null
          file_name?: string | null
          status?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'message' | 'quote' | 'invoice' | 'project' | 'system'
          title: string
          message: string
          sender_id: string | null
          read: boolean
          action_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'message' | 'quote' | 'invoice' | 'project' | 'system'
          title: string
          message: string
          sender_id?: string | null
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'message' | 'quote' | 'invoice' | 'project' | 'system'
          title?: string
          message?: string
          sender_id?: string | null
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      file_attachments: {
        Row: {
          id: string
          user_id: string | null
          project_id: string | null
          conversation_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          project_id?: string | null
          conversation_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          project_id?: string | null
          conversation_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          subject: string
          customer: string
          customer_email: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
          category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report'
          assigned_to: string
          description: string | null
          created_at: string
          updated_at: string
          due_date: string | null
          customer_rating: number | null
        }
        Insert: {
          id?: string
          ticket_number: string
          subject: string
          customer: string
          customer_email: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
          category?: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report'
          assigned_to?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          due_date?: string | null
          customer_rating?: number | null
        }
        Update: {
          id?: string
          ticket_number?: string
          subject?: string
          customer?: string
          customer_email?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
          category?: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report'
          assigned_to?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          due_date?: string | null
          customer_rating?: number | null
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          type: 'email' | 'social' | 'ppc' | 'content' | 'seo' | null
          description: string | null
          status: 'draft' | 'active' | 'paused' | 'completed'
          budget: number | null
          revenue: number
          leads: number
          spent: number
          conversions: number
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: 'email' | 'social' | 'ppc' | 'content' | 'seo' | null
          description?: string | null
          status?: 'draft' | 'active' | 'paused' | 'completed'
          budget?: number | null
          revenue?: number
          leads?: number
          spent?: number
          conversions?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'email' | 'social' | 'ppc' | 'content' | 'seo' | null
          description?: string | null
          status?: 'draft' | 'active' | 'paused' | 'completed'
          budget?: number | null
          revenue?: number
          leads?: number
          spent?: number
          conversions?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          short_description: string
          full_description: string | null
          price: number | null
          price_type: 'fixed' | 'starting_at' | 'range' | 'custom'
          pricing_details: string | null
          turnaround_time: string
          intake_status: 'Open for Intake' | 'Limited Slots' | 'Waitlist Only'
          hero_headline: string | null
          hero_subheadline: string | null
          problem_statement: string | null
          solution_statement: string | null
          benefits: Json
          features: Json
          process: Json
          faqs: Json
          images: Json
          cta_text: string
          seo_title: string | null
          seo_description: string | null
          status: 'draft' | 'published' | 'archived'
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category?: string
          short_description: string
          full_description?: string | null
          price?: number | null
          price_type?: 'fixed' | 'starting_at' | 'range' | 'custom'
          pricing_details?: string | null
          turnaround_time?: string
          intake_status?: 'Open for Intake' | 'Limited Slots' | 'Waitlist Only'
          hero_headline?: string | null
          hero_subheadline?: string | null
          problem_statement?: string | null
          solution_statement?: string | null
          benefits?: Json
          features?: Json
          process?: Json
          faqs?: Json
          images?: Json
          cta_text?: string
          seo_title?: string | null
          seo_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string
          short_description?: string
          full_description?: string | null
          price?: number | null
          price_type?: 'fixed' | 'starting_at' | 'range' | 'custom'
          pricing_details?: string | null
          turnaround_time?: string
          intake_status?: 'Open for Intake' | 'Limited Slots' | 'Waitlist Only'
          hero_headline?: string | null
          hero_subheadline?: string | null
          problem_statement?: string | null
          solution_statement?: string | null
          benefits?: Json
          features?: Json
          process?: Json
          faqs?: Json
          images?: Json
          cta_text?: string
          seo_title?: string | null
          seo_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          short_description: string
          full_description: string | null
          price: number | null
          price_type: 'fixed' | 'starting_at' | 'range' | 'custom'
          pricing_details: string | null
          turnaround_time: string
          intake_status: 'In Stock & Ready' | 'Pre-Order' | 'Limited Stock'
          hero_headline: string | null
          hero_subheadline: string | null
          problem_statement: string | null
          solution_statement: string | null
          benefits: Json
          features: Json
          process: Json
          faqs: Json
          images: Json
          cta_text: string
          seo_title: string | null
          seo_description: string | null
          status: 'draft' | 'published' | 'archived'
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category?: string
          short_description: string
          full_description?: string | null
          price?: number | null
          price_type?: 'fixed' | 'starting_at' | 'range' | 'custom'
          pricing_details?: string | null
          turnaround_time?: string
          intake_status?: 'In Stock & Ready' | 'Pre-Order' | 'Limited Stock'
          hero_headline?: string | null
          hero_subheadline?: string | null
          problem_statement?: string | null
          solution_statement?: string | null
          benefits?: Json
          features?: Json
          process?: Json
          faqs?: Json
          images?: Json
          cta_text?: string
          seo_title?: string | null
          seo_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string
          short_description?: string
          full_description?: string | null
          price?: number | null
          price_type?: 'fixed' | 'starting_at' | 'range' | 'custom'
          pricing_details?: string | null
          turnaround_time?: string
          intake_status?: 'In Stock & Ready' | 'Pre-Order' | 'Limited Stock'
          hero_headline?: string | null
          hero_subheadline?: string | null
          problem_statement?: string | null
          solution_statement?: string | null
          benefits?: Json
          features?: Json
          process?: Json
          faqs?: Json
          images?: Json
          cta_text?: string
          seo_title?: string | null
          seo_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      service_inquiries: {
        Row: {
          id: string
          created_at: string
          service_category: string
          service_type: 'Standard' | 'Subscription' | 'Bundle'
          service_title: string
          service_price: string
          selected_addons: string[]
          client_name: string
          client_phone: string
          client_email: string | null
          business_name: string | null
          message: string | null
          status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
          source_page: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          service_category: string
          service_type: 'Standard' | 'Subscription' | 'Bundle'
          service_title: string
          service_price: string
          selected_addons?: string[]
          client_name: string
          client_phone: string
          client_email?: string | null
          business_name?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
          source_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          service_category?: string
          service_type?: 'Standard' | 'Subscription' | 'Bundle'
          service_title?: string
          service_price?: string
          selected_addons?: string[]
          client_name?: string
          client_phone?: string
          client_email?: string | null
          business_name?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
          source_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          website: string | null
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          company_id: string | null
          full_name: string
          email: string
          phone: string | null
          role_title: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          role_title?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          role_title?: string | null
          created_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          title: string
          company_id: string | null
          contact_id: string | null
          lead_id: string | null
          service_id: string | null
          product_id: string | null
          offering_slug: string | null
          deal_value: number
          stage: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost'
          assigned_sales_rep: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company_id?: string | null
          contact_id?: string | null
          lead_id?: string | null
          service_id?: string | null
          product_id?: string | null
          offering_slug?: string | null
          deal_value?: number
          stage?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost'
          assigned_sales_rep?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company_id?: string | null
          contact_id?: string | null
          lead_id?: string | null
          service_id?: string | null
          product_id?: string | null
          offering_slug?: string | null
          deal_value?: number
          stage?: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost'
          assigned_sales_rep?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedbacks: {
        Row: {
          id: string
          project_id: string | null
          client_id: string | null
          rating: number | null
          comments: string | null
          would_recommend: boolean
          testimonial: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          client_id?: string | null
          rating?: number | null
          comments?: string | null
          would_recommend?: boolean
          testimonial?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          client_id?: string | null
          rating?: number | null
          comments?: string | null
          would_recommend?: boolean
          testimonial?: string | null
          created_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          user_id: string | null
          service_type: string
          description: string
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          service_type: string
          description: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          service_type?: string
          description?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
