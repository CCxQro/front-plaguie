import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/products/productsService', () => ({ getProductById: vi.fn() }));

import { getProductById } from '../services/products/productsService';
import { useProduct } from './useProduct';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getProductById);

beforeEach(() => vi.clearAllMocks());

describe('useProduct', () => {
  it('fetches the product by id', async () => {
    mocked.mockResolvedValueOnce({ skuSellerId: 42 } as never);

    const { result } = renderHook(() => useProduct(42), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked).toHaveBeenCalledWith(42);
    expect(result.current.data?.skuSellerId).toBe(42);
  });

  it('is disabled when id is null', () => {
    const { result } = renderHook(() => useProduct(null), { wrapper: createQueryWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mocked).not.toHaveBeenCalled();
  });
});
