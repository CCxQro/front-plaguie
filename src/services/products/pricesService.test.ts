import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { post: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { registerPrice } from './pricesService';

const post = vi.mocked(backendClient.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('pricesService', () => {
  it('registerPrice posts the price to the product price endpoint', async () => {
    post.mockResolvedValueOnce({
      data: { priceId: 1, skuSellerId: 10, price: '199.99', date: '2026-06-01' },
    });

    const result = await registerPrice(10, '199.99');

    expect(post).toHaveBeenCalledWith('/api/prices/product/10', { price: '199.99' });
    expect(result.priceId).toBe(1);
    expect(result.price).toBe('199.99');
  });
});
