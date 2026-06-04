import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlagueAlertsModal } from './PlagueAlertsModal';
import { useNearbyAlerts } from '../../hooks/useNearbyAlerts';

vi.mock('../../hooks/useNearbyAlerts');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('PlagueAlertsModal', () => {
  beforeEach(() => {
    vi.mocked(useNearbyAlerts).mockReturnValue({
      data: [
        {
          alertaId: 1,
          titulo: 'Test Plaga',
          severidad: 'critico',
          stateName: 'Ciudad de México',
          distanceKm: 12.3,
          createdAt: new Date().toISOString(),
          tipoPlaga: 'Langosta',
          hectareas: 10,
        } as unknown as import('../../types/EarlyAlert').EarlyAlert
      ],
      isLoading: false,
      error: null,
    } as unknown as import('@tanstack/react-query').UseQueryResult<import('../../types/EarlyAlert').EarlyAlert[], Error>);
  });

  it('renders nothing when closed', () => {
    render(<PlagueAlertsModal isOpen={false} onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.queryByTestId('plague-alerts-modal')).not.toBeInTheDocument();
  });

  it('renders the modal when open', () => {
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByTestId('plague-alerts-modal')).toBeInTheDocument();
  });

  it('shows modal title when open', () => {
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByText('Alertas de Plagas Detectadas')).toBeInTheDocument();
  });

  it('loads and displays alerts', async () => {
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(await screen.findByText('Test Plaga')).toBeInTheDocument();
    expect(await screen.findByText('Ciudad de México (a 12.3 km)')).toBeInTheDocument();
    expect(await screen.findByText('10 hectáreas')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<PlagueAlertsModal isOpen={true} onClose={onClose} />, { wrapper: createWrapper() });
    await userEvent.click(screen.getByLabelText('Cerrar modal'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onVerMapaCompleto when footer button is clicked', async () => {
    const onVerMapaCompleto = vi.fn();
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} onVerMapaCompleto={onVerMapaCompleto} />, { wrapper: createWrapper() });
    await userEvent.click(screen.getByText('Ver Mapa Completo'));
    expect(onVerMapaCompleto).toHaveBeenCalledOnce();
  });
});
