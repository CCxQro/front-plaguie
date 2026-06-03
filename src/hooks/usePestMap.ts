import { useQuery } from '@tanstack/react-query';

import { getPestMapPoints } from '../services/pestMap/pestMapService';
import type { PestMapPoint } from '../types/PestMap';

/** Validated surveillance points for the pest map (admin/seller). */
export function usePestMap() {
  return useQuery<PestMapPoint[], Error>({
    queryKey: ['pest-map'],
    queryFn: getPestMapPoints,
    staleTime: 5 * 60 * 1000,
  });
}
