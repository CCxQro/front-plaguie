import { login as firebaseLogin } from '../firebase/firebaseLogin';
import { backendClient } from '../http/backendClient';
import type { User } from '../../types/User';

export const login = async (email: string, password: string) => {
  const firebaseToken = await firebaseLogin(email, password);

  const { data: user } = await backendClient.post<User>('/api/auth/login', { firebaseToken });

  return { user, token: firebaseToken };
};
