import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { getPestMapPoints } from './pestMapService';

const get = vi.mocked(backendClient.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('pestMapService', () => {
  it('getPestMapPoints hits the map endpoint', async () => {
    get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const result = await getPestMapPoints();
    expect(get).toHaveBeenCalledWith('/api/vigilancias-fitosanitarias/mapa');
    expect(result).toHaveLength(1);
  });
});
