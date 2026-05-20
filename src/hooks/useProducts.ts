import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/products/productsService';
import type { ProductFilters } from '../types/Product';

export function useProducts(
  filters: ProductFilters = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 60 * 1000,
    enabled: options.enabled ?? true,
  });
}
