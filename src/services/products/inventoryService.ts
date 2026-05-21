import { backendClient } from '../http/backendClient';

export interface InventoryMovementResponse {
  inventoryId: number;
  skuSellerId: number;
  cantidad: number;
  inventoryActionId: number;
}

export async function addStock(
  skuSellerId: number,
  cantidad: number,
): Promise<InventoryMovementResponse> {
  const { data } = await backendClient.post<InventoryMovementResponse>(
    `/api/inventory/product/${skuSellerId}/add`,
    { cantidad },
  );
  return data;
}

export async function removeStock(
  skuSellerId: number,
  cantidad: number,
): Promise<InventoryMovementResponse> {
  const { data } = await backendClient.post<InventoryMovementResponse>(
    `/api/inventory/product/${skuSellerId}/remove`,
    { cantidad },
  );
  return data;
}
