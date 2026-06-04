import { useQuery } from '@tanstack/react-query';
import { salesClientsService, type ClientParcelaStatus } from '../services/sales/salesClientsService';

export function useClientParcelaStatus(farmerId: number | null) {
  return useQuery<ClientParcelaStatus, Error>({
    queryKey: ['sales-client-parcela-status', farmerId],
    queryFn: async () => {
      if (farmerId === null) {
        return Promise.reject(new Error('Farmer ID is null'));
      }
      return await salesClientsService.getClientParcelaStatus(farmerId);
    },
    enabled: farmerId !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
