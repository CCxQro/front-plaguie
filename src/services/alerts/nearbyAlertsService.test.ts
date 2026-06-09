import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { getNearbyAlerts } from './nearbyAlertsService';

const get = vi.mocked(backendClient.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('nearbyAlertsService', () => {
  it('getNearbyAlerts passes radioKm as a query param', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await getNearbyAlerts(30);
    expect(get).toHaveBeenCalledWith('/api/alertas/cercanas', { params: { radioKm: 30 } });
  });

  it('returns the alert list', async () => {
    get.mockResolvedValueOnce({ data: [{ alertaId: 1 }] });
    const result = await getNearbyAlerts(10);
    expect(result).toHaveLength(1);
  });
});
