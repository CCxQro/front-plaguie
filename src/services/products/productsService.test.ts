import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

import { backendClient } from '../http/backendClient';
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProductById,
  getProducts,
  getProviders,
  getTechnicalSellerByUserId,
  getUnits,
  updateProduct,
  validateProduct,
} from './productsService';

const get = vi.mocked(backendClient.get);
const post = vi.mocked(backendClient.post);
const put = vi.mocked(backendClient.put);
const del = vi.mocked(backendClient.delete);
const patch = vi.mocked(backendClient.patch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('productsService', () => {
  it('getCategories hits /api/categories', async () => {
    get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Fertilizantes' }] });
    const result = await getCategories();
    expect(get).toHaveBeenCalledWith('/api/categories');
    expect(result).toHaveLength(1);
  });

  it('getProviders hits /api/providers', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await getProviders();
    expect(get).toHaveBeenCalledWith('/api/providers');
  });

  it('getUnits hits /api/units', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await getUnits();
    expect(get).toHaveBeenCalledWith('/api/units');
  });

  it('getTechnicalSellerByUserId hits the user path', async () => {
    get.mockResolvedValueOnce({ data: { id: 7 } });
    await getTechnicalSellerByUserId(7);
    expect(get).toHaveBeenCalledWith('/api/users/technical-sellers/7');
  });

  it('getProductById hits /api/products/:id', async () => {
    get.mockResolvedValueOnce({ data: { skuSellerId: 42 } });
    const product = await getProductById(42);
    expect(get).toHaveBeenCalledWith('/api/products/42');
    expect(product.skuSellerId).toBe(42);
  });

  it('createProduct posts the payload', async () => {
    const payload = { name: 'NPK' } as never;
    post.mockResolvedValueOnce({ data: { skuSellerId: 1 } });
    await createProduct(payload);
    expect(post).toHaveBeenCalledWith('/api/products', payload);
  });

  it('updateProduct puts to /api/products/:id', async () => {
    const payload = { name: 'NPK v2' } as never;
    put.mockResolvedValueOnce({ data: { skuSellerId: 1 } });
    await updateProduct(1, payload);
    expect(put).toHaveBeenCalledWith('/api/products/1', payload);
  });

  it('deleteProduct deletes /api/products/:id', async () => {
    del.mockResolvedValueOnce({ data: undefined });
    await deleteProduct(9);
    expect(del).toHaveBeenCalledWith('/api/products/9');
  });

  it('validateProduct patches with statusId', async () => {
    patch.mockResolvedValueOnce({ data: { skuSellerId: 1 } });
    await validateProduct(1, 2);
    expect(patch).toHaveBeenCalledWith('/api/products/1/validate', { statusId: 2 });
  });

  describe('getProducts filter precedence', () => {
    it('uses sellerId when provided', async () => {
      get.mockResolvedValueOnce({ data: [] });
      await getProducts({ sellerId: 5, providerId: 9, statusId: 1 });
      expect(get).toHaveBeenCalledWith('/api/products', { params: { sellerId: 5 } });
    });

    it('falls back to providerId when no sellerId', async () => {
      get.mockResolvedValueOnce({ data: [] });
      await getProducts({ providerId: 9, statusId: 1 });
      expect(get).toHaveBeenCalledWith('/api/products', { params: { providerId: 9 } });
    });

    it('falls back to statusId when no seller/provider', async () => {
      get.mockResolvedValueOnce({ data: [] });
      await getProducts({ statusId: 1 });
      expect(get).toHaveBeenCalledWith('/api/products', { params: { statusId: 1 } });
    });

    it('sends empty params with no filters', async () => {
      get.mockResolvedValueOnce({ data: [] });
      await getProducts();
      expect(get).toHaveBeenCalledWith('/api/products', { params: {} });
    });
  });
});
