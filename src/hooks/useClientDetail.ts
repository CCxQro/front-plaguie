import { useQuery } from '@tanstack/react-query';
import { salesClientsService } from '../services/sales/salesClientsService';

export function useClientDetail(farmerId: number | null) {
  return useQuery({
    queryKey: ['client-detail', farmerId],
    queryFn: () => salesClientsService.getClientDetail(farmerId!),
    enabled: farmerId !== null,
    staleTime: 5 * 60 * 1000,
  });
}
