import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/admin/adminMetricsService', () => ({ getAdminMetrics: vi.fn() }));

import { getAdminMetrics } from '../services/admin/adminMetricsService';
import { useAdminMetrics } from './useAdminMetrics';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getAdminMetrics);

beforeEach(() => vi.clearAllMocks());

describe('useAdminMetrics', () => {
  it('fetches admin metrics', async () => {
    mocked.mockResolvedValueOnce({ totalUsers: 10 } as never);
    const { result } = renderHook(() => useAdminMetrics(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.totalUsers).toBe(10);
  });
});
