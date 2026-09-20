import { supabase } from '@/lib/supabase';

export type Severity = 'critical' | 'warning' | 'info';

export interface AttentionItem {
  id: string;
  severity: Severity;
  icon: string;
  title: string;
  detail?: string;
  href: string;
  count?: number;
}

export async function fetchAttentionItems(): Promise<AttentionItem[]> {
  const items: AttentionItem[] = [];

  const now = new Date().toISOString();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    overdueInvoices,
    pendingUsers,
    lateProjects,
    escalatedTickets,
  ] = await Promise.all([
    supabase
      .from('invoices')
      .select('id, total_amount, due_date')
      .lt('due_date', thirtyDaysAgo.toISOString())
      .not('status', 'in', '("paid","cancelled")'),

    supabase
      .from('profiles')
      .select('id')
      .eq('status', 'inactive'),

    supabase
      .from('projects')
      .select('id, name, due_date')
      .lt('due_date', now)
      .not('status', 'in', '("completed","cancelled")'),

    supabase
      .from('support_tickets')
      .select('id, subject')
      .eq('status', 'escalated'),
  ]);

  if ((overdueInvoices.data?.length ?? 0) > 0) {
    const amount = (overdueInvoices.data as any[]).reduce(
      (s: number, i: any) => s + Number(i.total_amount),
      0
    );
    items.push({
      id: 'overdue-invoices',
      severity: 'critical',
      icon: 'receipt',
      title: `${overdueInvoices.data!.length} invoice${overdueInvoices.data!.length > 1 ? 's' : ''} overdue by 30+ days`,
      detail: `$${amount.toLocaleString()} outstanding`,
      href: '/dashboard/finance-management',
      count: overdueInvoices.data!.length,
    });
  }

  if ((pendingUsers.data?.length ?? 0) > 0) {
    items.push({
      id: 'pending-users',
      severity: 'warning',
      icon: 'user-plus',
      title: `${pendingUsers.data!.length} user${pendingUsers.data!.length > 1 ? 's' : ''} pending activation`,
      href: '/dashboard/superadmin',
      count: pendingUsers.data!.length,
    });
  }

  if ((lateProjects.data?.length ?? 0) > 0) {
    items.push({
      id: 'late-projects',
      severity: 'warning',
      icon: 'alert-triangle',
      title: `${lateProjects.data!.length} project${lateProjects.data!.length > 1 ? 's' : ''} past due`,
      detail: (lateProjects.data as any[]).slice(0, 3).map((p) => p.name).join(', '),
      href: '/dashboard/projects',
      count: lateProjects.data!.length,
    });
  }

  if ((escalatedTickets.data?.length ?? 0) > 0) {
    items.push({
      id: 'escalated-tickets',
      severity: 'critical',
      icon: 'life-buoy',
      title: `${escalatedTickets.data!.length} ticket${escalatedTickets.data!.length > 1 ? 's' : ''} escalated to owner`,
      href: '/dashboard/support',
      count: escalatedTickets.data!.length,
    });
  }

  // Sort: critical first, then warning, then info
  const order: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };
  return items.sort((a, b) => order[a.severity] - order[b.severity]);
}
