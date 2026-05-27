import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ClientMapItem } from '../../services/sales/salesClientsService';

// Fix Leaflet default icon paths when bundling with Vite
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

// ── Severity colours (matching design system) ─────────────────────────────────
const SEVERITY_COLORS = {
  critico:     '#FB2C36',
  advertencia: '#FF6900',
  informacion: '#2B7FFF',
  none:        '#75C79E',
} as const;

type SeverityKey = keyof typeof SEVERITY_COLORS;

function markerColor(client: ClientMapItem): string {
  if (!client.hasActiveAlerts || !client.maxAlertSeverity) return SEVERITY_COLORS.none;
  return SEVERITY_COLORS[client.maxAlertSeverity as SeverityKey] ?? SEVERITY_COLORS.none;
}

function buildIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 42" width="30" height="42">
      <path d="M15 0C7.27 0 1 6.27 1 14c0 9.85 12.5 26.5 13 27.18a1.6 1.6 0 0 0 2.55 0C16.5 40.5 29 23.85 29 14 29 6.27 22.73 0 15 0Z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
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

// ── FitBounds helper ──────────────────────────────────────────────────────────
function FitBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) { map.setView(points[0], 10); return; }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48] });
  }, [points, map]);
  return null;
}

// ── Legend overlay ────────────────────────────────────────────────────────────
const LEGEND_ITEMS: { color: string; label: string }[] = [
  { color: SEVERITY_COLORS.critico,     label: 'Crítico' },
  { color: SEVERITY_COLORS.advertencia, label: 'Advertencia' },
  { color: SEVERITY_COLORS.informacion, label: 'Información' },
  { color: SEVERITY_COLORS.none,        label: 'Sin alertas' },
];

function Legend() {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] flex flex-col gap-3 rounded-[14px] bg-white/95 px-4 pb-4 pt-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
      <p className="font-sans text-sm font-medium text-[#0F172B]">Leyenda</p>
      <div className="flex flex-col gap-2">
        {LEGEND_ITEMS.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`h-4 w-4 shrink-0 rounded-full [background:var(--dot)] [[--dot:${color}]]`}
              style={{ background: color }}
            />
            <span className="font-sans text-sm text-[#314158]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hint pill ─────────────────────────────────────────────────────────────────
function HintPill() {
  return (
    <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-[rgba(15,23,43,0.9)] px-6 py-2.5">
      <p className="whitespace-nowrap font-sans text-sm text-white">
        Haz clic en los marcadores para ver el detalle de cada cliente
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export interface ClientMapProps {
  clients: ClientMapItem[];
  selectedClientId: number | null;
  onSelectClient: (farmerId: number) => void;
}

export function ClientMap({ clients, selectedClientId, onSelectClient }: ClientMapProps) {
  const markerRefs = useRef<Record<number, L.Marker>>({});

  const points = useMemo<Array<[number, number]>>(
    () => clients
      .filter((c) => c.latitude != null && c.longitude != null)
      .map((c) => [c.latitude!, c.longitude!]),
    [clients],
  );

  useEffect(() => {
    if (selectedClientId == null) return;
    markerRefs.current[selectedClientId]?.openPopup();
  }, [selectedClientId]);

  const fallback: [number, number] = [23.6345, -102.5528];

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#E2E8F0] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      data-testid="client-map"
    >
      <MapContainer
        center={points[0] ?? fallback}
        zoom={points.length > 0 ? 6 : 5}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />

        {clients
          .filter((c) => c.latitude != null && c.longitude != null)
          .map((client) => (
            <Marker
              key={client.farmerId}
              position={[client.latitude!, client.longitude!]}
              icon={buildIcon(markerColor(client))}
              ref={(ref) => {
                if (ref) markerRefs.current[client.farmerId] = ref;
                else delete markerRefs.current[client.farmerId];
              }}
              eventHandlers={{ click: () => onSelectClient(client.farmerId) }}
            >
              <Popup>
                <div className="font-sans">
                  <p className="text-sm font-semibold text-[#0F172A]">{client.name}</p>
                  {client.state && (
                    <p className="text-xs text-[#64748B]">{client.municipality ?? ''}{client.municipality && client.state ? ', ' : ''}{client.state}</p>
                  )}
                  <p className="mt-1 text-xs text-[#64748B]">
                    {client.parcelasCount} {client.parcelasCount === 1 ? 'parcela' : 'parcelas'} · {client.totalOrders} {client.totalOrders === 1 ? 'pedido' : 'pedidos'}
                  </p>
                  {client.hasActiveAlerts && (
                    <p className="mt-1 text-xs font-medium" style={{ color: markerColor(client) }}>
                      {client.activeAlertsCount} alerta{client.activeAlertsCount !== 1 ? 's' : ''} activa{client.activeAlertsCount !== 1 ? 's' : ''}
                    </p>
                  )}
                  <button
                    type="button"
                    className="mt-2 cursor-pointer text-xs font-semibold text-[#75C79E] hover:underline"
                    onClick={() => onSelectClient(client.farmerId)}
                  >
                    Ver detalle →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <HintPill />
      <Legend />
    </div>
  );
}

export default ClientMap;
