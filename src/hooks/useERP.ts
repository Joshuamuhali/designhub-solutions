import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { erpService } from '@/services/erpService';

export function useERPProjects() {
  return useQuery({
    queryKey: ['erp', 'projects'],
    queryFn: () => erpService.getProjects(),
    staleTime: 30_000,
  });
}

export function useERPProjectDetails(projectId: string) {
  return useQuery({
    queryKey: ['erp', 'projectDetails', projectId],
    queryFn: () => erpService.getProjectDetails(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: any }) =>
      erpService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, title, description, dueDate }: { projectId: string; title: string; description?: string; dueDate?: string }) =>
      erpService.createTask(projectId, title, description, dueDate),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
    },
  });
}

export function useUploadProjectFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, fileName, fileUrl, visibility }: { projectId: string; fileName: string; fileUrl: string; visibility: any }) =>
      erpService.uploadProjectFile(projectId, fileName, fileUrl, visibility),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
    },
  });
}

export function useSubmitProofForReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, proofUrl, designerNotes }: { projectId: string; proofUrl: string; designerNotes?: string }) =>
      erpService.submitProofForReview(projectId, proofUrl, designerNotes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
    },
  });
}

export function useClientApproveProof() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, revisionId }: { projectId: string; revisionId?: string }) =>
      erpService.clientApproveProof(projectId, revisionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
    },
  });
}

export function useClientRequestRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, revisionId, feedback }: { projectId: string; revisionId: string; feedback: string }) =>
      erpService.clientRequestRevision(projectId, revisionId, feedback),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
    },
  });
}

export function useConfirmProjectCompletion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId }: { projectId: string }) =>
      erpService.confirmProjectCompletion(projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'invoices'] });
    },
  });
}

export function useERPInvoices() {
  return useQuery({
    queryKey: ['erp', 'invoices'],
    queryFn: () => erpService.getInvoices(),
    staleTime: 30_000,
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, amount, paymentMethod }: { invoiceId: string; amount: number; paymentMethod: any }) =>
      erpService.recordPayment(invoiceId, amount, paymentMethod),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp', 'invoices'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'invoices'] });
    },
  });
}

export function useSubmitFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      erpService.submitFeedback(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp'] });
    },
  });
}
