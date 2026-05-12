import { useQuery } from '@tanstack/react-query';
import { getProviders } from '../services/products/productsService';

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: getProviders,
    staleTime: 5 * 60 * 1000,
  });
}
