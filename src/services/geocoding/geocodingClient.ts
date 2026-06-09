import axios from 'axios';

// Nominatim (OpenStreetMap) reverse-geocoding. Free and key-less, which fits the
// existing Leaflet/OSM map stack. Keep request volume low per Nominatim's usage
// policy — we only call it on a deliberate map click / marker drag.
export const geocodingClient = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  headers: { Accept: 'application/json' },
});

// Normalise errors so callers always receive a plain Error with a Spanish message.
geocodingClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ??
      error?.message ??
      'No se pudo obtener la ubicación.';
    return Promise.reject(new Error(message));
  },
);
