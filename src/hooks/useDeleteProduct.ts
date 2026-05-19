import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../services/products/productsService';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skuSellerId: number) => deleteProduct(skuSellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
      console.error('[useDeleteProduct] error:', err);
    },
  });
}
