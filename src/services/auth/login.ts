import api from '../api';
import { login as firebaseLogin } from '../firebase/firebaseLogin';

export const login = async (email: string, password: string) => {
  try {
    // Autenticar con Firebase usando el SDK
    const firebaseToken = await firebaseLogin(email, password);

    // Enviar el token al backend utilizando nuestra instancia base
    const response = await api.post('/auth/login', { firebaseToken });

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};
