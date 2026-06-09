import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/status/statusService', () => ({ fetchStatus: vi.fn() }));

import { fetchStatus } from '../services/status/statusService';
import { useStatus } from './useStatus';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(fetchStatus);

beforeEach(() => vi.clearAllMocks());

describe('useStatus', () => {
  it('returns backend status on success', async () => {
    mocked.mockResolvedValueOnce({
      status: 'UP',
      database: 'UP',
      service: 'plaguie',
      timestamp: '2026-06-09T00:00:00Z',
    });

    const { result } = renderHook(() => useStatus(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('UP');
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});
