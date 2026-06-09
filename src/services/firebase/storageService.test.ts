import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase/storage', () => ({
  ref: vi.fn((_storage, path) => ({ path })),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
}));
vi.mock('./firebaseStorage', () => ({ storage: {} }));

import { uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { deleteFile, getDownloadUrl, uploadFile } from './storageService';

const upload = vi.mocked(uploadBytesResumable);
const getUrl = vi.mocked(getDownloadURL);
const del = vi.mocked(deleteObject);

beforeEach(() => vi.clearAllMocks());

describe('storageService', () => {
  it('uploadFile reports progress and resolves with the download URL', async () => {
    upload.mockReturnValue({
      snapshot: { ref: 'finalRef' },
      on: (_event: string, progress: (s: { bytesTransferred: number; totalBytes: number }) => void, _err: unknown, complete: () => void) => {
        progress({ bytesTransferred: 50, totalBytes: 100 });
        complete();
      },
    } as never);
    getUrl.mockResolvedValueOnce('https://download/url');

    const onProgress = vi.fn();
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const url = await uploadFile(file, 'users/u/a.png', onProgress);

    expect(onProgress).toHaveBeenCalledWith(50);
    expect(url).toBe('https://download/url');
  });

  it('uploadFile rejects on a storage error', async () => {
    upload.mockReturnValue({
      snapshot: { ref: 'r' },
      on: (_event: string, _progress: unknown, err: (e: Error) => void) => {
        err(new Error('upload failed'));
      },
    } as never);

    await expect(uploadFile(new File(['x'], 'a.png'), 'p')).rejects.toThrow('upload failed');
  });

  it('getDownloadUrl returns the URL', async () => {
    getUrl.mockResolvedValueOnce('https://u');
    expect(await getDownloadUrl('p')).toBe('https://u');
  });

  it('deleteFile resolves on success', async () => {
    del.mockResolvedValueOnce(undefined as never);
    await expect(deleteFile('p')).resolves.toBeUndefined();
  });

  it('deleteFile ignores object-not-found errors', async () => {
    del.mockRejectedValueOnce({ code: 'storage/object-not-found' } as never);
    await expect(deleteFile('p')).resolves.toBeUndefined();
  });

  it('deleteFile rethrows other errors', async () => {
    del.mockRejectedValueOnce({ code: 'storage/unauthorized' } as never);
    await expect(deleteFile('p')).rejects.toMatchObject({ code: 'storage/unauthorized' });
  });
});
