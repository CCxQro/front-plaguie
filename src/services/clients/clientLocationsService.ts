import { backendClient } from '../http/backendClient';

export interface ClientLocation {
  clientId: string;
  clientName: string;
  lat: number;
  lng: number;
}

interface FarmerLocationResponse {
  farmerId: number;
  farmerName: string;
  orderId: number;
  latitude: number | null;
  longitude: number | null;
  locationId: number | null;
}

export async function getClientLocations(): Promise<ClientLocation[]> {
  const { data } = await backendClient.get<FarmerLocationResponse[]>('/api/orders/farmer-locations');

  const seen = new Set<number>();
  const locations: ClientLocation[] = [];

  for (const r of data) {
    if (seen.has(r.farmerId)) continue;
    seen.add(r.farmerId);
    // Skip clients whose location has not been set in the database yet
    if (r.latitude == null || r.longitude == null) continue;
    locations.push({
      clientId: String(r.farmerId),
      clientName: r.farmerName,
      lat: r.latitude,
      lng: r.longitude,
    });
  }

  return locations;
}
