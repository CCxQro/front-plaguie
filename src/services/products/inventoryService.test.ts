import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { post: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { addStock, removeStock } from './inventoryService';

const post = vi.mocked(backendClient.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('inventoryService', () => {
  it('addStock posts to the add endpoint', async () => {
    post.mockResolvedValueOnce({
      data: { inventoryId: 1, skuSellerId: 10, cantidad: 5, inventoryActionId: 1 },
    });

    const result = await addStock(10, 5);

    expect(post).toHaveBeenCalledWith('/api/inventory/product/10/add', { cantidad: 5 });
    expect(result.cantidad).toBe(5);
  });

  it('removeStock posts to the remove endpoint', async () => {
    post.mockResolvedValueOnce({
      data: { inventoryId: 2, skuSellerId: 10, cantidad: 3, inventoryActionId: 2 },
    });

    const result = await removeStock(10, 3);

    expect(post).toHaveBeenCalledWith('/api/inventory/product/10/remove', { cantidad: 3 });
    expect(result.inventoryActionId).toBe(2);
  });
});
