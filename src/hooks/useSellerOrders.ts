import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../services/orders/ordersService';

export function useSellerOrders() {
  return useQuery({
    queryKey: ['seller-orders'],
    queryFn: () => ordersService.getSellerOrders(),
    staleTime: 5 * 60 * 1000,
  });
}
