import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../services/firebase/storageService';
import { auth } from '../services/firebase/firebaseAuth';

export function useStorageUpload() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (file: File): Promise<string> => {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Not authenticated — please log in again.');
      const path = `users/${uid}/${Date.now()}_${file.name}`;
      return uploadFile(file, path, setProgress);
    },
    onSettled: () => setProgress(0),
  });

  return { ...mutation, progress };
}
