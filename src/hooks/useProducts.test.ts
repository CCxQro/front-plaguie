import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/products/productsService', () => ({ getProducts: vi.fn() }));

import { getProducts } from '../services/products/productsService';
import { useProducts } from './useProducts';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getProducts);

beforeEach(() => vi.clearAllMocks());

describe('useProducts', () => {
  it('fetches products with the given filters', async () => {
    mocked.mockResolvedValueOnce([{ skuSellerId: 1 }] as never);

    const { result } = renderHook(() => useProducts({ sellerId: 3 }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked).toHaveBeenCalledWith({ sellerId: 3 });
    expect(result.current.data).toHaveLength(1);
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => useProducts({}, { enabled: false }), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mocked).not.toHaveBeenCalled();
  });
});
