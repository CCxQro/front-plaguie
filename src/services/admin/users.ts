import { apiFetch } from '../api';
import type { AdminUser, RegisterUserPayload, UpdateUserPayload } from '../../types/AdminUser';

export async function getUsers(token: string): Promise<AdminUser[]> {
  const response = await apiFetch<AdminUser[]>('/api/users', {}, token);
  return response ?? [];
}

export async function getUserById(id: number, token: string): Promise<AdminUser> {
  const response = await apiFetch<AdminUser>(`/api/users/${id}`, {}, token);
  if (!response) {
    throw new Error('No user returned by backend');
  }
  return response;
}

export async function updateUserById(id: number, payload: UpdateUserPayload, token: string): Promise<AdminUser> {
  const response = await apiFetch<AdminUser>(
    `/api/users/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );

  if (!response) {
    throw new Error('No user returned after update');
  }

  return response;
}

export async function deactivateUserById(id: number, token: string): Promise<void> {
  await apiFetch<null>(
    `/api/users/${id}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

export async function registerUser(payload: RegisterUserPayload, token: string): Promise<AdminUser> {
  const response = await apiFetch<AdminUser>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );

  if (!response) {
    throw new Error('No user returned after register');
  }

  return response;
}
