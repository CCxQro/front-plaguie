import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/products/productsService';

export function useProduct(skuSellerId: number | null) {
  return useQuery({
    queryKey: ['product', skuSellerId],
    queryFn: () => getProductById(skuSellerId as number),
    enabled: skuSellerId != null,
    staleTime: 60 * 1000,
  });
}
