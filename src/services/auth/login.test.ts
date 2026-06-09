import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../firebase/firebaseLogin', () => ({
  login: vi.fn(),
}));
vi.mock('../http/backendClient', () => ({
  backendClient: { post: vi.fn() },
}));

import { login as firebaseLogin } from '../firebase/firebaseLogin';
import { backendClient } from '../http/backendClient';
import { login } from './login';

const fbLogin = vi.mocked(firebaseLogin);
const post = vi.mocked(backendClient.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth login', () => {
  it('exchanges a Firebase token for the backend user and returns both', async () => {
    fbLogin.mockResolvedValueOnce('firebase-token-123');
    post.mockResolvedValueOnce({ data: { userId: 1, name: 'Ana', roleId: 2 } });

    const result = await login('ana@plaguie.mx', 'secret');

    expect(fbLogin).toHaveBeenCalledWith('ana@plaguie.mx', 'secret');
    expect(post).toHaveBeenCalledWith('/api/auth/login', { firebaseToken: 'firebase-token-123' });
    expect(result.token).toBe('firebase-token-123');
    expect(result.user.name).toBe('Ana');
  });
});
