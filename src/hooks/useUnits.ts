import { useQuery } from '@tanstack/react-query';
import { getUnits } from '../services/products/productsService';

export function useUnits() {
  return useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
    staleTime: 5 * 60 * 1000,
  });
}
