import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/products/productsService', () => ({ getUnits: vi.fn() }));

import { getUnits } from '../services/products/productsService';
import { useUnits } from './useUnits';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getUnits);

beforeEach(() => vi.clearAllMocks());

describe('useUnits', () => {
  it('fetches the units list', async () => {
    mocked.mockResolvedValueOnce([{ unitId: 1, name: 'Litro' }] as never);
    const { result } = renderHook(() => useUnits(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});
