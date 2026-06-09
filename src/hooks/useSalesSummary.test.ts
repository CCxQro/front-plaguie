import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/sales/salesSummaryService', () => ({ getSalesSummary: vi.fn() }));

import { getSalesSummary } from '../services/sales/salesSummaryService';
import { useSalesSummary } from './useSalesSummary';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getSalesSummary);

beforeEach(() => vi.clearAllMocks());

describe('useSalesSummary', () => {
  it('fetches the sales summary for the given range', async () => {
    mocked.mockResolvedValueOnce({ metrics: { totalEarnings: 100 } } as never);
    const { result } = renderHook(() => useSalesSummary('2026-01-01', '2026-01-31'), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
  });
});
