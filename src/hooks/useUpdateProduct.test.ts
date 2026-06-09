import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../services/firebase/firebaseAuth', () => ({ auth: { currentUser: { uid: 'u1' } } }));
vi.mock('../services/firebase/storageService', () => ({ uploadFile: vi.fn() }));
vi.mock('../services/products/productsService', () => ({ updateProduct: vi.fn() }));

import { auth } from '../services/firebase/firebaseAuth';
import { uploadFile } from '../services/firebase/storageService';
import { updateProduct } from '../services/products/productsService';
import { useUpdateProduct } from './useUpdateProduct';
import { createQueryWrapper } from '../test/queryWrapper';

const upload = vi.mocked(uploadFile);
const update = vi.mocked(updateProduct);

beforeEach(() => {
  vi.clearAllMocks();
  (auth as { currentUser: { uid: string } | null }).currentUser = { uid: 'u1' };
});

describe('useUpdateProduct', () => {
  it('updates without uploading when there is no image', async () => {
    update.mockResolvedValueOnce({ skuSellerId: 1 } as never);
    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createQueryWrapper() });

    await result.current.mutateAsync({ skuSellerId: 1, payload: { name: 'X' } as never });

    expect(upload).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(1, { name: 'X' });
  });

  it('uploads the new image and includes the path when provided', async () => {
    upload.mockResolvedValueOnce(undefined as never);
    update.mockResolvedValueOnce({ skuSellerId: 1 } as never);
    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createQueryWrapper() });

    await result.current.mutateAsync({
      skuSellerId: 1,
      payload: { name: 'X' } as never,
      imageFile: new File(['x'], 'img.png', { type: 'image/png' }),
    });

    expect(upload).toHaveBeenCalledTimes(1);
    expect(update.mock.calls[0][1]).toMatchObject({ firebaseImageId: expect.stringContaining('users/u1/') });
  });

  it('throws when uploading without an authenticated user', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    (auth as { currentUser: { uid: string } | null }).currentUser = null;
    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createQueryWrapper() });

    await expect(
      result.current.mutateAsync({
        skuSellerId: 1,
        payload: { name: 'X' } as never,
        imageFile: new File(['x'], 'img.png'),
      }),
    ).rejects.toThrow(/No autenticado/);
  });
});
