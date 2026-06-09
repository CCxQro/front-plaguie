import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { getSalesSummary } from './salesSummaryService';

const get = vi.mocked(backendClient.get);

const payload = {
  data: {
    metrics: {
      totalEarnings: 1000,
      remainingInventory: 50,
      totalOrders: 20,
      newClients: 4,
      earningsTrend: '+10%',
      inventoryTrend: '-5%',
      ordersTrend: '+2%',
      clientsTrend: '+1%',
    },
    inventoryAlerts: [],
    salesChartData: [],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('salesSummaryService', () => {
  it('getSalesSummary appends startDate and endDate when provided', async () => {
    get.mockResolvedValueOnce(payload);
    await getSalesSummary('2026-01-01', '2026-01-31');
    expect(get).toHaveBeenCalledWith('/api/sales/summary?startDate=2026-01-01&endDate=2026-01-31');
  });

  it('getSalesSummary requests with empty query when no dates', async () => {
    get.mockResolvedValueOnce(payload);
    const result = await getSalesSummary();
    expect(get).toHaveBeenCalledWith('/api/sales/summary?');
    expect(result.metrics.totalEarnings).toBe(1000);
  });
});
