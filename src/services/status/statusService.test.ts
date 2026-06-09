import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { fetchStatus } from './statusService';

const get = vi.mocked(backendClient.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('statusService', () => {
  it('fetchStatus hits /api/status and returns the payload', async () => {
    get.mockResolvedValueOnce({
      data: { status: 'UP', database: 'UP', service: 'plaguie', timestamp: '2026-06-09T00:00:00Z' },
    });

    const result = await fetchStatus();

    expect(get).toHaveBeenCalledWith('/api/status');
    expect(result.status).toBe('UP');
    expect(result.database).toBe('UP');
  });
});
