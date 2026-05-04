import { backendClient } from '../http/backendClient';
import type { AdminUser, RegisterUserPayload, UpdateUserPayload } from '../../types/AdminUser';

export async function getUsers(): Promise<AdminUser[]> {
  const { data } = await backendClient.get<AdminUser[]>('/api/users');
  return data;
}

export async function getUserById(id: number): Promise<AdminUser> {
  const { data } = await backendClient.get<AdminUser>(`/api/users/${id}`);
  return data;
}

export async function updateUserById(id: number, payload: UpdateUserPayload): Promise<AdminUser> {
  const { data } = await backendClient.put<AdminUser>(`/api/users/${id}`, payload);
  return data;
}

export async function deactivateUserById(id: number): Promise<void> {
  await backendClient.delete(`/api/users/${id}`);
}

export async function registerUser(payload: RegisterUserPayload): Promise<AdminUser> {
  const { data } = await backendClient.post<AdminUser>('/api/auth/register', payload);
  return data;
}
