import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getClientLocations } from './clientLocationsService';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';

const mockGet = vi.mocked(backendClient.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getClientLocations', () => {
  it('calls the correct endpoint', async () => {
    mockGet.mockResolvedValue({ data: [] });
    await getClientLocations();
    expect(mockGet).toHaveBeenCalledWith('/api/orders/farmer-locations');
  });

  it('maps farmerId to clientId as a string', async () => {
    mockGet.mockResolvedValue({
      data: [
        { farmerId: 42, farmerName: 'Test', orderId: 1, latitude: 10, longitude: -10, locationId: 1 },
      ],
    });
    const result = await getClientLocations();
    expect(result[0].clientId).toBe('42');
    expect(typeof result[0].clientId).toBe('string');
  });

  it('maps farmerName to clientName', async () => {
    mockGet.mockResolvedValue({
      data: [
        { farmerId: 1, farmerName: 'Rancho Norte', orderId: 1, latitude: 20, longitude: -100, locationId: 1 },
      ],
    });
    const result = await getClientLocations();
    expect(result[0].clientName).toBe('Rancho Norte');
  });

  it('maps latitude and longitude to lat and lng', async () => {
    mockGet.mockResolvedValue({
      data: [
        { farmerId: 1, farmerName: 'Farm', orderId: 1, latitude: 25.6866, longitude: -100.3161, locationId: 1 },
      ],
    });
    const result = await getClientLocations();
    expect(result[0].lat).toBe(25.6866);
    expect(result[0].lng).toBe(-100.3161);
  });

  it('deduplicates by farmerId keeping the first occurrence', async () => {
    mockGet.mockResolvedValue({
      data: [
        { farmerId: 1, farmerName: 'Farmer A', orderId: 1, latitude: 10, longitude: -10, locationId: 1 },
        { farmerId: 1, farmerName: 'Farmer A', orderId: 2, latitude: 99, longitude: -99, locationId: 2 },
        { farmerId: 2, farmerName: 'Farmer B', orderId: 3, latitude: 20, longitude: -20, locationId: 3 },
      ],
    });
    const result = await getClientLocations();
    expect(result).toHaveLength(2);
    expect(result[0].clientId).toBe('1');
    expect(result[0].lat).toBe(10);
    expect(result[1].clientId).toBe('2');
  });

  it('preserves original order after deduplication', async () => {
    mockGet.mockResolvedValue({
      data: [
        { farmerId: 3, farmerName: 'C', orderId: 1, latitude: 1, longitude: 1, locationId: 1 },
        { farmerId: 1, farmerName: 'A', orderId: 2, latitude: 2, longitude: 2, locationId: 2 },
        { farmerId: 2, farmerName: 'B', orderId: 3, latitude: 3, longitude: 3, locationId: 3 },
        { farmerId: 1, farmerName: 'A', orderId: 4, latitude: 9, longitude: 9, locationId: 4 },
      ],
    });
    const result = await getClientLocations();
    expect(result.map((r) => r.clientId)).toEqual(['3', '1', '2']);
  });

  it('returns an empty array when the backend returns []', async () => {
    mockGet.mockResolvedValue({ data: [] });
    const result = await getClientLocations();
    expect(result).toEqual([]);
  });

  it('propagates errors thrown by backendClient', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));
    await expect(getClientLocations()).rejects.toThrow('Network error');
  });
});
