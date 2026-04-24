import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores pueden ser agregados aquí
api.interceptors.request.use(
  (config) => {
    // Ejemplo: agregar token de autorización
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
