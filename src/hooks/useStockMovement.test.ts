import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/products/inventoryService', () => ({
  addStock: vi.fn(),
  removeStock: vi.fn(),
}));

import { addStock, removeStock } from '../services/products/inventoryService';
import { useStockMovement } from './useStockMovement';
import { createQueryWrapper } from '../test/queryWrapper';

const add = vi.mocked(addStock);
const remove = vi.mocked(removeStock);

beforeEach(() => vi.clearAllMocks());

describe('useStockMovement', () => {
  it('calls addStock for an "add" movement', async () => {
    add.mockResolvedValueOnce({ inventoryId: 1 } as never);
    const { result } = renderHook(() => useStockMovement(), { wrapper: createQueryWrapper() });

    await result.current.mutateAsync({ skuSellerId: 10, movement: 'add', cantidad: 5 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(add).toHaveBeenCalledWith(10, 5);
  });

  it('calls removeStock for a "remove" movement', async () => {
    remove.mockResolvedValueOnce({ inventoryId: 2 } as never);
    const { result } = renderHook(() => useStockMovement(), { wrapper: createQueryWrapper() });

    await result.current.mutateAsync({ skuSellerId: 10, movement: 'remove', cantidad: 3 });

    expect(remove).toHaveBeenCalledWith(10, 3);
  });

  it('surfaces errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    add.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() => useStockMovement(), { wrapper: createQueryWrapper() });

    await expect(
      result.current.mutateAsync({ skuSellerId: 1, movement: 'add', cantidad: 1 }),
    ).rejects.toThrow('boom');
  });
});
