import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import {
  approveFarmer,
  deactivateUserById,
  getFarmerByUserId,
  getPendingFarmers,
  getUserById,
  getUsers,
  registerUser,
  rejectFarmer,
  updateUserById,
} from './users';

const get = vi.mocked(backendClient.get);
const post = vi.mocked(backendClient.post);
const put = vi.mocked(backendClient.put);
const del = vi.mocked(backendClient.delete);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('admin users service', () => {
  it('getUsers forwards params', async () => {
    get.mockResolvedValueOnce({ data: { content: [], totalElements: 0 } });
    const params = { page: 0, size: 10 } as never;
    await getUsers(params);
    expect(get).toHaveBeenCalledWith('/api/users', { params });
  });

  it('getUserById hits /api/users/:id', async () => {
    get.mockResolvedValueOnce({ data: { userId: 3 } });
    await getUserById(3);
    expect(get).toHaveBeenCalledWith('/api/users/3');
  });

  it('updateUserById puts payload', async () => {
    const payload = { name: 'New' } as never;
    put.mockResolvedValueOnce({ data: { userId: 3 } });
    await updateUserById(3, payload);
    expect(put).toHaveBeenCalledWith('/api/users/3', payload);
  });

  it('deactivateUserById deletes the user', async () => {
    del.mockResolvedValueOnce({ data: undefined });
    await deactivateUserById(3);
    expect(del).toHaveBeenCalledWith('/api/users/3');
  });

  it('registerUser posts to /api/auth/register', async () => {
    const payload = { email: 'a@b.com' } as never;
    post.mockResolvedValueOnce({ data: { userId: 9 } });
    await registerUser(payload);
    expect(post).toHaveBeenCalledWith('/api/auth/register', payload);
  });

  it('getPendingFarmers hits the pending queue', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await getPendingFarmers();
    expect(get).toHaveBeenCalledWith('/api/users/farmers/pending');
  });

  it('getFarmerByUserId hits the farmer path', async () => {
    get.mockResolvedValueOnce({ data: { userId: 5 } });
    await getFarmerByUserId(5);
    expect(get).toHaveBeenCalledWith('/api/users/farmers/5');
  });

  it('approveFarmer posts to the approve endpoint', async () => {
    post.mockResolvedValueOnce({ data: undefined });
    await approveFarmer(5);
    expect(post).toHaveBeenCalledWith('/api/users/farmers/5/approve');
  });

  it('rejectFarmer posts to the reject endpoint', async () => {
    post.mockResolvedValueOnce({ data: undefined });
    await rejectFarmer(5);
    expect(post).toHaveBeenCalledWith('/api/users/farmers/5/reject');
  });
});
