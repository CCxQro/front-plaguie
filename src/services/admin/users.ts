import { backendClient } from '../http/backendClient';
import type { DataUser, DataUserDetail, PendingFarmer, RegisterUserPayload, UpdateUserPayload, UserListParams, UsersPage } from '../../types/DataUser';

export async function getUsers(params: UserListParams): Promise<UsersPage> {
  const { data } = await backendClient.get<UsersPage>('/api/users', { params });
  return data;
}

export async function getUserById(id: number): Promise<DataUserDetail> {
  const { data } = await backendClient.get<DataUserDetail>(`/api/users/${id}`);
  return data;
}

export async function updateUserById(id: number, payload: UpdateUserPayload): Promise<DataUserDetail> {
  const { data } = await backendClient.put<DataUserDetail>(`/api/users/${id}`, payload);
  return data;
}

export async function deactivateUserById(id: number): Promise<void> {
  await backendClient.delete(`/api/users/${id}`);
}

export async function registerUser(payload: RegisterUserPayload): Promise<DataUser> {
  const { data } = await backendClient.post<DataUser>('/api/auth/register', payload);
  return data;
}

/** Farmer accounts pending administrator approval (status = Revision). */
export async function getPendingFarmers(): Promise<PendingFarmer[]> {
  const { data } = await backendClient.get<PendingFarmer[]>('/api/users/farmers/pending');
  return data;
}

/** Approve a pending farmer account (status -> Accepted). */
export async function approveFarmer(userId: number): Promise<void> {
  await backendClient.post(`/api/users/farmers/${userId}/approve`);
}

/** Reject a pending farmer account (status -> Rejected). */
export async function rejectFarmer(userId: number): Promise<void> {
  await backendClient.post(`/api/users/farmers/${userId}/reject`);
}
