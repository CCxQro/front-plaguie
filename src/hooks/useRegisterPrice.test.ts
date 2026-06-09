import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../services/products/pricesService', () => ({ registerPrice: vi.fn() }));

import { registerPrice } from '../services/products/pricesService';
import { useRegisterPrice } from './useRegisterPrice';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(registerPrice);

beforeEach(() => vi.clearAllMocks());

describe('useRegisterPrice', () => {
  it('registers a price', async () => {
    mocked.mockResolvedValueOnce({ priceId: 1, skuSellerId: 10, price: '99', date: 'd' } as never);
    const { result } = renderHook(() => useRegisterPrice(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync({ skuSellerId: 10, price: '99.00000' });
    expect(mocked).toHaveBeenCalledWith(10, '99.00000');
  });

  it('surfaces errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocked.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useRegisterPrice(), { wrapper: createQueryWrapper() });
    await expect(result.current.mutateAsync({ skuSellerId: 1, price: '1' })).rejects.toThrow('boom');
  });
});
