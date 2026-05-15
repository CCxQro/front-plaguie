import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ordersService } from './ordersService';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';

const mockGet = vi.mocked(backendClient.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ordersService', () => {
  it('getSellerOrders calls the correct endpoint', async () => {
    mockGet.mockResolvedValue({ data: [] });
    await ordersService.getSellerOrders();
    expect(mockGet).toHaveBeenCalledWith('/api/orders');
  });

  it('getSellerOrders returns the data array', async () => {
    const payload = [
      {
        orderId: 1,
        farmerId: 1,
        farmerName: 'A',
        sellerId: 10,
        sellerName: 'S',
        orderDate: '2025-01-01',
        orderStatusId: 1,
        orderStatusName: 'Entregado',
        totalAmount: 100,
      },
    ];
    mockGet.mockResolvedValue({ data: payload });
    const result = await ordersService.getSellerOrders();
    expect(result).toEqual(payload);
  });

  it('getOrderById hits /api/orders/:id', async () => {
    mockGet.mockResolvedValue({ data: { orderId: 42 } });
    await ordersService.getOrderById(42);
    expect(mockGet).toHaveBeenCalledWith('/api/orders/42');
  });
});
