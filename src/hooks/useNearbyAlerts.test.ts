import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/alerts/nearbyAlertsService', () => ({ getNearbyAlerts: vi.fn() }));

import { getNearbyAlerts } from '../services/alerts/nearbyAlertsService';
import { useNearbyAlerts } from './useNearbyAlerts';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getNearbyAlerts);

beforeEach(() => vi.clearAllMocks());

describe('useNearbyAlerts', () => {
  it('fetches alerts for the given radius', async () => {
    mocked.mockResolvedValueOnce([{ alertaId: 1 }] as never);
    const { result } = renderHook(() => useNearbyAlerts(30, { enabled: true }), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked).toHaveBeenCalledWith(30);
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => useNearbyAlerts(30, { enabled: false }), {
      wrapper: createQueryWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mocked).not.toHaveBeenCalled();
  });
});
