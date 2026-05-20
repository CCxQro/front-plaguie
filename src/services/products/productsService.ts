import { backendClient } from '../http/backendClient';
import type {
  Category,
  CreateProductPayload,
  Product,
  ProductFilters,
  Provider,
  TechnicalSeller,
  Unit,
  UpdateProductPayload,
} from '../../types/Product';

export async function getCategories(): Promise<Category[]> {
  const { data } = await backendClient.get<Category[]>('/api/categories');
  return data;
}

export async function getProviders(): Promise<Provider[]> {
  const { data } = await backendClient.get<Provider[]>('/api/providers');
  return data;
}

export async function getUnits(): Promise<Unit[]> {
  const { data } = await backendClient.get<Unit[]>('/api/units');
  return data;
}

export async function getTechnicalSellerByUserId(userId: number): Promise<TechnicalSeller> {
  const { data } = await backendClient.get<TechnicalSeller>(`/api/users/technical-sellers/${userId}`);
  return data;
}

export async function getProductById(skuSellerId: number): Promise<Product> {
  const { data } = await backendClient.get<Product>(`/api/products/${skuSellerId}`);
  return data;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await backendClient.post<Product>('/api/products', payload);
  return data;
}

export async function updateProduct(
  skuSellerId: number,
  payload: UpdateProductPayload,
): Promise<Product> {
  const { data } = await backendClient.put<Product>(`/api/products/${skuSellerId}`, payload);
  return data;
}

export async function deleteProduct(skuSellerId: number): Promise<void> {
  await backendClient.delete(`/api/products/${skuSellerId}`);
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params: Record<string, number> = {};
  if (filters.sellerId !== undefined) params.sellerId = filters.sellerId;
  else if (filters.providerId !== undefined) params.providerId = filters.providerId;
  else if (filters.statusId !== undefined) params.statusId = filters.statusId;

  const { data } = await backendClient.get<Product[]>('/api/products', { params });
  return data;
}
