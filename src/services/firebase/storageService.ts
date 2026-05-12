import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import type { StorageError, UploadMetadata } from 'firebase/storage';
import { storage } from './firebaseStorage';

export function uploadFile(
  file: File,
  path: string,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, path);
    const metadata: UploadMetadata = { contentType: file.type };
    const task = uploadBytesResumable(fileRef, file, metadata);

    task.on(
      'state_changed',
      (snap) => {
        onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}

export async function deleteFile(path: string): Promise<void> {
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    const e = err as StorageError;
    if (e.code !== 'storage/object-not-found') throw e;
  }
}
