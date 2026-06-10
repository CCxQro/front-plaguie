import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../../services/alerts/nearbyAlertsService', () => ({
  getNearbyAlerts: vi.fn(),
}));

import { getNearbyAlerts } from '../../services/alerts/nearbyAlertsService';
import type { EarlyAlert } from '../../types/EarlyAlert';
import AlertasCercanasPanel from './AlertasCercanasPanel';

const mockGetNearby = vi.mocked(getNearbyAlerts);

function alert(partial: Partial<EarlyAlert> & { alertaId: number }): EarlyAlert {
  return {
    titulo: 'Alerta',
    descripcion: 'desc',
    ubicacionId: 1,
    stateId: 1,
    stateName: 'Jalisco',
    latitude: 20.7,
    longitude: -103.3,
    distanceKm: 12.4,
    tipoPlaga: 'Pulgón',
    hectareas: 5,
    severidad: 'critico',
    reportedByUserId: 6,
    createdAt: '2026-06-01T10:00:00',
    statusId: 1,
    statusName: 'Aceptado',
    validatedByUserId: 1,
    validatedAt: '2026-06-01T12:00:00',
    ...partial,
  };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('AlertasCercanasPanel', () => {
  beforeEach(() => {
    mockGetNearby.mockReset();
    mockGetNearby.mockResolvedValue([]);
  });

  it('renders the panel and requests alerts with the default 100 km radius', async () => {
    render(<AlertasCercanasPanel />, { wrapper: createWrapper() });

    expect(screen.getByTestId('alertas-cercanas-panel')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockGetNearby).toHaveBeenCalledWith(100);
    });
    await waitFor(() => {
      expect(screen.getByTestId('alerts-empty')).toBeInTheDocument();
    });
  });

  it('shows alerts with distance and opens the detail modal on click', async () => {
    mockGetNearby.mockResolvedValue([
      alert({ alertaId: 10, titulo: 'Brote de pulgón', distanceKm: 52.3 }),
    ]);

    render(<AlertasCercanasPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('early-alert-row')).toHaveTextContent('Brote de pulgón');
    });
    expect(screen.getByTestId('alert-distance')).toHaveTextContent('52.3 km');

    await userEvent.click(screen.getByTestId('early-alert-row'));

    await waitFor(() => {
      expect(screen.getByTestId('alert-detail-modal')).toBeInTheDocument();
    });
  });

  it('re-fetches with the selected radius when changed', async () => {
    render(<AlertasCercanasPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockGetNearby).toHaveBeenCalledWith(100);
    });

    await userEvent.click(screen.getByTestId('radius-option-200'));

    await waitFor(() => {
      expect(mockGetNearby).toHaveBeenCalledWith(200);
    });
  });

  it('filters by severity', async () => {
    mockGetNearby.mockResolvedValue([
      alert({ alertaId: 1, titulo: 'Crítica uno', severidad: 'critico' }),
      alert({ alertaId: 2, titulo: 'Informativa dos', severidad: 'informacion' }),
    ]);

    render(<AlertasCercanasPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getAllByTestId('early-alert-row')).toHaveLength(2);
    });

    await userEvent.click(screen.getByTestId('severity-chip-critico'));

    await waitFor(() => {
      expect(screen.getAllByTestId('early-alert-row')).toHaveLength(1);
    });
    expect(screen.getByText('Crítica uno')).toBeInTheDocument();
  });

  it('shows a no-location message when the backend reports no configured location', async () => {
    mockGetNearby.mockRejectedValue(new Error('No tienes una ubicación configurada'));

    render(<AlertasCercanasPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('alerts-no-location')).toBeInTheDocument();
    });
  });
});
