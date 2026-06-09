import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('../services/firebase/storageService', () => ({ uploadFile: vi.fn() }));
vi.mock('../services/firebase/firebaseAuth', () => ({ auth: { currentUser: { uid: 'u1' } } }));

import { uploadFile } from '../services/firebase/storageService';
import { auth } from '../services/firebase/firebaseAuth';
import { useStorageUpload } from './useStorageUpload';
import { createQueryWrapper } from '../test/queryWrapper';

const upload = vi.mocked(uploadFile);

beforeEach(() => {
  vi.clearAllMocks();
  (auth as { currentUser: { uid: string } | null }).currentUser = { uid: 'u1' };
});

describe('useStorageUpload', () => {
  it('uploads the file under the user path and returns the URL', async () => {
    upload.mockResolvedValueOnce('https://download/url');
    const { result } = renderHook(() => useStorageUpload(), { wrapper: createQueryWrapper() });

    const url = await result.current.mutateAsync(new File(['x'], 'a.png', { type: 'image/png' }));

    expect(url).toBe('https://download/url');
    expect(upload.mock.calls[0][1]).toContain('users/u1/');
  });

  it('throws when there is no authenticated user', async () => {
    (auth as { currentUser: { uid: string } | null }).currentUser = null;
    const { result } = renderHook(() => useStorageUpload(), { wrapper: createQueryWrapper() });

    await expect(result.current.mutateAsync(new File(['x'], 'a.png'))).rejects.toThrow(/Not authenticated/);
    expect(upload).not.toHaveBeenCalled();
  });
});
