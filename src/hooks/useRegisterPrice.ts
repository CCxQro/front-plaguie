import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerPrice, type PriceResponse } from '../services/products/pricesService';

export interface RegisterPriceInput {
  skuSellerId: number;
  price: string;
}

export function useRegisterPrice() {
  const queryClient = useQueryClient();

  return useMutation<PriceResponse, Error, RegisterPriceInput>({
    mutationFn: ({ skuSellerId, price }) => registerPrice(skuSellerId, price),
    onError: (err) => {
      console.error('[useRegisterPrice] error:', err);
    },
    onSuccess: (_data, { skuSellerId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', skuSellerId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
