import { useQuery } from '@tanstack/react-query';
import { getClientLocations } from '../services/clients/clientLocationsService';

export function useClientLocations() {
  return useQuery({
    queryKey: ['client-locations'],
    queryFn: getClientLocations,
    staleTime: 10 * 60 * 1000,
  });
}
