import axios from 'axios';
import useAuthStore from '../Contexts/useAuthStore';

export const backendClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the bearer token from the auth store on every outgoing request.
backendClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise backend error messages so callers always receive a plain Error.
// A 403 mid-session means the account was deactivated — clear the session and go to /login.
backendClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      useAuthStore.getState().logout();
      sessionStorage.setItem(
        'login-flash',
        'Tu sesión ha finalizado. Tu cuenta puede haber sido desactivada.',
      );
      window.location.replace('/login');
      return new Promise(() => {});
    }

    const message: string =
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      'Request failed';
    return Promise.reject(new Error(message));
  },
);
