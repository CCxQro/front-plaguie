import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { EnrichedClient } from '../../services/clients/clientsAggregator';

// Fix Leaflet default icon paths when bundling with Vite.
// Without this, marker images resolve incorrectly and fail to render.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function buildIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 42" width="30" height="42">
      <path d="M15 0C7.27 0 1 6.27 1 14c0 9.85 12.5 26.5 13 27.18a1.6 1.6 0 0 0 2.55 0C16.5 40.5 29 23.85 29 14 29 6.27 22.73 0 15 0Z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="15" cy="14" r="5" fill="white"/>
    </svg>
  `.trim();
  return L.divIcon({
    html: svg,
    className: 'client-map-marker',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
}

function colorForClient(client: EnrichedClient): string {
  if (client.totalOrders === 0) return '#94A3B8';
  if (client.totalSpent >= 10000) return '#16A34A';
  if (client.totalSpent >= 1000) return '#2563EB';
  return '#F97316';
}

interface FitBoundsProps {
  points: Array<[number, number]>;
}

function FitBounds({ points }: FitBoundsProps) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 10);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

export interface ClientMapProps {
  clients: EnrichedClient[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}

export function ClientMap({ clients, selectedClientId, onSelectClient }: ClientMapProps) {
  const markerRefs = useRef<Record<string, L.Marker>>({});

  const points = useMemo<Array<[number, number]>>(
    () => clients.map((c) => [c.lat, c.lng]),
    [clients],
  );

  useEffect(() => {
    if (!selectedClientId) return;
    const marker = markerRefs.current[selectedClientId];
    if (marker) marker.openPopup();
  }, [selectedClientId]);

  const fallbackCenter: [number, number] = [23.6345, -102.5528]; // Center of Mexico

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#E2E8F0] bg-white" data-testid="client-map">
      <MapContainer
        center={points[0] ?? fallbackCenter}
        zoom={points.length > 0 ? 6 : 5}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {clients.map((client) => (
          <Marker
            key={client.clientId}
            position={[client.lat, client.lng]}
            icon={buildIcon(colorForClient(client))}
            ref={(ref) => {
              if (ref) markerRefs.current[client.clientId] = ref;
              else delete markerRefs.current[client.clientId];
            }}
            eventHandlers={{
              click: () => onSelectClient(client.clientId),
            }}
          >
            <Popup>
              <div className="font-sans">
                <p className="text-sm font-semibold text-[#0F172A]">{client.clientName}</p>
                <p className="text-xs text-[#64748B]">
                  {client.totalOrders} {client.totalOrders === 1 ? 'pedido' : 'pedidos'}
                </p>
                <p className="text-xs text-[#64748B]">
                  Total: ${client.totalSpent.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <button
                  type="button"
                  className="mt-2 cursor-pointer text-xs font-medium text-[#16A34A] hover:underline"
                  onClick={() => onSelectClient(client.clientId)}
                >
                  Ver detalles
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ClientMap;
