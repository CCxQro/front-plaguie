import { useQuery } from '@tanstack/react-query';
import { getAdminMetrics, type AdminMetrics } from '../services/admin/adminMetricsService';

export const useAdminMetrics = () => {
  return useQuery<AdminMetrics, Error>({
    queryKey: ['admin-metrics'],
    queryFn: getAdminMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
