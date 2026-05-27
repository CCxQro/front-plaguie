import { useQuery } from '@tanstack/react-query';
import { getDownloadUrl } from '../services/firebase/storageService';

export function useFirebaseImageUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: ['firebase-image', path],
    queryFn: () => getDownloadUrl(path as string),
    enabled: !!path,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
