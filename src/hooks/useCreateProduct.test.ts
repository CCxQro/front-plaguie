import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../services/firebase/firebaseAuth', () => ({ auth: { currentUser: { uid: 'u1' } } }));
vi.mock('../services/firebase/storageService', () => ({ uploadFile: vi.fn() }));
vi.mock('../services/products/productsService', () => ({ createProduct: vi.fn() }));

import { auth } from '../services/firebase/firebaseAuth';
import { uploadFile } from '../services/firebase/storageService';
import { createProduct } from '../services/products/productsService';
import { useCreateProduct } from './useCreateProduct';
import { createQueryWrapper } from '../test/queryWrapper';

const upload = vi.mocked(uploadFile);
const create = vi.mocked(createProduct);

const input = {
  imageFile: new File(['x'], 'img.png', { type: 'image/png' }),
  sellerId: 1,
  name: 'NPK',
  sku: 'NPK-1',
  categoryId: 1,
  providerId: 1,
  unitValue: 1,
  unitId: 1,
  description: 'desc',
  price: '100',
  stock: 10,
};

beforeEach(() => {
  vi.clearAllMocks();
  (auth as { currentUser: { uid: string } | null }).currentUser = { uid: 'u1' };
});

describe('useCreateProduct', () => {
  it('uploads the image then creates the product', async () => {
    upload.mockResolvedValueOnce(undefined as never);
    create.mockResolvedValueOnce({ skuSellerId: 1 } as never);

    const { result } = renderHook(() => useCreateProduct(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync(input);

    expect(upload).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0]).toMatchObject({ name: 'NPK', statusId: 1, firebaseImageId: expect.stringContaining('users/u1/') });
  });

  it('throws when there is no authenticated user', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    (auth as { currentUser: { uid: string } | null }).currentUser = null;

    const { result } = renderHook(() => useCreateProduct(), { wrapper: createQueryWrapper() });
    await expect(result.current.mutateAsync(input)).rejects.toThrow(/No autenticado/);
    expect(create).not.toHaveBeenCalled();
  });
});
