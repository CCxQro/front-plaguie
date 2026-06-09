import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { getAdminMetrics } from './adminMetricsService';

const get = vi.mocked(backendClient.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('adminMetricsService', () => {
  it('getAdminMetrics hits /api/admin/metrics and returns the payload', async () => {
    get.mockResolvedValueOnce({
      data: {
        totalUsers: 100,
        newUsersThisWeek: 5,
        totalProducts: 50,
        pendingValidations: 3,
        totalSurveillanceRecords: 200,
        recordsThisMonth: 20,
        totalOrders: 75,
        ordersThisWeek: 8,
      },
    });

    const result = await getAdminMetrics();

    expect(get).toHaveBeenCalledWith('/api/admin/metrics');
    expect(result.totalUsers).toBe(100);
    expect(result.ordersThisWeek).toBe(8);
  });
});
