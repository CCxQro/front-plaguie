import { backendClient } from '../http/backendClient';
import type { PestMapPoint } from '../../types/PestMap';

/**
 * GET /api/vigilancias-fitosanitarias/mapa
 * Validated surveillance observations (with coordinates + state/municipality)
 * for the interactive pest map. Filtering and zone aggregation happen client-side.
 */
export async function getPestMapPoints(): Promise<PestMapPoint[]> {
  const { data } = await backendClient.get<PestMapPoint[]>(
    '/api/vigilancias-fitosanitarias/mapa'
  );
  return data;
}
