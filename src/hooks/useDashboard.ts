import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as dashboardService from '@/services/dashboardService';

export function useSystemStats() {
  return useQuery({
    queryKey: ['dashboard', 'systemStats'],
    queryFn: () => dashboardService.getSystemStats(),
    staleTime: 60_000,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['dashboard', 'users'],
    queryFn: () => dashboardService.getUsers(),
    staleTime: 30_000,
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ['dashboard', 'auditLogs'],
    queryFn: () => dashboardService.getAuditLogs(),
    staleTime: 30_000,
  });
}

export function useDepartmentStats(departmentId: string) {
  return useQuery({
    queryKey: ['dashboard', 'departmentStats', departmentId],
    queryFn: () => dashboardService.getDepartmentStats(departmentId),
    enabled: !!departmentId,
    staleTime: 60_000,
  });
}

export function useTeamMembers(departmentId: string) {
  return useQuery({
    queryKey: ['dashboard', 'teamMembers', departmentId],
    queryFn: () => dashboardService.getTeamMembers(departmentId),
    enabled: !!departmentId,
    staleTime: 30_000,
  });
}

export function useSalesMetrics(teamId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'salesMetrics', teamId],
    queryFn: () => dashboardService.getSalesMetrics(teamId),
    staleTime: 60_000,
  });
}

export function useSalesTeam(teamId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'salesTeam', teamId],
    queryFn: () => dashboardService.getSalesTeam(teamId),
    staleTime: 30_000,
  });
}

export function useLeads(assignedTo?: string) {
  return useQuery({
    queryKey: ['dashboard', 'leads', assignedTo],
    queryFn: () => dashboardService.getLeads(assignedTo),
    staleTime: 30_000,
  });
}

export function useTasks(assignedTo?: string) {
  return useQuery({
    queryKey: ['dashboard', 'tasks', assignedTo],
    queryFn: () => dashboardService.getTasks(assignedTo),
    staleTime: 30_000,
  });
}

export function useCommissions(userId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'commissions', userId],
    queryFn: () => dashboardService.getCommissions(userId),
    staleTime: 60_000,
  });
}

export function useFinancialMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'financialMetrics'],
    queryFn: () => dashboardService.getFinancialMetrics(),
    staleTime: 60_000,
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ['dashboard', 'invoices'],
    queryFn: () => dashboardService.getInvoices(),
    staleTime: 30_000,
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ['dashboard', 'expenses'],
    queryFn: () => dashboardService.getExpenses(),
    staleTime: 30_000,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['dashboard', 'transactions'],
    queryFn: () => dashboardService.getTransactions(),
    staleTime: 30_000,
  });
}

export function useCampaignMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'campaignMetrics'],
    queryFn: () => dashboardService.getCampaignMetrics(),
    staleTime: 60_000,
  });
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['dashboard', 'campaigns'],
    queryFn: () => dashboardService.getCampaigns(),
    staleTime: 30_000,
  });
}

export function useLeadSources() {
  return useQuery({
    queryKey: ['dashboard', 'leadSources'],
    queryFn: () => dashboardService.getLeadSources(),
    staleTime: 60_000,
  });
}

export function useContent() {
  return useQuery({
    queryKey: ['dashboard', 'content'],
    queryFn: () => dashboardService.getContent(),
    staleTime: 30_000,
  });
}

export function useSupportMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'supportMetrics'],
    queryFn: () => dashboardService.getSupportMetrics(),
    staleTime: 60_000,
  });
}

export function useTickets() {
  return useQuery({
    queryKey: ['dashboard', 'tickets'],
    queryFn: () => dashboardService.getTickets(),
    staleTime: 30_000,
  });
}

export function useSupportAgents() {
  return useQuery({
    queryKey: ['dashboard', 'supportAgents'],
    queryFn: () => dashboardService.getSupportAgents(),
    staleTime: 30_000,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ['dashboard', 'customers'],
    queryFn: () => dashboardService.getCustomers(),
    staleTime: 60_000,
  });
}

// Mutations
export function useCreateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ table, data }: { table: string; data: any }) =>
      dashboardService.createRecord(table, data),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}

export function useUpdateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ table, id, data }: { table: string; id: string; data: any }) =>
      dashboardService.updateRecord(table, id, data),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}

export function useDeleteRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ table, id }: { table: string; id: string }) =>
      dashboardService.deleteRecord(table, id),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}

export function useCreateProductInquiryLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (inquiryData: Parameters<typeof dashboardService.createProductInquiryLead>[0]) =>
      dashboardService.createProductInquiryLead(inquiryData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'leads'] });
    },
  });
}

export function useConvertLeadToProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, projectName, budget }: { leadId: string; projectName?: string; budget?: number }) =>
      dashboardService.convertLeadToProject(leadId, projectName, budget),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'leads'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'projects'] });
    },
  });
}
