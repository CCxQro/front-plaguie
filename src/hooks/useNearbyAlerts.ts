import { useQuery } from '@tanstack/react-query';

import { getNearbyAlerts } from '../services/alerts/nearbyAlertsService';
import type { EarlyAlert } from '../types/EarlyAlert';

/**
 * Validated early alerts within `radioKm` of the authenticated seller's location.
 * Re-fetches when the radius changes.
 */
export function useNearbyAlerts(radioKm: number) {
  return useQuery<EarlyAlert[], Error>({
    queryKey: ['nearby-alerts', radioKm],
    queryFn: () => getNearbyAlerts(radioKm),
    staleTime: 60 * 1000,
  });
}
