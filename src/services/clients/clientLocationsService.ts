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
  latitude: number;
  longitude: number;
  locationId: number;
}

export async function getClientLocations(): Promise<ClientLocation[]> {
  const { data } = await backendClient.get<FarmerLocationResponse[]>('/api/orders/farmer-locations');

  const seen = new Set<number>();
  const locations: ClientLocation[] = [];

  for (const r of data) {
    if (seen.has(r.farmerId)) continue;
    seen.add(r.farmerId);
    locations.push({
      clientId: String(r.farmerId),
      clientName: r.farmerName,
      lat: r.latitude,
      lng: r.longitude,
    });
  }

  return locations;
}
