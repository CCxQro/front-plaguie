import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../services/regions/regionsService', () => ({
  getStates: vi.fn(),
  getRegionesInteres: vi.fn(),
  addRegionInteres: vi.fn(),
  deleteRegionInteres: vi.fn(),
  getEarlyAlerts: vi.fn(),
}));

import {
  getStates,
  getRegionesInteres,
  addRegionInteres,
  deleteRegionInteres,
  getEarlyAlerts,
} from '../services/regions/regionsService';
import type { EarlyAlert } from '../types/RegionInteres';
import RegionesInteresPanel from './RegionesInteresPanel';

const mockGetStates = vi.mocked(getStates);
const mockGetRegiones = vi.mocked(getRegionesInteres);
const mockAdd = vi.mocked(addRegionInteres);
const mockDelete = vi.mocked(deleteRegionInteres);
const mockGetAlerts = vi.mocked(getEarlyAlerts);

function alert(partial: Partial<EarlyAlert> & { alertaId: number }): EarlyAlert {
  return {
    titulo: 'Alerta',
    descripcion: 'desc',
    ubicacionId: 1,
    stateId: 2,
    stateName: 'Michoacán',
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

describe('RegionesInteresPanel', () => {
  beforeEach(() => {
    mockGetStates.mockReset();
    mockGetRegiones.mockReset();
    mockAdd.mockReset();
    mockDelete.mockReset();
    mockGetAlerts.mockReset();

    mockGetStates.mockResolvedValue([
      { stateId: 5, name: 'Jalisco' },
      { stateId: 2, name: 'Michoacán' },
    ]);
    mockGetRegiones.mockResolvedValue([]);
    mockGetAlerts.mockResolvedValue([]);
  });

  it('renders the panel and shows alerts even with no regions configured', async () => {
    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    expect(screen.getByTestId('regiones-interes-panel')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('regiones-empty')).toBeInTheDocument();
    });
    // Alerts section is accessible regardless of regions; with no data it shows empty state.
    await waitFor(() => {
      expect(screen.getByTestId('alerts-empty')).toBeInTheDocument();
    });
    expect(screen.getByTestId('alert-region-filter')).toBeInTheDocument();
  });

  it('adds a region when a state is selected and the button is clicked', async () => {
    mockAdd.mockResolvedValueOnce({
      regionInteresId: 1,
      stateId: 5,
      stateName: 'Jalisco',
      createdAt: '2026-06-03T12:00:00',
    });

    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Jalisco' })).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByTestId('state-select'), '5');
    await userEvent.click(screen.getByTestId('add-region-button'));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith(5);
    });
  });

  it('shows all early alerts and opens the detail modal on click', async () => {
    mockGetAlerts.mockResolvedValue([
      alert({ alertaId: 10, titulo: 'Brote de pulgón', stateId: 2, stateName: 'Michoacán' }),
    ]);

    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('early-alert-row')).toHaveTextContent('Brote de pulgón');
    });

    await userEvent.click(screen.getByTestId('early-alert-row'));

    await waitFor(() => {
      expect(screen.getByTestId('alert-detail-modal')).toBeInTheDocument();
    });
    expect(screen.getByTestId('alert-detail-modal')).toHaveTextContent('Michoacán');
  });

  it('filters alerts by severity', async () => {
    mockGetAlerts.mockResolvedValue([
      alert({ alertaId: 1, titulo: 'Crítica uno', severidad: 'critico' }),
      alert({ alertaId: 2, titulo: 'Informativa dos', severidad: 'informacion' }),
    ]);

    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getAllByTestId('early-alert-row')).toHaveLength(2);
    });

    await userEvent.click(screen.getByTestId('severity-chip-critico'));

    await waitFor(() => {
      expect(screen.getAllByTestId('early-alert-row')).toHaveLength(1);
    });
    expect(screen.getByText('Crítica uno')).toBeInTheDocument();
  });

  it('deletes a region when its remove button is clicked', async () => {
    mockGetRegiones.mockResolvedValue([
      { regionInteresId: 1, stateId: 2, stateName: 'Michoacán', createdAt: null },
    ]);
    mockDelete.mockResolvedValueOnce(undefined);

    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('delete-region-button')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('delete-region-button'));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(1);
    });
  });
});
