import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offeringService } from '@/services/offeringService';

export function usePublishedServices() {
  return useQuery({
    queryKey: ['offering', 'services'],
    queryFn: () => offeringService.getPublishedServices(),
    staleTime: 60_000,
  });
}

export function usePublishedProducts() {
  return useQuery({
    queryKey: ['offering', 'products'],
    queryFn: () => offeringService.getPublishedProducts(),
    staleTime: 60_000,
  });
}

export function useOfferingBySlug(slug: string, type: 'service' | 'product') {
  return useQuery({
    queryKey: ['offering', 'bySlug', slug, type],
    queryFn: () => offeringService.getOfferingBySlug(slug, type),
    enabled: !!slug && !!type,
    staleTime: 60_000,
  });
}

export function useAllOfferings() {
  return useQuery({
    queryKey: ['offering', 'all'],
    queryFn: () => offeringService.getAllOfferings(),
    staleTime: 30_000,
  });
}

export function useSaveOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offering: any) =>
      offeringService.saveOffering(offering),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offering'] });
    },
  });
}

export function useSubmitExpressInterest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      offeringService.submitExpressInterest(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'leads'] });
    },
  });
}
