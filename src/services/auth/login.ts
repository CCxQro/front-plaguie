import { login as firebaseLogin } from '../firebase/firebaseLogin';
import { apiFetch } from '../api';
import type { User } from '../../types/User';

export const login = async (email: string, password: string) => {
  const firebaseToken = await firebaseLogin(email, password);
  const user = await apiFetch<User>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ firebaseToken }),
    },
  );

  if (!user) {
    throw new Error('No user data received from backend login');
  }

  return { user, token: firebaseToken };
};
