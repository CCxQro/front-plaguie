import axios from 'axios';

export const googleWeatherClient = axios.create({
  baseURL: 'https://weather.googleapis.com/v1',
});

// Append the API key to every request's query params automatically.
googleWeatherClient.interceptors.request.use((config) => {
  const key = import.meta.env.VITE_GOOGLE_WEATHER_API_KEY as string;
  config.params = { ...config.params, key };
  return config;
});

// Normalise Google API error messages.
googleWeatherClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status;
    const message: string =
      error.response?.data?.error?.message ??
      error.message ??
      'Google Weather API error';
    return Promise.reject(new Error(status ? `[${status}] ${message}` : message));
  },
);
