import { useQuery } from '@tanstack/react-query';
import { salesClientsService, type ClientMapFilters } from '../services/sales/salesClientsService';

export function useClientsMap(filters: ClientMapFilters = {}) {
  return useQuery({
    queryKey: ['clients-map', filters],
    queryFn: () => salesClientsService.getClientsMap(filters),
    staleTime: 5 * 60 * 1000,
  });
}
