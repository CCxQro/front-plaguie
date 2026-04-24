import axios from 'axios';
import api from '../api';

/**
 * Realiza el flujo completo de inicio de sesión:
 * 1. Autenticación en Firebase
 * 2. Envío del token de Firebase al backend local
 */
export const login = async (email: string, password: string) => {
  try {
    // Paso 1: Autenticar con Firebase
    const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
    const firebaseRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const firebaseToken = firebaseRes.data.idToken;

    // Paso 2: Enviar el token al backend utilizando nuestra instancia base
    const response = await api.post('/auth/login', { firebaseToken });

    return response.data;
  } catch (error: any) {
    // Si el error proviene de Firebase (Axios envuelve la respuesta en error.response)
    if (error.response && error.response.data && error.response.data.error) {
        console.error('Firebase auth error:', error.response.data.error.message);
        throw new Error(error.response.data.error.message);
    }
    
    console.error('Login error:', error);
    throw error;
  }
};
