import { supabase } from '@/lib/supabase';

export interface PulseStats {
  revenueMTD: number;
  pipelineValue: number;
  activeProjects: number;
  overdueInvoices: { count: number; amount: number };
}

export interface BusinessStats {
  revenueByMonth: { month: string; amount: number }[];
  pipelineByStage: { stage: string; count: number; value: number }[];
  topClients: { name: string; total: number }[];
  recentWins: { title: string; value: number; closedAt: string }[];
}

export interface OperationsStats {
  projectsByStatus: { status: string; count: number }[];
  teamWorkload: { name: string; openTasks: number; utilization: number }[];
  projectsAtRisk: { id: string; name: string; daysLate: number }[];
  recentActivity: { action: string; resource: string; at: string }[];
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalProjects: number;
  totalLeads: number;
  openTickets: number;
}

// ---------- PULSE ----------
export async function fetchPulse(): Promise<PulseStats> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    revenueRes,
    pipelineRes,
    projectsRes,
    overdueRes,
  ] = await Promise.all([
    supabase
      .from('invoices')
      .select('total_amount, created_at')
      .gte('created_at', monthStart.toISOString())
      .in('status', ['paid', 'partially_paid']),

    supabase
      .from('leads')
      .select('value')
      .not('status', 'in', '("closed-won","closed-lost")'),

    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .not('status', 'in', '("completed","cancelled","on_hold")'),

    supabase
      .from('invoices')
      .select('total_amount')
      .lt('due_date', new Date().toISOString())
      .not('status', 'in', '("paid","cancelled")'),
  ]);

  const revenueMTD = (revenueRes.data as any[] ?? []).reduce(
    (sum, r) => sum + Number(r.total_amount),
    0
  );
  const pipelineValue = (pipelineRes.data as any[] ?? []).reduce(
    (sum, r) => sum + Number(r.value ?? 0),
    0
  );
  const overdueInvoices = {
    count: overdueRes.data?.length ?? 0,
    amount: (overdueRes.data as any[] ?? []).reduce(
      (sum, r) => sum + Number(r.total_amount),
      0
    ),
  };

  return {
    revenueMTD,
    pipelineValue,
    activeProjects: projectsRes.count ?? 0,
    overdueInvoices,
  };
}

// ---------- BUSINESS ----------
export async function fetchBusiness(): Promise<BusinessStats> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [paymentsRes, leadsRes, clientsRes, winsRes] = await Promise.all([
    supabase
      .from('invoices')
      .select('total_amount, created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .in('status', ['paid', 'partially_paid']),

    supabase
      .from('leads')
      .select('status, value'),

    supabase
      .from('projects')
      .select('deal_value, company_id')
      .not('company_id', 'is', null),

    supabase
      .from('leads')
      .select('name, value, last_contact')
      .eq('status', 'closed-won')
      .order('last_contact', { ascending: false })
      .limit(5),
  ]);

  // group revenue by month
  const byMonth = new Map<string, number>();
  for (const p of paymentsRes.data as any[] ?? []) {
    const key = p.created_at.slice(0, 7); // "2026-09"
    byMonth.set(key, (byMonth.get(key) ?? 0) + Number(p.total_amount));
  }
  const revenueByMonth = Array.from(byMonth.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // group leads by stage
  const byStage = new Map<string, { count: number; value: number }>();
  for (const o of leadsRes.data as any[] ?? []) {
    const curr = byStage.get(o.status) ?? { count: 0, value: 0 };
    curr.count += 1;
    curr.value += Number(o.value ?? 0);
    byStage.set(o.status, curr);
  }
  const pipelineByStage = Array.from(byStage.entries())
    .map(([stage, v]) => ({ stage, ...v }));

  // top clients (by project value)
  const byCompany = new Map<string, number>();
  for (const p of clientsRes.data as any[] ?? []) {
    if (!p.company_id) continue;
    byCompany.set(p.company_id, (byCompany.get(p.company_id) ?? 0) + Number(p.deal_value ?? 0));
  }
  const topClients = Array.from(byCompany.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const recentWins = (winsRes.data as any[] ?? []).map((w) => ({
    title: w.name,
    value: Number(w.value ?? 0),
    closedAt: w.last_contact,
  }));

  return { revenueByMonth, pipelineByStage, topClients, recentWins };
}

// ---------- OPERATIONS ----------
export async function fetchOperations(): Promise<OperationsStats> {
  const [projectsRes, tasksRes, riskRes, activityRes] = await Promise.all([
    supabase.from('projects').select('status'),
    supabase
      .from('project_tasks')
      .select('assigned_to, status')
      .not('status', 'eq', 'completed'),
    supabase
      .from('projects')
      .select('id, name, due_date')
      .lt('due_date', new Date().toISOString())
      .not('status', 'in', '("completed","cancelled")'),
    supabase
      .from('audit_logs')
      .select('action, resource, timestamp')
      .order('timestamp', { ascending: false })
      .limit(10),
  ]);

  // projects by status
  const statusMap = new Map<string, number>();
  for (const p of projectsRes.data as any[] ?? []) {
    statusMap.set(p.status, (statusMap.get(p.status) ?? 0) + 1);
  }
  const projectsByStatus = Array.from(statusMap.entries()).map(
    ([status, count]) => ({ status, count })
  );

  // team workload
  const workloadMap = new Map<string, { name: string; openTasks: number }>();
  for (const t of tasksRes.data as any[] ?? []) {
    if (!t.assigned_to) continue;
    const curr = workloadMap.get(t.assigned_to) ?? { name: t.assigned_to, openTasks: 0 };
    curr.openTasks += 1;
    workloadMap.set(t.assigned_to, curr);
  }
  const teamWorkload = Array.from(workloadMap.values())
    .map((w) => ({
      ...w,
      utilization: Math.min(100, Math.round((w.openTasks / 10) * 100)),
    }))
    .sort((a, b) => b.openTasks - a.openTasks);

  // projects at risk
  const projectsAtRisk = (riskRes.data as any[] ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    daysLate: Math.floor(
      (Date.now() - new Date(p.due_date!).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));

  // recent activity
  const recentActivity = (activityRes.data as any[] ?? []).map((a) => ({
    action: a.action,
    resource: a.resource ?? '',
    at: a.timestamp,
  }));

  return { projectsByStatus, teamWorkload, projectsAtRisk, recentActivity };
}

// ---------- SYSTEM ----------
export async function fetchSystem(): Promise<SystemStats> {
  const [
    usersAll,
    usersActive,
    usersInactive,
    projects,
    leads,
    tickets,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'inactive'),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('status', ['open','in_progress','escalated']),
  ]);

  return {
    totalUsers: usersAll.count ?? 0,
    activeUsers: usersActive.count ?? 0,
    inactiveUsers: usersInactive.count ?? 0,
    totalProjects: projects.count ?? 0,
    totalLeads: leads.count ?? 0,
    openTickets: tickets.count ?? 0,
  };
}
