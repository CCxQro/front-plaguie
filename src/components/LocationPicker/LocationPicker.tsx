import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';

// Fix Leaflet's default icon paths when bundling with Vite (same as ClientMap).
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

export interface LocationPickerValue {
  latitude: number | null;
  longitude: number | null;
  stateName: string;
  municipalityName: string;
  localityName: string;
}

interface Props {
  value: LocationPickerValue;
  onChange?: (next: LocationPickerValue) => void;
  /** Detail/view mode: render the pin but disable picking and geocoding. */
  readOnly?: boolean;
}

/** Geographic centre of Mexico — used when no point is selected yet. */
const MEXICO_CENTER: [number, number] = [23.6345, -102.5528];

function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ReadField({ label, value, testid }: { label: string; value: string; testid: string }) {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#6A7282]">{label}</p>
      <p data-testid={testid} className="truncate text-sm text-[#101828]">
        {value || '—'}
      </p>
    </div>
  );
}

export function LocationPicker({ value, onChange, readOnly = false }: Props) {
  const geocode = useReverseGeocode();
  const hasPoint = value.latitude != null && value.longitude != null;
  const center: [number, number] = hasPoint
    ? [value.latitude as number, value.longitude as number]
    : MEXICO_CENTER;

  function handlePick(lat: number, lng: number) {
    if (readOnly || !onChange) return;
    // Coordinates are the source of truth — commit them immediately, then let
    // geocoding fill (or refine) the admin-level names asynchronously.
    onChange({ ...value, latitude: lat, longitude: lng });
    geocode.mutate(
      { lat, lng },
      {
        onSuccess: (geo) =>
          onChange({
            latitude: lat,
            longitude: lng,
            stateName: geo.stateName,
            municipalityName: geo.municipalityName,
            localityName: geo.localityName,
          }),
      },
    );
  }

  return (
    <div data-testid="location-picker" className="space-y-3">
      <div className="h-64 w-full overflow-hidden rounded-[10px] border border-[#D1D5DC]">
        <MapContainer
          center={center}
          zoom={hasPoint ? 12 : 5}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {readOnly ? null : <ClickCapture onPick={handlePick} />}
          {hasPoint ? (
            <Marker
              position={[value.latitude as number, value.longitude as number]}
              draggable={!readOnly}
              eventHandlers={
                readOnly
                  ? undefined
                  : {
                      dragend: (e) => {
                        const marker = e.target as L.Marker;
                        const { lat, lng } = marker.getLatLng();
                        handlePick(lat, lng);
                      },
                    }
              }
            />
          ) : null}
        </MapContainer>
      </div>

      {readOnly ? null : (
        <>
          <p className="text-xs text-[#6A7282]" data-testid="location-picker-hint">
            {geocode.isPending
              ? 'Buscando ubicación...'
              : hasPoint
                ? 'Arrastra el marcador o haz clic en el mapa para ajustar la ubicación.'
                : 'Haz clic en el mapa para seleccionar la ubicación.'}
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <ReadField label="Estado" value={value.stateName} testid="picker-state" />
            <ReadField label="Municipio" value={value.municipalityName} testid="picker-municipality" />
            <ReadField label="Localidad" value={value.localityName} testid="picker-locality" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-[#6A7282]">Coordenadas</span>
            <span data-testid="picker-coords" className="font-mono text-xs text-[#4A5565]">
              {hasPoint
                ? `${(value.latitude as number).toFixed(5)}, ${(value.longitude as number).toFixed(5)}`
                : '—'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default LocationPicker;
