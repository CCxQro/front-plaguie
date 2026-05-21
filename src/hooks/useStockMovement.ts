import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addStock,
  removeStock,
  type InventoryMovementResponse,
} from '../services/products/inventoryService';

export type StockMovement = 'add' | 'remove';

export interface StockMovementInput {
  skuSellerId: number;
  movement: StockMovement;
  cantidad: number;
}

export function useStockMovement() {
  const queryClient = useQueryClient();

  return useMutation<InventoryMovementResponse, Error, StockMovementInput>({
    mutationFn: ({ skuSellerId, movement, cantidad }) =>
      movement === 'add'
        ? addStock(skuSellerId, cantidad)
        : removeStock(skuSellerId, cantidad),
    onError: (err) => {
      console.error('[useStockMovement] error:', err);
    },
    onSuccess: (_data, { skuSellerId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', skuSellerId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
