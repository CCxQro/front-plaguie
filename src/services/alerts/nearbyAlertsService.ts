import { backendClient } from '../http/backendClient';
import type { EarlyAlert } from '../../types/EarlyAlert';

/**
 * GET /api/alertas/cercanas?radioKm=…
 *
 * Returns validated pest alerts from the last 3 months within `radioKm` of the
 * authenticated seller's location, sorted ascending by distance.
 */
export async function getNearbyAlerts(radioKm: number): Promise<EarlyAlert[]> {
  const { data } = await backendClient.get<EarlyAlert[]>('/api/alertas/cercanas', {
    params: { radioKm },
  });
  return data;
}
