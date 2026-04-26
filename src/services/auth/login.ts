import api from '../api';
import { login as firebaseLogin } from '../firebase/firebaseLogin';

export const login = async (email: string, password: string) => {
  try {
    // Autenticar con Firebase usando el SDK
    const firebaseToken = await firebaseLogin(email, password);

    // Enviar el token al backend utilizando nuestra instancia base
    const response = await api.post('/auth/login', { firebaseToken });

    return { user: response.data, token: firebaseToken };
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};
