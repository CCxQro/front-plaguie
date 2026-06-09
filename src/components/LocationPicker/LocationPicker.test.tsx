import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createQueryWrapper } from '../../test/queryWrapper';

// Capture the click handler registered via useMapEvents so tests can fire a map click.
let clickHandler: ((e: { latlng: { lat: number; lng: number } }) => void) | undefined;

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: ({ eventHandlers }: { eventHandlers?: { dragend?: (e: unknown) => void } }) => (
    <div
      data-testid="marker"
      onClick={() =>
        eventHandlers?.dragend?.({ target: { getLatLng: () => ({ lat: 31, lng: -110 }) } })
      }
    />
  ),
  useMapEvents: (handlers: { click?: (e: { latlng: { lat: number; lng: number } }) => void }) => {
    clickHandler = handlers.click;
    return {};
  },
}));

vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(() => ({})),
    Marker: { prototype: { options: {} } },
  },
}));
vi.mock('leaflet/dist/leaflet.css', () => ({}));
vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: 'icon2x' }));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({ default: 'icon' }));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({ default: 'shadow' }));

vi.mock('../../services/geocoding/reverseGeocodeService', () => ({ reverseGeocode: vi.fn() }));

import { reverseGeocode } from '../../services/geocoding/reverseGeocodeService';
import { LocationPicker } from './LocationPicker';

const mockGeocode = vi.mocked(reverseGeocode);

const EMPTY = {
  latitude: null,
  longitude: null,
  stateName: '',
  municipalityName: '',
  localityName: '',
};

beforeEach(() => {
  vi.clearAllMocks();
  clickHandler = undefined;
});

describe('LocationPicker', () => {
  it('prompts to pick when no point is selected', () => {
    render(<LocationPicker value={EMPTY} onChange={vi.fn()} />, { wrapper: createQueryWrapper() });
    expect(screen.getByTestId('location-picker-hint')).toHaveTextContent(/Haz clic en el mapa/i);
    expect(screen.getByTestId('picker-coords')).toHaveTextContent('—');
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });

  it('shows the derived fields and coordinates for a selected point', () => {
    render(
      <LocationPicker
        value={{
          latitude: 25.6866,
          longitude: -100.3161,
          stateName: 'Nuevo León',
          municipalityName: 'Monterrey',
          localityName: 'Centro',
        }}
        onChange={vi.fn()}
      />,
      { wrapper: createQueryWrapper() },
    );
    expect(screen.getByTestId('picker-state')).toHaveTextContent('Nuevo León');
    expect(screen.getByTestId('picker-municipality')).toHaveTextContent('Monterrey');
    expect(screen.getByTestId('picker-locality')).toHaveTextContent('Centro');
    expect(screen.getByTestId('picker-coords')).toHaveTextContent('25.68660, -100.31610');
  });

  it('commits coordinates immediately then fills names from geocoding on map click', async () => {
    mockGeocode.mockResolvedValue({
      stateName: 'Sonora',
      municipalityName: 'Hermosillo',
      localityName: 'Centro',
      displayName: '',
    });
    const onChange = vi.fn();
    render(<LocationPicker value={EMPTY} onChange={onChange} />, { wrapper: createQueryWrapper() });

    act(() => clickHandler!({ latlng: { lat: 29.1, lng: -110.9 } }));

    // Coordinates are committed synchronously (source of truth).
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 29.1, longitude: -110.9 }),
    );
    // Names arrive once geocoding resolves.
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          latitude: 29.1,
          longitude: -110.9,
          stateName: 'Sonora',
          municipalityName: 'Hermosillo',
          localityName: 'Centro',
        }),
      ),
    );
    expect(mockGeocode).toHaveBeenCalledWith(29.1, -110.9);
  });

  it('re-geocodes when the marker is dragged', async () => {
    mockGeocode.mockResolvedValue({
      stateName: 'Chihuahua',
      municipalityName: 'Juárez',
      localityName: 'Centro',
      displayName: '',
    });
    const onChange = vi.fn();
    render(
      <LocationPicker
        value={{ latitude: 20, longitude: -100, stateName: 'A', municipalityName: 'B', localityName: 'C' }}
        onChange={onChange}
      />,
      { wrapper: createQueryWrapper() },
    );

    fireEvent.click(screen.getByTestId('marker')); // mock marker fires dragend at 31,-110
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ latitude: 31, longitude: -110 }));
    await waitFor(() => expect(mockGeocode).toHaveBeenCalledWith(31, -110));
  });

  it('renders read-only without picking affordances or geocoding', () => {
    const onChange = vi.fn();
    render(
      <LocationPicker
        readOnly
        value={{ latitude: 20, longitude: -100, stateName: 'Jalisco', municipalityName: 'X', localityName: 'Y' }}
        onChange={onChange}
      />,
      { wrapper: createQueryWrapper() },
    );
    expect(screen.getByTestId('location-picker')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toBeInTheDocument();
    // No hint, no editable-side fields, no click capture in read-only mode.
    expect(screen.queryByTestId('location-picker-hint')).not.toBeInTheDocument();
    expect(screen.queryByTestId('picker-state')).not.toBeInTheDocument();
    expect(clickHandler).toBeUndefined();
    expect(mockGeocode).not.toHaveBeenCalled();
  });
});
