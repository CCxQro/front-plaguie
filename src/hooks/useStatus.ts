import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '../services/status/statusService';

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: 30_000,
    retry: 1,
    staleTime: 0,
  });
}
