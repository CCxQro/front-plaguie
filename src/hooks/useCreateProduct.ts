import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../services/firebase/firebaseAuth';
import { uploadFile } from '../services/firebase/storageService';
import { createProduct } from '../services/products/productsService';
import type { CreateProductPayload } from '../types/Product';

export interface CreateProductInput {
  imageFile: File;
  sellerId: number;
  name: string;
  sku: string;
  categoryId: number;
  providerId: number;
  unitValue: number;
  unitId: number;
  description: string;
  price: string;
  stock: number;
  onProgress?: (percent: number) => void;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProductInput): Promise<void> => {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('No autenticado. Por favor inicia sesión de nuevo.');

      const storagePath = `users/${uid}/${Date.now()}_${input.imageFile.name}`;
      await uploadFile(input.imageFile, storagePath, input.onProgress);

      const payload: CreateProductPayload = {
        sellerId: input.sellerId,
        name: input.name,
        sku: input.sku,
        categoryId: input.categoryId,
        providerId: input.providerId,
        unitValue: input.unitValue,
        unitId: input.unitId,
        description: input.description,
        statusId: 1,
        firebaseImageId: storagePath,
        price: input.price,
        stock: input.stock,
      };

      await createProduct(payload);
    },
    onError: (err) => {
      console.error('[useCreateProduct] upload or backend error:', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
