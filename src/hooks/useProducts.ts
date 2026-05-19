import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/products/productsService';
import type { ProductFilters } from '../types/Product';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 60 * 1000,
  });
}
