import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../services/firebase/firebaseAuth';
import { uploadFile } from '../services/firebase/storageService';
import { updateProduct } from '../services/products/productsService';
import type { Product, UpdateProductPayload } from '../types/Product';

export interface UpdateProductInput {
  skuSellerId: number;
  payload: UpdateProductPayload;
  imageFile?: File | null;
  onProgress?: (percent: number) => void;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateProductInput>({
    mutationFn: async ({ skuSellerId, payload, imageFile, onProgress }) => {
      let finalPayload = payload;
      if (imageFile) {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('No autenticado. Por favor inicia sesión de nuevo.');

        const storagePath = `users/${uid}/${Date.now()}_${imageFile.name}`;
        await uploadFile(imageFile, storagePath, onProgress);
        finalPayload = { ...payload, firebaseImageId: storagePath };
      }
      return updateProduct(skuSellerId, finalPayload);
    },
    onError: (err) => {
      console.error('[useUpdateProduct] error:', err);
    },
    onSuccess: (_data, { skuSellerId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', skuSellerId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
