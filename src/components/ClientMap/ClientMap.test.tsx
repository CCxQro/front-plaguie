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
  default: {
    icon: vi.fn(() => ({})),
    divIcon: vi.fn(() => ({})),
    latLngBounds: vi.fn(() => ({})),
    Marker: { prototype: { options: {} } },
  },
}));
vi.mock('leaflet/dist/leaflet.css', () => ({}));
vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: 'icon2x' }));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({ default: 'icon' }));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({ default: 'shadow' }));

import { ClientMap } from './ClientMap';

const clients = [
  { farmerId: 1, name: 'Cliente Crítico', latitude: 20, longitude: -100, state: 'jalisco', municipality: 'zapopan', parcelasCount: 2, totalOrders: 3, hasActiveAlerts: true, maxAlertSeverity: 'critico', activeAlertsCount: 2 },
  { farmerId: 2, name: 'Cliente Sin Alertas', latitude: 21, longitude: -101, state: null, municipality: null, parcelasCount: 1, totalOrders: 1, hasActiveAlerts: false, maxAlertSeverity: null, activeAlertsCount: 0 },
  { farmerId: 3, name: 'Cliente Aviso', latitude: 22, longitude: -102, state: 'sonora', municipality: null, parcelasCount: 1, totalOrders: 0, hasActiveAlerts: true, maxAlertSeverity: 'advertencia', activeAlertsCount: 1 },
  { farmerId: 4, name: 'Sin Coordenadas', latitude: null, longitude: null, state: null, municipality: null, parcelasCount: 0, totalOrders: 0, hasActiveAlerts: false, maxAlertSeverity: null, activeAlertsCount: 0 },
];

describe('ClientMap', () => {
  it('renders a marker per geolocated client and the legend', () => {
    render(<ClientMap clients={clients as never} selectedClientId={null} onSelectClient={vi.fn()} />);
    // client 4 has no coordinates -> filtered out
    expect(screen.getAllByTestId('marker')).toHaveLength(3);
    expect(screen.getByText('Cliente Crítico')).toBeInTheDocument();
    expect(screen.getByText('Leyenda')).toBeInTheDocument();
  });

  it('shows parcela/order counts and active alerts in the popup', () => {
    render(<ClientMap clients={clients as never} selectedClientId={null} onSelectClient={vi.fn()} />);
    expect(screen.getByText(/2 parcelas · 3 pedidos/)).toBeInTheDocument();
    expect(screen.getByText(/2 alertas activas/)).toBeInTheDocument();
    expect(screen.getByText(/1 parcela · 0 pedidos/)).toBeInTheDocument();
  });

  it('selects a client from the "Ver detalle" button', () => {
    const onSelectClient = vi.fn();
    render(<ClientMap clients={clients as never} selectedClientId={null} onSelectClient={onSelectClient} />);
    fireEvent.click(screen.getAllByRole('button', { name: /Ver detalle/ })[0]);
    expect(onSelectClient).toHaveBeenCalledWith(1);
  });

  it('selects a client from the marker click', () => {
    const onSelectClient = vi.fn();
    render(<ClientMap clients={clients as never} selectedClientId={null} onSelectClient={onSelectClient} />);
    fireEvent.click(screen.getAllByTestId('marker')[2]);
    expect(onSelectClient).toHaveBeenCalledWith(3);
  });

  it('renders an empty map without geolocated clients', () => {
    render(<ClientMap clients={[clients[3]] as never} selectedClientId={null} onSelectClient={vi.fn()} />);
    expect(screen.queryAllByTestId('marker')).toHaveLength(0);
  });
});
