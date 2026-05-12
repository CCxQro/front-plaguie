import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/products/productsService';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 60 * 1000,
  });
}
