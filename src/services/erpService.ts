import { supabase } from '@/lib/supabase';

export interface ERPProject {
  id: string;
  project_number: string;
  name: string;
  quote_id?: string;
  opportunity_id?: string;
  company_id?: string;
  contact_id?: string;
  offering_slug?: string;
  deal_value: number;
  status: 'planning' | 'in_progress' | 'internal_review' | 'client_review' | 'revision_required' | 'client_approved' | 'completed' | 'on_hold' | 'cancelled';
  progress_percentage: number;
  pm_id?: string;
  brief?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface ERPTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  status: 'todo' | 'in_progress' | 'internal_qa' | 'client_review' | 'completed';
  due_date?: string;
  assignee_name?: string;
}

export interface ERPFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_size?: string;
  visibility: 'internal_only' | 'working_file' | 'client_review' | 'final_deliverable';
  uploaded_by?: string;
  uploader_name?: string;
  version: number;
  created_at: string;
}

export interface ERPRevision {
  id: string;
  project_id: string;
  version_number: number;
  proof_file_url: string;
  designer_notes?: string;
  status: 'pending_review' | 'approved' | 'revision_requested';
  client_feedback?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface ERPInvoice {
  id: string;
  invoice_number: string;
  project_id?: string;
  company_name?: string;
  contact_name?: string;
  amount: number;
  tax: number;
  total_amount: number;
  status: 'draft' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  paid_at?: string;
  created_at: string;
}

export interface ERPPayment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: 'mobile_money' | 'card' | 'bank_transfer' | 'cash';
  reference_number: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface ERPFeedback {
  id?: string;
  project_id: string;
  client_id?: string;
  rating: number;
  comments?: string;
  would_recommend: boolean;
  testimonial?: string;
  created_at?: string;
}

// Fallback seed project data if Supabase tables are being migrated
const MOCK_PROJECT: ERPProject = {
  id: 'p1111111-1111-1111-1111-111111111111',
  project_number: 'DH-2026-00421',
  name: 'ABC Construction — 12-Page Company Profile',
  company_id: 'c1111111-1111-1111-1111-111111111111',
  company_name: 'ABC Construction Ltd',
  contact_name: 'John Banda',
  contact_email: 'john@abcconstruction.com',
  contact_phone: '+260 971 112 233',
  offering_slug: 'company-profile',
  deal_value: 5000,
  status: 'in_progress',
  progress_percentage: 65,
  brief: 'Create an authoritative, tender-ready 12-page company profile. Highlight past civil works, machinery fleet, HSE policy, and leadership team.',
  due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  created_at: new Date().toISOString()
};

const MOCK_TASKS: ERPTask[] = [
  {
    id: 't-1',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    title: 'Information Intake & Copywriting',
    description: 'Draft copy for executive statement and equipment list.',
    status: 'completed',
    due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
  },
  {
    id: 't-2',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    title: 'Layout & Visual Styling',
    description: 'Design 12-page layout in InDesign following brand colors.',
    status: 'in_progress',
    due_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  },
  {
    id: 't-3',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    title: 'Internal PM Proof Review',
    description: 'Conduct internal QA check before sending to client.',
    status: 'todo',
    due_date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]
  }
];

const MOCK_FILES: ERPFile[] = [
  {
    id: 'f-1',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    file_name: 'ABC-Logo-Vector.png',
    file_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    file_size: '1.2 MB',
    visibility: 'working_file',
    version: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'f-2',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    file_name: 'Company-Profile-Proof-v1.pdf',
    file_url: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=400',
    file_size: '4.5 MB',
    visibility: 'client_review',
    version: 1,
    created_at: new Date().toISOString()
  }
];

const MOCK_INVOICE: ERPInvoice = {
  id: 'inv-1',
  invoice_number: 'DH-INV-00421',
  project_id: 'p1111111-1111-1111-1111-111111111111',
  company_name: 'ABC Construction Ltd',
  contact_name: 'John Banda',
  amount: 5000,
  tax: 0,
  total_amount: 5000,
  status: 'unpaid',
  due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  created_at: new Date().toISOString()
};

export const erpService = {
  // Fetch All Projects
  async getProjects(): Promise<ERPProject[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select(`
          *,
          companies ( name ),
          contacts ( full_name, email, phone )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[erp] getProjects failed:', error);
        throw new Error(`Failed to load projects: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((p: any) => ({
        ...p,
        company_name: p.companies?.name || '',
        contact_name: p.contacts?.full_name || '',
        contact_email: p.contacts?.email || '',
        contact_phone: p.contacts?.phone || ''
      }));
    } catch (err: any) {
      console.error('[erp] getProjects error:', err);
      throw new Error(`Failed to load projects: ${err.message}`);
    }
  },

  // Get Detailed Project View
  async getProjectDetails(projectId: string): Promise<{
    project: ERPProject;
    tasks: ERPTask[];
    files: ERPFile[];
    revisions: ERPRevision[];
    invoice?: ERPInvoice;
  }> {
    try {
      const { data: project, error: projectError } = await (supabase as any)
        .from('projects')
        .select(`*, companies(name), contacts(full_name, email, phone)`)
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('[erp] getProjectDetails project failed:', projectError);
        throw new Error(`Failed to load project: ${projectError.message}`);
      }

      const { data: tasks, error: tasksError } = await (supabase as any)
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (tasksError) {
        console.error('[erp] getProjectDetails tasks failed:', tasksError);
        throw new Error(`Failed to load tasks: ${tasksError.message}`);
      }

      const { data: files, error: filesError } = await (supabase as any)
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (filesError) {
        console.error('[erp] getProjectDetails files failed:', filesError);
        throw new Error(`Failed to load files: ${filesError.message}`);
      }

      const { data: revisions, error: revisionsError } = await (supabase as any)
        .from('project_revisions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (revisionsError) {
        console.error('[erp] getProjectDetails revisions failed:', revisionsError);
        throw new Error(`Failed to load revisions: ${revisionsError.message}`);
      }

      const { data: invoice, error: invoiceError } = await (supabase as any)
        .from('invoices')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (invoiceError) {
        console.error('[erp] getProjectDetails invoice failed:', invoiceError);
        throw new Error(`Failed to load invoice: ${invoiceError.message}`);
      }

      const pObj = project as any;
      const p: ERPProject = {
        ...pObj,
        company_name: pObj.companies?.name || '',
        contact_name: pObj.contacts?.full_name || '',
        contact_email: pObj.contacts?.email || '',
        contact_phone: pObj.contacts?.phone || ''
      };

      return {
        project: p,
        tasks: tasks || [],
        files: files || [],
        revisions: revisions || [],
        invoice: invoice || undefined
      };
    } catch (err: any) {
      console.error('[erp] getProjectDetails error:', err);
      throw new Error(`Failed to load project details: ${err.message}`);
    }
  },

  // Update Task Status
  async updateTaskStatus(taskId: string, status: ERPTask['status']): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('project_tasks').update({ status }).eq('id', taskId);
      if (error) {
        console.error('[erp] updateTaskStatus failed:', error);
        throw new Error(`Failed to update task: ${error.message}`);
      }
      return true;
    } catch (err: any) {
      console.error('[erp] updateTaskStatus error:', err);
      throw new Error(`Failed to update task: ${err.message}`);
    }
  },

  // Create Task
  async createTask(projectId: string, title: string, description?: string, dueDate?: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('project_tasks').insert({
        project_id: projectId,
        title,
        description,
        status: 'todo',
        due_date: dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
      });
      if (error) {
        console.error('[erp] createTask failed:', error);
        throw new Error(`Failed to create task: ${error.message}`);
      }
      return true;
    } catch (err: any) {
      console.error('[erp] createTask error:', err);
      throw new Error(`Failed to create task: ${err.message}`);
    }
  },

  // Upload Project File with RLS Tier
  async uploadProjectFile(projectId: string, fileName: string, fileUrl: string, visibility: ERPFile['visibility']): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('project_files').insert({
        project_id: projectId,
        file_name: fileName,
        file_url: fileUrl,
        file_size: '2.4 MB',
        visibility,
        version: 1
      });
      if (error) {
        console.error('[erp] uploadProjectFile failed:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }
      return true;
    } catch (err: any) {
      console.error('[erp] uploadProjectFile error:', err);
      throw new Error(`Failed to upload file: ${err.message}`);
    }
  },

  // Submit Proof for PM QA / Client Review
  async submitProofForReview(projectId: string, proofUrl: string, designerNotes?: string): Promise<boolean> {
    try {
      const { error: revisionError } = await (supabase as any).from('project_revisions').insert({
        project_id: projectId,
        version_number: 1,
        proof_file_url: proofUrl,
        designer_notes: designerNotes || 'Proof submitted for review.',
        status: 'pending_review'
      });

      if (revisionError) {
        console.error('[erp] submitProofForReview revision failed:', revisionError);
        throw new Error(`Failed to submit revision: ${revisionError.message}`);
      }

      const { error: projectError } = await (supabase as any).from('projects').update({ status: 'client_review', progress_percentage: 85 }).eq('id', projectId);
      if (projectError) {
        console.error('[erp] submitProofForReview project update failed:', projectError);
        throw new Error(`Failed to update project: ${projectError.message}`);
      }

      return true;
    } catch (err: any) {
      console.error('[erp] submitProofForReview error:', err);
      throw new Error(`Failed to submit proof: ${err.message}`);
    }
  },

  // Client Approve Proof -> Triggers PM Completion Gate
  async clientApproveProof(projectId: string, revisionId?: string): Promise<boolean> {
    try {
      if (revisionId) {
        const { error } = await (supabase as any).from('project_revisions').update({
          status: 'approved',
          reviewed_at: new Date().toISOString()
        }).eq('id', revisionId);
        if (error) {
          console.error('[erp] clientApproveProof revision failed:', error);
          throw new Error(`Failed to approve revision: ${error.message}`);
        }
      }

      const { error } = await (supabase as any).from('projects').update({
        status: 'client_approved',
        progress_percentage: 95
      }).eq('id', projectId);
      if (error) {
        console.error('[erp] clientApproveProof project update failed:', error);
        throw new Error(`Failed to update project: ${error.message}`);
      }

      return true;
    } catch (err: any) {
      console.error('[erp] clientApproveProof error:', err);
      throw new Error(`Failed to approve proof: ${err.message}`);
    }
  },

  // Client Request Revision
  async clientRequestRevision(projectId: string, revisionId: string, feedback: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('project_revisions').update({
        status: 'revision_requested',
        client_feedback: feedback,
        reviewed_at: new Date().toISOString()
      }).eq('id', revisionId);
      if (error) {
        console.error('[erp] clientRequestRevision revision failed:', error);
        throw new Error(`Failed to request revision: ${error.message}`);
      }

      const { error: projectError } = await (supabase as any).from('projects').update({
        status: 'revision_required',
        progress_percentage: 75
      }).eq('id', projectId);
      if (projectError) {
        console.error('[erp] clientRequestRevision project update failed:', projectError);
        throw new Error(`Failed to update project: ${projectError.message}`);
      }

      return true;
    } catch (err: any) {
      console.error('[erp] clientRequestRevision error:', err);
      throw new Error(`Failed to request revision: ${err.message}`);
    }
  },

  // PM Confirms Completion -> Triggers Invoice Creation in Accounts
  async confirmProjectCompletion(projectId: string): Promise<{ success: boolean; invoiceNumber?: string }> {
    try {
      const invNumber = 'DH-INV-' + Math.floor(100000 + Math.random() * 900000);

      const { error: projectError } = await (supabase as any).from('projects').update({
        status: 'completed',
        progress_percentage: 100,
        completed_at: new Date().toISOString()
      }).eq('id', projectId);
      if (projectError) {
        console.error('[erp] confirmProjectCompletion project failed:', projectError);
        throw new Error(`Failed to complete project: ${projectError.message}`);
      }

      const { error: invoiceError } = await (supabase as any).from('invoices').insert({
        invoice_number: invNumber,
        project_id: projectId,
        amount: 5000,
        tax: 0,
        total_amount: 5000,
        status: 'unpaid',
        due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
      });
      if (invoiceError) {
        console.error('[erp] confirmProjectCompletion invoice failed:', invoiceError);
        throw new Error(`Failed to create invoice: ${invoiceError.message}`);
      }

      return { success: true, invoiceNumber: invNumber };
    } catch (err: any) {
      console.error('[erp] confirmProjectCompletion error:', err);
      throw new Error(`Failed to complete project: ${err.message}`);
    }
  },

  // Fetch Invoices
  async getInvoices(): Promise<ERPInvoice[]> {
    try {
      const { data, error } = await (supabase as any).from('invoices').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('[erp] getInvoices failed:', error);
        throw new Error(`Failed to load invoices: ${error.message}`);
      }
      return data || [];
    } catch (err: any) {
      console.error('[erp] getInvoices error:', err);
      throw new Error(`Failed to load invoices: ${err.message}`);
    }
  },

  // Record Payment
  async recordPayment(invoiceId: string, amount: number, paymentMethod: ERPPayment['payment_method']): Promise<boolean> {
    try {
      const refNo = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
      const { error: paymentError } = await (supabase as any).from('payments').insert({
        invoice_id: invoiceId,
        amount,
        payment_method: paymentMethod,
        reference_number: refNo,
        status: 'completed'
      });
      if (paymentError) {
        console.error('[erp] recordPayment payment failed:', paymentError);
        throw new Error(`Failed to record payment: ${paymentError.message}`);
      }

      const { error: invoiceError } = await (supabase as any).from('invoices').update({
        status: 'paid',
        paid_at: new Date().toISOString()
      }).eq('id', invoiceId);
      if (invoiceError) {
        console.error('[erp] recordPayment invoice update failed:', invoiceError);
        throw new Error(`Failed to update invoice: ${invoiceError.message}`);
      }

      return true;
    } catch (err: any) {
      console.error('[erp] recordPayment error:', err);
      throw new Error(`Failed to record payment: ${err.message}`);
    }
  },

  // Submit Post-Project Feedback
  async submitFeedback(payload: ERPFeedback): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('feedbacks').insert(payload);
      if (error) {
        console.error('[erp] submitFeedback failed:', error);
        throw new Error(`Failed to submit feedback: ${error.message}`);
      }
      return true;
    } catch (err: any) {
      console.error('[erp] submitFeedback error:', err);
      throw new Error(`Failed to submit feedback: ${err.message}`);
    }
  }
};
