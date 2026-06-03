import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PestZone, RiskLevel } from '../../types/PestMap';

const RISK_COLORS: Record<RiskLevel, string> = {
  Alto: '#DC2626',
  Medio: '#F59E0B',
  Bajo: '#16A34A',
};

const LEGEND_ITEMS: { level: RiskLevel; label: string }[] = [
  { level: 'Alto', label: 'Alto (3+ incidencias)' },
  { level: 'Medio', label: 'Medio (2 incidencias)' },
  { level: 'Bajo', label: 'Bajo (1 incidencia)' },
];

/** Marker diameter (px) grows with the number of observations (capped). */
function markerSize(total: number): number {
  return Math.min(34 + total * 6, 60);
}

/** A circular zone marker showing the incidence count, sized + colored by risk. */
function buildZoneIcon(zone: PestZone): L.DivIcon {
  const size = markerSize(zone.totalObservaciones);
  const color = RISK_COLORS[zone.nivelRiesgo];
  const fontSize = size >= 48 ? 16 : 14;
  const html = `
    <div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:${color};color:#FFFFFF;
      border:3px solid #FFFFFF;border-radius:9999px;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      font-family:Inter,sans-serif;font-weight:700;font-size:${fontSize}px;">
      ${zone.totalObservaciones}
    </div>`.trim();
  return L.divIcon({
    html,
    className: 'pest-zone-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

/**
 * Sets the map's initial view once: centered on the seller's location when
 * available, otherwise fitted to all zones. Runs a single time so the user can
 * pan/zoom freely afterwards (filters won't snap the view back).
 */
function InitialView({
  center,
  points,
}: {
  center: [number, number] | null | undefined;
  points: Array<[number, number]>;
}) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    if (center) {
      map.setView(center, 9);
      done.current = true;
    } else if (points.length > 0) {
      if (points.length === 1) map.setView(points[0], 8);
      else map.fitBounds(L.latLngBounds(points), { padding: [48, 48] });
      done.current = true;
    }
  }, [center, points, map]);
  return null;
}

function Legend() {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] flex flex-col gap-3 rounded-[14px] bg-white/95 px-4 pb-4 pt-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
      <p className="font-sans text-sm font-medium text-[#0F172B]">Nivel de riesgo</p>
      <div className="flex flex-col gap-2">
        {LEGEND_ITEMS.map(({ level, label }) => (
          <div key={level} className="flex items-center gap-2">
            <span
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ background: RISK_COLORS[level] }}
            />
            <span className="font-sans text-sm text-[#314158]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface PestMapProps {
  zones: PestZone[];
  onSelectZone: (zoneKey: string) => void;
  /** Initial map center (seller's location). Falls back to fitting all zones. */
  center?: [number, number] | null;
}

export function PestMap({ zones, onSelectZone, center }: PestMapProps) {
  const points = useMemo<Array<[number, number]>>(
    () => zones.map((z) => [z.latitude, z.longitude]),
    [zones]
  );

  const fallback: [number, number] = [23.6345, -102.5528]; // Mexico centroid

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#E2E8F0] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      data-testid="pest-map"
    >
      <MapContainer
        center={center ?? points[0] ?? fallback}
        zoom={center ? 9 : points.length > 0 ? 6 : 5}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InitialView center={center} points={points} />

        {zones.map((zone) => (
          <Marker
            key={zone.key}
            position={[zone.latitude, zone.longitude]}
            icon={buildZoneIcon(zone)}
            eventHandlers={{ click: () => onSelectZone(zone.key) }}
          >
            <Popup>
              <div className="font-sans">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {zone.municipio ?? 'Zona'}{zone.estado ? `, ${zone.estado}` : ''}
                </p>
                <p className="mt-1 text-xs text-[#64748B]">
                  {zone.totalObservaciones} incidencia{zone.totalObservaciones !== 1 ? 's' : ''} ·{' '}
                  {zone.plagasDistintas} plaga{zone.plagasDistintas !== 1 ? 's' : ''} · riesgo{' '}
                  {zone.nivelRiesgo.toLowerCase()}
                </p>
                <button
                  type="button"
                  className="mt-2 cursor-pointer text-xs font-semibold text-[#155DFC] hover:underline"
                  onClick={() => onSelectZone(zone.key)}
                >
                  Ver detalle →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Legend />
    </div>
  );
}

export default PestMap;
