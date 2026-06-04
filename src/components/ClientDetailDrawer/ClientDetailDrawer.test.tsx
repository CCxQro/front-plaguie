import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientDetailDrawer } from './ClientDetailDrawer';
import type { ClientDetail } from '../../services/sales/salesClientsService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const sampleClient: ClientDetail = {
  farmerId: 7,
  userId: 7,
  name: 'Rancho Las Flores',
  email: 'rancho@example.com',
  isActive: true,
  latitude: 19.4326,
  longitude: -99.1332,
  state: 'CDMX',
  municipality: 'Cuauhtémoc',
  locality: null,
  property: null,
  parcelas: [
    {
      parcelaId: 1,
      nombreParcela: 'Parcela Norte',
      tamanoHectareas: 5.2,
      tipoCultivo: 'Maíz',
      estadoParcela: 'Activa',
      sistemaRiego: 'Goteo',
      phSuelo: 6.5,
      fechaSiembra: '2025-01-10',
      fechaCosecha: '2025-08-15',
    },
    {
      parcelaId: 2,
      nombreParcela: 'Parcela Sur',
      tamanoHectareas: 3.0,
      tipoCultivo: 'Trigo',
      estadoParcela: 'En reposo',
      sistemaRiego: null,
      phSuelo: null,
      fechaSiembra: null,
      fechaCosecha: null,
    },
  ],
  alertas: [
    {
      alertaId: 10,
      titulo: 'Plaga detectada en zona norte',
      tipoPlaga: 'Chapulín',
      severidad: 'critico',
      hectareas: 2.5,
      createdAt: '2025-05-01T10:00:00',
      statusId: 1,
      statusName: 'Activa',
      isActive: true,
    },
  ],
  orderSummary: {
    totalOrders: 2,
    totalAmount: 1234.5,
    lastOrderDate: '2025-04-15T10:00:00',
    lastOrderStatus: 'Entregado',
  },
};

describe('ClientDetailDrawer', () => {
  it('renders nothing when client is null and not loading', () => {
    const { container } = render(
      <ClientDetailDrawer client={null} onClose={() => {}} />,
      { wrapper: createWrapper() }
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the drawer when a client is provided', () => {
    render(<ClientDetailDrawer client={sampleClient} onClose={() => {}} />, { wrapper: createWrapper() });
    expect(screen.getByTestId('client-detail-drawer')).toBeInTheDocument();
    expect(screen.getByText('Rancho Las Flores')).toBeInTheDocument();
  });

  it('shows order summary metrics', () => {
    render(<ClientDetailDrawer client={sampleClient} onClose={() => {}} />, { wrapper: createWrapper() });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('lists all parcelas', () => {
    render(<ClientDetailDrawer client={sampleClient} onClose={() => {}} />, { wrapper: createWrapper() });
    const cards = screen.getAllByTestId('client-detail-parcela');
    expect(cards).toHaveLength(2);
  });

  it('lists all alertas', () => {
    render(<ClientDetailDrawer client={sampleClient} onClose={() => {}} />, { wrapper: createWrapper() });
    const items = screen.getAllByTestId('client-detail-alerta');
    expect(items).toHaveLength(1);
    expect(screen.getByText('Plaga detectada en zona norte')).toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(<ClientDetailDrawer client={sampleClient} onClose={onClose} />, { wrapper: createWrapper() });
    fireEvent.click(screen.getByTestId('client-detail-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape', () => {
    const onClose = vi.fn();
    render(<ClientDetailDrawer client={sampleClient} onClose={onClose} />, { wrapper: createWrapper() });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows empty parcelas message when there are none', () => {
    const noData: ClientDetail = { ...sampleClient, parcelas: [], alertas: [] };
    render(<ClientDetailDrawer client={noData} onClose={() => {}} />, { wrapper: createWrapper() });
    expect(screen.getByText(/sin parcelas registradas/i)).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true and client is null', () => {
    render(<ClientDetailDrawer client={null} isLoading onClose={() => {}} />, { wrapper: createWrapper() });
    expect(screen.getByTestId('client-detail-drawer')).toBeInTheDocument();
  });

  it('displays severity badge for alertas', () => {
    render(<ClientDetailDrawer client={sampleClient} onClose={() => {}} />, { wrapper: createWrapper() });
    expect(screen.getByText('Crítico')).toBeInTheDocument();
  });

  it('opens ClienteParcelaModal when clicking Ver Estado button', () => {
    render(<ClientDetailDrawer client={sampleClient} onClose={() => {}} />, { wrapper: createWrapper() });
    const button = screen.getByTestId('btn-ver-estado-parcelas');
    fireEvent.click(button);
    expect(screen.getByTestId('cliente-parcela-modal')).toBeInTheDocument();
  });
});
