import { backendClient } from '../http/backendClient';
import type { EarlyAlert, RegionInteres, StateOption } from '../../types/RegionInteres';

/** State catalog for the region selector. GET /api/locations/states */
export async function getStates(): Promise<StateOption[]> {
  const { data } = await backendClient.get<StateOption[]>('/api/locations/states');
  return data;
}

/** The authenticated seller's configured regions of interest. GET /api/regiones-interes */
export async function getRegionesInteres(): Promise<RegionInteres[]> {
  const { data } = await backendClient.get<RegionInteres[]>('/api/regiones-interes');
  return data;
}

/** Add a state as a region of interest. POST /api/regiones-interes */
export async function addRegionInteres(stateId: number): Promise<RegionInteres> {
  const { data } = await backendClient.post<RegionInteres>('/api/regiones-interes', { stateId });
  return data;
}

/** Remove a region of interest. DELETE /api/regiones-interes/{id} */
export async function deleteRegionInteres(regionInteresId: number): Promise<void> {
  await backendClient.delete(`/api/regiones-interes/${regionInteresId}`);
}

/** Early pest alerts in the seller's regions. GET /api/regiones-interes/alertas */
export async function getEarlyAlerts(): Promise<EarlyAlert[]> {
  const { data } = await backendClient.get<EarlyAlert[]>('/api/regiones-interes/alertas');
  return data;
}
