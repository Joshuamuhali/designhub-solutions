import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

// Types for dashboard data
export interface User {
  id: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalProjects: number;
  pendingApprovals: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  user?: User;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  performance: number;
  projects_completed: number;
  targets: {
    monthly: number;
    achieved: number;
  };
  leads: {
    total: number;
    converted: number;
    pending: number;
  };
  commission: number;
}

export interface DepartmentStats {
  totalTeamMembers: number;
  activeProjects: number;
  completedProjects: number;
  revenue: number;
  pendingApprovals: number;
  avgPerformance: number;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  targets: {
    monthly: number;
    achieved: number;
  };
  leads: {
    total: number;
    converted: number;
    pending: number;
  };
  commission: number;
  performance: number;
}

export interface SalesMetrics {
  totalRevenue: number;
  targetRevenue: number;
  totalLeads: number;
  convertedLeads: number;
  pendingLeads: number;
  teamSize: number;
  avgPerformance: number;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  value?: number;
  estimatedBudget?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost';
  assigned_to: string;
  created_at: string;
  last_contact: string;
  notes?: string;
  next_action: string;
  // Product catalog & solution vertical fields
  productId?: string;
  productName?: string;
  categoryId?: string;
  categoryTitle?: string;
  priceAnchor?: string;
  selectedAddons?: string[];
  user_id?: string;
  client_id?: string;
  // Project consultation fields
  services?: {
    webDesign?: boolean;
    digitalMarketing?: boolean;
    branding?: boolean;
    videoProduction?: boolean;
    salesLeadGen?: boolean;
    strategyConsulting?: boolean;
  };
  timeline?: {
    desiredStartDate?: string;
    estimatedBudget?: string;
    urgency?: string;
  };
  additionalNotes?: string;
  projectDetails?: {
    webDesign?: any;
    digitalMarketing?: any;
    branding?: any;
    videoProduction?: any;
    salesLeadGen?: any;
    strategyConsulting?: any;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  lead_id?: string;
}

export interface Commission {
  id: string;
  amount: number;
  deal_value: number;
  client: string;
  date: string;
  status: 'pending' | 'paid';
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalInvoices: number;
  cashFlow: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  created_at: string;
  paid_date?: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  approved_by?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  reference?: string;
}

export interface CampaignMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeads: number;
  conversionRate: number;
  totalSpent: number;
  totalRevenue: number;
  roi: number;
  avgEngagement: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'content' | 'seo';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  revenue: number;
  start_date: string;
  end_date?: string;
  description: string;
}

export interface LeadSource {
  source: string;
  leads: number;
  cost_per_lead: number;
  conversion_rate: number;
  revenue: number;
}

export interface Content {
  id: string;
  title: string;
  type: 'blog' | 'video' | 'infographic' | 'social' | 'email';
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  engagement: number;
  leads_generated: number;
  published_date: string;
}

export interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  ticketsToday: number;
  escalatedTickets: number;
}

export interface PersonalMetrics {
  monthlyTarget: number;
  achieved: number;
  commission: number;
  leadsAssigned: number;
  leadsConverted: number;
  pendingTasks: number;
  performance: number;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  customer: string;
  customer_email: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  description: string;
  customer_rating?: number;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'busy';
  tickets_assigned: number;
  tickets_resolved: number;
  avg_response_time: number;
  customer_rating: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  total_tickets: number;
  open_tickets: number;
  satisfaction_score: number;
  last_contact: string;
}

// SuperAdmin Dashboard API calls
export const getSystemStats = async (): Promise<SystemStats> => {
  try {
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, status, created_at')
      .eq('status', 'active');

    if (usersError) throw usersError;

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, status, created_at');

    if (projectsError) throw projectsError;

    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('id, status, amount, created_at')
      .eq('status', 'paid');

    if (invoicesError) throw invoicesError;

    const totalRevenue = invoices?.reduce((sum, inv) => sum + ((inv as any)?.amount || 0), 0) || 0;
    const activeProjects = projects?.filter((p: any) => p.status === 'in_progress').length || 0;

    return {
      totalUsers: users?.length || 0,
      activeUsers: users?.length || 0,
      totalRevenue,
      totalProjects: projects?.length || 0,
      pendingApprovals: 0, // TODO: Implement approvals table
      systemHealth: 'healthy'
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        profiles!inner(
          email,
          full_name
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// Admin Dashboard API calls
export const getDepartmentStats = async (departmentId: string): Promise<DepartmentStats> => {
  try {
    // TODO: Implement department-specific stats
    return {
      totalTeamMembers: 0,
      activeProjects: 0,
      completedProjects: 0,
      revenue: 0,
      pendingApprovals: 0,
      avgPerformance: 0
    };
  } catch (error) {
    console.error('Error fetching department stats:', error);
    throw error;
  }
};

export const getTeamMembers = async (departmentId: string): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

// Sales Dashboard API calls
export const getSalesMetrics = async (teamId?: string): Promise<SalesMetrics> => {
  try {
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('status', 'closed-won');

    if (dealsError) throw dealsError;

    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*');

    if (leadsError) throw leadsError;

    const totalRevenue = deals?.reduce((sum, deal) => sum + ((deal as any)?.value || 0), 0) || 0;
    const convertedLeads = leads?.filter((lead: any) => lead.status === 'closed-won').length || 0;

    return {
      totalRevenue,
      targetRevenue: 0, // TODO: Implement targets
      totalLeads: leads?.length || 0,
      convertedLeads,
      pendingLeads: leads?.filter((lead: any) => lead.status === 'new' || (lead as any).status === 'contacted').length || 0,
      teamSize: 0, // TODO: Get team size
      avgPerformance: 0 // TODO: Calculate performance
    };
  } catch (error) {
    console.error('Error fetching sales metrics:', error);
    throw error;
  }
};

export const getSalesTeam = async (teamId?: string): Promise<SalesRep[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'sales_rep')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sales team:', error);
    throw error;
  }
};

export const getLeads = async (assignedTo?: string): Promise<Lead[]> => {
  try {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const getTasks = async (assignedTo?: string): Promise<Task[]> => {
  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const getCommissions = async (userId?: string): Promise<Commission[]> => {
  try {
    let query = supabase
      .from('commissions')
      .select('*')
      .order('date', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching commissions:', error);
    throw error;
  }
};

// Finance Dashboard API calls
export const getFinancialMetrics = async (): Promise<FinancialMetrics> => {
  try {
    const { data: revenue, error: revenueError } = await supabase
      .from('invoices')
      .select('amount, status')
      .eq('status', 'paid');

    if (revenueError) throw revenueError;

    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('amount, status')
      .eq('status', 'approved');

    if (expensesError) throw expensesError;

    const totalRevenue = revenue?.reduce((sum, inv) => sum + ((inv as any)?.amount || 0), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, exp) => sum + ((exp as any)?.amount || 0), 0) || 0;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      pendingInvoices: 0, // TODO: Implement
      overdueInvoices: 0, // TODO: Implement
      totalInvoices: revenue?.length || 0,
      cashFlow: netProfit
    };
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    throw error;
  }
};

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    // TODO: Implement transactions table
    return [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Marketing Dashboard API calls
export const getCampaignMetrics = async (): Promise<CampaignMetrics> => {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*');

    if (error) throw error;

    const totalRevenue = campaigns?.reduce((sum, campaign) => sum + ((campaign as any)?.revenue || 0), 0) || 0;
    const totalLeads = campaigns?.reduce((sum, campaign) => sum + ((campaign as any)?.leads || 0), 0) || 0;
    const totalSpent = campaigns?.reduce((sum, campaign) => sum + ((campaign as any)?.spent || 0), 0) || 0;
    const conversions = campaigns?.reduce((sum, campaign) => sum + ((campaign as any)?.conversions || 0), 0) || 0;
    const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;
    const roi = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;

    return {
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns: campaigns?.filter((c: any) => c.status === 'active').length || 0,
      totalLeads,
      conversionRate,
      totalSpent,
      totalRevenue,
      roi,
      avgEngagement: 0 // TODO: Calculate engagement
    };
  } catch (error) {
    console.error('Error fetching campaign metrics:', error);
    throw error;
  }
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getLeadSources = async (): Promise<LeadSource[]> => {
  try {
    // TODO: Implement lead sources analytics
    return [];
  } catch (error) {
    console.error('Error fetching lead sources:', error);
    throw error;
  }
};

export const getContent = async (): Promise<Content[]> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

// Support Dashboard API calls
export const getSupportMetrics = async (): Promise<SupportMetrics> => {
  try {
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*');

    if (error) throw error;

    const openTickets = tickets?.filter((t: any) => t.status === 'open' || (t as any).status === 'in_progress').length || 0;
    const resolvedTickets = tickets?.filter((t: any) => t.status === 'resolved' || (t as any).status === 'closed').length || 0;
    const today = new Date().toISOString().split('T')[0];
    const ticketsToday = tickets?.filter((t: any) => t.created_at.startsWith(today)).length || 0;

    return {
      totalTickets: tickets?.length || 0,
      openTickets,
      resolvedTickets,
      avgResponseTime: 0, // TODO: Calculate from ticket timestamps
      avgResolutionTime: 0, // TODO: Calculate from ticket timestamps
      customerSatisfaction: 0, // TODO: Calculate from ratings
      ticketsToday,
      escalatedTickets: tickets?.filter((t: any) => t.status === 'escalated').length || 0
    };
  } catch (error) {
    console.error('Error fetching support metrics:', error);
    throw error;
  }
};

export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const getSupportAgents = async (): Promise<SupportAgent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'support_agent')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching support agents:', error);
    throw error;
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    // TODO: Implement customer analytics
    return [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Generic API helper
export const createRecord = async (table: string, data: any) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error creating record:', error);
    throw error;
  }
};

// @ts-nocheck - Bypass TypeScript checking for this entire function
// This is needed due to Supabase's complex type definitions
export const updateRecord = async (table: string, id: string, data: any): Promise<any> => {
  try {
    const { data: result, error } = await (supabase as any)
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
};

export const deleteRecord = async (table: string, id: string) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
};

export const createProductInquiryLead = async (inquiryData: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  productId?: string;
  productName?: string;
  categoryId?: string;
  categoryTitle?: string;
  priceAnchor?: string;
  selectedAddons?: string[];
  services?: any;
  projectDetails?: any;
  timeline?: any;
  additionalNotes?: string;
  user_id?: string;
}) => {
  try {
    const leadRecord = {
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      company: inquiryData.company || '',
      productId: inquiryData.productId || '',
      productName: inquiryData.productName || '',
      categoryId: inquiryData.categoryId || '',
      categoryTitle: inquiryData.categoryTitle || '',
      priceAnchor: inquiryData.priceAnchor || '',
      selectedAddons: inquiryData.selectedAddons || [],
      services: inquiryData.services || {},
      projectDetails: inquiryData.projectDetails || {},
      timeline: inquiryData.timeline || {},
      additionalNotes: inquiryData.additionalNotes || '',
      status: 'new',
      assigned_to: 'unassigned',
      user_id: inquiryData.user_id || null,
      created_at: new Date().toISOString(),
      last_contact: new Date().toISOString(),
      next_action: 'Initial contact & lead qualification',
    };

    const createdLead = await createRecord('leads', leadRecord);

    if (inquiryData.user_id) {
      try {
        await createRecord('service_requests', {
          user_id: inquiryData.user_id,
          service_type: inquiryData.categoryTitle || inquiryData.productName || 'General Inquiry',
          description: `Product: ${inquiryData.productName || 'Custom Request'}\nCategory: ${inquiryData.categoryTitle || 'General'}\nBudget/Price: ${inquiryData.priceAnchor || 'N/A'}\nDetails: ${inquiryData.additionalNotes || 'N/A'}`,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (srvErr) {
        console.warn('Primary table inserted, secondary service_requests write deferred:', srvErr);
      }
    }

    return createdLead;
  } catch (error) {
    console.error('Error creating product inquiry lead:', error);
    throw error;
  }
};

export const convertLeadToProject = async (leadId: string, projectName?: string, budget?: number) => {
  try {
    const updatedLead = await updateRecord('leads', leadId, {
      status: 'closed-won',
      last_contact: new Date().toISOString(),
      next_action: 'Project kick-off & onboarding'
    });

    try {
      await createRecord('projects', {
        name: projectName || updatedLead.productName || `Project for ${updatedLead.name}`,
        description: `Product: ${updatedLead.productName || 'Custom Service'}\nClient: ${updatedLead.name} (${updatedLead.email})`,
        status: 'in_progress',
        budget: budget || (updatedLead.value ? updatedLead.value : 0),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (pErr) {
      console.warn('Lead updated to closed-won, project record deferred:', pErr);
    }

    return updatedLead;
  } catch (error) {
    console.error('Error converting lead to project:', error);
    throw error;
  }
};

