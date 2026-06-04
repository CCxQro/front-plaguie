export interface OrderStatus {
  orderStatusId: number;
  name: string;
}

export interface OrderDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderFarmer {
  farmerId: number;
  name: string;
  email: string;
}

export interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  farmer: OrderFarmer;
  orderStatus: OrderStatus;
  details: OrderDetail[];
  providerShared?: boolean;
}
