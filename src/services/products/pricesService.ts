import { backendClient } from '../http/backendClient';

export interface PriceResponse {
  priceId: number;
  skuSellerId: number;
  price: string;
  date: string;
}

export async function registerPrice(
  skuSellerId: number,
  price: string,
): Promise<PriceResponse> {
  const { data } = await backendClient.post<PriceResponse>(
    `/api/prices/product/${skuSellerId}`,
    { price },
  );
  return data;
}
