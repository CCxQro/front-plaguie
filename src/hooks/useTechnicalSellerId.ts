import { useQuery } from '@tanstack/react-query';
import { getTechnicalSellerByUserId } from '../services/products/productsService';
import useAuthStore from '../services/Contexts/useAuthStore';

export function useTechnicalSellerId() {
  const userId = useAuthStore((s) => s.user?.userId);

  return useQuery({
    queryKey: ['technical-seller-id', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No autenticado.');
      const seller = await getTechnicalSellerByUserId(userId);
      return seller.technicalSellerId;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
}
