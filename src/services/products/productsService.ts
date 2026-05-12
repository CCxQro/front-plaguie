import { backendClient } from '../http/backendClient';
import type {
  Category,
  CreateProductPayload,
  Product,
  Provider,
  TechnicalSeller,
  Unit,
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

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await backendClient.post<Product>('/api/products', payload);
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await backendClient.get<Product[]>('/api/products');
  return data;
}
