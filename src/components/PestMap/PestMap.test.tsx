import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: ({
    children,
    eventHandlers,
  }: {
    children: React.ReactNode;
    eventHandlers?: { click?: () => void };
  }) => (
    <div data-testid="marker" onClick={eventHandlers?.click}>
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useMap: () => ({ setView: vi.fn(), fitBounds: vi.fn() }),
}));
vi.mock('leaflet', () => ({
  default: { divIcon: vi.fn(() => ({})), latLngBounds: vi.fn(() => ({})) },
}));
vi.mock('leaflet/dist/leaflet.css', () => ({}));

import { PestMap } from './PestMap';

const zones = [
  { key: 'z1', latitude: 20, longitude: -100, municipio: 'Zapopan', estado: 'Jalisco', totalObservaciones: 10, plagasDistintas: 3, nivelRiesgo: 'Alto' },
  { key: 'z2', latitude: 21, longitude: -101, municipio: null, estado: null, totalObservaciones: 1, plagasDistintas: 1, nivelRiesgo: 'Bajo' },
  { key: 'z3', latitude: 22, longitude: -102, municipio: 'Hermosillo', estado: 'Sonora', totalObservaciones: 2, plagasDistintas: 2, nivelRiesgo: 'Medio' },
];

describe('PestMap', () => {
  it('renders a marker per zone, the legend and popup details', () => {
    render(<PestMap zones={zones as never} onSelectZone={vi.fn()} />);
    expect(screen.getAllByTestId('marker')).toHaveLength(3);
    expect(screen.getByText('Nivel de riesgo')).toBeInTheDocument();
    expect(screen.getByText('Zapopan, Jalisco')).toBeInTheDocument();
    expect(screen.getByText(/10 incidencias · 3 plagas · riesgo alto/)).toBeInTheDocument();
    expect(screen.getByText(/1 incidencia · 1 plaga · riesgo bajo/)).toBeInTheDocument();
  });

  it('selects a zone from the detail button and the marker', () => {
    const onSelectZone = vi.fn();
    render(<PestMap zones={zones as never} onSelectZone={onSelectZone} />);
    fireEvent.click(screen.getAllByRole('button', { name: /Ver detalle/ })[0]);
    expect(onSelectZone).toHaveBeenCalledWith('z1');
    fireEvent.click(screen.getAllByTestId('marker')[2]);
    expect(onSelectZone).toHaveBeenCalledWith('z3');
  });

  it('accepts an explicit center', () => {
    render(<PestMap zones={zones as never} onSelectZone={vi.fn()} center={[19.4, -99.1]} />);
    expect(screen.getByTestId('pest-map')).toBeInTheDocument();
  });

  it('renders with no zones', () => {
    render(<PestMap zones={[] as never} onSelectZone={vi.fn()} />);
    expect(screen.queryAllByTestId('marker')).toHaveLength(0);
  });
});
