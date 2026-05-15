import { backendClient } from '../http/backendClient';

export interface OrderDetailItemResponse {
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
}

export interface SellerOrderResponse {
  orderId: number;
  farmerId: number;
  farmerName: string;
  sellerId: number;
  sellerName: string;
  orderDate: string;
  orderStatusId: number;
  orderStatusName: string;
  totalAmount: number;
  details?: OrderDetailItemResponse[];
}

export const ordersService = {
  async getSellerOrders(): Promise<SellerOrderResponse[]> {
    const { data } = await backendClient.get<SellerOrderResponse[]>('/api/orders');
    return data;
  },

  async getOrderById(orderId: number): Promise<SellerOrderResponse> {
    const { data } = await backendClient.get<SellerOrderResponse>(`/api/orders/${orderId}`);
    return data;
  },
};
