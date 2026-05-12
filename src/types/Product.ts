export interface Product {
  skuSellerId: number;
  sellerId: number;
  sellerName: string;
  name: string;
  sku: string;
  categoryId: number;
  categoryName: string;
  providerId: number;
  providerName: string;
  unitValue: number;
  unitId: number;
  unitName: string;
  description: string;
  statusId: number;
  statusName: string;
  firebaseImageId: string;
}

export interface CreateProductPayload {
  sellerId: number;
  name: string;
  sku: string;
  categoryId: number;
  providerId: number;
  unitValue: number;
  unitId: number;
  description: string;
  statusId: number;
  firebaseImageId: string;
}

export interface Category {
  categoryId: number;
  name: string;
  colorHexa: string;
}

export interface Provider {
  providerId: number;
  name: string;
}

export interface Unit {
  unitId: number;
  name: string;
}

export interface TechnicalSeller {
  technicalSellerId: number;
  user: { email: string; name: string };
}
