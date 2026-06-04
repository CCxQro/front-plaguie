import { useQuery } from '@tanstack/react-query';
import { backendClient } from '../services/http/backendClient';
import type { Order } from '../types/Order';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await backendClient.get<Order[]>('/api/orders');
      return data;
    },
    staleTime: 60 * 1000,
  });
}
