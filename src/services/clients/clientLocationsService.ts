import { backendClient } from '../http/backendClient';

export interface ClientLocation {
  clientId: string;
  clientName: string;
  lat: number;
  lng: number;
}

/**
 * Fetch the list of client locations associated with the logged-in user.
 * The bearer token is injected automatically by backendClient's request interceptor.
 *
 * TODO: Remove the mock block and uncomment the real call once
 *       GET /api/clients/locations is deployed in the backend.
 */
export async function getClientLocations(): Promise<ClientLocation[]> {
  // --- Mock (remove when backend is ready) ---
  void backendClient; // keep import live so the swap is one line
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { clientId: '1', clientName: 'Rancho El Norte',   lat: 25.6866, lng: -100.3161 }, // Monterrey
        { clientId: '2', clientName: 'Hacienda Centro',   lat: 19.4326, lng: -99.1332  }, // CDMX
        { clientId: '3', clientName: 'Finca Sur',         lat: 20.9674, lng: -89.5926  }, // Mérida
        { clientId: '4', clientName: 'Cultivos Noroeste', lat: 29.0729, lng: -110.9559 }, // Hermosillo
        { clientId: '5', clientName: 'Granja Este',       lat: 20.1011, lng: -98.7624  }, // Pachuca
      ]);
    }, 250);
  });

  // --- Real implementation (uncomment when backend is ready) ---
  // const { data } = await backendClient.get<ClientLocation[]>('/api/clients/locations');
  // return data;
}
